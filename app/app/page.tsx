"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SoftCard } from "@/app/components/ui/soft-card";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import { CircularProgress } from "@/app/components/ui/circular-progress";
import { QuickMealLogger } from "@/app/components/home/quick-meal-logger";
import { MorningCheckinCard } from "@/app/components/home/morning-checkin-card";
import { VoiceAssistantModal } from "@/app/components/voice/voice-assistant-modal";
import {
  ChefHat,
  History,
  Loader2,
  Smile,
  Meh,
  Frown,
  Zap,
  Coffee,
  Scale,
  TrendingUp,
  Droplets,
  Calendar,
  Utensils,
  Sparkles,
  Settings,
  Sun,
  Moon,
  Sunrise,
  Mic,
  Camera,
  Heart
} from "lucide-react";
import Link from "next/link";
import { useSavorData } from "@/app/hooks/use-savor-data";

const moods = [
  { id: "great", icon: Zap, label: "Energized", color: "text-amber-500", bg: "bg-amber-100/80" },
  { id: "good", icon: Smile, label: "Good", color: "text-green-500", bg: "bg-green-100/80" },
  { id: "okay", icon: Meh, label: "Okay", color: "text-blue-500", bg: "bg-blue-100/80" },
  { id: "tired", icon: Coffee, label: "Tired", color: "text-orange-500", bg: "bg-orange-100/80" },
  { id: "low", icon: Frown, label: "Low", color: "text-rose-400", bg: "bg-rose-100/80" },
];

export default function Home() {
  const router = useRouter();
  const {
    profile,
    todayMeals,
    totalCaloriesToday,
    hydration,
    incrementGlass,
    decrementGlass,
    isConvexConnected,
  } = useSavorData();

  const [loading, setLoading] = useState(true);
  const [todayMood, setTodayMood] = useState<string | null>(null);
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  useEffect(() => {
    // Check if onboarding completed
    const saved = localStorage.getItem("savor_profile");
    if (!saved && !profile?.name) {
      router.push("/welcome");
      return;
    }

    const today = new Date().toDateString();
    const lastMoodDate = localStorage.getItem("savor_mood_date");
    const lastMood = localStorage.getItem("savor_mood");
    if (lastMoodDate === today && lastMood) {
      setTodayMood(lastMood);
    } else {
      setShowMoodCheck(true);
    }

    setLoading(false);
  }, [profile, router]);

  const targetCalories = profile?.dailyCalories || 2000;
  const remainingCalories = Math.max(0, targetCalories - totalCaloriesToday);
  const caloriePercentage = Math.min(100, Math.round((totalCaloriesToday / targetCalories) * 100));

  const handleMoodSelect = (moodId: string) => {
    const today = new Date().toDateString();
    localStorage.setItem("savor_mood_date", today);
    localStorage.setItem("savor_mood", moodId);
    setTodayMood(moodId);
    setShowMoodCheck(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sunrise };
    if (hour < 17) return { text: "Good afternoon", icon: Sun };
    return { text: "Good evening", icon: Moon };
  };

  const getSmartTip = () => {
    const hour = new Date().getHours();
    const remaining = remainingCalories;

    if (hour < 11 && todayMeals.length === 0) {
      return "Start your day with a warm, nourishing breakfast! 🍳";
    }
    if (hour >= 12 && hour < 15 && todayMeals.length < 2) {
      return "Lunchtime vibes! Try adding some colorful fiber 🥗";
    }
    if (hour >= 18 && remaining > 500) {
      return "Plenty of room for a cozy, satisfying dinner 🍲";
    }
    if (remaining < 300 && remaining > 0) {
      return "A light snack or herbal tea would be perfect 🍵";
    }
    if (caloriePercentage >= 100) {
      return "You've met your daily energy needs! Rest and glow ✨";
    }
    return "Listen to your body and eat with mindful joy 💛";
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FFF7ED]">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-glow mb-3">
          <Sparkles className="w-8 h-8 text-primary animate-bounce" />
        </div>
        <p className="text-sm font-semibold text-text-heading">Waking up Savor...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] pb-24">
      {/* Soft ambient background glows */}
      <div className="fixed top-[-10%] right-[-10%] w-[70vw] h-[70vw] max-w-[400px] max-h-[400px] bg-secondary/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[350px] max-h-[350px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="p-4 pt-6 max-w-md mx-auto flex flex-col gap-4">
        {/* ===== TOP HERO & GREETING ===== */}
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-1.5 text-text-muted text-xs font-semibold uppercase tracking-wider">
              <GreetingIcon className="w-3.5 h-3.5 text-primary" />
              <span>{greeting.text}</span>
            </div>
            <H1 className="text-2xl font-bold text-text-heading mt-0.5">
              {profile?.name || "Friend"} ✨
            </H1>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/settings">
              <button
                className="p-2.5 rounded-2xl bg-white/80 border border-amber-200/60 shadow-sm text-text-secondary hover:bg-white transition-transform active:scale-95"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* ===== MORNING WEIGH-IN HERO CARD ===== */}
        <MorningCheckinCard />

        {/* ===== CALORIE RING & DAILY NUTRITION BALANCE ===== */}
        <SoftCard className="p-5 bg-white/85 shadow-sm border border-amber-100/80 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-heading uppercase tracking-wide">
                Today's Balance
              </span>
              {isConvexConnected && (
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Real-time Convex Synced" />
              )}
            </div>
            <span className="text-xs font-medium text-text-muted">
              {caloriePercentage}% of daily goal
            </span>
          </div>

          <div className="flex items-center gap-5">
            {/* Soft Circular Ring */}
            <div className="relative shrink-0 flex items-center justify-center">
              <CircularProgress value={caloriePercentage} size="lg" color="gradient">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-text-heading font-heading">
                    {remainingCalories}
                  </span>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    kcal left
                  </span>
                </div>
              </CircularProgress>
            </div>

            {/* Quick Macro Breakdown Columns */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center px-3 py-2 bg-[#FFF8F0] border border-amber-100 rounded-2xl">
                <span className="text-xs font-medium text-text-secondary">Eaten</span>
                <span className="text-xs font-bold text-text-heading">{totalCaloriesToday} kcal</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-[#FFF8F0] border border-amber-100 rounded-2xl">
                <span className="text-xs font-medium text-text-secondary">Target</span>
                <span className="text-xs font-bold text-text-heading">{targetCalories} kcal</span>
              </div>
              <div className="flex justify-between items-center px-3 py-2 bg-[#FFF8F0] border border-amber-100 rounded-2xl">
                <span className="text-xs font-medium text-text-secondary">Meals</span>
                <span className="text-xs font-bold text-primary">{todayMeals.length} logged</span>
              </div>
            </div>
          </div>

          {/* Daily Mood Check-in Bar */}
          {showMoodCheck ? (
            <div className="mt-4 pt-3.5 border-t border-amber-100">
              <span className="text-xs font-semibold text-text-secondary block text-center mb-2">
                How's your energy right now?
              </span>
              <div className="flex justify-center gap-2.5">
                {moods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleMoodSelect(m.id)}
                      className={`p-2.5 rounded-2xl ${m.bg} hover:scale-110 active:scale-95 transition-all shadow-xs`}
                      title={m.label}
                    >
                      <Icon className={`w-4 h-4 ${m.color}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            todayMood && (
              <div className="mt-3.5 pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-primary" /> Feeling {todayMood}
                </span>
                <button
                  onClick={() => setShowMoodCheck(true)}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  Update
                </button>
              </div>
            )
          )}
        </SoftCard>

        {/* ===== SMART COMPANION TIP ===== */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-100/60 to-orange-100/60 border border-amber-200/60 rounded-2xl shadow-xs">
          <Sparkles className="w-4 h-4 text-primary shrink-0 animate-bounce-gentle" />
          <p className="text-xs font-medium text-text-heading leading-relaxed">
            {getSmartTip()}
          </p>
        </div>

        {/* ===== QUICK LOG ACTIONS BAR ===== */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link href="/log/photo">
            <button className="w-full py-3.5 px-4 rounded-2xl bg-white/90 border border-amber-200/80 shadow-xs hover:bg-white text-text-heading flex items-center justify-center gap-2 font-bold text-xs active:scale-98 transition-transform">
              <Camera className="w-4 h-4 text-primary" />
              <span>Snap Meal Photo</span>
            </button>
          </Link>

          <button
            onClick={() => setShowVoiceAssistant(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white shadow-md shadow-primary/20 flex items-center justify-center gap-2 font-bold text-xs active:scale-98 transition-transform hover:opacity-95"
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span>Voice Assistant</span>
          </button>
        </div>

        {/* ===== QUICK TEXT MEAL LOGGER ===== */}
        <QuickMealLogger />

        {/* ===== TODAY'S LOGGED MEALS ===== */}
        {todayMeals.length > 0 && (
          <SoftCard className="p-4 bg-white/90 rounded-3xl border border-amber-100 shadow-sm">
            <div className="flex items-center justify-between mb-3 px-1">
              <H2 className="text-sm font-bold text-text-heading">Today's Meals</H2>
              <Link href="/history" className="text-xs text-primary font-bold hover:underline">
                View all ({todayMeals.length}) →
              </Link>
            </div>
            <div className="space-y-2">
              {todayMeals.slice(0, 4).map((meal) => (
                <div
                  key={meal.id || meal._id}
                  className="flex items-center justify-between p-2.5 bg-[#FFF9F3] border border-amber-100/70 rounded-2xl hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-heading truncate">
                        {meal.name}
                      </p>
                      <span className="text-[10px] text-text-muted">
                        {new Date(meal.loggedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        {meal.proteinG ? ` • ${meal.proteinG}g protein` : ""}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-primary shrink-0 ml-2">
                    {meal.caloriesAvg} kcal
                  </span>
                </div>
              ))}
            </div>
          </SoftCard>
        )}

        {/* ===== HYDRATION TRACKER ===== */}
        <SoftCard className="p-4 bg-gradient-to-r from-sky-50/80 via-cyan-50/80 to-blue-50/80 border border-sky-200/60 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-inner">
                <Droplets className="w-5 h-5 animate-bounce-gentle" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-heading">Hydration</p>
                <p className="text-[11px] text-text-secondary font-medium">
                  {hydration.glasses} / {hydration.targetGlasses} glasses today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => decrementGlass()}
                className="w-7 h-7 rounded-xl bg-white/90 text-text-secondary border border-sky-200 text-xs font-bold flex items-center justify-center hover:bg-white active:scale-95"
                title="Subtract glass"
              >
                -
              </button>

              <div className="flex gap-1 px-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-6 rounded-full transition-all duration-300 ${
                      i < hydration.glasses
                        ? "bg-sky-500 shadow-xs shadow-sky-400 scale-105"
                        : "bg-sky-200/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => incrementGlass()}
                className="w-7 h-7 rounded-xl bg-sky-500 text-white text-xs font-bold flex items-center justify-center shadow-xs shadow-sky-400/30 hover:bg-sky-600 active:scale-95"
                title="Add glass"
              >
                +
              </button>
            </div>
          </div>
        </SoftCard>

        {/* ===== NAVIGATION HUB GRID ===== */}
        <div className="grid grid-cols-4 gap-2.5">
          <Link href="/diet-plan">
            <SoftCard className="p-3 bg-white/80 hover:bg-white rounded-2xl border border-amber-100 flex flex-col items-center gap-1 transition-all active:scale-95 shadow-xs">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-text-heading">Diet Plan</span>
            </SoftCard>
          </Link>

          <Link href="/pantry">
            <SoftCard className="p-3 bg-white/80 hover:bg-white rounded-2xl border border-amber-100 flex flex-col items-center gap-1 transition-all active:scale-95 shadow-xs">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                <ChefHat className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-text-heading">Pantry</span>
            </SoftCard>
          </Link>

          <Link href="/progress">
            <SoftCard className="p-3 bg-white/80 hover:bg-white rounded-2xl border border-amber-100 flex flex-col items-center gap-1 transition-all active:scale-95 shadow-xs">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-text-heading">Progress</span>
            </SoftCard>
          </Link>

          <Link href="/history">
            <SoftCard className="p-3 bg-white/80 hover:bg-white rounded-2xl border border-amber-100 flex flex-col items-center gap-1 transition-all active:scale-95 shadow-xs">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <History className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-text-heading">History</span>
            </SoftCard>
          </Link>
        </div>
      </div>

      {/* ===== FLOATING INTERACTIVE VOICE ORB TRIGGER ===== */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowVoiceAssistant(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary via-[#F58549] to-[#EEC170] text-white flex items-center justify-center shadow-lg shadow-primary/35 hover:scale-108 active:scale-95 transition-all animate-pulse-glow"
          title="Open Voice Companion"
        >
          <Mic className="w-6 h-6 animate-bounce-gentle" />
        </button>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={showVoiceAssistant}
        onClose={() => setShowVoiceAssistant(false)}
        initialMode="general"
      />
    </main>
  );
}
