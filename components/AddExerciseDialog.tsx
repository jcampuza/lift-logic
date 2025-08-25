"use client";

import { useMemo, useState } from "react";
import CreateUserExercise from "@/components/CreateUserExercise";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useExerciseSearch } from "@/hooks/useExerciseSearch";
import type { Id } from "@/convex/_generated/dataModel";

export type ExerciseRef =
  | { kind: "global"; id: Id<"globalExercises"> }
  | { kind: "user"; id: Id<"userExercises"> };

interface AddExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExerciseSelected: (exercise: ExerciseRef) => void;
}

export function AddExerciseDialog({
  open,
  onOpenChange,
  onExerciseSelected,
}: AddExerciseDialogProps) {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseRef | null>(
    null,
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { query: q, setQuery: setQ, exercises: results } = useExerciseSearch();

  type ResultItem =
    | {
        kind: "global";
        _id: Id<"globalExercises">;
        name: string;
        primaryMuscle: string;
      }
    | {
        kind: "user";
        _id: Id<"userExercises">;
        name: string;
        primaryMuscle: string;
      };
  type AddNewItem = { kind: "add_new"; name: string };

  const items: Array<ResultItem | AddNewItem> = useMemo(() => {
    const base: Array<ResultItem | AddNewItem> = results;
    const term = q.trim();
    if (term === "") return base;
    const exists = results.some(
      (r) => r.name.toLowerCase() === term.toLowerCase(),
    );
    if (!exists) {
      return [...base, { kind: "add_new", name: term } as AddNewItem];
    }
    return base;
  }, [results, q]);

  const selectedItem = selectedExercise
    ? (results.find(
        (r) =>
          r.kind === selectedExercise?.kind && r._id === selectedExercise?.id,
      ) ?? null)
    : null;

  const handleClose = () => {
    setQ("");
    setSelectedExercise(null);
    setShowCreateForm(false);
    onOpenChange(false);
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      onExerciseSelected(selectedExercise);
      handleClose();
    }
  };

  const handleExerciseCreated = (id: Id<"userExercises">) => {
    const newExercise: ExerciseRef = { kind: "user", id };
    onExerciseSelected(newExercise);
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
                  r.kind === "add_new"
                    ? `add:${r.name}`
                    : `${r.kind}:${String(r._id)}`
                }
                getLabel={(r) => (r.kind === "add_new" ? r.name : r.name)}
                onSelect={(r) => {
                  if ((r as AddNewItem).kind === "add_new") {
                    const name = (r as AddNewItem).name;
                    setQ(name);
                    setShowCreateForm(true);
                    return;
                  }
                  const it = r as ResultItem;
                  setSelectedExercise(
                    it.kind === "global"
                      ? { kind: "global", id: it._id }
                      : { kind: "user", id: it._id },
                  );
                }}
                placeholder="Search exercises..."
                renderItem={(r) => {
                  if ((r as AddNewItem).kind === "add_new") {
                    const name = (r as AddNewItem).name;
                    return (
                      <div className="flex items-center justify-between text-emerald-400">
                        <span>Add &quot;{name}&quot; as a new exercise</span>
                      </div>
                    );
                  }
                  const it = r as ResultItem;
                  return (
                    <div className="flex items-center justify-between">
                      <span>{it.name}</span>
                      {it.primaryMuscle && (
                        <span className="text-xs opacity-60">
                          {it.primaryMuscle}
                        </span>
                      )}
                    </div>
                  );
                }}
              />

              {selectedItem && (
                <div className="p-3 bg-slate-800/50 rounded-md">
                  <div className="text-sm font-medium">{selectedItem.name}</div>
                  <div className="text-xs opacity-70">
                    {selectedItem.primaryMuscle}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-auto">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleAddExercise}
                disabled={!selectedExercise}
                variant="default"
              >
                Add Exercise
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
