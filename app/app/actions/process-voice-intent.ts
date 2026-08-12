"use server";

import { callOpenRouterText } from "@/lib/openrouter";

export interface VoiceIntentResult {
  intent: "morning_weight" | "meal_log" | "hydration" | "coaching_qa";
  rawTranscript: string;
  responseMessage: string;
  confidence: number;
  data?: {
    // Weight intent data
    weightKg?: number;
    weightLbs?: number;
    weightUnit?: "kg" | "lbs";
    // Meal intent data
    mealName?: string;
    foodItems?: string[];
    caloriesMin?: number;
    caloriesMax?: number;
    caloriesAvg?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
    mealType?: "breakfast" | "lunch" | "dinner" | "snack";
    // Hydration intent data
    glasses?: number;
  };
}

export async function processVoiceIntent(
  transcript: string,
  userContext?: {
    name?: string;
    currentWeight?: number;
    targetWeight?: number;
    dailyCalories?: number;
    consumedToday?: number;
  }
): Promise<{ success: boolean; result?: VoiceIntentResult; error?: string }> {
  if (!transcript || !transcript.trim()) {
    return { success: false, error: "No voice speech detected" };
  }

  const prompt = `
You are Savor's intelligent, empathetic wellness voice companion.
Analyze the user's spoken voice transcript and categorize it into ONE of these 4 intents:

1. "morning_weight": The user is stating their morning or daily weight measurement (e.g. "I am 68.4 kg", "weighed 150 pounds today", "my weight is 72", "seventy point five kilos").
2. "meal_log": The user is describing food/drink they ate, are eating, or want to log (e.g. "I had 2 rotis with paneer bhurji and a bowl of dal", "ate a turkey sandwich and coffee", "snacked on an apple and almonds").
3. "hydration": The user is logging water (e.g. "drank 2 glasses of water", "had 500ml water", "plus one glass").
4. "coaching_qa": The user is asking a nutrition/health question, expressing guilt, asking what to eat next, or chatting conversationally (e.g. "I overate at dinner and feel bloated", "what's a good high-protein snack for the evening?", "how much water should I drink?").

User Context:
- User Name: ${userContext?.name || "Friend"}
- Current Stored Weight: ${userContext?.currentWeight || 70} kg
- Target Weight: ${userContext?.targetWeight || 65} kg
- Daily Target: ${userContext?.dailyCalories || 2000} kcal (Consumed so far: ${userContext?.consumedToday || 0} kcal)
- Current Time: ${new Date().toLocaleTimeString()}

IMPORTANT PHILOSOPHY:
- Always warm, positive, cheerful, and encouraging.
- Never shameful, rigid, or judgmental.
- For meals, provide realistic calorie estimates and ranges (never exact single numbers).
- If weight is in lbs, also calculate weightKg (1 lb = 0.453592 kg).

Return ONLY a valid raw JSON object matching this structure (no markdown fences, no extra text):
{
  "intent": "morning_weight" | "meal_log" | "hydration" | "coaching_qa",
  "rawTranscript": "${transcript.replace(/"/g, '\\"')}",
  "responseMessage": "A warm, joyful 1-2 sentence spoken reply to say back to the user",
  "confidence": 0.95,
  "data": {
    "weightKg": 68.4,
    "weightUnit": "kg",
    "mealName": "Paneer Bhurji with Rotis",
    "foodItems": ["Paneer Bhurji", "2 Rotis", "Dal"],
    "caloriesMin": 450,
    "caloriesMax": 550,
    "caloriesAvg": 500,
    "proteinG": 22,
    "carbsG": 48,
    "fatG": 18,
    "mealType": "lunch",
    "glasses": 2
  }
}

Transcript to parse:
"${transcript}"
`;

  try {
    const aiResponse = await callOpenRouterText(prompt);

    if (!aiResponse.success || !aiResponse.content) {
      // Fallback local regex parsing for instant weight & hydration recognition
      const localResult = parseLocally(transcript);
      return { success: true, result: localResult };
    }

    const cleanJson = aiResponse.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed: VoiceIntentResult = JSON.parse(cleanJson);
    return { success: true, result: parsed };
  } catch (error: any) {
    console.error("Voice intent parsing error:", error);
    const localResult = parseLocally(transcript);
    return { success: true, result: localResult };
  }
}

// Resilient local rule-based parsing fallback
function parseLocally(transcript: string): VoiceIntentResult {
  const lower = transcript.toLowerCase();

  // Weight check
  const weightMatch = lower.match(/(\d+(\.\d+)?)\s*(kg|kilos|kilograms|lbs|pounds)?/);
  if ((lower.includes("weight") || lower.includes("weigh") || lower.includes("scale") || lower.includes("kg") || lower.includes("kilos") || lower.includes("lbs")) && weightMatch) {
    const num = parseFloat(weightMatch[1]);
    const isLbs = lower.includes("lb") || lower.includes("pound");
    const weightKg = isLbs ? Math.round(num * 0.453592 * 10) / 10 : num;

    return {
      intent: "morning_weight",
      rawTranscript: transcript,
      confidence: 0.9,
      responseMessage: `Recorded ${weightKg} kg! You're making wonderful progress ☀️`,
      data: {
        weightKg,
        weightUnit: isLbs ? "lbs" : "kg",
      },
    };
  }

  // Water check
  if (lower.includes("water") || lower.includes("glass") || lower.includes("drink") || lower.includes("hydrat")) {
    const glassesMatch = lower.match(/(\d+)\s*(glass|glasses)?/);
    const glasses = glassesMatch ? parseInt(glassesMatch[1]) : 1;
    return {
      intent: "hydration",
      rawTranscript: transcript,
      confidence: 0.85,
      responseMessage: `Logged ${glasses} glass${glasses > 1 ? "es" : ""} of water. Staying hydrated! 💧`,
      data: { glasses },
    };
  }

  // Default meal log
  return {
    intent: "meal_log",
    rawTranscript: transcript,
    confidence: 0.8,
    responseMessage: `Added that to your meals! Enjoy your nourishing food 💛`,
    data: {
      mealName: transcript.slice(0, 40),
      caloriesMin: 300,
      caloriesMax: 450,
      caloriesAvg: 375,
      proteinG: 15,
      mealType: "lunch",
    },
  };
}
