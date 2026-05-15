"""
Router untuk image watermark pada PDF.

POST /api/watermark menerima PDF + watermark image + config JSON,
overlay image pada setiap halaman, upload ke R2, return signed URL.

Note: Text watermark diproses 100% client-side (pdf-lib).
Endpoint ini hanya untuk IMAGE watermark.
"""

import json
import logging
import os
import tempfile
import time
from datetime import datetime, timedelta, timezone

import fitz
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from slowapi import Limiter
from slowapi.util import get_remote_address

from utils.config import settings
from utils.logging_config import log_task_event
from utils.pdf_validator import validate_pdf_file
from utils.r2 import generate_signed_url, upload_file

limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["watermark"])

ALLOWED_IMAGE_MIMES = {"image/png", "image/jpeg"}
ALLOWED_POSITIONS = {"center", "top-left", "top-right", "bottom-left", "bottom-right"}
MAX_IMAGE_SIZE = 2 * 1024 * 1024
DEFAULT_CONFIG = '{"opacity": 0.3, "position": "center", "scale": 0.5}'


def _cleanup(path: str | None) -> None:
    if not path:
        return
    try:
        if os.path.exists(path):
            os.remove(path)
    except OSError:
        logger.warning("Gagal hapus temp file: %s", path)


def _validate_watermark_image(watermark_image: UploadFile, image_bytes: bytes) -> None:
    if watermark_image.content_type not in ALLOWED_IMAGE_MIMES:
        raise HTTPException(
            status_code=400,
            detail="Format watermark tidak valid. Hanya PNG dan JPG.",
        )

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="File watermark kosong.")

    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File watermark terlalu besar. Maksimal 2MB.",
        )


def _parse_watermark_config(config: str) -> dict[str, float | str]:
    try:
        raw = json.loads(config)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Config JSON tidak valid.") from exc

    try:
        opacity = float(raw.get("opacity", 0.3))
        scale = float(raw.get("scale", 0.5))
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Config watermark tidak valid.") from exc

    position = str(raw.get("position", "center"))

    if not (0.1 <= opacity <= 1.0):
        raise HTTPException(status_code=400, detail="Opacity harus antara 0.1 dan 1.0.")

    if not (0.1 <= scale <= 1.0):
        raise HTTPException(status_code=400, detail="Scale harus antara 0.1 dan 1.0.")

    if position not in ALLOWED_POSITIONS:
        raise HTTPException(status_code=400, detail="Posisi watermark tidak valid.")

    return {"opacity": opacity, "position": position, "scale": scale}


def _calculate_watermark_rect(
    page_width: float,
    page_height: float,
    image_width: float,
    image_height: float,
    position: str,
    scale: float,
) -> fitz.Rect:
    watermark_width = page_width * scale
    aspect_ratio = image_width / image_height if image_height > 0 else 1
    watermark_height = watermark_width / aspect_ratio
    padding = 20

    if position == "top-left":
        x0, y0 = padding, padding
    elif position == "top-right":
        x0, y0 = page_width - watermark_width - padding, padding
    elif position == "bottom-left":
        x0, y0 = padding, page_height - watermark_height - padding
    elif position == "bottom-right":
        x0 = page_width - watermark_width - padding
        y0 = page_height - watermark_height - padding
    else:
        x0 = (page_width - watermark_width) / 2
        y0 = (page_height - watermark_height) / 2

    return fitz.Rect(x0, y0, x0 + watermark_width, y0 + watermark_height)


def _apply_image_watermark(
    pdf_bytes: bytes,
    image_bytes: bytes,
    image_content_type: str,
    config: dict[str, float | str],
) -> tuple[bytes, int]:
    output_path = None
    image_path = None
    doc = None
    image_doc = None

    try:
        image_ext = ".png" if image_content_type == "image/png" else ".jpg"
        image_fd, image_path = tempfile.mkstemp(suffix=image_ext, prefix="papyr_wm_")
        os.close(image_fd)
        with open(image_path, "wb") as image_file:
            image_file.write(image_bytes)

        image_doc = fitz.open(image_path)
        image_rect = image_doc[0].rect
        image_width = image_rect.width
        image_height = image_rect.height

        doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        pages_processed = 0
        opacity = float(config["opacity"])
        position = str(config["position"])
        scale = float(config["scale"])

        for page in doc:
            rect = _calculate_watermark_rect(
                page.rect.width,
                page.rect.height,
                image_width,
                image_height,
                position,
                scale,
            )
            page.insert_image(
                rect,
                filename=image_path,
                overlay=True,
                alpha=int(opacity * 255),
            )
            pages_processed += 1

        output_fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_wmout_")
        os.close(output_fd)
        doc.save(output_path)

        with open(output_path, "rb") as output_file:
            output_bytes = output_file.read()

        if len(output_bytes) == 0:
            raise HTTPException(status_code=500, detail="Gagal memproses file. Silakan coba lagi.")

        return output_bytes, pages_processed
    finally:
        if image_doc is not None:
            image_doc.close()
        if doc is not None:
            doc.close()
        _cleanup(image_path)
        _cleanup(output_path)


@router.post("/watermark")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def watermark_endpoint(
    request: Request,
    file: UploadFile = File(...),
    watermark_image: UploadFile = File(...),
    config: str = Form(DEFAULT_CONFIG),
):
    """Tambah image watermark ke semua halaman PDF."""
    pdf_bytes = await file.read()
    image_bytes = await watermark_image.read()
    start_time = time.time()
    input_size = len(pdf_bytes)

    try:
        validate_pdf_file(file, pdf_bytes, reject_encrypted=True)
        _validate_watermark_image(watermark_image, image_bytes)
        parsed_config = _parse_watermark_config(config)

        output_bytes, pages_processed = _apply_image_watermark(
            pdf_bytes,
            image_bytes,
            watermark_image.content_type or "image/jpeg",
            parsed_config,
        )

        output_filename = f"watermarked_{file.filename or 'document.pdf'}"
        r2_result = upload_file(
            file_bytes=output_bytes,
            original_filename=output_filename,
            content_type="application/pdf",
        )
        download_url = generate_signed_url(
            r2_result["key"],
            expiry_seconds=3600,
            download_filename=output_filename,
        )

        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_completed",
            tool="watermark",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
            pages_processed=pages_processed,
        )

        return {
            "success": True,
            "download_url": download_url,
            "expires_at": (datetime.now(timezone.utc) + timedelta(seconds=3600)).isoformat(),
            "pages_processed": pages_processed,
        }
    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="watermark",
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
            tool="watermark",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Gagal memproses file. Silakan coba lagi.",
        ) from exc
