import { WorkoutDetailContent } from '@/app/(protected)/workouts/[workoutId]/WorkoutDetailContent';

export const revalidate = 86400;

export default async function WorkoutDetailPage({
  params,
}: PageProps<'/workouts/[workoutId]'>) {
  const { workoutId } = await params;
  return <WorkoutDetailContent workoutId={workoutId} />;
}
