import { Radio, Webcam } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <StatusIcon
        icon={Webcam}
        connected={cameraConnected}
        label="Webcam"
        description={
          cameraConnected
            ? "Webcam is active and working."
            : "Webcam is not active or permission was denied."
        }
      />

      <StatusIcon
        icon={Radio}
        connected={sensorsConnected}
        label="Sensors"
        description="Sensors are connected"
      />
    </div>
  );
}

type StatusIconProps = {
  icon: React.ElementType;
  connected: boolean;
  label: string;
  description?: string;
};

function StatusIcon({
  icon: Icon,
  connected,
  label,
  description,
}: StatusIconProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex cursor-default items-center gap-1">
          <Icon className="size-5 text-muted-foreground" />

          <span
            className={`size-1.5 rounded-full ${
              connected ? "bg-[#76DF64]" : "bg-[#FD6D3E]"
            }`}
            aria-label={`${label} ${connected ? "connected" : "disconnected"}`}
          />
        </div>
      </TooltipTrigger>

      <TooltipContent>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
