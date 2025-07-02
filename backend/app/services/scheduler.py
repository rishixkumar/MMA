from apscheduler.schedulers.background import BackgroundScheduler
from app.core.database import SessionLocal
from app.services.reminder_service import send_scheduled_reminders

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=run_reminder_check,
        trigger="interval",
        seconds=60
    )
    scheduler.start()

def run_reminder_check():
    db = SessionLocal()
    try:
        send_scheduled_reminders(db)
    finally:
        db.close()
