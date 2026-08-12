import { H1, Text } from "@/app/components/ui/typography";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

interface HomeHeaderProps {
    name?: string;
}

// Varied greetings - rotates based on day
const subtextOptions = [
    "Here when you need.",
    "No pressure today.",
    "Take your time.",
    "Checking in is enough.",
    "Just here if you want.",
];

export function HomeHeader({ name }: HomeHeaderProps) {
    const hours = new Date().getHours();
    const greeting = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";
    const displayName = name || "there";

    // Rotate subtext based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const subtext = subtextOptions[dayOfYear % subtextOptions.length];

    return (
        <div className="flex items-start justify-between mb-6 px-2">
            <div className="space-y-1">
                <H1>{greeting}, {displayName}.</H1>
                <Text className="text-text-secondary">{subtext}</Text>
            </div>
            <Link href="/settings">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 -mr-2">
                    <Settings className="w-6 h-6 text-muted hover:text-primary transition-colors" />
                </Button>
            </Link>
        </div>
    );
}
