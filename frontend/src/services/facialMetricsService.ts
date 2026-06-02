import { api } from "@/services/api";
import { FacialMetrics } from "@/types/facialMetrics";

export type CreateFacialMetricsPayload = {
  userId: string;
  ear: number;
  mar: number;
  eyesClosed: boolean;
  yawning: boolean;
};

export async function createFacialMetrics(
  payload: CreateFacialMetricsPayload,
): Promise<FacialMetrics> {
  const response = await api.post<FacialMetrics>("/facial-metrics", payload);

  return response.data;
}

export async function getLatestFacialMetric(
  sessionId: string,
): Promise<FacialMetrics | null> {
  const response = await api.get<FacialMetrics | null>(
    `/facial-metrics/session/${sessionId}/latest`,
  );

  return response.data;
}
