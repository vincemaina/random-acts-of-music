declare global {
    interface Window {
        onSpotifyIframeApiReady: (IFrameAPI: any) => void;
    }
}

'use client'
import { useEffect, useState } from 'react';


interface Track {
  album: {
    images: { url: string }[];
  };
  name: string;
  artists: { name: string }[];
}

export default function Footer() {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [player, setPlayer] = useState<any>(null);

    useEffect(() => {
        // Load Spotify Widget API
        const script = document.createElement("script");
        script.src = "https://open.spotify.com/embed/iframe-api/v1";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
                const element = document.getElementById('spotify-iframe');
                const options = {
                    width: '1',
                    height: '1',
                    uri: 'spotify:track:6eROdBPKoTl6Pddz7QIAJW' // Your track URI
                };
                
                const callback = (EmbedController: any) => {
                    setPlayer(EmbedController);
                };
                
                IFrameAPI.createController(element, options, callback);
            };
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        // Example track ID - replace with your desired track
        const trackId = '6eROdBPKoTl6Pddz7QIAJW';

        fetch(`/api/spotify-track?ids=${trackId}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.tracks?.[0]) {
                    setCurrentTrack(data.tracks[0]);
                }
            })
            .catch(err => console.error('Error fetching track:', err));
    }, []);

    const togglePlay = () => {
        if (player) {
            if (isPlaying) {
                player.pause();
            } else {
                player.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <footer className="absolute bottom-0 left-0 w-full h-16 overflow-hidden z-20 bg-white/5 backdrop-blur-sm">
            {/* Hidden iframe */}
            <div style={{ width: 0, height: 0, position: 'absolute', visibility: 'hidden' }}>
                <div id="spotify-iframe"></div>
            </div>

            <div className="flex items-center h-full px-4">
                {currentTrack && (
                    <>
                        <div className="relative w-12 h-12 mr-4">
                            <div className={`rounded-full overflow-hidden relative ${isPlaying ? 'animate-spin' : ''}`}
                                 style={{ animationDuration: '3s' }}>
                                <img
                                    src={currentTrack.album.images[0].url}
                                    alt="Album cover"
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                />
                                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-white font-medium">
                                {currentTrack.name}
                            </span>
                            <span className="text-xs text-white/70">
                                {currentTrack.artists[0].name}
                            </span>
                        </div>
                        <button 
                            className="ml-auto text-white/70 hover:text-white"
                            onClick={togglePlay}
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                    </>
                )}
            </div>
        </footer>
    );
}
