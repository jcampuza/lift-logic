import { MUSCLE_GROUPS } from "@/lib/muscleGroups";

// Re-export for convenience
export { MUSCLE_GROUPS };

export const GLOBAL_EXERCISE_PRESETS = [
  {
    name: "Bench Press",
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: "Dumbbell Bench Press",
    primaryMuscle: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: "Incline Press",
    primaryMuscle: MUSCLE_GROUPS.UPPER_CHEST,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FRONT_DELTOIDS],
  },
  {
    name: "Overhead Press",
    primaryMuscle: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: [MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.TRAPS],
  },
  {
    name: "Squat",
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [
      MUSCLE_GROUPS.GLUTES,
      MUSCLE_GROUPS.HAMSTRINGS,
      MUSCLE_GROUPS.LOWER_BACK,
    ],
  },
  {
    name: "Leg Extension",
    primaryMuscle: MUSCLE_GROUPS.QUADS,
    secondaryMuscles: [],
  },
  {
    name: "Leg Curl",
    primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
    secondaryMuscles: [],
  },
  {
    name: "Romanian Deadlift",
    primaryMuscle: MUSCLE_GROUPS.HAMSTRINGS,
    secondaryMuscles: [
      MUSCLE_GROUPS.GLUTES,
      MUSCLE_GROUPS.LOWER_BACK,
      MUSCLE_GROUPS.TRAPS,
    ],
  },
  {
    name: "Deadlift",
    primaryMuscle: MUSCLE_GROUPS.BACK,
    secondaryMuscles: [
      MUSCLE_GROUPS.GLUTES,
      MUSCLE_GROUPS.HAMSTRINGS,
      MUSCLE_GROUPS.LOWER_BACK,
      MUSCLE_GROUPS.TRAPS,
    ],
  },
  {
    name: "Dumbbell Bicep Curl",
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
  {
    name: "Cable Bicep Curl",
    primaryMuscle: MUSCLE_GROUPS.BICEPS,
    secondaryMuscles: [MUSCLE_GROUPS.FOREARMS],
  },
  {
    name: "Overhead Dumbbell Tricep Extension",
    primaryMuscle: MUSCLE_GROUPS.TRICEPS,
    secondaryMuscles: [],
  },
  {
    name: "Pull-up",
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: "Chin-up",
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: "Pulldown",
    primaryMuscle: MUSCLE_GROUPS.LATS,
    secondaryMuscles: [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.REAR_DELTOIDS],
  },
  {
    name: "Dumbbell Lateral Raise",
    primaryMuscle: MUSCLE_GROUPS.LATERAL_DELTOIDS,
    secondaryMuscles: [],
  },
  {
    name: "Cable Lateral Raise",
    primaryMuscle: MUSCLE_GROUPS.LATERAL_DELTOIDS,
    secondaryMuscles: [],
  },
] as const;
