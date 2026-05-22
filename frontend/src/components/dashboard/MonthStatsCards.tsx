import { StatCard } from "./StatCard";

export function MonthStatsCards() {
  return (
    <div className="grid gap-4 grid-cols-2">
      <p className="font-bold text-base col-span-2">This month:</p>
      <StatCard title="hours studied" value="12" />
      <StatCard title="completed sessions" value="3" />
    </div>
  );
}
