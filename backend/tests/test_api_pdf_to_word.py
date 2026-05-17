import os
from unittest.mock import patch

import pytest
from fastapi import HTTPException

from routers import pdf_to_word
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


@pytest.mark.asyncio
async def test_pdf_to_word_valid_returns_202(test_client):
    with (
        patch("routers.pdf_to_word.validate_pdf_file") as mock_validate,
        patch("routers.pdf_to_word.fitz.open", return_value=_DummyDoc(["teks cukup panjang untuk lolos"])),
    ):
        mock_validate.return_value.filename = "sample.pdf"
        mock_validate.return_value.page_count = 3
        response = await test_client.post(
            "/api/pdf-to-word",
            files=_build_file("sample.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 202
    body = response.json()
    assert "task_id" in body
    assert body["status"] == "queued"
    assert body["estimated_seconds"] == 30


@pytest.mark.asyncio
async def test_pdf_to_word_scanned_pdf_returns_400(test_client):
    with (
        patch("routers.pdf_to_word.validate_pdf_file") as mock_validate,
        patch("routers.pdf_to_word.fitz.open", return_value=_DummyDoc(["", " "])),
    ):
        mock_validate.return_value.filename = "scan.pdf"
        mock_validate.return_value.page_count = 2
        response = await test_client.post(
            "/api/pdf-to-word",
            files=_build_file("scan.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 400
    body = response.json()
    assert "scan" in body["detail"].lower()


@pytest.mark.asyncio
async def test_pdf_to_word_encrypted_returns_400(test_client):
    with patch(
        "routers.pdf_to_word.validate_pdf_file",
        side_effect=HTTPException(
            status_code=400,
            detail="PDF ini dilindungi kata sandi. Gunakan fitur Unlock terlebih dahulu.",
        ),
    ):
        response = await test_client.post(
            "/api/pdf-to-word",
            files=_build_file("locked.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 400
    body = response.json()
    assert "dilindungi kata sandi" in body["detail"]


@pytest.mark.asyncio
async def test_pdf_to_word_too_many_pages_returns_400(test_client):
    with patch(
        "routers.pdf_to_word.validate_pdf_file",
        side_effect=HTTPException(
            status_code=400,
            detail="PDF terlalu panjang: 150 halaman. Maksimal 100 halaman.",
        ),
    ):
        response = await test_client.post(
            "/api/pdf-to-word",
            files=_build_file("long.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 400
    assert "terlalu panjang" in response.json()["detail"]


@pytest.mark.asyncio
async def test_pdf_to_word_file_too_large_returns_413(test_client):
    with patch(
        "routers.pdf_to_word.validate_pdf_file",
        side_effect=HTTPException(
            status_code=413,
            detail="Ukuran file terlalu besar: 25.0MB. Maksimal 20MB.",
        ),
    ):
        response = await test_client.post(
            "/api/pdf-to-word",
            files=_build_file("large.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 413
    assert "terlalu besar" in response.json()["detail"]


@pytest.mark.asyncio
async def test_convert_pdf_to_docx_success(tmp_path):
    input_bytes = PDF_BYTES
    output_dir = tmp_path / "out"
    output_dir.mkdir()

    def fake_mkdtemp(prefix=""):
        return str(output_dir)

    def fake_mkstemp(suffix="", prefix=""):
        p = tmp_path / "in.pdf"
        fd = os.open(str(p), os.O_CREAT | os.O_WRONLY)
        return fd, str(p)

    class _Done:
        returncode = 0
        stderr = ""

    out_file = output_dir / "in.docx"
    out_file.write_bytes(b"docx-content")

    with (
        patch("routers.pdf_to_word.tempfile.mkdtemp", side_effect=fake_mkdtemp),
        patch("routers.pdf_to_word.tempfile.mkstemp", side_effect=fake_mkstemp),
        patch("routers.pdf_to_word.subprocess.run", return_value=_Done()),
        patch("routers.pdf_to_word.upload_file", return_value={"key": "k"}),
        patch("routers.pdf_to_word.generate_signed_url", return_value="https://signed/url"),
    ):
        result = await pdf_to_word._convert_pdf_to_docx(input_bytes, "a.pdf", "t1")

    assert result["download_url"] == "https://signed/url"
    assert result["original_size"] == len(input_bytes)
    assert result["output_size"] == len(b"docx-content")


@pytest.mark.asyncio
async def test_convert_pdf_to_docx_timeout():
    with patch(
        "routers.pdf_to_word.subprocess.run",
        side_effect=__import__("subprocess").TimeoutExpired(cmd="x", timeout=1),
    ):
        with pytest.raises(RuntimeError) as exc_info:
            await pdf_to_word._convert_pdf_to_docx(PDF_BYTES, "a.pdf", "t2")
    assert "timeout" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_convert_pdf_to_docx_exit_code_nonzero():
    class _Failed:
        returncode = 1
        stderr = "Error: could not convert"

    with patch("routers.pdf_to_word.subprocess.run", return_value=_Failed()):
        with pytest.raises(RuntimeError) as exc_info:
            await pdf_to_word._convert_pdf_to_docx(PDF_BYTES, "a.pdf", "t3")
    assert "failed" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_convert_pdf_to_docx_empty_output(tmp_path):
    output_dir = tmp_path / "out"
    output_dir.mkdir()

    def fake_mkdtemp(prefix=""):
        return str(output_dir)

    def fake_mkstemp(suffix="", prefix=""):
        p = tmp_path / "in.pdf"
        fd = os.open(str(p), os.O_CREAT | os.O_WRONLY)
        return fd, str(p)

    class _Done:
        returncode = 0
        stderr = ""

    (output_dir / "in.docx").write_bytes(b"")

    with (
        patch("routers.pdf_to_word.tempfile.mkdtemp", side_effect=fake_mkdtemp),
        patch("routers.pdf_to_word.tempfile.mkstemp", side_effect=fake_mkstemp),
        patch("routers.pdf_to_word.subprocess.run", return_value=_Done()),
    ):
        with pytest.raises(RuntimeError) as exc_info:
            await pdf_to_word._convert_pdf_to_docx(PDF_BYTES, "a.pdf", "t4")
    assert "empty" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_convert_pdf_to_docx_libreoffice_not_found():
    with patch("routers.pdf_to_word.subprocess.run", side_effect=FileNotFoundError()):
        with pytest.raises(RuntimeError) as exc_info:
            await pdf_to_word._convert_pdf_to_docx(PDF_BYTES, "a.pdf", "t5")
    assert "LibreOffice" in str(exc_info.value)


@pytest.mark.asyncio
async def test_convert_pdf_to_docx_no_output_file(tmp_path):
    output_dir = tmp_path / "out"
    output_dir.mkdir()

    def fake_mkdtemp(prefix=""):
        return str(output_dir)

    def fake_mkstemp(suffix="", prefix=""):
        p = tmp_path / "in.pdf"
        fd = os.open(str(p), os.O_CREAT | os.O_WRONLY)
        return fd, str(p)

    class _Done:
        returncode = 0
        stderr = ""

    # Don't create any output file — LibreOffice "succeeded" but produced nothing.
    # Fallback also fails for this fake PDF, so the original output-file error path remains covered.
    with (
        patch("routers.pdf_to_word.tempfile.mkdtemp", side_effect=fake_mkdtemp),
        patch("routers.pdf_to_word.tempfile.mkstemp", side_effect=fake_mkstemp),
        patch("routers.pdf_to_word.subprocess.run", return_value=_Done()),
        patch(
            "routers.pdf_to_word._create_layout_docx",
            side_effect=RuntimeError("LibreOffice did not produce output file"),
        ),
    ):
        with pytest.raises(RuntimeError) as exc_info:
            await pdf_to_word._convert_pdf_to_docx(PDF_BYTES, "a.pdf", "t6")
    assert "did not produce" in str(exc_info.value).lower()


@pytest.mark.asyncio
async def test_convert_pdf_to_docx_falls_back_to_layout_docx(tmp_path):
    output_dir = tmp_path / "out"
    output_dir.mkdir()

    def fake_mkdtemp(prefix=""):
        return str(output_dir)

    def fake_mkstemp(suffix="", prefix=""):
        p = tmp_path / "in.pdf"
        fd = os.open(str(p), os.O_CREAT | os.O_WRONLY)
        return fd, str(p)

    class _Done:
        returncode = 0
        stderr = ""

    def fake_fallback(input_path: str, output_path: str):
        assert input_path.endswith("in.pdf")
        with open(output_path, "wb") as file:
            file.write(b"fallback-docx")

    with (
        patch("routers.pdf_to_word.tempfile.mkdtemp", side_effect=fake_mkdtemp),
        patch("routers.pdf_to_word.tempfile.mkstemp", side_effect=fake_mkstemp),
        patch("routers.pdf_to_word.subprocess.run", return_value=_Done()),
        patch("routers.pdf_to_word._create_layout_docx", side_effect=fake_fallback),
        patch("routers.pdf_to_word.upload_file", return_value={"key": "k"}),
        patch("routers.pdf_to_word.generate_signed_url", return_value="https://signed/url"),
    ):
        result = await pdf_to_word._convert_pdf_to_docx(PDF_BYTES, "a.pdf", "t7")

    assert result["download_url"] == "https://signed/url"
    assert result["output_size"] == len(b"fallback-docx")


def test_is_scanned_pdf_exception_returns_false():
    """If fitz.open fails entirely, treat as non-scanned (let validator catch corruption)."""
    with patch("routers.pdf_to_word.fitz.open", side_effect=RuntimeError("corrupt")):
        assert pdf_to_word._is_scanned_pdf(b"junk") is False


@pytest.mark.asyncio
async def test_background_task_polling_flow(test_client):
    with (
        patch("routers.pdf_to_word.validate_pdf_file") as mock_validate,
        patch("routers.pdf_to_word.fitz.open", return_value=_DummyDoc(["normal text"])),
    ):
        mock_validate.return_value.filename = "doc.pdf"
        mock_validate.return_value.page_count = 1
        response = await test_client.post(
            "/api/pdf-to-word",
            files=_build_file("doc.pdf", PDF_BYTES, "application/pdf"),
        )

    assert response.status_code == 202
    task_id = response.json()["task_id"]

    poll_resp = await test_client.get(f"/api/status/{task_id}")
    assert poll_resp.status_code == 200
    assert poll_resp.json()["task_id"] == task_id

    not_found = await test_client.get("/api/status/nonexistent")
    assert not_found.status_code == 404


@pytest.fixture(autouse=True)
def _clear_tasks_between_tests():
    _tasks.clear()
    yield
    _tasks.clear()
