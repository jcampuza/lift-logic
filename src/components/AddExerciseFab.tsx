'use client';

import { PlusIcon } from '@heroicons/react/24/outline';

interface AddExerciseFabProps {
  onAddExercise: () => void;
}

export function AddExerciseFab({ onAddExercise }: AddExerciseFabProps) {
  return (
    <button
      className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl shadow-lg hover:scale-105 transition-transform"
      onClick={onAddExercise}
      aria-label="Add exercise"
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  );
}

export default AddExerciseFab;
