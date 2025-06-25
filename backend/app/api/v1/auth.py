from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.dependencies import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, PasswordResetRequest, PasswordResetConfirm
from app.services.auth_service import create_user, authenticate_user, get_user_by_email
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
from app.core.config import settings

import secrets
import smtplib
from email.mime.text import MIMEText

router = APIRouter(prefix="/auth", tags=["authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

reset_tokens = {}

def send_reset_email(email: str, token: str):
    msg = MIMEText(f"Your reset token: {token}")
    msg["Subject"] = "Password Reset Request"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = email
    
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    return create_user(db=db, user=user)

@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)  # username is email
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }

@router.post("/logout")
def logout_user():
    return {"message": "Successfully logged out"} 

@router.post("/password-reset/request")
def request_password_reset(
    data: PasswordResetRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = get_user_by_email(db, data.email)
    if user:
        token = secrets.token_urlsafe(32)
        reset_tokens[token] = user.email
        background_tasks.add_task(send_reset_email, user.email, token)
    return {"message": "If email exists, reset instructions sent"}

@router.post("/password-reset/confirm")
def confirm_password_reset(
    data: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    email = reset_tokens.get(data.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    del reset_tokens[data.token]
    return {"message": "Password has been reset successfully"}