"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import DeleteWorkoutDialog from "@/components/DeleteWorkoutDialog";
import { useQueryWithStatus } from "@/hooks/useQueryWithStatus";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import ExerciseEditor, { type WorkoutItemDraft } from "../ExerciseEditor";

type LocalWorkoutItemDraft = WorkoutItemDraft;

export default function WorkoutDetailPage() {
	const params = useParams();
	const workoutId = params.id as Id<"workouts">;

	const {
		data: workout,
		isPending,
		isError,
		isSuccess,
	} = useQueryWithStatus(api.myFunctions.getWorkout, { id: workoutId });

	const updateWorkout = useMutation(api.myFunctions.updateWorkout);

	const [notes, setNotes] = useState("");
	const [items, setItems] = useState<Array<LocalWorkoutItemDraft>>([]);
	const [isSaving, setIsSaving] = useState(false);
	const [saveStatus, setSaveStatus] = useState<
		"idle" | "saving" | "saved" | "error"
	>("idle");
	const lastSavedRef = useRef<string>("{}");
	const router = useRouter();

	// Debounced state for auto-save (2 second delay)
	const deferredNotes = useDeferredValue(notes);
	const deferredItems = useDeferredValue(items);

	useEffect(() => {
		if (workout) {
			setNotes(workout.notes ?? "");
			setItems(
				workout.items.map((item) => ({
					exercise: item.exercise,
					notes: item.notes ?? "",
					sets: item.sets,
				})),
			);
			const initialPayload = JSON.stringify({
				notes: workout.notes ?? undefined,
				items: workout.items.map((it) => ({
					exercise: it.exercise,
					notes: it.notes ?? undefined,
					sets: it.sets,
				})),
			});
			lastSavedRef.current = initialPayload;
		}
	}, [workout]);

	const addEmptyExercise = () => {
		setItems((prev) => [...prev, { exercise: null, notes: "", sets: [] }]);
	};

	// Debounced auto-save effect
	useEffect(() => {
		if (!workout) return;

		const payload = {
			id: workoutId,
			date: workout.date,
			notes: deferredNotes.trim() === "" ? undefined : deferredNotes.trim(),
			items: deferredItems
				.filter((it) => it.exercise !== null)
				.map((it) => ({
					exercise: it.exercise!,
					notes: it.notes.trim() === "" ? undefined : it.notes.trim(),
					sets: it.sets,
				})),
		};

		const compare = JSON.stringify({
			notes: payload.notes,
			items: payload.items,
		});

		// Only save if content has actually changed and we're not already saving
		if (compare === lastSavedRef.current || isSaving) {
			if (compare === lastSavedRef.current) {
				setSaveStatus("saved");
			}
			return;
		}

		setSaveStatus("saving");
		setIsSaving(true);

		updateWorkout(payload)
			.then(() => {
				lastSavedRef.current = compare;
				setSaveStatus("saved");
			})
			.catch(() => {
				setSaveStatus("error");
			})
			.finally(() => {
				setIsSaving(false);
			});
	}, [
		deferredNotes,
		deferredItems,
		workout,
		workoutId,
		updateWorkout,
		isSaving,
	]);

	if (isPending) {
		return (
			<div className="p-4 pb-24 max-w-xl mx-auto">
				<div className="text-center text-sm opacity-70">Loading workout...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="p-4 pb-24 max-w-xl mx-auto">
				<div className="text-center text-sm opacity-70">
					Workout not available. Redirecting...
				</div>
			</div>
		);
	}

	// Fallback guard: if not successful yet (e.g., intermediate states), show loading
	if (!isSuccess) {
		return (
			<div className="p-4 pb-24 max-w-xl mx-auto">
				<div className="text-center text-sm opacity-70">Loading workout...</div>
			</div>
		);
	}

	return (
		<div className="p-4 pb-24 max-w-xl mx-auto">
			<header className="flex items-center gap-4 mb-4">
				<Link
					href="/"
					className="p-2 rounded-md hover:bg-slate-800 transition-colors"
				>
					<ArrowLeftIcon className="w-5 h-5" />
				</Link>
				<div>
					<h1 className="text-xl font-semibold">Workout Details</h1>
					<div className="flex items-center gap-2">
						<p className="text-sm opacity-70">
							{new Date(workout.date).toLocaleDateString()}
						</p>
						{saveStatus === "saving" && (
							<span className="text-xs text-blue-400 flex items-center gap-1">
								<svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								Saving...
							</span>
						)}
						{saveStatus === "saved" && (
							<span className="text-xs text-green-400">Saved</span>
						)}
						{saveStatus === "error" && (
							<span className="text-xs text-red-400">Save failed</span>
						)}
					</div>
				</div>
				<div className="ml-auto flex gap-2">
					<DeleteWorkoutDialog
						workoutId={workoutId}
						onDeleted={() => router.replace("/")}
					>
						<button className="bg-red-600 text-background rounded-md px-3 py-2">
							Delete
						</button>
					</DeleteWorkoutDialog>
				</div>
			</header>

			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label className="text-sm opacity-80">Workout notes</label>
					<textarea
						value={notes}
						onChange={(e) => {
							setNotes(e.target.value);
						}}
						className="w-full rounded-md border border-slate-800 bg-slate-950 p-2 min-h-20"
						placeholder="How did it go? RPE, overall feel, etc."
					/>
				</div>

				<div className="flex flex-col gap-3">
					{items.map((item, idx) => (
						<ExerciseEditor
							key={idx}
							value={item}
							onChange={(v) => {
								setItems((prev) => prev.map((p, i) => (i === idx ? v : p)));
							}}
							onDelete={() => {
								setItems((prev) => prev.filter((_, i) => i !== idx));
							}}
							isEditing={true}
						/>
					))}
					<button
						className="mt-2 bg-slate-800 text-foreground rounded-md px-3 py-2"
						onClick={addEmptyExercise}
					>
						Add exercise
					</button>
				</div>
			</div>
		</div>
	);
}
// local ExerciseEditor removed in favor of shared component
