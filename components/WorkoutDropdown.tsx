"use client";

import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import DeleteWorkoutDialog from "@/components/DeleteWorkoutDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Id } from "../convex/_generated/dataModel";

interface WorkoutDropdownProps {
  workoutId: Id<"workouts">;
  onDeleted?: () => void;
  align?: "start" | "center" | "end";
}

export function WorkoutDropdown({
  workoutId,
  onDeleted,
  align = "end",
}: WorkoutDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-md p-1 hover:bg-slate-700 relative z-10"
          aria-label="More actions"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <DeleteWorkoutDialog workoutId={workoutId} onDeleted={onDeleted}>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => e.preventDefault()}
          >
            Delete
          </DropdownMenuItem>
        </DeleteWorkoutDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkoutDropdown;
