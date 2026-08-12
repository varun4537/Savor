"use client";

import { ReactNode, createContext, useContext, useEffect, useState, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";

interface SavorUserContextType {
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
  isAuthenticated: boolean;
  isConvexConnected: boolean;
  signOut: () => Promise<void>;
}

const SavorUserContext = createContext<SavorUserContextType>({
  userId: "local_user",
  userEmail: null,
  userName: null,
  isAuthenticated: false,
  isConvexConnected: false,
  signOut: async () => {},
});

export const useSavorUser = () => useContext(SavorUserContext);

const fallbackConvexUrl = "https://gentle-savor-123.convex.cloud";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>("local_user");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // 1. Initial Guest ID setup
    let storedId = localStorage.getItem("savor_user_id");
    if (!storedId) {
      storedId = "savor_guest_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem("savor_user_id", storedId);
    }
    setUserId(storedId);

    // 2. Check for active authenticated user session if configured
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        supabase.auth
          .getSession()
          .then(({ data: { session } }) => {
            if (session?.user) {
              setUserId(session.user.id);
              setUserEmail(session.user.email || null);
              setUserName(
                session.user.user_metadata?.full_name || session.user.user_metadata?.name || null
              );
              setIsAuthenticated(true);
              localStorage.setItem("savor_user_id", session.user.id);
            }
          })
          .catch((e) => console.warn("Supabase session check:", e));

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            setUserId(session.user.id);
            setUserEmail(session.user.email || null);
            setUserName(
              session.user.user_metadata?.full_name || session.user.user_metadata?.name || null
            );
            setIsAuthenticated(true);
            localStorage.setItem("savor_user_id", session.user.id);
          } else if (event === "SIGNED_OUT") {
            const guestId = "savor_guest_" + Math.random().toString(36).substring(2, 9);
            setUserId(guestId);
            setUserEmail(null);
            setUserName(null);
            setIsAuthenticated(false);
            localStorage.setItem("savor_user_id", guestId);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      }
    }
  }, []);

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    const guestId = "savor_guest_" + Math.random().toString(36).substring(2, 9);
    setUserId(guestId);
    setUserEmail(null);
    setUserName(null);
    setIsAuthenticated(false);
    localStorage.setItem("savor_user_id", guestId);
  };

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const isConvexConnected = !!convexUrl;

  const convexClient = useMemo(() => {
    return new ConvexReactClient(convexUrl || fallbackConvexUrl);
  }, [convexUrl]);

  const userContextValue = useMemo(
    () => ({
      userId,
      userEmail,
      userName,
      isAuthenticated,
      isConvexConnected,
      signOut,
    }),
    [userId, userEmail, userName, isAuthenticated, isConvexConnected]
  );

  return (
    <ConvexProvider client={convexClient}>
      <SavorUserContext.Provider value={userContextValue}>
        {children}
      </SavorUserContext.Provider>
    </ConvexProvider>
  );
}
