import type { APIRoute } from 'astro';

const apiKey = import.meta.env.LASTFM_API_KEY;
const username = import.meta.env.LASTFM_USERNAME;

interface LastFmTrackData {
    name: string;
    artist: { '#text': string };
    image: { size: string; '#text': string }[];
    url: string;
    '@attr'?: { nowplaying?: string };
}

interface ApiResponse {
    track: {
        name: string;
        artist: string;
        albumArt: string | null;
        url: string;
        nowPlaying: boolean;
    } | null;
    statusText: string | null;
}

export const GET: APIRoute = async ({}) => {
    if (!apiKey || !username) {
        console.error("Last.fm API key or username missing in environment variables.");
        return new Response(JSON.stringify({ track: null, statusText: "Server Misconfiguration" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const endpoint = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`;

    try {
        const res = await fetch(endpoint);
        if (!res.ok) {
            throw new Error(`Last.fm API error: ${res.statusText} (Status: ${res.status})`);
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
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // No tracks found or empty response
            return new Response(JSON.stringify({ track: null, statusText: "No Recent Tracks" }), {
                status: 200, // Still a successful API call, just no data
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error("Failed to fetch Last.fm data:", error);
        return new Response(JSON.stringify({ track: null, statusText: "API Fetch Error" }), {
            status: 503, // Service Unavailable might be appropriate
            headers: { 'Content-Type': 'application/json' },
        });
    }
};