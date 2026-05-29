import { useEffect, useState } from "react";

import { SessionSetupData } from "../types";
import { ActiveSessionDock } from "../active/ActiveSessionDock";
import { SessionIllustrationStage } from "../active/SessionIllustrationStage";
import { ActiveSessionTopBar } from "../active/ActiveSessionTop";
import { MonitoringSession } from "@/types/session";
import { RealtimeSimulatorPanel } from "../dev/RealtimeSimulatorPanel";

type ActiveSessionViewProps = {
  setupData: SessionSetupData;
  currentSession: MonitoringSession | null;
  onSetupChange: (data: SessionSetupData) => void;
  onFinish: () => void;
};

export function ActiveSessionView({
  setupData,
  currentSession,
  onSetupChange,
  onFinish,
}: ActiveSessionViewProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!currentSession?.startTime) return;

    function updateElapsedSeconds() {
      const startTime = parseBackendDate(currentSession!.startTime).getTime();
      const now = Date.now();

      const elapsed = Math.floor((now - startTime) / 1000);

      setElapsedSeconds(Math.max(elapsed, 0));
    }

    updateElapsedSeconds();

    const interval = setInterval(updateElapsedSeconds, 1000);

    return () => clearInterval(interval);
  }, [currentSession?.startTime]);

  function toggleTask(taskId: string) {
    onSetupChange({
      ...setupData,
      tasks: setupData.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    });
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      <ActiveSessionTopBar
        cameraConnected={setupData.cameraEnabled}
        sensorsConnected={setupData.sensorsEnabled}
        elapsedSeconds={elapsedSeconds}
        onFinish={onFinish}
      />

      <SessionIllustrationStage />

      <ActiveSessionDock
        tasks={setupData.tasks}
        timeGoalMinutes={setupData.timeGoalMinutes}
        elapsedSeconds={elapsedSeconds}
        onToggleTask={toggleTask}
      />

      {process.env.NEXT_PUBLIC_ENABLE_SIMULATOR === "true" && (
        <RealtimeSimulatorPanel />
      )}
    </div>
  );
}

function parseBackendDate(date: string) {
  const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(date);

  return new Date(hasTimezone ? date : `${date}Z`);
}
