import { api } from "@/services/api";
import { PerformanceMetrics } from "@/types/performanceMetrics";

export type CreatePerformanceMetricsPayload = {
  type: "environment" | "facial";
  sessionId: string;
  requestTimestamp?: string | null;
  receivedAt?: string | null;
};

export async function createPerformanceMetrics(
  payload: CreatePerformanceMetricsPayload,
): Promise<PerformanceMetrics> {
  const response = await api.post<PerformanceMetrics>(
    "/performance-metrics",
    payload,
  );

  return response.data;
}
