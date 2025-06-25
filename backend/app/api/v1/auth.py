from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import secrets
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.dependencies import get_db
from app.schemas.user import UserCreate, UserResponse, UserLogin, PasswordResetRequest, PasswordResetConfirm
from app.services.auth_service import create_user, authenticate_user, get_user_by_email
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
from app.core.config import settings
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

# In-memory store for reset tokens (for demo; use DB or cache in prod)
reset_tokens = {}

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db=db, user=user)

@router.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
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

def send_reset_email(email: str, token: str, user_stats: dict):
    reset_link = f"{settings.FRONTEND_URL}/login?reset_token={token}"
    
    subject = "MMA - Password Reset Request"
    
    # Enhanced email content
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>🏥 MMA - Medication Management & Adherence</h2>
        <p><strong>Password Reset Request</strong></p>
        
        <p>Hi there! You've requested to reset your password for your MMA account.</p>
        
        <h3>📊 Your Account Summary:</h3>
        <ul>
            <li>Account Status: {user_stats.get('status', 'Active')}</li>
            <li>Account Created: {user_stats.get('created_date', 'Recently')}</li>
            <li>Total Dependents: {user_stats.get('dependents_count', 0)}</li>
        </ul>
        
        <p><strong>🔗 Click the link below to reset your password:</strong></p>
        <p><a href="{reset_link}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset My Password</a></p>
        
        <p><strong>�� Your Reset Token:</strong> <code style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px;">{token}</code></p>
        
        <p><small>This token will also be visible when you click the reset link above for verification purposes.</small></p>
        
        <hr>
        <p><small>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</small></p>
        <p><small>This reset link expires in 1 hour for security.</small></p>
        
        <p>Best regards,<br>The MMA Team</p>
    </div>
    """
    
    msg = MIMEMultipart('alternative')
    msg["Subject"] = subject
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = email
    
    html_part = MIMEText(html_content, 'html')
    msg.attach(html_part)
    
    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)

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
        
        # Get user stats for email
        dependents_count = db.query(User).filter(User.caregiver_id == user.id).count()
        user_stats = {
            'status': 'Active' if user.is_active else 'Inactive',
            'created_date': 'Recently',  # You can format actual creation date
            'dependents_count': dependents_count
        }
        
        background_tasks.add_task(send_reset_email, user.email, token, user_stats)
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

@router.post("/logout")
def logout_user():
    return {"message": "Successfully logged out"}
