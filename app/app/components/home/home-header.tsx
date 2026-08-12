"use client";

import { H1, Text } from "@/app/components/ui/typography";
import { Settings, User, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useSavorUser } from "@/app/ConvexClientProvider";

interface HomeHeaderProps {
  name?: string;
}

const subtextOptions = [
  "Here when you need.",
  "No pressure today.",
  "Take your time.",
  "Checking in is enough.",
  "Just here if you want.",
  "Small steps lead to great health.",
  "Nourish your body and mind.",
];

export function HomeHeader({ name }: HomeHeaderProps) {
  const { userName, isAuthenticated } = useSavorUser();
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "Good morning" : hours < 18 ? "Good afternoon" : "Good evening";

  // Use name passed as prop, or authenticated user name, or default "friend"
  const displayName = name || userName || "friend";

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const subtext = subtextOptions[dayOfYear % subtextOptions.length];

  return (
    <div className="flex items-start justify-between mb-5 px-1">
      <div className="space-y-0.5">
        <H1 className="text-xl font-black text-text-heading font-heading">
          {greeting}, {displayName}.
        </H1>
        <Text className="text-xs text-text-secondary font-medium">{subtext}</Text>
      </div>

      <div className="flex items-center gap-1.5">
        <Link href="/settings">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-2xl bg-white/80 border border-amber-200/60 shadow-xs hover:bg-white transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-text-heading" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
