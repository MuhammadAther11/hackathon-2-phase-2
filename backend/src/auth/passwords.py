from passlib.context import CryptContext

# Use bcrypt for hashing - most reliable and widely supported
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"[Password] Verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash a plain password using bcrypt."""
    try:
        return pwd_context.hash(password)
    except Exception as e:
        print(f"[Password] Hashing error: {e}")
        raise Exception(f"Password hashing failed: {str(e)}")