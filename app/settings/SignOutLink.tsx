import { useAuthActions } from "@convex-dev/auth/react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SignOutLink() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };
  return (
    <button
      className="rounded-md px-3 py-1 bg-slate-800 text-foreground flex items-center gap-2 disabled:opacity-50"
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut && <Loader2 className="h-4 w-4 animate-spin" />}
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
