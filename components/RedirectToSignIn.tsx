'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Route } from 'next';

export default function RedirectToSignIn() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const current =
      pathname + (searchParams.size > 0 ? `?${searchParams.toString()}` : '');
    const target = `/signin?redirect=${encodeURIComponent(current)}` as Route;
    if (typeof window !== 'undefined') {
      if (window.location.pathname + window.location.search !== target) {
        router.replace(target);
      }
    }
  }, [router, pathname, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center p-16 gap-3">
      <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      <Link
        href={`/signin?redirect=${encodeURIComponent(
          pathname +
            (searchParams.size > 0 ? `?${searchParams.toString()}` : ''),
        )}`}
        className="text-sm underline underline-offset-4 text-primary hover:text-primary/90"
      >
        Go to sign in
      </Link>
    </div>
  );
}
