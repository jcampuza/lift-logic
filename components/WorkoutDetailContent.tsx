'use client';

import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '@/convex/_generated/api';
import WorkoutContent from 'components/WorkoutContent';
import WorkoutDetailSkeleton from 'components/WorkoutDetailSkeleton';

export const WorkoutDetailContent = ({ workoutId }: { workoutId: string }) => {
  const {
    data: workout,
    isPending,
    isError,
    isSuccess,
  } = useQuery(
    convexQuery(api.workouts.getWorkout, { id: workoutId as Id<'workouts'> }),
  );

  if (isError) {
    return (
      <div className="p-4 pb-24 max-w-xl mx-auto">
        <div className="text-center text-sm opacity-70">
          Workout not available. Redirecting...
        </div>
      </div>
    );
  }

  if (isPending) {
    return <WorkoutDetailSkeleton />;
  }

  if (!isSuccess || !workout) {
    return <WorkoutDetailSkeleton />;
  }

  return <WorkoutContent initialWorkout={workout} />;
};
