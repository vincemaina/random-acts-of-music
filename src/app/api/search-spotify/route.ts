import { NextResponse } from 'next/server';
import { getSpotifyAccessToken } from '@/lib/spotify'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query) {
            return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
        }

        const accessToken = await getSpotifyAccessToken();

        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Spotify API');
        }

        const data = await response.json();
        return NextResponse.json(data.tracks);
    } catch (error) {
        console.error('Spotify search error:', error);
        return NextResponse.json({ error: 'Failed to search tracks' }, { status: 500 });
    }
}
