import { dashboardStats } from "@/mocks/dashboard";

import { StatCard } from "./StatCard";

export function MonthStatsCards() {
  return (
    <div className="grid gap-4 grid-cols-2">
      <p className="font-bold text-base col-span-2">This month:</p>
      {dashboardStats.map((stat) => (
        <StatCard key={stat.title} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
}
