import os
import tempfile
from unittest.mock import MagicMock, patch

import pytest


PDF_BYTES = b"%PDF-1.4 fake content"


def _build_file(name: str, data: bytes, content_type: str):
    return {"file": (name, data, content_type)}


def _mock_pdf_doc(is_encrypted: bool = False, page_count: int = 3):
    doc = MagicMock()
    doc.is_encrypted = is_encrypted
    doc.__len__.return_value = page_count
    return doc


def _create_output_file(content: bytes = b"PNGDATA") -> str:
    fd, path = tempfile.mkstemp(suffix=".png", prefix="test_p2i_")
    os.close(fd)
    with open(path, "wb") as f:
        f.write(content)
    return path


@pytest.mark.asyncio
async def test_pdf_to_image_valid_pdf_returns_200(test_client):
    output_path = _create_output_file()

    with (
        patch(
            "routers.pdf_to_image.fitz.open",
            side_effect=[_mock_pdf_doc(False), _mock_pdf_doc(False, page_count=3)],
        ),
        patch("routers.pdf_to_image.rasterize_pages", return_value=[output_path]),
        patch("routers.pdf_to_image.package_output", return_value=(output_path, "image/png")),
    ):
        response = await test_client.post(
            "/api/pdf-to-image",
            files=_build_file("sample.pdf", PDF_BYTES, "application/pdf"),
            data={"pages": ""},
        )

    assert response.status_code == 200
    body = response.json()
    assert "download_url" in body
    assert body["file_type"] == "png"
    assert body["page_count"] >= 1


@pytest.mark.asyncio
async def test_pdf_to_image_page_range_1_2_returns_200(test_client):
    output_path = _create_output_file(b"ZIPDATA")

    with (
        patch(
            "routers.pdf_to_image.fitz.open",
            side_effect=[_mock_pdf_doc(False), _mock_pdf_doc(False, page_count=5)],
        ),
        patch("routers.pdf_to_image.rasterize_pages", return_value=[output_path, output_path]),
        patch(
            "routers.pdf_to_image.package_output",
            return_value=(output_path, "application/zip"),
        ),
    ):
        response = await test_client.post(
            "/api/pdf-to-image",
            files=_build_file("sample.pdf", PDF_BYTES, "application/pdf"),
            data={"pages": "1-2"},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["file_type"] == "zip"
    assert body["page_count"] == 2


@pytest.mark.asyncio
async def test_pdf_to_image_empty_file_returns_400(test_client):
    response = await test_client.post(
        "/api/pdf-to-image",
        files=_build_file("empty.pdf", b"", "application/pdf"),
        data={"pages": ""},
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_pdf_to_image_invalid_mime_type_returns_400(test_client):
    response = await test_client.post(
        "/api/pdf-to-image",
        files=_build_file("sample.pdf", PDF_BYTES, "text/plain"),
        data={"pages": ""},
    )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_pdf_to_image_password_protected_pdf_returns_400(test_client):
    with patch("routers.pdf_to_image.fitz.open", return_value=_mock_pdf_doc(True)):
        response = await test_client.post(
            "/api/pdf-to-image",
            files=_build_file("locked.pdf", PDF_BYTES, "application/pdf"),
            data={"pages": ""},
        )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_pdf_to_image_invalid_page_range_format_returns_400(test_client):
    with patch(
        "routers.pdf_to_image.fitz.open",
        side_effect=[_mock_pdf_doc(False), _mock_pdf_doc(False, page_count=3)],
    ):
        response = await test_client.post(
            "/api/pdf-to-image",
            files=_build_file("sample.pdf", PDF_BYTES, "application/pdf"),
            data={"pages": "1--2"},
        )

    assert response.status_code == 400


@pytest.mark.asyncio
async def test_pdf_to_image_page_out_of_range_returns_400(test_client):
    with patch(
        "routers.pdf_to_image.fitz.open",
        side_effect=[_mock_pdf_doc(False), _mock_pdf_doc(False, page_count=3)],
    ):
        response = await test_client.post(
            "/api/pdf-to-image",
            files=_build_file("sample.pdf", PDF_BYTES, "application/pdf"),
            data={"pages": "10"},
        )

    assert response.status_code == 400
