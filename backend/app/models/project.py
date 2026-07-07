import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
from datetime import datetime


class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    industry = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Setup relationship with user
    user = relationship("User", back_populates="projects")

    # Setup relationship with idea validation
    idea_validation = relationship(
        "IdeaValidation",
        back_populates="project",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Setup relationship with market research
    market_research = relationship(
        "MarketResearch",
        back_populates="project",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Setup relationship with competitor analysis
    competitor_analysis = relationship(
        "CompetitorAnalysis",
        back_populates="project",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Setup relationship with business model
    business_model = relationship(
        "BusinessModel",
        back_populates="project",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Setup relationship with financial forecast
    financial_forecast = relationship("FinancialForecast", back_populates="project", uselist=False, cascade="all, delete-orphan")

    # Setup relationship with brand assets
    brand_asset = relationship("BrandAsset", back_populates="project", uselist=False, cascade="all, delete-orphan")

    # Setup relationship with pitch deck
    pitch_deck = relationship("PitchDeck", back_populates="project", uselist=False, cascade="all, delete-orphan")

    # Setup relationship with MVP scoper
    mvp_scoper = relationship("MVPScoper", back_populates="project", uselist=False, cascade="all, delete-orphan")

    # Setup relationship with user persona
    user_persona = relationship("UserPersona", back_populates="project", uselist=False, cascade="all, delete-orphan")

    # Setup relationship with GTM strategy
    gtm_strategy = relationship("GTMStrategy", back_populates="project", uselist=False, cascade="all, delete-orphan")

    # Setup relationship with legal & compliance
    legal_compliance = relationship("LegalCompliance", back_populates="project", uselist=False, cascade="all, delete-orphan")

    # Setup relationship with growth experiments
    growth_experiments = relationship("GrowthExperiment", back_populates="project", uselist=False, cascade="all, delete-orphan")
