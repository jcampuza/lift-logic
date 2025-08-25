import { PlusIcon } from "@heroicons/react/24/outline";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/convex/_generated/api";

export function NewWorkoutFab() {
  const router = useRouter();
  const createWorkout = useMutation(api.workouts.createWorkout);
  const [creating, setCreating] = useState(false);
  return (
    <button
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center text-3xl shadow-lg disabled:opacity-60"
      disabled={creating}
      onClick={async () => {
        try {
          setCreating(true);
          const id = await createWorkout({
            date: Date.now(),
            notes: undefined,
            items: [],
          });
          router.replace(`/workouts/${id}`);
        } finally {
          setCreating(false);
        }
      }}
      aria-busy={creating}
      aria-label={creating ? "Creating workout" : "Create workout"}
    >
      {creating ? (
        <span className="animate-pulse text-sm">…</span>
      ) : (
        <PlusIcon className="w-6 h-6" />
      )}
    </button>
  );
}
