import { Camera, CircleCheck, RadioTower } from "lucide-react";

import { Switch } from "@/components/ui/switch";

type MonitoringOptionsSectionProps = {
  cameraEnabled: boolean;
  sensorsEnabled: boolean;
  onCameraChange: (value: boolean) => void;
  onSensorsChange: (value: boolean) => void;
};

export function MonitoringOptionsSection({
  cameraEnabled,
  sensorsEnabled,
  onCameraChange,
  onSensorsChange,
}: MonitoringOptionsSectionProps) {
  return (
    <section className="flex flex-col gap-4 items-start px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Monitoring</h2>
        <p className="text-sm text-muted-foreground font-medium">
          enable wheter you want the session to use the tools to improve study
          follow-up
        </p>
      </div>

      <div className="px-4 space-y-4">
        <MonitoringOption
          title="Enable webcam face monitoring"
          description="Use webcam to estimate focus and fatigue indicators."
          checked={cameraEnabled}
          onCheckedChange={onCameraChange}
          readyMessages={["webcam ready"]}
        />

        <MonitoringOption
          title="Enable environmental sensors monitoring"
          description="Use IoT sensors to monitor light, noise and temperature."
          checked={sensorsEnabled}
          onCheckedChange={onSensorsChange}
          readyMessages={[
            "Temperature sensor connected",
            "Light sensor connected",
            "Noise sensor connected",
          ]}
        />
      </div>
    </section>
  );
}

type MonitoringOptionProps = {
  title: string;
  description: string;
  checked: boolean;
  readyMessages?: string[];
  onCheckedChange: (value: boolean) => void;
};

function MonitoringOption({
  title,
  description,
  checked,
  onCheckedChange,
  readyMessages,
}: MonitoringOptionProps) {
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />

      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {checked && readyMessages && (
        <div className="flex flex-col gap-1">
          {readyMessages.map((message, index) => (
            <div className="flex items-center gap-2" key={index}>
              <span className="text-xs text-muted-foreground">{message}</span>
              <CircleCheck className="size-3 text-[#76DF64]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
