"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { CheerfulIcon } from "@/app/components/ui/cheerful-icon";

export default function ShowcasePage() {
  const [selectedTheme, setSelectedTheme] = useState<"citrus" | "berry" | "tropical">("citrus");
  const [heightVal, setHeightVal] = useState(172);
  const [waterGlasses, setWaterGlasses] = useState(6);

  const themeConfig = {
    citrus: {
      name: "Sunshine Citrus",
      mascot: "🍊",
      primary: "#FF6B35",
      primaryDark: "#D94814",
      accentGreen: "#06D6A0",
      accentYellow: "#FFD166",
      accentBlue: "#118AB2",
      bgGradient: "from-[#FFFDF8] via-[#FFF4E6] to-[#FFEAD2]",
      cardBorder: "border-amber-200/80",
      pillBg: "bg-amber-100 text-amber-900",
    },
    berry: {
      name: "Juicy Berry",
      mascot: "🍓",
      primary: "#FF3366",
      primaryDark: "#C9184A",
      accentGreen: "#10B981",
      accentYellow: "#FFB703",
      accentBlue: "#00B4D8",
      bgGradient: "from-[#FCF9FF] via-[#FFF0F5] to-[#FFE3EC]",
      cardBorder: "border-pink-200/80",
      pillBg: "bg-pink-100 text-pink-900",
    },
    tropical: {
      name: "Electric Tropic",
      mascot: "🍍",
      primary: "#FF5A1F",
      primaryDark: "#CC3700",
      accentGreen: "#70E000",
      accentYellow: "#FFE600",
      accentBlue: "#00E5FF",
      bgGradient: "from-[#F9FDFA] via-[#F0FDF4] to-[#E6FCFF]",
      cardBorder: "border-emerald-200/80",
      pillBg: "bg-emerald-100 text-emerald-900",
    },
  };

  const current = themeConfig[selectedTheme];

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8 flex flex-col items-center justify-center font-sans">
      {/* Top Header */}
      <div className="max-w-sm w-full mb-5 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-black text-slate-800 mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Interactive Cheerful Palette Showcase</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Select Your Design Vibe
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tap between themes to test live colors, sliders & buttons!
        </p>

        {/* Theme Picker Pills */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
          {(["citrus", "berry", "tropical"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTheme(t)}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-0.5 ${
                selectedTheme === t
                  ? "bg-slate-900 text-white shadow-sm scale-[1.02]"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{themeConfig[t].mascot}</span>
              <span className="text-[10px]">{themeConfig[t].name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Mobile Device Frame */}
      <div
        className={`w-full max-w-sm rounded-[38px] p-5 shadow-2xl border-4 border-white transition-all duration-500 bg-gradient-to-b ${current.bgGradient} relative overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border-2 border-white flex items-center justify-center text-3xl animate-bounce-gentle">
              {current.mascot}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                Good morning, Varun!
              </span>
              <h2 className="text-xl font-black text-slate-900 font-heading">
                Ready to shine? ✨
              </h2>
            </div>
          </div>
          <Link href="/about">
            <div className="w-10 h-10 rounded-2xl bg-white/90 shadow-sm border border-slate-200/80 flex items-center justify-center text-slate-700 text-xs font-black">
              ℹ️
            </div>
          </Link>
        </div>

        {/* 1. Morning Weigh-in Hero Card with CheerfulIcon */}
        <div className={`p-4 rounded-3xl bg-white shadow-sm border ${current.cardBorder} mb-3.5`}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${current.pillBg}`}>
                ☀️ Morning Habit
              </span>
              <h3 className="text-base font-black text-slate-900 font-heading mt-1">
                Say your morning weight
              </h3>
            </div>
            <CheerfulIcon name="scale" size="sm" />
          </div>
          <p className="text-xs text-slate-600 mb-3">
            Tap and speak out loud — gentle, no pressure!
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              className="py-3 px-2 rounded-2xl text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              style={{ backgroundColor: current.primary }}
            >
              <CheerfulIcon name="mic" size="sm" className="w-5 h-5 text-xs shadow-none border-0" />
              <span>Speak Weight</span>
            </button>
            <button className="py-3 px-2 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-black text-xs border border-slate-200 flex items-center justify-center gap-1">
              <span>✏️ Type 68.2 kg</span>
            </button>
          </div>
        </div>

        {/* 2. Vibrant Energy Ring & Macro Badges */}
        <div className={`p-4 rounded-3xl bg-white shadow-sm border ${current.cardBorder} mb-3.5`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase">Daily Fuel</span>
              <h3 className="text-lg font-black text-slate-900 font-heading">
                1,240 <span className="text-xs font-semibold text-slate-500">/ 1,850 kcal</span>
              </h3>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-black text-white shadow-xs"
              style={{ backgroundColor: current.accentGreen }}
            >
              67% Nourished 🔋
            </span>
          </div>

          {/* Chunky Colorful Multi-segment Bar */}
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 flex gap-1 mb-3 border border-slate-200">
            <div className="h-full rounded-full" style={{ width: "35%", backgroundColor: current.primary }}></div>
            <div className="h-full rounded-full" style={{ width: "25%", backgroundColor: current.accentYellow }}></div>
            <div className="h-full rounded-full" style={{ width: "15%", backgroundColor: current.accentBlue }}></div>
          </div>

          {/* 3 Macro Cards with Cheerful Icons */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="p-2 rounded-2xl bg-orange-50/80 border border-orange-200 flex flex-col items-center">
              <CheerfulIcon name="protein" size="sm" className="w-7 h-7 text-xs mb-1" />
              <span className="text-[9px] font-black text-orange-600 block uppercase">Protein</span>
              <span className="text-sm font-black text-orange-950 font-heading">78g</span>
              <span className="text-[9px] text-orange-500 block">goal 110g</span>
            </div>
            <div className="p-2 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col items-center">
              <CheerfulIcon name="carbs" size="sm" className="w-7 h-7 text-xs mb-1" />
              <span className="text-[9px] font-black text-amber-700 block uppercase">Carbs</span>
              <span className="text-sm font-black text-amber-950 font-heading">142g</span>
              <span className="text-[9px] text-amber-600 block">fuel</span>
            </div>
            <div className="p-2 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col items-center">
              <CheerfulIcon name="fat" size="sm" className="w-7 h-7 text-xs mb-1" />
              <span className="text-[9px] font-black text-emerald-700 block uppercase">Fats</span>
              <span className="text-sm font-black text-emerald-950 font-heading">38g</span>
              <span className="text-[9px] text-emerald-500 block">healthy</span>
            </div>
          </div>
        </div>

        {/* 3. Aquatic Hydration Tracker */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-sky-50 to-cyan-50 border-2 border-sky-200 shadow-sm mb-3.5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheerfulIcon name="water" size="sm" />
              <div>
                <h4 className="text-xs font-black text-sky-950 font-heading">Hydration Goal</h4>
                <span className="text-[10px] font-bold text-sky-700">{waterGlasses} / 8 glasses (~{(waterGlasses * 0.25).toFixed(1)}L)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setWaterGlasses((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-xl bg-white text-sky-700 font-black border border-sky-200 flex items-center justify-center active:scale-95"
              >
                −
              </button>
              <button
                onClick={() => setWaterGlasses((p) => Math.min(10, p + 1))}
                className="w-8 h-8 rounded-xl text-white font-black flex items-center justify-center active:scale-95 shadow-xs"
                style={{ backgroundColor: current.accentBlue }}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center h-8 px-1">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                onClick={() => setWaterGlasses(i + 1)}
                className={`w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                  i < waterGlasses
                    ? "bg-sky-500 text-white text-xs shadow-xs scale-105"
                    : "bg-sky-200/50 text-sky-400 text-xs"
                }`}
              >
                {i < waterGlasses ? "💧" : "🫧"}
              </div>
            ))}
          </div>
        </div>

        {/* 4. Touch-Friendly Slider Demo */}
        <div className={`p-4 rounded-3xl bg-white shadow-sm border ${current.cardBorder} mb-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-800 font-heading">📏 Tactile Stepper Slider</span>
            <span
              className="text-xs font-black px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: current.primary }}
            >
              {heightVal} cm
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setHeightVal((p) => Math.max(130, p - 1))}
              className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-800 font-black flex items-center justify-center active:scale-95 shadow-xs"
            >
              −
            </button>
            <input
              type="range"
              min={130}
              max={215}
              value={heightVal}
              onChange={(e) => setHeightVal(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <button
              onClick={() => setHeightVal((p) => Math.min(215, p + 1))}
              className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-800 font-black flex items-center justify-center active:scale-95 shadow-xs"
            >
              +
            </button>
          </div>
        </div>

        {/* Main CTA */}
        <button
          className="w-full py-4 rounded-2xl text-white font-black text-sm font-heading transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
          style={{ backgroundColor: current.primary }}
        >
          <span>Log a Delicious Meal ✨</span>
          <span>→</span>
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link href="/about" className="text-xs text-slate-500 hover:text-slate-800 underline font-medium">
          View Science, Nutrition Sources & About Savor →
        </Link>
      </div>
    </main>
  );
}
