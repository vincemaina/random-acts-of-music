import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('spotify_access_token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Spotify API error:', response.status, errorText);
            return NextResponse.json(
                { error: `Spotify API error: ${response.status}` }, 
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        return NextResponse.json({ error: 'Failed to fetch top tracks' }, { status: 500 });
    }
}
