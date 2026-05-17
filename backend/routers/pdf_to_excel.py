"""
Router untuk konversi PDF ke Excel (XLSX).

POST /api/pdf-to-excel — validasi PDF, ekstrak tabel dengan Camelot,
upload hasil ke R2, polling via /api/status.

Refs: PAPYR-149, PAPYR-150, PAPYR-151
"""

import asyncio
import logging
import os
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

router = APIRouter(prefix="/api", tags=["pdf-to-excel"])

limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger(__name__)

# Constants
_CONVERSION_TIMEOUT_SECONDS = 180
_SIGNED_URL_EXPIRY_SECONDS = 3600
_XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
_MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB


async def _convert_pdf_to_excel(
    file_bytes: bytes,
    original_filename: str,
    task_id: str,
) -> dict:
    """
    Background coroutine: extract tables from PDF using Camelot,
    convert to XLSX, upload to R2.

    Returns a dict with download_url, original_size, output_size,
    expires_at, tables_found. Raises on failure.
    """
    import camelot

    input_size = len(file_bytes)

    # Write input PDF to temp file
    input_fd, input_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_pdf2excel_in_")
    try:
        os.write(input_fd, file_bytes)
    finally:
        os.close(input_fd)

    # Prepare output XLSX path
    output_fd, output_xlsx_path = tempfile.mkstemp(
        suffix=".xlsx", prefix="papyr_pdf2excel_out_"
    )
    try:
        os.close(output_fd)
    except OSError:
        pass

    try:
        # Run Camelot table extraction in thread pool
        # Using stream flavor for better text alignment extraction
        tables = await asyncio.to_thread(
            camelot.read_pdf,
            input_path,
            pages="1-end",
            flavor="stream",
        )

        if not tables or len(tables) == 0:
            raise RuntimeError("Tidak ada tabel yang ditemukan di PDF.")

        tables_found = len(tables)

        # Combine all extracted tables into one XLSX sheet
        # Each table goes to a separate sheet in the workbook
        import pandas as pd

        with pd.ExcelWriter(output_xlsx_path, engine="openpyxl") as writer:
            for i, table in enumerate(tables):
                df = table.df
                # Clean up empty rows/cols
                df = df.dropna(how="all").dropna(axis=1, how="all")
                sheet_name = f"Table_{i + 1}"
                df.to_excel(writer, sheet_name=sheet_name, index=False)

        # Validate output file
        if not os.path.exists(output_xlsx_path):
            raise RuntimeError("Camelot tidak menghasilkan file output")

        output_size = os.path.getsize(output_xlsx_path)
        if output_size == 0:
            raise RuntimeError("File output Excel kosong")

        # Read XLSX bytes
        with open(output_xlsx_path, "rb") as f:
            xlsx_bytes = f.read()

        # Upload to R2
        xlsx_filename = f"converted_{os.path.splitext(original_filename)[0]}.xlsx"
        r2_result = upload_file(
            file_bytes=xlsx_bytes,
            original_filename=xlsx_filename,
            content_type=_XLSX_CONTENT_TYPE,
        )

        # Generate signed URL
        download_url = generate_signed_url(
            r2_result["key"],
            expiry_seconds=_SIGNED_URL_EXPIRY_SECONDS,
            download_filename=xlsx_filename,
        )

        expires_at = (
            datetime.now(timezone.utc) + timedelta(seconds=_SIGNED_URL_EXPIRY_SECONDS)
        ).isoformat()

        logger.info(
            "PDF-to-Excel OK: task_id=%s input=%d output=%d tables=%d",
            task_id,
            input_size,
            output_size,
            tables_found,
        )

        return {
            "download_url": download_url,
            "original_size": input_size,
            "output_size": output_size,
            "expires_at": expires_at,
            "tables_found": tables_found,
        }

    finally:
        # Cleanup temp files
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
        except OSError:
            pass
        try:
            if os.path.exists(output_xlsx_path):
                os.remove(output_xlsx_path)
        except OSError:
            pass


@router.post("/pdf-to-excel", status_code=202)
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def pdf_to_excel_endpoint(
    request: Request,
    file: UploadFile = File(...),
):
    """
    Konversi file PDF ke Excel (XLSX).

    Ekstrak tabel dari PDF menggunakan Camelot dan konversi ke format XLSX.

    - **file**: File PDF (multipart/form-data)

    Returns:
        task_id, status, estimated_seconds — poll via GET /api/status/{task_id}
    """
    file_bytes = await file.read()
    input_size = len(file_bytes)
    start_time = time.time()

    try:
        # 1. Max file size check
        if input_size > _MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail="File terlalu besar. Maksimal 20 MB.",
            )

        # 2. Validate PDF (reject encrypted, max 50 pages)
        pdf_info = validate_pdf_file(
            file, file_bytes, reject_encrypted=True, max_pages=50
        )

        # 3. Create async task
        task = create_task(
            metadata={
                "tool": "pdf-to-excel",
                "filename": pdf_info.filename,
                "page_count": pdf_info.page_count,
            }
        )

        # 4. Compute estimated seconds
        estimated_seconds = min(180, max(30, pdf_info.page_count * 5))

        # 5. Spawn background conversion
        asyncio.create_task(
            run_task_in_background(
                _convert_pdf_to_excel,
                task_id=task.task_id,
                timeout=_CONVERSION_TIMEOUT_SECONDS,
                file_bytes=file_bytes,
                original_filename=pdf_info.filename,
            )
        )

        # 6. Log queued event
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_queued",
            tool="pdf-to-excel",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
            task_id=task.task_id,
        )

        # 7. Return 202 Accepted
        return {
            "task_id": task.task_id,
            "status": TaskStatus.QUEUED.value,
            "estimated_seconds": estimated_seconds,
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="pdf-to-excel",
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
            tool="pdf-to-excel",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Gagal memproses file. Silakan coba lagi.",
        )
