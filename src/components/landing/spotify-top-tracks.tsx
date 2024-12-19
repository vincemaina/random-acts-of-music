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

interface Props {
    onTrackSelect?: (track: Track | null) => void;
}

export default function SpotifyTopTracks({ onTrackSelect }: Props) {
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
        <div className="max-w-2xl mx-auto mt-8 relative">
            {onTrackSelect && (
                <button
                    onClick={() => onTrackSelect(null)}
                    className="absolute -top-2 right-0 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            <h2 className="text-2xl font-black mb-4 text-left">YOUR TOP TRACKS</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {tracks.map((track) => (
                    <a
                        key={track.id}
                        href={onTrackSelect ? undefined : track.external_urls.spotify}
                        onClick={(e) => {
                            if (onTrackSelect) {
                                e.preventDefault();
                                onTrackSelect(track);
                            }
                        }}
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