import { useAuthActions } from '@convex-dev/auth/react'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'

export function SignOut() {
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      navigate({ to: '/signin' })
    } catch (error) {
      console.error('Sign out error:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <Button
      className="bg-muted text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      onClick={handleSignOut}
      disabled={isSigningOut}
      variant="secondary"
    >
      {isSigningOut && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      {isSigningOut ? 'Signing out...' : 'Sign out'}
    </Button>
  )
}
