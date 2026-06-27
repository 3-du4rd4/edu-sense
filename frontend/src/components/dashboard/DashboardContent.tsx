"use client";

import { useAuthStore } from "@/stores/authStore";
import { useDashboard } from "@/hooks/useDashboard";
import { CalendarCard } from "./CalendarCard";
import { GreetingCard } from "./GreetingCard";
import { InsightsCard } from "./InsightsCard";
import { LastStudySessionCard } from "./LastStudySessionCard";
import { MonthStatsCards } from "./MonthStatsCards";
import { StudyChartCard } from "./StudyChartCard";

export function DashboardContent() {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  const { data, isLoading, error } = useDashboard(userId);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">
        Carregando dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-sm text-red-500">
        {error ?? "Dados do dashboard não disponíveis"}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-16 lg:grid-cols-2 xl:grid-cols-[1.5fr_1fr]">
        <GreetingCard />
        <MonthStatsCards monthStats={data.monthStats} />
      </div>

      <div className="grid gap-16 lg:grid-cols-2 xl:grid-cols-[1.5fr_1fr] items-start">
        <div className="space-y-16">
          <LastStudySessionCard lastSession={data.lastSession} />
          <StudyChartCard chart={data.chart} />
        </div>
        <div className="space-y-16">
          <CalendarCard />
          <InsightsCard
            insights={data.insights}
            tips={data.tips}
            score={data.score}
          />
        </div>
      </div>
    </div>
  );
}
