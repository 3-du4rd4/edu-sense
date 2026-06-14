"use client";

import { useEffect, useRef } from "react";

import { createWebSocketConnection } from "@/services/websocketService";
import { useEnvironmentStore } from "@/stores/environmentStore";
import { useSessionStore } from "@/stores/sessionStore";
import { WebSocketMessage } from "@/types/websocket";
import { useFacialMetricsStore } from "@/stores/facialMetricsStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useSettingsStore } from "@/stores/settingsStore";

import { toast } from "sonner";
import { markNotificationAsRead } from "@/services/notificationService";

export function useWebSocket(userId?: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const setActiveSession = useSessionStore((state) => state.setActiveSession);
  const setLatestMetrics = useFacialMetricsStore(
    (state) => state.setLatestMetrics,
  );

  const setLatestReading = useEnvironmentStore(
    (state) => state.setLatestReading,
  );

  useEffect(() => {
    if (!userId) return;

    const socket = createWebSocketConnection(
      userId,
      (message: WebSocketMessage) => {
        if (message.event === "session_started") {
          setActiveSession(message.payload);
        }

        if (message.event === "session_finished") {
          setActiveSession(null);
        }

        if (message.event === "environment_update") {
          setLatestReading(message.payload);
        }

        if (message.event === "facial_metrics_update") {
          setLatestMetrics(message.payload);
        }

        if (message.event === "notification_created") {
          const isAppVisible = document.visibilityState === "visible";

          useNotificationStore.getState().addNotification({
            ...message.payload,
            read: isAppVisible,
          });

          if (isAppVisible) {
            markNotificationAsRead(message.payload._id).catch(console.error);

            toast.warning(message.payload.title, {
              description: message.payload.message,
              classNames: {
                description: "!text-foreground",
              },
            });
          } else {
            showBrowserNotification(
              message.payload.title,
              message.payload.message,
            );
          }
        }
      },
    );

    socketRef.current = socket;

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [userId, setActiveSession, setLatestReading, setLatestMetrics]);
}

function showBrowserNotification(title: string, message: string) {
  const browserNotificationsEnabled =
    useSettingsStore.getState().browserNotificationsEnabled;

  if (!browserNotificationsEnabled) return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body: message,
    icon: "/vercel.svg",
  });
}
