"use client";

import React, { useEffect, useState } from "react";

interface BackgroundWaterEffectProps {
  currentGlasses: number;
  targetGlasses?: number;
}

export function BackgroundWaterEffect({
  currentGlasses,
  targetGlasses = 8,
}: BackgroundWaterEffectProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Calculate percentage: if 0 glasses, show a tiny 4% baseline puddle so the user notices the water line
  const rawPercentage = (currentGlasses / targetGlasses) * 100;
  const fillPercentage = currentGlasses === 0 ? 3 : Math.min(100, Math.max(3, rawPercentage));
  const isFull = currentGlasses >= targetGlasses;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      {/* Background Ambient Bubbles when water is rising */}
      <div className="absolute inset-0 overflow-hidden">
        {currentGlasses > 0 && (
          <>
            <div
              className="absolute text-xl animate-float opacity-30"
              style={{
                left: "12%",
                bottom: `${Math.min(fillPercentage - 5, 80)}%`,
                animationDuration: "4s",
              }}
            >
              🫧
            </div>
            <div
              className="absolute text-2xl animate-float opacity-40"
              style={{
                left: "75%",
                bottom: `${Math.min(fillPercentage - 10, 85)}%`,
                animationDuration: "5s",
                animationDelay: "1.5s",
              }}
            >
              🫧
            </div>
            <div
              className="absolute text-sm animate-float opacity-30"
              style={{
                left: "45%",
                bottom: `${Math.min(fillPercentage - 8, 70)}%`,
                animationDuration: "3.5s",
                animationDelay: "0.8s",
              }}
            >
              🫧
            </div>
          </>
        )}
      </div>

      {/* The Rising Liquid Water Container */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
        style={{
          height: `${fillPercentage}%`,
        }}
      >
        {/* Animated Wave Crest at the top of the water level */}
        <div className="absolute -top-6 left-0 right-0 w-[200%] h-7 overflow-hidden leading-none">
          <svg
            className="w-full h-full animate-wave opacity-60 text-sky-300"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,50 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="absolute -top-5 left-0 right-0 w-[200%] h-6 overflow-hidden leading-none">
          <svg
            className="w-full h-full animate-wave-slow opacity-40 text-cyan-300"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            style={{ animationDirection: "reverse" }}
          >
            <path
              d="M0,0 C200,60 400,-20 600,40 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Liquid Body: Translucent Gradient that fills up */}
        <div
          className={`w-full h-full transition-colors duration-700 ${
            isFull
              ? "bg-gradient-to-t from-sky-400/35 via-cyan-300/25 to-sky-200/20 backdrop-blur-[0.5px]"
              : "bg-gradient-to-t from-sky-300/30 via-cyan-200/20 to-sky-100/15"
          }`}
        >
          {/* Subtle light shimmer lines */}
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-60" />
        </div>
      </div>
    </div>
  );
}
