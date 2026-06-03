import { StatCard } from "./StatCard";

type MonthStatsCardsProps = {
  monthStats: {
    totalStudyMinutes: number;
    totalSessions: number;
  };
};

export function MonthStatsCards({ monthStats }: MonthStatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2">
      <p className="font-bold text-base col-span-2">This month:</p>
      <StatCard
        title="hours studied"
        value={formatStudyTime(monthStats.totalStudyMinutes)}
      />

      <StatCard
        title="study sessions"
        value={String(monthStats.totalSessions)}
      />
    </div>
  );
}

function formatStudyTime(totalMinutes: number) {
  if (totalMinutes < 60) {
    return "0";
  }

  const hours = Math.floor(totalMinutes / 60);

  return `${hours}`;
}
