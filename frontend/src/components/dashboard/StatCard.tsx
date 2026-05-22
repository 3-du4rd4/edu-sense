import { Card, CardContent } from "@/components/ui/card";
import { DashboardStat } from "@/types/dashboard";

type StatCardProps = DashboardStat;

export function StatCard({ title, value }: StatCardProps) {
  return (
    <Card className="rounded-3xl ring-2 ring-[#45C8FF]">
      <CardContent className="flex items-center gap-3 px-4 py-2">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-base font-semibold text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
}
