"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { H1, Text } from "@/app/components/ui/typography";
import { ArrowRight, Sparkles, Check, Heart, Flame, ShieldCheck, Zap } from "lucide-react";
import { useSavorData } from "@/app/hooks/use-savor-data";

interface OnboardingData {
  name: string;
  gender?: string;
  body: {
    heightCm: number;
    weightKg: number;
    age: number;
  };
  goals: string[];
  lifestyle: {
    exercise: string;
    work: string;
    sleep: string;
    water: string;
    activityMultiplier: number;
  };
  diet: {
    dietType: string;
    restrictions: string[];
    customRestrictions: string[];
  };
}

export default function ResultsPage() {
  const router = useRouter();
  const { updateProfile, logWeight } = useSavorData();
  const [data, setData] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(110);
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const name = sessionStorage.getItem("onboarding_name") || "Friend";
    const body = JSON.parse(sessionStorage.getItem("onboarding_body") || "{}");
    const goals = JSON.parse(sessionStorage.getItem("onboarding_goals") || "[]");
    const lifestyle = JSON.parse(sessionStorage.getItem("onboarding_lifestyle") || "{}");
    const diet = JSON.parse(sessionStorage.getItem("onboarding_diet") || "{}");

    const onboardingData: OnboardingData = { name, body, goals, lifestyle, diet };
    setData(onboardingData);

    const gender = sessionStorage.getItem("onboarding_gender") || "male";
    const weightKg = body.weightKg || 70;
    const heightCm = body.heightCm || 170;
    const age = body.age || 28;

    // BMR Calculation (Mifflin-St Jeor)
    let bmrOffset = gender === "female" ? -161 : 5;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + bmrOffset;

    const activityMultiplier = lifestyle.activityMultiplier || 1.4;
    let workAdjustment = 0;
    if (lifestyle.work === "standing") workAdjustment = 100;
    if (lifestyle.work === "active") workAdjustment = 250;

    const tdee = Math.round(bmr * activityMultiplier) + workAdjustment;

    let targetCalories = tdee;
    if (goals.includes("lose")) {
      targetCalories = tdee - 400; // gentle deficit
    } else if (goals.includes("gain")) {
      targetCalories = tdee + 300;
    }

    targetCalories = Math.max(targetCalories, 1300);
    targetCalories = Math.round(targetCalories / 50) * 50;
    setDailyCalories(targetCalories);

    let proteinMultiplier = goals.includes("gain") ? 1.8 : goals.includes("lose") ? 1.6 : 1.4;
    setProteinGoal(Math.round(weightKg * proteinMultiplier));

    const focus: string[] = [
      "Consistent gentle daily awareness",
      "Morning voice weigh-in habit",
      "8 glasses of mindful hydration",
      `Nourishing ~${targetCalories} kcal daily range`,
    ];
    setFocusAreas(focus);
    setLoading(false);

    // Trigger celebratory confetti on reveal
    (async () => {
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#F58549", "#EEC170", "#772F1A", "#68D391", "#68B0D3"],
        });
      } catch (e) {}
    })();
  }, []);

  const handleStart = async () => {
    if (!data) return;
    setIsSaving(true);

    const gender = sessionStorage.getItem("onboarding_gender") || "male";

    // Update Profile via Savor data hook (saves to Convex & localStorage)
    await updateProfile({
      name: data.name,
      gender,
      age: data.body.age,
      weightKg: data.body.weightKg,
      heightCm: data.body.heightCm,
      targetWeightKg: data.body.weightKg ? data.body.weightKg - 4 : 65,
      goal: data.goals[0] || "maintain",
      dietPreference: data.diet.dietType || "Omnivore",
      dailyCalories,
      proteinGoalG: proteinGoal,
    });

    if (data.body.weightKg) {
      await logWeight(data.body.weightKg, "Initial onboarding weight", false);
    }

    // Clean session storage
    sessionStorage.removeItem("onboarding_name");
    sessionStorage.removeItem("onboarding_gender");
    sessionStorage.removeItem("onboarding_body");
    sessionStorage.removeItem("onboarding_goals");
    sessionStorage.removeItem("onboarding_lifestyle");
    sessionStorage.removeItem("onboarding_diet");

    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6 text-primary animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col p-6 max-w-md mx-auto">
      {/* Header Banner */}
      <div className="text-center pt-2 mb-5">
        <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-amber-200/80 flex items-center justify-center shadow-md animate-bounce-gentle">
          <span className="text-3xl">🎉</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Plan is Ready!</span>
        </div>

        <H1 className="text-2xl font-black text-text-heading font-heading">
          Welcome to Savor, {data?.name}!
        </H1>
        <Text className="text-text-secondary text-xs mt-1">
          Here is your personalized, non-restrictive daily wellness blueprint.
        </Text>
      </div>

      {/* Main Targets Card */}
      <div className="p-5 rounded-3xl bg-white/90 border border-amber-200/70 shadow-md mb-4 animate-pop-in">
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-primary flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Daily Target</span>
              <p className="text-xl font-black text-text-heading font-heading">
                ~{dailyCalories} <span className="text-xs font-medium text-text-secondary">kcal</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Protein Goal</span>
              <p className="text-xl font-black text-text-heading font-heading">
                {proteinGoal}g <span className="text-xs font-medium text-text-secondary">/ day</span>
              </p>
            </div>
          </div>
        </div>

        {/* Philosophy Pledge */}
        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-100 text-xs text-text-secondary leading-relaxed flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            <strong>Our Promise:</strong> No red warning signs, no calorie shaming. Just gentle estimates and mindful consistency.
          </span>
        </div>
      </div>

      {/* Daily Focus Areas */}
      <div className="p-4 rounded-3xl bg-white/80 border border-amber-100 mb-6 shadow-xs">
        <span className="text-xs font-bold text-text-heading uppercase tracking-wider block mb-2.5">
          Your Daily Habits
        </span>
        <div className="space-y-2">
          {focusAreas.map((area, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-medium text-text-primary">
              <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span>{area}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* CTA Button */}
      <div className="w-full pb-4">
        <Button
          onClick={handleStart}
          disabled={isSaving}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <span>{isSaving ? "Setting Up Savor..." : "Enter Savor ✨"}</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </main>
  );
}
