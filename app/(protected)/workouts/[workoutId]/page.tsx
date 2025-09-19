import { WorkoutDetailContent } from '@/app/(protected)/workouts/[workoutId]/WorkoutDetailContent';

export const dynamic = 'force-static';

export default async function WorkoutDetailPage({
  params,
}: PageProps<'/workouts/[workoutId]'>) {
  const { workoutId } = await params;
  return <WorkoutDetailContent workoutId={workoutId} />;
}
