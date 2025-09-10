'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreateUserExercise,
  type CreateExerciseResult,
} from './CreateUserExercise';

export function CreateUserExerciseDialog({
  children,
  onCreated,
}: {
  children: React.ReactNode;
  onCreated?: (id: CreateExerciseResult, name: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Custom Exercise</DialogTitle>
        </DialogHeader>
        <CreateUserExercise
          onCreated={(id, name) => {
            onCreated?.(id, name);
            setOpen(false);
          }}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
}
