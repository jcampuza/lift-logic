'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Link } from '@tanstack/react-router'
import { Skeleton } from './ui/skeleton'

export function WorkoutDetailSkeleton({ delayMs = 250 }: { delayMs?: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setShow(true), delayMs)
    return () => clearTimeout(id)
  }, [delayMs])

  if (!show) return null

  return (
    <div className="p-4 pb-24 max-w-xl mx-auto">
      <header className="flex items-center gap-4 mb-4">
        <Link
          to="/"
          className="p-2 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <Skeleton className="h-7 w-40 mb-2" /> {/* Title */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" /> {/* Date */}
            <Skeleton className="h-4 w-16" /> {/* Sync status */}
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-7 rounded-md" /> {/* Menu button */}
        </div>
      </header>

      <div className="flex flex-col gap-4">
        {/* Exercise items skeleton */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 2 }, (_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-5 w-24" /> {/* Exercise name */}
                <Skeleton className="h-5 w-5 rounded-md" />{' '}
                {/* Delete button */}
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />{' '}
                {/* Exercise search/input */}
                <Skeleton className="h-4 w-3/4" /> {/* Sets info */}
              </div>
            </div>
          ))}
          <Skeleton className="h-10 w-full rounded-md" />{' '}
          {/* Add exercise button */}
        </div>

        {/* Notes section skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" /> {/* Notes label */}
          <Skeleton className="h-20 w-full rounded-md" /> {/* Notes textarea */}
        </div>
      </div>
    </div>
  )
}

export default WorkoutDetailSkeleton
