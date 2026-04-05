import { createFileRoute } from '@tanstack/react-router';
import { WorkoutDetailContent } from '@/components/WorkoutDetailContent';

export const Route = createFileRoute('/_protected/workouts/$workoutId')({
  component: WorkoutDetailPage,
});

function WorkoutDetailPage() {
  const { workoutId } = Route.useParams();
  return <WorkoutDetailContent workoutId={workoutId} />;
}
