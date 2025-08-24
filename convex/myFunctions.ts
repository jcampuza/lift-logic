import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Workouts and exercises
export const listWorkouts = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("workouts"),
      _creationTime: v.number(),
      userId: v.id("users"),
      date: v.number(),
      notes: v.optional(v.string()),
      items: v.array(
        v.object({
          exercise: v.union(
            v.object({
              kind: v.literal("global"),
              id: v.id("globalExercises"),
            }),
            v.object({ kind: v.literal("user"), id: v.id("userExercises") }),
          ),
          notes: v.optional(v.string()),
          sets: v.array(
            v.object({ reps: v.number(), weight: v.optional(v.number()) }),
          ),
        }),
      ),
    }),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user_and_date", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return workouts;
  },
});

export const getWorkout = query({
  args: { id: v.id("workouts") },
  returns: v.object({
    _id: v.id("workouts"),
    _creationTime: v.number(),
    userId: v.id("users"),
    date: v.number(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        exercise: v.union(
          v.object({ kind: v.literal("global"), id: v.id("globalExercises") }),
          v.object({ kind: v.literal("user"), id: v.id("userExercises") }),
        ),
        notes: v.optional(v.string()),
        sets: v.array(
          v.object({ reps: v.number(), weight: v.optional(v.number()) }),
        ),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const workout = await ctx.db.get(args.id);
    if (!workout) throw new Error("Workout not found");
    if (workout.userId !== userId) throw new Error("Unauthorized");

    return workout;
  },
});

export const searchExercises = query({
  args: { q: v.optional(v.string()) },
  returns: v.array(
    v.union(
      v.object({
        kind: v.literal("global"),
        _id: v.id("globalExercises"),
        name: v.string(),
        primaryMuscle: v.string(),
      }),
      v.object({
        kind: v.literal("user"),
        _id: v.id("userExercises"),
        name: v.string(),
        primaryMuscle: v.string(),
      }),
    ),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const q = (args.q ?? "").trim();

    if (q === "") {
      const globals = await ctx.db
        .query("globalExercises")
        .order("asc")
        .take(20);
      const users = userId
        ? await ctx.db
            .query("userExercises")
            .withIndex("by_user_and_name", (ix) => ix.eq("userId", userId))
            .order("asc")
            .take(20)
        : [];

      const mappedGlobals = globals.map((g) => ({
        kind: "global" as const,
        _id: g._id,
        name: g.name,
        primaryMuscle: g.primaryMuscle,
      }));
      const mappedUsers = users.map((u) => ({
        kind: "user" as const,
        _id: u._id,
        name: u.name,
        primaryMuscle: u.primaryMuscle,
      }));

      const combined = [...mappedGlobals, ...mappedUsers];
      combined.sort((a, b) => a.name.localeCompare(b.name));
      return combined.slice(0, 20);
    }

    const [globals, users] = await Promise.all([
      ctx.db
        .query("globalExercises")
        .withSearchIndex("search_name", (s) => s.search("name", q))
        .take(20),
      userId
        ? ctx.db
            .query("userExercises")
            .withSearchIndex("search_name", (s) =>
              s.search("name", q).eq("userId", userId),
            )
            .take(20)
        : Promise.resolve([]),
    ]);

    const mappedGlobals = globals.map((g) => ({
      kind: "global" as const,
      _id: g._id,
      name: g.name,
      primaryMuscle: g.primaryMuscle,
    }));
    const mappedUsers = users.map((u) => ({
      kind: "user" as const,
      _id: u._id,
      name: u.name,
      primaryMuscle: u.primaryMuscle,
    }));

    const combined = [...mappedGlobals, ...mappedUsers];
    combined.sort((a, b) => a.name.localeCompare(b.name));
    return combined.slice(0, 20);
  },
});

export const createWorkout = mutation({
  args: {
    date: v.number(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        exercise: v.union(
          v.object({ kind: v.literal("global"), id: v.id("globalExercises") }),
          v.object({ kind: v.literal("user"), id: v.id("userExercises") }),
        ),
        notes: v.optional(v.string()),
        sets: v.array(
          v.object({ reps: v.number(), weight: v.optional(v.number()) }),
        ),
      }),
    ),
  },
  returns: v.id("workouts"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const workoutId = await ctx.db.insert("workouts", {
      userId: userId as Id<"users">,
      date: args.date,
      notes: args.notes,
      items: args.items,
    });
    return workoutId;
  },
});

export const updateWorkout = mutation({
  args: {
    id: v.id("workouts"),
    date: v.number(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        exercise: v.union(
          v.object({ kind: v.literal("global"), id: v.id("globalExercises") }),
          v.object({ kind: v.literal("user"), id: v.id("userExercises") }),
        ),
        notes: v.optional(v.string()),
        sets: v.array(
          v.object({ reps: v.number(), weight: v.optional(v.number()) }),
        ),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingWorkout = await ctx.db.get(args.id);
    if (!existingWorkout) throw new Error("Workout not found");
    if (existingWorkout.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      date: args.date,
      notes: args.notes,
      items: args.items,
    });

    return null;
  },
});

export const deleteWorkout = mutation({
  args: { id: v.id("workouts") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingWorkout = await ctx.db.get(args.id);
    if (!existingWorkout) return null;
    if (existingWorkout.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
    return null;
  },
});

export const createUserExercise = mutation({
  args: {
    name: v.string(),
    primaryMuscle: v.string(),
    secondaryMuscles: v.array(v.string()),
    notes: v.optional(v.string()),
    aliases: v.optional(v.array(v.string())),
  },
  returns: v.id("userExercises"),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const trimmedName = args.name.trim();
    const trimmedPrimary = args.primaryMuscle.trim();
    const secondary = args.secondaryMuscles
      .map((s) => s.trim())
      .filter((s) => s !== "");
    const aliases = (args.aliases ?? [])
      .map((a) => a.trim())
      .filter((a) => a !== "");
    const notes = args.notes?.trim() === "" ? undefined : args.notes?.trim();

    const newId = await ctx.db.insert("userExercises", {
      userId: userId as Id<"users">,
      name: trimmedName,
      primaryMuscle: trimmedPrimary,
      secondaryMuscles: secondary,
      notes,
      aliases,
    });
    return newId;
  },
});

export const seedGlobalExercises = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("globalExercises").take(1);
    if (existing.length > 0) return null;
    const presets = [
      { name: "Barbell Back Squat", primaryMuscle: "Quads" },
      { name: "Bench Press", primaryMuscle: "Chest" },
      { name: "Deadlift", primaryMuscle: "Hamstrings" },
      { name: "Overhead Press", primaryMuscle: "Shoulders" },
      { name: "Barbell Row", primaryMuscle: "Back" },
      { name: "Pull-up", primaryMuscle: "Back" },
      { name: "Dumbbell Curl", primaryMuscle: "Biceps" },
      { name: "Triceps Pushdown", primaryMuscle: "Triceps" },
    ];
    for (const p of presets) {
      await ctx.db.insert("globalExercises", {
        name: p.name,
        primaryMuscle: p.primaryMuscle,
        secondaryMuscles: [],
      });
    }
    return null;
  },
});
