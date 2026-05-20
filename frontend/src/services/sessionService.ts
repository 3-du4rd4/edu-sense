import { api } from "./api";
import { MonitoringSession, StartSessionPayload } from "@/types/session";

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
): Promise<MonitoringSession> {
  const response = await api.post<MonitoringSession>(
    `/sessions/${sessionId}/finish`,
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
