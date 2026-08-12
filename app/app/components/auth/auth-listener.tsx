"use client";

import { useEffect } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    // Clear any stale Supabase auth tokens left in localStorage from dead/inactive projects
    try {
      if (typeof window !== "undefined") {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("sb-") || key.includes("supabase.auth.token"))) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (e) {}

    if (!isSupabaseConfigured()) return;

    try {
      const supabase = createClient();
      if (!supabase) return;

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          const path = window.location.pathname;
          if (path === "/login" || path === "/onboarding/signup") {
            setTimeout(() => {
              router.replace("/onboarding/name");
            }, 100);
          }
          router.refresh();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.warn("Auth listener error suppressed:", err);
    }
  }, [router]);

  return null;
}
