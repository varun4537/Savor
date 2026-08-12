"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSkipSignUp = () => {
    let storedId = localStorage.getItem("savor_user_id");
    if (!storedId) {
      storedId = "savor_user_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("savor_user_id", storedId);
    }
    router.push("/onboarding/name");
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      if (!isSupabaseConfigured() || !supabase) {
        // Automatically allow user to proceed locally without blocking
        handleSkipSignUp();
        return;
      }

      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpErr) {
        setError(signUpErr.message);
      } else if (data.session) {
        router.push("/onboarding/name");
      } else {
        setError("Account created! Check your email or skip sign up below.");
      }
    } catch (err: any) {
      console.warn("Supabase auth network error:", err?.message);
      setError("Cloud Auth server not connected. You can skip sign up to explore the app instantly!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const supabase = createClient();
      if (!isSupabaseConfigured() || !supabase) {
        handleSkipSignUp();
        return;
      }

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/onboarding/name`,
        },
      });
    } catch (err: any) {
      console.warn("Google sign up error:", err);
      handleSkipSignUp();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] flex flex-col justify-center p-6 max-w-md mx-auto relative overflow-hidden">
      <div className="w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-amber-100 to-orange-100 border border-amber-200/80 flex items-center justify-center shadow-md animate-bounce-gentle">
            <span className="text-3xl">🍊</span>
          </div>
          <H1 className="text-2xl font-black text-text-heading font-heading mb-1">
            Create Account
          </H1>
          <Text className="text-text-secondary text-xs">
            Save your mindful journey or try Savor without sign up
          </Text>
        </div>

        {/* 1. Primary Skip / Explore Button */}
        <Button
          onClick={handleSkipSignUp}
          className="w-full py-4 mb-4 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-xs shadow-md shadow-primary/25 hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Skip Sign Up & Explore App</span>
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* 2. Google Sign Up */}
        <Button
          onClick={handleGoogleSignUp}
          variant="outline"
          className="w-full py-4 mb-4 rounded-2xl bg-white hover:bg-amber-50 text-text-heading border border-amber-200/80 shadow-xs flex items-center justify-center gap-2"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-4 h-4"
          />
          <span className="text-xs font-bold">Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-amber-200/60" />
          <Caption className="text-[10px] text-text-muted uppercase font-bold">or email</Caption>
          <div className="flex-1 h-px bg-amber-200/60" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSignUp} className="space-y-3">
          <div>
            <Caption className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Email</Caption>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-white text-xs py-2 rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <Caption className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Password</Caption>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 bg-white text-xs py-2 rounded-xl"
                minLength={6}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-text-heading space-y-2">
              <p className="font-semibold flex items-center gap-1 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
              <button
                type="button"
                onClick={handleSkipSignUp}
                className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Continue into App as Guest →
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-4 rounded-2xl bg-white border border-amber-300 text-text-heading font-bold text-xs hover:bg-amber-50"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up with Email"}
          </Button>
        </form>

        <button
          onClick={() => router.push("/login")}
          className="w-full mt-4 text-center text-xs text-text-secondary hover:text-primary transition-colors"
        >
          Already have an account? <span className="text-primary font-bold">Log in</span>
        </button>
      </div>
    </main>
  );
}
