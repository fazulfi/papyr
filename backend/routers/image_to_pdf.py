"""
Router untuk konversi gambar ke PDF.

POST /api/image-to-pdf — menerima beberapa file gambar (JPG/PNG),
konversi ke PDF via PyMuPDF, upload ke R2, return signed download URL.
"""

import logging
import os
import tempfile
import time

import fitz  # PyMuPDF
from fastapi import APIRouter, File, HTTPException, Request, UploadFile
from slowapi import Limiter
from slowapi.util import get_remote_address

from utils.config import settings
from utils.logging_config import log_task_event
from utils.r2 import generate_signed_url, upload_file

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["image-to-pdf"])

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


# Magic bytes for image format detection
_JPEG_MAGIC = b"\xff\xd8\xff"
_PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
_WEBP_RIFF = b"RIFF"
_WEBP_MAGIC = b"WEBP"


def _validate_image(file: UploadFile, file_bytes: bytes) -> None:
    """
    Validasi file gambar: MIME type, ekstensi, magic bytes, dan ukuran.
    Raises HTTPException(400) jika tidak valid.
    """
    filename = file.filename or "unknown"

    # Validasi file tidak kosong
    size_bytes = len(file_bytes)
    if size_bytes == 0:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" kosong. Silakan upload gambar yang valid.',
        )

    # Validasi MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" bukan format yang didukung. Hanya JPG, PNG, dan WEBP.',
        )

    # Validasi ekstensi
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" ekstensi tidak valid. Hanya .jpg, .jpeg, .png, .webp.',
        )

    # Validasi magic bytes — file harus benar-benar gambar, bukan text/binary lain
    is_jpeg = file_bytes[:3] == _JPEG_MAGIC
    is_png = file_bytes[:8] == _PNG_MAGIC
    is_webp = (
        len(file_bytes) >= 12 and file_bytes[:4] == _WEBP_RIFF and file_bytes[8:12] == _WEBP_MAGIC
    )
    if not (is_jpeg or is_png or is_webp):
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" bukan file gambar yang valid. Konten file tidak sesuai format JPG/PNG/WEBP.',
        )

    # Validasi ukuran
    if size_bytes > settings.max_upload_size_bytes:
        max_mb = settings.max_upload_size_mb
        actual_mb = round(size_bytes / (1024 * 1024), 1)
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB.',
        )


@router.post("/image-to-pdf")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def image_to_pdf_endpoint(
    request: Request,
    files: list[UploadFile] = File(...),
):
    """
    Konversi beberapa gambar (JPG/PNG) menjadi satu file PDF.

    - **files**: Satu atau lebih file gambar (multipart/form-data)

    Returns:
        download_url, image_count, pdf_size
    """
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="Minimal 1 gambar diperlukan.")

    # Baca dan validasi semua file terlebih dahulu
    image_data: list[tuple[str, bytes]] = []  # (filename, bytes)

    for file in files:
        file_bytes = await file.read()
        _validate_image(file, file_bytes)
        image_data.append((file.filename or "image.jpg", file_bytes))

    # Buat PDF dari gambar menggunakan PyMuPDF
    output_path = None
    temp_paths: list[str] = []
    input_size = sum(len(img_bytes) for _, img_bytes in image_data)
    start_time = time.time()

    try:
        doc = fitz.open()

        for _idx, (filename, img_bytes) in enumerate(image_data):
            # Simpan gambar ke temp file (PyMuPDF butuh path atau bytes)
            lower_name = filename.lower()
            if lower_name.endswith(".png"):
                suffix = ".png"
            elif lower_name.endswith(".webp"):
                suffix = ".webp"
            else:
                suffix = ".jpg"
            fd, temp_path = tempfile.mkstemp(suffix=suffix, prefix="papyr_img_")
            os.close(fd)
            temp_paths.append(temp_path)

            with open(temp_path, "wb") as f:
                f.write(img_bytes)

            # Buka gambar untuk mendapatkan dimensi
            try:
                img = fitz.open(temp_path)
                rect = img[0].rect  # dimensi halaman pertama dari gambar
                img.close()
            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail=f'"{filename}" tidak bisa dibaca sebagai gambar. File mungkin rusak.',
                ) from None

            # Buat halaman PDF sesuai ukuran gambar
            page = doc.new_page(width=rect.width, height=rect.height)
            page.insert_image(rect, filename=temp_path)

        # Simpan PDF ke temp file
        fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_img2pdf_")
        os.close(fd)
        doc.save(output_path)
        doc.close()

        # Baca output
        with open(output_path, "rb") as f:
            pdf_bytes = f.read()

        # Upload ke R2
        r2_result = upload_file(
            file_bytes=pdf_bytes,
            original_filename="images.pdf",
            content_type="application/pdf",
        )

        # Generate signed URL (1 jam) — force download, bukan inline
        download_url = generate_signed_url(
            r2_result["key"], expiry_seconds=3600, download_filename="images.pdf"
        )

        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_completed",
            tool="image-to-pdf",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
            image_count=len(image_data),
        )

        return {
            "download_url": download_url,
            "image_count": len(image_data),
            "pdf_size": len(pdf_bytes),
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="image-to-pdf",
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
            tool="image-to-pdf",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500, detail="Gagal memproses file. Silakan coba lagi."
        ) from exc

    finally:
        # Cleanup semua temp files
        all_paths = temp_paths + ([output_path] if output_path else [])
        for path in all_paths:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except OSError:
                    logger.warning("Gagal hapus temp file")
