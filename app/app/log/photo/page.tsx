"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { GlassCard } from "@/app/components/ui/glass-card";
import { ArrowLeft, Camera, Image as ImageIcon, Check, Loader2, Plus, Pencil, Trash2, AlertTriangle, Lightbulb, Moon, Database } from "lucide-react";
import Link from "next/link";
import { analyzeFoodImageBox } from "@/app/actions/analyze-meal";
import { calculateMealNutrition, findFoodMatch } from "@/lib/indian-food-db";

interface FoodItem {
    name: string;
    quantity: string;
}

interface MealAnalysis {
    isBalanced: boolean;
    hasProtein: boolean;
    hasCarbs: boolean;
    hasVegetables: boolean;
    hasFats: boolean;
    timeAdvice: string | null;
    improvements: string[];
    alternatives: string[];
    overallMessage: string;
}

// Foods by category for balance analysis
const proteinFoods = ['egg', 'chicken', 'fish', 'meat', 'tofu', 'paneer', 'dal', 'lentil', 'bean', 'curd', 'yogurt', 'milk', 'cheese', 'prawn', 'mutton', 'lamb', 'pork', 'turkey', 'soy', 'nuts', 'almonds', 'peanut'];
const carbFoods = ['rice', 'roti', 'bread', 'pasta', 'noodle', 'idli', 'dosa', 'paratha', 'chapati', 'potato', 'wheat', 'oats', 'cereal', 'quinoa'];
const vegFoods = ['spinach', 'palak', 'carrot', 'tomato', 'onion', 'broccoli', 'cabbage', 'cauliflower', 'beans', 'peas', 'cucumber', 'lettuce', 'salad', 'bhindi', 'gobi', 'vegetable', 'sabzi'];
const fatFoods = ['butter', 'ghee', 'oil', 'cheese', 'cream', 'avocado', 'nuts', 'coconut'];

function analyzeMealBalance(foodItems: FoodItem[]): MealAnalysis {
    const items = foodItems.map(f => f.name.toLowerCase());
    const allItemsText = items.join(' ');

    const hasProtein = proteinFoods.some(p => allItemsText.includes(p));
    const hasCarbs = carbFoods.some(c => allItemsText.includes(c));
    const hasVegetables = vegFoods.some(v => allItemsText.includes(v));
    const hasFats = fatFoods.some(f => allItemsText.includes(f));

    const hour = new Date().getHours();
    const isLateNight = hour >= 21 || hour < 4;
    const isMorning = hour >= 6 && hour < 11;
    const isAfternoon = hour >= 11 && hour < 16;
    const isEvening = hour >= 16 && hour < 21;

    const improvements: string[] = [];
    const alternatives: string[] = [];
    let timeAdvice: string | null = null;
    let overallMessage = '';

    // Balance check
    const balanceScore = [hasProtein, hasCarbs, hasVegetables].filter(Boolean).length;
    const isBalanced = balanceScore >= 2 && hasProtein;

    // Generate gentle, curious suggestions (never demands)
    if (!hasProtein) {
        improvements.push('If you want this to keep you full longer, protein helps');
    }
    if (!hasVegetables && !isMorning && !hasProtein) {
        improvements.push('Adding veggies would round this out nicely');
    }
    if (hasCarbs && !hasProtein) {
        improvements.push('Pairing carbs with protein can smooth out the energy curve');
    }

    // Late night - gentle, never scolding
    if (isLateNight) {
        if (hasCarbs && !hasProtein) {
            timeAdvice = "Late night snack? Totally okay sometimes.";
            alternatives.push('If you\'re not actually hungry, a glass of water might do');
            alternatives.push('Lighter options: warm milk, yogurt, or a few nuts');
        } else {
            timeAdvice = "Night eating is fine—just noticing the time.";
        }
    }

    // Generate overall message - observation, never judgment
    // Randomize for variety
    const balancedMessages = [
        "Nice variety here.",
        "This has a good mix.",
        "Solid combination."
    ];
    const carbHeavyMessages = [
        "Comfort food vibes—nothing wrong with that.",
        "Carb-forward meal. Cozy and quick.",
        "This'll give you quick energy."
    ];
    const noProteinMessages = [
        "Protein: not in this one. That's okay.",
        "Light on protein—you might get hungry sooner.",
        "More of a quick-energy meal."
    ];
    const neutralMessages = [
        "Logged.",
        "Got it.",
        "Noted."
    ];

    if (isBalanced) {
        overallMessage = balancedMessages[Math.floor(Math.random() * balancedMessages.length)];
    } else if (hasCarbs && !hasProtein && !hasVegetables) {
        overallMessage = carbHeavyMessages[Math.floor(Math.random() * carbHeavyMessages.length)];
    } else if (hasProtein && !hasCarbs) {
        overallMessage = "Good protein! Pair with carbs if you need energy.";
    } else if (!hasProtein) {
        overallMessage = noProteinMessages[Math.floor(Math.random() * noProteinMessages.length)];
    } else {
        overallMessage = neutralMessages[Math.floor(Math.random() * neutralMessages.length)];
    }

    return {
        isBalanced,
        hasProtein,
        hasCarbs,
        hasVegetables,
        hasFats,
        timeAdvice,
        improvements: improvements.slice(0, 2),
        alternatives: alternatives.slice(0, 2),
        overallMessage
    };
}

import { useSavorData } from "@/app/hooks/use-savor-data";

export default function PhotoLogPage() {
    const router = useRouter();
    const { logMeal } = useSavorData();
    const [image, setImage] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");
    const [isTimeout, setIsTimeout] = useState(false);
    const [lastFile, setLastFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [mealAnalysis, setMealAnalysis] = useState<MealAnalysis | null>(null);
    const [note, setNote] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [portion, setPortion] = useState<'small' | 'regular' | 'large'>('regular');
    const [mealTime, setMealTime] = useState<string>("");
    const [dbNutrition, setDbNutrition] = useState<any>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const portionMultipliers = { small: 0.7, regular: 1.0, large: 1.4 };

    useEffect(() => {
        // Set default meal time based on current hour
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 11) setMealTime("breakfast");
        else if (hour >= 11 && hour < 16) setMealTime("lunch");
        else if (hour >= 16 && hour < 21) setMealTime("dinner");
        else setMealTime("snack");
    }, []);

    // Re-analyze when food items change
    useEffect(() => {
        if (foodItems.length > 0) {
            setMealAnalysis(analyzeMealBalance(foodItems));
            // Calculate nutrition from database
            const nutrition = calculateMealNutrition(
                foodItems.map(f => f.name),
                portionMultipliers[portion]
            );
            setDbNutrition(nutrition);
        }
    }, [foodItems, portion]);

    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setError("");
            setIsTimeout(false);
            setResult(null);
            setFoodItems([]);
            setMealAnalysis(null);
            setLastFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(file);
            handleAnalyze(file);
        }
    };

    const handleAnalyze = async (file: File) => {
        setAnalyzing(true);
        setError("");
        setIsTimeout(false);

        const formData = new FormData();
        formData.append("image", file);

        const response = await analyzeFoodImageBox(formData);
        setAnalyzing(false);

        if (response.success) {
            setResult(response.data);
            const items = (response.data.foodItems || []).map((name: string) => ({
                name,
                quantity: "1 serving"
            }));
            setFoodItems(items);
        } else {
            setError(response.error || "Something went wrong");
            setIsTimeout(response.timeout || false);
        }
    };

    const handleRetry = () => {
        if (lastFile) {
            handleAnalyze(lastFile);
        }
    };

    const updateFoodItem = (index: number, field: 'name' | 'quantity', value: string) => {
        setFoodItems(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const removeFoodItem = (index: number) => {
        setFoodItems(prev => prev.filter((_, i) => i !== index));
    };

    const addFoodItem = () => {
        setFoodItems(prev => [...prev, { name: "", quantity: "1 serving" }]);
        setEditingIndex(foodItems.length);
    };

    const handleLogMeal = async () => {
        setAnalyzing(true);

        try {
            const mealName = foodItems.map(f => f.name).filter(Boolean).join(", ") || "Photo Logged Meal";
            const caloriesAvg = dbNutrition?.calories || parseInt(result?.calories) || 400;
            const proteinG = dbNutrition?.protein || parseInt(result?.protein) || 15;
            const carbsG = dbNutrition?.carbs || parseInt(result?.carbs) || 45;
            const fatG = dbNutrition?.fats || parseInt(result?.fats) || 12;

            await logMeal({
                name: mealName,
                caloriesAvg,
                proteinG,
                carbsG,
                fatG,
                foodItems: foodItems.map(f => f.name),
                aiMessage: result?.message || "Meal logged with care!",
                mealType: mealTime || "lunch",
            });

            router.push('/');
        } catch (err: any) {
            console.error('Error logging meal:', err);
            setError("Failed to save meal. Please try again.");
            setAnalyzing(false);
        }
    };

    return (
        <main className="min-h-screen p-6 bg-app relative overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-3xl -z-10" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <H1 className="text-xl">Log Meal</H1>
            </div>

            <div className="max-w-md mx-auto space-y-6">

                {/* Upload Area */}
                {!image ? (
                    <div className="space-y-4">
                        <GlassCard
                            className="p-6 flex items-center gap-4 cursor-pointer hover:bg-white/60 transition-colors"
                            onClick={() => cameraInputRef.current?.click()}
                        >
                            <div className="p-3 bg-primary/10 rounded-full">
                                <Camera className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <Text className="font-medium">Take Photo</Text>
                                <Caption>Use your camera to snap a pic</Caption>
                            </div>
                        </GlassCard>

                        <GlassCard
                            className="p-6 flex items-center gap-4 cursor-pointer hover:bg-white/60 transition-colors"
                            onClick={() => galleryInputRef.current?.click()}
                        >
                            <div className="p-3 bg-secondary/20 rounded-full">
                                <ImageIcon className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <Text className="font-medium">Choose from Gallery</Text>
                                <Caption>Upload an existing photo</Caption>
                            </div>
                        </GlassCard>

                        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCapture} />
                        <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleCapture} />
                    </div>
                ) : (
                    <div className="relative rounded-[var(--radius-card)] overflow-hidden shadow-md">
                        <img src={image} alt="Meal preview" className="w-full h-48 object-cover" />
                        <button
                            onClick={() => { setImage(null); setResult(null); setFoodItems([]); setMealAnalysis(null); }}
                            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Loading */}
                {analyzing && (
                    <GlassCard className="p-6 flex flex-col items-center text-center gap-3 animate-pulse">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <H1 className="text-lg">Analyzing your meal...</H1>
                        <Caption>Checking nutritional balance</Caption>
                    </GlassCard>
                )}

                {/* Error */}
                {error && (
                    <GlassCard className="p-6 flex flex-col items-center text-center gap-3 border-red-200 bg-red-50/50">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                        <H1 className="text-lg text-red-600">
                            {isTimeout ? "Analysis Timed Out" : "Oops!"}
                        </H1>
                        <Text className="text-sm">{error}</Text>
                        <Button onClick={handleRetry} variant="secondary" size="sm">
                            Try Again
                        </Button>
                    </GlassCard>
                )}

                {/* Result - Smart Feedback */}
                {result && !analyzing && mealAnalysis && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">

                        <GlassCard className="p-6 space-y-4">
                            {/* Header with calories */}
                            <div className="flex justify-between items-center">
                                <H1 className="text-lg">Detected Items</H1>
                                <div className="flex items-center gap-2">
                                    {dbNutrition?.accuracy === 'database' && (
                                        <div className="flex items-center gap-1 text-green-600" title="From Indian Food Database">
                                            <Database className="w-3 h-3" />
                                        </div>
                                    )}
                                    <div className="bg-primary/10 px-3 py-1 rounded-full">
                                        <Text className="font-bold text-sm text-primary">
                                            {dbNutrition?.accuracy === 'database'
                                                ? `${dbNutrition.calories} kcal`
                                                : `${result.calories} kcal`}
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            {/* Database accuracy note */}
                            {dbNutrition?.matchedItems?.length > 0 && (
                                <div className="text-xs text-green-600 flex items-center gap-1">
                                    <Database className="w-3 h-3" />
                                    Matched: {dbNutrition.matchedItems.join(', ')}
                                </div>
                            )}

                            {/* Balance indicator */}
                            <div className={`p-3 rounded-lg flex items-center gap-3 ${mealAnalysis.isBalanced ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                                {mealAnalysis.isBalanced ? (
                                    <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                                )}
                                <Text className={`text-sm ${mealAnalysis.isBalanced ? 'text-green-700' : 'text-amber-700'}`}>
                                    {mealAnalysis.overallMessage}
                                </Text>
                            </div>

                            {/* Nutrient badges */}
                            <div className="flex flex-wrap gap-2">
                                <span className={`px-2 py-1 rounded text-xs ${mealAnalysis.hasProtein ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {mealAnalysis.hasProtein ? '✓ Protein' : '✗ No Protein'}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${mealAnalysis.hasCarbs ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {mealAnalysis.hasCarbs ? '✓ Carbs' : 'No Carbs'}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${mealAnalysis.hasVegetables ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {mealAnalysis.hasVegetables ? '✓ Veggies' : 'No Veggies'}
                                </span>
                            </div>

                            {/* Food items */}
                            <div className="space-y-2">
                                {foodItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 bg-white/50 rounded-lg">
                                        {editingIndex === index ? (
                                            <Input
                                                value={item.name}
                                                onChange={(e) => updateFoodItem(index, 'name', e.target.value)}
                                                placeholder="Food name"
                                                className="flex-1 text-sm"
                                                autoFocus
                                                onBlur={() => setEditingIndex(null)}
                                            />
                                        ) : (
                                            <>
                                                <Text className="flex-1 text-sm">{item.name}</Text>
                                                <button onClick={() => setEditingIndex(index)} className="p-1 text-muted hover:text-primary">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => removeFoodItem(index)} className="p-1 text-muted hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={addFoodItem}
                                    className="w-full p-3 border-2 border-dashed border-muted/30 rounded-lg text-sm text-muted hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>
                        </GlassCard>

                        {/* Improvements */}
                        {mealAnalysis.improvements.length > 0 && (
                            <GlassCard className="p-4 space-y-2">
                                <H2 className="text-sm flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                    Make it better
                                </H2>
                                {mealAnalysis.improvements.map((tip, i) => (
                                    <Text key={i} className="text-sm text-muted">• {tip}</Text>
                                ))}
                            </GlassCard>
                        )}

                        {/* Late night warning */}
                        {mealAnalysis.timeAdvice && (
                            <GlassCard className="p-4 border-purple-200 bg-purple-50/50 space-y-2">
                                <H2 className="text-sm flex items-center gap-2 text-purple-700">
                                    <Moon className="w-4 h-4" />
                                    Time to consider
                                </H2>
                                <Text className="text-sm text-purple-700">{mealAnalysis.timeAdvice}</Text>
                                {mealAnalysis.alternatives.map((alt, i) => (
                                    <Text key={i} className="text-sm text-purple-600">• {alt}</Text>
                                ))}
                            </GlassCard>
                        )}

                        {/* Portion size selector */}
                        <GlassCard className="p-4">
                            <Caption className="block mb-2">How much did you eat?</Caption>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: 'small' as const, label: 'Light', hint: 'Half plate', emoji: '🥄' },
                                    { id: 'regular' as const, label: 'Normal', hint: 'Full plate', emoji: '🍽️' },
                                    { id: 'large' as const, label: 'Heavy', hint: 'Seconds', emoji: '🍲' },
                                ].map((size) => (
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
                                        <span className={`text-xs ${portion === size.id ? 'text-white/70' : 'text-muted'}`}>
                                            {size.hint}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Meal time selector */}
                        <GlassCard className="p-4">
                            <Caption className="block mb-2">When are you having this?</Caption>
                            <div className="flex gap-2">
                                {['breakfast', 'lunch', 'dinner', 'snack'].map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setMealTime(time)}
                                        className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${mealTime === time ? 'bg-primary text-white' : 'bg-white/50 text-muted'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </GlassCard>

                        {/* Note */}
                        <GlassCard className="p-4">
                            <Caption className="block mb-2">Add a note (optional)</Caption>
                            <Input
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g., Post-workout meal"
                                className="w-full"
                            />
                        </GlassCard>

                        {/* Log Button */}
                        <Button onClick={handleLogMeal} className="w-full py-5">
                            <Check className="w-4 h-4 mr-2" /> Confirm & Log
                        </Button>
                    </div>
                )}
            </div>
        </main>
    );
}
