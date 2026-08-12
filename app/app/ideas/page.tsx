"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/app/components/ui/glass-card";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Loader2, Sparkles, Clock, ChefHat } from "lucide-react";
import Link from "next/link";
import { getSuggestions } from "@/app/actions/get-suggestions";

export default function IdeasPage() {
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSuggestions().then(data => {
            setIdeas(data);
            setLoading(false);
        });
    }, []);

    return (
        <main className="min-h-screen p-6 bg-app relative overflow-hidden flex flex-col gap-6">
            {/* Background decorations */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <H1 className="text-xl">Nourishing Ideas</H1>
            </div>

            {/* Hero illustration */}
            <div className="flex justify-center">
                <img
                    src="/cooking-ideas.png"
                    alt="Cooking ideas"
                    className="w-48 h-48 object-contain opacity-90"
                />
            </div>

            <Text className="text-text-secondary text-center">
                Inspiration for your next meal
            </Text>

            {/* Quick links */}
            <div className="flex gap-3">
                <Link href="/pantry" className="flex-1">
                    <GlassCard className="p-4 text-center hover:bg-white/60 transition-colors">
                        <ChefHat className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <Text className="text-sm font-medium">Pantry Mode</Text>
                        <Caption className="text-xs">Use what you have</Caption>
                    </GlassCard>
                </Link>
                <Link href="/diet-plan" className="flex-1">
                    <GlassCard className="p-4 text-center hover:bg-white/60 transition-colors">
                        <Sparkles className="w-6 h-6 mx-auto mb-2 text-secondary" />
                        <Text className="text-sm font-medium">Diet Plan</Text>
                        <Caption className="text-xs">Weekly meals</Caption>
                    </GlassCard>
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-8 gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <Caption>Finding ideas...</Caption>
                </div>
            ) : (
                <div className="space-y-4 pb-20">
                    <H2 className="text-sm text-muted">Suggestions for you</H2>
                    {ideas.map((idea) => (
                        <GlassCard key={idea.id} className="p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-300">
                            <div className="flex justify-between items-start">
                                <H2 className="text-base">{idea.title}</H2>
                                <div className="bg-primary/10 px-2 py-1 rounded text-xs font-semibold text-primary flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {idea.time}
                                </div>
                            </div>

                            <Text className="text-sm text-text-secondary">
                                {idea.description}
                            </Text>

                            <div className="flex gap-2 mt-1">
                                {idea.tags.map((tag: string) => (
                                    <span key={tag} className="text-xs px-2 py-1 bg-white/50 rounded-full border border-white/60 text-text-primary">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </main>
    );
}
