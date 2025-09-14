'use client';

import { Button } from 'components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { GoogleLogo } from 'components/GoogleLogo';

type SignInState = 'idle' | 'loading' | 'error';

export function SignInButton() {
  const { signIn } = useAuthActions();
  const searchParams = useSearchParams();

  const [signInState, setSignInState] = useState<SignInState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSignIn = async () => {
    setSignInState('loading');
    setErrorMessage('');

    try {
      const redirectParam = searchParams.get('redirect') ?? undefined;
      if (redirectParam) {
        await signIn('google', { redirectTo: redirectParam });
      } else {
        await signIn('google');
      }
    } catch {
      setErrorMessage('Failed to sign in. Please try again.');
      setSignInState('error');
    }
  };

  return (
    <>
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
        {signInState === 'loading' ? 'Signing in...' : 'Sign in with Google'}
      </Button>

      {errorMessage && (
        <p className="text-center text-destructive text-sm mt-3">
          {errorMessage}
        </p>
      )}
    </>
  );
}
