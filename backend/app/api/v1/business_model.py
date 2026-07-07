from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.business_model import BusinessModel
from app.schemas.business_model import BusinessModelResponse
from app.services import ai_service

router = APIRouter()


@router.post("/{project_id}/business_model", response_model=BusinessModelResponse)
def generate_project_business_model(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify project belongs to user
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if already generated
    existing_model = (
        db.query(BusinessModel).filter(BusinessModel.project_id == project.id).first()
    )
    if existing_model:
        return existing_model

    # Call AI Service
    try:
        ai_result = ai_service.generate_business_model(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Save to database
    b_model = BusinessModel(
        project_id=project.id, canvas_data=ai_result.get("canvas_data", {})
    )
    db.add(b_model)
    db.commit()
    db.refresh(b_model)

    return b_model


@router.get("/{project_id}/business_model", response_model=BusinessModelResponse)
def get_project_business_model(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify project belongs to user
    project = (
        db.query(Project)
        .filter(Project.id == project_id, Project.user_id == current_user.id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    b_model = (
        db.query(BusinessModel).filter(BusinessModel.project_id == project.id).first()
    )
    if not b_model:
        raise HTTPException(
            status_code=404, detail="Business model not found for this project"
        )

    return b_model
