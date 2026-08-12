'use client';

import { SoftCard } from "@/app/components/ui/soft-card";
import { CircularProgress } from "@/app/components/ui/circular-progress";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";

interface CalorieRingProps {
    consumed: number; // calories consumed
    target: number;   // daily target
    remaining: number; // calories left
}

export function CalorieRing({ consumed, target, remaining }: CalorieRingProps) {
    const percentage = Math.min(100, Math.round((consumed / target) * 100));

    return (
        <SoftCard className="p-8">
            <div className="flex flex-col items-center text-center space-y-4">
                <CircularProgress value={percentage} size="lg" color="primary">
                    <div className="flex flex-col items-center">
                        <H1 className="text-5xl font-bold text-text-heading">{remaining}</H1>
                        <Caption className="text-muted text-sm">kcal left</Caption>
                    </div>
                </CircularProgress>

                <div className="flex gap-6">
                    <div>
                        <Text className="text-2xl font-bold text-text-heading">{consumed}</Text>
                        <Caption className="text-xs text-muted">Eaten</Caption>
                    </div>
                    <div className="w-px bg-gray-200" />
                    <div>
                        <Text className="text-2xl font-bold text-text-heading">{target}</Text>
                        <Caption className="text-xs text-muted">Goal</Caption>
                    </div>
                </div>
            </div>
        </SoftCard>
    );
}
