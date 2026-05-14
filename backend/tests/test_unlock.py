"""Unit tests for POST /api/unlock endpoint.

Refs: PAPYR-099, PAPYR-100, PAPYR-101
"""

import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

VALID_PDF_BYTES = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\nstartxref\n0\n%%EOF"


def _build_file(name: str, data: bytes, content_type: str):
    """Build files dict for multipart upload."""
    return {"file": (name, data, content_type)}


def _mock_pdf_info(size: int = 1024, page_count: int = 1, is_encrypted: bool = True):
    """Create a mock PDFInfo from the validator."""
    mock = MagicMock()
    mock.size_bytes = size
    mock.page_count = page_count
    mock.is_encrypted = is_encrypted
    return mock


@pytest.mark.asyncio
async def test_unlock_success(test_client):
    """Happy path — encrypted PDF unlocks and returns signed URL."""
    with (
        patch("routers.unlock.validate_pdf_file") as mock_validate,
        patch("routers.unlock.decrypt_pdf") as mock_decrypt,
        patch("routers.unlock.upload_file") as mock_upload,
        patch("routers.unlock.generate_signed_url") as mock_url,
        patch("routers.unlock.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info(size=2048)
        mock_decrypt.return_value = b"decrypted_pdf_bytes"
        mock_upload.return_value = {"key": "r2/unlocked_test.pdf"}
        mock_url.return_value = "https://signed.url/unlocked_test.pdf"

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert body["download_url"] == "https://signed.url/unlocked_test.pdf"
        assert "expires_at" in body
        assert body["original_size"] == 2048
        assert body["output_size"] == len(b"decrypted_pdf_bytes")

        mock_validate.assert_called_once()
        _, validate_kwargs = mock_validate.call_args
        assert validate_kwargs["require_encrypted"] is True
        mock_decrypt.assert_called_once_with(VALID_PDF_BYTES, "test1234")


@pytest.mark.asyncio
async def test_unlock_non_encrypted_pdf_returns_400(test_client):
    """Non-encrypted PDF rejected by shared validator."""
    with patch("routers.unlock.validate_pdf_file") as mock_validate:
        mock_validate.side_effect = HTTPException(
            status_code=400,
            detail="PDF ini tidak terproteksi. Fitur ini hanya untuk PDF yang dilindungi password.",
        )

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("plain.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 400
        assert "tidak terproteksi" in response.json()["detail"]


@pytest.mark.asyncio
async def test_unlock_wrong_password_returns_401(test_client):
    """Wrong password from decrypt service preserves 401."""
    with (
        patch("routers.unlock.validate_pdf_file") as mock_validate,
        patch("routers.unlock.decrypt_pdf") as mock_decrypt,
        patch("routers.unlock.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_decrypt.side_effect = HTTPException(status_code=401, detail="Password salah.")

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "wrongpass"},
        )

        assert response.status_code == 401
        assert "Password salah" in response.json()["detail"]


@pytest.mark.asyncio
async def test_unlock_empty_file_returns_400(test_client):
    """Empty file rejected by validator."""
    response = await test_client.post(
        "/api/unlock",
        files=_build_file("empty.pdf", b"", "application/pdf"),
        data={"password": "test1234"},
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_unlock_invalid_mime_type_returns_400(test_client):
    """Non-PDF MIME type rejected."""
    response = await test_client.post(
        "/api/unlock",
        files=_build_file("locked.txt", VALID_PDF_BYTES, "text/plain"),
        data={"password": "test1234"},
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_unlock_invalid_extension_returns_400(test_client):
    """Wrong extension rejected."""
    response = await test_client.post(
        "/api/unlock",
        files=_build_file("locked.docx", VALID_PDF_BYTES, "application/pdf"),
        data={"password": "test1234"},
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_unlock_corrupt_pdf_returns_400(test_client):
    """Corrupt PDF validation error preserves 400."""
    with patch("routers.unlock.validate_pdf_file") as mock_validate:
        mock_validate.side_effect = HTTPException(
            status_code=400, detail="File PDF tidak bisa dibuka. File mungkin corrupt."
        )

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("corrupt.pdf", b"NOT_A_PDF", "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 400


@pytest.mark.asyncio
async def test_unlock_oversized_file_returns_413(test_client):
    """Oversized upload preserves 413 from validator."""
    with patch("routers.unlock.validate_pdf_file") as mock_validate:
        mock_validate.side_effect = HTTPException(
            status_code=413, detail="Ukuran file terlalu besar: 21MB. Maksimal 20MB."
        )

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("large.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 413


@pytest.mark.asyncio
async def test_unlock_missing_password_returns_422(test_client):
    """Missing password field returns FastAPI 422."""
    response = await test_client.post(
        "/api/unlock",
        files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
        data={},
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_unlock_missing_file_returns_422(test_client):
    """Missing file field returns FastAPI 422."""
    response = await test_client.post(
        "/api/unlock",
        data={"password": "test1234"},
    )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_unlock_decrypt_failure_returns_500(test_client):
    """Unexpected decrypt failure maps to generic 500."""
    with (
        patch("routers.unlock.validate_pdf_file") as mock_validate,
        patch("routers.unlock.decrypt_pdf") as mock_decrypt,
        patch("routers.unlock.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_decrypt.side_effect = RuntimeError("unexpected decrypt error")

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 500
        assert "Gagal memproses" in response.json()["detail"]


@pytest.mark.asyncio
async def test_unlock_upload_failure_returns_500(test_client):
    """R2 upload failure maps to generic 500."""
    with (
        patch("routers.unlock.validate_pdf_file") as mock_validate,
        patch("routers.unlock.decrypt_pdf") as mock_decrypt,
        patch("routers.unlock.upload_file") as mock_upload,
        patch("routers.unlock.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_decrypt.return_value = b"decrypted"
        mock_upload.side_effect = RuntimeError("R2 unavailable")

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 500


@pytest.mark.asyncio
async def test_unlock_expires_at_is_iso_string(test_client):
    """Response expires_at should be an ISO datetime string."""
    with (
        patch("routers.unlock.validate_pdf_file") as mock_validate,
        patch("routers.unlock.decrypt_pdf") as mock_decrypt,
        patch("routers.unlock.upload_file") as mock_upload,
        patch("routers.unlock.generate_signed_url") as mock_url,
        patch("routers.unlock.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_decrypt.return_value = b"decrypted"
        mock_upload.return_value = {"key": "r2/key.pdf"}
        mock_url.return_value = "https://url"

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 200
        body = response.json()
        assert "T" in body["expires_at"]
        assert "Z" in body["expires_at"] or "+" in body["expires_at"]


@pytest.mark.asyncio
async def test_unlock_original_size_from_pdf_info(test_client):
    """original_size should use PDFInfo metadata."""
    with (
        patch("routers.unlock.validate_pdf_file") as mock_validate,
        patch("routers.unlock.decrypt_pdf") as mock_decrypt,
        patch("routers.unlock.upload_file") as mock_upload,
        patch("routers.unlock.generate_signed_url") as mock_url,
        patch("routers.unlock.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info(size=9999)
        mock_decrypt.return_value = b"decrypted"
        mock_upload.return_value = {"key": "r2/key.pdf"}
        mock_url.return_value = "https://url"

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 200
        assert response.json()["original_size"] == 9999


@pytest.mark.asyncio
async def test_unlock_signed_url_download_filename(test_client):
    """Signed URL should use unlocked_ prefix for download filename."""
    with (
        patch("routers.unlock.validate_pdf_file") as mock_validate,
        patch("routers.unlock.decrypt_pdf") as mock_decrypt,
        patch("routers.unlock.upload_file") as mock_upload,
        patch("routers.unlock.generate_signed_url") as mock_url,
        patch("routers.unlock.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_decrypt.return_value = b"decrypted"
        mock_upload.return_value = {"key": "r2/key.pdf"}
        mock_url.return_value = "https://url"

        response = await test_client.post(
            "/api/unlock",
            files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )

        assert response.status_code == 200
        _, url_kwargs = mock_url.call_args
        assert url_kwargs["expiry_seconds"] == 3600
        assert url_kwargs["download_filename"] == "unlocked_locked.pdf"
