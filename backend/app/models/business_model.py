from sqlalchemy import Column, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.database import Base


class BusinessModel(Base):
    __tablename__ = "business_models"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), unique=True
    )

    # Store AI generated JSON directly
    canvas_data = Column(JSON)

    generated_at = Column(DateTime, default=datetime.utcnow)

    # Setup relationship with project
    project = relationship("Project", back_populates="business_model")
