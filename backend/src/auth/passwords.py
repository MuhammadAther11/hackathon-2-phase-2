from passlib.context import CryptContext
import hashlib

# Use argon2 as primary scheme for better compatibility, bcrypt as backup
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__memory_cost=65536,
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
        # Truncate to 72 bytes for bcrypt compatibility just in case
        password_to_hash = password[:72] if len(password.encode()) > 72 else password
        return pwd_context.hash(password_to_hash)
    except Exception as e:
        print(f"Password hashing error: {e}")
        # Fallback to simple sha256 if passlib fails
        import hmac
        return hmac.new(b"fallback_key", password.encode(), hashlib.sha256).hexdigest()