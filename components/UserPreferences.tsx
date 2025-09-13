'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { convexQuery, useConvexMutation } from '@convex-dev/react-query';
import { useRef, useState } from 'react';
import { api } from '../convex/_generated/api';
import { Button } from './ui/button';
import { Switch } from './ui/switch';

export function UserPreferences() {
  const { data, isLoading } = useQuery(
    convexQuery(api.exercises.getUserPreferences, {}),
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePreferences = useMutation({
    mutationFn: useConvexMutation(api.exercises.updateUserPreferences),
    onSuccess: () => {
      setStatus('Preferences saved');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setStatus(null), 2000);
    },
    onError: () => {
      setStatus('Failed to save preferences');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setStatus(null), 2000);
    },
  });

  const [status, setStatus] = useState<string | null>(null);

  const handleWeightUnitChange = async (weightUnit: 'lbs' | 'kg') => {
    updatePreferences.mutate({ weightUnit });
  };

  const weightUnit = data?.weightUnit ?? '';
  const includeHalfSets = data?.includeHalfSets ?? true;

  const handleIncludeHalfSetsChange = async (value: boolean) => {
    updatePreferences.mutate({ includeHalfSets: value });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded-md w-24 mb-2"></div>
          <div className="h-10 bg-muted rounded-md w-32"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium opacity-90 block mb-2">
          Weight Unit
        </label>
        <div className="flex gap-2">
          <Button
            disabled={!weightUnit}
            className={
              weightUnit === 'lbs'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-primary/90'
            }
            onClick={() => handleWeightUnitChange('lbs')}
          >
            Pounds (lbs)
          </Button>
          <Button
            disabled={!weightUnit}
            className={
              weightUnit === 'kg'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-primary/90'
            }
            onClick={() => handleWeightUnitChange('kg')}
          >
            Kilograms (kg)
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium opacity-90 block mb-2">
          Count secondary muscles as half sets
        </label>
        <div className="flex items-center gap-3">
          <Switch
            checked={includeHalfSets}
            onCheckedChange={handleIncludeHalfSetsChange}
          />
          <span className="text-xs opacity-70">
            When enabled, secondary muscles contribute 0.5 sets to analytics.
          </span>
        </div>
      </div>

      {status && (
        <div
          className={`text-xs ${
            status.includes('Failed') ? 'text-red-400' : 'opacity-70'
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}

export default UserPreferences;
