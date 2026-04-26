"""
Centralized configuration — loads and validates all environment variables on import.

Usage:
    from utils.config import settings

Raises MissingEnvVarError on startup if any required variable is missing.
"""

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


class MissingEnvVarError(Exception):
    """Raised when a required environment variable is not set."""

    def __init__(self, var_name: str) -> None:
        super().__init__(
            f"Environment variable '{var_name}' wajib diisi. "
            f"Cek file .env atau .env.example untuk referensi."
        )


def _require(var: str) -> str:
    """Return env var value or raise MissingEnvVarError."""
    value = os.getenv(var)
    if not value:
        raise MissingEnvVarError(var)
    return value


def _optional(var: str, default: str = "") -> str:
    """Return env var value or default."""
    return os.getenv(var, default)


def _int(var: str, default: int) -> int:
    """Return env var as int or default."""
    raw = os.getenv(var)
    if raw is None:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


@dataclass(frozen=True)
class Settings:
    """Immutable application settings validated at startup."""

    # --- Cloudflare R2 ---
    r2_account_id: str
    r2_access_key_id: str
    r2_secret_access_key: str
    r2_bucket_name: str
    r2_public_url: str

    # --- CORS ---
    cors_origins: list[str]

    # --- App limits ---
    max_upload_size_mb: int
    file_retention_minutes: int
    rate_limit_per_minute: int

    # --- Supabase (standby — belum aktif di MVP 0.1) ---
    supabase_url: str
    supabase_anon_key: str

    # --- Sentry (optional) ---
    sentry_dsn: str

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


def _load_settings() -> Settings:
    """Load and validate all environment variables."""
    return Settings(
        # R2 — required
        r2_account_id=_require("R2_ACCOUNT_ID"),
        r2_access_key_id=_require("R2_ACCESS_KEY_ID"),
        r2_secret_access_key=_require("R2_SECRET_ACCESS_KEY"),
        r2_bucket_name=_require("R2_BUCKET_NAME"),
        r2_public_url=_optional("R2_PUBLIC_URL"),
        # CORS
        cors_origins=[
            origin.strip()
            for origin in _optional(
                "CORS_ORIGINS", "https://mypapyr.com,http://localhost:3000"
            ).split(",")
        ],
        # App limits
        max_upload_size_mb=_int("MAX_UPLOAD_SIZE_MB", 20),
        file_retention_minutes=_int("FILE_RETENTION_MINUTES", 60),
        rate_limit_per_minute=_int("RATE_LIMIT_PER_MINUTE", 10),
        # Supabase — optional/standby
        supabase_url=_optional("SUPABASE_URL"),
        supabase_anon_key=_optional("SUPABASE_ANON_KEY"),
        # Sentry — optional
        sentry_dsn=_optional("SENTRY_DSN"),
    )


# Singleton — validated on first import
settings = _load_settings()
