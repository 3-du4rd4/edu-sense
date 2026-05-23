import { Button } from "@/components/ui/button";

type FinishedSessionViewProps = {
  onContinue: () => void;
};

export function FinishedSessionView({ onContinue }: FinishedSessionViewProps) {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Well done!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your study session was finished successfully. Here is a resume of what
          you did.
        </p>
      </section>

      <section className="rounded-3xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Session summary</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Summary information will appear here.
        </p>

        <Button onClick={onContinue} className="mt-5 rounded-full">
          Continue
        </Button>
      </section>
    </div>
  );
}
