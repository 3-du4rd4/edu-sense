import { create } from "zustand";

import { FacialMetrics } from "@/types/facialMetrics";

type FacialMetricsState = {
  latestMetrics: FacialMetrics | null;
  metrics: FacialMetrics[];

  setLatestMetrics: (metrics: FacialMetrics) => void;
  clearMetrics: () => void;
};

export const useFacialMetricsStore = create<FacialMetricsState>((set) => ({
  latestMetrics: null,
  metrics: [],

  setLatestMetrics: (metrics) =>
    set((state) => ({
      latestMetrics: metrics,
      metrics: [metrics, ...state.metrics].slice(0, 20),
    })),

  clearMetrics: () =>
    set({
      latestMetrics: null,
      metrics: [],
    }),
}));
