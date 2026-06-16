import { useEffect, useMemo, useState } from "react";

import { SessionSetupData } from "../types";
import { ActiveSessionDock } from "../active/ActiveSessionDock";
import { SessionIllustrationStage } from "../active/SessionIllustrationStage";
import { ActiveSessionTopBar } from "../active/ActiveSessionTop";
import { MonitoringSession } from "@/types/session";
import { RealtimeSimulatorPanel } from "../dev/RealtimeSimulatorPanel";
import { updateSessionTasks } from "@/services/sessionService";
import { useFacialMetricsStore } from "@/stores/facialMetricsStore";

type ActiveSessionViewProps = {
  setupData: SessionSetupData;
  currentSession: MonitoringSession | null;
  onSetupChange: (data: SessionSetupData) => void;
  onFinish: () => void;
  onPause: () => void;
  onResume: () => void;
};

export function ActiveSessionView({
  setupData,
  currentSession,
  onSetupChange,
  onFinish,
  onPause,
  onResume,
}: ActiveSessionViewProps) {
  const latestMetrics = useFacialMetricsStore((state) => state.latestMetrics);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!currentSession?.startTime) return;

    function updateElapsedSeconds() {
      if (!currentSession) return;

      const elapsed = calculateEffectiveElapsedSeconds(currentSession);

      setElapsedSeconds(Math.max(elapsed, 0));
    }

    updateElapsedSeconds();

    if (currentSession.status === "paused") return;

    const interval = setInterval(updateElapsedSeconds, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  const cameraConnected = useMemo(() => {
    if (!setupData.cameraEnabled) return false;
    if (!latestMetrics?.timestamp) return false;

    const latestMetricTime = new Date(latestMetrics.timestamp).getTime();
    const now = Date.now();

    return now - latestMetricTime < 5000;
  }, [setupData.cameraEnabled, latestMetrics?.timestamp]);

  async function toggleTask(taskId: string) {
    if (!currentSession?._id) return;

    const updatedTasks = setupData.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );

    onSetupChange({
      ...setupData,
      tasks: updatedTasks,
    });

    try {
      await updateSessionTasks(currentSession._id, updatedTasks);
    } catch (error) {
      console.error("Failed to update session tasks:", error);

      onSetupChange({
        ...setupData,
        tasks: setupData.tasks,
      });
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      <ActiveSessionTopBar
        cameraConnected={cameraConnected}
        sensorsConnected={setupData.sensorsEnabled}
        elapsedSeconds={elapsedSeconds}
        isPaused={currentSession?.status === "paused"}
        onFinish={onFinish}
        onPause={onPause}
        onResume={onResume}
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

function calculateEffectiveElapsedSeconds(session: MonitoringSession) {
  const startTime = parseBackendDate(session.startTime).getTime();
  const now = Date.now();

  const totalElapsedSeconds = Math.floor((now - startTime) / 1000);
  const pausedSeconds = calculatePausedSeconds(session.pauseIntervals ?? []);

  return Math.max(totalElapsedSeconds - pausedSeconds, 0);
}

function calculatePausedSeconds(
  pauseIntervals: MonitoringSession["pauseIntervals"],
) {
  const now = Date.now();

  return pauseIntervals.reduce((total, interval) => {
    const pausedAt = parseBackendDate(interval.pausedAt).getTime();

    const resumedAt = interval.resumedAt
      ? parseBackendDate(interval.resumedAt).getTime()
      : now;

    const intervalSeconds = Math.floor((resumedAt - pausedAt) / 1000);

    return total + Math.max(intervalSeconds, 0);
  }, 0);
}

function parseBackendDate(date: string) {
  const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(date);

  return new Date(hasTimezone ? date : `${date}Z`);
}
