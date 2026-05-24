import { useEffect, useState } from "react";

import { SessionSetupData } from "../types";
import { ActiveSessionDock } from "../active/ActiveSessionDock";
import { SessionIllustrationStage } from "../active/SessionIllustrationStage";
import { ActiveSessionTopBar } from "../active/ActiveSessionTop";

type ActiveSessionViewProps = {
  setupData: SessionSetupData;
  onSetupChange: (data: SessionSetupData) => void;
  onFinish: () => void;
};

export function ActiveSessionView({
  setupData,
  onSetupChange,
  onFinish,
}: ActiveSessionViewProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function toggleTask(taskId: string) {
    onSetupChange({
      ...setupData,
      tasks: setupData.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    });
  }

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6 pb-24">
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
    </div>
  );
}
