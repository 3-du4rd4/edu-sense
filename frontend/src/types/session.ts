export type SessionFeatures = {
  cameraEnabled: boolean;
  sensorsEnabled: boolean;
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
  tasks: unknown[]; // Ajustar depois de definir o tipo
  timeGoal: number | null;
  status: "active" | "finished" | "paused";
  features: SessionFeatures;
  points: SessionPoints;
};

export type StartSessionPayload = {
  userId: string;
  timeGoal?: number | null;
  features: SessionFeatures;
};
