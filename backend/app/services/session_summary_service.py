class SessionSummaryService:
    def calculate_session_summary(
        self,
        environment_readings: list[dict],
        facial_metrics: list[dict],
    ) -> dict:
        environment_summary = self.calculate_environment_summary(
            environment_readings
        )

        return {
            **environment_summary,
            "focus": self.calculate_focus_average(facial_metrics),
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