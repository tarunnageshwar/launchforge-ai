from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.legal_compliance import LegalCompliance
from app.schemas.legal_compliance import LegalComplianceResponse
from app.services import ai_service

router = APIRouter()

@router.post("/{project_id}/legal_compliance", response_model=LegalComplianceResponse)
def generate_project_legal_compliance(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing = db.query(LegalCompliance).filter(LegalCompliance.project_id == project.id).first()
    if existing:
        return _map_legal_compliance_response(existing)

    try:
        ai_result = ai_service.generate_legal_compliance(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    compliance = LegalCompliance(
        project_id=project.id,
        compliance_data=ai_result
    )
    db.add(compliance)
    db.commit()
    db.refresh(compliance)
    
    return _map_legal_compliance_response(compliance)

@router.get("/{project_id}/legal_compliance", response_model=LegalComplianceResponse)
def get_project_legal_compliance(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    compliance = db.query(LegalCompliance).filter(LegalCompliance.project_id == project.id).first()
    if not compliance:
        raise HTTPException(status_code=404, detail="Legal Compliance data not found for this project")
    
    return _map_legal_compliance_response(compliance)

def _map_legal_compliance_response(compliance: LegalCompliance) -> dict:
    return {
        "id": compliance.id,
        "project_id": compliance.project_id,
        "generated_at": compliance.generated_at,
        "corporate_structure": compliance.compliance_data.get("corporate_structure", {}),
        "compliance_requirements": compliance.compliance_data.get("compliance_requirements", []),
        "essential_documents": compliance.compliance_data.get("essential_documents", [])
    }
