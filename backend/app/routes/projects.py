from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from app.models import Project, ProjectCreate, ProjectUpdate
from app.dependencies import get_current_user
from app.services.firebase import get_db
from app.services.storage import upload_pdf, delete_pdf
from typing import List, Optional
import uuid
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Project])
async def get_team_projects(user: dict = Depends(get_current_user)):
    """Get all projects for the authenticated team"""
    db = get_db()
    projects_ref = db.collection('projects')
    query = projects_ref.where('teamId', '==', user['teamId'])
    
    projects = []
    for doc in query.stream():
        data = doc.to_dict()
        data['id'] = doc.id
        projects.append(Project(**data))
    
    return projects

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: ProjectCreate,
    user: dict = Depends(get_current_user)
):
    """Create a new project"""
    db = get_db()
    
    # Check if team already has a project
    existing = db.collection('projects').where('teamId', '==', user['teamId']).limit(1).get()
    if len(list(existing)) > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team already has a project. Use update instead."
        )
    
    project_data = {
        **project.model_dump(),
        "teamId": user['teamId'],
        "email": user['email'],
        "promptPdfName": None,
        "promptPdfUrl": None,
        "submittedAt": datetime.utcnow().isoformat(),
        "githubUrl": str(project.githubUrl)
    }
    
    doc_ref = db.collection('projects').document()
    doc_ref.set(project_data)
    
    project_data['id'] = doc_ref.id
    return Project(**project_data)

@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project: ProjectUpdate,
    user: dict = Depends(get_current_user)
):
    """Update an existing project"""
    db = get_db()
    doc_ref = db.collection('projects').document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
    
    existing_data = doc.to_dict()
    if existing_data['teamId'] != user['teamId']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = {
        **project.model_dump(),
        "githubUrl": str(project.githubUrl)
    }
    doc_ref.update(update_data)
    
    updated_doc = doc_ref.get()
    result = updated_doc.to_dict()
    result['id'] = project_id
    
    return Project(**result)

@router.post("/{project_id}/upload-pdf")
async def upload_project_pdf(
    project_id: str,
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """Upload PDF for a project"""
    if file.content_type != 'application/pdf':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed"
        )
    
    db = get_db()
    doc_ref = db.collection('projects').document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
    
    existing_data = doc.to_dict()
    if existing_data['teamId'] != user['teamId']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Delete old PDF if exists
    if existing_data.get('promptPdfName'):
        delete_pdf(existing_data.get('promptPdfName'))
    
    # Upload new PDF
    content = await file.read()
    blob_name, url = upload_pdf(content, file.filename, user['teamId'])
    
    # Update project
    doc_ref.update({
        'promptPdfName': blob_name,
        'promptPdfUrl': url
    })
    
    return {
        "filename": file.filename,
        "blobName": blob_name,
        "url": url
    }

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    user: dict = Depends(get_current_user)
):
    """Delete a project"""
    db = get_db()
    doc_ref = db.collection('projects').document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")
    
    existing_data = doc.to_dict()
    if existing_data['teamId'] != user['teamId']:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Delete PDF if exists
    if existing_data.get('promptPdfName'):
        delete_pdf(existing_data.get('promptPdfName'))
    
    doc_ref.delete()
    return None
