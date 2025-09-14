'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { GoogleLogo } from 'components/GoogleLogo';
import { Button } from 'components/ui/button';
import { Loader2 } from 'lucide-react';

type SignInState = 'idle' | 'loading' | 'error';

export default function SignInPage() {
  const { signIn } = useAuthActions();

  const [signInState, setSignInState] = useState<SignInState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSignIn = async () => {
    setSignInState('loading');
    setErrorMessage('');

    try {
      await signIn('google');
    } catch {
      setErrorMessage('Failed to sign in. Please try again.');
      setSignInState('error');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <img
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

          <Button
            className="w-full h-12 text-base font-medium gap-2"
            variant="secondary"
            type="button"
            onClick={handleSignIn}
            disabled={signInState === 'loading'}
          >
            {signInState === 'loading' ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            ) : (
              <GoogleLogo className="mr-3 h-5 w-5" />
            )}
            {signInState === 'loading'
              ? 'Signing in...'
              : 'Sign in with Google'}
          </Button>

          {errorMessage && (
            <p className="text-center text-destructive text-sm mt-3">
              {errorMessage}
            </p>
          )}

          <p className="text-center text-muted-foreground text-sm mt-6">
            Start tracking your workouts today
          </p>
        </div>
      </div>
    </div>
  );
}
