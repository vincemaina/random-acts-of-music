import Link from "next/link";

export default function Header() {
    return (
        <div className="relative sm:min-h-0 mb-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tighter">
                    <Link href={"/"}>
                        RANDOM ACTS OF <span className="text-[#752add]">MUSIC</span>
                    </Link>
                </h1>
            </div>
        </div>
    );
}
