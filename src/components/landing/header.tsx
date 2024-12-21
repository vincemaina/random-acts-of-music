import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <div className="relative min-h-[100px] sm:min-h-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <h1 className="text-4xl font-black tracking-tighter">
                    RANDOM ACTS OF <span className="text-[#752add]">MUSIC</span>
                </h1>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="fixed bottom-4 right-4 sm:static sm:mt-0"
                        >
                            ?
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                        <p className="text-neutral-500">
                            <span className="font-bold">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </span>
                        </p>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
