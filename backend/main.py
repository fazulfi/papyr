import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from routers.connectivity import router as connectivity_router
from routers.compress import router as compress_router
from routers.image_to_pdf import router as image_to_pdf_router
from routers.ocr import router as ocr_router
from routers.pdf_to_excel import router as pdf_to_excel_router
from routers.pdf_to_image import router as pdf_to_image_router
from routers.pdf_to_word import router as pdf_to_word_router
from routers.protect import router as protect_router
from routers.status import router as status_router
from routers.unlock import router as unlock_router
from routers.watermark import router as watermark_router

from utils.config import settings
from utils.logging_config import setup_logging
from utils.cleanup import cleanup_expired_files, CLEANUP_INTERVAL_SECONDS

# --- Structured Logging ---
setup_logging()

logger = logging.getLogger(__name__)

# --- Rate Limiter ---
limiter = Limiter(key_func=get_remote_address)


# --- Background Cleanup Task ---
async def _cleanup_loop():
    """Background loop: jalankan cleanup setiap 30 menit."""
    while True:
        await asyncio.sleep(CLEANUP_INTERVAL_SECONDS)
        try:
            # Jalankan sync function di thread pool agar tidak block event loop
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, cleanup_expired_files)
        except Exception as e:
            logger.error("Cleanup loop error: %s", str(e))


@asynccontextmanager
async def lifespan(app: FastAPI):
    """App lifespan: start cleanup cron on startup, cancel on shutdown."""
    task = asyncio.create_task(_cleanup_loop())
    logger.info(
        "Cleanup cron started (interval: %ds)", CLEANUP_INTERVAL_SECONDS
    )
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    logger.info("Cleanup cron stopped")


app = FastAPI(
    title="Papyr API",
    description="Backend API untuk Papyr — Alat PDF Gratis untuk Indonesia",
    version="0.1.0",
    lifespan=lifespan,
)

app.state.limiter = limiter


# Custom 429 handler — pesan Bahasa Indonesia
async def _rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Terlalu banyak permintaan. Coba lagi dalam 1 menit.",
        },
    )


app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)

# CORS — hanya izinkan origin yang terdaftar
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


# Supabase: standby, not active in MVP 0.1

# --- Routers ---
app.include_router(connectivity_router)
app.include_router(compress_router)
app.include_router(image_to_pdf_router)
app.include_router(ocr_router)
app.include_router(pdf_to_excel_router)
app.include_router(pdf_to_image_router)
app.include_router(pdf_to_word_router)
app.include_router(protect_router)
app.include_router(status_router)
app.include_router(unlock_router)
app.include_router(watermark_router)



@app.get("/health")
async def health_check():
    from datetime import datetime, timezone

    return {
        "status": "ok",
        "version": app.version,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
