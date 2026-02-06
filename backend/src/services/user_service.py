from sqlmodel import Session, select
from typing import Optional
from src.models.user import User, UserCreate
from src.auth.passwords import get_password_hash

MAX_PASSWORD_BYTES = 72  # bcrypt limit

def create_user(*, session: Session, user_create: UserCreate) -> Optional[User]:
    """Create a new user in the database."""
    try:
        # Check if user already exists
        existing_user = session.exec(
            select(User).where(User.email == user_create.email)
        ).first()

        if existing_user:
            print(f"[UserService] User already exists: {user_create.email}")
            return None

        print(f"[UserService] Creating user: {user_create.email}")

        # ✅ Validate password length (bcrypt limit = 72 bytes)
        password_bytes = user_create.password.encode("utf-8")
        if len(password_bytes) > MAX_PASSWORD_BYTES:
            raise ValueError("Password must be 72 characters or less")

        # Hash the password safely
        hashed_password = get_password_hash(user_create.password)
        print(f"[UserService] Password hashed successfully")

        # Create user
        user = User(
            email=user_create.email,
            password_hash=hashed_password
        )

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
