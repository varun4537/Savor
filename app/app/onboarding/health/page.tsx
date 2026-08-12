'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/app/components/ui/glass-card';
import { Button } from '@/app/components/ui/button';
import { H1, Text, Caption } from '@/app/components/ui/typography';
import { ArrowRight, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function HealthPage() {
    const router = useRouter();
    const [bmi, setBmi] = useState(0);
    const [bmiCategory, setBmiCategory] = useState('');
    const [healthInsights, setHealthInsights] = useState<string[]>([]);
    const [name, setName] = useState('');

    useEffect(() => {
        const savedName = sessionStorage.getItem('onboarding_name') || 'there';
        const savedBody = sessionStorage.getItem('onboarding_body');

        setName(savedName);

        if (savedBody) {
            const body = JSON.parse(savedBody);
            const heightM = body.heightCm / 100;
            const calculatedBmi = body.weightKg / (heightM * heightM);
            setBmi(Math.round(calculatedBmi * 10) / 10);

            // Categorize BMI
            let category = '';
            const insights: string[] = [];

            if (calculatedBmi < 18.5) {
                category = 'Underweight';
                insights.push('You may benefit from increasing your calorie intake with nutrient-dense foods.');
            } else if (calculatedBmi < 25) {
                category = 'Healthy Weight';
                insights.push('Your weight is in the healthy range. Focus on maintaining balanced nutrition.');
            } else if (calculatedBmi < 30) {
                category = 'Overweight';
                insights.push('A gradual, sustainable approach to weight loss works best for long-term success.');
            } else {
                category = 'Obese';
                insights.push('Small, consistent changes can lead to significant health improvements over time.');
            }

            setBmiCategory(category);

            // Add age-based insight
            if (body.age > 35) {
                insights.push('Metabolism naturally slows after 35. Strength training helps maintain muscle mass.');
            }

            setHealthInsights(insights);
        }
    }, []);

    const getBmiColor = () => {
        if (bmi < 18.5) return 'text-blue-500';
        if (bmi < 25) return 'text-green-500';
        if (bmi < 30) return 'text-amber-500';
        return 'text-red-500';
    };

    const getBmiPosition = () => {
        // Returns position percentage for the BMI indicator (scale 15-40)
        const min = 15, max = 40;
        const clamped = Math.max(min, Math.min(max, bmi));
        return ((clamped - min) / (max - min)) * 100;
    };

    const handleContinue = () => {
        router.push('/onboarding/results');
    };

    return (
        <main className="min-h-screen bg-background flex flex-col p-6">
            {/* Progress */}
            <div className="flex gap-1 mb-8">
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary" />
                <div className="h-1 flex-1 rounded-full bg-primary/50" />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-8">
                    <H1 className="text-2xl mb-2">Here's where you are, {name}</H1>
                    <Text className="text-muted">Understanding your starting point</Text>
                </div>

                <div className="w-full max-w-sm mx-auto space-y-6">
                    {/* BMI Card */}
                    <GlassCard className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                <Text className="font-medium">Body Mass Index</Text>
                            </div>
                        </div>

                        <div className="text-center mb-4">
                            <Text className={`text-4xl font-bold ${getBmiColor()}`}>{bmi}</Text>
                            <Caption className="block mt-1">{bmiCategory}</Caption>
                        </div>

                        {/* BMI Scale */}
                        <div className="relative h-3 bg-gradient-to-r from-blue-400 via-green-400 via-amber-400 to-red-400 rounded-full mb-2">
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-md"
                                style={{ left: `calc(${getBmiPosition()}% - 8px)` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                            <span>Under</span>
                            <span>Healthy</span>
                            <span>Over</span>
                            <span>Obese</span>
                        </div>
                    </GlassCard>

                    {/* Insights */}
                    <div className="space-y-3">
                        {healthInsights.map((insight, i) => (
                            <GlassCard key={i} className="p-4 flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    {i === 0 ? (
                                        bmi < 25 ? <TrendingUp className="w-4 h-4 text-primary" /> : <TrendingDown className="w-4 h-4 text-primary" />
                                    ) : (
                                        <Activity className="w-4 h-4 text-primary" />
                                    )}
                                </div>
                                <Text className="text-sm">{insight}</Text>
                            </GlassCard>
                        ))}
                    </div>

                    {/* Note */}
                    <Caption className="text-center block">
                        BMI is just one measure. Your overall health depends on many factors including diet, activity, and sleep.
                    </Caption>
                </div>
            </div>

            {/* CTA */}
            <div className="w-full max-w-sm mx-auto">
                <Button onClick={handleContinue} className="w-full py-5">
                    See My Plan
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </main>
    );
}
