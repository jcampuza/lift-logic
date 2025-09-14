'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function DeleteSetDialog({
  onConfirm,
  children,
  title = 'Delete this set?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete set',
  isDestructive = true,
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  confirmText?: string;
  isDestructive?: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={
              isDestructive ? 'bg-red-600 text-background hover:bg-red-700' : ''
            }
            disabled={submitting}
            onClick={async () => {
              try {
                setSubmitting(true);
                await Promise.resolve(onConfirm());
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {submitting ? 'Deleting...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteSetDialog;
