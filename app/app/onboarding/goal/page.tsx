"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SoftCard } from "@/app/components/ui/soft-card";
import { Button } from "@/app/components/ui/button";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import {
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Heart,
  Salad,
  Check,
  Sparkles
} from "lucide-react";

const goals = [
  { id: "lose", label: "Gentle Weight Loss", description: "Feel lighter with sustainable deficit", emoji: "🌱" },
  { id: "maintain", label: "Mindful Maintenance", description: "Stable energy & vitality", emoji: "🧘" },
  { id: "gain", label: "Strength & Muscle", description: "Nourish body for active workouts", emoji: "💪" },
  { id: "eat-better", label: "Intuitive Nutrition", description: "Balanced meals without guilt", emoji: "🥗" },
];

export default function GoalPage() {
  const router = useRouter();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(["lose"]);

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((g) => g !== id) : prev) : [...prev, id]
    );
  };

  const handleContinue = () => {
    sessionStorage.setItem("onboarding_goals", JSON.stringify(selectedGoals));
    router.push("/onboarding/diet");
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col justify-between p-4 pt-6 pb-28 max-w-md mx-auto relative overflow-y-auto">
      {/* Top Section */}
      <div>
        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-5">
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/80 text-primary text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wellness Intentions</span>
          </div>
          <H1 className="text-xl font-black text-text-heading font-heading mb-0.5">
            What are your goals?
          </H1>
          <Text className="text-text-secondary text-xs">
            Select one or more intentions that resonate with you.
          </Text>
        </div>

        {/* Goals List */}
        <div className="space-y-2.5">
          {goals.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`p-4 rounded-3xl cursor-pointer transition-all flex items-center justify-between border ${
                  isSelected
                    ? "bg-white border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                    : "bg-white/70 border-amber-200/60 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-text-heading"}`}>
                      {goal.label}
                    </p>
                    <p className="text-[11px] text-text-muted">{goal.description}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pinned Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-[#FFF0E0] via-[#FFF0E0]/95 to-transparent z-20">
        <Button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </main>
  );
}
