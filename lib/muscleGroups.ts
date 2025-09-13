// Muscle groups constants - kept in sync with convex/exercisePresets.ts
export const MUSCLE_GROUPS = {
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

export const MUSCLE_GROUP_MAPPING: Record<string, string> = {
  Chest: MUSCLE_GROUPS.CHEST,
  'Upper Chest': MUSCLE_GROUPS.CHEST,

  Shoulders: MUSCLE_GROUPS.SHOULDERS,
  'Front Deltoids': MUSCLE_GROUPS.SHOULDERS,
  'Rear Deltoids': MUSCLE_GROUPS.SHOULDERS,
  'Lateral Deltoids': MUSCLE_GROUPS.SHOULDERS,

  Back: MUSCLE_GROUPS.BACK,
  Lats: MUSCLE_GROUPS.BACK,
  Traps: MUSCLE_GROUPS.BACK,
  'Lower Back': MUSCLE_GROUPS.BACK,

  Biceps: MUSCLE_GROUPS.BICEPS,
  Triceps: MUSCLE_GROUPS.TRICEPS,

  Forearms: MUSCLE_GROUPS.FOREARMS,
  Quads: MUSCLE_GROUPS.QUADS,
  Hamstrings: MUSCLE_GROUPS.HAMSTRINGS,
  Glutes: MUSCLE_GROUPS.GLUTES,
  Calves: MUSCLE_GROUPS.CALVES,
  Abs: MUSCLE_GROUPS.ABS,
};

export const muscleGroupOptions = Object.values(MUSCLE_GROUPS).sort();
