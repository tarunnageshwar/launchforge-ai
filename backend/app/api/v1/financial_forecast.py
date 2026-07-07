from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.financial_forecast import FinancialForecast
from app.schemas.financial_forecast import FinancialForecastResponse
from app.services import ai_service

router = APIRouter()


@router.post(
    "/{project_id}/financial_forecast", response_model=FinancialForecastResponse
)
def generate_project_financial_forecast(
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
    existing_forecast = (
        db.query(FinancialForecast)
        .filter(FinancialForecast.project_id == project.id)
        .first()
    )
    if existing_forecast:
        return existing_forecast

    # Call AI Service
    try:
        ai_result = ai_service.generate_financial_forecast(project)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    # Save to database
    forecast = FinancialForecast(project_id=project.id, financial_data=ai_result)
    db.add(forecast)
    db.commit()
    db.refresh(forecast)
    return {
        "id": forecast.id,
        "project_id": forecast.project_id,
        "generated_at": forecast.generated_at,
        "initial_investment_needed": forecast.financial_data.get(
            "initial_investment_needed", ""
        ),
        "monthly_burn_rate": forecast.financial_data.get("monthly_burn_rate", ""),
        "cost_breakdown": forecast.financial_data.get("cost_breakdown", []),
        "revenue_milestones": forecast.financial_data.get("revenue_milestones", []),
    }


@router.get(
    "/{project_id}/financial_forecast", response_model=FinancialForecastResponse
)
def get_project_financial_forecast(
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

    forecast = (
        db.query(FinancialForecast)
        .filter(FinancialForecast.project_id == project.id)
        .first()
    )
    if not forecast:
        raise HTTPException(
            status_code=404, detail="Financial forecast not found for this project"
        )

    # We map the JSON fields back to Pydantic since it's flattened in schema
    return {
        "id": forecast.id,
        "project_id": forecast.project_id,
        "generated_at": forecast.generated_at,
        "initial_investment_needed": forecast.financial_data.get(
            "initial_investment_needed", ""
        ),
        "monthly_burn_rate": forecast.financial_data.get("monthly_burn_rate", ""),
        "cost_breakdown": forecast.financial_data.get("cost_breakdown", []),
        "revenue_milestones": forecast.financial_data.get("revenue_milestones", []),
    }
