"use client";

import { ReactNode, createContext, useContext, useEffect, useState, useMemo } from "react";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface SavorUserContextType {
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
  isAuthenticated: boolean;
  isConvexConnected: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<any>;
  signInWithGoogleMock: (email?: string, name?: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const SavorUserContext = createContext<SavorUserContextType>({
  userId: "local_user",
  userEmail: null,
  userName: null,
  isAuthenticated: false,
  isConvexConnected: false,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGoogleMock: async () => {},
  signOut: async () => {},
});

export const useSavorUser = () => useContext(SavorUserContext);

const fallbackConvexUrl = "https://gentle-savor-123.convex.cloud";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const isConvexConnected = !!convexUrl;

  const convexClient = useMemo(() => {
    return new ConvexReactClient(convexUrl || fallbackConvexUrl);
  }, [convexUrl]);

  return (
    <ConvexProvider client={convexClient}>
      <SavorUserInnerProvider isConvexConnected={isConvexConnected}>
        {children}
      </SavorUserInnerProvider>
    </ConvexProvider>
  );
}

function SavorUserInnerProvider({
  children,
  isConvexConnected,
}: {
  children: ReactNode;
  isConvexConnected: boolean;
}) {
  const [userId, setUserId] = useState<string>("local_user");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Convex auth mutations
  const convexSignUp = useMutation(api.auth.signUp);
  const convexSignIn = useMutation(api.auth.signIn);
  const convexGoogleSignIn = useMutation(api.auth.googleSignIn);

  useEffect(() => {
    let storedId = localStorage.getItem("savor_user_id");
    let storedEmail = localStorage.getItem("savor_user_email");
    let storedName = localStorage.getItem("savor_user_name");

    if (!storedId) {
      storedId = "savor_guest_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem("savor_user_id", storedId);
    }

    setUserId(storedId);
    if (storedEmail) {
      setUserEmail(storedEmail);
      setUserName(storedName || storedEmail.split("@")[0]);
      setIsAuthenticated(true);
    }
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      let res = null;
      if (isConvexConnected) {
        res = await convexSignIn({ email, password: pass });
      } else {
        res = {
          userId: "usr_" + Math.random().toString(36).substring(2, 9),
          email,
          name: email.split("@")[0],
        };
      }

      setUserId(res.userId);
      setUserEmail(res.email);
      setUserName(res.name);
      setIsAuthenticated(true);

      localStorage.setItem("savor_user_id", res.userId);
      localStorage.setItem("savor_user_email", res.email);
      localStorage.setItem("savor_user_name", res.name);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      let res = null;
      if (isConvexConnected) {
        res = await convexSignUp({ email, password: pass, name });
      } else {
        res = {
          userId: "usr_" + Math.random().toString(36).substring(2, 9),
          email,
          name: name || email.split("@")[0],
        };
      }

      setUserId(res.userId);
      setUserEmail(res.email);
      setUserName(res.name);
      setIsAuthenticated(true);

      localStorage.setItem("savor_user_id", res.userId);
      localStorage.setItem("savor_user_email", res.email);
      localStorage.setItem("savor_user_name", res.name);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const signInWithGoogleMock = async (emailParam?: string, nameParam?: string) => {
    try {
      const email = emailParam || "user@gmail.com";
      const name = nameParam || "Google User";

      let res = null;
      if (isConvexConnected) {
        res = await convexGoogleSignIn({ email, name });
      } else {
        res = {
          userId: "goog_" + Math.random().toString(36).substring(2, 9),
          email,
          name,
        };
      }

      setUserId(res.userId);
      setUserEmail(res.email);
      setUserName(res.name);
      setIsAuthenticated(true);

      localStorage.setItem("savor_user_id", res.userId);
      localStorage.setItem("savor_user_email", res.email);
      localStorage.setItem("savor_user_name", res.name);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const signOut = async () => {
    const guestId = "savor_guest_" + Math.random().toString(36).substring(2, 9);
    setUserId(guestId);
    setUserEmail(null);
    setUserName(null);
    setIsAuthenticated(false);
    localStorage.removeItem("savor_user_email");
    localStorage.removeItem("savor_user_name");
    localStorage.setItem("savor_user_id", guestId);
  };

  const userContextValue = useMemo(
    () => ({
      userId,
      userEmail,
      userName,
      isAuthenticated,
      isConvexConnected,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogleMock,
      signOut,
    }),
    [userId, userEmail, userName, isAuthenticated, isConvexConnected]
  );

  return (
    <SavorUserContext.Provider value={userContextValue}>
      {children}
    </SavorUserContext.Provider>
  );
}
