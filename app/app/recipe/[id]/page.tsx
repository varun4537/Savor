"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { GlassCard } from "@/app/components/ui/glass-card";
import { Button } from "@/app/components/ui/button";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { ArrowLeft, Clock, Flame, Users, ChefHat, Check, Loader2 } from "lucide-react";
import Link from "next/link";

interface Recipe {
    name: string;
    time: string;
    calories: string;
    servings: number;
    ingredients: { item: string; amount: string }[];
    steps: string[];
}

export default function RecipeDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    useEffect(() => {
        // Get recipe info from URL params (in production, fetch from API)
        const name = searchParams.get('name') || 'Delicious Recipe';
        const time = searchParams.get('time') || '30 mins';
        const calories = searchParams.get('calories') || '400-500';
        const ingredientList = searchParams.get('ingredients')?.split(',') || ['eggs', 'rice', 'vegetables'];

        // Generate mock recipe
        const mockRecipe: Recipe = {
            name,
            time,
            calories,
            servings: 2,
            ingredients: ingredientList.map(i => ({
                item: i,
                amount: ['1 cup', '2 pcs', '100g', '1/2 cup'][Math.floor(Math.random() * 4)]
            })),
            steps: [
                'Prep all ingredients. Wash and chop vegetables as needed.',
                'Heat oil in a pan over medium heat.',
                `Add ${ingredientList[0] || 'main ingredient'} and cook for 3-4 minutes.`,
                'Add remaining ingredients and stir well.',
                'Season with salt and pepper to taste.',
                'Cook for another 5-7 minutes until done.',
                'Serve hot and enjoy!'
            ]
        };

        setRecipe(mockRecipe);
        setLoading(false);
    }, [searchParams]);

    const toggleStep = (index: number) => {
        setCompletedSteps(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    if (loading) {
        return (
            <main className="min-h-screen p-6 bg-app flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </main>
        );
    }

    if (!recipe) return null;

    return (
        <main className="min-h-screen p-6 bg-app relative overflow-hidden pb-24">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/pantry">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <H1 className="text-xl">{recipe.name}</H1>
            </div>

            <div className="max-w-md mx-auto space-y-6">
                {/* Quick Stats */}
                <div className="flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <Text className="text-sm">{recipe.time}</Text>
                    </div>
                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <Text className="text-sm">{recipe.calories} kcal</Text>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <Text className="text-sm">{recipe.servings} servings</Text>
                    </div>
                </div>

                {/* Ingredients */}
                <GlassCard className="p-4">
                    <H2 className="mb-4 flex items-center gap-2">
                        <ChefHat className="w-5 h-5" />
                        Ingredients
                    </H2>
                    <div className="space-y-2">
                        {recipe.ingredients.map((ing, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-white/30 rounded-lg">
                                <Text className="text-sm capitalize">{ing.item}</Text>
                                <Caption>{ing.amount}</Caption>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Steps */}
                <GlassCard className="p-4">
                    <H2 className="mb-4">Steps</H2>
                    <div className="space-y-3">
                        {recipe.steps.map((step, i) => {
                            const isCompleted = completedSteps.includes(i);
                            return (
                                <div
                                    key={i}
                                    onClick={() => toggleStep(i)}
                                    className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${isCompleted ? 'bg-green-50/50' : 'bg-white/30'
                                        }`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
                                        }`}>
                                        {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{i + 1}</span>}
                                    </div>
                                    <Text className={`text-sm ${isCompleted ? 'line-through text-muted' : ''}`}>
                                        {step}
                                    </Text>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>

                {/* Progress */}
                {completedSteps.length > 0 && (
                    <div className="text-center">
                        <Caption>
                            {completedSteps.length} of {recipe.steps.length} steps completed
                        </Caption>
                        <div className="mt-2 h-2 bg-muted/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all"
                                style={{ width: `${(completedSteps.length / recipe.steps.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Log Meal Button */}
            {completedSteps.length === recipe.steps.length && (
                <div className="fixed bottom-6 left-6 right-6 max-w-md mx-auto">
                    <Link href="/log/photo">
                        <Button className="w-full py-5 shadow-lg">
                            Log This Meal
                        </Button>
                    </Link>
                </div>
            )}
        </main>
    );
}
