import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTodayMeals = query({
  args: { userId: v.string(), startIso: v.string(), endIso: v.string() },
  handler: async (ctx, args) => {
    const meals = await ctx.db
      .query("meals")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) =>
        q.and(
          q.gte(q.field("loggedAt"), args.startIso),
          q.lte(q.field("loggedAt"), args.endIso)
        )
      )
      .collect();

    return meals.sort((a, b) => (b.loggedAt > a.loggedAt ? 1 : -1));
  },
});

export const getWeeklyMeals = query({
  args: { userId: v.string(), startIso: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("meals")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.gte(q.field("loggedAt"), args.startIso))
      .collect();
  },
});

export const getMealById = query({
  args: { mealId: v.id("meals") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.mealId);
  },
});

export const logMeal = mutation({
  args: {
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
    mealType: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    loggedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("meals", {
      userId: args.userId,
      name: args.name,
      caloriesMin: args.caloriesMin,
      caloriesMax: args.caloriesMax,
      caloriesAvg: args.caloriesAvg,
      proteinG: args.proteinG,
      carbsG: args.carbsG,
      fatG: args.fatG,
      foodItems: args.foodItems,
      aiMessage: args.aiMessage,
      mealType: args.mealType,
      imageUrl: args.imageUrl,
      loggedAt: args.loggedAt || now,
      createdAt: now,
    });
  },
});

export const deleteMeal = mutation({
  args: { mealId: v.id("meals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.mealId);
    return true;
  },
});

export const updateMeal = mutation({
  args: {
    mealId: v.id("meals"),
    name: v.optional(v.string()),
    caloriesAvg: v.optional(v.number()),
    proteinG: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { mealId, ...updates } = args;
    await ctx.db.patch(mealId, updates);
    return true;
  },
});
