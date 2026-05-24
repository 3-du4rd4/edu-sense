import { ActiveSessionView } from "./views/ActiveSessionView";
import { FinishedSessionView } from "./views/FinishedSessionView";
import { IdleView } from "./views/IdleView";
import { SetupView } from "./views/SetupView";
import { StartingView } from "./views/StartingView";

import { SessionSetupData, SessionUIState } from "./types";

type SessionStateRendererProps = {
  state: SessionUIState;
  setupData: SessionSetupData;
  onSetupChange: (data: SessionSetupData) => void;
  onGoToSetup: () => void;
  onStart: () => void;
  onFinish: () => void;
  onReset: () => void;
  onCancelStart: () => void;
  onCancelSetup: () => void;
};

export function SessionStateRenderer({
  state,
  setupData,
  onSetupChange,
  onGoToSetup,
  onStart,
  onFinish,
  onReset,
  onCancelStart,
  onCancelSetup,
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
    return <ActiveSessionView onFinish={onFinish} />;
  }

  if (state === "finished") {
    return <FinishedSessionView onContinue={onReset} />;
  }

  return <IdleView onGoToSetup={onGoToSetup} />;
}
