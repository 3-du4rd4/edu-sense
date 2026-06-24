from datetime import datetime, timezone
from collections import defaultdict

from repositories.session_repository import SessionRepository


POINTS_PER_LEVEL = 200


class DashboardService:
    def __init__(self):
        self.session_repository = SessionRepository()


    async def get_dashboard(self, user_id: str) -> dict:
        now = datetime.now(timezone.utc)

        sessions = await self.session_repository.list_sessions_by_user_id(
            user_id=user_id,
            status="finished",
            limit=100
        )

        month_sessions = [
           session for session in sessions
           if self._is_same_month(session["startTime"], now)
        ]

        return {
            "monthStats": self._build_month_stats(month_sessions),
            "lastSession": self._build_last_session(sessions),
            "chart": self._build_chart(month_sessions),
            "score": self._build_score(sessions),
            "insights": self._build_insights(month_sessions),
            "tips": self._build_tips(month_sessions)
        }
    

    async def get_calendar(
        self,
        user_id: str,
        month: str,
    ) -> dict:
        sessions = await self.session_repository.list_sessions_by_user_id(
            user_id=user_id,
            status="finished",
            limit=200
        )

        month_sessions = [
           session for session in sessions
           if self._format_month(session["startTime"]) == month
        ]

        studied_dates = sorted({
            self._format_date(session["startTime"])
            for session in month_sessions
        })

        streak_dates = self._calculate_current_streak_dates(sessions)

        return {
            "studiedDates": studied_dates,
            "streakDates": streak_dates,
            "currentStreak": len(streak_dates)
        }
    

    def _build_month_stats(self, sessions: list[dict]) -> dict:
        total_seconds = sum(
            session.get("durationSeconds") or 0
            for session in sessions
        )

        return {
            "totalStudyMinutes": round(total_seconds / 60),
            "totalSessions": len(sessions)
        }
    

    def _build_last_session(self, sessions: list[dict]) -> dict | None:
        if not sessions:
            return None

        last_session = sessions[0]
        summary = last_session.get("summary", {})
        points = last_session.get("points", {})

        return {
            "startedAt": self._to_iso(last_session["startTime"]),
            "durationSeconds": last_session.get("durationSeconds") or 0,
            "focusAverage": summary.get("focus"),
            "temperatureAverage": summary.get("temperature"),
            "lightAverage": summary.get("light"),
            "noiseAverage": summary.get("noise"),
            "pointsEarned": points.get("earned", 0)
        }
    

    def _build_chart(self, sessions: list[dict]) -> dict:
        minutes_by_date = defaultdict(int)

        for session in sessions:
            date = self._format_date(session["startTime"])
            minutes_by_date[date] += round((session.get("durationSeconds") or 0) / 60)

        daily_study_minutes = [
            {
                "date": date, 
                "minutes": minutes
            }
            for date, minutes in sorted(minutes_by_date.items())
        ]

        return {
            "dailyStudyMinutes": daily_study_minutes
        }
    

    def _build_score(self, sessions: list[dict]) -> dict:
        total_points = sum(
            session.get("points", {}).get("earned", 0)
            for session in sessions
        )

        level = (total_points // POINTS_PER_LEVEL) + 1
        points_to_next_level = POINTS_PER_LEVEL - (total_points % POINTS_PER_LEVEL)

        return {
            "totalPoints": total_points,
            "level": level,
            "pointsToNextLevel": points_to_next_level
        }
    

    def _build_insights(self, sessions: list[dict]) -> list[dict]:
        if not sessions:
            return [
                {
                    "type": "consistency",
                    "description": "Complete uma sessão de estudo para desbloquear insights personalizados."
                }
            ]
        
        insights = []

        focus_values = [
            session.get("summary", {}).get("focus")
            for session in sessions
            if session.get("summary", {}).get("focus") is not None
        ]

        if focus_values:
            best_focus = max(focus_values)

            insights.append({
                "type": "focus",
                "description": f"Seu melhor desempenho de foco este mês foi de {best_focus}%."
            })

        noise_values = [
            session.get("summary", {}).get("noise")
            for session in sessions
            if session.get("summary", {}).get("noise") is not None
        ]

        if noise_values:
            average_noise = round(sum(noise_values) / len(noise_values), 2)

            insights.append({
                "type": "environment",
                "description": f"O nível médio de ruído este mês foi de {average_noise} dB."
            })

        insights.append({
            "type": "productivity",
            "description": f"Você completou {len(sessions)} sessões de estudo este mês.",
        })

        return insights[:3]
    

    def _build_tips(self, sessions: list[dict]) -> list[dict]:
        if not sessions:
            return [
                {
                    "description": "Comece com uma sessão de 25 minutos para construir momentum."
                }
            ]
        
        tips = []

        focus_values = [
            session.get("summary", {}).get("focus")
            for session in sessions
            if session.get("summary", {}).get("focus") is not None
        ]

        if focus_values and (sum(focus_values) / len(focus_values)) < 70:
            tips.append({
                "title": "Melhore seu foco",
                "description": "Tente estudar em blocos menores com pequenas pausas entre as sessões.",
            })

        noise_values = [
            session.get("summary", {}).get("noise")
            for session in sessions
            if session.get("summary", {}).get("noise") is not None
        ]

        if noise_values and (sum(noise_values) / len(noise_values)) > 60:
            tips.append({
                "title": "Reduza o ruído",
                "description": "Seu ambiente parece ruoso. Tente usar fones de ouvido ou escolher um lugar mais silencioso.",
            })

        tips.append({
            "title": "Mantenha sua sequência",
            "description": "Estudar um pouco todos os dias ajuda a manter seu progresso consistente.",
        })

        return tips[:3]
    

    def _calculate_current_streak_dates(self, sessions: list[dict]) -> list[str]:
        studied_dates = sorted({
            self._format_date(session["startTime"])
            for session in sessions
        }, reverse=True)

        if not studied_dates:
            return []

        streak = []
        expected_date = datetime.now(timezone.utc).date()

        studied_date_objects = {
            datetime.fromisoformat(date).date()
            for date in studied_dates
        }

        while expected_date in studied_date_objects:
            streak.append(expected_date.isoformat())
            expected_date = expected_date.fromordinal(expected_date.toordinal() - 1)

        return sorted(streak)
    

    def _is_same_month(self, date: datetime, reference: datetime) -> bool:
        return date.year == reference.year and date.month == reference.month
    

    def _format_month(self, date: datetime) -> str:
        return date.strftime("%Y-%m")
    

    def _format_date(self, date: datetime) -> str:
        return date.date().isoformat()
    

    def _to_iso(self, date: datetime) -> str:
        if date.tzinfo is None:
            date = date.replace(tzinfo=timezone.utc)

        return date.isoformat()
