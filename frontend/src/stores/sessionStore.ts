import { create } from "zustand";
import { MonitoringSession } from "@/types/session";

type SessionState = {
  activeSession: MonitoringSession | null;
  isLoading: boolean;
  error: string | null;

  setActiveSession: (session: MonitoringSession | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  activeSession: null,
  isLoading: false,
  error: null,

  setActiveSession: (session) => set({ activeSession: session }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
