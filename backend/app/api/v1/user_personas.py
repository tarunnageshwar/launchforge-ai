from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.user_persona import UserPersona
from app.schemas.user_persona import UserPersonaResponse
from app.services import ai_service

router = APIRouter()

@router.post("/{project_id}/user_personas", response_model=UserPersonaResponse)
def generate_project_user_personas(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing_personas = db.query(UserPersona).filter(UserPersona.project_id == project.id).first()
    if existing_personas:
        return _map_user_personas_response(existing_personas)

    try:
        ai_result = ai_service.generate_user_personas(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    personas = UserPersona(
        project_id=project.id,
        personas_data=ai_result
    )
    db.add(personas)
    db.commit()
    db.refresh(personas)
    
    return _map_user_personas_response(personas)

@router.get("/{project_id}/user_personas", response_model=UserPersonaResponse)
def get_project_user_personas(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    personas = db.query(UserPersona).filter(UserPersona.project_id == project.id).first()
    if not personas:
        raise HTTPException(status_code=404, detail="User personas not found for this project")
    
    return _map_user_personas_response(personas)

def _map_user_personas_response(personas: UserPersona) -> dict:
    return {
        "id": personas.id,
        "project_id": personas.project_id,
        "generated_at": personas.generated_at,
        "personas": personas.personas_data.get("personas", [])
    }
