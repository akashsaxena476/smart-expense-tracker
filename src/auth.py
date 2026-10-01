from fastapi import APIRouter, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .auth_schemas import UserRegister, UserLogin
from security.password import hash_password, verify_password
from security.jwt import create_access_token, verify_access_token
from database.user_operations import (
    get_user_by_username,
    get_user_by_email,
    create_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

security = HTTPBearer()


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):
    existing_username = get_user_by_username(user.username)

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists."
        )

    existing_email = get_user_by_email(user.email)

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists."
        )

    hashed_password = hash_password(user.password)

    new_user = create_user(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    return {
        "message": "User registered successfully.",
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }
    }


@router.post("/login")
def login_user(user: UserLogin):
    existing_user = get_user_by_username(user.username)

    if existing_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    if not verify_password(
        user.password,
        existing_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password."
        )

    access_token = create_access_token(
        data={"sub": str(existing_user.id)}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "username": existing_user.username,
            "email": existing_user.email
        }
    }


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    user_id = verify_access_token(token)

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token."
        )

    return int(user_id)