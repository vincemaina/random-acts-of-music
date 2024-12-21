import type { Metadata } from "next";
import "./globals.css";

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
        <html lang="en">
            <head>
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8618892618587385"
                    crossOrigin="anonymous"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
