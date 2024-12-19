import Header from "@/components/landing/header";
import SpotifySync from "@/components/landing/spotify-sync";
import SpotifyTopTracks from "@/components/landing/spotify-top-tracks";

export default function Home() {
    return (
        <div className="p-4 space-y-4">
            <Header />
            <SpotifySync />
            <SpotifyTopTracks />
        </div>
    );
}
