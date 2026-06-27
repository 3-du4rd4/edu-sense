import { Flag, PauseCircle, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ActiveSessionActionsProps = {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
};

export function ActiveSessionActions({
  onFinish,
  onPause,
  onResume,
  isPaused,
}: ActiveSessionActionsProps) {
  return (
    <div className="flex items-center gap-3">
      {isPaused ? (
        <Button
          onClick={onResume}
          className="rounded-full bg-[#FDBC28] text-black hover:bg-[#FDBC28] px-4 py-1 text-xs"
        >
          <PlayCircle className="size-4" />
          Retomar
        </Button>
      ) : (
        <Button
          onClick={onPause}
          className="rounded-full bg-[#FDBC28] text-black hover:bg-[#FDBC28] px-4 py-1 text-xs"
        >
          <PauseCircle className="size-4" />
          Pausar
        </Button>
      )}

      <Button
        onClick={onFinish}
        className="rounded-full bg-[#76DF64] text-black hover:bg-[#76DF64] px-4 py-1 text-xs"
      >
        <Flag className="size-4" />
        Finalizar
      </Button>
    </div>
  );
}
