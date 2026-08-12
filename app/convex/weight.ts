import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getWeightHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("weight_entries")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    return entries.sort((a, b) => (b.loggedAt > a.loggedAt ? 1 : -1));
  },
});

export const getMorningCheckinStatus = query({
  args: { userId: v.string(), dateStr: v.string() },
  handler: async (ctx, args) => {
    const checkin = await ctx.db
      .query("weight_entries")
      .withIndex("by_userId_dateStr", (q) =>
        q.eq("userId", args.userId).eq("dateStr", args.dateStr)
      )
      .first();

    return {
      completed: !!checkin,
      entry: checkin || null,
    };
  },
});

export const logWeight = mutation({
  args: {
    userId: v.string(),
    weight: v.number(),
    note: v.optional(v.string()),
    isMorningCheckin: v.optional(v.boolean()),
    loggedAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date();
    const loggedAt = args.loggedAt || now.toISOString();
    const dateStr = loggedAt.split("T")[0];

    const id = await ctx.db.insert("weight_entries", {
      userId: args.userId,
      weight: args.weight,
      note: args.note,
      isMorningCheckin: args.isMorningCheckin ?? true,
      loggedAt,
      dateStr,
      createdAt: now.toISOString(),
    });

    // Also update weight in user profile if exists
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        weightKg: args.weight,
        updatedAt: now.toISOString(),
      });
    }

    return id;
  },
});
