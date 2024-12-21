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
    socket: Socket;
}

export default function Chat({ socket }: Props) {
    const [chatRoom, setChatRoom] = useState<string | null>(null);
    const [matchedUser, setMatchedUser] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [activeSelector, setActiveSelector] = useState<'top' | 'search' | null>(null);
    const [userLeft, setUserLeft] = useState<boolean>(false);

    useEffect(() => {
        // When the user is matched, receive the chat room and the other user
        socket.on('matched', (data) => {
            setChatRoom(data.chatRoom);
            setMatchedUser(data.userId);
            console.log(`Matched with user ${data.userId} in room ${data.chatRoom}`);
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('matched');
        };
    }, [socket]);

    useEffect(() => {
        // Listening for new messages
        socket.on('new-message', (message: Message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        })

        // Listen for user left message
        socket.on('user-left', (userId: string) => {
            console.log(`${userId} left the chat.`);
            setUserLeft(true);
        });

        // Cleanup when component unmounts
        return () => {
            socket.off('new-message');
            socket.off('user-left');
        };
    }, [socket]);

    // Helper functions
    const extractSpotifyTrackId = (url: string): string | null => {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    };

    const handleLeaveChat = () => {
        socket.emit('leave-chat', { chatRoom });
        setChatRoom(null);
        setMatchedUser("");
        setMessages([]);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const message: Message = {
                content: inputMessage,
                recipientId: matchedUser,
                sender: 'me'
            };
            setMessages([...messages, message]);
            socket.emit('new-message', {
                chatRoom: chatRoom,
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
            recipientId: matchedUser,
            sender: 'me'
        };
        setMessages([...messages, trackMessage]);
        socket.emit('new-message', {
            chatRoom: chatRoom,
            message: trackMessage
        });
        setActiveSelector(null);
    };

    return (
        <div className="max-w-2xl mx-auto h-[600px] flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {!chatRoom ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="mb-4">Waiting for a chat partner...</div>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`flex ${message.recipientId === matchedUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] rounded-lg shadow ${
                                    message.recipientId === matchedUser 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-white text-gray-900'
                                } ${message.isTrack ? 'p-0 overflow-hidden' : 'p-4'}`}
                                >
                                    {message.isTrack ? (
                                        <iframe 
                                            style={{ borderRadius: '12px' }} 
                                            src={`https://open.spotify.com/embed/track/${
                                                extractSpotifyTrackId(message.trackData?.spotifyUrl || '')
                                            }?utm_source=generator`}
                                            width="100%" 
                                            height="152" 
                                            frameBorder="0" 
                                            allowFullScreen
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                            loading="lazy"
                                        />
                                    ) : (
                                        <p>{message.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {userLeft && <div className='text-center'>
                            User left chat.
                        </div>}
                    </>
                )}
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
                            disabled={!chatRoom}
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
                        disabled={!chatRoom}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={!chatRoom}
                    >
                        Send
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={handleLeaveChat}
                        disabled={!chatRoom}
                    >
                        Leave chat
                    </button>
                </div>
            </form>
        </div>
    );
}
