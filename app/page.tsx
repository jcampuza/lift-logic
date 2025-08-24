"use client";

import {
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import WorkoutDropdown from "@/components/WorkoutDropdown";
import { WorkoutListSkeleton } from "@/components/WorkoutSkeleton";
import { api } from "../convex/_generated/api";
// import { useMutation } from "convex/react";
import type { Id } from "../convex/_generated/dataModel";
import { NewWorkoutFab } from "./NewWorkoutFab";

function SettingsLink() {
  const { isAuthenticated } = useConvexAuth();
  if (!isAuthenticated) return null;
  return (
    <Link
      href="/settings"
      className="inline-flex items-center rounded-md px-2 py-1 hover:bg-slate-800"
      aria-label="Settings"
      title="Settings"
    >
      <Cog6ToothIcon className="h-5 w-5" />
    </Link>
  );
}

function Content() {
  const workouts = useQuery(api.myFunctions.listWorkouts) ?? undefined;
  const exercises =
    useQuery(api.myFunctions.searchExercises, { q: undefined }) ?? [];
  // deletion handled via DeleteWorkoutDialog component
  const globalIdToName = new Map<Id<"globalExercises">, string>();
  const userIdToName = new Map<Id<"userExercises">, string>();
  for (const e of exercises) {
    if (e.kind === "global") globalIdToName.set(e._id, e.name);
    else userIdToName.set(e._id, e.name);
  }

  if (workouts === undefined) {
    return <WorkoutListSkeleton />;
  }

  if (workouts.length === 0) {
    return (
      <div className="mt-12 text-center opacity-80">
        <p>No workouts yet.</p>
        <p className="text-sm">Tap + to log your first workout.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {workouts.map((w) => (
        <li key={w._id}>
          <Link href={`/workouts/${w._id}`} className="block">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                <div className="font-semibold">
                  {new Date(w.date).toLocaleDateString()}
                </div>
                <WorkoutDropdown workoutId={w._id} />
              </div>
              <div className="mt-2 text-sm opacity-80">
                {w.items.map((it, idx) => {
                  const name =
                    it.exercise.kind === "global"
                      ? globalIdToName.get(it.exercise.id)
                      : userIdToName.get(it.exercise.id);
                  const resolved = name ?? "Exercise";
                  const repsSummary = it.sets.map((s) => s.reps).join(", ");
                  return (
                    <div
                      key={String(w._id) + idx}
                      className="flex justify-between"
                    >
                      <span>{resolved}</span>
                      <span className="opacity-70">
                        {it.sets.length} set{it.sets.length === 1 ? "" : "s"} •
                        [{repsSummary}]
                      </span>
                    </div>
                  );
                })}
              </div>
              {w.notes && (
                <div className="mt-2 text-xs italic opacity-70">{w.notes}</div>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b border-slate-800 flex flex-row justify-between items-center">
        Lift Logic
        <SettingsLink />
      </header>
      <main className="p-4 pb-24 max-w-xl mx-auto w-full">
        <Content />
        <NewWorkoutFab />
      </main>
    </>
  );
}
