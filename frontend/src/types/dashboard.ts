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
