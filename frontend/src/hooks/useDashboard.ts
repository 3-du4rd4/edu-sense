"use client";

import { useEffect, useState } from "react";

import { getDashboardData } from "@/services/dashboardService";
import { DashboardData } from "@/types/dashboard";

export function useDashboard(userId?: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function loadDashboardData() {
      try {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        const dashboardData = await getDashboardData();

        setData(dashboardData);
      } catch {
        setError("Erro ao carregar dados do dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [userId]);

  return { data, isLoading, error };
}
