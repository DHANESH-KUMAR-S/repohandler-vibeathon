from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime

class Feature(BaseModel):
    id: str
    text: str

class ProjectBase(BaseModel):
    name: str
    description: str
    githubUrl: HttpUrl
    features: List[Feature]

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    teamId: str
    email: EmailStr
    promptPdfName: Optional[str] = None
    promptPdfUrl: Optional[str] = None
    submittedAt: str
    
    class Config:
        from_attributes = True

class TeamSession(BaseModel):
    teamId: str
    email: EmailStr

class TeamCreate(BaseModel):
    leaderEmail: EmailStr

class AdminLogin(BaseModel):
    password: str
