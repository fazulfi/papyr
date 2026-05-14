"""
Shared PDF validation utilities for Papyr.

Digunakan oleh semua endpoint yang menerima file PDF.
Validasi: kosong, MIME type, ekstensi, magic bytes, ukuran, page count, encrypted status.
"""

import logging
from dataclasses import dataclass
from typing import Optional

import fitz  # PyMuPDF
from fastapi import UploadFile, HTTPException

from .config import settings

logger = logging.getLogger(__name__)

# Constants
ALLOWED_MIME_TYPES = {"application/pdf"}
ALLOWED_EXTENSIONS = {".pdf"}
PDF_MAGIC = b"%PDF"


@dataclass
class PDFInfo:
    """Metadata hasil validasi PDF."""

    size_bytes: int
    page_count: int
    is_encrypted: bool
    filename: str


def validate_pdf_file(
    file: UploadFile,
    file_bytes: bytes,
    *,
    max_size_bytes: Optional[int] = None,
    max_pages: Optional[int] = None,
    require_encrypted: bool = False,
    reject_encrypted: bool = False,
) -> PDFInfo:
    """
    Validasi file PDF secara komprehensif.

    Args:
        file: FastAPI UploadFile object.
        file_bytes: Raw bytes dari file.
        max_size_bytes: Override max size (default: settings.max_upload_size_bytes).
        max_pages: Jika set, tolak PDF dengan halaman lebih dari ini.
        require_encrypted: Jika True, tolak PDF yang TIDAK terenkripsi.
        reject_encrypted: Jika True, tolak PDF yang terenkripsi.

    Returns:
        PDFInfo dengan metadata file.

    Raises:
        HTTPException: Jika validasi gagal.
    """
    filename = file.filename or "unknown"
    size_bytes = len(file_bytes)
    effective_max = max_size_bytes or settings.max_upload_size_bytes

    # 1. File tidak kosong
    if size_bytes == 0:
        raise HTTPException(
            status_code=400,
            detail="File kosong. Silakan upload file PDF yang valid.",
        )

    # 2. MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Tipe file tidak valid: {file.content_type}. Hanya file PDF yang diterima.",
        )

    # 3. Ekstensi
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Ekstensi file tidak valid: '{ext}'. Hanya file .pdf yang diterima.",
        )

    # 4. Magic bytes
    if file_bytes[:4] != PDF_MAGIC:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.',
        )

    # 5. Ukuran
    if size_bytes > effective_max:
        max_mb = effective_max / (1024 * 1024)
        actual_mb = round(size_bytes / (1024 * 1024), 1)
        raise HTTPException(
            status_code=413,
            detail=f"Ukuran file terlalu besar: {actual_mb}MB. Maksimal {max_mb:.0f}MB.",
        )

    # 6. Buka PDF untuk metadata
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        page_count = doc.page_count
        is_encrypted = doc.is_encrypted
        doc.close()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" bukan file PDF yang valid atau file corrupt.',
        )

    # 7. Page count limit
    if max_pages and page_count > max_pages:
        raise HTTPException(
            status_code=400,
            detail=f"PDF terlalu panjang: {page_count} halaman. Maksimal {max_pages} halaman.",
        )

    # 8. Encrypted status checks
    if reject_encrypted and is_encrypted:
        raise HTTPException(
            status_code=400,
            detail="PDF ini dilindungi kata sandi. Gunakan fitur Unlock terlebih dahulu.",
        )

    if require_encrypted and not is_encrypted:
        raise HTTPException(
            status_code=400,
            detail="PDF ini tidak terproteksi. Fitur ini hanya untuk PDF yang dilindungi password.",
        )

    return PDFInfo(
        size_bytes=size_bytes,
        page_count=page_count,
        is_encrypted=is_encrypted,
        filename=filename,
    )
