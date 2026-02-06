# 🚀 Quick Start Guide - Local Testing

## Step 1: Install Python Dependencies

Open a terminal in the `backend` folder and run:

```bash
cd backend
python -m venv venv
```

**Activate the virtual environment:**

Windows (CMD):
```bash
venv\Scripts\activate
```

Windows (PowerShell):
```bash
venv\Scripts\Activate.ps1
```

Linux/Mac:
```bash
source venv/bin/activate
```

**Install dependencies:**
```bash
pip install -r requirements.txt
```

## Step 2: Start the Server

```bash
python run.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
⚠️  Using MOCK database (in-memory)
```

The API is now running at: **http://localhost:8000**

## Step 3: Test the API

Open a **NEW terminal** (keep the server running) and run:

```bash
cd backend
python test_local.py
```

This will test all endpoints and show you the results.

## Step 4: View API Documentation

Open your browser and go to:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You can test all endpoints interactively here!

## 📝 Notes

- Currently using **MOCK database** (in-memory) - no Firebase needed for testing
- Data will be lost when you restart the server
- Admin password: `admin123`
- Test team ID: `TEAM-001`
- Test email: `test@example.com`

## 🔧 Next Steps

When ready for production:
1. Get Firebase credentials from Firebase Console
2. Save as `firebase-credentials.json` in backend folder
3. Create `.env` file from `.env.example`
4. Set `USE_MOCK_DB=False` in `.env`
5. Configure GCP Storage bucket

## 🐛 Troubleshooting

**"Module not found" error:**
```bash
pip install -r requirements.txt
```

**Port 8000 already in use:**
Edit `run.py` and change port to 8001

**Permission denied on Windows:**
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
