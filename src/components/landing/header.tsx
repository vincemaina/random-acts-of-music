"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {

    const path = usePathname();

    return (
        <div className="relative sm:min-h-0 mb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tighter">
                    <Link href={"/"}>
                        {path.startsWith('/public') ? "PUBLIC" : "RANDOM"} ACTS OF <span className="text-[#752add]">MUSIC</span>
                    </Link>
                </h1>
            </div>
        </div>
    );
}
