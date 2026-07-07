from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


class CompetitorAnalysisBase(BaseModel):
    competitors: List[Dict[str, Any]]
    swot_analysis: Dict[str, Any]


class CompetitorAnalysisCreate(CompetitorAnalysisBase):
    project_id: str


class CompetitorAnalysisResponse(CompetitorAnalysisBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
