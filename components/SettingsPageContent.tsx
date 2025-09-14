import { ManageUserExercises } from './ManageUserExercises';
import UserPreferences from './UserPreferences';
import { SignOut } from './SignOut';
import LeaveFeedbackDialog from './LeaveFeedbackDialog';
import { Button } from '@/components/ui/button';

export default function SettingsPageContent() {
  return (
    <>
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Preferences</h2>
        <UserPreferences />
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-base font-semibold">Custom Exercises</h2>
        <ManageUserExercises />
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-base font-semibold">Feedback</h2>
        <LeaveFeedbackDialog>
          <Button variant="outline">Leave feedback</Button>
        </LeaveFeedbackDialog>
      </section>

      <section className="mt-10">
        <SignOut />
      </section>
    </>
  );
}
