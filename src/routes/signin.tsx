import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth } from 'convex/react'
import { useState } from 'react'
import { GoogleLogo } from '@/components/GoogleLogo'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/signin')({
  component: SignIn,
})

type SignInState = "idle" | "loading" | "error";

function SignIn() {
  const { signIn } = useAuthActions()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const [signInState, setSignInState] = useState<SignInState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  const handleSignIn = async () => {
    setSignInState("loading");
    setErrorMessage("");

    try {
      await signIn("google");
    } catch {
      setErrorMessage("Failed to sign in. Please try again.");
      setSignInState("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <img
                src="/logo.webp"
                alt="Workout Companion Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* App Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Workout Companion
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Track your workouts, log your sets, and watch your progress grow.
              Simple, powerful workout tracking for every fitness journey.
            </p>
          </div>

          {/* Sign In Button */}
          <Button
            className="w-full h-12 text-base font-medium bg-white hover:bg-gray-100 text-black border-0 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
            variant="outline"
            type="button"
            onClick={handleSignIn}
            disabled={signInState === "loading"}
          >
            {signInState === "loading" ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            ) : (
              <GoogleLogo className="mr-3 h-5 w-5" />
            )}
            {signInState === "loading"
              ? "Signing in..."
              : "Sign in with Google"}
          </Button>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-center text-red-400 text-sm mt-3">
              {errorMessage}
            </p>
          )}

          {/* Footer Text */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Start tracking your workouts today
          </p>
        </div>
      </div>
    </div>
  )
}
