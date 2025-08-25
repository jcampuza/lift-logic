import { MUSCLE_GROUPS } from "./muscleGroups";

// Mapping for broad muscle group view
export const BROAD_MUSCLE_GROUPS = {
  "Chest": [MUSCLE_GROUPS.CHEST, MUSCLE_GROUPS.UPPER_CHEST],
  "Shoulders": [MUSCLE_GROUPS.SHOULDERS, MUSCLE_GROUPS.FRONT_DELTOIDS, MUSCLE_GROUPS.REAR_DELTOIDS, MUSCLE_GROUPS.LATERAL_DELTOIDS],
  "Back": [MUSCLE_GROUPS.BACK, MUSCLE_GROUPS.LATS, MUSCLE_GROUPS.TRAPS, MUSCLE_GROUPS.LOWER_BACK],
  "Arms": [MUSCLE_GROUPS.BICEPS, MUSCLE_GROUPS.TRICEPS, MUSCLE_GROUPS.FOREARMS],
  "Legs": [MUSCLE_GROUPS.QUADS, MUSCLE_GROUPS.HAMSTRINGS, MUSCLE_GROUPS.GLUTES, MUSCLE_GROUPS.CALVES],
  "Core": [MUSCLE_GROUPS.ABS],
} as const;

export type BroadMuscleGroup = keyof typeof BROAD_MUSCLE_GROUPS;

// Helper function to get broad muscle group for a specific muscle
export function getBroadMuscleGroup(specificMuscle: string): BroadMuscleGroup | null {
  for (const [broad, specifics] of Object.entries(BROAD_MUSCLE_GROUPS)) {
    if ((specifics as readonly string[]).includes(specificMuscle)) {
      return broad as BroadMuscleGroup;
    }
  }
  return null;
}

// Type for exercise reference
export type ExerciseRef = 
  | { kind: "global"; id: string }
  | { kind: "user"; id: string };

// Type for workout set
export type WorkoutSet = {
  reps: number;
  weight?: number;
};

// Type for workout item (from schema)
export type WorkoutItem = {
  exercise: ExerciseRef;
  notes?: string;
  sets: WorkoutSet[];
};

// Type for exercise data (what we get from the database)
export type ExerciseData = {
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
};

// Calculate muscle group set counts for a workout
export function calculateMuscleGroupSets(
  workoutItems: WorkoutItem[],
  exerciseMap: Map<string, ExerciseData>
): Record<BroadMuscleGroup, number> {
  const muscleGroupCounts: Record<BroadMuscleGroup, number> = {
    "Chest": 0,
    "Shoulders": 0,
    "Back": 0,
    "Arms": 0,
    "Legs": 0,
    "Core": 0,
  };

  for (const item of workoutItems) {
    const exerciseKey = `${item.exercise.kind}:${item.exercise.id}`;
    const exercise = exerciseMap.get(exerciseKey);
    
    if (!exercise) continue;

    const setCount = item.sets.length;
    
    // Count sets for primary muscle
    const primaryBroad = getBroadMuscleGroup(exercise.primaryMuscle);
    if (primaryBroad) {
      muscleGroupCounts[primaryBroad] += setCount;
    }

    // Count sets for secondary muscles (with reduced weight to avoid double counting)
    for (const secondaryMuscle of exercise.secondaryMuscles) {
      const secondaryBroad = getBroadMuscleGroup(secondaryMuscle);
      if (secondaryBroad && secondaryBroad !== primaryBroad) {
        // Add half the sets for secondary muscles to avoid inflating numbers
        muscleGroupCounts[secondaryBroad] += setCount * 0.5;
      }
    }
  }

  return muscleGroupCounts;
}

// Get the top muscle groups worked in a workout (for display)
export function getTopMuscleGroups(
  muscleGroupCounts: Record<BroadMuscleGroup, number>,
  maxGroups: number = 3
): Array<{ group: BroadMuscleGroup; sets: number }> {
  return Object.entries(muscleGroupCounts)
    .map(([group, sets]) => ({ group: group as BroadMuscleGroup, sets }))
    .filter(({ sets }) => sets > 0)
    .sort((a, b) => b.sets - a.sets)
    .slice(0, maxGroups);
}