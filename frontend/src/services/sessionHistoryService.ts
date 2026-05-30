import { api } from "@/services/api";
import { MonitoringSession } from "@/types/session";

export async function getUserSessions({
  userId,
  status = "finished",
  limit = 10,
}: {
  userId: string;
  status?: "active" | "finished";
  limit?: number;
}): Promise<MonitoringSession[]> {
  const response = await api.get<MonitoringSession[]>(
    `/sessions/user/${userId}`,
    {
      params: {
        status,
        limit,
      },
    },
  );

  return response.data;
}

export async function getSessionById(
  sessionId: string,
): Promise<MonitoringSession> {
  const response = await api.get<MonitoringSession>(`/sessions/${sessionId}`);

  return response.data;
}
