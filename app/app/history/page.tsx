"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SoftCard } from "@/app/components/ui/soft-card";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Loader2, Camera, ChevronRight, Utensils, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSavorData } from "@/app/hooks/use-savor-data";

export default function HistoryPage() {
  const router = useRouter();
  const { todayMeals, deleteMeal } = useSavorData();
  const [allMeals, setAllMeals] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("savor_meals") || "[]");
      setAllMeals(stored);
    } catch (e) {}
  }, [todayMeals]);

  const displayMeals = allMeals.length > 0 ? allMeals : todayMeals;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const handleDelete = async (mealId: string) => {
    await deleteMeal(mealId);
    setAllMeals((prev) => prev.filter((m) => m.id !== mealId && m._id !== mealId));
  };

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
            <H1 className="text-xl font-black text-text-heading font-heading">Meal History</H1>
            <Caption className="text-[11px] text-text-muted">Review your mindful meals</Caption>
          </div>
        </div>

        <Link href="/log/photo">
          <Button className="py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white shadow-xs font-bold text-xs flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>Add Meal</span>
          </Button>
        </Link>
      </div>

      {/* Meals Feed */}
      {displayMeals.length > 0 ? (
        <div className="space-y-3">
          {displayMeals.map((meal) => {
            const mealId = meal.id || meal._id;
            const calories = meal.caloriesAvg || meal.calories || 0;
            return (
              <SoftCard
                key={mealId}
                className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <H2 className="text-sm font-bold text-text-heading">{meal.name}</H2>
                      <span className="text-[10px] text-text-muted">
                        {formatDate(meal.loggedAt || meal.logged_at)} at {formatTime(meal.loggedAt || meal.logged_at)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(mealId)}
                    className="p-1.5 text-text-muted hover:text-red-500 rounded-lg transition-colors"
                    title="Delete meal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {meal.aiMessage && (
                  <p className="text-xs text-text-secondary italic bg-[#FFF8F0] p-2.5 rounded-2xl border border-amber-100/70 mb-2">
                    "{meal.aiMessage}"
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-amber-100/60">
                  <span className="text-xs font-black text-primary">
                    ~{calories} kcal
                  </span>
                  {meal.proteinG && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      {meal.proteinG}g protein
                    </span>
                  )}
                </div>
              </SoftCard>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-100/80 text-primary flex items-center justify-center mx-auto mb-3">
            <Utensils className="w-8 h-8" />
          </div>
          <H2 className="text-base font-bold text-text-heading font-heading">No meals logged yet</H2>
          <Text className="text-xs text-text-muted mt-1 max-w-xs mx-auto">
            Take a photo or use your voice to log your first meal!
          </Text>
        </div>
      )}
    </main>
  );
}
