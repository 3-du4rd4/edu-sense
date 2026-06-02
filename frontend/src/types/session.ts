export type StudyMode = "normal" | "focus" | "reading";

export type SessionFeatures = {
  cameraEnabled: boolean;
  sensorsEnabled: boolean;
};

export type SessionTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type SessionSummary = {
  temperature: number | null;
  noise: number | null;
  light: number | null;
  focus: number | null;
};

export type SessionPoints = {
  earned: number;
  breakdown: {
    sessionCompleted: number;
    timeGoalAchieved: number;
    completedTasks: number;
    focusBonus: number;
  };
};

export type MonitoringSession = {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  durationSeconds: number | null;
  createdAt: string;
  summary: SessionSummary;
  tasks: SessionTask[];
  studyMode: StudyMode;
  timeGoal: number | null;
  status: "active" | "finished" | "paused";
  features: SessionFeatures;
  points: SessionPoints;
};

export type StartSessionPayload = {
  userId: string;
  timeGoal?: number | null;
  studyMode: StudyMode;
  tasks: SessionTask[];
  features: SessionFeatures;
};

export type FinishSessionPayload = {
  tasks: SessionTask[];
};
