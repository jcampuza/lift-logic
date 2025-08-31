'use client'

import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react'
import { DeleteUserExerciseDialog } from './DeleteUserExerciseDialog'
import { EditUserExerciseDialog } from './EditUserExerciseDialog'
import { CreateUserExerciseDialog } from './CreateUserExerciseDialog'
import { Skeleton } from './ui/skeleton'
import { api } from '../../convex/_generated/api'

function UserExerciseSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  )
}

export function ManageUserExercises() {
  const { data: userExercises, isLoading } = useQuery(
    convexQuery(api.exercises.listUserExercises, {}),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium opacity-80">
          Your Custom Exercises
        </h3>
        <CreateUserExerciseDialog
          onCreated={() => {
            // The query will automatically refetch and update the UI
          }}
        >
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Add Exercise
          </button>
        </CreateUserExerciseDialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <UserExerciseSkeleton key={i} />
          ))}
        </div>
      ) : (userExercises?.length ?? 0) === 0 ? (
        <div className="text-sm opacity-70 text-center py-8">
          No custom exercises yet. Click &quot;Add Exercise&quot; to create your
          first one.
        </div>
      ) : (
        <div className="space-y-3">
          {(userExercises ?? []).map((exercise) => (
            <div
              key={exercise._id}
              className="rounded-lg border border-border bg-card p-3 flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{exercise.name}</div>
                <div className="text-xs opacity-70">
                  {exercise.primaryMuscle}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <EditUserExerciseDialog
                  exerciseId={exercise._id}
                  onUpdated={() => {
                    // The query will automatically refetch and update the UI
                  }}
                >
                  <button
                    className="p-2 rounded-md hover:bg-muted text-primary hover:text-primary/90 transition-colors"
                    title={`Edit ${exercise.name}`}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </EditUserExerciseDialog>
                <DeleteUserExerciseDialog
                  exerciseId={exercise._id}
                  exerciseName={exercise.name}
                  onDeleted={() => {
                    // The query will automatically refetch and update the UI
                  }}
                >
                  <button
                    className="p-2 rounded-md hover:bg-muted text-destructive hover:text-destructive/90 transition-colors"
                    title={`Delete ${exercise.name}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </DeleteUserExerciseDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
