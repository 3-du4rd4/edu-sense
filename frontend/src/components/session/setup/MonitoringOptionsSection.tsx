import { Camera, CircleCheck, RadioTower } from "lucide-react";

import { Switch } from "@/components/ui/switch";

type MonitoringOptionsSectionProps = {
  cameraEnabled: boolean;
  sensorsEnabled: boolean;
  cameraStatus?: string;
  cameraError?: string | null;
  onCameraChange: (value: boolean) => void;
  onSensorsChange: (value: boolean) => void;
};

export function MonitoringOptionsSection({
  cameraEnabled,
  sensorsEnabled,
  cameraStatus,
  cameraError,
  onCameraChange,
  onSensorsChange,
}: MonitoringOptionsSectionProps) {
  return (
    <section className="flex flex-col gap-4 items-start px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Monitoramento</h2>
        <p className="text-sm text-muted-foreground font-medium">
          habilite se deseja que a sessão utilize as ferramentas para melhorar o
          acompanhamento do estudo
        </p>
      </div>

      <div className="px-4 space-y-4">
        <MonitoringOption
          title="Habilitar monitoramento por webcam"
          description="Use a webcam para estimar indicadores de foco e fadiga."
          checked={cameraEnabled}
          onCheckedChange={onCameraChange}
          readyMessages={["webcam pronta"]}
          cameraStatus={cameraStatus}
          cameraError={cameraError}
        />

        <MonitoringOption
          title="Habilitar monitoramento por sensores ambientais"
          description="Use sensores IoT para monitorar luz, ruído e temperatura."
          checked={sensorsEnabled}
          onCheckedChange={onSensorsChange}
          readyMessages={[
            "Sensor de temperatura conectado",
            "Sensor de luz conectado",
            "Sensor de ruído conectado",
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
  cameraStatus?: string;
  cameraError?: string | null;
};

function MonitoringOption({
  title,
  description,
  checked,
  onCheckedChange,
  readyMessages,
  cameraStatus,
  cameraError,
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

      {cameraStatus === "denied" && (
        <p className="text-xs text-red-500">Permissão da câmera foi negada.</p>
      )}

      {cameraStatus === "unavailable" && (
        <p className="text-xs text-red-500">
          Nenhum dispositivo de câmera foi encontrado.
        </p>
      )}

      {cameraError && cameraStatus === "error" && (
        <p className="text-xs text-red-500">{cameraError}</p>
      )}
    </div>
  );
}
