import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import event
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Use a dummy URL if DATABASE_URL is not set (e.g. during module import in tests)
# The actual engine will be overridden or the app will fail at runtime if not set
engine_args = {
    "echo": True,
    "pool_size": 5,           # Reduce pool size for Neon
    "max_overflow": 10,
    "pool_pre_ping": True,    # Verify connection before using
    "pool_recycle": 1800,     # Recycle connections every 30 minutes
}

# For PostgreSQL, add SSL configuration for Neon serverless
if DATABASE_URL and "postgresql" in DATABASE_URL:
    engine_args["connect_args"] = {
        "connect_timeout": 30,
        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    }

engine = create_engine(DATABASE_URL or "sqlite:///dummy.db", **engine_args)

# Add event listener to handle connection errors
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Handle connection setup"""
    connection_record.info['fresh_connection'] = True

@event.listens_for(engine, "close")
def receive_close(dbapi_conn, connection_record):
    """Handle connection close"""
    pass

def create_db_and_tables():
    """Create database tables with retry logic"""
    import time
    max_retries = 3
    for attempt in range(max_retries):
        try:
            SQLModel.metadata.create_all(engine)
            print(f"✅ Database tables created successfully on attempt {attempt + 1}")
            return
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"⚠️  Database connection attempt {attempt + 1} failed: {str(e)}")
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                print(f"❌ Failed to create database tables after {max_retries} attempts")
                raise

def get_session():
    with Session(engine) as session:
        yield session
