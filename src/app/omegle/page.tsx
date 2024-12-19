"use client";

import { useEffect, useRef, useState } from "react";
import {io} from "socket.io-client";

export default function Page() {

    const [users, setUsers] = useState<string[]>([]);
    const [userId, setUserId] = useState<string>(); 
    const [recipientId, setRecipientId] = useState<string | null>(null);

    useEffect(() => {
        const socket = io("http://localhost:3001");

        socket.on('connect', () => {
            console.log("Connected:", socket.id);
            setUserId(socket.id);
        });

        socket.on('online-users', (users) => {
            console.log("New user online:", users);
            setUsers(users);
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('online-users');
        };
    }, []);

    useEffect(() => {
        if (users.length > 1 && userId) {
            const otherUsers = users.filter(user => user != userId);
            const randomIndex = Math.floor(Math.random() * otherUsers.length);
            const randomUser = otherUsers[randomIndex];
            console.log("Chatting with random user:", randomUser);
            setRecipientId(randomUser);
        }
    }, [users, userId]);

    if (!userId) return <>Connecting...</>

    if (users.length <= 1) return <>Waiting for other users to join...</>

    return (
        <>
            <div>You are: {userId}</div>
            <div>Chatting with: {recipientId}</div>
        </>
    )
}