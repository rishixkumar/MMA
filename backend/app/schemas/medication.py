from pydantic import BaseModel, Field
from typing import Optional

class MedicationBase(BaseModel):
    name: str = Field(..., example="Metformin")
    dosage: str = Field(..., example="500mg")
    frequency: str = Field(..., example="Twice daily")
    instructions: Optional[str] = Field(None, example="Take with food")

class MedicationCreate(MedicationBase):
    pass

class Medication(MedicationBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
