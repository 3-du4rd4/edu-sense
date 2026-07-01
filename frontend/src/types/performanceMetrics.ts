export type PerformanceMetrics = {
  _id: string;
  type: "environment" | "facial";
  sessionId: string;
  requestTimestamp?: string | null;
  receivedAt?: string | null;
};
