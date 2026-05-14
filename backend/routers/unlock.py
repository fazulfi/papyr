"""
Router untuk membuka proteksi PDF (unlock/decrypt).

POST /api/unlock — menerima file PDF terenkripsi + password,
dekripsi dengan PyMuPDF, upload ke R2, return signed download URL.
"""

import logging
import time
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, File, Form, Request, UploadFile, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from utils.config import settings
from utils.logging_config import log_task_event
from utils.pdf_validator import validate_pdf_file
from services.encryption import decrypt_pdf
from utils.r2 import upload_file, generate_signed_url

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["unlock"])


@router.post("/unlock")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def unlock_endpoint(
    request: Request,
    file: UploadFile = File(...),
    password: str = Form(...),
):
    """
    Hapus proteksi password dari file PDF.

    - **file**: File PDF terenkripsi (multipart/form-data)
    - **password**: Password untuk membuka proteksi

    Returns:
        success, download_url, expires_at, original_size, output_size
    """
    file_bytes = await file.read()
    start_time = time.time()
    input_size = len(file_bytes)

    try:
        pdf_info = validate_pdf_file(file, file_bytes, require_encrypted=True)

        decrypted_bytes = decrypt_pdf(file_bytes, password)

        original_filename = file.filename or "unlocked.pdf"
        r2_result = upload_file(
            file_bytes=decrypted_bytes,
            original_filename=original_filename,
            content_type="application/pdf",
        )

        dl_name = f"unlocked_{file.filename}" if file.filename else "unlocked.pdf"
        download_url = generate_signed_url(
            r2_result["key"], expiry_seconds=3600, download_filename=dl_name
        )

        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_completed",
            tool="unlock",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
        )

        expires_at = (
            datetime.now(timezone.utc) + timedelta(seconds=3600)
        ).isoformat()

        return {
            "success": True,
            "download_url": download_url,
            "expires_at": expires_at,
            "original_size": pdf_info.size_bytes,
            "output_size": len(decrypted_bytes),
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="unlock",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error="validation_error",
        )
        raise

    except Exception as exc:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="unlock",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Gagal memproses file. Silakan coba lagi.",
        )
