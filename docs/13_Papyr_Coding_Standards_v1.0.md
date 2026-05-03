# Papyr

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

## Engineering Coding Standards

Version 1.0 | Mei 2026

**CONFIDENTIAL — Internal and Investor Use Only**

mypapyr.com

## 1. Document Header

### 1.1 Informasi Dokumen

| Field | Value |
|---|---|
| Judul Dokumen | Coding Standards — Papyr |
| ID Dokumen | PPR-CS-001 |
| Versi | 1.0 |
| Status | Approved |
| Tanggal Dibuat | Mei 2026 |
| Terakhir Diubah | Mei 2026 |
| Penulis | Muhammad Fa'iz Zulfikar |
| Referensi | PPR-BRD-001, PPR-SRS-001 |
| Kerahasiaan | Confidential — Internal and Investor Use Only |

### 1.2 Matriks Persetujuan

Matriks persetujuan terdapat di akhir dokumen ini (Bagian 30) sesuai kebutuhan tata letak audit.

### 1.3 Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi Perubahan |
|---|---|---|---|
| 1.0 | 2026-05-03 | Muhammad Fa'iz Zulfikar | Draft awal — Coding Standards lengkap untuk frontend (Next.js/TypeScript) dan backend (FastAPI/Python) |

---

## 2. Prinsip Umum

### 2.1 Filosofi Clean Code

Semua kode harus:

1. Dapat dibaca tanpa asumsi tersembunyi.
2. Dapat diprediksi dalam kondisi kegagalan.
3. Dapat diuji secara terisolasi.
4. Mudah diubah dengan aman.

### 2.2 Penerapan SOLID di Papyr

| Prinsip | Aturan Papyr |
|---|---|
| Single Responsibility | Satu modul menangani satu concern (validasi, service logic, utility, UI component) |
| Open/Closed | Extend melalui komposisi, hindari modifikasi modul stabil yang tidak perlu |
| Liskov Substitution | Implementasi turunan harus mempertahankan kontrak perilaku |
| Interface Segregation | Interface kecil dan spesifik sesuai tujuan |
| Dependency Inversion | Modul high-level bergantung pada abstraksi, bukan implementasi konkret |

### 2.3 DRY, KISS, YAGNI

- **DRY**: Hindari duplikasi business logic; extract shared utility hanya ketika reuse nyata.
- **KISS**: Pilih implementasi straightforward daripada abstraksi prematur.
- **YAGNI**: Jangan implementasi fitur roadmap/masa depan sampai scope disetujui.

### 2.4 Komposisi di Atas Inheritance

- Utamakan function composition dan dependency injection.
- Hindari class inheritance tree kecuali diperlukan oleh external API.

### 2.5 Fail Fast, Fail Loud

- Validasi input di boundaries.
- Throw error eksplisit dengan konteks yang jelas.
- Jangan menelan exception secara diam-diam.

### 2.6 Privacy-First Development

Sesuai filosofi produk Papyr:

- Tidak pernah log konten file pengguna.
- Semua file di server menggunakan UUID sebagai nama file.
- Auto-delete file dalam 60 menit.
- Client-side processing diprioritaskan untuk operasi yang memungkinkan.
- Error message selalu dalam Bahasa Indonesia.

---

## 3. Standar TypeScript (Frontend)

### 3.1 Konfigurasi Compiler

TypeScript strict mode wajib diaktifkan. Konfigurasi saat ini (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  }
}
```

Flag wajib yang tidak boleh dinonaktifkan:

- `strict: true`
- `isolatedModules: true`
- `noEmit: true`

### 3.2 Type Inference vs Explicit Types

Aturan:

1. Biarkan inference menangani variabel lokal yang jelas.
2. Explicit type wajib untuk public API boundaries (exported functions, types).
3. Return type eksplisit wajib untuk exported functions.

### 3.3 Interface vs Type Alias

- Gunakan `type` untuk unions, mapped types, dan compositional type logic.
- Gunakan `interface` untuk object contracts yang dimaksudkan untuk diimplementasi atau di-extend.

### 3.4 Penggunaan `any` Dilarang

- Jangan gunakan `any` dalam application code.
- Gunakan `unknown` dan narrow via type guards.
- Satu-satunya pengecualian: interop dengan library pihak ketiga yang tidak memiliki type definitions (harus didokumentasikan dengan komentar `// eslint-disable-next-line`).

### 3.5 Null Handling

Praktik wajib:

- Gunakan optional chaining (`?.`) untuk nullable accesses.
- Gunakan nullish coalescing (`??`) untuk default fallbacks.
- Jangan pernah nonaktifkan `strictNullChecks`.

### 3.6 Path Alias

Gunakan path alias `@/*` untuk semua import dari `src/`:

```typescript
// Benar
import { config } from "@/lib/config";
import PDFUploader from "@/components/PDFUploader";

// Salah
import { config } from "../../lib/config";
import PDFUploader from "../../../components/PDFUploader";
```

---

## 4. Konvensi Penamaan

### 4.1 Aturan Penamaan Global

| Artefak | Konvensi | Contoh |
|---|---|---|
| File route (Next.js) | kebab-case | `image-to-pdf/page.tsx` |
| File komponen React | PascalCase | `PDFUploader.tsx` |
| File utility/lib | camelCase | `pdfUtils.ts`, `analytics.ts` |
| Fungsi | camelCase | `mergePDFs`, `trackTaskStarted` |
| Variabel | camelCase | `uploaderState`, `compressedSize` |
| Konstanta | SCREAMING_SNAKE_CASE | `ALLOWED_MIME_TYPES`, `CLEANUP_INTERVAL_SECONDS` |
| Types/Interfaces | PascalCase | `AnalyticsEvent`, `PageRotationMap` |
| CSS classes | kebab-case (Tailwind) | `text-navy`, `bg-accent/10` |
| File test | `*.test.ts` atau `*.spec.ts` | `pdfUtils.test.ts` |
| File Python | snake_case | `compress_service.py`, `logging_config.py` |
| Variabel Python | snake_case | `file_bytes`, `input_path` |
| Konstanta Python | SCREAMING_SNAKE_CASE | `_PDF_MAGIC`, `ALLOWED_EXTENSIONS` |
| Env vars | SCREAMING_SNAKE_CASE | `R2_ACCOUNT_ID`, `CORS_ORIGINS` |

### 4.2 Konvensi Penamaan Komponen

- Komponen React menggunakan PascalCase: `PDFUploader`, `OtherTools`, `PrivacyNotice`.
- Inline helper components dalam file yang sama boleh menggunakan PascalCase tanpa export: `CompressIcon()`, `ZapIcon()`.
- Props type menggunakan format `{ComponentName}Props` (opsional untuk komponen sederhana).

### 4.3 Konvensi Penamaan Backend

| Artefak | Konvensi | Contoh |
|---|---|---|
| Router file | snake_case | `compress.py`, `pdf_to_image.py` |
| Service file | snake_case + `_service` suffix | `compress_service.py` |
| Utility file | snake_case | `config.py`, `r2.py` |
| Function | snake_case | `compress_pdf`, `upload_file` |
| Class | PascalCase | `Settings`, `MissingEnvVarError` |
| Private function | underscore prefix | `_validate_pdf`, `_cleanup_loop` |
| Router variable | `router` | `router = APIRouter(...)` |

---

## 5. Struktur Proyek

### 5.1 Layout Proyek

```text
papyr/
├── frontend/                  # Next.js 16 app (Vercel)
│   └── src/
│       ├── app/               # Pages & routes (App Router)
│       │   ├── compress/      # /compress — page.tsx + layout.tsx
│       │   ├── merge/         # /merge
│       │   ├── split/         # /split
│       │   ├── image-to-pdf/  # /image-to-pdf
│       │   ├── pdf-to-image/  # /pdf-to-image
│       │   ├── rotate/        # /rotate
│       │   ├── sitemap.ts     # Auto-generated sitemap.xml
│       │   └── robots.ts      # Auto-generated robots.txt
│       ├── components/        # Reusable UI components
│       └── lib/               # Config, utilities, helpers
├── backend/                   # FastAPI server (Railway)
│   ├── routers/               # API route handlers
│   ├── services/              # Business logic
│   ├── utils/                 # Config, helpers, shared utilities
│   ├── Dockerfile             # Production container
│   ├── requirements.txt       # Python dependencies
│   └── main.py                # FastAPI entrypoint
├── docs/                      # Dokumentasi proyek
└── tests/                     # Test scripts & generators
```

### 5.2 Konvensi Direktori Frontend

| Direktori | Tujuan | Aturan |
|---|---|---|
| `src/app/` | Route pages (App Router) | Satu folder per route, berisi `page.tsx` + `layout.tsx` |
| `src/components/` | Komponen UI reusable | PascalCase filename, satu komponen per file |
| `src/lib/` | Utilities, config, helpers | camelCase filename, pure functions |

### 5.3 Konvensi Direktori Backend

| Direktori | Tujuan | Aturan |
|---|---|---|
| `routers/` | API route handlers | Satu file per resource/domain |
| `services/` | Business logic | Satu file per operasi utama |
| `utils/` | Shared utilities | Config, R2 helpers, logging |

---

## 6. Standar Frontend (Next.js 16)

### 6.1 Konvensi App Router

- Gunakan `app/` directory route segments.
- Setiap route tool memiliki `page.tsx` (UI) dan `layout.tsx` (metadata/SEO).
- Route-level metadata didefinisikan di `layout.tsx`.

### 6.2 Server vs Client Components

Gunakan **Client Component** (`"use client"`) ketika:

- Membutuhkan event handlers, local state, atau browser APIs.
- Menggunakan hooks (`useState`, `useEffect`).
- Membutuhkan interaksi pengguna (upload, drag-drop).

Gunakan **Server Component** (default) ketika:

- Hanya menampilkan data statis.
- Tidak membutuhkan browser-only APIs.

Catatan: Semua halaman tool Papyr saat ini menggunakan `"use client"` karena membutuhkan interaksi file upload.

### 6.3 Pola Komponen Halaman Tool

Setiap halaman tool mengikuti struktur standar:

```tsx
"use client";

import { useState } from "react";
import PDFUploader from "@/components/PDFUploader";
import OtherTools from "@/components/OtherTools";
import PrivacyNotice from "@/components/PrivacyNotice";
import { config } from "@/lib/config";

/* ── Inline SVG Icons ── */
// Icon components khusus halaman ini

/* ── Feature Badges ── */
const FEATURES = [...] as const;

/* ── Page ── */
export default function ToolNamePage() {
  const [uploaderState, setUploaderState] = useState<string>("idle");

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8 sm:py-12">
      {/* Tool header */}
      {/* Uploader */}
      {/* Privacy notice */}
      {/* Feature badges (conditional) */}
      <OtherTools currentTool="/tool-name" />
    </div>
  );
}
```

### 6.4 State Management

- Gunakan `useState` untuk state lokal komponen.
- Tidak ada global state management library (belum diperlukan di MVP).
- State yang perlu di-share antar komponen: lift state up ke parent terdekat.

### 6.5 Error Handling Frontend

Pola error handling untuk operasi PDF:

```typescript
try {
  // Operasi PDF
} catch (err) {
  if (err instanceof Error && err.message.includes("specific condition")) {
    throw err; // Re-throw known errors
  }
  throw new Error("Pesan error dalam Bahasa Indonesia yang user-friendly.");
}
```

Aturan:

- Semua error message harus dalam Bahasa Indonesia.
- Error message harus actionable (beri tahu user apa yang harus dilakukan).
- Gunakan `trackTaskFailed()` untuk melacak kegagalan.

### 6.6 Pola Analytics

Setiap operasi tool harus melacak 3 event:

```typescript
import { trackTaskStarted, trackTaskCompleted, trackTaskFailed } from "@/lib/analytics";

// Saat user memulai operasi
trackTaskStarted("compress");

// Saat operasi berhasil
trackTaskCompleted("compress");

// Saat operasi gagal
trackTaskFailed("compress", error.message);
```

### 6.7 Pola Utility Functions

Utility functions di `src/lib/` mengikuti pola:

1. Import dependencies di atas.
2. Section separator dengan komentar `/* ── Section Name ── */`.
3. Type exports terlebih dahulu.
4. JSDoc untuk setiap exported function.
5. Error messages dalam Bahasa Indonesia.
6. Return `Uint8Array` untuk operasi PDF (bukan `Buffer`).

Contoh referensi: `src/lib/pdfUtils.ts`

### 6.8 Import Ordering

Urutan import yang direkomendasikan:

```typescript
// 1. React/Next.js imports
import { useState } from "react";

// 2. Third-party library imports
import { PDFDocument, degrees } from "pdf-lib";
import { track } from "@vercel/analytics";

// 3. Internal components (absolute path with @/)
import PDFUploader from "@/components/PDFUploader";
import OtherTools from "@/components/OtherTools";

// 4. Internal utilities/config
import { config } from "@/lib/config";
import { trackTaskStarted } from "@/lib/analytics";

// 5. Types (jika terpisah)
import type { ToolName } from "@/lib/analytics";
```

### 6.9 Styling dengan Tailwind CSS v4

Aturan:

- Gunakan Tailwind utility classes langsung di JSX.
- Gunakan design tokens yang sudah didefinisikan: `text-navy`, `text-accent`, `bg-accent/10`.
- Mobile-first approach: base styles untuk mobile, `sm:` / `md:` untuk breakpoints lebih besar.
- Hindari inline styles kecuali untuk nilai dinamis.

---

## 7. Standar Backend (FastAPI/Python)

### 7.1 Organisasi Router

Struktur berdasarkan resource domain:

```text
routers/
├── compress.py          # POST /api/compress
├── image_to_pdf.py      # POST /api/image-to-pdf
├── pdf_to_image.py      # POST /api/pdf-to-image
└── connectivity.py      # GET /health, connectivity tests
```

Setiap router file:

1. Docstring modul di atas yang menjelaskan endpoint.
2. Import dependencies.
3. Inisialisasi `limiter` dan `logger`.
4. Definisi `router = APIRouter(prefix="/api", tags=["domain"])`.
5. Konstanta validasi (MIME types, extensions, magic bytes).
6. Private validation functions.
7. Endpoint handlers.

### 7.2 Pola Router Endpoint

```python
"""
Router untuk [nama operasi].

POST /api/[endpoint] — deskripsi singkat.
"""

import logging
from fastapi import APIRouter, File, Request, UploadFile, HTTPException, Query
from slowapi import Limiter
from slowapi.util import get_remote_address

from utils.config import settings
from utils.logging_config import log_task_event
from services.[service_name] import [service_function]
from utils.r2 import upload_file, generate_signed_url

limiter = Limiter(key_func=get_remote_address)
logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["domain"])

# Konstanta validasi
ALLOWED_MIME_TYPES = {"application/pdf"}
ALLOWED_EXTENSIONS = {".pdf"}
_PDF_MAGIC = b"%PDF"


def _validate_file(file: UploadFile, file_bytes: bytes) -> None:
    """Validasi file: MIME, ekstensi, magic bytes, ukuran."""
    # ... validation logic ...


@router.post("/endpoint")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def endpoint_handler(request: Request, file: UploadFile = File(...)):
    """Docstring endpoint."""
    # 1. Baca file
    # 2. Validasi
    # 3. Proses
    # 4. Upload ke R2
    # 5. Generate signed URL
    # 6. Log event
    # 7. Return response
```

### 7.3 Pola Validasi File

Setiap endpoint yang menerima file HARUS melakukan validasi 3 layer:

1. **MIME type** — `file.content_type` harus dalam whitelist.
2. **Ekstensi file** — ekstensi dari `file.filename` harus valid.
3. **Magic bytes** — header bytes file harus sesuai format.

Tambahan validasi:

4. File tidak kosong.
5. Ukuran tidak melebihi `settings.max_upload_size_bytes`.
6. File tidak terproteksi password (untuk PDF).

### 7.4 Error Handling Backend

Gunakan `HTTPException` dengan pesan Bahasa Indonesia:

```python
# Validation errors — 400
raise HTTPException(
    status_code=400,
    detail="Pesan error dalam Bahasa Indonesia yang jelas."
)

# Rate limit — 429 (handled globally)
# Server errors — 500
raise HTTPException(
    status_code=500,
    detail="Gagal memproses file. Silakan coba lagi."
)
```

Aturan:

- Jangan expose internal error details ke user.
- Log error detail secara internal, tampilkan pesan user-friendly ke client.
- Re-raise `HTTPException` yang sudah ada (jangan wrap ulang).
- Catch generic `Exception` sebagai fallback terakhir.

### 7.5 Pola Konfigurasi

Konfigurasi menggunakan singleton pattern dengan dataclass:

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Settings:
    """Immutable application settings validated at startup."""
    # Required fields
    r2_account_id: str
    # Optional fields with defaults
    max_upload_size_mb: int

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

# Singleton — validated on first import
settings = _load_settings()
```

Aturan:

- Semua env vars divalidasi saat startup (fail fast).
- Required vars menggunakan `_require()` — raise error jika kosong.
- Optional vars menggunakan `_optional()` dengan default value.
- Settings object bersifat immutable (`frozen=True`).

### 7.6 Async Patterns

- Endpoint handlers menggunakan `async def`.
- Operasi I/O berat (Ghostscript subprocess) dijalankan di thread pool via `run_in_executor`.
- Background tasks menggunakan `asyncio.create_task` dengan proper cancellation.

```python
# Background loop pattern
async def _cleanup_loop():
    while True:
        await asyncio.sleep(INTERVAL)
        try:
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, sync_function)
        except Exception as e:
            logger.error("Error: %s", str(e))
```

### 7.7 Type Hints

Type hints wajib untuk:

- Semua function parameters.
- Semua function return types.
- Class attributes.

```python
def _validate_pdf(file: UploadFile, file_bytes: bytes) -> None:
    ...

def compress_pdf(input_path: str, quality: str = "ebook") -> dict[str, Any]:
    ...

async def health_check() -> dict[str, str]:
    ...
```

### 7.8 Logging

Gunakan structured logging dengan format JSON:

```python
import logging
from utils.logging_config import setup_logging, log_task_event

logger = logging.getLogger(__name__)

# Task event logging
log_task_event(
    logger,
    event="task_completed",
    tool="compress",
    duration_ms=duration_ms,
    input_size_bytes=input_size,
    success=True,
    saved_percent=saved_percent,
)
```

Aturan:

- Jangan log konten file (privacy requirement).
- Log hanya metadata operasional: ukuran, tipe, timestamp, durasi.
- Gunakan `log_task_event()` untuk semua task events.
- Level: `INFO` untuk operasi normal, `WARNING` untuk non-critical issues, `ERROR` untuk failures.

### 7.9 Temporary File Management

```python
import tempfile
import os

try:
    input_fd, input_path = tempfile.mkstemp(suffix=".pdf", prefix="papyr_in_")
    os.close(input_fd)
    # ... proses file ...
finally:
    # SELALU cleanup temp files
    for path in (input_path, output_path):
        if path and os.path.exists(path):
            try:
                os.remove(path)
            except OSError:
                logger.warning("Gagal hapus temp file")
```

Aturan:

- Selalu gunakan `tempfile.mkstemp()` dengan prefix `papyr_`.
- Selalu cleanup di `finally` block.
- Log warning jika cleanup gagal (jangan raise).

---

## 8. Standar API Design

### 8.1 Konvensi RESTful

- Endpoint menggunakan kebab-case: `/api/compress`, `/api/image-to-pdf`, `/api/pdf-to-image`.
- Prefix `/api` untuk semua endpoint.
- Gunakan HTTP method yang sesuai: `POST` untuk operasi file, `GET` untuk health check.

### 8.2 Response Format

Success response:

```json
{
  "download_url": "https://...",
  "original_size": 5242880,
  "compressed_size": 1048576,
  "saved_percent": 80
}
```

Error response:

```json
{
  "detail": "Pesan error dalam Bahasa Indonesia."
}
```

### 8.3 Status Code

| Code | Penggunaan di Papyr |
|---|---|
| 200 | Operasi berhasil |
| 400 | Validasi gagal (file invalid, terlalu besar, password-protected) |
| 429 | Rate limit exceeded |
| 500 | Server error (Ghostscript gagal, R2 error) |

### 8.4 Rate Limiting

- Global: 10 request/menit/IP (konfigurasi via `settings.rate_limit_per_minute`).
- Pesan 429 dalam Bahasa Indonesia: "Terlalu banyak permintaan. Coba lagi dalam 1 menit."
- Implementasi: `slowapi` dengan `get_remote_address` sebagai key function.

### 8.5 CORS

- Hanya origin yang terdaftar di `CORS_ORIGINS` yang diizinkan.
- Methods: `GET`, `POST`, `OPTIONS`.
- Headers: `Content-Type`, `Authorization`.

---

## 9. Standar Testing

### 9.1 Framework Testing

| Stack | Framework | Command |
|---|---|---|
| Frontend | Vitest | `npm run test` / `npm run test:watch` |
| Backend | pytest (direkomendasikan) | `pytest` |

### 9.2 Lokasi File Test

- Frontend: Co-locate test dekat source module (`src/lib/__tests__/pdfUtils.test.ts`).
- Backend: Folder `tests/` di root backend atau co-locate.

### 9.3 Pola Penamaan Test

```typescript
// Frontend (Vitest)
describe("mergePDFs", () => {
  it("should merge 2 PDF files into one", () => {
    // arrange-act-assert
  });

  it("should throw error when less than 2 files provided", () => {
    // ...
  });
});
```

```python
# Backend (pytest)
def test_compress_endpoint_returns_download_url():
    """Compress endpoint harus mengembalikan download_url."""
    ...

def test_validate_pdf_rejects_non_pdf_file():
    """Validasi harus menolak file non-PDF."""
    ...
```

### 9.4 Apa yang Harus Ditest

| Prioritas | Area |
|---|---|
| Tinggi | Validasi file (MIME, ekstensi, magic bytes, ukuran) |
| Tinggi | Operasi PDF client-side (merge, split, rotate) |
| Tinggi | Error handling dan error messages |
| Medium | API endpoint happy path |
| Medium | Rate limiting behavior |
| Rendah | UI rendering (snapshot tests) |

### 9.5 Coverage Target

Target minimum:

- Statements: 70%
- Branches: 70%
- Functions: 70%

CI pipeline harus gagal jika coverage turun di bawah threshold.

---

## 10. Konvensi Git

### 10.1 Branch Naming

Branch utama:

- `main` — production branch (protected).
- `develop` — development branch (default working branch).

Feature branches:

| Prefix | Penggunaan | Contoh |
|---|---|---|
| `feature/` | Fitur baru | `feature/protect-pdf` |
| `fix/` | Bug fix | `fix/compress-timeout` |
| `chore/` | Maintenance, config | `chore/update-dependencies` |
| `docs/` | Dokumentasi | `docs/add-coding-standards` |
| `refactor/` | Refactoring tanpa perubahan behavior | `refactor/extract-validation` |
| `test/` | Penambahan/perbaikan test | `test/add-merge-tests` |

### 10.2 Format Commit Message

Gunakan Conventional Commits:

```
type(scope): deskripsi singkat

[body opsional]
```

Tipe yang diizinkan:

| Type | Penggunaan |
|---|---|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `chore` | Maintenance, dependency update |
| `docs` | Perubahan dokumentasi |
| `refactor` | Refactoring kode |
| `test` | Penambahan/perbaikan test |
| `style` | Formatting, whitespace (tanpa perubahan logic) |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration |

Contoh:

```
feat(compress): add quality level selector UI
fix(api): handle password-protected PDF validation
chore(deps): update pdf-lib to v1.17.1
docs(readme): update deployment instructions
refactor(backend): extract file validation to shared utility
test(split): add edge case tests for invalid page ranges
```

### 10.3 Aturan Commit

- Commit message dalam Bahasa Inggris (untuk konsistensi dengan tooling).
- Satu commit per logical change.
- Jangan commit file `.env`, credentials, atau secrets.
- Jangan commit `node_modules/`, `__pycache__/`, `.next/`, `venv/`.

### 10.4 Merge Strategy

- Squash merge dari feature branch ke `develop`.
- Regular merge dari `develop` ke `main` saat release.
- Protected branches: `main`.

### 10.5 PR Template

Setiap Pull Request harus mencakup:

1. Ringkasan perubahan (apa dan mengapa).
2. Tipe perubahan (feat/fix/chore/etc).
3. Bukti testing (screenshot untuk UI, test output untuk logic).
4. Checklist: lint pass, build pass, test pass.

---

## 11. Code Quality Tools

### 11.1 ESLint (Frontend)

Konfigurasi saat ini menggunakan ESLint 9 flat config:

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

Ruleset aktif melalui `next/core-web-vitals` dan `next/typescript`:

- React hooks rules (exhaustive-deps, rules-of-hooks).
- Next.js best practices (no-img-element, no-html-link-for-pages).
- TypeScript strict rules.
- Core Web Vitals compliance.

### 11.2 Prettier (REKOMENDASI — Belum Dikonfigurasi)

**Status: Direkomendasikan untuk ditambahkan.**

Konfigurasi yang direkomendasikan (`.prettierrc`):

```json
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

Setup yang direkomendasikan:

```bash
npm install -D prettier eslint-config-prettier
```

Tambahkan ke `package.json` scripts:

```json
{
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

### 11.3 Ruff (Backend — REKOMENDASI — Belum Dikonfigurasi)

**Status: Direkomendasikan untuk ditambahkan.**

Ruff adalah linter + formatter Python yang sangat cepat, menggantikan flake8, isort, dan black.

Konfigurasi yang direkomendasikan (`pyproject.toml`):

```toml
[tool.ruff]
target-version = "py311"
line-length = 100

[tool.ruff.lint]
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # pyflakes
    "I",    # isort
    "N",    # pep8-naming
    "UP",   # pyupgrade
    "B",    # flake8-bugbear
    "A",    # flake8-builtins
    "S",    # flake8-bandit (security)
    "T20",  # flake8-print
    "SIM",  # flake8-simplify
    "TCH",  # flake8-type-checking
    "RUF",  # ruff-specific rules
]
ignore = [
    "S101",  # assert usage (OK in tests)
]

[tool.ruff.lint.isort]
known-first-party = ["routers", "services", "utils"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

Setup:

```bash
pip install ruff
ruff check .        # Lint
ruff format .       # Format
```

### 11.4 Pre-commit Hooks (REKOMENDASI)

**Status: Direkomendasikan untuk ditambahkan.**

Konfigurasi `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: frontend-lint
        name: Frontend ESLint
        entry: npm run lint
        language: system
        files: ^frontend/
        pass_filenames: false
      - id: backend-ruff
        name: Backend Ruff
        entry: ruff check
        language: system
        files: ^backend/.*\.py$
```

---

## 12. Standar Dokumentasi dalam Kode

### 12.1 JSDoc (Frontend)

Setiap exported function wajib memiliki JSDoc:

```typescript
/**
 * Rotate specific pages of a PDF by the degrees specified in the map.
 *
 * @param file              Source PDF file
 * @param pageRotationMap   Map of 1-indexed page number → degrees to add (90, 180, 270)
 * @returns                 Uint8Array of the rotated PDF
 */
export async function rotatePDF(
  file: File,
  pageRotationMap: PageRotationMap,
): Promise<Uint8Array> {
```

Aturan:

- Deskripsi singkat di baris pertama.
- `@param` untuk setiap parameter.
- `@returns` untuk return value.
- Bahasa Inggris untuk JSDoc (konsistensi dengan kode).

### 12.2 Docstrings (Backend)

Setiap modul dan fungsi publik wajib memiliki docstring:

```python
"""
Router untuk kompresi PDF.

POST /api/compress — menerima file PDF, validasi, kompres via Ghostscript,
upload ke R2, dan return signed download URL.
"""

def _validate_pdf(file: UploadFile, file_bytes: bytes) -> None:
    """
    Validasi file PDF: kosong, MIME type, ekstensi, magic bytes, ukuran, dan password.
    Raises HTTPException(400) jika tidak valid.
    """
```

### 12.3 Section Separators

Gunakan komentar separator untuk membagi bagian logis dalam file:

```typescript
/* ── Rotate Types & Helpers ── */
/* ── Inline SVG Icons ── */
/* ── Feature Badges ── */
/* ── Page ── */
```

```python
# --- Structured Logging ---
# --- Rate Limiter ---
# --- Background Cleanup Task ---
# --- Routers ---
```

### 12.4 Komentar Inline

- Komentar hanya ketika intent kode tidak jelas.
- Jangan komentar hal yang sudah jelas dari kode.
- Gunakan Bahasa Indonesia atau Inggris secara konsisten per file.

---

## 13. Performance Guidelines

### 13.1 Client-Side Processing Priority

Sesuai business rule BR-007, operasi yang bisa dilakukan di browser HARUS diproses di client:

| Operasi | Processing | Library |
|---|---|---|
| Merge PDF | Client | pdf-lib |
| Split PDF | Client | pdf-lib |
| Rotate PDF | Client | pdf-lib |
| Image to PDF (< 3MB) | Client | pdf-lib |
| Compress PDF | Server | Ghostscript |
| PDF to Image | Server | PyMuPDF |
| Image to PDF (>= 3MB) | Server | PyMuPDF |

### 13.2 Bundle Size

- Hindari import library besar yang tidak perlu.
- Gunakan dynamic import untuk library yang hanya dibutuhkan di halaman tertentu.
- Monitor bundle size dengan `next build` output.

### 13.3 Core Web Vitals

Target (sesuai NFR-013):

- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

Praktik:

- Gunakan `next/font` untuk font loading.
- Lazy load komponen non-critical.
- Hindari layout shift dengan explicit dimensions.

### 13.4 Backend Performance

- Target response time: < 5 detik untuk compress 5MB file (NFR-001).
- Gunakan `tempfile` untuk I/O, bukan in-memory untuk file besar.
- Cleanup temp files segera setelah upload ke R2.
- Background cleanup loop setiap 30 menit.

---

## 14. Security Coding Practices

### 14.1 Validasi Input di Boundaries

- Setiap file upload divalidasi 3 layer: MIME + ekstensi + magic bytes.
- Ukuran file dibatasi (`MAX_UPLOAD_SIZE_MB`).
- Rate limiting per IP.

### 14.2 Secret Management

- Tidak ada secrets dalam source code.
- Semua secrets via environment variables.
- File `.env` di-gitignore.
- Gunakan `.env.example` sebagai template (tanpa nilai aktual).

### 14.3 CORS Strict

- Hanya origin yang terdaftar yang diizinkan.
- Tidak menggunakan wildcard `*` di production.

### 14.4 File Handling Security

- UUID filename — nama asli file tidak pernah disimpan di server.
- Signed URLs dengan expiry time untuk download.
- Auto-delete file dalam 60 menit (double safety: lifecycle rule + cron).
- Tidak ada direct public access ke R2 bucket.

### 14.5 Dependency Security

- Review dependencies sebelum menambahkan.
- Gunakan versi yang di-pin di `requirements.txt`.
- Jalankan `npm audit` dan `pip audit` secara berkala.

---

## 15. Accessibility Standards

### 15.1 Bahasa Indonesia Default

- HTML `lang` attribute: `id`.
- Semua UI text dalam Bahasa Indonesia.
- Error messages dalam Bahasa Indonesia yang mudah dipahami.

### 15.2 Mobile-First Design

- Base styles untuk mobile (< 768px).
- Progressive enhancement untuk tablet dan desktop.
- Touch-friendly target sizes (minimum 44x44px).

### 15.3 Semantic HTML

- Gunakan heading hierarchy yang benar (`h1` > `h2` > `h3`).
- Gunakan semantic elements (`main`, `nav`, `footer`, `article`).
- Form controls harus memiliki labels.

### 15.4 Keyboard Navigation

- Semua interactive elements harus keyboard-accessible.
- Visible focus indicator.
- Logical tab order.

---

## 16. Standar Komponen React

### 16.1 Template Komponen

```tsx
"use client";

import { useState } from "react";

type ComponentNameProps = {
  propA: string;
  propB?: number;
};

/**
 * Deskripsi singkat komponen.
 */
export default function ComponentName({ propA, propB }: ComponentNameProps) {
  const [state, setState] = useState<string>("initial");

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 16.2 Aturan Komponen

1. Hanya functional components — tidak ada class components.
2. Satu komponen utama per file.
3. Helper components (icons, badges) boleh inline di file yang sama.
4. Props destructuring di parameter function.
5. Default export untuk page components, named export untuk utility components.

### 16.3 UI State Naming

Gunakan boolean yang jelas:

- `isLoading`
- `isError`
- `isSubmitting`
- `uploaderState` (untuk state machines: "idle" | "uploading" | "done" | "error")

### 16.4 Conditional Rendering

```tsx
{/* Pattern yang digunakan */}
{uploaderState === "idle" && (
  <div className="animate-fade-up">
    {/* Content */}
  </div>
)}
```

---

## 17. Standar Service Backend

### 17.1 Penamaan Service Method

Gunakan verb-first:

- `compress_pdf()`
- `upload_file()`
- `generate_signed_url()`
- `cleanup_expired_files()`

### 17.2 Separation of Concerns

| Layer | Tanggung Jawab |
|---|---|
| Router | HTTP concerns: request parsing, validation, response formatting |
| Service | Business logic: processing, transformation |
| Utils | Shared helpers: config, R2 client, logging |

### 17.3 Service Error Handling

Services boleh raise exception yang kemudian di-catch oleh router:

```python
# Service
def compress_pdf(input_path: str, quality: str) -> dict:
    """Raises Exception jika Ghostscript gagal."""
    ...

# Router
try:
    result = compress_pdf(input_path, quality=quality)
except HTTPException:
    raise  # Re-raise validation errors
except Exception as exc:
    logger.error("Compress failed: %s", str(exc))
    raise HTTPException(status_code=500, detail="Gagal memproses file.")
```

---

## 18. Standar Dependencies

### 18.1 Frontend Dependencies

| Package | Versi | Tujuan |
|---|---|---|
| next | 16.x | Framework React |
| react / react-dom | 19.x | UI library |
| pdf-lib | ^1.17 | Client-side PDF operations |
| @dnd-kit/core + sortable | ^6.x / ^10.x | Drag-and-drop reorder |
| @vercel/analytics | ^2.x | Privacy-friendly analytics |
| @vercel/speed-insights | ^2.x | Performance monitoring |

DevDependencies:

| Package | Versi | Tujuan |
|---|---|---|
| typescript | ^5 | Type system |
| eslint + eslint-config-next | ^9 / 16.x | Linting |
| vitest | ^3.x | Testing |
| tailwindcss | ^4 | Styling |
| @tailwindcss/postcss | ^4 | PostCSS integration |

### 18.2 Backend Dependencies

| Package | Versi | Tujuan |
|---|---|---|
| fastapi | 0.115.x | Web framework |
| uvicorn | 0.34.x | ASGI server |
| python-multipart | 0.0.x | File upload handling |
| boto3 | 1.38.x | Cloudflare R2 (S3-compatible) |
| python-dotenv | 1.1.x | Environment variable loading |
| PyMuPDF | 1.25.x | PDF rendering & conversion |
| Pillow | 11.x | Image processing |
| slowapi | 0.1.x | Rate limiting |

### 18.3 Aturan Dependency Management

- Pin exact versions di `requirements.txt` (backend).
- Gunakan caret ranges (`^`) di `package.json` (frontend).
- Review changelog sebelum major version upgrade.
- Jangan tambahkan dependency untuk fungsi yang bisa diimplementasi dalam < 20 baris kode.

---

## 19. Environment Variables

### 19.1 Konvensi Naming

- Semua env vars menggunakan `SCREAMING_SNAKE_CASE`.
- Frontend public vars menggunakan prefix `NEXT_PUBLIC_`.
- Tidak ada default values untuk secrets (harus explicit).

### 19.2 Validasi Startup

Backend memvalidasi semua required env vars saat startup:

```python
def _require(var: str) -> str:
    """Return env var value or raise MissingEnvVarError."""
    value = os.getenv(var)
    if not value:
        raise MissingEnvVarError(var)
    return value
```

Jika env var required tidak ada, aplikasi GAGAL start (fail fast).

### 19.3 File .env

- `.env` dan `.env.local` di-gitignore.
- `.env.example` di-commit sebagai template.
- Tidak ada nilai aktual di `.env.example`.

---

## 20. Code Review Process

### 20.1 Model Review

Papyr menggunakan model solo-founder + AI agent:

- **Primary reviewer**: AI Agent (OpenCode/Sisyphus).
- **Final approver**: Product Owner (Muhammad Fa'iz Zulfikar).

### 20.2 Checklist Review

Setiap perubahan kode harus memenuhi:

1. Scope sesuai dengan task/ticket.
2. Konvensi penamaan diikuti.
3. Tidak ada `any` di TypeScript.
4. Validasi ada di boundaries.
5. Error handling konsisten (pesan Bahasa Indonesia).
6. Privacy requirements terpenuhi (no content logging).
7. Tests ditambahkan/diupdate.
8. Lint dan build pass.
9. Tidak ada secrets dalam kode.
10. Performance impact dipertimbangkan.

### 20.3 Automated Checks

Sebelum merge, pastikan:

```bash
# Frontend
npm run lint
npm run build
npm run test

# Backend
ruff check .          # (setelah dikonfigurasi)
pytest                # (setelah dikonfigurasi)
```

---

## 21. Deployment Standards

### 21.1 Platform

| Layer | Platform | Branch |
|---|---|---|
| Frontend | Vercel | Auto-deploy dari `main` |
| Backend | Railway | Auto-deploy dari `main` |

### 21.2 Pre-deployment Checklist

1. Semua tests pass.
2. Lint pass tanpa error.
3. Build berhasil.
4. Environment variables sudah dikonfigurasi di platform.
5. Health check endpoint berfungsi.

### 21.3 Health Check

Backend menyediakan endpoint `/health`:

```python
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "version": app.version,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
```

---

## 22. Appendix A — ESLint Rules Aktif

Rules yang aktif melalui `next/core-web-vitals` + `next/typescript`:

| Rule | Level | Alasan |
|---|---|---|
| react-hooks/rules-of-hooks | error | Correctness hooks |
| react-hooks/exhaustive-deps | warn | Correct effect dependencies |
| @next/next/no-img-element | error | Enforce next/image |
| @next/next/no-html-link-for-pages | error | Proper routing |
| @typescript-eslint/no-unused-vars | warn | Clean code |
| @typescript-eslint/no-explicit-any | warn | Type safety |

---

## 23. Appendix B — Konfigurasi tsconfig.json Lengkap

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

---

## 24. Appendix C — Contoh Kode Referensi

### 24.1 Utility Function (Frontend)

Referensi: `src/lib/pdfUtils.ts`

```typescript
/**
 * Merge multiple PDF files into a single PDF.
 *
 * Runs entirely client-side using pdf-lib — no server round-trip.
 * Pages appear in the order of the input array.
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Minimal 2 file PDF untuk digabungkan.");
  }

  const merged = await PDFDocument.create();

  for (const file of files) {
    const buffer = await file.arrayBuffer();
    let source: PDFDocument;
    try {
      source = await PDFDocument.load(buffer, { ignoreEncryption: true });
    } catch {
      throw new Error(`Gagal membaca "${file.name}". File mungkin rusak atau terenkripsi.`);
    }
    const pages = await merged.copyPages(source, source.getPageIndices());
    for (const page of pages) {
      merged.addPage(page);
    }
  }

  return merged.save();
}
```

### 24.2 Analytics Module (Frontend)

Referensi: `src/lib/analytics.ts`

```typescript
import { track } from "@vercel/analytics";

export type AnalyticsEvent = "task_started" | "task_completed" | "task_failed";
export type ToolName = "compress" | "merge" | "split" | "image-to-pdf" | "pdf-to-image" | "rotate";
export type DeviceCategory = "mobile" | "tablet" | "desktop";

function getDeviceCategory(): DeviceCategory {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function trackTaskStarted(tool: ToolName) {
  track("task_started", { tool, device_category: getDeviceCategory() });
}
```

### 24.3 Router Endpoint (Backend)

Referensi: `backend/routers/compress.py`

```python
@router.post("/compress")
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
async def compress_endpoint(
    request: Request,
    file: UploadFile = File(...),
    quality: str = Query("ebook", regex="^(screen|ebook|printer)$"),
):
    """
    Kompres file PDF menggunakan Ghostscript.

    - **file**: File PDF (multipart/form-data)
    - **quality**: Preset kompresi — screen | ebook | printer
    """
    file_bytes = await file.read()
    _validate_pdf(file, file_bytes)
    # ... processing logic ...
```

### 24.4 Config Pattern (Backend)

Referensi: `backend/utils/config.py`

```python
@dataclass(frozen=True)
class Settings:
    """Immutable application settings validated at startup."""
    r2_account_id: str
    r2_access_key_id: str
    max_upload_size_mb: int

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

settings = _load_settings()  # Singleton — validated on first import
```

---

## 25. Appendix D — .editorconfig (Rekomendasi)

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true

[*.py]
indent_size = 4

[*.md]
trim_trailing_whitespace = false

[Dockerfile]
indent_style = space
indent_size = 4
```

---

## 26. Appendix E — VS Code Recommended Extensions

### 26.1 Extensions

- dbaeumer.vscode-eslint
- esbenp.prettier-vscode
- bradlc.vscode-tailwindcss
- ms-python.python
- charliermarsh.ruff
- vitest.explorer
- streetsidesoftware.code-spell-checker

### 26.2 Workspace Settings (Rekomendasi)

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always"
  },
  "eslint.validate": ["javascript", "typescript", "typescriptreact"],
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "editor.rulers": [100],
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true
  }
}
```

---

## 27. Appendix F — Anti-Patterns Catalogue

1. **God utility files** — File utility dengan fungsi yang tidak berhubungan. Pisahkan per domain.
2. **Silent catches** — `catch {}` tanpa logging atau re-throw. Selalu handle error secara eksplisit.
3. **Hardcoded values** — Magic numbers/strings di kode. Gunakan constants atau config.
4. **English error messages** — Error yang ditampilkan ke user harus selalu Bahasa Indonesia.
5. **Content logging** — Jangan pernah log isi file pengguna (privacy violation).
6. **Direct R2 access** — Semua akses file harus melalui signed URLs.
7. **Unbounded file processing** — Selalu validasi ukuran file sebelum processing.
8. **Missing cleanup** — Temp files harus selalu di-cleanup di `finally` block.
9. **Inline styles** — Gunakan Tailwind classes, bukan inline CSS.
10. **Class components** — Hanya functional components yang diizinkan.

---

## 28. Appendix G — Definition of Done

Sebuah task dianggap selesai ketika:

1. Acceptance criteria terpenuhi.
2. Kode mengikuti standar ini.
3. Tests ditambahkan/diupdate dan passing.
4. Lint dan build pass.
5. Error messages dalam Bahasa Indonesia.
6. Privacy requirements terpenuhi.
7. Mobile-first design diverifikasi.
8. PR di-review dan di-merge.

---

## 29. Appendix H — Quick Reference

### 29.1 Perintah Wajib Sebelum Merge

```bash
# Frontend
cd frontend
npm run lint
npm run build
npm run test

# Backend (setelah Ruff dikonfigurasi)
cd backend
ruff check .
ruff format --check .
pytest
```

### 29.2 Tabel Do / Don't

| Do | Don't |
|---|---|
| Validasi semua file upload (3 layer) | Trust client payload tanpa validasi |
| Error message dalam Bahasa Indonesia | Error message dalam Bahasa Inggris untuk user |
| Client-side processing untuk operasi ringan | Kirim semua file ke server |
| Cleanup temp files di `finally` block | Biarkan temp files menumpuk |
| Gunakan UUID untuk filename di server | Simpan nama asli file di server |
| Pin dependency versions | Gunakan `latest` tanpa version lock |
| Gunakan `@/` path alias | Gunakan relative paths panjang (`../../..`) |
| Structured logging (JSON) | `print()` statements untuk debugging |
| Type hints di semua function signatures | Fungsi tanpa type annotation |
| `"use client"` directive untuk interactive pages | Lupa directive dan dapat hydration error |

---

## 30. Matriks Persetujuan

Status: Approved
Versi: 1.0
Terakhir Diubah: Mei 2026

| Peran | Nama | Tanda Tangan | Tanggal |
|---|---|---|---|
| Product Owner | Muhammad Fa'iz Zulfikar | Approved | 2026-05-03 |
| AI Agent | OpenCode/Sisyphus | Approved | 2026-05-03 |

Dokumen ini mengikat untuk semua kontributor Papyr, termasuk development yang dibantu AI. Deviasi harus didokumentasikan dengan justifikasi dan bersifat time-bounded.

*Akhir dokumen — PPR-CS-001 v1.0*
