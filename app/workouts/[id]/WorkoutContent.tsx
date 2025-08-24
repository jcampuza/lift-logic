"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useMutation } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import WorkoutDropdown from "@/components/WorkoutDropdown";
import useSingleFlight from "@/hooks/useSingleFlight";
import useDebounce from "@/hooks/useDebounce";
import { api } from "../../../convex/_generated/api";
import ExerciseEditor, {
  type WorkoutItemDraft,
  type ExerciseRef,
} from "../ExerciseEditor";
import type { Id } from "../../../convex/_generated/dataModel";

type LocalWorkoutItemDraft = WorkoutItemDraft;

type WorkoutData = {
  _id: Id<"workouts">;
  _creationTime: number;
  date: number;
  notes?: string;
  items: Array<{
    exercise: ExerciseRef;
    notes?: string;
    sets: Array<{ reps: number; weight?: number }>;
  }>;
};

type SyncStatus = {
  isSyncing: boolean;
  lastSynced: number;
  error: string | null;
};

type WorkoutContentProps = {
  initialWorkout: WorkoutData;
};

export default function WorkoutContent({
  initialWorkout,
}: WorkoutContentProps) {
  const router = useRouter();
  const updateWorkout = useMutation(api.myFunctions.updateWorkout);

  // Local state initialized once from server data
  const [notes, setNotes] = useState(initialWorkout.notes ?? "");
  const [items, setItems] = useState<Array<LocalWorkoutItemDraft>>(
    initialWorkout.items.map((item) => ({
      exercise: item.exercise,
      notes: item.notes ?? "",
      sets: item.sets,
    })),
  );

  // Sync status state
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    lastSynced: initialWorkout._creationTime,
    error: null,
  });

  // Single flight sync function
  const performSync = useCallback(
    async (
      syncNotes: string,
      syncItems: Array<LocalWorkoutItemDraft>,
    ): Promise<void> => {
      const payload = {
        id: initialWorkout._id,
        date: initialWorkout.date,
        notes: syncNotes.trim() === "" ? undefined : syncNotes.trim(),
        items: syncItems
          .filter((it) => it.exercise !== null)
          .map((it) => ({
            exercise: it.exercise!,
            notes: it.notes.trim() === "" ? undefined : it.notes.trim(),
            sets: it.sets,
          })),
      };

      setSyncStatus((prev) => ({ ...prev, isSyncing: true, error: null }));

      try {
        await updateWorkout(payload);
        setSyncStatus((prev) => ({
          ...prev,
          isSyncing: false,
          lastSynced: Date.now(),
          error: null,
        }));
      } catch (error) {
        console.error("Failed to save workout:", error);
        setSyncStatus((prev) => ({
          ...prev,
          isSyncing: false,
          error: error instanceof Error ? error.message : "Sync failed",
        }));
        throw error; // Re-throw to let useSingleFlight handle it
      }
    },
    [initialWorkout._id, initialWorkout.date, updateWorkout],
  );

  // Wrap with single flight to prevent concurrent saves
  const singleFlightSync = useSingleFlight(performSync);

  // Debounce the sync function to avoid excessive API calls
  const debouncedSync = useDebounce(singleFlightSync, 250);

  // Auto-save effect - trigger debounced sync when data changes
  useEffect(() => {
    debouncedSync(notes, items);
  }, [notes, items, debouncedSync]);

  const addEmptyExercise = () => {
    setItems((prev) => [...prev, { exercise: null, notes: "", sets: [] }]);
  };

  const retrySync = () => {
    // Use current state values and trigger immediate sync
    singleFlightSync(notes, items).catch(() => {
      // Error is already handled in performSync
    });
  };

  return (
    <div className="p-4 pb-24 max-w-xl mx-auto">
      <header className="flex items-center gap-4 mb-4">
        <Link
          href="/"
          className="p-2 rounded-md hover:bg-slate-800 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Workout Details</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm opacity-70">
              {new Date(initialWorkout.date).toLocaleDateString()}
            </p>
            <SyncStatusIndicator syncStatus={syncStatus} onRetry={retrySync} />
          </div>
        </div>
        <div className="flex gap-2">
          <WorkoutDropdown 
            workoutId={initialWorkout._id} 
            onDeleted={() => router.replace("/")} 
          />
        </div>
      </header>

      <div className="flex flex-col gap-4">
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
      </div>
    </div>
  );
}

type SyncStatusIndicatorProps = {
  syncStatus: SyncStatus;
  onRetry: () => void;
};

function SyncStatusIndicator({
  syncStatus,
  onRetry,
}: SyncStatusIndicatorProps) {
  if (syncStatus.isSyncing) {
    return (
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
        Syncing...
      </span>
    );
  }

  if (syncStatus.error) {
    return (
      <button
        onClick={onRetry}
        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
      >
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Sync failed - Retry
      </button>
    );
  }

  const timeAgo = Date.now() - syncStatus.lastSynced;
  const minutes = Math.floor(timeAgo / 60000);
  const seconds = Math.floor((timeAgo % 60000) / 1000);

  let timeText = "";
  if (minutes > 0) {
    timeText = `${minutes}m ago`;
  } else if (seconds > 5) {
    timeText = `${seconds}s ago`;
  } else {
    timeText = "now";
  }

  return (
    <span className="text-xs text-green-400 flex items-center gap-1">
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
      Synced {timeText}
    </span>
  );
}
