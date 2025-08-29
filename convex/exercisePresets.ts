// Note: This file cannot import from src/lib due to Convex isolation
// So we inline the muscle groups here to avoid duplication

const MUSCLE_GROUPS = {
  // Primary muscle groups
  CHEST: 'Chest',
  SHOULDERS: 'Shoulders',
  BACK: 'Back',
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  QUADS: 'Quads',
  HAMSTRINGS: 'Hamstrings',
  GLUTES: 'Glutes',
  CALVES: 'Calves',

  // Secondary/supporting muscles
  FRONT_DELTOIDS: 'Front Deltoids',
  REAR_DELTOIDS: 'Rear Deltoids',
  LATERAL_DELTOIDS: 'Lateral Deltoids',
  FOREARMS: 'Forearms',
  LOWER_BACK: 'Lower Back',
  TRAPS: 'Traps',
  LATS: 'Lats',
  UPPER_CHEST: 'Upper Chest',
  ABS: 'Abs',
} as const

// Re-export for convenience
export { MUSCLE_GROUPS }

export const GLOBAL_EXERCISE_PRESETS = [
  {
    name: 'Bench Press',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Dumbbell Bench Press',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Incline Press',
    primaryMuscle: MUSCLE_GROUPS.UPPER_CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Overhead Press',
    primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.TRAPS],
  },
  {
    name: 'Squat',
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [
      MUSCLE_GROUPS.GLUTES,
      MUSCLE_GROUPS.HAMSTRINGS,
      MUSCLE_GROUPS.LOWER_BACK,
    ],
  },
  {
    name: 'Leg Extension',
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [],
  },
  {
    name: 'Leg Curl',
    primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
    secondaryMuscles: [],
  },
  {
    name: 'Romanian Deadlift',
    primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
    secondaryMuscles: [
      MUSCLE_GROUPS.GLUTES,
      MUSCLE_GROUPS.LOWER_BACK,
      MUSCLE_GROUPS.TRAPS,
    ],
  },
  {
    name: 'Deadlift',
    primaryMuscle: MUSCLE_GROUPS.BACK,
    secondaryMuscles: [
      MUSCLE_GROUPS.GLUTES,
      MUSCLE_GROUPS.HAMSTRINGS,
      MUSCLE_GROUPS.LOWER_BACK,
      MUSCLE_GROUPS.TRAPS,
    ],
  },
  {
    name: 'Dumbbell Bicep Curl',
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
  {
    name: 'Cable Bicep Curl',
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
  {
    name: 'Overhead Dumbbell Tricep Extension',
    primaryMuscle: MUSCLE_GROUPS.TRICEPS,
    secondaryMuscles: [],
  },
  {
    name: 'Pull-up',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: 'Chin-up',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: 'Pulldown',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: 'Dumbbell Lateral Raise',
    primaryMuscle: MUSCLE_GROUPS.LATERAL_DELTOIDS,
    secondaryMuscles: [],
  },
  {
    name: 'Cable Lateral Raise',
    primaryMuscle: MUSCLE_GROUPS.LATERAL_DELTOIDS,
    secondaryMuscles: [],
  },
] as const
