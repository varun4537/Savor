"use client";

import { useState, useEffect, useRef } from "react";
import { X, Mic, MicOff, Sparkles, Scale, Utensils, Droplets, CheckCircle2, Loader2, Volume2, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { processVoiceIntent, VoiceIntentResult } from "@/app/actions/process-voice-intent";
import { useSavorData } from "@/app/hooks/use-savor-data";

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "general" | "morning_weight" | "meal" | "hydration";
}

export function VoiceAssistantModal({ isOpen, onClose, initialMode = "general" }: VoiceAssistantModalProps) {
  const { profile, logWeight, logMeal, incrementGlass, latestWeight } = useSavorData();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<VoiceIntentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setTranscript(final);
          handleProcessVoice(final);
        } else {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error !== "no-speech") {
          setError("Microphone error: " + event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-start listening when opened
  useEffect(() => {
    if (isOpen) {
      setResult(null);
      setTranscript("");
      setInterimTranscript("");
      setError(null);
      startListening();
    } else {
      stopListening();
    }
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // already started
      }
    } else {
      setError("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {}
    }
  };

  const triggerConfetti = async () => {
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F58549", "#EEC170", "#772F1A", "#68D391"],
      });
    } catch (e) {}
  };

  const handleProcessVoice = async (textToProcess: string) => {
    if (!textToProcess.trim()) return;
    setIsProcessing(true);
    setError(null);

    try {
      const res = await processVoiceIntent(textToProcess, {
        name: profile?.name,
        currentWeight: latestWeight,
        targetWeight: profile?.targetWeightKg,
        dailyCalories: profile?.dailyCalories,
      });

      if (res.success && res.result) {
        setResult(res.result);
        executeIntentAction(res.result);
      } else {
        setError(res.error || "Could not understand. Please try again.");
      }
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  const executeIntentAction = async (intentResult: VoiceIntentResult) => {
    if (intentResult.intent === "morning_weight" && intentResult.data?.weightKg) {
      await logWeight(intentResult.data.weightKg, "Spoken via voice", true);
      triggerConfetti();
    } else if (intentResult.intent === "meal_log" && intentResult.data?.mealName) {
      await logMeal({
        name: intentResult.data.mealName,
        caloriesMin: intentResult.data.caloriesMin,
        caloriesMax: intentResult.data.caloriesMax,
        caloriesAvg: intentResult.data.caloriesAvg || 400,
        proteinG: intentResult.data.proteinG,
        carbsG: intentResult.data.carbsG,
        fatG: intentResult.data.fatG,
        foodItems: intentResult.data.foodItems,
        aiMessage: intentResult.responseMessage,
        mealType: intentResult.data.mealType || "lunch",
      });
      triggerConfetti();
    } else if (intentResult.intent === "hydration") {
      const count = intentResult.data?.glasses || 1;
      for (let i = 0; i < count; i++) {
        await incrementGlass();
      }
      triggerConfetti();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] to-[#FFF4E8] rounded-3xl p-6 shadow-2xl border border-white/80 overflow-hidden text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 text-text-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot / Title */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Savor Voice Companion
          </span>
          <h2 className="text-xl font-bold text-text-heading mt-2 font-heading">
            {initialMode === "morning_weight"
              ? "🌅 Morning Weigh-in"
              : isListening
              ? "I'm listening..."
              : "Tap to Speak"}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            {initialMode === "morning_weight"
              ? 'Say: "I weigh 68.5 kilos today"'
              : 'Say a meal, your morning weight, or water'}
          </p>
        </div>

        {/* Glowing Interactive Voice Orb */}
        <div className="my-6 relative flex items-center justify-center">
          {/* Animated Glow Rings */}
          {isListening && (
            <>
              <div className="absolute w-36 h-36 rounded-full bg-primary/20 animate-ping opacity-75" />
              <div className="absolute w-28 h-28 rounded-full bg-accent-secondary/30 animate-pulse" />
            </>
          )}

          <button
            onClick={() => (isListening ? stopListening() : startListening())}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-lg transition-all transform active:scale-95 ${
              isListening
                ? "bg-gradient-to-br from-primary to-[#FF6B4A] text-white shadow-primary/40 scale-105"
                : "bg-gradient-to-br from-amber-100 to-amber-200 text-text-heading shadow-amber-200/50 hover:scale-102"
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-9 h-9 animate-spin text-white" />
            ) : isListening ? (
              <Mic className="w-9 h-9 animate-bounce text-white" />
            ) : (
              <Mic className="w-9 h-9 text-primary" />
            )}
            <span className="text-[10px] font-semibold mt-1">
              {isListening ? "Listening" : "Tap Mic"}
            </span>
          </button>
        </div>

        {/* Live Soundwave Bars */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 h-6 mb-3">
            {[40, 70, 100, 60, 90, 50, 80, 45].map((height, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDuration: `${0.4 + (i % 4) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Live Transcription / Bubble */}
        <div className="min-h-[56px] px-4 py-3 rounded-2xl bg-white/80 border border-amber-100/80 mb-4 flex items-center justify-center">
          {isProcessing ? (
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing with Gemini Flash...</span>
            </div>
          ) : interimTranscript || transcript ? (
            <p className="text-sm font-medium text-text-primary italic">
              "{interimTranscript || transcript}"
            </p>
          ) : (
            <p className="text-xs text-text-muted">
              Speak naturally — e.g. "I had 2 rotis with dal" or "I'm 68.2 kg"
            </p>
          )}
        </div>

        {/* Result & Confirmation Banner */}
        {result && (
          <div className="p-3.5 rounded-2xl bg-green-50 border border-green-200 text-left mb-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-green-800">
                  {result.intent === "morning_weight" && (
                    <>
                      <Scale className="w-3.5 h-3.5" /> Morning Weigh-in Logged!
                    </>
                  )}
                  {result.intent === "meal_log" && (
                    <>
                      <Utensils className="w-3.5 h-3.5" /> Meal Logged!
                    </>
                  )}
                  {result.intent === "hydration" && (
                    <>
                      <Droplets className="w-3.5 h-3.5" /> Hydration Updated!
                    </>
                  )}
                  {result.intent === "coaching_qa" && (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> Savor Answer
                    </>
                  )}
                </div>
                <p className="text-xs text-green-900 mt-1 leading-relaxed">
                  {result.responseMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error notice */}
        {error && (
          <p className="text-xs text-red-500 mb-3 bg-red-50 p-2 rounded-xl border border-red-100">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {result ? (
            <Button onClick={onClose} className="w-full py-3 bg-primary text-white font-semibold">
              Done 🌟
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full py-3 text-xs text-text-secondary"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
