from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class Experiment(BaseModel):
    title: str
    hypothesis: str
    metric_to_track: str
    duration_days: int

class GrowthExperimentBase(BaseModel):
    experiments: List[Experiment]

class GrowthExperimentCreate(GrowthExperimentBase):
    project_id: str

class GrowthExperimentResponse(GrowthExperimentBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
