'use client';

import { Link } from '@tanstack/react-router';
import MuscleGroupStats from './MuscleGroupStats';
import WorkoutDropdown from './WorkoutDropdown';
import type { Id } from '../../convex/_generated/dataModel';

export type WorkoutListItemData = {
  _id: Id<'workouts'>;
  date: number;
  notes?: string;
  items: Array<{
    exercise:
      | { kind: 'global'; id: Id<'globalExercises'> }
      | { kind: 'user'; id: Id<'userExercises'> };
    sets: Array<{ reps: number; weight?: number }>;
  }>;
};

type NameMaps = {
  globalIdToName: Map<Id<'globalExercises'>, string>;
  userIdToName: Map<Id<'userExercises'>, string>;
};

type WorkoutListItemProps = {
  workout: WorkoutListItemData;
} & NameMaps;

export default function WorkoutListItem({
  workout,
  globalIdToName,
  userIdToName,
}: WorkoutListItemProps) {
  const totalSets = workout.items.reduce(
    (sum, item) => sum + item.sets.length,
    0,
  );

  return (
    <Link
      to="/workouts/$workoutId"
      params={{ workoutId: workout._id }}
      className="block"
    >
      <div className="rounded-lg border border-border bg-card p-3 hover:bg-primary/5 transition-colors cursor-pointer">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="font-semibold">
              {new Date(workout.date).toLocaleDateString()}
            </div>
            {workout.items.length > 0 && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {totalSets} total sets
              </div>
            )}
          </div>
          <WorkoutDropdown workoutId={workout._id} />
        </div>

        {workout.items.length > 0 ? (
          <div className="mt-2 text-sm text-foreground/85">
            {workout.items.map((it, idx) => {
              const name =
                it.exercise.kind === 'global'
                  ? globalIdToName.get(it.exercise.id)
                  : userIdToName.get(it.exercise.id);
              const resolved = name ?? 'Exercise';
              return (
                <div
                  key={String(workout._id) + idx}
                  className="flex justify-between"
                >
                  <span>{resolved}</span>
                  <span className="text-muted-foreground">
                    {it.sets.length} set{it.sets.length === 1 ? '' : 's'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-2 text-sm text-muted-foreground italic">
            No exercises yet. Time to get to work! 💪
          </div>
        )}

        {workout.notes && (
          <div className="mt-2 text-xs italic text-muted-foreground">
            {workout.notes}
          </div>
        )}

        {workout.items.length > 0 && (
          <div className="mt-3">
            <MuscleGroupStats workoutId={workout._id} variant="compact" />
          </div>
        )}
      </div>
    </Link>
  );
}
