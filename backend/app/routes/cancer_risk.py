import os
import pickle
import numpy as np
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, HealthLog
from app.schemas import CancerRiskInput
from app.auth import get_current_user

router = APIRouter(prefix="/api/v1", tags=["Cancer Risk Assessment"])

# ── Load model at module level (once) ────────────────────────────────────────

_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "ml", "cancer_model.pkl")

_model_bundle = None


def _get_model():
    global _model_bundle
    if _model_bundle is None:
        with open(os.path.abspath(_MODEL_PATH), "rb") as f:
            _model_bundle = pickle.load(f)
    return _model_bundle


# ── Clinical insights per cancer type ────────────────────────────────────────

CLINICAL_INSIGHTS = {
    "Lung Cancer": {
        "description": "Lung cancer is strongly associated with smoking, chronic cough, and occupational exposure to carcinogens.",
        "screening": ["Low-dose CT scan (LDCT) annually for high-risk individuals", "Chest X-ray", "Sputum cytology"],
        "prevention": ["Quit smoking immediately", "Avoid secondhand smoke", "Test home for radon", "Limit occupational carcinogen exposure"],
        "specialist": "Pulmonologist / Medical Oncologist",
    },
    "Breast Cancer": {
        "description": "Breast cancer risk increases with age, family history, and hormonal factors. Early detection significantly improves outcomes.",
        "screening": ["Mammogram every 1-2 years (age 40+)", "Clinical breast exam", "Breast MRI for high-risk patients", "Self-examination monthly"],
        "prevention": ["Maintain healthy weight", "Regular physical activity", "Limit alcohol consumption", "Discuss hormone therapy risks with doctor"],
        "specialist": "Breast Surgeon / Medical Oncologist",
    },
    "Colorectal Cancer": {
        "description": "Colorectal cancer is linked to diet, sedentary lifestyle, and family history. Blood in stool is a key warning sign.",
        "screening": ["Colonoscopy every 10 years (age 45+)", "Fecal occult blood test (FOBT) annually", "Stool DNA test", "Flexible sigmoidoscopy every 5 years"],
        "prevention": ["High-fiber diet with fruits and vegetables", "Limit red and processed meat", "Regular exercise", "Maintain healthy weight"],
        "specialist": "Gastroenterologist / Colorectal Surgeon",
    },
    "Skin Cancer": {
        "description": "Skin cancer is primarily caused by UV radiation exposure. Unusual skin changes, new moles, or changing moles are key warning signs.",
        "screening": ["Annual skin exam by dermatologist", "Monthly self-skin checks", "Dermoscopy for suspicious lesions"],
        "prevention": ["Use broad-spectrum SPF 30+ sunscreen daily", "Avoid tanning beds", "Wear protective clothing", "Seek shade during peak UV hours (10am-4pm)"],
        "specialist": "Dermatologist / Surgical Oncologist",
    },
    "Stomach Cancer": {
        "description": "Stomach cancer is associated with H. pylori infection, smoking, alcohol use, and dietary factors. Difficulty swallowing and weight loss are common symptoms.",
        "screening": ["Upper endoscopy (EGD)", "H. pylori testing", "Barium swallow study"],
        "prevention": ["Treat H. pylori infection", "Eat more fruits and vegetables", "Reduce salt and smoked foods", "Quit smoking"],
        "specialist": "Gastroenterologist / Medical Oncologist",
    },
    "Prostate Cancer": {
        "description": "Prostate cancer is the most common cancer in men. Risk increases with age and family history. Often slow-growing.",
        "screening": ["PSA blood test (discuss with doctor at age 50, or 40-45 if high risk)", "Digital rectal exam (DRE)", "Prostate MRI if PSA elevated"],
        "prevention": ["Healthy diet rich in tomatoes, cruciferous vegetables", "Regular exercise", "Maintain healthy weight", "Discuss screening timeline with doctor"],
        "specialist": "Urologist / Radiation Oncologist",
    },
    "Cervical Cancer": {
        "description": "Cervical cancer is strongly linked to HPV infection. Regular screening can detect precancerous changes early.",
        "screening": ["Pap smear every 3 years (age 21-65)", "HPV test every 5 years (age 30+)", "Combined Pap + HPV co-testing"],
        "prevention": ["HPV vaccination (ideally before age 26)", "Safe sexual practices", "Don't smoke", "Regular screening"],
        "specialist": "Gynecologic Oncologist",
    },
    "Liver Cancer": {
        "description": "Liver cancer is associated with chronic liver disease, hepatitis B/C, heavy alcohol use, and obesity.",
        "screening": ["Ultrasound every 6 months for high-risk patients", "Alpha-fetoprotein (AFP) blood test", "CT or MRI scan"],
        "prevention": ["Limit alcohol consumption", "Get hepatitis B vaccination", "Treat hepatitis C", "Maintain healthy weight", "Avoid aflatoxin-contaminated foods"],
        "specialist": "Hepatologist / Medical Oncologist",
    },
    "Low Risk": {
        "description": "Based on your inputs, your overall cancer risk appears low. Continue healthy habits and regular screenings.",
        "screening": ["Age-appropriate routine cancer screenings", "Annual physical exam", "Discuss family history with your doctor"],
        "prevention": ["Maintain a healthy diet and weight", "Exercise regularly", "Avoid tobacco and limit alcohol", "Stay up to date on vaccinations"],
        "specialist": "Primary Care Physician",
    },
}


def _log_interaction(db: Session, user_id: int, user_input: str, ai_resp: dict):
    log = HealthLog(
        user_id=user_id,
        module_used="CANCER_RISK",
        user_input=user_input,
        ai_response=ai_resp,
    )
    db.add(log)
    db.commit()


@router.post("/cancer-risk")
def cancer_risk_assessment(
    payload: CancerRiskInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    bundle = _get_model()
    cancer_clf = bundle["cancer_clf"]
    stage_clf = bundle["stage_clf"]
    le_cancer = bundle["le_cancer"]
    le_stage = bundle["le_stage"]
    features = bundle["features"]

    # Build feature vector in the correct order
    X = np.array([[
        payload.age, payload.gender, payload.bmi,
        payload.smoking, payload.alcohol, payload.physical_activity,
        payload.family_history, payload.chronic_disease,
        payload.fatigue, payload.weight_loss, payload.persistent_pain,
        payload.lump_detected, payload.blood_in_stool_urine,
        payload.chronic_cough, payload.skin_changes, payload.difficulty_swallowing,
    ]])

    # Predict cancer type with probabilities
    cancer_probs = cancer_clf.predict_proba(X)[0]
    cancer_pred_idx = np.argmax(cancer_probs)
    cancer_type = le_cancer.inverse_transform([cancer_pred_idx])[0]
    cancer_confidence = round(float(cancer_probs[cancer_pred_idx]) * 100, 1)

    # Top 3 cancer types
    top3_indices = np.argsort(cancer_probs)[::-1][:3]
    top3 = [
        {
            "cancer_type": le_cancer.inverse_transform([i])[0],
            "probability": round(float(cancer_probs[i]) * 100, 1),
        }
        for i in top3_indices
    ]

    # Predict stage
    stage_probs = stage_clf.predict_proba(X)[0]
    stage_pred_idx = np.argmax(stage_probs)
    predicted_stage = le_stage.inverse_transform([stage_pred_idx])[0]
    stage_confidence = round(float(stage_probs[stage_pred_idx]) * 100, 1)

    # Stage breakdown
    stage_breakdown = [
        {
            "stage": le_stage.inverse_transform([i])[0],
            "probability": round(float(stage_probs[i]) * 100, 1),
        }
        for i in range(len(stage_probs))
    ]

    # Overall risk score (weighted by non-Low-Risk probability)
    low_risk_idx = list(le_cancer.classes_).index("Low Risk")
    risk_score = round((1.0 - float(cancer_probs[low_risk_idx])) * 100, 1)

    # Clinical insights for the predicted type
    insights = CLINICAL_INSIGHTS.get(cancer_type, CLINICAL_INSIGHTS["Low Risk"])

    result = {
        "predicted_cancer": cancer_type,
        "cancer_confidence": cancer_confidence,
        "risk_score": risk_score,
        "top_3_cancers": top3,
        "predicted_stage": predicted_stage,
        "stage_confidence": stage_confidence,
        "stage_breakdown": stage_breakdown,
        "clinical_insights": insights,
        "disclaimer": (
            "⚠️ DISCLAIMER: This AI risk estimation model is trained on real-world clinical datasets "
            "(Breast Cancer Wisconsin, Lung Cancer Survey, UCI Cervical Cancer Risk Factors — "
            "1,736 patient records total). It is NOT a medical diagnosis. Please consult a qualified "
            "oncologist or physician for proper evaluation, screening, and diagnosis."
        ),
    }

    # Log the interaction
    input_summary = f"age={payload.age}, gender={'M' if payload.gender else 'F'}, bmi={payload.bmi}"
    _log_interaction(db, current_user.id, input_summary, result)

    return result
