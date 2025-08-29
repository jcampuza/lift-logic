import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense } from 'react'
import SettingsPageContent from '../../components/SettingsPageContent'

export const Route = createFileRoute('/_auth/settings')({
  component: Settings,
})

function SettingsPageLoading() {
  return (
    <div className="p-4">
      <div className="animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-24 mb-2"></div>
        <div className="h-10 bg-slate-800 rounded w-32"></div>
      </div>
    </div>
  )
}

function Settings() {
  return (
    <div className="p-0 pb-24 max-w-xl mx-auto">
      <header className="sticky top-0 z-10 bg-background p-4 border-b border-slate-800 flex flex-row items-center gap-3">
        <Link
          to="/"
          className="rounded-md px-2 py-1 hover:bg-slate-800 text-sm"
        >
          ← Home
        </Link>
        <h1 className="text-lg font-semibold">Settings</h1>
      </header>

      <div className="p-4">
        <Suspense fallback={<SettingsPageLoading />}>
          <SettingsPageContent />
        </Suspense>
      </div>
    </div>
  )
}
