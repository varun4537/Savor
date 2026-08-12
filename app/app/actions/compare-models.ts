    'use server';

import { callOpenRouterText } from '@/lib/openrouter';

interface ComparisonResult {
    model: string;
    success: boolean;
    content?: string;
    error?: string;
    latencyMs: number;
    tokens?: {
        prompt: number;
        completion: number;
        total: number;
    };
    estimatedCost?: number;
}

/**
 * Run the same prompt against multiple models and compare results
 */
export async function compareModels(
    prompt: string,
    models: string[]
): Promise<ComparisonResult[]> {
    const results: ComparisonResult[] = [];

    // Run each model sequentially to avoid rate limits
    for (const model of models) {
        const startTime = Date.now();

        try {
            const response = await callOpenRouterTextWithModel(prompt, model);
            const latencyMs = Date.now() - startTime;

            if (response.success) {
                results.push({
                    model,
                    success: true,
                    content: response.content,
                    latencyMs,
                    tokens: response.usage ? {
                        prompt: response.usage.prompt_tokens || 0,
                        completion: response.usage.completion_tokens || 0,
                        total: response.usage.total_tokens || 0,
                    } : undefined,
                    estimatedCost: response.usage?.cost || 0,
                });
            } else {
                results.push({
                    model,
                    success: false,
                    error: response.error,
                    latencyMs,
                });
            }
        } catch (err: any) {
            results.push({
                model,
                success: false,
                error: err.message || 'Unknown error',
                latencyMs: Date.now() - startTime,
            });
        }
    }

    return results;
}

/**
 * Test a single model and return health status
 */
export async function testModelHealth(modelId: string): Promise<{
    success: boolean;
    latencyMs: number;
    error?: string;
}> {
    const startTime = Date.now();

    try {
        const response = await callOpenRouterTextWithModel(
            'Respond with exactly: "OK"',
            modelId
        );

        return {
            success: response.success,
            latencyMs: Date.now() - startTime,
            error: response.error,
        };
    } catch (err: any) {
        return {
            success: false,
            latencyMs: Date.now() - startTime,
            error: err.message,
        };
    }
}

/**
 * Internal function to call OpenRouter with a specific model
 */
async function callOpenRouterTextWithModel(
    prompt: string,
    model: string
): Promise<{ success: boolean; content?: string; error?: string; usage?: any }> {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
        return { success: false, error: "API key not configured" };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s for comparison

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://savor-app-teal.vercel.app",
                "X-Title": "Savor Admin Dashboard",
            },
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1024,
                temperature: 0.7,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            return { success: false, error: `API error: ${response.status} - ${errorText}` };
        }

        const data = await response.json();

        if (data.error) {
            return { success: false, error: data.error.message };
        }

        const content = data.choices?.[0]?.message?.content;

        return {
            success: !!content,
            content,
            error: content ? undefined : "Empty response",
            usage: data.usage,
        };

    } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            return { success: false, error: "Request timed out (15s)" };
        }

        return { success: false, error: error.message || "Request failed" };
    }
}
