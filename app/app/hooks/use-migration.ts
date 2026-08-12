"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export function useMigration() {
    const [isMigrating, setIsMigrating] = useState(false);
    const [migrationStatus, setMigrationStatus] = useState<'pending' | 'completed' | 'error'>('pending');

    useEffect(() => {
        const migrateData = async () => {
            const supabase = createClient();
            if (!supabase) return;

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            // Check if already migrated (we can use a flag in localStorage or check if DB has data)
            const hasMigrated = localStorage.getItem('savor_migrated_to_supabase');
            if (hasMigrated) return;

            setIsMigrating(true);
            try {
                const user = session.user;

                // 1. Migrate Profile
                const localProfile = localStorage.getItem('savor_profile');
                if (localProfile) {
                    const profile = JSON.parse(localProfile);
                    await supabase.from('profiles').upsert({
                        id: user.id,
                        name: profile.name,
                        // map other fields
                        dietary_preferences: profile.dietaryPreferences || [],
                        daily_calories: profile.dailyCalories,
                        target_weight: profile.targetWeight,
                        goal: profile.goal,
                        updated_at: new Date().toISOString()
                    });
                }

                // 2. Migrate Meals
                const localMeals = localStorage.getItem('savor_meals');
                if (localMeals) {
                    const meals = JSON.parse(localMeals);
                    // Batch insert meals (assuming we map them correctly)
                    // We need to ensure text fields match our schema
                    const mealsToInsert = meals.map((m: any) => ({
                        user_id: user.id,
                        photo_url: m.image, // Still base64 for now, will fix in Phase 1.4
                        food_items: m.analysis?.items || [],
                        calories: m.analysis?.totalCalories,
                        protein: m.analysis?.totalProtein,
                        carbs: m.analysis?.totalCarbs,
                        fats: m.analysis?.totalFats,
                        portion: m.portion || 'Regular',
                        meal_time: m.mealTime || 'Snack',
                        is_balanced: m.analysis?.isBalanced || false,
                        logged_at: m.timestamp || new Date().toISOString()
                    }));

                    if (mealsToInsert.length > 0) {
                        await supabase.from('meals').insert(mealsToInsert);
                    }
                }

                // 3. Migrate Weight
                const localWeight = localStorage.getItem('savor_weight_history');
                if (localWeight) {
                    const weights = JSON.parse(localWeight);
                    const weightsToInsert = weights.map((w: any) => ({
                        user_id: user.id,
                        weight: w.weight,
                        created_at: w.date
                    }));

                    if (weightsToInsert.length > 0) {
                        await supabase.from('weight_entries').insert(weightsToInsert);
                    }
                }

                // Mark as done
                localStorage.setItem('savor_migrated_to_supabase', 'true');
                setMigrationStatus('completed');

            } catch (error) {
                console.error('Migration failed:', error);
                setMigrationStatus('error');
            } finally {
                setIsMigrating(false);
            }
        };

        migrateData();
    }, []);

    return { isMigrating, migrationStatus };
}
