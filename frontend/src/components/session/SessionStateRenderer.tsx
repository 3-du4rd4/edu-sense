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
};

export function SessionStateRenderer({
  state,
  setupData,
  onSetupChange,
  onGoToSetup,
  onStart,
  onFinish,
  onReset,
}: SessionStateRendererProps) {
  if (state === "configuring") {
    return (
      <SetupView
        setupData={setupData}
        onSetupChange={onSetupChange}
        onStart={onStart}
      />
    );
  }

  if (state === "starting") {
    return <StartingView />;
  }

  if (state === "active") {
    return <ActiveSessionView onFinish={onFinish} />;
  }

  if (state === "finished") {
    return <FinishedSessionView onContinue={onReset} />;
  }

  return <IdleView onGoToSetup={onGoToSetup} />;
}
