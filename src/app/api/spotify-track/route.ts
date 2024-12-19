import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');

  if (!ids) {
    return NextResponse.json({ error: 'No track IDs provided' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/tracks?ids=${ids}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tracks from Spotify');
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}
