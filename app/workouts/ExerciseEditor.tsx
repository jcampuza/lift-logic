"use client";

import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import CreateUserExercise from "@/components/CreateUserExercise";
import ExerciseDropdown from "@/components/ExerciseDropdown";
import { Autocomplete } from "@/components/ui/autocomplete";
import { useExerciseSearch } from "@/hooks/useExerciseSearch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NumericInput } from "@/components/ui/numeric-input";
import { XIcon } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export type ExerciseRef =
  | { kind: "global"; id: Id<"globalExercises"> }
  | { kind: "user"; id: Id<"userExercises"> };

export type WorkoutItemDraft = {
  exercise: ExerciseRef | null;
  notes: string;
  sets: Array<{ reps: number; weight?: number }>;
};

export function ExerciseEditor({
  value,
  onChange,
  onDelete,
  isEditing = true,
}: {
  value: WorkoutItemDraft;
  onChange: (v: WorkoutItemDraft) => void;
  onDelete: () => void;
  isEditing?: boolean;
}) {
  const { query: q, setQuery: setQ, exercises: results } = useExerciseSearch();
  const preferences = useQuery(api.exercises.getUserPreferences);
  const weightUnit = preferences?.weightUnit ?? "lbs";

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
    if (!isEditing || term === "") return base;
    const exists = results.some(
      (r) => r.name.toLowerCase() === term.toLowerCase(),
    );
    if (!exists) {
      return [...base, { kind: "add_new", name: term } as AddNewItem];
    }
    return base;
  }, [results, q, isEditing]);

  const [showDialog, setShowDialog] = useState(false);
  const [newName, setNewName] = useState("");

  const selected = value.exercise
    ? (results.find(
        (r) => r.kind === value.exercise?.kind && r._id === value.exercise?.id,
      ) ?? null)
    : null;

  const addSet = () => {
    const lastSet = value.sets[value.sets.length - 1];
    const newSet = {
      reps: lastSet?.reps ?? 10,
      weight: lastSet?.weight ?? 0,
    };
    onChange({ ...value, sets: [...value.sets, newSet] });
  };

  const updateSetReps = (i: number, reps: number) => {
    const newSets = value.sets.map((s, idx) =>
      idx === i ? { reps, weight: s.weight } : s,
    );
    onChange({ ...value, sets: newSets });
  };

  const updateSetWeight = (i: number, weight: number | undefined) => {
    const newSets = value.sets.map((s, idx) =>
      idx === i ? { reps: s.reps, weight } : s,
    );
    onChange({ ...value, sets: newSets });
  };

  const removeSet = (i: number) => {
    onChange({ ...value, sets: value.sets.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
      {!selected ? (
        <div className="flex gap-2 items-center">
          <Autocomplete
            className="flex-1"
            inputValue={q}
            onInputValueChange={setQ}
            items={items}
            getKey={(r) =>
              r.kind === "add_new"
                ? `add:${r.name}`
                : `${r.kind}:${String(r._id)}`
            }
            getLabel={(r) => (r.kind === "add_new" ? r.name : r.name)}
            onSelect={(r) => {
              if (!isEditing) return;
              if ((r as AddNewItem).kind === "add_new") {
                const name = (r as AddNewItem).name;
                setNewName(name);
                setShowDialog(true);
                return;
              }
              const it = r as ResultItem;
              onChange({
                ...value,
                exercise:
                  it.kind === "global"
                    ? { kind: "global", id: it._id }
                    : { kind: "user", id: it._id },
              });
            }}
            placeholder="Search exercises (type to filter)"
            disabled={!isEditing}
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
          {isEditing && <ExerciseDropdown onDelete={onDelete} />}
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <div className="text-sm font-semibold">{selected.name}</div>
          </div>
          {isEditing && (
            <ExerciseDropdown
              onDelete={onDelete}
              onClearExercise={() => onChange({ ...value, exercise: null })}
              showClearOption={true}
            />
          )}
        </div>
      )}

      {selected && (
        <div className="mt-4">
          <div className="border-t border-slate-800 my-4"></div>
          <div className="flex flex-col gap-2">
            {value.sets.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs opacity-70 w-12">Set {i + 1}</span>
                <NumericInput
                  value={s.weight}
                  onChange={(value) => updateSetWeight(i, value)}
                  min={0}
                  allowDecimals={true}
                  allowEmpty={true}
                  placeholder="0"
                  className="w-24 rounded-md border border-slate-800 bg-slate-950 p-2"
                  disabled={!isEditing}
                />
                <span className="text-xs opacity-70">{weightUnit}</span>
                <NumericInput
                  value={s.reps}
                  onChange={(value) => updateSetReps(i, value || 1)}
                  min={1}
                  allowDecimals={false}
                  allowEmpty={false}
                  placeholder="1"
                  className="w-20 rounded-md border border-slate-800 bg-slate-950 p-2"
                  disabled={!isEditing}
                />
                <span className="text-xs opacity-70">reps</span>
                {isEditing && (
                  <button
                    className="ml-auto p-1 opacity-70 hover:opacity-100 transition-opacity"
                    onClick={() => removeSet(i)}
                    title="Remove set"
                  >
                    <XIcon className="size-4" />
                    <span className="sr-only">Remove set</span>
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                className="self-start bg-slate-800 text-foreground rounded-md px-3 py-1"
                onClick={addSet}
              >
                Add set
              </button>
            )}
          </div>
          <div className="mt-3">
            <label className="text-sm opacity-80">Exercise notes</label>
            <textarea
              value={value.notes}
              onChange={(e) => onChange({ ...value, notes: e.target.value })}
              className="w-full rounded-md border border-slate-800 bg-slate-950 p-2 min-h-16"
              placeholder="Notes, RPE, how it felt, etc."
              disabled={!isEditing}
            />
          </div>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new exercise</DialogTitle>
          </DialogHeader>
          <CreateUserExercise
            defaultName={newName}
            onCreated={(id, createdName) => {
              onChange({ ...value, exercise: { kind: "user", id } });
              setQ(createdName);
              setShowDialog(false);
              setNewName("");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExerciseEditor;
