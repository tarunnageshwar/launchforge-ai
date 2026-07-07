from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class PitchDeckBase(BaseModel):
    slides: List[Dict[str, Any]]
    # expected structure for each slide:
    # {
    #   "title": "Problem",
    #   "content": ["bullet 1", "bullet 2"],
    #   "speaker_notes": "talking track"
    # }

class PitchDeckCreate(PitchDeckBase):
    project_id: str

class PitchDeckResponse(PitchDeckBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
