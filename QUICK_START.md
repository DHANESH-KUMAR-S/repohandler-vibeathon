# 🚀 Quick Start - RepoHandler

## ✅ What's Running

- **Backend**: http://localhost:8000 (with Firebase & GCS)
- **Frontend**: http://localhost:8081 (modern animated UI)
- **API Docs**: http://localhost:8000/docs

## 🎨 New Features

### 1. Modern Animated UI
- ✨ Beautiful gradient backgrounds
- 💫 Smooth transitions and hover effects
- 🎯 Two-option landing page
- 🌊 Framer Motion animations

### 2. Team ID Generation
- 📧 Team leaders enter email
- 🎫 Get unique Team ID: `TEAM-XXXXXXXX`
- 💾 Stored in Firebase Firestore
- 🔐 Automatic authentication

### 3. Firebase Integration
- 🔥 Real Firestore database
- ☁️ GCP Cloud Storage for PDFs
- 🔒 Secure authentication
- 📊 Real-time data sync

## 🧪 Test It Now!

### Open the App
Go to: **http://localhost:8081**

### Option 1: Generate Team ID (New Team)
1. Click **"Generate Team ID"**
2. Enter email: `leader@test.com`
3. Get your Team ID (save it!)
4. Automatically logged in → Dashboard

### Option 2: Login (Existing Team)
1. Click **"Already Have Team ID"**
2. Enter Team ID: `TEAM-XXXXXXXX`
3. Enter email: `member@test.com`
4. Login → Dashboard

### Create a Project
1. Click **"Add Project"**
2. Fill in details:
   - Name: "My Awesome Project"
   - Description: "Built for Vibeathon 2025"
   - GitHub: `https://github.com/user/repo`
   - Features: Add 2-3 features (drag to reorder!)
   - PDF: Upload your project prompts
3. Click **"Submit Project"**
4. Success! 🎉

### Admin Panel
1. Go back to home
2. Click **"Admin access →"**
3. Password: `vibeathon2026`
4. View all submissions
5. Search by team/email
6. See statistics

## 🎯 Key Features

### Landing Page
- Two clear options: Generate or Login
- Animated gradient background
- Smooth card animations
- Mobile responsive

### Dashboard
- Modern gradient design
- Project statistics
- Interactive cards
- Loading animations

### Project Form
- Drag-to-reorder features
- PDF upload with validation
- Real-time validation
- Success notifications

### Admin Panel
- View all projects
- Search/filter
- Statistics dashboard
- Download PDFs

## 📊 Firebase Collections

### `teams`
```json
{
  "teamId": "TEAM-A1B2C3D4",
  "leaderEmail": "leader@college.edu",
  "createdAt": "2025-02-06T10:30:00Z"
}
```

### `projects`
```json
{
  "id": "uuid",
  "teamId": "TEAM-A1B2C3D4",
  "email": "member@college.edu",
  "name": "Project Name",
  "description": "Description",
  "githubUrl": "https://github.com/...",
  "features": [...],
  "promptPdfName": "prompts/TEAM-XXX/uuid.pdf",
  "promptPdfUrl": "https://storage.googleapis.com/...",
  "submittedAt": "2025-02-06T11:00:00Z"
}
```

## 🔧 Configuration

Your current setup:
- **Project ID**: `psyched-subset-412310`
- **Bucket**: `repohandler-pdfs`
- **Admin Password**: `vibeathon2026`
- **Using**: Real Firebase (not mock)

## 🐛 Troubleshooting

### PDF Upload Fails?
See: `TEST_PDF_UPLOAD.md` for detailed debugging

### Backend Not Starting?
```bash
cd backend
py run.py
```

### Frontend Not Loading?
```bash
npm run dev
```

### Clear Browser Cache
Press `Ctrl + Shift + R` to hard refresh

## 📁 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── auth.py (Team generation & login)
│   │   │   ├── projects.py (CRUD + PDF upload)
│   │   │   └── admin.py (Admin endpoints)
│   │   ├── services/
│   │   │   ├── firebase.py (Firestore)
│   │   │   └── storage.py (GCS)
│   │   ├── main.py
│   │   ├── models.py
│   │   └── config.py
│   ├── firebase-credentials.json
│   ├── .env
│   └── requirements.txt
│
├── src/
│   ├── pages/
│   │   ├── Landing.tsx (New animated UI!)
│   │   ├── Dashboard.tsx (New animated UI!)
│   │   ├── AddProject.tsx
│   │   ├── ViewProject.tsx
│   │   ├── AdminLogin.tsx
│   │   └── AdminDashboard.tsx
│   ├── services/
│   │   └── api.ts (API client)
│   ├── context/
│   │   └── ProjectContext.tsx
│   └── components/
│
└── Documentation/
    ├── FIREBASE_GCP_SETUP.md (Setup guide)
    ├── SETUP_COMPLETE.md (Deployment guide)
    ├── TEST_PDF_UPLOAD.md (Upload testing)
    └── QUICK_START.md (This file!)
```

## 🎨 UI Highlights

### Animations
- Gradient background pulses
- Cards scale on hover
- Smooth page transitions
- Loading spinners
- Toast notifications

### Colors
- Primary: Teal/Cyan
- Accent: Light teal
- Gradients: Dynamic backgrounds
- Dark mode ready

### Components
- Shadcn/ui components
- Framer Motion animations
- Lucide icons
- Tailwind CSS

## 🚀 Next Steps

1. ✅ Test team generation
2. ✅ Test project creation
3. ✅ Test PDF upload
4. ✅ Test admin panel
5. 📤 Deploy to production (see SETUP_COMPLETE.md)

## 💡 Tips

- **Save Team IDs**: Users need them to login
- **Test PDFs**: Upload real PDFs to verify storage
- **Check Firestore**: View data in Firebase Console
- **Monitor costs**: Check GCP billing (should be $0 for hackathon)

## 🎉 You're Ready!

Your hackathon submission platform is live with:
- ✨ Modern animated UI
- 🔥 Firebase backend
- ☁️ GCP storage
- 🎯 Team ID generation
- 📊 Admin dashboard

**Open http://localhost:8081 and start testing!** 🚀
