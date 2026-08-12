"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import {
  ArrowRight,
  Sparkles,
  Check,
  Flame,
  ShieldCheck,
  Zap,
  Activity,
  Heart,
  HelpCircle,
  Utensils,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
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

  // Metabolic calculations
  const [bmr, setBmr] = useState(1450);
  const [activityCalories, setActivityCalories] = useState(450);
  const [tdee, setTdee] = useState(1900);
  const [deficitChoice, setDeficitChoice] = useState<"gentle" | "moderate" | "maintain" | "gain">("gentle");
  const [dailyCalories, setDailyCalories] = useState(1650);
  const [proteinGoal, setProteinGoal] = useState(105);

  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const name = sessionStorage.getItem("onboarding_name") || "Friend";
    const body = JSON.parse(sessionStorage.getItem("onboarding_body") || "{}");
    const goals = JSON.parse(sessionStorage.getItem("onboarding_goals") || "[]");
    const lifestyle = JSON.parse(sessionStorage.getItem("onboarding_lifestyle") || "{}");
    const diet = JSON.parse(sessionStorage.getItem("onboarding_diet") || "{}");
    const gender = sessionStorage.getItem("onboarding_gender") || "male";

    const onboardingData: OnboardingData = { name, body, goals, lifestyle, diet };
    setData(onboardingData);

    const weightKg = body.weightKg || 68;
    const heightCm = body.heightCm || 172;
    const age = body.age || 26;

    // 1. Basal Metabolic Rate (BMR) - Mifflin-St Jeor formula
    const bmrOffset = gender === "female" ? -161 : 5;
    const calculatedBmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + bmrOffset);
    setBmr(calculatedBmr);

    // 2. Activity Burn (NEAT + exercise + work)
    const multiplier = lifestyle.activityMultiplier || 1.35;
    let workBonus = 0;
    if (lifestyle.work === "standing") workBonus = 100;
    if (lifestyle.work === "active") workBonus = 250;

    const calculatedTdee = Math.round(calculatedBmr * multiplier) + workBonus;
    setTdee(calculatedTdee);
    setActivityCalories(calculatedTdee - calculatedBmr);

    // 3. Goal Adjustment
    let initialDeficit: "gentle" | "moderate" | "maintain" | "gain" = "gentle";
    if (goals.includes("gain")) initialDeficit = "gain";
    else if (goals.includes("maintain") || goals.includes("eat-better")) initialDeficit = "maintain";
    setDeficitChoice(initialDeficit);

    applyGoalCalories(initialDeficit, calculatedTdee, weightKg);
    setLoading(false);

    // Confetti celebration
    (async () => {
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.5 },
          colors: ["#F58549", "#EEC170", "#68D391", "#68B0D3"],
        });
      } catch (e) {}
    })();
  }, []);

  const applyGoalCalories = (
    choice: "gentle" | "moderate" | "maintain" | "gain",
    baseTdee: number,
    weightKg: number
  ) => {
    let target = baseTdee;
    if (choice === "gentle") target = baseTdee - 275; // Sustainable 250-300 kcal deficit
    if (choice === "moderate") target = baseTdee - 450; // Moderate 450 kcal deficit
    if (choice === "gain") target = baseTdee + 250; // Nourishing surplus

    target = Math.max(target, 1350);
    target = Math.round(target / 25) * 25;
    setDailyCalories(target);

    // Protein goal based on lean preservation
    const proteinFactor = choice === "gain" ? 1.7 : choice === "gentle" || choice === "moderate" ? 1.5 : 1.3;
    setProteinGoal(Math.round(weightKg * proteinFactor));
  };

  const handleDeficitChange = (choice: "gentle" | "moderate" | "maintain" | "gain") => {
    setDeficitChoice(choice);
    const weightKg = data?.body.weightKg || 68;
    applyGoalCalories(choice, tdee, weightKg);
  };

  const handleStart = async () => {
    if (!data) return;
    setIsSaving(true);

    const gender = sessionStorage.getItem("onboarding_gender") || "male";

    await updateProfile({
      name: data.name,
      gender,
      age: data.body.age,
      weightKg: data.body.weightKg,
      heightCm: data.body.heightCm,
      targetWeightKg: data.body.weightKg ? data.body.weightKg - 3 : 65,
      goal: deficitChoice,
      dietPreference: data.diet.dietType || "flexitarian",
      dailyCalories,
      proteinGoalG: proteinGoal,
    });

    if (data.body.weightKg) {
      await logWeight(data.body.weightKg, "Initial check-in", true);
    }

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
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col p-4 pt-6 pb-24 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 mx-auto mb-2 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-amber-200/80 flex items-center justify-center shadow-md animate-bounce-gentle">
          <span className="text-3xl">🍊</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Metabolic Energy Blueprint</span>
        </div>

        <H1 className="text-xl font-black text-text-heading font-heading">
          Welcome, {data?.name}!
        </H1>
        <Text className="text-text-secondary text-xs mt-0.5">
          We do not use rigid BMI. Here is how your body uses energy:
        </Text>
      </div>

      {/* 1. METABOLIC BREAKDOWN CARD */}
      <div className="p-4 rounded-3xl bg-white/95 border border-amber-200/80 shadow-xs mb-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-text-heading">Daily Energy Balance</span>
          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showFormulaDetails ? "Hide Formula" : "How it's calculated"}</span>
          </button>
        </div>

        {/* 3 Step Visual Equation */}
        <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-amber-50/60 rounded-2xl border border-amber-100 mb-3">
          <div>
            <span className="text-[10px] text-text-muted font-bold block uppercase">1. Resting (BMR)</span>
            <span className="text-sm font-black text-text-heading font-heading">{bmr}</span>
            <span className="text-[9px] text-text-secondary block">vital organs & sleep</span>
          </div>

          <div className="border-x border-amber-200/60 px-1">
            <span className="text-[10px] text-text-muted font-bold block uppercase">2. Activity</span>
            <span className="text-sm font-black text-text-heading font-heading">+{activityCalories}</span>
            <span className="text-[9px] text-text-secondary block">steps & movement</span>
          </div>

          <div>
            <span className="text-[10px] text-text-muted font-bold block uppercase">3. Total Burn</span>
            <span className="text-sm font-black text-primary font-heading">{tdee}</span>
            <span className="text-[9px] text-text-secondary block">maintenance kcal</span>
          </div>
        </div>

        {/* Formula Details Toggle */}
        {showFormulaDetails && (
          <div className="p-3 bg-white rounded-2xl border border-amber-200/60 text-[11px] text-text-secondary leading-relaxed space-y-1.5 mb-3 animate-in fade-in">
            <p className="font-bold text-text-heading">💡 No Black Box Math:</p>
            <p>
              • <strong>BMR ({bmr} kcal)</strong>: Calculated using your height ({data?.body.heightCm}cm), weight ({data?.body.weightKg}kg), and age ({data?.body.age}y). This is what your body burns at complete rest.
            </p>
            <p>
              • <strong>TDEE ({tdee} kcal)</strong>: Total Daily Energy Expenditure factoring in your daily movement and exercise.
            </p>
          </div>
        )}

        {/* Pace Selector */}
        <div>
          <Caption className="text-[10px] font-bold uppercase text-text-muted mb-1.5 block">
            Choose Your Daily Rhythm
          </Caption>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleDeficitChange("gentle")}
              className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                deficitChoice === "gentle"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-white text-text-secondary border-amber-200 hover:bg-amber-50"
              }`}
            >
              🌱 Gentle
              <span className="block text-[9px] font-normal opacity-90">-275 kcal/day</span>
            </button>

            <button
              onClick={() => handleDeficitChange("maintain")}
              className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                deficitChoice === "maintain"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-white text-text-secondary border-amber-200 hover:bg-amber-50"
              }`}
            >
              🧘 Maintain
              <span className="block text-[9px] font-normal opacity-90">Stable energy</span>
            </button>

            <button
              onClick={() => handleDeficitChange("moderate")}
              className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all text-center ${
                deficitChoice === "moderate"
                  ? "bg-primary text-white border-primary shadow-xs"
                  : "bg-white text-text-secondary border-amber-200 hover:bg-amber-50"
              }`}
            >
              ⚡ Steady
              <span className="block text-[9px] font-normal opacity-90">-450 kcal/day</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. YOUR TARGETS & FOOD TRANSLATION */}
      <div className="p-4 rounded-3xl bg-white/95 border border-amber-200/80 shadow-xs mb-3.5">
        <div className="grid grid-cols-2 gap-3 pb-3 mb-3 border-b border-amber-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-primary flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Target Daily</span>
              <p className="text-lg font-black text-text-heading font-heading">
                ~{dailyCalories} <span className="text-xs font-semibold text-text-secondary">kcal</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Protein Goal</span>
              <p className="text-lg font-black text-text-heading font-heading">
                {proteinGoal}g <span className="text-xs font-semibold text-text-secondary">/ day</span>
              </p>
            </div>
          </div>
        </div>

        {/* Real-life Meal Distribution Example */}
        <div>
          <Caption className="text-[10px] font-bold uppercase text-text-muted mb-1.5 block">
            What ~{dailyCalories} kcal looks like across your day
          </Caption>
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div className="p-2 rounded-xl bg-[#FFF9F3] border border-amber-100">
              <span className="text-[10px] font-bold text-text-heading block">Breakfast</span>
              <span className="text-xs font-black text-primary">~{Math.round(dailyCalories * 0.22)}</span>
              <span className="text-[9px] text-text-muted block">kcal</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF9F3] border border-amber-100">
              <span className="text-[10px] font-bold text-text-heading block">Lunch</span>
              <span className="text-xs font-black text-primary">~{Math.round(dailyCalories * 0.35)}</span>
              <span className="text-[9px] text-text-muted block">kcal</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF9F3] border border-amber-100">
              <span className="text-[10px] font-bold text-text-heading block">Snack</span>
              <span className="text-xs font-black text-primary">~{Math.round(dailyCalories * 0.13)}</span>
              <span className="text-[9px] text-text-muted block">kcal</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FFF9F3] border border-amber-100">
              <span className="text-[10px] font-bold text-text-heading block">Dinner</span>
              <span className="text-xs font-black text-primary">~{Math.round(dailyCalories * 0.30)}</span>
              <span className="text-[9px] text-text-muted block">kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ZERO-GUILT PLEDGE */}
      <div className="p-3.5 rounded-3xl bg-amber-50/80 border border-amber-200/60 mb-4 flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <strong className="text-text-heading block mb-0.5">Savor's Care Principle</strong>
          These numbers are helpful guides, not rigid rules. Eat when hungry, enjoy your cultural foods, and listen to your body.
        </div>
      </div>

      <div className="flex-1" />

      {/* CTA Button */}
      <div className="w-full">
        <Button
          onClick={handleStart}
          disabled={isSaving}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <span>{isSaving ? "Setting Up Savor..." : "Start My Journey ✨"}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </main>
  );
}
