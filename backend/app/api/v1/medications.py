from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.models.medication import Medication
from app.schemas.medication import MedicationCreate, Medication as MedicationSchema
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/medications", response_model=MedicationSchema)
def create_medication(
    medication: MedicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_medication = Medication(**medication.dict(), user_id=current_user.id)
    db.add(db_medication)
    db.commit()
    db.refresh(db_medication)
    return db_medication

@router.get("/medications", response_model=List[MedicationSchema])
def read_medications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    medications = db.query(Medication).filter(Medication.user_id == current_user.id).offset(skip).limit(limit).all()
    return medications
