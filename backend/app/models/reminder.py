from sqlalchemy import Column, Integer, DateTime, ForeignKey
from datetime import datetime
from app.core.database import Base
from sqlalchemy.orm import relationship

class Reminder(Base):
    __tablename__ = "reminders"
    
    id = Column(Integer, primary_key=True, index=True)
    medication_id = Column(Integer, ForeignKey("medications.id"), nullable=False)
    time = Column(DateTime, default=datetime.utcnow, nullable=False)
    next_trigger = Column(DateTime, default=datetime.utcnow, nullable=False)
    medication = relationship("Medication", backref="reminders")
