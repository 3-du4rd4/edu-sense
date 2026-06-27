import { AccountSection } from "@/components/settings/AccountSection";
import { ApplicationSection } from "@/components/settings/ApplicationSection";
import { StudyPreferencesSection } from "@/components/settings/StudyPreferenceSection";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie sua conta e preferências de estudo.
        </p>
      </div>

      <AccountSection />
      <StudyPreferencesSection />
      <ApplicationSection />
    </div>
  );
}
