# 🔥 Firebase & GCP Setup Guide

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Add project" or select existing project

2. **Project Setup**
   - Enter project name: `repohandler-vibeathon` (or your choice)
   - Enable Google Analytics (optional)
   - Click "Create project"

3. **Get Service Account Credentials**
   - In Firebase Console, click ⚙️ (Settings) → "Project settings"
   - Go to "Service accounts" tab
   - Click "Generate new private key"
   - Save the JSON file as `firebase-credentials.json`
   - **Move this file to**: `backend/firebase-credentials.json`

4. **Enable Firestore Database**
   - In Firebase Console, go to "Build" → "Firestore Database"
   - Click "Create database"
   - Choose "Start in production mode" (we'll set rules later)
   - Select location: `us-central` (or closest to you)
   - Click "Enable"

5. **Set Firestore Security Rules**
   - In Firestore, go to "Rules" tab
   - Replace with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /projects/{projectId} {
         allow read: if true;  // Admin can read all
         allow write: if request.auth != null;  // Authenticated users can write
       }
       match /teams/{teamId} {
         allow read, write: if true;  // Allow team ID generation
       }
     }
   }
   ```
   - Click "Publish"

---

## Step 2: Setup GCP Cloud Storage

1. **Enable Cloud Storage API**
   - Go to: https://console.cloud.google.com/
   - Select your Firebase project (same project ID)
   - Go to "APIs & Services" → "Library"
   - Search for "Cloud Storage API"
   - Click "Enable"

2. **Create Storage Bucket**
   - Go to "Cloud Storage" → "Buckets"
   - Click "Create bucket"
   - **Bucket name**: `repohandler-pdfs` (must be globally unique)
   - **Location type**: Region
   - **Location**: `us-central1` (or your choice)
   - **Storage class**: Standard
   - **Access control**: Fine-grained
   - Click "Create"

3. **Set Bucket Permissions** (for public PDF access)
   - Click on your bucket name
   - Go to "Permissions" tab
   - Click "Grant access"
   - **New principals**: `allUsers`
   - **Role**: "Storage Object Viewer"
   - Click "Save"
   - Confirm "Allow public access"

4. **Alternative: Use Firebase Storage** (Easier)
   - In Firebase Console, go to "Build" → "Storage"
   - Click "Get started"
   - Choose "Start in production mode"
   - Select location (same as Firestore)
   - Click "Done"
   - Go to "Rules" tab:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /prompts/{teamId}/{fileName} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

---

## Step 3: Configure Backend

1. **Copy your Firebase credentials**
   ```bash
   # Make sure firebase-credentials.json is in backend folder
   # File should look like:
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "...",
     "private_key": "...",
     ...
   }
   ```

2. **Create backend/.env file**
   ```bash
   cd backend
   # Copy from example
   cp .env.example .env
   ```

3. **Edit backend/.env**
   ```env
   GCP_PROJECT_ID=your-firebase-project-id
   FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
   GCS_BUCKET_NAME=repohandler-pdfs
   CORS_ORIGINS=http://localhost:8080,http://localhost:5173
   ADMIN_PASSWORD=your-secure-password-here
   USE_MOCK_DB=False
   ```

4. **Install Firebase dependencies**
   ```bash
   cd backend
   pip install firebase-admin google-cloud-storage google-cloud-firestore
   ```

5. **Test the connection**
   ```bash
   py run.py
   ```
   - Should see: "Firebase initialized successfully" (no mock warning)

---

## Step 4: Get Your Project Details

Run this to find your project ID:
```bash
# In backend folder with firebase-credentials.json
py -c "import json; print('Project ID:', json.load(open('firebase-credentials.json'))['project_id'])"
```

Or check in Firebase Console:
- Settings → Project settings → Project ID

---

## Step 5: Verify Setup

1. **Test Firestore**
   - Go to Firebase Console → Firestore Database
   - You should see it's ready (no data yet)

2. **Test Storage**
   - Go to Firebase Console → Storage
   - You should see your bucket ready

3. **Test Backend**
   ```bash
   cd backend
   py test_local.py
   ```
   - All tests should pass
   - Check Firestore - you should see a new project document!

---

## 🔒 Security Notes

### For Production:

1. **Change Admin Password**
   - Update `ADMIN_PASSWORD` in `.env`
   - Use a strong password (20+ chars)

2. **Restrict CORS**
   - Update `CORS_ORIGINS` to only your production domain
   - Remove localhost URLs

3. **Firestore Rules** (Production)
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /projects/{projectId} {
         // Only project owner can update
         allow read: if true;
         allow create: if request.auth != null;
         allow update, delete: if request.auth != null && 
           resource.data.teamId == request.auth.token.teamId;
       }
       match /teams/{teamId} {
         allow read: if true;
         allow create: if true;
         allow update, delete: if false;
       }
     }
   }
   ```

4. **Storage Rules** (Production)
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /prompts/{teamId}/{fileName} {
         allow read: if true;
         allow write: if request.auth != null;
         allow delete: if false;  // Prevent deletion
       }
     }
   }
   ```

---

## 💰 Cost Estimation (with $300 credit)

### Free Tier Includes:
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB/day downloads
- **Cloud Run**: 2M requests/month

### For Hackathon (100 teams):
- **Firestore**: ~100 documents = FREE
- **Storage**: ~100 PDFs (10MB each) = 1GB = FREE
- **Cloud Run**: ~10K requests = FREE

**Estimated Cost**: $0 (well within free tier!)

---

## 🚀 Next Steps

After setup:
1. ✅ Restart backend server
2. ✅ Test with frontend
3. ✅ Deploy to production (Cloud Run)
4. ✅ Update frontend with production API URL

---

## 🐛 Troubleshooting

### "Module not found: firebase_admin"
```bash
pip install firebase-admin google-cloud-storage google-cloud-firestore
```

### "Permission denied" errors
- Check firebase-credentials.json is in backend folder
- Verify project ID matches in .env
- Check IAM permissions in GCP Console

### "Bucket not found"
- Verify bucket name in .env matches GCP
- Check bucket exists in Cloud Storage console
- Ensure bucket is in same project

### Firestore connection fails
- Verify credentials file path
- Check project ID is correct
- Enable Firestore API in GCP Console

---

## 📞 Need Help?

- Firebase Docs: https://firebase.google.com/docs
- GCP Docs: https://cloud.google.com/docs
- Firestore Quickstart: https://firebase.google.com/docs/firestore/quickstart
