'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/app/components/ui/glass-card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { H1, Text, Caption } from '@/app/components/ui/typography';
import { ArrowRight, Target, Calendar } from 'lucide-react';

const timelines = [
    { id: '1', label: '1 month', weeks: 4 },
    { id: '3', label: '3 months', weeks: 12 },
    { id: '6', label: '6 months', weeks: 24 },
    { id: '12', label: '1 year', weeks: 52 },
];

export default function TimelinePage() {
    const router = useRouter();
    const [goal, setGoal] = useState<string>('lose');
    const [targetChange, setTargetChange] = useState('10');
    const [selectedTimeline, setSelectedTimeline] = useState<string>('3');
    const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');

    useEffect(() => {
        const savedGoal = sessionStorage.getItem('onboarding_goal');
        const savedBody = sessionStorage.getItem('onboarding_body');
        if (savedGoal) setGoal(savedGoal);
        if (savedBody) {
            const body = JSON.parse(savedBody);
            setWeightUnit(body.weightUnit || 'lb');
        }
    }, []);

    const getGoalLabel = () => {
        switch (goal) {
            case 'lose': return 'lose';
            case 'gain': return 'gain';
            default: return 'change';
        }
    };

    const handleContinue = () => {
        sessionStorage.setItem('onboarding_timeline', JSON.stringify({
            targetChange: Number(targetChange),
            timeline: selectedTimeline
        }));
        router.push('/onboarding/diet');
    };

    const showTargetInput = goal === 'lose' || goal === 'gain';

    return (
        <main className="min-h-screen bg-background flex flex-col p-6">
            {/* Progress */}
            <div className="flex gap-1 mb-8">
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-8">
                    <H1 className="text-2xl mb-2">Set your target</H1>
                    <Text className="text-muted">We'll create a realistic plan for you</Text>
                </div>

                <div className="w-full max-w-sm mx-auto space-y-8">
                    {/* Target Amount */}
                    {showTargetInput && (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Target className="w-5 h-5 text-primary" />
                                <Text className="font-medium">How much do you want to {getGoalLabel()}?</Text>
                            </div>
                            <div className="flex items-center gap-3">
                                <Input
                                    type="number"
                                    value={targetChange}
                                    onChange={(e) => setTargetChange(e.target.value)}
                                    className="text-center text-xl py-4 flex-1"
                                    min={1}
                                    max={100}
                                />
                                <Text className="text-muted">{weightUnit}</Text>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            <Text className="font-medium">By when?</Text>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {timelines.map((timeline) => {
                                const isSelected = selectedTimeline === timeline.id;
                                return (
                                    <GlassCard
                                        key={timeline.id}
                                        onClick={() => setSelectedTimeline(timeline.id)}
                                        className={`p-4 cursor-pointer transition-all text-center ${isSelected
                                                ? 'ring-2 ring-primary bg-primary/5'
                                                : ''
                                            }`}
                                    >
                                        <Text className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                                            {timeline.label}
                                        </Text>
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="w-full max-w-sm mx-auto">
                <Button onClick={handleContinue} className="w-full py-5">
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </main>
    );
}
