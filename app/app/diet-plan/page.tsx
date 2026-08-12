"use client";

import { useState } from "react";
import { SoftCard } from "@/app/components/ui/soft-card";
import { Button } from "@/app/components/ui/button";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { ArrowLeft, RefreshCw, Loader2, ChevronLeft, ChevronRight, Utensils, Sparkles, ChefHat } from "lucide-react";
import Link from "next/link";
import { findFoodMatch, FoodEntry } from "@/lib/indian-food-db";
import { RecipeModal } from "@/app/components/diet-plan/recipe-modal";
import { generateDietPlan } from "@/app/actions/generate-diet-plan";
import { useSavorData } from "@/app/hooks/use-savor-data";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const cuisines = ["Any", "Indian", "Mediterranean", "Mexican", "American", "Vegan Global"];

export default function DietPlanPage() {
  const { profile, dietPlan, saveDietPlan } = useSavorData();
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedMeal, setSelectedMeal] = useState<{ name: string; data: FoodEntry | null } | null>(null);
  const [cuisine, setCuisine] = useState("Indian");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!profile) return;
    setGenerating(true);
    setError("");

    try {
      const response = await generateDietPlan(profile, cuisine);

      if (response.success && response.plan) {
        await saveDietPlan(cuisine, response.plan);
      } else {
        setError(response.error || "Could not generate diet plan. Please try again.");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const getDateForDay = (dayIndex: number) => {
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7;
    const diff = dayIndex - currentDayIndex;
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };

  const handleMealClick = (mealName: string) => {
    const match = findFoodMatch(mealName);
    setSelectedMeal({ name: mealName, data: match });
  };

  // Empty state if no plan yet
  if (!dietPlan && !generating) {
    return (
      <main className="min-h-screen p-6 bg-gradient-to-b from-[#FFFDF9] to-[#FFF4E8] pb-24 relative overflow-hidden flex flex-col items-center justify-center max-w-md mx-auto">
        <Link href="/" className="absolute top-6 left-6">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/70 shadow-xs">
            <ArrowLeft className="w-5 h-5 text-text-heading" />
          </Button>
        </Link>

        <div className="text-center w-full space-y-5">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center mx-auto text-primary shadow-md animate-bounce-gentle">
            <ChefHat className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Dietician</span>
            </div>
            <H1 className="text-2xl font-black text-text-heading font-heading">Personal Diet Plan</H1>
            <Text className="text-text-secondary text-xs mt-1.5 leading-relaxed max-w-xs mx-auto">
              Get a custom 7-day nourishing menu based on your {profile?.goal || "healthy living"} goal and calorie target (~{profile?.dailyCalories || 2000} kcal).
            </Text>
          </div>

          <div className="space-y-2 pt-2">
            <Caption className="text-xs font-bold text-text-heading uppercase tracking-wider block">
              Choose Cuisine
            </Caption>
            <div className="flex flex-wrap justify-center gap-2">
              {cuisines.map((c) => (
                <button
                  key={c}
                  onClick={() => setCuisine(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                    cuisine === c
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white/80 text-text-secondary border-amber-200/60 hover:bg-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-2xl text-xs">
              {error}
            </div>
          )}

          <Button
            onClick={handleGenerate}
            className="w-full py-5 bg-gradient-to-r from-primary to-[#F27233] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-primary/25 rounded-2xl"
          >
            Generate 7-Day Plan ✨
          </Button>
        </div>
      </main>
    );
  }

  // Loading State
  if (generating) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FFF7ED] p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 animate-pulse-glow">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
        <H2 className="text-xl font-bold text-text-heading font-heading">Crafting your 7-day menu...</H2>
        <Text className="text-text-secondary text-xs mt-1">
          Consulting AI Nutritionist for {cuisine} cuisine (~{profile?.dailyCalories || 2000} kcal/day)
        </Text>
      </main>
    );
  }

  const currentDayName = daysOfWeek[currentDay];
  const dayPlan = dietPlan ? dietPlan[currentDayName] || {} : {};

  return (
    <main className="min-h-screen p-4 pt-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] pb-24 relative overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white/80 border border-amber-200/60 shadow-xs">
              <ArrowLeft className="w-5 h-5 text-text-heading" />
            </Button>
          </Link>
          <div>
            <H1 className="text-xl font-black text-text-heading font-heading">Your Diet Plan</H1>
            <Caption className="text-[11px] text-text-muted">Week of {getDateForDay(0)}</Caption>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleGenerate}
          className="rounded-2xl bg-white/80 border border-amber-200/60 shadow-xs text-text-secondary"
          title="Regenerate Plan"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Day Selector */}
      <div className="flex justify-between items-center mb-5 bg-white/80 border border-amber-200/60 p-1.5 rounded-2xl shadow-xs">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-8 w-8 text-text-heading"
          onClick={() => setCurrentDay((prev) => Math.max(0, prev - 1))}
          disabled={currentDay === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <span className="font-bold text-base text-text-heading block font-heading">{currentDayName}</span>
          <span className="text-[10px] text-text-muted">{getDateForDay(currentDay)}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-8 w-8 text-text-heading"
          onClick={() => setCurrentDay((prev) => Math.min(6, prev + 1))}
          disabled={currentDay === 6}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {["breakfast", "lunch", "snack", "dinner"].map((type) => {
          const meal = dayPlan[type];
          const mealName = typeof meal === "object" ? meal?.name : meal;
          const calories = typeof meal === "object" ? meal?.calories : null;
          const protein = typeof meal === "object" ? meal?.protein : null;
          const carbs = typeof meal === "object" ? meal?.carbs : null;
          const fat = typeof meal === "object" ? meal?.fat : null;

          return (
            <SoftCard
              key={type}
              className="p-4 bg-white/90 border border-amber-100/80 rounded-3xl shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className="uppercase tracking-wider text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {type}
                </span>
                {calories && (
                  <span className="text-xs font-bold text-text-heading">
                    ~{calories} kcal
                  </span>
                )}
              </div>

              <div
                onClick={() => mealName && handleMealClick(mealName)}
                className="cursor-pointer group mt-1"
              >
                <Text className="font-bold text-sm text-text-heading leading-snug group-hover:text-primary transition-colors">
                  {mealName || "Nutritious balanced meal"}
                </Text>
              </div>

              {/* Nutrition Badges */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {protein && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                    {protein}g protein
                  </span>
                )}
                {carbs && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full">
                    {carbs}g carbs
                  </span>
                )}
                {fat && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-full">
                    {fat}g fat
                  </span>
                )}
              </div>
            </SoftCard>
          );
        })}
      </div>

      {/* Recipe Modal */}
      {selectedMeal && (
        <RecipeModal
          isOpen={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          mealName={selectedMeal.name}
          nutritionData={selectedMeal.data}
        />
      )}
    </main>
  );
}
