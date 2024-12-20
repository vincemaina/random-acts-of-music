'use client';

import { useState, FormEvent, useEffect } from 'react';
import SpotifyTopTracks from '../landing/spotify-top-tracks';
import SpotifySearchTracks from '../landing/spotify-search-tracks';
import { type Socket } from "socket.io-client";

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
    recipientId: string;
    sender?: string;
}

interface Props {
    chatRoom: string;
    recipientId: string;
    socket: Socket
}

export default function Chat(props: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [activeSelector, setActiveSelector] = useState<'top' | 'search' | null>(null);

    // Send a new message
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const message: Message = {
                content: inputMessage,
                recipientId: props.recipientId,
                sender: 'me'
            };
            setMessages([...messages, message]);
            props.socket.emit('new-message', {
                chatRoom: props.chatRoom,
                message
            });
            setInputMessage('');
        }
    };

    const handleTrackSelect = (track: any | null) => {
        if (!track) {
            setActiveSelector(null);
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
            },
            recipientId: props.recipientId,
            sender: 'me'
        };
        setMessages([...messages, trackMessage]);
        setActiveSelector(null);
    };

    useEffect(() => {
        // Listening for new messages
        props.socket.on('new-message', (message: Message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        })

        // Cleanup when component unmounts
        return () => {
            props.socket.off('new-message');
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto h-[600px] flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={`flex ${message.recipientId === props.recipientId ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] rounded-lg shadow ${
                            message.recipientId === props.recipientId 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white text-gray-900'
                        } ${message.isTrack ? 'p-0 overflow-hidden' : 'p-4'}`}
                        >
                            {message.isTrack ? (
                                <a
                                    href={message.trackData?.spotifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-white"
                                >
                                    <img
                                        src={message.trackData?.imageUrl}
                                        alt={message.trackData?.albumName}
                                        className="w-16 h-16"
                                    />
                                    <div className="ml-4 pr-4 py-2">
                                        <h3 className="font-semibold text-gray-900">{message.trackData?.name}</h3>
                                        <p className="text-gray-600">{message.trackData?.artists}</p>
                                        <p className="text-gray-500 text-sm">{message.trackData?.albumName}</p>
                                    </div>
                                </a>
                            ) : (
                                <p>{message.content}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {activeSelector === 'search' && (
                <div className="border-t border-gray-200">
                    <SpotifySearchTracks onTrackSelect={handleTrackSelect} />
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={() => setActiveSelector(activeSelector === 'search' ? null : 'search')}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Search Tracks
                        </button>
                    </div>
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
