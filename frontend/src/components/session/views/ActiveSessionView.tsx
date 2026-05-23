import { Button } from "@/components/ui/button";

type ActiveSessionViewProps = {
  onFinish: () => void;
};

export function ActiveSessionView({ onFinish }: ActiveSessionViewProps) {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="rounded-full bg-pink-300 px-6 py-2 font-semibold">
          00:15:30
        </div>

        <Button onClick={onFinish} className="rounded-full">
          Finish
        </Button>
      </header>

      <section className="mx-auto h-72 max-w-3xl rounded-3xl bg-orange-500" />

      <section className="mx-auto w-fit rounded-full border bg-card px-6 py-3 text-sm">
        Environment and session metrics will appear here.
      </section>
    </div>
  );
}
