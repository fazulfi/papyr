import os
import tempfile
from unittest.mock import MagicMock, patch

import pytest

PDF_BYTES = b"%PDF-1.4 fake content"


def _mock_pdf_doc(is_encrypted: bool = False):
    doc = MagicMock()
    doc.is_encrypted = is_encrypted
    return doc


def _build_file_tuple(name: str, data: bytes, content_type: str):
    return {"file": (name, data, content_type)}


def _fake_compress_result(original_size: int, compressed_bytes: bytes):
    fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="test_compressed_")
    os.close(fd)
    with open(output_path, "wb") as f:
        f.write(compressed_bytes)

    return {
        "output_path": output_path,
        "original_size": original_size,
        "compressed_size": len(compressed_bytes),
        "compression_ratio": 50.0,
    }


@pytest.mark.asyncio
async def test_compress_valid_pdf_returns_200(test_client):
    compressed = b"%PDF-1.4 compressed content"

    with (
        patch("routers.compress.fitz.open", return_value=_mock_pdf_doc(False)),
        patch(
            "routers.compress.compress_pdf",
            return_value=_fake_compress_result(len(PDF_BYTES), compressed),
        ),
        patch("routers.compress.upload_file", return_value={"key": "mock-key.pdf"}),
        patch(
            "routers.compress.generate_signed_url",
            return_value="https://example.com/download/mock-key.pdf",
        ),
    ):
        response = await test_client.post(
            "/api/compress?quality=ebook",
            files=_build_file_tuple("sample.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 200
    body = response.json()
    assert "download_url" in body
    assert body["original_size"] == len(PDF_BYTES)
    assert body["compressed_size"] == len(compressed)
    assert isinstance(body["saved_percent"], int)


@pytest.mark.asyncio
async def test_compress_empty_file_returns_400(test_client):
    response = await test_client.post(
        "/api/compress",
        files=_build_file_tuple("empty.pdf", b"", "application/pdf"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_compress_non_pdf_mime_type_returns_400(test_client):
    response = await test_client.post(
        "/api/compress",
        files=_build_file_tuple("sample.pdf", PDF_BYTES, "text/plain"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_compress_wrong_extension_returns_400(test_client):
    response = await test_client.post(
        "/api/compress",
        files=_build_file_tuple("sample.txt", PDF_BYTES, "application/pdf"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_compress_file_too_large_returns_400(test_client):
    too_large = b"%PDF" + (b"0" * (20 * 1024 * 1024 + 1))

    response = await test_client.post(
        "/api/compress",
        files=_build_file_tuple("large.pdf", too_large, "application/pdf"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_compress_invalid_magic_bytes_returns_400(test_client):
    response = await test_client.post(
        "/api/compress",
        files=_build_file_tuple("sample.pdf", b"NOTP fake content", "application/pdf"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_compress_password_protected_pdf_returns_400(test_client):
    with patch("routers.compress.fitz.open", return_value=_mock_pdf_doc(True)):
        response = await test_client.post(
            "/api/compress",
            files=_build_file_tuple("locked.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_compress_invalid_quality_parameter_returns_422(test_client):
    response = await test_client.post(
        "/api/compress?quality=ultra",
        files=_build_file_tuple("sample.pdf", PDF_BYTES, "application/pdf"),
    )

    assert response.status_code == 422
