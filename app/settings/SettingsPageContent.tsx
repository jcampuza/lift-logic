"use client";

import { ManageUserExercises } from "@/components/ManageUserExercises";
import UserPreferences from "@/components/UserPreferences";
import { SignOutLink } from "@/app/settings/SignOutLink";

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

      <section className="mt-10">
        <SignOutLink />
      </section>
    </>
  );
}
