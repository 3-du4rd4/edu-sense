import { useCallback } from "react";

import {
  finishSession,
  getActiveSession,
  startSession,
  pauseSession,
  resumeSession,
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

        return session;
      } catch {
        setError("Erro ao buscar sessão ativa.");
        return null;
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

        return session;
      } catch {
        setError("Erro ao iniciar sessão.");
        throw new Error("Erro ao iniciar sessão.");
      } finally {
        setIsLoading(false);
      }
    },
    [setActiveSession, setError, setIsLoading],
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
        throw new Error("Erro ao encerrar sessão.");
      } finally {
        setIsLoading(false);
      }
    },
    [setActiveSession, setIsLoading, setError, activeSession],
  );

  const handlePauseSession = useCallback(async () => {
    if (!activeSession) return null;

    try {
      setIsLoading(true);
      setError(null);

      const session = await pauseSession(activeSession._id);

      setActiveSession(session);

      return session;
    } catch {
      setError("Erro ao pausar sessão.");
      throw new Error("Erro ao pausar sessão.");
    } finally {
      setIsLoading(false);
    }
  }, [activeSession, setActiveSession, setError, setIsLoading]);

  const handleResumeSession = useCallback(async () => {
    if (!activeSession) return null;

    try {
      setIsLoading(true);
      setError(null);

      const session = await resumeSession(activeSession._id);

      setActiveSession(session);

      return session;
    } catch {
      setError("Erro ao retomar sessão.");
      throw new Error("Erro ao retomar sessão.");
    } finally {
      setIsLoading(false);
    }
  }, [activeSession, setActiveSession, setError, setIsLoading]);

  return {
    activeSession,
    isLoading,
    error,
    loadActiveSession,
    startSession: handleStartSession,
    finishSession: handleFinishSession,
    pauseSession: handlePauseSession,
    resumeSession: handleResumeSession,
  };
}
