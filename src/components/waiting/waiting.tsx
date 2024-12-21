import Header from "@/components/landing/header";
import { Loader2 } from "lucide-react";

interface WaitingProps {
    text?: "Finding you a friend..." | "Connecting";
}

export default function Waiting({ text = "Finding you a friend..." }: WaitingProps) {
    return (
        <div className="min-h-screen p-4 flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <p className="text-neutral-500">{text}</p>
                    <Loader2 className="w-4 h-4 text-neutral-500 animate-spin" />
                </div>
            </div>
        </div>
    )
}
