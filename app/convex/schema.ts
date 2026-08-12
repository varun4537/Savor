import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User accounts (Convex native auth)
  users: defineTable({
    userId: v.string(), // Unique account identifier
    email: v.string(),
    name: v.optional(v.string()),
    passwordHash: v.optional(v.string()),
    authProvider: v.string(), // "email" | "google" | "guest"
    avatarUrl: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"]),

  // User profiles & onboarding wellness goals
  profiles: defineTable({
    userId: v.string(), // Local/session/auth unique ID
    name: v.string(),
    gender: v.optional(v.string()),
    age: v.optional(v.number()),
    heightCm: v.optional(v.number()),
    weightKg: v.optional(v.number()),
    targetWeightKg: v.optional(v.number()),
    activityLevel: v.optional(v.string()),
    goal: v.optional(v.string()), // 'lose', 'gain', 'maintain', 'eat-better'
    dietPreference: v.optional(v.string()), // 'Vegetarian', 'Vegan', 'Keto', 'Omnivore', etc.
    allergies: v.optional(v.array(v.string())),
    healthConditions: v.optional(v.array(v.string())), // 'diabetes', 'pcos', 'thyroid', 'bp'
    dailyCalories: v.number(),
    proteinGoalG: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_userId", ["userId"]),

  // Logged meals (via photo, voice, text, or quick log)
  meals: defineTable({
    userId: v.string(),
    name: v.string(),
    caloriesMin: v.optional(v.number()),
    caloriesMax: v.optional(v.number()),
    caloriesAvg: v.number(),
    proteinG: v.optional(v.number()),
    carbsG: v.optional(v.number()),
    fatG: v.optional(v.number()),
    foodItems: v.optional(v.array(v.string())),
    aiMessage: v.optional(v.string()),
    mealType: v.optional(v.string()), // 'breakfast', 'lunch', 'dinner', 'snack'
    imageUrl: v.optional(v.string()),
    loggedAt: v.string(), // ISO string date
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_loggedAt", ["userId", "loggedAt"]),

  // Daily weight logs & morning weigh-ins
  weight_entries: defineTable({
    userId: v.string(),
    weight: v.number(),
    note: v.optional(v.string()),
    isMorningCheckin: v.boolean(),
    loggedAt: v.string(), // ISO date
    dateStr: v.string(), // 'YYYY-MM-DD' for quick day lookup
    createdAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_dateStr", ["userId", "dateStr"]),

  // Daily hydration tracking
  hydration_logs: defineTable({
    userId: v.string(),
    glasses: v.number(),
    targetGlasses: v.number(),
    dateStr: v.string(), // 'YYYY-MM-DD'
    updatedAt: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_dateStr", ["userId", "dateStr"]),

  // 7-day dynamic personalized diet plans
  diet_plans: defineTable({
    userId: v.string(),
    cuisine: v.string(),
    planData: v.any(), // 7-day structured JSON with daily meals & recipes
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_userId", ["userId"]),

  // Voice interactions, coaching messages & intent audit
  voice_interactions: defineTable({
    userId: v.string(),
    transcript: v.string(),
    detectedIntent: v.string(), // 'morning_weight', 'meal_log', 'hydration', 'coaching_qa'
    parsedData: v.optional(v.any()),
    aiResponse: v.string(),
    createdAt: v.string(),
  }).index("by_userId", ["userId"]),
});
