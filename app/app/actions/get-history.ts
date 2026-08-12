"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function getDailyHistory(userId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        // Return mock data for demo if no DB
        return {
            calories: "450 - 600",
            protein: "High",
            message: "You haven't set up Supabase yet, but you're doing great!"
        };
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: meals, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", today);

    if (error || !meals) return null;

    // Simple aggregation
    const minCals = meals.reduce((sum, m) => sum + (m.calories_min || 0), 0);
    const maxCals = meals.reduce((sum, m) => sum + (m.calories_max || 0), 0);

    return {
        calories: `${minCals} - ${maxCals}`,
        protein: meals.length > 2 ? "High" : "Moderate",
        message: "You are fueling your body well today."
    };
}
