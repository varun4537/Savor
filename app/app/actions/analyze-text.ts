"use server";

export async function analyzeFoodText(description: string) {
    if (!description || description.trim().length === 0) {
        return { error: "No description provided" };
    }

    // Analyze with OpenRouter
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp:free",
                messages: [
                    {
                        role: "system",
                        content: `You are a gentle, supportive nutritionist. 
            Analyze the user's spoken meal description. 
            Return a JSON object with:
            1. "foodItems": array of strings
            2. "calories": string (estimated range like "400-500", NEVER exact)
            3. "protein": string (estimated g)
            4. "message": string (1 sentence, warm, encouraging, no judgement)
            
            Do not include markdown code blocks. Just the raw JSON.`
                    },
                    {
                        role: "user",
                        content: description
                    }
                ]
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        const cleaned = content.replace(/```json/g, "").replace(/```/g, "").trim();

        return { success: true, data: JSON.parse(cleaned) };

    } catch (error) {
        console.error("AI Error:", error);
        return { error: "Could not analyze description. Try again?" };
    }
}
