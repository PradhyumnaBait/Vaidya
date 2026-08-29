"""
MediKiosk Backend — FastAPI Application Entry Point
Initialises app, mounts routers, and manages startup/shutdown lifecycle.
"""
import logging
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api.ws_gateway import router as ws_router
from app.api.routes import router as rest_router
from app.core.session_manager import init_redis, close_redis
from app.nlp.rag_translator import init_rag_translator
from app.nlp.bhashini_client import init_bhashini

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
)

# Install uvloop for ~40% better async throughput (Linux/macOS only)
if sys.platform != "win32":
    try:
        import uvloop
        uvloop.install()
    except ImportError:
        pass  # uvloop is optional; fallback to standard asyncio event loop

settings = get_settings()



@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup / shutdown lifecycle manager.
    All heavy initialisation (Redis pool, embedding model, Pinecone client)
    happens here so the event loop is already running.
    """
    # ── Startup ───────────────────────────────────────────────────────────────
    await init_redis()
    await init_bhashini()
    await init_rag_translator()

    yield  # Application runs here

    # ── Shutdown ──────────────────────────────────────────────────────────────
    await close_redis()


app = FastAPI(
    title="MediKiosk Backend API",
    description=(
        "AI-driven clinical history intake and document digitisation platform "
        "for high-density Indian public hospital OPDs. SIH Problem ID: 26047."
    ),
    version="1.0.0",
    docs_url="/docs" if settings.app_env == "development" else None,
    redoc_url="/redoc" if settings.app_env == "development" else None,
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Restrict to known frontend origin in production; open in dev for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.app_env == "development" else ["https://medikiosk.aiia.gov.in"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Authorization", "X-Session-ID", "Content-Type"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(ws_router)
app.include_router(rest_router, prefix="/api")


@app.get("/health", tags=["ops"])
async def health_check() -> dict:
    """Liveness probe for Docker / k8s health checks."""
    return {"status": "ok", "version": "1.0.0"}
