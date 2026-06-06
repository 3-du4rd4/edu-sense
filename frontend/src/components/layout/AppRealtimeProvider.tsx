"use client";

import { useEffect } from "react";

import { useSession } from "@/hooks/useSession";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuthStore } from "@/stores/authStore";

export function AppRealtimeProvider() {
  const user = useAuthStore((state) => state.user);
  const { loadActiveSession } = useSession();

  const userId = user?._id;

  useWebSocket(userId);

  useEffect(() => {
    if (!userId) return;

    loadActiveSession(userId);
  }, [loadActiveSession]);

  return null;
}
