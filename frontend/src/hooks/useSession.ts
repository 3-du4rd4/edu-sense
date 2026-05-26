import { useCallback } from "react";

import {
  finishSession,
  getActiveSession,
  startSession,
} from "@/services/sessionService";
import { useSessionStore } from "@/stores/sessionStore";
import { FinishSessionPayload, StartSessionPayload } from "@/types/session";

export function useSession() {
  const {
    activeSession,
    isLoading,
    error,
    setActiveSession,
    setIsLoading,
    setError,
  } = useSessionStore();

  const loadActiveSession = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const session = await getActiveSession(userId);
        setActiveSession(session);
      } catch {
        setError("Erro ao buscar sessão ativa.");
      } finally {
        setIsLoading(false);
      }
    },
    [setActiveSession, setIsLoading, setError],
  );

  const handleStartSession = useCallback(
    async (payload: StartSessionPayload) => {
      try {
        setIsLoading(true);
        setError(null);

        const session = await startSession(payload);
        setActiveSession(session);
      } catch {
        setError("Erro ao iniciar sessão.");
      } finally {
        setIsLoading(false);
      }
    },
    [setActiveSession, setIsLoading, setError],
  );

  const handleFinishSession = useCallback(
    async (payload: FinishSessionPayload) => {
      if (!activeSession) return;

      try {
        setIsLoading(true);
        setError(null);

        const session = await finishSession(activeSession._id, payload);
        setActiveSession(null);

        return session;
      } catch {
        setError("Erro ao encerrar sessão.");
      } finally {
        setIsLoading(false);
      }
    },
    [setActiveSession, setIsLoading, setError, activeSession],
  );

  return {
    activeSession,
    isLoading,
    error,
    loadActiveSession,
    startSession: handleStartSession,
    finishSession: handleFinishSession,
  };
}
