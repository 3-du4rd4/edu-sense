import { EnvironmentReading } from "./environment";
import { FacialMetrics } from "./facialMetrics";
import { AppNotification } from "./notification";
import { MonitoringSession } from "./session";

export type WebSocketEventName =
  | "session_started"
  | "session_finished"
  | "environment_update"
  | "facial_metrics_update"
  | "notification_created";

export type WebSocketMessage =
  | {
      event: "session_started";
      payload: MonitoringSession;
    }
  | {
      event: "session_finished";
      payload: MonitoringSession;
    }
  | {
      event: "environment_update";
      payload: EnvironmentReading;
    }
  | {
      event: "facial_metrics_update";
      payload: FacialMetrics;
    }
  | {
      event: "notification_created";
      payload: AppNotification;
    };
