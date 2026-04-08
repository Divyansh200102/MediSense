from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/mediconnect"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    GEMINI_API_KEY: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
