'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/app/components/ui/glass-card';
import { Button } from '@/app/components/ui/button';
import { H1, Text, Caption } from '@/app/components/ui/typography';
import { ArrowRight, TrendingDown, TrendingUp, Heart, Salad, Check } from 'lucide-react';

const goals = [
    { id: 'lose', icon: TrendingDown, label: 'Feel Lighter', description: 'Less weighed down', color: 'text-blue-500' },
    { id: 'gain', icon: TrendingUp, label: 'Get Stronger', description: 'Build strength', color: 'text-green-500' },
    { id: 'maintain', icon: Heart, label: 'Stay Balanced', description: 'Keep doing what works', color: 'text-pink-500' },
    { id: 'eat-better', icon: Salad, label: 'Eat with Intention', description: 'More mindful choices', color: 'text-orange-500' },
];

export default function GoalPage() {
    const router = useRouter();
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const toggleGoal = (id: string) => {
        setSelectedGoals(prev =>
            prev.includes(id)
                ? prev.filter(g => g !== id)
                : [...prev, id]
        );
    };

    const handleContinue = () => {
        if (selectedGoals.length > 0) {
            sessionStorage.setItem('onboarding_goals', JSON.stringify(selectedGoals));
            router.push('/onboarding/lifestyle');
        }
    };

    return (
        <main className="min-h-screen bg-background flex flex-col p-6">
            {/* Progress */}
            <div className="flex gap-1 mb-8">
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
                <div className="h-1 flex-1 rounded-full bg-muted/30" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-8">
                    <H1 className="text-2xl mb-2">What matters to you?</H1>
                    <Text className="text-muted">Pick what resonates</Text>
                </div>

                <div className="w-full max-w-sm mx-auto space-y-3">
                    {goals.map((goal) => {
                        const Icon = goal.icon;
                        const isSelected = selectedGoals.includes(goal.id);

                        return (
                            <GlassCard
                                key={goal.id}
                                onClick={() => toggleGoal(goal.id)}
                                className={`p-4 cursor-pointer transition-all duration-200 flex items-center gap-4 ${isSelected
                                    ? 'ring-2 ring-primary bg-primary/5'
                                    : 'hover:bg-white/60'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center ${goal.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <Text className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                                        {goal.label}
                                    </Text>
                                    <Caption>{goal.description}</Caption>
                                </div>
                                {isSelected && (
                                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </GlassCard>
                        );
                    })}
                </div>

                {/* Hint for body recomp */}
                {selectedGoals.includes('lose') && selectedGoals.includes('gain') && (
                    <div className="max-w-sm mx-auto mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Caption className="text-green-700 text-center">
                            💪 Body recomposition! We'll focus on protein and strength training.
                        </Caption>
                    </div>
                )}
            </div>

            {/* CTA */}
            <div className="w-full max-w-sm mx-auto">
                <Button
                    onClick={handleContinue}
                    className="w-full py-5"
                    disabled={selectedGoals.length === 0}
                >
                    Continue
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </main>
    );
}
