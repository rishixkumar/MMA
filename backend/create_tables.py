from app.core.database import engine, Base
from app.models.user import User  # Import all models

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    create_tables() 