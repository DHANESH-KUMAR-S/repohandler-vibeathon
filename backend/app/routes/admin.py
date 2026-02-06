from fastapi import APIRouter, Depends, Query
from app.models import Project, ScoresUpdate
from app.dependencies import verify_admin
from app.services.firebase import get_db
from typing import List, Optional

router = APIRouter()

@router.get("/projects", response_model=List[Project])
async def get_all_projects(
    search: Optional[str] = Query(None),
    admin: dict = Depends(verify_admin)
):
    """Get all projects (admin only)"""
    db = get_db()
    projects_ref = db.collection('projects')
    
    projects = []
    for doc in projects_ref.stream():
        data = doc.to_dict()
        data['id'] = doc.id
        
        # Apply search filter if provided
        if search:
            search_lower = search.lower()
            if not any([
                search_lower in data.get('name', '').lower(),
                search_lower in data.get('teamId', '').lower(),
                search_lower in data.get('email', '').lower()
            ]):
                continue
        
        projects.append(Project(**data))
    
    # Sort by submission date (newest first)
    projects.sort(key=lambda x: x.submittedAt, reverse=True)
    
    return projects

@router.put("/projects/{project_id}/scores")
async def update_project_scores(
    project_id: str,
    scores: ScoresUpdate,
    admin: dict = Depends(verify_admin)
):
    """Update scores for a project (admin only)"""
    db = get_db()
    doc_ref = db.collection('projects').document(project_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Calculate total score
    total_score = (
        scores.innovation + 
        scores.feasibility + 
        scores.uiUx + 
        scores.promptEfficiency
    )
    
    # Update project with scores
    scores_dict = scores.model_dump()
    doc_ref.update({
        'scores': scores_dict,
        'totalScore': total_score
    })
    
    return {
        "message": "Scores updated successfully",
        "scores": scores_dict,
        "totalScore": total_score
    }

@router.get("/stats")
async def get_stats(admin: dict = Depends(verify_admin)):
    """Get submission statistics"""
    db = get_db()
    projects_ref = db.collection('projects')
    
    all_projects = list(projects_ref.stream())
    
    # Count projects with scores
    projects_with_scores = sum(1 for doc in all_projects if doc.to_dict().get('scores'))
    
    return {
        "totalProjects": len(all_projects),
        "teamsWithProjects": len(set(doc.to_dict().get('teamId') for doc in all_projects)),
        "projectsWithPdf": sum(1 for doc in all_projects if doc.to_dict().get('promptPdfName')),
        "projectsScored": projects_with_scores
    }
