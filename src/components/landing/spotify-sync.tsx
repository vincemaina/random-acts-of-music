"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SpotifySync() {
    const [isLoading, setIsLoading] = useState(false);
    
    const clickHandler = () => {
        setIsLoading(true);
        
        // Spotify OAuth configuration
        const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
        const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-top-read';
        
        // Generate random state string for security
        const state = Math.random().toString(36).substring(7);
        
        // Store state in cookie
        document.cookie = `spotify_auth_state=${state}; path=/; max-age=3600; samesite=lax`;
        
        // Construct the authorization URL
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('client_id', client_id!);
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('redirect_uri', redirect_uri!);
        authUrl.searchParams.append('state', state);
        authUrl.searchParams.append('scope', scope);
        
        // Redirect to Spotify login
        window.location.href = authUrl.toString();
    }

    return (
        <div>
            <Button 
                className="bg-white hover:bg-neutral-50 text-green-500 font-bold" 
                onClick={clickHandler}
                disabled={isLoading}
            >
                {isLoading ? (
                    "Connecting..."
                ) : (
                    <>
                        <img
                            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png"
                            alt="Spotify Logo"
                            className="w-4 h-4 mr-2"
                        />
                        Connect with Spotify
                    </>
                )}
            </Button>
        </div>
    );
}
