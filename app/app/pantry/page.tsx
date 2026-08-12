"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/app/components/ui/glass-card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { ArrowLeft, ChefHat, Plus, X, Loader2, Mic, MicOff } from "lucide-react";
import Link from "next/link";
import { generateRecipes } from "@/app/actions/generate-pantry-recipes";
import { useSpeechRecognition } from "@/app/hooks/use-speech-recognition";

const quickIngredients = [
    "Rice", "Eggs", "Chicken", "Onion", "Tomato", "Potato", "Bread", "Milk", "Cheese", "Pasta"
];

const cuisines = ["Any", "Indian", "Italian", "Mexican", "Chinese", "American"];

export default function PantryPage() {
    const router = useRouter();
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState<any[]>([]);
    const [cuisine, setCuisine] = useState("Any");
    const [error, setError] = useState("");

    // Voice input hook
    const {
        isListening,
        isSupported,
        error: voiceError,
        startListening,
        stopListening
    } = useSpeechRecognition({
        onResult: (transcript) => {
            // Parse the transcript to extract ingredients
            // Split by common separators: comma, "and", spaces
            const rawIngredients = transcript
                .toLowerCase()
                .split(/[,]|and|&/)
                .map(s => s.trim())
                .filter(s => s.length > 0);

            // Add each ingredient
            rawIngredients.forEach(ing => addIngredient(ing));
        },
        onError: (err) => {
            setError(err);
        }
    });

    const addIngredient = (ingredient: string) => {
        const trimmed = ingredient.trim().toLowerCase();
        if (trimmed && !ingredients.includes(trimmed)) {
            setIngredients(prev => [...prev, trimmed]);
        }
        setInputValue("");
        setError("");
    };

    const removeIngredient = (ingredient: string) => {
        setIngredients(prev => prev.filter(i => i !== ingredient));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addIngredient(inputValue);
        }
    };

    const handleVoiceToggle = () => {
        if (isListening) {
            stopListening();
        } else {
            setError(""); // Clear previous errors
            startListening();
        }
    };

    const findRecipes = async () => {
        if (ingredients.length === 0) return;

        setLoading(true);
        setError("");
        setRecipes([]);

        const response = await generateRecipes(ingredients, cuisine);

        setLoading(false);

        if (response.success) {
            setRecipes(response.recipes);
        } else {
            setError(response.error || "Could not generate recipes");
        }
    };

    return (
        <main className="min-h-screen p-6 bg-app relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <H1 className="text-xl">Pantry Mode</H1>
                    <Caption>Tell me what you have, I'll suggest recipes</Caption>
                </div>
            </div>

            <div className="max-w-md mx-auto space-y-6">
                {/* Input with Voice Button */}
                <GlassCard className="p-4">
                    <div className="flex gap-2 mb-3">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? "Listening..." : "Type or say ingredients..."}
                            className="flex-1"
                            disabled={isListening}
                        />
                        <Button onClick={() => addIngredient(inputValue)} size="icon" disabled={!inputValue.trim() || isListening}>
                            <Plus className="w-5 h-5" />
                        </Button>

                        {/* Voice Input Button */}
                        {isSupported && (
                            <Button
                                onClick={handleVoiceToggle}
                                size="icon"
                                variant={isListening ? "destructive" : "secondary"}
                                className={`transition-all ${isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : ''}`}
                            >
                                {isListening ? (
                                    <MicOff className="w-5 h-5" />
                                ) : (
                                    <Mic className="w-5 h-5" />
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Voice Status Indicator */}
                    {isListening && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            Listening... Say your ingredients (e.g. "eggs, tomato, cheese")
                        </div>
                    )}

                    {/* Quick Add */}
                    <div className="flex flex-wrap gap-2">
                        {quickIngredients.filter(i => !ingredients.includes(i.toLowerCase())).slice(0, 6).map(ing => (
                            <button
                                key={ing}
                                onClick={() => addIngredient(ing)}
                                className="px-3 py-1 bg-white/50 rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                                + {ing}
                            </button>
                        ))}
                    </div>
                </GlassCard>

                {/* Selected Ingredients */}
                {ingredients.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Caption className="block mb-2">Your ingredients ({ingredients.length})</Caption>
                        <div className="flex flex-wrap gap-2">
                            {ingredients.map(ing => (
                                <div
                                    key={ing}
                                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                                >
                                    {ing}
                                    <button onClick={() => removeIngredient(ing)} className="hover:text-red-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cuisine Selection */}
                {ingredients.length > 0 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                        <Caption className="block mb-2">Preferred Cuisine</Caption>
                        <div className="flex flex-wrap gap-2">
                            {cuisines.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCuisine(c)}
                                    className={`px-3 py-1 rounded-full text-sm border transition-all ${cuisine === c
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white/50 text-gray-600 border-transparent hover:bg-white"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Find Recipes Button */}
                <Button
                    onClick={findRecipes}
                    className="w-full py-5"
                    disabled={ingredients.length === 0 || loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Asking Chef Gemini...
                        </>
                    ) : (
                        <>
                            <ChefHat className="w-5 h-5 mr-2" />
                            Find Recipes
                        </>
                    )}
                </Button>

                {/* Error Message */}
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Results */}
                {recipes.length > 0 && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <Text className="font-medium">Suggestions for you:</Text>
                        {recipes.map(recipe => (
                            <Link href={`/recipe/${recipe.id}?name=${encodeURIComponent(recipe.name)}&time=${recipe.time}&calories=${recipe.calories}&ingredients=${ingredients.join(',')}`} key={recipe.id}>
                                <GlassCard className="p-4 hover:bg-white/60 transition-colors cursor-pointer mb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Text className="font-semibold text-lg">{recipe.name}</Text>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Caption>{recipe.time}</Caption>
                                                <span className="text-gray-300">•</span>
                                                <Caption>{recipe.calories} kcal</Caption>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {recipe.ingredients.slice(0, 3).map((ing: string, i: number) => (
                                                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-secondary/20 rounded text-secondary-dark uppercase tracking-wider">
                                                        {ing}
                                                    </span>
                                                ))}
                                                {recipe.ingredients.length > 3 && (
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                                                        +{recipe.ingredients.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${recipe.match >= 80 ? 'bg-green-100 text-green-700' :
                                            recipe.match >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {recipe.match}% match
                                        </div>
                                    </div>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
