import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

export const listWorkouts = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('workouts'),
      _creationTime: v.number(),
      userId: v.id('users'),
      date: v.number(),
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
    const userId = await getAuthUserId(ctx)
    if (!userId) return []
    const workouts = await ctx.db
      .query('workouts')
      .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
      .order('desc')
      .collect()
    return workouts
  },
})

export const getWorkout = query({
  args: { id: v.id('workouts') },
  returns: v.object({
    _id: v.id('workouts'),
    _creationTime: v.number(),
    userId: v.id('users'),
    date: v.number(),
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
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const workout = await ctx.db.get(args.id)
    if (!workout) throw new Error('Workout not found')
    if (workout.userId !== userId) throw new Error('Unauthorized')

    // Enrich workout items with exercise data
    const enrichedItems = await Promise.all(
      workout.items.map(async (item) => {
        let exerciseData
        if (item.exercise.kind === 'global') {
          const globalExercise = await ctx.db.get(item.exercise.id)
          exerciseData = globalExercise
            ? {
                name: globalExercise.name,
                primaryMuscle: globalExercise.primaryMuscle,
              }
            : { name: 'Unknown Exercise', primaryMuscle: undefined }
        } else {
          const userExercise = await ctx.db.get(item.exercise.id)
          exerciseData = userExercise
            ? {
                name: userExercise.name,
                primaryMuscle: userExercise.primaryMuscle,
              }
            : { name: 'Unknown Exercise', primaryMuscle: undefined }
        }

        return {
          exercise: item.exercise,
          exerciseData,
          notes: item.notes,
          sets: item.sets,
        }
      }),
    )

    return {
      _id: workout._id,
      _creationTime: workout._creationTime,
      userId: workout.userId,
      date: workout.date,
      notes: workout.notes,
      items: enrichedItems,
    }
  },
})

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
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')
    const workoutId = await ctx.db.insert('workouts', {
      userId: userId as Id<'users'>,
      date: args.date,
      notes: args.notes,
      items: args.items,
    })
    return workoutId
  },
})

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
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const existingWorkout = await ctx.db.get(args.id)
    if (!existingWorkout) throw new Error('Workout not found')
    if (existingWorkout.userId !== userId) throw new Error('Unauthorized')

    await ctx.db.patch(args.id, {
      date: args.date,
      notes: args.notes,
      items: args.items,
    })

    return null
  },
})

export const deleteWorkout = mutation({
  args: { id: v.id('workouts') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const existingWorkout = await ctx.db.get(args.id)
    if (!existingWorkout) return null
    if (existingWorkout.userId !== userId) throw new Error('Unauthorized')

    await ctx.db.delete(args.id)
    return null
  },
})

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
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    // Get the reference date - either from the excluded workout or current time
    let referenceDate = Date.now()
    if (args.excludeWorkoutId) {
      const excludedWorkout = await ctx.db.get(args.excludeWorkoutId)
      if (excludedWorkout && excludedWorkout.userId === userId) {
        referenceDate = excludedWorkout.date
      }
    }

    // Calculate cutoff date (7 days before reference date)
    const sevenDaysAgo = referenceDate - 7 * 24 * 60 * 60 * 1000

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
      .collect()

    // Find the most recent workout containing the target exercise
    for (const workout of recentWorkouts) {
      // Skip the excluded workout if specified
      if (args.excludeWorkoutId && workout._id === args.excludeWorkoutId) {
        continue
      }

      const exerciseItem = workout.items.find(
        (item) =>
          item.exercise.kind === args.exercise.kind &&
          item.exercise.id === args.exercise.id,
      )

      if (exerciseItem && exerciseItem.sets.length > 0) {
        // Find the top set (highest weight)
        let topSet = null
        let maxWeight = -1

        for (const set of exerciseItem.sets) {
          if (set.weight !== undefined && set.weight > maxWeight) {
            maxWeight = set.weight
            topSet = set
          }
        }

        if (topSet && topSet.weight !== undefined) {
          // Get exercise name
          let exerciseName = 'Unknown Exercise'
          if (args.exercise.kind === 'global') {
            const globalExercise = await ctx.db.get(args.exercise.id)
            if (globalExercise) exerciseName = globalExercise.name
          } else {
            const userExercise = await ctx.db.get(args.exercise.id)
            if (userExercise) exerciseName = userExercise.name
          }

          const daysAgo = Math.floor(
            (referenceDate - workout.date) / (24 * 60 * 60 * 1000),
          )

          return {
            workoutDate: workout.date,
            exerciseName,
            topSet: {
              weight: topSet.weight,
              reps: topSet.reps,
            },
            daysAgo,
          }
        }
      }
    }

    // No recent performance found
    return null
  },
})

export const getWorkoutAnalytics = query({
  args: { workoutId: v.id('workouts') },
  returns: v.object({
    muscleGroups: v.record(v.string(), v.number()),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const workout = await ctx.db.get(args.workoutId)
    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found or unauthorized')
    }

    // Get all exercises referenced in the workout
    const globalExerciseIds = workout.items
      .filter((item) => item.exercise.kind === 'global')
      .map((item) => item.exercise.id)

    const userExerciseIds = workout.items
      .filter((item) => item.exercise.kind === 'user')
      .map((item) => item.exercise.id)

    const [globalExercises, userExercises] = await Promise.all([
      Promise.all(globalExerciseIds.map((id) => ctx.db.get(id))),
      Promise.all(userExerciseIds.map((id) => ctx.db.get(id))),
    ])

    // Create exercise map
    const exerciseMap = new Map<
      string,
      { name: string; primaryMuscle: string; secondaryMuscles: string[] }
    >()

    globalExercises.forEach((exercise) => {
      if (exercise) {
        exerciseMap.set(`global:${exercise._id}`, {
          name: exercise.name,
          primaryMuscle: exercise.primaryMuscle,
          secondaryMuscles: exercise.secondaryMuscles,
        })
      }
    })

    userExercises.forEach((exercise) => {
      if (exercise) {
        exerciseMap.set(`user:${exercise._id}`, {
          name: exercise.name,
          primaryMuscle: exercise.primaryMuscle,
          secondaryMuscles: exercise.secondaryMuscles,
        })
      }
    })

    // Calculate muscle group counts
    const muscleGroups: Record<string, number> = {
      Chest: 0,
      'Upper Chest': 0,
      Shoulders: 0,
      'Front Deltoids': 0,
      'Rear Deltoids': 0,
      'Lateral Deltoids': 0,
      Back: 0,
      Biceps: 0,
      Triceps: 0,
      Forearms: 0,
      Quads: 0,
      Hamstrings: 0,
      Glutes: 0,
      Calves: 0,
      Abs: 0,
    }

    // Simple muscle group mapping (inline to avoid import issues in Convex)
    const getMuscleGroup = (muscle: string): string | null => {
      const mapping: Record<string, string> = {
        Chest: 'Chest',
        'Upper Chest': 'Upper Chest',
        Shoulders: 'Shoulders',
        'Front Deltoids': 'Front Deltoids',
        'Rear Deltoids': 'Rear Deltoids',
        'Lateral Deltoids': 'Lateral Deltoids',
        Back: 'Back',
        Lats: 'Back',
        Traps: 'Back',
        'Lower Back': 'Back',
        Biceps: 'Biceps',
        Triceps: 'Triceps',
        Forearms: 'Forearms',
        Quads: 'Quads',
        Hamstrings: 'Hamstrings',
        Glutes: 'Glutes',
        Calves: 'Calves',
        Abs: 'Abs',
      }
      return mapping[muscle] || null
    }

    for (const item of workout.items) {
      const exerciseKey = `${item.exercise.kind}:${item.exercise.id}`
      const exercise = exerciseMap.get(exerciseKey)

      if (!exercise) continue

      const setCount = item.sets.length

      // Count sets for primary muscle
      const primaryMuscle = getMuscleGroup(exercise.primaryMuscle)
      if (primaryMuscle) {
        muscleGroups[primaryMuscle] += setCount
      }

      // Count sets for secondary muscles (with reduced weight)
      for (const secondaryMuscle of exercise.secondaryMuscles) {
        const secondaryMuscleGroup = getMuscleGroup(secondaryMuscle)
        if (secondaryMuscleGroup && secondaryMuscleGroup !== primaryMuscle) {
          muscleGroups[secondaryMuscleGroup] += setCount * 0.5
        }
      }
    }

    return { muscleGroups }
  },
})
