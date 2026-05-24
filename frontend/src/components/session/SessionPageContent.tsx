"use client";

import { useRef, useState } from "react";

import { SessionStateRenderer } from "./SessionStateRenderer";
import { SessionSetupData, SessionUIState } from "./types";

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

export function SessionPageContent() {
  const [state, setState] = useState<SessionUIState>("idle");
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
