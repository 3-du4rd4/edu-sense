"use client";

import { Camera, Clock, Radio } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/stores/settingsStore";

export function StudyPreferencesSection() {
  const {
    defaultTimeGoalMinutes,
    cameraEnabledByDefault,
    sensorsEnabledByDefault,
    setDefaultTimeGoalMinutes,
    setCameraEnabledByDefault,
    setSensorsEnabledByDefault,
  } = useSettingsStore();

  function handleTimeGoalChange(value: string) {
    const minutes = Number(value);

    if (!value || minutes <= 0) {
      setDefaultTimeGoalMinutes(0);
      return;
    }

    setDefaultTimeGoalMinutes(minutes);
  }

  return (
    <section className="rounded-3xl border bg-card p-6">
      <h2 className="text-lg font-semibold">Study preferences</h2>
      <p className="text-sm text-muted-foreground">
        Define your default study session configuration.
      </p>

      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between gap-6 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Default time goal</p>
              <p className="text-xs text-muted-foreground">
                Used as the initial time goal when creating a session.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              value={defaultTimeGoalMinutes}
              onChange={(event) => handleTimeGoalChange(event.target.value)}
              className="h-9 w-24 rounded-full text-center"
            />
            <span className="text-sm text-muted-foreground">min</span>
          </div>
        </div>

        <PreferenceSwitch
          icon={Camera}
          title="Enable camera by default"
          description="Start sessions with camera monitoring enabled."
          checked={cameraEnabledByDefault}
          onCheckedChange={setCameraEnabledByDefault}
        />

        <PreferenceSwitch
          icon={Radio}
          title="Enable sensors by default"
          description="Start sessions with environment sensors enabled."
          checked={sensorsEnabledByDefault}
          onCheckedChange={setSensorsEnabledByDefault}
        />
      </div>
    </section>
  );
}

function PreferenceSwitch({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 rounded-2xl border p-4">
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
