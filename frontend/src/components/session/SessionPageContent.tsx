"use client";

import { useState } from "react";

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

  function goToSetup() {
    setState("configuring");
  }

  function startSessionFlow() {
    setState("starting");

    setTimeout(() => {
      setState("active");
    }, 2000);
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
    />
  );
}
