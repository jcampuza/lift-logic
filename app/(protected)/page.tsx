import { NewWorkoutFab } from '@/components/NewWorkoutFab';
import { WorkoutList } from '@/components/WorkoutList';

export default function HomePage() {
  return (
    <>
      <main className="px-4 py-3 pb-24 max-w-xl mx-auto w-full">
        <WorkoutList />
        <NewWorkoutFab />
      </main>
    </>
  );
}
