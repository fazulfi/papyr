"""Unit tests for shared encryption service."""

import importlib
from unittest.mock import MagicMock, patch
from unittest.mock import mock_open as mock_file_open

import pytest
from fastapi import HTTPException

encryption = importlib.import_module("services.encryption")
encrypt_pdf = encryption.encrypt_pdf
decrypt_pdf = encryption.decrypt_pdf
_cleanup = encryption._cleanup
ENCRYPTION_METHODS = encryption.ENCRYPTION_METHODS
DEFAULT_PERMISSIONS = encryption.DEFAULT_PERMISSIONS
PDF_ENCRYPT_AES_128 = encryption.PDF_ENCRYPT_AES_128
PDF_ENCRYPT_AES_256 = encryption.PDF_ENCRYPT_AES_256
PDF_PERM_ACCESSIBILITY = encryption.PDF_PERM_ACCESSIBILITY
PDF_PERM_ANNOTATE = encryption.PDF_PERM_ANNOTATE
PDF_PERM_FORM = encryption.PDF_PERM_FORM


def _make_minimal_pdf_bytes() -> bytes:
    """Create a minimal valid PDF in memory using fitz."""
    doc = MagicMock()
    doc.page_count = 1
    doc.is_encrypted = False
    doc.close = MagicMock()
    return b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\nstartxref\n0\n%%EOF"


def _make_mock_doc(is_encrypted: bool = False, authenticate_result: int = 2):
    """Create a mock fitz.Document."""
    mock_doc = MagicMock()
    mock_doc.is_encrypted = is_encrypted
    mock_doc.authenticate.return_value = authenticate_result
    mock_doc.close = MagicMock()
    return mock_doc


class TestEncryptPdf:
    def test_invalid_method_raises_400(self):
        file_bytes = b"%PDF-test"
        with pytest.raises(HTTPException) as exc_info:
            encrypt_pdf(file_bytes, "password123", method="aes512")
        assert exc_info.value.status_code == 400
        assert "aes128" in exc_info.value.detail or "aes256" in exc_info.value.detail

    def test_empty_password_raises_400(self):
        file_bytes = b"%PDF-test"
        with pytest.raises(HTTPException) as exc_info:
            encrypt_pdf(file_bytes, "")
        assert exc_info.value.status_code == 400
        assert "kosong" in exc_info.value.detail.lower() or "tidak boleh" in exc_info.value.detail

    def test_corrupt_pdf_raises_400(self):
        file_bytes = b"NOT_A_PDF"
        with pytest.raises(HTTPException) as exc_info:
            encrypt_pdf(file_bytes, "password123")
        assert exc_info.value.status_code == 400
        assert "corrupt" in exc_info.value.detail or "tidak bisa dibuka" in exc_info.value.detail

    def test_already_encrypted_raises_409(self):
        file_bytes = b"%PDF-test"
        with patch("services.encryption.fitz.open") as mock_open:
            mock_open.return_value = _make_mock_doc(is_encrypted=True)
            with pytest.raises(HTTPException) as exc_info:
                encrypt_pdf(file_bytes, "password123")
            assert exc_info.value.status_code == 409
            assert (
                "sudah terenkripsi" in exc_info.value.detail
                or "proteksi ganda" in exc_info.value.detail
            )

    def test_aes256_encrypt_success(self):
        file_bytes = _make_minimal_pdf_bytes()
        with (
            patch("services.encryption.fitz.open") as mock_open,
            patch("services.encryption.tempfile.mkstemp") as mock_mkstemp,
            patch("services.encryption.os.close"),
            patch("services.encryption.os.path.exists", return_value=True),
            patch("services.encryption.os.remove"),
            patch("builtins.open", mock_file_open(read_data=b"encrypted_pdf_content")),
        ):
            mock_mkstemp.return_value = (99, "/tmp/papyr_enc_xxx.pdf")
            mock_doc = _make_mock_doc(is_encrypted=False)
            mock_open.return_value = mock_doc

            result = encrypt_pdf(file_bytes, "password123", method="aes256")

            assert result == b"encrypted_pdf_content"
            mock_doc.save.assert_called_once()
            call_kwargs = mock_doc.save.call_args.kwargs
            assert call_kwargs["encryption"] == ENCRYPTION_METHODS["aes256"]
            assert call_kwargs["owner_pw"] == "password123"
            assert call_kwargs["user_pw"] == "password123"

    def test_aes128_encrypt_success(self):
        file_bytes = _make_minimal_pdf_bytes()
        with (
            patch("services.encryption.fitz.open") as mock_open,
            patch("services.encryption.tempfile.mkstemp") as mock_mkstemp,
            patch("services.encryption.os.close"),
            patch("services.encryption.os.path.exists", return_value=True),
            patch("services.encryption.os.remove"),
            patch("builtins.open", mock_file_open(read_data=b"encrypted_pdf_content")),
        ):
            mock_mkstemp.return_value = (99, "/tmp/papyr_enc_xxx.pdf")
            mock_doc = _make_mock_doc(is_encrypted=False)
            mock_open.return_value = mock_doc

            result = encrypt_pdf(file_bytes, "password123", method="aes128")

            assert result == b"encrypted_pdf_content"
            call_kwargs = mock_doc.save.call_args.kwargs
            assert call_kwargs["encryption"] == ENCRYPTION_METHODS["aes128"]

    def test_custom_permissions(self):
        file_bytes = _make_minimal_pdf_bytes()
        custom_perms = PDF_PERM_ANNOTATE | PDF_PERM_ACCESSIBILITY
        with (
            patch("services.encryption.fitz.open") as mock_open,
            patch("services.encryption.tempfile.mkstemp") as mock_mkstemp,
            patch("services.encryption.os.close"),
            patch("services.encryption.os.path.exists", return_value=True),
            patch("services.encryption.os.remove"),
            patch("builtins.open", mock_file_open(read_data=b"encrypted")),
        ):
            mock_mkstemp.return_value = (99, "/tmp/papyr_enc_xxx.pdf")
            mock_doc = _make_mock_doc(is_encrypted=False)
            mock_open.return_value = mock_doc

            encrypt_pdf(file_bytes, "password123", method="aes256", permissions=custom_perms)

            call_kwargs = mock_doc.save.call_args.kwargs
            assert call_kwargs["permissions"] == custom_perms

    def test_output_empty_raises_500(self):
        file_bytes = _make_minimal_pdf_bytes()
        with (
            patch("services.encryption.fitz.open") as mock_open,
            patch("services.encryption.tempfile.mkstemp") as mock_mkstemp,
            patch("services.encryption.os.close"),
            patch("services.encryption.os.path.exists", return_value=True),
            patch("services.encryption.os.remove"),
            patch("builtins.open", mock_file_open(read_data=b"")),
        ):
            mock_mkstemp.return_value = (99, "/tmp/papyr_enc_xxx.pdf")
            mock_doc = _make_mock_doc(is_encrypted=False)
            mock_open.return_value = mock_doc

            with pytest.raises(HTTPException) as exc_info:
                encrypt_pdf(file_bytes, "password123", method="aes256")
            assert exc_info.value.status_code == 500
            assert "kosong" in exc_info.value.detail or "gagal" in exc_info.value.detail.lower()

    def test_unexpected_error_raises_500(self):
        file_bytes = _make_minimal_pdf_bytes()
        with (
            patch("services.encryption.fitz.open") as mock_open,
            patch("services.encryption.tempfile.mkstemp") as mock_mkstemp,
            patch("services.encryption.os.close"),
        ):
            mock_mkstemp.return_value = (99, "/tmp/papyr_enc_xxx.pdf")
            mock_doc = _make_mock_doc(is_encrypted=False)
            mock_doc.save.side_effect = RuntimeError("Unexpected error")
            mock_open.return_value = mock_doc

            with pytest.raises(HTTPException) as exc_info:
                encrypt_pdf(file_bytes, "password123", method="aes256")
            assert exc_info.value.status_code == 500


class TestDecryptPdf:
    def test_empty_password_raises_400(self):
        file_bytes = b"%PDF-test"
        with pytest.raises(HTTPException) as exc_info:
            decrypt_pdf(file_bytes, "")
        assert exc_info.value.status_code == 400
        assert "kosong" in exc_info.value.detail.lower() or "tidak boleh" in exc_info.value.detail

    def test_corrupt_pdf_raises_400(self):
        file_bytes = b"NOT_A_PDF"
        with pytest.raises(HTTPException) as exc_info:
            decrypt_pdf(file_bytes, "password123")
        assert exc_info.value.status_code == 400
        assert "corrupt" in exc_info.value.detail or "tidak bisa dibuka" in exc_info.value.detail

    def test_not_encrypted_raises_400(self):
        file_bytes = b"%PDF-test"
        with patch("services.encryption.fitz.open") as mock_open:
            mock_open.return_value = _make_mock_doc(is_encrypted=False)
            with pytest.raises(HTTPException) as exc_info:
                decrypt_pdf(file_bytes, "password123")
            assert exc_info.value.status_code == 400
            assert (
                "tidak terproteksi" in exc_info.value.detail
                or "terenkripsi" in exc_info.value.detail.lower()
            )

    def test_wrong_password_raises_401(self):
        file_bytes = b"%PDF-test"
        with patch("services.encryption.fitz.open") as mock_open:
            mock_doc = _make_mock_doc(is_encrypted=True, authenticate_result=0)
            mock_open.return_value = mock_doc
            with pytest.raises(HTTPException) as exc_info:
                decrypt_pdf(file_bytes, "wrongpassword")
            assert exc_info.value.status_code == 401
            assert "salah" in exc_info.value.detail.lower()

    def test_correct_password_decrypts_success(self):
        file_bytes = b"%PDF-encrypted"
        with (
            patch("services.encryption.fitz.open") as mock_open,
            patch("services.encryption.tempfile.mkstemp") as mock_mkstemp,
            patch("services.encryption.os.close"),
            patch("services.encryption.os.path.exists", return_value=True),
            patch("services.encryption.os.remove"),
            patch("builtins.open", mock_file_open(read_data=b"decrypted_pdf_content")),
        ):
            mock_mkstemp.return_value = (99, "/tmp/papyr_dec_xxx.pdf")
            mock_doc = _make_mock_doc(is_encrypted=True, authenticate_result=2)
            mock_open.return_value = mock_doc

            result = decrypt_pdf(file_bytes, "correctpassword")

            assert result == b"decrypted_pdf_content"
            mock_doc.authenticate.assert_called_once_with("correctpassword")
            mock_doc.save.assert_called_once_with("/tmp/papyr_dec_xxx.pdf", encryption=0)

    def test_output_empty_raises_500(self):
        file_bytes = b"%PDF-encrypted"
        with (
            patch("services.encryption.fitz.open") as mock_open,
            patch("services.encryption.tempfile.mkstemp") as mock_mkstemp,
            patch("services.encryption.os.close"),
            patch("services.encryption.os.path.exists", return_value=True),
            patch("services.encryption.os.remove"),
            patch("builtins.open", mock_file_open(read_data=b"")),
        ):
            mock_mkstemp.return_value = (99, "/tmp/papyr_dec_xxx.pdf")
            mock_doc = _make_mock_doc(is_encrypted=True, authenticate_result=2)
            mock_open.return_value = mock_doc

            with pytest.raises(HTTPException) as exc_info:
                decrypt_pdf(file_bytes, "correctpassword")
            assert exc_info.value.status_code == 500

    def test_unexpected_error_raises_500(self):
        file_bytes = b"%PDF-test"
        with (
            patch("services.encryption.fitz.open") as mock_open,
            patch("services.encryption.tempfile.mkstemp") as mock_mkstemp,
            patch("services.encryption.os.close"),
        ):
            mock_mkstemp.return_value = (99, "/tmp/papyr_dec_xxx.pdf")
            mock_doc = _make_mock_doc(is_encrypted=True, authenticate_result=2)
            mock_doc.save.side_effect = RuntimeError("Unexpected error")
            mock_open.return_value = mock_doc

            with pytest.raises(HTTPException) as exc_info:
                decrypt_pdf(file_bytes, "password123")
            assert exc_info.value.status_code == 500


class TestCleanup:
    def test_cleanup_removes_existing_file(self):
        with (
            patch("services.encryption.os.path.exists", return_value=True),
            patch("services.encryption.os.remove") as mock_remove,
        ):
            _cleanup("/tmp/test_file.pdf")
            mock_remove.assert_called_once_with("/tmp/test_file.pdf")

    def test_cleanup_nonexistent_path_noop(self):
        with (
            patch("services.encryption.os.path.exists", return_value=False),
            patch("services.encryption.os.remove") as mock_remove,
        ):
            _cleanup("/tmp/nonexistent.pdf")
            mock_remove.assert_not_called()

    def test_cleanup_oserror_noop(self):
        with (
            patch("services.encryption.os.path.exists", return_value=True),
            patch("services.encryption.os.remove", side_effect=OSError),
        ):
            # Should not raise
            _cleanup("/tmp/test_file.pdf")


class TestConstants:
    def test_encryption_methods_contains_aes128_aes256(self):
        assert "aes128" in ENCRYPTION_METHODS
        assert "aes256" in ENCRYPTION_METHODS
        assert ENCRYPTION_METHODS["aes128"] == PDF_ENCRYPT_AES_128
        assert ENCRYPTION_METHODS["aes256"] == PDF_ENCRYPT_AES_256

    def test_default_permissions_is_nonzero(self):
        assert DEFAULT_PERMISSIONS != 0
