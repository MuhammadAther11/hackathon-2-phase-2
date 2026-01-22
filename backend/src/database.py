import os
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy import event
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def create_neon_engine():
    """Create database engine with Neon-specific configuration"""
    if not DATABASE_URL:
        # Use a dummy URL if DATABASE_URL is not set (e.g. during module import in tests)
        # The actual engine will be overridden or the app will fail at runtime if not set
        return create_engine("sqlite:///dummy.db", echo=True)

    # Parse the database URL to extract connection parameters
    parsed_url = urlparse(DATABASE_URL)

    # Neon-specific engine configuration
    engine_args = {
        "echo": True,  # Set to False in production
        "pool_size": 1,  # Reduced pool size for Neon serverless
        "max_overflow": 4,
        "pool_pre_ping": True,  # Verify connection before using
        "pool_recycle": 300,  # Recycle connections every 5 minutes (shorter for Neon)
        "pool_timeout": 30,
        "max_identifier_length": 63,
        "connect_args": {
            "connect_timeout": 30,
            "sslmode": "require",  # Ensure SSL is required for Neon
            "keepalives": 1,
            "keepalives_idle": 30,
            "keepalives_interval": 10,
            "keepalives_count": 5,
        }
    }

    # For Neon, we need to ensure proper SSL configuration
    if "neon.tech" in DATABASE_URL:
        # Add Neon-specific connection parameters
        engine_args["connect_args"]["sslmode"] = "require"
        # Additional parameters that might help with Neon connection issues
        engine_args["connect_args"]["tcp_keepalive"] = True

    return create_engine(DATABASE_URL, **engine_args)

# Create the engine with Neon-specific configuration
engine = create_neon_engine()

# Add event listener to handle connection errors specific to Neon
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Handle connection setup for Neon"""
    # Set connection-specific parameters for Neon
    with dbapi_conn.cursor() as cursor:
        cursor.execute("SET idle_in_transaction_session_timeout = 30000;")  # 30 seconds
        cursor.execute("SET statement_timeout = 30000;")  # 30 seconds

@event.listens_for(engine, "checkout")
def receive_checkout(dbapi_conn, connection_record, connection_proxy):
    """Handle connection checkout"""
    pass

def create_db_and_tables():
    """Create database tables with retry logic for Neon"""
    import time
    max_retries = 5  # Increased retries for Neon
    for attempt in range(max_retries):
        try:
            # Try to establish a connection first
            with engine.connect() as conn:
                pass  # Just test the connection

            SQLModel.metadata.create_all(engine)
            print(f"Database tables created successfully on attempt {attempt + 1}")
            return
        except Exception as e:
            print(f"Database connection attempt {attempt + 1} failed: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(min(2 ** attempt, 10))  # Exponential backoff with cap
            else:
                print(f"Failed to create database tables after {max_retries} attempts")
                raise

def get_session():
    with Session(engine) as session:
        yield session
