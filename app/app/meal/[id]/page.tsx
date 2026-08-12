"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { SoftCard } from "@/app/components/ui/soft-card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { ArrowLeft, Pencil, Trash2, Plus, Save, X, Utensils, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSavorData } from "@/app/hooks/use-savor-data";

export default function MealDetailPage() {
  const router = useRouter();
  const params = useParams();
  const mealId = params.id as string;
  const { deleteMeal } = useSavorData();

  const [meal, setMeal] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedCalories, setEditedCalories] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("savor_meals") || "[]");
      const found = stored.find((m: any) => m.id === mealId || m._id === mealId);
      if (found) {
        setMeal(found);
        setEditedName(found.name || "");
        setEditedCalories(found.caloriesAvg?.toString() || found.calories?.toString() || "400");
      }
    } catch (e) {}
    setLoading(false);
  }, [mealId]);

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr || Date.now());
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleSave = () => {
    if (!meal) return;
    const updated = {
      ...meal,
      name: editedName,
      caloriesAvg: parseInt(editedCalories) || 400,
    };
    setMeal(updated);

    try {
      const stored = JSON.parse(localStorage.getItem("savor_meals") || "[]");
      const next = stored.map((m: any) =>
        m.id === mealId || m._id === mealId ? updated : m
      );
      localStorage.setItem("savor_meals", JSON.stringify(next));
    } catch (e) {}

    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this meal?")) return;
    await deleteMeal(mealId);
    router.push("/history");
  };

  if (loading) {
    return (
      <main className="min-h-screen p-6 bg-[#FFF7ED] flex items-center justify-center">
        <Text>Loading meal details...</Text>
      </main>
    );
  }

  if (!meal) {
    return (
      <main className="min-h-screen p-6 bg-[#FFF7ED] flex flex-col items-center justify-center max-w-md mx-auto text-center">
        <H1 className="text-xl mb-2">Meal not found</H1>
        <Link href="/history">
          <Button className="mt-4">Back to History</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 pt-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] pb-24 relative overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <Link href="/history">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white/80 border border-amber-200/60 shadow-xs">
              <ArrowLeft className="w-5 h-5 text-text-heading" />
            </Button>
          </Link>
          <div>
            <H1 className="text-xl font-black text-text-heading font-heading">Meal Details</H1>
            <Caption className="text-[11px] text-text-muted">{formatDateTime(meal.loggedAt || meal.logged_at)}</Caption>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Card */}
      <SoftCard className="p-5 bg-white/90 border border-amber-100 rounded-3xl shadow-sm mb-4">
        {editing ? (
          <div className="space-y-3">
            <div>
              <Caption className="text-[10px] font-bold uppercase text-text-muted mb-1 block">Dish Name</Caption>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="bg-white text-xs py-2 rounded-xl"
              />
            </div>
            <div>
              <Caption className="text-[10px] font-bold uppercase text-text-muted mb-1 block">Calories (~kcal)</Caption>
              <Input
                type="number"
                value={editedCalories}
                onChange={(e) => setEditedCalories(e.target.value)}
                className="bg-white text-xs py-2 rounded-xl"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="flex-1 py-3 text-xs bg-primary text-white font-bold">
                <Save className="w-3.5 h-3.5 mr-1" /> Save
              </Button>
              <Button variant="outline" onClick={() => setEditing(false)} className="py-3 text-xs">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <H1 className="text-lg font-black text-text-heading font-heading">{meal.name}</H1>
                  <span className="text-xs font-bold text-primary">
                    ~{meal.caloriesAvg || meal.calories || 400} kcal
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-text-secondary transition-colors"
                title="Edit meal"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {meal.aiMessage && (
              <div className="mt-4 p-3 bg-amber-50/80 border border-amber-100 rounded-2xl text-xs text-text-secondary italic">
                "{meal.aiMessage}"
              </div>
            )}

            {meal.proteinG && (
              <div className="mt-3 flex gap-2">
                <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                  {meal.proteinG}g protein
                </span>
                {meal.carbsG && (
                  <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full">
                    {meal.carbsG}g carbs
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </SoftCard>
    </main>
  );
}
