import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Lightbulb, Volume2, Flame } from "lucide-react";

const metrics = [
  {
    label: "Temperature avg.",
    value: "28.4°C",
    icon: Thermometer,
  },
  {
    label: "Light avg.",
    value: "430 lx",
    icon: Lightbulb,
  },
  {
    label: "Noise avg.",
    value: "52 dB",
    icon: Volume2,
  },
];

export function LastStudySessionCard() {
  return (
    <Card className="rounded-3xl ring-2 ring-[#F896A8]">
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle className="inline-block rounded-full bg-[#F896A8]/80 px-3 py-1 text-base font-semibold">
          Last study session
        </CardTitle>

        <Badge className="rounded-full bg-[#F896A8]/80">
          <Flame />
          +42 pts
        </Badge>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 items-start">
          <div className="text-sm font-medium">
            <p>2 hours and 27 minutes long</p>
            <p className="mt-1">average focus of 80%</p>
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
