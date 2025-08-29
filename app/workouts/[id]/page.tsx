"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import WorkoutContent from "./WorkoutContent";
import WorkoutDetailSkeleton from "@/components/WorkoutDetailSkeleton";

export default function WorkoutDetailPage() {
  const params = useParams();
  const workoutId = params.id as Id<"workouts">;

  const {
    data: workout,
    isPending,
    isError,
    isSuccess,
  } = useQuery(convexQuery(api.workouts.getWorkout, { id: workoutId }));

  if (isPending) {
    return <WorkoutDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-4 pb-24 max-w-xl mx-auto">
        <div className="text-center text-sm opacity-70">
          Workout not available. Redirecting...
        </div>
      </div>
    );
  }

  if (!isSuccess || !workout) {
    return <WorkoutDetailSkeleton />;
  }

  // Pass initial workout data to content component
  return <WorkoutContent initialWorkout={workout} />;
}
