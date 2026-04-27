# MediSense - AI Healthcare Assistant

A full-stack AI-powered healthcare assistant with a special focus on oncology patients. Built with **FastAPI** (Python) + **React** (Vite) + **PostgreSQL** + **Google Gemini AI**.

## Features

- **Symptom Triage** — AI recommends specialists and urgency levels with oncology red-flag awareness
- **Report Simplifier** — Translates complex lab/biopsy reports into plain English
- **Diet Plan Generator** — Personalized 3-day meal plans for chemotherapy, post-surgery, and general recovery
- **Drug Interaction Checker** — Checks medication interactions with focus on chemo/OTC combinations
- **OTC & First Aid** — Recommends OTC meds and home remedies with cancer-patient safety warnings
- **Consultation History** — Browse all past AI consultations

> ⚠️ **Disclaimer:** All AI outputs include: *"I am an AI, not a doctor. Please consult your oncologist or physician before making medical decisions."*

---

## Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, React Router, Axios, Recharts, Lucide Icons |
| Backend    | Python 3.10+, FastAPI, Pydantic, SQLAlchemy, Uvicorn |
| Database   | PostgreSQL                                      |
| AI         | Google Gemini API (gemini-1.5-flash)            |

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
# Create the PostgreSQL database
createdb medisense
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from example
cp .env.example .env
# Edit .env and set your DATABASE_URL, SECRET_KEY, and GEMINI_API_KEY

# Run the server
uvicorn app.main:app --reload --port 8000
```

The API docs will be at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be at: [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
medisense/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── config.py        # Settings / env vars
│   │   ├── database.py      # SQLAlchemy engine & session
│   │   ├── models.py        # User, MedicalProfile, HealthLog
│   │   ├── schemas.py       # Pydantic request/response models
│   │   ├── auth.py          # JWT auth utilities
│   │   ├── ai_service.py    # Gemini AI wrapper + system prompts
│   │   └── routes/
│   │       ├── auth.py      # /api/v1/auth/*
│   │       ├── profile.py   # /api/v1/profile/*
│   │       ├── ai_modules.py# /api/v1/symptom-triage, etc.
│   │       └── health_logs.py# /api/v1/history
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
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
│   │       └── History.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

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
| GET    | `/api/v1/history/`         | Yes  | Get consultation history           |
