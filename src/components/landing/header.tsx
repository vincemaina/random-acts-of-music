"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

export default function Header() {

    const path = usePathname();

    const [privateUsers, setPrivateUsers] = useState<number>(0);

    const interval = useRef<NodeJS.Timeout>();

    useEffect(() => {
        async function fetchPrivateUsers() {
            const res = await fetch(process.env["NEXT_PUBLIC_WS_HOST"] + "/private-users")
            const data = await res.json();
            setPrivateUsers(data.users);
        } 

        fetchPrivateUsers();

        interval.current = setInterval(() => {
            fetchPrivateUsers();
        }, 1000 * 5);

        return () => {
            clearInterval(interval.current);
        }
    }, []);

    return (
        <div className="relative sm:min-h-0 mb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tighter">
                    <Link href={"/"}>
                        {path.startsWith('/public') ? "PUBLIC" : "RANDOM"} ACTS OF <span className="text-[#752add]">MUSIC</span>
                    </Link>
                </h1>

                {(path.startsWith('/public') && privateUsers > 0) && (<>
                    <Link href={"/random"} className="hidden lg:block">
                        <Button className="rounded-full">
                            <span className="bg-green-500 rounded-full w-2 h-2 animate-pulse" />{" "}
                            Join {privateUsers} other{privateUsers !== 1 && "s"} in random chat
                        </Button>
                    </Link>
                </>)}
            </div>
        </div>
    );
}
