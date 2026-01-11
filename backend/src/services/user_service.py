from sqlmodel import Session, select
from typing import Optional
from src.models.user import User, UserCreate
from src.auth.passwords import get_password_hash

def create_user(*, session: Session, user_create: UserCreate) -> User:
    """Create a new user in the database."""
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        return None  # Signal that user already exists

    # Hash the password
    hashed_password = get_password_hash(user_create.password)

    # Create the user object
    user = User(
        email=user_create.email,
        password_hash=hashed_password
    )

    # Add to session and commit
    session.add(user)
    session.commit()
    session.refresh(user)

    return user

def get_user_by_email(*, session: Session, email: str) -> Optional[User]:
    """Get a user by email."""
    user = session.exec(select(User).where(User.email == email)).first()
    return user

def authenticate_user(*, session: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password."""
    from src.auth.passwords import verify_password

    user = get_user_by_email(session=session, email=email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user