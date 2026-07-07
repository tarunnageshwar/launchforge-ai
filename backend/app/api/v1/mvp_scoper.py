# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.mvp_scoper import MVPScoper
from app.schemas.mvp_scoper import MVPScoperResponse
from app.services import ai_service

router = APIRouter()

@router.post("/{project_id}/mvp_scoper", response_model=MVPScoperResponse)
def generate_project_mvp_scope(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing_scope = db.query(MVPScoper).filter(MVPScoper.project_id == project.id).first()
    if existing_scope:
        return _map_mvp_scoper_response(existing_scope)

    try:
        ai_result = ai_service.generate_mvp_scope(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    scope = MVPScoper(
        project_id=project.id,
        scoper_data=ai_result
    )
    db.add(scope)
    db.commit()
    db.refresh(scope)
    
    return _map_mvp_scoper_response(scope)

@router.get("/{project_id}/mvp_scoper", response_model=MVPScoperResponse)
def get_project_mvp_scope(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    scope = db.query(MVPScoper).filter(MVPScoper.project_id == project.id).first()
    if not scope:
        raise HTTPException(status_code=404, detail="MVP scope not found for this project")
    
    return _map_mvp_scoper_response(scope)

def _map_mvp_scoper_response(scope: MVPScoper) -> dict:
    return {
        "id": scope.id,
        "project_id": scope.project_id,
        "generated_at": scope.generated_at,
        "must_have_features": scope.scoper_data.get("must_have_features", []),
        "should_have_features": scope.scoper_data.get("should_have_features", []),
        "nice_to_have_features": scope.scoper_data.get("nice_to_have_features", []),
        "timeline": scope.scoper_data.get("timeline", [])
    }
