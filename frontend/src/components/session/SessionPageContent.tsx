"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { SessionStateRenderer } from "./SessionStateRenderer";
import { SessionResultData, SessionSetupData, SessionUIState } from "./types";
import { useSession } from "@/hooks/useSession";
import { MonitoringSession } from "@/types/session";

const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID ?? "user_test_1";

const initialSetupData: SessionSetupData = {
  tasks: [
    {
      id: "1",
      title: "Read 10 book pages",
      completed: false,
    },
    {
      id: "2",
      title: "Study for Math exam",
      completed: false,
    },
  ],
  timeGoalMinutes: 120,
  studyMode: "normal",
  cameraEnabled: true,
  sensorsEnabled: true,
};

const MIN_STARTING_DURATION_MS = 4000;

export function SessionPageContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode");

  const { startSession, finishSession } = useSession();

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

  function goToSetup() {
    setState("configuring");
  }

  async function startSessionFlow() {
    setState("starting");

    try {
      const startPromise = startSession({
        userId: TEST_USER_ID,
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

      setCurrentSession(session);
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
    />
  );
}
