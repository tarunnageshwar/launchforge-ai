from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.idea_validation import IdeaValidation
from app.schemas.idea_validation import IdeaValidationResponse
from app.services import ai_service

router = APIRouter()


@router.post("/{project_id}/validate", response_model=IdeaValidationResponse)
def validate_project_idea(
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

    # Check if already validated
    existing_validation = (
        db.query(IdeaValidation).filter(IdeaValidation.project_id == project.id).first()
    )
    if existing_validation:
        return existing_validation

    # Call AI Service
    try:
        ai_result = ai_service.validate_idea(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Save to database
    validation = IdeaValidation(
        project_id=project.id,
        overall_score=ai_result.get("overall_score", 0),
        problem_analysis=ai_result.get("problem_analysis", {}),
        solution_analysis=ai_result.get("solution_analysis", {}),
    )
    db.add(validation)
    db.commit()
    db.refresh(validation)

    return validation


@router.get("/{project_id}/validate", response_model=IdeaValidationResponse)
def get_project_validation(
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

    validation = (
        db.query(IdeaValidation).filter(IdeaValidation.project_id == project.id).first()
    )
    if not validation:
        raise HTTPException(
            status_code=404, detail="Validation not found for this project"
        )

    return validation
