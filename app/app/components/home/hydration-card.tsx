"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/app/components/ui/glass-card";
import { H2, Text, Caption } from "@/app/components/ui/typography";
import { Droplets, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase";

export function HydrationCard() {
    const [glasses, setGlasses] = useState(0);
    const [loading, setLoading] = useState(true);
    const [nudge, setNudge] = useState("");

    // Target is 8 glasses (~2000ml)
    const TARGET = 8;

    useEffect(() => {
        // Set time-based nudge
        const hour = new Date().getHours();
        if (hour < 12) setNudge("Have some water yet?");
        else if (hour < 18) setNudge("A sip might feel good.");
        else setNudge("Wind down with a glass?");

        fetchHydration();
    }, []);

    const fetchHydration = async () => {
        const supabase = createClient();
        if (!supabase) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('hydration_logs')
            .select('glasses')
            .eq('user_id', user.id)
            .eq('date', today)
            .single();

        if (data) {
            setGlasses(data.glasses || 0);
        } else {
            setGlasses(0);
        }
        setLoading(false);
    };

    const addGlass = async () => {
        // Optimistic update
        const newCount = glasses + 1;
        setGlasses(newCount);

        const supabase = createClient();
        if (!supabase) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        // Upsert logic
        const { error } = await supabase
            .from('hydration_logs')
            .upsert({
                user_id: user.id,
                date: today,
                glasses: newCount
            }, { onConflict: 'user_id, date' });

        if (error) {
            console.error("Error logging water:", error);
            // Revert on error
            setGlasses(glasses);
        }

        // Celebrate if hit goal
        if (newCount === TARGET) {
            setNudge("You're glowing today! 💧");
        }
    };

    // Calculate fill percentage for the background
    // Cap at 100%
    const fillPercent = Math.min((glasses / TARGET) * 100, 100);

    return (
        <div className="relative h-full overflow-hidden rounded-[24px]">
            {/* Background Fill Animation */}
            <div
                className="absolute bottom-0 left-0 w-full bg-blue-100/60 transition-all duration-700 ease-in-out z-0"
                style={{ height: `${fillPercent}%` }}
            />

            <GlassCard className="h-full relative z-10 bg-transparent border-0 shadow-none flex flex-col justify-between p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Droplets className="w-5 h-5 text-blue-500" />
                            <H2 className="text-lg">Hydration</H2>
                        </div>
                        <Caption className="text-blue-600/80 font-medium">{nudge}</Caption>
                    </div>
                </div>

                <div className="flex items-end justify-between mt-4">
                    <div>
                        <Text className="text-3xl font-heading font-bold text-blue-900">
                            {glasses}<span className="text-base text-blue-600/60 font-normal ml-1">/ {TARGET}</span>
                        </Text>
                        <Caption className="text-xs text-blue-500">glasses</Caption>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); addGlass(); }}
                        className="w-12 h-12 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center text-blue-600 transition-all active:scale-95"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
