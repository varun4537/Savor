"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { Button } from "@/app/components/ui/button";

export default function SetupPage() {
    const [status, setStatus] = useState("Waiting...");

    const runMigration = async () => {
        setStatus("Running migration...");
        const supabase = createClient();

        // SQL to create table and policies
        const sql = `
            CREATE TABLE IF NOT EXISTS public.hydration_logs (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
              glasses INTEGER DEFAULT 0,
              date DATE DEFAULT CURRENT_DATE,
              created_at TIMESTAMPTZ DEFAULT NOW(),
              UNIQUE(user_id, date)
            );

            ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;

            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own hydration logs') THEN
                    CREATE POLICY "Users can view their own hydration logs" ON public.hydration_logs FOR SELECT USING (auth.uid() = user_id);
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own hydration logs') THEN
                    CREATE POLICY "Users can insert their own hydration logs" ON public.hydration_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
                END IF;

                IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own hydration logs') THEN
                    CREATE POLICY "Users can update their own hydration logs" ON public.hydration_logs FOR UPDATE USING (auth.uid() = user_id);
                END IF;
            END $$;
        `;

        const { error } = await supabase.rpc('exec_sql', { sql_query: sql });

        // Since we don't have a direct 'exec_sql' RPC usually, we might fail here.
        // Alternative: Use the Table Editor in Supabase Dashboard.
        // BUT, since we can't do that easily as an agent, I will try to use the standard client 
        // to just *check* if it connects, but creating tables from client-side requires specific permissions or an RPC.

        // Actually, the most reliable way for me to "apply" this change is to ask the user to run it OR 
        // to use the `supabase` CLI if available.
        // The user environment info says "Operating System: windows".

        // Let's try to infer if 'exec_sql' exists or if I should just guide the user.
        // I'll assume I can't run DDL from the client.

        setStatus("Cannot run DDL from client. Please run the SQL in Supabase Dashboard SQL Editor.");
    };

    return (
        <div className="p-10">
            <h1>Database Setup</h1>
            <p className="mb-4">Please run this SQL in your Supabase Dashboard:</p>
            <pre className="bg-gray-100 p-4 rounded text-xs mb-4 overflow-auto">
                {`
CREATE TABLE IF NOT EXISTS public.hydration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  glasses INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

ALTER TABLE public.hydration_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own hydration logs" ON public.hydration_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own hydration logs" ON public.hydration_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own hydration logs" ON public.hydration_logs FOR UPDATE USING (auth.uid() = user_id);
`}
            </pre>
            <Button onClick={() => navigator.clipboard.writeText(`...code above...`)}>Copy SQL</Button>
        </div>
    );
}
