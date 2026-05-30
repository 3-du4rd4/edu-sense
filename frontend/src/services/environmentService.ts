import { api } from "@/services/api";
import { EnvironmentReading } from "@/types/environment";

export type CreateEnvironmentReadingPayload = {
  userId: string;
  temperature: number;
  light: number;
  noise: number;
};

export async function createEnvironmentReading(
  payload: CreateEnvironmentReadingPayload,
): Promise<EnvironmentReading> {
  const response = await api.post<EnvironmentReading>(
    "/environment-readings",
    payload,
  );

  return response.data;
}
