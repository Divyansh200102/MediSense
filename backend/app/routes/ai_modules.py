from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, HealthLog
from app.schemas import (
    SymptomTriageInput,
    ReportSimplifyInput,
    DietGeneratorInput,
    DrugInteractionInput,
    OTCFirstAidInput,
)
from app.auth import get_current_user
from app.ai_service import call_ai

router = APIRouter(prefix="/api/v1", tags=["AI Modules"])


def _log_interaction(db: Session, user_id: int, module: str, user_input: str, ai_resp: dict):
    log = HealthLog(
        user_id=user_id,
        module_used=module,
        user_input=user_input,
        ai_response=ai_resp,
    )
    db.add(log)
    db.commit()


@router.post("/symptom-triage")
def symptom_triage(
    payload: SymptomTriageInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = call_ai("SYMPTOM_TRIAGE", payload.symptoms)
    _log_interaction(db, current_user.id, "SYMPTOM_TRIAGE", payload.symptoms, result)
    return result


@router.post("/simplify-report")
def simplify_report(
    payload: ReportSimplifyInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = call_ai("REPORT_SIMPLIFIER", payload.report_text)
    _log_interaction(db, current_user.id, "REPORT_SIMPLIFIER", payload.report_text, result)
    return result


@router.post("/diet-generator")
def diet_generator(
    payload: DietGeneratorInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = call_ai("DIET_GENERATOR", payload.condition)
    _log_interaction(db, current_user.id, "DIET_GENERATOR", payload.condition, result)
    return result


@router.post("/drug-interaction")
def drug_interaction(
    payload: DrugInteractionInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    meds_str = ", ".join(payload.medications)
    result = call_ai("DRUG_INTERACTION", meds_str)
    _log_interaction(db, current_user.id, "DRUG_INTERACTION", meds_str, result)
    return result


@router.post("/otc-first-aid")
def otc_first_aid(
    payload: OTCFirstAidInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = call_ai("OTC_FIRST_AID", payload.symptoms)
    _log_interaction(db, current_user.id, "OTC_FIRST_AID", payload.symptoms, result)
    return result
