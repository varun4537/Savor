"use server";

import { callOpenRouterVision } from "@/lib/openrouter";

export async function analyzeFoodImageBox(formData: FormData) {
    const file = formData.get("image") as File;

    if (!file) {
        return { success: false, error: "No image provided", timeout: false };
    }

    try {
        // Convert to base64
        const arrayBuffer = await file.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        const prompt = `
            You are a gentle, supportive nutritionist for the app "Savor".
            Analyze the food in the image.
            Return a JSON object with:
            1. "foodItems": array of strings (names of foods identified)
            2. "calories": string (estimated range like "400-500", NEVER exact numbers)
            3. "protein": string (estimated protein in grams, e.g. "20g")
            4. "message": string (1 sentence, warm, encouraging, no judgement. If it's junk food, be kind.)
            
            Example output:
            {
                "foodItems": ["Paneer Butter Masala", "Naan"],
                "calories": "550-650",
                "protein": "18g",
                "message": "A comforting classic! Enjoy the rich flavors."
            }

            Do not include markdown code blocks. Return ONLY the raw JSON string.
        `;

        const response = await callOpenRouterVision(prompt, base64Image, file.type);

        if (!response.success || !response.content) {
            console.error("OpenRouter vision analysis failed:", response.error);
            return {
                success: false,
                error: response.error || "Could not see the food clearly. Try again?",
                timeout: false,
                data: {
                    foodItems: [],
                    calories: "???",
                    protein: "?",
                    message: "Oops, I blinked. Can you retake it?"
                }
            };
        }

        // Clean up markdown if present
        const jsonStr = response.content.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonStr);

        return { success: true, data, timeout: false };

    } catch (error: any) {
        console.error("Food analysis error:", error?.message || error);
        return {
            success: false,
            error: "Could not analyze the food. Try again?",
            timeout: false,
            data: {
                foodItems: [],
                calories: "???",
                protein: "?",
                message: "Oops, I blinked. Can you retake it?"
            }
        };
    }
}
