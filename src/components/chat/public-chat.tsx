"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import SpotifySearchTracks from "../landing/spotify-search-tracks";
import { type Socket } from "socket.io-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { AnimatePresence } from "framer-motion";
import { CustomAlert } from "../custom-alert";
import { getSessionId, getUsername, setUsername } from "@/lib/auth";
import { hashStringToColor } from "@/lib/username-colours";

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
    const [showAlert, setShowAlert] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false); // Cooldown flag
    const [cooldownTime, setCooldownTime] = useState(0); // Cooldown timer display

    const messageTimes = useRef<number[]>([]); // Store message timestamps

    useEffect(() => {

        const sessionId = getSessionId();

        // Authenticate with sessionId
        socket.emit("authenticate", { sessionId });

        // Auth confirmation
        socket.on("authenticated", (userInfo) => {
            const { sessionId, username } = userInfo;
            setUsername(username);
            console.log("Authenticated as:", userInfo);
        });

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
            socket.off("authenticated");
            socket.off("public-messages");
            socket.off("public-message");
        };
    }, [socket]);

    // Cooldown Countdown
    useEffect(() => {
        if (isCooldown) {
            const interval = setInterval(() => {
                setCooldownTime((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsCooldown(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isCooldown]);

    // Handle Rate Limiting
    const canSendMessage = (): boolean => {
        const now = Date.now();
        const windowDuration = 10 * 1000; // 10 seconds window
        const maxMessages = 5; // Max 5 messages per 10 seconds

        // Remove old timestamps
        messageTimes.current = messageTimes.current.filter(
            (timestamp) => now - timestamp < windowDuration
        );

        if (messageTimes.current.length >= maxMessages) {
            setIsCooldown(true);
            setCooldownTime(10); // Start a 10-second cooldown
            return false;
        }

        messageTimes.current.push(now);
        return true;
    };

    // Helper function to extract Spotify Track ID
    const extractSpotifyTrackId = (url: string): string | null => {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    };

    // Send a text message
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isCooldown) return;

        if (inputMessage.trim()) {
            if (!canSendMessage()) {
                return;
            }
            const message: Message = {
                content: inputMessage
            };
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

        if (!canSendMessage()) {
            return;
        }

        // setMessages([...messages, trackMessage]);
        socket.emit("public-message", { message: trackMessage });
        setActiveSelector(null);
    };

    return (
        <div className="h-full flex flex-col">
            <CustomAlert
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                message="Honestly, grow up."
            />

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50 flex flex-col-reverse gap-1">
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
                        {messages.slice().reverse().map((message, index) => {
                            const isSameUserAsNext = index < messages.length - 1 && messages.slice().reverse()[index + 1].userName === message.userName;

                            return (
                                <div key={index} className="space-y-0.5">
                                    {/* Show username above bubble if it's a new user group */}
                                    {!isSameUserAsNext && (
                                        <p
                                            className={`text-xs font-semibold italic mx-1 mb-1.5 ${index !== messages.length - 1 ? "mt-10" : ""} ${message.userName === getUsername()
                                                    ? "text-right text-gray-500"
                                                    : "text-left text-gray-700"
                                                }`}
                                            style={{color: hashStringToColor(message.userName!)}}
                                        >
                                            {message.userName}
                                        </p>
                                    )}
                                    <div
                                        className={`flex text-sm ${message.userName === getUsername()
                                                ? "justify-end"
                                                : "justify-start"
                                            }`}
                                    >
                                        <div
                                            className={`max-w-[85%] sm:max-w-[70%] rounded-lg shadow ${message.isTrack
                                                    ? "p-0 m-0 overflow-hidden"
                                                    : `${message.userName === getUsername()
                                                        ? "bg-neutral-900 text-white"
                                                        : "bg-white text-black"
                                                    } py-1.5 px-2.5`
                                                }`}
                                            style={{
                                                // color: message.userName !== getUsername() ? hashStringToColor(message.userName!) : undefined,
                                                // boxShadow: "rgba(0, 0, 0, 0.1) 1px 2px 1px -1px"
                                            }}
                                        >
                                            {message.isTrack ? (
                                                <iframe
                                                    style={{ borderRadius: "12px" }}
                                                    src={`https://open.spotify.com/embed/track/${extractSpotifyTrackId(
                                                        message.trackData?.spotifyUrl || ""
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
                                </div>
                            );
                        })}
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
                        disabled={isCooldown}
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
                            disabled={isCooldown}
                            title={isCooldown ? `Cooldown` : undefined}
                        />
                        <Button type="submit" className="text-white rounded" disabled={isCooldown}>
                            Send
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
