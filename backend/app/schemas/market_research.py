from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


class MarketResearchBase(BaseModel):
    tam_sam_som: Dict[str, Any]
    target_demographics: List[Dict[str, Any]]
    market_trends: List[Dict[str, Any]]


class MarketResearchCreate(MarketResearchBase):
    project_id: str


class MarketResearchResponse(MarketResearchBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
