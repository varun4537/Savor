"use server";

import { callOpenRouterText } from "@/lib/openrouter";

interface Recipe {
    id: number;
    name: string;
    time: string;
    calories: string;
    ingredients: string[];
    match: number;
    instructions?: string[];
}

export async function generateRecipes(ingredients: string[], cuisine: string) {
    if (!ingredients || ingredients.length === 0) {
        return { success: false, error: "No ingredients provided", recipes: [] };
    }

    const prompt = `
        You are a creative chef for the app "Savor".
        The user has these ingredients: ${ingredients.join(", ")}.
        They want "${cuisine}" style recipes (or whatever fits best if cuisine is 'Any').
        
        Suggest 3 recipes that use as many of receiving ingredients as possible.
        You can assume basic staples like salt, pepper, oil, water are available.
        
        Return a JSON object with a "recipes" key containing an array of 3 objects.
        Each object must have:
        1. "id": number (1, 2, 3)
        2. "name": string (Recipe Title)
        3. "time": string (e.g. "20 mins")
        4. "calories": string (e.g. "300-400")
        5. "ingredients": array of strings (list the user's ingredients used in this)
        6. "match": number (0-100, how well it fits the user's list. Higher if uses more of their list)
        
        Example output structure:
        {
            "recipes": [
                {
                    "id": 1,
                    "name": "Masala Omelette",
                    "time": "15 mins",
                    "calories": "250-300",
                    "ingredients": ["Eggs", "Onion", "Tomato"],
                    "match": 90
                }
            ]
        }

        Do not include markdown. Return ONLY the raw JSON string.
    `;

    const response = await callOpenRouterText(prompt);

    if (!response.success || !response.content) {
        console.error("OpenRouter recipe generation failed:", response.error);
        return {
            success: false,
            error: response.error || "Chef is busy. Try again?",
            recipes: []
        };
    }

    try {
        // Clean up markdown if present
        const jsonStr = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);
        return { success: true, recipes: data.recipes || [] };
    } catch (parseError) {
        console.error("Failed to parse recipe JSON:", parseError);
        console.error("Raw response:", response.content);
        return {
            success: false,
            error: "Couldn't understand chef's response. Try again?",
            recipes: []
        };
    }
}
