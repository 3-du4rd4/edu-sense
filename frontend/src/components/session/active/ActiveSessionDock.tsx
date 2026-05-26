"use client";

import { Focus, Goal, Lightbulb, Thermometer, Volume2 } from "lucide-react";

import { useEnvironmentStore } from "@/stores/environmentStore";

import { SetupTask } from "../types";
import { MetricTooltipItem } from "./MetricTooltipItem";
import { TasksPopover } from "./TasksPopover";

type ActiveSessionDockProps = {
  tasks: SetupTask[];
  timeGoalMinutes: number | null;
  elapsedSeconds: number;
  onToggleTask: (taskId: string) => void;
};

export function ActiveSessionDock({
  tasks,
  timeGoalMinutes,
  elapsedSeconds,
  onToggleTask,
}: ActiveSessionDockProps) {
  const latestReading = useEnvironmentStore((state) => state.latestReading);

  const temperature =
    latestReading?.temperature !== undefined
      ? `${latestReading.temperature}°C`
      : "No reading yet";

  const light =
    latestReading?.light !== undefined
      ? `${latestReading.light}`
      : "No reading yet";

  const noise =
    latestReading?.noise !== undefined
      ? `${latestReading.noise}`
      : "No reading yet";

  return (
    <footer className="md:absolute fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full bg-[#F5F5F5] px-5 py-2 shadow-sm">
        <MetricTooltipItem
          icon={Focus}
          label="Focus"
          value="Good focus"
          active
        />

        <div className="h-5 w-px bg-border" />

        <MetricTooltipItem
          icon={Thermometer}
          label="Temperature"
          value={temperature}
        />

        <MetricTooltipItem icon={Lightbulb} label="Light" value={light} />

        <MetricTooltipItem icon={Volume2} label="Noise" value={noise} />

        <div className="h-5 w-px bg-border" />

        <MetricTooltipItem
          icon={Goal}
          label="Time goal"
          span={
            timeGoalMinutes
              ? getRemainingGoalText(timeGoalMinutes, elapsedSeconds)
              : undefined
          }
          active={
            !!timeGoalMinutes &&
            Math.floor(elapsedSeconds / 60) >= timeGoalMinutes
          }
          value={
            timeGoalMinutes ? formatMinutes(timeGoalMinutes) : "No time goal"
          }
        />

        <div className="h-5 w-px bg-border" />

        <TasksPopover tasks={tasks} onToggleTask={onToggleTask} />
      </div>
    </footer>
  );
}

function getRemainingGoalText(goalMinutes: number, elapsedSeconds: number) {
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  const remainingMinutes = goalMinutes - elapsedMinutes;

  if (remainingMinutes <= 0) {
    return `${formatMinutes(goalMinutes)} achieved`;
  }

  return `${formatMinutes(remainingMinutes)} left`;
}

function formatMinutes(totalMinutes: number) {
  if (totalMinutes < 60) {
    return `${totalMinutes} mins`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes} mins`;
}
