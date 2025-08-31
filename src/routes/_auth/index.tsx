import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '../../../convex/_generated/api'
import { useConvexAuth } from 'convex/react'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import WorkoutListItem, {
  type WorkoutListItemData,
} from '@/components/WorkoutListItem'
import { WorkoutListSkeleton } from '@/components/WorkoutSkeleton'
import { NewWorkoutFab } from '@/components/NewWorkoutFab'
import type { Id } from '../../../convex/_generated/dataModel'

export const Route = createFileRoute('/_auth/')({
  component: Home,
})

function SettingsLink() {
  const { isAuthenticated } = useConvexAuth()
  if (!isAuthenticated) return null
  return (
    <Link
      to="/settings"
      className="inline-flex items-center rounded-md px-2 py-1 hover:bg-muted transition-colors"
      aria-label="Settings"
      title="Settings"
    >
      <Cog6ToothIcon className="h-5 w-5" />
    </Link>
  )
}

function Content() {
  const { data: workouts } = useQuery(
    convexQuery(api.workouts.listWorkouts, {}),
  )
  const { data: exercises = [] } = useQuery(
    convexQuery(api.exercises.searchExercises, { q: undefined }),
  )

  const globalIdToName = new Map<Id<'globalExercises'>, string>()
  const userIdToName = new Map<Id<'userExercises'>, string>()
  for (const e of exercises) {
    if (e.kind === 'global') globalIdToName.set(e._id, e.name)
    else userIdToName.set(e._id, e.name)
  }

  if (workouts === undefined) {
    return <WorkoutListSkeleton />
  }

  if (workouts.length === 0) {
    return (
      <div className="mt-12 text-center opacity-80">
        <p>No workouts yet.</p>
        <p className="text-sm">Tap + to log your first workout.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {workouts.map((w) => (
        <li key={w._id}>
          <WorkoutListItem
            workout={w as WorkoutListItemData}
            globalIdToName={globalIdToName}
            userIdToName={userIdToName}
          />
        </li>
      ))}
    </ul>
  )
}

function Home() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-background px-4 py-3 border-b border-border flex flex-row justify-between items-center">
        Lift PR&apos;s
        <SettingsLink />
      </header>
      <main className="px-4 py-3 pb-24 max-w-xl mx-auto w-full">
        <Content />
        <NewWorkoutFab />
      </main>
    </>
  )
}
