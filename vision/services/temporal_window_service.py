from collections import deque
from statistics import mean, pstdev


class TemporalWindowService:
    def __init__(self, window_size_seconds: int):
        self.window_size_seconds = window_size_seconds
        self.samples = deque(maxlen=window_size_seconds)


    def add_sample(self, metrics: dict):
        self.samples.append(metrics)


    def is_ready(self) -> bool:
        return len(self.samples) >= self.window_size_seconds
    

    def build_features(self) -> dict | None:
        if not self.samples:
            return None

        ears = [sample["ear"] for sample in self.samples]
        mars = [sample["mar"] for sample in self.samples]
        eyes_closed_values = [sample["eyesClosed"] for sample in self.samples]
        yawning_values = [sample["yawning"] for sample in self.samples]

        return {
            "earMean": round(mean(ears), 4),
            "earMin": round(min(ears), 4),
            "earStd": round(pstdev(ears), 4) if len(ears) > 1 else 0,
            "marMean": round(mean(mars), 4),
            "marMax": round(max(mars), 4),
            "marStd": round(pstdev(mars), 4) if len(mars) > 1 else 0,
            "perclos": round(
                sum(eyes_closed_values) / len(eyes_closed_values),
                4,
            ),
            "eyesClosedRatio": round(
                sum(eyes_closed_values) / len(eyes_closed_values),
                4,
            ),
            "yawnCount": sum(yawning_values),
        }
    

    def clear(self):
        self.samples.clear()