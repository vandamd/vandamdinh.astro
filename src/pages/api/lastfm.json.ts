import type { APIRoute } from 'astro';

export const prerender = false;

interface LastFmTrackData {
    name: string;
    artist: { '#text': string };
    image: { size: string; '#text': string }[];
    url: string;
    '@attr'?: { nowplaying?: string };
    date?: { uts: string; '#text': string };
}

const cacheHeaders = {
    'Cache-Control': 'no-store, max-age=0, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'CDN-Cache-Control': 'no-store',
    'Content-Type': 'application/json',
};

// Helper function to format time difference
function formatTimeAgo(uts: string): string {
    const timestamp = parseInt(uts, 10);
    if (isNaN(timestamp)) {
        return 'Last Played'; // Fallback if timestamp is invalid
    }

    const now = Date.now() / 1000; // Current time in seconds
    const diffSeconds = Math.floor(now - timestamp);

    if (diffSeconds < 0) {
         // Handle potential clock skew or future timestamps gracefully
         return 'Just Now';
     }

    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
        return `${diffDays}D AGO`;
    } else if (diffHours > 0) {
        return `${diffHours}H AGO`;
    } else {
        return `${diffMinutes}M AGO`;
    }
}

export const GET: APIRoute = async (context) => {
    const apiKey = context.locals.runtime?.env?.LASTFM_API_KEY;
    const username = context.locals.runtime?.env?.LASTFM_USERNAME;

    if (!apiKey || !username) {
        return new Response(JSON.stringify({ track: null, statusText: "Server Misconfiguration" }), {
            status: 500,
            headers: cacheHeaders,
        });
    }

    const endpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

    try {
        const res = await fetch(endpoint);

        if (!res.ok) {
             let errorMsg = `Last.fm API error: ${res.statusText} (Status: ${res.status})`;
             try {
                 const errorData = await res.json();
                 if (errorData && errorData.message) {
                     errorMsg = `Last.fm API Error: ${errorData.message} (Status: ${res.status})`;
                 }
             } catch (parseError) { /* Ignore */ }
            console.error(errorMsg);
            return new Response(JSON.stringify({ track: null, statusText: "API Error" }), {
                status: res.status,
                headers: cacheHeaders,
            });
        }

        const data = await res.json();

        if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
            const trackData: LastFmTrackData = data.recenttracks.track[0];
            const albumArt = trackData.image.find((img) => img.size === 'medium');
            const isNowPlaying = trackData['@attr']?.nowplaying === 'true';

            const trackResult = {
                name: trackData.name,
                artist: trackData.artist['#text'],
                albumArt: albumArt ? albumArt['#text'] : null,
                url: trackData.url,
                nowPlaying: isNowPlaying,
            };

            let statusText: string;
            if (isNowPlaying) {
                statusText = 'Now Playing';
            } else if (trackData.date?.uts) {
                statusText = formatTimeAgo(trackData.date.uts);
            } else {
                statusText = 'Last Played'; // Fallback if date is missing
            }

            return new Response(JSON.stringify({ track: trackResult, statusText: statusText }), {
                status: 200,
                headers: cacheHeaders,
            });
        } else {
             let statusMessage = data.message || "No Recent Tracks";
             if (data.error) {
                 statusMessage = `API Error ${data.error}: ${data.message}`;
             }
             console.log(`Last.fm response: ${statusMessage}`);
             return new Response(JSON.stringify({ track: null, statusText: statusMessage }), {
                 status: 200,
                 headers: cacheHeaders,
             });
        }
    } catch (error: any) {
        console.error("Failed to fetch Last.fm data:", error);
        return new Response(JSON.stringify({ track: null, statusText: "API Fetch Error" }), {
            status: 503,
            headers: cacheHeaders,
        });
    }
};
