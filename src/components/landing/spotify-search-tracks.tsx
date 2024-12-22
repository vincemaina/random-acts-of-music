'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/input';

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

export default function SpotifySearchTracks({ onTrackSelect }: Props) {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        // Clear previous timeout
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        // Set a new timeout
        debounceTimeout.current = setTimeout(() => {
            fetchTracks(query);
        }, 500); // 500ms debounce delay
    };

    const fetchTracks = async (query: string) => {
        if (!query.trim()) {
            setTracks([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/search-spotify?q=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search tracks');
            const data = await response.json();
            setTracks(data.items);
        } catch (err) {
            setError('Failed to search tracks');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-4 sm:p-6 backdrop-blur-lg animate-in slide-in-from-bottom-4 duration-200">
                {onTrackSelect && (
                    <button
                        onClick={() => onTrackSelect(null)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-200 transition-colors bg-gray-800 rounded-full p-1.5 border border-gray-700"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <h2 className="text-base sm:text-lg md:text-2xl font-black mb-3 sm:mb-4 text-left text-white">
                    SEARCH <span className="text-[#752add]">TRACKS</span>
                </h2>

                <div className="mb-4 sm:mb-6">
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search for tracks..."
                        className="w-full rounded-lg bg-gray-800 border-gray-700 text-white placeholder-gray-400 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm sm:text-base"
                    />
                </div>

                {error && <div className="text-red-400 mb-3 sm:mb-4 text-xs sm:text-sm">{error}</div>}
                {isLoading && <div className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">Searching...</div>}

                <div className="space-y-2 sm:space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
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
                            className="flex items-center p-2 sm:p-3 md:p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-gray-700 border border-gray-700"
                        >
                            <img
                                src={track.album.images[0]?.url}
                                alt={track.album.name}
                                className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg object-cover"
                            />
                            <div className="ml-2 sm:ml-3 md:ml-4 min-w-0 flex-1">
                                <h3 className="font-semibold text-xs sm:text-sm md:text-base truncate text-white">
                                    {track.name}
                                </h3>
                                <p className="text-gray-400 text-xs sm:text-sm truncate">
                                    {track.artists.map(artist => artist.name).join(', ')}
                                </p>
                                <p className="text-gray-500 text-xs truncate hidden sm:block">
                                    {track.album.name}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
