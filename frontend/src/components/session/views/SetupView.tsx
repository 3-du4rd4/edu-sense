import { Button } from "@/components/ui/button";

import { SessionSetupData } from "../types";

type SetupViewProps = {
  setupData: SessionSetupData;
  onSetupChange: (data: SessionSetupData) => void;
  onStart: () => void;
};

export function SetupView({
  setupData,
  onSetupChange,
  onStart,
}: SetupViewProps) {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Ready to start?</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your study session is about to start, but first let&apos;s set some
          things up!
        </p>
      </section>

      <section className="rounded-3xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Session setup</h2>

        <pre className="mt-4 rounded-2xl bg-muted p-4 text-xs">
          {JSON.stringify(setupData, null, 2)}
        </pre>

        <Button onClick={onStart} className="mt-5 rounded-full">
          Start
        </Button>
      </section>
    </div>
  );
}
