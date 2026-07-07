from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.brand_asset import BrandAsset
from app.schemas.brand_asset import BrandAssetResponse
from app.services import ai_service

router = APIRouter()

@router.post("/{project_id}/brand_assets", response_model=BrandAssetResponse)
def generate_project_brand_assets(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing_asset = db.query(BrandAsset).filter(BrandAsset.project_id == project.id).first()
    if existing_asset:
        return _map_brand_asset_response(existing_asset)

    try:
        ai_result = ai_service.generate_brand_assets(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    asset = BrandAsset(
        project_id=project.id,
        brand_data=ai_result
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    
    return _map_brand_asset_response(asset)

@router.get("/{project_id}/brand_assets", response_model=BrandAssetResponse)
def get_project_brand_assets(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id, Project.user_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    asset = db.query(BrandAsset).filter(BrandAsset.project_id == project.id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Brand assets not found for this project")
    
    return _map_brand_asset_response(asset)

def _map_brand_asset_response(asset: BrandAsset) -> dict:
    return {
        "id": asset.id,
        "project_id": asset.project_id,
        "generated_at": asset.generated_at,
        "brand_name_ideas": asset.brand_data.get("brand_name_ideas", []),
        "brand_archetype": asset.brand_data.get("brand_archetype", ""),
        "color_palette": asset.brand_data.get("color_palette", []),
        "typography_suggestions": asset.brand_data.get("typography_suggestions", [])
    }
