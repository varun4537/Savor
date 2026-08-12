"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { H1, Text, Caption } from "@/app/components/ui/typography";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Securing your space...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthExchange = async () => {
      try {
        if (!isSupabaseConfigured()) {
          // If in local/guest mode, redirect straight to dashboard
          router.replace("/");
          return;
        }

        const supabase = createClient();
        if (!supabase) {
          router.replace("/");
          return;
        }

        // Get the active session after OAuth exchange
        const { data, error: sessionErr } = await supabase.auth.getSession();

        if (sessionErr) {
          throw sessionErr;
        }

        if (data?.session?.user) {
          const user = data.session.user;
          // Set persistent user ID
          localStorage.setItem("savor_user_id", user.id);

          // If Google provides user metadata like full name, prefill local profile
          const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
          const savedProfile = localStorage.getItem("savor_profile");

          if (!savedProfile && fullName) {
            const initialProfile = {
              name: fullName,
              email: user.email,
              dailyCalories: 2000,
              proteinGoalG: 100,
              dietPreference: "flexitarian",
            };
            localStorage.setItem("savor_profile", JSON.stringify(initialProfile));
          }

          setStatus("Welcome to Savor! Launching your companion...");
          setTimeout(() => {
            if (savedProfile) {
              router.replace("/");
            } else {
              router.replace("/onboarding/name");
            }
          }, 600);
        } else {
          // Fallback redirect
          router.replace("/");
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Could not complete sign in. Redirecting...");
        setTimeout(() => router.replace("/login"), 2500);
      }
    };

    handleAuthExchange();
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-amber-100/90 border border-amber-200 text-primary flex items-center justify-center font-bold text-3xl shadow-lg mb-6 animate-bounce-gentle">
        🍊
      </div>

      <H1 className="text-2xl font-black text-text-heading font-heading mb-2">
        Savor
      </H1>

      {error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 max-w-xs space-y-1">
          <p className="font-bold flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" /> Sign In Notice
          </p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <Text className="text-xs text-text-secondary font-semibold">{status}</Text>
        </div>
      )}
    </main>
  );
}
