from passlib.context import CryptContext
import hashlib

# Use bcrypt as primary scheme for better compatibility across environments
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
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
        # Truncate to 72 bytes for bcrypt compatibility
        password_to_hash = password[:72] if len(password.encode()) > 72 else password
        return pwd_context.hash(password_to_hash)
    except Exception as e:
        print(f"Password hashing error: {e}")
        # Fallback to simple sha256 if passlib fails
        import hmac
        return hmac.new(b"fallback_key", password.encode(), hashlib.sha256).hexdigest()