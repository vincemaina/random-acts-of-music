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
            <body className="flex flex-col md:flex-row">
                <div className="h-[100px] md:h-auto md:w-[200px] p-2 bg-gray-50"></div>
                <main className="flex-auto">{children}</main>
                <div className="h-[100px] md:h-auto md:w-[200px] p-2 bg-gray-50 hidden lg:block"></div>
            </body>
        </html>
    );
}
