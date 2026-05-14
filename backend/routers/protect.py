"""
Router untuk proteksi PDF (password protect).

POST /api/protect — menerima file PDF + password, validasi, enkripsi via PyMuPDF,
upload ke R2, dan return signed download URL.
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
from services.encryption import encrypt_pdf, ENCRYPTION_METHODS
from utils.r2 import upload_file, generate_signed_url

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["protect"])

# Password constraints
_PASSWORD_MIN_LENGTH = 4
_PASSWORD_MAX_LENGTH = 128


@router.post("/protect")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def protect_endpoint(
    request: Request,
    file: UploadFile = File(...),
    password: str = Form(...),
    encryption: str = Form("aes256"),
):
    """
    Proteksi file PDF dengan password menggunakan AES encryption.

    - **file**: File PDF (multipart/form-data)
    - **password**: Password untuk proteksi (4-128 karakter)
    - **encryption**: Metode enkripsi — `aes128` atau `aes256` (default: aes256)

    Returns:
        success, download_url, expires_at, original_size, output_size
    """
    # 1. Baca file dan start timing BEFORE try
    file_bytes = await file.read()
    start_time = time.time()
    input_size = len(file_bytes)

    try:
        # 2. Validasi PDF (shared validator — reject encrypted)
        pdf_info = validate_pdf_file(file, file_bytes, reject_encrypted=True)

        # 3. Validasi password length
        if len(password) < _PASSWORD_MIN_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Password terlalu pendek. Minimal {_PASSWORD_MIN_LENGTH} karakter.",
            )
        if len(password) > _PASSWORD_MAX_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Password terlalu panjang. Maksimal {_PASSWORD_MAX_LENGTH} karakter.",
            )

        # 4. Validasi encryption method
        if encryption not in ENCRYPTION_METHODS:
            raise HTTPException(
                status_code=400,
                detail=f"Metode enkripsi tidak valid: '{encryption}'. Pilihan: aes128, aes256.",
            )

        # 5. Enkripsi PDF
        encrypted_bytes = encrypt_pdf(file_bytes, password, method=encryption)

        # 6. Upload ke R2
        original_filename = file.filename or "protected.pdf"
        r2_result = upload_file(
            file_bytes=encrypted_bytes,
            original_filename=original_filename,
            content_type="application/pdf",
        )

        # 7. Generate signed URL (1 jam)
        dl_name = f"protected_{file.filename}" if file.filename else "protected.pdf"
        download_url = generate_signed_url(
            r2_result["key"], expiry_seconds=3600, download_filename=dl_name
        )

        # 8. Response
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_completed",
            tool="protect",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
            encryption_method=encryption,
        )

        expires_at = (
            datetime.now(timezone.utc) + timedelta(seconds=3600)
        ).isoformat()

        return {
            "success": True,
            "download_url": download_url,
            "expires_at": expires_at,
            "original_size": pdf_info.size_bytes,
            "output_size": len(encrypted_bytes),
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="protect",
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
            tool="protect",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Gagal memproteksi file. Silakan coba lagi.",
        )
