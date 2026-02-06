try:
    from google.cloud import storage
    try:
        from google.oauth2 import service_account
        SERVICE_ACCOUNT_AVAILABLE = True
    except ImportError:
        SERVICE_ACCOUNT_AVAILABLE = False
    GCS_AVAILABLE = True
except ImportError:
    GCS_AVAILABLE = False
    SERVICE_ACCOUNT_AVAILABLE = False
    print("⚠️  Google Cloud Storage not installed. Using mock storage.")

from app.config import settings
import uuid
from datetime import timedelta
import os

# Mock storage for local testing
mock_storage = {}

def get_storage_client():
    if not GCS_AVAILABLE or settings.USE_MOCK_DB:
        return None  # Use mock storage
    
    # Use Firebase credentials for GCS
    if SERVICE_ACCOUNT_AVAILABLE and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
        try:
            credentials = service_account.Credentials.from_service_account_file(
                settings.FIREBASE_CREDENTIALS_PATH
            )
            return storage.Client(credentials=credentials, project=settings.GCP_PROJECT_ID)
        except Exception as e:
            print(f"⚠️  Failed to load credentials: {e}")
            return storage.Client(project=settings.GCP_PROJECT_ID)
    else:
        # Fallback to default credentials
        return storage.Client(project=settings.GCP_PROJECT_ID)

def upload_pdf(file_content: bytes, filename: str, team_id: str) -> tuple[str, str]:
    """Upload PDF to GCS and return (blob_name, public_url)"""
    
    # Generate unique blob name
    file_extension = filename.split('.')[-1]
    blob_name = f"prompts/{team_id}/{uuid.uuid4()}.{file_extension}"
    
    # Mock storage for local testing
    if not GCS_AVAILABLE or settings.USE_MOCK_DB:
        mock_storage[blob_name] = file_content
        mock_url = f"http://localhost:8000/mock-storage/{blob_name}"
        print(f"📁 Mock PDF uploaded: {blob_name}")
        return blob_name, mock_url
    
    # Real GCS upload
    client = get_storage_client()
    bucket = client.bucket(settings.GCS_BUCKET_NAME)
    
    blob = bucket.blob(blob_name)
    blob.upload_from_string(file_content, content_type='application/pdf')
    
    # Make blob publicly readable
    blob.make_public()
    
    # Get public URL (no expiration)
    public_url = blob.public_url
    
    print(f"📁 PDF uploaded to GCS: {blob_name}")
    print(f"🔗 Public URL: {public_url}")
    
    return blob_name, public_url

def delete_pdf(blob_name: str):
    """Delete PDF from GCS"""
    try:
        if not GCS_AVAILABLE or settings.USE_MOCK_DB:
            if blob_name in mock_storage:
                del mock_storage[blob_name]
                print(f"🗑️  Mock PDF deleted: {blob_name}")
            return
        
        client = get_storage_client()
        bucket = client.bucket(settings.GCS_BUCKET_NAME)
        blob = bucket.blob(blob_name)
        blob.delete()
    except Exception:
        pass  # Ignore if file doesn't exist
