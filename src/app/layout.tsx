import type { Metadata } from "next";
import "./globals.css";
import { Outfit } from 'next/font/google'

const outfit = Outfit({
    subsets: ['latin'],
    // weight: ["100"]
})

export const metadata: Metadata = {
    title: "Random Acts of Music",
    description: "Tell a story",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={outfit.className}>
            <head>
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8618892618587385"
                    crossOrigin="anonymous"
                />
                <script defer src="https://cloud.umami.is/script.js" data-website-id="0d75eae1-1fe8-438c-8082-a0791aec8f88"></script>
            </head>
            <body className="font-suisse">{children}</body>
        </html>
    );
}
