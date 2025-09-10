import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { mutation, query } from './_generated/server';
import { MUSCLE_GROUP_MAPPING } from '../src/lib/muscleGroups';

export const listWorkouts = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('workouts'),
      _creationTime: v.number(),
      userId: v.id('users'),
      date: v.number(),
      updatedAt: v.optional(v.number()),
      notes: v.optional(v.string()),
      items: v.array(
        v.object({
          exercise: v.union(
            v.object({
              kind: v.literal('global'),
              id: v.id('globalExercises'),
            }),
            v.object({ kind: v.literal('user'), id: v.id('userExercises') }),
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
      .query('workouts')
      .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
      .order('desc')
      .collect();
    return workouts;
  },
});

export const getWorkout = query({
  args: { id: v.id('workouts') },
  returns: v.object({
    _id: v.id('workouts'),
    _creationTime: v.number(),
    userId: v.id('users'),
    date: v.number(),
    updatedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        exercise: v.union(
          v.object({ kind: v.literal('global'), id: v.id('globalExercises') }),
          v.object({ kind: v.literal('user'), id: v.id('userExercises') }),
        ),
        exerciseData: v.object({
          name: v.string(),
          primaryMuscle: v.optional(v.string()),
        }),
        notes: v.optional(v.string()),
        sets: v.array(
          v.object({ reps: v.number(), weight: v.optional(v.number()) }),
        ),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const workout = await ctx.db.get(args.id);
    if (!workout) throw new Error('Workout not found');
    if (workout.userId !== userId) throw new Error('Unauthorized');

    // Enrich workout items with exercise data
    const enrichedItems = await Promise.all(
      workout.items.map(async (item) => {
        let exerciseData;
        if (item.exercise.kind === 'global') {
          const globalExercise = await ctx.db.get(item.exercise.id);
          exerciseData = globalExercise
            ? {
                name: globalExercise.name,
                primaryMuscle: globalExercise.primaryMuscle,
              }
            : { name: 'Unknown Exercise', primaryMuscle: undefined };
        } else {
          const userExercise = await ctx.db.get(item.exercise.id);
          exerciseData = userExercise
            ? {
                name: userExercise.name,
                primaryMuscle: userExercise.primaryMuscle,
              }
            : { name: 'Unknown Exercise', primaryMuscle: undefined };
        }

        return {
          exercise: item.exercise,
          exerciseData,
          notes: item.notes,
          sets: item.sets,
        };
      }),
    );

    return {
      _id: workout._id,
      _creationTime: workout._creationTime,
      userId: workout.userId,
      date: workout.date,
      updatedAt: workout.updatedAt,
      notes: workout.notes,
      items: enrichedItems,
    };
  },
});

export const createWorkout = mutation({
  args: {
    date: v.number(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        exercise: v.union(
          v.object({ kind: v.literal('global'), id: v.id('globalExercises') }),
          v.object({ kind: v.literal('user'), id: v.id('userExercises') }),
        ),
        notes: v.optional(v.string()),
        sets: v.array(
          v.object({ reps: v.number(), weight: v.optional(v.number()) }),
        ),
      }),
    ),
  },
  returns: v.id('workouts'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    const workoutId = await ctx.db.insert('workouts', {
      userId: userId as Id<'users'>,
      date: args.date,
      notes: args.notes,
      items: args.items,
      updatedAt: Date.now(),
    });
    return workoutId;
  },
});

export const updateWorkout = mutation({
  args: {
    id: v.id('workouts'),
    date: v.number(),
    notes: v.optional(v.string()),
    items: v.array(
      v.object({
        exercise: v.union(
          v.object({ kind: v.literal('global'), id: v.id('globalExercises') }),
          v.object({ kind: v.literal('user'), id: v.id('userExercises') }),
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
    if (!userId) throw new Error('Not authenticated');

    const existingWorkout = await ctx.db.get(args.id);
    if (!existingWorkout) throw new Error('Workout not found');
    if (existingWorkout.userId !== userId) throw new Error('Unauthorized');

    await ctx.db.patch(args.id, {
      date: args.date,
      notes: args.notes,
      items: args.items,
      updatedAt: Date.now(),
    });

    return null;
  },
});

export const deleteWorkout = mutation({
  args: { id: v.id('workouts') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const existingWorkout = await ctx.db.get(args.id);
    if (!existingWorkout) return null;
    if (existingWorkout.userId !== userId) throw new Error('Unauthorized');

    await ctx.db.delete(args.id);
    return null;
  },
});

export const cloneLatestWorkout = mutation({
  args: {},
  returns: v.id('workouts'),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const latest = await ctx.db
      .query('workouts')
      .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
      .order('desc')
      .first();

    if (!latest) {
      throw new Error('No previous workouts found');
    }

    const newId = await ctx.db.insert('workouts', {
      userId: userId,
      date: Date.now(),
      notes: latest.notes,
      items: latest.items,
      updatedAt: Date.now(),
    });

    return newId;
  },
});

export const getLastExercisePerformance = query({
  args: {
    exercise: v.union(
      v.object({ kind: v.literal('global'), id: v.id('globalExercises') }),
      v.object({ kind: v.literal('user'), id: v.id('userExercises') }),
    ),
    excludeWorkoutId: v.optional(v.id('workouts')),
  },
  returns: v.union(
    v.object({
      workoutDate: v.number(),
      exerciseName: v.string(),
      topSet: v.object({
        weight: v.number(),
        reps: v.number(),
      }),
      daysAgo: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Get the reference date - either from the excluded workout or current time
    let referenceDate = Date.now();
    if (args.excludeWorkoutId) {
      const excludedWorkout = await ctx.db.get(args.excludeWorkoutId);
      if (excludedWorkout && excludedWorkout.userId === userId) {
        referenceDate = excludedWorkout.date;
      }
    }

    // Calculate cutoff date (7 days before reference date)
    const sevenDaysAgo = referenceDate - 7 * 24 * 60 * 60 * 1000;

    // Query recent workouts (last 7 days from reference date), ordered by date desc (most recent first)
    const recentWorkouts = await ctx.db
      .query('workouts')
      .withIndex('by_user_and_date', (q) =>
        q
          .eq('userId', userId)
          .gte('date', sevenDaysAgo)
          .lt('date', referenceDate),
      )
      .order('desc')
      .collect();

    // Find the most recent workout containing the target exercise
    for (const workout of recentWorkouts) {
      // Skip the excluded workout if specified
      if (args.excludeWorkoutId && workout._id === args.excludeWorkoutId) {
        continue;
      }

      const exerciseItem = workout.items.find(
        (item) =>
          item.exercise.kind === args.exercise.kind &&
          item.exercise.id === args.exercise.id,
      );

      if (exerciseItem && exerciseItem.sets.length > 0) {
        // Find the top set (highest weight)
        let topSet = null;
        let maxWeight = -1;

        for (const set of exerciseItem.sets) {
          if (set.weight !== undefined && set.weight > maxWeight) {
            maxWeight = set.weight;
            topSet = set;
          }
        }

        if (topSet && topSet.weight !== undefined) {
          // Get exercise name
          let exerciseName = 'Unknown Exercise';
          if (args.exercise.kind === 'global') {
            const globalExercise = await ctx.db.get(args.exercise.id);
            if (globalExercise) exerciseName = globalExercise.name;
          } else {
            const userExercise = await ctx.db.get(args.exercise.id);
            if (userExercise) exerciseName = userExercise.name;
          }

          const daysAgo = Math.floor(
            (referenceDate - workout.date) / (24 * 60 * 60 * 1000),
          );

          return {
            workoutDate: workout.date,
            exerciseName,
            topSet: {
              weight: topSet.weight,
              reps: topSet.reps,
            },
            daysAgo,
          };
        }
      }
    }

    // No recent performance found
    return null;
  },
});

export const getWorkoutAnalytics = query({
  args: { workoutId: v.id('workouts') },
  returns: v.object({
    muscleGroups: v.array(
      v.object({
        name: v.string(),
        sets: v.number(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const workout = await ctx.db.get(args.workoutId);
    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found or unauthorized');
    }

    // Get all exercises referenced in the workout
    const exerciseIds: Id<'globalExercises' | 'userExercises'>[] = [];

    for (const item of workout.items) {
      exerciseIds.push(item.exercise.id);
    }

    const exercises = await Promise.all(
      exerciseIds.map((id) => ctx.db.get(id)),
    );

    const exerciseMap = new Map(
      exercises
        .filter((exercise) => exercise !== null)
        .map((exercise) => [exercise._id, exercise]),
    );

    // Fetch user preference for including half sets
    const preferences = await ctx.db
      .query('userPreferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first();
    const includeHalfSets = preferences?.includeHalfSets ?? true;

    // Calculate muscle group counts
    // Split arms and legs into more specific groups (Biceps/Triceps, Quads/Hamstrings)
    const muscleGroups: Record<string, number> = {
      Chest: 0,
      Shoulders: 0,
      Back: 0,
      Biceps: 0,
      Triceps: 0,
      Forearms: 0,
      Quads: 0,
      Hamstrings: 0,
      Glutes: 0,
      Calves: 0,
      Core: 0,
      Abs: 0,
    };

    // Simple broad muscle group mapping (inline to avoid import issues in Convex)
    const getBroadGroup = (muscle: string): string | null => {
      return MUSCLE_GROUP_MAPPING[muscle] || null;
    };

    for (const item of workout.items) {
      const exercise = exerciseMap.get(item.exercise.id);

      if (!exercise) {
        continue;
      }

      const setCount = item.sets.length;

      // Count sets for primary muscle
      const primaryBroad = getBroadGroup(exercise.primaryMuscle);
      if (primaryBroad) {
        muscleGroups[primaryBroad] += setCount;
      }

      if (includeHalfSets) {
        // Count sets for secondary muscles (with reduced weight)
        for (const secondaryMuscle of exercise.secondaryMuscles) {
          const secondaryBroad = getBroadGroup(secondaryMuscle);
          if (secondaryBroad && secondaryBroad !== primaryBroad) {
            muscleGroups[secondaryBroad] += setCount * 0.5;
          }
        }
      }
    }

    // Sort muscle groups by set count in descending order and return as array
    const sortedMuscleGroups = Object.entries(muscleGroups)
      .filter(([, sets]) => sets > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([name, sets]) => ({ name, sets }));

    return { muscleGroups: sortedMuscleGroups };
  },
});
