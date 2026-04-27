from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.connectivity import router as connectivity_router
from utils.config import settings

app = FastAPI(
    title="Papyr API",
    description="Backend API untuk Papyr — Alat PDF Gratis untuk Indonesia",
    version="0.1.0",
)

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


@app.get("/health")
async def health_check():
    return {"status": "ok"}


# --- Temporary test endpoint for PAPYR-011 (remove after verification) ---
@app.get("/health/gs")
async def health_ghostscript():
    import subprocess
    import importlib

    result: dict = {"ghostscript": "not found", "pymupdf": "not found", "pillow": "not found"}

    # Check Ghostscript
    try:
        proc = subprocess.run(["gs", "--version"], capture_output=True, text=True, timeout=5)
        if proc.returncode == 0:
            result["ghostscript"] = proc.stdout.strip()
        else:
            result["ghostscript"] = f"error: {proc.stderr.strip()}"
    except FileNotFoundError:
        result["ghostscript"] = "not installed"
    except Exception as e:
        result["ghostscript"] = f"error: {e}"

    # Check PyMuPDF
    try:
        fitz = importlib.import_module("fitz")
        result["pymupdf"] = getattr(fitz, "VersionBind", getattr(fitz, "__version__", "unknown"))
    except ImportError:
        result["pymupdf"] = "not installed"

    # Check Pillow
    try:
        pil = importlib.import_module("PIL")
        result["pillow"] = getattr(pil, "__version__", "unknown")
    except ImportError:
        result["pillow"] = "not installed"

    return result
