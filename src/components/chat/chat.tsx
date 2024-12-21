"use client";

import { useState, FormEvent, useEffect } from "react";
import SpotifySearchTracks from "../landing/spotify-search-tracks";
import { type Socket } from "socket.io-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    const [inputMessage, setInputMessage] = useState("");
    const [activeSelector, setActiveSelector] = useState<
        "top" | "search" | null
    >(null);
    const [userLeft, setUserLeft] = useState<boolean>(false);

    useEffect(() => {
        // When the user is matched, receive the chat room and the other user
        socket.on("matched", (data) => {
            setChatRoom(data.chatRoom);
            setMatchedUser(data.userId);
            console.log(
                `Matched with user ${data.userId} in room ${data.chatRoom}`
            );
        });

        // Cleanup listener on unmount
        return () => {
            socket.off("matched");
        };
    }, [socket]);

    useEffect(() => {
        // Listening for new messages
        socket.on("new-message", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Listen for user left message
        socket.on("user-left", (userId: string) => {
            console.log(`${userId} left the chat.`);
            setUserLeft(true);
        });

        // Cleanup when component unmounts
        return () => {
            socket.off("new-message");
            socket.off("user-left");
        };
    }, [socket]);

    // Helper functions
    const extractSpotifyTrackId = (url: string): string | null => {
        const match = url.match(/track\/([a-zA-Z0-9]+)/);
        return match ? match[1] : null;
    };

    const handleLeaveChat = () => {
        socket.emit("leave-chat", { chatRoom });
        setChatRoom(null);
        setMatchedUser("");
        setMessages([]);
        setUserLeft(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (inputMessage.trim()) {
            const message: Message = {
                content: inputMessage,
                recipientId: matchedUser,
                sender: "me",
            };
            setMessages([...messages, message]);
            socket.emit("new-message", {
                chatRoom: chatRoom,
                message,
            });
            setInputMessage("");
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
                artists: track.artists
                    .map((artist: any) => artist.name)
                    .join(", "),
                albumName: track.album.name,
                imageUrl: track.album.images[0]?.url,
                spotifyUrl: track.external_urls.spotify,
            },
            recipientId: matchedUser,
            sender: "me",
        };
        setMessages([...messages, trackMessage]);
        socket.emit("new-message", {
            chatRoom: chatRoom,
            message: trackMessage,
        });
        setActiveSelector(null);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 bg-gray-50">
                {!chatRoom ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <p className="mb-2 tracking-tighter opacity-50">
                                Waiting for a chat partner...
                            </p>
                            <Loader2 className="animate-spin rounded-full h-8 w-8 mx-auto text-[#752add] opacity-50" />
                        </div>
                    </div>
                ) : messages.length == 0 && !userLeft ? (<div className="flex flex-col items-center justify-center h-full">
                    <div className="font-bold">New chat partner connected</div>
                    <div>Start by sending a message or prompt below</div>
                </div>) : (
                    <>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    message.recipientId === matchedUser
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[85%] sm:max-w-[70%] rounded-lg ${
                                        message.isTrack 
                                            ? "p-0 m-0 overflow-hidden"
                                            : `shadow ${
                                                message.recipientId === matchedUser
                                                    ? "bg-neutral-900 text-white"
                                                    : "bg-white text-gray-900"
                                              } p-3 sm:p-4`
                                    }`}
                                >
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
                        {userLeft && (
                            <div className="text-center">User left chat.</div>
                        )}
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
                    <div className="flex justify-between sm:justify-start gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className={`text-black rounded w-full ${userLeft ? "bg-red-500 text-white" : ""} ${
                                !chatRoom ? "hover:cursor-not-allowed" : ""
                            }`}
                            onClick={handleLeaveChat}
                            disabled={!chatRoom}
                        >
                            Leave chat
                        </Button>
                        <Button
                            type="button"
                            onClick={() =>
                                setActiveSelector(
                                    activeSelector === "search"
                                        ? null
                                        : "search"
                                )
                            }
                            className={`text-white rounded w-full ${
                                !chatRoom || userLeft ? "hover:cursor-not-allowed" : ""
                            }`}
                            disabled={!chatRoom || userLeft}
                        >
                            Send a Track
                        </Button>
                    </div>
                    <div className="flex gap-2 flex-1">
                        <Input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder={
                                chatRoom
                                    ? "Type your message..."
                                    : "Waiting for a chat partner..."
                            }
                            className={`flex-1 border border-gray-300 rounded ${
                                !chatRoom ? "hover:cursor-not-allowed" : ""
                            }`}
                            disabled={!chatRoom || userLeft}
                        />
                        <Button
                            type="submit"
                            className={`text-white rounded ${
                                !chatRoom ? "hover:cursor-not-allowed" : ""
                            }`}
                            disabled={!chatRoom || userLeft}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
