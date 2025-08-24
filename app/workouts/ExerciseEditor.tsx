"use client";

import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import CreateUserExercise from "@/components/CreateUserExercise";
import { Autocomplete } from "@/components/ui/autocomplete";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
	const [q, setQ] = useState("");
	const rawResults = useQuery(api.myFunctions.searchExercises, { q });
	const results = useMemo(() => rawResults ?? [], [rawResults]);

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
		onChange({ ...value, sets: [...value.sets, { reps: 10, weight: 0 }] });
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
									<span>Add “{name}” as a new exercise</span>
								</div>
							);
						}
						const it = r as ResultItem;
						return (
							<div className="flex items-center justify-between">
								<span>{it.name}</span>
								{it.primaryMuscle && (
									<span className="text-xs opacity-60">{it.primaryMuscle}</span>
								)}
							</div>
						);
					}}
				/>
				{isEditing && (
					<button className="text-xs opacity-70 underline" onClick={onDelete}>
						Remove
					</button>
				)}
			</div>

			{selected && (
				<div className="mt-3">
					<div className="text-sm font-semibold">{selected.name}</div>
					<div className="mt-2 flex flex-col gap-2">
						{value.sets.map((s, i) => (
							<div key={i} className="flex gap-2 items-center">
								<span className="text-xs opacity-70 w-12">Set {i + 1}</span>
								<input
									type="number"
									min={1}
									value={s.reps}
									onChange={(e) => updateSetReps(i, Number(e.target.value))}
									className="w-20 rounded-md border border-slate-800 bg-slate-950 p-2"
									disabled={!isEditing}
								/>
								<span className="text-xs opacity-70">reps</span>
								<input
									type="number"
									min={0}
									step={0.5}
									value={s.weight ?? 0}
									onChange={(e) =>
										updateSetWeight(
											i,
											e.target.value === ""
												? undefined
												: Number(e.target.value),
										)
									}
									className="w-24 rounded-md border border-slate-800 bg-slate-950 p-2"
									disabled={!isEditing}
								/>
								<span className="text-xs opacity-70">lbs</span>
								{isEditing && (
									<button
										className="ml-auto text-xs opacity-70 underline"
										onClick={() => removeSet(i)}
									>
										Remove set
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
