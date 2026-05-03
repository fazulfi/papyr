# PAPYR API VERSIONING STRATEGY

<div align="center">

## Strategi Versioning API

### Dokumen Teknis Arsitektur

**Papyr Document Processing Platform**

Versi 1.0 | Juni 2026

</div>

---

## Informasi Dokumen

| Field | Detail |
|-------|--------|
| **Judul** | Papyr API Versioning Strategy |
| **ID Dokumen** | PPR-AVS-001 |
| **Versi** | 1.0 |
| **Status** | Approved |
| **Tanggal Dibuat** | 2026-06-03 |
| **Tanggal Diperbarui** | 2026-06-03 |
| **Penulis** | OpenCode AI Agent (Sisyphus) |
| **Reviewer** | Muhammad Fa'iz Zulfikar |
| **Approver** | Muhammad Fa'iz Zulfikar |
| **Klasifikasi** | Internal |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Perubahan |
|-------|---------|---------|-----------|
| 1.0 | 2026-06-03 | OpenCode AI Agent (Sisyphus) | Dokumen awal, strategi versioning untuk MVP 0.2 |

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Keputusan Versioning](#2-keputusan-versioning)
3. [Skema URL](#3-skema-url)
4. [Migration Plan](#4-migration-plan)
5. [Implementasi Backend (FastAPI)](#5-implementasi-backend-fastapi)
6. [Implementasi Frontend](#6-implementasi-frontend)
7. [Kebijakan Deprecation](#7-kebijakan-deprecation)
8. [Kapan Membuat v2](#8-kapan-membuat-v2)
9. [Versioning untuk Pro API (MVP 0.3)](#9-versioning-untuk-pro-api-mvp-03)
10. [Testing Strategy](#10-testing-strategy)
11. [Dokumentasi API](#11-dokumentasi-api)
12. [Risiko dan Mitigasi](#12-risiko-dan-mitigasi)
13. [Dokumen Terkait](#13-dokumen-terkait)

---

## §1 Executive Summary

### 1.1 Mengapa API Versioning Penting

API versioning adalah kontrak antara backend dan semua client yang mengonsumsinya. Tanpa versioning yang jelas, setiap perubahan pada response format atau endpoint behavior berpotensi merusak integrasi yang sudah berjalan.

Papyr saat ini memiliki 4 endpoint tanpa versi eksplisit. Dengan MVP 0.2 yang menambahkan 7 tool baru (M12 sampai M18), dan MVP 0.3 yang memperkenalkan autentikasi serta Pro tier, kita membutuhkan fondasi versioning sejak sekarang. Menambahkan versioning belakangan jauh lebih menyakitkan daripada memulainya dari awal.

### 1.2 Kapan Mulai

**Sekarang. MVP 0.2.**

Alasannya sederhana: kita belum punya pengguna eksternal yang bergantung pada endpoint lama. Biaya migrasi saat ini mendekati nol. Menunda berarti menumpuk utang teknis yang harus dibayar nanti dengan bunga.

### 1.3 Prinsip Utama

- Satu versi aktif pada satu waktu (sampai ada kebutuhan nyata untuk v2)
- URL path versioning karena paling eksplisit dan mudah di-debug
- Backward compatibility dijaga minimal 3 bulan setelah deprecation notice
- Versioning hanya untuk public API, bukan internal/admin endpoint

---

## §2 Keputusan Versioning

### 2.1 Strategi Terpilih: URL Path Versioning

```
/api/v1/compress
/api/v1/image-to-pdf
/api/v1/pdf-to-image
```

Format ini menempatkan nomor versi langsung di URL path. Setiap request secara eksplisit menyatakan versi API yang digunakan.

### 2.2 Alternatif yang Dipertimbangkan

#### Header Versioning (Ditolak)

```
GET /api/compress
Accept: application/vnd.papyr.v1+json
```

**Alasan penolakan:**
- Lebih kompleks untuk di-test (perlu tool khusus, tidak bisa test via browser)
- Tidak terlihat di access log tanpa konfigurasi tambahan
- Developer experience buruk, terutama saat debugging
- Overkill untuk skala proyek Papyr saat ini

#### Query Parameter Versioning (Ditolak)

```
GET /api/compress?version=1
```

**Alasan penolakan:**
- Mencampur versioning dengan parameter bisnis
- Masalah caching (CDN/proxy sering mengabaikan query params)
- Terlihat tidak rapi dan membingungkan
- Tidak ada standar industri yang menggunakan pendekatan ini

### 2.3 Architecture Decision Record (ADR)

| Field | Nilai |
|-------|-------|
| **ID** | ADR-005 |
| **Judul** | Strategi API Versioning |
| **Status** | Accepted |
| **Konteks** | Papyr akan berkembang dari 4 endpoint menjadi 11+ endpoint di MVP 0.2, dan menambahkan autentikasi di MVP 0.3. Perlu mekanisme versioning yang jelas. |
| **Keputusan** | Menggunakan URL path versioning dengan format `/api/v{N}/resource` |
| **Konsekuensi** | URL lebih panjang, tapi eksplisit. Routing lebih mudah dikonfigurasi. Setiap versi bisa di-deploy dan di-test secara independen. |
| **Alternatif** | Header versioning (terlalu kompleks), query param (masalah caching) |

---

## §3 Skema URL

### 3.1 Endpoint Saat Ini (Tanpa Versi)

Endpoint yang sudah ada di MVP 0.1:

| Method | Path | Fungsi |
|--------|------|--------|
| POST | `/api/compress` | Kompresi PDF |
| POST | `/api/image-to-pdf` | Konversi gambar ke PDF |
| POST | `/api/pdf-to-image` | Konversi PDF ke gambar |
| GET | `/api/health` | Health check |

### 3.2 Endpoint Baru dengan Versi (MVP 0.2)

Semua endpoint baru langsung menggunakan prefix `/api/v1/`:

| Method | Path | Milestone | Fungsi |
|--------|------|-----------|--------|
| POST | `/api/v1/compress` | M11 | Kompresi PDF |
| POST | `/api/v1/image-to-pdf` | M11 | Konversi gambar ke PDF |
| POST | `/api/v1/pdf-to-image` | M11 | Konversi PDF ke gambar |
| POST | `/api/v1/protect` | M12 | Proteksi password PDF |
| POST | `/api/v1/unlock` | M13 | Hapus password PDF |
| POST | `/api/v1/watermark` | M14 | Tambah watermark |
| POST | `/api/v1/sign` | M15 | Tanda tangan digital |
| POST | `/api/v1/pdf-to-word` | M16 | Konversi PDF ke Word |
| POST | `/api/v1/ocr` | M17 | OCR (teks dari gambar/scan) |
| POST | `/api/v1/pdf-to-excel` | M18 | Konversi PDF ke Excel |
| GET | `/api/v1/health` | M11 | Health check |

### 3.3 Admin Endpoints (Fase 2F)

Endpoint admin bersifat internal dan tidak memerlukan versioning:

| Method | Path | Fungsi |
|--------|------|--------|
| GET | `/api/admin/stats` | Statistik penggunaan |
| GET | `/api/admin/users` | Daftar pengguna |
| POST | `/api/admin/config` | Update konfigurasi |

Alasan tanpa versi: endpoint admin hanya diakses oleh dashboard internal yang kita kontrol sepenuhnya. Tidak ada client eksternal yang bergantung padanya.

---

## §4 Migration Plan

### 4.1 Fase Migrasi

#### Fase 1: Tambah Endpoint Berversi (Minggu 1-2)

Semua endpoint baru MVP 0.2 langsung dibuat dengan prefix `/api/v1/`. Endpoint lama tetap berfungsi tanpa perubahan.

#### Fase 2: Redirect untuk Backward Compatibility (Minggu 3)

Tambahkan redirect 301 dari endpoint lama ke endpoint baru:

```
/api/compress      → 301 → /api/v1/compress
/api/image-to-pdf  → 301 → /api/v1/image-to-pdf
/api/pdf-to-image  → 301 → /api/v1/pdf-to-image
/api/health        → 301 → /api/v1/health
```

#### Fase 3: Deprecation Notice (Bulan 2-3)

Endpoint lama tetap berfungsi tapi mengembalikan header deprecation:

```
Sunset: Sat, 03 Sep 2026 00:00:00 GMT
Deprecation: true
Link: </api/v1/compress>; rel="successor-version"
```

#### Fase 4: Penghapusan Endpoint Lama (Bulan 6)

Endpoint tanpa versi dihapus sepenuhnya. Semua request ke path lama mendapat response 410 Gone.

### 4.2 Timeline

| Fase | Mulai | Selesai | Aksi |
|------|-------|---------|------|
| Fase 1 | 2026-06-03 | 2026-06-17 | Deploy endpoint `/api/v1/*` |
| Fase 2 | 2026-06-17 | 2026-06-24 | Aktifkan redirect 301 |
| Fase 3 | 2026-07-01 | 2026-09-01 | Deprecation header aktif |
| Fase 4 | 2026-12-01 | 2026-12-01 | Hapus endpoint lama |

### 4.3 Catatan Penting

Karena Papyr saat ini belum memiliki pengguna eksternal, timeline di atas bersifat konservatif. Dalam praktiknya, Fase 1 dan 2 bisa dilakukan bersamaan. Fase 4 bisa dipercepat jika analytics menunjukkan zero traffic ke endpoint lama.

---

## §5 Implementasi Backend (FastAPI)

### 5.1 Struktur Router

```
backend/
├── main.py
├── routers/
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── compress.py
│   │   ├── image_to_pdf.py
│   │   ├── pdf_to_image.py
│   │   ├── protect.py
│   │   ├── unlock.py
│   │   ├── watermark.py
│   │   ├── sign.py
│   │   ├── pdf_to_word.py
│   │   ├── ocr.py
│   │   ├── pdf_to_excel.py
│   │   └── health.py
│   ├── admin/
│   │   ├── __init__.py
│   │   └── stats.py
│   └── legacy/
│       └── redirects.py
```

### 5.2 Router Setup

```python
# routers/v1/__init__.py
from fastapi import APIRouter
from .compress import router as compress_router
from .image_to_pdf import router as image_to_pdf_router
from .pdf_to_image import router as pdf_to_image_router
from .protect import router as protect_router
from .unlock import router as unlock_router
from .watermark import router as watermark_router
from .sign import router as sign_router
from .pdf_to_word import router as pdf_to_word_router
from .ocr import router as ocr_router
from .pdf_to_excel import router as pdf_to_excel_router
from .health import router as health_router

v1_router = APIRouter(prefix="/api/v1", tags=["v1"])

v1_router.include_router(compress_router)
v1_router.include_router(image_to_pdf_router)
v1_router.include_router(pdf_to_image_router)
v1_router.include_router(protect_router)
v1_router.include_router(unlock_router)
v1_router.include_router(watermark_router)
v1_router.include_router(sign_router)
v1_router.include_router(pdf_to_word_router)
v1_router.include_router(ocr_router)
v1_router.include_router(pdf_to_excel_router)
v1_router.include_router(health_router)
```

### 5.3 Contoh Router Individual

```python
# routers/v1/compress.py
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post("/compress", summary="Kompresi PDF")
async def compress_pdf(
    file: UploadFile = File(...),
    quality: str = "medium"
):
    """
    Kompres file PDF dengan level kualitas yang dipilih.
    
    - **file**: File PDF yang akan dikompres
    - **quality**: Level kompresi (low, medium, high)
    """
    # ... logika kompresi ...
    return StreamingResponse(
        content=compressed_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=compressed_{file.filename}"
        }
    )
```

### 5.4 Main App Registration

```python
# main.py
from fastapi import FastAPI
from routers.v1 import v1_router
from routers.legacy.redirects import legacy_router

app = FastAPI(
    title="Papyr API",
    version="1.0.0",
    description="Document processing platform"
)

# Register versioned routes
app.include_router(v1_router)

# Register legacy redirects (temporary)
app.include_router(legacy_router)
```

### 5.5 Backward Compatibility Redirect

```python
# routers/legacy/redirects.py
from fastapi import APIRouter
from fastapi.responses import RedirectResponse

legacy_router = APIRouter(tags=["legacy-deprecated"])

LEGACY_REDIRECTS = {
    "/api/compress": "/api/v1/compress",
    "/api/image-to-pdf": "/api/v1/image-to-pdf",
    "/api/pdf-to-image": "/api/v1/pdf-to-image",
    "/api/health": "/api/v1/health",
}


@legacy_router.api_route(
    "/api/{path:path}",
    methods=["GET", "POST"],
    include_in_schema=False
)
async def legacy_redirect(path: str):
    """Redirect endpoint lama ke versi baru."""
    old_path = f"/api/{path}"
    new_path = LEGACY_REDIRECTS.get(old_path)
    
    if new_path:
        return RedirectResponse(
            url=new_path,
            status_code=301,
            headers={
                "Sunset": "Sat, 03 Sep 2026 00:00:00 GMT",
                "Deprecation": "true",
            }
        )
    
    return {"error": "Endpoint not found", "status": 404}
```

---

## §6 Implementasi Frontend

### 6.1 Konfigurasi API URL

```typescript
// frontend/src/lib/config.ts
interface AppConfig {
  apiUrl: string;
  apiVersion: string;
  baseApiPath: string;
}

function getConfig(): AppConfig {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const apiVersion = "v1";
  
  return {
    apiUrl,
    apiVersion,
    baseApiPath: `${apiUrl}/api/${apiVersion}`,
  };
}

export const config = getConfig();
```

### 6.2 Penggunaan di Service Layer

```typescript
// frontend/src/lib/api.ts
import { config } from "./config";

export async function compressPdf(file: File, quality: string): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("quality", quality);

  const response = await fetch(`${config.baseApiPath}/compress`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Compression failed: ${response.statusText}`);
  }

  return response.blob();
}

export async function imageToPdf(files: File[]): Promise<Blob> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${config.baseApiPath}/image-to-pdf`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Conversion failed: ${response.statusText}`);
  }

  return response.blob();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${config.baseApiPath}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
```

### 6.3 Migrasi dari Endpoint Lama

Perubahan yang diperlukan di frontend:

| Sebelum | Sesudah |
|---------|---------|
| `${apiUrl}/api/compress` | `${config.baseApiPath}/compress` |
| `${apiUrl}/api/image-to-pdf` | `${config.baseApiPath}/image-to-pdf` |
| `${apiUrl}/api/pdf-to-image` | `${config.baseApiPath}/pdf-to-image` |
| `${apiUrl}/api/health` | `${config.baseApiPath}/health` |

Semua perubahan terpusat di `config.ts`. Jika suatu saat perlu pindah ke v2, cukup ubah satu nilai `apiVersion`.

---

## §7 Kebijakan Deprecation

### 7.1 Prinsip Deprecation

1. **Minimum 3 bulan notice** sebelum endpoint dihapus
2. **Header Sunset** wajib ada di setiap response endpoint deprecated
3. **Changelog entry** untuk setiap deprecation
4. **Analytics tracking** untuk memantau penggunaan endpoint deprecated

### 7.2 Response Headers untuk Endpoint Deprecated

```
HTTP/1.1 200 OK
Content-Type: application/pdf
Sunset: Sat, 03 Sep 2026 00:00:00 GMT
Deprecation: true
Link: </api/v1/compress>; rel="successor-version"
X-Papyr-Warning: "This endpoint is deprecated. Migrate to /api/v1/compress"
```

### 7.3 Proses Deprecation

| Langkah | Waktu | Aksi |
|---------|-------|------|
| 1 | T+0 | Tandai endpoint sebagai deprecated di kode dan docs |
| 2 | T+0 | Tambahkan Sunset header dengan tanggal penghapusan |
| 3 | T+0 | Publish changelog entry |
| 4 | T+30 hari | Review analytics, kirim notifikasi jika masih ada traffic |
| 5 | T+60 hari | Warning log di server untuk setiap hit ke deprecated endpoint |
| 6 | T+90 hari | Hapus endpoint, return 410 Gone |

### 7.4 Tracking Penggunaan

```python
# middleware/deprecation_tracker.py
import logging
from datetime import datetime

logger = logging.getLogger("papyr.deprecation")

DEPRECATED_PATHS = {
    "/api/compress": "2026-09-03",
    "/api/image-to-pdf": "2026-09-03",
    "/api/pdf-to-image": "2026-09-03",
    "/api/health": "2026-09-03",
}


async def track_deprecated_usage(request, call_next):
    path = request.url.path
    
    if path in DEPRECATED_PATHS:
        logger.warning(
            f"Deprecated endpoint hit: {path} | "
            f"Client: {request.client.host} | "
            f"Sunset: {DEPRECATED_PATHS[path]}"
        )
    
    response = await call_next(request)
    return response
```

---

## §8 Kapan Membuat v2

### 8.1 Prinsip Dasar

v2 hanya dibuat ketika kontrak v1 harus dipatahkan. Bukan karena ingin "versi baru yang lebih keren", tapi karena ada perubahan fundamental yang tidak bisa di-backward-compatible-kan.

### 8.2 Kriteria Pembuatan v2

| Kriteria | Contoh | Perlu v2? |
|----------|--------|-----------|
| Tambah field baru di response | `{ ..., "pages": 5 }` | Tidak |
| Tambah endpoint baru | `/api/v1/merge` | Tidak |
| Tambah parameter opsional | `?dpi=300` | Tidak |
| Ubah format response secara fundamental | JSON → streaming chunks | Ya |
| Hapus field yang sudah ada | Hilangkan `filename` dari response | Ya |
| Ubah tipe data field | `size: "1024"` → `size: 1024` | Ya |
| Ubah model autentikasi | Cookie → API key (MVP 0.3) | Mungkin |
| Ubah error format | `{error: string}` → `{errors: [{code, msg}]}` | Ya |

### 8.3 Skenario MVP 0.3

MVP 0.3 memperkenalkan autentikasi dan Pro tier. Pertanyaannya: apakah ini memerlukan v2?

**Jawaban: Tidak, jika diimplementasikan dengan benar.**

Autentikasi bisa ditambahkan sebagai layer di atas v1 tanpa mengubah kontrak:
- Free tier tetap tanpa auth (sama seperti v1 saat ini)
- Pro tier menambahkan header `X-API-Key` (additive, bukan breaking)
- Rate limiting via header tambahan (additive)

v2 hanya diperlukan jika kita memutuskan bahwa SEMUA endpoint wajib auth, yang akan memecah kontrak v1 "tanpa auth".

### 8.4 Proses Pembuatan Versi Baru

1. Dokumentasikan alasan di ADR baru
2. Buat router `/api/v2/` terpisah
3. v1 tetap aktif minimal 6 bulan setelah v2 launch
4. Migration guide wajib tersedia sebelum v2 dipublikasikan
5. Tidak boleh ada lebih dari 2 versi aktif bersamaan

---

## §9 Versioning untuk Pro API (MVP 0.3)

### 9.1 Arsitektur Pro Tier

Pro API menggunakan prefix yang sama (`/api/v1/`) tapi dengan autentikasi tambahan:

```
POST /api/v1/compress
X-API-Key: pk_live_abc123def456
```

### 9.2 Header Tambahan

| Header | Arah | Deskripsi |
|--------|------|-----------|
| `X-API-Key` | Request | API key untuk autentikasi Pro tier |
| `X-RateLimit-Limit` | Response | Batas request per window |
| `X-RateLimit-Remaining` | Response | Sisa request dalam window |
| `X-RateLimit-Reset` | Response | Timestamp reset window (Unix epoch) |
| `X-Plan-Tier` | Response | Tier aktif (free/pro/enterprise) |

### 9.3 Rate Limiting per Tier

| Tier | Limit | Window | Prioritas |
|------|-------|--------|-----------|
| Free (tanpa key) | 10 request | 1 jam | Low |
| Pro | 1000 request | 1 jam | High |
| Enterprise | Unlimited | - | Highest |

### 9.4 Contoh Response dengan Rate Limit Headers

```
HTTP/1.1 200 OK
Content-Type: application/pdf
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1717459200
X-Plan-Tier: pro
```

### 9.5 Error Response untuk Rate Limit

```json
{
  "error": "rate_limit_exceeded",
  "message": "Batas request tercapai. Upgrade ke Pro untuk limit lebih tinggi.",
  "retry_after": 3600,
  "limit": 10,
  "reset_at": "2026-06-03T15:00:00Z"
}
```

---

## §10 Testing Strategy

### 10.1 Test Coverage Requirements

| Aspek | Requirement |
|-------|-------------|
| Endpoint v1 | 100% coverage untuk semua route |
| Redirect legacy | Test 301 redirect untuk setiap endpoint lama |
| Deprecation headers | Verifikasi header Sunset ada di response |
| Rate limiting | Test boundary conditions per tier |
| Error responses | Test semua error code dan format |

### 10.2 Contoh Test

```python
# tests/test_v1_compress.py
import pytest
from httpx import AsyncClient
from main import app


@pytest.mark.asyncio
async def test_v1_compress_endpoint():
    """Endpoint v1 compress harus berfungsi."""
    async with AsyncClient(app=app, base_url="http://test") as client:
        with open("tests/fixtures/sample.pdf", "rb") as f:
            response = await client.post(
                "/api/v1/compress",
                files={"file": ("test.pdf", f, "application/pdf")},
                data={"quality": "medium"},
            )
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/pdf"


@pytest.mark.asyncio
async def test_legacy_redirect():
    """Endpoint lama harus redirect ke v1."""
    async with AsyncClient(
        app=app, base_url="http://test", follow_redirects=False
    ) as client:
        response = await client.post("/api/compress")
        
        assert response.status_code == 301
        assert response.headers["location"] == "/api/v1/compress"
        assert "Sunset" in response.headers


@pytest.mark.asyncio
async def test_deprecated_endpoint_headers():
    """Endpoint deprecated harus punya Sunset header."""
    async with AsyncClient(
        app=app, base_url="http://test", follow_redirects=False
    ) as client:
        response = await client.get("/api/health")
        
        assert response.status_code == 301
        assert response.headers["deprecation"] == "true"
```

### 10.3 CI Pipeline

Setiap push ke branch utama harus menjalankan:

1. Unit test semua endpoint v1
2. Integration test redirect legacy (selama masih aktif)
3. Contract test untuk memastikan response format tidak berubah
4. Load test untuk verifikasi rate limiting

---

## §11 Dokumentasi API

### 11.1 OpenAPI Spec per Versi

Setiap versi API memiliki OpenAPI spec tersendiri:

```
docs/
├── openapi-v1.yaml
└── openapi-v2.yaml (ketika ada)
```

FastAPI menghasilkan spec ini secara otomatis dari type hints dan docstrings.

### 11.2 Akses Dokumentasi

| URL | Konten |
|-----|--------|
| `/docs` | Swagger UI (versi terbaru) |
| `/docs/v1` | Swagger UI khusus v1 |
| `/redoc` | ReDoc (versi terbaru) |
| `/openapi.json` | Raw OpenAPI spec |

### 11.3 Konten Wajib di Dokumentasi

Setiap endpoint harus mendokumentasikan:

- Deskripsi singkat fungsi
- Parameter (path, query, body) dengan tipe data
- Response format (sukses dan error)
- Contoh request/response
- Rate limit yang berlaku
- Versi sejak kapan tersedia

### 11.4 Migration Guide

Setiap kali versi baru dirilis, migration guide harus mencakup:

1. Daftar breaking changes
2. Mapping endpoint lama ke baru
3. Perubahan format request/response
4. Timeline deprecation versi lama
5. Contoh kode migrasi

---

## §12 Risiko dan Mitigasi

### 12.1 Tabel Risiko

| ID | Risiko | Dampak | Probabilitas | Mitigasi |
|----|--------|--------|--------------|----------|
| R1 | Client tidak migrasi ke v1 tepat waktu | Medium | Low | Perpanjang deprecation period, tracking analytics |
| R2 | Breaking change tidak terdeteksi | High | Medium | Contract testing di CI, review otomatis |
| R3 | Versioning menambah kompleksitas maintenance | Medium | Medium | Maksimal 2 versi aktif, hapus versi lama agresif |
| R4 | Inkonsistensi antara versi | Medium | Low | Shared business logic, hanya routing yang berbeda |
| R5 | Dokumentasi tidak sinkron dengan implementasi | Medium | Medium | Auto-generate dari kode (FastAPI + OpenAPI) |

### 12.2 Mitigasi Detail

**R2: Breaking change tidak terdeteksi**

Solusi: Implementasi contract testing menggunakan snapshot response. Setiap endpoint v1 memiliki "golden file" yang berisi expected response structure. CI membandingkan response aktual dengan golden file. Jika berbeda, build gagal.

**R3: Kompleksitas maintenance**

Solusi: Business logic tetap di satu tempat (service layer). Router hanya bertanggung jawab untuk parsing input dan formatting output. Jika v2 dibuat, ia memanggil service yang sama dengan adapter berbeda.

```
Request → Router v1 → Service Layer → Response v1 format
Request → Router v2 → Service Layer → Response v2 format
```

---

## §13 Dokumen Terkait

| ID Dokumen | Judul | Relevansi |
|------------|-------|-----------|
| PPR-SRS-001 | Software Requirements Specification | Definisi endpoint dan fitur |
| PPR-ARC-001 | Architecture Document | Arsitektur backend dan routing |
| PPR-SEC-001 | Security Architecture | Autentikasi dan API key management |
| PPR-DEP-001 | Deployment Guide | Konfigurasi routing di production |
| PPR-TST-001 | Test Strategy | Framework testing API |

---

## Persetujuan Dokumen

| Peran | Nama | Tanggal | Tanda Tangan |
|-------|------|---------|--------------|
| **Penulis** | OpenCode AI Agent (Sisyphus) | 2026-06-03 | [Digital] |
| **Reviewer** | Muhammad Fa'iz Zulfikar | 2026-06-03 | [Digital] |
| **Approver** | Muhammad Fa'iz Zulfikar | 2026-06-03 | [Digital] |

---

*Dokumen ini bersifat internal dan merupakan bagian dari dokumentasi teknis Papyr Platform. Distribusi di luar tim pengembangan memerlukan persetujuan tertulis dari Approver.*
