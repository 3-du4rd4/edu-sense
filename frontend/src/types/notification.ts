export type NotificationType = "environment" | "facial";

export type NotificationSeverity = "info" | "warning" | "critical";

export type NotificationSource =
  | "temperature"
  | "light"
  | "noise"
  | "eyesClosed"
  | "yawning";

export type AppNotification = {
  _id: string;
  userId: string;
  sessionId: string;
  type: NotificationType;
  severity: NotificationSeverity;
  source: NotificationSource;
  title: string;
  message: string;
  value: number | boolean;
  threshold: number | boolean | null;
  read: boolean;
  createdAt: string;
};
