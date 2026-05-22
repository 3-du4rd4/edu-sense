import {
  CalendarStudyData,
  DashboardStat,
  InsightTipItem,
  LastSessionMetric,
  StudyChartPoint,
} from "@/types/dashboard";
import { Lightbulb, Thermometer, Volume2 } from "lucide-react";

export const greetingData = {
  userName: "Maria",
  greeting: "Hello",
  illustration: "/illustrations/dashboard-illustration.svg",
};

export const dashboardStats: DashboardStat[] = [
  {
    title: "hours studied",
    value: "12",
  },
  {
    title: "completed sessions",
    value: "5",
  },
];

export const lastSessionMetrics: LastSessionMetric[] = [
  {
    label: "Temperature avg.",
    value: "28.4°C",
    icon: Thermometer,
  },
  {
    label: "Light avg.",
    value: "430 lx",
    icon: Lightbulb,
  },
  {
    label: "Noise avg.",
    value: "52 dB",
    icon: Volume2,
  },
];

export const studyChartData: StudyChartPoint[] = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.4 },
  { day: "Wed", hours: 3.1 },
  { day: "Thu", hours: 1.8 },
  { day: "Fri", hours: 4.2 },
  { day: "Sat", hours: 3.5 },
  { day: "Sun", hours: 2.8 },
];

export const insightItems: InsightTipItem[] = [
  {
    text: "You usually perform better during sessions started before 10 AM.",
  },
  {
    text: "Your study environment tends to be brighter during your longer sessions.",
  },
  {
    text: "You completed 5 study days in a row. Keep your current rhythm.",
  },
];

export const studyTips: InsightTipItem[] = [
  {
    text: "Try to start your next session in a quiet environment.",
  },
  {
    text: "Keep your study area well lit to reduce visual fatigue.",
  },
  {
    text: "Use short breaks between longer focus blocks.",
  },
];

export const calendarStudyData: CalendarStudyData = {
  monthDate: new Date(2025, 10, 1),
  today: new Date(2025, 10, 20),
  studiedDates: [
    new Date(2025, 10, 7),
    new Date(2025, 10, 19),
    new Date(2025, 10, 20),
  ],
  streakDates: [new Date(2025, 10, 20)],
  streakCount: 1,
};
