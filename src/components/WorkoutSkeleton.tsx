'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function WorkoutSkeleton({ delayMs = 250 }: { delayMs?: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(id);
  }, [delayMs]);

  if (!show) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" /> {/* Date */}
        <Skeleton className="h-6 w-6 rounded-md" /> {/* Three dots menu */}
      </div>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" /> {/* Exercise name */}
          <Skeleton className="h-4 w-16" /> {/* Sets info */}
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" /> {/* Another exercise */}
          <Skeleton className="h-4 w-20" /> {/* Sets info */}
        </div>
      </div>
      <div className="mt-2">
        <Skeleton className="h-3 w-3/4" /> {/* Notes line */}
      </div>
    </div>
  );
}

export function WorkoutListSkeleton({
  count = 3,
  delayMs = 250,
}: {
  count?: number;
  delayMs?: number;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <WorkoutSkeleton delayMs={delayMs} />
        </li>
      ))}
    </ul>
  );
}

export default WorkoutSkeleton;
