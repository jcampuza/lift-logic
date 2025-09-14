'use client';

import { useMutation } from 'convex/react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';

export function DeleteWorkoutDialog({
  workoutId,
  onDeleted,
  children,
}: {
  workoutId: Id<'workouts'>;
  onDeleted?: () => void;
  children: React.ReactNode;
}) {
  const deleteWorkout = useMutation(api.workouts.deleteWorkout);
  const [submitting, setSubmitting] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete workout?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            workout and its items.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-background"
            disabled={submitting}
            onClick={async () => {
              try {
                setSubmitting(true);
                await deleteWorkout({ id: workoutId });
                onDeleted?.();
              } finally {
                setSubmitting(false);
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteWorkoutDialog;
