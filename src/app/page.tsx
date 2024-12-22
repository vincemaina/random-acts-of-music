import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
export default function HomePage() {
    return (
        <div className="relative h-screen overflow-hidden text-white drop-shadow-sm">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                poster="/poster.jpg"
                preload="none"
                className="absolute top-0 left-0 w-full h-full object-cover blur-lg scale-105 z-0"
            >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/60 z-10"></div>
            
            {/* Header Section - New */}
            <header className="absolute top-0 left-0 w-full z-30 flex justify-between items-center py-4 px-4 md:px-32">
                <Badge className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white hover:text-white border-white/30 transition-all duration-300 text-[10px] md:text-sm">
                    Advertise with us today 🚀
                </Badge>
                
                <nav className="flex gap-6 mr-4 text-[12px] md:text-sm">
                    <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                        About
                    </Link>
                    <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                        Contact
                    </Link>
                    <Link href="/help" className="text-white/70 hover:text-white transition-colors">
                        Help
                    </Link>
                </nav>
            </header>

            {/* Hero Section - Updated with responsive classes */}
            <section className="relative z-20 flex flex-col items-center justify-center text-center h-full px-4 max-w-5xl mx-auto">
                <Badge
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white hover:text-white border-white/30 transition-all duration-300 text-xs md:text-sm mb-4"
                >
                    <span className="bg-green-500 rounded-full w-2 h-2 animate-pulse mr-1" />{" "}
                    We're the number one chat room on the internet.
                </Badge>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-4 tracking-tight max-w-4xl mx-auto">
                    RANDOM ACTS OF{" "}
                    <span className="text-purple-500 drop-shadow-glow">
                        MUSIC
                    </span>
                </h1>

                <p className="text-center max-w-2xl mx-auto tracking-tighter">
                    <span className="font-bold text-sm md:text-lg opacity-50 md:opacity-100">
                        Discover new music. Meet new people. One random chat at
                        a time.
                    </span>
                    <br />
                    <span className="text-sm md:text-lg opacity-50 md:block hidden">
                        It's free, it's fun, and your next favorite song might
                        be just one chat away.
                    </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto justify-center mt-4">
                    <Link href="/random" className="flex-1 sm:flex-initial">
                        <Button className="w-full bg-[#752add] hover:bg-[#8c44ff] transition-all duration-300 text-md">
                            <span className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />{" "}
                            Find random chat
                        </Button>
                    </Link>
                    <Link href="/public" className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white hover:text-white border-white/30 transition-all duration-300 text-md"
                        >
                            Join public chat
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
