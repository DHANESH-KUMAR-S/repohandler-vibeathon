# 🚀 Testing Guide - RepoHandler Full Stack

## ✅ Both Servers Running!

### Backend API
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Status**: ✅ Running with mock database

### Frontend App
- **URL**: http://localhost:8080
- **Status**: ✅ Running and connected to backend

---

## 🧪 Test Flow

### 1. Team Login
1. Open http://localhost:8080
2. Enter credentials:
   - **Team ID**: `TEAM-001` (or any 3+ chars)
   - **Email**: `test@example.com` (or any valid email)
3. Click "Continue"
4. You should be redirected to Dashboard

### 2. Create a Project
1. Click "Add Project" card
2. Fill in the form:
   - **Project Name**: "My Hackathon Project"
   - **Description**: "An awesome project for Vibeathon"
   - **GitHub URL**: `https://github.com/username/repo`
   - **Features**: Add 2-3 features (drag to reorder)
   - **PDF** (optional): Upload a PDF file
3. Click "Submit Project"
4. You should see success message

### 3. View Projects
1. Go back to Dashboard
2. Click "View Submitted Project"
3. You should see your project
4. Click on it to view details
5. Click "Edit project" to modify

### 4. Admin Panel
1. Click "Admin access →" on login page
2. Enter password: `admin123`
3. Click "Enter Admin Panel"
4. You should see:
   - All submitted projects
   - Statistics (total projects, teams, PDFs)
   - Search functionality

### 5. Test Search (Admin)
1. In admin panel, use the search box
2. Search by team ID, email, or project name
3. Results should filter in real-time

---

## 🔍 What to Check

### ✅ Features Working:
- [x] Team login with validation
- [x] Admin login with password
- [x] Create project with features
- [x] Update existing project
- [x] Upload PDF files
- [x] View team projects
- [x] Admin view all projects
- [x] Admin statistics
- [x] Search/filter projects
- [x] Drag-to-reorder features
- [x] Form validation
- [x] Loading states
- [x] Toast notifications
- [x] Protected routes (redirect if not logged in)

### 📊 Check Browser Console:
- Open DevTools (F12)
- Go to Console tab
- Should see no errors
- Network tab should show successful API calls

### 🔄 Test Data Persistence:
**Note**: Currently using mock database (in-memory)
- Data persists while backend is running
- Data is lost when backend restarts
- This is expected for local testing

---

## 🐛 Troubleshooting

### Frontend not loading?
```bash
# Check if running on port 8080
# Open: http://localhost:8080
```

### Backend not responding?
```bash
# Check if running on port 8000
# Open: http://localhost:8000/health
```

### API errors?
1. Check browser console for error messages
2. Check backend terminal for logs
3. Verify both servers are running

### Login not working?
- Make sure backend is running
- Check `.env` file has `VITE_API_URL=http://localhost:8000`
- Clear browser localStorage and try again

---

## 📝 Test Credentials

### Team Login:
- **Team ID**: Any string (min 3 chars)
- **Email**: Any valid email format

### Admin Login:
- **Password**: `admin123`

---

## 🎯 Next Steps

Once local testing is complete:

1. **Add Firebase Credentials**
   - Get credentials from Firebase Console
   - Save as `backend/firebase-credentials.json`
   - Set `USE_MOCK_DB=False` in backend `.env`

2. **Setup GCP Storage**
   - Create GCS bucket
   - Update `GCS_BUCKET_NAME` in backend `.env`

3. **Deploy to Production**
   - Backend: GCP Cloud Run
   - Frontend: Vercel/Netlify or GCP
   - Update `VITE_API_URL` to production URL

---

## 💡 Tips

- Keep both terminal windows open to see logs
- Use browser DevTools Network tab to debug API calls
- Check backend terminal for API request logs
- Use http://localhost:8000/docs for interactive API testing
