from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import User, HealthLog
from app.schemas import HealthLogOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/v1/history", tags=["Health Logs"])


@router.get("/", response_model=List[HealthLogOut])
def get_history(
    module: Optional[str] = Query(None, description="Filter by module name"),
    limit: int = Query(50, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(HealthLog).filter(HealthLog.user_id == current_user.id)
    if module:
        query = query.filter(HealthLog.module_used == module)
    return query.order_by(HealthLog.created_at.desc()).limit(limit).all()
