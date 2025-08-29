import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../../../convex/_generated/api'
import WorkoutContent from '../../../components/WorkoutContent'
import WorkoutDetailSkeleton from '../../../components/WorkoutDetailSkeleton'
import type { Id } from 'convex/_generated/dataModel'

export const Route = createFileRoute('/_auth/workouts/$workoutId')({
  component: WorkoutDetail,
})

function WorkoutDetail() {
  const { workoutId } = Route.useParams()

  const {
    data: workout,
    isPending,
    isError,
    isSuccess,
  } = useQuery(
    convexQuery(api.workouts.getWorkout, { id: workoutId as Id<'workouts'> }),
  )

  if (isPending) {
    return <WorkoutDetailSkeleton />
  }

  if (isError) {
    return (
      <div className="p-4 pb-24 max-w-xl mx-auto">
        <div className="text-center text-sm opacity-70">
          Workout not available. Redirecting...
        </div>
      </div>
    )
  }

  if (!isSuccess || !workout) {
    return <WorkoutDetailSkeleton />
  }

  // Pass initial workout data to content component
  return <WorkoutContent initialWorkout={workout} />
}
