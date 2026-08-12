"use client";

import { useSavorData } from "@/app/hooks/use-savor-data";
import { SoftCard } from "@/app/components/ui/soft-card";
import { H2, Text, Caption } from "@/app/components/ui/typography";
import { Droplets, Plus, Minus } from "lucide-react";

export function HydrationCard() {
  const { hydration, incrementGlass, decrementGlass } = useSavorData();
  const glasses = hydration.glasses;
  const target = hydration.targetGlasses || 8;

  const fillPercent = Math.min((glasses / target) * 100, 100);

  return (
    <SoftCard className="p-4 bg-gradient-to-r from-sky-50/80 via-cyan-50/80 to-blue-50/80 border border-sky-200/60 rounded-3xl shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-inner">
            <Droplets className="w-5 h-5 animate-bounce-gentle" />
          </div>
          <div>
            <p className="text-xs font-bold text-text-heading">Hydration</p>
            <p className="text-[11px] text-text-secondary font-medium">
              {glasses} / {target} glasses (~{(glasses * 0.25).toFixed(1)}L)
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
                  i < glasses
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
  );
}
