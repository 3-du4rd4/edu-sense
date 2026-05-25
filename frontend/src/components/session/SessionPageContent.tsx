"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { SessionStateRenderer } from "./SessionStateRenderer";
import { SessionResultData, SessionSetupData, SessionUIState } from "./types";

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

const mockResultData: SessionResultData = {
  durationMinutes: 155,
  focusAverage: 88,
  temperatureAverage: 30,
  lightAverage: 800,
  noiseAverage: 800,
  pointsEarned: 200,
  level: 2,
};

export function SessionPageContent() {
  const searchParams = useSearchParams();

  const initialMode = searchParams.get("mode");

  const [state, setState] = useState<SessionUIState>(
    initialMode === "setup" ? "configuring" : "idle",
  );
  const [setupData, setSetupData] =
    useState<SessionSetupData>(initialSetupData);

  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function goToSetup() {
    setState("configuring");
  }

  function startSessionFlow() {
    setState("starting");

    startTimeoutRef.current = setTimeout(() => {
      setState("active");
      startTimeoutRef.current = null;
    }, 4000);
  }

  function cancelStartSessionFlow() {
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current);
      startTimeoutRef.current = null;
    }

    setState("configuring");
  }

  function finishSessionFlow() {
    setState("finished");
  }

  function resetSessionFlow() {
    setState("idle");
  }

  return (
    <SessionStateRenderer
      state={state}
      setupData={setupData}
      resultData={mockResultData}
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
