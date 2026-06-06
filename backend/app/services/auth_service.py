from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from core.security import (
    create_access_token,
    hash_password,
    verify_password
)
from repositories.user_repository import UserRepository
from schemas.auth import LoginRequest, SignupRequest


class AuthService:
    def __init__(self):
        self.user_repository = UserRepository()


    async def signup(self, data: SignupRequest) -> dict:
        email = data.email.lower()

        if await self.user_repository.email_exists(email):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        try: 
            password_hash = hash_password(data.password)

            user = await self.user_repository.create_user({
                "name": data.name.strip(),
                "email": email,
                "passwordHash": password_hash
            })

        except DuplicateKeyError:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered"
            )

        access_token = create_access_token(subject=user["_id"])

        return {
            "accessToken": access_token,
            "tokenType": "bearer",
            "user": sanitize_user(user)
        }


    async def login(self, data: LoginRequest) -> dict:
        email = data.email.lower()

        user = await self.user_repository.get_by_email(email)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        is_valid_password = verify_password(
            data.password, 
            user["passwordHash"]
        )
        
        if not is_valid_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        access_token = create_access_token(user["_id"])

        return {
            "accessToken": access_token,
            "tokenType": "bearer",
            "user": sanitize_user(user)
        }
    

    async def get_current_user(self, user_id: str) -> dict:
        user = await self.user_repository.get_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invalid authentication credentials"
            )
        
        return sanitize_user(user)


def sanitize_user(user: dict) -> dict:
    sanitized_user = user.copy()
    sanitized_user.pop("passwordHash", None)

    return sanitized_user