from typing import Optional
from fastapi import APIRouter, Query

from schemas.session import StartSessionRequest, SessionResponse
from services.session_service import SessionService

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/start", response_model=SessionResponse)
async def start_session(data: StartSessionRequest):
    service = SessionService()
    return await service.start_session(data=data)


@router.post("/{session_id}/finish", response_model=SessionResponse)
async def finish_session(session_id: str):
    service = SessionService()
    return await service.finish_session(session_id=session_id)


@router.get("/active", response_model=Optional[SessionResponse])
async def get_active_session(userId: str = Query(..., description="The ID of the user to check for an active session")):
    service = SessionService()
    return await service.get_active_session(userId)


@router.get("", response_model=list[SessionResponse])
async def list_sessions(userId: str = Query(..., description="The ID of the user to filter sessions by")):
    service = SessionService()
    return await service.list_sessions(userId)