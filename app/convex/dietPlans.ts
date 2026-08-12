import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getLatestDietPlan = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("diet_plans")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .first();
  },
});

export const saveDietPlan = mutation({
  args: {
    userId: v.string(),
    cuisine: v.string(),
    planData: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("diet_plans")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        cuisine: args.cuisine,
        planData: args.planData,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("diet_plans", {
        userId: args.userId,
        cuisine: args.cuisine,
        planData: args.planData,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});
