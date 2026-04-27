# MediSense — AI Healthcare Assistant

A full-stack AI-powered healthcare assistant with a focus on oncology and cancer risk detection. Built with **FastAPI** + **React** + **PostgreSQL** + **Google Gemini AI** + **scikit-learn ML**.

🔗 **Live Demo:** [https://divyansh-omega.vercel.app](https://divyansh-omega.vercel.app)

---

## Features

### AI-Powered Health Modules (Google Gemini)
- **Symptom Triage** — AI recommends specialists and urgency levels with oncology red-flag awareness
- **Report Simplifier** — Translates complex lab/biopsy reports into plain English
- **Diet Plan Generator** — Personalized 3-day meal plans for chemotherapy, post-surgery, and general recovery
- **Drug Interaction Checker** — Checks medication interactions with focus on chemo/OTC combinations
- **OTC & First Aid** — Recommends OTC meds and home remedies with cancer-patient safety warnings
- **Consultation History** — Browse all past AI consultations

### Cancer Detection & Prevention (Custom ML Model)
- **Cancer Risk Assessment** — Predicts the most likely cancer type from 16 lifestyle and symptom inputs
- **Stage Prediction** — Estimates cancer stage (I–IV) based on risk factors
- **Clinical Insights** — Provides screening recommendations, prevention tips, and specialist referrals
- **Trained on 1,736 real-world patient records** from 3 clinical datasets (see below)

> ⚠️ **Disclaimer:** All AI outputs include medical disclaimers. This tool is NOT a substitute for professional medical advice.

---

## Cancer Detection — ML Model Details

### Real-World Data Sources

| Dataset | Samples | Source |
|---------|---------|--------|
| Lung Cancer Survey | 309 | [Kaggle](https://www.kaggle.com/datasets/mysarahmadbhat/lung-cancer) / [GitHub](https://github.com/ShinjiniShome/lung_cancer_survey_dataviz) |
| Breast Cancer Wisconsin | 569 | [UCI ML Repository](https://archive.ics.uci.edu/ml/datasets/Breast+Cancer+Wisconsin+(Diagnostic)) / sklearn |
| Cervical Cancer Risk Factors | 858 | [UCI ML Repository](https://archive.ics.uci.edu/dataset/383/cervical+cancer+risk+factors) |
| **Total** | **1,736** | |

### Algorithms
- **Gradient Boosting Classifier** (scikit-learn) → Cancer type prediction (Lung, Breast, Cervical, Low Risk)
- **Random Forest Classifier** (scikit-learn) → Stage prediction (Stage I–IV)

### Accuracy (on 20% held-out test set)
- **Cancer type: 87%** (Lung Cancer: 97% F1, Breast Cancer: 73% F1)
- **Stage: 86%** (Stage I: 94% F1, Stage III: 71% F1)

### Input Features (16)
`age`, `gender`, `bmi`, `smoking`, `alcohol`, `physical_activity`, `family_history`, `chronic_disease`, `fatigue`, `weight_loss`, `persistent_pain`, `lump_detected`, `blood_in_stool_urine`, `chronic_cough`, `skin_changes`, `difficulty_swallowing`

---

## Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide Icons |
| Backend    | Python 3.10+, FastAPI, Pydantic, SQLAlchemy, Uvicorn |
| ML Model   | scikit-learn (GradientBoosting + RandomForest), pandas, numpy, pickle |
| Database   | PostgreSQL (Neon serverless)                    |
| AI         | Google Gemini API (gemini-1.5-flash)            |
| Deployment | Vercel (frontend + serverless Python backend)   |

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL** running locally
- **Google Gemini API Key** — get one at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## Setup

### 1. Database

```bash
createdb medisense
```

### 2. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env → set DATABASE_URL, SECRET_KEY, GEMINI_API_KEY

uvicorn app.main:app --reload --port 8000
```

API docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: [http://localhost:5173](http://localhost:5173)

### 4. Train Cancer Model (optional — pre-trained model is included via Vercel)

```bash
cd backend
source venv/bin/activate
python ml/train_real_data.py
```

---

## API Endpoints

| Method | Endpoint                    | Auth | Description                        |
|--------|----------------------------|------|------------------------------------|
| POST   | `/api/v1/auth/register`    | No   | Create new user account            |
| POST   | `/api/v1/auth/login`       | No   | Login, returns JWT token           |
| GET    | `/api/v1/auth/me`          | Yes  | Get current user info              |
| GET    | `/api/v1/profile/`         | Yes  | Get medical profile                |
| PUT    | `/api/v1/profile/`         | Yes  | Update medical profile             |
| POST   | `/api/v1/symptom-triage`   | Yes  | AI symptom analysis                |
| POST   | `/api/v1/simplify-report`  | Yes  | AI report simplification           |
| POST   | `/api/v1/diet-generator`   | Yes  | AI diet plan generation            |
| POST   | `/api/v1/drug-interaction` | Yes  | AI drug interaction check          |
| POST   | `/api/v1/otc-first-aid`    | Yes  | AI OTC recommendations             |
| POST   | `/api/v1/cancer-risk`      | Yes  | ML cancer risk assessment          |
| GET    | `/api/v1/history/`         | Yes  | Get consultation history           |

---

## Project Structure

```
medisense/
├── api/                    # Vercel serverless backend
│   ├── _app.py             # Consolidated backend for Vercel
│   ├── index.py            # Entry point
│   └── requirements.txt
├── backend/
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── config.py       # Settings
│   │   ├── database.py     # SQLAlchemy
│   │   ├── models.py       # DB models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # JWT auth
│   │   ├── ai_service.py   # Gemini AI wrapper
│   │   └── routes/
│   │       ├── auth.py
│   │       ├── profile.py
│   │       ├── ai_modules.py
│   │       ├── cancer_risk.py
│   │       └── health_logs.py
│   ├── ml/
│   │   ├── train_real_data.py   # Model training script
│   │   └── data/                # Real-world CSV datasets
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Disclaimer.jsx
│   │   │   └── Spinner.jsx
│   │   └── pages/
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Dashboard.jsx
│   │       ├── SymptomTriage.jsx
│   │       ├── ReportSimplifier.jsx
│   │       ├── DietPlan.jsx
│   │       ├── DrugChecker.jsx
│   │       ├── OTCFirstAid.jsx
│   │       ├── CancerDetection.jsx
│   │       └── History.jsx
│   └── package.json
├── vercel.json
└── README.md
```
