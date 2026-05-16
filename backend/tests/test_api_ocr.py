"""
Tests for POST /api/ocr endpoint and background OCR helper (_process_ocr).

Covers language validation, PDF validation, text-layer detection,
background OCR processing (happy/failure paths), and status polling.

Mirrors style of test_api_pdf_to_word.py exactly.
"""

import os
import sys
import types
from pathlib import Path
from unittest.mock import AsyncMock, patch

import pytest
from fastapi import HTTPException

from routers import ocr
from services.async_task import _tasks


PDF_BYTES = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n"


def _build_file(name: str, data: bytes, content_type: str):
    return {"file": (name, data, content_type)}


class _DummyPage:
    def __init__(self, text: str):
        self._text = text

    def get_text(self):
        return self._text


class _DummyDoc:
    def __init__(self, page_texts: list[str]):
        self._pages = [_DummyPage(t) for t in page_texts]

    def __iter__(self):
        return iter(self._pages)

    def close(self):
        return None


@pytest.fixture
def _stub_ocrmypdf_module():
    mod = types.ModuleType("ocrmypdf")
    mod.ocr = lambda *args, **kwargs: None
    sys.modules["ocrmypdf"] = mod
    try:
        yield
    finally:
        sys.modules.pop("ocrmypdf", None)


@pytest.fixture(autouse=True)
def _clear_tasks_between_tests():
    _tasks.clear()
    yield
    _tasks.clear()


# =============================================================================
# Endpoint tests
# =============================================================================


@pytest.mark.asyncio
async def test_ocr_valid_scanned_returns_202(test_client):
    """T1: Valid scanned PDF returns 202 with task_id, status, estimated_seconds, page_count."""
    with (
        patch("routers.ocr.validate_pdf_file") as mock_validate,
        patch("routers.ocr.fitz.open", return_value=_DummyDoc([""])),
    ):
        mock_validate.return_value.filename = "scan.pdf"
        mock_validate.return_value.page_count = 2
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("scan.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 202
    body = response.json()
    assert "task_id" in body
    assert body["status"] == "queued"
    assert body["estimated_seconds"] == 30
    assert body["page_count"] == 2


@pytest.mark.asyncio
async def test_ocr_default_language_ind_eng(test_client):
    """T2: Default language is ind+eng when language form field omitted."""
    mock_run = AsyncMock()
    with (
        patch("routers.ocr.validate_pdf_file") as mock_validate,
        patch("routers.ocr.fitz.open", return_value=_DummyDoc([""])),
        patch("routers.ocr.run_task_in_background", mock_run),
    ):
        mock_validate.return_value.filename = "scan.pdf"
        mock_validate.return_value.page_count = 2
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("scan.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 202
    assert mock_run.call_count == 1
    _, kwargs = mock_run.call_args
    assert kwargs["language"] == "ind+eng"


@pytest.mark.asyncio
async def test_ocr_language_ind_accepted(test_client):
    """T3: Language 'ind' accepted and forwarded."""
    mock_run = AsyncMock()
    with (
        patch("routers.ocr.validate_pdf_file") as mock_validate,
        patch("routers.ocr.fitz.open", return_value=_DummyDoc([""])),
        patch("routers.ocr.run_task_in_background", mock_run),
    ):
        mock_validate.return_value.filename = "scan.pdf"
        mock_validate.return_value.page_count = 2
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("scan.pdf", PDF_BYTES, "application/pdf"),
            data={"language": "ind"},
        )

    assert response.status_code == 202
    assert mock_run.call_count == 1
    _, kwargs = mock_run.call_args
    assert kwargs["language"] == "ind"


@pytest.mark.asyncio
async def test_ocr_language_eng_accepted(test_client):
    """T4: Language 'eng' accepted and forwarded."""
    mock_run = AsyncMock()
    with (
        patch("routers.ocr.validate_pdf_file") as mock_validate,
        patch("routers.ocr.fitz.open", return_value=_DummyDoc([""])),
        patch("routers.ocr.run_task_in_background", mock_run),
    ):
        mock_validate.return_value.filename = "scan.pdf"
        mock_validate.return_value.page_count = 2
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("scan.pdf", PDF_BYTES, "application/pdf"),
            data={"language": "eng"},
        )

    assert response.status_code == 202
    assert mock_run.call_count == 1
    _, kwargs = mock_run.call_args
    assert kwargs["language"] == "eng"


@pytest.mark.asyncio
async def test_ocr_language_ind_eng_explicit(test_client):
    """T5: Language 'ind+eng' accepted and forwarded explicitly."""
    mock_run = AsyncMock()
    with (
        patch("routers.ocr.validate_pdf_file") as mock_validate,
        patch("routers.ocr.fitz.open", return_value=_DummyDoc([""])),
        patch("routers.ocr.run_task_in_background", mock_run),
    ):
        mock_validate.return_value.filename = "scan.pdf"
        mock_validate.return_value.page_count = 2
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("scan.pdf", PDF_BYTES, "application/pdf"),
            data={"language": "ind+eng"},
        )

    assert response.status_code == 202
    assert mock_run.call_count == 1
    _, kwargs = mock_run.call_args
    assert kwargs["language"] == "ind+eng"


@pytest.mark.asyncio
async def test_ocr_invalid_language_returns_400(test_client):
    """T6: Invalid language 'fra' returns 400."""
    response = await test_client.post(
        "/api/ocr",
        files=_build_file("scan.pdf", PDF_BYTES, "application/pdf"),
        data={"language": "fra"},
    )

    assert response.status_code == 400
    body = response.json()
    assert "Bahasa OCR tidak valid" in body["detail"]


@pytest.mark.asyncio
async def test_ocr_encrypted_returns_400(test_client):
    """T7: Encrypted PDF rejected with 400."""
    with patch(
        "routers.ocr.validate_pdf_file",
        side_effect=HTTPException(
            status_code=400,
            detail="PDF ini dilindungi kata sandi. Gunakan fitur Unlock terlebih dahulu.",
        ),
    ):
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("locked.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 400
    body = response.json()
    assert "dilindungi kata sandi" in body["detail"]


@pytest.mark.asyncio
async def test_ocr_too_many_pages_returns_400(test_client):
    """T8: Page count >50 rejected with 400."""
    with patch(
        "routers.ocr.validate_pdf_file",
        side_effect=HTTPException(
            status_code=400,
            detail="PDF terlalu panjang: 60 halaman. Maksimal 50 halaman.",
        ),
    ):
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("long.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 400
    assert "terlalu panjang" in response.json()["detail"]


@pytest.mark.asyncio
async def test_ocr_file_too_large_returns_413(test_client):
    """T9: File too large rejected with 413."""
    with patch(
        "routers.ocr.validate_pdf_file",
        side_effect=HTTPException(
            status_code=413,
            detail="Ukuran file terlalu besar: 25.0MB. Maksimal 20MB.",
        ),
    ):
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("large.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 413
    assert "terlalu besar" in response.json()["detail"]


@pytest.mark.asyncio
async def test_ocr_already_has_text_layer_returns_400(test_client):
    """T10: Already-text-layer PDF rejected with 400."""
    with (
        patch("routers.ocr.validate_pdf_file") as mock_validate,
        patch("routers.ocr.fitz.open", return_value=_DummyDoc(["teks cukup panjang untuk lolos"])),
    ):
        mock_validate.return_value.filename = "text.pdf"
        mock_validate.return_value.page_count = 1
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("text.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 400
    body = response.json()
    assert body["detail"] == "PDF sudah memiliki text layer"


# =============================================================================
# _has_text_layer direct tests
# =============================================================================


def test_has_text_layer_fitz_raises_returns_false():
    """T11: _has_text_layer returns False when fitz raises (corrupt heuristic)."""
    with patch("routers.ocr.fitz.open", side_effect=RuntimeError("corrupt")):
        assert ocr._has_text_layer(b"junk") is False


def test_has_text_layer_empty_text_returns_false():
    """_has_text_layer returns False when pages have no extractable text."""
    with patch("routers.ocr.fitz.open", return_value=_DummyDoc(["", "  ", ""])):
        assert ocr._has_text_layer(PDF_BYTES) is False


def test_has_text_layer_with_text_returns_true():
    """_has_text_layer returns True when at least one page has >=10 chars."""
    with patch("routers.ocr.fitz.open", return_value=_DummyDoc(["", "teks cukup panjang", ""])):
        assert ocr._has_text_layer(PDF_BYTES) is True


# =============================================================================
# _process_ocr direct tests
# =============================================================================


async def _fake_to_thread_ok(func, *args, **kwargs):
    """Fake asyncio.to_thread that writes a fake output PDF."""
    # args[1] = output_path (args[0] = input_path)
    output_path = args[1]
    Path(output_path).write_bytes(b"fake-ocr-output-content")
    return None


async def _fake_to_thread_raises(func, *args, **kwargs):
    """Fake asyncio.to_thread that simulates ocrmypdf failure."""
    raise RuntimeError("OCR engine failed")


async def _fake_to_thread_no_output(func, *args, **kwargs):
    """Fake asyncio.to_thread that produces no output file (delete it)."""
    # args[1] = output_path; tempfile.mkstemp already created it, so remove it
    output_path = args[1]
    if os.path.exists(output_path):
        os.remove(output_path)
    return None


@pytest.mark.asyncio
async def test_process_ocr_happy_path(tmp_path, _stub_ocrmypdf_module):
    """T12: _process_ocr happy path — returns expected dict with all keys."""
    input_path = tmp_path / "in.pdf"
    output_path = tmp_path / "in_ocr.pdf"

    def fake_mkstemp(suffix="", prefix=""):
        fd = os.open(str(input_path), os.O_CREAT | os.O_WRONLY)
        return fd, str(input_path)

    with (
        patch("routers.ocr.tempfile.mkstemp", side_effect=fake_mkstemp),
        patch("routers.ocr.asyncio.to_thread", side_effect=_fake_to_thread_ok),
        patch("routers.ocr.upload_file", return_value={"key": "k"}),
        patch("routers.ocr.generate_signed_url", return_value="https://signed/url"),
    ):
        result = await ocr._process_ocr(
            file_bytes=PDF_BYTES,
            original_filename="scan.pdf",
            language="ind+eng",
            task_id="t1",
            page_count=2,
        )

    assert result["download_url"] == "https://signed/url"
    assert result["original_size"] == len(PDF_BYTES)
    assert result["output_size"] == len(b"fake-ocr-output-content")
    assert "expires_at" in result
    assert result["pages_processed"] == 2
    assert result["language_used"] == "ind+eng"


@pytest.mark.asyncio
async def test_process_ocr_ocrmypdf_raises(tmp_path, _stub_ocrmypdf_module):
    """T13: _process_ocr failure when ocrmypdf raises → RuntimeError propagated."""
    input_path = tmp_path / "in.pdf"

    def fake_mkstemp(suffix="", prefix=""):
        fd = os.open(str(input_path), os.O_CREAT | os.O_WRONLY)
        return fd, str(input_path)

    with (
        patch("routers.ocr.tempfile.mkstemp", side_effect=fake_mkstemp),
        patch("routers.ocr.asyncio.to_thread", side_effect=_fake_to_thread_raises),
    ):
        with pytest.raises(RuntimeError) as exc_info:
            await ocr._process_ocr(
                file_bytes=PDF_BYTES,
                original_filename="scan.pdf",
                language="ind+eng",
                task_id="t2",
                page_count=1,
            )
    # The original exception message should be preserved
    assert "OCR engine failed" in str(exc_info.value)


@pytest.mark.asyncio
async def test_process_ocr_empty_output(tmp_path, _stub_ocrmypdf_module):
    """_process_ocr raises RuntimeError when output file is empty (hits line 98)."""
    input_path = tmp_path / "in.pdf"
    output_path = tmp_path / "in_ocr.pdf"

    # Pre-create input with real data + output as empty
    input_path.write_bytes(PDF_BYTES)
    output_path.write_text("")

    with patch("routers.ocr.tempfile.mkstemp", side_effect=[
        (os.open(str(input_path), os.O_WRONLY), str(input_path)),
        (os.open(str(output_path), os.O_RDONLY), str(output_path)),
    ]):
        with pytest.raises(RuntimeError) as exc_info:
            await ocr._process_ocr(
                file_bytes=PDF_BYTES,
                original_filename="scan.pdf",
                language="ind+eng",
                task_id="t4",
                page_count=1,
            )
    assert "empty" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_process_ocr_generic_exception(tmp_path, _stub_ocrmypdf_module):
    """_process_ocr catches generic non-RuntimeError (hits lines 143-145)."""
    input_path = tmp_path / "in.pdf"
    output_path = tmp_path / "in_ocr.pdf"

    # Pre-create both files — output with content so size check passes
    input_path.write_bytes(PDF_BYTES)
    output_path.write_bytes(b"non-empty-ocr-output")

    with (
        patch("routers.ocr.tempfile.mkstemp", side_effect=[
            (os.open(str(input_path), os.O_WRONLY), str(input_path)),
            (os.open(str(output_path), os.O_RDONLY), str(output_path)),
        ]),
        patch("routers.ocr.asyncio.to_thread", return_value=None),
        patch("routers.ocr.upload_file", side_effect=ValueError("simulated upload failure")),
    ):
        with pytest.raises(RuntimeError) as exc_info:
            await ocr._process_ocr(
                file_bytes=PDF_BYTES,
                original_filename="scan.pdf",
                language="ind+eng",
                task_id="t5",
                page_count=1,
            )
    assert "simulated" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_process_ocr_cleanup_on_error(tmp_path, _stub_ocrmypdf_module):
    """_process_ocr cleanup runs (lines 152-153, 156-158) even when exception propagates."""
    input_path = tmp_path / "in.pdf"
    output_path = tmp_path / "in_ocr.pdf"

    input_path.write_bytes(PDF_BYTES)
    output_path.write_bytes(b"non-empty-ocr-output")

    with (
        patch("routers.ocr.tempfile.mkstemp", side_effect=[
            (os.open(str(input_path), os.O_WRONLY), str(input_path)),
            (os.open(str(output_path), os.O_RDONLY), str(output_path)),
        ]),
        patch("routers.ocr.asyncio.to_thread", return_value=None),
        patch("routers.ocr.upload_file", side_effect=RuntimeError("upload fails")),
    ):
        with pytest.raises(RuntimeError):
            await ocr._process_ocr(
                file_bytes=PDF_BYTES,
                original_filename="scan.pdf",
                language="ind+eng",
                task_id="t6",
                page_count=1,
            )


@pytest.mark.asyncio
async def test_process_ocr_output_missing(tmp_path, _stub_ocrmypdf_module):
    """T14: _process_ocr failure when output file not produced."""
    input_path = tmp_path / "in.pdf"
    output_path = tmp_path / "in_ocr.pdf"

    input_path.write_bytes(PDF_BYTES)
    output_path.write_bytes(b"placeholder")  # Will be deleted by _fake_to_thread_no_output

    with (
        patch("routers.ocr.tempfile.mkstemp", side_effect=[
            (os.open(str(input_path), os.O_WRONLY), str(input_path)),
            (os.open(str(output_path), os.O_RDONLY), str(output_path)),
        ]),
        patch("routers.ocr.asyncio.to_thread", side_effect=_fake_to_thread_no_output),
    ):
        with pytest.raises(RuntimeError) as exc_info:
            await ocr._process_ocr(
                file_bytes=PDF_BYTES,
                original_filename="scan.pdf",
                language="ind+eng",
                task_id="t3",
                page_count=1,
            )
    assert "Output file not created" in str(exc_info.value)


@pytest.mark.asyncio
async def test_ocr_endpoint_unexpected_error_returns_500(test_client):
    """T-500: ocr_endpoint catches unexpected Exception and returns 500 (lines 254-265)."""
    with (
        patch("routers.ocr.validate_pdf_file") as mock_validate,
        patch("routers.ocr.fitz.open", return_value=_DummyDoc([""])),
    ):
        mock_validate.side_effect = RuntimeError("unexpected crash in validator")
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("scan.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 500
    body = response.json()
    assert "Gagal memproses file" in body["detail"] or "Silakan coba lagi" in body["detail"]


# =============================================================================
# Status polling integration test
# =============================================================================


@pytest.mark.asyncio
async def test_background_task_polling_flow(test_client, tmp_path):
    """T15: POST returns 202 → GET /api/status/{task_id} returns 200 with same id; unknown id 404."""
    input_p = tmp_path / "in.pdf"
    output_p = tmp_path / "in_ocr.pdf"

    def fake_mkstemp(suffix="", prefix=""):
        fd = os.open(str(input_p), os.O_CREAT | os.O_WRONLY)
        return fd, str(input_p)

    async def fake_to_thread(func, *args, **kwargs):
        out_path = args[1]
        Path(out_path).write_bytes(b"fake-ocr-output")
        return None

    with (
        patch("routers.ocr.validate_pdf_file") as mock_validate,
        patch("routers.ocr.fitz.open", return_value=_DummyDoc([""])),
        patch("routers.ocr.tempfile.mkstemp", side_effect=fake_mkstemp),
        patch("routers.ocr.asyncio.to_thread", side_effect=fake_to_thread),
        patch("routers.ocr.upload_file", return_value={"key": "k"}),
        patch("routers.ocr.generate_signed_url", return_value="https://signed/url"),
    ):
        mock_validate.return_value.filename = "doc.pdf"
        mock_validate.return_value.page_count = 1
        response = await test_client.post(
            "/api/ocr",
            files=_build_file("doc.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 202
    task_id = response.json()["task_id"]

    # Poll for the created task
    poll_resp = await test_client.get(f"/api/status/{task_id}")
    assert poll_resp.status_code == 200
    assert poll_resp.json()["task_id"] == task_id

    # Unknown id returns 404
    not_found = await test_client.get("/api/status/nonexistent")
    assert not_found.status_code == 404
    assert not_found.json()["detail"] == "Task not found"
