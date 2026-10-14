import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "ScamShield AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./scamshield.db")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    # Input constraints
    MAX_TEXT_LENGTH: int = 10000
    MAX_URL_LENGTH: int = 2048
    
    # Scoring Thresholds
    LOW_RISK_THRESHOLD: int = 30       # < 30 is Low Risk
    HIGH_RISK_THRESHOLD: int = 60      # >= 60 is High Risk; [30, 59] is Suspicious
    
    # Limitation Notice
    LIMITATION_NOTICE: str = (
        "ScamShield AI provides heuristic risk assessment based on known social-engineering, "
        "fraud, and phishing attack patterns. It is a risk-assessment tool, not a guarantee "
        "that a communication or URL is harmless or fraudulent."
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
