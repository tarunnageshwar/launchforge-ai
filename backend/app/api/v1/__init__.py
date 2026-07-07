from fastapi import APIRouter
from app.api.v1 import (
    auth,
    users,
    projects,
    idea_validator,
    market_research,
    competitor_analysis,
    business_model,
    financial_forecast,
    brand_asset,
    pitch_deck,
    mvp_scoper,
    user_personas,
    gtm_strategy,
    legal_compliance,
    growth_experiments,
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(
    idea_validator.router, prefix="/projects", tags=["idea_validator"]
)
api_router.include_router(
    market_research.router, prefix="/projects", tags=["market_research"]
)
api_router.include_router(
    competitor_analysis.router, prefix="/projects", tags=["competitor_analysis"]
)
api_router.include_router(
    business_model.router, prefix="/projects", tags=["business_model"]
)
api_router.include_router(
    financial_forecast.router, prefix="/projects", tags=["financial_forecast"]
)
api_router.include_router(
    brand_asset.router, prefix="/projects", tags=["brand_asset"]
)
api_router.include_router(
    pitch_deck.router, prefix="/projects", tags=["pitch_deck"]
)
api_router.include_router(
    mvp_scoper.router, prefix="/projects", tags=["mvp_scoper"]
)
api_router.include_router(
    user_personas.router, prefix="/projects", tags=["user_personas"]
)
api_router.include_router(
    gtm_strategy.router, prefix="/projects", tags=["gtm_strategy"]
)
api_router.include_router(
    legal_compliance.router, prefix="/projects", tags=["legal_compliance"]
)
api_router.include_router(
    growth_experiments.router, prefix="/projects", tags=["growth_experiments"]
)
