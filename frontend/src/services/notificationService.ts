import { api } from "@/services/api";
import { AppNotification } from "@/types/notification";

export async function getNotifications(limit = 20): Promise<AppNotification[]> {
  const response = await api.get<AppNotification[]>("/notifications", {
    params: { limit },
  });

  return response.data;
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<AppNotification | null> {
  const response = await api.patch<AppNotification | null>(
    `/notifications/${notificationId}/read`,
  );

  return response.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.patch("/notifications/read-all");
}
