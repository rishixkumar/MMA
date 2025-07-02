import pytz
from datetime import datetime, timedelta
from sqlalchemy import text
from app.models.reminder import Reminder
from app.core.firebase import messaging

def calculate_next_trigger(reminder: Reminder) -> datetime:
    """Calculate next trigger time (24h recurrence by default)"""
    return reminder.next_trigger + timedelta(days=1)

def send_scheduled_reminders(db):
    print("Checking for due reminders...")
    # Get reminders due within next 60s
    reminders = db.query(Reminder).filter(
        Reminder.next_trigger <= datetime.utcnow() + timedelta(seconds=60)
    ).all()
    print(f"Found {len(reminders)} reminders due.")

    for reminder in reminders:
        print(f"Processing reminder {reminder.id} for medication {reminder.medication_id}")
        # Get user's FCM token via raw SQL (bypassing ORM circularity)
        result = db.execute(text("""
            SELECT u.fcm_token 
            FROM users u
            JOIN medications m ON m.user_id = u.id
            WHERE m.id = :medication_id
        """), {'medication_id': reminder.medication_id})
        # Extract tokens correctly (each row is a tuple)
        fcm_tokens = [row[0] for row in result]

        print(f"FCM tokens found: {fcm_tokens}")

        # Send notification to each device token
        for token in fcm_tokens:
            if token:  # Skip if token missing
                messaging.send({
                    "token": token,
                    "notification": {
                        "title": "Medication Reminder",
                        "body": f"Time to take {reminder.medication.name}"
                    },
                    "data": {
                        "type": "reminder",
                        "medication_id": str(reminder.medication_id)
                    }
                })
                print(f"Sent notification to token: {token}")

        # Update next trigger time
        reminder.next_trigger = calculate_next_trigger(reminder)

    db.commit()
    print("Reminders processed and next_trigger updated.")
