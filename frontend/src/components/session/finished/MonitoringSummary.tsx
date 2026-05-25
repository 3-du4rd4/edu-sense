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
        <h2 className="text-base font-semibold">Monitoring</h2>

        <p className="text-sm text-muted-foreground font-medium">
          you can verify a media of the environment variables during your
          session
        </p>
      </div>

      <div className="flex items-center gap-4 px-4">
        <div className="flex items-center gap-1">
          <Thermometer className="size-4" />
          <span className="text-sm font-medium">
            {averageTemperature ? `${averageTemperature}°C` : "not available"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Lightbulb className="size-4" />
          <span className="text-sm font-medium">
            {averageLight ? `${averageLight} lux` : "not available"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Volume2 className="size-4" />
          <span className="text-sm font-medium">
            {averageNoise ? `${averageNoise} dB` : "not available"}
          </span>
        </div>
      </div>
    </section>
  );
}
