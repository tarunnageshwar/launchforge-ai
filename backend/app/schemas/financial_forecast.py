from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime


class FinancialForecastBase(BaseModel):
    initial_investment_needed: str
    monthly_burn_rate: str
    cost_breakdown: List[Dict[str, Any]]
    revenue_milestones: List[Dict[str, Any]]


class FinancialForecastCreate(FinancialForecastBase):
    project_id: str


class FinancialForecastResponse(FinancialForecastBase):
    id: UUID
    project_id: UUID
    generated_at: datetime

    class Config:
        from_attributes = True
