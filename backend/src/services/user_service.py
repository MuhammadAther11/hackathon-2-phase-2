from sqlmodel import Session, select
from typing import Optional
from src.models.user import User, UserCreate
from src.auth.passwords import get_password_hash

def create_user(*, session: Session, user_create: UserCreate) -> Optional[User]:
    """Create a new user in the database."""
    try:
        # Check if user already exists
        existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
        if existing_user:
            print(f"[UserService] User already exists: {user_create.email}")
            return None  # Signal that user already exists

        print(f"[UserService] Creating user: {user_create.email}")

        # Hash the password (now with 72-byte truncation)
        hashed_password = get_password_hash(user_create.password)
        print(f"[UserService] Password hashed successfully")

        # Create the user object
        user = User(
            email=user_create.email,
            password_hash=hashed_password
        )

        # Add to session and commit
        session.add(user)
        session.commit()
        session.refresh(user)

        print(f"[UserService] User created successfully: {user.id}")
        return user
    except Exception as e:
        print(f"[UserService] Error in create_user: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

def get_user_by_email(*, session: Session, email: str) -> Optional[User]:
    """Get a user by email."""
    user = session.exec(select(User).where(User.email == email)).first()
    return user

def authenticate_user(*, session: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    from src.auth.passwords import verify_password

    try:
        print(f"[UserService] Authenticating user: {email}")
        user = get_user_by_email(session=session, email=email)
        if not user:
            print(f"[UserService] User not found: {email}")
            return None

        print(f"[UserService] User found, verifying password")
        if not verify_password(password, user.password_hash):
            print(f"[UserService] Password verification failed for: {email}")
            return None

        print(f"[UserService] Authentication successful for: {email}")
        return user
    except Exception as e:
        print(f"[UserService] Error in authenticate_user: {str(e)}")
        import traceback
        traceback.print_exc()
        raise