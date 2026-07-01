export type FacialMetrics = {
  _id: string;
  sessionId: string;
  ear: number;
  mar: number;
  eyesClosed: boolean;
  yawning: boolean;
  features?: FacialFeatures | null;
  prediction?: FacialPrediction | null;
  timestamp: string;
  inferenceTimeMs?: number | null;
  processingTimeMs?: number | null;
  requestTimestamp?: string | null;
};

export type FacialFeatures = {
  earMean?: number | null;
  earMin?: number | null;
  earStd?: number | null;
  marMean?: number | null;
  marMax?: number | null;
  marStd?: number | null;
  perclose?: number | null;
  eyesClosedRatio?: number | null;
  yawnCount?: number | null;
};

export type FacialPrediction = {
  modelName?: string | null;
  fatigueProbability?: number | null;
  fatigueDetected?: boolean | null;
  focusScore?: number | null;
};
