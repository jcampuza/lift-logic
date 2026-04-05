import { createFileRoute } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { SettingsLink } from '@/components/SettingsLink';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { Loader2 } from 'lucide-react';
import RedirectToSignIn from '@/components/RedirectToSignIn';
import { Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <header className="sticky top-0 z-40 bg-background px-4 py-3 border-b border-border flex flex-row justify-between items-center">
        <Link
          className="rounded-md px-2 py-1 hover:bg-muted transition-colors"
          to="/"
        >
          Lift PR&apos;s
        </Link>
        <SettingsLink />
      </header>

      <Authenticated>
        <Outlet />
      </Authenticated>

      <Unauthenticated>
        <RedirectToSignIn />
      </Unauthenticated>

      <AuthLoading>
        <div className="flex justify-center items-center p-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthLoading>
    </>
  );
}
