import { WorkoutListSkeleton } from '@/components/WorkoutSkeleton';

export default function Loading() {
  return (
    <main className="px-4 py-3 pb-24 max-w-xl mx-auto w-full">
      <WorkoutListSkeleton />
    </main>
  );
}
