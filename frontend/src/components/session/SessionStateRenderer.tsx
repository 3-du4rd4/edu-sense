import { ActiveSessionView } from "./views/ActiveSessionView";
import { FinishedSessionView } from "./views/FinishedSessionView";
import { IdleView } from "./views/IdleView";
import { SetupView } from "./views/SetupView";
import { StartingView } from "./views/StartingView";

import { SessionResultData, SessionSetupData, SessionUIState } from "./types";
import { MonitoringSession } from "@/types/session";

type SessionStateRendererProps = {
  state: SessionUIState;
  setupData: SessionSetupData;
  resultData: SessionResultData | null;
  currentSession: MonitoringSession | null;
  onSetupChange: (data: SessionSetupData) => void;
  onGoToSetup: () => void;
  onStart: () => void;
  onFinish: () => void;
  onReset: () => void;
  onCancelStart: () => void;
  onCancelSetup: () => void;
  onPause: () => void;
  onResume: () => void;
};

export function SessionStateRenderer({
  state,
  setupData,
  resultData,
  currentSession,
  onSetupChange,
  onGoToSetup,
  onStart,
  onFinish,
  onReset,
  onCancelStart,
  onCancelSetup,
  onPause,
  onResume,
}: SessionStateRendererProps) {
  if (state === "configuring") {
    return (
      <SetupView
        setupData={setupData}
        onSetupChange={onSetupChange}
        onStart={onStart}
        onCancel={onCancelSetup}
      />
    );
  }

  if (state === "starting") {
    return <StartingView onCancel={onCancelStart} />;
  }

  if (state === "active") {
    return (
      <ActiveSessionView
        setupData={setupData}
        currentSession={currentSession}
        onSetupChange={onSetupChange}
        onFinish={onFinish}
        onPause={onPause}
        onResume={onResume}
      />
    );
  }

  if (state === "finished") {
    return (
      <FinishedSessionView
        onContinue={onReset}
        resultData={resultData}
        setupData={setupData}
      />
    );
  }

  return <IdleView onGoToSetup={onGoToSetup} />;
}
