import { createFileRoute } from '@tanstack/react-router';
import SettingsPageContent from '@/components/SettingsPageContent';

export const Route = createFileRoute('/_protected/settings')({
  component: Settings,
});

function Settings() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <SettingsPageContent />
    </div>
  );
}
