import { Flame, Lightbulb, Thermometer, Volume2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DashboardData } from "@/types/dashboard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LastStudySessionCardProps = {
  lastSession: DashboardData["lastSession"];
};

export function LastStudySessionCard({
  lastSession,
}: LastStudySessionCardProps) {
  if (!lastSession) {
    return (
      <Card className="rounded-3xl ring-2 ring-[#F896A8]">
        <CardHeader className="flex flex-row items-start justify-between">
          <CardTitle className="inline-block rounded-full bg-[#F896A8]/80 px-3 py-1 text-base font-semibold">
            Last study session
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="p-4 text-sm text-muted-foreground">
            No study session completed yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    {
      label: "Temperature avg.",
      value: formatNullableMetric(lastSession.temperatureAverage, "°C"),
      icon: Thermometer,
    },
    {
      label: "Light avg.",
      value: formatNullableMetric(lastSession.lightAverage, "lx"),
      icon: Lightbulb,
    },
    {
      label: "Noise avg.",
      value: formatNullableMetric(lastSession.noiseAverage, "dB"),
      icon: Volume2,
    },
  ];

  return (
    <Card className="rounded-3xl ring-2 ring-[#F896A8]">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="inline-block rounded-full bg-[#F896A8]/80 px-3 py-1 text-base font-semibold">
          Last study session
        </CardTitle>

        <Badge className="rounded-full bg-[#F896A8]/80">
          <Flame />+{lastSession.pointsEarned} pts
        </Badge>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 items-start">
          <div className="text-sm font-medium">
            <p>{formatDuration(lastSession.durationSeconds)}</p>
            {lastSession.focusAverage && (
              <p className="mt-1">
                average focus of {lastSession.focusAverage}%
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex items-center gap-1">
                <metric.icon className="size-6 text-muted-foreground" />

                <p className="font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDuration(durationSeconds: number) {
  const minutes = Math.round(durationSeconds / 60);

  if (minutes < 60) return `${minutes}m long`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours}h long`;

  return `${hours}h ${remainingMinutes}m long`;
}

function formatNullableMetric(value: number | null, suffix: string) {
  if (value === null || value === undefined) return "N/A";

  return `${value}${suffix}`;
}
