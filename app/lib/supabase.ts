import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Fallback for when keys are missing (development mode)
const isMock = !supabaseUrl || !supabaseKey;

export const supabase = isMock
    ? null
    : createSupabaseClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => !isMock;

// Function to create a new client (for client components)
export const createClient = () => {
    if (isMock) return null;
    return createSupabaseClient(supabaseUrl, supabaseKey);
};
