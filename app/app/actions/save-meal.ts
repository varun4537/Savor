"use server";

import { createClient } from "@supabase/supabase-js";

// We need a server-side client with service role or just standard client
// For actions, we should rely on the session if using @supabase/ssr, but for this lightweight approach
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function saveMeal(mealData: any, userId: string) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return { error: "Supabase not configured" };
    }

    try {
        const { data, error } = await supabase
            .from("meals")
            .insert([
                {
                    user_id: userId,
                    food_items: mealData.foodItems,
                    calories_min: parseInt(mealData.calories.split("-")[0]) || 0,
                    calories_max: parseInt(mealData.calories.split("-")[1]) || 0,
                    protein_g: parseInt(mealData.protein) || 0,
                    ai_message: mealData.message,
                    mood: "Balanced", // Default for now
                },
            ])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error("Save Error:", error);
        return { error: error.message };
    }
}
