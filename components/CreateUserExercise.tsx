"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import {
  PrimaryMuscleGroupSelector,
  SecondaryMuscleGroupSelector,
} from "./MuscleGroupSelector";

export type CreateExerciseResult = Id<"userExercises">;

export function CreateUserExercise({
  defaultName = "",
  onCreated,
  className,
}: {
  defaultName?: string;
  onCreated?: (id: CreateExerciseResult, name: string) => void;
  className?: string;
}) {
  const createUserExercise = useMutation(api.exercises.createUserExercise);

  const [name, setName] = useState(defaultName);
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState<string[]>([]);
  const [aliases, setAliases] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className={className}>
      <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-3">
        <div className="grid gap-1.5">
          <label className="text-sm opacity-80">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Bulgarian Split Squat"
            className="w-full rounded-md border border-slate-800 bg-slate-950 p-2"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm opacity-80">Primary muscle</label>
          <PrimaryMuscleGroupSelector value={primary} onChange={setPrimary} />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm opacity-80">Secondary muscles</label>
          <SecondaryMuscleGroupSelector
            value={secondary}
            onChange={setSecondary}
            primaryMuscle={primary}
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm opacity-80">Aliases</label>
          <input
            value={aliases}
            onChange={(e) => setAliases(e.target.value)}
            placeholder="Comma-separated alternative names"
            className="w-full rounded-md border border-slate-800 bg-slate-950 p-2"
          />
        </div>
        <div className="grid gap-1.5">
          <label className="text-sm opacity-80">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Cues, setup tips, etc."
            className="w-full rounded-md border border-slate-800 bg-slate-950 p-2 min-h-20"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            className="rounded-md px-3 py-2 bg-foreground text-background disabled:opacity-50"
            disabled={submitting}
            onClick={async () => {
              const trimmedName = name.trim();
              if (trimmedName === "" || primary === "") {
                setStatus("Please provide name and primary muscle.");
                return;
              }
              setSubmitting(true);
              try {
                const aliasesArr = aliases
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s !== "");
                const id = await createUserExercise({
                  name: trimmedName,
                  primaryMuscle: primary,
                  secondaryMuscles: secondary,
                  aliases: aliasesArr.length ? aliasesArr : undefined,
                  notes: notes.trim() === "" ? undefined : notes.trim(),
                });
                setStatus("Exercise added.");
                onCreated?.(id, trimmedName);
                setName("");
                setPrimary("");
                setSecondary([]);
                setAliases("");
                setNotes("");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            Add exercise
          </button>
          {status && <span className="text-xs opacity-70">{status}</span>}
        </div>
      </div>
    </div>
  );
}

export default CreateUserExercise;
