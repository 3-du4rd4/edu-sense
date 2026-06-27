import { Goal } from "lucide-react";

type DurationSectionProps = {
  durationMinutes: number;
  timeGoalMinutes: number | null;
};

export function DurationSection({
  durationMinutes,
  timeGoalMinutes,
}: DurationSectionProps) {
  return (
    <section className="px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Duração</h2>

        <p className="text-sm text-muted-foreground font-medium">
          sua sessão durou {formatTime(durationMinutes)}
        </p>

        {timeGoalMinutes && (
          <div className="flex items-center gap-2 rounded-full bg-[#76DF64] px-4 py-2 text-xs font-medium">
            <Goal className="size-4" />
            <span>{formatTime(timeGoalMinutes)}</span>
          </div>
        )}
      </div>
    </section>
  );
}

function formatTime(minutes: number) {
  if (minutes < 60) {
    return `${minutes} minutos`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}min`;
}
