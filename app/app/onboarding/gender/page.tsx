"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export default function GenderPage() {
  const router = useRouter();
  const [gender, setGender] = useState<"male" | "female" | null>("male");

  const handleContinue = () => {
    if (gender) {
      sessionStorage.setItem("onboarding_gender", gender);
      router.push("/onboarding/body");
    }
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col justify-between p-4 pt-6 pb-28 max-w-md mx-auto relative overflow-y-auto">
      {/* Top Content */}
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100/80 text-primary text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Energy Calculation</span>
          </div>
          <H1 className="text-xl font-black text-text-heading font-heading mb-0.5">
            Biological Parameters
          </H1>
          <Text className="text-text-secondary text-xs">
            Used to calibrate your baseline metabolic rate (BMR).
          </Text>
        </div>

        {/* Gender Choice Cards */}
        <div className="space-y-3">
          <div
            onClick={() => setGender("male")}
            className={`p-4 rounded-3xl cursor-pointer transition-all flex items-center justify-between border ${
              gender === "male"
                ? "bg-white border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                : "bg-white/70 border-amber-200/60 hover:bg-white"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold">
                🙋‍♂️
              </div>
              <div>
                <p className={`text-sm font-bold ${gender === "male" ? "text-primary" : "text-text-heading"}`}>
                  Male
                </p>
                <p className="text-[11px] text-text-muted">Standard Mifflin-St Jeor formula</p>
              </div>
            </div>
            {gender === "male" && (
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div
            onClick={() => setGender("female")}
            className={`p-4 rounded-3xl cursor-pointer transition-all flex items-center justify-between border ${
              gender === "female"
                ? "bg-white border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                : "bg-white/70 border-amber-200/60 hover:bg-white"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl font-bold">
                🙋‍♀️
              </div>
              <div>
                <p className={`text-sm font-bold ${gender === "female" ? "text-primary" : "text-text-heading"}`}>
                  Female
                </p>
                <p className="text-[11px] text-text-muted">Standard Mifflin-St Jeor formula</p>
              </div>
            </div>
            {gender === "female" && (
              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pinned Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-gradient-to-t from-[#FFF0E0] via-[#FFF0E0]/95 to-transparent z-20">
        <Button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
          disabled={!gender}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </main>
  );
}
