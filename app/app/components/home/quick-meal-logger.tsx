"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SoftCard } from "@/app/components/ui/soft-card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H2, Text, Caption } from "@/app/components/ui/typography";
import { Camera, Mic, MicOff, Send, History, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { useSpeechRecognition } from "@/app/hooks/use-speech-recognition";
import { callOpenRouterText } from "@/lib/openrouter";
import { useSavorData } from "@/app/hooks/use-savor-data";
import Link from "next/link";

interface QuickMealLoggerProps {
  onMealLogged?: () => void;
}

export function QuickMealLogger({ onMealLogged }: QuickMealLoggerProps) {
  const router = useRouter();
  const { logMeal } = useSavorData();
  const [inputValue, setInputValue] = useState("");
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { isListening, isSupported, startListening, stopListening } =
    useSpeechRecognition({
      onResult: (transcript) => {
        setInputValue(transcript);
        if (transcript.trim()) {
          logMealByName(transcript.trim());
        }
      },
      onError: (err) => {
        setError(err);
      },
    });

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      setError("");
      setSuccess("");
      startListening();
    }
  };

  const triggerConfetti = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#F58549", "#EEC170", "#68D391"],
      });
    } catch (e) {}
  };

  const logMealByName = async (dishName: string) => {
    if (!dishName.trim()) return;

    setIsLogging(true);
    setError("");
    setSuccess("");

    try {
      const prompt = `
        Estimate the calories and macros for this meal: "${dishName}"
        Return ONLY a raw JSON object with:
        {
            "name": "Cleaned dish name",
            "calories": number (estimated kcal),
            "protein": number (estimated grams),
            "carbs": number (estimated grams),
            "fat": number (estimated grams),
            "feedback": "Warm 1-sentence encouraging feedback"
        }
        Return ONLY JSON, no markdown fences.
      `;

      const response = await callOpenRouterText(prompt);

      let mealName = dishName;
      let caloriesAvg = 400;
      let proteinG = 15;
      let carbsG = 45;
      let fatG = 12;
      let aiMessage = "Logged with care! Enjoy your nourishing meal 💛";

      if (response.success && response.content) {
        try {
          const cleanJson = response.content.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          mealName = parsed.name || dishName;
          caloriesAvg = parsed.calories || 400;
          proteinG = parsed.protein || 15;
          carbsG = parsed.carbs || 45;
          fatG = parsed.fat || 12;
          aiMessage = parsed.feedback || aiMessage;
        } catch (e) {}
      }

      await logMeal({
        name: mealName,
        caloriesAvg,
        proteinG,
        carbsG,
        fatG,
        aiMessage,
        mealType: "lunch",
      });

      triggerConfetti();
      setSuccess(`✓ Logged: ${mealName} (~${caloriesAvg} kcal)`);
      setInputValue("");
      onMealLogged?.();

      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      console.error("Quick meal log error:", err);
      setError(err.message || "Could not log meal. Please try again.");
    } finally {
      setIsLogging(false);
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      logMealByName(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
      <div className="flex items-center justify-between mb-3 px-1">
        <H2 className="text-sm font-bold text-text-heading">Quick Meal Log</H2>
        <Link
          href="/history"
          className="text-xs text-primary font-bold flex items-center gap-1 hover:underline"
        >
          <History className="w-3.5 h-3.5" />
          History
        </Link>
      </div>

      {/* Input Row */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening to your meal..." : "e.g. 2 rotis and palak paneer"}
          className="flex-1 text-xs bg-[#FFFDF9] border-amber-200 rounded-2xl"
          disabled={isListening || isLogging}
          autoComplete="off"
        />

        {/* Voice Mic */}
        {isSupported && (
          <button
            onClick={handleVoiceToggle}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-xs active:scale-95 ${
              isListening
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-amber-100/80 text-primary hover:bg-amber-200"
            }`}
            disabled={isLogging}
            title="Log by voice"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}

        {/* Photo Camera */}
        <button
          onClick={() => router.push("/log/photo")}
          className="w-10 h-10 rounded-2xl bg-amber-100/80 text-primary flex items-center justify-center hover:bg-amber-200 shadow-xs active:scale-95 transition-all"
          disabled={isLogging}
          title="Take food photo"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs shadow-primary/30 hover:bg-primary-dark active:scale-95 transition-all disabled:opacity-50"
          disabled={!inputValue.trim() || isLogging}
          title="Save meal"
        >
          {isLogging ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Listening Banner */}
      {isListening && (
        <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-semibold animate-pulse">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
          <span>Say your meal (e.g. "Greek salad with grilled chicken")</span>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="mt-2.5 p-2.5 bg-green-50 border border-green-200 rounded-2xl text-xs font-bold text-green-800 flex items-center gap-1.5 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 text-center">
          {error}
        </div>
      )}
    </SoftCard>
  );
}
