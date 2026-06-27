import { Lightbulb, Thermometer, Volume2 } from "lucide-react";

type MonitoringSummaryProps = {
  averageTemperature: number | null;
  averageLight: number | null;
  averageNoise: number | null;
};

export function MonitoringSummary({
  averageTemperature,
  averageLight,
  averageNoise,
}: MonitoringSummaryProps) {
  return (
    <section className="flex flex-col gap-4 items-start px-6 py-2">
      <div className="flex items-center gap-6 flex-wrap">
        <h2 className="text-base font-semibold">Monitoramento</h2>

        <p className="text-sm text-muted-foreground font-medium">
          você pode verificar a média das variáveis do ambiente durante sua
          sessão
        </p>
      </div>

      <div className="flex items-center gap-4 px-4">
        <div className="flex items-center gap-1">
          <Thermometer className="size-4" />
          <span className="text-sm font-medium">
            {formatMetric(averageTemperature, "°C")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Lightbulb className="size-4" />
          <span className="text-sm font-medium">
            {formatMetric(averageLight, " lux")}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Volume2 className="size-4" />
          <span className="text-sm font-medium">
            {formatMetric(averageNoise, " dB")}
          </span>
        </div>
      </div>
    </section>
  );
}

function formatMetric(value: number | null, suffix: string) {
  if (value === null) return "não disponível";
  return `${value} ${suffix}`;
}
