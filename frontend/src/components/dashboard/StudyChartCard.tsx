"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DashboardData } from "@/types/dashboard";
import { formatStudyMinutes } from "@/lib/format-duration";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StudyChartCardProps = {
  chart: DashboardData["chart"];
};

export function StudyChartCard({ chart }: StudyChartCardProps) {
  const data = chart.dailyStudyMinutes.map((item) => ({
    date: formatChartDate(item.date),
    minutes: item.minutes,
  }));

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Desempenho de estudo</CardTitle>
        <p className="text-sm text-muted-foreground">
          Tempo estudado durante este mês
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-72">
          {data.length === 0 ? (
            <ChartEmptyState />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="studyHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tickFormatter={(value) => formatStudyMinutes(value)}
                />

                <Tooltip
                  formatter={(value) => [
                    formatStudyMinutes(Number(value)),
                    "Studied",
                  ]}
                  labelFormatter={(label) => `${label}`}
                />

                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#studyHours)"
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatChartDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${date}T00:00:00`));
}

function ChartEmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center border rounded-3xl ring-2 ring-foreground/10 p-3 !pt-0">
      <img
        src="/illustrations/edusense-no-data.svg"
        alt="No data"
        className="min-h-0 flex-1 w-full object-contain"
      />

      <div>
        <p className="text-sm font-medium">Nenhum dado de estudo ainda</p>
        <p className="text-xs text-muted-foreground">
          Comece uma sessão para ver seu progresso aqui.
        </p>
      </div>
    </div>
  );
}
