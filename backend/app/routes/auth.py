from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas.auth import (
    AuthResponse,
    LoginRequest,
    SignupRequest,
    UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=AuthResponse)
async def signup(data: SignupRequest):
    service = AuthService()

    return await service.signup(data)


@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest):
    service = AuthService()

    return await service.login(data)


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    return current_user