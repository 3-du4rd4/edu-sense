export type SessionUIState =
  | "idle"
  | "configuring"
  | "starting"
  | "active"
  | "finished";

export type StudyMode = "normal" | "focus" | "reading";

export type SetupTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type SessionSetupData = {
  tasks: SetupTask[];
  timeGoalMinutes: number | null;
  studyMode: StudyMode;
  cameraEnabled: boolean;
  sensorsEnabled: boolean;
};

export type SessionResultData = {
  durationMinutes: number;
  focusAverage: number | null;
  temperatureAverage: number | null;
  lightAverage: number | null;
  noiseAverage: number | null;
  pointsEarned: number;
  level: number;
};
