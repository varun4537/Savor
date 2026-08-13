"use client";

import React from "react";

interface CheerfulIconProps {
  name:
    | "sun"
    | "scale"
    | "mic"
    | "flame"
    | "protein"
    | "carbs"
    | "fat"
    | "water"
    | "sparkles"
    | "moon"
    | "camera"
    | "check"
    | "trophy"
    | "plate"
    | "apple"
    | "heart";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function CheerfulIcon({ name, size = "md", className = "" }: CheerfulIconProps) {
  const sizeMap = {
    sm: "w-8 h-8 text-base",
    md: "w-11 h-11 text-xl",
    lg: "w-14 h-14 text-2xl",
    xl: "w-18 h-18 text-3xl",
  };

  const configMap: Record<
    string,
    { emoji: string; bg: string; border: string; shadow: string }
  > = {
    sun: {
      emoji: "☀️",
      bg: "bg-gradient-to-tr from-amber-200 to-yellow-100",
      border: "border-amber-300",
      shadow: "shadow-amber-200/50",
    },
    scale: {
      emoji: "⚖️",
      bg: "bg-gradient-to-tr from-orange-200 to-amber-100",
      border: "border-orange-300",
      shadow: "shadow-orange-200/50",
    },
    mic: {
      emoji: "🎙️",
      bg: "bg-gradient-to-tr from-rose-200 to-pink-100",
      border: "border-rose-300",
      shadow: "shadow-rose-200/50",
    },
    flame: {
      emoji: "🔥",
      bg: "bg-gradient-to-tr from-red-200 to-orange-100",
      border: "border-orange-300",
      shadow: "shadow-orange-200/50",
    },
    protein: {
      emoji: "🥩",
      bg: "bg-gradient-to-tr from-orange-200 to-amber-100",
      border: "border-orange-300",
      shadow: "shadow-orange-200/50",
    },
    carbs: {
      emoji: "🍚",
      bg: "bg-gradient-to-tr from-yellow-200 to-amber-100",
      border: "border-yellow-300",
      shadow: "shadow-yellow-200/50",
    },
    fat: {
      emoji: "🥑",
      bg: "bg-gradient-to-tr from-emerald-200 to-green-100",
      border: "border-emerald-300",
      shadow: "shadow-emerald-200/50",
    },
    water: {
      emoji: "💧",
      bg: "bg-gradient-to-tr from-sky-200 to-cyan-100",
      border: "border-sky-300",
      shadow: "shadow-sky-200/50",
    },
    sparkles: {
      emoji: "✨",
      bg: "bg-gradient-to-tr from-amber-200 to-yellow-100",
      border: "border-amber-300",
      shadow: "shadow-amber-200/50",
    },
    moon: {
      emoji: "🌙",
      bg: "bg-gradient-to-tr from-purple-200 to-indigo-100",
      border: "border-purple-300",
      shadow: "shadow-purple-200/50",
    },
    camera: {
      emoji: "📸",
      bg: "bg-gradient-to-tr from-orange-200 to-amber-100",
      border: "border-orange-300",
      shadow: "shadow-orange-200/50",
    },
    check: {
      emoji: "✅",
      bg: "bg-gradient-to-tr from-green-200 to-emerald-100",
      border: "border-green-300",
      shadow: "shadow-green-200/50",
    },
    trophy: {
      emoji: "🏆",
      bg: "bg-gradient-to-tr from-yellow-200 to-amber-100",
      border: "border-yellow-300",
      shadow: "shadow-yellow-200/50",
    },
    plate: {
      emoji: "🍱",
      bg: "bg-gradient-to-tr from-orange-200 to-amber-100",
      border: "border-orange-300",
      shadow: "shadow-orange-200/50",
    },
    apple: {
      emoji: "🍎",
      bg: "bg-gradient-to-tr from-red-200 to-rose-100",
      border: "border-red-300",
      shadow: "shadow-red-200/50",
    },
    heart: {
      emoji: "🧡",
      bg: "bg-gradient-to-tr from-pink-200 to-rose-100",
      border: "border-pink-300",
      shadow: "shadow-pink-200/50",
    },
  };

  const item = configMap[name] || configMap.sun;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl border-2 ${item.bg} ${item.border} ${item.shadow} shadow-md shrink-0 transition-transform active:scale-95 select-none ${sizeMap[size]} ${className}`}
    >
      <span className="drop-shadow-xs">{item.emoji}</span>
    </div>
  );
}
