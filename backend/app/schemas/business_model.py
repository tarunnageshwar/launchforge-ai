from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


class BusinessModelBase(BaseModel):
    canvas_data: Dict[str, List[str]]


class BusinessModelCreate(BusinessModelBase):
    project_id: str


class BusinessModelResponse(BusinessModelBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
