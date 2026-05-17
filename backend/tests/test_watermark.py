"""Unit tests for POST /api/watermark endpoint.

Refs: PAPYR-112
"""

import importlib
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException

watermark_router = importlib.import_module("routers.watermark")

VALID_PDF_BYTES = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\nstartxref\n0\n%%EOF"
VALID_IMG_BYTES = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"


def _build_files(
    pdf_name: str, pdf_bytes: bytes, pdf_type: str, img_name: str, img_bytes: bytes, img_type: str
):
    return {
        "file": (pdf_name, pdf_bytes, pdf_type),
        "watermark_image": (img_name, img_bytes, img_type),
    }


@pytest.mark.asyncio
async def test_watermark_success_default_config(test_client):
    """Happy path with default config."""
    with (
        patch("routers.watermark.validate_pdf_file") as mock_validate,
        patch("routers.watermark._apply_image_watermark") as mock_apply,
        patch("routers.watermark.upload_file") as mock_upload,
        patch("routers.watermark.generate_signed_url") as mock_url,
        patch("routers.watermark.log_task_event"),
    ):
        mock_validate.return_value = None
        mock_apply.return_value = (b"watermarked_pdf", 3)
        mock_upload.return_value = {"key": "r2/watermarked.pdf"}
        mock_url.return_value = "https://signed.url/watermarked.pdf"

        response = await test_client.post(
            "/api/watermark",
            files=_build_files(
                "test.pdf",
                VALID_PDF_BYTES,
                "application/pdf",
                "wm.png",
                VALID_IMG_BYTES,
                "image/png",
            ),
        )

        assert response.status_code == 200
        body = response.json()
        assert body["success"] is True
        assert body["download_url"] == "https://signed.url/watermarked.pdf"
        assert body["pages_processed"] == 3
        assert "expires_at" in body


@pytest.mark.asyncio
async def test_watermark_success_custom_config(test_client):
    """Happy path with explicit config JSON."""
    with (
        patch("routers.watermark.validate_pdf_file") as mock_validate,
        patch("routers.watermark._apply_image_watermark") as mock_apply,
        patch("routers.watermark.upload_file") as mock_upload,
        patch("routers.watermark.generate_signed_url") as mock_url,
        patch("routers.watermark.log_task_event"),
    ):
        mock_validate.return_value = None
        mock_apply.return_value = (b"watermarked_pdf", 2)
        mock_upload.return_value = {"key": "r2/watermarked.pdf"}
        mock_url.return_value = "https://signed.url/watermarked.pdf"

        response = await test_client.post(
            "/api/watermark",
            files=_build_files(
                "test.pdf",
                VALID_PDF_BYTES,
                "application/pdf",
                "wm.jpg",
                VALID_IMG_BYTES,
                "image/jpeg",
            ),
            data={"config": '{"opacity": 0.7, "position": "top-right", "scale": 0.4}'},
        )

        assert response.status_code == 200
        mock_apply.assert_called_once()
        _, _, _, cfg = mock_apply.call_args.args
        assert cfg["position"] == "top-right"
        assert cfg["opacity"] == 0.7
        assert cfg["scale"] == 0.4


@pytest.mark.asyncio
async def test_watermark_invalid_image_mime_returns_400(test_client):
    response = await test_client.post(
        "/api/watermark",
        files=_build_files(
            "test.pdf",
            VALID_PDF_BYTES,
            "application/pdf",
            "wm.gif",
            VALID_IMG_BYTES,
            "image/gif",
        ),
    )
    assert response.status_code == 400
    assert "Hanya PNG dan JPG" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_empty_image_returns_400(test_client):
    response = await test_client.post(
        "/api/watermark",
        files=_build_files(
            "test.pdf",
            VALID_PDF_BYTES,
            "application/pdf",
            "wm.png",
            b"",
            "image/png",
        ),
    )
    assert response.status_code == 400
    assert "watermark kosong" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_image_too_large_returns_400(test_client):
    big_img = b"a" * (2 * 1024 * 1024 + 1)
    response = await test_client.post(
        "/api/watermark",
        files=_build_files(
            "test.pdf",
            VALID_PDF_BYTES,
            "application/pdf",
            "wm.png",
            big_img,
            "image/png",
        ),
    )
    assert response.status_code == 400
    assert "Maksimal 2MB" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_invalid_config_json_returns_400(test_client):
    response = await test_client.post(
        "/api/watermark",
        files=_build_files(
            "test.pdf",
            VALID_PDF_BYTES,
            "application/pdf",
            "wm.png",
            VALID_IMG_BYTES,
            "image/png",
        ),
        data={"config": "{not json}"},
    )
    assert response.status_code == 400
    assert "Config JSON tidak valid" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_invalid_opacity_returns_400(test_client):
    response = await test_client.post(
        "/api/watermark",
        files=_build_files(
            "test.pdf",
            VALID_PDF_BYTES,
            "application/pdf",
            "wm.png",
            VALID_IMG_BYTES,
            "image/png",
        ),
        data={"config": '{"opacity": 2.0, "position": "center", "scale": 0.5}'},
    )
    assert response.status_code == 400
    assert "Opacity" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_invalid_scale_returns_400(test_client):
    response = await test_client.post(
        "/api/watermark",
        files=_build_files(
            "test.pdf",
            VALID_PDF_BYTES,
            "application/pdf",
            "wm.png",
            VALID_IMG_BYTES,
            "image/png",
        ),
        data={"config": '{"opacity": 0.4, "position": "center", "scale": 0.0}'},
    )
    assert response.status_code == 400
    assert "Scale" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_invalid_position_returns_400(test_client):
    response = await test_client.post(
        "/api/watermark",
        files=_build_files(
            "test.pdf",
            VALID_PDF_BYTES,
            "application/pdf",
            "wm.png",
            VALID_IMG_BYTES,
            "image/png",
        ),
        data={"config": '{"opacity": 0.4, "position": "middle", "scale": 0.5}'},
    )
    assert response.status_code == 400
    assert "Posisi" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_pdf_validation_error_propagates(test_client):
    with patch("routers.watermark.validate_pdf_file") as mock_validate:
        mock_validate.side_effect = HTTPException(
            status_code=413, detail="Ukuran file terlalu besar"
        )

        response = await test_client.post(
            "/api/watermark",
            files=_build_files(
                "test.pdf",
                VALID_PDF_BYTES,
                "application/pdf",
                "wm.png",
                VALID_IMG_BYTES,
                "image/png",
            ),
        )

        assert response.status_code == 413


@pytest.mark.asyncio
async def test_watermark_apply_failure_returns_500(test_client):
    with (
        patch("routers.watermark.validate_pdf_file") as mock_validate,
        patch("routers.watermark._apply_image_watermark") as mock_apply,
        patch("routers.watermark.log_task_event"),
    ):
        mock_validate.return_value = None
        mock_apply.side_effect = RuntimeError("fitz failed")

        response = await test_client.post(
            "/api/watermark",
            files=_build_files(
                "test.pdf",
                VALID_PDF_BYTES,
                "application/pdf",
                "wm.png",
                VALID_IMG_BYTES,
                "image/png",
            ),
        )

        assert response.status_code == 500
        assert "Gagal memproses file" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_upload_failure_returns_500(test_client):
    with (
        patch("routers.watermark.validate_pdf_file") as mock_validate,
        patch("routers.watermark._apply_image_watermark") as mock_apply,
        patch("routers.watermark.upload_file") as mock_upload,
        patch("routers.watermark.log_task_event"),
    ):
        mock_validate.return_value = None
        mock_apply.return_value = (b"pdf", 2)
        mock_upload.side_effect = RuntimeError("R2 down")

        response = await test_client.post(
            "/api/watermark",
            files=_build_files(
                "test.pdf",
                VALID_PDF_BYTES,
                "application/pdf",
                "wm.png",
                VALID_IMG_BYTES,
                "image/png",
            ),
        )

        assert response.status_code == 500


@pytest.mark.asyncio
async def test_watermark_invalid_pdf_returns_400(test_client):
    """STEP-F2-019 case 2: invalid PDF file rejected."""
    response = await test_client.post(
        "/api/watermark",
        files=_build_files(
            "invalid.pdf",
            b"NOT A PDF",
            "application/pdf",
            "wm.png",
            VALID_IMG_BYTES,
            "image/png",
        ),
    )

    assert response.status_code == 400
    assert "bukan file PDF" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_empty_pdf_returns_400(test_client):
    """STEP-F2-019 case 7: empty PDF file rejected."""
    with patch("routers.watermark.validate_pdf_file") as mock_validate:
        mock_validate.side_effect = HTTPException(
            status_code=400, detail="File kosong. Silakan upload file PDF yang valid."
        )

        response = await test_client.post(
            "/api/watermark",
            files=_build_files(
                "empty.pdf",
                b"",
                "application/pdf",
                "wm.png",
                VALID_IMG_BYTES,
                "image/png",
            ),
        )

        assert response.status_code == 400
        assert "kosong" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_encrypted_pdf_rejected(test_client):
    """STEP-F2-019 case 8: encrypted PDF rejected (reject_encrypted=True)."""
    with patch("routers.watermark.validate_pdf_file") as mock_validate:
        mock_validate.side_effect = HTTPException(
            status_code=400,
            detail="PDF ini dilindungi kata sandi. Gunakan fitur Unlock terlebih dahulu.",
        )

        response = await test_client.post(
            "/api/watermark",
            files=_build_files(
                "locked.pdf",
                VALID_PDF_BYTES,
                "application/pdf",
                "wm.png",
                VALID_IMG_BYTES,
                "image/png",
            ),
        )

        assert response.status_code == 400
        assert "dilindungi" in response.json()["detail"]


@pytest.mark.asyncio
async def test_watermark_missing_watermark_image_returns_422(test_client):
    response = await test_client.post(
        "/api/watermark",
        files={"file": ("test.pdf", VALID_PDF_BYTES, "application/pdf")},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_watermark_missing_pdf_file_returns_422(test_client):
    response = await test_client.post(
        "/api/watermark",
        files={"watermark_image": ("wm.png", VALID_IMG_BYTES, "image/png")},
    )
    assert response.status_code == 422


# ── Internal helper tests ──────────────────────────────────────────────


def test_cleanup_none_path_does_nothing():
    watermark_router._cleanup(None)


def test_cleanup_oserror_logs_warning():
    with (
        patch("os.path.exists", return_value=True),
        patch("os.remove", side_effect=OSError("permission denied")),
        patch.object(watermark_router.logger, "warning") as mock_warn,
    ):
        watermark_router._cleanup("/tmp/fake.png")
        mock_warn.assert_called_once()


def test_parse_watermark_config_invalid_types():
    with pytest.raises(HTTPException) as exc:
        watermark_router._parse_watermark_config(
            '{"opacity": "abc", "position": "center", "scale": 0.5}'
        )
    assert exc.value.status_code == 400
    assert "tidak valid" in exc.value.detail


def test_calculate_watermark_rect_all_positions():
    w, h = 600, 800
    for pos in ("top-left", "top-right", "bottom-left", "bottom-right", "center"):
        rect = watermark_router._calculate_watermark_rect(w, h, 200, 100, pos, 0.5)
        if pos == "top-left":
            assert rect.x0 == 20
            assert rect.y0 == 20
        elif pos == "top-right":
            assert rect.x0 == 600 - 300 - 20
            assert rect.y0 == 20
        elif pos == "bottom-left":
            assert rect.x0 == 20
            assert rect.y0 == 800 - 150 - 20
        elif pos == "bottom-right":
            assert rect.x0 == 600 - 300 - 20
            assert rect.y0 == 800 - 150 - 20
        elif pos == "center":
            assert rect.x0 == (600 - 300) / 2
            assert rect.y0 == (800 - 150) / 2


def test_apply_image_watermark_success():
    pdf_bytes = b"%PDF-fake"
    img_bytes = b"fake-png-data"
    config = {"opacity": 0.3, "position": "center", "scale": 0.5}

    page1 = MagicMock()
    page1.rect = SimpleNamespace(width=600, height=800)
    page2 = MagicMock()
    page2.rect = SimpleNamespace(width=600, height=800)

    image_rect = SimpleNamespace(width=200, height=100)
    image_page = SimpleNamespace(rect=image_rect)
    mock_image_doc = MagicMock()
    mock_image_doc.__getitem__.return_value = image_page

    mock_pdf_doc = MagicMock()
    mock_pdf_doc.__iter__.return_value = iter([page1, page2])
    fake_output = b"watermarked-output-bytes"

    def fitz_open_side(path_or_stream=None, **kwargs):
        if isinstance(path_or_stream, str):
            return mock_image_doc
        return mock_pdf_doc

    with (
        patch.object(watermark_router.fitz, "open", side_effect=fitz_open_side) as mock_open,
        patch.object(watermark_router, "_cleanup"),
    ):
        mock_pdf_doc.save = MagicMock()
        mock_pdf_doc.save.side_effect = lambda path: open(path, "wb").write(fake_output)

        output_bytes, pages = watermark_router._apply_image_watermark(
            pdf_bytes,
            img_bytes,
            "image/png",
            config,
        )

        assert output_bytes == fake_output
        assert pages == 2
        assert mock_open.call_count == 2
        mock_pdf_doc.save.assert_called_once()
        mock_pdf_doc.close.assert_called_once()
        mock_image_doc.close.assert_called_once()


def test_apply_image_watermark_empty_output_raises_500():
    pdf_bytes = b"%PDF-fake"
    img_bytes = b"fake-png-data"
    config = {"opacity": 0.5, "position": "center", "scale": 0.3}

    page = MagicMock()
    page.rect = SimpleNamespace(width=600, height=800)
    mock_pdf_doc = MagicMock()
    mock_pdf_doc.__iter__.return_value = iter([page])
    mock_image_doc = MagicMock()
    mock_image_doc.__getitem__.return_value = SimpleNamespace(
        rect=SimpleNamespace(width=100, height=100)
    )

    def fitz_open_side(path_or_stream=None, **kwargs):
        if isinstance(path_or_stream, str):
            return mock_image_doc
        return mock_pdf_doc

    with (
        patch.object(watermark_router.fitz, "open", side_effect=fitz_open_side),
        patch.object(watermark_router, "_cleanup"),
    ):
        mock_pdf_doc.save = MagicMock()
        mock_pdf_doc.save.side_effect = lambda path: open(path, "wb").write(b"")

        with pytest.raises(HTTPException) as exc:
            watermark_router._apply_image_watermark(
                pdf_bytes,
                img_bytes,
                "image/jpeg",
                config,
            )
        assert exc.value.status_code == 500
        assert "Gagal memproses" in exc.value.detail
