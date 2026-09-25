from .connection import SessionLocal
from .user_models import User


def get_user_by_username(username: str):
    db = SessionLocal()

    try:
        return db.query(User).filter(User.username == username).first()
    finally:
        db.close()


def get_user_by_email(email: str):
    db = SessionLocal()

    try:
        return db.query(User).filter(User.email == email).first()
    finally:
        db.close()


def create_user(username: str, email: str, hashed_password: str):
    db = SessionLocal()

    try:
        user = User(
            username=username,
            email=email,
            hashed_password=hashed_password
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    finally:
        db.close()