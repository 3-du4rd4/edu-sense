"use client";

import { StudyHeroCard } from "../idle/StudyHeroCard";
import { EnvironmentStatusCard } from "../idle/EnvironmentStatusCard";
import { SessionHistoryTable } from "../idle/SessionHistoryTable";
import { Separator } from "@/components/ui/separator";
import { useSessionHistory } from "@/hooks/useSessionHistory";

const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID ?? "user_test_1";

type IdleViewProps = {
  onGoToSetup: () => void;
};

export function IdleView({ onGoToSetup }: IdleViewProps) {
  const { sessions, isLoading, error } = useSessionHistory({
    userId: TEST_USER_ID,
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
