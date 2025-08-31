import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import type { Id } from './_generated/dataModel'
import { internalMutation, mutation, query } from './_generated/server'
import { GLOBAL_EXERCISE_PRESETS_v2 } from './exercisePresets'

export const searchExercises = query({
  args: { q: v.optional(v.string()) },
  returns: v.array(
    v.union(
      v.object({
        kind: v.literal('global'),
        _id: v.id('globalExercises'),
        name: v.string(),
        primaryMuscle: v.string(),
      }),
      v.object({
        kind: v.literal('user'),
        _id: v.id('userExercises'),
        name: v.string(),
        primaryMuscle: v.string(),
      }),
    ),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const q = (args.q ?? '').trim()

    if (q === '') {
      const globals = await ctx.db
        .query('globalExercises')
        .order('asc')
        .take(20)
      const users = userId
        ? await ctx.db
            .query('userExercises')
            .withIndex('by_user_and_name', (ix) => ix.eq('userId', userId))
            .order('asc')
            .take(20)
        : []

      const mappedGlobals = globals.map((g) => ({
        kind: 'global' as const,
        _id: g._id,
        name: g.name,
        primaryMuscle: g.primaryMuscle,
      }))
      const mappedUsers = users.map((u) => ({
        kind: 'user' as const,
        _id: u._id,
        name: u.name,
        primaryMuscle: u.primaryMuscle,
      }))

      const combined = [...mappedGlobals, ...mappedUsers]
      combined.sort((a, b) => a.name.localeCompare(b.name))
      return combined.slice(0, 20)
    }

    const [globals, users] = await Promise.all([
      ctx.db
        .query('globalExercises')
        .withSearchIndex('search_name', (s) => s.search('name', q))
        .take(20),
      userId
        ? ctx.db
            .query('userExercises')
            .withSearchIndex('search_name', (s) =>
              s.search('name', q).eq('userId', userId),
            )
            .take(20)
        : Promise.resolve([]),
    ])

    const mappedGlobals = globals.map((g) => ({
      kind: 'global' as const,
      _id: g._id,
      name: g.name,
      primaryMuscle: g.primaryMuscle,
    }))
    const mappedUsers = users.map((u) => ({
      kind: 'user' as const,
      _id: u._id,
      name: u.name,
      primaryMuscle: u.primaryMuscle,
    }))

    const combined = [...mappedGlobals, ...mappedUsers]
    combined.sort((a, b) => a.name.localeCompare(b.name))
    return combined.slice(0, 20)
  },
})

export const getAllExercises = query({
  returns: v.array(
    v.union(
      v.object({
        kind: v.literal('global'),
        _id: v.id('globalExercises'),
        name: v.string(),
        primaryMuscle: v.string(),
      }),
      v.object({
        kind: v.literal('user'),
        _id: v.id('userExercises'),
        name: v.string(),
        primaryMuscle: v.string(),
      }),
    ),
  ),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)

    const [globals, users] = await Promise.all([
      ctx.db.query('globalExercises').order('asc').collect(),
      userId
        ? ctx.db
            .query('userExercises')
            .withIndex('by_user_and_name', (ix) => ix.eq('userId', userId))
            .order('asc')
            .collect()
        : Promise.resolve([]),
    ])

    const mappedGlobals = globals.map((g) => ({
      kind: 'global' as const,
      _id: g._id,
      name: g.name,
      primaryMuscle: g.primaryMuscle,
    }))
    const mappedUsers = users.map((u) => ({
      kind: 'user' as const,
      _id: u._id,
      name: u.name,
      primaryMuscle: u.primaryMuscle,
    }))

    const combined = [...mappedGlobals, ...mappedUsers]
    combined.sort((a, b) => a.name.localeCompare(b.name))
    return combined
  },
})

export const createUserExercise = mutation({
  args: {
    name: v.string(),
    primaryMuscle: v.string(),
    secondaryMuscles: v.array(v.string()),
    notes: v.optional(v.string()),
    aliases: v.optional(v.array(v.string())),
  },
  returns: v.id('userExercises'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const trimmedName = args.name.trim()
    const trimmedPrimary = args.primaryMuscle.trim()
    const secondary = args.secondaryMuscles
      .map((s) => s.trim())
      .filter((s) => s !== '')
    const aliases = (args.aliases ?? [])
      .map((a) => a.trim())
      .filter((a) => a !== '')
    const notes = args.notes?.trim() === '' ? undefined : args.notes?.trim()

    const newId = await ctx.db.insert('userExercises', {
      userId: userId as Id<'users'>,
      name: trimmedName,
      primaryMuscle: trimmedPrimary,
      secondaryMuscles: secondary,
      notes,
      aliases,
    })
    return newId
  },
})

export const checkExerciseUsage = query({
  args: { exerciseId: v.id('userExercises') },
  returns: v.object({
    isUsed: v.boolean(),
    workoutCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const workouts = await ctx.db
      .query('workouts')
      .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
      .collect()

    let workoutCount = 0
    for (const workout of workouts) {
      const hasExercise = workout.items.some(
        (item) =>
          item.exercise.kind === 'user' && item.exercise.id === args.exerciseId,
      )
      if (hasExercise) workoutCount++
    }

    return {
      isUsed: workoutCount > 0,
      workoutCount,
    }
  },
})

export const deleteUserExercise = mutation({
  args: { exerciseId: v.id('userExercises') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    // Verify ownership
    const exercise = await ctx.db.get(args.exerciseId)
    if (!exercise || exercise.userId !== userId) {
      throw new Error('Exercise not found or unauthorized')
    }

    // Get all user's workouts that might contain this exercise
    const workouts = await ctx.db
      .query('workouts')
      .withIndex('by_user_and_date', (q) => q.eq('userId', userId))
      .collect()

    // Remove the exercise from all workouts and update them
    for (const workout of workouts) {
      const originalItemsLength = workout.items.length
      const filteredItems = workout.items.filter(
        (item) =>
          !(
            item.exercise.kind === 'user' &&
            item.exercise.id === args.exerciseId
          ),
      )

      // Only update if items were removed
      if (filteredItems.length !== originalItemsLength) {
        await ctx.db.patch(workout._id, {
          items: filteredItems,
        })
      }
    }

    // Delete the exercise
    await ctx.db.delete(args.exerciseId)
    return null
  },
})

export const seedGlobalExercises = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query('globalExercises').take(1)
    if (existing.length > 0) {
      return null
    }

    for (const preset of GLOBAL_EXERCISE_PRESETS_v2) {
      await ctx.db.insert('globalExercises', {
        name: preset.name,
        primaryMuscle: preset.primaryMuscle,
        secondaryMuscles: preset.secondaryMuscles.slice(),
      })
    }
    return null
  },
})

export const getUserPreferences = query({
  returns: v.object({
    weightUnit: v.union(v.literal('lbs'), v.literal('kg')),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const preferences = await ctx.db
      .query('userPreferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    // Default to lbs if no preferences exist
    return {
      weightUnit: preferences?.weightUnit ?? 'lbs',
    }
  },
})

export const updateUserExercise = mutation({
  args: {
    exerciseId: v.id('userExercises'),
    name: v.string(),
    primaryMuscle: v.string(),
    secondaryMuscles: v.array(v.string()),
    notes: v.optional(v.string()),
    aliases: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    // Verify ownership
    const exercise = await ctx.db.get(args.exerciseId)
    if (!exercise || exercise.userId !== userId) {
      throw new Error('Exercise not found or unauthorized')
    }

    const trimmedName = args.name.trim()
    const trimmedPrimary = args.primaryMuscle.trim()
    const secondary = args.secondaryMuscles
      .map((s) => s.trim())
      .filter((s) => s !== '')
    const aliases = (args.aliases ?? [])
      .map((a) => a.trim())
      .filter((a) => a !== '')
    const notes = args.notes?.trim() === '' ? undefined : args.notes?.trim()

    await ctx.db.patch(args.exerciseId, {
      name: trimmedName,
      primaryMuscle: trimmedPrimary,
      secondaryMuscles: secondary,
      notes,
      aliases,
    })
    return null
  },
})

export const getUserExercise = query({
  args: { exerciseId: v.id('userExercises') },
  returns: v.union(
    v.object({
      _id: v.id('userExercises'),
      name: v.string(),
      primaryMuscle: v.string(),
      secondaryMuscles: v.array(v.string()),
      notes: v.optional(v.string()),
      aliases: v.optional(v.array(v.string())),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const exercise = await ctx.db.get(args.exerciseId)
    if (!exercise || exercise.userId !== userId) {
      return null
    }

    return {
      _id: exercise._id,
      name: exercise.name,
      primaryMuscle: exercise.primaryMuscle,
      secondaryMuscles: exercise.secondaryMuscles,
      notes: exercise.notes,
      aliases: exercise.aliases,
    }
  },
})

export const updateUserPreferences = mutation({
  args: {
    weightUnit: v.union(v.literal('lbs'), v.literal('kg')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error('Not authenticated')

    const existing = await ctx.db
      .query('userPreferences')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        weightUnit: args.weightUnit,
      })
    } else {
      await ctx.db.insert('userPreferences', {
        userId,
        weightUnit: args.weightUnit,
      })
    }
  },
})
