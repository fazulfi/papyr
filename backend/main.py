from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/health")
async def health_check():
    return {"status": "ok"}
