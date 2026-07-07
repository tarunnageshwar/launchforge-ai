from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.pitch_deck import PitchDeck
from app.schemas.pitch_deck import PitchDeckResponse
from app.services import ai_service

router = APIRouter()

@router.post("/{project_id}/pitch_deck", response_model=PitchDeckResponse)
def generate_project_pitch_deck(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing_deck = db.query(PitchDeck).filter(PitchDeck.project_id == project.id).first()
    if existing_deck:
        return _map_pitch_deck_response(existing_deck)

    try:
        ai_result = ai_service.generate_pitch_deck(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    deck = PitchDeck(
        project_id=project.id,
        deck_data=ai_result
    )
    db.add(deck)
    db.commit()
    db.refresh(deck)
    
    return _map_pitch_deck_response(deck)

@router.get("/{project_id}/pitch_deck", response_model=PitchDeckResponse)
def get_project_pitch_deck(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    deck = db.query(PitchDeck).filter(PitchDeck.project_id == project.id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Pitch deck not found for this project")
    
    return _map_pitch_deck_response(deck)

def _map_pitch_deck_response(deck: PitchDeck) -> dict:
    return {
        "id": deck.id,
        "project_id": deck.project_id,
        "generated_at": deck.generated_at,
        "slides": deck.deck_data.get("slides", [])
    }
