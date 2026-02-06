from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    GCP_PROJECT_ID: str = "demo-project"
    FIREBASE_CREDENTIALS_PATH: str = "./firebase-credentials.json"
    GCS_BUCKET_NAME: str = "demo-bucket"
    CORS_ORIGINS: str = "http://localhost:8080,http://localhost:5173"
    ADMIN_PASSWORD: str = "admin123"
    USE_MOCK_DB: bool = True  # Set to False when Firebase is configured
    
    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Set Google Application Credentials environment variable if file exists
if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(settings.FIREBASE_CREDENTIALS_PATH)
