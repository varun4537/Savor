import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logVoiceInteraction = mutation({
  args: {
    userId: v.string(),
    transcript: v.string(),
    detectedIntent: v.string(),
    parsedData: v.optional(v.any()),
    aiResponse: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("voice_interactions", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const getVoiceHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("voice_interactions")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(15);
  },
});
