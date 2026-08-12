import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const isValidSupabaseConfig = () => {
  if (!supabaseUrl || !supabaseKey) return false;
  if (
    supabaseUrl.includes("your-project") ||
    supabaseUrl.includes("placeholder") ||
    supabaseUrl.includes("dummy")
  ) {
    return false;
  }
  try {
    const parsed = new URL(supabaseUrl);
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
};

const isConfigured = isValidSupabaseConfig();

export const supabase = isConfigured
  ? createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const isSupabaseConfigured = () => isConfigured;

export const createClient = () => {
  if (!isConfigured) return null;
  try {
    return createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn("Could not create Supabase client:", err);
    return null;
  }
};
