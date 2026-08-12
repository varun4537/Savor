import { Button } from "@/app/components/ui/button";
import { Camera, Mic } from "lucide-react";
import Link from "next/link";

export function MealActions() {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
            <Link href="/log/voice">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-xl shadow-secondary/20 border-2 border-white/50 backdrop-blur-md pointer-events-auto"
                    aria-label="Speak meal"
                >
                    <Mic className="w-6 h-6" />
                </Button>
            </Link>

            <Link href="/log/photo">
                <Button
                    variant="primary"
                    size="icon"
                    className="h-16 w-16 rounded-full shadow-2xl shadow-primary/40 border-4 border-white/20 scale-110 -translate-y-2 pointer-events-auto"
                    aria-label="Scan meal"
                >
                    <Camera className="w-8 h-8" />
                </Button>
            </Link>
        </div>
    );
}
