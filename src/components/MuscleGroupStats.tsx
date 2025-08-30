'use client'

import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface MuscleGroupStatsProps {
  workoutId: Id<'workouts'>
  variant?: 'compact' | 'full'
  className?: string
}

export function MuscleGroupStats({
  workoutId,
  variant = 'compact',
  className = '',
}: MuscleGroupStatsProps) {
  const { data: analytics } = useQuery(
    convexQuery(api.workouts.getWorkoutAnalytics, { workoutId }),
  )

  if (!analytics) {
    return (
      <div className={`${className} opacity-60`}>
        <div className="text-xs">Loading muscle groups...</div>
      </div>
    )
  }

  // Get top muscle groups (sorted by set count)
  const muscleGroupEntries = Object.entries(analytics.muscleGroups)
    .filter(([, sets]) => sets > 0)
    .sort(([, a], [, b]) => b - a)

  if (muscleGroupEntries.length === 0) {
    return (
      <div className={`${className} opacity-60`}>
        <div className="text-xs">No muscle groups tracked</div>
      </div>
    )
  }

  if (variant === 'compact') {
    // Show top 3 muscle groups for list cards
    const topGroups = muscleGroupEntries.slice(0, 3)
    return (
      <div className={`${className} flex gap-2 flex-wrap`}>
        {topGroups.map(([group, sets]) => {
          const displaySets = sets % 1 === 0 ? sets.toString() : sets.toFixed(1)
          return (
            <span
              key={group}
              className="text-xs bg-muted/50 text-foreground/90 ring-1 ring-primary/30 px-2 py-1 rounded-md"
            >
              {group} {displaySets}
            </span>
          )
        })}
      </div>
    )
  }

  // Full view for workout detail page
  return (
    <div className={`${className} space-y-2`}>
      <h3 className="text-sm font-medium opacity-90">Muscle Groups</h3>
      <div className="grid grid-cols-2 gap-2">
        {muscleGroupEntries.map(([group, sets]) => {
          const displaySets = sets % 1 === 0 ? sets.toString() : sets.toFixed(1)
          const isPlural = sets !== 1
          return (
            <div
              key={group}
              className="flex justify-between items-center bg-muted/60 border border-border px-3 py-2 rounded-md"
            >
              <span className="text-sm">{group}</span>
              <span className="text-xs text-muted-foreground">
                {displaySets} set{isPlural ? 's' : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MuscleGroupStats
