"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSavorUser } from "@/app/ConvexClientProvider";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface SavorProfile {
  userId?: string;
  name: string;
  gender?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  targetWeightKg?: number;
  activityLevel?: string;
  goal?: string;
  dietPreference?: string;
  allergies?: string[];
  healthConditions?: string[];
  dailyCalories: number;
  proteinGoalG: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SavorMeal {
  _id?: string;
  id?: string;
  userId?: string;
  name: string;
  caloriesMin?: number;
  caloriesMax?: number;
  caloriesAvg: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  foodItems?: string[];
  aiMessage?: string;
  mealType?: string;
  imageUrl?: string;
  loggedAt: string;
}

export interface SavorWeightEntry {
  _id?: string;
  userId?: string;
  weight: number;
  note?: string;
  isMorningCheckin?: boolean;
  loggedAt: string;
  dateStr?: string;
}

export interface SavorHydration {
  glasses: number;
  targetGlasses: number;
  dateStr: string;
}

export function useSavorData() {
  const { userId, isConvexConnected } = useSavorUser();
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Today start/end ISO
  const { startIso, endIso } = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { startIso: start.toISOString(), endIso: end.toISOString() };
  }, []);

  // Local States (fallback + optimistic)
  const [localProfile, setLocalProfile] = useState<SavorProfile | null>(null);
  const [localMeals, setLocalMeals] = useState<SavorMeal[]>([]);
  const [localWeights, setLocalWeights] = useState<SavorWeightEntry[]>([]);
  const [localHydration, setLocalHydration] = useState<number>(0);
  const [localDietPlan, setLocalDietPlan] = useState<any>(null);

  // Initialize local data from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem("savor_profile");
      if (p) setLocalProfile(JSON.parse(p));

      const m = localStorage.getItem("savor_meals");
      if (m) {
        const parsed = JSON.parse(m);
        // filter today's meals
        const todayMeals = parsed.filter((meal: any) => {
          const d = new Date(meal.loggedAt || meal.logged_at || Date.now()).toISOString().split("T")[0];
          return d === todayStr;
        });
        setLocalMeals(todayMeals);
      }

      const w = localStorage.getItem("savor_weights");
      if (w) setLocalWeights(JSON.parse(w));

      const hDate = localStorage.getItem("savor_hydration_date");
      const hGlasses = localStorage.getItem("savor_hydration_glasses");
      if (hDate === todayStr && hGlasses) {
        setLocalHydration(parseInt(hGlasses) || 0);
      }

      const dp = localStorage.getItem("savor_diet_plan");
      if (dp) setLocalDietPlan(JSON.parse(dp));
    } catch (e) {
      console.warn("Failed to load local savor state", e);
    }
  }, [todayStr]);

  // Convex Queries (active if connected)
  const convexProfile = useQuery(
    api.profiles?.getProfile,
    isConvexConnected && userId ? { userId } : "skip"
  );
  const convexTodayMeals = useQuery(
    api.meals?.getTodayMeals,
    isConvexConnected && userId ? { userId, startIso, endIso } : "skip"
  );
  const convexWeights = useQuery(
    api.weight?.getWeightHistory,
    isConvexConnected && userId ? { userId } : "skip"
  );
  const convexHydration = useQuery(
    api.hydration?.getTodayHydration,
    isConvexConnected && userId ? { userId, dateStr: todayStr } : "skip"
  );
  const convexDietPlan = useQuery(
    api.dietPlans?.getLatestDietPlan,
    isConvexConnected && userId ? { userId } : "skip"
  );

  // Convex Mutations
  const upsertProfileMutation = useMutation(api.profiles?.upsertProfile);
  const logMealMutation = useMutation(api.meals?.logMeal);
  const deleteMealMutation = useMutation(api.meals?.deleteMeal);
  const logWeightMutation = useMutation(api.weight?.logWeight);
  const incrementGlassMutation = useMutation(api.hydration?.incrementGlass);
  const decrementGlassMutation = useMutation(api.hydration?.decrementGlass);
  const setGlassesMutation = useMutation(api.hydration?.setGlasses);
  const saveDietPlanMutation = useMutation(api.dietPlans?.saveDietPlan);

  // Synced Profile
  const profile: SavorProfile | null = useMemo(() => {
    if (convexProfile) return convexProfile as SavorProfile;
    return localProfile;
  }, [convexProfile, localProfile]);

  // Synced Meals
  const todayMeals: SavorMeal[] = useMemo(() => {
    if (convexTodayMeals && Array.isArray(convexTodayMeals)) {
      return convexTodayMeals.map((m: any) => ({
        ...m,
        id: m._id,
        caloriesAvg: m.caloriesAvg || m.calories || 0,
      }));
    }
    return localMeals;
  }, [convexTodayMeals, localMeals]);

  const totalCaloriesToday = useMemo(() => {
    return todayMeals.reduce((sum, m) => sum + (m.caloriesAvg || 0), 0);
  }, [todayMeals]);

  // Synced Weights
  const weightEntries: SavorWeightEntry[] = useMemo(() => {
    if (convexWeights && Array.isArray(convexWeights)) {
      return convexWeights;
    }
    return localWeights;
  }, [convexWeights, localWeights]);

  const latestWeight = useMemo(() => {
    if (weightEntries.length > 0) return weightEntries[0].weight;
    return profile?.weightKg || 70;
  }, [weightEntries, profile]);

  const morningCheckedInToday = useMemo(() => {
    return weightEntries.some((w) => {
      const d = (w.loggedAt || "").split("T")[0];
      return d === todayStr && w.isMorningCheckin;
    });
  }, [weightEntries, todayStr]);

  // Synced Hydration
  const hydration: SavorHydration = useMemo(() => {
    if (convexHydration) {
      return {
        glasses: convexHydration.glasses ?? 0,
        targetGlasses: convexHydration.targetGlasses ?? 8,
        dateStr: todayStr,
      };
    }
    return {
      glasses: localHydration,
      targetGlasses: 8,
      dateStr: todayStr,
    };
  }, [convexHydration, localHydration, todayStr]);

  // Mutation Handlers with optimistic local cache
  const updateProfile = useCallback(
    async (updated: Partial<SavorProfile>) => {
      const merged: SavorProfile = {
        name: profile?.name || "Friend",
        dailyCalories: profile?.dailyCalories || 2000,
        proteinGoalG: profile?.proteinGoalG || 100,
        ...profile,
        ...updated,
        updatedAt: new Date().toISOString(),
      };
      setLocalProfile(merged);
      localStorage.setItem("savor_profile", JSON.stringify(merged));

      if (isConvexConnected && upsertProfileMutation) {
        try {
          await upsertProfileMutation({
            userId,
            name: merged.name,
            gender: merged.gender,
            age: merged.age,
            heightCm: merged.heightCm,
            weightKg: merged.weightKg,
            targetWeightKg: merged.targetWeightKg,
            activityLevel: merged.activityLevel,
            goal: merged.goal,
            dietPreference: merged.dietPreference,
            allergies: merged.allergies,
            healthConditions: merged.healthConditions,
            dailyCalories: merged.dailyCalories,
            proteinGoalG: merged.proteinGoalG,
          });
        } catch (err) {
          console.error("Convex profile update error:", err);
        }
      }
    },
    [profile, isConvexConnected, upsertProfileMutation, userId]
  );

  const logMeal = useCallback(
    async (mealData: Omit<SavorMeal, "loggedAt" | "createdAt"> & { loggedAt?: string }) => {
      const nowIso = mealData.loggedAt || new Date().toISOString();
      const newMeal: SavorMeal = {
        ...mealData,
        id: "meal_" + Date.now(),
        userId,
        loggedAt: nowIso,
      };

      // Optimistic
      setLocalMeals((prev) => [newMeal, ...prev]);

      try {
        const allStored = JSON.parse(localStorage.getItem("savor_meals") || "[]");
        localStorage.setItem("savor_meals", JSON.stringify([newMeal, ...allStored]));
      } catch (e) {}

      if (isConvexConnected && logMealMutation) {
        try {
          await logMealMutation({
            userId,
            name: newMeal.name,
            caloriesMin: newMeal.caloriesMin,
            caloriesMax: newMeal.caloriesMax,
            caloriesAvg: newMeal.caloriesAvg,
            proteinG: newMeal.proteinG,
            carbsG: newMeal.carbsG,
            fatG: newMeal.fatG,
            foodItems: newMeal.foodItems,
            aiMessage: newMeal.aiMessage,
            mealType: newMeal.mealType,
            imageUrl: newMeal.imageUrl,
            loggedAt: nowIso,
          });
        } catch (err) {
          console.error("Convex meal log error:", err);
        }
      }

      return newMeal;
    },
    [userId, isConvexConnected, logMealMutation]
  );

  const deleteMeal = useCallback(
    async (mealId: string) => {
      setLocalMeals((prev) => prev.filter((m) => m.id !== mealId && m._id !== mealId));

      try {
        const allStored = JSON.parse(localStorage.getItem("savor_meals") || "[]");
        localStorage.setItem(
          "savor_meals",
          JSON.stringify(allStored.filter((m: any) => m.id !== mealId && m._id !== mealId))
        );
      } catch (e) {}

      if (isConvexConnected && deleteMealMutation) {
        try {
          await deleteMealMutation({ mealId: mealId as any });
        } catch (err) {
          console.error("Convex delete meal error:", err);
        }
      }
    },
    [isConvexConnected, deleteMealMutation]
  );

  const logWeight = useCallback(
    async (weight: number, note?: string, isMorningCheckin = true) => {
      const now = new Date();
      const newEntry: SavorWeightEntry = {
        id: "wt_" + Date.now(),
        userId,
        weight,
        note,
        isMorningCheckin,
        loggedAt: now.toISOString(),
        dateStr: todayStr,
      };

      setLocalWeights((prev) => [newEntry, ...prev]);

      try {
        const allStored = JSON.parse(localStorage.getItem("savor_weights") || "[]");
        localStorage.setItem("savor_weights", JSON.stringify([newEntry, ...allStored]));
      } catch (e) {}

      if (profile) {
        updateProfile({ weightKg: weight });
      }

      if (isConvexConnected && logWeightMutation) {
        try {
          await logWeightMutation({
            userId,
            weight,
            note,
            isMorningCheckin,
            loggedAt: now.toISOString(),
          });
        } catch (err) {
          console.error("Convex weight log error:", err);
        }
      }

      return newEntry;
    },
    [userId, todayStr, profile, updateProfile, isConvexConnected, logWeightMutation]
  );

  const incrementGlass = useCallback(async () => {
    const nextVal = hydration.glasses + 1;
    setLocalHydration(nextVal);
    localStorage.setItem("savor_hydration_glasses", nextVal.toString());
    localStorage.setItem("savor_hydration_date", todayStr);

    if (isConvexConnected && incrementGlassMutation) {
      try {
        await incrementGlassMutation({ userId, dateStr: todayStr });
      } catch (err) {
        console.error("Convex hydration increment error:", err);
      }
    }
    return nextVal;
  }, [hydration.glasses, todayStr, isConvexConnected, incrementGlassMutation, userId]);

  const decrementGlass = useCallback(async () => {
    const nextVal = Math.max(0, hydration.glasses - 1);
    setLocalHydration(nextVal);
    localStorage.setItem("savor_hydration_glasses", nextVal.toString());
    localStorage.setItem("savor_hydration_date", todayStr);

    if (isConvexConnected && decrementGlassMutation) {
      try {
        await decrementGlassMutation({ userId, dateStr: todayStr });
      } catch (err) {
        console.error("Convex hydration decrement error:", err);
      }
    }
    return nextVal;
  }, [hydration.glasses, todayStr, isConvexConnected, decrementGlassMutation, userId]);

  const saveDietPlan = useCallback(
    async (cuisine: string, planData: any) => {
      setLocalDietPlan(planData);
      localStorage.setItem("savor_diet_plan", JSON.stringify(planData));
      localStorage.setItem("savor_plan_cuisine", cuisine);

      if (isConvexConnected && saveDietPlanMutation) {
        try {
          await saveDietPlanMutation({ userId, cuisine, planData });
        } catch (err) {
          console.error("Convex save diet plan error:", err);
        }
      }
    },
    [userId, isConvexConnected, saveDietPlanMutation]
  );

  return {
    userId,
    isConvexConnected,
    profile,
    updateProfile,
    todayMeals,
    totalCaloriesToday,
    logMeal,
    deleteMeal,
    weightEntries,
    latestWeight,
    morningCheckedInToday,
    logWeight,
    hydration,
    incrementGlass,
    decrementGlass,
    dietPlan: convexDietPlan?.planData || localDietPlan,
    saveDietPlan,
  };
}
