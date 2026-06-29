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
            ? "Webcam está ativa e funcionando."
            : "Webcam não está ativa ou permissão foi negada."
        }
      />

      <StatusIcon
        icon={Radio}
        connected={sensorsConnected}
        label="Sensores"
        description={
          sensorsConnected
            ? "Sensores estão conectados e funcionando."
            : "Sensores não estão conectados ou não estão funcionando."
        }
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
            aria-label={`${label} ${connected ? "conectado" : "desconectado"}`}
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
