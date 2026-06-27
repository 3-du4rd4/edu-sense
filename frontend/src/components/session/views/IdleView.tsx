"use client";

import { StudyHeroCard } from "../idle/StudyHeroCard";
import { EnvironmentStatusCard } from "../idle/EnvironmentStatusCard";
import { SessionHistoryTable } from "../idle/SessionHistoryTable";
import { Separator } from "@/components/ui/separator";
import { useSessionHistory } from "@/hooks/useSessionHistory";
import { useAuthStore } from "@/stores/authStore";

type IdleViewProps = {
  onGoToSetup: () => void;
};

export function IdleView({ onGoToSetup }: IdleViewProps) {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  const { sessions, isLoading, error } = useSessionHistory({
    userId: userId ?? "",
    limit: 5,
  });

  return (
    <div className="space-y-10">
      <StudyHeroCard onGoToSetup={onGoToSetup} />
      <EnvironmentStatusCard />
      <Separator />
      <SessionHistoryTable
        sessions={sessions}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
