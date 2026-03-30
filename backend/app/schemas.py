from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserResponse"


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HabitBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    frequency: str = Field(default="daily", min_length=1, max_length=80)


class HabitCreate(HabitBase):
    pass


class HabitUpdate(HabitBase):
    pass


class HabitLogResponse(BaseModel):
    id: int
    habit_id: int
    date: date
    completed: bool

    model_config = ConfigDict(from_attributes=True)


class HabitResponse(BaseModel):
    id: int
    user_id: int
    name: str
    frequency: str
    created_at: datetime
    streak: int = 0
    logs: list[HabitLogResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class HabitTrackRequest(BaseModel):
    habit_id: int
    date: date
    completed: bool = True


class StatsResponse(BaseModel):
    current_streak: int
    completed_today: int
    weekly_completion_rate: float
    weekly_progress: list[dict]
    habit_completion: list[dict]


class AIInsightItem(BaseModel):
    title: str
    detail: str


class AIInsightsResponse(BaseModel):
    insights: list[AIInsightItem]


Token.model_rebuild()
