# Papyr — StepPrompts (Fase 2 — Tool Expansion + Infrastructure)

**Sequential Development Steps for Building Fase 2 Features**

From Fase 2A (Security Tools) through Fase 2F (Admin Dashboard)

---

## ⚠️ AUTOPILOT RULES — READ THIS FIRST

> **Prinsip utama: Founder hanya bilang "lanjut" — agent handle SEMUA sisanya tanpa perlu diingatkan.**

### Saat sesi baru dimulai:
1. **Baca `stepprompts/progress.md`** — cari step terakhir yang ✅ di Fase 2 section, lanjut ke step berikutnya yang ⬜
2. **Baca step yang akan dikerjakan** di file `step-prompts-fase2.md` ini
3. **Baca semua docs yang direferensikan** di section "Documents to Read Before Starting"
4. **Langsung kerjakan** — jangan tanya "mau mulai?" atau "siap?"

### Saat mengerjakan step:
1. Ikuti instruksi **persis** seperti tertulis — jangan skip, jangan improvisasi
2. Jika step bertipe **Founder (manual)** → berikan instruksi lengkap ke founder, tunggu konfirmasi selesai
3. Jika step bertipe **AI Agent** → langsung kerjakan tanpa bertanya
4. Jika ada keputusan yang perlu founder → tanya sekali, lanjut setelah dijawab
5. **Jangan pernah skip** Documentation Updates, Git Instructions, atau Post-Step Actions

### Setelah step selesai (WAJIB, tanpa diingatkan):
1. ✅ Verifikasi semua Definition of Done items pass
2. 📝 Update semua dokumentasi yang diminta di step (stepprompts/progress.md, README.md, CHANGELOG.md)
3. 🔀 Git commit sesuai instruksi (branch, message, PR target)
4. 📊 Update `stepprompts/progress.md`:
   - Ubah baris step dari `⬜` → `✅ YYYY-MM-DD`
   - Update kolom Done + Progress % di Fase 2 Summary table
   - Update `Last Updated`, `Current Step`, `Overall Progress` di header
5. 🚀 Laporkan ke founder: "STEP-F2-XXX selesai. Lanjut STEP-F2-XXX+1?"

### Yang TIDAK BOLEH dilakukan:
- ❌ Jangan tanya "mau saya update progress.md?" — LANGSUNG update
- ❌ Jangan tanya "mau saya commit?" — LANGSUNG commit sesuai Git Instructions
- ❌ Jangan skip Documentation Updates karena "sudah selesai coding"
- ❌ Jangan lanjut ke step berikutnya tanpa semua DoD terpenuhi
- ❌ Jangan ubah arsitektur/tech stack tanpa referensi ke docs

### Referensi dokumen:
- Semua 34 dokumen ada di `docs/` — baca sesuai yang direferensikan tiap step
- Jika ada kontradiksi antar docs, ikuti urutan prioritas: **TDD > SRS > API Spec > Roadmap > lainnya**
- Backlog detail ada di `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md`

### File autopilot lainnya (WAJIB dibaca):
- **`stepprompts/progress.md`** — tracking step completion (primary tracker)

---

## How to Use This Document

Each step in this document is self-contained, verifiable, and executable without ambiguity. Steps are numbered sequentially (STEP-F2-001, STEP-F2-002, ...) and grouped by sub-phase.

**Executor Types:**
- **Founder (manual):** Step requires human action (account creation, infrastructure setup, production credentials)
- **AI Agent:** Step is executed by the AI development agent (OpenCode) — code generation, testing, deployment
- **Founder + AI Agent:** Step requires collaboration between both

**Workflow per step:**
1. Read all documents listed in "Documents to Read Before Starting"
2. Verify all Prerequisites are met
3. Follow Instructions exactly
4. Verify all Definition of Done items pass
5. Complete all Documentation Updates
6. Follow Git Instructions
7. Execute Post-Step Actions
8. **Update `stepprompts/progress.md`** — mark the completed step as ✅ with date, update phase Done count and Overall Progress

**Key files maintained throughout:**
- `stepprompts/progress.md` — **Step completion tracking (primary tracker)**
- `README.md` — Project setup and architecture overview (in repo)
- `CHANGELOG.md` — Release history

**Fase 2 assumes:**
- ALL Fase 1 steps are complete and stable (M01-M11, 89 tasks)
- `develop` branch is the base for all Fase 2 work
- All existing tests pass on `develop` before starting Fase 2
- 6 tools already live: Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image

---

### 🏗️ Technical Stack Reference (Fase 2)

| Component | Technology | Notes |
|-----------|-----------|-------|
| Frontend | Next.js 16 (App Router) | `frontend/` — SSR + client components, Vercel hosting |
| Backend | FastAPI (Python 3.11) | `backend/` — REST API on Railway |
| Storage | Cloudflare R2 | Object storage, signed URLs, auto-delete 60min |
| Client PDF | pdf-lib | Merge, split, rotate, watermark text, sign — in browser |
| Server PDF | PyMuPDF (fitz) | Compress, protect, unlock, watermark image, PDF-to-image |
| Compression | Ghostscript | PDF compression engine |
| Conversion | LibreOffice headless | PDF-to-Word (DOCX) |
| OCR | ocrmypdf + Tesseract | Scanned PDF → searchable PDF |
| Table Extract | camelot-py + openpyxl | PDF-to-Excel (XLSX) |
| Styling | Tailwind CSS v4 | Utility-first, DM Sans font |
| Testing (FE) | Vitest | Unit tests, 90% coverage target |
| Testing (BE) | Pytest | Unit tests, 90% coverage target |
| E2E Testing | Playwright | Browser automation, chromium + firefox |
| Analytics | Vercel Analytics | Custom events: task_started/completed/failed |
| Rate Limiting | slowapi | 10 req/min per IP |
| CI/CD | GitHub Actions | lint + test + build |
| Domain | mypapyr.com | Hostinger DNS → Vercel |

---

### 📏 Cross-Document Standards

| Standard | Value | Source |
|----------|-------|--------|
| Max upload size | 20 MB per file | `docs/04_Papyr_TDD_v1.0.md` |
| File retention | 60 minutes auto-delete | `docs/12_Papyr_Security_Policy_v1.0.md` |
| Rate limit | 10 requests/minute per IP | `docs/11_Papyr_API_Spec_v1.0.md` |
| Signed URL expiry | 60 minutes (3600 seconds) | `backend/utils/r2.py` |
| Password minimum | 4 characters | Backlog M12 |
| PDF magic bytes | `%PDF` (first 4 bytes) | `backend/routers/compress.py` |
| Test coverage target | ≥ 90% per tool | Backlog v1.4 |
| Git branch pattern | `feature/fase2/{milestone-name}` | Convention |
| Commit message format | `feat(fase2): description` | Convention |
| PR target branch | `develop` | Convention |
| Python version | 3.11 | `backend/Dockerfile` |
| Node.js version | 20+ | `frontend/package.json` |
| Response format | JSON with `success`, `download_url`, `expires_at` | Existing pattern |
| Error format | JSON with `detail` or `error` field | Existing pattern |
| Temp file prefix | `papyr_` | `backend/services/compress_service.py` |
| R2 filename prefix | `{tool}_{uuid}.{ext}` | Convention |
| Analytics tool names | lowercase with hyphens | `frontend/src/lib/analytics.ts` |
| UI language | Bahasa Indonesia (user-facing) | Convention |
| Code language | English (comments, variables) | Convention |
| Async task timeout (conversion) | 120 seconds | Backlog M16 |
| Async task timeout (OCR) | 180 seconds | Backlog M17 |

---
## Fase 2A — Security Tools (M12: Protect PDF + M13: Unlock PDF)

---

## STEP-F2-001: Backend — Create shared PDF validator utility

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/04_Papyr_TDD_v1.0.md` — Technical design, validation requirements
- `docs/11_Papyr_API_Spec_v1.0.md` — API validation standards
- `docs/13_Papyr_Coding_Standards_v1.0.md` — Python coding conventions
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — Shared utilities section

### ✅ Prerequisites
- All Fase 1 steps complete — `develop` branch stable
- Existing validation pattern in `backend/routers/compress.py` working
- PyMuPDF (fitz) installed and functional

### 🎯 Objective
Extract shared PDF validation logic into a reusable utility module `backend/utils/pdf_validator.py`. Module ini akan digunakan oleh SEMUA endpoint baru Fase 2 (protect, unlock, watermark, pdf-to-word, ocr, pdf-to-excel) untuk menghindari duplikasi kode. Router `compress.py` dan `image_to_pdf.py` yang sudah ada punya inline validation — step ini membuat versi shared untuk endpoint baru.

### 📋 Instructions

1. **Buat `backend/utils/pdf_validator.py`** — shared validation module:

```python
"""
Shared PDF validation utilities for Papyr.

Digunakan oleh semua endpoint yang menerima file PDF.
Validasi: kosong, MIME type, ekstensi, magic bytes, ukuran, page count, encrypted status.
"""

import logging
from dataclasses import dataclass
from typing import Optional

import fitz  # PyMuPDF
from fastapi import UploadFile, HTTPException

from utils.config import settings

logger = logging.getLogger(__name__)

# Constants
ALLOWED_MIME_TYPES = {"application/pdf"}
ALLOWED_EXTENSIONS = {".pdf"}
PDF_MAGIC = b"%PDF"


@dataclass
class PDFInfo:
    """Metadata hasil validasi PDF."""
    size_bytes: int
    page_count: int
    is_encrypted: bool
    filename: str


def validate_pdf_file(
    file: UploadFile,
    file_bytes: bytes,
    *,
    max_size_bytes: Optional[int] = None,
    max_pages: Optional[int] = None,
    require_encrypted: bool = False,
    reject_encrypted: bool = False,
) -> PDFInfo:
    """
    Validasi file PDF secara komprehensif.

    Args:
        file: FastAPI UploadFile object.
        file_bytes: Raw bytes dari file.
        max_size_bytes: Override max size (default: settings.max_upload_size_bytes).
        max_pages: Jika set, tolak PDF dengan halaman lebih dari ini.
        require_encrypted: Jika True, tolak PDF yang TIDAK terenkripsi.
        reject_encrypted: Jika True, tolak PDF yang terenkripsi.

    Returns:
        PDFInfo dengan metadata file.

    Raises:
        HTTPException: Jika validasi gagal.
    """
    filename = file.filename or "unknown"
    size_bytes = len(file_bytes)
    effective_max = max_size_bytes or settings.max_upload_size_bytes

    # 1. File tidak kosong
    if size_bytes == 0:
        raise HTTPException(
            status_code=400,
            detail="File kosong. Silakan upload file PDF yang valid.",
        )

    # 2. MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Tipe file tidak valid: {file.content_type}. Hanya file PDF yang diterima.",
        )

    # 3. Ekstensi
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Ekstensi file tidak valid: '{ext}'. Hanya file .pdf yang diterima.",
        )

    # 4. Magic bytes
    if file_bytes[:4] != PDF_MAGIC:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.',
        )

    # 5. Ukuran
    if size_bytes > effective_max:
        max_mb = effective_max / (1024 * 1024)
        actual_mb = round(size_bytes / (1024 * 1024), 1)
        raise HTTPException(
            status_code=413,
            detail=f"File terlalu besar: {actual_mb}MB. Maksimal {max_mb:.0f}MB.",
        )

    # 6. Buka PDF untuk metadata
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        page_count = doc.page_count
        is_encrypted = doc.is_encrypted
        doc.close()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail=f'"{filename}" bukan file PDF yang valid atau file corrupt.',
        )

    # 7. Page count limit
    if max_pages and page_count > max_pages:
        raise HTTPException(
            status_code=400,
            detail=f"PDF terlalu panjang: {page_count} halaman. Maksimal {max_pages} halaman.",
        )

    # 8. Encrypted status checks
    if reject_encrypted and is_encrypted:
        raise HTTPException(
            status_code=400,
            detail="PDF ini dilindungi kata sandi. Gunakan fitur Unlock terlebih dahulu.",
        )

    if require_encrypted and not is_encrypted:
        raise HTTPException(
            status_code=400,
            detail="PDF ini tidak terproteksi. Fitur ini hanya untuk PDF yang dilindungi password.",
        )

    return PDFInfo(
        size_bytes=size_bytes,
        page_count=page_count,
        is_encrypted=is_encrypted,
        filename=filename,
    )
```

2. **Buat unit test** di `backend/tests/test_pdf_validator.py`:

```python
"""Unit tests for shared PDF validator."""

import pytest
from unittest.mock import MagicMock
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
```

3. **Verify module imports:**
```bash
cd backend
python -c "from utils.pdf_validator import validate_pdf_file, PDFInfo; print('OK')"
```

4. **Run tests:**
```bash
cd backend
pytest tests/test_pdf_validator.py -v
```

### ✅ Definition of Done
- [ ] File `backend/utils/pdf_validator.py` created dengan `validate_pdf_file()` function
- [ ] `PDFInfo` dataclass returns: size_bytes, page_count, is_encrypted, filename
- [ ] Supports parameters: max_size_bytes, max_pages, require_encrypted, reject_encrypted
- [ ] HTTP status codes correct: 400 (validation), 413 (size)
- [ ] Error messages dalam Bahasa Indonesia
- [ ] Unit tests pass (5+ test cases)
- [ ] Module importable tanpa errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-001 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/protect-pdf`
- Commit message: `feat(fase2): add shared PDF validator utility

- Reusable validate_pdf_file() for all Fase 2 endpoints
- Supports: size limit, page limit, encrypted status checks
- PDFInfo dataclass for metadata
- Unit tests for validation edge cases

Refs: PAPYR-090, shared utility`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify import works: `python -c "from utils.pdf_validator import validate_pdf_file"`
- Proceed to STEP-F2-002

---

## STEP-F2-002: Backend — Create encryption service (shared protect/unlock)

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-091, PAPYR-100, PAPYR-102
- `docs/04_Papyr_TDD_v1.0.md` — Encryption approach
- `backend/services/compress_service.py` — Reference pattern for service module

### ✅ Prerequisites
- STEP-F2-001 complete (shared PDF validator exists)
- PyMuPDF (fitz) installed and working

### 🎯 Objective
Buat service module `backend/services/encryption.py` yang menghandle enkripsi dan dekripsi PDF menggunakan PyMuPDF. Module ini di-share antara protect (M12) dan unlock (M13). Implementasi AES-128 dan AES-256 encryption dengan permission flags.

### 📋 Instructions

1. **Buat service file** di `backend/services/encryption.py`:

```python
"""
PDF encryption/decryption service using PyMuPDF.

Shared antara:
- POST /api/protect (encrypt)
- POST /api/unlock (decrypt)

Supports AES-128 and AES-256 encryption methods.
"""

import logging
import tempfile
import os

import fitz  # PyMuPDF
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Encryption method mapping
ENCRYPTION_METHODS = {
    "aes128": fitz.PDF_ENCRYPT_AES_128,
    "aes256": fitz.PDF_ENCRYPT_AES_256,
}

# Permission flags — deny print and copy by default
DEFAULT_PERMISSIONS = (
    fitz.PDF_PERM_ACCESSIBILITY
    | fitz.PDF_PERM_ANNOTATE
    | fitz.PDF_PERM_FORM
)


def encrypt_pdf(
    file_bytes: bytes,
    password: str,
    method: str = "aes256",
    permissions: int | None = None,
) -> bytes:
    """
    Enkripsi PDF dengan password menggunakan PyMuPDF.

    Args:
        file_bytes: Raw PDF bytes.
        password: Password untuk enkripsi (user_pw dan owner_pw sama).
        method: "aes128" atau "aes256".
        permissions: Permission flags (default: deny print + copy).

    Returns:
        Encrypted PDF bytes.

    Raises:
        HTTPException(409): Jika PDF sudah terenkripsi.
        HTTPException(500): Jika enkripsi gagal.
    """
    encryption_flag = ENCRYPTION_METHODS.get(method)
    if encryption_flag is None:
        raise HTTPException(
            status_code=400,
            detail=f"Metode enkripsi tidak valid: '{method}'. Pilihan: aes128, aes256.",
        )

    perm = permissions if permissions is not None else DEFAULT_PERMISSIONS

    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="File PDF tidak bisa dibuka. File mungkin corrupt.",
        )

    # Cek apakah sudah terenkripsi
    if doc.is_encrypted:
        doc.close()
        raise HTTPException(
            status_code=409,
            detail="PDF sudah terenkripsi. Tidak bisa menambahkan proteksi ganda.",
        )

    # Simpan ke temp file dengan enkripsi
    output_path = None
    try:
        fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_enc_")
        os.close(fd)

        doc.save(
            output_path,
            encryption=encryption_flag,
            owner_pw=password,
            user_pw=password,
            permissions=perm,
        )
        doc.close()

        with open(output_path, "rb") as f:
            encrypted_bytes = f.read()

        logger.info(
            "PDF encrypted: method=%s input_size=%d output_size=%d",
            method, len(file_bytes), len(encrypted_bytes),
        )

        return encrypted_bytes

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Encryption failed: %s", str(exc))
        raise HTTPException(
            status_code=500,
            detail="Gagal mengenkripsi PDF. Silakan coba lagi.",
        )
    finally:
        if output_path and os.path.exists(output_path):
            try:
                os.remove(output_path)
            except OSError:
                pass


def decrypt_pdf(file_bytes: bytes, password: str) -> bytes:
    """
    Dekripsi PDF dengan password menggunakan PyMuPDF.

    Args:
        file_bytes: Raw encrypted PDF bytes.
        password: Password untuk dekripsi.

    Returns:
        Decrypted PDF bytes (tanpa proteksi).

    Raises:
        HTTPException(400): Jika PDF tidak terenkripsi.
        HTTPException(401): Jika password salah.
        HTTPException(500): Jika dekripsi gagal.
    """
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="File PDF tidak bisa dibuka. File mungkin corrupt.",
        )

    # Cek apakah terenkripsi
    if not doc.is_encrypted:
        doc.close()
        raise HTTPException(
            status_code=400,
            detail="PDF ini tidak terproteksi.",
        )

    # Coba authenticate dengan password
    auth_result = doc.authenticate(password)
    if auth_result == 0:
        doc.close()
        raise HTTPException(
            status_code=401,
            detail="Password salah.",
        )

    # Simpan tanpa enkripsi
    output_path = None
    try:
        fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_dec_")
        os.close(fd)

        doc.save(output_path, encryption=0)
        doc.close()

        with open(output_path, "rb") as f:
            decrypted_bytes = f.read()

        logger.info(
            "PDF decrypted: input_size=%d output_size=%d",
            len(file_bytes), len(decrypted_bytes),
        )

        return decrypted_bytes

    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Decryption failed: %s", str(exc))
        raise HTTPException(
            status_code=500,
            detail="Gagal mendekripsi PDF. Silakan coba lagi.",
        )
    finally:
        if output_path and os.path.exists(output_path):
            try:
                os.remove(output_path)
            except OSError:
                pass
```

2. **Verify service imports:**
```bash
cd backend
python -c "from services.encryption import encrypt_pdf, decrypt_pdf; print('OK')"
```

3. **Test encrypt/decrypt cycle:**
```bash
cd backend
python -c "
import fitz
doc = fitz.open()
page = doc.new_page()
page.insert_text((72, 72), 'Test PDF for encryption')
pdf_bytes = doc.tobytes()
doc.close()

from services.encryption import encrypt_pdf, decrypt_pdf
encrypted = encrypt_pdf(pdf_bytes, 'test1234', method='aes256')
print(f'Encrypted: {len(encrypted)} bytes')
decrypted = decrypt_pdf(encrypted, 'test1234')
print(f'Decrypted: {len(decrypted)} bytes')
print('Encrypt/decrypt cycle OK')
"
```

### ✅ Definition of Done
- [ ] File `backend/services/encryption.py` created
- [ ] `encrypt_pdf()` works dengan AES-128 dan AES-256
- [ ] `decrypt_pdf()` works dengan correct password
- [ ] Already-encrypted PDF raises 409 on encrypt attempt
- [ ] Wrong password raises 401 on decrypt attempt
- [ ] Non-encrypted PDF raises 400 on decrypt attempt
- [ ] Temp files cleaned up di finally block
- [ ] Structured logging untuk encrypt/decrypt operations
- [ ] Import works tanpa errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-002 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/protect-pdf`
- Commit message: `feat(fase2): add encryption service (encrypt + decrypt PDF)

- PyMuPDF AES-128/AES-256 encryption
- Decrypt with password authentication
- Shared between protect and unlock endpoints
- Permission flags: deny print + copy by default
- Temp file cleanup in finally blocks

Refs: PAPYR-091, PAPYR-100, PAPYR-102`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify encrypt/decrypt cycle works end-to-end
- Proceed to STEP-F2-003

---

## STEP-F2-003: Backend — Create POST /api/protect endpoint

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-090 detail, API Contract M12
- `docs/11_Papyr_API_Spec_v1.0.md` — API endpoint conventions
- `backend/routers/compress.py` — Reference pattern for router structure

### ✅ Prerequisites
- STEP-F2-001 complete (shared PDF validator exists)
- STEP-F2-002 complete (encryption service exists)
- R2 upload utility working (`backend/utils/r2.py`)

### 🎯 Objective
Buat endpoint POST /api/protect yang menerima file PDF + password, validasi input, enkripsi PDF menggunakan PyMuPDF AES-256, upload hasil ke R2, return signed download URL. Ikuti pattern yang sama dengan `backend/routers/compress.py`.

### 📋 Instructions

1. **Buat router file** di `backend/routers/protect.py`:

```python
"""
Router untuk proteksi PDF dengan password.

POST /api/protect — menerima file PDF + password, enkripsi dengan AES-256,
upload ke R2, dan return signed download URL.
"""

import logging
import time
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, File, Form, Request, UploadFile, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from utils.config import settings
from utils.logging_config import log_task_event
from utils.pdf_validator import validate_pdf_file
from services.encryption import encrypt_pdf
from utils.r2 import upload_file, generate_signed_url

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["protect"])


@router.post("/protect")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def protect_endpoint(
    request: Request,
    file: UploadFile = File(...),
    password: str = Form(...),
    encryption: str = Form("aes256"),
):
    """
    Proteksi file PDF dengan password.

    - **file**: File PDF (multipart/form-data, maks 20MB)
    - **password**: Password untuk proteksi (min 4 karakter)
    - **encryption**: Metode enkripsi — "aes128" atau "aes256" (default)

    Returns:
        success, download_url, expires_at, original_size, output_size
    """
    file_bytes = await file.read()
    start_time = time.time()
    input_size = len(file_bytes)

    try:
        # Validasi PDF (reject encrypted — sudah terproteksi)
        pdf_info = validate_pdf_file(file, file_bytes, reject_encrypted=True)

        # Validasi password
        if len(password) < 4:
            raise HTTPException(
                status_code=400,
                detail="Password minimal 4 karakter.",
            )
        if len(password) > 128:
            raise HTTPException(
                status_code=400,
                detail="Password terlalu panjang. Maksimal 128 karakter.",
            )

        # Validasi encryption method
        if encryption not in ("aes128", "aes256"):
            raise HTTPException(
                status_code=400,
                detail="Metode enkripsi tidak valid. Pilihan: aes128, aes256.",
            )

        # Enkripsi PDF
        encrypted_bytes = encrypt_pdf(file_bytes, password, method=encryption)

        # Upload ke R2
        r2_result = upload_file(
            file_bytes=encrypted_bytes,
            original_filename=f"protected_{file.filename or 'document.pdf'}",
            content_type="application/pdf",
        )

        # Generate signed URL (1 jam)
        dl_name = f"protected_{file.filename}" if file.filename else "protected.pdf"
        download_url = generate_signed_url(
            r2_result["key"], expiry_seconds=3600, download_filename=dl_name
        )

        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_completed",
            tool="protect",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
            encryption_type=encryption,
        )

        expires_at = (
            datetime.now(timezone.utc) + timedelta(seconds=3600)
        ).isoformat()

        return {
            "success": True,
            "download_url": download_url,
            "expires_at": expires_at,
            "original_size": pdf_info.size_bytes,
            "output_size": len(encrypted_bytes),
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="protect",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error="validation_error",
        )
        raise

    except Exception as exc:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="protect",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Gagal memproses file. Silakan coba lagi.",
        )
```

2. **Register router** di `backend/main.py` — tambah import dan include:

```python
from routers.protect import router as protect_router

# Di section routers:
app.include_router(protect_router)
```

3. **Verify endpoint responds:**
```bash
cd backend
uvicorn main:app --reload
# Di terminal lain:
curl -X POST http://localhost:8000/api/protect \
  -F "file=@test.pdf" \
  -F "password=test1234" \
  -F "encryption=aes256"
```

### ✅ Definition of Done
- [ ] File `backend/routers/protect.py` created
- [ ] Endpoint POST /api/protect registered di `main.py`
- [ ] Accepts: file (PDF), password (min 4 chars), encryption (aes128/aes256)
- [ ] Validates: MIME, extension, magic bytes, size, not-already-encrypted
- [ ] Returns: success, download_url, expires_at, original_size, output_size
- [ ] Error responses: 400 (validation), 413 (size), 429 (rate limit)
- [ ] Rate limited: 10 req/min per IP
- [ ] Logging: task_completed dan task_failed events
- [ ] Server starts tanpa errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-003 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/protect-pdf`
- Commit message: `feat(fase2): add POST /api/protect endpoint

- PDF password protection with AES-128/AES-256
- Full validation: MIME, extension, magic bytes, size, encrypted status
- R2 upload + signed URL (60min expiry)
- Rate limiting + structured logging

Refs: PAPYR-090, PAPYR-092`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test endpoint manually dengan real PDF
- Verify encrypted PDF requires password to open
- Proceed to STEP-F2-004

---

## STEP-F2-004: Backend — Unit tests for protect endpoint

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-093 detail
- `docs/06_Papyr_Test_Plan_v1.0.md` — Testing strategy
- `backend/routers/compress.py` — Reference for test structure

### ✅ Prerequisites
- STEP-F2-003 complete (protect endpoint exists)
- STEP-F2-002 complete (encryption service exists)
- Pytest configured di backend

### 🎯 Objective
Buat comprehensive unit tests untuk protect endpoint. Minimal 10 test cases: happy path (AES-128 dan AES-256), invalid MIME, file terlalu besar, password terlalu pendek (<4 char), password terlalu panjang (>128 chars), PDF sudah encrypted, empty PDF, corrupted PDF, invalid encryption method.

### 📋 Instructions

1. **Buat test file** di `backend/tests/test_protect.py`:

```python
"""
Unit tests for POST /api/protect endpoint.

Covers: happy path, validation errors, encryption edge cases.
Refs: PAPYR-093
"""

import io
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

import fitz  # PyMuPDF

from main import app

client = TestClient(app)


def _create_test_pdf(num_pages: int = 1, text: str = "Test content") -> bytes:
    """Create a minimal valid PDF for testing."""
    doc = fitz.open()
    for i in range(num_pages):
        page = doc.new_page()
        page.insert_text((72, 72), f"{text} - page {i + 1}")
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def _create_encrypted_pdf(password: str = "secret123") -> bytes:
    """Create an encrypted PDF for testing."""
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Encrypted content")
    import tempfile, os
    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    doc.save(path, encryption=fitz.PDF_ENCRYPT_AES_256, owner_pw=password, user_pw=password)
    doc.close()
    with open(path, "rb") as f:
        encrypted_bytes = f.read()
    os.remove(path)
    return encrypted_bytes


class TestProtectEndpoint:
    """Tests for POST /api/protect."""

    @patch("routers.protect.upload_file")
    @patch("routers.protect.generate_signed_url")
    def test_happy_path_aes256(self, mock_signed_url, mock_upload):
        """Valid PDF + valid password → encrypted PDF returned."""
        mock_upload.return_value = {"key": "test-key.pdf"}
        mock_signed_url.return_value = "https://r2.example.com/test-key.pdf"

        pdf_bytes = _create_test_pdf()
        response = client.post(
            "/api/protect",
            files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
            data={"password": "test1234", "encryption": "aes256"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "download_url" in data
        assert "expires_at" in data
        assert data["original_size"] > 0
        assert data["output_size"] > 0

    @patch("routers.protect.upload_file")
    @patch("routers.protect.generate_signed_url")
    def test_happy_path_aes128(self, mock_signed_url, mock_upload):
        """AES-128 encryption works."""
        mock_upload.return_value = {"key": "test-key.pdf"}
        mock_signed_url.return_value = "https://r2.example.com/test-key.pdf"

        pdf_bytes = _create_test_pdf()
        response = client.post(
            "/api/protect",
            files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
            data={"password": "test1234", "encryption": "aes128"},
        )
        assert response.status_code == 200

    def test_invalid_mime_type(self):
        """Non-PDF MIME type → 400."""
        response = client.post(
            "/api/protect",
            files={"file": ("test.txt", io.BytesIO(b"not a pdf"), "text/plain")},
            data={"password": "test1234"},
        )
        assert response.status_code == 400

    def test_password_too_short(self):
        """Password < 4 chars → 400."""
        pdf_bytes = _create_test_pdf()
        response = client.post(
            "/api/protect",
            files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
            data={"password": "ab", "encryption": "aes256"},
        )
        assert response.status_code == 400
        assert "minimal 4" in response.json()["detail"]

    def test_password_too_long(self):
        """Password > 128 chars → 400."""
        pdf_bytes = _create_test_pdf()
        response = client.post(
            "/api/protect",
            files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
            data={"password": "a" * 200, "encryption": "aes256"},
        )
        assert response.status_code == 400
        assert "terlalu panjang" in response.json()["detail"]

    def test_already_encrypted_pdf(self):
        """PDF already encrypted → rejected."""
        encrypted_bytes = _create_encrypted_pdf()
        response = client.post(
            "/api/protect",
            files={"file": ("enc.pdf", io.BytesIO(encrypted_bytes), "application/pdf")},
            data={"password": "newpass1234"},
        )
        assert response.status_code == 400

    def test_empty_pdf(self):
        """Empty file → 400."""
        response = client.post(
            "/api/protect",
            files={"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")},
            data={"password": "test1234"},
        )
        assert response.status_code == 400

    def test_corrupted_pdf(self):
        """Corrupted PDF → 400."""
        corrupted = b"%PDF-1.4 this is not valid pdf content"
        response = client.post(
            "/api/protect",
            files={"file": ("corrupt.pdf", io.BytesIO(corrupted), "application/pdf")},
            data={"password": "test1234"},
        )
        assert response.status_code == 400

    def test_invalid_encryption_method(self):
        """Invalid encryption method → 400."""
        pdf_bytes = _create_test_pdf()
        response = client.post(
            "/api/protect",
            files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
            data={"password": "test1234", "encryption": "invalid"},
        )
        assert response.status_code == 400

    def test_no_password_provided(self):
        """Missing password field → 422 (FastAPI validation)."""
        pdf_bytes = _create_test_pdf()
        response = client.post(
            "/api/protect",
            files={"file": ("test.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
        )
        assert response.status_code == 422
```

2. **Run tests:**
```bash
cd backend
pytest tests/test_protect.py -v
```

3. **Verify semua 10 tests pass.**

### ✅ Definition of Done
- [ ] Test file `backend/tests/test_protect.py` created
- [ ] 10+ test cases covering semua edge cases dari backlog
- [ ] Happy path tests mock R2 upload (no actual upload in tests)
- [ ] All tests pass: `pytest tests/test_protect.py` exits 0
- [ ] Test coverage untuk protect endpoint ≥ 90%

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-004 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/protect-pdf`
- Commit message: `test(fase2): add unit tests for protect endpoint

- 10 test cases: happy path, validation, edge cases
- Tests: AES-128/256, short/long password, encrypted PDF, empty, corrupt
- Mocked R2 upload for isolation

Refs: PAPYR-093`
- PR target: `develop`

### 🚀 Post-Step Actions
- Run full test suite: `pytest` (pastikan no regressions)
- Proceed to STEP-F2-005

---

## STEP-F2-005: Frontend — Create /protect page with full UI

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-094, PAPYR-096 detail
- `docs/19_Papyr_UIUX_Spec_v1.0.md` — UI/UX guidelines
- `frontend/src/app/compress/page.tsx` — Reference pattern for tool page
- `frontend/src/components/PDFUploader.tsx` — Reusable uploader component

### ✅ Prerequisites
- STEP-F2-003 complete (backend endpoint exists)
- PDFUploader component working
- Tailwind CSS v4 configured

### 🎯 Objective
Buat halaman /protect dengan UI lengkap: upload zone, input password + confirm password, quality selector (AES-128/AES-256), tombol "Proteksi PDF", area hasil download. Mobile-first responsive. Privacy notice. Ikuti pattern dari `frontend/src/app/compress/page.tsx`.

### 📋 Instructions

1. **Buat layout** di `frontend/src/app/protect/layout.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proteksi PDF dengan Password - Papyr",
  description:
    "Lindungi file PDF Anda dengan password AES-256. Gratis, cepat, tanpa login. File dihapus otomatis dalam 60 menit.",
  openGraph: {
    title: "Proteksi PDF dengan Password - Papyr",
    description:
      "Lindungi file PDF Anda dengan password AES-256. Gratis, cepat, tanpa login.",
    url: "https://mypapyr.com/protect",
    images: ["/og/protect.png"],
  },
};

export default function ProtectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

2. **Buat page component** di `frontend/src/app/protect/page.tsx`:

Ikuti pattern dari `compress/page.tsx` tapi dengan flow berbeda:
- State: idle (upload) → file-selected (show password form) → uploading → processing → done → error
- Upload zone: reuse pattern dari PDFUploader (drag-drop + click)
- Setelah file dipilih: tampilkan form password + encryption selector
- Submit: XHR upload dengan progress tracking
- Done: download button + "Proteksi file lain" reset

Key differences dari compress page:
- Tidak langsung upload setelah file dipilih (perlu password dulu)
- Ada PasswordInput component (dibuat di step berikutnya)
- Ada encryption selector (AES-128 / AES-256)
- Submit button disabled sampai password valid

3. **Update `frontend/src/lib/analytics.ts`** — tambah tool names baru:

```typescript
export type ToolName =
  | "compress"
  | "merge"
  | "split"
  | "image-to-pdf"
  | "pdf-to-image"
  | "rotate"
  | "protect"
  | "unlock"
  | "watermark"
  | "sign"
  | "pdf-to-word"
  | "ocr"
  | "pdf-to-excel";
```

4. **Tambah /protect ke sitemap** di `frontend/src/app/sitemap.ts`:
```typescript
{
  url: "https://mypapyr.com/protect",
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: 0.8,
},
```

5. **Verify page renders** di `http://localhost:3000/protect`.

### ✅ Definition of Done
- [ ] Page `/protect` renders correctly
- [ ] Upload zone accepts PDF files (drag-and-drop + click)
- [ ] Password input dengan confirmation, min 4 chars validation
- [ ] Encryption selector (AES-128 / AES-256)
- [ ] Submit button disabled sampai password valid
- [ ] Progress indicator during upload
- [ ] Processing shimmer during encryption
- [ ] Download button after success
- [ ] Error state dengan retry button
- [ ] Mobile-first responsive layout
- [ ] Privacy notice visible
- [ ] Analytics events tracked (started/completed/failed)
- [ ] `layout.tsx` dengan proper metadata
- [ ] `/protect` added to sitemap
- [ ] ToolName type updated di analytics.ts

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-005 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/protect-pdf`
- Commit message: `feat(fase2): add /protect page with password protection UI

- Upload zone, password form, encryption selector
- Progress indicator + processing shimmer
- Download area after success
- Mobile-first responsive, privacy notice
- Analytics events + SEO metadata + sitemap entry

Refs: PAPYR-094, PAPYR-096, PAPYR-097`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test full flow: upload PDF → set password → protect → download
- Proceed to STEP-F2-006

---

## STEP-F2-006: Frontend — Create PasswordInput shared component

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-095 detail
- `frontend/src/components/PDFUploader.tsx` — Reference for component structure

### ✅ Prerequisites
- STEP-F2-005 complete (protect page exists, imports PasswordInput)

### 🎯 Objective
Buat shared PasswordInput component yang digunakan di /protect dan /unlock. Fitur: 2 input fields (password + konfirmasi), show/hide toggle, validasi real-time (min 4 char, match confirmation), strength indicator (weak/medium/strong).

### 📋 Instructions

1. **Buat component** di `frontend/src/components/PasswordInput.tsx`:

Component harus include:
- Props: `password`, `confirmPassword`, `onPasswordChange`, `onConfirmChange`, `showConfirm` (boolean, default true), `minLength` (default 4)
- Password field dengan show/hide toggle (eye icon)
- Strength indicator bar: weak (merah, 1/3), medium (kuning, 2/3), strong (hijau, full)
- Strength logic: length >= 8 (+1), has uppercase (+1), has number (+1), has special char (+1). Score 0-1 = weak, 2 = medium, 3-4 = strong
- Confirm password field (conditional via `showConfirm` prop)
- Error messages: "Minimal 4 karakter", "Password tidak cocok"
- Accessible: aria-labels pada toggle buttons

2. **Verify component renders** di /protect page.

### ✅ Definition of Done
- [ ] File `frontend/src/components/PasswordInput.tsx` created
- [ ] Two input fields: password + confirmation
- [ ] Show/hide toggle untuk kedua fields
- [ ] Real-time validation: min 4 chars, match confirmation
- [ ] Strength indicator: weak (red), medium (amber), strong (green)
- [ ] Error messages dalam Bahasa Indonesia
- [ ] Reusable: `showConfirm` prop untuk hide confirmation (untuk /unlock)
- [ ] Accessible: aria-labels on toggle buttons
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-006 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/protect-pdf`
- Commit message: `feat(fase2): add PasswordInput shared component

- Password + confirmation fields with show/hide toggle
- Real-time strength indicator (weak/medium/strong)
- Validation: min length, match confirmation
- Reusable for /protect and /unlock pages

Refs: PAPYR-095`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify component works di /protect page
- Proceed to STEP-F2-007

---

## STEP-F2-007: Frontend — Unit tests for /protect page and PasswordInput

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-098B detail
- `docs/06_Papyr_Test_Plan_v1.0.md` — Testing strategy

### ✅ Prerequisites
- STEP-F2-005 complete (protect page exists)
- STEP-F2-006 complete (PasswordInput component exists)
- Vitest configured di frontend

### 🎯 Objective
Buat unit tests untuk PasswordInput component dan protect page flow. Minimal 8 test cases: password validation (min 4 char, match confirmation), strength indicator levels, toggle visibility, upload flow states, error states, analytics events.

### 📋 Instructions

1. **Buat test file** di `frontend/src/__tests__/protect.test.tsx`:

Test cases yang harus di-cover:
- PasswordInput renders password dan confirm fields
- Error saat password terlalu pendek (< 4 chars)
- Error saat password tidak cocok
- Strength indicator: weak, medium, strong
- Toggle password visibility
- Hide confirm field saat `showConfirm=false`
- Analytics mock verification
- File validation (non-PDF rejected)

2. **Run tests:**
```bash
cd frontend
npx vitest run src/__tests__/protect.test.tsx
```

### ✅ Definition of Done
- [ ] Test file created
- [ ] 8+ test cases covering PasswordInput + protect page
- [ ] All tests pass
- [ ] No flaky tests

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-007 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/protect-pdf`
- Commit message: `test(fase2): add frontend unit tests for /protect

- 8 test cases for PasswordInput component
- Tests: validation, strength indicator, visibility toggle
- Mocked analytics module

Refs: PAPYR-098B`
- PR target: `develop`

### 🚀 Post-Step Actions
- Run full frontend test suite: `npx vitest run`
- Proceed to STEP-F2-008

---

## STEP-F2-008: Testing — Manual E2E test protect flow

**Phase:** Fase 2A — Security Tools
**Executor:** Founder + AI Agent
**Type:** Testing
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-098 detail

### ✅ Prerequisites
- STEP-F2-005 complete (frontend page)
- STEP-F2-003 complete (backend endpoint)
- Both frontend dan backend running locally

### 🎯 Objective
Manual end-to-end testing: upload PDF biasa → protect → download → buka dengan Adobe/browser (harus minta password). Test PDF scan, PDF dengan gambar, PDF besar (15MB). Verify file tidak bisa dibuka tanpa password.

### 📋 Instructions

1. **Start both services:**
```bash
# Terminal 1 — Backend
cd backend && uvicorn main:app --reload

# Terminal 2 — Frontend
cd frontend && npm run dev
```

2. **Test cases:**

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | Upload normal PDF (1-5 pages) + password "test1234" | Download protected PDF, requires password |
| 2 | Upload PDF with images + password | Protected, images intact |
| 3 | Upload scanned PDF + password | Protected correctly |
| 4 | Upload large PDF (~15MB) + password | Completes within 30s |
| 5 | Open protected PDF without password | Browser prompts for password |
| 6 | Enter correct password | PDF opens normally |
| 7 | Enter wrong password | PDF refuses to open |
| 8 | Test AES-128 option | Works same as AES-256 |

3. **Document results** — note any issues found.

### ✅ Definition of Done
- [ ] All 8 manual test cases pass
- [ ] Protected PDF requires password di Adobe Reader / Chrome PDF viewer
- [ ] Large file (15MB) processes tanpa timeout
- [ ] AES-128 dan AES-256 both produce valid encrypted PDFs
- [ ] No UI glitches pada mobile viewport

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-008 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/protect-pdf`
- Commit message: `test(fase2): manual E2E verification for protect PDF

- All 8 test cases pass
- Verified: password required, AES-128/256, large files

Refs: PAPYR-098`
- PR target: `develop`

### 🚀 Post-Step Actions
- M12 (Protect PDF) feature-complete
- Proceed to STEP-F2-009 (start M13: Unlock PDF)

---

## STEP-F2-009: Backend — Create POST /api/unlock endpoint

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-099, PAPYR-100, PAPYR-101 detail
- `backend/routers/protect.py` — Reference (same pattern)
- `backend/services/encryption.py` — decrypt_pdf function (already created)

### ✅ Prerequisites
- STEP-F2-002 complete (encryption service with decrypt_pdf exists)
- STEP-F2-001 complete (shared PDF validator exists)
- M12 (Protect PDF) feature-complete

### 🎯 Objective
Buat endpoint POST /api/unlock yang menerima file PDF terenkripsi + password, validasi bahwa PDF memang terenkripsi, dekripsi menggunakan PyMuPDF, upload hasil ke R2, return signed URL. Reuse `decrypt_pdf` dari `services/encryption.py`.

### 📋 Instructions

1. **Buat router file** di `backend/routers/unlock.py`:

```python
"""
Router untuk membuka proteksi PDF (unlock/decrypt).

POST /api/unlock — menerima file PDF terenkripsi + password,
dekripsi dengan PyMuPDF, upload ke R2, return signed download URL.
"""

import logging
import time
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, File, Form, Request, UploadFile, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from utils.config import settings
from utils.logging_config import log_task_event
from utils.pdf_validator import validate_pdf_file
from services.encryption import decrypt_pdf
from utils.r2 import upload_file, generate_signed_url

limiter = Limiter(key_func=get_remote_address)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["unlock"])


@router.post("/unlock")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def unlock_endpoint(
    request: Request,
    file: UploadFile = File(...),
    password: str = Form(...),
):
    """
    Hapus proteksi password dari file PDF.

    - **file**: File PDF terenkripsi (multipart/form-data, maks 20MB)
    - **password**: Password untuk membuka proteksi

    Returns:
        success, download_url, expires_at, original_size, output_size
    """
    file_bytes = await file.read()
    start_time = time.time()
    input_size = len(file_bytes)

    try:
        # Validasi PDF (require encrypted — harus terproteksi)
        pdf_info = validate_pdf_file(file, file_bytes, require_encrypted=True)

        # Dekripsi PDF (handles wrong password → 401)
        decrypted_bytes = decrypt_pdf(file_bytes, password)

        # Upload ke R2
        r2_result = upload_file(
            file_bytes=decrypted_bytes,
            original_filename=f"unlocked_{file.filename or 'document.pdf'}",
            content_type="application/pdf",
        )

        # Generate signed URL (1 jam)
        dl_name = f"unlocked_{file.filename}" if file.filename else "unlocked.pdf"
        download_url = generate_signed_url(
            r2_result["key"], expiry_seconds=3600, download_filename=dl_name
        )

        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_completed",
            tool="unlock",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=True,
        )

        expires_at = (
            datetime.now(timezone.utc) + timedelta(seconds=3600)
        ).isoformat()

        return {
            "success": True,
            "download_url": download_url,
            "expires_at": expires_at,
            "original_size": pdf_info.size_bytes,
            "output_size": len(decrypted_bytes),
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="unlock",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error="validation_error",
        )
        raise

    except Exception as exc:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger,
            event="task_failed",
            tool="unlock",
            duration_ms=duration_ms,
            input_size_bytes=input_size,
            success=False,
            error=type(exc).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Gagal memproses file. Silakan coba lagi.",
        )
```

2. **Register router** di `backend/main.py`:
```python
from routers.unlock import router as unlock_router
app.include_router(unlock_router)
```

3. **Verify endpoint:**
```bash
# Protect a PDF first, then unlock it
curl -X POST http://localhost:8000/api/unlock \
  -F "file=@protected_test.pdf" \
  -F "password=test1234"
```

### ✅ Definition of Done
- [ ] File `backend/routers/unlock.py` created
- [ ] Endpoint POST /api/unlock registered di `main.py`
- [ ] Accepts: file (encrypted PDF), password
- [ ] Validates: PDF must be encrypted (require_encrypted=True)
- [ ] Returns: success, download_url, expires_at, original_size, output_size
- [ ] Error responses: 400 (not encrypted), 401 (wrong password), 413 (size), 429 (rate limit)
- [ ] Rate limited + structured logging
- [ ] Server starts tanpa errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-009 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/unlock-pdf`
- Commit message: `feat(fase2): add POST /api/unlock endpoint

- PDF password removal with PyMuPDF decryption
- Validates PDF is encrypted before attempting unlock
- Wrong password returns 401
- R2 upload + signed URL (60min expiry)

Refs: PAPYR-099, PAPYR-100, PAPYR-101`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test: protect PDF → unlock with correct password → verify opens without password
- Test: unlock with wrong password → verify 401 error
- Proceed to STEP-F2-010

---

## STEP-F2-010: Backend — Unit tests for unlock endpoint

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-103 detail

### ✅ Prerequisites
- STEP-F2-009 complete (unlock endpoint exists)

### 🎯 Objective
Buat unit tests untuk unlock endpoint. Minimal 9 test cases: happy path (encrypted PDF + correct password), wrong password (401), non-encrypted PDF (400), invalid file, corrupted PDF, empty PDF, oversized file, missing password field.

### 📋 Instructions

1. **Buat test file** di `backend/tests/test_unlock.py`:

```python
"""
Unit tests for POST /api/unlock endpoint.
Refs: PAPYR-103
"""

import io
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient

import fitz

from main import app

client = TestClient(app)


def _create_test_pdf() -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Test content")
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def _create_encrypted_pdf(password: str = "correct123") -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "Secret content")
    import tempfile, os
    fd, path = tempfile.mkstemp(suffix=".pdf")
    os.close(fd)
    doc.save(path, encryption=fitz.PDF_ENCRYPT_AES_256, owner_pw=password, user_pw=password)
    doc.close()
    with open(path, "rb") as f:
        data = f.read()
    os.remove(path)
    return data


class TestUnlockEndpoint:

    @patch("routers.unlock.upload_file")
    @patch("routers.unlock.generate_signed_url")
    def test_happy_path(self, mock_url, mock_upload):
        """Encrypted PDF + correct password → decrypted PDF."""
        mock_upload.return_value = {"key": "unlocked.pdf"}
        mock_url.return_value = "https://r2.example.com/unlocked.pdf"

        encrypted = _create_encrypted_pdf("mypass123")
        response = client.post(
            "/api/unlock",
            files={"file": ("enc.pdf", io.BytesIO(encrypted), "application/pdf")},
            data={"password": "mypass123"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "download_url" in data

    def test_wrong_password(self):
        """Wrong password → 401."""
        encrypted = _create_encrypted_pdf("correct123")
        response = client.post(
            "/api/unlock",
            files={"file": ("enc.pdf", io.BytesIO(encrypted), "application/pdf")},
            data={"password": "wrongpass"},
        )
        assert response.status_code == 401
        assert "salah" in response.json()["detail"].lower()

    def test_non_encrypted_pdf(self):
        """Non-encrypted PDF → 400."""
        normal_pdf = _create_test_pdf()
        response = client.post(
            "/api/unlock",
            files={"file": ("normal.pdf", io.BytesIO(normal_pdf), "application/pdf")},
            data={"password": "anypass"},
        )
        assert response.status_code == 400
        assert "tidak terproteksi" in response.json()["detail"]

    def test_invalid_mime_type(self):
        """Non-PDF file → 400."""
        response = client.post(
            "/api/unlock",
            files={"file": ("test.txt", io.BytesIO(b"text"), "text/plain")},
            data={"password": "test1234"},
        )
        assert response.status_code == 400

    def test_empty_file(self):
        """Empty file → 400."""
        response = client.post(
            "/api/unlock",
            files={"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")},
            data={"password": "test1234"},
        )
        assert response.status_code == 400

    def test_corrupted_pdf(self):
        """Corrupted PDF → 400."""
        response = client.post(
            "/api/unlock",
            files={"file": ("bad.pdf", io.BytesIO(b"%PDF-corrupt"), "application/pdf")},
            data={"password": "test1234"},
        )
        assert response.status_code == 400

    def test_missing_password(self):
        """No password field → 422."""
        encrypted = _create_encrypted_pdf()
        response = client.post(
            "/api/unlock",
            files={"file": ("enc.pdf", io.BytesIO(encrypted), "application/pdf")},
        )
        assert response.status_code == 422

    def test_invalid_extension(self):
        """Wrong extension → 400."""
        encrypted = _create_encrypted_pdf()
        response = client.post(
            "/api/unlock",
            files={"file": ("enc.docx", io.BytesIO(encrypted), "application/pdf")},
            data={"password": "correct123"},
        )
        assert response.status_code == 400

    def test_invalid_magic_bytes(self):
        """Invalid magic bytes → 400."""
        response = client.post(
            "/api/unlock",
            files={"file": ("fake.pdf", io.BytesIO(b"NOTPDF1234"), "application/pdf")},
            data={"password": "test1234"},
        )
        assert response.status_code == 400
```

2. **Run tests:**
```bash
cd backend
pytest tests/test_unlock.py -v
```

### ✅ Definition of Done
- [ ] Test file `backend/tests/test_unlock.py` created
- [ ] 9+ test cases covering semua edge cases
- [ ] All tests pass
- [ ] Coverage ≥ 90% untuk unlock endpoint

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-010 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/unlock-pdf`
- Commit message: `test(fase2): add unit tests for unlock endpoint

- 9 test cases: happy path, wrong password, not encrypted, invalid files
- Mocked R2 upload for isolation

Refs: PAPYR-103`
- PR target: `develop`

### 🚀 Post-Step Actions
- Run full backend test suite: `pytest`
- Proceed to STEP-F2-011

---

## STEP-F2-011: Frontend — Create /unlock page with full UI

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-104, PAPYR-105 detail
- `frontend/src/app/protect/page.tsx` — Reference (similar flow)

### ✅ Prerequisites
- STEP-F2-009 complete (backend endpoint exists)
- STEP-F2-006 complete (PasswordInput component exists)

### 🎯 Objective
Buat halaman /unlock dengan UI: upload zone, single password input (tanpa confirm, gunakan `showConfirm=false`), tombol "Hapus Password", area hasil download. Tampilkan status "PDF terenkripsi terdeteksi" setelah upload. Handle error khusus: "Password salah" (401), "PDF tidak terproteksi" (400).

### 📋 Instructions

1. **Buat layout** di `frontend/src/app/unlock/layout.tsx`:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hapus Password PDF - Papyr",
  description:
    "Buka kunci PDF yang terproteksi password. Masukkan password, download PDF tanpa proteksi. Gratis dan privasi terjaga.",
  openGraph: {
    title: "Hapus Password PDF - Papyr",
    description: "Buka kunci PDF yang terproteksi password. Gratis dan privasi terjaga.",
    url: "https://mypapyr.com/unlock",
    images: ["/og/unlock.png"],
  },
};

export default function UnlockLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

2. **Buat page** di `frontend/src/app/unlock/page.tsx`:

Flow mirip /protect tapi:
- Setelah upload, tampilkan badge "PDF terenkripsi terdeteksi ✓" (client-side check optional)
- Single password input (PasswordInput dengan `showConfirm={false}`)
- Tombol "Hapus Password"
- Error handling khusus: 401 → "Password salah, coba lagi", 400 → "PDF ini tidak terproteksi"
- Auto-retry 1x untuk network error (bukan auth error)

3. **Tambah /unlock ke sitemap.ts** dengan priority 0.8.

### ✅ Definition of Done
- [ ] Page `/unlock` renders correctly
- [ ] Upload zone accepts PDF files
- [ ] Single password input (no confirmation)
- [ ] "PDF terenkripsi terdeteksi" indicator after upload
- [ ] Error handling: wrong password (401), not encrypted (400)
- [ ] Download button after success
- [ ] Mobile-first responsive
- [ ] Privacy notice visible
- [ ] Analytics events tracked
- [ ] SEO metadata + sitemap entry

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-011 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/unlock-pdf`
- Commit message: `feat(fase2): add /unlock page with password removal UI

- Upload zone, single password input
- Encrypted PDF detection indicator
- Error handling: wrong password, not encrypted
- Mobile-first, privacy notice, analytics

Refs: PAPYR-104, PAPYR-105, PAPYR-106`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test full flow: upload encrypted PDF → enter password → unlock → download
- Proceed to STEP-F2-012

---

## STEP-F2-012: Frontend — Unit tests for /unlock page

**Phase:** Fase 2A — Security Tools
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-106B detail

### ✅ Prerequisites
- STEP-F2-011 complete (unlock page exists)

### 🎯 Objective
Buat unit tests untuk /unlock page. Minimal 7 test cases: encrypted detection UI, password input (single, no confirm), error states (wrong password, not encrypted), analytics events, file validation.

### 📋 Instructions

1. **Buat test file** di `frontend/src/__tests__/unlock.test.tsx`

Test cases:
- Page renders with upload zone
- PasswordInput renders without confirm field (showConfirm=false)
- Error message for wrong password (401 response)
- Error message for non-encrypted PDF (400 response)
- Analytics mock: task_started called on submit
- Analytics mock: task_failed called on error
- File validation: non-PDF rejected client-side

2. **Run tests:**
```bash
cd frontend
npx vitest run src/__tests__/unlock.test.tsx
```

### ✅ Definition of Done
- [ ] Test file created
- [ ] 7+ test cases
- [ ] All tests pass

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-012 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/unlock-pdf`
- Commit message: `test(fase2): add frontend unit tests for /unlock

- 7 test cases for unlock page
- Tests: password input, error states, analytics

Refs: PAPYR-106B`
- PR target: `develop`

### 🚀 Post-Step Actions
- Run full frontend test suite
- Proceed to STEP-F2-013

---

## STEP-F2-013: Testing — Manual E2E test unlock flow + Fase 2A complete

**Phase:** Fase 2A — Security Tools
**Executor:** Founder + AI Agent
**Type:** Testing
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — M13 Acceptance Criteria

### ✅ Prerequisites
- STEP-F2-011 complete (unlock page)
- STEP-F2-009 complete (unlock endpoint)

### 🎯 Objective
Manual E2E testing untuk unlock flow. Verify: encrypted PDF + correct password → download unlocked PDF. Wrong password → clear error. Non-encrypted PDF → informative message. Setelah ini, Fase 2A (M12 + M13) dianggap complete.

### 📋 Instructions

1. **Test cases:**

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | Upload encrypted PDF + correct password | Download unlocked PDF (opens without password) |
| 2 | Upload encrypted PDF + wrong password | Error: "Password salah" |
| 3 | Upload non-encrypted PDF | Error: "PDF ini tidak terproteksi" |
| 4 | Full cycle: protect → unlock → verify | PDF opens without password after unlock |
| 5 | Test on mobile viewport | UI responsive, no glitches |

2. **Verify Fase 2A acceptance criteria:**
- [ ] User bisa upload PDF dan set password (min 4 karakter)
- [ ] Output PDF terenkripsi AES-256
- [ ] PDF yang sudah terenkripsi ditolak dengan pesan jelas
- [ ] User bisa upload encrypted PDF + password → download tanpa proteksi
- [ ] Password salah menghasilkan error 401 yang jelas
- [ ] Shared encryption logic di-refactor (DRY)
- [ ] Analytics events ter-track
- [ ] 10+ backend tests (protect) + 9+ backend tests (unlock) pass
- [ ] 8+ frontend tests (protect) + 7+ frontend tests (unlock) pass

### ✅ Definition of Done
- [ ] All manual test cases pass
- [ ] Full protect → unlock cycle works
- [ ] All acceptance criteria M12 + M13 met
- [ ] All unit tests pass (backend + frontend)
- [ ] Fase 2A complete

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-013 complete
- Update `stepprompts/progress.md` — mark Fase 2A as complete

### 🔀 Git Instructions
- Branch: `feature/fase2/unlock-pdf`
- Commit message: `test(fase2): Fase 2A complete — protect + unlock verified

- Manual E2E: protect → unlock cycle works
- All acceptance criteria M12 + M13 met

Refs: M12, M13 complete`
- PR target: `develop`

### 🚀 Post-Step Actions
- Merge protect-pdf dan unlock-pdf branches ke develop
- Tag checkpoint: "Fase 2A complete"
- Proceed to STEP-F2-014 (start Fase 2B: Watermark PDF)

---

## Fase 2B — Document Enhancement (M14: Watermark PDF + M15: Sign PDF)

---

## STEP-F2-014: Frontend — Create /watermark page with tab UI (text/image)

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-107, PAPYR-108, PAPYR-109 detail
- `docs/19_Papyr_UIUX_Spec_v1.0.md` — UI/UX guidelines
- `frontend/src/app/protect/page.tsx` — Reference for tool page pattern

### ✅ Prerequisites
- Fase 2A complete
- pdf-lib installed di frontend (`npm install pdf-lib`)

### 🎯 Objective
Buat halaman /watermark dengan UI lengkap: upload zone, tab selector (Text/Image watermark), konfigurasi panel per mode, preview area, tombol "Terapkan Watermark". Text watermark 100% client-side (pdf-lib), image watermark server-side.

### 📋 Instructions

1. **Buat layout** di `frontend/src/app/watermark/layout.tsx`:
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Watermark PDF - Papyr",
  description:
    "Tambahkan watermark teks atau gambar ke semua halaman PDF. Preview sebelum apply. Gratis, tanpa login.",
  openGraph: {
    title: "Tambah Watermark PDF - Papyr",
    description: "Tambahkan watermark teks atau gambar ke semua halaman PDF. Gratis.",
    url: "https://mypapyr.com/watermark",
    images: ["/og/watermark.png"],
  },
};

export default function WatermarkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

2. **Buat page** di `frontend/src/app/watermark/page.tsx`:

Page flow:
- Upload PDF → show tab selector (Text / Image)
- Text tab: config panel (text, font size, opacity, rotation, color, position)
- Image tab: upload watermark image + config (opacity, position, scale)
- Preview area: render first page with watermark overlay
- "Terapkan Watermark" button
- Text mode: process client-side with pdf-lib → direct download
- Image mode: upload to /api/watermark → download from R2

3. **Buat WatermarkConfig component** di `frontend/src/components/WatermarkConfig.tsx`:

Text mode config interface (dari backlog):
```typescript
interface WatermarkTextConfig {
  text: string;           // max 50 chars
  fontSize: number;       // 12-72 (slider)
  opacity: number;        // 0.1-1.0 (slider)
  rotation: number;       // -45 to 45 degrees (slider)
  color: string;          // hex color e.g. "#CCCCCC"
  position: "center" | "diagonal" | "top" | "bottom";
}

interface WatermarkImageConfig {
  opacity: number;        // 0.1-1.0
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  scale: number;          // 0.1-1.0
}
```

Config panel elements:
- Text input (max 50 chars)
- Font size slider (12-72pt)
- Opacity slider (10-100%)
- Rotation slider (-45° to 45°)
- Color picker (default #CCCCCC)
- Position selector (center/diagonal/top/bottom for text, 9-grid for image)
- Scale slider for image mode (10-100%)

4. **Tambah /watermark ke sitemap.ts** dengan priority 0.8.

### ✅ Definition of Done
- [ ] Page `/watermark` renders correctly
- [ ] Tab selector: Text / Image mode
- [ ] Text config panel: text, font size, opacity, rotation, color, position
- [ ] Image config panel: upload image, opacity, position, scale
- [ ] Upload zone for PDF
- [ ] Upload zone for watermark image (PNG/JPG, max 2MB)
- [ ] Mobile-first responsive
- [ ] Privacy notice visible
- [ ] SEO metadata + sitemap entry

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-014 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/watermark-pdf`
- Commit message: `feat(fase2): add /watermark page with text/image tab UI

- Tab selector for text and image watermark modes
- WatermarkConfig component with sliders and pickers
- Upload zones for PDF and watermark image
- SEO metadata + sitemap entry

Refs: PAPYR-107, PAPYR-108, PAPYR-109`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify page renders with both tabs
- Proceed to STEP-F2-015

---

## STEP-F2-015: Frontend — Watermark preview on first PDF page

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-110 detail

### ✅ Prerequisites
- STEP-F2-014 complete (watermark page with config panel)
- pdf-lib installed

### 🎯 Objective
Render halaman pertama PDF ke canvas dan overlay watermark config di atas preview. Update real-time saat user ubah setting. Ini preview saja, bukan processing final.

### 📋 Instructions

1. **Implement preview rendering:**
- Load PDF first page menggunakan pdf-lib
- Render ke HTML canvas element
- Overlay watermark text/image sesuai current config
- Update preview setiap kali config berubah (debounce 200ms)
- Show placeholder jika belum ada PDF uploaded

2. **Canvas rendering approach:**
```typescript
// Pseudocode for preview
async function renderPreview(pdfBytes: Uint8Array, config: WatermarkTextConfig) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();

  // Draw watermark text on canvas overlay (not on PDF)
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render PDF page as background
  // ... (use pdf.js or similar for rendering)

  // Draw watermark overlay
  ctx.globalAlpha = config.opacity;
  ctx.font = `${config.fontSize}px Helvetica`;
  ctx.fillStyle = config.color;
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((config.rotation * Math.PI) / 180);
  ctx.fillText(config.text, 0, 0);
  ctx.restore();
}
```

### ✅ Definition of Done
- [ ] First page of PDF renders in preview area
- [ ] Watermark overlay updates real-time with config changes
- [ ] Text watermark: correct font size, opacity, rotation, color, position
- [ ] Image watermark: correct opacity, position, scale
- [ ] Debounced updates (not laggy)
- [ ] Placeholder shown when no PDF uploaded

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-015 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/watermark-pdf`
- Commit message: `feat(fase2): add real-time watermark preview on PDF first page

- Canvas-based preview rendering
- Real-time update on config change (debounced)
- Text and image watermark overlay

Refs: PAPYR-110`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify preview updates smoothly
- Proceed to STEP-F2-016

---

## STEP-F2-016: Frontend — Text watermark processing client-side (pdf-lib)

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-111 detail

### ✅ Prerequisites
- STEP-F2-014 complete (watermark page exists)
- pdf-lib installed

### 🎯 Objective
Implementasi text watermark processing 100% client-side menggunakan pdf-lib. Iterate semua halaman, `page.drawText()` dengan opacity, rotation, dan posisi sesuai config. Font: Helvetica (built-in pdf-lib). Output: download langsung dari browser tanpa upload ke server.

### 📋 Instructions

1. **Implement client-side text watermark:**

```typescript
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

async function applyTextWatermark(
  pdfBytes: Uint8Array,
  config: WatermarkTextConfig
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  // Parse hex color to RGB
  const r = parseInt(config.color.slice(1, 3), 16) / 255;
  const g = parseInt(config.color.slice(3, 5), 16) / 255;
  const b = parseInt(config.color.slice(5, 7), 16) / 255;

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Calculate position based on config.position
    let x: number, y: number;
    switch (config.position) {
      case "center":
        x = width / 2;
        y = height / 2;
        break;
      case "diagonal":
        x = width / 2;
        y = height / 2;
        break;
      case "top":
        x = width / 2;
        y = height - 50;
        break;
      case "bottom":
        x = width / 2;
        y = 50;
        break;
    }

    page.drawText(config.text, {
      x,
      y,
      size: config.fontSize,
      font: helveticaFont,
      color: rgb(r, g, b),
      opacity: config.opacity,
      rotate: degrees(config.rotation),
    });
  }

  return await pdfDoc.save();
}
```

2. **Trigger download from browser:**
```typescript
function downloadBlob(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

3. **Wire up to "Terapkan Watermark" button** — when text mode is active, process client-side and trigger download.

4. **Track analytics:** task_started (saat click apply), task_completed (saat download triggered).

### ✅ Definition of Done
- [ ] Text watermark applied to ALL pages of PDF
- [ ] 100% client-side processing (zero upload)
- [ ] Config respected: text, fontSize, opacity, rotation, color, position
- [ ] Font: Helvetica (built-in pdf-lib)
- [ ] Output downloads directly from browser
- [ ] Analytics events tracked
- [ ] Works on mobile

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-016 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/watermark-pdf`
- Commit message: `feat(fase2): implement client-side text watermark with pdf-lib

- Zero upload, 100% browser processing
- Applies to all pages with configurable text, size, opacity, rotation, color
- Direct download from browser

Refs: PAPYR-111`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test: upload PDF → configure text watermark → apply → verify all pages have watermark
- Proceed to STEP-F2-017

---

## STEP-F2-017: Backend — Create POST /api/watermark for image watermark

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-112 detail, API Contract M14
- `backend/routers/compress.py` — Reference pattern

### ✅ Prerequisites
- STEP-F2-001 complete (shared PDF validator)
- PyMuPDF installed

### 🎯 Objective
Buat endpoint POST /api/watermark untuk image watermark. Terima: PDF file + watermark image + config JSON (opacity, position, scale). Gunakan PyMuPDF `page.insert_image()` pada setiap halaman. Upload ke R2, return signed URL.

### 📋 Instructions

1. **Buat router** di `backend/routers/watermark.py`:

```python
"""
Router untuk image watermark pada PDF.

POST /api/watermark — menerima PDF + watermark image + config,
overlay image pada setiap halaman, upload ke R2, return signed URL.

Note: Text watermark diproses 100% client-side (pdf-lib).
Endpoint ini hanya untuk IMAGE watermark.
"""

import json
import logging
import os
import tempfile
import time
from datetime import datetime, timezone, timedelta

import fitz  # PyMuPDF
from fastapi import APIRouter, File, Form, Request, UploadFile, HTTPException
from slowapi import Limiter
from slowapi.util import get_remote_address

from utils.config import settings
from utils.logging_config import log_task_event
from utils.pdf_validator import validate_pdf_file
from utils.r2 import upload_file, generate_signed_url

limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["watermark"])

ALLOWED_IMAGE_MIMES = {"image/png", "image/jpeg"}
MAX_IMAGE_SIZE = 2 * 1024 * 1024  # 2MB


@router.post("/watermark")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def watermark_endpoint(
    request: Request,
    file: UploadFile = File(...),
    watermark_image: UploadFile = File(...),
    config: str = Form('{"opacity": 0.3, "position": "center", "scale": 0.5}'),
):
    """
    Tambah image watermark ke semua halaman PDF.

    - **file**: File PDF (maks 20MB)
    - **watermark_image**: File gambar watermark (PNG/JPG, maks 2MB)
    - **config**: JSON string {"opacity": 0.3, "position": "center", "scale": 0.5}
    """
    pdf_bytes = await file.read()
    img_bytes = await watermark_image.read()
    start_time = time.time()
    input_size = len(pdf_bytes)

    try:
        # Validasi PDF
        pdf_info = validate_pdf_file(file, pdf_bytes, reject_encrypted=True)

        # Validasi watermark image
        if watermark_image.content_type not in ALLOWED_IMAGE_MIMES:
            raise HTTPException(
                status_code=400,
                detail="Format watermark tidak valid. Hanya PNG dan JPG.",
            )
        if len(img_bytes) == 0:
            raise HTTPException(status_code=400, detail="File watermark kosong.")
        if len(img_bytes) > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=400,
                detail="File watermark terlalu besar. Maksimal 2MB.",
            )

        # Parse config
        try:
            cfg = json.loads(config)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Config JSON tidak valid.")

        opacity = float(cfg.get("opacity", 0.3))
        position = cfg.get("position", "center")
        scale = float(cfg.get("scale", 0.5))

        # Validate config ranges
        if not (0.1 <= opacity <= 1.0):
            raise HTTPException(status_code=400, detail="Opacity harus antara 0.1 dan 1.0.")
        if not (0.1 <= scale <= 1.0):
            raise HTTPException(status_code=400, detail="Scale harus antara 0.1 dan 1.0.")

        # Apply watermark with PyMuPDF
        output_path = None
        img_path = None
        try:
            # Save image to temp
            img_ext = ".png" if watermark_image.content_type == "image/png" else ".jpg"
            fd, img_path = tempfile.mkstemp(suffix=img_ext, prefix="papyr_wm_")
            os.close(fd)
            with open(img_path, "wb") as f:
                f.write(img_bytes)

            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            pages_processed = 0

            for page in doc:
                pw, ph = page.rect.width, page.rect.height
                # Calculate watermark rect based on position and scale
                wm_w = pw * scale
                wm_h = ph * scale  # Maintain aspect ratio later

                # Get actual image dimensions for aspect ratio
                img_doc = fitz.open(img_path)
                img_rect = img_doc[0].rect
                img_doc.close()
                aspect = img_rect.width / img_rect.height if img_rect.height > 0 else 1
                wm_h = wm_w / aspect

                # Position calculation
                if position == "center":
                    x0 = (pw - wm_w) / 2
                    y0 = (ph - wm_h) / 2
                elif position == "top-left":
                    x0, y0 = 20, 20
                elif position == "top-right":
                    x0, y0 = pw - wm_w - 20, 20
                elif position == "bottom-left":
                    x0, y0 = 20, ph - wm_h - 20
                elif position == "bottom-right":
                    x0, y0 = pw - wm_w - 20, ph - wm_h - 20
                else:
                    x0 = (pw - wm_w) / 2
                    y0 = (ph - wm_h) / 2

                rect = fitz.Rect(x0, y0, x0 + wm_w, y0 + wm_h)
                page.insert_image(rect, filename=img_path, overlay=True, alpha=int(opacity * 255))
                pages_processed += 1

            # Save output
            fd, output_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_wmout_")
            os.close(fd)
            doc.save(output_path)
            doc.close()

            with open(output_path, "rb") as f:
                output_bytes = f.read()

        finally:
            for p in (img_path, output_path):
                if p and os.path.exists(p):
                    try:
                        os.remove(p)
                    except OSError:
                        pass

        # Upload ke R2
        r2_result = upload_file(
            file_bytes=output_bytes,
            original_filename=f"watermarked_{file.filename or 'document.pdf'}",
            content_type="application/pdf",
        )

        dl_name = f"watermarked_{file.filename}" if file.filename else "watermarked.pdf"
        download_url = generate_signed_url(
            r2_result["key"], expiry_seconds=3600, download_filename=dl_name
        )

        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(
            logger, event="task_completed", tool="watermark",
            duration_ms=duration_ms, input_size_bytes=input_size,
            success=True, pages_processed=pages_processed,
        )

        expires_at = (datetime.now(timezone.utc) + timedelta(seconds=3600)).isoformat()

        return {
            "success": True,
            "download_url": download_url,
            "expires_at": expires_at,
            "pages_processed": pages_processed,
        }

    except HTTPException:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(logger, event="task_failed", tool="watermark",
                       duration_ms=duration_ms, input_size_bytes=input_size,
                       success=False, error="validation_error")
        raise
    except Exception as exc:
        duration_ms = int((time.time() - start_time) * 1000)
        log_task_event(logger, event="task_failed", tool="watermark",
                       duration_ms=duration_ms, input_size_bytes=input_size,
                       success=False, error=type(exc).__name__)
        raise HTTPException(status_code=500, detail="Gagal memproses file. Silakan coba lagi.")
```

2. **Register router** di `backend/main.py`:
```python
from routers.watermark import router as watermark_router
app.include_router(watermark_router)
```

### ✅ Definition of Done
- [ ] File `backend/routers/watermark.py` created
- [ ] Endpoint POST /api/watermark registered
- [ ] Accepts: PDF file + watermark image (PNG/JPG, max 2MB) + config JSON
- [ ] Validates: PDF, image format, config ranges
- [ ] Watermark applied to ALL pages
- [ ] Position calculation: center, top-left, top-right, bottom-left, bottom-right
- [ ] R2 upload + signed URL
- [ ] Rate limited + structured logging

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-017 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/watermark-pdf`
- Commit message: `feat(fase2): add POST /api/watermark for image watermark

- PyMuPDF image overlay on all pages
- Configurable: opacity, position, scale
- Validates PDF + image format + config ranges
- R2 upload + signed URL

Refs: PAPYR-112`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test: upload PDF + PNG watermark → verify watermark on all pages
- Proceed to STEP-F2-018

---

## STEP-F2-018: Frontend — Image watermark API integration + analytics

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-114 detail

### ✅ Prerequisites
- STEP-F2-017 complete (backend endpoint exists)
- STEP-F2-014 complete (watermark page with image tab)

### 🎯 Objective
Jika mode image: upload ke /api/watermark. Handle upload progress untuk 2 files (PDF + image). State management: idle → uploading → processing → done. Track analytics events.

### 📋 Instructions

1. **Wire image mode to backend API:**
- When user clicks "Terapkan Watermark" in image mode
- Create FormData with: file (PDF), watermark_image (image), config (JSON string)
- XHR upload with progress tracking
- Handle response: download_url → show download button

2. **Track analytics:**
- task_started: tool="watermark", watermark_type="image"
- task_completed: tool="watermark", watermark_type="image", pages_count
- task_failed: tool="watermark", error_type

### ✅ Definition of Done
- [ ] Image watermark uploads to /api/watermark
- [ ] Progress indicator for upload
- [ ] Download button after success
- [ ] Error handling for API errors
- [ ] Analytics events tracked with watermark_type prop

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-018 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/watermark-pdf`
- Commit message: `feat(fase2): integrate image watermark API + analytics

- Upload PDF + image to /api/watermark
- Progress tracking for dual file upload
- Analytics events with watermark_type prop

Refs: PAPYR-114`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test full image watermark flow end-to-end
- Proceed to STEP-F2-019

---

## STEP-F2-019: Backend — Unit tests for watermark endpoint

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-113 detail

### ✅ Prerequisites
- STEP-F2-017 complete (watermark endpoint exists)

### 🎯 Objective
Buat unit tests untuk watermark endpoint. Minimal 9 test cases: happy path image watermark, invalid PDF, invalid image format, config validation (opacity out of range), oversized image, invalid JSON config, empty PDF, encrypted PDF rejection, empty watermark image.

### 📋 Instructions

1. **Buat test file** di `backend/tests/test_watermark.py`
2. **Run tests:** `pytest tests/test_watermark.py -v`

### ✅ Definition of Done
- [ ] 9+ test cases
- [ ] All tests pass
- [ ] Coverage ≥ 90%

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-019 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/watermark-pdf`
- Commit message: `test(fase2): add unit tests for watermark endpoint

- 9 test cases: happy path, validation, edge cases
Refs: PAPYR-113`
- PR target: `develop`

### 🚀 Post-Step Actions
- Run full backend test suite
- Proceed to STEP-F2-020

---

## STEP-F2-020: Frontend — Unit tests for /watermark page

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-116B detail

### ✅ Prerequisites
- STEP-F2-014 through STEP-F2-018 complete

### 🎯 Objective
Vitest unit tests: test text config panel (font size, opacity, rotation, color), test image config panel, test preview rendering, test tab switching, test analytics events. Minimal 8 test cases.

### 📋 Instructions

1. **Buat test file** di `frontend/src/__tests__/watermark.test.tsx`
2. **Run tests:** `npx vitest run src/__tests__/watermark.test.tsx`

### ✅ Definition of Done
- [ ] 8+ test cases
- [ ] All tests pass

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-020 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/watermark-pdf`
- Commit message: `test(fase2): add frontend unit tests for /watermark

Refs: PAPYR-116B`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-021

---

## STEP-F2-021: Testing — Manual E2E test watermark flow

**Phase:** Fase 2B — Document Enhancement
**Executor:** Founder + AI Agent
**Type:** Testing
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-116, M14 Acceptance Criteria

### ✅ Prerequisites
- All watermark steps complete (STEP-F2-014 through STEP-F2-020)

### 🎯 Objective
Manual E2E testing: text watermark (berbagai font size, opacity, rotation), image watermark (PNG transparent, JPG). Verify watermark muncul di semua halaman. Test PDF landscape dan portrait.

### 📋 Instructions

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | Text watermark: center, 36pt, 50% opacity | Watermark visible on all pages |
| 2 | Text watermark: diagonal, 72pt, 30% opacity | Diagonal watermark on all pages |
| 3 | Text watermark: different colors | Color applied correctly |
| 4 | Image watermark: PNG with transparency | Transparent overlay on all pages |
| 5 | Image watermark: JPG | Image overlay on all pages |
| 6 | Landscape PDF | Watermark positioned correctly |
| 7 | Portrait PDF | Watermark positioned correctly |
| 8 | Text watermark: zero upload (check network tab) | No server requests for text mode |

### ✅ Definition of Done
- [ ] All 8 test cases pass
- [ ] Text watermark: 100% client-side (zero upload verified)
- [ ] Image watermark: server-side via /api/watermark
- [ ] Watermark on ALL pages
- [ ] M14 acceptance criteria met

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-021 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/watermark-pdf`
- Commit message: `test(fase2): manual E2E verification for watermark PDF

Refs: PAPYR-116, M14 complete`
- PR target: `develop`

### 🚀 Post-Step Actions
- M14 (Watermark PDF) feature-complete
- Proceed to STEP-F2-022 (start M15: Sign PDF)

---

## STEP-F2-022: Frontend — Create /sign page with main layout

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-117 detail
- `frontend/src/app/watermark/page.tsx` — Reference for complex tool page

### ✅ Prerequisites
- M14 (Watermark) feature-complete
- pdf-lib installed

### 🎯 Objective
Buat halaman /sign dengan layout utama: upload zone, signature creation area, PDF viewer area dengan page navigation, tombol "Tanda Tangani PDF". Two-step flow: (1) buat signature, (2) tempatkan di PDF. 100% client-side.

### 📋 Instructions

1. **Buat layout** di `frontend/src/app/sign/layout.tsx` dengan metadata:
   - Title: "Tanda Tangani PDF Online - Papyr"
   - Description: "Tanda tangani PDF langsung dari browser. Gambar, upload, atau ketik tanda tangan. 100% privasi — file tidak diupload."

2. **Buat page** di `frontend/src/app/sign/page.tsx`:
   - Step 1: Upload PDF + create signature (3 modes: draw, upload, type)
   - Step 2: Place signature on PDF pages (drag-and-drop)
   - Final: Apply and download

3. **State management** (dari backlog):
```typescript
interface SignatureState {
  mode: "draw" | "upload" | "type";
  signatureImage: string | null;  // base64 PNG
  placements: SignaturePlacement[];
  currentPage: number;
  totalPages: number;
  pdfFile: File | null;
}

interface SignaturePlacement {
  id: string;
  page: number;       // 1-indexed
  x: number;          // 0-1 relative to page width
  y: number;          // 0-1 relative to page height
  width: number;      // 0-1 relative to page width
  height: number;     // 0-1 relative to page height
}
```

4. **Tambah /sign ke sitemap.ts** dengan priority 0.8.

### ✅ Definition of Done
- [ ] Page `/sign` renders correctly
- [ ] Two-step flow: create signature → place on PDF
- [ ] Three mode tabs: Draw, Upload, Type
- [ ] State management for signature and placements
- [ ] SEO metadata + sitemap entry
- [ ] Mobile-first responsive

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-022 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/sign-pdf`
- Commit message: `feat(fase2): add /sign page with main layout and state management

Refs: PAPYR-117, PAPYR-125`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-023

---

## STEP-F2-023: Frontend — Signature pad component (draw mode)

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-118 detail

### ✅ Prerequisites
- STEP-F2-022 complete (sign page exists)

### 🎯 Objective
Buat canvas-based drawing pad menggunakan HTML5 Canvas API. Fitur: draw dengan mouse/touch, clear button, undo last stroke, line width selector (thin/medium/thick), warna (hitam/biru). Export ke PNG transparent. Responsive touch support untuk mobile.

### 📋 Instructions

1. **Buat component** di `frontend/src/components/SignaturePad.tsx`:
   - Canvas element with mouse/touch event handlers
   - Drawing logic: mousedown/touchstart → start path, mousemove/touchmove → draw, mouseup/touchend → end path
   - Store strokes array for undo functionality
   - Clear button: reset canvas
   - Undo button: remove last stroke, redraw remaining
   - Line width: thin (2px), medium (4px), thick (6px)
   - Color: black (#000000), blue (#1E40AF)
   - Export: canvas.toDataURL("image/png") with transparent background

2. **Touch support:**
   - `touch-action: none` on canvas CSS
   - Handle touchstart, touchmove, touchend events
   - Prevent scroll while drawing

### ✅ Definition of Done
- [ ] Canvas drawing works with mouse
- [ ] Canvas drawing works with touch (mobile)
- [ ] Clear button resets canvas
- [ ] Undo removes last stroke
- [ ] Line width selector (3 options)
- [ ] Color selector (black/blue)
- [ ] Export to PNG transparent background
- [ ] No scroll interference on mobile

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-023 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/sign-pdf`
- Commit message: `feat(fase2): add SignaturePad component with canvas drawing

- Mouse and touch support
- Undo, clear, line width, color options
- Export to transparent PNG

Refs: PAPYR-118`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test drawing on desktop and mobile
- Proceed to STEP-F2-024

---

## STEP-F2-024: Frontend — Signature upload mode + type mode

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-119, PAPYR-124 detail

### ✅ Prerequisites
- STEP-F2-022 complete (sign page with mode tabs)

### 🎯 Objective
Implement upload mode: upload gambar tanda tangan (PNG/JPG, maks 1MB), auto-crop whitespace, preview thumbnail. Type mode: user ketik nama, pilih font style (4 pilihan), render text ke canvas, export sebagai signature image.

### 📋 Instructions

1. **Upload mode:**
   - File input accepting PNG/JPG (max 1MB)
   - Preview thumbnail after upload
   - Optional: remove white background (canvas pixel manipulation)
   - Export as base64 PNG

2. **Type mode:**
   - Text input for name
   - Font selector: Dancing Script, Caveat, Satisfy, Pacifico (Google Fonts)
   - Render text to hidden canvas with selected font
   - Preview rendered signature
   - Export as base64 PNG

3. **Google Fonts loading:**
```tsx
// In layout.tsx or page.tsx
import { Dancing_Script, Caveat, Satisfy, Pacifico } from "next/font/google";
```

### ✅ Definition of Done
- [ ] Upload mode: accepts PNG/JPG, max 1MB, preview shown
- [ ] Type mode: text input + 4 font options
- [ ] Type mode: renders text to canvas with selected font
- [ ] Both modes export to base64 PNG
- [ ] Fonts load correctly from Google Fonts

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-024 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/sign-pdf`
- Commit message: `feat(fase2): add signature upload and type modes

- Upload: PNG/JPG, max 1MB, preview
- Type: 4 Google Fonts (Dancing Script, Caveat, Satisfy, Pacifico)
- Both export to base64 PNG

Refs: PAPYR-119, PAPYR-124`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-025

---

## STEP-F2-025: Frontend — PDF page viewer with navigation

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-120 detail

### ✅ Prerequisites
- STEP-F2-022 complete (sign page exists)
- pdf-lib installed

### 🎯 Objective
Render PDF pages menggunakan canvas. Page navigation: prev/next buttons, page number indicator. Zoom controls (fit-width default). Render satu halaman pada satu waktu untuk performa.

### 📋 Instructions

1. **Buat component** di `frontend/src/components/PDFPageViewer.tsx`:
   - Load PDF with pdf-lib (or pdfjs-dist for rendering)
   - Render current page to canvas
   - Navigation: prev/next buttons, "Halaman X dari Y" indicator
   - Fit-width zoom by default
   - Single page rendering for performance

2. **Note:** pdf-lib doesn't render pages visually. Consider using `pdfjs-dist` for canvas rendering, or render a simplified preview.

### ✅ Definition of Done
- [ ] PDF pages render in viewer area
- [ ] Page navigation: prev/next buttons work
- [ ] Page indicator: "Halaman X dari Y"
- [ ] Fit-width zoom
- [ ] Single page rendered at a time
- [ ] Responsive on mobile

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-025 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/sign-pdf`
- Commit message: `feat(fase2): add PDFPageViewer component with navigation

Refs: PAPYR-120`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-026

---

## STEP-F2-026: Frontend — Drag-and-drop signature placement

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-121, PAPYR-122 detail

### ✅ Prerequisites
- STEP-F2-025 complete (PDF viewer exists)
- STEP-F2-023 or STEP-F2-024 complete (signature image available)

### 🎯 Objective
Signature image bisa di-drag ke posisi manapun di halaman PDF. Resize handles (corner drag to resize). Multi-page support: navigate ke halaman lain dan place signature tambahan. Touch support untuk mobile drag.

### 📋 Instructions

1. **Drag-and-drop implementation:**
   - Signature image overlay on PDF viewer canvas
   - Mouse drag: mousedown on signature → track movement → update position
   - Touch drag: touchstart → touchmove → touchend
   - Resize handles on corners
   - Constrain within page bounds

2. **Multi-page support:**
   - User navigates to different pages
   - Can place signature on any page
   - List of placed signatures with delete option
   - "Terapkan ke semua halaman" checkbox option

3. **Store placements** in state:
```typescript
const [placements, setPlacements] = useState<SignaturePlacement[]>([]);
```

### ✅ Definition of Done
- [ ] Signature draggable to any position on page
- [ ] Resize handles work (corner drag)
- [ ] Position stays within page bounds
- [ ] Multi-page: can place on different pages
- [ ] List of placements with delete option
- [ ] Touch support for mobile
- [ ] "Apply to all pages" option

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-026 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/sign-pdf`
- Commit message: `feat(fase2): add drag-and-drop signature placement

- Draggable + resizable signature on PDF pages
- Multi-page support with placement list
- Touch support for mobile
- Apply to all pages option

Refs: PAPYR-121, PAPYR-122`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test drag on desktop and mobile
- Proceed to STEP-F2-027

---

## STEP-F2-027: Frontend — Apply signature to PDF with pdf-lib + download

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-123 detail

### ✅ Prerequisites
- STEP-F2-026 complete (placements stored in state)
- pdf-lib installed

### 🎯 Objective
Gunakan pdf-lib: convert signature PNG ke embedded image, `page.drawImage()` pada koordinat yang dipilih user (convert canvas coords ke PDF coords). Handle multiple signatures di multiple pages. Output: download langsung dari browser. 100% client-side.

### 📋 Instructions

1. **Apply signatures with pdf-lib:**
```typescript
import { PDFDocument } from "pdf-lib";

async function applySignatures(
  pdfBytes: Uint8Array,
  signatureBase64: string,
  placements: SignaturePlacement[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Embed signature image
  const signatureBytes = Uint8Array.from(atob(signatureBase64.split(",")[1]), c => c.charCodeAt(0));
  const signatureImage = await pdfDoc.embedPng(signatureBytes);

  const pages = pdfDoc.getPages();

  for (const placement of placements) {
    const page = pages[placement.page - 1]; // 1-indexed
    if (!page) continue;

    const { width: pageWidth, height: pageHeight } = page.getSize();

    // Convert relative coords (0-1) to absolute PDF coords
    const x = placement.x * pageWidth;
    const y = pageHeight - (placement.y * pageHeight) - (placement.height * pageHeight);
    const w = placement.width * pageWidth;
    const h = placement.height * pageHeight;

    page.drawImage(signatureImage, { x, y, width: w, height: h });
  }

  return await pdfDoc.save();
}
```

2. **Trigger download** after applying signatures.

3. **Track analytics:** task_started, task_completed (with pages_signed count).

### ✅ Definition of Done
- [ ] Signatures embedded in PDF (not overlay)
- [ ] Multiple signatures on multiple pages work
- [ ] Coordinate conversion: canvas → PDF correct
- [ ] Output downloads directly from browser
- [ ] 100% client-side (zero upload)
- [ ] Analytics events tracked

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-027 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/sign-pdf`
- Commit message: `feat(fase2): apply signatures to PDF with pdf-lib

- Embed signature PNG into PDF pages
- Multi-page, multi-signature support
- Canvas-to-PDF coordinate conversion
- 100% client-side, direct download

Refs: PAPYR-123`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test: draw signature → place on page 2 → download → verify signature in output
- Proceed to STEP-F2-028

---

## STEP-F2-028: Frontend — Unit tests for /sign page

**Phase:** Fase 2B — Document Enhancement
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-127B detail

### ✅ Prerequisites
- STEP-F2-022 through STEP-F2-027 complete

### 🎯 Objective
Vitest unit tests: test canvas drawing, test signature upload, test drag-to-place, test resize, test type mode font selection, test multi-page placement state, test analytics events. Minimal 10 test cases. Sign is 100% client-side, backend tests N/A.

### 📋 Instructions

1. **Buat test file** di `frontend/src/__tests__/sign.test.tsx`
2. **Run tests:** `npx vitest run src/__tests__/sign.test.tsx`

### ✅ Definition of Done
- [ ] 10+ test cases
- [ ] All tests pass
- [ ] Coverage ≥ 90% for sign page

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-028 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/sign-pdf`
- Commit message: `test(fase2): add frontend unit tests for /sign

- 10 test cases for signature pad, upload, type, placement
Refs: PAPYR-127B`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-029

---

## STEP-F2-029: Testing — Manual E2E test sign flow

**Phase:** Fase 2B — Document Enhancement
**Executor:** Founder + AI Agent
**Type:** Testing
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-127, M15 Acceptance Criteria

### ✅ Prerequisites
- All sign steps complete

### 🎯 Objective
Manual E2E: draw signature + place + download. Upload signature image. Type signature. Multi-page placement. Test pada mobile (touch draw + touch drag). Verify signature muncul di output PDF.

### 📋 Instructions

| # | Test Case | Expected Result |
|---|-----------|-----------------|
| 1 | Draw signature → place on page 1 → download | Signature visible in output PDF |
| 2 | Upload PNG signature → place → download | Signature visible |
| 3 | Type signature (Dancing Script) → place → download | Text signature visible |
| 4 | Place signatures on page 1 and page 3 | Both signatures in output |
| 5 | Mobile: touch draw signature | Drawing works smoothly |
| 6 | Mobile: touch drag to place | Placement works |
| 7 | Resize signature | Resized correctly in output |
| 8 | "Apply to all pages" | Signature on every page |

### ✅ Definition of Done
- [ ] All 8 test cases pass
- [ ] 100% client-side (zero network requests for processing)
- [ ] Touch works on mobile
- [ ] M15 acceptance criteria met
- [ ] Fase 2B complete

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-029 complete
- Update `stepprompts/progress.md` — mark Fase 2B as complete

### 🔀 Git Instructions
- Branch: `feature/fase2/sign-pdf`
- Commit message: `test(fase2): Fase 2B complete — watermark + sign verified

Refs: PAPYR-127, M14 + M15 complete`
- PR target: `develop`

### 🚀 Post-Step Actions
- Merge watermark-pdf dan sign-pdf branches ke develop
- Tag checkpoint: "Fase 2B complete"
- Proceed to STEP-F2-030 (start Fase 2C: PDF-to-Word)

---

## Fase 2C — Document Conversion (M16: PDF-to-Word + M17: OCR + M18: PDF-to-Excel)

---

## STEP-F2-030: Infra — Install LibreOffice headless in Docker/Railway

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Infrastructure
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-128 detail, Dockerfile Addition M16
- `docs/07_Papyr_Deployment_Runbook_v1.0.md` — Docker deployment
- `backend/Dockerfile` — Current Dockerfile

### ✅ Prerequisites
- Fase 2B complete
- Docker configured for Railway deployment

### 🎯 Objective
Update Dockerfile untuk install LibreOffice headless (libreoffice-writer + libreoffice-common). Verify instalasi dengan `libreoffice --headless --version`. Test conversion sederhana di container.

### 📋 Instructions

1. **Update `backend/Dockerfile`** — tambah LibreOffice:

```dockerfile
# LibreOffice headless untuk PDF-to-Word conversion
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-writer \
    libreoffice-common \
    && apt-get clean
```

2. **Build dan test locally:**
```bash
cd backend
docker build -t papyr-backend .
docker run --rm papyr-backend libreoffice --headless --version
```

3. **Verify image size** — target: total image < 1GB.

### ✅ Definition of Done
- [ ] Dockerfile updated with LibreOffice installation
- [ ] `libreoffice --headless --version` returns valid version in container
- [ ] Simple PDF to DOCX conversion works in container
- [ ] Docker image builds successfully

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-030 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/pdf-to-word`
- Commit message: `infra(fase2): install LibreOffice headless in Docker

Refs: PAPYR-128`
- PR target: `develop`

### 🚀 Post-Step Actions
- Deploy to Railway staging to verify
- Proceed to STEP-F2-031
---

## STEP-F2-031: Backend — Create async task service (shared M16/M17)

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-131, PAPYR-142 detail
- `docs/04_Papyr_TDD_v1.0.md` — Async processing architecture

### ✅ Prerequisites
- STEP-F2-030 complete (LibreOffice installed)

### 🎯 Objective
Buat shared async task service `backend/services/async_task.py` untuk PDF-to-Word (M16) dan OCR (M17). Pattern: endpoint return 202 + task_id, polling via GET /api/status/{task_id}. Status: queued, processing, done, failed. In-memory dict storage.

### 📋 Instructions

1. **Buat `backend/services/async_task.py`:**
   - `TaskStatus` enum: QUEUED, PROCESSING, DONE, FAILED
   - `TaskInfo` dataclass: task_id, status, created_at, started_at, completed_at, progress, result, error, metadata
   - `_tasks` dict for in-memory storage
   - `create_task()` — create new task, return TaskInfo
   - `get_task(task_id)` — lookup by ID
   - `update_task_status()` — update status/progress/result/error
   - `run_task_in_background()` — async wrapper with timeout (asyncio.wait_for + run_in_executor)
   - `task_to_response()` — convert to API response dict
   - TTL cleanup: remove tasks older than 2 hours

2. **Buat `backend/routers/status.py`:**
   - GET /api/status/{task_id} — return task status
   - 404 if task not found

3. **Register** di `backend/main.py`.

### ✅ Definition of Done
- [ ] `backend/services/async_task.py` created
- [ ] Task lifecycle: create, queued, processing, done/failed
- [ ] In-memory storage with TTL cleanup
- [ ] `run_task_in_background()` with configurable timeout
- [ ] GET /api/status/{task_id} endpoint working
- [ ] 404 for unknown task_id

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-031 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/pdf-to-word`
- Commit message: `feat(fase2): add async task service + polling endpoint

- Shared between PDF-to-Word and OCR
- In-memory task storage with TTL
- Background execution with timeout

Refs: PAPYR-131, PAPYR-142`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-032

---

## STEP-F2-032: Backend — Create POST /api/pdf-to-word endpoint

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-129, PAPYR-130, PAPYR-132, API Contract M16, Edge Cases M16, Performance Targets M16

### ✅ Prerequisites
- STEP-F2-030 complete (LibreOffice installed)
- STEP-F2-031 complete (async task service exists)

### 🎯 Objective
Buat endpoint POST /api/pdf-to-word. Validasi: maks 20MB, maks 100 halaman. Detect scanned PDF (return 400 suggesting OCR). Return 202 + task_id. Background: LibreOffice subprocess conversion, upload to R2.

### 📋 Instructions

1. **Buat `backend/routers/pdf_to_word.py`:**
   - Validate PDF (reject encrypted, max 100 pages)
   - Detect scanned PDF (heuristic: check text content < 10 chars)
   - Create async task
   - Background: `libreoffice --headless --convert-to docx --outdir /tmp input.pdf`
   - Handle subprocess timeout (120s)
   - Upload DOCX to R2, update task with download_url

2. **Register** di `backend/main.py`.

3. **Edge cases to handle:**
   - Scanned PDF → 400 "PDF ini adalah scan, gunakan OCR terlebih dahulu"
   - Password-protected → 400 "PDF terproteksi, gunakan Unlock terlebih dahulu"
   - Empty PDF → 400
   - Corrupted PDF → 400
   - Timeout → task status "failed" with timeout message

4. **Performance targets:**
   - 10 pages or less: under 10 seconds
   - 10-50 pages: under 30 seconds
   - 50-100 pages: under 120 seconds (timeout)

### ✅ Definition of Done
- [ ] POST /api/pdf-to-word returns 202 + task_id
- [ ] LibreOffice subprocess converts PDF to DOCX
- [ ] Async processing (doesn't block request)
- [ ] Timeout: 120 seconds max
- [ ] Scanned PDF detection with helpful error
- [ ] Max 100 pages validation
- [ ] Result uploaded to R2 with signed URL
- [ ] Encrypted PDF rejected

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-032 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/pdf-to-word`
- Commit message: `feat(fase2): add POST /api/pdf-to-word with async processing

- LibreOffice headless conversion
- Async: 202 + task_id, poll for result
- Scanned PDF detection, encrypted rejection
- Max 100 pages, 120s timeout

Refs: PAPYR-129, PAPYR-130, PAPYR-131, PAPYR-132`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test: upload PDF, poll status, download DOCX
- Proceed to STEP-F2-033

---

## STEP-F2-033: Backend — Unit tests for pdf-to-word + Frontend page + tests

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Backend + Frontend + Testing
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-133, PAPYR-134, PAPYR-135, PAPYR-136, PAPYR-137, PAPYR-137B

### ✅ Prerequisites
- STEP-F2-032 complete

### 🎯 Objective
Complete M16 with: (1) Backend unit tests (12+ cases, mock LibreOffice), (2) Frontend /pdf-to-word page with polling UI, (3) Shared useAsyncTask hook, (4) Frontend unit tests (8+ cases).

### 📋 Instructions

**Part A — Backend Tests (`backend/tests/test_pdf_to_word.py`):**
- Happy path (mock subprocess), file too large, >100 pages, timeout, invalid file, scanned PDF rejection, encrypted PDF, empty PDF, corrupted PDF, status polling, task not found (404), multi-column PDF
- Mock LibreOffice subprocess for CI

**Part B — Frontend Page (`frontend/src/app/pdf-to-word/`):**
- Layout with metadata: "Konversi PDF ke Word (DOCX) - Papyr"
- Page: upload zone, POST to /api/pdf-to-word, get task_id, start polling
- Warning: "Konversi file besar mungkin memakan waktu 1-2 menit"
- Progress states: queued, processing, done, failed
- Download button when done
- Sitemap entry

**Part C — Shared Hook (`frontend/src/hooks/useAsyncTask.ts`):**
- Poll GET /api/status/{task_id} every 3 seconds
- Client-side timeout: 3 minutes
- Stop polling on done/failed
- Reusable for OCR page too

**Part D — Frontend Tests (`frontend/src/__tests__/pdf-to-word.test.tsx`):**
- Test polling mechanism (mock fetch)
- Test timeout handling
- Test progress states
- Test error display
- Test analytics events
- 8+ test cases

### ✅ Definition of Done
- [ ] Backend: 12+ tests pass (mocked LibreOffice)
- [ ] Frontend: /pdf-to-word page with polling UI
- [ ] Shared: useAsyncTask hook created
- [ ] Frontend: 8+ tests pass
- [ ] Sitemap entry added
- [ ] M16 feature-complete

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-033 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/pdf-to-word`
- Commit message: `feat(fase2): complete M16 — pdf-to-word tests + frontend + polling

- 12 backend tests (mocked LibreOffice)
- /pdf-to-word page with async polling UI
- useAsyncTask shared hook
- 8 frontend tests

Refs: PAPYR-133, PAPYR-134, PAPYR-135, PAPYR-136, PAPYR-137, PAPYR-137B`
- PR target: `develop`

### 🚀 Post-Step Actions
- M16 (PDF-to-Word) feature-complete
- Proceed to STEP-F2-034

---

## STEP-F2-034: Infra — Install Tesseract + ocrmypdf in Docker

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Infrastructure
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-138, PAPYR-139, Dockerfile Addition M17

### ✅ Prerequisites
- STEP-F2-030 complete (LibreOffice already in Docker)

### 🎯 Objective
Update Dockerfile: install tesseract-ocr, tesseract-ocr-ind, tesseract-ocr-eng. Install ocrmypdf via pip. Verify: `tesseract --list-langs` includes `ind` dan `eng`. Optimasi Docker image size dengan multi-stage build. Target: runtime image < 1.5GB.

### 📋 Instructions

1. **Update `backend/Dockerfile`:**
```dockerfile
# Tesseract OCR dengan language packs Indonesia + English
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-ind \
    tesseract-ocr-eng \
    && apt-get clean
```

2. **Update `backend/requirements.txt`:**
```
ocrmypdf>=16.0.0
```

3. **Verify in container:**
```bash
docker run --rm papyr-backend tesseract --list-langs
# Should show: ind, eng
docker run --rm papyr-backend python -c "import ocrmypdf; print('OK')"
```

4. **Evaluate multi-stage build** jika image > 1.5GB.

### ✅ Definition of Done
- [ ] Tesseract + language packs installed
- [ ] ocrmypdf importable in Python
- [ ] `tesseract --list-langs` shows ind + eng
- [ ] Docker image builds successfully
- [ ] Image size documented

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-034 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/ocr`
- Commit message: `infra(fase2): install Tesseract + ocrmypdf in Docker

- tesseract-ocr with ind + eng language packs
- ocrmypdf Python library

Refs: PAPYR-138, PAPYR-139`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-035

---

## STEP-F2-035: Backend — Create POST /api/ocr endpoint

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-140, PAPYR-141, PAPYR-142, PAPYR-143, API Contract M17, Edge Cases M17, Performance Targets M17

### ✅ Prerequisites
- STEP-F2-034 complete (Tesseract installed)
- STEP-F2-031 complete (async task service exists)

### 🎯 Objective
Buat endpoint POST /api/ocr. Terima PDF + language (ind/eng/ind+eng). Validasi: maks 20MB, maks 50 halaman. Return 202 + task_id. Background: ocrmypdf processing, upload searchable PDF to R2.

### 📋 Instructions

1. **Buat `backend/routers/ocr.py`:**
   - Validate PDF (reject encrypted, max 50 pages)
   - Accept language parameter: "ind", "eng", "ind+eng" (default)
   - Optional heuristic: detect if PDF already has text layer
   - Create async task
   - Background: `ocrmypdf.ocr(input, output, language=lang, deskew=True, optimize=1, skip_text=True)`
   - Timeout: 180 seconds
   - Upload searchable PDF to R2

2. **Register** di `backend/main.py`.

3. **Edge cases:**
   - Already has text layer → return message "PDF sudah memiliki text layer"
   - Mixed PDF (some scanned, some text) → skip_text=True handles this
   - Low quality scan → warn in response metadata
   - Encrypted PDF → 400
   - Empty/corrupted → 400

4. **Performance targets:**
   - 5 pages or less: under 30 seconds
   - 5-20 pages: under 90 seconds
   - 20-50 pages: under 180 seconds (timeout)

### ✅ Definition of Done
- [ ] POST /api/ocr returns 202 + task_id
- [ ] ocrmypdf processes scanned PDF to searchable PDF
- [ ] Language support: ind, eng, ind+eng
- [ ] Async with 180s timeout
- [ ] Max 50 pages validation
- [ ] skip_text=True for mixed PDFs
- [ ] deskew=True for rotated pages
- [ ] Result uploaded to R2

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-035 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/ocr`
- Commit message: `feat(fase2): add POST /api/ocr with async processing

- ocrmypdf with Tesseract (ind + eng)
- Async: 202 + task_id, 180s timeout
- deskew, optimize, skip_text options
- Max 50 pages

Refs: PAPYR-140, PAPYR-141, PAPYR-142, PAPYR-143`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test: upload scanned PDF, poll, download searchable PDF
- Proceed to STEP-F2-036

---

## STEP-F2-036: Backend + Frontend — Complete M17 (OCR tests + page + frontend tests)

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Full Stack + Testing
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-144, PAPYR-145, PAPYR-146, PAPYR-147, PAPYR-148, PAPYR-148B

### ✅ Prerequisites
- STEP-F2-035 complete (OCR endpoint exists)

### 🎯 Objective
Complete M17: (1) Backend unit tests (12+ cases), (2) Frontend /ocr page with language selector + polling, (3) Frontend unit tests (8+ cases).

### 📋 Instructions

**Part A — Backend Tests (`backend/tests/test_ocr.py`):**
- Happy path (mock ocrmypdf), language selection (ind, eng, ind+eng), file too large, >50 pages, timeout, invalid file, already-searchable PDF, mixed PDF, encrypted PDF, empty PDF, corrupted PDF, DPI quality detection
- 12+ test cases, mock ocrmypdf for CI

**Part B — Frontend Page (`frontend/src/app/ocr/`):**
- Layout: "OCR PDF — Ubah Scan Jadi Teks - Papyr"
- Page: upload zone, language selector dropdown (Indonesia/English/Keduanya)
- Info box: "OCR mengubah PDF scan menjadi PDF yang bisa dicari teksnya"
- Warning: "Proses OCR memakan waktu 1-3 menit"
- Reuse useAsyncTask hook for polling
- Estimated time based on page count
- Sitemap entry

**Part C — Frontend Tests (`frontend/src/__tests__/ocr.test.tsx`):**
- Test language selector, polling mechanism, estimated time calculation, progress states, error messages, analytics events
- 8+ test cases

### ✅ Definition of Done
- [ ] Backend: 12+ tests pass
- [ ] Frontend: /ocr page with language selector + polling
- [ ] Frontend: 8+ tests pass
- [ ] Sitemap entry added
- [ ] M17 feature-complete

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-036 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/ocr`
- Commit message: `feat(fase2): complete M17 — OCR tests + frontend + polling

- 12 backend tests (mocked ocrmypdf)
- /ocr page with language selector
- Reuses useAsyncTask hook
- 8 frontend tests

Refs: PAPYR-144, PAPYR-145, PAPYR-146, PAPYR-147, PAPYR-148, PAPYR-148B`
- PR target: `develop`

### 🚀 Post-Step Actions
- M17 (OCR) feature-complete
- Proceed to STEP-F2-037

---

## STEP-F2-037: Infra — Install camelot-py + dependencies in Docker

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Infrastructure
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-149 detail

### ✅ Prerequisites
- STEP-F2-034 complete (Tesseract already in Docker)
- Ghostscript already installed (from Fase 1)

### 🎯 Objective
Install camelot-py[cv], opencv-python-headless, openpyxl di Docker. Camelot butuh Ghostscript (sudah ada). Verify: `import camelot` berhasil di container.

### 📋 Instructions

1. **Update `backend/requirements.txt`:**
```
camelot-py[cv]>=0.11.0
opencv-python-headless>=4.8.0
openpyxl>=3.1.0
```

2. **Verify in container:**
```bash
docker run --rm papyr-backend python -c "import camelot; print('OK')"
docker run --rm papyr-backend python -c "import openpyxl; print('OK')"
```

### ✅ Definition of Done
- [ ] camelot-py importable
- [ ] openpyxl importable
- [ ] opencv-python-headless installed
- [ ] Docker image builds

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-037 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/pdf-to-excel`
- Commit message: `infra(fase2): install camelot-py + openpyxl in Docker

Refs: PAPYR-149`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-038

---

## STEP-F2-038: Backend — Create POST /api/pdf-to-excel + preview endpoint

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-150, PAPYR-151, PAPYR-152, PAPYR-153, PAPYR-154, API Contract M18, Edge Cases M18, Performance Targets M18, Output Quality Spec M18

### ✅ Prerequisites
- STEP-F2-037 complete (camelot installed)

### 🎯 Objective
Buat 2 endpoints: (1) POST /api/pdf-to-excel/preview — upload PDF, return JSON preview tabel terdeteksi (first 5 rows per table), (2) POST /api/pdf-to-excel — full conversion ke XLSX. Gunakan camelot untuk table detection, openpyxl untuk XLSX generation.

### 📋 Instructions

1. **Buat `backend/routers/pdf_to_excel.py`:**

**Preview endpoint:**
- Accept: PDF file, pages (string, default "all"), flavor ("lattice"/"stream")
- Use camelot.read_pdf() to detect tables
- Return: tables_found count, per-table metadata (page, rows, cols, accuracy, first 5 rows preview)
- If no tables: return 400 "Tidak ada tabel terdeteksi"

**Full conversion endpoint:**
- Accept: PDF file, pages, flavor
- Detect tables with camelot
- Create XLSX with openpyxl: each table = separate sheet
- Format: auto-width columns, header row bold
- Upload to R2, return signed URL

2. **Table detection logic:**
```python
import camelot

# Try lattice first (tables with borders)
tables = camelot.read_pdf(file_path, pages=pages, flavor="lattice")
if len(tables) == 0 and flavor == "lattice":
    # Fallback to stream (tables without borders)
    tables = camelot.read_pdf(file_path, pages=pages, flavor="stream")
```

3. **XLSX generation:**
```python
from openpyxl import Workbook
from openpyxl.styles import Font

wb = Workbook()
for idx, table in enumerate(tables):
    ws = wb.active if idx == 0 else wb.create_sheet()
    ws.title = f"Page{table.page}_Table{idx+1}"

    for row_idx, row in enumerate(table.df.values.tolist()):
        for col_idx, value in enumerate(row):
            cell = ws.cell(row=row_idx+1, column=col_idx+1, value=value)
            if row_idx == 0:
                cell.font = Font(bold=True)
```

4. **Register** di `backend/main.py`.

5. **Edge cases:**
   - No tables found → 400
   - Scanned PDF → 400 "gunakan OCR terlebih dahulu"
   - Encrypted PDF → 400
   - Very large table (>1000 rows) → truncate + warn
   - Merged cells → best effort
   - Auto-generate headers if none detected

### ✅ Definition of Done
- [ ] POST /api/pdf-to-excel/preview returns table metadata + sample rows
- [ ] POST /api/pdf-to-excel returns XLSX download URL
- [ ] Lattice and stream detection modes
- [ ] Multiple tables → multiple sheets
- [ ] Auto-width columns, bold headers
- [ ] "No tables found" returns 400
- [ ] Scanned/encrypted PDF rejected
- [ ] R2 upload + signed URL

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-038 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/pdf-to-excel`
- Commit message: `feat(fase2): add POST /api/pdf-to-excel + preview endpoint

- camelot table detection (lattice + stream)
- openpyxl XLSX generation (multi-sheet)
- Preview endpoint with first 5 rows per table
- Auto-width, bold headers

Refs: PAPYR-150, PAPYR-151, PAPYR-152, PAPYR-153, PAPYR-154`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test: upload PDF with tables, preview, convert, open in Excel
- Proceed to STEP-F2-039

---

## STEP-F2-039: Backend + Frontend — Complete M18 (tests + page + frontend tests)

**Phase:** Fase 2C — Document Conversion
**Executor:** AI Agent
**Type:** Full Stack + Testing
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-155, PAPYR-156, PAPYR-157, PAPYR-158, PAPYR-158B

### ✅ Prerequisites
- STEP-F2-038 complete (pdf-to-excel endpoints exist)

### 🎯 Objective
Complete M18: (1) Backend unit tests (14+ cases), (2) Frontend /pdf-to-excel page with table preview, (3) Frontend unit tests (8+ cases).

### 📋 Instructions

**Part A — Backend Tests (`backend/tests/test_pdf_to_excel.py`):**
- Lattice table, stream table, no tables (400), scanned PDF rejection, encrypted PDF, empty PDF, corrupted PDF, multiple tables per page, merged cells, large table, page range filter, preview endpoint, number/date preservation, auto-generated headers
- 14+ test cases

**Part B — Frontend Page (`frontend/src/app/pdf-to-excel/`):**
- Layout: "Konversi PDF ke Excel (XLSX) - Papyr"
- Page flow: upload PDF → call preview endpoint → show detected tables as HTML → user confirms → call full conversion → download
- Table preview: render first 5 rows per table in HTML table format
- Handle: no tables found (suggest OCR if scanned)
- Page range input (optional)
- Sitemap entry

**Part C — Frontend Tests (`frontend/src/__tests__/pdf-to-excel.test.tsx`):**
- Test preview table rendering, table selection UI, conversion flow, error states (no tables, scan PDF), analytics events
- 8+ test cases

### ✅ Definition of Done
- [ ] Backend: 14+ tests pass
- [ ] Frontend: /pdf-to-excel page with table preview
- [ ] Frontend: 8+ tests pass
- [ ] Sitemap entry added
- [ ] M18 feature-complete

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-039 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/pdf-to-excel`
- Commit message: `feat(fase2): complete M18 — pdf-to-excel tests + frontend

- 14 backend tests
- /pdf-to-excel page with table preview
- 8 frontend tests

Refs: PAPYR-155, PAPYR-156, PAPYR-157, PAPYR-158, PAPYR-158B`
- PR target: `develop`

### 🚀 Post-Step Actions
- M18 (PDF-to-Excel) feature-complete
- Proceed to STEP-F2-040

---

## STEP-F2-040: Testing — Manual E2E test Fase 2C (all conversion tools)

**Phase:** Fase 2C — Document Conversion
**Executor:** Founder + AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — M16, M17, M18 Acceptance Criteria

### ✅ Prerequisites
- STEP-F2-033, STEP-F2-036, STEP-F2-039 complete (all M16/M17/M18 done)

### 🎯 Objective
Manual E2E testing untuk semua conversion tools. Verify async processing, polling, downloads, edge cases.

### 📋 Instructions

**PDF-to-Word tests:**
| # | Test | Expected |
|---|------|----------|
| 1 | Simple text PDF → DOCX | Opens in Word/Google Docs |
| 2 | PDF with images → DOCX | Images preserved |
| 3 | Large PDF (50 pages) | Completes within 60s |
| 4 | Scanned PDF | Error: "gunakan OCR" |

**OCR tests:**
| # | Test | Expected |
|---|------|----------|
| 5 | Scanned PDF (Indonesian) → searchable | Text selectable |
| 6 | Scanned PDF (English) → searchable | Text selectable |
| 7 | Already-searchable PDF | Message: "sudah memiliki text layer" |
| 8 | Large scanned PDF (20 pages) | Completes within 90s |

**PDF-to-Excel tests:**
| # | Test | Expected |
|---|------|----------|
| 9 | PDF with bordered table → XLSX | Table extracted correctly |
| 10 | PDF with borderless table (stream) | Table extracted (lower accuracy OK) |
| 11 | PDF without tables | Error: "Tidak ada tabel terdeteksi" |
| 12 | Preview shows correct data | First 5 rows match PDF |

### ✅ Definition of Done
- [ ] All 12 test cases pass
- [ ] Async polling works for PDF-to-Word and OCR
- [ ] DOCX opens in Word/Google Docs
- [ ] Searchable PDF has selectable text
- [ ] XLSX opens in Excel/Google Sheets
- [ ] Fase 2C complete

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-040 complete
- Update `stepprompts/progress.md` — mark Fase 2C as complete

### 🔀 Git Instructions
- Branch: `feature/fase2/pdf-to-excel`
- Commit message: `test(fase2): Fase 2C complete — all conversion tools verified

- PDF-to-Word, OCR, PDF-to-Excel all working
- Async processing verified
- Edge cases handled

Refs: M16, M17, M18 complete`
- PR target: `develop`

### 🚀 Post-Step Actions
- Merge all Fase 2C branches ke develop
- Tag checkpoint: "Fase 2C complete"
- All 7 new tools (M12-M18) feature-complete
- Total tools: 13 (6 existing + 7 new)

---

<!-- PART 2 CONTINUES: Fase 2D, 2E, 2F -->

<!-- PART 2: Fase 2D + 2E -->

## Fase 2D — E2E Testing + Code Quality (M19) + Performance, Monitoring & SEO (M20)

---

## STEP-F2-041: Setup Playwright di frontend project

**Phase:** Fase 2D — Quality
**Executor:** AI Agent
**Type:** Testing/Infra
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-159
- `docs/04_Papyr_TDD_v1.0.md` — Testing strategy
- `docs/13_Papyr_Coding_Standards_v1.0.md` — Code conventions

### ✅ Prerequisites
- Semua Fase 2A-2C steps complete (STEP-F2-001 sampai STEP-F2-040)
- Semua 13 tools berfungsi di local development
- `develop` branch stable, semua existing tests pass

### 🎯 Objective
Setup Playwright untuk E2E testing di frontend project. Konfigurasi chromium + firefox browsers, base URL localhost:3000, screenshot on failure, video on retry. Buat folder structure `e2e/` di root frontend dan `playwright.config.ts`.

### 📋 Instructions

1. **Install Playwright di frontend:**

```bash
cd frontend
npm init playwright@latest -- --quiet --browser=chromium --browser=firefox
```

2. **Buat `frontend/playwright.config.ts`:**

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

3. **Buat folder structure dan test fixtures:**

```bash
mkdir -p frontend/e2e/fixtures
```

4. **Buat fixture generator** di `frontend/e2e/fixtures/generate-fixtures.ts`:

```typescript
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function generateFixtures() {
  // Simple 3-page PDF
  const doc = await PDFDocument.create();
  for (let i = 1; i <= 3; i++) {
    const page = doc.addPage([595, 842]);
    page.drawText(`Test Page ${i}`, { x: 50, y: 750, size: 24 });
    page.drawText('This is a test PDF for Papyr E2E testing.', { x: 50, y: 700, size: 12 });
  }
  const bytes = await doc.save();
  fs.writeFileSync(path.join(__dirname, 'sample.pdf'), bytes);

  // Single page PDF
  const singleDoc = await PDFDocument.create();
  const singlePage = singleDoc.addPage([595, 842]);
  singlePage.drawText('Single Page Test', { x: 50, y: 750, size: 24 });
  const singleBytes = await singleDoc.save();
  fs.writeFileSync(path.join(__dirname, 'single-page.pdf'), singleBytes);

  console.log('Fixtures generated successfully.');
}

generateFixtures();
```

5. **Buat helper file** di `frontend/e2e/helpers.ts`:

```typescript
import { Page, expect } from '@playwright/test';
import * as path from 'path';

export const FIXTURES_DIR = path.join(__dirname, 'fixtures');
export const SAMPLE_PDF = path.join(FIXTURES_DIR, 'sample.pdf');
export const SINGLE_PAGE_PDF = path.join(FIXTURES_DIR, 'single-page.pdf');

export async function uploadPDF(page: Page, filePath: string) {
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
}

export async function waitForProcessing(page: Page, timeout = 30000) {
  await expect(
    page.locator('[data-testid="download-button"], a[download], button:has-text("Download")')
  ).toBeVisible({ timeout });
}

export async function verifyToolPageLoads(page: Page, toolPath: string) {
  await page.goto(toolPath);
  await expect(page).toHaveURL(toolPath);
  await expect(page.locator('h1, h2').first()).toBeVisible();
  await expect(
    page.locator('[data-testid="upload-zone"], [class*="upload"], input[type="file"]')
  ).toBeVisible();
}
```

6. **Buat smoke test** di `frontend/e2e/smoke.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Smoke Test', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Papyr/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('all 13 tool pages are accessible', async ({ page }) => {
    const tools = [
      '/compress', '/merge', '/split', '/rotate',
      '/image-to-pdf', '/pdf-to-image',
      '/protect', '/unlock', '/watermark', '/sign',
      '/pdf-to-word', '/ocr', '/pdf-to-excel',
    ];
    for (const tool of tools) {
      const response = await page.goto(tool);
      expect(response?.status()).toBe(200);
    }
  });
});
```

7. **Update `frontend/package.json` scripts** (tambahkan):

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:report": "playwright show-report"
  }
}
```

8. **Update `.gitignore`** (tambahkan):

```
/test-results/
/playwright-report/
/blob-report/
/playwright/.cache/
```

9. **Generate fixtures dan run smoke test:**

```bash
cd frontend
npx tsx e2e/fixtures/generate-fixtures.ts
npx playwright test e2e/smoke.spec.ts
```

### ✅ Definition of Done
- [ ] Playwright installed dengan chromium + firefox
- [ ] `playwright.config.ts` configured (base URL, screenshots, video)
- [ ] Folder `e2e/` created dengan fixtures dan helpers
- [ ] Test PDF fixtures generated (sample.pdf, single-page.pdf)
- [ ] Smoke test passes (homepage + all 13 tool pages accessible)
- [ ] `.gitignore` updated untuk Playwright artifacts

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-041 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `feat(fase2): setup Playwright E2E testing framework

- Configure chromium + firefox + mobile-chrome projects
- Add test PDF fixtures and helper utilities
- Smoke test verifies all 13 tool pages accessible
- Screenshot on failure, video on retry

Refs: PAPYR-159`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify smoke test passes: `npx playwright test e2e/smoke.spec.ts`
- Proceed to STEP-F2-042

---
## STEP-F2-042: E2E tests untuk client-side tools (Merge, Split, Rotate, Sign)

**Phase:** Fase 2D — Quality
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-160
- `frontend/src/app/merge/page.tsx`, `split/page.tsx`, `rotate/page.tsx`, `sign/page.tsx`

### ✅ Prerequisites
- STEP-F2-041 complete (Playwright setup + fixtures)
- All client-side tools working locally

### 🎯 Objective
Buat E2E tests untuk 4 client-side tools: Merge, Split, Rotate, Sign. Setiap test: navigate ke tool page, upload test PDF, configure, process, verify download. Minimal 1 happy path + 1 error case per tool.

### 📋 Instructions

1. **Buat `frontend/e2e/client-tools.spec.ts`:**

```typescript
import { test, expect } from '@playwright/test';
import { SAMPLE_PDF, SINGLE_PAGE_PDF, uploadPDF } from './helpers';

test.describe('Merge PDF (Client-side)', () => {
  test('should merge multiple PDFs successfully', async ({ page }) => {
    await page.goto('/merge');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([SAMPLE_PDF, SINGLE_PAGE_PDF]);
    await expect(page.locator('[data-testid="file-list"] li, [class*="file"]')).toHaveCount(2, { timeout: 5000 });
    const mergeButton = page.locator('button:has-text("Gabung"), button:has-text("Merge")');
    await expect(mergeButton).toBeEnabled();
    await mergeButton.click();
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should disable merge button when no files uploaded', async ({ page }) => {
    await page.goto('/merge');
    const mergeButton = page.locator('button:has-text("Gabung"), button:has-text("Merge")');
    await expect(mergeButton).toBeDisabled();
  });
});

test.describe('Split PDF (Client-side)', () => {
  test('should split PDF by page range', async ({ page }) => {
    await page.goto('/split');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.locator('text=/\\d+ halaman|\\d+ pages/i')).toBeVisible({ timeout: 10000 });
    const rangeInput = page.locator('input[placeholder*="1-2"], input[name*="range"], input[type="text"]').first();
    await rangeInput.fill('1-2');
    const splitButton = page.locator('button:has-text("Pisah"), button:has-text("Split")');
    await splitButton.click();
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should show error for invalid page range', async ({ page }) => {
    await page.goto('/split');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.locator('text=/\\d+ halaman|\\d+ pages/i')).toBeVisible({ timeout: 10000 });
    const rangeInput = page.locator('input[placeholder*="1-2"], input[name*="range"], input[type="text"]').first();
    await rangeInput.fill('99-100');
    const splitButton = page.locator('button:has-text("Pisah"), button:has-text("Split")');
    await splitButton.click();
    await expect(page.locator('text=/tidak valid|invalid|melebihi/i')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Rotate PDF (Client-side)', () => {
  test('should rotate all pages 90 degrees', async ({ page }) => {
    await page.goto('/rotate');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.locator('text=/\\d+ halaman|\\d+ pages/i')).toBeVisible({ timeout: 10000 });
    const rotateButton = page.locator('button:has-text("90"), button[aria-label*="rotate"]').first();
    await rotateButton.click();
    const downloadButton = page.locator('button:has-text("Download"), button:has-text("Simpan")');
    await downloadButton.click();
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should handle single page PDF rotation', async ({ page }) => {
    await page.goto('/rotate');
    await uploadPDF(page, SINGLE_PAGE_PDF);
    await expect(page.locator('text=/1 halaman|1 page/i')).toBeVisible({ timeout: 10000 });
    const rotateButton = page.locator('button:has-text("90"), button[aria-label*="rotate"]').first();
    await rotateButton.click();
    const downloadButton = page.locator('button:has-text("Download"), button:has-text("Simpan")');
    await downloadButton.click();
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});

test.describe('Sign PDF (Client-side)', () => {
  test('should place signature on PDF and download', async ({ page }) => {
    await page.goto('/sign');
    await uploadPDF(page, SINGLE_PAGE_PDF);
    await expect(page.locator('canvas, [data-testid="pdf-viewer"]')).toBeVisible({ timeout: 10000 });
    const signatureCanvas = page.locator('canvas[data-testid="signature-pad"], canvas').first();
    const box = await signatureCanvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 20, box.y + 20);
      await page.mouse.down();
      await page.mouse.move(box.x + 100, box.y + 50);
      await page.mouse.move(box.x + 150, box.y + 30);
      await page.mouse.up();
    }
    const applyButton = page.locator('button:has-text("Tanda Tangani"), button:has-text("Apply"), button:has-text("Terapkan")');
    await expect(applyButton).toBeEnabled({ timeout: 5000 });
    await applyButton.click();
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should not allow download without signature', async ({ page }) => {
    await page.goto('/sign');
    await uploadPDF(page, SINGLE_PAGE_PDF);
    await expect(page.locator('canvas, [data-testid="pdf-viewer"]')).toBeVisible({ timeout: 10000 });
    const applyButton = page.locator('button:has-text("Tanda Tangani"), button:has-text("Apply"), button:has-text("Terapkan")');
    await expect(applyButton).toBeDisabled();
  });
});
```

2. **Run tests:**

```bash
cd frontend
npx playwright test e2e/client-tools.spec.ts --project=chromium
```

### ✅ Definition of Done
- [ ] 8 E2E tests created (2 per client-side tool)
- [ ] Merge: multi-file merge + no-files error
- [ ] Split: page range + invalid range error
- [ ] Rotate: 90 degrees + single page
- [ ] Sign: draw + apply + no-signature error
- [ ] All tests pass on chromium

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-042 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `test(fase2): add E2E tests for client-side tools (Merge, Split, Rotate, Sign)

- 8 test cases: happy path + error per tool
- Client-side processing verified end-to-end

Refs: PAPYR-160`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify all 8 tests pass
- Proceed to STEP-F2-043

---

## STEP-F2-043: E2E tests untuk server-side tools (7 tools)

**Phase:** Fase 2D — Quality
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-161

### ✅ Prerequisites
- STEP-F2-042 complete
- Backend running locally (`uvicorn main:app --reload`)

### 🎯 Objective
Buat E2E tests untuk 7 server-side tools: Compress, Protect, Unlock, Watermark (image), PDF-to-Image, PDF-to-Word, OCR. Setiap test: navigate, upload, wait for server processing, verify download link.

### 📋 Instructions

1. **Buat `frontend/e2e/server-tools.spec.ts`:**

```typescript
import { test, expect } from '@playwright/test';
import { SAMPLE_PDF, SINGLE_PAGE_PDF, uploadPDF } from './helpers';

test.describe('Compress PDF (Server-side)', () => {
  test('should compress PDF and show download link', async ({ page }) => {
    await page.goto('/compress');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(
      page.locator('a[href*="r2"], button:has-text("Download"), [data-testid="download-button"]')
    ).toBeVisible({ timeout: 30000 });
  });

  test('should show error for non-PDF file', async ({ page }) => {
    await page.goto('/compress');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt', mimeType: 'text/plain', buffer: Buffer.from('not a pdf'),
    });
    await expect(page.locator('text=/tidak valid|invalid|PDF/i')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Protect PDF (Server-side)', () => {
  test('should protect PDF with password', async ({ page }) => {
    await page.goto('/protect');
    await uploadPDF(page, SAMPLE_PDF);
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('test1234');
    const confirmInput = page.locator('input[type="password"]').nth(1);
    if (await confirmInput.isVisible()) await confirmInput.fill('test1234');
    const protectButton = page.locator('button:has-text("Proteksi"), button:has-text("Protect")');
    await protectButton.click();
    await expect(
      page.locator('a[href*="r2"], button:has-text("Download"), [data-testid="download-button"]')
    ).toBeVisible({ timeout: 30000 });
  });

  test('should reject short password', async ({ page }) => {
    await page.goto('/protect');
    await uploadPDF(page, SAMPLE_PDF);
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('ab');
    const protectButton = page.locator('button:has-text("Proteksi"), button:has-text("Protect")');
    const isDisabled = await protectButton.isDisabled();
    expect(isDisabled).toBe(true);
  });
});

test.describe('Unlock PDF (Server-side)', () => {
  test('should show password input after upload', async ({ page }) => {
    await page.goto('/unlock');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.locator('input[type="password"]')).toBeVisible({ timeout: 10000 });
  });

  test('should show error for non-encrypted PDF', async ({ page }) => {
    await page.goto('/unlock');
    await uploadPDF(page, SAMPLE_PDF);
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('anypassword');
    const unlockButton = page.locator('button:has-text("Hapus"), button:has-text("Unlock")');
    await unlockButton.click();
    await expect(
      page.locator('text=/tidak terproteksi|not encrypted|not protected/i')
    ).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Watermark PDF (Server-side)', () => {
  test('should apply text watermark client-side', async ({ page }) => {
    await page.goto('/watermark');
    await uploadPDF(page, SAMPLE_PDF);
    const textInput = page.locator('input[placeholder*="watermark"], input[name*="text"]').first();
    await textInput.fill('CONFIDENTIAL');
    const applyButton = page.locator('button:has-text("Terapkan"), button:has-text("Apply")');
    await applyButton.click();
    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should show watermark configuration panel', async ({ page }) => {
    await page.goto('/watermark');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.locator('text=/Text|Image|Teks|Gambar/i').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('PDF-to-Image (Server-side)', () => {
  test('should convert PDF to images', async ({ page }) => {
    await page.goto('/pdf-to-image');
    await uploadPDF(page, SINGLE_PAGE_PDF);
    await expect(
      page.locator('img[src*="r2"], button:has-text("Download"), [data-testid="image-result"]')
    ).toBeVisible({ timeout: 30000 });
  });

  test('should handle multi-page PDF', async ({ page }) => {
    await page.goto('/pdf-to-image');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.locator('button:has-text("Download"), a[download]')).toBeVisible({ timeout: 30000 });
  });
});

test.describe('PDF-to-Word (Server-side, Async)', () => {
  test('should show processing state and complete', async ({ page }) => {
    await page.goto('/pdf-to-word');
    await uploadPDF(page, SINGLE_PAGE_PDF);
    await expect(
      page.locator('text=/Mengonversi|Converting|Processing|Menunggu/i')
    ).toBeVisible({ timeout: 15000 });
    await expect(
      page.locator('button:has-text("Download"), a[download], a[href*=".docx"]')
    ).toBeVisible({ timeout: 120000 });
  });

  test('should show processing time warning', async ({ page }) => {
    await page.goto('/pdf-to-word');
    await expect(page.locator('text=/waktu|menit|minute/i')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('OCR (Server-side, Async)', () => {
  test('should show language selector', async ({ page }) => {
    await page.goto('/ocr');
    await expect(
      page.locator('select, [role="listbox"], button:has-text("Indonesia")')
    ).toBeVisible({ timeout: 5000 });
  });

  test('should process PDF with OCR', async ({ page }) => {
    await page.goto('/ocr');
    await uploadPDF(page, SINGLE_PAGE_PDF);
    await expect(page.locator('text=/OCR|Processing|Memproses/i')).toBeVisible({ timeout: 15000 });
    await expect(
      page.locator('button:has-text("Download"), a[download]')
    ).toBeVisible({ timeout: 180000 });
  });
});
```

2. **Run tests:**

```bash
cd frontend
npx playwright test e2e/server-tools.spec.ts --project=chromium --timeout=180000
```

### ✅ Definition of Done
- [ ] 14 E2E tests created (2 per server-side tool)
- [ ] All tests pass on chromium with extended timeout

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-043 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `test(fase2): add E2E tests for 7 server-side tools

- Compress, Protect, Unlock, Watermark, PDF-to-Image (sync)
- PDF-to-Word, OCR (async with polling)
- 14 test cases total

Refs: PAPYR-161`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify all 14 tests pass
- Proceed to STEP-F2-044

---

## STEP-F2-044: E2E tests untuk PDF-to-Excel, Image-to-PDF, dan Navigation

**Phase:** Fase 2D — Quality
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-162, PAPYR-163

### ✅ Prerequisites
- STEP-F2-043 complete

### 🎯 Objective
Buat E2E tests untuk PDF-to-Excel (preview + convert), Image-to-PDF (multi-image), dan navigation (landing page 13 cards, navbar, mobile menu, footer).

### 📋 Instructions

1. **Buat `frontend/e2e/hybrid-tools.spec.ts`:**

```typescript
import { test, expect } from '@playwright/test';
import { SAMPLE_PDF, uploadPDF } from './helpers';

test.describe('PDF-to-Excel', () => {
  test('should show table preview or no-tables message after upload', async ({ page }) => {
    await page.goto('/pdf-to-excel');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(
      page.locator('table, text=/tabel|table|Tidak ada tabel/i')
    ).toBeVisible({ timeout: 30000 });
  });

  test('should handle PDF without tables gracefully', async ({ page }) => {
    await page.goto('/pdf-to-excel');
    await uploadPDF(page, SAMPLE_PDF);
    await expect(
      page.locator('text=/Tidak ada tabel|No tables|tidak terdeteksi/i')
    ).toBeVisible({ timeout: 30000 });
  });
});

test.describe('Image-to-PDF', () => {
  test('should convert image to PDF', async ({ page }) => {
    await page.goto('/image-to-pdf');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-image.png', mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64'),
    });
    await expect(page.locator('img[src*="blob"], [class*="preview"]')).toBeVisible({ timeout: 10000 });
    const convertButton = page.locator('button:has-text("Konversi"), button:has-text("Convert")');
    await convertButton.click();
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('should reject non-image files', async ({ page }) => {
    await page.goto('/image-to-pdf');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image'),
    });
    await expect(page.locator('text=/tidak valid|invalid|gambar|image/i')).toBeVisible({ timeout: 5000 });
  });
});
```

2. **Buat `frontend/e2e/navigation.spec.ts`:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('should display all 13 tool cards', async ({ page }) => {
    await page.goto('/');
    const toolKeywords = ['Compress', 'Merge', 'Split', 'Rotate', 'Image', 'Protect', 'Unlock', 'Watermark', 'Sign', 'Word', 'OCR', 'Excel'];
    for (const kw of toolKeywords) {
      await expect(page.locator(`text=/${kw}/i`).first()).toBeVisible();
    }
  });

  test('should navigate to tool page when card is clicked', async ({ page }) => {
    await page.goto('/');
    const compressLink = page.locator('a[href="/compress"]').first();
    await compressLink.click();
    await expect(page).toHaveURL('/compress');
  });
});

test.describe('Navbar', () => {
  test('should show navigation on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible();
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const hamburger = page.locator('button[aria-label*="menu"], button[data-testid="mobile-menu"]');
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await expect(page.locator('text=/Compress|Merge|Split/i').first()).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Footer', () => {
  test('should display footer with links', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer a[href="/privacy"], footer a:has-text("Privacy")')).toBeVisible();
  });
});
```

3. **Run all E2E tests:**

```bash
cd frontend
npx playwright test e2e/ --project=chromium
```

### ✅ Definition of Done
- [ ] PDF-to-Excel: 2 tests (preview + no tables)
- [ ] Image-to-PDF: 2 tests (convert + reject non-image)
- [ ] Navigation: 5 tests (landing cards, click nav, desktop nav, mobile menu, footer)
- [ ] Combined total: ~29-31 E2E tests

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-044 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `test(fase2): add E2E tests for hybrid tools and navigation

- PDF-to-Excel, Image-to-PDF (4 tests)
- Landing page, Navbar, Footer, Mobile menu (5 tests)

Refs: PAPYR-162, PAPYR-163`
- PR target: `develop`

### 🚀 Post-Step Actions
- Run full suite: `npx playwright test`
- Proceed to STEP-F2-045

---

## STEP-F2-045: Setup Prettier untuk frontend

**Phase:** Fase 2D — Quality
**Executor:** AI Agent
**Type:** Infra
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-164

### ✅ Prerequisites
- STEP-F2-044 complete

### 🎯 Objective
Setup Prettier untuk frontend. Config: semi, singleQuote, tabWidth 2, trailingComma all. Format seluruh codebase. Add `npm run format` dan `npm run format:check`.

### 📋 Instructions

1. **Install:**

```bash
cd frontend
npm install --save-dev prettier eslint-config-prettier
```

2. **Buat `frontend/.prettierrc`:**

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

3. **Buat `frontend/.prettierignore`:**

```
node_modules/
.next/
out/
coverage/
dist/
playwright-report/
test-results/
pnpm-lock.yaml
package-lock.json
```

4. **Update ESLint config** — tambahkan `"prettier"` ke extends array.

5. **Update `package.json` scripts:**

```json
{
  "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css}\" \"e2e/**/*.ts\"",
  "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css}\" \"e2e/**/*.ts\""
}
```

6. **Format seluruh codebase:**

```bash
npm run format
npm run format:check
```

### ✅ Definition of Done
- [ ] Prettier installed + configured
- [ ] `npm run format:check` passes (zero issues)
- [ ] ESLint config updated (no conflicts)
- [ ] Seluruh frontend codebase terformat

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-045 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `feat(fase2): setup Prettier for frontend code formatting

- semi, singleQuote, tabWidth 2, trailingComma all
- eslint-config-prettier to prevent conflicts
- Format entire codebase

Refs: PAPYR-164`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify: `npm run format:check` exits 0
- Proceed to STEP-F2-046

---

## STEP-F2-046: Setup Ruff untuk backend

**Phase:** Fase 2D — Quality
**Executor:** AI Agent
**Type:** Infra
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-165

### ✅ Prerequisites
- STEP-F2-045 complete

### 🎯 Objective
Setup Ruff untuk backend Python linting + formatting. Config: line-length 100, rules E/F/I/W/UP/B, target Python 3.11. Format seluruh backend.

### 📋 Instructions

1. **Install:** `pip install ruff`

2. **Buat `backend/ruff.toml`:**

```toml
target-version = "py311"
line-length = 100

[lint]
select = ["E", "F", "I", "W", "UP", "B"]
ignore = ["E501", "B008"]

[lint.isort]
known-first-party = ["routers", "services", "utils"]

[format]
quote-style = "double"
indent-style = "space"
```

3. **Format dan lint:**

```bash
cd backend
ruff format .
ruff check . --fix
ruff check .
ruff format --check .
```

### ✅ Definition of Done
- [ ] Ruff installed + configured
- [ ] `ruff check .` passes (zero errors)
- [ ] `ruff format --check .` passes
- [ ] Seluruh backend terformat

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-046 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `feat(fase2): setup Ruff for backend Python linting/formatting

- line-length 100, Python 3.11, rules E/F/I/W/UP/B
- Format entire backend codebase

Refs: PAPYR-165`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify: `ruff check . && ruff format --check .`
- Proceed to STEP-F2-047

---

## STEP-F2-047: Update CI/CD pipeline (E2E + lint/format checks)

**Phase:** Fase 2D — Quality
**Executor:** AI Agent
**Type:** Deploy
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-166, PAPYR-167
- `.github/workflows/ci.yml` — Current CI config

### ✅ Prerequisites
- STEP-F2-046 complete
- All tests + lint + format passing locally

### 🎯 Objective
Update GitHub Actions: tambah E2E job (setelah build pass), tambah Prettier check di frontend, tambah Ruff check di backend. Upload artifacts on failure.

### 📋 Instructions

1. **Update `.github/workflows/ci.yml`:**

```yaml
name: CI

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  frontend-lint:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint

  frontend-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run test -- --coverage

  frontend-build:
    runs-on: ubuntu-latest
    needs: [frontend-lint, frontend-test]
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_API_URL: http://localhost:8000

  backend-lint:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install ruff
      - run: ruff check .
      - run: ruff format --check .

  backend-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pip install pytest pytest-cov
      - run: pytest --cov=. --cov-report=xml

  e2e:
    runs-on: ubuntu-latest
    needs: [frontend-build, backend-test]
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps chromium
      - name: Generate test fixtures
        run: npx tsx e2e/fixtures/generate-fixtures.ts
      - name: Run E2E tests
        run: npx playwright test --project=chromium
        env:
          NEXT_PUBLIC_API_URL: http://localhost:8000
      - name: Upload artifacts on failure
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: |
            frontend/playwright-report/
            frontend/test-results/
          retention-days: 7
```

### ✅ Definition of Done
- [ ] CI workflow has 6 jobs: frontend-lint, frontend-test, frontend-build, backend-lint, backend-test, e2e
- [ ] E2E job depends on build + backend-test
- [ ] Artifacts uploaded on failure
- [ ] CI passes on push

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-047 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `ci(fase2): add E2E tests and lint/format checks to CI pipeline

- Playwright E2E job (after build + backend tests)
- Prettier format:check in frontend-lint
- Ruff check + format in backend-lint
- Artifact upload on failure

Refs: PAPYR-166, PAPYR-167`
- PR target: `develop`

### 🚀 Post-Step Actions
- Push and verify CI passes
- Proceed to STEP-F2-048

---

## STEP-F2-048: Verify all tests pass + fix flaky tests

**Phase:** Fase 2D — Quality
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-168

### ✅ Prerequisites
- STEP-F2-047 complete (CI workflow pushed)

### 🎯 Objective
Run full CI pipeline. Fix flaky tests. Verify all vitest + pytest + E2E pass. Document test coverage summary.

### 📋 Instructions

1. **Push branch, trigger CI, monitor results.**

2. **Fix common flaky issues** (increase timeouts, add waitFor, stable selectors).

3. **Document coverage** di `frontend/e2e/COVERAGE.md`:

```markdown
# E2E Test Coverage Summary

| Category | Tools | Tests | Status |
|----------|-------|-------|--------|
| Client-side | Merge, Split, Rotate, Sign | 8 | Pass |
| Server-side (sync) | Compress, Protect, Unlock, Watermark, PDF-to-Image | 10 | Pass |
| Server-side (async) | PDF-to-Word, OCR | 4 | Pass |
| Hybrid | Image-to-PDF, PDF-to-Excel | 4 | Pass |
| Navigation | Landing, Navbar, Footer | 5 | Pass |
| **Total** | **13 tools + nav** | **~31** | **All Pass** |
```

4. **Verify final state locally:**

```bash
cd frontend && npm run format:check && npm run lint && npm run test && npx playwright test --project=chromium
cd ../backend && ruff check . && ruff format --check . && pytest
```

### ✅ Definition of Done
- [ ] Full CI pipeline green (all 6 jobs pass)
- [ ] Zero flaky tests
- [ ] Test coverage documented
- [ ] All 13 tools have E2E coverage

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-048 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `test(fase2): verify CI green, fix flaky tests, document coverage

- All E2E tests stable
- Coverage summary documented
- CI pipeline fully operational

Refs: PAPYR-168`
- PR target: `develop`

### 🚀 Post-Step Actions
- CI confirmed green
- Proceed to STEP-F2-049 (M20: Performance)

---
## STEP-F2-049: Lighthouse audit + bundle analysis

**Phase:** Fase 2D — Quality (M20)
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-169

### ✅ Prerequisites
- STEP-F2-048 complete (CI green)

### 🎯 Objective
Run Lighthouse CI pada tool pages. Target: Performance >90, Accessibility >95, SEO >95. Run bundle analyzer untuk identifikasi bundle besar. Dokumentasikan findings.

### 📋 Instructions

1. **Install tools:**

```bash
cd frontend
npm install --save-dev @next/bundle-analyzer @lhci/cli
```

2. **Update `frontend/next.config.ts`** — wrap dengan bundle analyzer:

```typescript
import type { NextConfig } from 'next';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // ... existing config
};

export default withBundleAnalyzer(nextConfig);
```

3. **Run bundle analysis:**

```bash
ANALYZE=true npm run build
```

4. **Buat `frontend/lighthouserc.js`:**

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/compress',
        'http://localhost:3000/merge',
        'http://localhost:3000/protect',
        'http://localhost:3000/pdf-to-word',
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'Ready',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
```

5. **Run Lighthouse:**

```bash
npm run build
npx lhci autorun
```

6. **Document findings** di `frontend/LIGHTHOUSE.md`.

### ✅ Definition of Done
- [ ] Bundle analyzer configured and run
- [ ] Lighthouse CI configured with thresholds
- [ ] Scores documented (Performance >90, A11y >95, SEO >95)
- [ ] Optimization recommendations listed

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-049 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `feat(fase2): add Lighthouse CI and bundle analysis

- @next/bundle-analyzer configured
- Lighthouse CI with performance thresholds
- Audit results documented

Refs: PAPYR-169`
- PR target: `develop`

### 🚀 Post-Step Actions
- Review findings
- Proceed to STEP-F2-050

---

## STEP-F2-050: Performance optimization berdasarkan audit

**Phase:** Fase 2D — Quality (M20)
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-170
- `frontend/LIGHTHOUSE.md` — Audit findings

### ✅ Prerequisites
- STEP-F2-049 complete

### 🎯 Objective
Implementasi optimasi: lazy load tool pages (dynamic import), optimize images (next/image), preload critical fonts, reduce unused JS. Target: LCP < 2.5s, FID < 100ms, CLS < 0.1.

### 📋 Instructions

1. **Lazy load heavy libraries** — pattern untuk semua client-side tool pages:

```typescript
// frontend/src/app/merge/page.tsx (apply pattern to all client tools)
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MergeTool = dynamic(() => import('@/components/tools/MergeTool'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse text-gray-400">Memuat alat...</div>
    </div>
  ),
  ssr: false,
});

export default function MergePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gabungkan PDF</h1>
      <Suspense fallback={<div>Memuat...</div>}>
        <MergeTool />
      </Suspense>
    </main>
  );
}
```

2. **Preload critical font** — verify `frontend/src/app/layout.tsx`:

```typescript
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-dm-sans',
});
```

3. **Optimize images** — ensure all `<img>` tags use `next/image`.

4. **Re-run Lighthouse:**

```bash
npm run build && npx lhci autorun
```

### ✅ Definition of Done
- [ ] Heavy libraries lazy loaded via dynamic import
- [ ] Critical font preloaded with display: swap
- [ ] Images optimized with next/image
- [ ] LCP < 2.5s, Lighthouse Performance >90

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-050 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `perf(fase2): optimize performance based on Lighthouse audit

- Lazy load pdf-lib via dynamic imports
- Preload DM Sans font, display: swap
- Optimize images with next/image

Refs: PAPYR-170`
- PR target: `develop`

### 🚀 Post-Step Actions
- Confirm Lighthouse >90
- Proceed to STEP-F2-051

---

## STEP-F2-051: Setup uptime monitoring (BetterStack) + Telegram alerts

**Phase:** Fase 2D — Quality (M20)
**Executor:** Founder + AI Agent
**Type:** Infra
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-171, PAPYR-172

### ✅ Prerequisites
- STEP-F2-050 complete

### 🎯 Objective
Setup BetterStack (free tier) untuk uptime monitoring. Monitor: frontend, backend health, R2. Setup Telegram bot via BotFather untuk alerts.

### 📋 Instructions

1. **[FOUNDER] Buat Telegram Bot:**
   - Buka @BotFather di Telegram, send `/newbot`
   - Nama: `Papyr Ops Bot`, Username: `PapyrOpsBot`
   - Simpan token, dapatkan chat_id via `/getUpdates`

2. **[FOUNDER] Daftar BetterStack (betterstack.com):**
   - Buat 3 monitors:

   | Monitor | URL | Interval |
   |---------|-----|----------|
   | Frontend | https://mypapyr.com | 3 min |
   | Backend Health | https://papyr-production.up.railway.app/health | 3 min |
   | Backend API | https://papyr-production.up.railway.app/api/compress | 3 min |

3. **[FOUNDER] Setup Telegram integration** di BetterStack Settings.

4. **[AI AGENT] Buat status page** `frontend/src/app/status/page.tsx`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Status - Papyr',
  description: 'Status layanan Papyr.',
  robots: 'noindex',
};

export default function StatusPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Status Layanan</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Frontend (mypapyr.com)</h2>
          <p className="text-green-600">Operational</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">Backend API</h2>
          <p className="text-green-600">Operational</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">File Storage (R2)</h2>
          <p className="text-green-600">Operational</p>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        Monitoring oleh BetterStack. Alert dikirim via Telegram.
      </p>
    </main>
  );
}
```

### ✅ Definition of Done
- [ ] Telegram bot created (@PapyrOpsBot)
- [ ] BetterStack: 3 monitors configured
- [ ] Telegram integration working (test alert received)
- [ ] Status page at /status (noindex)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-051 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `feat(fase2): setup BetterStack monitoring + Telegram alerts

- 3 monitors: frontend, backend health, API
- Telegram bot for alert delivery
- Status page at /status

Refs: PAPYR-171, PAPYR-172`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify alert works
- Proceed to STEP-F2-052

---

## STEP-F2-052: Update landing page grid + Navbar/Footer untuk 13 tools

**Phase:** Fase 2D — Quality (M20)
**Executor:** AI Agent
**Type:** Frontend/SEO
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-173, PAPYR-177

### ✅ Prerequisites
- STEP-F2-051 complete

### 🎯 Objective
Update landing page grid (13 tools), Navbar dropdown (grouped by category), Footer links. Responsive: 3 kolom desktop, 2 tablet, 1 mobile.

### 📋 Instructions

1. **Update landing page** `frontend/src/app/page.tsx` — add all 13 tools:

```typescript
const TOOLS = [
  { name: 'Compress PDF', description: 'Perkecil ukuran file PDF', href: '/compress', icon: '🗜️', category: 'basic' },
  { name: 'Merge PDF', description: 'Gabungkan beberapa PDF jadi satu', href: '/merge', icon: '📎', category: 'basic' },
  { name: 'Split PDF', description: 'Pisahkan halaman dari PDF', href: '/split', icon: '✂️', category: 'basic' },
  { name: 'Rotate PDF', description: 'Putar halaman PDF', href: '/rotate', icon: '🔄', category: 'basic' },
  { name: 'Protect PDF', description: 'Lindungi PDF dengan password', href: '/protect', icon: '🔒', category: 'security' },
  { name: 'Unlock PDF', description: 'Hapus password dari PDF', href: '/unlock', icon: '🔓', category: 'security' },
  { name: 'Watermark PDF', description: 'Tambah watermark ke PDF', href: '/watermark', icon: '💧', category: 'enhancement' },
  { name: 'Sign PDF', description: 'Tanda tangani PDF digital', href: '/sign', icon: '✍️', category: 'enhancement' },
  { name: 'Image to PDF', description: 'Konversi gambar ke PDF', href: '/image-to-pdf', icon: '🖼️', category: 'conversion' },
  { name: 'PDF to Image', description: 'Ekspor PDF ke gambar PNG', href: '/pdf-to-image', icon: '📸', category: 'conversion' },
  { name: 'PDF to Word', description: 'Konversi PDF ke DOCX', href: '/pdf-to-word', icon: '📝', category: 'conversion' },
  { name: 'OCR', description: 'Ubah scan PDF jadi teks', href: '/ocr', icon: '🔍', category: 'conversion' },
  { name: 'PDF to Excel', description: 'Ekstrak tabel ke XLSX', href: '/pdf-to-excel', icon: '📊', category: 'conversion' },
];
```

2. **Update Navbar** `frontend/src/components/Navbar.tsx` — group tools by category:

```typescript
const NAV_CATEGORIES = [
  { label: 'Alat Dasar', tools: [
    { name: 'Compress', href: '/compress' }, { name: 'Merge', href: '/merge' },
    { name: 'Split', href: '/split' }, { name: 'Rotate', href: '/rotate' },
  ]},
  { label: 'Keamanan', tools: [
    { name: 'Protect', href: '/protect' }, { name: 'Unlock', href: '/unlock' },
  ]},
  { label: 'Enhancement', tools: [
    { name: 'Watermark', href: '/watermark' }, { name: 'Sign', href: '/sign' },
  ]},
  { label: 'Konversi', tools: [
    { name: 'Image to PDF', href: '/image-to-pdf' }, { name: 'PDF to Image', href: '/pdf-to-image' },
    { name: 'PDF to Word', href: '/pdf-to-word' }, { name: 'OCR', href: '/ocr' },
    { name: 'PDF to Excel', href: '/pdf-to-excel' },
  ]},
];
```

3. **Update Footer** `frontend/src/components/Footer.tsx` — add all 13 tool links.

### ✅ Definition of Done
- [ ] Landing page: 13 tools in responsive grid (3/2/1 columns)
- [ ] Navbar: tools grouped by category
- [ ] Footer: all 13 tool links
- [ ] Mobile hamburger menu updated

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-052 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `feat(fase2): update landing page, navbar, footer for 13 tools

- 13-tool grid, responsive layout
- Navbar categories: Basic, Security, Enhancement, Conversion
- Footer + mobile menu updated

Refs: PAPYR-173, PAPYR-177`
- PR target: `develop`

### 🚀 Post-Step Actions
- Visual check desktop + mobile
- Proceed to STEP-F2-053

---

## STEP-F2-053: Update sitemap + OG images + analytics taxonomy

**Phase:** Fase 2D — Quality (M20)
**Executor:** AI Agent
**Type:** SEO/Frontend
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-174, PAPYR-175, PAPYR-176

### ✅ Prerequisites
- STEP-F2-052 complete

### 🎯 Objective
Verify sitemap (16 URLs), generate OG images untuk 7 tools baru, verify analytics events tracked for all 13 tools.

### 📋 Instructions

1. **Update `frontend/src/app/sitemap.ts`:**

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://mypapyr.com';
  const tools = [
    'compress', 'merge', 'split', 'rotate', 'image-to-pdf', 'pdf-to-image',
    'protect', 'unlock', 'watermark', 'sign', 'pdf-to-word', 'ocr', 'pdf-to-excel',
  ];
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    ...tools.map((tool) => ({
      url: `${baseUrl}/${tool}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
```

2. **Create OG image placeholders** di `frontend/public/og/` untuk 7 tools baru (protect, unlock, watermark, sign, pdf-to-word, ocr, pdf-to-excel). Each 1200x630 with Papyr branding.

3. **Update analytics helper** `frontend/src/lib/analytics.ts`:

```typescript
export const TOOL_NAMES = [
  'compress', 'merge', 'split', 'rotate', 'image-to-pdf', 'pdf-to-image',
  'protect', 'unlock', 'watermark', 'sign', 'pdf-to-word', 'ocr', 'pdf-to-excel',
] as const;

export type ToolName = typeof TOOL_NAMES[number];

export function trackToolEvent(
  event: 'task_started' | 'task_completed' | 'task_failed',
  toolName: ToolName,
  props?: { file_size_mb?: number; processing_time_ms?: number; device_category?: string; error_type?: string }
) {
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', { name: event, data: { tool_name: toolName, ...props } });
  }
}
```

### ✅ Definition of Done
- [ ] Sitemap: 16 URLs (13 tools + home + privacy + faq)
- [ ] OG images for 7 new tools
- [ ] Analytics helper updated with all 13 tool names
- [ ] Each tool page has proper metadata

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-053 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `feat(fase2): update sitemap, OG images, analytics for all 13 tools

- 16-URL sitemap with priorities
- OG images for 7 new tools
- Analytics taxonomy for 13 tools

Refs: PAPYR-174, PAPYR-175, PAPYR-176`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify /sitemap.xml
- Proceed to STEP-F2-054

---

## STEP-F2-054: Final deploy + smoke test Fase 2D + tag v2.0.0

**Phase:** Fase 2D — Quality (M20)
**Executor:** AI Agent
**Type:** Deploy
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-178

### ✅ Prerequisites
- STEP-F2-053 complete, CI green

### 🎯 Objective
Deploy ke production. Smoke test semua 13 tools. Tag release v2.0.0. Update README + CHANGELOG.

### 📋 Instructions

1. **Merge PR to develop.**

2. **Smoke test production:**

```bash
# All 13 tool pages return 200
for tool in compress merge split rotate image-to-pdf pdf-to-image protect unlock watermark sign pdf-to-word ocr pdf-to-excel; do
  echo "$tool: $(curl -s -o /dev/null -w '%{http_code}' https://mypapyr.com/$tool)"
done

# Backend health
curl -s https://papyr-production.up.railway.app/health

# Sitemap count
curl -s https://mypapyr.com/sitemap.xml | grep -c "<url>"
```

3. **Tag release:**

```bash
git checkout develop && git pull
git tag -a v2.0.0 -m "Fase 2 Complete: 13 tools, E2E, monitoring, SEO"
git push origin v2.0.0
```

4. **Update CHANGELOG.md:**

```markdown
## [2.0.0] - 2026-XX-XX

### Added
- 7 new tools: Protect, Unlock, Watermark, Sign, PDF-to-Word, OCR, PDF-to-Excel
- E2E testing with Playwright (~31 tests)
- Code formatting: Prettier (frontend) + Ruff (backend)
- Uptime monitoring: BetterStack + Telegram alerts
- Performance optimization (Lighthouse >90)
- Landing page grid with 13 tools

### Changed
- CI/CD: E2E, lint, format checks added
- Navbar/Footer updated for 13 tools
- Sitemap expanded to 16 URLs
```

### ✅ Definition of Done
- [ ] Production deploy successful
- [ ] All 13 tools accessible on mypapyr.com
- [ ] Health check OK, monitoring active
- [ ] Sitemap has 16 URLs
- [ ] Release tagged v2.0.0
- [ ] README + CHANGELOG updated

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-054 complete
- Update `README.md` — Fase 2 milestones
- Update `CHANGELOG.md` — v2.0.0

### 🔀 Git Instructions
- Branch: `feature/fase2/quality-monitoring`
- Commit message: `release(fase2): Fase 2D complete, tag v2.0.0

- All 13 tools live, E2E pass, monitoring active
- Fase 2D Quality milestone achieved

Refs: PAPYR-178`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify production stable 24h
- Proceed to STEP-F2-055 (Fase 2E: OpenClaw)

---
## Fase 2E — OpenClaw AI Agent (M21)

---

## STEP-F2-055: Setup VPS & Docker environment

**Phase:** Fase 2E — OpenClaw
**Executor:** Founder + AI Agent
**Type:** Infra
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 3 (Architecture), Section 3.2 (Deployment)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-179

### ✅ Prerequisites
- Fase 2D complete (product stable, v2.0.0 tagged)
- HostData.id VPS account available
- Budget: ~Rp 75.000-150.000/bulan

### 🎯 Objective
Provisioning HostData.id VPS, install Docker + Docker Compose, setup networking, firewall, SSH access. VPS dedicated untuk OpenClaw.

### 📋 Instructions

1. **[FOUNDER] Order VPS di HostData.id:**
   - Paket: 2-4GB RAM, 2 vCPU, 40GB SSD
   - OS: Ubuntu 22.04 LTS, Lokasi: Jakarta
   - Catat IP address + root password

2. **[FOUNDER] Setup SSH:**

```bash
ssh-keygen -t ed25519 -C "papyr-openclaw"
ssh-copy-id root@<VPS_IP>
ssh root@<VPS_IP>
```

3. **[AI AGENT] Install Docker:**

```bash
apt update && apt upgrade -y
apt install -y ca-certificates curl gnupg lsb-release git
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker --version
docker compose version
```

4. **Setup firewall:**

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 4200/tcp
ufw enable
```

5. **Create openclaw user:**

```bash
useradd -m -s /bin/bash openclaw
usermod -aG docker openclaw
mkdir -p /home/openclaw/app/{soul,logs,temp,reports,data}
chown -R openclaw:openclaw /home/openclaw
```

### ✅ Definition of Done
- [ ] VPS provisioned (2-4GB RAM, Ubuntu 22.04)
- [ ] SSH key-based access configured
- [ ] Docker + Docker Compose installed
- [ ] Firewall: SSH + port 4200
- [ ] `openclaw` user with Docker access
- [ ] Directory structure created

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-055 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `infra(fase2): setup VPS and Docker for OpenClaw

- HostData.id VPS provisioned
- Docker + Docker Compose installed
- Firewall + user configured

Refs: PAPYR-179`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify Docker: `docker run --rm hello-world`
- Proceed to STEP-F2-056

---

## STEP-F2-056: Setup PostgreSQL + Redis containers

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Infra
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 3.3 (Docker Compose), Section 20 (Database Schema)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-180

### ✅ Prerequisites
- STEP-F2-055 complete

### 🎯 Objective
Setup PostgreSQL 16 + Redis 7 Docker containers. Create schema `openclaw`, run initial migration.

### 📋 Instructions

1. **Buat `.env.openclaw`** di VPS:

```bash
POSTGRES_PASSWORD=<generate-strong-password>
REDIS_PASSWORD=<generate-strong-password>
```

2. **Buat `docker-compose.db.yml`:**

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: openclaw-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD} --maxmemory 64mb --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    networks:
      - openclaw-internal
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 128M

  postgres:
    image: postgres:16-alpine
    container_name: openclaw-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=openclaw
      - POSTGRES_USER=openclaw
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/01-init.sql
    networks:
      - openclaw-internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U openclaw"]
      interval: 10s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 256M

networks:
  openclaw-internal:
    driver: bridge

volumes:
  redis-data:
  postgres-data:
```

3. **Buat `init-db.sql`** — full schema (semua 17 tables dari OpenClaw spec Section 20):

```sql
CREATE SCHEMA IF NOT EXISTS openclaw;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
SET search_path TO openclaw, public;

CREATE TABLE openclaw.oc_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id VARCHAR(255),
  details JSONB DEFAULT '{}',
  severity VARCHAR(20) DEFAULT 'info',
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_agent ON openclaw.oc_audit_logs(agent);
CREATE INDEX idx_audit_created ON openclaw.oc_audit_logs(created_at DESC);

CREATE TABLE openclaw.oc_agent_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent VARCHAR(50) NOT NULL,
  task_type VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'medium',
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  tokens_used INTEGER DEFAULT 0,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tasks_status ON openclaw.oc_agent_tasks(status);
CREATE INDEX idx_tasks_created ON openclaw.oc_agent_tasks(created_at DESC);

CREATE TABLE openclaw.oc_scheduled_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name VARCHAR(100) NOT NULL UNIQUE,
  cron_expression VARCHAR(50) NOT NULL,
  agent VARCHAR(50) NOT NULL,
  task_type VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  last_status VARCHAR(20),
  next_run_at TIMESTAMPTZ,
  run_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(30) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  metrics JSONB DEFAULT '{}',
  period_start DATE,
  period_end DATE,
  generated_by VARCHAR(50) NOT NULL,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_token_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent VARCHAR(50) NOT NULL,
  function_name VARCHAR(100) NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_idr INTEGER NOT NULL DEFAULT 0,
  model VARCHAR(100),
  latency_ms INTEGER,
  cached BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_token_agent ON openclaw.oc_token_usage(agent);

CREATE TABLE openclaw.oc_security_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_type VARCHAR(50) NOT NULL,
  target VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'running',
  findings JSONB DEFAULT '[]',
  critical_count INTEGER DEFAULT 0,
  high_count INTEGER DEFAULT 0,
  medium_count INTEGER DEFAULT 0,
  low_count INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE openclaw.oc_backup_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type VARCHAR(30) NOT NULL,
  target VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'running',
  file_path VARCHAR(500),
  file_size_bytes BIGINT,
  checksum VARCHAR(64),
  storage_location VARCHAR(50) NOT NULL,
  verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE openclaw.oc_seo_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(300) NOT NULL UNIQUE,
  primary_keyword VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  meta_description VARCHAR(160),
  word_count INTEGER NOT NULL DEFAULT 0,
  seo_score DECIMAL(5,2),
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  published_url VARCHAR(500),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_seo_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES openclaw.oc_seo_articles(id),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0,
  avg_position DECIMAL(5,2),
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_competitor_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_name VARCHAR(100) NOT NULL,
  competitor_url VARCHAR(500) NOT NULL,
  snapshot_data JSONB NOT NULL DEFAULT '{}',
  features JSONB DEFAULT '[]',
  pricing JSONB DEFAULT '{}',
  changes_detected JSONB DEFAULT '[]',
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_date DATE NOT NULL,
  keyword VARCHAR(255) NOT NULL,
  content_type VARCHAR(50) NOT NULL,
  target_word_count INTEGER DEFAULT 1500,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  article_id UUID REFERENCES openclaw.oc_seo_articles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_analytics_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_type VARCHAR(50) NOT NULL,
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  impact_level VARCHAR(20) DEFAULT 'medium',
  recommendation TEXT,
  actioned BOOLEAN DEFAULT false,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_soul_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name VARCHAR(100) NOT NULL,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  commit_hash VARCHAR(40),
  change_summary TEXT,
  changed_by VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_feedback_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(30) NOT NULL,
  category VARCHAR(50),
  content TEXT NOT NULL,
  sentiment VARCHAR(20),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'new',
  ai_analysis JSONB DEFAULT '{}',
  github_issue_number INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent VARCHAR(50) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  risk_level VARCHAR(20) NOT NULL DEFAULT 'medium',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  responded_at TIMESTAMPTZ,
  response VARCHAR(20),
  expires_at TIMESTAMPTZ NOT NULL,
  telegram_message_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE openclaw.oc_social_media_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL DEFAULT 'twitter',
  content_type VARCHAR(30) NOT NULL,
  content TEXT NOT NULL,
  thread_tweets JSONB DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  posted_at TIMESTAMPTZ,
  engagement JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

4. **Start containers:**

```bash
cd /home/openclaw/app
docker compose -f docker-compose.db.yml --env-file .env.openclaw up -d
```

5. **Verify:**

```bash
docker exec openclaw-postgres psql -U openclaw -d openclaw -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'openclaw';"
docker exec openclaw-redis redis-cli -a $REDIS_PASSWORD ping
```

### ✅ Definition of Done
- [ ] PostgreSQL 16 running, schema `openclaw` created
- [ ] 17 tables created with indexes
- [ ] Redis 7 running with password auth
- [ ] Both containers healthy (healthcheck passing)
- [ ] Data persisted via Docker volumes

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-056 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `infra(fase2): setup PostgreSQL + Redis for OpenClaw

- PostgreSQL 16 with 17-table schema
- Redis 7 with password auth
- Docker Compose with healthchecks

Refs: PAPYR-180`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify both containers healthy
- Proceed to STEP-F2-057

---

## STEP-F2-057: Core Framework scaffold (TypeScript + BullMQ + LLM client)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 3.5 (Tech Stack), Section 3.6 (Project Structure), Section 3.7 (LLM Client), Section 3.8 (Event Bus)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-181

### ✅ Prerequisites
- STEP-F2-056 complete (PostgreSQL + Redis running)

### 🎯 Objective
Scaffold OpenClaw project: TypeScript, BullMQ event bus, LLM client (enowxAI), persona manager, decision engine. Full project structure sesuai spec Section 3.6.

### 📋 Instructions

1. **Initialize project:**

```bash
mkdir -p /home/openclaw/app/openclaw
cd /home/openclaw/app/openclaw
npm init -y
npm install typescript @types/node tsx
npx tsc --init --target ES2022 --module NodeNext --moduleResolution NodeNext --outDir dist --rootDir src --strict true --esModuleInterop true
```

2. **Install dependencies:**

```bash
npm install bullmq ioredis drizzle-orm postgres pino pino-pretty grammy @aws-sdk/client-s3 simple-git node-cron commander chalk zod dotenv
npm install --save-dev vitest @types/node tsx drizzle-kit
```

3. **Create project structure:**

```bash
mkdir -p src/{config,core,agents/{seo,competitor,health,security,reporting,self-improvement,project-management,backup,analytics,social-media},interfaces/{dashboard,telegram,cli},database/migrations,integrations,utils,types}
mkdir -p soul tests/{unit,integration,e2e}
```

4. **Buat `src/config/env.ts`:**

```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.openclaw' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  OPENCLAW_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(4200),

  // Database
  POSTGRES_HOST: z.string().default('localhost'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_DB: z.string().default('openclaw'),
  POSTGRES_USER: z.string().default('openclaw'),
  POSTGRES_PASSWORD: z.string(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string(),

  // LLM
  ENOWXAI_API_KEY: z.string(),
  ENOWXAI_BASE_URL: z.string().default('https://api.enowx.com'),
  ENOWXAI_DEFAULT_MODEL: z.string().default('default'),

  // Telegram
  TELEGRAM_BOT_TOKEN: z.string(),
  TELEGRAM_FOUNDER_CHAT_ID: z.string(),

  // External APIs
  VERCEL_TOKEN: z.string().optional(),
  VERCEL_PROJECT_ID: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BACKUP_BUCKET: z.string().default('papyr-openclaw'),
  RESEND_API_KEY: z.string().optional(),
  BACKUP_ENCRYPTION_KEY: z.string().optional(),

  // Papyr
  PAPYR_FRONTEND_URL: z.string().default('https://mypapyr.com'),
  PAPYR_BACKEND_URL: z.string().default('https://papyr-production.up.railway.app'),
  PAPYR_REPO_PATH: z.string().default('/home/openclaw/papyr'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

5. **Buat `src/core/llm-client.ts`** — copy full implementation dari OpenClaw spec Section 3.7 (LLMClient class dengan retry, token tracking, cost calculation).

6. **Buat `src/core/event-bus.ts`** — copy full implementation dari OpenClaw spec Section 3.8 (EventBus class dengan BullMQ queues, workers, handlers).

7. **Buat `src/utils/retry.ts`** — copy withRetry utility dari spec.

8. **Buat `src/core/persona-manager.ts`** — copy dari spec Section 16.2 (10 persona configs + switching).

9. **Buat `src/utils/logger.ts`:**

```typescript
import pino from 'pino';
import { env } from '../config/env';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
  base: { service: 'openclaw' },
});
```

10. **Buat `src/main.ts`:**

```typescript
import { logger } from './utils/logger';
import { env } from './config/env';

async function main() {
  logger.info({ port: env.PORT, env: env.OPENCLAW_ENV }, 'OpenClaw starting...');

  // Initialize components (will be expanded in subsequent steps)
  logger.info('OpenClaw daemon started successfully');
}

main().catch((error) => {
  logger.fatal({ error }, 'OpenClaw failed to start');
  process.exit(1);
});
```

11. **Buat `healthcheck.js`:**

```javascript
const http = require('http');
const options = { hostname: 'localhost', port: 4200, path: '/health', timeout: 5000 };
const req = http.request(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});
req.on('error', () => process.exit(1));
req.on('timeout', () => { req.destroy(); process.exit(1); });
req.end();
```

12. **Verify build:**

```bash
npx tsc --noEmit
npx tsx src/main.ts
```

### ✅ Definition of Done
- [ ] TypeScript project scaffolded with full directory structure
- [ ] All dependencies installed (BullMQ, Drizzle, grammy, Playwright, etc.)
- [ ] Environment config validated with Zod
- [ ] LLM client implemented (enowxAI, retry, token tracking)
- [ ] Event bus implemented (BullMQ, 11 queues)
- [ ] Persona manager implemented (10 personas)
- [ ] Logger configured (Pino)
- [ ] Main entry point boots without errors
- [ ] TypeScript compiles without errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-057 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): scaffold OpenClaw core framework

- TypeScript project with BullMQ event bus
- LLM client (enowxAI API, retry, cost tracking)
- Persona manager (10 personas)
- Zod env validation, Pino logger

Refs: PAPYR-181`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify: `npx tsc --noEmit` passes
- Proceed to STEP-F2-058

---

## STEP-F2-058: Database schema + Drizzle ORM + migrations

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 20 (Database Schema)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-198

### ✅ Prerequisites
- STEP-F2-057 complete

### 🎯 Objective
Implement Drizzle ORM schema matching all 17 PostgreSQL tables. Setup migration scripts and seed data.

### 📋 Instructions

1. **Buat `src/database/schema.ts`:**

```typescript
import { pgSchema, uuid, varchar, text, integer, boolean, timestamp, date, jsonb, decimal, bigint, index } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env';

export const openclaw = pgSchema('openclaw');

export const auditLogs = openclaw.table('oc_audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  agent: varchar('agent', { length: 50 }).notNull(),
  action: varchar('action', { length: 100 }).notNull(),
  targetType: varchar('target_type', { length: 50 }),
  targetId: varchar('target_id', { length: 255 }),
  details: jsonb('details').default({}),
  severity: varchar('severity', { length: 20 }).default('info'),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const agentTasks = openclaw.table('oc_agent_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  agent: varchar('agent', { length: 50 }).notNull(),
  taskType: varchar('task_type', { length: 100 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  priority: varchar('priority', { length: 20 }).default('medium'),
  input: jsonb('input').default({}),
  output: jsonb('output').default({}),
  error: text('error'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  durationMs: integer('duration_ms'),
  tokensUsed: integer('tokens_used').default(0),
  retryCount: integer('retry_count').default(0),
  maxRetries: integer('max_retries').default(3),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tokenUsage = openclaw.table('oc_token_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  agent: varchar('agent', { length: 50 }).notNull(),
  functionName: varchar('function_name', { length: 100 }).notNull(),
  promptTokens: integer('prompt_tokens').notNull().default(0),
  completionTokens: integer('completion_tokens').notNull().default(0),
  totalTokens: integer('total_tokens').notNull().default(0),
  estimatedCostIdr: integer('estimated_cost_idr').notNull().default(0),
  model: varchar('model', { length: 100 }),
  latencyMs: integer('latency_ms'),
  cached: boolean('cached').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ... (remaining 14 tables follow same pattern from init-db.sql)

const connectionString = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;
const client = postgres(connectionString);
export const db = drizzle(client, { schema: { auditLogs, agentTasks, tokenUsage } });
export type Database = typeof db;
```

2. **Buat `drizzle.config.ts`:**

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://openclaw:password@localhost:5432/openclaw',
  },
} satisfies Config;
```

3. **Generate and run migration:**

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

### ✅ Definition of Done
- [ ] Drizzle ORM schema matches all 17 tables
- [ ] Database connection working
- [ ] Migrations generated and applied
- [ ] TypeScript types auto-generated from schema

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-058 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Drizzle ORM schema for OpenClaw

- 17 tables matching PostgreSQL schema
- Migration scripts generated
- Database connection configured

Refs: PAPYR-198`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify schema: `npx drizzle-kit push`
- Proceed to STEP-F2-059

---

## STEP-F2-059: SOUL.md + HEARTBEAT.md implementation

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 14 (SOUL.md), Section 15 (HEARTBEAT.md)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-182

### ✅ Prerequisites
- STEP-F2-058 complete

### 🎯 Objective
Implement SOUL.md parser, HEARTBEAT.md scheduler, persona switching, cron job registration. These files define OpenClaw's identity and schedule.

### 📋 Instructions

1. **Buat `soul/SOUL.md`** — copy full template dari OpenClaw spec Section 14.1 (identity, personality, personas, boundaries, tool permissions).

2. **Buat `soul/HEARTBEAT.md`** — copy full template dari OpenClaw spec Section 15.1 (all cron schedules for 10 agents).

3. **Buat `src/core/soul-parser.ts`:**

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from 'pino';

interface SoulConfig {
  identity: { name: string; version: string; owner: string; purpose: string };
  personas: Record<string, { role: string; tone: string; temperature: number; emoji: string; rules: string[] }>;
  boundaries: { allowed: string[]; requiresApproval: string[]; neverAllowed: string[] };
  toolPermissions: Record<string, Record<string, string>>;
}

export class SoulParser {
  private config: SoulConfig | null = null;
  private readonly soulPath: string;
  private readonly logger: Logger;

  constructor(logger: Logger, soulDir = path.join(process.cwd(), 'soul')) {
    this.soulPath = path.join(soulDir, 'SOUL.md');
    this.logger = logger.child({ component: 'soul-parser' });
  }

  async load(): Promise<SoulConfig> {
    const content = await fs.readFile(this.soulPath, 'utf8');
    this.config = this.parse(content);
    this.logger.info({ personas: Object.keys(this.config.personas).length }, 'SOUL.md loaded');
    return this.config;
  }

  private parse(content: string): SoulConfig {
    // Parse markdown sections into structured config
    const sections = content.split(/^## /m).filter(Boolean);
    return {
      identity: { name: 'OpenClaw Papyr', version: '1.0.0', owner: 'Papyr', purpose: 'Autonomous AI agent' },
      personas: this.parsePersonas(sections),
      boundaries: this.parseBoundaries(sections),
      toolPermissions: {},
    };
  }

  private parsePersonas(sections: string[]): SoulConfig['personas'] {
    // Extract persona configs from SOUL.md markdown
    return {
      aksara: { role: 'SEO Writer', tone: 'Ramah, edukatif', temperature: 0.7, emoji: '✍️', rules: ['Max 2 mention Papyr per artikel'] },
      tinta: { role: 'Reporter', tone: 'Professional, narrative', temperature: 0.5, emoji: '📊', rules: ['Include actionable recommendations'] },
      pena: { role: 'Security Scanner', tone: 'Paranoid, thorough', temperature: 0.1, emoji: '🔒', rules: ['Alert all critical CVEs'] },
      kertas: { role: 'Health Monitor', tone: 'Vigilant, urgent', temperature: 0.1, emoji: '🏥', rules: ['Auto-remediate if safe'] },
      lontar: { role: 'Self-Improvement', tone: 'Reflective, cautious', temperature: 0.3, emoji: '🧠', rules: ['Max 3 modifications per day'] },
      dalang: { role: 'Project Management', tone: 'Analytical, strategic', temperature: 0.4, emoji: '🎭', rules: ['Bug fixes before features'] },
      pustaka: { role: 'Backup Agent', tone: 'Meticulous, reliable', temperature: 0.1, emoji: '📚', rules: ['Verify every backup'] },
      prasasti: { role: 'Analytics Intelligence', tone: 'Storytelling, insightful', temperature: 0.5, emoji: '📈', rules: ['Use z-score for anomalies'] },
      dawat: { role: 'Competitor Monitor', tone: 'Investigative, objective', temperature: 0.5, emoji: '🔍', rules: ['Focus on actionable insights'] },
      kicau: { role: 'Social Media', tone: 'Friendly, casual Indonesian', temperature: 0.7, emoji: '🐦', rules: ['Max 5 tweets/day'] },
    };
  }

  private parseBoundaries(sections: string[]): SoulConfig['boundaries'] {
    return {
      allowed: ['Publish blog articles', 'Restart services', 'Auto-patch dependencies', 'Create GitHub issues', 'Send reports'],
      requiresApproval: ['Delete production data', 'Major version updates', 'Modify security boundaries'],
      neverAllowed: ['Access user files', 'Share internal data', 'Disable security', 'Expose API keys'],
    };
  }

  getConfig(): SoulConfig {
    if (!this.config) throw new Error('SOUL.md not loaded');
    return this.config;
  }
}
```

4. **Buat `src/core/heartbeat-scheduler.ts`:**

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import * as cron from 'node-cron';
import { Logger } from 'pino';
import { EventBus } from './event-bus';

interface ScheduleEntry {
  name: string;
  cron: string;
  agent: string;
  priority: string;
  timeout: number;
}

export class HeartbeatScheduler {
  private schedules: ScheduleEntry[] = [];
  private cronJobs: Map<string, cron.ScheduledTask> = new Map();
  private readonly heartbeatPath: string;
  private readonly logger: Logger;
  private readonly eventBus: EventBus;

  constructor(logger: Logger, eventBus: EventBus, soulDir = path.join(process.cwd(), 'soul')) {
    this.heartbeatPath = path.join(soulDir, 'HEARTBEAT.md');
    this.logger = logger.child({ component: 'heartbeat' });
    this.eventBus = eventBus;
  }

  async load(): Promise<void> {
    const content = await fs.readFile(this.heartbeatPath, 'utf8');
    this.schedules = this.parseSchedules(content);
    this.logger.info({ scheduleCount: this.schedules.length }, 'HEARTBEAT.md loaded');
  }

  async startAll(): Promise<void> {
    for (const schedule of this.schedules) {
      if (!cron.validate(schedule.cron)) {
        this.logger.warn({ name: schedule.name, cron: schedule.cron }, 'Invalid cron expression');
        continue;
      }
      const job = cron.schedule(schedule.cron, async () => {
        this.logger.info({ task: schedule.name, agent: schedule.agent }, 'Scheduled task triggered');
        await this.eventBus.emit(`${schedule.agent}:scheduled_task` as any, {
          taskName: schedule.name, agent: schedule.agent, priority: schedule.priority,
        });
      }, { timezone: 'Asia/Jakarta' });
      this.cronJobs.set(schedule.name, job);
    }
    this.logger.info({ activeJobs: this.cronJobs.size }, 'All cron jobs started');
  }

  async stopAll(): Promise<void> {
    for (const [name, job] of this.cronJobs) {
      job.stop();
    }
    this.cronJobs.clear();
    this.logger.info('All cron jobs stopped');
  }

  private parseSchedules(content: string): ScheduleEntry[] {
    const entries: ScheduleEntry[] = [];
    const regex = /(\w+\.\w+):\s*\n\s*cron:\s*"([^"]+)"\s*\n\s*priority:\s*(\w+)\s*\n\s*timeout:\s*(\d+)s/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const [, name, cronExpr, priority, timeout] = match;
      const agent = name.split('.')[0];
      entries.push({ name, cron: cronExpr, agent, priority, timeout: parseInt(timeout) * 1000 });
    }
    return entries;
  }

  getSchedules(): ScheduleEntry[] { return [...this.schedules]; }
}
```

### ✅ Definition of Done
- [ ] `soul/SOUL.md` created with full identity, personas, boundaries
- [ ] `soul/HEARTBEAT.md` created with all cron schedules
- [ ] SOUL parser extracts persona configs
- [ ] HEARTBEAT scheduler registers cron jobs
- [ ] All 10 agent schedules parsed correctly

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-059 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement SOUL.md + HEARTBEAT.md system

- SOUL.md: identity, 10 personas, boundaries, permissions
- HEARTBEAT.md: cron schedules for all agents
- Parser + scheduler implementation

Refs: PAPYR-182`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify schedules parse correctly
- Proceed to STEP-F2-060

---
## STEP-F2-060: Agent: SEO Pipeline (Aksara)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 4 (SEO Pipeline, full implementation)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-183

### ✅ Prerequisites
- STEP-F2-059 complete (SOUL + HEARTBEAT)

### 🎯 Objective
Implement SEO Pipeline agent (Aksara): keyword research, 4-gate content pipeline, blog publisher, performance tracker. Menghasilkan 2-4 artikel/minggu secara otonom.

### 📋 Instructions

1. **Buat `src/agents/seo/index.ts`** — agent entry point yang orchestrate keyword research, content generation, quality gates, publishing.

2. **Buat `src/agents/seo/keyword-research.ts`** — LLM-powered keyword research untuk PDF tools Indonesia.

3. **Buat `src/agents/seo/content-generator.ts`** — article generation dengan Aksara persona.

4. **Buat `src/agents/seo/quality-gates.ts`** — copy full 4-gate implementation dari OpenClaw spec Section 4.5 (Writer, Fact Check, SEO/Uniqueness, Brand/Tone).

5. **Buat `src/agents/seo/publisher.ts`** — copy implementation dari spec Section 4.6 (R2 upload, Blog API, GSC submit, performance scheduling).

6. **Buat `src/agents/seo/performance-tracker.ts`** — Day 7 post-publish check (indexed?, CTR, position).

Semua code snippets tersedia lengkap di OpenClaw spec Section 4. Copy dan adapt sesuai project structure.

### ✅ Definition of Done
- [ ] Keyword research generates relevant PDF tool keywords
- [ ] 4-gate content pipeline produces quality articles
- [ ] Publisher uploads to R2 and submits to GSC
- [ ] Performance tracker checks Day 7 metrics
- [ ] Cron schedule: keyword research Sunday 22:00, generation Tue/Thu 02:00, publish Tue/Thu 07:00

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-060 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement SEO Pipeline agent (Aksara)

- 4-gate content pipeline (Writer, Fact Check, SEO, Brand)
- Keyword research, publisher, performance tracker
- Scheduled: 2-4 articles/week

Refs: PAPYR-183`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test keyword research manually
- Proceed to STEP-F2-061

---

## STEP-F2-061: Agent: Competitor Monitoring (Telik/Dawat)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 5 (Competitor Monitoring)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-184

### ✅ Prerequisites
- STEP-F2-060 complete

### 🎯 Objective
Implement Competitor Monitoring agent: Playwright scraper untuk 5 competitors (iLovePDF, SmallPDF, PDF24, Stirling PDF, Adobe), change detection, weekly report.

### 📋 Instructions

1. **Buat `src/agents/competitor/index.ts`** — agent orchestrator.

2. **Buat `src/agents/competitor/scraper.ts`** — copy full Playwright scraper dari spec Section 5.3 (5 competitors, feature extraction, pricing scrape).

3. **Buat `src/agents/competitor/change-detector.ts`** — copy from spec Section 5.4 (pricing changes, feature changes, critical alerts).

4. **Buat `src/agents/competitor/analyzer.ts`** — LLM-powered analysis dan weekly report generation.

### ✅ Definition of Done
- [ ] Playwright scrapes 5 competitors successfully
- [ ] Change detection compares current vs previous snapshots
- [ ] Weekly report generated in Bahasa Indonesia
- [ ] Critical changes trigger immediate Telegram alert
- [ ] Schedule: Saturday 10:00 WIB

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-061 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Competitor Monitoring agent (Telik)

- Playwright scraper for 5 competitors
- Change detection (pricing, features)
- Weekly report generation

Refs: PAPYR-184`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test scraper on one competitor
- Proceed to STEP-F2-062

---

## STEP-F2-062: Agent: Server Health Monitoring (Jaga/Kertas)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 6 (Server Health)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-185

### ✅ Prerequisites
- STEP-F2-061 complete

### 🎯 Objective
Implement Server Health agent: Railway/Vercel/R2 monitoring, health checks every 60s, auto-remediation, alerting.

### 📋 Instructions

1. **Buat `src/agents/health/index.ts`** — orchestrator yang runs health checks dan triggers alerts.

2. **Buat `src/agents/health/railway-monitor.ts`** — copy from spec Section 6.3 (health endpoint check, p95 calculation, status determination).

3. **Buat `src/agents/health/vercel-monitor.ts`** — copy from spec Section 6.4 (page check, deployment status, edge latency).

4. **Buat `src/agents/health/r2-monitor.ts`** — copy from spec Section 6.5 (bucket check, storage usage, stale objects).

5. **Buat `src/agents/health/auto-remediation.ts`:**

```typescript
import { Logger } from 'pino';

interface RemediationAction {
  target: string;
  action: 'restart' | 'redeploy' | 'clear_cache' | 'alert_only';
  reason: string;
  safe: boolean;
}

export class AutoRemediation {
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger.child({ component: 'auto-remediation' });
  }

  async execute(action: RemediationAction): Promise<{ success: boolean; details: string }> {
    if (!action.safe) {
      this.logger.warn({ action }, 'Unsafe action, alerting only');
      return { success: false, details: 'Action deemed unsafe, alert sent instead' };
    }

    this.logger.info({ target: action.target, action: action.action }, 'Executing remediation');

    switch (action.action) {
      case 'restart':
        return this.restartService(action.target);
      case 'redeploy':
        return this.redeployService(action.target);
      case 'clear_cache':
        return this.clearCache(action.target);
      default:
        return { success: true, details: 'Alert sent' };
    }
  }

  private async restartService(target: string): Promise<{ success: boolean; details: string }> {
    // Railway restart via API
    this.logger.info({ target }, 'Restarting service');
    return { success: true, details: `Service ${target} restart initiated` };
  }

  private async redeployService(target: string): Promise<{ success: boolean; details: string }> {
    this.logger.info({ target }, 'Redeploying service');
    return { success: true, details: `Service ${target} redeploy initiated` };
  }

  private async clearCache(target: string): Promise<{ success: boolean; details: string }> {
    this.logger.info({ target }, 'Clearing cache');
    return { success: true, details: `Cache cleared for ${target}` };
  }
}
```

6. **Buat `src/agents/health/alerter.ts`** — Telegram alert formatting dan delivery.

### ✅ Definition of Done
- [ ] Railway health check working (response time, p95)
- [ ] Vercel monitor working (page check, deploy status)
- [ ] R2 monitor working (storage usage, stale objects)
- [ ] Auto-remediation for safe actions (restart, redeploy, clear cache)
- [ ] Telegram alerts for critical issues
- [ ] Schedule: every 5 minutes (health), every 10 minutes (vercel/railway)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-062 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Server Health agent (Jaga)

- Railway, Vercel, R2 monitoring
- Auto-remediation (restart, redeploy, cache clear)
- Telegram alerting for critical issues

Refs: PAPYR-185`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test health check against production endpoints
- Proceed to STEP-F2-063

---

## STEP-F2-063: Agent: Security Scanning (Tameng/Pena)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 7 (Security Scanning)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-186

### ✅ Prerequisites
- STEP-F2-062 complete

### 🎯 Objective
Implement Security Scanning agent: npm/pip audit, CVE scanner, secret detection, OWASP check, GitHub issue creation for findings.

### 📋 Instructions

1. **Buat `src/agents/security/index.ts`** — orchestrator.
2. **Buat `src/agents/security/dependency-audit.ts`** — run `npm audit` dan `pip-audit`, parse results.
3. **Buat `src/agents/security/cve-scanner.ts`** — check known CVEs against installed packages.
4. **Buat `src/agents/security/secret-detector.ts`** — scan codebase for leaked secrets (regex patterns).
5. **Buat `src/agents/security/owasp-scanner.ts`** — basic OWASP header checks on production URLs.

### ✅ Definition of Done
- [ ] Dependency audit runs for both frontend (npm) and backend (pip)
- [ ] CVE scanner checks against known vulnerabilities
- [ ] Secret detector scans for API keys, passwords in code
- [ ] OWASP header check on production URLs
- [ ] Findings stored in oc_security_scans table
- [ ] Critical findings create GitHub issues automatically
- [ ] Schedule: daily 01:00 (audit), daily 02:00 (secrets), weekly Saturday (report)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-063 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Security Scanning agent (Tameng)

- npm/pip dependency audit
- CVE scanner, secret detection, OWASP checks
- Auto-create GitHub issues for critical findings

Refs: PAPYR-186`
- PR target: `develop`

### 🚀 Post-Step Actions
- Run security scan manually
- Proceed to STEP-F2-064

---

## STEP-F2-064: Agent: Reporting (Warta/Tinta)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 8 (Reporting)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-187

### ✅ Prerequisites
- STEP-F2-063 complete

### 🎯 Objective
Implement Reporting agent: daily/weekly/monthly report generation, Telegram + Email distribution, R2 archival.

### 📋 Instructions

1. **Buat `src/agents/reporting/index.ts`** — orchestrator.
2. **Buat `src/agents/reporting/daily-report.ts`** — aggregate data from all agents, generate daily summary.
3. **Buat `src/agents/reporting/weekly-report.ts`** — weekly trends, comparisons, recommendations.
4. **Buat `src/agents/reporting/monthly-report.ts`** — monthly overview with charts data.
5. **Buat `src/agents/reporting/formatters.ts`** — Telegram markdown formatting, HTML email templates.

### ✅ Definition of Done
- [ ] Daily report generated at 22:00 WIB
- [ ] Weekly report generated Friday evening
- [ ] Monthly report generated end of month
- [ ] Reports sent via Telegram
- [ ] Reports archived to R2
- [ ] Reports stored in oc_reports table

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-064 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Reporting agent (Warta)

- Daily, weekly, monthly report generation
- Telegram distribution, R2 archival
- LLM-powered narrative insights

Refs: PAPYR-187`
- PR target: `develop`

### 🚀 Post-Step Actions
- Generate test daily report
- Proceed to STEP-F2-065

---

## STEP-F2-065: Agent: Self-Improvement (Lontar/Nalar)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 9 (Self-Improvement)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-188

### ✅ Prerequisites
- STEP-F2-064 complete

### 🎯 Objective
Implement Self-Improvement agent: Evaluate, Analyze, Hypothesize, Commit, Modify, Monitor, Decide cycle. Rollback safety. Max 3 modifications/day.

### 📋 Instructions

1. **Buat `src/agents/self-improvement/index.ts`** — orchestrator with 7-step cycle.
2. **Buat `src/agents/self-improvement/evaluator.ts`** — copy from spec Section 9.5 (collect metrics, compare baselines, detect issues, generate hypothesis, apply modification).
3. **Buat `src/agents/self-improvement/modifier.ts`** — safe file modification with git commit.
4. **Buat `src/agents/self-improvement/rollback.ts`** — auto-rollback if degradation > 10%.

### ✅ Definition of Done
- [ ] 7-step improvement cycle implemented
- [ ] Git commit before every modification
- [ ] Auto-rollback on degradation
- [ ] Max 3 modifications per day enforced
- [ ] Only modifies SOUL.md and HEARTBEAT.md (not code)
- [ ] Schedule: every 6 hours (evaluate), every 4 hours (rollback check)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-065 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Self-Improvement agent (Lontar)

- 7-step improvement cycle
- Git-based rollback safety
- Max 3 modifications/day

Refs: PAPYR-188`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify rollback mechanism
- Proceed to STEP-F2-066

---

## STEP-F2-066: Agent: Project Management (Dalang/Kelola)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 10 (Project Management)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-189

### ✅ Prerequisites
- STEP-F2-065 complete

### 🎯 Objective
Implement PM agent: feedback processing, GitHub issue creation (Octokit), sprint planning, velocity tracking, tech debt scanning.

### 📋 Instructions

1. **Buat `src/agents/project-management/index.ts`** — orchestrator.
2. **Buat `src/agents/project-management/feedback-processor.ts`** — copy from spec Section 10.3 (classify, deduplicate, create issue, notify).
3. **Buat `src/agents/project-management/issue-creator.ts`** — Octokit integration for GitHub issues.
4. **Buat `src/agents/project-management/sprint-planner.ts`** — copy from spec Section 10.4.
5. **Buat `src/agents/project-management/velocity-tracker.ts`** — track sprint velocity.
6. **Buat `src/agents/project-management/tech-debt-scanner.ts`** — copy from spec Section 10.5.

### ✅ Definition of Done
- [ ] Feedback classified by LLM (bug/feature/question)
- [ ] GitHub issues created with PAPYR-xxx IDs
- [ ] Sprint planning with 20% tech debt allocation
- [ ] Velocity tracking per sprint
- [ ] Tech debt scanner checks outdated deps, missing tests

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-066 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Project Management agent (Dalang)

- Feedback processing + GitHub issue creation
- Sprint planning, velocity tracking
- Tech debt scanner

Refs: PAPYR-189`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test issue creation
- Proceed to STEP-F2-067

---

## STEP-F2-067: Agent: Backup & Verify (Pustaka/Simpan)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 11 (Backup & Verify)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-190

### ✅ Prerequisites
- STEP-F2-066 complete

### 🎯 Objective
Implement Backup agent: R2 backup, git bundle, env backup (encrypted AES-256-GCM), weekly verification, DR testing.

### 📋 Instructions

1. **Buat `src/agents/backup/index.ts`** — orchestrator.
2. **Buat `src/agents/backup/r2-backup.ts`** — R2 config backup.
3. **Buat `src/agents/backup/config-backup.ts`** — copy from spec Section 11.3 (encrypted env backup).
4. **Buat `src/agents/backup/git-backup.ts`** — git bundle creation.
5. **Buat `src/agents/backup/verifier.ts`** — copy from spec Section 11.4 (checksum verification, DR test).

### ✅ Definition of Done
- [ ] Environment configs backed up daily (encrypted AES-256-GCM)
- [ ] Git repository bundled daily
- [ ] All backups uploaded to R2 (papyr-backups bucket)
- [ ] Daily verification with checksum comparison
- [ ] Weekly DR test (credential validation)
- [ ] Failed backups trigger Telegram alert

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-067 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Backup & Verify agent (Pustaka)

- Encrypted env backup, git bundle, R2 sync
- Checksum verification, weekly DR test
- Alert on backup failure

Refs: PAPYR-190`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test backup + verify cycle
- Proceed to STEP-F2-068

---

## STEP-F2-068: Agent: Analytics Intelligence (Prasasti/Cerdas)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 12 (Analytics Intelligence)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-191

### ✅ Prerequisites
- STEP-F2-067 complete

### 🎯 Objective
Implement Analytics Intelligence agent: Vercel Analytics API integration, anomaly detection (z-score), tool usage analysis, insights report.

### 📋 Instructions

1. **Buat `src/agents/analytics/index.ts`** — orchestrator.
2. **Buat `src/agents/analytics/vercel-analytics.ts`** — copy from spec Section 12.3 (Vercel Analytics API client).
3. **Buat `src/agents/analytics/anomaly-detector.ts`** — copy from spec Section 12.4 (z-score detection).
4. **Buat `src/agents/analytics/tool-usage-analyzer.ts`** — copy from spec Section 12.5 (tool rankings, user flow, recommendations).
5. **Buat `src/agents/analytics/insights-generator.ts`** — copy from spec Section 12.6 (weekly insights report).

### ✅ Definition of Done
- [ ] Vercel Analytics API integration working
- [ ] Z-score anomaly detection (threshold 2.5, critical 3.5)
- [ ] Tool usage rankings with completion rates
- [ ] User flow analysis (landing to tool to completion)
- [ ] Weekly insights report in Bahasa Indonesia
- [ ] Schedule: daily 07:00 (analysis), every 6h (anomaly), Monday 10:00 (weekly)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-068 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Analytics Intelligence agent (Prasasti)

- Vercel Analytics API integration
- Z-score anomaly detection
- Tool usage analysis + weekly insights

Refs: PAPYR-191`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test analytics fetch
- Proceed to STEP-F2-069

---

## STEP-F2-069: Agent: Social Media / Twitter (Kicau)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 13 (Social Media)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-219, PAPYR-220, PAPYR-221

### ✅ Prerequisites
- STEP-F2-068 complete

### 🎯 Objective
Implement Social Media agent (Kicau): Playwright browser automation untuk Twitter/X, posting, threads, reply, engagement, anti-detection. Content generation engine.

### 📋 Instructions

1. **Buat `src/agents/social-media/index.ts`** — copy from spec Section 13.6 (SocialMediaAgent class with Playwright).
2. **Buat `src/agents/social-media/content-generator.ts`** — LLM-powered tweet/thread/meme generator.
3. **Buat `src/agents/social-media/scheduler.ts`** — posting schedule (Mon-Sat, 08:00/12:00 WIB).
4. **Buat `src/agents/social-media/engagement.ts`** — check mentions, generate replies, like/retweet.
5. **Buat `src/agents/social-media/anti-detection.ts`** — human-like delays, session persistence, rate limiting.

### ✅ Definition of Done
- [ ] Playwright posts tweets and threads to Twitter/X
- [ ] Content generated by LLM (tips, memes, updates, shares)
- [ ] Mention checking and auto-reply
- [ ] Anti-detection measures (delays, session reuse, rate limits)
- [ ] Max 5 tweets/day enforced
- [ ] Schedule: Mon-Sat 08:00/12:00 (post), every 2h 08:00-22:00 (mentions)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-069 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Social Media agent (Kicau)

- Playwright Twitter automation (post, thread, reply)
- LLM content generation (tips, memes, updates)
- Anti-detection measures, rate limiting

Refs: PAPYR-219, PAPYR-220, PAPYR-221`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test content generation (dry run, no actual posting)
- Proceed to STEP-F2-070

---
## STEP-F2-070: Telegram Bot setup (grammy)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 18 (Telegram Bot)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-192

### ✅ Prerequisites
- STEP-F2-069 complete
- Telegram bot token available (from STEP-F2-051)

### 🎯 Objective
Implement Telegram bot using grammy: command handlers (/status, /report, /health, /agents, /pause, /resume, /run, /backup, /security, /costs, /help), report/alert formatting, interactive buttons.

### 📋 Instructions

1. **Buat `src/telegram-bot.ts`** — entry point for Telegram bot container.

2. **Buat `src/interfaces/telegram/bot.ts`** — copy from spec Section 18.1 (PapyrOpsBot class with all command handlers).

3. **Buat `src/interfaces/telegram/commands.ts`** — individual command implementations.

4. **Buat `src/interfaces/telegram/keyboards.ts`** — InlineKeyboard builders for agent selection, approval flow.

5. **Buat `src/interfaces/telegram/formatters.ts`** — report formatting (daily, weekly, alert, approval request).

### ✅ Definition of Done
- [ ] Bot responds to all 12 commands
- [ ] /status shows system overview
- [ ] /agents shows interactive agent grid
- [ ] /health shows server health snapshot
- [ ] /report generates on-demand reports
- [ ] Alert formatting: critical (red), warning (yellow), info (blue)
- [ ] Approval flow with inline buttons (Approve/Reject)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-070 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement Telegram Bot (@PapyrOpsBot)

- grammy bot with 12 commands
- Interactive agent grid, approval flow
- Report/alert formatting

Refs: PAPYR-192`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test bot commands manually
- Proceed to STEP-F2-071

---

## STEP-F2-071: Dashboard /admin/openclaw (Next.js)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 17 (Dashboard)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-193

### ✅ Prerequisites
- STEP-F2-070 complete

### 🎯 Objective
Build Next.js admin page at /admin/openclaw: agent status cards, reports viewer, logs, manual override controls, auth middleware.

### 📋 Instructions

1. **Buat admin layout** `frontend/src/app/admin/layout.tsx` — auth middleware (ADMIN_SECRET cookie check).
2. **Buat OpenClaw page** `frontend/src/app/admin/openclaw/page.tsx` — agent status grid, recent activity, quick stats.
3. **Buat API routes** `frontend/src/app/api/admin/openclaw/route.ts` — proxy to OpenClaw internal API.
4. **Components:** AgentStatusCard, ActivityFeed, QuickStats, ManualOverridePanel.

### ✅ Definition of Done
- [ ] /admin/openclaw accessible with ADMIN_SECRET auth
- [ ] Agent status grid shows all 10 agents
- [ ] Recent activity feed (last 24h)
- [ ] Manual override: pause/resume/force-run buttons
- [ ] Responsive design matching Papyr style

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-071 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): build OpenClaw dashboard at /admin/openclaw

- Agent status grid (10 agents)
- Activity feed, quick stats
- Manual override controls
- Auth middleware

Refs: PAPYR-193`
- PR target: `develop`

### 🚀 Post-Step Actions
- Visual check dashboard
- Proceed to STEP-F2-072

---

## STEP-F2-072: CLI Interface (commander.js)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 19 (CLI)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-194

### ✅ Prerequisites
- STEP-F2-071 complete

### 🎯 Objective
Implement CLI using commander.js: agent management, report generation, config commands, log viewer.

### 📋 Instructions

1. **Buat `src/cli/index.ts`** — copy from spec Section 19.3 (commander setup, status, agents, report commands).
2. **Add build script** for CLI: `"build:cli": "tsc && chmod +x dist/cli/index.js"`.

### ✅ Definition of Done
- [ ] `openclaw status` shows system overview
- [ ] `openclaw agents list` shows all agents
- [ ] `openclaw report daily` generates report
- [ ] `openclaw logs` shows recent logs
- [ ] `openclaw config show` displays configuration

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-072 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement OpenClaw CLI

- commander.js with status, agents, report, logs, config commands
- Chalk-formatted output

Refs: PAPYR-194`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test CLI commands
- Proceed to STEP-F2-073

---

## STEP-F2-073: Error Handling & Resilience

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 23 (Error Handling)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-195

### ✅ Prerequisites
- STEP-F2-072 complete

### 🎯 Objective
Implement retry with backoff, circuit breaker, dead letter queue, graceful degradation, alert escalation.

### 📋 Instructions

1. **Buat `src/utils/circuit-breaker.ts`:**

```typescript
interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeoutMs: number;
  halfOpenRequests: number;
}

export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failures = 0;
  private lastFailureTime = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { failureThreshold: 5, resetTimeoutMs: 60000, halfOpenRequests: 1, ...config };
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.config.resetTimeoutMs) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.config.failureThreshold) {
      this.state = 'open';
    }
  }

  getState(): string { return this.state; }
}
```

2. **Implement dead letter queue** in event bus (failed jobs after max retries go to DLQ).
3. **Implement graceful shutdown** in main.ts (SIGTERM/SIGINT handlers).
4. **Implement alert escalation** (P3 -> log, P2 -> daily report, P1 -> immediate Telegram, P0 -> Telegram + auto-fix).

### ✅ Definition of Done
- [ ] Circuit breaker for external API calls
- [ ] Dead letter queue for failed BullMQ jobs
- [ ] Graceful shutdown (close connections, flush logs)
- [ ] Alert escalation by severity level
- [ ] Retry with exponential backoff (already in retry.ts)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-073 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement error handling and resilience

- Circuit breaker for external APIs
- Dead letter queue, graceful shutdown
- Alert escalation by severity

Refs: PAPYR-195`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test circuit breaker behavior
- Proceed to STEP-F2-074

---

## STEP-F2-074: Email Integration (Resend) + Quarterly/Yearly Reports

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-196, PAPYR-222, PAPYR-223

### ✅ Prerequisites
- STEP-F2-073 complete

### 🎯 Objective
Implement email reports via Resend SDK. Add quarterly and yearly report types. Update reporting schedule to end-of-period.

### 📋 Instructions

1. **Buat `src/integrations/resend.ts`:**

```typescript
import { Resend } from 'resend';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmailReport(options: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'OpenClaw <openclaw@mypapyr.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    return true;
  } catch (error) {
    return false;
  }
}
```

2. **Add quarterly/yearly report generators** to reporting agent.
3. **Update HEARTBEAT.md** schedule: daily 22:00, weekly Friday, monthly end-of-month, quarterly end-of-Q, yearly January.

### ✅ Definition of Done
- [ ] Resend email integration working
- [ ] Quarterly report generated end of Q
- [ ] Yearly report generated January
- [ ] Reports sent as email with PDF attachment
- [ ] Schedule updated to end-of-period

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-074 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): add email reports + quarterly/yearly reporting

- Resend SDK integration
- Quarterly and yearly report types
- End-of-period schedule

Refs: PAPYR-196, PAPYR-222, PAPYR-223`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test email delivery
- Proceed to STEP-F2-075

---

## STEP-F2-075: Incident Auto-Fix Engine

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Backend
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 2.5 (Incident Response Policy)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-224

### ✅ Prerequisites
- STEP-F2-074 complete

### 🎯 Objective
Implement auto-remediation for P0/P1 incidents without approval. Safe actions only (restart, redeploy, clear cache). Report results after fix.

### 📋 Instructions

1. **Enhance `src/agents/health/auto-remediation.ts`** — add Railway restart via API, Vercel redeploy trigger.
2. **Implement incident classification** — P0 (total down), P1 (degraded), P2 (warning), P3 (info).
3. **Post-fix reporting** — always send Telegram message with: what happened, what was done, current status.

### ✅ Definition of Done
- [ ] P0/P1 incidents trigger auto-fix without approval
- [ ] Safe actions only (no data deletion)
- [ ] Post-fix Telegram report sent
- [ ] Incident logged in oc_audit_logs

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-075 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `feat(fase2): implement incident auto-fix engine

- P0/P1 auto-remediation (restart, redeploy, cache clear)
- Post-fix Telegram reporting
- Safe actions only policy

Refs: PAPYR-224`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test auto-fix with simulated incident
- Proceed to STEP-F2-076

---

## STEP-F2-076: Dockerfile + Docker Compose (full system)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Infra
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 3.3 (Docker Compose), Section 3.4 (Dockerfile)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-197

### ✅ Prerequisites
- STEP-F2-075 complete

### 🎯 Objective
Create production Dockerfile and full Docker Compose with all services: daemon, scheduler, telegram-bot, redis, postgres.

### 📋 Instructions

1. **Buat `Dockerfile.openclaw`** — copy from spec Section 3.4 (multi-stage build, Node 20 alpine, Chromium for Playwright).

2. **Buat full `docker-compose.openclaw.yml`** — copy from spec Section 3.3 (5 services: daemon, scheduler, telegram-bot, redis, postgres).

3. **Build and test:**

```bash
docker compose -f docker-compose.openclaw.yml build
docker compose -f docker-compose.openclaw.yml up -d
docker compose -f docker-compose.openclaw.yml ps
```

### ✅ Definition of Done
- [ ] Dockerfile builds successfully (multi-stage, < 1GB)
- [ ] All 5 services start and pass healthchecks
- [ ] Daemon, scheduler, telegram-bot containers running
- [ ] Redis + PostgreSQL healthy
- [ ] Resource limits configured (memory, CPU)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-076 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `infra(fase2): create production Docker setup for OpenClaw

- Multi-stage Dockerfile (Node 20 + Chromium)
- Docker Compose: daemon, scheduler, telegram, redis, postgres
- Resource limits and healthchecks

Refs: PAPYR-197`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify all containers healthy
- Proceed to STEP-F2-077

---

## STEP-F2-077: Unit Tests for core framework + agents

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-199

### ✅ Prerequisites
- STEP-F2-076 complete

### 🎯 Objective
Write Vitest unit tests for core framework (LLM client, event bus, persona manager, SOUL parser, HEARTBEAT scheduler) and all 10 agents. Mock external dependencies.

### 📋 Instructions

1. **Setup Vitest** in `vitest.config.ts`.
2. **Write tests** for:
   - `tests/unit/core/llm-client.test.ts` — mock fetch, test retry, test token tracking
   - `tests/unit/core/event-bus.test.ts` — test emit/subscribe, test queue routing
   - `tests/unit/core/persona-manager.test.ts` — test switching, test config loading
   - `tests/unit/core/soul-parser.test.ts` — test parsing
   - `tests/unit/core/heartbeat-scheduler.test.ts` — test cron parsing
   - `tests/unit/agents/health.test.ts` — mock health endpoints
   - `tests/unit/agents/security.test.ts` — mock audit results
   - `tests/unit/agents/reporting.test.ts` — test report generation
   - `tests/unit/agents/analytics.test.ts` — test anomaly detection

3. **Run tests:**

```bash
npx vitest run --coverage
```

### ✅ Definition of Done
- [ ] Unit tests for all core modules
- [ ] Unit tests for all 10 agents (at least 2 per agent)
- [ ] Coverage >= 90% for core framework
- [ ] All tests pass
- [ ] External APIs mocked (no real API calls in tests)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-077 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `test(fase2): add unit tests for OpenClaw core + agents

- Core: LLM client, event bus, persona, SOUL, HEARTBEAT
- Agents: health, security, reporting, analytics, etc.
- Coverage >= 90%

Refs: PAPYR-199`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify coverage report
- Proceed to STEP-F2-078

---

## STEP-F2-078: Integration Tests (testcontainers)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-200

### ✅ Prerequisites
- STEP-F2-077 complete

### 🎯 Objective
Integration tests using testcontainers (PostgreSQL + Redis). Test full agent cycle: scheduling, execution, database persistence, BullMQ queue processing.

### 📋 Instructions

1. **Install testcontainers:** `npm install --save-dev testcontainers`
2. **Write integration tests:**
   - `tests/integration/database.test.ts` — CRUD operations on all tables
   - `tests/integration/event-bus.test.ts` — real Redis, emit/process events
   - `tests/integration/agent-cycle.test.ts` — full agent execution cycle

### ✅ Definition of Done
- [ ] PostgreSQL testcontainer for database tests
- [ ] Redis testcontainer for queue tests
- [ ] Full agent cycle tested (schedule -> execute -> persist -> report)
- [ ] All integration tests pass

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-078 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `test(fase2): add integration tests with testcontainers

- PostgreSQL + Redis testcontainers
- Full agent cycle tests
- Database CRUD verification

Refs: PAPYR-200`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify integration tests pass
- Proceed to STEP-F2-079

---

## STEP-F2-079: E2E Tests (full system)

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-201

### ✅ Prerequisites
- STEP-F2-078 complete

### 🎯 Objective
Full system E2E test: agent scheduling, execution, reporting, Telegram delivery. Test against running Docker Compose stack.

### 📋 Instructions

1. **Write E2E tests** in `tests/e2e/`:
   - `system-boot.test.ts` — verify all services start and healthcheck pass
   - `agent-scheduling.test.ts` — verify cron triggers agent execution
   - `reporting-delivery.test.ts` — verify report generated and sent to Telegram
   - `health-monitoring.test.ts` — verify health check detects issues

### ✅ Definition of Done
- [ ] System boot test passes (all services healthy)
- [ ] Agent scheduling verified
- [ ] Report delivery verified
- [ ] Health monitoring verified

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-079 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `test(fase2): add E2E tests for OpenClaw system

- System boot verification
- Agent scheduling, reporting, health monitoring

Refs: PAPYR-201`
- PR target: `develop`

### 🚀 Post-Step Actions
- All tests green
- Proceed to STEP-F2-080

---

## STEP-F2-080: CI/CD Pipeline for OpenClaw

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Infra
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-197

### ✅ Prerequisites
- STEP-F2-079 complete

### 🎯 Objective
Setup GitHub Actions for OpenClaw: test, build, deploy to VPS. Docker image build, rolling updates.

### 📋 Instructions

1. **Buat `.github/workflows/openclaw.yml`:**

```yaml
name: OpenClaw CI/CD

on:
  push:
    branches: [develop]
    paths: ['openclaw/**']

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: openclaw
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx vitest run --coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -f openclaw/Dockerfile.openclaw -t openclaw:latest openclaw/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: openclaw
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ~/app
            git pull origin develop
            docker compose -f docker-compose.openclaw.yml build
            docker compose -f docker-compose.openclaw.yml up -d
            docker compose -f docker-compose.openclaw.yml ps
```

### ✅ Definition of Done
- [ ] CI runs tests on every push to openclaw/
- [ ] Docker image builds successfully in CI
- [ ] Auto-deploy to VPS on develop push
- [ ] Rolling update (no downtime)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-080 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `ci(fase2): setup CI/CD pipeline for OpenClaw

- Test + build + deploy workflow
- Auto-deploy to VPS via SSH
- Docker image build in CI

Refs: PAPYR-197`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify CI passes
- Proceed to STEP-F2-081

---

## STEP-F2-081: Documentation Update

**Phase:** Fase 2E — OpenClaw
**Executor:** AI Agent
**Type:** Docs
**Estimated Complexity:** Low

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-202

### ✅ Prerequisites
- STEP-F2-080 complete

### 🎯 Objective
Update README, create deployment runbook, monitoring playbook, internal ops manual untuk OpenClaw.

### 📋 Instructions

1. **Create `openclaw/README.md`** — project overview, setup, architecture, commands.
2. **Create `openclaw/docs/deployment-runbook.md`** — step-by-step deployment guide.
3. **Create `openclaw/docs/monitoring-playbook.md`** — what to do when alerts fire.
4. **Update main `README.md`** — mention OpenClaw in architecture section.

### ✅ Definition of Done
- [ ] OpenClaw README complete
- [ ] Deployment runbook documented
- [ ] Monitoring playbook documented
- [ ] Main README updated

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-081 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `docs(fase2): add OpenClaw documentation

- README, deployment runbook, monitoring playbook
- Main README updated with OpenClaw section

Refs: PAPYR-202`
- PR target: `develop`

### 🚀 Post-Step Actions
- Review documentation
- Proceed to STEP-F2-082

---

## STEP-F2-082: Production Deployment & Verification

**Phase:** Fase 2E — OpenClaw
**Executor:** Founder + AI Agent
**Type:** Infra
**Estimated Complexity:** Medium

---

### 📚 Documents to Read Before Starting
- `docs/29_Papyr_OpenClaw_v1.0.md` — Section 26 (Deployment Guide)
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-203

### ✅ Prerequisites
- STEP-F2-081 complete
- All tests passing
- VPS ready with Docker

### 🎯 Objective
Final production deploy of OpenClaw. Verify health checks, first daily report, monitoring confirmation. All 10 agents operational.

### 📋 Instructions

1. **Deploy to VPS:**

```bash
ssh openclaw@<VPS_IP>
cd ~/app
git clone git@github.com:fazulfi/papyr-openclaw.git .
cp .env.openclaw.example .env.openclaw
# Fill in all environment variables
docker compose -f docker-compose.openclaw.yml up -d
```

2. **Verify all services:**

```bash
docker compose -f docker-compose.openclaw.yml ps
# All 5 services should be "healthy" or "running"

# Test health endpoint
curl http://localhost:4200/health

# Test Telegram bot
# Send /status to @PapyrOpsBot

# Check logs
docker logs openclaw-daemon --tail 50
```

3. **Wait for first daily report** (22:00 WIB).

4. **Verify monitoring:**
   - Health checks running every 5 minutes
   - No false alerts
   - Telegram bot responsive

5. **Final checklist:**

```markdown
- [ ] All 5 Docker containers healthy
- [ ] Health endpoint returns 200
- [ ] Telegram bot responds to /status
- [ ] First daily report received
- [ ] No errors in logs (last 1 hour)
- [ ] PostgreSQL has data (audit logs)
- [ ] Redis queues processing
- [ ] Cron jobs registered (check HEARTBEAT)
```

### ✅ Definition of Done
- [ ] All 5 containers running and healthy
- [ ] 10 agents registered and scheduled
- [ ] Telegram bot active and responsive
- [ ] First daily report sent successfully
- [ ] Health monitoring detecting real endpoints
- [ ] No critical errors in first 24 hours
- [ ] Total cost < Rp 150.000/bulan confirmed

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-082 complete
- Update `README.md` — OpenClaw status: LIVE
- Update `CHANGELOG.md` — OpenClaw v1.0.0

### 🔀 Git Instructions
- Branch: `feature/fase2/openclaw`
- Commit message: `deploy(fase2): OpenClaw production deployment verified

- All 10 agents operational
- Telegram bot live
- First daily report confirmed
- Monitoring active

Refs: PAPYR-203`
- PR target: `develop`

### 🚀 Post-Step Actions
- Monitor for 48 hours
- Fase 2E COMPLETE
- Proceed to Fase 2F (Admin Dashboard) in Part 3

---

<!-- PART 3 CONTINUES: Fase 2F -->

<!-- PART 3: Fase 2F + Appendices -->

# Papyr — StepPrompts Fase 2 (Part 3: Fase 2F — Admin Dashboard + Appendices)

**Continuation of step-prompts-fase2.md — Steps STEP-F2-083 through STEP-F2-097**

Covers: M22 Admin Dashboard (PAPYR-204 — PAPYR-218), 15 tasks, 35 jam

---

## Fase 2F — Admin Dashboard (M22: Admin Dashboard)

---
## STEP-F2-083: Frontend — Setup admin route structure + auth middleware

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium
**Task ID:** PAPYR-204

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — M22 section, PAPYR-204
- `docs/20_Papyr_Roadmap_v1.0.md` — Fase 2F spec (§7.8)
- `docs/04_Papyr_TDD_v1.0.md` — Auth approach
- `docs/13_Papyr_Coding_Standards_v1.0.md` — TypeScript conventions

### ✅ Prerequisites
- M21 (OpenClaw) complete — API endpoints available
- `develop` branch stable, all existing tests pass
- Branch `feature/fase2/admin-dashboard` created from `develop`

### 🎯 Objective
Buat route group `/admin/*` dengan Next.js App Router. Implementasi auth middleware yang cek `ADMIN_SECRET` env var via Authorization header (Bearer token). Semua admin routes return 401 jika unauthorized. Setup env variable dan utility function untuk auth check.

### 📋 Instructions

1. **Tambahkan env variable** di `frontend/.env.local`:

```bash
# Admin Dashboard Auth
ADMIN_SECRET=papyr-admin-secret-change-in-production
```

2. **Tambahkan env variable** di `frontend/.env.example`:

```bash
# Admin Dashboard Auth (Fase 2F)
ADMIN_SECRET=your-admin-secret-here
```

3. **Buat admin auth utility** di `frontend/src/lib/admin-auth.ts`:

```typescript
/**
 * Admin authentication utilities.
 * Uses env-based ADMIN_SECRET token for simple auth.
 * Will be upgraded to role-based auth in Fase 4.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const COOKIE_NAME = "papyr_admin_token";

export function getAdminSecret(): string {
  if (!ADMIN_SECRET) {
    throw new Error("ADMIN_SECRET environment variable is not set");
  }
  return ADMIN_SECRET;
}

export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token || token !== getAdminSecret()) {
    return false;
  }

  return true;
}

export async function requireAdminAuth(): Promise<void> {
  const isAuthenticated = await verifyAdminAuth();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }
}

export function validateAdminToken(token: string): boolean {
  return token === getAdminSecret();
}
```

4. **Buat admin login page** di `frontend/src/app/admin/login/page.tsx`:

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Token tidak valid. Periksa kembali ADMIN_SECRET Anda.");
      }
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-[10px] shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-dm-sans)]">
            Papyr Admin
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Masukkan admin token untuk mengakses dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-token" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Token
            </label>
            <input
              id="admin-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Masukkan ADMIN_SECRET"
              className="w-full px-4 py-3 border border-gray-300 rounded-[10px] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-[10px]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full py-3 px-4 bg-[#1E3A5F] text-white font-medium rounded-[10px] hover:bg-[#2a4a73] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

5. **Buat auth API route** di `frontend/src/app/api/admin/auth/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { validateAdminToken } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    if (!validateAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("papyr_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("papyr_admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
```

6. **Buat admin route group layout** di `frontend/src/app/admin/(dashboard)/layout.tsx`:

```typescript
import { requireAdminAuth } from "@/lib/admin-auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminAuth();
  return <>{children}</>;
}
```

7. **Buat admin root page (redirect)** di `frontend/src/app/admin/page.tsx`:

```typescript
import { redirect } from "next/navigation";
import { verifyAdminAuth } from "@/lib/admin-auth";

export default async function AdminRootPage() {
  const isAuth = await verifyAdminAuth();
  if (!isAuth) {
    redirect("/admin/login");
  }
  redirect("/admin/openclaw");
}
```

8. **Verify route structure:**
```bash
cd frontend
npx tsc --noEmit
```

### ✅ Definition of Done
- [ ] `frontend/src/lib/admin-auth.ts` created dengan `verifyAdminAuth()`, `requireAdminAuth()`, `validateAdminToken()`
- [ ] `frontend/src/app/admin/login/page.tsx` renders login form
- [ ] `frontend/src/app/api/admin/auth/route.ts` handles POST (login) dan DELETE (logout)
- [ ] `frontend/src/app/admin/(dashboard)/layout.tsx` protects all dashboard routes
- [ ] Unauthorized access redirects ke `/admin/login`
- [ ] Valid token sets httpOnly cookie
- [ ] `ADMIN_SECRET` env variable documented di `.env.example`
- [ ] No TypeScript errors (`npx tsc --noEmit`)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-083 complete
- Update `CHANGELOG.md` — add admin route setup entry

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): setup admin route structure with auth middleware

- Route group /admin/* with protected layout
- Login page with token-based auth
- Auth API route (POST login, DELETE logout)
- httpOnly cookie for session persistence
- Admin auth utility library

Refs: PAPYR-204`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test login flow manually: visit `/admin` → redirected to `/admin/login` → enter token → redirected to `/admin/openclaw`
- Proceed to STEP-F2-084

---
## STEP-F2-084: Frontend — Create admin layout (sidebar + header)

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium
**Task ID:** PAPYR-205

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-205
- `docs/20_Papyr_Roadmap_v1.0.md` — 10 modul list (§7.8)
- `frontend/src/components/Navbar.tsx` — Reference existing style pattern

### ✅ Prerequisites
- STEP-F2-083 complete (admin route structure + auth working)
- Login flow functional

### 🎯 Objective
Buat admin layout dengan sidebar navigation (10 modul links) dan header. Responsive design: sidebar collapsible di mobile. Match existing Papyr style (DM Sans font, Tailwind, same color palette `#1E3A5F`).

### 📋 Instructions

1. **Buat AdminSidebar component** di `frontend/src/components/admin/AdminSidebar.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin/openclaw", label: "OpenClaw", icon: "🤖" },
  { href: "/admin/analytics", label: "Analytics", icon: "📊" },
  { href: "/admin/health", label: "Server Health", icon: "💓" },
  { href: "/admin/security", label: "Security", icon: "🛡️" },
  { href: "/admin/seo", label: "SEO & Competitor", icon: "🔍" },
  { href: "/admin/logs", label: "System Logs", icon: "📋" },
  { href: "/admin/backups", label: "Backup Status", icon: "💾" },
  { href: "/admin/revenue", label: "Revenue", icon: "💰" },
  { href: "/admin/users", label: "User Mgmt", icon: "👥" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-[10px] shadow-sm border border-gray-200"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="text-lg font-bold text-[#1E3A5F] font-[family-name:var(--font-dm-sans)]">
            📄 Papyr Admin
          </Link>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm transition-colors ${isActive ? "bg-[#1E3A5F] text-white font-medium" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
```

2. **Buat AdminHeader component** di `frontend/src/components/admin/AdminHeader.tsx`:

```typescript
"use client";

import { useRouter } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
      <div className="lg:hidden w-10" />
      <h2 className="text-sm font-medium text-gray-500 hidden lg:block">Admin Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 hidden sm:block">Logged in as Admin</span>
        <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-red-600 transition-colors px-3 py-1.5 rounded-[10px] hover:bg-red-50">
          Logout
        </button>
      </div>
    </header>
  );
}
```

3. **Update admin dashboard layout** di `frontend/src/app/admin/(dashboard)/layout.tsx`:

```typescript
import { requireAdminAuth } from "@/lib/admin-auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = { robots: "noindex, nofollow" };

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdminAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

4. **Buat barrel export** di `frontend/src/components/admin/index.ts`:

```typescript
export { AdminSidebar } from "./AdminSidebar";
export { AdminHeader } from "./AdminHeader";
```

5. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] `AdminSidebar` component renders 10 navigation links
- [ ] Active link highlighted dengan background `#1E3A5F`
- [ ] Sidebar collapsible di mobile (hamburger toggle)
- [ ] `AdminHeader` component dengan logout button
- [ ] Layout wraps all dashboard pages (sidebar + header + content area)
- [ ] `noindex, nofollow` meta tag di admin layout
- [ ] Responsive: sidebar overlay di mobile, static di desktop (lg breakpoint)
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-084 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): create admin layout with sidebar and header

- AdminSidebar with 10 module navigation links
- AdminHeader with logout functionality
- Responsive: collapsible sidebar on mobile
- Active link highlighting
- noindex meta tag for SEO exclusion

Refs: PAPYR-205`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify sidebar renders correctly di desktop dan mobile viewport
- Proceed to STEP-F2-085

---

## STEP-F2-085: Frontend — Build OpenClaw Monitoring page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** High
**Task ID:** PAPYR-206

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-206
- API Contract M22: `GET /api/admin/openclaw/status`, `GET /api/admin/openclaw/logs`, `POST /api/admin/openclaw/trigger`

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout working)
- M21 OpenClaw API endpoints available (or mock data for development)

### 🎯 Objective
Buat halaman OpenClaw Monitoring yang menampilkan status 9 agents (Aksara, Telik, Jaga, Tameng, Warta, Lontar, Dalang, Pustaka, Prasasti). Tampilkan: last run time, success/fail counts, manual trigger buttons, log viewer per agent. Real-time polling setiap 30 detik.

### 📋 Instructions

1. **Buat AgentStatusCard** di `frontend/src/components/admin/AgentStatusCard.tsx`:

```typescript
"use client";

import { useState } from "react";

export interface AgentInfo {
  name: string;
  status: "running" | "idle" | "error" | "disabled";
  lastRun: string | null;
  successCount: number;
  failCount: number;
  description: string;
}

const STATUS_STYLES = {
  running: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", label: "Running" },
  idle: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500", label: "Idle" },
  error: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Error" },
  disabled: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-400", label: "Disabled" },
} as const;

export function AgentStatusCard({ agent, onTrigger }: { agent: AgentInfo; onTrigger: (name: string) => Promise<void> }) {
  const [triggering, setTriggering] = useState(false);
  const style = STATUS_STYLES[agent.status];
  const totalRuns = agent.successCount + agent.failCount;
  const successRate = totalRuns > 0 ? Math.round((agent.successCount / totalRuns) * 100) : 0;

  async function handleTrigger() {
    setTriggering(true);
    try { await onTrigger(agent.name); } finally { setTriggering(false); }
  }

  return (
    <div className="bg-white rounded-[10px] border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{agent.name}</h3>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {style.label}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-4">{agent.description}</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{agent.successCount}</p>
          <p className="text-xs text-gray-500">Success</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">{agent.failCount}</p>
          <p className="text-xs text-gray-500">Failed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-700">{successRate}%</p>
          <p className="text-xs text-gray-500">Rate</p>
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        Last run: {agent.lastRun ? new Date(agent.lastRun).toLocaleString("id-ID") : "Belum pernah"}
      </p>
      <button
        onClick={handleTrigger}
        disabled={triggering || agent.status === "running" || agent.status === "disabled"}
        className="w-full py-2 px-3 text-xs font-medium rounded-[10px] border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {triggering ? "Triggering..." : "Manual Trigger"}
      </button>
    </div>
  );
}
```

2. **Buat LogViewer** di `frontend/src/components/admin/LogViewer.tsx`:

```typescript
"use client";

import { useState } from "react";

interface LogEntry { agentId: string; timestamp: string; level: "info" | "warn" | "error"; message: string; }

const LEVEL_STYLES = { info: "text-blue-600 bg-blue-50", warn: "text-yellow-700 bg-yellow-50", error: "text-red-600 bg-red-50" } as const;

export function LogViewer({ logs, maxVisible = 50 }: { logs: LogEntry[]; maxVisible?: number }) {
  const [filter, setFilter] = useState<"all" | "info" | "warn" | "error">("all");
  const [search, setSearch] = useState("");

  const filtered = logs
    .filter((log) => filter === "all" || log.level === filter)
    .filter((log) => !search || log.message.toLowerCase().includes(search.toLowerCase()) || log.agentId.toLowerCase().includes(search.toLowerCase()))
    .slice(0, maxVisible);

  return (
    <div className="bg-white rounded-[10px] border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
        <div className="flex gap-1">
          {(["all", "info", "warn", "error"] as const).map((level) => (
            <button key={level} onClick={() => setFilter(level)} className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${filter === level ? "bg-[#1E3A5F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari log..." className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border border-gray-200 rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]" />
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">Tidak ada log yang cocok.</p>
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Waktu</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Agent</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Level</th>
                <th className="text-left px-4 py-2 text-gray-500 font-medium">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((log, i) => (
                <tr key={`${log.timestamp}-${i}`} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-2 font-medium text-gray-700">{log.agentId}</td>
                  <td className="px-4 py-2"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${LEVEL_STYLES[log.level]}`}>{log.level.toUpperCase()}</span></td>
                  <td className="px-4 py-2 text-gray-600 max-w-md truncate">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
```

3. **Buat OpenClaw page** di `frontend/src/app/admin/(dashboard)/openclaw/page.tsx` — full page component yang fetch status dari `/api/admin/openclaw/status`, logs dari `/api/admin/openclaw/logs`, dan trigger via `POST /api/admin/openclaw/trigger`. Polling setiap 30 detik. Grid 9 AgentStatusCard + LogViewer di bawah.

4. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] OpenClaw page renders 9 agent status cards
- [ ] Each card shows: name, status badge, success/fail counts, success rate, last run time
- [ ] Manual trigger button per agent (disabled when running/disabled)
- [ ] Log viewer with level filter (all/info/warn/error) dan search
- [ ] Real-time polling setiap 30 detik
- [ ] Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-085 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): build OpenClaw monitoring page

- AgentStatusCard component with status badges
- 9 agent cards with success/fail stats
- Manual trigger functionality
- LogViewer component with filters and search
- Real-time polling every 30 seconds

Refs: PAPYR-206`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify page renders with mock/empty data gracefully
- Proceed to STEP-F2-086

---

## STEP-F2-086: Frontend — Build Analytics Overview page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium
**Task ID:** PAPYR-207

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-207
- API Contract M22: `GET /api/admin/analytics/overview`
- `frontend/src/lib/analytics.ts` — Existing analytics event names

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout working)

### 🎯 Objective
Buat halaman Analytics Overview dengan: tasks processed chart (daily/weekly/monthly toggle), tool usage breakdown bar chart, device category pie chart, traffic trends. Data dari admin analytics API endpoint.

### 📋 Instructions

1. **Buat chart components** di `frontend/src/components/admin/AnalyticsChart.tsx` — exports `BarChart`, `DonutChart`, `StatCard`. BarChart: CSS-based vertical bars with labels. DonutChart: conic-gradient CSS donut with legend. StatCard: label + big number + optional change indicator.

2. **Buat Analytics page** di `frontend/src/app/admin/(dashboard)/analytics/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { BarChart, DonutChart, StatCard } from "@/components/admin/AnalyticsChart";

type Period = "daily" | "weekly" | "monthly";

interface AnalyticsData {
  tasksToday: number;
  tasksWeek: number;
  tasksMonth: number;
  toolBreakdown: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  dailyTrend: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<Period>("daily");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/admin/analytics/overview?period=${period}`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        setData(await res.json());
      } catch (err) { console.error("Analytics fetch error:", err); }
      finally { setLoading(false); }
    }
    fetchAnalytics();
  }, [period]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A5F]" /></div>;

  const toolChartData = data?.toolBreakdown ? Object.entries(data.toolBreakdown).map(([label, value]) => ({ label, value })) : [];
  const deviceChartData = data?.deviceBreakdown ? Object.entries(data.deviceBreakdown).map(([label, value]) => ({ label, value })) : [];
  const trendChartData = data?.dailyTrend ? data.dailyTrend.map((d) => ({ label: d.date.slice(5), value: d.count })) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-dm-sans)]">Analytics Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Statistik penggunaan tools dan traffic</p>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-[10px] p-1">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {p === "daily" ? "Harian" : p === "weekly" ? "Mingguan" : "Bulanan"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Tasks Hari Ini" value={data?.tasksToday ?? 0} />
        <StatCard label="Tasks Minggu Ini" value={data?.tasksWeek ?? 0} />
        <StatCard label="Tasks Bulan Ini" value={data?.tasksMonth ?? 0} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BarChart data={toolChartData} title="Tool Usage Breakdown" />
        <DonutChart data={deviceChartData} title="Device Category" />
      </div>
      <BarChart data={trendChartData} title="Traffic Trend (Last 14 Days)" maxHeight={160} />
    </div>
  );
}
```

3. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] Analytics page renders stat cards (today/week/month)
- [ ] Tool usage breakdown bar chart renders
- [ ] Device category donut chart renders
- [ ] Period toggle (daily/weekly/monthly) switches data
- [ ] Loading state shown while fetching
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-086 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): build analytics overview page

- StatCard, BarChart, DonutChart components
- Period toggle (daily/weekly/monthly)
- Tool usage breakdown visualization

Refs: PAPYR-207`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify charts render with empty data without crashing
- Proceed to STEP-F2-087

---

## STEP-F2-087: Frontend — Build Server Health page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium
**Task ID:** PAPYR-208

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-208
- API Contract M22: `GET /api/admin/health`

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout working)

### 🎯 Objective
Buat halaman Server Health: Railway container status, Vercel deployment status, R2 storage usage (bar), uptime percentage badges. Auto-refresh setiap 60 detik.

### 📋 Instructions

1. **Buat Health page** di `frontend/src/app/admin/(dashboard)/health/page.tsx` — 3 service cards (Railway, Vercel, R2) masing-masing dengan status dot (green/yellow/red), usage bars, uptime badges. Auto-refresh via `setInterval(fetchHealth, 60000)`.

Interface shape:
```typescript
interface HealthData {
  railway: { status: "healthy" | "degraded" | "down"; uptime: number; memory: { used: number; total: number }; cpu: number };
  vercel: { status: "healthy" | "degraded" | "down"; lastDeploy: string; region: string };
  r2: { status: "healthy" | "degraded" | "down"; usageBytes: number; limitBytes: number; objectCount: number };
}
```

Helper components: `UptimeBadge` (color-coded percentage), `UsageBar` (progress bar with label).

2. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] Health page renders 3 service cards (Railway, Vercel, R2)
- [ ] Status indicator dots (green/yellow/red) per service
- [ ] Memory and storage usage bars with percentage
- [ ] Uptime badge with color coding
- [ ] Auto-refresh setiap 60 detik
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-087 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): build server health monitoring page

- Railway/Vercel/R2 status cards with indicators
- Memory and storage usage bars
- Uptime percentage badges
- Auto-refresh every 60 seconds

Refs: PAPYR-208`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify auto-refresh works (check network tab)
- Proceed to STEP-F2-088

---
## STEP-F2-088: Frontend — Build Security Scan page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium
**Task ID:** PAPYR-209

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-209
- API Contract M22: `GET /api/admin/security/scans`

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout working)
- STEP-F2-086 complete (DonutChart component available)

### 🎯 Objective
Buat halaman Security Scan: latest scan results summary, CVE alerts list dengan severity badges (critical/high/medium/low), dependency audit history table, severity breakdown donut chart. Data dari OpenClaw Tameng agent.

### 📋 Instructions

1. **Buat Security page** di `frontend/src/app/admin/(dashboard)/security/page.tsx` — fetch dari `/api/admin/security/scans`. Sections: summary stats (total findings, critical count, last scan date), DonutChart severity breakdown, CVE alerts list with severity badges, scan history table.

Interface shape:
```typescript
interface SecurityData {
  scans: { date: string; findings: number; severity: "critical" | "high" | "medium" | "low" }[];
  alerts: { cve: string; package: string; severity: "critical" | "high" | "medium" | "low"; description: string; fixedIn: string | null }[];
  summary: { critical: number; high: number; medium: number; low: number };
  lastScanDate: string;
}
```

Severity badge styles: critical = red, high = orange, medium = yellow, low = blue.

2. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] Security page renders scan summary with total findings
- [ ] Severity breakdown donut chart renders
- [ ] CVE alerts list with severity badges
- [ ] Scan history table
- [ ] Graceful empty state when no alerts
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-088 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): build security scan results page

- CVE alerts list with severity badges
- Severity breakdown donut chart
- Scan history table
- Summary stats

Refs: PAPYR-209`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-089

---

## STEP-F2-089: Frontend — Build SEO & Competitor page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium
**Task ID:** PAPYR-210

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-210
- `docs/20_Papyr_Roadmap_v1.0.md` — SEO & Competitor Intel modul

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout working)

### 🎯 Objective
Buat halaman SEO & Competitor: keyword rankings table (position, change, URL), competitor comparison cards, content pipeline status dari Aksara agent, recent articles list.

### 📋 Instructions

1. **Buat SEO page** di `frontend/src/app/admin/(dashboard)/seo/page.tsx` — fetch dari `/api/admin/seo/overview`.

Interface shape:
```typescript
interface SEOData {
  keywords: { keyword: string; position: number; change: number; url: string }[];
  competitors: { name: string; domain: string; estimatedTraffic: string; topKeywords: number }[];
  contentPipeline: { title: string; status: "draft" | "published" | "scheduled"; date: string; targetKeyword: string }[];
  lastUpdated: string;
}
```

Sections: keyword rankings table (position change arrows: green up, red down), competitor cards grid, content pipeline list with status badges.

2. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] SEO page renders keyword rankings table
- [ ] Position change indicators (up/down arrows with color)
- [ ] Competitor comparison cards
- [ ] Content pipeline list with status badges
- [ ] Empty states for all sections
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-089 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): build SEO and competitor intel page

- Keyword rankings table with position changes
- Competitor comparison cards
- Content pipeline from Aksara agent

Refs: PAPYR-210`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-090

---

## STEP-F2-090: Frontend — Build System Logs page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium
**Task ID:** PAPYR-211

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-211
- API Contract M22: `GET /api/admin/logs`

### ✅ Prerequisites
- STEP-F2-085 complete (LogViewer component exists)

### 🎯 Objective
Buat halaman System Logs: error log viewer dengan filters (severity, tool, date range), rate limit hits counter, failed tasks table, cleanup stats. Pagination, search, export CSV.

### 📋 Instructions

1. **Buat Logs page** di `frontend/src/app/admin/(dashboard)/logs/page.tsx` — fetch dari `/api/admin/logs` with query params (page, tool, severity, search). Features: filter dropdowns (tool list, severity), search input, paginated error table, CSV export button, rate limit hits table, 24h stats cards.

Interface shape:
```typescript
interface LogsData {
  errors: { timestamp: string; message: string; tool: string; severity: "error" | "warn" | "info" }[];
  rateLimits: { ip: string; count: number; window: string; lastHit: string }[];
  stats: { totalErrors24h: number; totalRateLimits24h: number; failedTasks24h: number; cleanupRuns24h: number };
  pagination: { page: number; total: number; perPage: number };
}
```

CSV export: generate Blob with headers + rows, trigger download via anchor click.

2. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] Logs page renders error log table with filters (tool, severity, search)
- [ ] Pagination working (prev/next buttons)
- [ ] Export CSV button generates downloadable file
- [ ] Rate limit hits table shows top IPs
- [ ] Stats cards show 24h counts
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-090 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): build system logs page with filters and export

- Error log table with tool/severity/search filters
- Pagination support
- CSV export functionality
- Rate limit hits table

Refs: PAPYR-211`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify CSV export produces valid file
- Proceed to STEP-F2-091

---

## STEP-F2-091: Frontend — Build Backup Status page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Low
**Task ID:** PAPYR-212

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-212
- API Contract M22: `GET /api/admin/backups`

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout working)

### 🎯 Objective
Buat halaman Backup Status: backup history table (date, type, size, duration, status), last successful backup highlight, restore test results, storage usage breakdown (R2, git bundle, env).

### 📋 Instructions

1. **Buat Backups page** di `frontend/src/app/admin/(dashboard)/backups/page.tsx` — fetch dari `/api/admin/backups`.

Interface shape:
```typescript
interface BackupData {
  backups: { date: string; type: "full" | "incremental" | "git-bundle" | "env-snapshot"; size: number; status: "success" | "failed" | "in-progress"; duration: number }[];
  lastRestore: { date: string; result: "pass" | "fail"; notes: string } | null;
  storage: { r2: number; gitBundle: number; envSnapshot: number; total: number };
}
```

Sections: green banner for last successful backup, storage breakdown cards (4 cards), backup history table, restore test result badge.

2. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] Backups page renders backup history table
- [ ] Last successful backup highlighted in green banner
- [ ] Storage breakdown cards
- [ ] Restore test result displayed
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-091 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): build backup status page

- Backup history table with type/size/duration
- Last successful backup highlight
- Storage breakdown cards
- Restore test results

Refs: PAPYR-212`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-092

---

## STEP-F2-092: Frontend — Build Revenue/Billing placeholder page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Low
**Task ID:** PAPYR-213

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-213

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout working)

### 🎯 Objective
Buat placeholder UI untuk Revenue/Billing page dengan "Coming in Fase 3" banner. Mock revenue chart, subscriber count placeholder, payment history skeleton.

### 📋 Instructions

1. **Buat Revenue page** di `frontend/src/app/admin/(dashboard)/revenue/page.tsx`:

```typescript
export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-dm-sans)]">Revenue & Billing</h1>
        <p className="text-sm text-gray-500 mt-1">Monetization tracking dan payment management</p>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-6 text-center">
        <p className="text-3xl mb-2">🚧</p>
        <h2 className="text-lg font-semibold text-amber-800">Coming in Fase 3</h2>
        <p className="text-sm text-amber-600 mt-1">Fitur Revenue & Billing akan aktif setelah monetization strategy diimplementasi di Fase 3.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-50 pointer-events-none">
        <div className="bg-white rounded-[10px] border border-dashed border-gray-300 p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-300">Rp 0</p>
          <p className="text-xs text-gray-400">Monthly Revenue</p>
        </div>
        <div className="bg-white rounded-[10px] border border-dashed border-gray-300 p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-300">0</p>
          <p className="text-xs text-gray-400">Active Subscribers</p>
        </div>
        <div className="bg-white rounded-[10px] border border-dashed border-gray-300 p-5 shadow-sm">
          <p className="text-2xl font-bold text-gray-300">0%</p>
          <p className="text-xs text-gray-400">Conversion Rate</p>
        </div>
      </div>
      <div className="bg-white rounded-[10px] border border-dashed border-gray-300 p-8 opacity-50">
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <p className="text-4xl text-gray-200 mb-2">📈</p>
            <p className="text-sm text-gray-400">Revenue chart akan muncul di sini</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

2. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] Revenue page renders with "Coming in Fase 3" banner
- [ ] Mock stats cards visible but grayed out
- [ ] Clearly indicates placeholder status (dashed borders, reduced opacity)
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-092 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): add revenue/billing placeholder page

- Coming in Fase 3 banner
- Mock revenue stats and chart placeholder

Refs: PAPYR-213`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-093

---

## STEP-F2-093: Frontend — Build User Management placeholder page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Low
**Task ID:** PAPYR-214

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-214

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout working)

### 🎯 Objective
Buat placeholder UI untuk User Management page dengan "Coming in Fase 3" banner. Mock user table, role badges, invite button (disabled).

### 📋 Instructions

1. **Buat Users page** di `frontend/src/app/admin/(dashboard)/users/page.tsx`:

```typescript
export default function UsersPage() {
  const mockUsers = [
    { name: "Admin User", email: "admin@mypapyr.com", role: "owner", status: "active" },
    { name: "Team Member", email: "team@mypapyr.com", role: "editor", status: "invited" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-dm-sans)]">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">Team members dan role management</p>
        </div>
        <button disabled className="px-4 py-2 text-xs font-medium bg-[#1E3A5F] text-white rounded-[10px] opacity-50 cursor-not-allowed">+ Invite User</button>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-[10px] p-6 text-center">
        <p className="text-3xl mb-2">🚧</p>
        <h2 className="text-lg font-semibold text-amber-800">Coming in Fase 3</h2>
        <p className="text-sm text-amber-600 mt-1">Fitur User Management akan aktif setelah authentication system diimplementasi di Fase 3.</p>
      </div>
      <div className="bg-white rounded-[10px] border border-dashed border-gray-300 shadow-sm overflow-hidden opacity-50 pointer-events-none">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Role</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockUsers.map((user) => (
              <tr key={user.email}>
                <td className="px-5 py-3 text-gray-700 font-medium">{user.name}</td>
                <td className="px-5 py-3 text-gray-500">{user.email}</td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${user.role === "owner" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>{user.role}</span></td>
                <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${user.status === "active" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>{user.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

2. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] Users page renders with "Coming in Fase 3" banner
- [ ] Mock user table with role badges
- [ ] Invite button visible but disabled
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-093 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): add user management placeholder page

- Coming in Fase 3 banner
- Mock user table with role badges
- Disabled invite button

Refs: PAPYR-214`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-094

---
## STEP-F2-094: Frontend — Build Settings page

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Medium
**Task ID:** PAPYR-215

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-215

### ✅ Prerequisites
- STEP-F2-083 complete (admin auth working)
- STEP-F2-084 complete (admin layout working)

### 🎯 Objective
Buat halaman Settings: system config display (read-only), notification preferences (Telegram/Email toggles), ADMIN_SECRET rotation form, API endpoint config display, environment info.

### 📋 Instructions

1. **Buat Settings page** di `frontend/src/app/admin/(dashboard)/settings/page.tsx`:

```typescript
"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    telegram: true,
    email: false,
    slackWebhook: false,
  });
  const [newSecret, setNewSecret] = useState("");
  const [confirmSecret, setConfirmSecret] = useState("");
  const [rotateStatus, setRotateStatus] = useState<"idle" | "success" | "error">("idle");

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleRotateSecret(e: React.FormEvent) {
    e.preventDefault();
    if (newSecret.length < 16) { setRotateStatus("error"); return; }
    if (newSecret !== confirmSecret) { setRotateStatus("error"); return; }

    try {
      const res = await fetch("/api/admin/settings/rotate-secret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newSecret }),
      });
      setRotateStatus(res.ok ? "success" : "error");
      if (res.ok) { setNewSecret(""); setConfirmSecret(""); }
    } catch { setRotateStatus("error"); }
  }

  const systemConfig = [
    { label: "Max Upload Size", value: "20 MB" },
    { label: "File Retention", value: "60 minutes" },
    { label: "Rate Limit", value: "10 req/min per IP" },
    { label: "Signed URL Expiry", value: "60 minutes" },
    { label: "PDF Max Pages", value: "500" },
    { label: "Async Task Timeout", value: "120-180 seconds" },
  ];

  const apiEndpoints = [
    { label: "Frontend", value: "https://mypapyr.com" },
    { label: "Backend API", value: "https://papyr-production.up.railway.app" },
    { label: "R2 Storage", value: "Cloudflare R2 (papyr-files)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 font-[family-name:var(--font-dm-sans)]">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">System configuration dan preferences</p>
      </div>

      {/* System Config (read-only) */}
      <div className="bg-white rounded-[10px] border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">System Configuration</h3>
        <div className="space-y-2">
          {systemConfig.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-500">{item.label}</span>
              <span className="text-xs font-medium text-gray-700">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-white rounded-[10px] border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">API Endpoints</h3>
        <div className="space-y-2">
          {apiEndpoints.map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-500">{item.label}</span>
              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{item.value}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-[10px] border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700 capitalize">{key === "slackWebhook" ? "Slack Webhook" : key}</span>
              <button
                onClick={() => toggleNotification(key as keyof typeof notifications)}
                className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? "bg-[#1E3A5F]" : "bg-gray-300"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? "translate-x-5" : ""}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ADMIN_SECRET Rotation */}
      <div className="bg-white rounded-[10px] border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Rotate Admin Secret</h3>
        <form onSubmit={handleRotateSecret} className="space-y-3">
          <input
            type="password"
            value={newSecret}
            onChange={(e) => setNewSecret(e.target.value)}
            placeholder="New secret (min 16 characters)"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
          />
          <input
            type="password"
            value={confirmSecret}
            onChange={(e) => setConfirmSecret(e.target.value)}
            placeholder="Confirm new secret"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
          />
          {rotateStatus === "success" && <p className="text-xs text-green-600">Secret berhasil dirotasi.</p>}
          {rotateStatus === "error" && <p className="text-xs text-red-600">Gagal. Pastikan minimal 16 karakter dan kedua field cocok.</p>}
          <button type="submit" className="px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-[10px] hover:bg-red-700 transition-colors">
            Rotate Secret
          </button>
        </form>
      </div>

      {/* Environment Info */}
      <div className="bg-white rounded-[10px] border border-gray-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Environment</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs"><span className="text-gray-500">Node.js</span><span className="text-gray-700">20+</span></div>
          <div className="flex justify-between text-xs"><span className="text-gray-500">Next.js</span><span className="text-gray-700">16</span></div>
          <div className="flex justify-between text-xs"><span className="text-gray-500">Python</span><span className="text-gray-700">3.11</span></div>
          <div className="flex justify-between text-xs"><span className="text-gray-500">Environment</span><span className="text-gray-700">{process.env.NODE_ENV}</span></div>
        </div>
      </div>
    </div>
  );
}
```

2. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] Settings page renders system config (read-only)
- [ ] Notification toggles (Telegram/Email/Slack) functional
- [ ] ADMIN_SECRET rotation form with validation
- [ ] API endpoint display
- [ ] Environment info section
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-094 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): build settings page

- System config display (read-only)
- Notification preference toggles
- ADMIN_SECRET rotation form
- API endpoint and environment info

Refs: PAPYR-215`
- PR target: `develop`

### 🚀 Post-Step Actions
- Proceed to STEP-F2-095

---

## STEP-F2-095: Backend — Create admin API routes

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Backend (Next.js API Routes)
**Estimated Complexity:** Medium
**Task ID:** PAPYR-216

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-216, API Contract M22
- `docs/11_Papyr_API_Spec_v1.0.md` — API patterns

### ✅ Prerequisites
- STEP-F2-083 complete (admin auth utility exists)
- All admin pages created (STEP-F2-085 through STEP-F2-094)

### 🎯 Objective
Buat `/api/admin/*` endpoints di Next.js API routes: openclaw/status, openclaw/logs, openclaw/trigger, analytics/overview, health, security/scans, logs, backups. Auth middleware (ADMIN_SECRET check via cookie). Error handling + rate limiting.

### 📋 Instructions

1. **Buat admin API middleware** di `frontend/src/app/api/admin/_middleware.ts` (helper, not actual middleware file):

```typescript
// frontend/src/lib/admin-api-auth.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function verifyAdminRequest(request: NextRequest): Promise<NextResponse | null> {
  // Check cookie first
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("papyr_admin_token")?.value;

  // Check Authorization header as fallback
  const headerToken = request.headers.get("Authorization")?.replace("Bearer ", "");

  const token = cookieToken || headerToken;

  if (!token || token !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // null means authorized
}
```

2. **Buat OpenClaw status endpoint** di `frontend/src/app/api/admin/openclaw/status/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-api-auth";

export async function GET(request: NextRequest) {
  const authError = await verifyAdminRequest(request);
  if (authError) return authError;

  try {
    // Fetch from OpenClaw PostgreSQL or internal API
    // For now, return structured data shape
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${backendUrl}/api/openclaw/status`, {
      headers: { "X-Internal-Key": process.env.OPENCLAW_INTERNAL_KEY || "" },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json({
        agents: [],
        lastHeartbeat: new Date().toISOString(),
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("OpenClaw status fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error", detail: "Failed to fetch OpenClaw status" },
      { status: 500 }
    );
  }
}
```

3. **Buat OpenClaw logs endpoint** di `frontend/src/app/api/admin/openclaw/logs/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-api-auth";

export async function GET(request: NextRequest) {
  const authError = await verifyAdminRequest(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const agent = searchParams.get("agent");

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const params = agent ? `?agent=${agent}` : "";
    const res = await fetch(`${backendUrl}/api/openclaw/logs${params}`, {
      headers: { "X-Internal-Key": process.env.OPENCLAW_INTERNAL_KEY || "" },
    });

    if (!res.ok) {
      return NextResponse.json({ logs: [], pagination: { page: 1, total: 0 } });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("OpenClaw logs fetch error:", error);
    return NextResponse.json({ logs: [], pagination: { page: 1, total: 0 } });
  }
}
```

4. **Buat OpenClaw trigger endpoint** di `frontend/src/app/api/admin/openclaw/trigger/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-api-auth";

export async function POST(request: NextRequest) {
  const authError = await verifyAdminRequest(request);
  if (authError) return authError;

  try {
    const { agentId } = await request.json();
    if (!agentId) {
      return NextResponse.json({ error: "agentId is required" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${backendUrl}/api/openclaw/trigger`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": process.env.OPENCLAW_INTERNAL_KEY || "",
      },
      body: JSON.stringify({ agentId }),
    });

    const data = await res.json();
    return NextResponse.json({ agentId, result: data.result || "triggered" });
  } catch (error) {
    console.error("OpenClaw trigger error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

5. **Buat analytics endpoint** di `frontend/src/app/api/admin/analytics/overview/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/admin-api-auth";

export async function GET(request: NextRequest) {
  const authError = await verifyAdminRequest(request);
  if (authError) return authError;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const res = await fetch(`${backendUrl}/api/admin/analytics`, {
      headers: { "X-Internal-Key": process.env.OPENCLAW_INTERNAL_KEY || "" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({
        tasksToday: 0, tasksWeek: 0, tasksMonth: 0,
        toolBreakdown: {}, deviceBreakdown: {}, dailyTrend: [],
      });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ tasksToday: 0, tasksWeek: 0, tasksMonth: 0, toolBreakdown: {}, deviceBreakdown: {}, dailyTrend: [] });
  }
}
```

6. **Buat health, security, logs, backups endpoints** dengan pattern yang sama — masing-masing di folder sendiri (`/api/admin/health/route.ts`, `/api/admin/security/scans/route.ts`, `/api/admin/logs/route.ts`, `/api/admin/backups/route.ts`). Semua menggunakan `verifyAdminRequest` guard dan proxy ke backend.

7. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] 8 admin API routes created and functional
- [ ] All routes check auth via `verifyAdminRequest`
- [ ] Unauthorized requests return 401 `{ error: "Unauthorized" }`
- [ ] Server errors return 500 with detail
- [ ] Graceful fallback when backend unavailable
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-095 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): create admin API routes with auth middleware

- 8 admin endpoints: openclaw/status, openclaw/logs, openclaw/trigger, analytics/overview, health, security/scans, logs, backups
- Auth middleware via cookie/Bearer token
- Graceful error handling and fallbacks
- Proxy pattern to backend API

Refs: PAPYR-216`
- PR target: `develop`

### 🚀 Post-Step Actions
- Test each endpoint with valid/invalid token via curl
- Proceed to STEP-F2-096

---

## STEP-F2-096: Frontend — Admin SEO exclusion

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Frontend
**Estimated Complexity:** Low
**Task ID:** PAPYR-217

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-217
- `frontend/src/app/sitemap.ts` — Existing sitemap
- `frontend/src/app/robots.ts` — Existing robots.txt

### ✅ Prerequisites
- STEP-F2-084 complete (admin layout has noindex meta)
- Existing sitemap.ts and robots.ts files

### 🎯 Objective
Tambahkan `/admin` ke sitemap exclusion, robots.txt disallow `/admin`, verify noindex meta tag di admin layout. Pastikan admin pages tidak ter-index search engine.

### 📋 Instructions

1. **Update `frontend/src/app/robots.ts`** — add Disallow for /admin:

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://mypapyr.com/sitemap.xml",
  };
}
```

2. **Verify `frontend/src/app/sitemap.ts`** — ensure no /admin URLs are included. The sitemap should only list public tool pages. If `/admin` routes are auto-included, explicitly exclude them:

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mypapyr.com";

  // Only public pages — admin routes explicitly excluded
  const routes = [
    "", "/compress", "/merge", "/split", "/rotate",
    "/image-to-pdf", "/pdf-to-image", "/protect", "/unlock",
    "/watermark", "/sign", "/pdf-to-word", "/ocr", "/pdf-to-excel",
    "/privacy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
```

3. **Verify noindex in admin layout** — already added in STEP-F2-084 via `export const metadata = { robots: "noindex, nofollow" }`.

4. **Verify:** `cd frontend && npx tsc --noEmit`

### ✅ Definition of Done
- [ ] `/admin/` in robots.txt Disallow list
- [ ] No `/admin/*` URLs in sitemap.xml
- [ ] `noindex, nofollow` meta tag in admin layout
- [ ] Build succeeds without errors
- [ ] No TypeScript errors

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-096 complete

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `feat(fase2): exclude admin routes from SEO indexing

- Add /admin/ to robots.txt Disallow
- Verify sitemap excludes admin URLs
- noindex meta tag in admin layout

Refs: PAPYR-217`
- PR target: `develop`

### 🚀 Post-Step Actions
- Verify by visiting `/robots.txt` and `/sitemap.xml` in browser
- Proceed to STEP-F2-097

---

## STEP-F2-097: Testing — Unit tests admin auth + API routes

**Phase:** Fase 2F — Admin Dashboard
**Executor:** AI Agent
**Type:** Testing
**Estimated Complexity:** Medium
**Task ID:** PAPYR-218

---

### 📚 Documents to Read Before Starting
- `docs/fase-2/29_Papyr_Implementation_Backlog_MVP_0.2_v1.0.md` — PAPYR-218
- `frontend/src/lib/admin-auth.ts` — Auth utility to test
- `frontend/src/lib/admin-api-auth.ts` — API auth to test

### ✅ Prerequisites
- All admin steps complete (STEP-F2-083 through STEP-F2-096)
- Vitest configured in frontend

### 🎯 Objective
Unit tests untuk admin auth middleware dan API routes. Test: valid token, invalid token, missing token, 401 rejection, rate limiting, error handling, response format. Minimal 12 test cases.

### 📋 Instructions

1. **Buat test file** di `frontend/src/tests/admin-auth.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { validateAdminToken } from "@/lib/admin-auth";

// Mock environment
vi.stubEnv("ADMIN_SECRET", "test-secret-12345");

describe("Admin Auth", () => {
  describe("validateAdminToken", () => {
    it("returns true for valid token", () => {
      expect(validateAdminToken("test-secret-12345")).toBe(true);
    });

    it("returns false for invalid token", () => {
      expect(validateAdminToken("wrong-token")).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(validateAdminToken("")).toBe(false);
    });

    it("returns false for partial match", () => {
      expect(validateAdminToken("test-secret")).toBe(false);
    });

    it("is case-sensitive", () => {
      expect(validateAdminToken("TEST-SECRET-12345")).toBe(false);
    });
  });
});
```

2. **Buat API route tests** di `frontend/src/tests/admin-api.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("ADMIN_SECRET", "test-admin-secret-value");

describe("Admin API Routes", () => {
  describe("POST /api/admin/auth", () => {
    it("returns 200 and sets cookie for valid token", async () => {
      const { POST } = await import("@/app/api/admin/auth/route");
      const request = new Request("http://localhost/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "test-admin-secret-value" }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
    });

    it("returns 401 for invalid token", async () => {
      const { POST } = await import("@/app/api/admin/auth/route");
      const request = new Request("http://localhost/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "wrong-token" }),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(401);

      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("returns 400 for missing token", async () => {
      const { POST } = await import("@/app/api/admin/auth/route");
      const request = new Request("http://localhost/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const response = await POST(request as any);
      expect(response.status).toBe(400);
    });

    it("returns 400 for invalid JSON body", async () => {
      const { POST } = await import("@/app/api/admin/auth/route");
      const request = new Request("http://localhost/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      });

      const response = await POST(request as any);
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/admin/auth", () => {
    it("returns 200 and clears cookie", async () => {
      const { DELETE } = await import("@/app/api/admin/auth/route");
      const response = await DELETE();
      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body.success).toBe(true);
    });
  });

  describe("Admin API auth guard", () => {
    it("rejects request without token", async () => {
      const { verifyAdminRequest } = await import("@/lib/admin-api-auth");
      const request = new Request("http://localhost/api/admin/health", {
        method: "GET",
      });

      const result = await verifyAdminRequest(request as any);
      expect(result).not.toBeNull();
      expect(result?.status).toBe(401);
    });

    it("accepts request with valid Bearer token", async () => {
      const { verifyAdminRequest } = await import("@/lib/admin-api-auth");
      const request = new Request("http://localhost/api/admin/health", {
        method: "GET",
        headers: { Authorization: "Bearer test-admin-secret-value" },
      });

      const result = await verifyAdminRequest(request as any);
      expect(result).toBeNull();
    });

    it("rejects request with invalid Bearer token", async () => {
      const { verifyAdminRequest } = await import("@/lib/admin-api-auth");
      const request = new Request("http://localhost/api/admin/health", {
        method: "GET",
        headers: { Authorization: "Bearer wrong-token" },
      });

      const result = await verifyAdminRequest(request as any);
      expect(result).not.toBeNull();
      expect(result?.status).toBe(401);
    });
  });
});
```

3. **Run tests:**
```bash
cd frontend
npx vitest run src/tests/admin-auth.test.ts src/tests/admin-api.test.ts
```

### ✅ Definition of Done
- [ ] 12+ test cases written and passing
- [ ] Auth middleware tested: valid token, invalid token, missing token
- [ ] API routes tested: correct response shape, 401 rejection
- [ ] Cookie set/clear tested
- [ ] Edge cases covered (empty string, partial match, case sensitivity)
- [ ] Test coverage >= 90% for admin auth modules
- [ ] All tests pass (`npx vitest run`)

### 📝 Documentation Updates
- Update `stepprompts/progress.md` — mark STEP-F2-097 complete
- Update `CHANGELOG.md` — add M22 Admin Dashboard completion entry

### 🔀 Git Instructions
- Branch: `feature/fase2/admin-dashboard`
- Commit message: `test(fase2): add unit tests for admin auth and API routes

- 12+ test cases covering auth middleware
- Valid/invalid/missing token scenarios
- Cookie management tests
- API route response format verification
- Edge cases (empty, partial, case-sensitive)

Refs: PAPYR-218`
- PR target: `develop`

### 🚀 Post-Step Actions
- Run full test suite: `npx vitest run`
- Create PR from `feature/fase2/admin-dashboard` → `develop`
- Mark M22 complete in progress tracker
- Fase 2 complete! 🎉

---
## APPENDICES

---

## Appendix A: Quick Reference — Step Numbers to PAPYR Task IDs

| Step | Task ID | Milestone | Deskripsi |
|------|---------|-----------|-----------|
| STEP-F2-001 — STEP-F2-009 | PAPYR-090 — PAPYR-098 | M12: Protect PDF | Fase 2A |
| STEP-F2-010 — STEP-F2-017 | PAPYR-099 — PAPYR-106 | M13: Unlock PDF | Fase 2A |
| STEP-F2-018 — STEP-F2-027 | PAPYR-107 — PAPYR-116 | M14: Watermark PDF | Fase 2B |
| STEP-F2-028 — STEP-F2-038 | PAPYR-117 — PAPYR-127 | M15: Sign PDF | Fase 2B |
| STEP-F2-039 — STEP-F2-048 | PAPYR-128 — PAPYR-137 | M16: PDF-to-Word | Fase 2C |
| STEP-F2-049 — STEP-F2-059 | PAPYR-138 — PAPYR-148 | M17: OCR | Fase 2C |
| STEP-F2-060 — STEP-F2-069 | PAPYR-149 — PAPYR-158 | M18: PDF-to-Excel | Fase 2C |
| STEP-F2-070 — STEP-F2-079 | PAPYR-159 — PAPYR-168 | M19: E2E + Code Quality | Fase 2D |
| STEP-F2-080 — STEP-F2-089 | PAPYR-169 — PAPYR-178 | M20: Performance + SEO | Fase 2D |
| STEP-F2-090 — STEP-F2-127 | PAPYR-179 — PAPYR-203 | M21: OpenClaw AI Agent | Fase 2E |
| STEP-F2-083 | PAPYR-204 | M22: Admin Dashboard | Setup admin route + auth |
| STEP-F2-084 | PAPYR-205 | M22: Admin Dashboard | Admin layout (sidebar + header) |
| STEP-F2-085 | PAPYR-206 | M22: Admin Dashboard | OpenClaw Monitoring page |
| STEP-F2-086 | PAPYR-207 | M22: Admin Dashboard | Analytics Overview page |
| STEP-F2-087 | PAPYR-208 | M22: Admin Dashboard | Server Health page |
| STEP-F2-088 | PAPYR-209 | M22: Admin Dashboard | Security Scan page |
| STEP-F2-089 | PAPYR-210 | M22: Admin Dashboard | SEO & Competitor page |
| STEP-F2-090 | PAPYR-211 | M22: Admin Dashboard | System Logs page |
| STEP-F2-091 | PAPYR-212 | M22: Admin Dashboard | Backup Status page |
| STEP-F2-092 | PAPYR-213 | M22: Admin Dashboard | Revenue placeholder |
| STEP-F2-093 | PAPYR-214 | M22: Admin Dashboard | User Mgmt placeholder |
| STEP-F2-094 | PAPYR-215 | M22: Admin Dashboard | Settings page |
| STEP-F2-095 | PAPYR-216 | M22: Admin Dashboard | Admin API routes |
| STEP-F2-096 | PAPYR-217 | M22: Admin Dashboard | SEO exclusion |
| STEP-F2-097 | PAPYR-218 | M22: Admin Dashboard | Unit tests |

---

## Appendix B: Reusable Components Created During Fase 2

| Component | File Path | Created in | Used by |
|-----------|-----------|------------|---------|
| `PDFValidator` | `backend/utils/pdf_validator.py` | M12 | M12, M13, M14, M16, M17, M18 |
| `EncryptionService` | `backend/services/encryption.py` | M12 | M12, M13 |
| `AsyncTaskService` | `backend/services/async_task.py` | M16 | M16, M17 |
| `PasswordInput` | `frontend/src/components/PasswordInput.tsx` | M12 | M12, M13 |
| `PollingProgress` | `frontend/src/components/PollingProgress.tsx` | M16 | M16, M17 |
| `WatermarkConfig` | `frontend/src/components/WatermarkConfig.tsx` | M14 | M14 |
| `SignaturePad` | `frontend/src/components/SignaturePad.tsx` | M15 | M15 |
| `PDFPageViewer` | `frontend/src/components/PDFPageViewer.tsx` | M15 | M15 |
| `DragPlacement` | `frontend/src/components/DragPlacement.tsx` | M15 | M15 |
| `TablePreview` | `frontend/src/components/TablePreview.tsx` | M18 | M18 |
| `AdminSidebar` | `frontend/src/components/admin/AdminSidebar.tsx` | M22 | M22 |
| `AdminHeader` | `frontend/src/components/admin/AdminHeader.tsx` | M22 | M22 |
| `AgentStatusCard` | `frontend/src/components/admin/AgentStatusCard.tsx` | M22 | M22 |
| `AnalyticsChart` | `frontend/src/components/admin/AnalyticsChart.tsx` | M22 | M22 |
| `LogViewer` | `frontend/src/components/admin/LogViewer.tsx` | M22 | M22 |
| `useAsyncTask` | `frontend/src/hooks/useAsyncTask.ts` | M16 | M16, M17 |
| `useSignature` | `frontend/src/hooks/useSignature.ts` | M15 | M15 |

---

## Appendix C: Environment Variables Added During Fase 2

### Frontend (`frontend/.env.local`)

| Variable | Added in | Required | Default | Keterangan |
|----------|----------|----------|---------|------------|
| `ADMIN_SECRET` | M22 (STEP-F2-083) | ✅ | — | Admin dashboard auth token |
| `OPENCLAW_INTERNAL_KEY` | M22 (STEP-F2-095) | ✅ | — | Internal key for OpenClaw API calls |

### Backend (`backend/.env`)

| Variable | Added in | Required | Default | Keterangan |
|----------|----------|----------|---------|------------|
| `LIBREOFFICE_PATH` | M16 | ✅ | `/usr/bin/libreoffice` | Path to LibreOffice binary |
| `TESSERACT_PATH` | M17 | | `/usr/bin/tesseract` | Path to Tesseract binary |
| `TESSERACT_LANG` | M17 | | `ind+eng` | Default OCR languages |
| `ASYNC_TASK_TIMEOUT` | M16 | | `120` | Async task timeout in seconds |
| `OCR_TASK_TIMEOUT` | M17 | | `180` | OCR task timeout in seconds |
| `OPENCLAW_DB_URL` | M21 | ✅ | — | PostgreSQL connection for OpenClaw |
| `OPENCLAW_INTERNAL_KEY` | M21 | ✅ | — | Internal API key for admin access |
| `TELEGRAM_BOT_TOKEN` | M21 | | — | Telegram notifications (OpenClaw) |
| `TELEGRAM_CHAT_ID` | M21 | | — | Telegram chat for alerts |
| `BETTERSTACK_API_KEY` | M20 | | — | BetterStack monitoring |

---

## Appendix D: Docker Services Added During Fase 2

### Updated `backend/Dockerfile`

```dockerfile
FROM python:3.11-slim

# System dependencies added in Fase 2
RUN apt-get update && apt-get install -y --no-install-recommends \
    ghostscript \
    libreoffice-writer \
    tesseract-ocr \
    tesseract-ocr-ind \
    tesseract-ocr-eng \
    poppler-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### New Dependencies Added to `backend/requirements.txt`

| Package | Version | Added in | Purpose |
|---------|---------|----------|---------|
| `python-multipart` | >=0.0.6 | M12 | File upload handling |
| `ocrmypdf` | >=16.0 | M17 | OCR processing |
| `camelot-py[cv]` | >=0.11 | M18 | Table extraction |
| `openpyxl` | >=3.1 | M18 | Excel file generation |
| `psycopg2-binary` | >=2.9 | M21 | PostgreSQL for OpenClaw |
| `sqlalchemy` | >=2.0 | M21 | ORM for OpenClaw |
| `apscheduler` | >=3.10 | M21 | Scheduled agent tasks |

---

## Appendix E: Database Tables Created During Fase 2

### OpenClaw PostgreSQL Schema (M21)

```sql
-- Agent registry
CREATE TABLE openclaw_agents (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'idle',
    last_run TIMESTAMP,
    success_count INTEGER DEFAULT 0,
    fail_count INTEGER DEFAULT 0,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent execution logs
CREATE TABLE openclaw_logs (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES openclaw_agents(id),
    timestamp TIMESTAMP DEFAULT NOW(),
    level VARCHAR(10) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'
);

-- Scheduled tasks
CREATE TABLE openclaw_schedules (
    id SERIAL PRIMARY KEY,
    agent_id INTEGER REFERENCES openclaw_agents(id),
    cron_expression VARCHAR(100) NOT NULL,
    enabled BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP,
    next_run TIMESTAMP
);

-- Security scan results (Tameng agent)
CREATE TABLE security_scans (
    id SERIAL PRIMARY KEY,
    scan_date TIMESTAMP DEFAULT NOW(),
    findings INTEGER DEFAULT 0,
    severity VARCHAR(20),
    details JSONB DEFAULT '{}',
    alerts JSONB DEFAULT '[]'
);

-- Backup records (Pustaka agent)
CREATE TABLE backup_records (
    id SERIAL PRIMARY KEY,
    backup_date TIMESTAMP DEFAULT NOW(),
    type VARCHAR(30) NOT NULL,
    size_bytes BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in-progress',
    duration_seconds INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_openclaw_logs_agent ON openclaw_logs(agent_id);
CREATE INDEX idx_openclaw_logs_timestamp ON openclaw_logs(timestamp DESC);
CREATE INDEX idx_openclaw_logs_level ON openclaw_logs(level);
CREATE INDEX idx_security_scans_date ON security_scans(scan_date DESC);
CREATE INDEX idx_backup_records_date ON backup_records(backup_date DESC);
```

---

## Appendix F: API Endpoints Added During Fase 2 (Complete List)

### Backend API (FastAPI on Railway)

| Method | Endpoint | Added in | Deskripsi |
|--------|----------|----------|-----------|
| POST | `/api/protect` | M12 | Encrypt PDF with password |
| POST | `/api/unlock` | M13 | Decrypt PDF with password |
| POST | `/api/watermark` | M14 | Add watermark to PDF |
| POST | `/api/pdf-to-word` | M16 | Convert PDF to DOCX |
| GET | `/api/pdf-to-word/status/{task_id}` | M16 | Check conversion status |
| POST | `/api/ocr` | M17 | OCR scanned PDF |
| GET | `/api/ocr/status/{task_id}` | M17 | Check OCR status |
| POST | `/api/pdf-to-excel` | M18 | Extract tables to XLSX |
| GET | `/api/pdf-to-excel/status/{task_id}` | M18 | Check extraction status |
| GET | `/api/openclaw/status` | M21 | OpenClaw agent status (internal) |
| GET | `/api/openclaw/logs` | M21 | OpenClaw agent logs (internal) |
| POST | `/api/openclaw/trigger` | M21 | Trigger agent manually (internal) |
| GET | `/api/admin/analytics` | M21 | Analytics data for admin |
| GET | `/api/admin/health` | M21 | Infrastructure health data |
| GET | `/api/admin/security` | M21 | Security scan data |
| GET | `/api/admin/logs` | M21 | System error logs |
| GET | `/api/admin/backups` | M21 | Backup status data |

### Frontend API Routes (Next.js)

| Method | Endpoint | Added in | Deskripsi |
|--------|----------|----------|-----------|
| POST | `/api/admin/auth` | M22 | Admin login (set cookie) |
| DELETE | `/api/admin/auth` | M22 | Admin logout (clear cookie) |
| GET | `/api/admin/openclaw/status` | M22 | Proxy to backend OpenClaw status |
| GET | `/api/admin/openclaw/logs` | M22 | Proxy to backend OpenClaw logs |
| POST | `/api/admin/openclaw/trigger` | M22 | Proxy to backend agent trigger |
| GET | `/api/admin/analytics/overview` | M22 | Proxy to backend analytics |
| GET | `/api/admin/health` | M22 | Proxy to backend health |
| GET | `/api/admin/security/scans` | M22 | Proxy to backend security |
| GET | `/api/admin/logs` | M22 | Proxy to backend logs |
| GET | `/api/admin/backups` | M22 | Proxy to backend backups |

---

## Appendix G: Frontend Routes Added During Fase 2

| Route | Added in | Type | Deskripsi |
|-------|----------|------|-----------|
| `/protect` | M12 | Tool page | Protect PDF with password |
| `/unlock` | M13 | Tool page | Remove PDF password |
| `/watermark` | M14 | Tool page | Add watermark to PDF |
| `/sign` | M15 | Tool page | Digital signature (client-side) |
| `/pdf-to-word` | M16 | Tool page | PDF to DOCX conversion |
| `/ocr` | M17 | Tool page | OCR scanned PDF |
| `/pdf-to-excel` | M18 | Tool page | PDF table extraction |
| `/admin/login` | M22 | Admin | Login page |
| `/admin` | M22 | Admin | Root redirect |
| `/admin/openclaw` | M22 | Admin | OpenClaw monitoring |
| `/admin/analytics` | M22 | Admin | Analytics overview |
| `/admin/health` | M22 | Admin | Server health |
| `/admin/security` | M22 | Admin | Security scans |
| `/admin/seo` | M22 | Admin | SEO & competitor |
| `/admin/logs` | M22 | Admin | System logs |
| `/admin/backups` | M22 | Admin | Backup status |
| `/admin/revenue` | M22 | Admin | Revenue (placeholder) |
| `/admin/users` | M22 | Admin | User mgmt (placeholder) |
| `/admin/settings` | M22 | Admin | Settings |

---

## Appendix H: Completion Checklist (Final Verification Before Marking Fase 2 Done)

### Pre-Completion Verification

- [ ] **All 142 steps** marked ✅ in `stepprompts/progress.md`
- [ ] **All tests pass**: `cd frontend && npx vitest run` (exit 0)
- [ ] **All tests pass**: `cd backend && pytest` (exit 0)
- [ ] **TypeScript clean**: `cd frontend && npx tsc --noEmit` (exit 0)
- [ ] **Build succeeds**: `cd frontend && npm run build` (exit 0)
- [ ] **Lint clean**: `cd frontend && npx next lint` (exit 0)
- [ ] **Python lint**: `cd backend && ruff check .` (exit 0)
- [ ] **Test coverage >= 90%** for all new modules

### Feature Verification

- [ ] **13 tools functional**: compress, merge, split, rotate, image-to-pdf, pdf-to-image, protect, unlock, watermark, sign, pdf-to-word, ocr, pdf-to-excel
- [ ] **E2E tests pass**: `npx playwright test` (all browsers)
- [ ] **OpenClaw agents running**: all 9 agents operational
- [ ] **Admin dashboard accessible**: `/admin` with valid ADMIN_SECRET
- [ ] **All 10 admin modules render**: OpenClaw, Analytics, Health, Security, SEO, Logs, Backups, Revenue, Users, Settings
- [ ] **SEO exclusion verified**: `/admin` not in sitemap, disallowed in robots.txt

### Infrastructure Verification

- [ ] **Railway deployment healthy**: backend container running
- [ ] **Vercel deployment healthy**: frontend serving correctly
- [ ] **R2 storage operational**: file upload/download working
- [ ] **PostgreSQL connected**: OpenClaw database accessible
- [ ] **DNS resolving**: mypapyr.com pointing to Vercel

### Documentation Verification

- [ ] **README.md updated**: reflects all 13 tools + admin dashboard
- [ ] **CHANGELOG.md updated**: all milestones M12-M22 documented
- [ ] **progress.md complete**: all steps marked, 100% progress
- [ ] **API documentation current**: all new endpoints documented

### Security Verification

- [ ] **ADMIN_SECRET not in git**: verified via `git log -p | grep ADMIN_SECRET` returns nothing
- [ ] **No secrets in code**: all sensitive values via env vars
- [ ] **Admin routes protected**: 401 without valid token
- [ ] **Rate limiting active**: 10 req/min per IP enforced
- [ ] **File auto-delete working**: R2 lifecycle rules active

### Final Actions

1. Create final PR: `feature/fase2/admin-dashboard` → `develop`
2. Merge all Fase 2 feature branches into `develop`
3. Create release tag: `v2.0.0`
4. Update `README.md` version badge
5. Deploy to production
6. Verify production health
7. Announce Fase 2 completion

---

> **Fase 2 Complete!** Semua 11 milestones (M12-M22) selesai. Papyr sekarang memiliki 13 tools, OpenClaw AI agent system, dan unified admin dashboard. Lanjut ke Fase 3 (Foundation & UX Polish).

---

*Dokumen: step-prompts-fase2-part3.md*
*Versi: 1.0*
*Last Updated: 2026-05-03*
*Author: Muhammad Fa'iz Zulfikar*
*Generated by: AI Agent (OpenCode/Sisyphus)*

*Hak cipta © 2026 Muhammad Fa'iz Zulfikar. All rights reserved.*