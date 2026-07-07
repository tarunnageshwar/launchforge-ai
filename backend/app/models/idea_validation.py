from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from app.db.database import Base


class IdeaValidation(Base):
    __tablename__ = "idea_validations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), unique=True
    )
    overall_score = Column(Integer)
    problem_analysis = Column(JSON)
    solution_analysis = Column(JSON)
    generated_at = Column(DateTime, default=datetime.utcnow)

    # Setup relationship with project
    project = relationship("Project", back_populates="idea_validation")
