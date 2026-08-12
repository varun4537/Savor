"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function AuthListener() {
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        if (!supabase) return;

        // This listener will fire when:
        // 1. The app loads and restoring a session
        // 2. The user signs in/out
        // 3. OAuth redirect happens (it processes the hash)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                console.log('User signed in', session.user.email);

                // Check if we are on an auth page and should redirect
                const path = window.location.pathname;
                if (path === '/login' || path === '/onboarding/signup') {
                    // If coming from Google Auth, we want to go ensuring we move forward
                    // Using replace to prevent back-button loops
                    // We delay slightly to allow any other state updates to process
                    setTimeout(() => {
                        router.replace('/onboarding/name');
                    }, 100);
                }

                router.refresh();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    return null; // This component renders nothing
}
