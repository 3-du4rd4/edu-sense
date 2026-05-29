import { Goal, Lightbulb, Thermometer, Volume2 } from "lucide-react";
import { SessionResultData } from "../types";

type SessionSummaryMetricsProps = {
  resultData: SessionResultData;
};

export function SessionSummaryMetrics({
  resultData,
}: SessionSummaryMetricsProps) {
  return (
    <section className="space-y-6">
      <SummaryRow
        title="Duration"
        description={`your session was ${formatTimeGoal(resultData.durationMinutes)} long`}
        icon={Goal}
      />

      <SummaryRow
        title="Focus"
        description="during the session overall your focus was"
        value={
          resultData.focusAverage !== null
            ? `${resultData.focusAverage}%`
            : "Not available"
        }
        valueClassName="text-green-500"
      />

      <div className="flex flex-wrap items-center gap-6">
        <div>
          <h2 className="text-base font-semibold">Monitoring</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          you can verify a media of the environment variables during your
          session
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-5 pl-6">
        <Metric
          icon={Thermometer}
          value={
            resultData.temperatureAverage !== null
              ? `${resultData.temperatureAverage}°C`
              : "Not available"
          }
        />

        <Metric
          icon={Lightbulb}
          value={
            resultData.lightAverage !== null
              ? `${resultData.lightAverage} lux`
              : "Not available"
          }
        />

        <Metric
          icon={Volume2}
          value={
            resultData.noiseAverage !== null
              ? `${resultData.noiseAverage} dB`
              : "Not available"
          }
        />
      </div>
    </section>
  );
}

type SummaryRowProps = {
  title: string;
  description: string;
  value?: string;
  valueClassName?: string;
  badge?: string;
  icon?: React.ElementType;
};

function SummaryRow({
  title,
  description,
  value,
  valueClassName,
  badge,
  icon: Icon,
}: SummaryRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <h2 className="text-base font-semibold">{title}</h2>

      <p className="text-sm text-muted-foreground">{description}</p>

      {value && (
        <span className={`text-sm font-semibold ${valueClassName}`}>
          {value}
        </span>
      )}

      {badge && Icon && (
        <div className="flex items-center gap-2 rounded-full bg-[#76DF64] px-5 py-2 text-sm font-semibold">
          <Icon className="size-4" />
          {badge}
        </div>
      )}
    </div>
  );
}

function Metric({
  icon: Icon,
  value,
}: {
  icon: React.ElementType;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <Icon className="size-5" />
      {value}
    </div>
  );
}

function formatTimeGoal(minutes: number) {
  if (minutes < 60) return `${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours} hours`;

  return `${hours}h ${remainingMinutes}min`;
}
