'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '../convex/_generated/api';
import { useConvexReactQueryMutation } from '@/hooks/useConvexReactQueryMutation';
import type { Id } from '../convex/_generated/dataModel';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

export type ExerciseRef =
  | { kind: 'global'; id: Id<'globalExercises'> }
  | { kind: 'user'; id: Id<'userExercises'> };

export function LeaveFeedbackDialog({
  children,
  workoutId,
  exercise,
  defaultOpen,
}: {
  children: React.ReactNode;
  workoutId?: Id<'workouts'>;
  exercise?: ExerciseRef;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(defaultOpen ?? false);
  const [content, setContent] = useState('');

  const pathname = usePathname();

  const userAgent = useMemo(() => {
    if (typeof navigator !== 'undefined') return navigator.userAgent;
    return undefined;
  }, []);

  const createFeedback = useConvexReactQueryMutation(
    api.feedback.createFeedback,
    {
      onSuccess: () => {
        setOpen(false);
        setContent('');
        toast('Feedback sent', {
          description: 'Thanks! We appreciate your help improving the app.',
        });
      },
      onError: () => {
        toast('Could not send feedback', {
          description: 'Please try again in a moment.',
        });
      },
    },
  );

  const canSubmit = content.trim().length >= 3 && !createFeedback.isPending;

  useEffect(() => {
    if (!open) {
      setContent('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave feedback</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-foreground/80" htmlFor="feedback-text">
            Tell us what’s on your mind
          </label>
          <textarea
            id="feedback-text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Feature request, bug report, or general thoughts"
            className="w-full rounded-md border border-border bg-background p-2 min-h-28"
            autoFocus
          />
          <div className="text-xs opacity-60">
            We’ll include some app context automatically.
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={createFeedback.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              createFeedback.mutate({
                content: content.trim(),
                route: pathname,
                workoutId,
                exercise,
                userAgent,
              });
            }}
            disabled={!canSubmit}
          >
            {createFeedback.isPending ? 'Sending…' : 'Send feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default LeaveFeedbackDialog;
