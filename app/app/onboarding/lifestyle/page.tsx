"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { ArrowRight, Dumbbell, Briefcase, Moon, Droplets, Check, Sparkles, Plus, Minus } from "lucide-react";

const exerciseOptions = [
  { id: "none", label: "Little to none", description: "Mostly relaxed / desk bound", multiplier: 1.2, emoji: "🛋️" },
  { id: "light", label: "1–2 times / week", description: "Casual walks or light workouts", multiplier: 1.375, emoji: "🚶" },
  { id: "moderate", label: "3–4 times / week", description: "Gym, yoga, or sports", multiplier: 1.55, emoji: "🏃" },
  { id: "active", label: "5–6 times / week", description: "High active movement", multiplier: 1.725, emoji: "⚡" },
];

const workOptions = [
  { id: "desk", label: "Desk Work", description: "Mostly seated on computer", emoji: "💻" },
  { id: "standing", label: "On my feet", description: "Standing, walking, moving around", emoji: "🩺" },
  { id: "active", label: "High Physical Activity", description: "Manual labor or athletic training", emoji: "🔨" },
];

const sleepOptions = [
  { id: "poor", label: "Less than 6 hours", desc: "Often tired or restless", emoji: "🥱" },
  { id: "okay", label: "6–7 hours", desc: "Decent, but could be better", emoji: "😴" },
  { id: "good", label: "7–8 hours", desc: "Refreshing & consistent", emoji: "🌙" },
  { id: "great", label: "8+ hours", desc: "Deep, restorative rest", emoji: "✨" },
];

export default function LifestylePage() {
  const router = useRouter();
  const [exercise, setExercise] = useState<string>("moderate");
  const [work, setWork] = useState<string>("desk");
  const [sleep, setSleep] = useState<string>("good");
  const [waterGlasses, setWaterGlasses] = useState<number>(8);
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      sessionStorage.setItem(
        "onboarding_lifestyle",
        JSON.stringify({
          exercise,
          work,
          sleep,
          water: `${waterGlasses} glasses`,
          waterGlasses,
          activityMultiplier: exerciseOptions.find((e) => e.id === exercise)?.multiplier || 1.4,
        })
      );
      router.push("/onboarding/diet");
    }
  };

  const totalVolumeLiters = (waterGlasses * 0.25).toFixed(1);

  return (
    <main
      className={`min-h-screen flex flex-col p-6 max-w-md mx-auto relative overflow-hidden transition-colors duration-500 ${
        step === 4
          ? "bg-gradient-to-b from-[#F0F8FF] via-[#E6F4FA] to-[#DDF2FA]"
          : "bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0]"
      }`}
    >
      {/* Aquatic Background Bubbles for Step 4 */}
      {step === 4 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[15%] left-[10%] text-2xl animate-float opacity-50">🫧</div>
          <div className="absolute top-[45%] right-[12%] text-3xl animate-float opacity-60" style={{ animationDelay: "1s" }}>
            🐬
          </div>
          <div className="absolute bottom-[20%] left-[15%] text-xl animate-float opacity-40" style={{ animationDelay: "2s" }}>
            🫧
          </div>
          <div className="absolute top-[70%] right-[25%] text-lg animate-float opacity-50" style={{ animationDelay: "1.5s" }}>
            🐠
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="flex gap-1.5 mb-6 pt-2">
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-center">
        {/* STEP 1: EXERCISE */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-2">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-orange-100 text-primary flex items-center justify-center shadow-xs">
                <Dumbbell className="w-6 h-6" />
              </div>
              <H1 className="text-2xl font-black text-text-heading font-heading mb-1">
                Movement & Exercise
              </H1>
              <Text className="text-text-secondary text-xs">
                How often do you stay active in a regular week?
              </Text>
            </div>

            <div className="space-y-2">
              {exerciseOptions.map((opt) => {
                const isSelected = exercise === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setExercise(opt.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between border ${
                      isSelected
                        ? "bg-white border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                        : "bg-white/70 border-amber-200/60 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-text-heading"}`}>
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-text-muted">{opt.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: WORK */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-2">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
                <Briefcase className="w-6 h-6" />
              </div>
              <H1 className="text-2xl font-black text-text-heading font-heading mb-1">
                Typical Daily Work
              </H1>
              <Text className="text-text-secondary text-xs">
                What does your daytime work routine look like?
              </Text>
            </div>

            <div className="space-y-2.5">
              {workOptions.map((opt) => {
                const isSelected = work === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setWork(opt.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between border ${
                      isSelected
                        ? "bg-white border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                        : "bg-white/70 border-amber-200/60 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-text-heading"}`}>
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-text-muted">{opt.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: SLEEP */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-2">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
                <Moon className="w-6 h-6" />
              </div>
              <H1 className="text-2xl font-black text-text-heading font-heading mb-1">
                Sleep & Recovery
              </H1>
              <Text className="text-text-secondary text-xs">
                Rest directly impacts hunger hormones and digestion.
              </Text>
            </div>

            <div className="space-y-2.5">
              {sleepOptions.map((opt) => {
                const isSelected = sleep === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSleep(opt.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between border ${
                      isSelected
                        ? "bg-white border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                        : "bg-white/70 border-amber-200/60 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{opt.emoji}</span>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-text-heading"}`}>
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-text-muted">{opt.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: WATER & HYDRATION WITH AQUATIC THEME */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-md animate-bounce-gentle border border-sky-200">
                <Droplets className="w-8 h-8" />
              </div>
              <H1 className="text-2xl font-black text-sky-950 font-heading mb-1">
                Daily Hydration Goal
              </H1>
              <Text className="text-sky-800 text-xs">
                How many glasses of water do you typically aim for?
              </Text>
            </div>

            {/* Visual Glass & Volume Calculator Card */}
            <div className="p-5 rounded-3xl bg-white/90 border border-sky-200/80 shadow-md text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-4xl font-black text-sky-950 font-heading">
                  {waterGlasses}
                </span>
                <span className="text-sm font-bold text-sky-700">glasses / day</span>
              </div>

              {/* Liters conversion & Glass equivalent note */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-4">
                <span>≈ {totalVolumeLiters} Liters</span>
                <span className="text-sky-500">•</span>
                <span>1 Glass = ~250 ml (8.5 oz) 💧</span>
              </div>

              {/* Interactive Visual Glass Stack */}
              <div className="flex justify-center items-end gap-1.5 h-16 mb-4 px-2">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setWaterGlasses(i + 1)}
                    className={`flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                      i < waterGlasses
                        ? "bg-gradient-to-t from-sky-500 to-cyan-400 shadow-xs shadow-sky-400 h-full scale-105"
                        : "bg-sky-200/40 h-8 hover:bg-sky-300/60"
                    }`}
                    title={`Set to ${i + 1} glasses`}
                  />
                ))}
              </div>

              {/* Stepper Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setWaterGlasses((prev) => Math.max(3, prev - 1))}
                  className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <input
                  type="range"
                  min={3}
                  max={12}
                  value={waterGlasses}
                  onChange={(e) => setWaterGlasses(Number(e.target.value))}
                  className="w-36 h-3 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />

                <button
                  type="button"
                  onClick={() => setWaterGlasses((prev) => Math.min(14, prev + 1))}
                  className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all ${
              s === step ? "w-6 bg-primary" : s < step ? "bg-primary/50" : "bg-amber-200/60"
            }`}
          />
        ))}
      </div>

      {/* CTA Button */}
      <div className="w-full pb-2">
        <Button
          onClick={handleContinue}
          className={`w-full py-5 rounded-2xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
            step === 4
              ? "bg-gradient-to-r from-sky-500 to-cyan-500 shadow-sky-500/25"
              : "bg-gradient-to-r from-primary to-[#F27233] shadow-primary/25"
          }`}
        >
          <span>{step < 4 ? "Next Step" : "Continue to Diet"}</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </main>
  );
}
