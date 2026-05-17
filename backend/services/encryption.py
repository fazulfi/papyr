"""
PDF encryption/decryption service using PyMuPDF (fitz).

Shared antara:
- POST /api/protect (encrypt)
- POST /api/unlock (decrypt)

Supports AES-128 and AES-256 encryption methods.
"""

import logging
import os
import tempfile

import fitz  # PyMuPDF
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Encryption method mapping
PDF_ENCRYPT_AES_128 = fitz.PDF_ENCRYPT_AES_128
PDF_ENCRYPT_AES_256 = fitz.PDF_ENCRYPT_AES_256
PDF_PERM_ACCESSIBILITY = fitz.PDF_PERM_ACCESSIBILITY
PDF_PERM_ANNOTATE = fitz.PDF_PERM_ANNOTATE
PDF_PERM_FORM = fitz.PDF_PERM_FORM

ENCRYPTION_METHODS = {
    "aes128": PDF_ENCRYPT_AES_128,
    "aes256": PDF_ENCRYPT_AES_256,
}

# Permission flags — deny print and copy by default
DEFAULT_PERMISSIONS = PDF_PERM_ACCESSIBILITY | PDF_PERM_ANNOTATE | PDF_PERM_FORM


def encrypt_pdf(
    file_bytes: bytes,
    password: str,
    method: str = "aes256",
    permissions: int | None = None,
) -> bytes:
    """
    Enkripsi PDF dengan password menggunakan PyMuPDF.

    Args:
        file_bytes: Raw PDF bytes.
        password: Password untuk enkripsi (user_pw dan owner_pw sama).
        method: "aes128" atau "aes256".
        permissions: Permission flags (default: deny print + copy).

    Returns:
        Encrypted PDF bytes.

    Raises:
        HTTPException(400): Jika metode enkripsi tidak valid atau file corrupt.
        HTTPException(409): Jika PDF sudah terenkripsi.
        HTTPException(500): Jika enkripsi gagal.
    """
    encryption_flag = ENCRYPTION_METHODS.get(method)
    if encryption_flag is None:
        logger.warning("Metode enkripsi tidak valid: '%s'", method)
        raise HTTPException(
            status_code=400,
            detail=f"Metode enkripsi tidak valid: '{method}'. Pilihan: aes128, aes256.",
        )

    if not password:
        raise HTTPException(
            status_code=400,
            detail="Password tidak boleh kosong.",
        )

    perm = permissions if permissions is not None else DEFAULT_PERMISSIONS

    doc = None
    output_path = None
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="File PDF tidak bisa dibuka. File mungkin corrupt.",
        ) from None

    try:
        if doc.is_encrypted:
            logger.warning("PDF sudah terenkripsi")
            raise HTTPException(
                status_code=409,
                detail="PDF sudah terenkripsi. Tidak bisa menambahkan proteksi ganda.",
            )

        fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_enc_")
        os.close(fd)

        doc.save(
            output_path,
            encryption=encryption_flag,
            owner_pw=password,
            user_pw=password,
            permissions=perm,
        )

        with open(output_path, "rb") as f:
            encrypted_bytes = f.read()

        if not encrypted_bytes:
            raise HTTPException(
                status_code=500,
                detail="Enkripsi gagal — output file kosong.",
            )

        logger.info(
            "PDF encrypted: method=%s input_size=%d output_size=%d",
            method,
            len(file_bytes),
            len(encrypted_bytes),
        )

        return encrypted_bytes

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Encryption failed: %s", str(exc))
        raise HTTPException(
            status_code=500,
            detail="Gagal mengenkripsi PDF. Silakan coba lagi.",
        ) from exc
    finally:
        _cleanup(output_path)
        if doc is not None:
            doc.close()


def decrypt_pdf(file_bytes: bytes, password: str) -> bytes:
    """
    Dekripsi PDF dengan password menggunakan PyMuPDF.

    Args:
        file_bytes: Raw encrypted PDF bytes.
        password: Password untuk mendekripsi.

    Returns:
        Decrypted PDF bytes (tanpa proteksi).

    Raises:
        HTTPException(400): Jika file tidak terenkripsi atau corrupt.
        HTTPException(401): Jika password salah.
        HTTPException(500): Jika dekripsi gagal.
    """
    if not password:
        raise HTTPException(
            status_code=400,
            detail="Password tidak boleh kosong.",
        )

    doc = None
    output_path = None
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="File PDF tidak bisa dibuka. File mungkin corrupt.",
        ) from None

    try:
        if not doc.is_encrypted:
            logger.warning("PDF tidak terenkripsi")
            raise HTTPException(
                status_code=400,
                detail="PDF ini tidak terproteksi.",
            )

        auth_result = doc.authenticate(password)
        if auth_result == 0:
            logger.warning("Password salah untuk PDF terenkripsi")
            raise HTTPException(
                status_code=401,
                detail="Password salah.",
            )

        fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_dec_")
        os.close(fd)

        doc.save(output_path, encryption=0)

        with open(output_path, "rb") as f:
            decrypted_bytes = f.read()

        if not decrypted_bytes:
            raise HTTPException(
                status_code=500,
                detail="Dekripsi gagal — output file kosong.",
            )

        logger.info(
            "PDF decrypted: input_size=%d output_size=%d",
            len(file_bytes),
            len(decrypted_bytes),
        )

        return decrypted_bytes

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Decryption failed: %s", str(exc))
        raise HTTPException(
            status_code=500,
            detail="Gagal mendekripsi PDF. Silakan coba lagi.",
        ) from exc
    finally:
        _cleanup(output_path)
        if doc is not None:
            doc.close()


def _cleanup(path: str | None) -> None:
    """Hapus file jika ada, abaikan error."""
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except OSError:
        pass
