"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SpotifySync() {
    const [isLoading, setIsLoading] = useState(false);
    const clickHandler = () => {
        console.log("clicked");
    }
    
    return (
        <div>
            <Button className="bg-white hover:bg-neutral-50 text-green-500 font-bold" onClick={clickHandler}>
                <img
                    src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png"
                    alt="Spotify Logo"
                    className="w-4 h-4 mr-2"
                />
                Connect with Spotify
            </Button>
        </div>
    );
}
