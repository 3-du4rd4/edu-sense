"use client";

import { useEffect, useRef } from "react";

import { createWebSocketConnection } from "@/services/websocketService";
import { useEnvironmentStore } from "@/stores/environmentStore";
import { useSessionStore } from "@/stores/sessionStore";
import { WebSocketMessage } from "@/types/websocket";

export function useWebSocket(userId: string) {
  const socketRef = useRef<WebSocket | null>(null);

  const setActiveSession = useSessionStore((state) => state.setActiveSession);

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
      },
    );

    socketRef.current = socket;

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [userId, setActiveSession, setLatestReading]);
}
