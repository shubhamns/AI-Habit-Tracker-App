from sqlalchemy.orm import Session

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import get_current_user
from app.database import get_db
from app.models import Habit, HabitLog, User
from app.schemas import HabitCreate, HabitLogResponse, HabitResponse, HabitTrackRequest, HabitUpdate
from app.services import calculate_streak, get_user_habits


router = APIRouter(tags=["habits"])


def serialize_habit(habit: Habit) -> HabitResponse:
    return HabitResponse(
        id=habit.id,
        user_id=habit.user_id,
        name=habit.name,
        frequency=habit.frequency,
        created_at=habit.created_at,
        streak=calculate_streak(habit.logs),
        logs=[HabitLogResponse.model_validate(log) for log in habit.logs],
    )


@router.get("/habits", response_model=list[HabitResponse])
def list_habits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habits = get_user_habits(db, current_user.id)
    return [serialize_habit(habit) for habit in habits]


@router.post("/habits", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_habit(
    payload: HabitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = Habit(user_id=current_user.id, name=payload.name.strip(), frequency=payload.frequency.strip())
    db.add(habit)
    db.commit()
    db.refresh(habit)
    habit.logs = []
    return serialize_habit(habit)


@router.put("/habits/{habit_id}", response_model=HabitResponse)
def update_habit(
    habit_id: int,
    payload: HabitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    habit.name = payload.name.strip()
    habit.frequency = payload.frequency.strip()
    db.commit()
    db.refresh(habit)
    return serialize_habit(habit)


@router.delete("/habits/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_habit(
    habit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    db.delete(habit)
    db.commit()


@router.post("/track", response_model=HabitLogResponse)
def track_habit(
    payload: HabitTrackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    habit = db.query(Habit).filter(Habit.id == payload.habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    log = (
        db.query(HabitLog)
        .filter(HabitLog.habit_id == payload.habit_id, HabitLog.date == payload.date)
        .first()
    )
    if log:
        log.completed = payload.completed
    else:
        log = HabitLog(habit_id=payload.habit_id, date=payload.date, completed=payload.completed)
        db.add(log)

    db.commit()
    db.refresh(log)
    return log


@router.get("/logs", response_model=list[HabitLogResponse])
def get_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(HabitLog)
        .join(Habit, Habit.id == HabitLog.habit_id)
        .filter(Habit.user_id == current_user.id)
        .order_by(HabitLog.date.desc())
        .all()
    )
