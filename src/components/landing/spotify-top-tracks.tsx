'use client';

import { useEffect, useState } from 'react';

interface Track {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
    external_urls: {
        spotify: string;
    };
}

export default function SpotifyTopTracks() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const response = await fetch('/api/spotify-top-tracks');
                if (!response.ok) throw new Error('Failed to fetch tracks');
                const data = await response.json();
                setTracks(data.items);
            } catch (err) {
                setError('Please login to Spotify to proceed!');
                console.error(err);
            }
        };

        fetchTopTracks();
    }, []);

    if (error) return <div className="text-red-500">{error}</div>;
    if (!tracks.length) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Top Tracks</h2>
            <div className="space-y-4">
                {tracks.map((track) => (
                    <a
                        key={track.id}
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <img
                            src={track.album.images[0]?.url}
                            alt={track.album.name}
                            className="w-16 h-16 rounded"
                        />
                        <div className="ml-4">
                            <h3 className="font-semibold">{track.name}</h3>
                            <p className="text-gray-600">
                                {track.artists.map(artist => artist.name).join(', ')}
                            </p>
                            <p className="text-gray-500 text-sm">{track.album.name}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}