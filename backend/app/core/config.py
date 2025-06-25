from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Database settings - using SQLite for development
    DATABASE_URL: str = "sqlite:///./mma.db"
    
    # JWT settings
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # App settings
    APP_NAME: str = "MMA API"
    DEBUG: bool = True
    
    # Email configuration
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@yourdomain.com")
    
    class Config:
        env_file = ".env"

settings = Settings()