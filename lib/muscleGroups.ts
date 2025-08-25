// Muscle groups constants - kept in sync with convex/exercisePresets.ts
export const MUSCLE_GROUPS = {
  // Primary muscle groups
  CHEST: "Chest",
  SHOULDERS: "Shoulders",
  BACK: "Back",
  BICEPS: "Biceps",
  TRICEPS: "Triceps",
  QUADS: "Quads",
  HAMSTRINGS: "Hamstrings",
  GLUTES: "Glutes",
  CALVES: "Calves",

  // Secondary/supporting muscles
  FRONT_DELTOIDS: "Front Deltoids",
  REAR_DELTOIDS: "Rear Deltoids",
  LATERAL_DELTOIDS: "Lateral Deltoids",
  FOREARMS: "Forearms",
  LOWER_BACK: "Lower Back",
  TRAPS: "Traps",
  LATS: "Lats",
  UPPER_CHEST: "Upper Chest",
  ABS: "Abs",
} as const;

export const muscleGroupOptions = Object.values(MUSCLE_GROUPS).sort();
