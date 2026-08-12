"use server";

import { callOpenRouterText } from "@/lib/openrouter";

interface UserProfile {
    name?: string;
    age?: number | string;
    gender?: string;
    weight?: number | string;
    height?: number | string;
    goal?: string;
    activityLevel?: string;
    dietary_preferences?: string[];
    daily_calories?: number;
    // Supabase format
    dailyCalories?: number;
}

export async function generateDietPlan(profile: UserProfile, cuisine: string) {
    if (!profile) {
        return { success: false, error: "Profile data is missing", plan: null };
    }

    const calories = profile.daily_calories || profile.dailyCalories || 2000;
    const dietary = profile.dietary_preferences?.join(", ") || "Standard";

    const prompt = `
        You are a Clinical Dietician and Expert Chef specializing in ${cuisine} cuisine.
        
        **Client Profile:**
        - **Goal:** ${profile.goal || "maintain weight"}
        - **Calorie Target:** ${calories} kcal/day
        - **Dietary Type:** ${dietary}
        
        **Task:**
        Create a detailed 7-Day Meal Plan (Monday - Sunday).
        
        **Guidelines:**
        1. **Authenticity:** Use culturally accurate ${cuisine} dishes.
        2. **Balance:** Ensure each day meets the calorie target with good protein distribution.
        3. **Variety:** Don't repeat the exact same meal every day.
        4. **Structure:** Breakfast, Lunch, Snack, Dinner.
        5. **Nutrition:** Include estimated calories, protein, carbs, and fat for each meal.
        
        **Output Format:**
        Return a JSON object with a single key "week".
        "week" should be an object where keys are "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun".
        Each day object must have breakfast, lunch, snack, dinner.
        Each meal must be an OBJECT with:
        - "name": string (Dish name + brief description)
        - "calories": number (estimated kcal)
        - "protein": number (grams)
        - "carbs": number (grams)
        - "fat": number (grams)
        
        Example JSON Structure:
        {
            "week": {
                "Mon": {
                    "breakfast": {
                        "name": "Oats Upma with mixed vegetables - a healthy twist on traditional upma",
                        "calories": 350,
                        "protein": 12,
                        "carbs": 45,
                        "fat": 10
                    },
                    "lunch": {
                        "name": "Grilled Chicken Salad with olive oil dressing",
                        "calories": 450,
                        "protein": 35,
                        "carbs": 20,
                        "fat": 18
                    },
                    "snack": {
                        "name": "Greek yogurt with berries",
                        "calories": 150,
                        "protein": 10,
                        "carbs": 15,
                        "fat": 5
                    },
                    "dinner": {
                        "name": "2 Rotis with Dal Tadka and mixed vegetable sabzi",
                        "calories": 500,
                        "protein": 18,
                        "carbs": 65,
                        "fat": 12
                    }
                }
            }
        }

        Do not include markdown. Return ONLY the raw JSON string.
    `;

    const response = await callOpenRouterText(prompt);

    if (!response.success || !response.content) {
        console.error("OpenRouter diet plan generation failed:", response.error);
        return {
            success: false,
            error: response.error || "Could not generate plan. Please try again.",
            plan: null
        };
    }

    try {
        // Clean up markdown if present
        const jsonStr = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);
        return { success: true, plan: data.week };
    } catch (parseError) {
        console.error("Failed to parse diet plan JSON:", parseError);
        console.error("Raw response:", response.content);
        return {
            success: false,
            error: "Couldn't understand dietician's response. Try again?",
            plan: null
        };
    }
}
