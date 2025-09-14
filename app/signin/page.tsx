import { SignInButton } from '@/app/signin/SignInButton';
import Image from 'next/image';
import { Suspense } from 'react';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <Image
                width={80}
                height={80}
                src="/logo.webp"
                alt="Workout Companion Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Workout Companion
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Track your workouts, log your sets, and watch your progress grow.
              Simple, powerful workout tracking for every fitness journey.
            </p>
          </div>

          <Suspense>
            <SignInButton />
          </Suspense>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Start tracking your workouts today
          </p>
        </div>
      </div>
    </div>
  );
}
