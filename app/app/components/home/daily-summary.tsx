import { GlassCard } from "@/app/components/ui/glass-card";
import { H2, Text, Caption } from "@/app/components/ui/typography";
import { cn } from "@/lib/utils";

interface DailySummaryProps {
    calorieRange: string;
    proteinStatus: "low" | "good" | "high";
    message: string;
}

export function DailySummary({ calorieRange, proteinStatus, message }: DailySummaryProps) {
    return (
        <GlassCard className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <H2>Today so far</H2>
                <span className="px-3 py-1 bg-white/50 rounded-full text-xs font-semibold text-text-primary border border-white/60">
                    {calorieRange} kcal
                </span>
            </div>

            <Text className="text-sm">{message}</Text>

            {/* Visual Indicator (Abstract, not a strict bar) */}
            <div className="h-3 w-full bg-secondary/20 rounded-full overflow-hidden flex">
                <div className="h-full w-3/4 bg-gradient-to-r from-secondary to-primary opacity-80 rounded-full" />
            </div>

            <div className="flex gap-4 mt-1">
                <div className="flex flex-col">
                    <Caption>Protein</Caption>
                    <span className="text-sm font-semibold text-text-primary capitalize">{proteinStatus}</span>
                </div>
                <div className="flex flex-col">
                    <Caption>Mood</Caption>
                    <span className="text-sm font-semibold text-text-primary">Balanced</span>
                </div>
            </div>
        </GlassCard>
    );
}
