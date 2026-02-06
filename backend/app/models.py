from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime

class Feature(BaseModel):
    id: str
    text: str

class TeamMember(BaseModel):
    id: str
    name: str

class ProjectBase(BaseModel):
    teamName: str
    name: str
    description: str
    githubUrl: HttpUrl
    features: List[Feature]
    teamMembers: List[TeamMember]

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class Project(BaseModel):
    id: str
    teamId: str
    email: EmailStr
    teamName: Optional[str] = ""  # Optional for backward compatibility
    name: str
    description: str
    githubUrl: str
    features: List[Feature]
    teamMembers: Optional[List[TeamMember]] = []  # Optional for backward compatibility
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
