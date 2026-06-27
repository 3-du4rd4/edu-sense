import { LucideIcon } from "lucide-react";

export type DashboardStat = {
  title: string;
  value: string;
};

export type LastSessionMetric = {
  label: string;
  value: string;
  icon: LucideIcon;
};

export type StudyChartPoint = {
  day: string;
  hours: number;
};

export type InsightTipItem = {
  text: string;
};

export type CalendarStudyData = {
  monthDate: Date;
  today: Date;
  studiedDates: Date[];
  streakDates: Date[];
  streakCount: number;
};

export type DashboardData = {
  monthStats: {
    totalStudyMinutes: number;
    totalSessions: number;
  };

  lastSession: {
    startedAt: string;
    durationSeconds: number;
    focusAverage: number | null;
    temperatureAverage: number | null;
    lightAverage: number | null;
    noiseAverage: number | null;
    pointsEarned: number;
  } | null;

  chart: {
    dailyStudyMinutes: {
      date: string;
      minutes: number;
    }[];
  };

  score: {
    totalPoints: number;
    level: number;
    pointsToNextLevel: number;
  };

  insights: {
    type: "focus" | "environment" | "consistency" | "productivity";
    description: string;
  }[];

  tips: {
    description: string;
  }[];
};

export type DashboardCalendarData = {
  studiedDates: string[];
  streakDates: string[];
  currentStreak: number;
};
