"use client";

import { useEffect } from "react";

import { useSession } from "@/hooks/useSession";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuthStore } from "@/stores/authStore";
import { getNotifications } from "@/services/notificationService";
import { useNotificationStore } from "@/stores/notificationStore";

export function AppRealtimeProvider() {
  const user = useAuthStore((state) => state.user);
  const { loadActiveSession } = useSession();

  const userId = user?._id;

  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );

  useWebSocket(userId);

  useEffect(() => {
    async function loadNotifications() {
      if (!userId) {
        clearNotifications();
        return;
      }

      const notifications = await getNotifications();
      setNotifications(notifications);
    }

    loadNotifications();
  }, [userId, setNotifications, clearNotifications]);

  useEffect(() => {
    if (!userId) return;

    loadActiveSession(userId);
  }, [userId, loadActiveSession]);

  return null;
}
