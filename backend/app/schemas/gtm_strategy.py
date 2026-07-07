from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class GTMPhase(BaseModel):
    name: str
    duration: str
    key_activities: List[str]

class MarketingChannel(BaseModel):
    channel_name: str
    strategy: str
    budget_allocation: str

class GTMStrategyBase(BaseModel):
    phases: List[GTMPhase]
    marketing_channels: List[MarketingChannel]
    success_metrics: List[str]

class GTMStrategyCreate(GTMStrategyBase):
    project_id: str

class GTMStrategyResponse(GTMStrategyBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
