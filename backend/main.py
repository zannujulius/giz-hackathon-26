import structlog
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from api.routes.chat import router as chat_router
from api.routes.health import router as health_router
from api.routes.conversations import router as conversations_router
from core.retriever import get_embed_model   # pre-load on startup

# ── Logging ───────────────────────────────────────────────────────────────────
structlog.configure(
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    logger_factory=structlog.PrintLoggerFactory(),
)
log = structlog.get_logger()


# ── Lifespan ──────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm up the embedding model once at startup so the first request is fast
    log.info("startup_loading_embed_model")
    get_embed_model()
    log.info("startup_ready")
    yield
    log.info("shutdown")


# ── App ───────────────────────────────────────────────────────────────────────
settings = get_settings()

app = FastAPI(
    title="Rwanda Gender Data Platform API",
    version="1.0.0",
    description="RAG-powered chat API for Rwanda gender data discovery.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(health_router, prefix="/api")
app.include_router(conversations_router, prefix="/api")
