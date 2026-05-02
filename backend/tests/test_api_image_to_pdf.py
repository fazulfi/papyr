from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest


JPEG_BYTES = b"\xff\xd8\xff\xe0" + (b"\x00" * 100)
PNG_BYTES = b"\x89PNG\r\n\x1a\n" + (b"\x00" * 100)
WEBP_BYTES = b"RIFF" + b"\x00\x00\x00\x00" + b"WEBP" + (b"\x00" * 100)


def _build_files(name: str, data: bytes, content_type: str):
    return [("files", (name, data, content_type))]


def _fitz_open_side_effect_for_success():
    pdf_doc = MagicMock()
    pdf_page = MagicMock()
    pdf_doc.new_page.return_value = pdf_page

    def _save_pdf(path: str):
        with open(path, "wb") as f:
            f.write(b"%PDF-1.4 mocked output")

    pdf_doc.save.side_effect = _save_pdf

    image_doc = MagicMock()
    image_page = MagicMock()
    image_page.rect = SimpleNamespace(width=500, height=700)
    image_doc.__getitem__.return_value = image_page

    return [pdf_doc, image_doc]


@pytest.mark.asyncio
async def test_image_to_pdf_valid_jpeg_returns_200(test_client):
    with patch(
        "routers.image_to_pdf.fitz.open",
        side_effect=_fitz_open_side_effect_for_success(),
    ):
        response = await test_client.post(
            "/api/image-to-pdf",
            files=_build_files("photo.jpg", JPEG_BYTES, "image/jpeg"),
        )

    assert response.status_code == 200
    body = response.json()
    assert "download_url" in body
    assert body["image_count"] == 1
    assert isinstance(body["pdf_size"], int)


@pytest.mark.asyncio
async def test_image_to_pdf_valid_png_returns_200(test_client):
    with patch(
        "routers.image_to_pdf.fitz.open",
        side_effect=_fitz_open_side_effect_for_success(),
    ):
        response = await test_client.post(
            "/api/image-to-pdf",
            files=_build_files("image.png", PNG_BYTES, "image/png"),
        )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_image_to_pdf_valid_webp_returns_200(test_client):
    with patch(
        "routers.image_to_pdf.fitz.open",
        side_effect=_fitz_open_side_effect_for_success(),
    ):
        response = await test_client.post(
            "/api/image-to-pdf",
            files=_build_files("image.webp", WEBP_BYTES, "image/webp"),
        )

    assert response.status_code == 200


@pytest.mark.asyncio
async def test_image_to_pdf_empty_file_returns_400(test_client):
    response = await test_client.post(
        "/api/image-to-pdf",
        files=_build_files("empty.jpg", b"", "image/jpeg"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_image_to_pdf_invalid_mime_type_returns_400(test_client):
    response = await test_client.post(
        "/api/image-to-pdf",
        files=_build_files("image.jpg", JPEG_BYTES, "application/pdf"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_image_to_pdf_wrong_extension_returns_400(test_client):
    response = await test_client.post(
        "/api/image-to-pdf",
        files=_build_files("image.txt", JPEG_BYTES, "image/jpeg"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_image_to_pdf_invalid_magic_bytes_returns_400(test_client):
    response = await test_client.post(
        "/api/image-to-pdf",
        files=_build_files("image.jpg", b"not-an-image", "image/jpeg"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_image_to_pdf_file_too_large_returns_400(test_client):
    too_large_jpeg = b"\xff\xd8\xff\xe0" + (b"\x00" * (20 * 1024 * 1024 + 1))

    response = await test_client.post(
        "/api/image-to-pdf",
        files=_build_files("large.jpg", too_large_jpeg, "image/jpeg"),
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_image_to_pdf_no_files_returns_422(test_client):
    response = await test_client.post("/api/image-to-pdf", files=[])
    assert response.status_code == 422
