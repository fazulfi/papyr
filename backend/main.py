from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from routers.connectivity import router as connectivity_router
from routers.compress import router as compress_router
from routers.image_to_pdf import router as image_to_pdf_router
from routers.pdf_to_image import router as pdf_to_image_router
from utils.config import settings
from utils.logging_config import setup_logging

# --- Structured Logging ---
setup_logging()

# --- Rate Limiter ---
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Papyr API",
    description="Backend API untuk Papyr — Alat PDF Gratis untuk Indonesia",
    version="0.1.0",
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
app.include_router(pdf_to_image_router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
