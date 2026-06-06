import { api } from "@/services/api";
import { MonitoringSession } from "@/types/session";

export async function getUserSessions({
  status = "finished",
  limit = 10,
}: {
  status?: "active" | "finished";
  limit?: number;
}): Promise<MonitoringSession[]> {
  const response = await api.get<MonitoringSession[]>(`/sessions/history`, {
    params: {
      status,
      limit,
    },
  });

  return response.data;
}

export async function getSessionById(
  sessionId: string,
): Promise<MonitoringSession> {
  const response = await api.get<MonitoringSession>(`/sessions/${sessionId}`);

  return response.data;
}
