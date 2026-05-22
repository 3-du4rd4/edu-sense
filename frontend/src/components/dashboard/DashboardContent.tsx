import { CalendarCard } from "./CalendarCard";
import { GreetingCard } from "./GreetingCard";
import { InsightsCard } from "./InsightsCard";
import { LastStudySessionCard } from "./LastStudySessionCard";
import { MonthStatsCards } from "./MonthStatsCards";
import { StudyChartCard } from "./StudyChartCard";

export function DashboardContent() {
  return (
    <div className="space-y-10">
      <div className="grid gap-16 lg:grid-cols-2 xl:grid-cols-[1.5fr_1fr]">
        <GreetingCard />
        <MonthStatsCards />
      </div>

      <div className="grid gap-16 lg:grid-cols-2 xl:grid-cols-[1.5fr_1fr] items-start">
        <div className="space-y-16">
          <LastStudySessionCard />
          <StudyChartCard />
        </div>
        <div className="space-y-16">
          <CalendarCard />
          <InsightsCard />
        </div>
      </div>
    </div>
  );
}
