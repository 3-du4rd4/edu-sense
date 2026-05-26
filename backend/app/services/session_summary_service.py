class SessionSummaryService:
    def calculate_environment_summary(
        self,
        readings: list[dict],
    ) -> dict:
        if not readings:
            return {
                "temperature": None,
                "light": None,
                "noise": None,
                "focus": None,
            }

        return {
            "temperature": self._average(readings, "temperature"),
            "light": self._average(readings, "light"),
            "noise": self._average(readings, "noise"),
            "focus": None,
        }

    def _average(self, readings: list[dict], field: str) -> float | None:
        values = [
            reading.get(field)
            for reading in readings
            if reading.get(field) is not None
        ]

        if not values:
            return None

        return round(sum(values) / len(values), 2)