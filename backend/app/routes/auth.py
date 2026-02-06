from fastapi import APIRouter, HTTPException, status
from app.models import TeamSession, AdminLogin, TeamCreate
from app.config import settings
from app.services.firebase import get_db
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/generate-team")
async def generate_team(team: TeamCreate):
    """Generate a new team ID for team leader"""
    db = get_db()
    
    # Generate unique team ID
    team_id = f"TEAM-{str(uuid.uuid4())[:8].upper()}"
    
    # Store team in database
    team_data = {
        "teamId": team_id,
        "leaderEmail": team.leaderEmail,
        "createdAt": datetime.utcnow().isoformat(),
    }
    
    db.collection('teams').document(team_id).set(team_data)
    
    # Generate token
    token = f"{team_id}:{team.leaderEmail}"
    
    return {
        "teamId": team_id,
        "email": team.leaderEmail,
        "token": token,
        "message": "Team created successfully"
    }

@router.post("/team-login")
async def team_login(session: TeamSession):
    """Authenticate team with ID and email"""
    # Validate team credentials
    if len(session.teamId.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid team ID"
        )
    
    # Generate simple token (enhance with JWT in production)
    token = f"{session.teamId}:{session.email}"
    
    return {
        "token": token,
        "teamId": session.teamId,
        "email": session.email
    }

@router.post("/admin-login")
async def admin_login(credentials: AdminLogin):
    """Authenticate admin"""
    if credentials.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin password"
        )
    
    return {
        "token": "admin_token",
        "role": "admin"
    }
