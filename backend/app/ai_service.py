import json
import google.generativeai as genai
from app.config import get_settings

settings = get_settings()

MEDICAL_DISCLAIMER = (
    "⚠️ DISCLAIMER: I am an AI, not a doctor. "
    "Please consult your oncologist or physician before making medical decisions."
)

SYSTEM_PROMPTS = {
    "SYMPTOM_TRIAGE": (
        "You are a medical triage AI. The user will provide symptoms. "
        "Identify potential causes, focusing on general health but keeping high awareness "
        "for oncological red flags (e.g., unexplained weight loss, persistent lumps). "
        "Output the recommended specialist (e.g., Medical Oncologist, General Physician) "
        "and an urgency level (Low, Medium, High). "
        'Return as JSON with keys: "potential_causes" (list of strings), '
        '"recommended_specialist" (string), "urgency" (string: Low/Medium/High), '
        '"explanation" (string).'
    ),
    "REPORT_SIMPLIFIER": (
        "You are an empathetic medical translator. The user will paste text from a lab or "
        "biopsy report (e.g., CBC, tumor markers like CEA/CA-125, or histology reports). "
        "Explain the terms in 'Explain Like I'm 5' plain English. Do not diagnose. "
        "Explain what the markers generally mean and if the values are typically considered "
        "high or low based on standard reference ranges. "
        'Return as JSON with keys: "simplified_explanation" (string), '
        '"key_terms" (list of objects with "term" and "meaning"), '
        '"general_assessment" (string).'
    ),
    "DIET_GENERATOR": (
        "You are an oncology and clinical nutritionist. The user will provide their condition "
        "(e.g., undergoing chemotherapy, post-surgery, or general illness like Typhoid). "
        "Generate a 3-day meal plan. If the user is a cancer patient, focus on foods that "
        "combat nausea, maintain weight, and are easy to swallow/digest. "
        "Return strictly in JSON format: "
        '{"day_1": {"breakfast": "", "lunch": "", "dinner": "", "snack": ""}, '
        '"day_2": {"breakfast": "", "lunch": "", "dinner": "", "snack": ""}, '
        '"day_3": {"breakfast": "", "lunch": "", "dinner": "", "snack": ""}, '
        '"tips": ["tip1", "tip2"]}.'
    ),
    "DRUG_INTERACTION": (
        "You are a clinical pharmacist AI. The user will provide a list of medications. "
        "Check for known interactions, especially focusing on how common OTC drugs "
        "(like Ibuprofen, Omeprazole, or herbal supplements) interact with targeted therapies "
        "or chemotherapy drugs (e.g., Tamoxifen, Methotrexate). "
        "Return a risk level (Safe, Moderate, High) and a brief 2-sentence explanation. "
        'Return as JSON with keys: "interactions" (list of objects with "drug_pair", '
        '"risk_level" (Safe/Moderate/High), "explanation"), '
        '"overall_risk" (Safe/Moderate/High), "summary" (string).'
    ),
    "OTC_FIRST_AID": (
        "Suggest standard OTC medications or home remedies for minor symptoms "
        "(e.g., mild fever, chemotherapy-induced mild nausea, headache). "
        "Always add a disclaimer that cancer patients must clear any OTC drugs with their "
        "oncologist first to avoid liver/kidney strain. "
        'Return as JSON with keys: "recommendations" (list of objects with "remedy" and '
        '"usage_notes"), "warnings" (list of strings), "cancer_patient_note" (string).'
    ),
}


def _configure_genai():
    genai.configure(api_key=settings.GEMINI_API_KEY)


def call_ai(prompt_key: str, user_message: str) -> dict:
    _configure_genai()
    system_prompt = SYSTEM_PROMPTS.get(prompt_key, "")

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.3,
        ),
    )

    try:
        response = model.generate_content(user_message)
        raw_text = response.text.strip()
        parsed = json.loads(raw_text)
        parsed["disclaimer"] = MEDICAL_DISCLAIMER
        return parsed
    except json.JSONDecodeError:
        return {
            "raw_response": response.text if response else "",
            "disclaimer": MEDICAL_DISCLAIMER,
            "error": "AI returned non-JSON response. Showing raw text.",
        }
    except Exception as e:
        return {
            "error": f"AI service unavailable: {str(e)}",
            "disclaimer": MEDICAL_DISCLAIMER,
        }
