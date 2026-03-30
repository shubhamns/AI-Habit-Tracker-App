from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import User
from app.schemas import AIInsightsResponse, StatsResponse
from app.services import build_ai_insights, build_stats


router = APIRouter(tags=["analytics"])


@router.get("/stats", response_model=StatsResponse)
def stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return build_stats(db, current_user)


@router.get("/ai-insights", response_model=AIInsightsResponse)
def ai_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {"insights": build_ai_insights(db, current_user)}
