"use client";

import { useEffect } from "react";

import { useSession } from "@/hooks/useSession";
import { useWebSocket } from "@/hooks/useWebSocket";

const TEST_USER_ID = process.env.NEXT_PUBLIC_TEST_USER_ID ?? "user_test_1";

export function AppRealtimeProvider() {
  const { loadActiveSession } = useSession();

  useWebSocket(TEST_USER_ID);

  useEffect(() => {
    loadActiveSession(TEST_USER_ID);
  }, [loadActiveSession]);

  return null;
}
