import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const accessToken = request.cookies.get('spotify_access_token')?.value;

        if (!accessToken) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching Spotify profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
} 