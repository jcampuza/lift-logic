'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';
import type { FunctionReturnType } from 'convex/server';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { toast } from 'sonner';

interface MuscleGroupStatsProps {
  workoutId: Id<'workouts'>;
  variant?: 'compact' | 'full';
  className?: string;
}

type WorkoutAnalytics = FunctionReturnType<
  typeof api.workouts.getWorkoutAnalytics
>;
type UserPreferences = FunctionReturnType<
  typeof api.exercises.getUserPreferences
>;

interface MuscleGroupStatsContainerProps {
  analytics: WorkoutAnalytics;
  preferences: UserPreferences;
  variant: 'compact' | 'full';
  className: string;
}

interface MuscleGroupStatsCollapsibleProps {
  analytics: WorkoutAnalytics;
  initialCollapsed: boolean;
  className: string;
}

// Generate summary text for collapsed view
function getSummary(analytics: WorkoutAnalytics) {
  if (analytics.muscleGroups.length === 0) return 'No muscle groups';

  const totalSets = analytics.muscleGroups.reduce(
    (sum: number, group) => sum + group.sets,
    0,
  );
  const uniqueGroups = analytics.muscleGroups.length;

  return `${uniqueGroups} muscle group${uniqueGroups > 1 ? 's' : ''}, ${totalSets} set${totalSets > 1 ? 's' : ''} total`;
}

function MuscleGroupStatsCompact({
  analytics,
  className,
}: {
  analytics: WorkoutAnalytics;
  className: string;
}) {
  return (
    <div className={`${className} flex gap-2 flex-wrap`}>
      {analytics.muscleGroups.map((group) => {
        const displaySets =
          group.sets % 1 === 0 ? group.sets.toString() : group.sets.toFixed(1);

        return (
          <span
            key={group.name}
            className="text-xs bg-muted/50 text-foreground/90 ring-1 ring-primary/30 px-2 py-1 rounded-md"
          >
            {group.name} {displaySets}
          </span>
        );
      })}
    </div>
  );
}

function MuscleGroupStatsCollapsible({
  analytics,
  initialCollapsed,
  className,
}: MuscleGroupStatsCollapsibleProps) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

  return (
    <div className={`${className} space-y-2`}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const newCollapsed = !isCollapsed;
            setIsCollapsed(newCollapsed);

            // Show one-time notification about settings
            const hasSeenNotification = localStorage.getItem(
              'muscleGroupsSettingsNotification',
            );
            if (!hasSeenNotification) {
              toast('💡 You can set this as your default', {
                description:
                  'Go to Settings > User Preferences to set muscle groups to be collapsed by default.',
              });
              localStorage.setItem('muscleGroupsSettingsNotification', 'true');
            }
          }}
          className="p-1 hover:bg-muted rounded-md transition-colors"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            <ChevronDownIcon className="size-4" />
          ) : (
            <ChevronUpIcon className="size-4" />
          )}
        </button>
        <h3 className="text-sm font-medium opacity-90">Muscle Groups</h3>
        {isCollapsed && (
          <div className="text-xs opacity-70">{getSummary(analytics)}</div>
        )}
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-2 gap-2">
          {analytics.muscleGroups.map((group) => {
            const displaySets =
              group.sets % 1 === 0
                ? group.sets.toString()
                : group.sets.toFixed(1);
            const isPlural = group.sets !== 1;

            return (
              <div
                key={group.name}
                className="flex justify-between items-center bg-muted/60 border border-border px-3 py-2 rounded-md"
              >
                <span className="text-sm">{group.name}</span>
                <span className="text-xs text-muted-foreground">
                  {displaySets} set{isPlural ? 's' : ''}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MuscleGroupStatsContainer({
  analytics,
  preferences,
  variant,
  className,
}: MuscleGroupStatsContainerProps) {
  if (variant === 'compact') {
    return (
      <MuscleGroupStatsCompact analytics={analytics} className={className} />
    );
  }

  return (
    <MuscleGroupStatsCollapsible
      analytics={analytics}
      initialCollapsed={preferences.muscleGroupsCollapsed ?? false}
      className={className}
    />
  );
}

export function MuscleGroupStats({
  workoutId,
  variant = 'compact',
  className = '',
}: MuscleGroupStatsProps) {
  const { data: preferences } = useQuery(
    convexQuery(api.exercises.getUserPreferences, {}),
  );

  const { data: analytics } = useQuery(
    convexQuery(api.workouts.getWorkoutAnalytics, { workoutId }),
  );

  if (!analytics || !preferences) {
    return (
      <div className={`${className} opacity-60`}>
        <div className="text-xs">Loading muscle groups...</div>
      </div>
    );
  }

  if (analytics.muscleGroups.length === 0) {
    return (
      <div className={`${className} opacity-60`}>
        <div className="text-xs">No muscle groups tracked</div>
      </div>
    );
  }

  return (
    <MuscleGroupStatsContainer
      analytics={analytics}
      preferences={preferences}
      variant={variant}
      className={className}
    />
  );
}

export default MuscleGroupStats;
