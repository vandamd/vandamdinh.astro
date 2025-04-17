import type { APIRoute } from 'astro';

export const prerender = false;

// Access runtime env vars via context.locals.runtime.env with Cloudflare adapter
// const apiKey = import.meta.env.LASTFM_API_KEY;
// const username = import.meta.env.PUBLIC_LASTFM_USERNAME || import.meta.env.LASTFM_USERNAME;

interface LastFmTrackData {
    name: string;
    artist: { '#text': string };
    image: { size: string; '#text': string }[];
    url: string;
    '@attr'?: { nowplaying?: string };
}

const cacheHeaders = {
    'Cache-Control': 'no-store, max-age=0, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'CDN-Cache-Control': 'no-store',
    'Content-Type': 'application/json',
};

export const GET: APIRoute = async (context) => {
    // Get runtime environment variables from the context provided by the adapter
    const apiKey = context.locals.runtime?.env?.LASTFM_API_KEY;
    // Check both possible names for username, prioritizing PUBLIC_
    const username = context.locals.runtime?.env?.LASTFM_USERNAME;

    if (!apiKey || !username) {
        console.error("Last.fm API key or username missing in server environment variables (checked context.locals.runtime.env).");
        // Log available keys for debugging (DO NOT DEPLOY THIS LOG IN PRODUCTION if sensitive keys exist)
        // console.log("Available runtime env keys:", Object.keys(context.locals.runtime?.env || {}));
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
            const statusText = isNowPlaying ? 'Now Playing' : 'Last Played';

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
