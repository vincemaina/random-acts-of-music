"use client";

import Chat from "@/components/chat/chat";
import Header from "@/components/landing/header";
import Waiting from "@/components/waiting/waiting";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const wsHost = process.env.NEXT_PUBLIC_WS_HOST;

if (!wsHost) {
    throw new Error("No env var provided for web socket host");
}

export default function Home() {

    const [chatRoom, setChatRoom] = useState(null);
    const [matchedUser, setMatchedUser] = useState<string>("");
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const socket = io(wsHost);

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

    if (!socket) return <Waiting text="Connecting" />
    if (!chatRoom) return <Waiting  />

    return (
        <div className="p-4 space-y-4">
            <Header />
            <Chat
                chatRoom={chatRoom}
                recipientId={matchedUser}
                socket={socket}
                onLeaveChat={() => {
                    socket.emit('leave-chat', { chatRoom });
                    setChatRoom(null);
                    setMatchedUser("");
                }}
            />
        </div>
    );
}
