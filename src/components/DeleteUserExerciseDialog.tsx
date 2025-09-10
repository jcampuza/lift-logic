'use client';

import { useMutation } from 'convex/react';
import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
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
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

export function DeleteUserExerciseDialog({
  exerciseId,
  exerciseName,
  onDeleted,
  children,
}: {
  exerciseId: Id<'userExercises'>;
  exerciseName: string;
  onDeleted?: () => void;
  children: React.ReactNode;
}) {
  const { data: checkUsage } = useQuery(
    convexQuery(api.exercises.checkExerciseUsage, { exerciseId }),
  );
  const deleteExercise = useMutation(api.exercises.deleteUserExercise);
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await deleteExercise({ exerciseId });
      onDeleted?.();
    } finally {
      setSubmitting(false);
    }
  };

  if (!checkUsage) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Checking exercise usage...</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete &quot;{exerciseName}&quot;?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {checkUsage.isUsed ? (
              <>
                This exercise is currently used in{' '}
                <strong>{checkUsage.workoutCount}</strong> workout
                {checkUsage.workoutCount === 1 ? '' : 's'}. Deleting it will
                remove it from all those workouts as well.
                <br />
                <br />
                This action cannot be undone.
              </>
            ) : (
              <>
                This exercise is not currently used in any workouts.
                <br />
                <br />
                This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-background hover:bg-red-700"
            disabled={submitting}
            onClick={handleDelete}
          >
            {submitting
              ? 'Deleting...'
              : checkUsage.isUsed
                ? `Delete from ${checkUsage.workoutCount} workout${checkUsage.workoutCount === 1 ? '' : 's'}`
                : 'Delete exercise'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
