from typing import Optional
from fastapi import APIRouter, Query, Depends

from schemas.session import StartSessionRequest, SessionResponse, FinishSessionRequest, UpdateSessionTasksRequest
from services.session_service import SessionService
from dependencies.auth import get_current_user

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/start", response_model=SessionResponse)
async def start_session(
    data: StartSessionRequest,
    current_user: dict = Depends(get_current_user)
):
    service = SessionService()
    return await service.start_session(data=data, user_id=current_user["_id"])


@router.post("/{session_id}/finish", response_model=SessionResponse)
async def finish_session(
        session_id: str,
        data: FinishSessionRequest
):
    service = SessionService()
    return await service.finish_session(session_id=session_id, data=data)


@router.get("/active", response_model=Optional[SessionResponse])
async def get_active_session(
    current_user: dict = Depends(get_current_user)
):
    service = SessionService()
    return await service.get_active_session(user_id=current_user["_id"])


@router.get("/history", response_model=list[SessionResponse])
async def get_user_sessions(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100)
):
    service = SessionService()

    return await service.get_user_sessions(
        user_id=current_user["_id"],
        status=status,
        limit=limit
    )


@router.get("/{session_id}", response_model=Optional[SessionResponse])
async def get_session_by_id(session_id: str):
    service = SessionService()
    
    return await service.get_session_by_id(session_id=session_id)


@router.patch("/{session_id}/tasks", response_model=SessionResponse)
async def update_session_tasks(
    session_id: str,
    data: UpdateSessionTasksRequest
):
    service = SessionService()

    updated_session = await service.update_session_tasks(
        session_id=session_id,
        data=data
    )

    return updated_session


@router.post("/{session_id}/pause", response_model=SessionResponse)
async def pause_session(session_id: str):
    service = SessionService()
    
    return await service.pause_session(session_id=session_id)


@router.post("/{session_id}/resume", response_model=SessionResponse)
async def resume_session(session_id: str):
    service = SessionService()
    
    return await service.resume_session(session_id=session_id)