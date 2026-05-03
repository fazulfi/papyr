**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**API Specification**

Version 1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                                      |
|---------------------|------------------------------------------------------|
| **Judul Dokumen**   | API Specification — Papyr Backend                    |
| **ID Dokumen**      | PPR-API-001                                          |
| **Versi**           | 1.0                                                  |
| **Status**          | Approved                                             |
| **Tanggal Dibuat**  | Mei 2026                                             |
| **Terakhir Diubah** | Mei 2026                                             |
| **Penulis**         | Muhammad Fa'iz Zulfikar                              |
| **Ditinjau Oleh**   | Product Owner                                        |
| **Disetujui Oleh**  | Product Owner                                        |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only          |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**             | **Deskripsi**                                                          |
|-----------|-------------|-------------------------|------------------------------------------------------------------------|
| 1.0       | Mei 2026    | Muhammad Fa'iz Zulfikar | Draft awal — API Spec lengkap untuk seluruh endpoint backend Fase 1   |

**Referensi Silang**

| **Dokumen**                          | **ID**       | **Relasi**                                    |
|--------------------------------------|--------------|-----------------------------------------------|
| Business Requirements Document       | PPR-BRD-001  | Sumber business rules & batasan               |
| Software Requirements Specification  | PPR-SRS-001  | Detail functional requirements                |
| Technical Design Document            | PPR-TDD-001  | Arsitektur teknis & keputusan desain          |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Konvensi Umum](#2-konvensi-umum)
3. [Referensi Endpoint](#3-referensi-endpoint)
4. [Model Data](#4-model-data)
5. [Kode Error](#5-kode-error)
6. [Contoh Penggunaan](#6-contoh-penggunaan)
7. [Batasan & Kuota](#7-batasan--kuota)
8. [Keamanan API](#8-keamanan-api)
9. [Persetujuan Dokumen](#9-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini mendefinisikan spesifikasi lengkap untuk Papyr Backend API — RESTful API yang menyediakan layanan pemrosesan PDF server-side untuk aplikasi Papyr. Spesifikasi ini mencakup seluruh endpoint, format request/response, validasi input, kode error, dan batasan operasional.

### 1.2 Cakupan

API ini mencakup operasi PDF yang memerlukan pemrosesan server-side:

| **Operasi**      | **Engine**    | **Endpoint**          |
|------------------|---------------|-----------------------|
| Compress PDF     | Ghostscript   | `POST /api/compress`  |
| Image to PDF     | PyMuPDF       | `POST /api/image-to-pdf` |
| PDF to Image     | PyMuPDF       | `POST /api/pdf-to-image` |

Operasi client-side (Merge, Split, Rotate) diproses sepenuhnya di browser menggunakan pdf-lib dan **tidak** memiliki endpoint API.

### 1.3 Base URL

| **Environment** | **Base URL**                                    |
|-----------------|-------------------------------------------------|
| Production      | `https://papyr-production.up.railway.app`       |
| Local Dev       | `http://localhost:8000`                          |

### 1.4 Autentikasi

API ini **tidak memerlukan autentikasi**. Semua endpoint bersifat publik dan dapat diakses tanpa login, API key, atau token. Pembatasan akses dilakukan melalui rate limiting berbasis IP dan CORS policy.

---

## 2. Konvensi Umum

### 2.1 Base Path

Semua endpoint operasional menggunakan prefix `/api`:

```
{BASE_URL}/api/{endpoint}
```

Pengecualian:
- `GET /health` — tanpa prefix
- `GET /test/connectivity` — prefix `/test`

### 2.2 Content-Type

| **Arah**  | **Content-Type**                          | **Keterangan**                          |
|-----------|-------------------------------------------|-----------------------------------------|
| Request   | `multipart/form-data`                     | Semua endpoint upload file              |
| Response  | `application/json`                        | Semua response (sukses & error)         |

### 2.3 Rate Limiting

| **Parameter**       | **Nilai**                                                    |
|---------------------|--------------------------------------------------------------|
| Batas               | 10 request per menit per IP address                          |
| Implementasi        | slowapi (sliding window)                                     |
| Header Response     | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` |
| Response saat limit | HTTP 429 dengan pesan Bahasa Indonesia                       |

Response saat rate limit terlampaui:

```json
{
  "detail": "Terlalu banyak permintaan. Coba lagi dalam 1 menit."
}
```

### 2.4 CORS Policy

Origin yang diizinkan (strict whitelist):

| **Origin**                                        | **Keterangan**       |
|---------------------------------------------------|----------------------|
| `https://mypapyr.com`                             | Production domain    |
| `https://frontend-ten-omega-35.vercel.app`        | Vercel deployment    |
| `http://localhost:3000`                            | Local development    |

Konfigurasi CORS:

| **Parameter**       | **Nilai**                              |
|---------------------|----------------------------------------|
| `allow_methods`     | `GET`, `POST`, `OPTIONS`               |
| `allow_headers`     | `Content-Type`, `Authorization`        |
| `allow_credentials` | `true`                                 |

Request dari origin yang tidak terdaftar akan ditolak oleh browser (preflight gagal).

### 2.5 Format Error

Semua error response menggunakan format konsisten:

```json
{
  "detail": "Pesan error dalam Bahasa Indonesia"
}
```

### 2.6 Versi API

| **Parameter** | **Nilai** |
|---------------|-----------|
| API Version   | `0.1.0`   |
| Versioning    | Belum menggunakan URL versioning (akan ditambahkan di Fase 2) |

---

## 3. Referensi Endpoint

---

### 3.1 GET /health

**Deskripsi:** Health check endpoint untuk memverifikasi bahwa server API aktif dan berjalan normal.

#### Request

Tidak ada parameter, body, atau header khusus yang diperlukan.

#### Response — 200 OK

```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2026-05-15T10:30:00.000000+00:00"
}
```

| **Field**     | **Tipe**  | **Deskripsi**                                |
|---------------|-----------|----------------------------------------------|
| `status`      | `string`  | Status server — selalu `"ok"` jika berjalan  |
| `version`     | `string`  | Versi API saat ini                           |
| `timestamp`   | `string`  | Waktu server saat ini (ISO 8601, UTC)        |

#### Error Responses

| **Status** | **Kondisi**                    |
|------------|--------------------------------|
| 503        | Server sedang tidak tersedia   |

---

### 3.2 POST /api/compress

**Deskripsi:** Kompres file PDF menggunakan Ghostscript engine dengan preset kualitas yang dapat dipilih. File hasil kompresi di-upload ke Cloudflare R2 dan dikembalikan sebagai signed download URL.

#### Request

**Content-Type:** `multipart/form-data`

| **Field**  | **Tipe**       | **Wajib** | **Deskripsi**                                                    |
|------------|----------------|-----------|------------------------------------------------------------------|
| `file`     | `file` (binary)| Ya        | File PDF yang akan dikompres                                     |
| `quality`  | `string` (query)| Tidak   | Preset kualitas: `screen`, `ebook` (default), `printer`          |

**Preset Kualitas:**

| **Preset**  | **Ghostscript Setting** | **DPI** | **Keterangan**                    |
|-------------|-------------------------|---------|-----------------------------------|
| `screen`    | `/screen`               | 72      | Ukuran kecil, kualitas rendah     |
| `ebook`     | `/ebook`                | 150     | Seimbang — default                |
| `printer`   | `/printer`              | 300     | Kualitas tinggi, ukuran lebih besar |

#### Validasi Input

Validasi dilakukan secara berurutan (fail-fast):

| **#** | **Layer**          | **Aturan**                                          | **Error Message**                                                                    |
|-------|--------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------|
| 1     | File kosong        | `len(file_bytes) > 0`                               | `"File kosong. Silakan upload file PDF yang valid."`                                 |
| 2     | MIME type          | `content_type == "application/pdf"`                  | `"Tipe file tidak valid: {content_type}. Hanya file PDF yang diterima."`             |
| 3     | Ekstensi           | Ekstensi file harus `.pdf`                          | `"Ekstensi file tidak valid: '{ext}'. Hanya file .pdf yang diterima."`               |
| 4     | Magic bytes        | 4 byte pertama harus `%PDF` (`0x25504446`)          | `'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.'`     |
| 5     | Ukuran file        | `size <= 20MB` (20.971.520 bytes)                   | `"Ukuran file terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB."`                  |
| 6     | Password-protected | PDF tidak boleh terenkripsi                         | `"PDF ini dilindungi kata sandi dan tidak dapat diproses."`                          |
| 7     | File corrupt       | File harus bisa dibuka oleh PyMuPDF                 | `'"{filename}" bukan file PDF yang valid atau file corrupt.'`                        |

#### Response — 200 OK

```json
{
  "download_url": "https://...r2.cloudflarestorage.com/...?X-Amz-Signature=...",
  "original_size": 5242880,
  "compressed_size": 1048576,
  "saved_percent": 80
}
```

| **Field**          | **Tipe**   | **Deskripsi**                                              |
|--------------------|------------|------------------------------------------------------------|
| `download_url`     | `string`   | Signed URL untuk download file hasil kompresi (valid 1 jam)|
| `original_size`    | `integer`  | Ukuran file asli dalam bytes                               |
| `compressed_size`  | `integer`  | Ukuran file setelah kompresi dalam bytes                   |
| `saved_percent`    | `integer`  | Persentase pengurangan ukuran (0-100)                      |

#### Error Responses

| **Status** | **Kondisi**                          | **Detail Message**                                                                         |
|------------|--------------------------------------|--------------------------------------------------------------------------------------------|
| 400        | File kosong                          | `"File kosong. Silakan upload file PDF yang valid."`                                       |
| 400        | MIME type salah                      | `"Tipe file tidak valid: {content_type}. Hanya file PDF yang diterima."`                   |
| 400        | Ekstensi salah                       | `"Ekstensi file tidak valid: '{ext}'. Hanya file .pdf yang diterima."`                     |
| 400        | Magic bytes tidak cocok              | `'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.'`           |
| 400        | Ukuran melebihi batas                | `"Ukuran file terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB."`                        |
| 400        | PDF terproteksi password             | `"PDF ini dilindungi kata sandi dan tidak dapat diproses."`                                |
| 400        | File corrupt                         | `'"{filename}" bukan file PDF yang valid atau file corrupt.'`                              |
| 400        | Preset quality tidak valid           | `"Preset kualitas tidak valid: '{quality}'. Pilihan: screen, ebook, printer."`             |
| 400        | Ghostscript gagal proses             | `"File PDF tidak bisa dikompresi. Pastikan file tidak corrupt atau terproteksi password."` |
| 429        | Rate limit terlampaui                | `"Terlalu banyak permintaan. Coba lagi dalam 1 menit."`                                   |
| 500        | Ghostscript tidak tersedia           | `"Ghostscript tidak tersedia di server. Hubungi administrator."`                           |
| 500        | Timeout (>30 detik)                  | `"Proses kompresi melebihi batas waktu (30 detik). Coba file yang lebih kecil."`           |
| 500        | Output kosong                        | `"Kompresi gagal — output file kosong."`                                                   |
| 500        | Error tidak terduga                  | `"Gagal memproses file. Silakan coba lagi."`                                               |

---

### 3.3 POST /api/image-to-pdf

**Deskripsi:** Konversi satu atau lebih file gambar (JPG, PNG, WEBP) menjadi satu file PDF menggunakan PyMuPDF. Setiap gambar menjadi satu halaman PDF dengan dimensi sesuai ukuran gambar asli.

#### Request

**Content-Type:** `multipart/form-data`

| **Field** | **Tipe**              | **Wajib** | **Deskripsi**                                          |
|-----------|-----------------------|-----------|--------------------------------------------------------|
| `files`   | `file[]` (multiple)   | Ya        | Satu atau lebih file gambar (JPG/PNG/WEBP)             |

#### Validasi Input

Validasi dilakukan per file secara berurutan:

| **#** | **Layer**          | **Aturan**                                                        | **Error Message**                                                                              |
|-------|--------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| 1     | Jumlah file        | Minimal 1 file                                                    | `"Minimal 1 gambar diperlukan."`                                                               |
| 2     | File kosong        | `len(file_bytes) > 0`                                             | `'"{filename}" kosong. Silakan upload gambar yang valid.'`                                      |
| 3     | MIME type          | `content_type` harus `image/jpeg`, `image/png`, atau `image/webp` | `'"{filename}" bukan format yang didukung. Hanya JPG, PNG, dan WEBP.'`                         |
| 4     | Ekstensi           | Harus `.jpg`, `.jpeg`, `.png`, atau `.webp`                       | `'"{filename}" ekstensi tidak valid. Hanya .jpg, .jpeg, .png, .webp.'`                         |
| 5     | Magic bytes        | Header file harus sesuai format gambar                            | `'"{filename}" bukan file gambar yang valid. Konten file tidak sesuai format JPG/PNG/WEBP.'`    |
| 6     | Ukuran file        | `size <= 20MB` per file                                           | `'"{filename}" terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB.'`                            |

**Magic Bytes yang Divalidasi:**

| **Format** | **Magic Bytes**                                    | **Offset** |
|------------|----------------------------------------------------|------------|
| JPEG       | `FF D8 FF`                                         | Byte 0-2   |
| PNG        | `89 50 4E 47 0D 0A 1A 0A`                         | Byte 0-7   |
| WEBP       | `52 49 46 46` (RIFF) + `57 45 42 50` (WEBP)       | Byte 0-3 + Byte 8-11 |

#### Response — 200 OK

```json
{
  "download_url": "https://...r2.cloudflarestorage.com/...?X-Amz-Signature=...",
  "image_count": 3,
  "pdf_size": 2097152
}
```

| **Field**       | **Tipe**   | **Deskripsi**                                              |
|-----------------|------------|------------------------------------------------------------|
| `download_url`  | `string`   | Signed URL untuk download file PDF hasil konversi (valid 1 jam) |
| `image_count`   | `integer`  | Jumlah gambar yang berhasil dikonversi                     |
| `pdf_size`      | `integer`  | Ukuran file PDF hasil dalam bytes                          |

#### Error Responses

| **Status** | **Kondisi**                          | **Detail Message**                                                                                  |
|------------|--------------------------------------|-----------------------------------------------------------------------------------------------------|
| 400        | Tidak ada file                       | `"Minimal 1 gambar diperlukan."`                                                                    |
| 400        | File kosong                          | `'"{filename}" kosong. Silakan upload gambar yang valid.'`                                           |
| 400        | MIME type salah                      | `'"{filename}" bukan format yang didukung. Hanya JPG, PNG, dan WEBP.'`                              |
| 400        | Ekstensi salah                       | `'"{filename}" ekstensi tidak valid. Hanya .jpg, .jpeg, .png, .webp.'`                              |
| 400        | Magic bytes tidak cocok              | `'"{filename}" bukan file gambar yang valid. Konten file tidak sesuai format JPG/PNG/WEBP.'`         |
| 400        | Ukuran melebihi batas                | `'"{filename}" terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB.'`                                 |
| 400        | Gambar rusak/corrupt                 | `'"{filename}" tidak bisa dibaca sebagai gambar. File mungkin rusak.'`                               |
| 429        | Rate limit terlampaui                | `"Terlalu banyak permintaan. Coba lagi dalam 1 menit."`                                            |
| 500        | Error tidak terduga                  | `"Gagal memproses file. Silakan coba lagi."`                                                        |

---

### 3.4 POST /api/pdf-to-image

**Deskripsi:** Konversi halaman PDF menjadi gambar PNG menggunakan PyMuPDF pada resolusi 150 DPI. Mendukung pemilihan halaman spesifik. Output berupa single PNG (1 halaman) atau ZIP file (multiple halaman).

#### Request

**Content-Type:** `multipart/form-data`

| **Field** | **Tipe**        | **Wajib** | **Deskripsi**                                                              |
|-----------|-----------------|-----------|----------------------------------------------------------------------------|
| `file`    | `file` (binary) | Ya        | File PDF yang akan dikonversi                                              |
| `pages`   | `string` (form) | Tidak     | Range halaman yang dikonversi. Kosong = semua halaman. Format: `"1-3,5,7"` |

**Format Parameter `pages`:**

| **Format**   | **Contoh**  | **Hasil**                          |
|--------------|-------------|------------------------------------|
| Kosong/empty | `""`        | Semua halaman                      |
| Single page  | `"3"`       | Halaman 3 saja                     |
| Range        | `"1-5"`     | Halaman 1 sampai 5                 |
| Kombinasi    | `"1-3,5,7"` | Halaman 1, 2, 3, 5, dan 7         |

Catatan: Nomor halaman menggunakan 1-indexed (halaman pertama = 1).

#### Validasi Input

| **#** | **Layer**          | **Aturan**                                          | **Error Message**                                                                    |
|-------|--------------------|-----------------------------------------------------|--------------------------------------------------------------------------------------|
| 1     | File kosong        | `len(file_bytes) > 0`                               | `'"{filename}" kosong. Silakan upload file PDF yang valid.'`                          |
| 2     | MIME type          | `content_type == "application/pdf"`                  | `'"{filename}" bukan format yang didukung. Hanya file PDF.'`                         |
| 3     | Ekstensi           | Ekstensi file harus `.pdf`                          | `'"{filename}" ekstensi tidak valid. Hanya file .pdf.'`                              |
| 4     | Magic bytes        | 4 byte pertama harus `%PDF`                         | `'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.'`     |
| 5     | Ukuran file        | `size <= 20MB`                                      | `'"{filename}" terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB.'`                  |
| 6     | Password-protected | PDF tidak boleh terenkripsi                         | `"PDF ini dilindungi kata sandi dan tidak dapat diproses."`                          |
| 7     | File corrupt       | File harus bisa dibuka oleh PyMuPDF                 | `'"{filename}" bukan file PDF yang valid atau file corrupt.'`                        |
| 8     | Halaman kosong     | PDF harus memiliki minimal 1 halaman                | `"File PDF tidak memiliki halaman."`                                                 |
| 9     | Format pages       | Hanya angka, koma, strip, dan spasi                 | `"Format halaman tidak valid. Gunakan angka, koma, dan strip. Contoh: 1-3,5"`        |
| 10    | Range valid        | Start harus <= end                                  | `"Range tidak valid: {start} lebih besar dari {end}."`                               |
| 11    | Halaman ada        | Nomor halaman harus dalam jangkauan                 | `"Halaman di luar jangkauan: {range}. PDF ini memiliki {total} halaman."`            |

#### Response — 200 OK

```json
{
  "download_url": "https://...r2.cloudflarestorage.com/...?X-Amz-Signature=...",
  "file_type": "png",
  "page_count": 1
}
```

| **Field**       | **Tipe**   | **Deskripsi**                                                    |
|-----------------|------------|------------------------------------------------------------------|
| `download_url`  | `string`   | Signed URL untuk download hasil konversi (valid 1 jam)           |
| `file_type`     | `string`   | Tipe output: `"png"` (single page) atau `"zip"` (multiple pages)|
| `page_count`    | `integer`  | Jumlah halaman yang berhasil dikonversi                          |

**Logika Output:**

| **Jumlah Halaman** | **Output**       | **Content-Type**    | **Filename**  |
|---------------------|------------------|---------------------|---------------|
| 1 halaman           | File PNG tunggal | `image/png`         | `page.png`    |
| 2+ halaman          | File ZIP         | `application/zip`   | `pages.zip`   |

Struktur file dalam ZIP: `page_1.png`, `page_2.png`, `page_3.png`, dst. (1-indexed sesuai nomor halaman asli).

#### Error Responses

| **Status** | **Kondisi**                          | **Detail Message**                                                                         |
|------------|--------------------------------------|--------------------------------------------------------------------------------------------|
| 400        | File kosong                          | `'"{filename}" kosong. Silakan upload file PDF yang valid.'`                                |
| 400        | MIME type salah                      | `'"{filename}" bukan format yang didukung. Hanya file PDF.'`                               |
| 400        | Ekstensi salah                       | `'"{filename}" ekstensi tidak valid. Hanya file .pdf.'`                                    |
| 400        | Magic bytes tidak cocok              | `'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.'`           |
| 400        | Ukuran melebihi batas                | `'"{filename}" terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB.'`                        |
| 400        | PDF terproteksi password             | `"PDF ini dilindungi kata sandi dan tidak dapat diproses."`                                |
| 400        | File corrupt                         | `'"{filename}" bukan file PDF yang valid atau file corrupt.'`                              |
| 400        | PDF tidak bisa dibuka                | `"File PDF tidak bisa dibuka. Pastikan file tidak corrupt atau terproteksi password."`     |
| 400        | PDF tanpa halaman                    | `"File PDF tidak memiliki halaman."`                                                       |
| 400        | Format pages tidak valid             | `"Format halaman tidak valid. Gunakan angka, koma, dan strip. Contoh: 1-3,5"`             |
| 400        | Format range tidak valid             | `"Format range tidak valid: '{part}'. Gunakan format seperti 1-3."`                        |
| 400        | Nomor halaman tidak valid            | `"Nomor halaman tidak valid: '{part}'."`                                                   |
| 400        | Range terbalik                       | `"Range tidak valid: {start} lebih besar dari {end}."`                                     |
| 400        | Halaman di luar jangkauan (range)    | `"Halaman di luar jangkauan: {start}-{end}. PDF ini memiliki {total} halaman."`            |
| 400        | Halaman di luar jangkauan (single)   | `"Halaman {page_num} di luar jangkauan. PDF ini memiliki {total} halaman."`                |
| 429        | Rate limit terlampaui                | `"Terlalu banyak permintaan. Coba lagi dalam 1 menit."`                                   |
| 500        | Gagal render halaman                 | `"Gagal merender halaman {page}. File mungkin corrupt."`                                   |
| 500        | Gagal buat ZIP                       | `"Gagal membuat file ZIP."`                                                                |
| 500        | Error tidak terduga                  | `"Gagal memproses file. Silakan coba lagi."`                                               |

---

### 3.5 GET /test/connectivity

**Deskripsi:** Endpoint untuk verifikasi koneksi end-to-end dari Backend ke Cloudflare R2. Melakukan upload dummy file, generate signed URL, dan delete file. **Hanya untuk development/staging.**

#### Request

Tidak ada parameter, body, atau header khusus yang diperlukan.

#### Response — 200 OK

```json
{
  "backend": "ok",
  "r2_upload": {
    "status": "ok",
    "key": "a1b2c3d4e5f6.pdf",
    "size_bytes": 32
  },
  "r2_signed_url": {
    "status": "ok",
    "url": "https://...r2.cloudflarestorage.com/...?X-Amz-Signature=..."
  },
  "r2_delete": {
    "status": "ok"
  },
  "elapsed_ms": 450
}
```

| **Field**         | **Tipe**   | **Deskripsi**                                    |
|-------------------|------------|--------------------------------------------------|
| `backend`         | `string`   | Status backend — selalu `"ok"`                   |
| `r2_upload`       | `object`   | Hasil upload dummy file ke R2                    |
| `r2_signed_url`   | `object`   | Hasil generate signed URL                        |
| `r2_delete`       | `object`   | Hasil delete dummy file dari R2                  |
| `elapsed_ms`      | `integer`  | Total waktu eksekusi dalam milidetik             |

#### Error Responses

Jika salah satu langkah gagal, response tetap 200 tetapi field yang gagal berisi:

```json
{
  "status": "error",
  "detail": "Pesan error dari R2"
}
```

---

## 4. Model Data

### 4.1 Request Schemas

#### CompressRequest (multipart/form-data)

| **Field**  | **Tipe**  | **Wajib** | **Validasi**                                | **Default** |
|------------|-----------|-----------|---------------------------------------------|-------------|
| `file`     | `File`    | Ya        | PDF, ≤20MB, valid magic bytes, not encrypted| —           |
| `quality`  | `string`  | Tidak     | Regex: `^(screen\|ebook\|printer)$`          | `"ebook"`   |

#### ImageToPdfRequest (multipart/form-data)

| **Field** | **Tipe**   | **Wajib** | **Validasi**                                         | **Default** |
|-----------|------------|-----------|------------------------------------------------------|-------------|
| `files`   | `File[]`   | Ya        | ≥1 file, JPG/PNG/WEBP, ≤20MB each, valid magic bytes| —           |

#### PdfToImageRequest (multipart/form-data)

| **Field** | **Tipe**  | **Wajib** | **Validasi**                                         | **Default** |
|-----------|-----------|-----------|------------------------------------------------------|-------------|
| `file`    | `File`    | Ya        | PDF, ≤20MB, valid magic bytes, not encrypted         | —           |
| `pages`   | `string`  | Tidak     | Format: angka, koma, strip. Contoh: `"1-3,5"`        | `""` (semua)|

### 4.2 Response Schemas

#### HealthResponse

```typescript
{
  status: "ok",
  version: string,       // "0.1.0"
  timestamp: string      // ISO 8601 UTC
}
```

#### CompressResponse

```typescript
{
  download_url: string,    // Signed URL (valid 3600s)
  original_size: integer,  // bytes
  compressed_size: integer,// bytes
  saved_percent: integer   // 0-100
}
```

#### ImageToPdfResponse

```typescript
{
  download_url: string,    // Signed URL (valid 3600s)
  image_count: integer,    // jumlah gambar yang dikonversi
  pdf_size: integer        // bytes
}
```

#### PdfToImageResponse

```typescript
{
  download_url: string,    // Signed URL (valid 3600s)
  file_type: "png" | "zip",
  page_count: integer      // jumlah halaman yang dikonversi
}
```

#### ErrorResponse

```typescript
{
  detail: string           // Pesan error dalam Bahasa Indonesia
}
```

---

## 5. Kode Error

### 5.1 Tabel Kode Error Lengkap

| **HTTP Status** | **Kategori**       | **Kondisi**                                    | **Detail Message (Bahasa Indonesia)**                                                          |
|-----------------|--------------------|------------------------------------------------|------------------------------------------------------------------------------------------------|
| 400             | Validasi — Umum    | File kosong                                    | `"File kosong. Silakan upload file PDF yang valid."`                                           |
| 400             | Validasi — Umum    | Tidak ada file gambar                          | `"Minimal 1 gambar diperlukan."`                                                               |
| 400             | Validasi — MIME    | MIME type PDF salah                            | `"Tipe file tidak valid: {type}. Hanya file PDF yang diterima."`                               |
| 400             | Validasi — MIME    | MIME type gambar salah                         | `'"{filename}" bukan format yang didukung. Hanya JPG, PNG, dan WEBP.'`                         |
| 400             | Validasi — Ext     | Ekstensi PDF salah                             | `"Ekstensi file tidak valid: '{ext}'. Hanya file .pdf yang diterima."`                         |
| 400             | Validasi — Ext     | Ekstensi gambar salah                          | `'"{filename}" ekstensi tidak valid. Hanya .jpg, .jpeg, .png, .webp.'`                         |
| 400             | Validasi — Magic   | Magic bytes PDF tidak cocok                    | `'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.'`               |
| 400             | Validasi — Magic   | Magic bytes gambar tidak cocok                 | `'"{filename}" bukan file gambar yang valid. Konten file tidak sesuai format JPG/PNG/WEBP.'`   |
| 400             | Validasi — Size    | File melebihi 20MB                             | `"Ukuran file terlalu besar: {mb}MB. Maksimal {max}MB."`                                      |
| 400             | Validasi — Encrypt | PDF terproteksi password                       | `"PDF ini dilindungi kata sandi dan tidak dapat diproses."`                                    |
| 400             | Validasi — Corrupt | File corrupt/tidak bisa dibuka                 | `'"{filename}" bukan file PDF yang valid atau file corrupt.'`                                  |
| 400             | Validasi — Pages   | Format halaman tidak valid                     | `"Format halaman tidak valid. Gunakan angka, koma, dan strip. Contoh: 1-3,5"`                  |
| 400             | Validasi — Pages   | Halaman di luar jangkauan                      | `"Halaman di luar jangkauan: {range}. PDF ini memiliki {total} halaman."`                      |
| 400             | Validasi — Quality | Preset kualitas tidak valid                    | `"Preset kualitas tidak valid: '{quality}'. Pilihan: screen, ebook, printer."`                 |
| 400             | Processing         | Ghostscript gagal proses                       | `"File PDF tidak bisa dikompresi. Pastikan file tidak corrupt atau terproteksi password."`     |
| 400             | Processing         | Gambar rusak                                   | `'"{filename}" tidak bisa dibaca sebagai gambar. File mungkin rusak.'`                          |
| 429             | Rate Limit         | Melebihi 10 req/min/IP                         | `"Terlalu banyak permintaan. Coba lagi dalam 1 menit."`                                       |
| 500             | Server             | Ghostscript tidak tersedia                     | `"Ghostscript tidak tersedia di server. Hubungi administrator."`                               |
| 500             | Server             | Timeout pemrosesan                             | `"Proses kompresi melebihi batas waktu (30 detik). Coba file yang lebih kecil."`               |
| 500             | Server             | Output kosong                                  | `"Kompresi gagal — output file kosong."`                                                       |
| 500             | Server             | Gagal render halaman                           | `"Gagal merender halaman {page}. File mungkin corrupt."`                                       |
| 500             | Server             | Gagal buat ZIP                                 | `"Gagal membuat file ZIP."`                                                                    |
| 500             | Server             | Error tidak terduga                            | `"Gagal memproses file. Silakan coba lagi."`                                                   |

### 5.2 Kategori Error

| **HTTP Status** | **Kategori**          | **Tindakan Client**                                    |
|-----------------|-----------------------|--------------------------------------------------------|
| 400             | Client Error          | Perbaiki input dan coba lagi                           |
| 429             | Rate Limit            | Tunggu 1 menit, lalu coba lagi                         |
| 500             | Server Error          | Retry otomatis 1x, jika gagal tampilkan error ke user  |

---

## 6. Contoh Penggunaan

### 6.1 Health Check

```bash
curl -X GET https://papyr-production.up.railway.app/health
```

**Response:**

```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2026-05-15T10:30:00.000000+00:00"
}
```

---

### 6.2 Compress PDF

```bash
curl -X POST "https://papyr-production.up.railway.app/api/compress?quality=ebook" \
  -F "file=@dokumen.pdf"
```

**Response:**

```json
{
  "download_url": "https://abc123.r2.cloudflarestorage.com/f47ac10b58cc.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Signature=...",
  "original_size": 5242880,
  "compressed_size": 1048576,
  "saved_percent": 80
}
```

---

### 6.3 Image to PDF (Multiple Images)

```bash
curl -X POST https://papyr-production.up.railway.app/api/image-to-pdf \
  -F "files=@foto1.jpg" \
  -F "files=@foto2.png" \
  -F "files=@foto3.webp"
```

**Response:**

```json
{
  "download_url": "https://abc123.r2.cloudflarestorage.com/e2d4f6a8b0c1.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
  "image_count": 3,
  "pdf_size": 2097152
}
```

---

### 6.4 PDF to Image (Semua Halaman)

```bash
curl -X POST https://papyr-production.up.railway.app/api/pdf-to-image \
  -F "file=@dokumen.pdf" \
  -F "pages="
```

**Response (multi-page → ZIP):**

```json
{
  "download_url": "https://abc123.r2.cloudflarestorage.com/c3d4e5f6a7b8.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
  "file_type": "zip",
  "page_count": 5
}
```

---

### 6.5 PDF to Image (Halaman Spesifik)

```bash
curl -X POST https://papyr-production.up.railway.app/api/pdf-to-image \
  -F "file=@dokumen.pdf" \
  -F "pages=1"
```

**Response (single page → PNG):**

```json
{
  "download_url": "https://abc123.r2.cloudflarestorage.com/a1b2c3d4e5f6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
  "file_type": "png",
  "page_count": 1
}
```

---

### 6.6 PDF to Image (Range Halaman)

```bash
curl -X POST https://papyr-production.up.railway.app/api/pdf-to-image \
  -F "file=@dokumen.pdf" \
  -F "pages=1-3,5,7-10"
```

**Response (multi-page → ZIP):**

```json
{
  "download_url": "https://abc123.r2.cloudflarestorage.com/d4e5f6a7b8c9.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&...",
  "file_type": "zip",
  "page_count": 8
}
```

---

### 6.7 Connectivity Test

```bash
curl -X GET https://papyr-production.up.railway.app/test/connectivity
```

**Response:**

```json
{
  "backend": "ok",
  "r2_upload": {
    "status": "ok",
    "key": "a1b2c3d4e5f6.pdf",
    "size_bytes": 32
  },
  "r2_signed_url": {
    "status": "ok",
    "url": "https://abc123.r2.cloudflarestorage.com/a1b2c3d4e5f6.pdf?..."
  },
  "r2_delete": {
    "status": "ok"
  },
  "elapsed_ms": 450
}
```

---

### 6.8 Contoh Error Response

**File terlalu besar:**

```bash
curl -X POST https://papyr-production.up.railway.app/api/compress \
  -F "file=@file_besar_25mb.pdf"
```

```json
{
  "detail": "Ukuran file terlalu besar: 25.0MB. Maksimal 20MB."
}
```

**Rate limit terlampaui:**

```json
{
  "detail": "Terlalu banyak permintaan. Coba lagi dalam 1 menit."
}
```

---

## 7. Batasan & Kuota

### 7.1 Batasan Upload

| **Parameter**              | **Nilai**       | **Keterangan**                                    |
|----------------------------|-----------------|---------------------------------------------------|
| Ukuran maksimal per file   | 20 MB           | Berlaku untuk semua endpoint                      |
| Format PDF yang diterima   | `.pdf`          | MIME: `application/pdf`, Magic: `%PDF`            |
| Format gambar yang diterima| `.jpg`, `.jpeg`, `.png`, `.webp` | MIME + magic bytes validation   |
| File terproteksi password  | Ditolak         | Berlaku untuk compress dan pdf-to-image           |
| File corrupt               | Ditolak         | Dideteksi saat PyMuPDF mencoba membuka file       |

### 7.2 Rate Limiting

| **Parameter**              | **Nilai**       | **Keterangan**                                    |
|----------------------------|-----------------|---------------------------------------------------|
| Request per menit per IP   | 10              | Sliding window, berlaku untuk semua endpoint      |
| Cooldown setelah limit     | 1 menit         | Otomatis reset setelah window bergeser            |
| Identifikasi client        | IP address      | Menggunakan `X-Forwarded-For` atau remote address |

### 7.3 Retensi File

| **Parameter**              | **Nilai**       | **Keterangan**                                    |
|----------------------------|-----------------|---------------------------------------------------|
| Retensi file di R2         | 60 menit        | Auto-delete via R2 lifecycle rule                 |
| Cleanup cron fallback      | Setiap 30 menit | Background task menghapus file expired            |
| Signed URL validity        | 60 menit        | URL download kadaluarsa setelah 1 jam             |
| Filename di R2             | UUID            | Tidak ada informasi user-identifiable             |

### 7.4 Processing Limits

| **Parameter**              | **Nilai**       | **Keterangan**                                    |
|----------------------------|-----------------|---------------------------------------------------|
| Ghostscript timeout        | 30 detik        | Per operasi kompresi                              |
| Rasterisasi DPI            | 150             | Default untuk PDF-to-Image                        |
| Output format PDF-to-Image | PNG             | Resolusi 150 DPI, lossless                        |

### 7.5 Format yang Didukung per Endpoint

| **Endpoint**          | **Input**                        | **Output**                    |
|-----------------------|----------------------------------|-------------------------------|
| `/api/compress`       | PDF                              | PDF (compressed)              |
| `/api/image-to-pdf`   | JPG, JPEG, PNG, WEBP             | PDF                           |
| `/api/pdf-to-image`   | PDF                              | PNG (single) / ZIP (multiple) |

---

## 8. Keamanan API

### 8.1 Autentikasi & Otorisasi

| **Aspek**                  | **Status**                                                |
|----------------------------|-----------------------------------------------------------|
| Autentikasi                | Tidak diperlukan (public API)                             |
| API Key                    | Tidak ada (akan ditambahkan di Pro tier, Fase 3)         |
| OAuth / JWT                | Tidak ada                                                 |
| Session management         | Tidak ada — stateless                                     |

### 8.2 Rate Limiting

| **Aspek**                  | **Implementasi**                                          |
|----------------------------|-----------------------------------------------------------|
| Library                    | slowapi (berbasis starlette-limiter)                      |
| Algoritma                  | Sliding window                                            |
| Key function               | IP address (`get_remote_address`)                         |
| Batas                      | 10 request/menit/IP                                       |
| Response saat limit        | HTTP 429 + pesan Bahasa Indonesia                         |

### 8.3 Validasi Input (Defense in Depth)

Setiap file yang di-upload melewati **6 layer validasi** sebelum diproses:

| **Layer** | **Validasi**       | **Tujuan**                                                |
|-----------|--------------------|-----------------------------------------------------------|
| 1         | MIME type check    | Menolak file dengan content-type yang tidak sesuai        |
| 2         | Extension check    | Menolak file dengan ekstensi yang tidak diizinkan         |
| 3         | Magic bytes check  | Memverifikasi konten file sesuai format yang diklaim      |
| 4         | Size check         | Menolak file yang melebihi batas ukuran                   |
| 5         | Password detection | Menolak PDF terenkripsi                                    |
| 6         | Empty file check   | Menolak file berukuran 0 byte                             |

Validasi tambahan:
- **Size check** — menolak file > 20MB sebelum pemrosesan
- **Password check** — menolak PDF terenkripsi (menggunakan PyMuPDF)
- **Corruption check** — menolak file yang tidak bisa dibuka/dibaca

### 8.4 CORS Policy

| **Aspek**                  | **Implementasi**                                          |
|----------------------------|-----------------------------------------------------------|
| Mode                       | Strict whitelist                                          |
| Allowed origins            | 3 origin spesifik (production, staging, localhost)        |
| Allowed methods            | GET, POST, OPTIONS                                        |
| Allowed headers            | Content-Type, Authorization                               |
| Credentials                | Allowed                                                   |
| Preflight caching          | Default browser behavior                                  |

### 8.5 Privasi & Data Protection

| **Aspek**                  | **Implementasi**                                          |
|----------------------------|-----------------------------------------------------------|
| Filename storage           | UUID — nama asli file tidak pernah disimpan               |
| Content logging            | Zero — konten file tidak pernah di-log                    |
| File retention             | Maksimal 60 menit, lalu auto-delete                      |
| Signed URLs                | File hanya bisa diakses via signed URL (time-limited)     |
| Direct R2 access           | Tidak ada public access ke bucket                         |
| Metadata logging           | Hanya ukuran file, tipe, dan timestamp (operasional)      |

### 8.6 Transport Security

| **Aspek**                  | **Implementasi**                                          |
|----------------------------|-----------------------------------------------------------|
| Protocol                   | HTTPS only (TLS 1.3)                                      |
| Certificate                | Railway auto-managed SSL                                  |
| HTTP redirect              | Otomatis redirect ke HTTPS                                |

---

## 9. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau API Specification ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan spesifikasi teknis API untuk Papyr Backend Fase 1.

|                   |                              |                  |             |
|:------------------|:-----------------------------|:-----------------|:------------|
| **Peran**         | **Nama**                     | **Tanda Tangan** | **Tanggal** |
| **Product Owner** | Muhammad Fa'iz Zulfikar      | Approved         | 2026-05-15  |
| **AI Agent**      | OpenCode/Sisyphus            | Approved         | 2026-05-15  |

---

*Dokumen ini dapat berubah. Setiap modifikasi harus ditinjau dan disetujui ulang oleh semua penandatangan.*

*— Akhir Dokumen PPR-API-001 v1.0 —*
