from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.gtm_strategy import GTMStrategy
from app.schemas.gtm_strategy import GTMStrategyResponse
from app.services import ai_service

router = APIRouter()

@router.post("/{project_id}/gtm_strategy", response_model=GTMStrategyResponse)
def generate_project_gtm_strategy(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing_strategy = db.query(GTMStrategy).filter(GTMStrategy.project_id == project.id).first()
    if existing_strategy:
        return _map_gtm_strategy_response(existing_strategy)

    try:
        ai_result = ai_service.generate_gtm_strategy(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    strategy = GTMStrategy(
        project_id=project.id,
        strategy_data=ai_result
    )
    db.add(strategy)
    db.commit()
    db.refresh(strategy)
    
    return _map_gtm_strategy_response(strategy)

@router.get("/{project_id}/gtm_strategy", response_model=GTMStrategyResponse)
def get_project_gtm_strategy(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    strategy = db.query(GTMStrategy).filter(GTMStrategy.project_id == project.id).first()
    if not strategy:
        raise HTTPException(status_code=404, detail="GTM Strategy not found for this project")
    
    return _map_gtm_strategy_response(strategy)

def _map_gtm_strategy_response(strategy: GTMStrategy) -> dict:
    return {
        "id": strategy.id,
        "project_id": strategy.project_id,
        "generated_at": strategy.generated_at,
        "phases": strategy.strategy_data.get("phases", []),
        "marketing_channels": strategy.strategy_data.get("marketing_channels", []),
        "success_metrics": strategy.strategy_data.get("success_metrics", [])
    }
