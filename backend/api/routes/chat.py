from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from core.pipeline import run_pipeline
import structlog

log = structlog.get_logger()
router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        return await run_pipeline(request)
    except Exception as exc:
        log.error("chat_endpoint_error", error=str(exc))
        raise HTTPException(status_code=500, detail="Pipeline error. Please try again.")
