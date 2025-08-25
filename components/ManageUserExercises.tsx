"use client";

import { useQuery } from "convex/react";
import { TrashIcon } from "lucide-react";
import { DeleteUserExerciseDialog } from "./DeleteUserExerciseDialog";
import { api } from "../convex/_generated/api";

export function ManageUserExercises() {
  const userExercises = useQuery(api.exercises.searchExercises, { q: "" });

  const filteredUserExercises = userExercises?.filter((ex) => ex.kind === "user") || [];

  if (filteredUserExercises.length === 0) {
    return (
      <div className="text-sm opacity-70 text-center py-4">
        No custom exercises yet. Create one above to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredUserExercises.map((exercise) => (
        <div
          key={exercise._id}
          className="rounded-lg border border-slate-800 bg-slate-900 p-3 flex items-center justify-between"
        >
          <div className="flex-1">
            <div className="font-medium text-sm">{exercise.name}</div>
            <div className="text-xs opacity-70">{exercise.primaryMuscle}</div>
          </div>
          <DeleteUserExerciseDialog
            exerciseId={exercise._id}
            exerciseName={exercise.name}
            onDeleted={() => {
              // The query will automatically refetch and update the UI
            }}
          >
            <button
              className="p-2 rounded-md hover:bg-slate-800 text-red-400 hover:text-red-300 transition-colors"
              title={`Delete ${exercise.name}`}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </DeleteUserExerciseDialog>
        </div>
      ))}
    </div>
  );
}