from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, MedicalProfile
from app.schemas import MedicalProfileCreate, MedicalProfileOut
from app.auth import get_current_user

router = APIRouter(prefix="/api/v1/profile", tags=["Medical Profile"])


@router.get("/", response_model=MedicalProfileOut)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/", response_model=MedicalProfileOut)
def update_profile(
    payload: MedicalProfileCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(MedicalProfile).filter(MedicalProfile.user_id == current_user.id).first()
    if not profile:
        profile = MedicalProfile(user_id=current_user.id)
        db.add(profile)

    if payload.age is not None:
        profile.age = payload.age
    if payload.primary_condition is not None:
        profile.primary_condition = payload.primary_condition
    if payload.current_treatments is not None:
        profile.current_treatments = payload.current_treatments
    if payload.allergies is not None:
        profile.allergies = payload.allergies

    db.commit()
    db.refresh(profile)
    return profile
