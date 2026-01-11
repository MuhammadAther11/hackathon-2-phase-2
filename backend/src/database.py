import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Use a dummy URL if DATABASE_URL is not set (e.g. during module import in tests)
# The actual engine will be overridden or the app will fail at runtime if not set
engine = create_engine(DATABASE_URL or "sqlite:///dummy.db", echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
