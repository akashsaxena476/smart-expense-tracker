import re

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    username: str = Field(min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str):
        if not re.search(r"[A-Z]", password):
            raise ValueError(
                "Password must contain at least one uppercase letter."
            )

        if not re.search(r"[a-z]", password):
            raise ValueError(
                "Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", password):
            raise ValueError(
                "Password must contain at least one number."
            )

        if not re.search(r"[^A-Za-z0-9]", password):
            raise ValueError(
                "Password must contain at least one special character."
            )

        return password


class UserLogin(BaseModel):
    username: str
    password: str