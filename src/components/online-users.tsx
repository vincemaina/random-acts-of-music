"use client"

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const wsHost = process.env.NEXT_PUBLIC_WS_HOST;

if (!wsHost) {
    throw new Error("No env var provided for web socket host");
}

export function OnlineUsers() {

    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const socket = io(wsHost);

        socket.on('connect', () => {
            console.log("Connected");
        });

        // Listen for 'online-users' event to get the updated list of online users
        socket.on('online-users', (users) => {
            console.log("New user online:", users);
            setUsers(users);  // Update the state with the new list
        });

        // Cleanup listener on unmount
        return () => {
            socket.off('online-users');
        };
    }, []);

    return (
        <>
            <h3>Online users:</h3>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>User: {user}</li>
                ))}
            </ul>
        </>
    )
}