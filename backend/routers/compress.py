"""
Router untuk kompresi PDF.

POST /api/compress — menerima file PDF, validasi, kompres via Ghostscript,
upload ke R2, dan return signed download URL.
"""

import logging
import os
import tempfile
import time

from fastapi import APIRouter, File, Request, UploadFile, HTTPException, Query
from slowapi import Limiter
from slowapi.util import get_remote_address

from utils.config import settings
from utils.logging_config import log_task_event
from services.compress_service import compress_pdf
from utils.r2 import upload_file, generate_signed_url

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["compress"])

ALLOWED_MIME_TYPES = {"application/pdf"}
ALLOWED_EXTENSIONS = {".pdf"}


def _validate_pdf(file: UploadFile, file_bytes: bytes) -> None:
    """
    Validasi file PDF: MIME type, ekstensi, dan ukuran.
    Raises HTTPException(400) jika tidak valid.
    """
    # Validasi MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Tipe file tidak valid: {file.content_type}. Hanya file PDF yang diterima.",
        )

    # Validasi ekstensi
    filename = file.filename or ""
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Ekstensi file tidak valid: '{ext}'. Hanya file .pdf yang diterima.",
        )

    # Validasi ukuran
    size_bytes = len(file_bytes)
    if size_bytes > settings.max_upload_size_bytes:
        max_mb = settings.max_upload_size_mb
        actual_mb = round(size_bytes / (1024 * 1024), 1)
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran file terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB.",
        )

    # Validasi file tidak kosong
    if size_bytes == 0:
        raise HTTPException(
            status_code=400,
            detail="File kosong. Silakan upload file PDF yang valid.",
        )


@router.post("/compress")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def compress_endpoint(
    request: Request,
    file: UploadFile = File(...),
    quality: str = Query("ebook", regex="^(screen|ebook|printer)$"),
):
    """
    Kompres file PDF menggunakan Ghostscript.

    - **file**: File PDF (multipart/form-data)
    - **quality**: Preset kompresi — `screen` (kecil), `ebook` (seimbang), `printer` (kualitas tinggi)

    Returns:
        download_url, original_size, compressed_size, saved_percent
    """
    # Baca file ke memory
    file_bytes = await file.read()

    # Validasi
    _validate_pdf(file, file_bytes)

    # Simpan ke temp file untuk Ghostscript
    input_path = None
    output_path = None
    input_size = len(file_bytes)
    start_time = time.time()

    try:
        # Tulis input ke temp
        input_fd, input_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_in_")
        os.close(input_fd)
        with open(input_path, "wb") as f:
            f.write(file_bytes)

        # Kompres via Ghostscript
        result = compress_pdf(input_path, quality=quality)
        output_path = result["output_path"]

        # Baca output file
        with open(output_path, "rb") as f:
            compressed_bytes = f.read()

        # Upload ke R2
        original_filename = file.filename or "compressed.pdf"
        r2_result = upload_file(
            file_bytes=compressed_bytes,
            original_filename=original_filename,
            content_type="application/pdf",
        )

        # Generate signed URL (1 jam)
        download_url = generate_signed_url(r2_result["key"], expiry_seconds=3600)

        # Hitung persentase penghematan
        original_size = result["original_size"]
        compressed_size = result["compressed_size"]
        saved_percent = round((1 - compressed_size / original_size) * 100) if original_size > 0 else 0

        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_completed",
            tool="compress",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
            saved_percent=saved_percent,
        )

        return {
            "download_url": download_url,
            "original_size": original_size,
            "compressed_size": compressed_size,
            "saved_percent": saved_percent,
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="compress",
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
            tool="compress",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(status_code=500, detail="Gagal memproses file. Silakan coba lagi.")

    finally:
        # Cleanup temp files — selalu bersihkan
        for path in (input_path, output_path):
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except OSError:
                    logger.warning("Gagal hapus temp file")
