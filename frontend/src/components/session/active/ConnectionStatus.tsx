import { Radio, Webcam } from "lucide-react";

type ConnectionStatusProps = {
  cameraConnected: boolean;
  sensorsConnected: boolean;
};

export function ConnectionStatus({
  cameraConnected,
  sensorsConnected,
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-4">
      <StatusIcon icon={Webcam} connected={cameraConnected} label="Webcam" />

      <StatusIcon icon={Radio} connected={sensorsConnected} label="Sensors" />
    </div>
  );
}

type StatusIconProps = {
  icon: React.ElementType;
  connected: boolean;
  label: string;
};

function StatusIcon({ icon: Icon, connected, label }: StatusIconProps) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="size-5 text-muted-foreground" />

      <span
        className={`size-1.5 rounded-full ${
          connected ? "bg-[#76DF64]" : "bg-[#FD6D3E]"
        }`}
        aria-label={`${label} ${connected ? "connected" : "disconnected"}`}
      />
    </div>
  );
}
