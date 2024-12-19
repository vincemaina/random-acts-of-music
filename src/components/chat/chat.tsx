'use client';

import { useState, FormEvent } from 'react';
import SpotifyTopTracks from '../landing/spotify-top-tracks';

interface Message {
    content: string;
    isTrack?: boolean;
    trackData?: {
        name: string;
        artists: string;
        albumName: string;
        imageUrl: string;
        spotifyUrl: string;
    };
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [showTrackSelector, setShowTrackSelector] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            setMessages([...messages, { content: inputMessage }]);
            setInputMessage('');
        }
    };

    const handleTrackSelect = (track: any | null) => {
        if (!track) {
            setShowTrackSelector(false);
            return;
        }

        const trackMessage: Message = {
            content: `Check out this track: ${track.name}`,
            isTrack: true,
            trackData: {
                name: track.name,
                artists: track.artists.map((artist: any) => artist.name).join(', '),
                albumName: track.album.name,
                imageUrl: track.album.images[0]?.url,
                spotifyUrl: track.external_urls.spotify
            }
        };
        setMessages([...messages, trackMessage]);
        setShowTrackSelector(false);
    };

    return (
        <div className="max-w-2xl mx-auto h-[600px] flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow">
                        {message.isTrack ? (
                            <a
                                href={message.trackData?.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <img
                                    src={message.trackData?.imageUrl}
                                    alt={message.trackData?.albumName}
                                    className="w-16 h-16 rounded"
                                />
                                <div className="ml-4">
                                    <h3 className="font-semibold">{message.trackData?.name}</h3>
                                    <p className="text-gray-600">{message.trackData?.artists}</p>
                                    <p className="text-gray-500 text-sm">{message.trackData?.albumName}</p>
                                </div>
                            </a>
                        ) : (
                            <p>{message.content}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Track Selector */}
            {showTrackSelector && (
                <div className="border-t border-gray-200">
                    <SpotifyTopTracks onTrackSelect={handleTrackSelect} />
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowTrackSelector(!showTrackSelector)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Share Track
                    </button>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
