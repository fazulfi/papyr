"""
Service untuk konversi halaman PDF ke gambar (PNG).

Menggunakan PyMuPDF (fitz) untuk rasterisasi halaman PDF pada 150 DPI.
Mendukung output single PNG atau ZIP untuk multiple halaman.
"""

import logging
import os
import tempfile
import uuid
import zipfile

import fitz  # PyMuPDF
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Timeout untuk seluruh operasi rasterisasi (detik)
RASTERIZE_TIMEOUT_SECONDS = 60

# DPI default untuk rasterisasi
DEFAULT_DPI = 150


def parse_page_range(page_range: str, total_pages: int) -> list[int]:
    """
    Parse string range halaman menjadi list 0-indexed page numbers.

    Format yang didukung: "1-3,5,7-10" (1-indexed, user-facing).
    Returns list of 0-indexed page numbers, sorted dan unique.

    Args:
        page_range: String range halaman dari user (e.g. "1-3,5").
        total_pages: Jumlah total halaman dalam PDF.

    Raises:
        HTTPException(400): Jika format tidak valid atau halaman di luar jangkauan.
    """
    if not page_range or not page_range.strip():
        # Default: semua halaman
        return list(range(total_pages))

    page_range = page_range.strip()

    # Validasi karakter yang diizinkan
    allowed_chars = set("0123456789,- ")
    if not all(c in allowed_chars for c in page_range):
        raise HTTPException(
            status_code=400,
            detail="Format halaman tidak valid. Gunakan angka, koma, dan strip. Contoh: 1-3,5",
        )

    pages: set[int] = set()

    parts = [p.strip() for p in page_range.split(",") if p.strip()]

    for part in parts:
        if "-" in part:
            # Range: "1-3"
            range_parts = part.split("-")
            if len(range_parts) != 2:
                raise HTTPException(
                    status_code=400,
                    detail=f"Format range tidak valid: '{part}'. Gunakan format seperti 1-3.",
                )

            try:
                start = int(range_parts[0].strip())
                end = int(range_parts[1].strip())
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Nomor halaman tidak valid: '{part}'.",
                ) from None

            if start > end:
                raise HTTPException(
                    status_code=400,
                    detail=f"Range tidak valid: {start} lebih besar dari {end}.",
                )

            if start < 1 or end > total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Halaman di luar jangkauan: {start}-{end}. PDF ini memiliki {total_pages} halaman.",
                )

            for p in range(start, end + 1):
                pages.add(p - 1)  # Convert ke 0-indexed
        else:
            # Single page: "5"
            try:
                page_num = int(part)
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Nomor halaman tidak valid: '{part}'.",
                ) from None

            if page_num < 1 or page_num > total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Halaman {page_num} di luar jangkauan. PDF ini memiliki {total_pages} halaman.",
                )

            pages.add(page_num - 1)  # Convert ke 0-indexed

    return sorted(pages)


def rasterize_pages(
    pdf_path: str,
    pages: list[int],
    dpi: int = DEFAULT_DPI,
) -> list[str]:
    """
    Rasterisasi halaman PDF ke file PNG menggunakan PyMuPDF.

    Args:
        pdf_path: Path ke file PDF input.
        pages: List of 0-indexed page numbers.
        dpi: Resolusi output (default 150).

    Returns:
        List of output PNG file paths.

    Raises:
        HTTPException(400): Jika PDF corrupt atau halaman di luar jangkauan.
        HTTPException(500): Jika rasterisasi gagal.
    """
    output_paths: list[str] = []

    try:
        doc = fitz.open(pdf_path)
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="File PDF tidak bisa dibuka. Pastikan file tidak corrupt atau terproteksi password.",
        ) from None

    try:
        total_pages = len(doc)

        for page_idx in pages:
            if page_idx < 0 or page_idx >= total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Halaman {page_idx + 1} di luar jangkauan. PDF ini memiliki {total_pages} halaman.",
                )

            page = doc[page_idx]

            # Render halaman ke pixmap pada DPI yang ditentukan
            zoom = dpi / 72  # 72 DPI adalah default PDF
            matrix = fitz.Matrix(zoom, zoom)

            try:
                pix = page.get_pixmap(matrix=matrix)
            except Exception:
                raise HTTPException(
                    status_code=500,
                    detail=f"Gagal merender halaman {page_idx + 1}. File mungkin corrupt.",
                ) from None

            # Simpan ke temp file
            fd, output_path = tempfile.mkstemp(
                suffix=".png", prefix=f"papyr_p2i_{uuid.uuid4().hex[:8]}_"
            )
            os.close(fd)

            pix.save(output_path)
            output_paths.append(output_path)

        logger.info(
            "Rasterize OK: pages=%d dpi=%d",
            len(output_paths),
            dpi,
        )

        return output_paths

    finally:
        doc.close()


def package_output(output_paths: list[str], pages: list[int]) -> tuple[str, str]:
    """
    Package output: single PNG langsung, atau ZIP untuk multiple halaman.

    Args:
        output_paths: List of PNG file paths dari rasterize_pages().
        pages: List of 0-indexed page numbers (untuk penamaan file dalam ZIP).

    Returns:
        Tuple of (output_file_path, content_type).
        - Single page: (path_to_png, "image/png")
        - Multiple pages: (path_to_zip, "application/zip")
    """
    if len(output_paths) == 1:
        # Single page — return PNG langsung
        return output_paths[0], "image/png"

    # Multiple pages — buat ZIP
    fd, zip_path = tempfile.mkstemp(suffix=".zip", prefix="papyr_p2i_zip_")
    os.close(fd)

    try:
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for _idx, (png_path, page_idx) in enumerate(zip(output_paths, pages, strict=False)):
                # Nama file dalam ZIP: page_1.png, page_2.png, etc. (1-indexed)
                arcname = f"page_{page_idx + 1}.png"
                zf.write(png_path, arcname)

        logger.info(
            "ZIP OK: files=%d zip_size=%d",
            len(output_paths),
            os.path.getsize(zip_path),
        )

        return zip_path, "application/zip"

    except Exception:
        _cleanup(zip_path)
        raise HTTPException(
            status_code=500,
            detail="Gagal membuat file ZIP.",
        ) from None


def _cleanup(path: str) -> None:
    """Hapus file jika ada, abaikan error."""
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        pass
