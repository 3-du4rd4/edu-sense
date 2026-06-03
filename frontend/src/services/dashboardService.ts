import { api } from "@/services/api";
import { DashboardCalendarData, DashboardData } from "@/types/dashboard";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const response = await api.get<DashboardData>("/dashboard", {
    params: { userId },
  });

  return response.data;
}

export async function getDashboardCalendarData({
  userId,
  month,
}: {
  userId: string;
  month: string;
}): Promise<DashboardCalendarData> {
  const response = await api.get<DashboardCalendarData>("/dashboard/calendar", {
    params: {
      userId,
      month,
    },
  });

  return response.data;
}
