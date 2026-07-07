import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "LaunchForge AI"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # AI API Key
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")

    # JWT Auth
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "supersecretkey_for_dev_only_change_in_prod"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    class Config:
        env_file = ".env"


settings = Settings()
