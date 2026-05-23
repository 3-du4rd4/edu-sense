import { Loader2 } from "lucide-react";

export function StartingView() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-8 size-44 rounded-3xl bg-orange-500" />

      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Starting session</h1>
        <Loader2 className="size-5 animate-spin" />
      </div>

      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Take a deep breath, get comfortable, keep some water nearby. We&apos;re
        almost there!
      </p>
    </div>
  );
}
