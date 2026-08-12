"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { ArrowRight, Sparkles, UserCheck, Mail } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // If user already has a profile, let them continue straight to dashboard
    const savedProfile = localStorage.getItem("savor_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed.name) {
          router.push("/");
          return;
        }
      } catch (e) {}
    }
  }, [router]);

  const handleGuestExplore = () => {
    let storedId = localStorage.getItem("savor_user_id");
    if (!storedId) {
      storedId = "savor_guest_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("savor_user_id", storedId);
    }

    const savedProfile = localStorage.getItem("savor_profile");
    if (savedProfile) {
      router.push("/");
    } else {
      router.push("/onboarding/name");
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      if (!isSupabaseConfigured() || !supabase) {
        // Fallback directly to guest explore so user is never blocked
        handleGuestExplore();
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.warn("Google auth error, falling back to guest mode:", err?.message);
      // Automatically continue as guest so the user is never stuck
      handleGuestExplore();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-secondary/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-primary/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hero Section */}
      <div className="pt-8 text-center flex flex-col items-center">
        {/* Animated mascot logo */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-amber-200/80 flex items-center justify-center shadow-lg shadow-amber-200/40 mb-6 animate-float">
          <span className="text-4xl">🍊</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gentle Nutrition Companion</span>
        </div>

        <H1 className="text-3xl font-black text-text-heading font-heading mb-2">
          Savor
        </H1>
        <Text className="text-text-secondary text-sm max-w-xs leading-relaxed">
          Mindful calories, morning voice weigh-ins, and personalized meal planning — without guilt or pressure.
        </Text>
      </div>

      {/* Auth & Quick Skip Actions */}
      <div className="w-full space-y-3 my-6">
        {/* 1. Quick Explore without Sign up (Primary User Friendly Path) */}
        <Button
          onClick={handleGuestExplore}
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-sm shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Exploring (No Sign Up)</span>
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* 2. Continue with Google */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          disabled={loading}
          className="w-full py-5 rounded-2xl bg-white hover:bg-amber-50 text-text-heading border border-amber-200/80 shadow-xs flex items-center justify-center gap-2.5 active:scale-98 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          <span className="text-xs font-bold">Continue with Google</span>
        </Button>

        {/* 3. Sign Up with Email */}
        <button
          onClick={() => router.push("/onboarding/signup")}
          className="w-full py-3 text-center text-xs font-bold text-text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1.5"
        >
          <Mail className="w-3.5 h-3.5 text-primary" />
          <span>Sign up with Email</span>
        </button>

        {authError && (
          <p className="text-xs text-center text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
            {authError}
          </p>
        )}
      </div>

      {/* Footer / About */}
      <div className="text-center pt-2 pb-4">
        <a href="/about" className="text-[11px] text-text-muted hover:text-primary transition-colors font-medium">
          About Savor • Privacy First • Zero Judgement
        </a>
      </div>
    </main>
  );
}
