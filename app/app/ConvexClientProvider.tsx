"use client";

import { ReactNode, createContext, useContext, useEffect, useState, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

interface SavorUserContextType {
  userId: string;
  isConvexConnected: boolean;
}

const SavorUserContext = createContext<SavorUserContextType>({
  userId: "local_user",
  isConvexConnected: false,
});

export const useSavorUser = () => useContext(SavorUserContext);

const fallbackConvexUrl = "https://gentle-savor-123.convex.cloud";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>("local_user");

  // Initialize or retrieve persistent user identity
  useEffect(() => {
    let storedId = localStorage.getItem("savor_user_id");
    if (!storedId) {
      storedId = "savor_" + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem("savor_user_id", storedId);
    }
    setUserId(storedId);
  }, []);

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const isConvexConnected = !!convexUrl;

  const convexClient = useMemo(() => {
    return new ConvexReactClient(convexUrl || fallbackConvexUrl);
  }, [convexUrl]);

  const userContextValue = useMemo(
    () => ({ userId, isConvexConnected }),
    [userId, isConvexConnected]
  );

  return (
    <ConvexProvider client={convexClient}>
      <SavorUserContext.Provider value={userContextValue}>
        {children}
      </SavorUserContext.Provider>
    </ConvexProvider>
  );
}
