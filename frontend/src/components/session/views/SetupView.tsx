import { Button } from "@/components/ui/button";

import { MonitoringOptionsSection } from "../setup/MonitoringOptionsSection";
import { SetupHeader } from "../setup/SetupHeader";
import { StartSessionIllustration } from "../setup/StartSessionIllustration";
import { StudyModeSection } from "../setup/StudyModeSection";
import { TaskSetupSection } from "../setup/TaskSetupSection";
import { TimeGoalSection } from "../setup/TimeGoalSection";
import { SessionSetupData, StudyMode } from "../types";
import Image from "next/image";

type SetupViewProps = {
  setupData: SessionSetupData;
  onSetupChange: (data: SessionSetupData) => void;
  onStart: () => void;
  onCancel: () => void;
};

export function SetupView({
  setupData,
  onSetupChange,
  onStart,
  onCancel,
}: SetupViewProps) {
  function updateStudyMode(studyMode: StudyMode) {
    onSetupChange({
      ...setupData,
      studyMode,
    });
  }

  function updateCameraEnabled(cameraEnabled: boolean) {
    onSetupChange({
      ...setupData,
      cameraEnabled,
    });
  }

  function updateSensorsEnabled(sensorsEnabled: boolean) {
    onSetupChange({
      ...setupData,
      sensorsEnabled,
    });
  }

  function addTask(title: string) {
    onSetupChange({
      ...setupData,
      tasks: [
        ...setupData.tasks,
        {
          id: crypto.randomUUID(),
          title,
          completed: false,
        },
      ],
    });
  }

  function removeTask(taskId: string) {
    onSetupChange({
      ...setupData,
      tasks: setupData.tasks.filter((task) => task.id !== taskId),
    });
  }

  function editTask(taskId: string, title: string) {
    onSetupChange({
      ...setupData,
      tasks: setupData.tasks.map((task) =>
        task.id === taskId ? { ...task, title } : task,
      ),
    });
  }

  function updateTimeGoal(timeGoalMinutes: number | null) {
    onSetupChange({
      ...setupData,
      timeGoalMinutes,
    });
  }

  return (
    <div className="space-y-6">
      <SetupHeader />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <TaskSetupSection
            tasks={setupData.tasks}
            onAddTask={addTask}
            onRemoveTask={removeTask}
            onEditTask={editTask}
          />
          <TimeGoalSection
            timeGoalMinutes={setupData.timeGoalMinutes}
            onChange={updateTimeGoal}
          />
          <StudyModeSection
            value={setupData.studyMode}
            onChange={updateStudyMode}
          />
          <MonitoringOptionsSection
            cameraEnabled={setupData.cameraEnabled}
            sensorsEnabled={setupData.sensorsEnabled}
            onCameraChange={updateCameraEnabled}
            onSensorsChange={updateSensorsEnabled}
          />
        </div>

        <div className="flex flex-col items-end justify-between gap-12">
          <StartSessionIllustration />

          <div className="flex flex-col items-end">
            <Image
              src="/illustrations/study-idle-illustration.svg"
              alt="Session setup illustration"
              width={40}
              height={40}
              className="mr-9"
            />
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                className="rounded-full"
              >
                Cancel
              </Button>

              <Button
                onClick={onStart}
                className="rounded-full bg-[#FD6D3E] text-foreground font-semibold px-4"
              >
                Start session
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
