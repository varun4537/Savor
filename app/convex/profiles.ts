import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const upsertProfile = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    gender: v.optional(v.string()),
    age: v.optional(v.number()),
    heightCm: v.optional(v.number()),
    weightKg: v.optional(v.number()),
    targetWeightKg: v.optional(v.number()),
    activityLevel: v.optional(v.string()),
    goal: v.optional(v.string()),
    dietPreference: v.optional(v.string()),
    allergies: v.optional(v.array(v.string())),
    healthConditions: v.optional(v.array(v.string())),
    dailyCalories: v.number(),
    proteinGoalG: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
