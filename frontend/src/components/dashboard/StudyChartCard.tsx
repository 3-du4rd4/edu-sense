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

import { studyChartData } from "@/mocks/dashboard";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StudyChartCard() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle>Study performance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Hours studied during the last 7 days
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={studyChartData}>
              <defs>
                <linearGradient id="studyHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(value) => `${value}h`}
              />

              <Tooltip
                formatter={(value) => [`${value}h`, "Studied"]}
                labelFormatter={(label) => `${label}`}
              />

              <Area
                type="monotone"
                dataKey="hours"
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
        </div>
      </CardContent>
    </Card>
  );
}
