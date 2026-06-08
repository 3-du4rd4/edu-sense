"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { SessionStateRenderer } from "./SessionStateRenderer";
import { SessionResultData, SessionSetupData, SessionUIState } from "./types";
import { useSession } from "@/hooks/useSession";
import { MonitoringSession } from "@/types/session";
import { getLatestFacialMetric } from "@/services/facialMetricsService";
import { getLatestEnvironmentReading } from "@/services/environmentService";

import { useAuthStore } from "@/stores/authStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useEnvironmentStore } from "@/stores/environmentStore";
import { useFacialMetricsStore } from "@/stores/facialMetricsStore";

const initialSetupData: SessionSetupData = {
  tasks: [],
  timeGoalMinutes: null,
  studyMode: "normal",
  cameraEnabled: false,
  sensorsEnabled: false,
};

const MIN_STARTING_DURATION_MS = 4000;

export function SessionPageContent() {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  const {
    defaultTimeGoalMinutes,
    cameraEnabledByDefault,
    sensorsEnabledByDefault,
  } = useSettingsStore();

  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode");

  const {
    activeSession,
    loadActiveSession,
    startSession,
    finishSession,
    pauseSession,
    resumeSession,
  } = useSession();

  const setLatestReading = useEnvironmentStore(
    (state) => state.setLatestReading,
  );

  const setLatestMetrics = useFacialMetricsStore(
    (state) => state.setLatestMetrics,
  );

  const [isRecoveringSession, setIsRecoveringSession] = useState(true);

  const [state, setState] = useState<SessionUIState>(
    initialMode === "setup" ? "configuring" : "idle",
  );

  const [setupData, setSetupData] =
    useState<SessionSetupData>(initialSetupData);

  const [finishedSession, setFinishedSession] =
    useState<MonitoringSession | null>(null);

  const [currentSession, setCurrentSession] =
    useState<MonitoringSession | null>(null);

  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function recoverActiveSession() {
      try {
        if (!userId) {
          setIsRecoveringSession(false);
          return;
        }

        const session = await loadActiveSession(userId);

        if (session) {
          setCurrentSession(session);
          setSetupData(buildSetupDataFromSession(session));

          await hydrateRealtimeStores(session._id);

          setState("active");
          return;
        }

        if (initialMode === "setup") {
          setSetupData(buildInitialSetupDataFromSettings());
          setState("configuring");
          return;
        }

        setState("idle");
      } finally {
        setIsRecoveringSession(false);
      }
    }

    recoverActiveSession();
  }, [loadActiveSession, initialMode]);

  function buildInitialSetupDataFromSettings(): SessionSetupData {
    return {
      tasks: [],
      timeGoalMinutes:
        defaultTimeGoalMinutes > 0 ? defaultTimeGoalMinutes : null,
      studyMode: "normal",
      cameraEnabled: cameraEnabledByDefault,
      sensorsEnabled: sensorsEnabledByDefault,
    };
  }

  function goToSetup() {
    setSetupData(buildInitialSetupDataFromSettings());
    setState("configuring");
  }

  async function startSessionFlow() {
    setState("starting");

    try {
      if (!userId) return;

      const startPromise = startSession({
        timeGoal: setupData.timeGoalMinutes,
        studyMode: setupData.studyMode,
        tasks: setupData.tasks,
        features: {
          cameraEnabled: setupData.cameraEnabled,
          sensorsEnabled: setupData.sensorsEnabled,
        },
      });

      const delayPromise = new Promise<void>((resolve) => {
        startTimeoutRef.current = setTimeout(() => {
          resolve();
        }, MIN_STARTING_DURATION_MS);
      });

      const [session] = await Promise.all([startPromise, delayPromise]);

      if (!session) {
        setState("configuring");
        return;
      }

      setCurrentSession(session);
      await hydrateRealtimeStores(session._id);
      setSetupData(buildSetupDataFromSession(session));
      setState("active");
    } catch (error) {
      console.error(error);

      if (startTimeoutRef.current) {
        clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = null;
      }

      setState("configuring");
    }
  }

  function cancelStartSessionFlow() {
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }

    setState("configuring");
  }

  async function finishSessionFlow() {
    try {
      const session = await finishSession({
        tasks: setupData.tasks,
      });

      if (session) {
        setFinishedSession(session);
      }

      setCurrentSession(null);
      setState("finished");
    } catch (error) {
      console.error(error);
    }
  }

  function resetSessionFlow() {
    setCurrentSession(null);
    setFinishedSession(null);
    setState("idle");
  }

  function buildResultData(session: MonitoringSession): SessionResultData {
    return {
      durationMinutes: session.durationSeconds
        ? Math.round(session.durationSeconds / 60)
        : 0,
      focusAverage: session.summary.focus ?? null,
      temperatureAverage: session.summary.temperature ?? null,
      lightAverage: session.summary.light ?? null,
      noiseAverage: session.summary.noise ?? null,
      pointsEarned: session.points.earned,
      level: 2,
    };
  }

  async function hydrateRealtimeStores(sessionId: string) {
    const [latestEnvironmentReading, latestFacialMetric] = await Promise.all([
      getLatestEnvironmentReading(sessionId),
      getLatestFacialMetric(sessionId),
    ]);

    if (latestEnvironmentReading) {
      setLatestReading(latestEnvironmentReading);
    }

    if (latestFacialMetric) {
      setLatestMetrics(latestFacialMetric);
    }
  }

  async function pauseSessionFlow() {
    if (!currentSession) return;

    const optimisticSession: MonitoringSession = {
      ...currentSession,
      status: "paused",
      pauseIntervals: [
        ...(currentSession.pauseIntervals ?? []),
        {
          pausedAt: new Date().toISOString(),
          resumedAt: null,
        },
      ],
    };

    setCurrentSession(optimisticSession);

    try {
      const session = await pauseSession();

      if (session) {
        setCurrentSession(session);
      }
    } catch (error) {
      console.error(error);
      setCurrentSession(currentSession);
    }
  }

  async function resumeSessionFlow() {
    if (!currentSession) return;

    const optimisticSession: MonitoringSession = {
      ...currentSession,
      status: "active",
      pauseIntervals: closeLastPauseInterval(
        currentSession.pauseIntervals ?? [],
        new Date().toISOString(),
      ),
    };

    setCurrentSession(optimisticSession);

    try {
      const session = await resumeSession();

      if (session) {
        setCurrentSession(session);
      }
    } catch (error) {
      console.error(error);
    }
  }

  if (isRecoveringSession) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Loading session...
      </div>
    );
  }

  return (
    <SessionStateRenderer
      state={state}
      setupData={setupData}
      resultData={finishedSession ? buildResultData(finishedSession) : null}
      currentSession={currentSession}
      onSetupChange={setSetupData}
      onGoToSetup={goToSetup}
      onStart={startSessionFlow}
      onFinish={finishSessionFlow}
      onReset={resetSessionFlow}
      onCancelStart={cancelStartSessionFlow}
      onCancelSetup={resetSessionFlow}
      onPause={pauseSessionFlow}
      onResume={resumeSessionFlow}
    />
  );
}

function buildSetupDataFromSession(
  session: MonitoringSession,
): SessionSetupData {
  return {
    tasks: session.tasks.map((task) => ({
      id: task.id ?? crypto.randomUUID(),
      title: task.title,
      completed: task.completed,
    })),
    timeGoalMinutes: session.timeGoal ?? null,
    studyMode: session.studyMode,
    cameraEnabled: session.features.cameraEnabled,
    sensorsEnabled: session.features.sensorsEnabled,
  };
}

function closeLastPauseInterval(
  pauseIntervals: MonitoringSession["pauseIntervals"],
  resumedAt: string,
) {
  return pauseIntervals.map((interval, index) => {
    const isLast = index === pauseIntervals.length - 1;

    if (!isLast || interval.resumedAt) {
      return interval;
    }

    return {
      ...interval,
      resumedAt,
    };
  });
}
