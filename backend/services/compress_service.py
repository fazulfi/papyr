"""
Ghostscript PDF compression service.

Menggunakan Ghostscript subprocess untuk mengompres file PDF
dengan preset kualitas yang bisa dipilih user.

Benchmark Results (PAPYR-021, 2026-04-27):
┌─────────────────────┬─────────┬──────────┬────────┬──────────┐
│ File                 │ Input   │ Papyr    │ Hemat  │ Waktu    │
├─────────────────────┼─────────┼──────────┼────────┼──────────┤
│ Teks (15 halaman)   │ 61.6 KB │ 17.6 KB  │ 72%    │ 3.6s     │
│ Scan (6 halaman)    │ 16.6 MB │ 46.8 KB  │ ~100%  │ 5.5s     │
│ Presentasi (12 hal) │ 17.2 MB │ 92.5 KB  │ 99%    │ 5.3s     │
└─────────────────────┴─────────┴──────────┴────────┴──────────┘

Preset comparison (mixed 1MB PDF):
  screen:  9.7 KB (99%) | ebook: 9.7 KB (99%) | printer: 18.8 KB (98%)

Note: Synthetic test PDFs (solid-color images) compress extremely well.
Real-world PDFs with photos typically achieve 30-70% compression.
"""

import logging
import os
import subprocess
import tempfile

from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Preset Ghostscript — mapping nama ke dPDFSETTINGS value
QUALITY_PRESETS = {
    "screen": "/screen",  # Ukuran kecil, kualitas rendah (72 dpi)
    "ebook": "/ebook",  # Seimbang (150 dpi) — default
    "printer": "/printer",  # Kualitas tinggi (300 dpi)
}

# Timeout untuk proses Ghostscript (detik)
GS_TIMEOUT_SECONDS = 30


def compress_pdf(input_path: str, quality: str = "ebook") -> dict:
    """
    Kompres file PDF menggunakan Ghostscript.

    Args:
        input_path: Path ke file PDF input.
        quality: Preset kualitas — "screen", "ebook", atau "printer".

    Returns:
        dict dengan keys: output_path, original_size, compressed_size, compression_ratio

    Raises:
        HTTPException(400): Jika file PDF corrupt atau tidak bisa diproses.
        HTTPException(500): Jika Ghostscript gagal atau tidak ditemukan.
    """
    if quality not in QUALITY_PRESETS:
        raise HTTPException(
            status_code=400,
            detail=f"Preset kualitas tidak valid: '{quality}'. Pilihan: screen, ebook, printer.",
        )

    original_size = os.path.getsize(input_path)

    # Buat temp file untuk output
    output_fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_out_")
    os.close(output_fd)

    gs_preset = QUALITY_PRESETS[quality]

    cmd = [
        "gs",
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS={gs_preset}",
        "-dNOPAUSE",
        "-dBATCH",
        "-dQUIET",
        # Optimasi tambahan
        "-dDetectDuplicateImages=true",
        "-dCompressFonts=true",
        "-dSubsetFonts=true",
        f"-sOutputFile={output_path}",
        input_path,
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=GS_TIMEOUT_SECONDS,
        )
    except FileNotFoundError:
        # Ghostscript tidak terinstall
        _cleanup(output_path)
        logger.error("Ghostscript (gs) tidak ditemukan di PATH")
        raise HTTPException(
            status_code=500,
            detail="Ghostscript tidak tersedia di server. Hubungi administrator.",
        ) from None
    except subprocess.TimeoutExpired:
        _cleanup(output_path)
        logger.error(
            "Ghostscript timeout setelah %ds untuk file %d bytes", GS_TIMEOUT_SECONDS, original_size
        )
        raise HTTPException(
            status_code=500,
            detail=f"Proses kompresi melebihi batas waktu ({GS_TIMEOUT_SECONDS} detik). Coba file yang lebih kecil.",
        ) from None

    if result.returncode != 0:
        stderr = result.stderr.strip() if result.stderr else "Unknown error"
        _cleanup(output_path)
        logger.error("Ghostscript gagal (exit %d): %s", result.returncode, stderr[:200])
        raise HTTPException(
            status_code=400,
            detail="File PDF tidak bisa dikompresi. Pastikan file tidak corrupt atau terproteksi password.",
        )

    # Verifikasi output ada dan valid
    if not os.path.exists(output_path) or os.path.getsize(output_path) == 0:
        _cleanup(output_path)
        raise HTTPException(
            status_code=500,
            detail="Kompresi gagal — output file kosong.",
        )

    compressed_size = os.path.getsize(output_path)
    compression_ratio = (
        round((1 - compressed_size / original_size) * 100, 1) if original_size > 0 else 0.0
    )

    logger.info(
        "Compress OK: preset=%s original=%d compressed=%d ratio=%.1f%%",
        quality,
        original_size,
        compressed_size,
        compression_ratio,
    )

    return {
        "output_path": output_path,
        "original_size": original_size,
        "compressed_size": compressed_size,
        "compression_ratio": compression_ratio,
    }


def _cleanup(path: str) -> None:
    """Hapus file jika ada, abaikan error."""
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        pass
