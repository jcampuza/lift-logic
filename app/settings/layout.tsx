import Link from "next/link";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-0 pb-24 max-w-xl mx-auto">
      <header className="sticky top-0 z-10 bg-background p-4 border-b border-slate-800 flex flex-row items-center gap-3">
        <Link
          href="/"
          className="rounded-md px-2 py-1 hover:bg-slate-800 text-sm"
        >
          ← Home
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <div className="p-4">{children}</div>
    </div>
  );
}
