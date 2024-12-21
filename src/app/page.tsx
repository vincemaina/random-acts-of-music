"use client";

import Chat from "@/components/chat/chat";
import Header from "@/components/landing/header";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const wsHost = process.env.NEXT_PUBLIC_WS_HOST;

if (!wsHost) {
    throw new Error("No env var provided for web socket host");
}

export default function Home() {
    const [socket, setSocket] = useState<Socket>();

    useEffect(() => {
        const socket = io(wsHost);
        setSocket(socket);
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="p-4 space-y-4">
            <Header />
            {socket && <Chat socket={socket} />}
        </div>
    );
}
