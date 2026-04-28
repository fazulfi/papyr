"""
Router untuk konversi PDF ke gambar (PNG).

POST /api/pdf-to-image — menerima file PDF + parameter halaman,
rasterisasi via PyMuPDF, upload ke R2, return signed download URL.
"""

import logging
import os
import tempfile

from fastapi import APIRouter, File, Form, Request, UploadFile, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

import fitz  # PyMuPDF — untuk mendapatkan total halaman saat validasi

from utils.config import settings
from utils.r2 import upload_file, generate_signed_url
from services.pdf_to_image_service import (
    parse_page_range,
    rasterize_pages,
    package_output,
)

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["pdf-to-image"])

ALLOWED_MIME_TYPES = {"application/pdf"}
ALLOWED_EXTENSIONS = {".pdf"}

# Magic bytes untuk PDF
_PDF_MAGIC = b"%PDF"


def _validate_pdf(file: UploadFile, file_bytes: bytes) -> None:
    """
    Validasi file PDF: kosong, MIME type, ekstensi, magic bytes, dan ukuran.
    Raises HTTPException(400) jika tidak valid.
    """
    filename = file.filename or "unknown"

    # Validasi file tidak kosong
    size_bytes = len(file_bytes)
    if size_bytes == 0:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" kosong. Silakan upload file PDF yang valid.',
        )

    # Validasi MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" bukan format yang didukung. Hanya file PDF.',
        )

    # Validasi ekstensi
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" ekstensi tidak valid. Hanya file .pdf.',
        )

    # Validasi magic bytes — file harus benar-benar PDF
    if file_bytes[:4] != _PDF_MAGIC:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.',
        )

    # Validasi ukuran
    if size_bytes > settings.max_upload_size_bytes:
        max_mb = settings.max_upload_size_mb
        actual_mb = round(size_bytes / (1024 * 1024), 1)
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB.',
        )


@router.post("/pdf-to-image")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def pdf_to_image_endpoint(
    request: Request,
    file: UploadFile = File(...),
    pages: str = Form(""),
):
    """
    Konversi halaman PDF menjadi gambar PNG.

    - **file**: File PDF (multipart/form-data)
    - **pages**: Halaman yang dikonversi, e.g. "1-3,5" (kosong = semua halaman)

    Returns:
        download_url, file_type ("png" | "zip"), page_count
    """
    # Baca file ke memory
    file_bytes = await file.read()

    # Validasi PDF
    _validate_pdf(file, file_bytes)

    # Simpan ke temp file untuk PyMuPDF
    input_path = None
    output_paths: list[str] = []
    package_path = None

    try:
        # Tulis input ke temp
        input_fd, input_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_p2i_in_")
        os.close(input_fd)
        with open(input_path, "wb") as f:
            f.write(file_bytes)

        # Buka PDF untuk mendapatkan total halaman
        try:
            doc = fitz.open(input_path)
            total_pages = len(doc)
            doc.close()
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="File PDF tidak bisa dibuka. Pastikan file tidak corrupt atau terproteksi password.",
            )

        if total_pages == 0:
            raise HTTPException(
                status_code=400,
                detail="File PDF tidak memiliki halaman.",
            )

        # Parse page range
        page_list = parse_page_range(pages, total_pages)

        # Rasterisasi halaman
        output_paths = rasterize_pages(input_path, page_list)

        # Package output (single PNG atau ZIP)
        package_path, content_type = package_output(output_paths, page_list)

        # Baca output file
        with open(package_path, "rb") as f:
            output_bytes = f.read()

        # Tentukan filename dan tipe untuk R2
        if content_type == "image/png":
            original_filename = "page.png"
            file_type = "png"
        else:
            original_filename = "pages.zip"
            file_type = "zip"

        # Upload ke R2
        r2_result = upload_file(
            file_bytes=output_bytes,
            original_filename=original_filename,
            content_type=content_type,
        )

        # Generate signed URL (1 jam)
        download_url = generate_signed_url(r2_result["key"], expiry_seconds=3600)

        logger.info(
            "PDF-to-Image OK: pages=%d type=%s size=%d key=%s",
            len(page_list),
            file_type,
            len(output_bytes),
            r2_result["key"],
        )

        return {
            "download_url": download_url,
            "file_type": file_type,
            "page_count": len(page_list),
        }

    finally:
        # Cleanup semua temp files
        all_paths = [input_path] + output_paths
        # Tambahkan package_path jika berbeda dari output_paths (ZIP file)
        if package_path and package_path not in output_paths:
            all_paths.append(package_path)

        for path in all_paths:
            if path and os.path.exists(path):
                try:
                    os.remove(path)
                except OSError:
                    logger.warning("Gagal hapus temp file: %s", path)
