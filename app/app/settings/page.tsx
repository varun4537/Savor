"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SoftCard } from "@/app/components/ui/soft-card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import {
  ArrowLeft,
  User,
  Target,
  Utensils,
  Droplets,
  Cpu,
  Scale,
  Ruler,
  Sparkles,
  ShieldCheck,
  Check,
  Plus,
  RefreshCw,
  Sliders,
  Download,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useSavorData } from "@/app/hooks/use-savor-data";
import { AVAILABLE_TEXT_MODELS } from "@/lib/openrouter";

const dietPatterns = [
  { id: "vegetarian", label: "Vegetarian 🥗" },
  { id: "eggetarian", label: "Eggetarian 🥚" },
  { id: "flexitarian", label: "Flexitarian 🍲" },
  { id: "non-vegetarian", label: "Non-Vegetarian 🍗" },
  { id: "vegan", label: "Vegan 🌱" },
  { id: "jain", label: "Jain 🌸" },
  { id: "pescatarian", label: "Pescatarian 🐟" },
];

const nonVegFrequencies = [
  { id: "weekends", label: "Weekends Only" },
  { id: "1-2-days", label: "1–2 days/wk" },
  { id: "3-4-days", label: "3–4 days/wk" },
  { id: "daily", label: "Daily" },
];

const goalOptions = [
  { id: "lose", label: "Gentle Weight Loss" },
  { id: "maintain", label: "Mindful Maintenance" },
  { id: "gain", label: "Strength & Muscle" },
  { id: "eat-better", label: "Clean Energy" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { profile, updateProfile, isConvexConnected, hydration, todayMeals, weightEntries } = useSavorData();
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "diet" | "hydration" | "ai">("profile");

  // Form States
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState("male");
  const [weightKg, setWeightKg] = useState<number>(68);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(65);
  const [goal, setGoal] = useState("maintain");

  // Dietary States
  const [dietType, setDietType] = useState("flexitarian");
  const [nonVegFreq, setNonVegFreq] = useState("1-2-days");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");

  // Target States
  const [dailyCalories, setDailyCalories] = useState<number>(2000);
  const [proteinGoalG, setProteinGoalG] = useState<number>(110);
  const [targetGlasses, setTargetGlasses] = useState<number>(8);

  // AI Model State
  const [selectedModel, setSelectedModel] = useState("google/gemini-2.5-flash");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setAge(profile.age || 26);
      setGender(profile.gender || "male");
      setWeightKg(profile.weightKg || 68);
      setHeightCm(profile.heightCm || 172);
      setTargetWeightKg(profile.targetWeightKg || 65);
      setGoal(profile.goal || "maintain");
      setDietType(profile.dietPreference || "flexitarian");
      setDailyCalories(profile.dailyCalories || 2000);
      setProteinGoalG(profile.proteinGoalG || 110);
      if (profile.allergies) setAllergies(profile.allergies);
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateProfile({
        name,
        age,
        gender,
        weightKg,
        heightCm,
        targetWeightKg,
        goal,
        dietPreference: dietType,
        allergies,
        dailyCalories,
        proteinGoalG,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Save settings error:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    const backup = {
      profile,
      meals: todayMeals,
      weights: weightEntries,
      hydration,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `savor-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all Savor data and re-run onboarding?")) {
      localStorage.clear();
      router.push("/welcome");
    }
  };

  return (
    <main className="min-h-screen p-4 pt-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] pb-28 relative overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white/80 border border-amber-200/60 shadow-xs">
              <ArrowLeft className="w-5 h-5 text-text-heading" />
            </Button>
          </Link>
          <div>
            <H1 className="text-xl font-black text-text-heading font-heading">Settings</H1>
            <Caption className="text-[11px] text-text-muted">Comprehensive profile & preferences</Caption>
          </div>
        </div>

        {isConvexConnected ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Convex Synced
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            Local Mode
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-white/80 p-1 rounded-2xl border border-amber-200/60 mb-4 shadow-xs">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "profile" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text-heading"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Body</span>
        </button>
        <button
          onClick={() => setActiveTab("diet")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "diet" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text-heading"
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Diet</span>
        </button>
        <button
          onClick={() => setActiveTab("hydration")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "hydration" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text-heading"
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Water</span>
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "ai" ? "bg-primary text-white shadow-xs" : "text-text-secondary hover:text-text-heading"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI</span>
        </button>
      </div>

      {/* TAB 1: BODY & PROFILE */}
      {activeTab === "profile" && (
        <div className="space-y-3.5 animate-in fade-in">
          {/* Name & Age */}
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
            <div className="space-y-2.5">
              <div>
                <Caption className="text-[10px] uppercase font-bold text-text-muted mb-1 block">Your Name</Caption>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="bg-white text-xs py-2 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Caption className="text-[10px] uppercase font-bold text-text-muted mb-1 block">Gender</Caption>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 bg-white text-xs font-semibold rounded-xl border border-amber-200 text-text-heading focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <Caption className="text-[10px] uppercase font-bold text-text-muted mb-1 block">Age ({age} yrs)</Caption>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="bg-white text-xs py-2 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </SoftCard>

          {/* Height & Weight Sliders */}
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Caption className="text-[10px] uppercase font-bold text-text-muted">Height</Caption>
                <span className="text-xs font-bold text-text-heading">{heightCm} cm</span>
              </div>
              <input
                type="range"
                min={130}
                max={215}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Caption className="text-[10px] uppercase font-bold text-text-muted">Current Weight</Caption>
                <span className="text-xs font-bold text-text-heading">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min={40}
                max={150}
                step={0.5}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Caption className="text-[10px] uppercase font-bold text-text-muted">Target Weight</Caption>
                <span className="text-xs font-bold text-primary">{targetWeightKg} kg</span>
              </div>
              <input
                type="range"
                min={40}
                max={150}
                step={0.5}
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </SoftCard>

          {/* Calorie & Protein Targets */}
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
            <Caption className="text-[10px] uppercase font-bold text-text-muted mb-2 block">
              Nutrition Targets
            </Caption>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Caption className="text-[10px] text-text-secondary block mb-1">Daily Target (kcal)</Caption>
                <Input
                  type="number"
                  value={dailyCalories}
                  onChange={(e) => setDailyCalories(Number(e.target.value))}
                  className="bg-white text-xs py-2 rounded-xl font-bold"
                />
              </div>
              <div>
                <Caption className="text-[10px] text-text-secondary block mb-1">Protein Goal (g)</Caption>
                <Input
                  type="number"
                  value={proteinGoalG}
                  onChange={(e) => setProteinGoalG(Number(e.target.value))}
                  className="bg-white text-xs py-2 rounded-xl font-bold"
                />
              </div>
            </div>
          </SoftCard>
        </div>
      )}

      {/* TAB 2: DIETARY PATTERN & FLEXIBLE HABITS */}
      {activeTab === "diet" && (
        <div className="space-y-3.5 animate-in fade-in">
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
            <Caption className="text-[10px] uppercase font-bold text-text-muted mb-2.5 block">
              Core Dietary Base
            </Caption>
            <div className="grid grid-cols-2 gap-2">
              {dietPatterns.map((p) => {
                const isSelected = dietType === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setDietType(p.id)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all text-center ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-white text-text-secondary border-amber-200/70 hover:bg-[#FFF8F0]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </SoftCard>

          {["flexitarian", "non-vegetarian", "eggetarian"].includes(dietType) && (
            <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs animate-in fade-in">
              <Caption className="text-[10px] uppercase font-bold text-text-muted mb-2 block">
                Non-Veg / Egg Frequency
              </Caption>
              <div className="grid grid-cols-2 gap-2">
                {nonVegFrequencies.map((f) => {
                  const isSelected = nonVegFreq === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setNonVegFreq(f.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-text-secondary border-amber-200"
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </SoftCard>
          )}

          {/* Allergies */}
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
            <Caption className="text-[10px] uppercase font-bold text-text-muted mb-2 block">
              Allergies & Exclusions
            </Caption>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {allergies.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary text-white flex items-center gap-1"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => setAllergies((prev) => prev.filter((a) => a !== item))}
                    className="hover:text-red-200 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="e.g. Gluten-free, No nuts"
                className="bg-white text-xs py-1.5 rounded-xl flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newAllergy.trim()) {
                    setAllergies((prev) => [...prev, newAllergy.trim()]);
                    setNewAllergy("");
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (newAllergy.trim()) {
                    setAllergies((prev) => [...prev, newAllergy.trim()]);
                    setNewAllergy("");
                  }
                }}
                size="sm"
                className="bg-primary text-white text-xs px-3"
              >
                Add
              </Button>
            </div>
          </SoftCard>
        </div>
      )}

      {/* TAB 3: HYDRATION */}
      {activeTab === "hydration" && (
        <div className="space-y-3.5 animate-in fade-in">
          <SoftCard className="p-5 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-3xl text-center shadow-xs">
            <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
              <Droplets className="w-7 h-7 animate-bounce-gentle" />
            </div>
            <H2 className="text-base font-bold text-sky-950 font-heading">Daily Water Goal</H2>
            <p className="text-xs text-sky-700 mt-0.5">
              1 standard glass = ~250 ml (8.5 oz)
            </p>

            <div className="my-4">
              <span className="text-4xl font-black text-sky-950 font-heading">
                {targetGlasses}
              </span>
              <span className="text-xs font-bold text-sky-700 ml-1">glasses (~{(targetGlasses * 0.25).toFixed(1)}L)</span>
            </div>

            <input
              type="range"
              min={4}
              max={14}
              value={targetGlasses}
              onChange={(e) => setTargetGlasses(Number(e.target.value))}
              className="w-full h-3 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
          </SoftCard>
        </div>
      )}

      {/* TAB 4: AI & ADVANCED */}
      {activeTab === "ai" && (
        <div className="space-y-3.5 animate-in fade-in">
          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
            <Caption className="text-[10px] uppercase font-bold text-text-muted mb-2 block">
              Active AI Model
            </Caption>
            <div className="space-y-2">
              {AVAILABLE_TEXT_MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 rounded-2xl cursor-pointer border flex items-center justify-between transition-all ${
                    selectedModel === model.id
                      ? "bg-white border-primary shadow-xs ring-2 ring-primary/20"
                      : "bg-[#FFF9F3] border-amber-200/60"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-text-heading">{model.name}</p>
                    <p className="text-[10px] text-text-muted">{model.provider}</p>
                  </div>
                  {selectedModel === model.id && <Check className="w-4 h-4 text-primary" />}
                </div>
              ))}
            </div>
          </SoftCard>

          <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs space-y-2.5">
            <Caption className="text-[10px] uppercase font-bold text-text-muted block">
              Data & Backup
            </Caption>
            <button
              onClick={handleExportData}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-text-heading text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>Export Nutrition & Weight JSON Backup</span>
            </button>
            <button
              onClick={handleResetData}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reset Profile & Re-Onboard</span>
            </button>
          </SoftCard>
        </div>
      )}

      {/* Confirmation & Save Bar */}
      {savedSuccess && (
        <div className="mt-3 p-3 rounded-2xl bg-green-50 border border-green-200 text-xs font-bold text-green-800 flex items-center justify-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-30">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-xs shadow-lg shadow-primary/30 hover:opacity-95 flex items-center justify-center gap-2"
        >
          {saving ? "Saving Changes..." : "Save Settings ✨"}
        </Button>
      </div>
    </main>
  );
}
