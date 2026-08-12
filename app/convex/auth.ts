import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    const userId = "usr_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    const now = new Date().toISOString();

    // Insert user record
    await ctx.db.insert("users", {
      userId,
      email: cleanEmail,
      name: args.name || cleanEmail.split("@")[0],
      passwordHash: args.password, // In real app use bcrypt/argon2
      authProvider: "email",
      createdAt: now,
    });

    // Create default profile
    await ctx.db.insert("profiles", {
      userId,
      name: args.name || cleanEmail.split("@")[0],
      dailyCalories: 2000,
      proteinGoalG: 110,
      dietPreference: "flexitarian",
      createdAt: now,
      updatedAt: now,
    });

    return {
      userId,
      email: cleanEmail,
      name: args.name || cleanEmail.split("@")[0],
    };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (!user) {
      throw new Error("No account found with this email.");
    }

    if (user.passwordHash && user.passwordHash !== args.password) {
      throw new Error("Incorrect password. Please try again.");
    }

    return {
      userId: user.userId,
      email: user.email,
      name: user.name || user.email.split("@")[0],
    };
  },
});

export const googleSignIn = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cleanEmail = args.email.trim().toLowerCase();
    const now = new Date().toISOString();

    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      return {
        userId: existing.userId,
        email: existing.email,
        name: existing.name || args.name || cleanEmail.split("@")[0],
      };
    }

    const userId = "goog_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

    await ctx.db.insert("users", {
      userId,
      email: cleanEmail,
      name: args.name || cleanEmail.split("@")[0],
      authProvider: "google",
      avatarUrl: args.avatarUrl,
      createdAt: now,
    });

    // Create default profile
    await ctx.db.insert("profiles", {
      userId,
      name: args.name || cleanEmail.split("@")[0],
      dailyCalories: 2000,
      proteinGoalG: 110,
      dietPreference: "flexitarian",
      createdAt: now,
      updatedAt: now,
    });

    return {
      userId,
      email: cleanEmail,
      name: args.name || cleanEmail.split("@")[0],
    };
  },
});

export const getCurrentUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});
