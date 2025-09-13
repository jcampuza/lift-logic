'use client';

import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { Id } from '@convex/_generated/dataModel';
import { WorkoutListSkeleton } from './WorkoutSkeleton';
import WorkoutListItem, { WorkoutListItemData } from './WorkoutListItem';

export function WorkoutList() {
  const { data: workouts = [], isPending } = useQuery(
    convexQuery(api.workouts.listWorkouts, {}),
  );

  const { data: exercises = [], isPending: isExercisesPending } = useQuery(
    convexQuery(api.exercises.getAllExercises, {}),
  );

  const exerciseIdToName = new Map<
    Id<'globalExercises' | 'userExercises'>,
    string
  >(exercises.map((e) => [e._id, e.name]));

  if (isPending || isExercisesPending) {
    return <WorkoutListSkeleton />;
  }

  if (workouts.length === 0) {
    return (
      <div className="mt-12 text-center opacity-80">
        <p>No workouts yet.</p>
        <p className="text-sm">Tap + to log your first workout.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {workouts.map((w) => (
        <li key={w._id}>
          <WorkoutListItem
            workout={w as WorkoutListItemData}
            exerciseIdToName={exerciseIdToName}
          />
        </li>
      ))}
    </ul>
  );
}
