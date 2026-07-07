from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime


class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    industry: Optional[str] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    industry: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
