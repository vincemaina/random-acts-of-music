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
            <body>{children}</body>
        </html>
    );
}
