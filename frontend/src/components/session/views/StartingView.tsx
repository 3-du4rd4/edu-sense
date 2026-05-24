import { Loader2, LoaderCircle } from "lucide-react";
import { StartingIllustration } from "../starting/StartingIllustration";
import { StartingProgress } from "../starting/StartingProgress";
import { Button } from "@/components/ui/button";

type StartingViewProps = {
  onCancel: () => void;
};

export function StartingView({ onCancel }: StartingViewProps) {
  return (
    <div className="flex min-h-[70vh] flex-col gap-6 items-center justify-center text-center">
      <StartingIllustration />

      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-semibold">Starting session</h1>
          <LoaderCircle className="size-5 animate-spin" />
        </div>

        <p className="max-w-md text-sm text-muted-foreground">
          Take a deep breath, get comfortable, keep some water nearby.
          We&apos;re almost there!
        </p>
      </div>

      <StartingProgress />

      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
