"""
Router untuk konversi PDF ke Word (DOCX).

POST /api/pdf-to-word — validasi, deteksi scan, buat async task,
jalankan LibreOffice headless di background, upload ke R2, polling via /api/status.

Refs: PAPYR-129, PAPYR-130, PAPYR-132
"""

import asyncio
import logging
import os
import subprocess
import tempfile
import time
from datetime import datetime, timedelta, timezone

import fitz  # PyMuPDF
from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from slowapi import Limiter
from slowapi.util import get_remote_address

from services.async_task import (
    TaskStatus,
    create_task,
    run_task_in_background,
)
from utils.config import settings
from utils.logging_config import log_task_event
from utils.pdf_validator import validate_pdf_file
from utils.r2 import generate_signed_url, upload_file

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["pdf-to-word"])

# Constants
_CONVERSION_TIMEOUT_SECONDS = 120
_SIGNED_URL_EXPIRY_SECONDS = 3600
_DOCX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
_SCANNED_TEXT_THRESHOLD = 10  # chars per page


def _is_scanned_pdf(file_bytes: bytes) -> bool:
    """
    Heuristic to detect scanned PDFs.
    Returns True if all pages have < 10 characters of extractable text.
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text = page.get_text().strip()
            if len(text) >= _SCANNED_TEXT_THRESHOLD:
                doc.close()
                return False
        doc.close()
        return True
    except Exception:
        return False


def _create_layout_docx(input_path: str, output_path: str) -> None:
    """Create a DOCX with layout-aware PDF conversion as a LibreOffice fallback."""
    from pdf2docx import Converter

    converter = Converter(input_path)
    try:
        converter.convert(
            output_path,
            start=0,
            end=None,
            multi_processing=False,
            ignore_page_error=True,
        )
    finally:
        converter.close()


async def _convert_pdf_to_docx(
    file_bytes: bytes,
    original_filename: str,
    task_id: str,
) -> dict[str, str | int]:
    """
    Background coroutine: convert PDF to DOCX via LibreOffice, upload to R2.

    Returns a dict with download_url, original_size, output_size, expires_at.
    Raises on failure.
    """
    input_size = len(file_bytes)

    # Write PDF to temp file
    input_fd, input_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_pdf2word_in_")
    try:
        os.write(input_fd, file_bytes)
    finally:
        os.close(input_fd)

    output_dir = tempfile.mkdtemp(prefix="papyr_pdf2word_out_")

    try:
        # Run LibreOffice headless
        cmd = [
            "libreoffice",
            "--headless",
            "--convert-to",
            "docx",
            "--outdir",
            output_dir,
            input_path,
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=_CONVERSION_TIMEOUT_SECONDS,
        )

        if result.returncode != 0:
            stderr = result.stderr.strip() if result.stderr else "Unknown error"
            logger.error("LibreOffice failed (exit %d): %s", result.returncode, stderr[:200])
            raise RuntimeError(f"LibreOffice conversion failed: {stderr[:100]}")

        # Find output DOCX
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        output_path = os.path.join(output_dir, f"{base_name}.docx")

        if not os.path.exists(output_path):
            logger.warning(
                "LibreOffice did not produce output file for task %s; using layout-aware fallback",
                task_id,
            )
            _create_layout_docx(input_path, output_path)

        output_size = os.path.getsize(output_path)
        if output_size == 0:
            raise RuntimeError("LibreOffice produced empty output file")

        # Read DOCX bytes
        with open(output_path, "rb") as f:
            docx_bytes = f.read()

        # Upload to R2
        docx_filename = f"converted_{os.path.splitext(original_filename)[0]}.docx"
        r2_result = upload_file(
            file_bytes=docx_bytes,
            original_filename=docx_filename,
            content_type=_DOCX_CONTENT_TYPE,
        )

        # Generate signed URL
        download_url = generate_signed_url(
            r2_result["key"],
            expiry_seconds=_SIGNED_URL_EXPIRY_SECONDS,
            download_filename=docx_filename,
        )

        expires_at = (
            datetime.now(timezone.utc) + timedelta(seconds=_SIGNED_URL_EXPIRY_SECONDS)
        ).isoformat()

        logger.info(
            "PDF-to-Word OK: task_id=%s input=%d output=%d",
            task_id,
            input_size,
            output_size,
        )

        return {
            "download_url": download_url,
            "original_size": input_size,
            "output_size": output_size,
            "expires_at": expires_at,
        }

    except subprocess.TimeoutExpired:
        logger.error("LibreOffice timeout after %ds for task %s", _CONVERSION_TIMEOUT_SECONDS, task_id)
        raise RuntimeError(f"Conversion timeout (>{_CONVERSION_TIMEOUT_SECONDS}s)")

    except FileNotFoundError:
        logger.error("LibreOffice not found in PATH")
        raise RuntimeError("LibreOffice tidak tersedia di server")

    finally:
        # Cleanup temp files
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
        except OSError:
            pass
        try:
            for fname in os.listdir(output_dir):
                os.remove(os.path.join(output_dir, fname))
            os.rmdir(output_dir)
        except OSError:
            pass


@router.post("/pdf-to-word", status_code=202)
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def pdf_to_word_endpoint(
    request: Request,
    file: UploadFile = File(...),
):
    """
    Konversi file PDF ke Word (DOCX).

    - **file**: File PDF (multipart/form-data)

    Returns:
        task_id, status, estimated_seconds — poll via GET /api/status/{task_id}
    """
    file_bytes = await file.read()
    input_size = len(file_bytes)
    start_time = time.time()

    try:
        # 1. Validate PDF (shared validator — reject encrypted, max 100 pages)
        pdf_info = validate_pdf_file(file, file_bytes, reject_encrypted=True, max_pages=100)

        # 2. Scanned PDF detection
        if _is_scanned_pdf(file_bytes):
            raise HTTPException(
                status_code=400,
                detail="PDF ini adalah scan, gunakan OCR terlebih dahulu.",
            )

        # 3. Create async task
        task = create_task(
            metadata={
                "tool": "pdf-to-word",
                "filename": pdf_info.filename,
                "page_count": pdf_info.page_count,
            }
        )

        # 4. Spawn background conversion
        asyncio.create_task(
            run_task_in_background(
                _convert_pdf_to_docx,
                task_id=task.task_id,
                timeout=_CONVERSION_TIMEOUT_SECONDS,
                file_bytes=file_bytes,
                original_filename=pdf_info.filename,
            )
        )

        # 5. Return 202 Accepted
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_queued",
            tool="pdf-to-word",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
            task_id=task.task_id,
        )

        return {
            "task_id": task.task_id,
            "status": TaskStatus.QUEUED.value,
            "estimated_seconds": 30,
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="pdf-to-word",
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
            tool="pdf-to-word",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Gagal memproses file. Silakan coba lagi.",
        )
