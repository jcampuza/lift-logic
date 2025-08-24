"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateUserExercise from "@/components/CreateUserExercise";

export default function SettingsPage() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <header className="sticky top-0 z-10 bg-background p-4 border-b border-slate-800 flex flex-row justify-between items-center">
          <span>Settings</span>
          <Link
            href="/signin"
            className="rounded-md px-3 py-1 bg-slate-800 text-foreground"
          >
            Sign in
          </Link>
        </header>
        <div className="mt-6 text-sm opacity-80">You must sign in first.</div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 max-w-xl mx-auto">
      <header className="sticky top-0 z-10 bg-background p-4 -mx-6 mb-6 border-b border-slate-800 flex flex-row items-center gap-3">
        <Link
          href="/"
          className="rounded-md px-2 py-1 hover:bg-slate-800 text-sm"
        >
          ← Home
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <section className="space-y-4">
        <h2 className="text-base font-semibold">Add a custom exercise</h2>
        <CreateUserExercise
          className=""
          onCreated={() => setStatus("Exercise added.")}
        />
        {status && <div className="text-xs opacity-70">{status}</div>}
      </section>

      <section className="mt-10">
        <button
          className="rounded-md px-3 py-1 bg-slate-800 text-foreground"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </button>
      </section>
    </div>
  );
}
