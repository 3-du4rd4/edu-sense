import { api } from "@/services/api";
import { DashboardCalendarData, DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  const response = await api.get<DashboardData>("/dashboard");

  return response.data;
}

export async function getDashboardCalendarData({
  month,
}: {
  month: string;
}): Promise<DashboardCalendarData> {
  const response = await api.get<DashboardCalendarData>("/dashboard/calendar", {
    params: {
      month,
    },
  });

  return response.data;
}
