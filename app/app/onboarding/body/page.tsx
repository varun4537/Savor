"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { ArrowRight, Ruler, Scale, Sparkles, Plus, Minus, User } from "lucide-react";

export default function BodyPage() {
  const router = useRouter();
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");

  // State in base metric units
  const [heightCm, setHeightCm] = useState(172);
  const [weightKg, setWeightKg] = useState(68);
  const [age, setAge] = useState(26);

  // Height conversion helpers
  const feetVal = Math.floor(heightCm / 30.48);
  const inchesVal = Math.round((heightCm % 30.48) / 2.54);

  // Weight conversion helpers
  const weightLbs = Math.round(weightKg * 2.20462);

  const handleContinue = () => {
    sessionStorage.setItem(
      "onboarding_body",
      JSON.stringify({
        heightCm,
        weightKg,
        age,
        heightUnit,
        weightUnit,
      })
    );
    router.push("/onboarding/lifestyle");
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col justify-between p-4 pt-6 pb-28 max-w-md mx-auto relative overflow-y-auto">
      {/* Top Section */}
      <div>
        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-5">
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className="h-1.5 flex-1 rounded-full bg-primary" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
          <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/80 text-primary text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Body & Metabolism</span>
          </div>
          <H1 className="text-xl font-black text-text-heading font-heading mb-0.5">
            Tell us about yourself
          </H1>
          <Text className="text-text-secondary text-xs">
            Slide, tap +/- or type numbers to adjust your stats.
          </Text>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-3.5">
          {/* 1. HEIGHT CARD */}
          <div className="p-4 rounded-3xl bg-white/90 border border-amber-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-primary flex items-center justify-center">
                  <Ruler className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-text-heading">Height</span>
              </div>

              {/* Unit Toggle */}
              <div className="flex bg-amber-100/80 p-0.5 rounded-full">
                <button
                  type="button"
                  onClick={() => setHeightUnit("cm")}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    heightUnit === "cm" ? "bg-white text-text-heading shadow-xs" : "text-text-muted"
                  }`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => setHeightUnit("ft")}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    heightUnit === "ft" ? "bg-white text-text-heading shadow-xs" : "text-text-muted"
                  }`}
                >
                  ft/in
                </button>
              </div>
            </div>

            {/* Steppers + Value */}
            <div className="flex items-center justify-between my-2">
              <button
                type="button"
                onClick={() => setHeightCm((prev) => Math.max(120, prev - 1))}
                className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-text-heading flex items-center justify-center active:scale-95 font-bold shadow-xs"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-3xl font-black text-text-heading font-heading">
                  {heightUnit === "cm" ? heightCm : `${feetVal}'${inchesVal}"`}
                </span>
                <span className="text-xs text-text-secondary ml-1 font-semibold">
                  {heightUnit === "cm" ? "cm" : `(${heightCm} cm)`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setHeightCm((prev) => Math.min(230, prev + 1))}
                className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-text-heading flex items-center justify-center active:scale-95 font-bold shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Touch-Friendly Slider */}
            <input
              type="range"
              min={130}
              max={220}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full h-3 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* 2. WEIGHT CARD */}
          <div className="p-4 rounded-3xl bg-white/90 border border-amber-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-text-heading">Current Weight</span>
              </div>

              {/* Unit Toggle */}
              <div className="flex bg-amber-100/80 p-0.5 rounded-full">
                <button
                  type="button"
                  onClick={() => setWeightUnit("kg")}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    weightUnit === "kg" ? "bg-white text-text-heading shadow-xs" : "text-text-muted"
                  }`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit("lb")}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                    weightUnit === "lb" ? "bg-white text-text-heading shadow-xs" : "text-text-muted"
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>

            {/* Display + Steppers */}
            <div className="flex items-center justify-between my-2">
              <button
                type="button"
                onClick={() => setWeightKg((prev) => Math.max(35, prev - 0.5))}
                className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-text-heading flex items-center justify-center active:scale-95 font-bold shadow-xs"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="text-center">
                <span className="text-3xl font-black text-text-heading font-heading">
                  {weightUnit === "kg" ? weightKg : weightLbs}
                </span>
                <span className="text-xs text-text-secondary ml-1 font-semibold">
                  {weightUnit === "kg" ? "kg" : `lbs (${weightKg} kg)`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setWeightKg((prev) => Math.min(180, prev + 0.5))}
                className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-text-heading flex items-center justify-center active:scale-95 font-bold shadow-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Touch Slider */}
            <input
              type="range"
              min={40}
              max={160}
              step={0.5}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full h-3 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {/* 3. AGE CARD */}
          <div className="p-4 rounded-3xl bg-white/90 border border-amber-200/70 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-text-heading">Age</span>
              </div>
              <span className="text-lg font-black text-text-heading font-heading">
                {age} <span className="text-xs font-medium text-text-secondary">years</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAge((prev) => Math.max(16, prev - 1))}
                className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-text-heading flex items-center justify-center active:scale-95 font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="range"
                min={16}
                max={85}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="flex-1 h-3 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />

              <button
                type="button"
                onClick={() => setAge((prev) => Math.min(85, prev + 1))}
                className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-text-heading flex items-center justify-center active:scale-95 font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
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
