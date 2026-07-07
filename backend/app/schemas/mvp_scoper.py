from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class MVPScoperBase(BaseModel):
    must_have_features: List[Dict[str, str]]
    should_have_features: List[Dict[str, str]]
    nice_to_have_features: List[Dict[str, str]]
    timeline: List[Dict[str, Any]]
    # expected structure for features:
    # { "name": "Auth", "description": "User login" }
    # timeline:
    # { "phase": "Weeks 1-2", "description": "Core setup", "milestones": ["DB schema", "Auth setup"] }

class MVPScoperCreate(MVPScoperBase):
    project_id: str

class MVPScoperResponse(MVPScoperBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
