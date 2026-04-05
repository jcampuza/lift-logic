import { useEffect } from 'react';
import { useNavigate, Link, useLocation } from '@tanstack/react-router';

export default function RedirectToSignIn() {
  const navigate = useNavigate();
  const { pathname, searchStr } = useLocation();

  useEffect(() => {
    const current = pathname + (searchStr ? `?${searchStr}` : '');
    const target = `/signin?redirect=${encodeURIComponent(current)}`;
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== target) {
        navigate({ to: target, replace: true });
      }
    }
  }, [navigate, pathname, searchStr]);

  const target = `/signin?redirect=${encodeURIComponent(
    pathname + (searchStr ? `?${searchStr}` : ''),
  )}`;

  return (
    <div className="flex flex-col items-center justify-center p-16 gap-3">
      <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      <Link
        to={target}
        className="text-sm underline underline-offset-4 text-primary hover:text-primary/90"
      >
        Go to sign in
      </Link>
    </div>
  );
}
