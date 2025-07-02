from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.users import router as users_router
from app.api.v1.auth import router as auth_router
from app.api.v1.medications import router as medications_router

from apscheduler.schedulers.background import BackgroundScheduler
from app.services.reminder_service import send_scheduled_reminders
from app.core.database import SessionLocal

app = FastAPI(title="MMA Backend API")

# APScheduler setup
scheduler = BackgroundScheduler()

def reminder_job():
    db = SessionLocal()
    try:
        send_scheduled_reminders(db)
    finally:
        db.close()

@app.on_event("startup")
def start_scheduler():
    scheduler.add_job(reminder_job, "interval", seconds=60)
    scheduler.start()
    print("Scheduler started!")

@app.on_event("shutdown")
def shutdown_scheduler():
    scheduler.shutdown()
    print("Scheduler shut down!")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(medications_router, prefix="/api/v1", tags=["medications"])

@app.get("/")
def read_root():
    return {"message": "MMA Backend API is running"}
