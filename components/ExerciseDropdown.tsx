'use client';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';

interface ExerciseDropdownProps {
  onDelete: () => void;
  onClearExercise?: () => void;
  onSwapExercise?: () => void;
  align?: 'start' | 'center' | 'end';
  showClearOption?: boolean;
}

export function ExerciseDropdown({
  onDelete,
  onClearExercise,
  onSwapExercise,
  align = 'end',
  showClearOption = false,
}: ExerciseDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-md p-1 hover:bg-slate-700 relative z-10"
          aria-label="Exercise actions"
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
        {showClearOption && onClearExercise && (
          <DropdownMenuItem onSelect={onClearExercise}>
            Clear sets & notes
          </DropdownMenuItem>
        )}
        {onSwapExercise && (
          <DropdownMenuItem onSelect={onSwapExercise}>
            Swap exercise
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          Delete exercise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ExerciseDropdown;
