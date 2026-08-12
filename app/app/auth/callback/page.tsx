"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { H1, Text } from "@/app/components/ui/typography";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedProfile = localStorage.getItem("savor_profile");
      if (savedProfile) {
        router.replace("/");
      } else {
        router.replace("/onboarding/name");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-amber-100/90 border border-amber-200 text-primary flex items-center justify-center font-bold text-3xl shadow-lg mb-6 animate-bounce-gentle">
        🍊
      </div>

      <H1 className="text-2xl font-black text-text-heading font-heading mb-2">
        Savor
      </H1>

      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <Text className="text-xs text-text-secondary font-semibold">
          Launching your gentle companion...
        </Text>
      </div>
    </main>
  );
}
