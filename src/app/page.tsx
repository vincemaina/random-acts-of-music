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
                className="absolute top-0 left-0 w-full h-full object-cover blur-xl scale-105 z-0"
            >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay for Better Text Visibility */}
            <div className="absolute top-0 left-0 w-full h-full bg-amber-50 bg-opacity-10 z-10"></div>

            {/* Hero Section */}
            <section className="relative z-20 flex flex-col items-center justify-center text-center h-full px-4">
                <h1 className="text-6xl font-bold mb-2">
                    RANDOM ACTS OF <span className="text-purple-300">MUSIC</span>
                </h1>
                <h2 className="text-2xl mb-5">Discover new music. Meet new people. One random chat at a time.</h2>

                <Link
                    href="/random"
                    className="bg-purple-800 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition mt-10"
                >
                    Start Chatting Now
                </Link>

                <p className="mt-4 text-sm text-gray-100">
                    It’s free, it’s fun, and your next favorite song might be just one chat away.
                </p>
            </section>
        </div>
    );
}
