from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.growth_experiments import GrowthExperiment
from app.schemas.growth_experiments import GrowthExperimentResponse
from app.services import ai_service

router = APIRouter()

@router.post("/{project_id}/growth_experiments", response_model=GrowthExperimentResponse)
def generate_project_growth_experiments(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing = db.query(GrowthExperiment).filter(GrowthExperiment.project_id == project.id).first()
    if existing:
        return _map_growth_experiments_response(existing)

    try:
        ai_result = ai_service.generate_growth_experiments(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    experiments = GrowthExperiment(
        project_id=project.id,
        experiment_data=ai_result
    )
    db.add(experiments)
    db.commit()
    db.refresh(experiments)
    
    return _map_growth_experiments_response(experiments)

@router.get("/{project_id}/growth_experiments", response_model=GrowthExperimentResponse)
def get_project_growth_experiments(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    experiments = db.query(GrowthExperiment).filter(GrowthExperiment.project_id == project.id).first()
    if not experiments:
        raise HTTPException(status_code=404, detail="Growth Experiments data not found for this project")
    
    return _map_growth_experiments_response(experiments)

def _map_growth_experiments_response(experiments: GrowthExperiment) -> dict:
    return {
        "id": experiments.id,
        "project_id": experiments.project_id,
        "generated_at": experiments.generated_at,
        "experiments": experiments.experiment_data.get("experiments", [])
    }
