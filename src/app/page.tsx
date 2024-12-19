import Header from "@/components/landing/header";
import SpotifySync from "@/components/landing/spotify-sync";
import SpotifyTopTracks from "@/components/landing/spotify-top-tracks";
import Chat from "@/components/chat/chat";

export default function Home() {
    return (
        <div className="p-4 space-y-4">
            <Header />
            <SpotifySync />
            <Chat />
        </div>
    );
}
