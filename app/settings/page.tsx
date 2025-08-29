import { Suspense } from "react";
import SettingsPageContent from "@/app/settings/SettingsPageContent";
import { Metadata } from "next";

const SettingsPageLoading = () => {
  return (
    <div className="p-4">
      <div className="animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-24 mb-2"></div>
        <div className="h-10 bg-slate-800 rounded w-32"></div>
      </div>
    </div>
  );
};

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  return (
    <Suspense fallback={<SettingsPageLoading />}>
      <SettingsPageContent />
    </Suspense>
  );
}
