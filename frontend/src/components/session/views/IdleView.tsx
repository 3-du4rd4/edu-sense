import { Button } from "@/components/ui/button";

type IdleViewProps = {
  onGoToSetup: () => void;
};

export function IdleView({ onGoToSetup }: IdleViewProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-orange-100 p-8">
        <h1 className="text-3xl font-bold">Study time</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Small steps lead to big achievements.
        </p>

        <Button onClick={onGoToSetup} className="mt-5 rounded-full">
          Start study session
        </Button>
      </section>

      <section className="rounded-3xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Environment status</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Before you start, let&apos;s check how the environment is doing.
        </p>
      </section>

      <section className="rounded-3xl border bg-card p-6">
        <h2 className="text-xl font-semibold">Session historic</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your recent study sessions will appear here.
        </p>
      </section>
    </div>
  );
}
