"""Unit tests for shared PDF validator."""

import pytest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException

from utils.pdf_validator import validate_pdf_file, PDFInfo


def _make_upload_file(filename="test.pdf", content_type="application/pdf"):
    """Helper to create mock UploadFile."""
    mock = MagicMock()
    mock.filename = filename
    mock.content_type = content_type
    return mock


class TestValidatePdfFile:
    def test_empty_file_raises_400(self):
        file = _make_upload_file()
        with pytest.raises(HTTPException) as exc_info:
            validate_pdf_file(file, b"")
        assert exc_info.value.status_code == 400
        assert "kosong" in exc_info.value.detail

    def test_invalid_mime_type_raises_400(self):
        file = _make_upload_file(content_type="text/plain")
        with pytest.raises(HTTPException) as exc_info:
            validate_pdf_file(file, b"%PDF-test")
        assert exc_info.value.status_code == 400
        assert "Tipe file" in exc_info.value.detail

    def test_invalid_extension_raises_400(self):
        file = _make_upload_file(filename="test.txt")
        with pytest.raises(HTTPException) as exc_info:
            validate_pdf_file(file, b"%PDF-test")
        assert exc_info.value.status_code == 400
        assert "Ekstensi" in exc_info.value.detail

    def test_invalid_magic_bytes_raises_400(self):
        file = _make_upload_file()
        with pytest.raises(HTTPException) as exc_info:
            validate_pdf_file(file, b"NOT-A-PDF-FILE")
        assert exc_info.value.status_code == 400
        assert "bukan file PDF" in exc_info.value.detail

    def test_oversized_file_raises_413(self):
        file = _make_upload_file()
        big_bytes = b"%PDF" + b"x" * 2000
        with pytest.raises(HTTPException) as exc_info:
            validate_pdf_file(file, big_bytes, max_size_bytes=1024)
        assert exc_info.value.status_code == 413
        assert "terlalu besar" in exc_info.value.detail

    def test_file_at_max_size_passes(self):
        file = _make_upload_file()
        # Exactly 1024 bytes with PDF magic
        file_bytes = b"%PDF" + b"x" * 1020
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 1
            mock_doc.is_encrypted = False
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            with patch("utils.pdf_validator.settings") as mock_settings:
                mock_settings.max_upload_size_bytes = 1024
                result = validate_pdf_file(file, file_bytes)
        assert isinstance(result, PDFInfo)
        assert result.size_bytes == 1024

    def test_custom_max_size_override(self):
        file = _make_upload_file()
        file_bytes = b"%PDF" + b"x" * 1500  # 1504 bytes total
        # Default would be 20MB, but we override to 1024
        with pytest.raises(HTTPException) as exc_info:
            validate_pdf_file(file, file_bytes, max_size_bytes=1024)
        assert exc_info.value.status_code == 413

    def test_valid_pdf_returns_pdfinfo(self):
        file = _make_upload_file()
        # Minimal valid PDF bytes
        file_bytes = b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\nstartxref\n0\n%%EOF"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 1
            mock_doc.is_encrypted = False
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            result = validate_pdf_file(file, file_bytes)
        assert isinstance(result, PDFInfo)
        assert result.size_bytes == len(file_bytes)
        assert result.page_count == 1
        assert result.is_encrypted is False
        assert result.filename == "test.pdf"

    def test_corrupted_pdf_raises_400(self):
        file = _make_upload_file()
        file_bytes = b"%PDF-corrupt"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_fitz.open.side_effect = Exception("Corrupt PDF")
            with pytest.raises(HTTPException) as exc_info:
                validate_pdf_file(file, file_bytes)
        assert exc_info.value.status_code == 400
        assert "corrupt" in exc_info.value.detail

    def test_page_count_exceeds_limit_raises_400(self):
        file = _make_upload_file()
        file_bytes = b"%PDF-test"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 10
            mock_doc.is_encrypted = False
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            with pytest.raises(HTTPException) as exc_info:
                validate_pdf_file(file, file_bytes, max_pages=5)
        assert exc_info.value.status_code == 400
        assert "terlalu panjang" in exc_info.value.detail

    def test_page_count_within_limit_passes(self):
        file = _make_upload_file()
        file_bytes = b"%PDF-test"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 3
            mock_doc.is_encrypted = False
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            result = validate_pdf_file(file, file_bytes, max_pages=5)
        assert result.page_count == 3

    def test_reject_encrypted_true_raises_400(self):
        file = _make_upload_file()
        file_bytes = b"%PDF-test"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 1
            mock_doc.is_encrypted = True
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            with pytest.raises(HTTPException) as exc_info:
                validate_pdf_file(file, file_bytes, reject_encrypted=True)
        assert exc_info.value.status_code == 400
        assert "dilindungi kata sandi" in exc_info.value.detail

    def test_require_encrypted_true_raises_400(self):
        file = _make_upload_file()
        file_bytes = b"%PDF-test"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 1
            mock_doc.is_encrypted = False
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            with pytest.raises(HTTPException) as exc_info:
                validate_pdf_file(file, file_bytes, require_encrypted=True)
        assert exc_info.value.status_code == 400
        assert "tidak terproteksi" in exc_info.value.detail

    def test_encrypted_status_detected_correctly(self):
        file = _make_upload_file()
        file_bytes = b"%PDF-test"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 1
            mock_doc.is_encrypted = True
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            result = validate_pdf_file(file, file_bytes)
        assert result.is_encrypted is True

    def test_filename_none_defaults_to_unknown(self):
        file = _make_upload_file(filename="test.pdf")
        file_bytes = b"%PDF-test"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 1
            mock_doc.is_encrypted = False
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            result = validate_pdf_file(file, file_bytes)
        assert result.filename == "test.pdf"

    def test_extension_case_insensitive(self):
        file = _make_upload_file(filename="test.PDF")
        file_bytes = b"%PDF-test"
        with patch("utils.pdf_validator.fitz") as mock_fitz:
            mock_doc = MagicMock()
            mock_doc.page_count = 1
            mock_doc.is_encrypted = False
            mock_doc.close = MagicMock()
            mock_fitz.open.return_value = mock_doc
            result = validate_pdf_file(file, file_bytes)
        assert isinstance(result, PDFInfo)


class TestPDFInfo:
    def test_pdfinfo_dataclass(self):
        info = PDFInfo(
            size_bytes=1024,
            page_count=5,
            is_encrypted=False,
            filename="test.pdf"
        )
        assert info.size_bytes == 1024
        assert info.page_count == 5
        assert info.is_encrypted is False
        assert info.filename == "test.pdf"
