"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import ExerciseDropdown from "@/components/ExerciseDropdown";
import { NumericInput } from "@/components/ui/numeric-input";
import { XIcon, ChevronDownIcon, ChevronUpIcon, EditIcon } from "lucide-react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

export type ExerciseRef =
  | { kind: "global"; id: Id<"globalExercises"> }
  | { kind: "user"; id: Id<"userExercises"> };

export type ExerciseData = {
  name: string;
  primaryMuscle?: string;
};

export type WorkoutItemDraft = {
  exercise: ExerciseRef;
  exerciseData: ExerciseData;
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
  const preferences = useQuery(api.exercises.getUserPreferences);
  const weightUnit = preferences?.weightUnit ?? "lbs";

  // Start expanded by default
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNotes, setShowNotes] = useState(value.notes.trim() !== "");

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

  // Generate summary text for collapsed view
  const getSummary = () => {
    if (value.sets.length === 0) return "No sets";

    const totalSets = value.sets.length;
    const weights = value.sets.map((s) => s.weight).filter((w) => w && w > 0);
    const reps = value.sets.map((s) => s.reps);

    let summary = `${totalSets} set${totalSets > 1 ? "s" : ""}`;

    if (reps.length > 0) {
      const minReps = Math.min(...reps);
      const maxReps = Math.max(...reps);
      if (minReps === maxReps) {
        summary += ` × ${minReps} reps`;
      } else {
        summary += ` × ${minReps}-${maxReps} reps`;
      }
    }

    if (weights.length > 0) {
      const minWeight = Math.min(...(weights as number[]));
      const maxWeight = Math.max(...(weights as number[]));
      if (minWeight === maxWeight) {
        summary += ` @ ${minWeight}${weightUnit}`;
      } else {
        summary += ` @ ${minWeight}-${maxWeight}${weightUnit}`;
      }
    }

    return summary;
  };

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-slate-800 rounded-md transition-colors"
          title={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? (
            <ChevronUpIcon className="size-4" />
          ) : (
            <ChevronDownIcon className="size-4" />
          )}
        </button>
        <div className="flex-1">
          <div className="text-sm font-semibold">{value.exerciseData.name}</div>
          {value.exerciseData.primaryMuscle && (
            <div className="text-xs opacity-60">
              {value.exerciseData.primaryMuscle}
            </div>
          )}
          {!isExpanded && (
            <div className="text-xs opacity-70 mt-1">{getSummary()}</div>
          )}
        </div>
        {isEditing && (
          <ExerciseDropdown
            onDelete={onDelete}
            onClearExercise={() => onChange({ ...value, sets: [], notes: "" })}
            showClearOption={true}
          />
        )}
      </div>

      {isExpanded && (
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

          {/* Notes section with toggle */}
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                <EditIcon className="size-3" />
                Exercise notes
                {showNotes ? (
                  <ChevronUpIcon className="size-3" />
                ) : (
                  <ChevronDownIcon className="size-3" />
                )}
              </button>
              {!showNotes && value.notes.trim() && (
                <span className="text-xs opacity-60 bg-slate-800 px-2 py-1 rounded">
                  Has notes
                </span>
              )}
            </div>
            {showNotes && (
              <textarea
                value={value.notes}
                onChange={(e) => onChange({ ...value, notes: e.target.value })}
                className="w-full rounded-md border border-slate-800 bg-slate-950 p-2 min-h-16"
                placeholder="Notes, RPE, how it felt, etc."
                disabled={!isEditing}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExerciseEditor;
