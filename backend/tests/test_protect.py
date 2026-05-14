"""Unit tests for POST /api/protect endpoint.

Covers: happy path, validation errors, encryption edge cases.
Refs: PAPYR-092, PAPYR-093
"""

import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

# Minimal PDF-like bytes for tests
VALID_PDF_BYTES = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\nstartxref\n0\n%%EOF"


def _build_file(name: str, data: bytes, content_type: str):
    """Build files dict for multipart upload."""
    return {"file": (name, data, content_type)}


def _mock_pdf_info(size: int = 1024, page_count: int = 1, is_encrypted: bool = False):
    """Create a mock PDFInfo from the validator."""
    mock = MagicMock()
    mock.size_bytes = size
    mock.page_count = page_count
    mock.is_encrypted = is_encrypted
    return mock


@pytest.mark.asyncio
async def test_protect_aes256_success(test_client):
    """Happy path — AES-256 encryption, all mocked."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.encrypt_pdf") as mock_encrypt,
        patch("routers.protect.upload_file") as mock_upload,
        patch("routers.protect.generate_signed_url") as mock_url,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info(size=1024)
        mock_encrypt.return_value = b"encrypted_pdf_bytes"
        mock_upload.return_value = {"key": "r2/protected_test.pdf"}
        mock_url.return_value = "https://signed.url/protected_test.pdf"

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "securepass123", "encryption": "aes256"},
        )

        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert "download_url" in body
        assert "expires_at" in body
        assert body["original_size"] == 1024
        assert body["output_size"] == len(b"encrypted_pdf_bytes")

        # Verify encrypt_pdf was called with correct method
        mock_encrypt.assert_called_once()
        _, kwargs = mock_encrypt.call_args
        assert kwargs["method"] == "aes256"

        # Verify validate_pdf_file was called with reject_encrypted=True
        mock_validate.assert_called_once()
        _, kwargs = mock_validate.call_args
        assert kwargs["reject_encrypted"] is True


@pytest.mark.asyncio
async def test_protect_aes128_success(test_client):
    """Happy path — AES-128 encryption."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.encrypt_pdf") as mock_encrypt,
        patch("routers.protect.upload_file") as mock_upload,
        patch("routers.protect.generate_signed_url") as mock_url,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info(size=2048)
        mock_encrypt.return_value = b"encrypted_aes128"
        mock_upload.return_value = {"key": "r2/protected.pdf"}
        mock_url.return_value = "https://signed.url/protected.pdf"

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234", "encryption": "aes128"},
        )

        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        mock_encrypt.assert_called_once()
        _, kwargs = mock_encrypt.call_args
        assert kwargs["method"] == "aes128"


@pytest.mark.asyncio
async def test_protect_empty_file_returns_400(test_client):
    """Empty file should be rejected by validator."""
    response = await test_client.post(
        "/api/protect",
        files=_build_file("empty.pdf", b"", "application/pdf"),
        data={"password": "test1234"},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_protect_invalid_mime_type_returns_400(test_client):
    """Non-PDF MIME type rejected."""
    response = await test_client.post(
        "/api/protect",
        files=_build_file("test.txt", VALID_PDF_BYTES, "text/plain"),
        data={"password": "test1234"},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_protect_invalid_extension_returns_400(test_client):
    """Wrong file extension rejected."""
    response = await test_client.post(
        "/api/protect",
        files=_build_file("test.docx", VALID_PDF_BYTES, "application/pdf"),
        data={"password": "test1234"},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_protect_corrupt_pdf_returns_400(test_client):
    """Corrupt PDF file rejected."""
    corrupt_bytes = b"NOT_A_PDF_AT_ALL"
    with patch("routers.protect.validate_pdf_file") as mock_validate:
        mock_validate.side_effect = HTTPException(
            status_code=400, detail="File PDF tidak bisa dibuka. File mungkin corrupt."
        )

        response = await test_client.post(
            "/api/protect",
            files=_build_file("corrupt.pdf", corrupt_bytes, "application/pdf"),
            data={"password": "test1234"},
        )
        assert response.status_code == 400


@pytest.mark.asyncio
async def test_protect_already_encrypted_returns_409(test_client):
    """Already-encrypted PDF rejected with 409."""
    with patch("routers.protect.validate_pdf_file") as mock_validate:
        mock_validate.side_effect = HTTPException(
            status_code=409, detail="PDF sudah terenkripsi."
        )

        response = await test_client.post(
            "/api/protect",
            files=_build_file("locked.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234"},
        )
        assert response.status_code == 409


@pytest.mark.asyncio
async def test_protect_password_too_short_returns_400(test_client):
    """Password less than 4 characters rejected."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "abc", "encryption": "aes256"},
        )
        assert response.status_code == 400
        assert "terlalu pendek" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protect_password_too_long_returns_400(test_client):
    """Password more than 128 characters rejected."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "a" * 129, "encryption": "aes256"},
        )
        assert response.status_code == 400
        assert "terlalu panjang" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protect_invalid_encryption_method_returns_400(test_client):
    """Unsupported encryption method rejected."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234", "encryption": "aes512"},
        )
        assert response.status_code == 400
        assert "tidak valid" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protect_rc4_method_rejected(test_client):
    """RC4 (unsupported) method rejected."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234", "encryption": "rc4"},
        )
        assert response.status_code == 400
        assert "aes128" in response.json()["detail"] or "tidak valid" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protect_missing_password_returns_422(test_client):
    """Missing password field returns 422."""
    response = await test_client.post(
        "/api/protect",
        files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
        data={},
    )
    # FastAPI validation: missing required Form field → 422
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_protect_missing_file_returns_422(test_client):
    """Missing file field returns 422."""
    response = await test_client.post(
        "/api/protect",
        data={"password": "test1234"},
    )
    # FastAPI validation: missing required File field → 422
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_protect_encryption_failure_returns_500(test_client):
    """When encrypt_pdf raises unexpected error, returns 500."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.encrypt_pdf") as mock_encrypt,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_encrypt.side_effect = RuntimeError("Encryption failed")

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234", "encryption": "aes256"},
        )
        assert response.status_code == 500
        assert "Gagal memproteksi" in response.json()["detail"]


@pytest.mark.asyncio
async def test_protect_upload_failure_returns_500(test_client):
    """When R2 upload fails, returns 500."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.encrypt_pdf") as mock_encrypt,
        patch("routers.protect.upload_file") as mock_upload,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_encrypt.return_value = b"encrypted"
        mock_upload.side_effect = RuntimeError("R2 unavailable")

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234", "encryption": "aes256"},
        )
        assert response.status_code == 500


@pytest.mark.asyncio
async def test_protect_expires_at_is_iso_string(test_client):
    """Response expires_at should be an ISO datetime string."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.encrypt_pdf") as mock_encrypt,
        patch("routers.protect.upload_file") as mock_upload,
        patch("routers.protect.generate_signed_url") as mock_url,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_encrypt.return_value = b"encrypted"
        mock_upload.return_value = {"key": "r2/key.pdf"}
        mock_url.return_value = "https://url"

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234", "encryption": "aes256"},
        )

        assert response.status_code == 200
        body = response.json()
        # expires_at should be ISO format: "2026-05-14T..."
        assert "T" in body["expires_at"]
        assert "Z" in body["expires_at"] or "+" in body["expires_at"]


@pytest.mark.asyncio
async def test_protect_original_size_from_pdf_info(test_client):
    """original_size should come from pdf_info.size_bytes, not raw input size."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.encrypt_pdf") as mock_encrypt,
        patch("routers.protect.upload_file") as mock_upload,
        patch("routers.protect.generate_signed_url") as mock_url,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info(size=9999)
        mock_encrypt.return_value = b"encrypted"
        mock_upload.return_value = {"key": "r2/key.pdf"}
        mock_url.return_value = "https://url"

        # Upload bytes are different from pdf_info.size_bytes
        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test1234", "encryption": "aes256"},
        )

        assert response.status_code == 200
        assert response.json()["original_size"] == 9999  # from pdf_info, not len(VALID_PDF_BYTES)


@pytest.mark.asyncio
async def test_protect_password_exactly_4_chars_accepted(test_client):
    """Password of exactly 4 characters should be accepted."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.encrypt_pdf") as mock_encrypt,
        patch("routers.protect.upload_file") as mock_upload,
        patch("routers.protect.generate_signed_url") as mock_url,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_encrypt.return_value = b"encrypted"
        mock_upload.return_value = {"key": "r2/key.pdf"}
        mock_url.return_value = "https://url"

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "test", "encryption": "aes256"},
        )
        assert response.status_code == 200


@pytest.mark.asyncio
async def test_protect_password_128_chars_accepted(test_client):
    """Password of exactly 128 characters should be accepted."""
    with (
        patch("routers.protect.validate_pdf_file") as mock_validate,
        patch("routers.protect.encrypt_pdf") as mock_encrypt,
        patch("routers.protect.upload_file") as mock_upload,
        patch("routers.protect.generate_signed_url") as mock_url,
        patch("routers.protect.log_task_event"),
    ):
        mock_validate.return_value = _mock_pdf_info()
        mock_encrypt.return_value = b"encrypted"
        mock_upload.return_value = {"key": "r2/key.pdf"}
        mock_url.return_value = "https://url"

        response = await test_client.post(
            "/api/protect",
            files=_build_file("test.pdf", VALID_PDF_BYTES, "application/pdf"),
            data={"password": "a" * 128, "encryption": "aes256"},
        )
        assert response.status_code == 200