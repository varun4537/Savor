"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SoftCard } from "@/app/components/ui/soft-card";
import { Button } from "@/app/components/ui/button";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import {
  ArrowRight,
  Flame,
  Zap,
  Activity,
  Sparkles,
  Heart,
  ShieldCheck,
  BatteryCharging
} from "lucide-react";

export default function HealthPage() {
  const router = useRouter();
  const [bmr, setBmr] = useState(1450);
  const [tdee, setTdee] = useState(1900);
  const [name, setName] = useState("");
  const [healthInsights, setHealthInsights] = useState<string[]>([]);

  useEffect(() => {
    const savedName = sessionStorage.getItem("onboarding_name") || "there";
    const savedBody = sessionStorage.getItem("onboarding_body");
    const savedGender = sessionStorage.getItem("onboarding_gender") || "male";
    const savedLifestyle = JSON.parse(sessionStorage.getItem("onboarding_lifestyle") || "{}");

    setName(savedName);

    if (savedBody) {
      const body = JSON.parse(savedBody);
      const weightKg = body.weightKg || 68;
      const heightCm = body.heightCm || 172;
      const age = body.age || 26;

      // 1. Basal Metabolic Rate (Mifflin-St Jeor)
      const bmrOffset = savedGender === "female" ? -161 : 5;
      const calculatedBmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + bmrOffset);
      setBmr(calculatedBmr);

      // 2. Activity Multiplier
      const multiplier = savedLifestyle.activityMultiplier || 1.35;
      const calculatedTdee = Math.round(calculatedBmr * multiplier);
      setTdee(calculatedTdee);

      const insights: string[] = [
        `Your body naturally burns ~${calculatedBmr} kcal/day just resting, powering your brain, heart, and vital organs.`,
        `With your daily routine and movement, your total daily maintenance burn is ~${calculatedTdee} kcal.`,
        "Savor focuses on consistent energy, protein preservation, and vibrant health — without crash diets or restrictive rules.",
      ];

      setHealthInsights(insights);
    }
  }, []);

  const handleContinue = () => {
    router.push("/onboarding/results");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Progress Dots */}
      <div className="flex gap-1 mb-6">
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-primary" />
        <div className="h-1 flex-1 rounded-full bg-primary/40" />
      </div>

      {/* Hero Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-2 rounded-3xl bg-amber-100 text-primary flex items-center justify-center font-bold text-2xl shadow-xs animate-float">
          ⚡
        </div>
        <H1 className="text-2xl font-black text-text-heading font-heading">
          Your Energy Profile
        </H1>
        <Text className="text-xs text-text-secondary mt-1">
          Understanding your natural metabolic baseline, {name}
        </Text>
      </div>

      <div className="w-full space-y-3.5 flex-1">
        {/* Metabolic Breakdown Card */}
        <SoftCard className="p-5 bg-white/95 border border-amber-200/80 rounded-3xl shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <BatteryCharging className="w-5 h-5 text-primary" />
            <Text className="font-bold text-text-heading text-sm">Metabolic Daily Baseline</Text>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100 text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase block">
                Resting Burn (BMR)
              </span>
              <span className="text-2xl font-black text-text-heading font-heading">
                {bmr}
              </span>
              <span className="text-[10px] text-text-secondary block">kcal / day</span>
            </div>

            <div className="p-3 bg-orange-50/70 rounded-2xl border border-orange-100 text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase block">
                Total Daily Burn (TDEE)
              </span>
              <span className="text-2xl font-black text-primary font-heading">
                {tdee}
              </span>
              <span className="text-[10px] text-text-secondary block">kcal / day</span>
            </div>
          </div>

          <div className="p-3 bg-[#FFFDF9] rounded-2xl border border-amber-100/80 text-xs text-text-secondary leading-relaxed">
            <p className="font-bold text-text-heading mb-0.5">🌱 Why we don't use BMI:</p>
            <p className="text-[11px]">
              BMI ignores muscle mass, body composition, and vitality. Energy balance (how much you burn vs eat) is far more useful and respectful of your body.
            </p>
          </div>
        </SoftCard>

        {/* Supportive Insights */}
        <div className="space-y-2">
          {healthInsights.map((insight, i) => (
            <SoftCard key={i} className="p-3.5 bg-white/90 border border-amber-100/80 rounded-2xl flex items-start gap-2.5 shadow-xs">
              <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <Text className="text-xs text-text-primary leading-relaxed font-medium">
                {insight}
              </Text>
            </SoftCard>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="w-full pt-4 pb-2">
        <Button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <span>See My Personalized Plan</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </main>
  );
}
