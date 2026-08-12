"use client";

import { useState } from "react";
import { Scale, Mic, CheckCircle, Sparkles, Plus, ArrowRight } from "lucide-react";
import { SoftCard } from "@/app/components/ui/soft-card";
import { Button } from "@/app/components/ui/button";
import { VoiceAssistantModal } from "@/app/components/voice/voice-assistant-modal";
import { useSavorData } from "@/app/hooks/use-savor-data";

export function MorningCheckinCard() {
  const { morningCheckedInToday, latestWeight, profile, logWeight } = useSavorData();
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualWeight, setManualWeight] = useState("");

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(manualWeight);
    if (!isNaN(val) && val > 20 && val < 300) {
      await logWeight(val, "Manual morning check-in", true);
      setShowManualInput(false);
      setManualWeight("");
    }
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F2] via-[#FFF3E3] to-[#FFE8D1] p-5 shadow-sm border border-amber-200/60 transition-all hover:shadow-md">
        {/* Decorative subtle background icon */}
        <Scale className="absolute -right-3 -bottom-3 w-28 h-28 text-amber-500/10 pointer-events-none" />

        {morningCheckedInToday ? (
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shadow-inner">
                <CheckCircle className="w-6 h-6 animate-in zoom-in-50" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-200/60 px-2 py-0.5 rounded-full">
                    Morning Check-in Done
                  </span>
                </div>
                <p className="text-sm font-bold text-text-heading mt-0.5">
                  {latestWeight} kg recorded today ☀️
                </p>
                <p className="text-[11px] text-text-secondary">
                  {profile?.targetWeightKg
                    ? `${Math.abs(Math.round((latestWeight - profile.targetWeightKg) * 10) / 10)} kg from target`
                    : "Consistent tracking builds mindful habits"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowVoiceModal(true)}
              className="p-2.5 rounded-xl bg-white/80 hover:bg-white text-text-secondary border border-amber-200/60 shadow-sm transition-transform active:scale-95"
              title="Update today's weight"
            >
              <Mic className="w-4 h-4 text-primary" />
            </button>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900 text-[11px] font-bold tracking-wide">
                <Sparkles className="w-3 h-3 text-primary animate-spin" style={{ animationDuration: '4s' }} />
                Morning Habit
              </div>
              <span className="text-[11px] text-text-muted">Tap & Speak</span>
            </div>

            <h3 className="text-base font-bold text-text-heading font-heading">
              Weighed yourself this morning?
            </h3>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
              Step on the scale, tap the mic and say your weight in seconds.
            </p>

            <div className="mt-3.5 flex items-center gap-2">
              <button
                onClick={() => setShowVoiceModal(true)}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-xs shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Mic className="w-4 h-4 animate-pulse" />
                <span>Speak Weight Now</span>
              </button>

              <button
                onClick={() => setShowManualInput(!showManualInput)}
                className="py-3 px-3 rounded-2xl bg-white/90 border border-amber-200/80 text-text-primary text-xs font-semibold hover:bg-white shadow-sm transition-transform active:scale-95"
                title="Type weight manually"
              >
                123
              </button>
            </div>

            {/* Manual input dropdown if preferred */}
            {showManualInput && (
              <form onSubmit={handleManualSubmit} className="mt-3 flex gap-2 animate-in fade-in">
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 68.5"
                  value={manualWeight}
                  onChange={(e) => setManualWeight(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-xl border border-amber-300 bg-white text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/40"
                  autoFocus
                />
                <Button type="submit" className="py-2 px-4 text-xs font-bold bg-primary text-white">
                  Save
                </Button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Voice Assistant Modal in morning_weight mode */}
      <VoiceAssistantModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        initialMode="morning_weight"
      />
    </>
  );
}
