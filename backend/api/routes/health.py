from fastapi import APIRouter
from models.schemas import HealthResponse
from config import get_settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok", environment=get_settings().environment)
