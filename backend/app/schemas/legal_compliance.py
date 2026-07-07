from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID
from datetime import datetime

class CorporateStructure(BaseModel):
    recommendation: str
    reasoning: str

class ComplianceRequirement(BaseModel):
    name: str
    description: str
    action_items: List[str]

class EssentialDocument(BaseModel):
    name: str
    purpose: str

class LegalComplianceBase(BaseModel):
    corporate_structure: CorporateStructure
    compliance_requirements: List[ComplianceRequirement]
    essential_documents: List[EssentialDocument]

class LegalComplianceCreate(LegalComplianceBase):
    project_id: str

class LegalComplianceResponse(LegalComplianceBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
