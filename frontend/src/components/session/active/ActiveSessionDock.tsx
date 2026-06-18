"use client";

import { Focus, Goal, Lightbulb, Thermometer, Volume2 } from "lucide-react";

import { useEnvironmentStore } from "@/stores/environmentStore";
import { useFacialMetricsStore } from "@/stores/facialMetricsStore";

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
  const latestFacialMetrics = useFacialMetricsStore(
    (state) => state.latestMetrics,
  );

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

  const focus = getFocusStatus(latestFacialMetrics);

  return (
    <footer className="md:absolute fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full bg-[#F5F5F5] px-5 py-2 shadow-sm">
        <MetricTooltipItem
          icon={Focus}
          label="Focus"
          value={focus.tooltip}
          active={focus.active}
          tooltipContent={
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium">Focus</p>
                <p className="text-xs text-muted-foreground">{focus.tooltip}</p>
              </div>

              {latestFacialMetrics && (
                <div className="space-y-1 text-xs">
                  <TooltipRow
                    label="EAR"
                    value={latestFacialMetrics.ear.toFixed(2)}
                  />
                  <TooltipRow
                    label="MAR"
                    value={latestFacialMetrics.mar.toFixed(2)}
                  />
                  <TooltipRow
                    label="Eyes closed"
                    value={latestFacialMetrics.eyesClosed ? "Yes" : "No"}
                  />
                  <TooltipRow
                    label="Yawning"
                    value={latestFacialMetrics.yawning ? "Yes" : "No"}
                  />
                </div>
              )}

              {latestFacialMetrics?.prediction && (
                <div className="space-y-1 border-t pt-2 text-xs">
                  <TooltipRow
                    label="Focus score"
                    value={`${latestFacialMetrics.prediction.focusScore ?? "-"}%`}
                  />

                  <TooltipRow
                    label="Fatigue risk"
                    value={
                      latestFacialMetrics.prediction.fatigueProbability != null
                        ? `${Math.round(
                            latestFacialMetrics.prediction.fatigueProbability *
                              100,
                          )}%`
                        : "-"
                    }
                  />

                  <TooltipRow
                    label="Fatigue detected"
                    value={
                      latestFacialMetrics.prediction.fatigueDetected
                        ? "Yes"
                        : "No"
                    }
                  />
                </div>
              )}
            </div>
          }
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

function getFocusStatus(
  metrics: { eyesClosed: boolean; yawning: boolean } | null,
) {
  if (!metrics) {
    return {
      active: false,
      tooltip: "No facial metrics yet",
    };
  }

  if (metrics.eyesClosed || metrics.yawning) {
    return {
      active: false,
      tooltip: "Possible fatigue detected",
    };
  }

  return {
    active: true,
    tooltip: "Good focus",
  };
}

function TooltipRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
