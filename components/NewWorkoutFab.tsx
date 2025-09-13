'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '../convex/_generated/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useConvexReactQueryMutation } from '@/hooks/useConvexReactQueryMutation';

export function NewWorkoutFab() {
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const createWorkout = useConvexReactQueryMutation(
    api.workouts.createWorkout,
    {
      onSuccess: (data) => {
        setOpen(false);
        router.push(`/workouts/${data}`);
      },
    },
  );

  const cloneLatest = useConvexReactQueryMutation(
    api.workouts.cloneLatestWorkout,
    {
      onSuccess: (data) => {
        setOpen(false);
        router.push(`/workouts/${data}`);
      },
    },
  );

  const creating = createWorkout.isPending || cloneLatest.isPending;

  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl shadow-[0_6px_24px_rgba(0,0,0,0.35)] hover:bg-primary/90 hover:scale-105 active:scale-95 active:translate-y-0.5 transition duration-150 ease-out disabled:opacity-60"
        disabled={creating}
        onClick={() => setOpen(true)}
        aria-busy={creating}
        aria-label={creating ? 'Creating workout' : 'Create workout'}
      >
        {creating ? (
          <span className="animate-pulse text-sm">…</span>
        ) : (
          <PlusIcon className="w-6 h-6" />
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New workout</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button
              onClick={async () => {
                createWorkout.mutate({
                  date: Date.now(),
                  notes: undefined,
                  items: [],
                });
              }}
              disabled={creating}
            >
              Create from scratch
            </Button>

            <Button
              variant="outline"
              onClick={async () => {
                cloneLatest.mutate({});
              }}
              disabled={creating}
            >
              Use previous workout as template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
