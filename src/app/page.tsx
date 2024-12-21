import { Button } from "@/components/ui/button";
import Link from "next/link";

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

            {/* Overlay - Updated with gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/40 to-black/60 z-10"></div>

            {/* Hero Section - Updated with responsive classes */}
            <section className="relative z-20 flex flex-col items-start justify-center text-center h-full px-4 max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 tracking-tight text-left">
                    RANDOM ACTS OF <span className="text-purple-500 drop-shadow-glow">MUSIC</span>
                </h1>

                <p className="text-left">
                    <span className="font-bold text-2xl">Discover new music. Meet new people. One random chat at a time.</span>
                    <br />
                    <span className="text-2xl opacity-50">It's free, it's fun, and your next favorite song might be just one chat away.</span>
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md justify-center mt-10">
                    <Link href="/random" className="flex-1 sm:flex-initial">
                        <Button className="w-full bg-[#752add] hover:bg-[#8c44ff] transition-all duration-300 text-lg">
                            Find random chat
                        </Button>
                    </Link>
                    <Link href="/public" className="flex-1 sm:flex-initial">
                        <Button 
                            variant="outline" 
                            className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white hover:text-white border-white/30 transition-all duration-300 text-lg"
                        >
                            Join public chat
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
