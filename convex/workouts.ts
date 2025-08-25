import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

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

export const getWorkoutAnalytics = query({
  args: { workoutId: v.id("workouts") },
  returns: v.object({
    muscleGroups: v.record(v.string(), v.number()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const workout = await ctx.db.get(args.workoutId);
    if (!workout || workout.userId !== userId) {
      throw new Error("Workout not found or unauthorized");
    }

    // Get all exercises referenced in the workout
    const globalExerciseIds = workout.items
      .filter(item => item.exercise.kind === "global")
      .map(item => item.exercise.id);
    
    const userExerciseIds = workout.items
      .filter(item => item.exercise.kind === "user")
      .map(item => item.exercise.id);

    const [globalExercises, userExercises] = await Promise.all([
      Promise.all(globalExerciseIds.map(id => ctx.db.get(id))),
      Promise.all(userExerciseIds.map(id => ctx.db.get(id))),
    ]);

    // Create exercise map
    const exerciseMap = new Map<string, { name: string; primaryMuscle: string; secondaryMuscles: string[] }>();
    
    globalExercises.forEach(exercise => {
      if (exercise) {
        exerciseMap.set(`global:${exercise._id}`, {
          name: exercise.name,
          primaryMuscle: exercise.primaryMuscle,
          secondaryMuscles: exercise.secondaryMuscles,
        });
      }
    });

    userExercises.forEach(exercise => {
      if (exercise) {
        exerciseMap.set(`user:${exercise._id}`, {
          name: exercise.name,
          primaryMuscle: exercise.primaryMuscle,
          secondaryMuscles: exercise.secondaryMuscles,
        });
      }
    });

    // Calculate muscle group counts
    const muscleGroups: Record<string, number> = {
      "Chest": 0,
      "Shoulders": 0,
      "Back": 0,
      "Arms": 0,
      "Legs": 0,
      "Core": 0,
    };

    // Simple broad muscle group mapping (inline to avoid import issues in Convex)
    const getBroadGroup = (muscle: string): string | null => {
      const mapping: Record<string, string> = {
        "Chest": "Chest",
        "Upper Chest": "Chest",
        "Shoulders": "Shoulders",
        "Front Deltoids": "Shoulders",
        "Rear Deltoids": "Shoulders", 
        "Lateral Deltoids": "Shoulders",
        "Back": "Back",
        "Lats": "Back",
        "Traps": "Back",
        "Lower Back": "Back",
        "Biceps": "Arms",
        "Triceps": "Arms",
        "Forearms": "Arms",
        "Quads": "Legs",
        "Hamstrings": "Legs",
        "Glutes": "Legs",
        "Calves": "Legs",
        "Abs": "Core",
      };
      return mapping[muscle] || null;
    };

    for (const item of workout.items) {
      const exerciseKey = `${item.exercise.kind}:${item.exercise.id}`;
      const exercise = exerciseMap.get(exerciseKey);
      
      if (!exercise) continue;

      const setCount = item.sets.length;
      
      // Count sets for primary muscle
      const primaryBroad = getBroadGroup(exercise.primaryMuscle);
      if (primaryBroad) {
        muscleGroups[primaryBroad] += setCount;
      }

      // Count sets for secondary muscles (with reduced weight)
      for (const secondaryMuscle of exercise.secondaryMuscles) {
        const secondaryBroad = getBroadGroup(secondaryMuscle);
        if (secondaryBroad && secondaryBroad !== primaryBroad) {
          muscleGroups[secondaryBroad] += setCount * 0.5;
        }
      }
    }

    return { muscleGroups };
  },
});