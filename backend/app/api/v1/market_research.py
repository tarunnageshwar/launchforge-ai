from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.market_research import MarketResearch
from app.schemas.market_research import MarketResearchResponse
from app.services import ai_service

router = APIRouter()


@router.post("/{project_id}/market_research", response_model=MarketResearchResponse)
def generate_project_market_research(
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
    existing_research = (
        db.query(MarketResearch).filter(MarketResearch.project_id == project.id).first()
    )
    if existing_research:
        return existing_research

    # Call AI Service
    try:
        ai_result = ai_service.generate_market_research(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Save to database
    research = MarketResearch(
        project_id=project.id,
        tam_sam_som=ai_result.get("tam_sam_som", {}),
        target_demographics=ai_result.get("target_demographics", []),
        market_trends=ai_result.get("market_trends", []),
    )
    db.add(research)
    db.commit()
    db.refresh(research)

    return research


@router.get("/{project_id}/market_research", response_model=MarketResearchResponse)
def get_project_market_research(
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

    research = (
        db.query(MarketResearch).filter(MarketResearch.project_id == project.id).first()
    )
    if not research:
        raise HTTPException(
            status_code=404, detail="Market research not found for this project"
        )

    return research
