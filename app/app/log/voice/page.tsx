"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { GlassCard } from "@/app/components/ui/glass-card";
import { ArrowLeft, Mic, StopCircle, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { analyzeFoodText } from "@/app/actions/analyze-text";

const portionSizes = [
    { id: 'small', label: 'Light', emoji: '🥄', multiplier: 0.7, hint: 'Half plate or snack-sized' },
    { id: 'regular', label: 'Normal', emoji: '🍽️', multiplier: 1.0, hint: 'One full plate' },
    { id: 'large', label: 'Heavy', emoji: '🍲', multiplier: 1.4, hint: 'Extra helping or seconds' },
];

export default function VoiceLogPage() {
    const router = useRouter();
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [recognition, setRecognition] = useState<any>(null);
    const [portion, setPortion] = useState('regular');

    useEffect(() => {
        if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
            // @ts-ignore
            const speech = new window.webkitSpeechRecognition();
            speech.continuous = false;
            speech.interimResults = true;
            speech.lang = "en-US";

            speech.onresult = (event: any) => {
                const current = event.resultIndex;
                const transcriptText = event.results[current][0].transcript;
                setTranscript(transcriptText);
            };

            speech.onend = () => {
                setIsListening(false);
            };

            setRecognition(speech);
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            setTranscript("");
            setResult(null);
            recognition.start();
            setIsListening(true);
        }
    };

    const handleAnalyze = async () => {
        if (!transcript) return;
        setAnalyzing(true);
        const response = await analyzeFoodText(transcript);
        setAnalyzing(false);

        if (response.success) {
            setResult(response.data);
        }
    };

    const handleLogMeal = () => {
        if (!result) return;

        // Adjust calories based on portion
        const portionMultiplier = portionSizes.find(p => p.id === portion)?.multiplier || 1.0;
        const baseCalories = parseInt(result.calories?.split('-')[0] || '0');
        const adjustedCalories = Math.round(baseCalories * portionMultiplier);

        // Store meal in localStorage
        const meals = JSON.parse(localStorage.getItem('savor_meals') || '[]');
        meals.push({
            id: Date.now(),
            image: null,
            foodItems: (result.foodItems || []).map((name: string) => ({ name, quantity: '1 serving' })),
            calories: `${adjustedCalories}-${Math.round(adjustedCalories * 1.2)}`,
            protein: result.protein || 'Unknown',
            portion,
            note: transcript,
            loggedAt: new Date().toISOString()
        });
        localStorage.setItem('savor_meals', JSON.stringify(meals));
        router.push('/');
    };

    return (
        <main className="min-h-screen p-6 bg-app relative overflow-hidden flex flex-col items-center">
            {/* Background decorations */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="w-full flex items-center gap-4 mb-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <H1 className="text-xl">Tell me about it</H1>
            </div>

            <div className="w-full max-w-md space-y-4 flex-1 flex flex-col justify-center pb-20">

                {/* Transcript Area */}
                <div className={`transition-all duration-300 ${transcript ? 'opacity-100' : 'opacity-50'}`}>
                    <H1 className={`text-2xl font-medium text-center ${isListening ? 'animate-pulse' : ''}`}>
                        {transcript || (isListening ? "Listening..." : "Tap the mic and speak...")}
                    </H1>
                </div>

                {/* Mic Button */}
                <div className="flex justify-center py-6 relative">
                    {isListening && (
                        <div className="absolute inset-0 bg-secondary/20 rounded-full blur-xl animate-pulse scale-150" />
                    )}
                    <Button
                        variant={isListening ? "secondary" : "primary"}
                        size="icon"
                        className="h-20 w-20 rounded-full shadow-2xl z-10"
                        onClick={toggleListening}
                    >
                        {isListening ? <StopCircle className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </Button>
                </div>

                {/* Analyze Button */}
                {transcript && !isListening && !result && (
                    <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4">
                        <Button onClick={handleAnalyze} disabled={analyzing}>
                            {analyzing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {analyzing ? "Thinking..." : "Analyze Meal"}
                        </Button>
                    </div>
                )}

                {/* Result State */}
                {result && (
                    <GlassCard className="p-5 space-y-4 animate-in fade-in slide-in-from-bottom-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <H1 className="text-lg text-primary capitalize">
                                    {result.foodItems?.[0] || "Meal"}
                                </H1>
                                <Caption>{result.foodItems?.join(", ")}</Caption>
                            </div>
                            <div className="bg-secondary/20 px-3 py-1 rounded-full border border-secondary/30">
                                <Text className="font-bold text-sm">{result.calories} kcal</Text>
                            </div>
                        </div>

                        <div className="p-3 bg-white/40 rounded-xl border border-white/50">
                            <Text className="italic text-sm">"{result.message}"</Text>
                        </div>

                        {/* Portion Size Selector */}
                        <div>
                            <H2 className="text-sm mb-3">How much did you eat?</H2>
                            <div className="grid grid-cols-3 gap-2">
                                {portionSizes.map((size) => (
                                    <button
                                        key={size.id}
                                        onClick={() => setPortion(size.id)}
                                        className={`py-3 px-2 rounded-xl text-center transition-all flex flex-col items-center gap-1 ${portion === size.id
                                            ? 'bg-primary text-white shadow-lg'
                                            : 'bg-white/50 text-muted hover:bg-white/70'
                                            }`}
                                    >
                                        <span className="text-xl">{size.emoji}</span>
                                        <span className={`font-medium text-sm ${portion === size.id ? 'text-white' : ''}`}>
                                            {size.label}
                                        </span>
                                        <span className={`text-xs leading-tight ${portion === size.id ? 'text-white/70' : 'text-muted'}`}>
                                            {size.hint}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Log Button - Now works! */}
                        <Button onClick={handleLogMeal} className="w-full py-5">
                            <Check className="w-4 h-4 mr-2" /> Log Meal
                        </Button>
                    </GlassCard>
                )}

            </div>
        </main>
    );
}
