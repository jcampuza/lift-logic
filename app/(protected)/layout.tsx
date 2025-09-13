import { SettingsLink } from '@/components/SettingsLink';
import Link from 'next/link';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-40 bg-background px-4 py-3 border-b border-border flex flex-row justify-between items-center">
        <Link
          className="rounded-md px-2 py-1 hover:bg-muted transition-colors"
          href="/"
        >
          Lift PR&apos;s
        </Link>
        <SettingsLink />
      </header>

      {children}
    </>
  );
}
