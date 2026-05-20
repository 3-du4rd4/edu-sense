import { create } from "zustand";
import { EnvironmentReading } from "@/types/environment";

type EnvironmentState = {
  latestReading: EnvironmentReading | null;
  readings: EnvironmentReading[];

  setLatestReading: (reading: EnvironmentReading) => void;
  clearReadings: () => void;
};

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  latestReading: null,
  readings: [],

  setLatestReading: (reading) =>
    set((state) => ({
      latestReading: reading,
      readings: [reading, ...state.readings].slice(0, 20),
    })),

  clearReadings: () =>
    set(() => ({
      latestReading: null,
      readings: [],
    })),
}));
