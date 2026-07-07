from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class PersonaDetail(BaseModel):
    name: str
    role: str
    demographics: Dict[str, str]
    pain_points: List[str]
    motivations: List[str]
    where_to_find_them: List[str]

class UserPersonaBase(BaseModel):
    personas: List[PersonaDetail]

class UserPersonaCreate(UserPersonaBase):
    project_id: str

class UserPersonaResponse(UserPersonaBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
