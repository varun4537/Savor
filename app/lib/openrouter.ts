// OpenRouter API client for Savor
// High-performance client supporting Gemini 2.5/3.6 Flash, Kimi, GPT-4o Mini, and Claude Haiku

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

// Default top-tier modern models
export const DEFAULT_TEXT_MODEL = process.env.AI_TEXT_MODEL || "google/gemini-2.5-flash";
export const DEFAULT_VISION_MODEL = process.env.AI_VISION_MODEL || "google/gemini-2.5-flash";

// Fallback chain for high resilience
const TEXT_FALLBACKS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
  "moonshotai/kimi-k1.5",
  "openai/gpt-4o-mini",
];

const VISION_FALLBACKS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
  "qwen/qwen3-vl-32b-instruct",
  "openai/gpt-4o-mini",
];

export const AVAILABLE_TEXT_MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google (Fast & Accurate)" },
  { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "Google (Ultra Fast)" },
  { id: "moonshotai/kimi-k1.5", name: "Kimi k1.5", provider: "Moonshot AI" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "Anthropic" },
];

export const AVAILABLE_VISION_MODELS = [
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash (Vision)", provider: "Google" },
  { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "Google" },
  { id: "qwen/qwen3-vl-32b-instruct", name: "Qwen3 VL 32B", provider: "Qwen" },
  { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
];

interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  error?: {
    message: string;
    code: number;
  };
}

/**
 * Call OpenRouter API for text generation with automatic fallback
 */
export async function callOpenRouterText(
  prompt: string,
  model: string = DEFAULT_TEXT_MODEL
): Promise<{ success: boolean; content?: string; error?: string; usage?: any; modelUsed?: string }> {
  if (!OPENROUTER_API_KEY) {
    return { success: false, error: "OpenRouter API key not configured" };
  }

  const modelsToTry = [model, ...TEXT_FALLBACKS.filter((m) => m !== model)];

  for (const currentModel of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://savor-app.vercel.app",
          "X-Title": "Savor Wellness Companion",
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 2048,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[OpenRouter Text] ${currentModel} returned HTTP ${response.status}, trying next fallback...`);
        continue;
      }

      const data: OpenRouterResponse = await response.json();
      if (data.error || !data.choices?.[0]?.message?.content) {
        console.warn(`[OpenRouter Text] ${currentModel} returned error:`, data.error);
        continue;
      }

      return {
        success: true,
        content: data.choices[0].message.content,
        usage: data.usage,
        modelUsed: currentModel,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn(`[OpenRouter Text] ${currentModel} exception:`, err?.message);
    }
  }

  return { success: false, error: "All AI model attempts timed out or failed. Please try again." };
}

/**
 * Call OpenRouter API for vision (image analysis) with automatic fallback
 */
export async function callOpenRouterVision(
  prompt: string,
  imageBase64: string,
  mimeType: string = "image/jpeg",
  model: string = DEFAULT_VISION_MODEL
): Promise<{ success: boolean; content?: string; error?: string; usage?: any; modelUsed?: string }> {
  if (!OPENROUTER_API_KEY) {
    return { success: false, error: "OpenRouter API key not configured" };
  }

  const modelsToTry = [model, ...VISION_FALLBACKS.filter((m) => m !== model)];

  for (const currentModel of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(OPENROUTER_BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://savor-app.vercel.app",
          "X-Title": "Savor Wellness Companion",
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1024,
          temperature: 0.6,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[OpenRouter Vision] ${currentModel} returned HTTP ${response.status}, trying fallback...`);
        continue;
      }

      const data: OpenRouterResponse = await response.json();
      if (data.error || !data.choices?.[0]?.message?.content) {
        continue;
      }

      return {
        success: true,
        content: data.choices[0].message.content,
        usage: data.usage,
        modelUsed: currentModel,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn(`[OpenRouter Vision] ${currentModel} error:`, err?.message);
    }
  }

  return { success: false, error: "Could not analyze the photo right now. Please try again or type the meal name." };
}

/**
 * Model configuration getter
 */
export function getModelConfig() {
  return {
    textModel: DEFAULT_TEXT_MODEL,
    visionModel: DEFAULT_VISION_MODEL,
    availableVisionModels: AVAILABLE_VISION_MODELS,
    availableTextModels: AVAILABLE_TEXT_MODELS,
  };
}
