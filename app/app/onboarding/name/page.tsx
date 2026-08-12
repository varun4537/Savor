"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, Text } from "@/app/components/ui/typography";
import { ArrowRight, Sparkles, Heart } from "lucide-react";

export default function NamePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem("savor_profile");
    if (savedProfile) {
      router.push("/");
    }
  }, [router]);

  const handleContinue = () => {
    if (name.trim()) {
      sessionStorage.setItem("onboarding_name", name.trim());
      router.push("/onboarding/gender");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && name.trim()) {
      handleContinue();
    }
  };

  return (
    <main className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-[#FFFDF9] to-[#FFF4E8] flex flex-col p-6 max-w-md mx-auto">
      {/* Visual Step Progress Bar */}
      <div className="flex gap-1.5 mb-6 pt-2">
        <div className="h-1.5 flex-1 rounded-full bg-primary shadow-xs" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
        <div className="h-1.5 flex-1 rounded-full bg-amber-200/50" />
      </div>

      {/* Mascot & Intro */}
      <div className="pt-4 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-amber-200/80 flex items-center justify-center shadow-md animate-float">
          <span className="text-3xl">🍊</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-primary text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Welcome to Savor</span>
        </div>

        <H1 className="text-2xl font-black text-text-heading font-heading mb-2">
          What should we call you?
        </H1>
        <Text className="text-text-secondary text-sm max-w-xs mx-auto leading-relaxed">
          I'm Savor, your kind, non-judgmental wellness companion. Let's start with your name!
        </Text>
      </div>

      {/* Input */}
      <div className="my-8 w-full max-w-sm mx-auto">
        <div className="relative">
          <Input
            type="text"
            placeholder="Type your name or nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="text-center text-lg py-5 rounded-2xl bg-white shadow-sm border-amber-200 focus:border-primary text-text-heading font-semibold"
            autoComplete="name"
            autoFocus
          />
        </div>

        {name.trim() && (
          <p className="text-center text-xs font-bold text-primary mt-3 animate-in fade-in flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-primary" /> Lovely to meet you, {name.trim()}!
          </p>
        )}
      </div>

      <div className="flex-1" />

      {/* CTA Button */}
      <div className="w-full max-w-sm mx-auto pb-6">
        <Button
          onClick={handleContinue}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all"
          disabled={!name.trim()}
        >
          <span>Continue</span>
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </main>
  );
}
