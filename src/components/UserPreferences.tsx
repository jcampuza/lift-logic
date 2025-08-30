'use client'

import { useMutation } from 'convex/react'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { useState } from 'react'
import { api } from '../../convex/_generated/api'
import { Button } from './ui/button'

export function UserPreferences() {
  const { data } = useQuery(convexQuery(api.exercises.getUserPreferences, {}))
  const updatePreferences = useMutation(api.exercises.updateUserPreferences)
  const [status, setStatus] = useState<string | null>(null)

  const handleWeightUnitChange = async (weightUnit: 'lbs' | 'kg') => {
    try {
      await updatePreferences({ weightUnit })
      setStatus('Preferences saved')
      setTimeout(() => setStatus(null), 2000)
    } catch (error) {
      console.error('Failed to update preferences:', error)
      setStatus('Failed to save preferences')
      setTimeout(() => setStatus(null), 2000)
    }
  }

  const weightUnit = data?.weightUnit ?? ''

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
  )
}

export default UserPreferences
