"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getWeeklyHistory(userId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Mock data
        return Array.from({ length: 7 }).map((_, i) => ({
            date: new Date(Date.now() - i * 86400000).toISOString(),
            calories: Math.floor(Math.random() * (2200 - 1500) + 1500),
            mood: ["Balanced", "Light", "Heavy"][Math.floor(Math.random() * 3)]
        })).reverse();
    }

    // Get last 7 days
    const { data: meals, error } = await supabase
        .from("meals")
        .select("created_at, calories_min, calories_max, mood")
        .eq("user_id", userId)
        .gte("created_at", new Date(Date.now() - 7 * 86400000).toISOString())
        .order("created_at", { ascending: true });

    if (error || !meals) return [];

    // Group by day (simplified)
    // In a real app, we'd use robust date grouping
    const grouped = meals.reduce((acc: any, meal) => {
        const date = meal.created_at.split("T")[0];
        if (!acc[date]) acc[date] = { date, calories: 0, count: 0 };
        acc[date].calories += (meal.calories_min + meal.calories_max) / 2;
        acc[date].count += 1;
        acc[date].mood = meal.mood; // Just take last mood
        return acc;
    }, {});

    return Object.values(grouped);
}
