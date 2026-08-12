"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { SoftCard } from "@/app/components/ui/soft-card";
import { H1, Text, Caption } from "@/app/components/ui/typography";
import { Loader2, ArrowRight, Sparkles, Mail, Lock, AlertCircle } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
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
    const savedProfile = localStorage.getItem("savor_profile");
    if (savedProfile) {
      router.push("/");
    } else {
      router.push("/onboarding/name");
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      if (!isSupabaseConfigured() || !supabase) {
        handleSkipSignUp();
        return;
      }

      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInErr) {
        setError(signInErr.message);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.warn("Login network error:", err?.message);
      setError("Cloud Auth server not reachable. You can skip sign in to enter the app directly!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      if (!isSupabaseConfigured() || !supabase) {
        handleSkipSignUp();
        return;
      }

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
    } catch (err) {
      handleSkipSignUp();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FFF7ED] to-[#FFF0E0] relative overflow-hidden">
      <div className="w-full max-w-sm">
        <SoftCard className="p-6 bg-white/90 border border-amber-100 rounded-3xl shadow-sm">
          <div className="text-center mb-5">
            <div className="w-14 h-14 mx-auto mb-2.5 rounded-2xl bg-amber-100 text-primary flex items-center justify-center font-bold text-2xl animate-float">
              🍊
            </div>
            <H1 className="text-xl font-bold text-text-heading font-heading">Welcome Back</H1>
            <Text className="text-xs text-text-secondary">Log in to Savor or explore as guest</Text>
          </div>

          {/* Quick Skip Button */}
          <Button
            onClick={handleSkipSignUp}
            className="w-full py-4 mb-3 rounded-2xl bg-gradient-to-r from-primary to-[#F27233] text-white font-bold text-xs shadow-md shadow-primary/20 hover:opacity-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enter App Directly (No Sign In)</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
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
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-amber-200/60" />
            <Caption className="text-[10px] text-text-muted uppercase font-bold">or email</Caption>
            <div className="flex-1 h-px bg-amber-200/60" />
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            <div>
              <Caption className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Email</Caption>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-xs py-2 rounded-xl"
                required
              />
            </div>

            <div>
              <Caption className="text-[10px] font-bold text-text-muted uppercase mb-1 block">Password</Caption>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-xs py-2 rounded-xl"
                required
              />
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
                  Enter App as Guest →
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-4 rounded-2xl bg-white border border-amber-300 text-text-heading font-bold text-xs hover:bg-amber-50"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log In with Email"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => router.push("/onboarding/signup")}
              className="text-xs text-text-secondary hover:text-primary transition-colors"
            >
              New here? <span className="text-primary font-bold">Create Account</span>
            </button>
          </div>
        </SoftCard>
      </div>
    </main>
  );
}
