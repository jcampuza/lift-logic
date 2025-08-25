"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreateUserExercise,
  type UserExerciseData,
} from "./CreateUserExercise";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

export function EditUserExerciseDialog({
  exerciseId,
  children,
  onUpdated,
}: {
  exerciseId: Id<"userExercises">;
  children: React.ReactNode;
  onUpdated?: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const exercise = useQuery(api.exercises.getUserExercise, { exerciseId });

  if (!exercise) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading exercise...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const exerciseData: UserExerciseData = {
    _id: exercise._id,
    name: exercise.name,
    primaryMuscle: exercise.primaryMuscle,
    secondaryMuscles: exercise.secondaryMuscles,
    notes: exercise.notes,
    aliases: exercise.aliases,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
        </DialogHeader>
        <CreateUserExercise
          mode="edit"
          editData={exerciseData}
          onUpdated={(name) => {
            onUpdated?.(name);
            setOpen(false);
          }}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
}
