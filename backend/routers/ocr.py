"""
Router untuk OCR endpoint.
POST /api/ocr — OCR processing background, R2 upload, status polling.
"""

import asyncio
import logging
import os
import tempfile
import time
from datetime import UTC, datetime, timedelta

import fitz  # PyMuPDF
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from slowapi import Limiter
from slowapi.util import get_remote_address

from services.async_task import TaskStatus, create_task, run_task_in_background
from utils.config import settings
from utils.logging_config import log_task_event
from utils.pdf_validator import validate_pdf_file
from utils.r2 import generate_signed_url, upload_file

router = APIRouter(prefix="/api", tags=["ocr"])
limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger(__name__)

_OCR_LANGS = ("ind", "eng", "ind+eng")
_OCR_TIMEOUT_SECONDS = 180


def _has_text_layer(file_bytes: bytes) -> bool:
    """
    Return True if PDF already contains extractable text on any page,
    i.e., likely has a text layer.
    Mirrors _is_scanned_pdf in pdf_to_word.py but inverted (>=10 chars on any page).
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text = page.get_text()
            if len(text.strip()) >= 10:
                doc.close()
                return True
        doc.close()
        return False
    except Exception:
        return False


async def _process_ocr(
    file_bytes: bytes,
    original_filename: str,
    language: str,
    task_id: str,
    page_count: int,
) -> dict:
    """
    Background OCR processing: run ocrmypdf.ocr in thread,
    upload result to R2, return result dict.
    """
    import ocrmypdf

    input_size = len(file_bytes)

    # Write input PDF to temp file
    input_fd, input_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_ocr_in_")
    try:
        os.write(input_fd, file_bytes)
    finally:
        os.close(input_fd)

    # Prepare output temp file
    output_fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_ocr_out_")
    try:
        os.close(output_fd)
    except OSError:
        pass

    try:
        # Run ocrmypdf.ocr in thread pool to avoid blocking event loop
        await asyncio.to_thread(
            ocrmypdf.ocr,
            input_path,
            output_path,
            language=language,
            deskew=True,
            oversample=300,
            tesseract_pagesegmode=6,
            optimize=1,
            skip_text=True,
            progress_bar=False,
        )

        # Validate output file
        if not os.path.exists(output_path):
            raise RuntimeError("Output file not created")
        output_size = os.path.getsize(output_path)
        if output_size == 0:
            raise RuntimeError("Output file is empty")

        # Read output bytes
        with open(output_path, "rb") as f:
            output_bytes = f.read()

        # Upload to R2
        ocr_filename = f"ocr_{original_filename}"
        r2_result = upload_file(
            file_bytes=output_bytes,
            original_filename=ocr_filename,
            content_type="application/pdf",
        )

        # Generate signed URL (60-minute expiry = 3600s)
        download_url = generate_signed_url(
            r2_result["key"],
            expiry_seconds=3600,
            download_filename=ocr_filename,
        )

        expires_at = (datetime.now(UTC) + timedelta(seconds=3600)).isoformat()

        logger.info(
            "OCR OK: task_id=%s input=%d output=%d pages=%d lang=%s",
            task_id,
            input_size,
            output_size,
            page_count,
            language,
        )

        return {
            "download_url": download_url,
            "original_size": input_size,
            "output_size": output_size,
            "expires_at": expires_at,
            "pages_processed": page_count,
            "language_used": language,
        }

    except RuntimeError:
        raise
    except Exception as exc:
        logger.error("OCR failed for task %s: %s", task_id, str(exc))
        raise RuntimeError(f"OCR processing failed: {str(exc)[:200]}") from exc

    finally:
        # Cleanup temp files
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
        except OSError:
            pass
        try:
            if os.path.exists(output_path):
                os.remove(output_path)
        except OSError:
            pass


@router.post("/ocr", status_code=202)
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def ocr_endpoint(
    request: Request,
    file: UploadFile = File(...),
    language: str = Form("ind+eng"),
):
    """
    OCR endpoint: validates PDF, rejects encrypted & text-layer PDFs,
    starts background OCR task, returns 202 with task_id and estimated_seconds.
    """
    file_bytes = await file.read()
    input_size = len(file_bytes)
    start_time = time.time()

    try:
        # 1. Validate PDF (reject encrypted, max 50 pages)
        pdf_info = validate_pdf_file(file, file_bytes, reject_encrypted=True, max_pages=50)

        # 2. Language validation
        if language not in _OCR_LANGS:
            raise HTTPException(
                status_code=400,
                detail="Bahasa OCR tidak valid. Gunakan: ind, eng, atau ind+eng.",
            )

        # 3. Detect if already has text layer
        if _has_text_layer(file_bytes):
            raise HTTPException(
                status_code=400,
                detail="PDF sudah memiliki text layer",
            )

        # 4. Create async task
        task = create_task(
            metadata={
                "tool": "ocr",
                "filename": pdf_info.filename,
                "page_count": pdf_info.page_count,
            }
        )

        # 5. Compute estimated seconds
        estimated_seconds = min(180, max(30, pdf_info.page_count * 6))

        # 6. Spawn background processing
        asyncio.create_task(
            run_task_in_background(
                _process_ocr,
                task_id=task.task_id,
                timeout=_OCR_TIMEOUT_SECONDS,
                file_bytes=file_bytes,
                original_filename=pdf_info.filename,
                language=language,
                page_count=pdf_info.page_count,
            )
        )

        # 7. Log queued event
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_queued",
            tool="ocr",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
            task_id=task.task_id,
        )

        # 8. Return 202 Accepted
        return {
            "task_id": task.task_id,
            "status": TaskStatus.QUEUED.value,
            "estimated_seconds": estimated_seconds,
            "page_count": pdf_info.page_count,
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="ocr",
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
            tool="ocr",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Gagal memproses file. Silakan coba lagi.",
        ) from exc
