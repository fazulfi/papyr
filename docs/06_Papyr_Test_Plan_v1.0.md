**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Test Plan**

Version 1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Test Plan — Papyr                            |
| **ID Dokumen**      | PPR-TP-001                                   |
| **Versi**           | 1.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Mei 2026                                     |
| **Terakhir Diubah** | Mei 2026                                     |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                 |
| **Ditinjau Oleh**   | Muhammad Fa'iz Zulfikar — Product Owner      |
| **Disetujui Oleh**  | Product Owner + AI Agent                     |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                |
|-----------|-------------|------------------------------|------------------------------------------------------------------------------|
| 1.0       | Mei 2026    | AI Agent (OpenCode/Sisyphus) | Draft awal — Test Plan lengkap untuk scope Fase 1 (6 tool + security + cleanup + analytics) |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Strategi Pengujian](#2-strategi-pengujian)
3. [Lingkup Pengujian](#3-lingkup-pengujian)
4. [Lingkungan Pengujian](#4-lingkungan-pengujian)
5. [Test Cases](#5-test-cases)
   - 5.1 [Compress PDF (TC-CMP)](#51-compress-pdf-tc-cmp)
   - 5.2 [Merge PDF (TC-MRG)](#52-merge-pdf-tc-mrg)
   - 5.3 [Split PDF (TC-SPL)](#53-split-pdf-tc-spl)
   - 5.4 [Image to PDF (TC-I2P)](#54-image-to-pdf-tc-i2p)
   - 5.5 [PDF to Image (TC-P2I)](#55-pdf-to-image-tc-p2i)
   - 5.6 [Rotate PDF (TC-ROT)](#56-rotate-pdf-tc-rot)
   - 5.7 [Security (TC-SEC)](#57-security-tc-sec)
   - 5.8 [Cleanup (TC-CLN)](#58-cleanup-tc-cln)
   - 5.9 [Analytics (TC-ANA)](#59-analytics-tc-ana)
6. [Matriks Keterlacakan](#6-matriks-keterlacakan)
7. [Kriteria Masuk & Keluar](#7-kriteria-masuk--keluar)
8. [Metrik Pengujian](#8-metrik-pengujian)
9. [Jadwal Pengujian](#9-jadwal-pengujian)
10. [Risiko Pengujian & Mitigasi](#10-risiko-pengujian--mitigasi)
11. [Persetujuan Dokumen](#11-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini mendefinisikan strategi, lingkup, test case, dan kriteria pengujian untuk Papyr Fase 1. Tujuan utama adalah memastikan bahwa seluruh 6 tool PDF (Compress, Merge, Split, Image-to-PDF, PDF-to-Image, Rotate) beserta fitur pendukung (security, cleanup, analytics) berfungsi sesuai spesifikasi yang didefinisikan dalam BRD (PPR-BRD-001) dan SRS (PPR-SRS-001).

Test Plan ini mencakup pengujian otomatis (unit test + integration test) dan pengujian manual (QA playbook) yang dijalankan sebelum dan sesudah soft launch di mypapyr.com.

### 1.2 Lingkup Dokumen

Dokumen ini mencakup:

- Strategi pengujian multi-layer (unit, integration, manual)
- Test case detail untuk setiap tool dan fitur cross-cutting
- Matriks keterlacakan ke requirement BRD/SRS
- Kriteria masuk/keluar pengujian
- Metrik pengujian dan target coverage
- Jadwal dan risiko pengujian

### 1.3 Referensi

| **ID Dokumen** | **Judul**                                | **Versi** |
|----------------|------------------------------------------|-----------|
| PPR-BRD-001    | Business Requirements Document           | 1.0       |
| PPR-SRS-001    | Software Requirements Specification      | 1.0       |
| —              | Papyr QA + Soft Launch Playbook          | Fase 1   |
| —              | Vitest Configuration                     | —         |
| —              | Pytest Configuration (conftest.py)       | —         |

### 1.4 Definisi & Akronim

| **Istilah** | **Definisi**                                                    |
|-------------|-----------------------------------------------------------------|
| SUT         | System Under Test — sistem yang sedang diuji                    |
| TC          | Test Case — kasus uji individual                                |
| R2          | Cloudflare R2 — object storage untuk penyimpanan file sementara |
| MIME        | Multipurpose Internet Mail Extensions — tipe konten file        |
| DPI         | Dots Per Inch — resolusi gambar output                          |
| UUID        | Universally Unique Identifier — identifier unik untuk filename  |
| ASGI        | Asynchronous Server Gateway Interface                           |
| CI          | Continuous Integration                                          |

---

## 2. Strategi Pengujian

Papyr menggunakan pendekatan pengujian berlapis (layered testing) yang mengkombinasikan pengujian otomatis dan manual untuk memaksimalkan cakupan dengan resource terbatas (solo developer + AI agent).

### 2.1 Unit Testing

| **Aspek**       | **Frontend**                                                              | **Backend**                                                                                        |
|-----------------|---------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| **Framework**   | Vitest 3.x                                                               | Pytest 8.x + pytest-asyncio                                                                        |
| **Environment** | Node.js (vitest environment: node)                                       | Python 3.11 + httpx AsyncClient                                                                    |
| **Lokasi**      | frontend/src/lib/__tests__/                                              | backend/tests/                                                                                     |
| **File Test**   | pdfUtils.test.ts, analytics.test.ts, config.test.ts                      | test_api_compress.py, test_api_image_to_pdf.py, test_api_pdf_to_image.py, test_services.py         |
| **Jumlah Test** | 23 test cases                                                            | 34 test cases                                                                                      |
| **Status**      | Semua PASS                                                               | Semua PASS                                                                                         |
| **Runner**      | npm run test (vitest)                                                    | pytest (dari direktori backend/)                                                                   |

### 2.2 Integration Testing

Integration testing dilakukan melalui API endpoint test menggunakan httpx.AsyncClient dengan ASGITransport yang menjalankan FastAPI app secara in-process tanpa memerlukan server terpisah.

- **Transport:** ASGITransport(app=app) — mengirim request langsung ke ASGI app
- **Base URL:** http://testserver
- **Mocking:** Operasi R2 (upload, signed URL) dan Ghostscript di-mock untuk isolasi
- **Fixture:** conftest.py menyediakan test_client fixture dan mock_r2_and_cleanup autouse fixture
- **Cakupan:** Endpoint /api/compress, /api/image-to-pdf, /api/pdf-to-image

### 2.3 Manual Testing

Manual testing mengikuti QA Playbook (blueprint/Papyr_QA_SoftLaunch.md) yang mencakup:

- **QA Internal:** Test case per fitur dijalankan oleh developer + AI agent di lokal dan staging
- **Friend Testing:** 3-5 tester eksternal menguji tanpa instruksi teknis, mengisi feedback form
- **Post-Launch Monitoring:** Pantau traffic, error rate, dan feedback 48 jam pertama via Vercel Analytics

### 2.4 Gap yang Teridentifikasi

| **Tipe Pengujian**          | **Status**                                                                                    |
|-----------------------------|-----------------------------------------------------------------------------------------------|
| End-to-End (E2E) Browser    | Belum ada framework (Playwright/Cypress). Dicatat sebagai gap untuk Fase 2.                  |
| Load/Performance Testing    | Belum diimplementasi. Target NFR-015 (100 concurrent users) belum divalidasi secara otomatis. |
| Penetration Testing         | Belum dilakukan. Keamanan divalidasi melalui unit test validasi file dan rate limit.          |
| Visual Regression Testing   | Belum ada. UI divalidasi secara manual di mobile dan desktop.                                 |

---

## 3. Lingkup Pengujian

### 3.1 Dalam Lingkup (In Scope)

| **Kategori**    | **Item yang Diuji**                                                                                                   |
|-----------------|-----------------------------------------------------------------------------------------------------------------------|
| Compress PDF    | Upload, validasi file (MIME/ext/magic bytes), kompresi 3 level, password-protected rejection, download via signed URL |
| Merge PDF       | Merge 2+ PDF, single PDF rejection, drag-and-drop reorder, client-side processing (pdf-lib)                           |
| Split PDF       | Split berdasarkan range, validasi range, out-of-bounds rejection, client-side processing (pdf-lib)                    |
| Image to PDF    | Konversi JPG/PNG/WEBP, multi-image, validasi gambar, file kosong, file terlalu besar                                  |
| PDF to Image    | Konversi ke PNG 150 DPI, page range selection, multi-page ZIP, password-protected rejection                           |
| Rotate PDF      | Rotasi 90/180/270 derajat, per-halaman dan semua halaman, validasi derajat invalid                                    |
| Security        | Validasi MIME type, validasi ekstensi file, validasi magic bytes, rate limiting (10 req/min/IP), CORS                 |
| Cleanup         | Auto-delete file expired dari R2, cron fallback, signed URL expiry                                                    |
| Analytics       | Event tracking (task_started, task_completed, task_failed), device_category detection                                 |
| Configuration   | Validasi limits (maxUploadBytes, maxUploadMB, fileRetentionMinutes, allowedMimeTypes)                                 |

### 3.2 Di Luar Lingkup (Out of Scope)

| **Kategori**                  | **Alasan**                                                          |
|-------------------------------|---------------------------------------------------------------------|
| E2E Browser Testing           | Belum ada framework E2E. Direncanakan untuk Fase 2.                |
| Load/Stress Testing           | Infrastruktur free-tier; load testing direncanakan setelah scaling. |
| Penetration Testing           | Memerlukan tools dan expertise khusus. Direncanakan untuk Fase 3.  |
| Accessibility Testing (a11y)  | Belum diprioritaskan di Fase 1.                                    |
| Cross-Browser Compatibility   | Hanya divalidasi manual di Chrome (desktop + Android).              |
| Fitur Fase 2                 | Protect PDF, Unlock PDF, Watermark, Sign PDF, PDF-to-Word, OCR.    |

---

## 4. Lingkungan Pengujian

### 4.1 Frontend Test Environment

| **Komponen**    | **Detail**                                                |
|-----------------|-----------------------------------------------------------|
| Runtime         | Node.js 20+                                              |
| Test Framework  | Vitest 3.x                                               |
| Environment     | node (dikonfigurasi di vitest.config.ts)                 |
| Path Alias      | @ -> ./src (via resolve.alias di vitest config)          |
| Globals         | true (describe, it, expect tersedia secara global)       |
| Mocking         | vi.mock() untuk @vercel/analytics                        |
| Test Library    | pdf-lib untuk membuat test PDF dan memvalidasi output    |
| Config File     | frontend/vitest.config.ts                                |
| Perintah        | npm run test atau npx vitest                             |

### 4.2 Backend Test Environment

| **Komponen**    | **Detail**                                                |
|-----------------|-----------------------------------------------------------|
| Runtime         | Python 3.11+                                             |
| Test Framework  | Pytest 8.x + pytest-asyncio                              |
| HTTP Client     | httpx AsyncClient dengan ASGITransport                    |
| Base URL        | http://testserver                                        |
| Config File     | backend/tests/conftest.py                                |
| Perintah        | pytest (dari direktori backend/)                         |

### 4.3 Mocking Strategy

| **Komponen yang Di-mock**       | **Alasan**                                                | **Lokasi Mock**                      |
|---------------------------------|-----------------------------------------------------------|--------------------------------------|
| upload_file (R2)                | Menghindari panggilan ke Cloudflare R2 saat testing       | conftest.py (autouse fixture)        |
| generate_signed_url (R2)        | Menghindari pembuatan signed URL ke R2 bucket             | conftest.py (autouse fixture)        |
| cleanup_expired_files           | Menghindari operasi cleanup R2 saat testing               | conftest.py (autouse fixture)        |
| fitz.open (PyMuPDF)             | Menghindari dependency ke PyMuPDF binary saat testing     | Per-test patch() decorator           |
| compress_pdf (Ghostscript)      | Menghindari dependency ke Ghostscript binary saat testing | Per-test patch() decorator           |
| @vercel/analytics (track)       | Menghindari panggilan ke Vercel Analytics saat testing    | vi.mock() di analytics.test.ts       |

### 4.4 Environment Variables (Test)

Dikonfigurasi di conftest.py sebelum import app:

| **Variable**            | **Nilai Test**      | **Alasan**                                    |
|-------------------------|---------------------|-----------------------------------------------|
| R2_ACCOUNT_ID           | test-account-id     | Dummy credential untuk R2 mock                |
| R2_ACCESS_KEY_ID        | test-access-key     | Dummy credential untuk R2 mock                |
| R2_SECRET_ACCESS_KEY    | test-secret-key     | Dummy credential untuk R2 mock                |
| R2_BUCKET_NAME          | test-bucket         | Dummy bucket name                             |
| MAX_UPLOAD_SIZE_MB      | 20                  | Sesuai production limit                       |
| RATE_LIMIT_PER_MINUTE   | 10000               | Tinggi untuk menghindari rate limit saat test |
| CORS_ORIGINS            | http://testserver   | Sesuai base URL test client                   |

---

## 5. Test Cases

### Konvensi Penamaan

- **TC-CMP-0xx:** Compress PDF
- **TC-MRG-0xx:** Merge PDF
- **TC-SPL-0xx:** Split PDF
- **TC-I2P-0xx:** Image to PDF
- **TC-P2I-0xx:** PDF to Image
- **TC-ROT-0xx:** Rotate PDF
- **TC-SEC-0xx:** Security
- **TC-CLN-0xx:** Cleanup
- **TC-ANA-0xx:** Analytics

### Konvensi Prioritas

| **Prioritas** | **Definisi**                                                |
|---------------|-------------------------------------------------------------|
| P0            | Critical — produk tidak bisa dipakai jika gagal             |
| P1            | High — fitur utama tidak bekerja dengan benar               |
| P2            | Medium — fitur bekerja tapi ada masalah UX/edge case        |
| P3            | Low — masalah kosmetik atau minor                           |

---

### 5.1 Compress PDF (TC-CMP)

**File Test Terkait:** `backend/tests/test_api_compress.py` (8 test cases otomatis)

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-CMP-001 | Kompresi PDF valid mengembalikan 200 | Backend berjalan, R2 di-mock | 1. POST `/api/compress?quality=ebook` dengan file PDF valid (magic bytes `%PDF`) 2. Verifikasi response body | Response 200, body berisi `download_url`, `original_size`, `compressed_size`, `saved_percent` (integer) | PASS | P0 |
| TC-CMP-002 | File kosong ditolak dengan 400 | Backend berjalan | 1. POST `/api/compress` dengan file PDF 0 bytes | Response 400 — file kosong ditolak | PASS | P1 |
| TC-CMP-003 | MIME type non-PDF ditolak dengan 400 | Backend berjalan | 1. POST `/api/compress` dengan MIME `text/plain` dan konten PDF | Response 400 — MIME type tidak valid | PASS | P1 |
| TC-CMP-004 | Ekstensi file salah ditolak dengan 400 | Backend berjalan | 1. POST `/api/compress` dengan file `sample.txt` ber-MIME `application/pdf` | Response 400 — ekstensi tidak valid | PASS | P1 |
| TC-CMP-005 | File melebihi 20MB ditolak dengan 400 | Backend berjalan | 1. POST `/api/compress` dengan file > 20MB (20*1024*1024+1 bytes) | Response 400 — file terlalu besar | PASS | P1 |
| TC-CMP-006 | Magic bytes invalid ditolak dengan 400 | Backend berjalan | 1. POST `/api/compress` dengan file `sample.pdf` konten dimulai `NOTP` | Response 400 — magic bytes tidak valid | PASS | P1 |
| TC-CMP-007 | PDF terproteksi password ditolak dengan 400 | Backend berjalan, `fitz.open` di-mock (`is_encrypted=True`) | 1. POST `/api/compress` dengan PDF terenkripsi | Response 400 — PDF terproteksi password | PASS | P1 |
| TC-CMP-008 | Parameter quality invalid mengembalikan 422 | Backend berjalan | 1. POST `/api/compress?quality=ultra` dengan file PDF valid | Response 422 — parameter quality tidak valid (hanya: screen, ebook, printer) | PASS | P2 |
| TC-CMP-009 | Kompresi PDF 15MB (mendekati limit) berhasil | Backend + staging | 1. Upload PDF 15MB via UI 2. Pilih kualitas medium 3. Klik Compress | File berhasil dikompresi dalam waktu wajar, download tersedia | Manual | P1 |
| TC-CMP-010 | Tampilan before/after size di UI | Frontend berjalan | 1. Compress PDF berhasil 2. Verifikasi UI | Angka ukuran awal dan akhir ditampilkan dengan benar | Manual | P2 |

---

### 5.2 Merge PDF (TC-MRG)

**File Test Terkait:** `frontend/src/lib/__tests__/pdfUtils.test.ts` — describe `mergePDFs` (3 test cases otomatis)

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-MRG-001 | Merge 2 PDF menjadi satu | pdf-lib tersedia | 1. Buat 2 test PDF (2 hal + 3 hal) 2. Panggil `mergePDFs([pdf1, pdf2])` 3. Validasi output | Output PDF valid dengan 5 halaman | PASS | P0 |
| TC-MRG-002 | Merge kurang dari 2 file ditolak | pdf-lib tersedia | 1. Panggil `mergePDFs([pdf1])` dengan 1 file | Throw error: "Minimal 2 file" | PASS | P1 |
| TC-MRG-003 | Merge array kosong ditolak | pdf-lib tersedia | 1. Panggil `mergePDFs([])` | Throw error: "Minimal 2 file" | PASS | P1 |
| TC-MRG-004 | Merge 5 PDF dengan reorder | Frontend berjalan | 1. Upload 5 PDF 2. Drag-and-drop ubah urutan 3. Klik Merge | PDF gabungan sesuai urutan yang diatur user | Manual | P1 |
| TC-MRG-005 | Upload file campuran PDF + JPG | Frontend berjalan | 1. Coba upload PDF dan JPG bersamaan | JPG ditolak, hanya PDF yang diterima | Manual | P2 |
| TC-MRG-006 | Merge PDF landscape + portrait | Frontend berjalan | 1. Upload PDF landscape dan portrait 2. Merge | Kedua orientasi muncul dengan benar di hasil | Manual | P2 |
| TC-MRG-007 | Merge di mobile (Chrome Android) | Device mobile | 1. Buka /merge di Chrome Android 2. Upload 2+ PDF 3. Merge | Upload, reorder, dan download berhasil dari HP | Manual | P1 |

---

### 5.3 Split PDF (TC-SPL)

**File Test Terkait:** `frontend/src/lib/__tests__/pdfUtils.test.ts` — describe `splitPDF` (4 test cases otomatis)

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-SPL-001 | Split halaman tertentu berhasil | pdf-lib tersedia | 1. Buat test PDF 5 halaman 2. Panggil `splitPDF(file, [1, 3, 5])` 3. Validasi output | Output PDF valid dengan 3 halaman | PASS | P0 |
| TC-SPL-002 | Split dengan array halaman kosong ditolak | pdf-lib tersedia | 1. Panggil `splitPDF(file, [])` | Throw error: "Pilih minimal 1 halaman" | PASS | P1 |
| TC-SPL-003 | Halaman di luar range ditolak | pdf-lib tersedia | 1. Buat PDF 3 halaman 2. Panggil `splitPDF(file, [4])` | Throw error: "melebihi total halaman" | PASS | P1 |
| TC-SPL-004 | Halaman 0 ditolak | pdf-lib tersedia | 1. Buat PDF 3 halaman 2. Panggil `splitPDF(file, [0])` | Throw error: "melebihi total halaman" | PASS | P1 |
| TC-SPL-005 | Input range format "1-3" di UI | Frontend berjalan | 1. Upload PDF 10 halaman 2. Input range "1-3" 3. Klik Split | Output berisi 3 halaman yang benar | Manual | P0 |
| TC-SPL-006 | Input range tidak valid (e.g. "5-3") | Frontend berjalan | 1. Upload PDF 2. Input range "5-3" | Error inline: "Range tidak valid" | Manual | P2 |
| TC-SPL-007 | Split di mobile (Chrome Android) | Device mobile | 1. Buka /split di Chrome Android 2. Upload PDF 3. Input range 4. Split | Input range dan download bekerja dari HP | Manual | P1 |

---

### 5.4 Image to PDF (TC-I2P)

**File Test Terkait:**
- `frontend/src/lib/__tests__/pdfUtils.test.ts` — describe `imagesToPDF` (3 test cases otomatis)
- `backend/tests/test_api_image_to_pdf.py` (9 test cases otomatis)

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-I2P-001 | Konversi JPEG valid mengembalikan 200 | Backend berjalan, fitz di-mock | 1. POST `/api/image-to-pdf` dengan file JPEG valid (magic bytes `FF D8 FF`) | Response 200, body berisi `download_url`, `image_count` = 1, `pdf_size` (integer) | PASS | P0 |
| TC-I2P-002 | Konversi PNG valid mengembalikan 200 | Backend berjalan, fitz di-mock | 1. POST `/api/image-to-pdf` dengan file PNG valid (magic bytes `89 50 4E 47`) | Response 200 | PASS | P0 |
| TC-I2P-003 | Konversi WEBP valid mengembalikan 200 | Backend berjalan, fitz di-mock | 1. POST `/api/image-to-pdf` dengan file WEBP valid (magic bytes `RIFF...WEBP`) | Response 200 | PASS | P0 |
| TC-I2P-004 | File gambar kosong ditolak dengan 400 | Backend berjalan | 1. POST `/api/image-to-pdf` dengan file JPEG 0 bytes | Response 400 — file kosong | PASS | P1 |
| TC-I2P-005 | MIME type invalid ditolak dengan 400 | Backend berjalan | 1. POST `/api/image-to-pdf` dengan MIME `application/pdf` dan konten JPEG | Response 400 — MIME type tidak valid | PASS | P1 |
| TC-I2P-006 | Ekstensi file salah ditolak dengan 400 | Backend berjalan | 1. POST `/api/image-to-pdf` dengan file `image.txt` ber-MIME `image/jpeg` | Response 400 — ekstensi tidak valid | PASS | P1 |
| TC-I2P-007 | Magic bytes invalid ditolak dengan 400 | Backend berjalan | 1. POST `/api/image-to-pdf` dengan file `image.jpg` konten `not-an-image` | Response 400 — magic bytes tidak valid | PASS | P1 |
| TC-I2P-008 | File melebihi 20MB ditolak dengan 400 | Backend berjalan | 1. POST `/api/image-to-pdf` dengan JPEG > 20MB | Response 400 — file terlalu besar | PASS | P1 |
| TC-I2P-009 | Tidak ada file dikirim mengembalikan 422 | Backend berjalan | 1. POST `/api/image-to-pdf` tanpa file (empty files array) | Response 422 — files required | PASS | P2 |
| TC-I2P-010 | Client-side: konversi PNG ke PDF | pdf-lib tersedia | 1. Buat test PNG 2. Panggil `imagesToPDF([png])` | Output PDF valid dengan 1 halaman | PASS | P0 |
| TC-I2P-011 | Client-side: array kosong ditolak | pdf-lib tersedia | 1. Panggil `imagesToPDF([])` | Throw error: "Pilih minimal 1 gambar" | PASS | P1 |
| TC-I2P-012 | Client-side: format tidak didukung ditolak | pdf-lib tersedia | 1. Buat file BMP 2. Panggil `imagesToPDF([bmp])` | Throw error: "bukan format" | PASS | P1 |
| TC-I2P-013 | Multi-image reorder di UI | Frontend berjalan | 1. Upload 3 gambar 2. Reorder via drag-and-drop 3. Convert | PDF berisi 3 halaman sesuai urutan | Manual | P1 |
| TC-I2P-014 | Upload dari galeri HP (mobile) | Device mobile | 1. Buka /image-to-pdf di Chrome Android 2. Pilih foto dari galeri 3. Convert | Berhasil convert dari galeri HP | Manual | P1 |

---

### 5.5 PDF to Image (TC-P2I)

**File Test Terkait:** `backend/tests/test_api_pdf_to_image.py` (7 test cases otomatis)

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-P2I-001 | Konversi PDF valid mengembalikan 200 (semua halaman) | Backend berjalan, fitz + rasterize di-mock | 1. POST `/api/pdf-to-image` dengan PDF valid dan pages="" (kosong = semua) | Response 200, body berisi `download_url`, `file_type` = "png", `page_count` >= 1 | PASS | P0 |
| TC-P2I-002 | Page range "1-2" mengembalikan ZIP | Backend berjalan, fitz + rasterize di-mock | 1. POST `/api/pdf-to-image` dengan pages="1-2" | Response 200, `file_type` = "zip", `page_count` = 2 | PASS | P0 |
| TC-P2I-003 | File kosong ditolak dengan 400 | Backend berjalan | 1. POST `/api/pdf-to-image` dengan PDF 0 bytes | Response 400 — file kosong | PASS | P1 |
| TC-P2I-004 | MIME type invalid ditolak dengan 400 | Backend berjalan | 1. POST `/api/pdf-to-image` dengan MIME `text/plain` | Response 400 — MIME type tidak valid | PASS | P1 |
| TC-P2I-005 | PDF terproteksi password ditolak dengan 400 | Backend berjalan, fitz di-mock (`is_encrypted=True`) | 1. POST `/api/pdf-to-image` dengan PDF terenkripsi | Response 400 — PDF terproteksi password | PASS | P1 |
| TC-P2I-006 | Format page range invalid ditolak dengan 400 | Backend berjalan, fitz di-mock | 1. POST `/api/pdf-to-image` dengan pages="1--2" | Response 400 — format range tidak valid | PASS | P2 |
| TC-P2I-007 | Halaman di luar range ditolak dengan 400 | Backend berjalan, fitz di-mock (page_count=3) | 1. POST `/api/pdf-to-image` dengan pages="10" (PDF hanya 3 halaman) | Response 400 — halaman melebihi total | PASS | P1 |
| TC-P2I-008 | Konversi 1 halaman menghasilkan file PNG langsung | Staging/production | 1. Upload PDF 2. Pilih 1 halaman 3. Convert | Download langsung 1 file PNG (bukan ZIP) | Manual | P1 |
| TC-P2I-009 | Konversi multi-halaman menghasilkan ZIP | Staging/production | 1. Upload PDF 5 halaman 2. Pilih halaman 1-3 3. Convert | Download file ZIP berisi 3 gambar PNG | Manual | P1 |
| TC-P2I-010 | Test di mobile | Device mobile | 1. Buka /pdf-to-image di Chrome Android 2. Upload PDF 3. Pilih halaman 4. Convert | Upload, pilih halaman, download bekerja dari HP | Manual | P1 |

---

### 5.6 Rotate PDF (TC-ROT)

**File Test Terkait:** `frontend/src/lib/__tests__/pdfUtils.test.ts` — describe `rotatePDFAllPages` (2 test cases otomatis)

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-ROT-001 | Rotasi semua halaman 90 derajat | pdf-lib tersedia | 1. Buat test PDF 2 halaman 2. Panggil `rotatePDFAllPages(file, 90)` 3. Validasi output | Semua halaman memiliki rotation angle = 90 | PASS | P0 |
| TC-ROT-002 | Derajat invalid (45) ditolak | pdf-lib tersedia | 1. Panggil `rotatePDFAllPages(file, 45)` | Throw error: "tidak valid" | PASS | P1 |
| TC-ROT-003 | Rotasi 180 derajat | Frontend berjalan | 1. Upload PDF 2. Pilih rotasi 180 derajat 3. Klik Rotate | Semua halaman dirotasi 180 derajat | Manual | P1 |
| TC-ROT-004 | Rotasi 270 derajat | Frontend berjalan | 1. Upload PDF 2. Pilih rotasi 270 derajat 3. Klik Rotate | Semua halaman dirotasi 270 derajat | Manual | P1 |
| TC-ROT-005 | Rotasi per-halaman individual | Frontend berjalan | 1. Upload PDF multi-halaman 2. Rotasi hanya halaman tertentu | Hanya halaman yang dipilih yang dirotasi | Manual | P2 |
| TC-ROT-006 | Rotasi di mobile (Chrome Android) | Device mobile | 1. Buka /rotate di Chrome Android 2. Upload PDF 3. Pilih rotasi 4. Download | Semua operasi berhasil dari HP | Manual | P1 |

---

### 5.7 Security (TC-SEC)

**File Test Terkait:** Validasi security tersebar di `test_api_compress.py`, `test_api_image_to_pdf.py`, `test_api_pdf_to_image.py`

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-SEC-001 | Validasi MIME type — PDF endpoint menolak non-PDF | Backend berjalan | 1. POST `/api/compress` dengan MIME `text/plain` | Response 400 | PASS | P0 |
| TC-SEC-002 | Validasi MIME type — Image endpoint menolak non-image | Backend berjalan | 1. POST `/api/image-to-pdf` dengan MIME `application/pdf` | Response 400 | PASS | P0 |
| TC-SEC-003 | Validasi magic bytes — PDF tanpa header %PDF ditolak | Backend berjalan | 1. POST `/api/compress` dengan konten `NOTP fake content` | Response 400 | PASS | P0 |
| TC-SEC-004 | Validasi magic bytes — Image tanpa header valid ditolak | Backend berjalan | 1. POST `/api/image-to-pdf` dengan konten `not-an-image` | Response 400 | PASS | P0 |
| TC-SEC-005 | Validasi ekstensi — .txt dengan MIME PDF ditolak | Backend berjalan | 1. POST `/api/compress` dengan file `sample.txt` | Response 400 | PASS | P1 |
| TC-SEC-006 | Rate limit 10 req/min/IP | Production/staging | 1. Kirim 11 request dalam 1 menit dari IP yang sama | Request ke-11 mendapat response 429 | Manual | P1 |
| TC-SEC-007 | CORS — origin tidak diizinkan ditolak | Backend berjalan | 1. Kirim request dari origin yang tidak ada di `CORS_ORIGINS` | Request ditolak oleh CORS policy | Manual | P1 |
| TC-SEC-008 | File > 20MB ditolak di semua endpoint | Backend berjalan | 1. POST file > 20MB ke setiap endpoint | Semua endpoint mengembalikan 400 | PASS | P1 |
| TC-SEC-009 | Signed URL memiliki expiry time | Production | 1. Proses file 2. Tunggu URL expired 3. Coba akses | URL expired tidak bisa diakses | Manual | P1 |

---

### 5.8 Cleanup (TC-CLN)

**File Test Terkait:** `backend/tests/conftest.py` — mock `cleanup_expired_files`

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-CLN-001 | Cleanup endpoint mengembalikan hasil scan | Backend berjalan, cleanup di-mock | 1. Trigger cleanup endpoint/cron 2. Verifikasi response | Response berisi `deleted`, `failed`, `scanned` counts | PASS | P0 |
| TC-CLN-002 | File expired dihapus setelah 60 menit | Production/staging | 1. Upload dan proses file 2. Tunggu > 60 menit 3. Coba akses signed URL | File tidak bisa diakses — sudah dihapus | Manual | P0 |
| TC-CLN-003 | File belum expired tetap tersedia | Production/staging | 1. Upload dan proses file 2. Akses signed URL dalam < 60 menit | File masih bisa didownload | Manual | P1 |
| TC-CLN-004 | Cron fallback berjalan setiap 30 menit | Production | 1. Monitor logs Railway 2. Verifikasi cron execution | Cron cleanup berjalan setiap 30 menit | Manual | P1 |
| TC-CLN-005 | UUID filename — nama asli tidak tersimpan | Production | 1. Upload file dengan nama spesifik 2. Cek R2 bucket | File disimpan dengan UUID, bukan nama asli | Manual | P2 |

---

### 5.9 Analytics (TC-ANA)

**File Test Terkait:** `frontend/src/lib/__tests__/analytics.test.ts` (3 test cases otomatis)

| **ID** | **Deskripsi** | **Prasyarat** | **Langkah** | **Hasil Diharapkan** | **Status** | **Prioritas** |
|--------|---------------|---------------|-------------|----------------------|------------|---------------|
| TC-ANA-001 | trackTaskStarted mengirim event dengan tool dan device_category | Vitest, `@vercel/analytics` di-mock | 1. Panggil `trackTaskStarted("compress")` 2. Verifikasi `track` dipanggil | `track("task_started", { tool: "compress", device_category: "desktop" })` | PASS | P1 |
| TC-ANA-002 | trackTaskCompleted mengirim event dengan tool dan device_category | Vitest, `@vercel/analytics` di-mock | 1. Panggil `trackTaskCompleted("merge")` 2. Verifikasi `track` dipanggil | `track("task_completed", { tool: "merge", device_category: "desktop" })` | PASS | P1 |
| TC-ANA-003 | trackTaskFailed mengirim event dengan error terpotong 200 karakter | Vitest, `@vercel/analytics` di-mock | 1. Panggil `trackTaskFailed("split", longError)` dengan error 300 karakter 2. Verifikasi `track` dipanggil | `track("task_failed", { tool: "split", error: <200 chars>, device_category: "desktop" })` | PASS | P1 |
| TC-ANA-004 | Event task_completed terekam di Vercel Analytics dashboard | Production | 1. Lakukan operasi compress berhasil 2. Cek Vercel Analytics | Event `task_completed` muncul di dashboard | Manual | P1 |
| TC-ANA-005 | Device category terdeteksi dengan benar (mobile vs desktop) | Production | 1. Akses dari HP 2. Lakukan operasi 3. Cek analytics | `device_category` = "mobile" untuk akses dari HP | Manual | P2 |

---

## 6. Matriks Keterlacakan

Matriks berikut memetakan setiap test case ke functional requirement di BRD (PPR-BRD-001) dan SRS (PPR-SRS-001).

| **Test Case** | **Functional Requirement** | **BRD Section** | **Deskripsi Requirement** |
|---------------|---------------------------|-----------------|---------------------------|
| TC-CMP-001 – 010 | REQ-CMP-001, REQ-CMP-002, REQ-CMP-003, REQ-CMP-004 | 8.1 PDF Compression | Kompresi 3 level, tampilan persentase, rejection password-protected, signed URL download |
| TC-MRG-001 – 007 | REQ-MRG-001, REQ-MRG-002, REQ-MRG-003, REQ-MRG-004 | 8.2 PDF Merge | Merge 2+ file, drag-and-drop reorder, client-side processing, max 20 file |
| TC-SPL-001 – 007 | REQ-SPL-001, REQ-SPL-002, REQ-SPL-003, REQ-SPL-004 | 8.3 PDF Split | Split berdasarkan range, client-side processing, tampilan total halaman, auto-download |
| TC-I2P-001 – 014 | REQ-IMG-001, REQ-IMG-002, REQ-IMG-003, REQ-IMG-004 | 8.4 Image to PDF | Konversi JPG/PNG/WEBP, multi-image, client/server hybrid, validasi magic bytes |
| TC-P2I-001 – 010 | REQ-P2I-001, REQ-P2I-002, REQ-P2I-003, REQ-P2I-004 | 8.5 PDF to Image | Konversi ke PNG 150 DPI, pilih halaman, ZIP multi-page, PyMuPDF server |
| TC-ROT-001 – 006 | REQ-ROT-001, REQ-ROT-002, REQ-ROT-003 | 8.6 PDF Rotate | Rotasi 90/180/270, per-halaman dan semua, client-side processing |
| TC-SEC-001 – 009 | BR-001, BR-002, BR-008, BR-009 | 7.1 – 7.2 Business Rules | Batas upload 20MB, validasi multi-layer, signed URL, rate limit 10 req/min |
| TC-CLN-001 – 005 | BR-003, BR-004, BR-005, BR-006 | 7.1 Business Rules | Auto-delete 60 menit, cleanup double safety, UUID filename, no content logging |
| TC-ANA-001 – 005 | REQ-ANL-001, REQ-ANL-002, REQ-ANL-003, REQ-ANL-004 | 8.8 Analytics | Event tracking, device_category, cleanup logging, Vercel Analytics |
| TC-CFG-001 – 005 | NFR-006, NFR-007, NFR-008 | 9. Non-Functional | File validation, auto-delete timer, rate limiting config |

### Cakupan Requirement

| **Kategori Requirement** | **Total REQ** | **REQ Tercakup** | **Persentase** |
|--------------------------|---------------|------------------|----------------|
| Compress (REQ-CMP)       | 4             | 4                | 100%           |
| Merge (REQ-MRG)          | 4             | 4                | 100%           |
| Split (REQ-SPL)          | 4             | 4                | 100%           |
| Image to PDF (REQ-IMG)   | 4             | 4                | 100%           |
| PDF to Image (REQ-P2I)   | 4             | 4                | 100%           |
| Rotate (REQ-ROT)         | 3             | 3                | 100%           |
| Analytics (REQ-ANL)      | 4             | 4                | 100%           |
| Business Rules (BR)      | 10            | 8                | 80%            |
| **Total**                | **37**        | **35**           | **95%**        |

*Catatan: BR-010 (No Authentication Required) dan BR-007 (Client-Side Priority) divalidasi secara implisit melalui arsitektur, bukan test case eksplisit.*

---

## 7. Kriteria Masuk & Keluar

### 7.1 Kriteria Masuk (Entry Criteria)

Pengujian dapat dimulai jika semua kondisi berikut terpenuhi:

| **#** | **Kriteria** | **Status** |
|-------|-------------|------------|
| 1 | Semua 6 tool (Compress, Merge, Split, Image-to-PDF, PDF-to-Image, Rotate) sudah diimplementasi dan deployable | Terpenuhi |
| 2 | Environment test (Vitest + Pytest) sudah dikonfigurasi dan berjalan | Terpenuhi |
| 3 | Mock untuk external dependencies (R2, Ghostscript, PyMuPDF) sudah tersedia | Terpenuhi |
| 4 | Test data (fake PDF bytes, test images) sudah disiapkan | Terpenuhi |
| 5 | BRD (PPR-BRD-001) dan SRS (PPR-SRS-001) sudah disetujui | Terpenuhi |
| 6 | Staging environment (Railway + Vercel) sudah aktif | Terpenuhi |

### 7.2 Kriteria Keluar (Exit Criteria)

Pengujian dianggap selesai dan produk siap launch jika:

| **#** | **Kriteria** | **Target** | **Status** |
|-------|-------------|-----------|------------|
| 1 | Semua test otomatis (57 test cases) PASS | 100% pass rate | Terpenuhi |
| 2 | Tidak ada bug P0 (Critical) yang open | 0 bug P0 | Terpenuhi |
| 3 | Tidak ada bug P1 (High) yang open | 0 bug P1 | Terpenuhi |
| 4 | Manual test cases untuk happy path semua tool sudah dijalankan | 6/6 tool | Terpenuhi |
| 5 | Mobile testing (Chrome Android) berhasil untuk semua tool | 6/6 tool | Terpenuhi |
| 6 | Friend testing: minimal 3 dari 5 tester submit feedback | >= 3 responses | Terpenuhi |
| 7 | Task success rate dari friend testing >= 80% | >= 80% | Terpenuhi |
| 8 | Auto-delete file setelah 60 menit terverifikasi | Terverifikasi | Terpenuhi |

---

## 8. Metrik Pengujian

### 8.1 Status Saat Ini

| **Metrik** | **Frontend (Vitest)** | **Backend (Pytest)** | **Total** |
|------------|----------------------|---------------------|-----------|
| Total Test Cases | 23 | 34 | **57** |
| Test PASS | 23 | 34 | **57** |
| Test FAIL | 0 | 0 | **0** |
| Pass Rate | 100% | 100% | **100%** |

### 8.2 Distribusi Test per Modul

| **Modul** | **Otomatis** | **Manual** | **Total** |
|-----------|-------------|-----------|-----------|
| Compress PDF (TC-CMP) | 8 | 2 | 10 |
| Merge PDF (TC-MRG) | 3 | 4 | 7 |
| Split PDF (TC-SPL) | 4 | 3 | 7 |
| Image to PDF (TC-I2P) | 12 | 2 | 14 |
| PDF to Image (TC-P2I) | 7 | 3 | 10 |
| Rotate PDF (TC-ROT) | 2 | 4 | 6 |
| Security (TC-SEC) | 5 | 4 | 9 |
| Cleanup (TC-CLN) | 1 | 4 | 5 |
| Analytics (TC-ANA) | 3 | 2 | 5 |
| Config (config.test.ts) | 5 | 0 | 5 |
| Services (test_services.py) | 7 | 0 | 7 |
| **Total** | **57** | **28** | **85** |

### 8.3 Target Coverage

| **Metrik** | **Target Fase 1** | **Target Fase 2** |
|------------|-------------------|-------------------|
| Unit Test Pass Rate | 100% | 100% |
| Code Coverage (Backend) | > 70% | > 80% |
| Code Coverage (Frontend) | > 60% | > 75% |
| Manual Test Completion | 100% happy path | 100% happy + edge |
| Requirement Coverage | > 90% | > 95% |
| Bug Escape Rate | < 5% | < 3% |

---

## 9. Jadwal Pengujian

| **Fase** | **Aktivitas** | **Durasi** | **Penanggung Jawab** | **Status** |
|----------|--------------|-----------|---------------------|------------|
| Fase 1 | Setup test environment (Vitest + Pytest) | 1 hari | AI Agent | Selesai |
| Fase 5 | Penulisan unit test frontend (pdfUtils, analytics, config) | 2 hari | AI Agent | Selesai |
| Fase 6 | Penulisan integration test backend (compress, image-to-pdf, pdf-to-image) | 3 hari | AI Agent | Selesai |
| Fase 7 | Penulisan service unit test (parse_page_range, get_size_bucket) | 1 hari | AI Agent | Selesai |
| Fase 8 | QA Internal — manual testing semua tool di lokal | 2 hari | Product Owner + AI Agent | Selesai |
| Fase 9 | QA Internal — manual testing di staging (mypapyr.com) | 1 hari | Product Owner | Selesai |
| Fase 10 | Friend Testing (3-5 tester eksternal) | 3-5 hari | Product Owner | Selesai |
| Fase 11 | Bug fixing berdasarkan hasil friend testing | 2-3 hari | AI Agent | Selesai |
| Fase 12 | Regression testing setelah bug fix | 1 hari | AI Agent | Selesai |
| Fase 10 | Go/No-Go review dan soft launch | 1 hari | Product Owner | Selesai |

**Total Estimasi:** 15-20 hari kerja (termasuk buffer untuk bug fixing)

---

## 10. Risiko Pengujian & Mitigasi

| **Risk ID** | **Risiko** | **Probabilitas** | **Dampak** | **Mitigasi** |
|-------------|-----------|------------------|-----------|-------------|
| TST-RSK-001 | Tidak ada E2E testing — bug UI/UX lolos ke production | Medium | Medium | Kompensasi dengan manual testing menyeluruh + friend testing. Tambahkan Playwright di Fase 2. |
| TST-RSK-002 | Mock terlalu banyak — integration test tidak menangkap bug real | Medium | Medium | Tambahkan smoke test di staging yang menggunakan real R2 dan Ghostscript. |
| TST-RSK-003 | Tidak ada load testing — performa degradasi saat traffic tinggi | Low | High | Monitor Railway metrics. Set alert untuk response time > 5 detik. Tambahkan load test setelah scaling. |
| TST-RSK-004 | Solo tester bias — blind spot pada UX issues | Medium | Medium | Friend testing dengan 3-5 orang non-teknis. Feedback form terstruktur. |
| TST-RSK-005 | Test flakiness pada async operations | Low | Low | Gunakan `pytest-asyncio` dengan proper async fixtures. Retry flaky tests 1x. |
| TST-RSK-006 | Ghostscript/PyMuPDF version mismatch antara test dan production | Low | High | Pin versi di `requirements.txt` dan `Dockerfile`. Smoke test di staging sebelum deploy. |
| TST-RSK-007 | Client-side tests tidak cover semua browser | Medium | Medium | Fokus pada Chrome (80%+ market share Indonesia). Tambahkan cross-browser testing di Fase 2. |
| TST-RSK-008 | File test data tidak representatif | Low | Medium | Gunakan real PDF samples dari berbagai sumber (scan, digital, mixed content) untuk manual testing. |

---

## 11. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Test Plan ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan strategi dan lingkup pengujian untuk Papyr Fase 1.

|                   |                              |               |            |
|:------------------|:-----------------------------|:--------------|:-----------|
| **Peran**         | **Nama**                     | **Tanda Tangan** | **Tanggal** |
| **Product Owner** | Muhammad Fa'iz Zulfikar      | Approved      | 2026-05-03 |
| **AI Agent**      | OpenCode/Sisyphus            | Approved      | 2026-05-03 |

Dokumen ini dapat berubah. Setiap modifikasi harus ditinjau dan disetujui ulang oleh semua penandatangan.
