import Header from "@/components/landing/header";
import SpotifySync from "@/components/landing/spotify-sync";
import SpotifyProfile from "@/components/landing/spotify-profile";

export default function Home() {
  return (
    <div className="p-4 space-y-4">
      <Header />
      <SpotifySync />
      <SpotifyProfile />
    </div>
  );
}
