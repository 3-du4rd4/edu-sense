import { api } from "./api";
import {
  MonitoringSession,
  StartSessionPayload,
  FinishSessionPayload,
  SessionTask,
} from "@/types/session";

export async function startSession(
  payload: StartSessionPayload,
): Promise<MonitoringSession> {
  const response = await api.post<MonitoringSession>(
    "/sessions/start",
    payload,
  );

  return response.data;
}

export async function finishSession(
  sessionId: string,
  payload: FinishSessionPayload,
): Promise<MonitoringSession> {
  const response = await api.post<MonitoringSession>(
    `/sessions/${sessionId}/finish`,
    payload,
  );

  return response.data;
}

export async function getActiveSession(
  userId: string,
): Promise<MonitoringSession | null> {
  const response = await api.get<MonitoringSession | null>("/sessions/active", {
    params: {
      userId,
    },
  });

  return response.data;
}

export async function updateSessionTasks(
  sessionId: string,
  tasks: SessionTask[],
): Promise<MonitoringSession> {
  const response = await api.patch<MonitoringSession>(
    `/sessions/${sessionId}/tasks`,
    { tasks },
  );

  return response.data;
}

export async function pauseSession(
  sessionId: string,
): Promise<MonitoringSession> {
  const response = await api.post<MonitoringSession>(
    `/sessions/${sessionId}/pause`,
  );

  return response.data;
}

export async function resumeSession(
  sessionId: string,
): Promise<MonitoringSession> {
  const response = await api.post<MonitoringSession>(
    `/sessions/${sessionId}/resume`,
  );

  return response.data;
}
