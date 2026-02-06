from passlib.context import CryptContext

# Use bcrypt for hashing - most reliable and widely supported
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

# bcrypt has a 72-byte limit
MAX_PASSWORD_LENGTH = 72

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    try:
        # Truncate password to 72 bytes to match hashing
        truncated_password = plain_password[:MAX_PASSWORD_LENGTH]
        return pwd_context.verify(truncated_password, hashed_password)
    except Exception as e:
        print(f"[Password] Verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash a plain password using bcrypt."""
    try:
        # Truncate password to 72 bytes (bcrypt limit)
        truncated_password = password[:MAX_PASSWORD_LENGTH]
        return pwd_context.hash(truncated_password)
    except Exception as e:
        print(f"[Password] Hashing error: {e}")
        raise Exception(f"Password hashing failed: {str(e)}")