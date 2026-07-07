from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.database import Base


class MarketResearch(Base):
    __tablename__ = "market_research"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), unique=True
    )

    # We will store the AI JSON directly in the JSON column
    tam_sam_som = Column(JSON)
    target_demographics = Column(JSON)
    market_trends = Column(JSON)

    generated_at = Column(DateTime, default=datetime.utcnow)

    # Setup relationship with project
    project = relationship("Project", back_populates="market_research")
