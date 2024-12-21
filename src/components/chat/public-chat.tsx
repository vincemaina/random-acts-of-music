"use client";

import { useState, FormEvent, useEffect } from "react";
import SpotifySearchTracks from "../landing/spotify-search-tracks";
import { type Socket } from "socket.io-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AnimatePresence } from "framer-motion";

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
    sender?: string;
    userName?: string;
    userId?: string;
}

interface Props {
    socket: Socket;
}

export default function PublicChat({ socket }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [activeSelector, setActiveSelector] = useState<"search" | null>(null);

    useEffect(() => {
        // Join the public room on mount
        socket.emit("join-public-room");

        socket.on("public-messages", (messages: Message[]) => {
            console.log("Loaded messages:", messages);
            setMessages(messages);
        });

        socket.on("public-message", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit("leave-room", { room: "public-room" });
            socket.off("public-messages");
            socket.off("public-message");
        };
    }, [socket]);

    // Helper function to extract Spotify Track ID
    const extractSpotifyTrackId = (url: string): string | null => {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    };

    // Send a text message
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const message: Message = {
                content: inputMessage
            };
            setMessages([...messages, message]);
            socket.emit("public-message", { message });
            setInputMessage("");
        }
    };

    // Send a Spotify track message
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
                artists: track.artists
                    .map((artist: any) => artist.name)
                    .join(", "),
                albumName: track.album.name,
                imageUrl: track.album.images[0]?.url,
                spotifyUrl: track.external_urls.spotify,
            },
        };

        setMessages([...messages, trackMessage]);
        socket.emit("public-message", { message: trackMessage });
        setActiveSelector(null);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <p className="mb-2 tracking-tighter opacity-50">
                                Welcome to the public chat room!
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.sender === "me"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[70%] rounded-lg ${message.isTrack
                                            ? "p-0 m-0 overflow-hidden"
                                            : `shadow ${message.sender === "me"
                                                ? "bg-neutral-900 text-white"
                                                : "bg-white text-gray-900"
                                            } p-3 sm:p-4`
                                        }`}
                                >
                                    {/* @ts-ignore */}
                                    {message.userName}
                                    {message.isTrack ? (
                                        <iframe
                                            style={{ borderRadius: "12px" }}
                                            src={`https://open.spotify.com/embed/track/${extractSpotifyTrackId(
                                                message.trackData?.spotifyUrl ||
                                                ""
                                            )}?utm_source=generator`}
                                            width="100%"
                                            height="100%"
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
                    </>
                )}
            </div>

            <AnimatePresence>
                {activeSelector === "search" && (
                    <SpotifySearchTracks onTrackSelect={handleTrackSelect} />
                )}
            </AnimatePresence>

            {/* Input Form */}
            <form
                onSubmit={handleSubmit}
                className="p-2 sm:p-4 border-t border-gray-200 bg-white"
            >
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        type="button"
                        onClick={() =>
                            setActiveSelector(
                                activeSelector === "search" ? null : "search"
                            )
                        }
                        className="text-white rounded"
                    >
                        Send a Track
                    </Button>
                    <div className="flex gap-2 flex-1">
                        <Input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded"
                        />
                        <Button type="submit" className="text-white rounded">
                            Send
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
