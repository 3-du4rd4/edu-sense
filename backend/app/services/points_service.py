import math


class PointsService:
    def calculate_points(
        self,
        duration_seconds: int,
        time_goal_minutes: int | None,
        tasks: list[dict],
        focus_average: float | None
    ) -> dict:
        duration_minutes = duration_seconds / 60

        session_completed_points = min(
            math.floor(duration_minutes / 5),
            60
        )

        time_goal_points = self._calculate_time_goal_points(
            duration_minutes=duration_minutes,
            time_goal_minutes=time_goal_minutes
        )

        completed_tasks_count = sum(
            1 for task in tasks if task.get("completed") is True
        )

        completed_tasks_points = min(completed_tasks_count * 5, 30)

        focus_bonus = self._calculate_focus_bonus(focus_average)

        earned = session_completed_points + time_goal_points + completed_tasks_points + focus_bonus

        return {
            "earned": earned,
            "breakdown": {
                "sessionCompleted": session_completed_points,
                "timeGoalAchieved": time_goal_points,
                "completedTasks": completed_tasks_points,
                "focusBonus": focus_bonus,
            },
        }
    

    def _calculate_time_goal_points(
        self,
        duration_minutes: float,
        time_goal_minutes: int | None
    ) -> int:
        if not time_goal_minutes:
            return 0

        if duration_minutes < time_goal_minutes:
            return 0
    
        bonus = round((time_goal_minutes / 5) * 0.3)

        return min(max(bonus, 5), 25)
    

    def _calculate_focus_bonus(self, focus_average: float | None) -> int:
        if focus_average is None:
            return 0

        if focus_average >= 80:
            return 20

        if focus_average >= 60:
            return 10

        return 0