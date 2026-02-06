# RepoHandler Backend API

FastAPI backend with Firebase Authentication and GCP Cloud Storage.

## Setup

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save as `firebase-credentials.json` in the backend folder

### 3. GCP Storage Setup

1. Go to [GCP Console](https://console.cloud.google.com/)
2. Enable Cloud Storage API
3. Create a new bucket:
   ```bash
   gsutil mb -p YOUR_PROJECT_ID gs://YOUR_BUCKET_NAME
   ```
4. Set bucket permissions (public read for PDFs):
   ```bash
   gsutil iam ch allUsers:objectViewer gs://YOUR_BUCKET_NAME
   ```

### 4. Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Edit `.env`:
```
GCP_PROJECT_ID=your-project-id
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
GCS_BUCKET_NAME=your-bucket-name
CORS_ORIGINS=http://localhost:8080,https://your-domain.com
```

### 5. Run Development Server

```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at: http://localhost:8000
Docs at: http://localhost:8000/docs

## API Endpoints

### Authentication
- `POST /api/auth/team-login` - Team login
- `POST /api/auth/admin-login` - Admin login

### Projects (Team)
- `GET /api/projects/` - Get team projects
- `POST /api/projects/` - Create project
- `PUT /api/projects/{id}` - Update project
- `POST /api/projects/{id}/upload-pdf` - Upload PDF
- `DELETE /api/projects/{id}` - Delete project

### Admin
- `GET /api/admin/projects` - Get all projects
- `GET /api/admin/stats` - Get statistics

## Deployment to GCP

### Option 1: Cloud Run (Recommended)

1. Build and push container:
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/repohandler-api
```

2. Deploy:
```bash
gcloud run deploy repohandler-api \
  --image gcr.io/YOUR_PROJECT_ID/repohandler-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT_ID=YOUR_PROJECT_ID,GCS_BUCKET_NAME=YOUR_BUCKET
```

### Option 2: App Engine

Create `app.yaml`:
```yaml
runtime: python311
entrypoint: uvicorn app.main:app --host 0.0.0.0 --port $PORT

env_variables:
  GCP_PROJECT_ID: "your-project-id"
  GCS_BUCKET_NAME: "your-bucket-name"
```

Deploy:
```bash
gcloud app deploy
```

## Security Notes

- Change `ADMIN_PASSWORD` in production
- Use Firebase Custom Tokens for team auth in production
- Enable CORS only for your frontend domain
- Set up proper IAM roles for GCP services
