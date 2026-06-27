"use client";

import { useEffect, useState } from "react";

import { getDashboardCalendarData } from "@/services/dashboardService";
import { DashboardCalendarData } from "@/types/dashboard";

export function useDashboardCalendar({
  userId,
  month,
}: {
  userId?: string;
  month: string;
}) {
  const [data, setData] = useState<DashboardCalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function loadCalendarData() {
      try {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        const calendarData = await getDashboardCalendarData({
          userId,
          month,
        });

        setData(calendarData);
      } catch {
        setError("Erro ao carregar calendário.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCalendarData();
  }, [userId, month]);

  return {
    data,
    isLoading,
    error,
  };
}
