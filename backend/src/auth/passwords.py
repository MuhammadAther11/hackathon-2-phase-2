from passlib.context import CryptContext
import hashlib

# Use argon2 as primary scheme, with sha256 as fallback
pwd_context = CryptContext(
    schemes=["argon2", "sha256_crypt"],
    deprecated="auto",
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Password verification error: {e}")
        return False

def get_password_hash(password: str) -> str:
    """Hash a plain password."""
    try:
        return pwd_context.hash(password)
    except Exception as e:
        print(f"Password hashing error: {e}")
        # Fallback to sha256 if passlib fails
        return pwd_context.using(scheme="sha256_crypt").hash(password)