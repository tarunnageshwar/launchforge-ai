from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class BrandAssetBase(BaseModel):
    brand_name_ideas: List[Dict[str, str]]
    brand_archetype: str
    color_palette: List[Dict[str, str]]
    typography_suggestions: List[Dict[str, str]]

class BrandAssetCreate(BrandAssetBase):
    project_id: str

class BrandAssetResponse(BrandAssetBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
