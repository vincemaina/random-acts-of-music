"use client";

import Chat from "@/components/chat/chat";
import Header from "@/components/landing/header";
import SpotifySync from "@/components/landing/spotify-sync";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {

    const [chatRoom, setChatRoom] = useState(null);
    const [matchedUser, setMatchedUser] = useState<string>("");
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const socket = io("http://localhost:3001");

        // When the user is matched, receive the chat room and the other user
        socket.on('matched', (data) => {
            console.log("data:", data);
            setChatRoom(data.chatRoom);
            setMatchedUser(data.userId);
            console.log(`Matched with user ${data.userId} in room ${data.chatRoom}`);
        });

        setSocket(socket);

        // Cleanup listener on unmount
        return () => {
            socket.off('matched');
        };
    }, []);

    if (!socket) return <>Connecting...</>
    if (!chatRoom) return <>Waiting for friends...</>

    return (
        <div className="p-4 space-y-4">
            <Header />
            <SpotifySync />

            <div>Chat room name: {chatRoom}</div>
            <div>Chatting with: {matchedUser}</div>

            <Chat chatRoom={chatRoom} recipientId={matchedUser} socket={socket}/>
        </div>
    );
}
