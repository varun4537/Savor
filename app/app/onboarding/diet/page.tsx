"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { ArrowRight, Check, Plus, Sparkles, UtensilsCrossed } from "lucide-react";

interface DietPattern {
  id: string;
  label: string;
  desc: string;
  emoji: string;
}

const dietPatterns: DietPattern[] = [
  { id: "vegetarian", label: "Vegetarian", desc: "Plant foods + Paneer/Dairy", emoji: "🥗" },
  { id: "eggetarian", label: "Eggetarian", desc: "Vegetarian + Eggs", emoji: "🥚" },
  { id: "flexitarian", label: "Flexitarian", desc: "Mostly veg with occasional non-veg", emoji: "🍲" },
  { id: "non-vegetarian", label: "Non-Vegetarian", desc: "Regular chicken, meat & fish", emoji: "🍗" },
  { id: "vegan", label: "Vegan", desc: "100% plant-based, no dairy", emoji: "🌱" },
  { id: "jain", label: "Jain Vegetarian", desc: "No onion, garlic, or root veg", emoji: "🌸" },
  { id: "pescatarian", label: "Pescatarian", desc: "Vegetarian + Fish & Seafood", emoji: "🐟" },
];

const nonVegFrequencies = [
  { id: "weekends", label: "Weekends Only" },
  { id: "1-2-days", label: "1–2 days/week" },
  { id: "3-4-days", label: "3–4 days/week" },
  { id: "daily", label: "Almost Daily" },
];

const standardAllergies = [
  { id: "dairy-free", label: "Dairy-free 🥛" },
  { id: "gluten-free", label: "Gluten-free 🌾" },
  { id: "nut-free", label: "Nut-free 🥜" },
  { id: "halal", label: "Halal Only 🌙" },
  { id: "no-beef", label: "No Beef 🥩" },
  { id: "no-pork", label: "No Pork 🥓" },
];

export default function DietPage() {
  const router = useRouter();
  const [selectedDiet, setSelectedDiet] = useState<string>("flexitarian");
  const [nonVegFreq, setNonVegFreq] = useState<string>("1-2-days");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergies, setCustomAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);

  const toggleAllergy = (id: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const addCustomAllergy = () => {
    if (newAllergy.trim() && !customAllergies.includes(newAllergy.trim())) {
      setCustomAllergies((prev) => [...prev, newAllergy.trim()]);
      setNewAllergy("");
      setShowAddCustom(false);
    }
  };

  const removeCustomAllergy = (item: string) => {
    setCustomAllergies((prev) => prev.filter((a) => a !== item));
  };

  const handleContinue = () => {
    sessionStorage.setItem(
      "onboarding_diet",
      JSON.stringify({
        dietType: selectedDiet,
        nonVegFrequency: ["flexitarian", "non-vegetarian", "eggetarian"].includes(selectedDiet)
          ? nonVegFreq
          : "none",
        restrictions: selectedAllergies,
        customRestrictions: customAllergies,
      })
    );
    router.push("/onboarding/health");
  };

  const showFrequencyOption = ["flexitarian", "non-vegetarian", "eggetarian"].includes(selectedDiet);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Progress */}
      <div className="flex gap-1.5 mb-6 pt-2">
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-primary" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
      </div>

      {/* Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-primary text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Nutrition</span>
        </div>
        <H1 className="text-2xl font-black text-text-heading font-heading mb-1">
          Your Dietary Style
        </H1>
        <Text className="text-text-secondary text-xs">
          Real diets are flexible! Choose what best describes your typical eating habits.
        </Text>
      </div>

      {/* Content */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-0.5">
        {/* 1. Core Diet Patterns */}
        <div className="space-y-2">
          {dietPatterns.map((diet) => {
            const isSelected = selectedDiet === diet.id;
            return (
              <div
                key={diet.id}
                onClick={() => setSelectedDiet(diet.id)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-between border ${
                  isSelected
                    ? "bg-white border-primary shadow-sm ring-2 ring-primary/20 scale-[1.01]"
                    : "bg-white/70 border-amber-200/60 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{diet.emoji}</span>
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? "text-primary" : "text-text-heading"}`}>
                      {diet.label}
                    </p>
                    <p className="text-[11px] text-text-muted">{diet.desc}</p>
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

        {/* 2. Non-Veg / Egg Frequency (If applicable) */}
        {showFrequencyOption && (
          <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/80 animate-in fade-in">
            <span className="text-xs font-bold text-text-heading block mb-2">
              {selectedDiet === "eggetarian"
                ? "How often do you eat eggs?"
                : "How often do you eat non-veg / seafood?"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {nonVegFrequencies.map((freq) => {
                const isSelected = nonVegFreq === freq.id;
                return (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => setNonVegFreq(freq.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-white text-text-secondary border-amber-200 hover:bg-white"
                    }`}
                  >
                    {freq.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Common Allergies & Restrictions */}
        <div className="p-4 rounded-3xl bg-white/80 border border-amber-200/70 shadow-xs">
          <span className="text-xs font-bold text-text-heading uppercase tracking-wider block mb-2.5">
            Any Allergies or Exclusions?
          </span>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {standardAllergies.map((item) => {
              const isSelected = selectedAllergies.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleAllergy(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-[#FFF9F3] text-text-secondary border-amber-200/70 hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Custom Restrictions */}
            {customAllergies.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-white border border-primary flex items-center gap-1.5 shadow-xs"
              >
                <span>🚫 {item}</span>
                <button
                  type="button"
                  onClick={() => removeCustomAllergy(item)}
                  className="text-white hover:text-red-200 text-xs font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Add Custom Button / Input */}
          {showAddCustom ? (
            <div className="flex gap-2 mt-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="e.g. No mushrooms, No shellfish"
                className="text-xs bg-white py-1.5 rounded-xl flex-1"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && addCustomAllergy()}
              />
              <Button onClick={addCustomAllergy} size="sm" className="bg-primary text-white text-xs px-3">
                Add
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 mt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add custom restriction
            </button>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="w-full pt-4 pb-2">
        <Button
          onClick={handleContinue}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </main>
  );
}
