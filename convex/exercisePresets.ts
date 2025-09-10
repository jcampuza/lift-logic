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
  CORE: 'Core',
  HIP_FLEXORS: 'Hip Flexors',
} as const;

// Re-export for convenience
export { MUSCLE_GROUPS };

// New v2 presets (includes oldName for renamed migrations)
export const GLOBAL_EXERCISE_PRESETS_v2 = [
  {
    name: 'Barbell Bench Press',
    oldName: 'Bench Press',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Dumbbell Bench Press',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Incline Barbell Bench Press',
    oldName: 'Incline Press',
    primaryMuscle: MUSCLE_GROUPS.UPPER_CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Incline Dumbbell Bench Press',
    primaryMuscle: MUSCLE_GROUPS.UPPER_CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Decline Bench Press',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Dumbbell Fly',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [],
  },
  {
    name: 'Cable Fly',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [],
  },
  {
    name: 'Push-Up',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Machine Chest Press',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Pec Deck (Machine Fly)',
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [],
  },
  {
    name: 'Overhead Barbell Press',
    oldName: 'Overhead Press',
    primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.TRAPS],
  },
  {
    name: 'Seated Dumbbell Shoulder Press',
    primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS],
  },
  {
    name: 'Arnold Press',
    primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS],
  },
  {
    name: 'Lateral Raise (Dumbbell)',
    primaryMuscle: MUSCLE_GROUPS.LATERAL_DELTOIDS,
    secondaryMuscles: [],
  },
  {
    name: 'Cable Lateral Raise',
    primaryMuscle: MUSCLE_GROUPS.LATERAL_DELTOIDS,
    secondaryMuscles: [],
  },
  {
    name: 'Rear Delt Fly (Dumbbell)',
    primaryMuscle: MUSCLE_GROUPS.REAR_DELTOIDS,
    secondaryMuscles: [],
  },
  {
    name: 'Cable Rear Delt Fly',
    primaryMuscle: MUSCLE_GROUPS.REAR_DELTOIDS,
    secondaryMuscles: [],
  },
  {
    name: 'Face Pull',
    primaryMuscle: MUSCLE_GROUPS.REAR_DELTOIDS,
    secondaryMuscles: [MUSCLE_GROUPS.TRAPS],
  },
  {
    name: 'Front Raise (Dumbbell/Plate)',
    primaryMuscle: MUSCLE_GROUPS.FRONT_DELTOIDS,
    secondaryMuscles: [],
  },
  {
    name: 'Pull-Up',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: 'Chin-Up',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
  },
  {
    name: 'Lat Pulldown',
    oldName: 'Pulldown',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: 'Seated Cable Row',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: 'Bent-Over Barbell Row',
    primaryMuscle: MUSCLE_GROUPS.BACK,
    secondaryMuscles: [
      MUSCLE_GROUPS.LATS,
      MUSCLE_GROUPS.REAR_DELTOIDS,
      MUSCLE_GROUPS.BICEPS,
    ],
  },
  {
    name: 'One-Arm Dumbbell Row',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: 'T‑Bar Row',
    primaryMuscle: MUSCLE_GROUPS.BACK,
    secondaryMuscles: [MUSCLE_GROUPS.LATS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: 'Machine Row',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS],
  },
  {
    name: 'Straight-Arm Pulldown',
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [],
  },
  {
    oldName: 'Squat',
    name: 'Barbell Back Squat',
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [
      MUSCLE_GROUPS.GLUTES,
      MUSCLE_GROUPS.HAMSTRINGS,
      MUSCLE_GROUPS.LOWER_BACK,
    ],
  },
  {
    name: 'Front Squat',
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.CORE],
  },
  {
    name: 'Leg Press',
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS],
  },
  {
    name: 'Walking Lunge (Dumbbells)',
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS],
  },
  {
    name: 'Bulgarian Split Squat',
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [MUSCLE_GROUPS.GLUTES],
  },
  {
    name: 'Leg Extension',
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [],
  },
  {
    name: 'Barbell Deadlift (Conventional)',
    oldName: 'Deadlift',
    primaryMuscle: MUSCLE_GROUPS.BACK,
    secondaryMuscles: [
      MUSCLE_GROUPS.GLUTES,
      MUSCLE_GROUPS.HAMSTRINGS,
      MUSCLE_GROUPS.LOWER_BACK,
      MUSCLE_GROUPS.TRAPS,
    ],
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
    name: 'Hip Thrust (Barbell)',
    primaryMuscle: MUSCLE_GROUPS.GLUTES,
    secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS],
  },
  {
    name: 'Glute Bridge',
    primaryMuscle: MUSCLE_GROUPS.GLUTES,
    secondaryMuscles: [MUSCLE_GROUPS.HAMSTRINGS],
  },
  {
    oldName: 'Leg Curl',
    name: 'Hamstring Curl (Seated)',
    primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
    secondaryMuscles: [],
  },
  {
    name: 'Hamstring Curl (Lying)',
    primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
    secondaryMuscles: [],
  },
  {
    name: 'Calf Raise (Standing)',
    primaryMuscle: MUSCLE_GROUPS.CALVES,
    secondaryMuscles: [],
  },
  {
    name: 'Calf Raise (Seated)',
    primaryMuscle: MUSCLE_GROUPS.CALVES,
    secondaryMuscles: [],
  },
  {
    name: 'Barbell Biceps Curl',
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
  {
    name: 'Dumbbell Biceps Curl',
    oldName: 'Dumbbell Bicep Curl',
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
  {
    name: 'Incline Dumbbell Curl',
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [],
  },
  {
    name: 'Preacher Curl (Barbell/Dumbbell/Machine)',
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [],
  },
  {
    name: 'Cable Biceps Curl',
    oldName: 'Cable Bicep Curl',
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
  {
    name: 'Hammer Curl',
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
  {
    name: 'Triceps Pushdown (Cable, straight/EZ/rope)',
    primaryMuscle: MUSCLE_GROUPS.TRICEPS,
    secondaryMuscles: [],
  },
  {
    name: 'Overhead Rope Extension',
    primaryMuscle: MUSCLE_GROUPS.TRICEPS,
    secondaryMuscles: [],
  },
  {
    name: 'Skull Crushers (Lying Triceps Extension, EZ Bar)',
    primaryMuscle: MUSCLE_GROUPS.TRICEPS,
    secondaryMuscles: [],
  },
  {
    name: 'Close-Grip Bench Press',
    primaryMuscle: MUSCLE_GROUPS.TRICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.CHEST],
  },
  {
    name: 'Dips (Chest/Triceps)',
    primaryMuscle: MUSCLE_GROUPS.TRICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: 'Plank',
    primaryMuscle: MUSCLE_GROUPS.ABS,
    secondaryMuscles: [],
  },
  {
    name: 'Hanging Knee Raise/Leg Raise',
    primaryMuscle: MUSCLE_GROUPS.ABS,
    secondaryMuscles: [MUSCLE_GROUPS.HIP_FLEXORS],
  },
  {
    name: 'Cable Crunch',
    primaryMuscle: MUSCLE_GROUPS.ABS,
    secondaryMuscles: [],
  },
  {
    name: 'Ab Wheel Rollout',
    primaryMuscle: MUSCLE_GROUPS.ABS,
    secondaryMuscles: [MUSCLE_GROUPS.CORE],
  },
  {
    name: 'Back Extension (Hyperextension)',
    primaryMuscle: MUSCLE_GROUPS.LOWER_BACK,
    secondaryMuscles: [MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.HAMSTRINGS],
  },
  {
    name: 'Shrug (Barbell/Dumbbell)',
    primaryMuscle: MUSCLE_GROUPS.TRAPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
] as const;
