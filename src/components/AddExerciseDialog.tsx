'use client';

import { useMemo, useState } from 'react';
import CreateUserExercise from '@/components/CreateUserExercise';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useExerciseSearch } from '@/hooks/useExerciseSearch';
import type { Id } from '../../convex/_generated/dataModel';

export type ExerciseRef =
  | { kind: 'global'; id: Id<'globalExercises'> }
  | { kind: 'user'; id: Id<'userExercises'> };

interface AddExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExerciseSelected: (
    exercise: ExerciseRef,
    exerciseData: { name: string; primaryMuscle?: string },
  ) => void;
}

export function AddExerciseDialog({
  open,
  onOpenChange,
  onExerciseSelected,
}: AddExerciseDialogProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { query: q, setQuery: setQ, exercises: results } = useExerciseSearch();

  type ResultItem =
    | {
        kind: 'global';
        _id: Id<'globalExercises'>;
        name: string;
        primaryMuscle: string;
      }
    | {
        kind: 'user';
        _id: Id<'userExercises'>;
        name: string;
        primaryMuscle: string;
      };
  type AddNewItem = { kind: 'add_new'; name: string };

  const items: Array<ResultItem | AddNewItem> = useMemo(() => {
    const base: Array<ResultItem | AddNewItem> = results;
    const term = q.trim();
    if (term === '') return base;
    const exists = results.some(
      (r) => r.name.toLowerCase() === term.toLowerCase(),
    );
    if (!exists) {
      return [...base, { kind: 'add_new', name: term } as AddNewItem];
    }
    return base;
  }, [results, q]);

  const handleClose = () => {
    setQ('');
    setShowCreateForm(false);
    onOpenChange(false);
  };

  const handleExerciseCreated = (id: Id<'userExercises'>, name: string) => {
    const newExercise: ExerciseRef = { kind: 'user', id };
    onExerciseSelected(newExercise, { name });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md min-h-[400px] max-h-[80vh] flex flex-col"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>

        {!showCreateForm ? (
          <>
            <div className="flex-1 flex flex-col space-y-4">
              <Autocomplete
                inputValue={q}
                onInputValueChange={setQ}
                items={items}
                autoFocus={false}
                listClassName="min-h-[200px] max-h-[200px]"
                getKey={(r) =>
                  r.kind === 'add_new'
                    ? `add:${r.name}`
                    : `${r.kind}:${String(r._id)}`
                }
                getLabel={(r) => (r.kind === 'add_new' ? r.name : r.name)}
                onSelect={(r) => {
                  if ((r as AddNewItem).kind === 'add_new') {
                    const name = (r as AddNewItem).name;
                    setQ(name);
                    setShowCreateForm(true);
                    return;
                  }
                  const it = r as ResultItem;
                  const exerciseRef: ExerciseRef =
                    it.kind === 'global'
                      ? { kind: 'global', id: it._id }
                      : { kind: 'user', id: it._id };
                  onExerciseSelected(exerciseRef, {
                    name: it.name,
                    primaryMuscle: it.primaryMuscle,
                  });
                  handleClose();
                }}
                placeholder="Search exercises..."
                renderItem={(r) => {
                  if ((r as AddNewItem).kind === 'add_new') {
                    const name = (r as AddNewItem).name;
                    return (
                      <div className="flex items-center justify-between text-primary">
                        <span>Add &quot;{name}&quot; as a new exercise</span>
                      </div>
                    );
                  }
                  const it = r as ResultItem;
                  return (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="flex-1">{it.name}</span>
                        {it.primaryMuscle && (
                          <span className="text-xs opacity-60 flex-shrink-0">
                            {it.primaryMuscle}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground italic">
                        {it.kind === 'global'
                          ? 'System exercise'
                          : 'Added by you'}
                      </span>
                    </div>
                  );
                }}
              />
            </div>

            <DialogFooter className="mt-auto">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <CreateUserExercise
                defaultName={q}
                onCreated={handleExerciseCreated}
              />
            </div>
            <DialogFooter className="mt-auto">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Back to Search
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AddExerciseDialog;
