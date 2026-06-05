from datetime import datetime, timezone


class SessionSummaryService:
    def calculate_session_summary(
        self,
        environment_readings: list[dict],
        facial_metrics: list[dict],
        paused_intervals: list[dict],
    ) -> dict:
        valid_environment_readings = filter_out_paused_items(
            items=environment_readings,
            paused_intervals=paused_intervals,
        )

        valid_facial_metrics = filter_out_paused_items(
            items=facial_metrics,
            paused_intervals=paused_intervals,
        )

        environment_summary = self.calculate_environment_summary(
            valid_environment_readings
        )

        return {
            **environment_summary,
            "focus": self.calculate_focus_average(valid_facial_metrics),
        }
    

    def calculate_environment_summary(
        self,
        readings: list[dict],
    ) -> dict:
        if not readings:
            return {
                "temperature": None,
                "light": None,
                "noise": None,
            }

        return {
            "temperature": self._average(readings, "temperature"),
            "light": self._average(readings, "light"),
            "noise": self._average(readings, "noise"),
        }


    def calculate_focus_average(
        self,
        facial_metrics: list[dict],
    ) -> float | None:
        if not facial_metrics:
            return None

        focused_count = sum(
            1
            for metric in facial_metrics
            if not metric.get("eyesClosed") and not metric.get("yawning")
        )

        focus_average = (focused_count / len(facial_metrics)) * 100

        return round(focus_average, 2)
    

    def _average(self, readings: list[dict], field: str) -> float | None:
        values = [
            reading.get(field)
            for reading in readings
            if reading.get(field) is not None
        ]

        if not values:
            return None

        return round(sum(values) / len(values), 2)
    

def filter_out_paused_items(
        items: list[dict],
        paused_intervals: list[dict],
    ) -> list[dict]:
        return [
            item
            for item in items
            if not is_inside_paused_interval(
                timestamp=item.get("timestamp"),
                paused_intervals=paused_intervals,
            )
        ]
    

def is_inside_paused_interval(
    timestamp: datetime | None,
    paused_intervals: list[dict]
) -> bool:
    if not timestamp:
        return False
    
    if timestamp.tzinfo is None:
        timestamp = timestamp.replace(tzinfo=timezone.utc)

    for interval in paused_intervals:
        paused_at = interval.get("pausedAt")
        resumed_at = interval.get("resumedAt")

        if not paused_at or not resumed_at:
            continue

        if paused_at.tzinfo is None:
            paused_at = paused_at.replace(tzinfo=timezone.utc)

        if resumed_at.tzinfo is None:
            resumed_at = resumed_at.replace(tzinfo=timezone.utc)

        if paused_at <= timestamp <= resumed_at:
            return True
        
    return False