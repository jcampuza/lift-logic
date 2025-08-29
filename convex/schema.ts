import { authTables } from '@convex-dev/auth/server'
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  // User preferences and settings
  userPreferences: defineTable({
    userId: v.id('users'),
    weightUnit: v.union(v.literal('lbs'), v.literal('kg')),
    // Future preferences can be added here
  }).index('by_user', ['userId']),

  // New: Global catalog of exercises available to everyone
  globalExercises: defineTable({
    name: v.string(),
    primaryMuscle: v.string(),
    secondaryMuscles: v.array(v.string()),
    notes: v.optional(v.string()),
    aliases: v.optional(v.array(v.string())),
  })
    .searchIndex('search_name', { searchField: 'name' })
    .index('by_name', ['name']),

  // New: User-specific custom exercises (same shape as global + owner)
  userExercises: defineTable({
    userId: v.id('users'),
    name: v.string(),
    primaryMuscle: v.string(),
    secondaryMuscles: v.array(v.string()),
    notes: v.optional(v.string()),
    aliases: v.optional(v.array(v.string())),
  })
    .searchIndex('search_name', {
      searchField: 'name',
      filterFields: ['userId'],
    })
    .index('by_user_and_name', ['userId', 'name']),

  workouts: defineTable({
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
          v.object({
            kind: v.literal('user'),
            id: v.id('userExercises'),
          }),
        ),
        notes: v.optional(v.string()),
        sets: v.array(
          v.object({
            reps: v.number(),
            weight: v.optional(v.number()),
          }),
        ),
      }),
    ),
  }).index('by_user_and_date', ['userId', 'date']),
})
