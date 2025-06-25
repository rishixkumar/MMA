from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.core.security import get_current_user
from app.services.auth_service import get_user_by_email

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/add-dependent")
def add_dependent(
    dependent_email: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dependent = get_user_by_email(db, dependent_email)
    if not dependent:
        raise HTTPException(status_code=404, detail="User not found")
    if dependent.caregiver_id:
        raise HTTPException(status_code=400, detail="User already has a caregiver")
    
    dependent.caregiver_id = current_user.id
    db.commit()
    return {"message": "Dependent added successfully", "dependent_email": dependent_email}

@router.get("/dependents")
def get_dependents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dependents = db.query(User).filter(User.caregiver_id == current_user.id).all()
    return [{"id": d.id, "email": d.email, "first_name": d.first_name, "last_name": d.last_name} for d in dependents]

@router.delete("/dependents/{dependent_id}")
def remove_dependent(
    dependent_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dependent = db.query(User).filter(
        User.id == dependent_id, 
        User.caregiver_id == current_user.id
    ).first()
    if not dependent:
        raise HTTPException(status_code=404, detail="Dependent not found")
    
    dependent.caregiver_id = None
    db.commit()
    return {"message": "Dependent removed successfully"}

@router.get("/test")
def test_endpoint():
    return {"message": "Users endpoint is working!"}
