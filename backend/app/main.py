from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, profile, ai_modules, health_logs, cancer_risk

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MediConnect API",
    description="AI-powered Smart Healthcare Assistant with Oncology Focus",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://*.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(ai_modules.router)
app.include_router(health_logs.router)
app.include_router(cancer_risk.router)


@app.get("/")
def root():
    return {"message": "MediConnect API is running", "docs": "/docs"}
