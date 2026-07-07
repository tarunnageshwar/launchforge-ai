from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.competitor_analysis import CompetitorAnalysis
from app.schemas.competitor_analysis import CompetitorAnalysisResponse
from app.services import ai_service

router = APIRouter()


@router.post(
    "/{project_id}/competitor_analysis", response_model=CompetitorAnalysisResponse
)
def generate_project_competitor_analysis(
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
    existing_analysis = (
        db.query(CompetitorAnalysis)
        .filter(CompetitorAnalysis.project_id == project.id)
        .first()
    )
    if existing_analysis:
        return existing_analysis

    # Call AI Service
    try:
        ai_result = ai_service.generate_competitor_analysis(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Save to database
    analysis = CompetitorAnalysis(
        project_id=project.id,
        competitors=ai_result.get("competitors", []),
        swot_analysis=ai_result.get("swot_analysis", {}),
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return analysis


@router.get(
    "/{project_id}/competitor_analysis", response_model=CompetitorAnalysisResponse
)
def get_project_competitor_analysis(
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

    analysis = (
        db.query(CompetitorAnalysis)
        .filter(CompetitorAnalysis.project_id == project.id)
        .first()
    )
    if not analysis:
        raise HTTPException(
            status_code=404, detail="Competitor analysis not found for this project"
        )

    return analysis
