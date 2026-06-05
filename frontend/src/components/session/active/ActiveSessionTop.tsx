import { ActiveSessionActions } from "./ActiveSessionActions";
import { ConnectionStatus } from "./ConnectionStatus";
import { SessionTimerBadge } from "./SessionTimerBadge";

type ActiveSessionTopBarProps = {
  cameraConnected: boolean;
  sensorsConnected: boolean;
  elapsedSeconds: number;
  isPaused: boolean;
  onFinish: () => void;
  onPause: () => void;
  onResume: () => void;
};

export function ActiveSessionTopBar({
  cameraConnected,
  sensorsConnected,
  elapsedSeconds,
  onFinish,
  onPause,
  onResume,
  isPaused,
}: ActiveSessionTopBarProps) {
  return (
    <header className="grid grid-cols-3 items-center">
      <div className="justify-self-start">
        <ConnectionStatus
          cameraConnected={cameraConnected}
          sensorsConnected={sensorsConnected}
        />
      </div>

      <div className="justify-self-center">
        <SessionTimerBadge elapsedSeconds={elapsedSeconds} />
      </div>

      <div className="justify-self-end">
        <ActiveSessionActions
          onFinish={onFinish}
          onPause={onPause}
          onResume={onResume}
          isPaused={isPaused}
        />
      </div>
    </header>
  );
}
