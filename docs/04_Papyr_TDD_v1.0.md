**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Technical Design Document (TDD)**

Version 1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Technical Design Document — Papyr            |
| **ID Dokumen**      | PPR-TDD-001                                  |
| **Versi**           | 1.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Mei 2026                                     |
| **Terakhir Diubah** | Mei 2026                                     |
| **Penulis**         | Muhammad Fa'iz Zulfikar                      |
| **Ditinjau Oleh**   | Product Owner, AI Agent                      |
| **Disetujui Oleh**  | Product Owner                                |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                |
|-----------|-------------|------------------------------|------------------------------------------------------------------------------|
| 1.0       | Mei 2026    | Muhammad Fa'iz Zulfikar      | Draft awal — TDD lengkap untuk arsitektur teknis MVP 0.1 (6 tool, live)      |

**Referensi Silang Dokumen**

| **ID Dokumen** | **Judul**                              | **Versi** |
|----------------|----------------------------------------|-----------|
| PPR-BRD-001    | Business Requirements Document         | 1.0       |
| PPR-SRS-001    | Software Requirements Specification    | 1.0       |
| PPR-ADR-001    | Architecture Decision Records          | 1.0       |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Desain Frontend](#3-desain-frontend)
4. [Desain Backend](#4-desain-backend)
5. [Desain Penyimpanan](#5-desain-penyimpanan)
6. [Keamanan](#6-keamanan)
7. [Performa & Skalabilitas](#7-performa--skalabilitas)
8. [Monitoring & Observability](#8-monitoring--observability)
9. [Deployment](#9-deployment)
10. [Diagram Alur](#10-diagram-alur)
11. [Referensi Silang ke ADR](#11-referensi-silang-ke-adr)
12. [Persetujuan Dokumen](#12-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini menjelaskan desain teknis lengkap dari sistem Papyr — web application utilitas PDF yang dirancang untuk pasar Indonesia. TDD ini menjadi referensi otoritatif bagi seluruh keputusan implementasi, arsitektur komponen, alur data, dan integrasi antar-layer dalam sistem.

Dokumen ini ditujukan untuk:
- Panduan implementasi bagi developer (solo founder + AI agent)
- Referensi arsitektur untuk evaluasi teknis oleh investor/partner
- Dokumentasi keputusan desain yang dapat di-trace ke ADR (PPR-ADR-001)
- Baseline untuk code review dan quality assurance

### 1.2 Ruang Lingkup

TDD ini mencakup desain teknis untuk **MVP 0.1** yang saat ini live di mypapyr.com, meliputi:

- Arsitektur frontend (Next.js 16, Vercel)
- Arsitektur backend (FastAPI, Railway)
- Object storage (Cloudflare R2)
- 6 tool PDF: Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image
- Sistem keamanan, monitoring, dan deployment

Tidak termasuk dalam scope dokumen ini:
- Fitur MVP 0.2 (Protect PDF, Unlock PDF, Watermark, Sign, PDF-to-Word, OCR)
- Sistem autentikasi dan payment (MVP 0.3)
- AI-powered features (Fase 2)

### 1.3 Referensi

| **Dokumen**                        | **Lokasi**                                          |
|------------------------------------|-----------------------------------------------------|
| BRD v1.0                           | `docs/01_Papyr_BRD_v1.0.md`                        |
| Technical Architecture MVP 0.1     | `blueprint/Papyr_TechArch_MVP_0.1.md`               |
| ADR v1.0                           | `docs/14_Papyr_ADR_v1.0.md`                        |
| Frontend Config                    | `frontend/src/lib/config.ts`                        |
| Backend Config                     | `backend/utils/config.py`                           |
| PDF Utilities                      | `frontend/src/lib/pdfUtils.ts`                      |
| Analytics Module                   | `frontend/src/lib/analytics.ts`                     |

### 1.4 Glosarium

| **Istilah**       | **Definisi**                                                                                   |
|-------------------|-----------------------------------------------------------------------------------------------|
| Client-side       | Pemrosesan yang terjadi di browser pengguna tanpa mengirim file ke server                     |
| Server-side       | Pemrosesan yang terjadi di backend server (Railway)                                           |
| Hybrid            | Kombinasi client-side dan server-side berdasarkan kondisi (ukuran file)                       |
| Signed URL        | URL sementara dengan tanda tangan kriptografis yang expire setelah waktu tertentu             |
| Magic Bytes       | Byte awal file yang mengidentifikasi format sebenarnya (file signature)                       |
| R2                | Cloudflare R2 — object storage S3-compatible dengan zero egress fee                           |
| pdf-lib           | Library JavaScript untuk manipulasi PDF di browser                                            |
| PyMuPDF (fitz)    | Library Python untuk rendering dan manipulasi PDF                                             |
| Ghostscript       | Engine open-source untuk kompresi dan konversi PDF                                            |
| UUID              | Universally Unique Identifier — pengenal acak untuk anonimisasi filename                     |
| DPI               | Dots Per Inch — resolusi output gambar                                                        |
| Cold Start        | Waktu yang dibutuhkan container untuk aktif setelah periode idle                              |

---

## 2. Arsitektur Sistem

### 2.1 Arsitektur High-Level

```
+-------------------------------------------------------------------------+
|                              PENGGUNA                                    |
|                    (Browser: Chrome, Safari, Firefox)                    |
+-------------------------------+-----------------------------------------+
                                |
                                | HTTPS (TLS 1.3)
                                |
+-------------------------------v-----------------------------------------+
|                          mypapyr.com                                     |
|                       (Hostinger DNS)                                    |
+--------------+----------------------------------+-----------------------+
               |                                  |
               v                                  v
+--------------------------+        +------------------------------+
|     VERCEL (Edge CDN)    |        |     RAILWAY (us-west2)       |
|     -----------------    |        |     ------------------       |
|                          |        |                              |
|  Next.js 16 (App Router) |  REST  |  FastAPI (Python 3.11)       |
|  TypeScript              |--API-->|  Ghostscript (gs)            |
|  Tailwind CSS v4         |        |  PyMuPDF (fitz)              |
|  pdf-lib                 |        |  slowapi (rate limiter)      |
|  @vercel/analytics       |        |  boto3 (R2 client)           |
|                          |        |                              |
|  [Client-Side Processing]|        |  [Server-Side Processing]    |
|  - Merge PDF             |        |  - Compress PDF              |
|  - Split PDF             |        |  - PDF to Image              |
|  - Rotate PDF            |        |  - Image to PDF (fallback)   |
|  - Image to PDF (<3MB)   |        |                              |
+--------------------------+        +--------------+---------------+
                                                   |
                                                   | S3-compatible API
                                                   | (boto3, signature v4)
                                                   v
                                    +------------------------------+
                                    |     CLOUDFLARE R2            |
                                    |     --------------           |
                                    |                              |
                                    |  Bucket: papyr-files         |
                                    |  Region: auto (global)       |
                                    |  Signed URLs (1 jam expiry)  |
                                    |  Cron: auto-delete 60 menit  |
                                    |  R2 lifecycle: 24h (safety)  |
                                    |  Free: 10GB, 10M ops/bulan   |
                                    |                              |
                                    +------------------------------+
```

### 2.2 Diagram Komponen

```
+-------------------------------------------------------------------------+
|                           FRONTEND (Vercel)                              |
|                                                                         |
|  +-------------+  +-------------+  +-------------+  +--------------+   |
|  |  app/       |  | components/ |  |   lib/      |  |  public/     |   |
|  |  -----      |  | ----------  |  |   ----      |  |  ------      |   |
|  | layout.tsx  |  | PDFUploader |  | config.ts   |  | sitemap.xml  |   |
|  | page.tsx    |  | Navbar      |  | pdfUtils.ts |  | robots.txt   |   |
|  | compress/   |  | Footer      |  | analytics.ts|  | OG images    |   |
|  | merge/      |  | OtherTools  |  | format.ts   |  |              |   |
|  | split/      |  | PageRange   |  |             |  |              |   |
|  | rotate/     |  |  Input      |  |             |  |              |   |
|  | image-to-   |  |             |  |             |  |              |   |
|  |   pdf/      |  |             |  |             |  |              |   |
|  | pdf-to-     |  |             |  |             |  |              |   |
|  |   image/    |  |             |  |             |  |              |   |
|  +-------------+  +-------------+  +-------------+  +--------------+   |
+-------------------------------------------------------------------------+

+-------------------------------------------------------------------------+
|                           BACKEND (Railway)                              |
|                                                                         |
|  +-------------+  +-------------+  +-------------+  +--------------+   |
|  |  main.py    |  |  routers/   |  |  services/  |  |   utils/     |   |
|  |  -------    |  |  --------   |  |  ---------  |  |   ------     |   |
|  | FastAPI app |  | compress.py |  | compress_   |  | config.py    |   |
|  | CORS        |  | image_to_   |  |  service.py |  | r2.py        |   |
|  | Rate limit  |  |  pdf.py     |  | pdf_to_     |  | cleanup.py   |   |
|  | Lifespan    |  | pdf_to_     |  |  image_     |  | logging_     |   |
|  | Cleanup     |  |  image.py   |  |  service.py |  |  config.py   |   |
|  |  cron       |  | connecti-   |  |             |  |              |   |
|  |             |  |  vity.py    |  |             |  |              |   |
|  +-------------+  +-------------+  +-------------+  +--------------+   |
+-------------------------------------------------------------------------+
```

### 2.3 Processing Boundary

Papyr menggunakan arsitektur hybrid yang membagi pemrosesan berdasarkan kompleksitas operasi (ref: ADR-009):

| **Tool**        | **Processing**  | **Library**              | **Alasan**                                                    |
|-----------------|-----------------|--------------------------|---------------------------------------------------------------|
| Compress PDF    | Server-side     | Ghostscript (subprocess) | Butuh engine kompresi yang tidak ada di browser               |
| Merge PDF       | Client-side     | pdf-lib                  | Manipulasi struktur PDF, tidak butuh rendering                |
| Split PDF       | Client-side     | pdf-lib                  | Ekstraksi halaman, tidak butuh rendering                      |
| Rotate PDF      | Client-side     | pdf-lib                  | Set rotation metadata, operasi trivial                        |
| Image to PDF    | Hybrid          | pdf-lib + PyMuPDF        | File <3MB di client (pdf-lib), >=3MB fallback ke server       |
| PDF to Image    | Server-side     | PyMuPDF (fitz)           | Rasterisasi membutuhkan rendering engine                      |

**Aturan utama:** Proses di client jika operasinya tidak membutuhkan rendering pixel. Kirim ke server hanya jika membutuhkan engine khusus (Ghostscript/PyMuPDF).

---

## 3. Desain Frontend

### 3.1 Struktur Aplikasi Next.js 16

Frontend menggunakan Next.js 16 dengan App Router (ref: ADR-015), di-deploy di Vercel Free tier.

```
frontend/src/
+-- app/                          # App Router -- file-based routing
|   +-- layout.tsx                # Root layout (DM Sans font, analytics)
|   +-- page.tsx                  # Landing page (tool grid)
|   +-- compress/
|   |   +-- layout.tsx            # SEO metadata untuk /compress
|   |   +-- page.tsx              # Compress tool page
|   +-- merge/
|   |   +-- layout.tsx            # SEO metadata untuk /merge
|   |   +-- page.tsx              # Merge tool page
|   +-- split/
|   |   +-- layout.tsx            # SEO metadata untuk /split
|   |   +-- page.tsx              # Split tool page
|   +-- rotate/
|   |   +-- layout.tsx            # SEO metadata untuk /rotate
|   |   +-- page.tsx              # Rotate tool page
|   +-- image-to-pdf/
|   |   +-- layout.tsx            # SEO metadata untuk /image-to-pdf
|   |   +-- page.tsx              # Image-to-PDF tool page
|   +-- pdf-to-image/
|   |   +-- layout.tsx            # SEO metadata untuk /pdf-to-image
|   |   +-- page.tsx              # PDF-to-Image tool page
|   +-- sitemap.ts                # Auto-generated sitemap.xml (7 URLs)
|   +-- robots.ts                 # Auto-generated robots.txt
+-- components/                   # Reusable UI components
|   +-- PDFUploader.tsx           # Shared uploader dengan auto-retry
|   +-- Navbar.tsx                # Sticky navigation, mobile hamburger
|   +-- Footer.tsx                # Footer + language switcher
|   +-- OtherTools.tsx            # Cross-link ke tool lain
|   +-- PageRangeInput.tsx        # Input range halaman (split, pdf-to-image)
+-- lib/                          # Utilities dan konfigurasi
    +-- config.ts                 # Typed env config + upload limits
    +-- pdfUtils.ts               # pdf-lib operations (merge, split, rotate, etc.)
    +-- analytics.ts              # Vercel Analytics event tracking
    +-- format.ts                 # Formatting helpers (file size, percent)
```

### 3.2 Hierarki Komponen

```
RootLayout (layout.tsx)
+-- <Analytics />                 # @vercel/analytics
+-- <SpeedInsights />             # @vercel/speed-insights
+-- Navbar
+-- {children}                    # Page content
|   +-- LandingPage (page.tsx)
|   |   +-- ToolGrid (6 tool cards)
|   +-- CompressPage
|   |   +-- PDFUploader (endpoint="/api/compress", toolName="compress")
|   |   +-- OtherTools
|   +-- MergePage
|   |   +-- FileDropzone (multi-file, drag-reorder via @dnd-kit)
|   |   +-- OtherTools
|   +-- SplitPage
|   |   +-- PDFUploader (single file)
|   |   +-- PageRangeInput
|   |   +-- OtherTools
|   +-- RotatePage
|   |   +-- PDFUploader (single file)
|   |   +-- RotationControls (per-page / all pages)
|   |   +-- OtherTools
|   +-- ImageToPdfPage
|   |   +-- ImageDropzone (multi-image, drag-reorder)
|   |   +-- OtherTools
|   +-- PdfToImagePage
|       +-- PDFUploader (endpoint="/api/pdf-to-image", toolName="pdf-to-image")
|       +-- PageRangeInput
|       +-- OtherTools
+-- Footer
```

### 3.3 Client-Side Processing dengan pdf-lib

File: `frontend/src/lib/pdfUtils.ts`

Semua operasi client-side menggunakan library `pdf-lib` (ref: ADR-010). Fungsi yang tersedia:

| **Fungsi**                | **Signature**                                                              | **Deskripsi**                                    |
|---------------------------|----------------------------------------------------------------------------|--------------------------------------------------|
| `mergePDFs`               | `(files: File[]) => Promise<Uint8Array>`                                   | Gabungkan 2+ PDF menjadi satu dokumen            |
| `splitPDF`                | `(file: File, pages: number[]) => Promise<Uint8Array>`                     | Ekstraksi halaman tertentu dari PDF              |
| `rotatePDF`               | `(file: File, pageRotationMap: PageRotationMap) => Promise<Uint8Array>`    | Rotasi halaman spesifik                          |
| `rotatePDFAllPages`       | `(file: File, addDegree: number) => Promise<Uint8Array>`                   | Rotasi semua halaman dengan derajat yang sama    |
| `imagesToPDF`             | `(files: File[]) => Promise<Uint8Array>`                                   | Konversi gambar (JPG/PNG/WebP) ke PDF            |
| `getPDFPageCount`         | `(file: File) => Promise<number>`                                          | Baca jumlah halaman PDF                          |
| `downloadPDF`             | `(data: Uint8Array, filename: string) => void`                             | Trigger browser download dari Uint8Array         |

**WebP Support (ref: ADR-013):**

Karena pdf-lib tidak mendukung WebP secara native, konversi dilakukan via `OffscreenCanvas`:

```typescript
// frontend/src/lib/pdfUtils.ts -- fungsi webpToPng()
async function webpToPng(file: File): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context tidak tersedia.");
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await canvas.convertToBlob({ type: "image/png" });
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}
```

### 3.4 State Management

Frontend menggunakan React `useState` untuk state management lokal per-komponen. Tidak ada global state management library (Redux, Zustand) karena setiap tool page bersifat independen.

**PDFUploader State Machine** (`frontend/src/components/PDFUploader.tsx`):

```
+--------+   file selected   +-----------+   upload done   +------------+
|  idle  |------------------>| uploading |---------------->| processing |
+--------+                   +-----------+                 +------------+
    ^                             |                              |
    |         reset               | XHR error                   | success
    |<----------------------------+                              v
    |                             v                         +--------+
    |                        +---------+                    |  done  |
    |<-----------------------|  error  |                    +--------+
    |         reset          +---------+
    |                             ^
    |                             | retry failed (2nd attempt)
    |                             |
    |                        +-------------+
    |                        | auto-retry  | (1x, setelah 1 detik)
    |                        +-------------+
```

State types yang digunakan:

```typescript
type UploadState = "idle" | "uploading" | "processing" | "done" | "error";
```

### 3.5 Analytics Integration

File: `frontend/src/lib/analytics.ts`

Menggunakan Vercel Analytics (ref: ADR-008) dengan custom event tracking:

```typescript
import { track } from "@vercel/analytics";

// Event types
type AnalyticsEvent = "task_started" | "task_completed" | "task_failed";
type ToolName = "compress" | "merge" | "split" | "image-to-pdf" | "pdf-to-image" | "rotate";
type DeviceCategory = "mobile" | "tablet" | "desktop";

// Device detection berdasarkan window.innerWidth
// < 768px = mobile, < 1024px = tablet, >= 1024px = desktop

// Fungsi tracking
trackTaskStarted(tool: ToolName)                    // Fire saat user mulai proses
trackTaskCompleted(tool: ToolName)                  // Fire saat hasil siap
trackTaskFailed(tool: ToolName, error: string)      // Fire saat error (truncated 200 char)
```

### 3.6 Mekanisme Auto-Retry

Implementasi di `PDFUploader.tsx` (ref: ADR-007):

**Strategi:**
- Network error / server error (5xx) --> retry otomatis 1x setelah 1 detik
- File validation error (4xx, bukan 429) --> langsung tampilkan error (tidak di-retry)
- Rate limit (429) --> langsung tampilkan error dengan pesan "Coba lagi dalam 1 menit"

**Implementasi:**

```typescript
// frontend/src/components/PDFUploader.tsx -- handleError()
const handleError = (message: string, file: File, isRetry: boolean) => {
  if (!isRetry) {
    // First failure -- auto-retry setelah 1 detik
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      uploadFile(file, true);  // isRetry = true
    }, 1000);
  } else {
    // Second failure -- tampilkan error ke user
    setErrorMessage(message);
    setState("error");
    trackTaskFailed(toolName, "server_error");
  }
};
```

### 3.7 Konfigurasi Frontend

File: `frontend/src/lib/config.ts`

```typescript
export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",       // standby
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "", // standby
} as const;

export const limits = {
  maxUploadBytes: 20 * 1024 * 1024,    // 20MB
  maxUploadMB: 20,
  fileRetentionMinutes: 60,
  allowedPdfMimeTypes: ["application/pdf"],
  allowedImageMimeTypes: ["image/jpeg", "image/png", "image/webp"],
} as const;
```
---

## 4. Desain Backend

### 4.1 Struktur Aplikasi FastAPI

File: `backend/main.py`

Backend menggunakan FastAPI (Python 3.11) dengan arsitektur layered (ref: ADR-012):

```python
# main.py -- Entry point
app = FastAPI(
    title="Papyr API",
    description="Backend API untuk Papyr -- Alat PDF Gratis untuk Indonesia",
    version="0.1.0",
    lifespan=lifespan,  # Cleanup cron lifecycle
)

# Middleware
app.add_middleware(CORSMiddleware, ...)  # CORS strict
app.state.limiter = limiter              # Rate limiter (slowapi)

# Routers
app.include_router(connectivity_router)   # /health, /connectivity
app.include_router(compress_router)       # /api/compress
app.include_router(image_to_pdf_router)   # /api/image-to-pdf
app.include_router(pdf_to_image_router)   # /api/pdf-to-image
```

### 4.2 Router Pattern

Setiap router mengikuti pola yang konsisten:

| **Router**               | **File**                    | **Endpoint**          | **Method** | **Deskripsi**               |
|--------------------------|-----------------------------|-----------------------|------------|------------------------------|
| `compress_router`        | `routers/compress.py`       | `/api/compress`       | POST       | Kompres PDF via Ghostscript  |
| `image_to_pdf_router`   | `routers/image_to_pdf.py`   | `/api/image-to-pdf`   | POST       | Konversi gambar ke PDF       |
| `pdf_to_image_router`   | `routers/pdf_to_image.py`   | `/api/pdf-to-image`   | POST       | Konversi PDF ke gambar PNG   |
| `connectivity_router`   | `routers/connectivity.py`   | `/health`             | GET        | Health check                 |

**Pola umum setiap router:**

1. Baca file ke memory (`await file.read()`)
2. Validasi multi-layer: MIME type, ekstensi, magic bytes, ukuran, password
3. Simpan ke temp file (`tempfile.mkstemp()`)
4. Proses via engine (Ghostscript / PyMuPDF)
5. Upload output ke R2 (`upload_file()`)
6. Generate signed URL 1 jam (`generate_signed_url()`)
7. Log structured event (`log_task_event()`)
8. Return JSON response dengan `download_url`
9. Cleanup temp files di `finally` block

### 4.3 Service Layer

#### 4.3.1 Compress Service

File: `backend/services/compress_service.py`

```python
# Preset Ghostscript
QUALITY_PRESETS = {
    "screen": "/screen",      # Ukuran kecil, kualitas rendah (72 dpi)
    "ebook": "/ebook",        # Seimbang (150 dpi) -- default
    "printer": "/printer",    # Kualitas tinggi (300 dpi)
}

GS_TIMEOUT_SECONDS = 30

def compress_pdf(input_path: str, quality: str = "ebook") -> dict:
    cmd = [
        "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
        f"-dPDFSETTINGS={gs_preset}",
        "-dNOPAUSE", "-dBATCH", "-dQUIET",
        "-dDetectDuplicateImages=true",
        "-dCompressFonts=true", "-dSubsetFonts=true",
        f"-sOutputFile={output_path}", input_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=GS_TIMEOUT_SECONDS)
    # Returns: {"output_path", "original_size", "compressed_size", "compression_ratio"}
```

**Benchmark Results (PAPYR-021):**

| File                 | Input   | Output   | Hemat  | Waktu  |
|----------------------|---------|----------|--------|--------|
| Teks (15 halaman)    | 61.6 KB | 17.6 KB  | 72%    | 3.6s   |
| Scan (6 halaman)     | 16.6 MB | 46.8 KB  | ~100%  | 5.5s   |
| Presentasi (12 hal)  | 17.2 MB | 92.5 KB  | 99%    | 5.3s   |

#### 4.3.2 PDF-to-Image Service

File: `backend/services/pdf_to_image_service.py`

Tiga fungsi utama:

| **Fungsi**          | **Deskripsi**                                                              |
|---------------------|----------------------------------------------------------------------------|
| `parse_page_range`  | Parse string "1-3,5,7-10" menjadi list 0-indexed page numbers             |
| `rasterize_pages`   | Render halaman PDF ke PNG pada 150 DPI via PyMuPDF `page.get_pixmap()`    |
| `package_output`    | 1 halaman = PNG langsung; 2+ halaman = ZIP (`page_1.png`, dst.)           |

Konfigurasi:
- `DEFAULT_DPI = 150` (resolusi output)
- `RASTERIZE_TIMEOUT_SECONDS = 60`
- Zoom factor: `dpi / 72` (72 DPI adalah default PDF)

### 4.4 Utility Layer

#### 4.4.1 R2 Storage (`backend/utils/r2.py`)

| **Fungsi**              | **Deskripsi**                                                          |
|-------------------------|------------------------------------------------------------------------|
| `_get_client()`         | Buat boto3 S3 client untuk Cloudflare R2 (signature v4, region auto)   |
| `upload_file()`         | Upload file dengan UUID key, return `{key, bucket, size_bytes}`        |
| `generate_signed_url()` | Generate pre-signed GET URL (default 3600 detik, force download)       |
| `delete_file()`         | Hapus object dari R2 bucket                                            |

Konfigurasi:
- Endpoint: `https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
- Signature: `s3v4`
- Retries: `max_attempts=2, mode="standard"`
- Signed URL expiry: `FILE_RETENTION_MINUTES * 60` (3600 detik)

#### 4.4.2 Cleanup Cron (`backend/utils/cleanup.py`)

```python
CLEANUP_INTERVAL_SECONDS = 30 * 60  # 30 menit

def cleanup_expired_files() -> dict:
    # 1. List semua objek di R2 yang lebih tua dari FILE_RETENTION_MINUTES
    # 2. Hapus satu per satu
    # 3. Log cleanup_success atau cleanup_failure
    # Returns: {"scanned", "deleted", "failed", "duration_ms"}
```

Cleanup loop berjalan sebagai `asyncio.create_task()` di FastAPI lifespan:

```python
# main.py
async def _cleanup_loop():
    while True:
        await asyncio.sleep(CLEANUP_INTERVAL_SECONDS)
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, cleanup_expired_files)
```

#### 4.4.3 Backend Config (`backend/utils/config.py`)

```python
@dataclass(frozen=True)
class Settings:
    # Cloudflare R2 (required)
    r2_account_id: str
    r2_access_key_id: str
    r2_secret_access_key: str
    r2_bucket_name: str          # default: "papyr-files"
    r2_public_url: str

    # CORS
    cors_origins: list[str]      # default: ["https://mypapyr.com",
                                 #  "https://frontend-ten-omega-35.vercel.app",
                                 #  "http://localhost:3000"]

    # App limits
    max_upload_size_mb: int      # default: 20
    file_retention_minutes: int  # default: 60
    rate_limit_per_minute: int   # default: 10

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

# Singleton -- validated on first import
settings = _load_settings()
```

#### 4.4.4 Structured Logging (`backend/utils/logging_config.py`)

```python
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "event_data"):
            log_entry.update(record.event_data)
        return json.dumps(log_entry, ensure_ascii=False)

def log_task_event(logger, *, event, tool, duration_ms, input_size_bytes, success, **extra):
    # Structured event dengan size bucket (small/medium/large)
    # small < 1MB, medium 1-10MB, large > 10MB
```

### 4.5 Request Lifecycle

```
Pengguna          Frontend (Vercel)        Backend (Railway)         R2 (Cloudflare)
   |                    |                        |                        |
   |-- Upload file ---->|                        |                        |
   |                    |-- POST /api/<tool> ---->|                        |
   |                    |                        |-- Validasi file        |
   |                    |                        |   (MIME+ext+magic+pwd) |
   |                    |                        |-- Proses file          |
   |                    |                        |   (Ghostscript/PyMuPDF)|
   |                    |                        |-- upload_file() ------>|
   |                    |                        |                   Simpan UUID.ext
   |                    |                        |<-- {key, size} --------|
   |                    |                        |-- generate_signed_url->|
   |                    |                        |<-- signed URL (1 jam) -|
   |                    |                        |-- log_task_event()     |
   |                    |                        |-- Cleanup temp files   |
   |                    |<-- {download_url} -----|                        |
   |<-- Tampilkan hasil-|                        |                        |
   |-- Klik Download -->|-- GET signed URL --------------------------->  |
   |<-- File download --|<-- File bytes --------------------------------|
```

---

## 5. Desain Penyimpanan

### 5.1 Cloudflare R2 (S3-Compatible)

Papyr menggunakan Cloudflare R2 sebagai object storage sementara (ref: ADR-011):

| **Aspek**           | **Detail**                                                    |
|---------------------|---------------------------------------------------------------|
| **Provider**        | Cloudflare R2                                                 |
| **Bucket**          | `papyr-files`                                                 |
| **Region**          | auto (Cloudflare global network)                              |
| **API**             | S3-compatible via boto3 (`signature_version="s3v4"`)          |
| **Free Tier**       | 10GB storage, 10 juta Class B operations/bulan                |
| **Egress**          | Zero egress fee (keunggulan utama vs AWS S3)                  |
| **Lifecycle Rule**  | Auto-delete setelah 24 jam (minimum yang didukung R2)         |

### 5.2 Upload Flow

```
1. Backend menerima file yang sudah diproses (compressed PDF / PNG / ZIP)
2. Generate UUID filename: uuid.uuid4().hex + extension
   Contoh: "a1b2c3d4e5f6789012345678abcdef01.pdf"
3. Upload ke R2 via boto3 put_object():
   - Bucket: settings.r2_bucket_name ("papyr-files")
   - Key: UUID filename
   - Body: file bytes
   - ContentType: "application/pdf" / "image/png" / "application/zip"
4. Return metadata: {key, bucket, size_bytes, uploaded_at}
```

### 5.3 Signed URL Generation

```python
# backend/utils/r2.py -- generate_signed_url()
def generate_signed_url(object_key, expiry_seconds=3600, download_filename=None):
    params = {"Bucket": settings.r2_bucket_name, "Key": object_key}
    if download_filename:
        params["ResponseContentDisposition"] = f'attachment; filename="{download_filename}"'
    return client.generate_presigned_url("get_object", Params=params, ExpiresIn=expiry_seconds)
```

- **Expiry:** 3600 detik (1 jam) -- sesuai `FILE_RETENTION_MINUTES * 60`
- **Content-Disposition:** `attachment` -- force download, bukan inline display
- **Tidak ada public URL** -- semua akses melalui signed URL

### 5.4 Double-Safety Cleanup (ref: ADR-004)

```
+-------------------------------------------------------------------+
|                    MEKANISME CLEANUP                                |
+-------------------------------------------------------------------+
|                                                                    |
|  [Primary] R2 Lifecycle Rule                                       |
|  - Auto-delete object setelah 24 jam                               |
|  - Dikonfigurasi di Cloudflare Dashboard                           |
|  - Granularitas minimum: 1 hari                                    |
|                                                                    |
|  [Secondary] Cron Job Fallback                                     |
|  - Berjalan setiap 30 menit (CLEANUP_INTERVAL_SECONDS = 1800)     |
|  - Menghapus file yang lebih tua dari 60 menit                     |
|  - Implementasi: asyncio background task di FastAPI lifespan       |
|  - Logging: cleanup_success / cleanup_failure (structured JSON)    |
|                                                                    |
|  Timeline:                                                         |
|  T+0        : File di-upload ke R2                                 |
|  T+0 ~ T+60 : File tersedia via signed URL                        |
|  T+30/T+60  : Cron job menghapus file (jika expired)               |
|  T+1440     : R2 lifecycle rule menghapus (safety net terakhir)    |
|                                                                    |
+-------------------------------------------------------------------+
```

---

## 6. Keamanan

### 6.1 Validasi Input Multi-Layer (ref: ADR-014)

Setiap file yang di-upload divalidasi melalui 3 layer:

| **Layer** | **Validasi**    | **Detail**                                                                                    |
|-----------|-----------------|-----------------------------------------------------------------------------------------------|
| Layer 1   | MIME Type       | `application/pdf` untuk PDF; `image/jpeg`, `image/png`, `image/webp` untuk gambar             |
| Layer 2   | Ekstensi File   | `.pdf` untuk PDF; `.jpg`, `.jpeg`, `.png`, `.webp` untuk gambar                               |
| Layer 3   | Magic Bytes     | PDF: `%PDF` (bytes 0-3); JPEG: `FF D8 FF` (bytes 0-2); PNG: `89 50 4E 47` (bytes 0-7); WebP: `RIFF` + `WEBP` (bytes 0-3 + 8-11) |

Ketiga layer **harus lolos** -- jika salah satu gagal, file ditolak dengan HTTP 400 dan pesan error Bahasa Indonesia.

### 6.2 Deteksi PDF Terproteksi Password

```python
# routers/compress.py dan routers/pdf_to_image.py
doc = fitz.open(stream=file_bytes, filetype="pdf")
if doc.is_encrypted:
    raise HTTPException(
        status_code=400,
        detail="PDF ini dilindungi kata sandi dan tidak dapat diproses.",
    )
```

PDF yang terproteksi password ditolak sebelum pemrosesan untuk mencegah error di Ghostscript/PyMuPDF.

### 6.3 Rate Limiting

- **Library:** slowapi (berbasis slowapi + limits)
- **Key:** IP address (`get_remote_address`)
- **Limit:** 10 request per menit per IP (konfigurasi via `RATE_LIMIT_PER_MINUTE`)
- **Response 429:** `{"detail": "Terlalu banyak permintaan. Coba lagi dalam 1 menit."}`

### 6.4 CORS

```python
# backend/utils/config.py -- default CORS origins
cors_origins = [
    "https://mypapyr.com",
    "https://frontend-ten-omega-35.vercel.app",
    "http://localhost:3000",
]
```

Hanya origin yang terdaftar yang diizinkan mengakses API. Method yang diizinkan: `GET`, `POST`, `OPTIONS`.

### 6.5 UUID Filenames

```python
# backend/utils/r2.py -- upload_file()
object_key = f"{uuid.uuid4().hex}{ext}"
# Contoh: "a1b2c3d4e5f6789012345678abcdef01.pdf"
```

- Nama file asli pengguna **tidak pernah disimpan** di server atau R2
- Tidak ada informasi pengguna dalam path atau metadata objek

### 6.6 No Content Logging

Konten file tidak pernah di-log di level apapun. Hanya metadata operasional yang dicatat: event type, tool, duration_ms, input_size_bucket (small/medium/large), success/failure.

---

## 7. Performa & Skalabilitas

### 7.1 Strategi Client-Side Processing

Operasi ringan (merge, split, rotate) diproses sepenuhnya di browser menggunakan pdf-lib (ref: ADR-009):

| **Keuntungan**                | **Detail**                                                    |
|-------------------------------|---------------------------------------------------------------|
| Zero upload latency           | File tidak perlu dikirim ke server                            |
| Zero server cost              | Tidak menggunakan resource backend                            |
| Zero privacy risk             | File tidak pernah meninggalkan device pengguna                |
| Instant processing            | Operasi selesai dalam < 2 detik untuk file < 10MB             |

### 7.2 Server-Side untuk Operasi Berat

Compress (Ghostscript) dan PDF-to-Image (PyMuPDF) membutuhkan engine khusus:

| **Aspek**                     | **Target**                                                    |
|-------------------------------|---------------------------------------------------------------|
| Compress PDF (5MB)            | < 5 detik (NFR-001)                                          |
| Ghostscript timeout           | 30 detik (`GS_TIMEOUT_SECONDS`)                              |
| PyMuPDF rasterize timeout     | 60 detik (`RASTERIZE_TIMEOUT_SECONDS`)                       |
| XHR upload timeout            | 120 detik (2 menit, di `PDFUploader.tsx`)                    |

### 7.3 Vercel Edge Network

Frontend di-deploy di Vercel Edge Network:
- Global CDN -- konten statis di-cache di edge node terdekat
- Automatic HTTPS (TLS 1.3)
- Automatic image optimization
- Target page load time: < 3 detik di mobile 4G (NFR-003)

### 7.4 Railway Auto-Scaling

Backend di-deploy di Railway:
- Docker container (`python:3.11-slim`)
- Auto-scaling berdasarkan traffic
- Cold start ~30 detik (dimitigasi oleh auto-retry, ref: ADR-007)
- Target: 100 concurrent users tanpa degradasi (NFR-015)

---

## 8. Monitoring & Observability

### 8.1 Structured JSON Logging

File: `backend/utils/logging_config.py`

Semua log backend menggunakan format JSON terstruktur:

```json
{
  "timestamp": "2026-05-03T10:30:00.000Z",
  "level": "INFO",
  "logger": "routers.compress",
  "message": "task_completed: compress",
  "event": "task_completed",
  "tool": "compress",
  "duration_ms": 3456,
  "input_size_bucket": "medium",
  "success": true,
  "saved_percent": 72
}
```

**Size bucket classification:**
- `small`: < 1MB
- `medium`: 1-10MB
- `large`: > 10MB

### 8.2 Vercel Analytics (Frontend)

Event yang dilacak:

| **Event**          | **Trigger**                              | **Properties**                                    |
|--------------------|------------------------------------------|---------------------------------------------------|
| `task_started`     | User mulai proses (klik upload/proses)   | `tool`, `device_category`                         |
| `task_completed`   | Hasil siap (download URL tersedia)       | `tool`, `device_category`                         |
| `task_failed`      | Error terjadi                            | `tool`, `error` (max 200 char), `device_category` |

Device category: `mobile` (< 768px), `tablet` (< 1024px), `desktop` (>= 1024px)

### 8.3 Backend Cleanup Logging

Event `cleanup_success`:
```json
{"event": "cleanup_success", "scanned": 15, "deleted": 12, "duration_ms": 2340}
```

Event `cleanup_failure`:
```json
{"event": "cleanup_failure", "scanned": 15, "deleted": 10, "failed": 2, "duration_ms": 3456}
```

### 8.4 Railway Logs

Backend logs tersedia di Railway dashboard:
- Stdout/stderr dari uvicorn
- JSON-formatted application logs
- Container health metrics
- Deploy logs

---

## 9. Deployment

### 9.1 Frontend: Vercel

| **Aspek**           | **Detail**                                                    |
|---------------------|---------------------------------------------------------------|
| **Platform**        | Vercel Free Tier                                              |
| **Framework**       | Next.js 16 (auto-detected)                                   |
| **Deploy Trigger**  | Auto-deploy dari GitHub push ke branch `main`                 |
| **Build Command**   | `npm run build` (default Next.js)                             |
| **Output**          | Static + SSR pages                                            |
| **Domain**          | `mypapyr.com` (custom) + `frontend-ten-omega-35.vercel.app`  |
| **Edge Network**    | Global CDN, automatic HTTPS                                   |
| **Analytics**       | Vercel Analytics + Speed Insights (enabled di dashboard)      |

**Environment Variables (Frontend):**

| Variable                        | Required | Default                    |
|---------------------------------|----------|----------------------------|
| `NEXT_PUBLIC_API_URL`           | Ya       | `http://localhost:8000`    |
| `NEXT_PUBLIC_SITE_URL`          | Tidak    | `http://localhost:3000`    |
| `NEXT_PUBLIC_SUPABASE_URL`      | Tidak    | (standby)                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tidak    | (standby)                  |

### 9.2 Backend: Railway

| **Aspek**           | **Detail**                                                    |
|---------------------|---------------------------------------------------------------|
| **Platform**        | Railway                                                       |
| **Runtime**         | Docker (`python:3.11-slim` + Ghostscript)                     |
| **Deploy Trigger**  | Auto-deploy dari GitHub push                                  |
| **Dockerfile**      | `backend/Dockerfile`                                          |
| **Entry Point**     | `uvicorn main:app --host 0.0.0.0 --port $PORT`               |
| **Region**          | us-west2                                                      |
| **Health Check**    | `GET /health`                                                 |
| **URL**             | `papyr-production.up.railway.app`                             |

**Environment Variables (Backend):**

| Variable                  | Required | Default                                                            |
|---------------------------|----------|--------------------------------------------------------------------|
| `R2_ACCOUNT_ID`           | Ya       | -                                                                  |
| `R2_ACCESS_KEY_ID`        | Ya       | -                                                                  |
| `R2_SECRET_ACCESS_KEY`    | Ya       | -                                                                  |
| `R2_BUCKET_NAME`          | Ya       | `papyr-files`                                                      |
| `CORS_ORIGINS`            | Tidak    | `https://mypapyr.com,https://frontend-ten-omega-35.vercel.app,...` |
| `MAX_UPLOAD_SIZE_MB`      | Tidak    | `20`                                                               |
| `FILE_RETENTION_MINUTES`  | Tidak    | `60`                                                               |
| `RATE_LIMIT_PER_MINUTE`   | Tidak    | `10`                                                               |

### 9.3 Manajemen Environment Variables

- **Tidak ada hardcode credentials** di kode sumber
- Frontend: environment variables di Vercel Dashboard (Settings > Environment Variables)
- Backend: environment variables di Railway Dashboard (Variables tab)
- Lokal: `.env` (backend) dan `.env.local` (frontend) -- tidak di-commit ke Git
- Template: `.env.example` tersedia di root project

---

## 10. Diagram Alur

### 10.1 Alur Compress PDF

```
Pengguna              PDFUploader.tsx        /api/compress        compress_service.py
   |                        |                      |                      |
   |-- Pilih file PDF ----->|                      |                      |
   |                        |-- validateFile()     |                      |
   |                        |-- trackTaskStarted() |                      |
   |                        |-- XHR POST --------->|                      |
   |                        |                      |-- _validate_pdf()    |
   |                        |                      |-- compress_pdf() --->|
   |                        |                      |                      |-- gs subprocess
   |                        |                      |<-- {output, sizes} --|
   |                        |                      |-- upload_file() -> R2|
   |                        |                      |-- generate_signed_url|
   |                        |                      |-- log_task_event()   |
   |                        |<-- {download_url} ---|                      |
   |                        |-- trackTaskCompleted()|                     |
   |<-- Tampilkan hasil ----|                      |                      |
   |-- Klik Unduh --------->|-- signed URL ------> R2 download           |
```

### 10.2 Alur Merge PDF (Client-Side)

```
Pengguna              MergePage.tsx          pdfUtils.ts
   |                        |                      |
   |-- Pilih 2+ file PDF -->|                      |
   |-- Drag-reorder ------->|                      |
   |-- Klik Gabungkan ----->|                      |
   |                        |-- trackTaskStarted() |
   |                        |-- mergePDFs(files) -->|
   |                        |                      |-- PDFDocument.create()
   |                        |                      |-- copyPages() per file
   |                        |                      |-- doc.save()
   |                        |<-- Uint8Array --------|
   |                        |-- downloadPDF()       |
   |                        |-- trackTaskCompleted()|
   |<-- File terdownload ---|                      |
```

### 10.3 Alur Split PDF (Client-Side)

```
Pengguna              SplitPage.tsx          pdfUtils.ts
   |                        |                      |
   |-- Pilih file PDF ----->|                      |
   |                        |-- getPDFPageCount() ->|
   |                        |<-- totalPages --------|
   |-- Input range "1-3,5"->|                      |
   |-- Klik Pisahkan ------>|                      |
   |                        |-- trackTaskStarted() |
   |                        |-- splitPDF(file) ---->|
   |                        |                      |-- PDFDocument.load()
   |                        |                      |-- copyPages(indices)
   |                        |                      |-- doc.save()
   |                        |<-- Uint8Array --------|
   |                        |-- downloadPDF()       |
   |                        |-- trackTaskCompleted()|
   |<-- File terdownload ---|                      |
```

### 10.4 Alur Rotate PDF (Client-Side)

```
Pengguna              RotatePage.tsx         pdfUtils.ts
   |                        |                      |
   |-- Pilih file PDF ----->|                      |
   |                        |-- getPDFPageCount() ->|
   |                        |<-- totalPages --------|
   |-- Pilih rotasi ------->|                      |
   |-- Klik Putar --------->|                      |
   |                        |-- trackTaskStarted() |
   |                        |-- rotatePDF() ------->|
   |                        |                      |-- page.setRotation()
   |                        |                      |-- doc.save()
   |                        |<-- Uint8Array --------|
   |                        |-- downloadPDF()       |
   |                        |-- trackTaskCompleted()|
   |<-- File terdownload ---|                      |
```

### 10.5 Alur Image-to-PDF (Hybrid)

```
Pengguna              ImageToPdfPage.tsx     pdfUtils.ts / /api/image-to-pdf
   |                        |                      |
   |-- Pilih gambar (1+) -->|                      |
   |-- Drag-reorder ------->|                      |
   |-- Klik Konversi ------>|                      |
   |                        |-- trackTaskStarted() |
   |                        |-- Cek total size     |
   |                        |   < 3MB?             |
   |                        |   Ya --> imagesToPDF()| (client-side, pdf-lib)
   |                        |         embedJpg/Png  |
   |                        |         webpToPng()   | (jika WebP)
   |                        |   <-- Uint8Array -----|
   |                        |   downloadPDF()       |
   |                        |                      |
   |                        |   Tidak --> POST ---->| (server-side, PyMuPDF)
   |                        |   /api/image-to-pdf   |
   |                        |   <-- download_url ---|
   |                        |-- trackTaskCompleted()|
   |<-- File terdownload ---|                      |
```

### 10.6 Alur PDF-to-Image (Server-Side)

```
Pengguna              PdfToImagePage.tsx     /api/pdf-to-image    pdf_to_image_service.py
   |                        |                      |                      |
   |-- Pilih file PDF ----->|                      |                      |
   |-- Input halaman ------>|                      |                      |
   |-- Klik Konversi ------>|                      |                      |
   |                        |-- trackTaskStarted() |                      |
   |                        |-- XHR POST --------->|                      |
   |                        |                      |-- _validate_pdf()    |
   |                        |                      |-- parse_page_range()->|
   |                        |                      |<-- [pages] ----------|
   |                        |                      |-- rasterize_pages()-->|
   |                        |                      |                      |-- get_pixmap(150 DPI)
   |                        |                      |<-- [png_paths] ------|
   |                        |                      |-- package_output() ->|
   |                        |                      |   1 page = PNG       |
   |                        |                      |   2+ pages = ZIP     |
   |                        |                      |-- upload_file() -> R2|
   |                        |                      |-- generate_signed_url|
   |                        |<-- {download_url} ---|                      |
   |                        |-- trackTaskCompleted()|                     |
   |<-- Tampilkan hasil ----|                      |                      |
```

### 10.7 Alur Cleanup Cron

```
FastAPI Lifespan          cleanup.py              R2 (Cloudflare)
   |                           |                        |
   |-- asyncio.create_task() ->|                        |
   |                           |                        |
   |   [Setiap 30 menit]      |                        |
   |                           |-- list_objects_v2() -->|
   |                           |<-- objects + metadata --|
   |                           |                        |
   |                           |-- Filter expired       |
   |                           |   (> 60 menit)         |
   |                           |                        |
   |                           |-- delete_object() ---->| (per expired object)
   |                           |<-- OK / Error ---------|
   |                           |                        |
   |                           |-- Log cleanup_success  |
   |                           |   atau cleanup_failure  |
```

---

## 11. Referensi Silang ke ADR

Tabel berikut memetakan setiap ADR (PPR-ADR-001) ke bagian TDD yang relevan:

| **ADR**   | **Judul**                                    | **Status**  | **Bagian TDD Terkait**                                |
|-----------|----------------------------------------------|-------------|-------------------------------------------------------|
| ADR-001   | Batas Upload 20MB                            | Accepted    | 3.7 Konfigurasi Frontend, 4.4.3 Backend Config       |
| ADR-002   | Ghostscript untuk Kompresi PDF Kompetitif    | Accepted    | 4.3.1 Compress Service                                |
| ADR-003   | PDF-to-Image: User Pilih Halaman             | Accepted    | 4.3.2 PDF-to-Image Service, 10.6 Alur PDF-to-Image   |
| ADR-004   | Auto-Delete Double Safety                    | Accepted    | 5.4 Double-Safety Cleanup, 4.4.2 Cleanup Cron        |
| ADR-005   | Plausible Analytics                          | Superseded  | Digantikan oleh ADR-008                               |
| ADR-006   | Indonesia-First Language                     | Accepted    | 1.1 Tujuan (seluruh dokumen dalam Bahasa Indonesia)   |
| ADR-007   | Auto-Retry 1x pada Kegagalan                | Accepted    | 3.6 Mekanisme Auto-Retry                              |
| ADR-008   | Migrasi ke Vercel Analytics                  | Accepted    | 3.5 Analytics Integration, 8.2 Vercel Analytics       |
| ADR-009   | Hybrid Processing Boundary                   | Accepted    | 2.3 Processing Boundary                               |
| ADR-010   | pdf-lib untuk Operasi Client-Side            | Accepted    | 3.3 Client-Side Processing dengan pdf-lib             |
| ADR-011   | Cloudflare R2 sebagai Object Storage         | Accepted    | 5.1 Cloudflare R2, 4.4.1 R2 Storage                  |
| ADR-012   | FastAPI (Python) untuk Backend               | Accepted    | 4.1 Struktur Aplikasi FastAPI                         |
| ADR-013   | WebP Support via Canvas Conversion           | Accepted    | 3.3 Client-Side Processing (WebP Support)             |
| ADR-014   | Validasi File Multi-Layer (Triple Validation)| Accepted    | 6.1 Validasi Input Multi-Layer                        |
| ADR-015   | Next.js 16 dengan App Router                 | Accepted    | 3.1 Struktur Aplikasi Next.js 16                      |

---

## 12. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Technical Design Document ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan desain teknis untuk Papyr MVP 0.1.

|                   |                              |                   |             |
|:------------------|:-----------------------------|:------------------|:------------|
| **Peran**         | **Nama**                     | **Tanda Tangan**  | **Tanggal** |
| **Product Owner** | Muhammad Fa'iz Zulfikar      | Approved          | 2026-05-03  |
| **AI Agent**      | OpenCode/Sisyphus            | Approved          | 2026-05-03  |

Dokumen ini dapat berubah. Setiap modifikasi harus ditinjau dan disetujui ulang oleh semua penandatangan.

---

*Akhir Dokumen.*
