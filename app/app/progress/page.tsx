"use client";

import { useState } from "react";
import { SoftCard } from "@/app/components/ui/soft-card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, H2, Text, Caption } from "@/app/components/ui/typography";
import {
  ArrowLeft,
  Plus,
  TrendingDown,
  TrendingUp,
  Minus,
  Scale,
  Calendar,
  Target,
  Sparkles,
  Mic,
  Award,
  Flame,
  Droplets
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useSavorData } from "@/app/hooks/use-savor-data";
import { VoiceAssistantModal } from "@/app/components/voice/voice-assistant-modal";

export default function ProgressPage() {
  const { profile, weightEntries, latestWeight, logWeight } = useSavorData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [newNote, setNewNote] = useState("");

  const targetWeight = profile?.targetWeightKg || 65;
  const startWeight = profile?.weightKg || latestWeight;

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    const weightVal = parseFloat(newWeight);
    if (!isNaN(weightVal)) {
      await logWeight(weightVal, newNote || "Manual entry", false);
      setNewWeight("");
      setNewNote("");
      setShowAddForm(false);
    }
  };

  // Format chart data (chronological)
  const chartData = [...weightEntries]
    .reverse()
    .slice(-14)
    .map((e) => ({
      date: new Date(e.loggedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: e.weight,
    }));

  const weightDiff = Math.round((latestWeight - startWeight) * 10) / 10;
  const distanceToTarget = Math.abs(Math.round((latestWeight - targetWeight) * 10) / 10);

  return (
    <main className="min-h-screen p-4 pt-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] pb-24 relative overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-2xl bg-white/80 border border-amber-200/60 shadow-xs">
              <ArrowLeft className="w-5 h-5 text-text-heading" />
            </Button>
          </Link>
          <div>
            <H1 className="text-xl font-black text-text-heading font-heading">Wellness Progress</H1>
            <Caption className="text-[11px] text-text-muted">Focusing on consistency & trends</Caption>
          </div>
        </div>

        <button
          onClick={() => setShowVoiceModal(true)}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white shadow-xs hover:opacity-95 transition-transform active:scale-95 flex items-center gap-1.5 text-xs font-bold px-3"
        >
          <Mic className="w-4 h-4" />
          <span>Speak</span>
        </button>
      </div>

      {/* Hero Stats Card */}
      <div className="p-5 rounded-3xl bg-white/90 border border-amber-200/70 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Current Weight
          </span>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            Target: {targetWeight} kg
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-black text-text-heading font-heading">
            {latestWeight}
          </span>
          <span className="text-sm font-bold text-text-secondary">kg</span>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          {distanceToTarget === 0
            ? "You've reached your target! Celebrate your consistency 🎉"
            : `${distanceToTarget} kg to target weight. Remember, daily body fluctuations are natural and healthy 💛`}
        </p>
      </div>

      {/* Weight Trend Chart */}
      <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs mb-4">
        <div className="flex items-center justify-between mb-4">
          <H2 className="text-sm font-bold text-text-heading">14-Day Trend</H2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Log Weight
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddEntry} className="p-3 mb-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2 animate-in fade-in">
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.1"
                placeholder="Weight in kg (e.g. 68.5)"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="bg-white text-xs"
                autoFocus
              />
              <Button type="submit" className="py-2 px-4 text-xs font-bold bg-primary text-white">
                Save
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Optional note (e.g. after morning workout)"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="bg-white text-xs"
            />
          </form>
        )}

        {chartData.length > 1 ? (
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F58549" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EEC170" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E5D8" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#8A7865" }} />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10, fill: "#8A7865" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #E4CDB4",
                    backgroundColor: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                />
                <Area type="monotone" dataKey="weight" stroke="#F58549" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-text-muted">
            Log at least 2 entries to see your gentle moving trend curve!
          </div>
        )}
      </SoftCard>

      {/* Wellness Milestones & Badges */}
      <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs mb-4">
        <H2 className="text-sm font-bold text-text-heading mb-3">Care Milestones</H2>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-text-heading">Morning Habit</span>
            <span className="text-[9px] text-text-muted">Consistent scales</span>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-1.5">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-text-heading">Hydration Pro</span>
            <span className="text-[9px] text-text-muted">8+ daily glasses</span>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-primary flex items-center justify-center mb-1.5">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-text-heading">Mindful Eater</span>
            <span className="text-[9px] text-text-muted">Daily logging</span>
          </div>
        </div>
      </SoftCard>

      {/* Recent Weight Entries */}
      {weightEntries.length > 0 && (
        <SoftCard className="p-4 bg-white/90 border border-amber-100 rounded-3xl shadow-xs">
          <H2 className="text-sm font-bold text-text-heading mb-2.5">Weight Log History</H2>
          <div className="space-y-2">
            {weightEntries.slice(0, 5).map((entry) => (
              <div
                key={entry._id || entry.id || entry.loggedAt}
                className="flex items-center justify-between p-2.5 bg-[#FFF9F3] border border-amber-100/70 rounded-2xl text-xs"
              >
                <div>
                  <span className="font-bold text-text-heading">{entry.weight} kg</span>
                  <span className="text-[10px] text-text-muted ml-2">
                    {entry.isMorningCheckin ? "🌅 Morning" : "Midday"}
                  </span>
                  {entry.note && (
                    <p className="text-[10px] text-text-secondary italic">{entry.note}</p>
                  )}
                </div>
                <span className="text-[10px] text-text-muted">
                  {new Date(entry.loggedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </SoftCard>
      )}

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        initialMode="morning_weight"
      />
    </main>
  );
}
