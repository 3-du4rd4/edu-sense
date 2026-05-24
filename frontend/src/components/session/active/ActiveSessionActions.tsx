import { Flag, PauseCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ActiveSessionActionsProps = {
  onFinish: () => void;
};

export function ActiveSessionActions({ onFinish }: ActiveSessionActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        disabled
        className="rounded-full bg-[#FDBC28] text-black hover:bg-[#FDBC28] px-4 py-1 text-xs"
      >
        <PauseCircle className="size-4" />
        Pause
      </Button>

      <Button
        onClick={onFinish}
        className="rounded-full bg-[#76DF64] text-black hover:bg-[#76DF64] px-4 py-1 text-xs"
      >
        <Flag className="size-4" />
        Finish
      </Button>
    </div>
  );
}
