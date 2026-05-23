import { StudyHeroCard } from "../idle/StudyHeroCard";
import { EnvironmentStatusCard } from "../idle/EnvironmentStatusCard";
import { SessionHistoryTable } from "../idle/SessionHistoryTable";
import { Separator } from "@/components/ui/separator";

type IdleViewProps = {
  onGoToSetup: () => void;
};

export function IdleView({ onGoToSetup }: IdleViewProps) {
  return (
    <div className="space-y-10">
      <StudyHeroCard onGoToSetup={onGoToSetup} />
      <EnvironmentStatusCard />
      <Separator />
      <SessionHistoryTable />
    </div>
  );
}
