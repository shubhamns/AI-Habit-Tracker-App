from collections import Counter, defaultdict
from datetime import date, timedelta

from sqlalchemy.orm import Session, selectinload

from app.models import Habit, HabitLog, User


def get_user_habits(db: Session, user_id: int) -> list[Habit]:
    return (
        db.query(Habit)
        .options(selectinload(Habit.logs))
        .filter(Habit.user_id == user_id)
        .order_by(Habit.created_at.desc())
        .all()
    )


def calculate_streak(logs: list[HabitLog]) -> int:
    completed_dates = {log.date for log in logs if log.completed}
    streak = 0
    current_day = date.today()

    while current_day in completed_dates:
        streak += 1
        current_day -= timedelta(days=1)

    return streak


def build_stats(db: Session, user: User) -> dict:
    habits = get_user_habits(db, user.id)
    today = date.today()
    week_days = [today - timedelta(days=offset) for offset in range(6, -1, -1)]
    logs = (
        db.query(HabitLog, Habit.name)
        .join(Habit, Habit.id == HabitLog.habit_id)
        .filter(
            Habit.user_id == user.id,
            HabitLog.date >= today - timedelta(days=6),
            HabitLog.date <= today,
            HabitLog.completed.is_(True),
        )
        .all()
    )

    completed_by_day = Counter(log.date.isoformat() for log, _ in logs)
    completed_today = completed_by_day.get(today.isoformat(), 0)
    weekly_slots = max(len(habits) * 7, 1)
    weekly_completion_rate = round((len(logs) / weekly_slots) * 100, 1)

    weekly_progress = [
        {
            "date": day.strftime("%a"),
            "completed": completed_by_day.get(day.isoformat(), 0),
        }
        for day in week_days
    ]

    habit_completion_counter = defaultdict(int)
    for log, habit_name in logs:
        habit_completion_counter[habit_name] += 1

    habit_completion = [
        {"habit": habit.name, "completed": habit_completion_counter.get(habit.name, 0)}
        for habit in habits
    ]

    current_streak = max((calculate_streak(habit.logs) for habit in habits), default=0)

    return {
        "current_streak": current_streak,
        "completed_today": completed_today,
        "weekly_completion_rate": weekly_completion_rate,
        "weekly_progress": weekly_progress,
        "habit_completion": habit_completion,
    }


def build_ai_insights(db: Session, user: User) -> list[dict]:
    habits = get_user_habits(db, user.id)
    if not habits:
        return [
            {
                "title": "Build your first habit",
                "detail": "Create a habit and log it for a few days to unlock tailored insights.",
            }
        ]

    all_logs = (
        db.query(HabitLog, Habit.name)
        .join(Habit, Habit.id == HabitLog.habit_id)
        .filter(Habit.user_id == user.id)
        .order_by(HabitLog.date.asc())
        .all()
    )

    if not all_logs:
        return [
            {
                "title": "No tracking history yet",
                "detail": "Start checking off habits daily and the insight engine will spot consistency patterns.",
            }
        ]

    weekday_totals = Counter()
    weekday_completions = Counter()
    habit_totals = Counter({habit.name: 0 for habit in habits})
    habit_completions = Counter()

    for habit in habits:
        created_date = habit.created_at.date()
        days_active = max((date.today() - created_date).days + 1, 1)
        habit_totals[habit.name] = days_active

    for log, habit_name in all_logs:
        weekday = log.date.strftime("%A")
        weekday_totals[weekday] += 1
        if log.completed:
            weekday_completions[weekday] += 1
            habit_completions[habit_name] += 1

    insights = []
    weekday_rates = []
    for weekday in weekday_totals:
        weekday_rates.append((weekday, weekday_completions[weekday] / max(weekday_totals[weekday], 1)))

    if weekday_rates:
        weakest_day, weakest_rate = min(weekday_rates, key=lambda item: item[1])
        strongest_day, strongest_rate = max(weekday_rates, key=lambda item: item[1])
        if weakest_rate < 0.6:
            insights.append(
                {
                    "title": f"Consistency dips on {weakest_day}s",
                    "detail": f"Your completion rate is lowest on {weakest_day}s. Consider a lighter routine or reminder on that day.",
                }
            )
        insights.append(
            {
                "title": f"{strongest_day}s are your strongest",
                "detail": f"You complete habits most reliably on {strongest_day}s with a {round(strongest_rate * 100)}% hit rate.",
            }
        )

    if habit_completions:
        best_habit, best_count = max(habit_completions.items(), key=lambda item: item[1])
        insights.append(
            {
                "title": f"{best_habit} is your anchor habit",
                "detail": f"You've completed {best_habit} {best_count} times, making it your most consistent behavior.",
            }
        )

    if len(insights) < 3:
        total_completed = sum(1 for log, _ in all_logs if log.completed)
        insights.append(
            {
                "title": "Momentum check",
                "detail": f"You have logged {total_completed} total completions so far. Small daily wins are stacking up.",
            }
        )

    return insights[:3]
