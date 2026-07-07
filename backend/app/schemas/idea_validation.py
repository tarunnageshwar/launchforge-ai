from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


class IdeaValidationBase(BaseModel):
    overall_score: int
    problem_analysis: Dict[str, Any]
    solution_analysis: Dict[str, Any]


class IdeaValidationCreate(IdeaValidationBase):
    project_id: str


class IdeaValidationResponse(IdeaValidationBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
