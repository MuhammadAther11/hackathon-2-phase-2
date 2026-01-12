from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import Optional
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import os
from jose import jwt

from src.database import get_session
from src.models.user import UserCreate, UserPublic
from src.services.user_service import create_user, authenticate_user

router = APIRouter(prefix="/auth", tags=["auth"])

# JWT settings
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET") or "fallback_secret_key_for_development"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

class SignupRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def signup(
    signup_data: SignupRequest,
    session: Session = Depends(get_session)
):
    # Validate email format
    if "@" not in signup_data.email or "." not in signup_data.email:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid email format"
        )

    # Validate password length
    if len(signup_data.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters"
        )

    # Convert to UserCreate model
    user_create = UserCreate(email=signup_data.email, password=signup_data.password)

    try:
        # Create user via service
        user = create_user(session=session, user_create=user_create)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        return UserPublic.from_orm(user)
    except Exception as e:
        print(f"Error creating user: {e}")
        import traceback
        traceback.print_exc()
        raise

@router.post("/login")
async def login(
    login_data: LoginRequest,
    session: Session = Depends(get_session)
):
    # Authenticate user via service
    user = authenticate_user(session=session, email=login_data.email, password=login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create JWT token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},  # Use user.id as subject
        expires_delta=access_token_expires
    )

    # Return user info and JWT token
    return {
        "user": UserPublic.from_orm(user),
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout():
    # In a real implementation, you might want to blacklist the token
    # For now, just return success
    return {"message": "Successfully logged out"}