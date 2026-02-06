# 🔧 Fix PDF Access - Make PDFs Viewable

## What I Fixed

1. **Changed storage to use public URLs** instead of signed URLs
2. **Made PDFs clickable** in both participant and admin views
3. **Added PDF links** to project cards
4. **Auto-make blobs public** when uploading

## ✅ For New Uploads

New PDFs uploaded after restarting the backend will automatically be:
- ✅ Publicly readable
- ✅ Have permanent public URLs
- ✅ Clickable in the UI

## 🔧 Fix Existing PDFs (Already Uploaded)

Your existing PDFs in the bucket need to be made public. Here are 3 ways:

### Option 1: Make Entire Bucket Public (Easiest)

```bash
# Make all objects in bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://repohandler-pdfs
```

This makes ALL files in the bucket public (recommended for hackathon).

### Option 2: Make Individual Files Public

```bash
# List all PDFs
gsutil ls gs://repohandler-pdfs/prompts/**

# Make each file public
gsutil acl ch -u AllUsers:R gs://repohandler-pdfs/prompts/TEAM-XXX/file.pdf
```

### Option 3: Use GCP Console (Visual)

1. Go to: https://console.cloud.google.com/storage/browser/repohandler-pdfs
2. Click on a PDF file
3. Go to "Permissions" tab
4. Click "Add entry"
5. Entity: `allUsers`
6. Name: `allUsers`
7. Access: `Reader`
8. Click "Save"

Repeat for each PDF.

## 🧪 Test It Now

### Step 1: Make Bucket Public
```bash
gsutil iam ch allUsers:objectViewer gs://repohandler-pdfs
```

### Step 2: Refresh Your App
- Go to http://localhost:8081
- Login with your team
- View your project
- Click on the PDF link
- It should open in a new tab! 🎉

### Step 3: Test Admin View
- Go to admin panel
- Click on a project
- Click "View PDF"
- Should open the PDF

## 📊 What Changed in the Code

### Backend (storage.py)
```python
# Before: Signed URL (expires in 7 days)
url = blob.generate_signed_url(...)

# After: Public URL (permanent)
blob.make_public()
public_url = blob.public_url
```

### Frontend (ViewProject.tsx & AdminDashboard.tsx)
```tsx
// Before: Just showing filename
<div>{selected.promptPdfName}</div>

// After: Clickable link
<a href={selected.promptPdfUrl} target="_blank">
  View PDF
</a>
```

### ProjectCard.tsx
```tsx
// Before: Static "PDF attached" badge
<span>PDF attached</span>

// After: Clickable PDF link
<a href={project.promptPdfUrl} target="_blank">
  PDF
</a>
```

## 🔒 Security Note

Making the bucket public means anyone with the URL can view the PDFs. This is fine for a hackathon where:
- PDFs are project submissions (not sensitive)
- You want judges/admins to easily access them
- Temporary event (not long-term production)

For production with sensitive data, you'd want:
- Authenticated access only
- Signed URLs with short expiration
- Access control lists (ACLs)

## 🎯 Expected Behavior After Fix

### Participant View:
1. Go to "View Submitted Projects"
2. Click on a project
3. See "View PDF: filename.pdf" button
4. Click it → Opens PDF in new tab

### Admin View:
1. Go to Admin Panel
2. Click on any project
3. See "View PDF: filename.pdf" button
4. Click it → Opens PDF in new tab

### Project Cards:
- Show "PDF" badge (clickable)
- Click badge → Opens PDF directly
- No need to open project details

## 🐛 Troubleshooting

### "Access Denied" when clicking PDF
```bash
# Make bucket public
gsutil iam ch allUsers:objectViewer gs://repohandler-pdfs
```

### PDF link shows but doesn't work
- Check if `promptPdfUrl` is in the database
- Old projects might not have the URL
- Re-upload the PDF to get the public URL

### "gsutil command not found"
Install Google Cloud SDK:
- Windows: https://cloud.google.com/sdk/docs/install
- Or use GCP Console (Option 3 above)

### Still can't access PDFs
1. Check bucket exists:
   ```bash
   gsutil ls gs://repohandler-pdfs
   ```

2. Check file exists:
   ```bash
   gsutil ls gs://repohandler-pdfs/prompts/
   ```

3. Check permissions:
   ```bash
   gsutil iam get gs://repohandler-pdfs
   ```

## ✨ Quick Test

Upload a new PDF now:
1. Create a test project
2. Upload a PDF
3. Backend will log: "📁 PDF uploaded to GCS: ..."
4. Backend will log: "🔗 Public URL: https://storage.googleapis.com/..."
5. Click the PDF link in the UI
6. Should open immediately!

## 🚀 You're All Set!

After running:
```bash
gsutil iam ch allUsers:objectViewer gs://repohandler-pdfs
```

All PDFs (existing and new) will be:
- ✅ Publicly accessible
- ✅ Clickable in the UI
- ✅ Viewable by participants and admins
- ✅ Downloadable

Try it now! 🎉
