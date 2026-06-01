"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserSessions } from "@/services/sessionHistoryService";
import { MonitoringSession } from "@/types/session";

type UseSessionHistoryParams = {
  userId: string;
  limit?: number;
};

export function useSessionHistory({
  userId,
  limit = 10,
}: UseSessionHistoryParams) {
  const [sessions, setSessions] = useState<MonitoringSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getUserSessions({
        userId,
        status: "finished",
        limit,
      });

      setSessions(data);
    } catch {
      setError("Erro ao carregar histórico de sessões.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, limit]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    sessions,
    isLoading,
    error,
    reload: loadSessions,
  };
}
