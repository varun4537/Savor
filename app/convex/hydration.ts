import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTodayHydration = query({
  args: { userId: v.string(), dateStr: v.string() },
  handler: async (ctx, args) => {
    const log = await ctx.db
      .query("hydration_logs")
      .withIndex("by_userId_dateStr", (q) =>
        q.eq("userId", args.userId).eq("dateStr", args.dateStr)
      )
      .first();

    return (
      log || {
        glasses: 0,
        targetGlasses: 8,
        dateStr: args.dateStr,
      }
    );
  },
});

export const setGlasses = mutation({
  args: {
    userId: v.string(),
    dateStr: v.string(),
    glasses: v.number(),
    targetGlasses: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("hydration_logs")
      .withIndex("by_userId_dateStr", (q) =>
        q.eq("userId", args.userId).eq("dateStr", args.dateStr)
      )
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, {
        glasses: Math.max(0, args.glasses),
        targetGlasses: args.targetGlasses || existing.targetGlasses,
        updatedAt: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("hydration_logs", {
        userId: args.userId,
        glasses: Math.max(0, args.glasses),
        targetGlasses: args.targetGlasses || 8,
        dateStr: args.dateStr,
        updatedAt: now,
      });
    }
  },
});

export const incrementGlass = mutation({
  args: { userId: v.string(), dateStr: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("hydration_logs")
      .withIndex("by_userId_dateStr", (q) =>
        q.eq("userId", args.userId).eq("dateStr", args.dateStr)
      )
      .first();

    const now = new Date().toISOString();

    if (existing) {
      const newGlasses = existing.glasses + 1;
      await ctx.db.patch(existing._id, {
        glasses: newGlasses,
        updatedAt: now,
      });
      return newGlasses;
    } else {
      await ctx.db.insert("hydration_logs", {
        userId: args.userId,
        glasses: 1,
        targetGlasses: 8,
        dateStr: args.dateStr,
        updatedAt: now,
      });
      return 1;
    }
  },
});

export const decrementGlass = mutation({
  args: { userId: v.string(), dateStr: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("hydration_logs")
      .withIndex("by_userId_dateStr", (q) =>
        q.eq("userId", args.userId).eq("dateStr", args.dateStr)
      )
      .first();

    if (!existing || existing.glasses <= 0) return 0;

    const newGlasses = existing.glasses - 1;
    await ctx.db.patch(existing._id, {
      glasses: newGlasses,
      updatedAt: new Date().toISOString(),
    });
    return newGlasses;
  },
});
