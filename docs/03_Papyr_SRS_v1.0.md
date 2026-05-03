**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Software Requirements Specification (SRS)**

Version 1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                                    |
|---------------------|-------------------------------------------------------|
| **Judul Dokumen**   | Software Requirements Specification - Papyr        |
| **ID Dokumen**      | PPR-SRS-001                                        |
| **Versi**           | 1.0                                                |
| **Status**          | Approved                                           |
| **Tanggal Dibuat**  | Mei 2026                                           |
| **Terakhir Diubah** | Mei 2026                                           |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                       |
| **Ditinjau Oleh**   | Muhammad Fa'iz Zulfikar - Product Owner             |
| **Disetujui Oleh**  | Muhammad Fa'iz Zulfikar - Product Owner             |
| **Kerahasiaan**     | Confidential - Internal Use Only                   |

---

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                                  |
|-----------|-------------|------------------------------|------------------------------------------------------------------------------------------------|
| 1.0       | Mei 2026    | AI Agent (OpenCode/Sisyphus) | Draft awal - SRS lengkap untuk scope MVP 0.1 mencakup 6 tool PDF, keamanan, dan infrastruktur |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Deskripsi Umum](#2-deskripsi-umum)
3. [Kebutuhan Fungsional](#3-kebutuhan-fungsional)
4. [Kebutuhan Non-Fungsional](#4-kebutuhan-non-fungsional)
5. [Kebutuhan Antarmuka](#5-kebutuhan-antarmuka)
6. [Matriks Keterlacakan](#6-matriks-keterlacakan)
7. [Persetujuan Dokumen](#7-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen Software Requirements Specification (SRS) ini mendefinisikan secara detail seluruh kebutuhan fungsional dan non-fungsional untuk Papyr - web application utilitas PDF yang dirancang khusus untuk pasar Indonesia. Dokumen ini berfungsi sebagai kontrak teknis antara Product Owner dan tim pengembangan (AI Agent) untuk memastikan implementasi sesuai dengan business requirements yang telah disetujui.

Dokumen ini ditujukan untuk:

- **Product Owner** - sebagai referensi validasi bahwa implementasi sesuai kebutuhan bisnis.
- **AI Agent (Developer)** - sebagai panduan implementasi teknis yang presisi.
- **Quality Assurance** - sebagai dasar pembuatan test case dan acceptance criteria.
- **Stakeholder masa depan** - sebagai dokumentasi teknis untuk onboarding tim baru.

### 1.2 Ruang Lingkup

SRS ini mencakup seluruh kebutuhan untuk **Papyr MVP 0.1** yang saat ini live di mypapyr.com, meliputi:

- **6 tool PDF aktif**: Compress, Merge, Split, Image-to-PDF, PDF-to-Image, Rotate.
- **Infrastruktur pendukung**: Landing page, navigasi, analytics, cleanup otomatis, dan keamanan.
- **Arsitektur hybrid**: Operasi client-side (pdf-lib di browser) dan server-side (Ghostscript + PyMuPDF di FastAPI).
- **Integrasi penyimpanan**: Cloudflare R2 dengan signed URL dan auto-delete.

Fitur yang berada di luar scope MVP 0.1 (Protect PDF, Unlock PDF, Watermark, Sign PDF, PDF-to-Word, OCR, multi-language) **tidak** tercakup dalam dokumen ini dan akan didokumentasikan dalam revisi SRS berikutnya.

### 1.3 Definisi, Akronim, dan Singkatan

| **Istilah**       | **Definisi**                                                                                       |
|--------------------|-------------------------------------------------------------------------------------------------------|
| API                | Application Programming Interface - antarmuka komunikasi antar sistem                              |
| BRD                | Business Requirements Document - dokumen kebutuhan bisnis                                          |
| CORS               | Cross-Origin Resource Sharing - mekanisme keamanan browser untuk request lintas domain              |
| DnD                | Drag and Drop - interaksi seret dan lepas pada antarmuka pengguna                                  |
| DPI                | Dots Per Inch - satuan resolusi gambar                                                             |
| FastAPI            | Framework Python untuk membangun API berkinerja tinggi                                             |
| Ghostscript        | Engine open-source untuk pemrosesan dan kompresi PDF                                               |
| Magic Bytes        | Byte awal file yang mengidentifikasi format sebenarnya (file signature)                            |
| MIME Type          | Multipurpose Internet Mail Extensions - identifikasi tipe konten file                              |
| MVP                | Minimum Viable Product - versi produk minimal yang layak                                           |
| pdf-lib            | Library JavaScript untuk manipulasi PDF di browser                                                 |
| PyMuPDF (fitz)     | Library Python untuk rendering dan manipulasi PDF                                                  |
| R2                 | Cloudflare R2 - layanan object storage S3-compatible                                               |
| Signed URL         | URL dengan tanda tangan kriptografis yang memberikan akses sementara ke resource                   |
| SRS                | Software Requirements Specification - dokumen spesifikasi kebutuhan perangkat lunak                |
| TDD                | Technical Design Document - dokumen desain teknis                                                  |
| ADR                | Architecture Decision Record - catatan keputusan arsitektur                                        |
| UUID               | Universally Unique Identifier - pengenal unik universal                                            |
| ZIP                | Format arsip kompresi untuk menggabungkan beberapa file                                            |

### 1.4 Referensi

| **ID Dokumen** | **Judul**                                    | **Versi** | **Status** |
|----------------|----------------------------------------------|-----------|------------|
| PPR-BRD-001    | Business Requirements Document - Papyr       | 1.0       | Approved   |
| PPR-TDD-001    | Technical Design Document - Papyr            | 1.0       | Approved   |
| PPR-ADR-001    | Architecture Decision Records - Papyr        | 1.0       | Planned    |

---

## 2. Deskripsi Umum

### 2.1 Perspektif Produk

Papyr adalah web application mandiri (standalone) yang beroperasi sebagai layanan utilitas PDF berbasis browser. Produk ini bukan merupakan bagian dari sistem yang lebih besar, melainkan platform independen yang dapat diakses publik melalui mypapyr.com tanpa memerlukan autentikasi.

Arsitektur sistem terdiri dari tiga komponen utama:

```
+---------------------------+     REST API      +---------------------------+
|   Frontend (Vercel)       | -----------------> |   Backend (Railway)       |
|   Next.js 16 + pdf-lib    |                    |   FastAPI + Python 3.11   |
|   TypeScript + Tailwind   |                    |   Ghostscript + PyMuPDF   |
+---------------------------+                    +-------------+-------------+
                                                               |
                                                               v
                                                 +---------------------------+
                                                 |   Cloudflare R2           |
                                                 |   Object Storage          |
                                                 |   Signed URLs + Expiry    |
                                                 +---------------------------+
```

**Strategi pemrosesan hybrid:**

| Operasi        | Metode Pemrosesan                  | Engine            |
|----------------|------------------------------------|-------------------|
| Compress PDF   | Server-side (selalu)               | Ghostscript       |
| Merge PDF      | Client-side (selalu)               | pdf-lib           |
| Split PDF      | Client-side (selalu)               | pdf-lib           |
| Rotate PDF     | Client-side (selalu)               | pdf-lib           |
| Image to PDF   | Client (<3MB) / Server (>=3MB)     | pdf-lib / PyMuPDF |
| PDF to Image   | Server-side (selalu)               | PyMuPDF           |

### 2.2 Ringkasan Fungsi Produk

Papyr menyediakan enam fungsi utama pemrosesan PDF:

1. **Compress PDF** - Mengurangi ukuran file PDF dengan tiga level kualitas menggunakan Ghostscript.
2. **Merge PDF** - Menggabungkan beberapa file PDF menjadi satu dokumen dengan dukungan drag-and-drop reorder.
3. **Split PDF** - Memisahkan halaman tertentu dari PDF berdasarkan range yang ditentukan pengguna.
4. **Image to PDF** - Mengkonversi gambar (JPG, PNG, WEBP) menjadi file PDF dengan dukungan multi-gambar.
5. **PDF to Image** - Mengkonversi halaman PDF menjadi gambar PNG berkualitas tinggi (150 DPI).
6. **Rotate PDF** - Memutar halaman PDF secara individual atau keseluruhan (90 derajat, 180 derajat, 270 derajat).

Fungsi pendukung meliputi: landing page dengan tool grid, navigasi responsif, event analytics, cleanup otomatis file, dan sistem keamanan berlapis.

### 2.3 Karakteristik Pengguna

| **Persona**             | **Profil**                                                                                  | **Kemampuan Teknis** | **Perangkat Utama** |
|-------------------------|-----------------------------------------------------------------------------------------------|----------------------|---------------------|
| Mahasiswa (Rina)        | Mahasiswa 21 tahun di Surabaya, perlu compress PDF untuk upload tugas ke LMS                | Medium               | HP Android (Chrome) |
| Pekerja Kantoran (Andi) | Staff administrasi 28 tahun di Jakarta, perlu merge/split dokumen kontrak                   | Medium-High          | Laptop (Chrome/Edge)|
| Freelancer/UMKM (Dewi)  | Freelance designer 35 tahun, perlu convert gambar ke PDF dan compress katalog produk         | High                 | Laptop + HP         |

Semua persona mengharapkan: antarmuka Bahasa Indonesia, proses cepat (<1 menit), tanpa login, dan privasi terjaga.

### 2.4 Lingkungan Operasi

**Frontend:**

| Komponen       | Spesifikasi                                                    |
|----------------|----------------------------------------------------------------|
| Runtime        | Next.js 16 (TypeScript) di Vercel Edge Network                 |
| CSS Framework  | Tailwind CSS v4                                                |
| PDF Library    | pdf-lib (client-side merge, split, rotate, image-to-pdf)       |
| DnD Library    | @dnd-kit (drag-and-drop reorder)                               |
| Analytics      | Vercel Analytics + Speed Insights                              |
| Browser Target | Chrome 90+, Safari 15+, Firefox 90+, Edge 90+                 |

**Backend:**

| Komponen       | Spesifikasi                                                    |
|----------------|----------------------------------------------------------------|
| Runtime        | Python 3.11 di Railway (containerized)                         |
| Framework      | FastAPI 0.1.0                                                  |
| PDF Engine     | Ghostscript 10+ (kompresi), PyMuPDF/fitz (rendering, konversi) |
| Rate Limiter   | slowapi (berbasis IP)                                          |
| Storage Client | boto3 (S3-compatible untuk Cloudflare R2)                      |

**Infrastruktur:**

| Komponen       | Spesifikasi                                                    |
|----------------|----------------------------------------------------------------|
| Object Storage | Cloudflare R2 (10GB/bulan free tier, signed URLs)              |
| Domain         | mypapyr.com (Hostinger DNS)                                    |
| SSL/TLS        | TLS 1.3 via Vercel + Railway                                   |

### 2.5 Batasan dan Kendala

| **ID**  | **Batasan**                                                                                          |
|---------|------------------------------------------------------------------------------------------------------|
| CON-001 | Maksimum upload 20MB per file - limitasi infrastruktur free/low-cost.                                |
| CON-002 | MVP 0.1 hanya mendukung Bahasa Indonesia - English ditambahkan di MVP 0.2.                           |
| CON-003 | Tidak ada login/registrasi - semua akses anonim, rate limit berbasis IP.                             |
| CON-004 | Tidak ada batch processing - satu file per operasi (kecuali merge dan image-to-pdf).                 |
| CON-005 | Tidak ada offline mode - koneksi internet diperlukan untuk semua operasi.                            |
| CON-006 | Budget infrastruktur $0-5/bulan - self-funded, optimasi biaya adalah prioritas.                      |
| CON-007 | Solo developer + AI agent - kapasitas development terbatas.                                          |
| CON-008 | File retensi maksimum 60 menit di server - tidak ada penyimpanan permanen.                           |

---
## 3. Kebutuhan Fungsional

Setiap kebutuhan fungsional didokumentasikan dengan format standar berikut:

- **ID**: Identifier unik (FR-{MODULE}-{NNN})
- **Deskripsi**: Penjelasan kebutuhan
- **Input**: Data masukan yang diperlukan
- **Proses**: Langkah-langkah pemrosesan
- **Output**: Hasil yang diharapkan
- **Validasi**: Aturan validasi yang diterapkan
- **Error Handling**: Penanganan kesalahan

---

### 3.1 Compress PDF (FR-CMP)

**Referensi BRD:** REQ-CMP-001, REQ-CMP-002, REQ-CMP-003, REQ-CMP-004

---

#### FR-CMP-001: Upload File PDF untuk Kompresi

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CMP-001 |
| **Deskripsi**      | Pengguna dapat mengunggah satu file PDF untuk dikompresi melalui komponen PDFUploader. |
| **Input**          | File PDF (maks 20MB) melalui klik tombol upload atau drag-and-drop ke area upload. |
| **Proses**         | 1. Pengguna memilih file melalui file picker atau drag-and-drop. 2. Frontend menampilkan nama file dan ukuran. 3. Frontend mengirim file ke endpoint `POST /api/compress` via multipart/form-data. |
| **Output**         | File berhasil diunggah dan siap diproses. UI menampilkan progress indicator. |
| **Validasi**       | Lihat FR-CMP-002. |
| **Error Handling** | Jika file tidak valid, tampilkan pesan error dalam Bahasa Indonesia. Pengguna dapat memilih file lain. |

---

#### FR-CMP-002: Validasi File PDF (Server-Side Multi-Layer)

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CMP-002 |
| **Deskripsi**      | Server memvalidasi file PDF melalui 6 layer validasi sebelum pemrosesan. |
| **Input**          | File bytes yang diterima oleh endpoint `/api/compress`. |
| **Proses**         | Validasi dilakukan secara berurutan: 1. **Cek file kosong**: `len(file_bytes) == 0` maka tolak. 2. **Cek MIME type**: `file.content_type` harus `application/pdf`. 3. **Cek ekstensi**: Ekstensi file harus `.pdf`. 4. **Cek magic bytes**: 4 byte pertama harus `%PDF` (hex: `25 50 44 46`). 5. **Cek ukuran**: Tidak boleh melebihi 20MB (20,971,520 bytes). 6. **Cek password**: Buka file dengan PyMuPDF (`fitz.open`), periksa `doc.is_encrypted`. |
| **Output**         | File lolos validasi dan dilanjutkan ke proses kompresi, atau HTTP 400 dengan pesan error. |
| **Validasi**       | MIME type: `application/pdf`. Ekstensi: `.pdf`. Magic bytes: `%PDF-` (b"%PDF"). Ukuran: <= 20MB. Password: tidak terenkripsi. |
| **Error Handling** | HTTP 400 dengan detail spesifik per layer: "File kosong. Silakan upload file PDF yang valid.", "Tipe file tidak valid: {content_type}. Hanya file PDF yang diterima.", "Ekstensi file tidak valid: '{ext}'. Hanya file .pdf yang diterima.", "bukan file PDF yang valid. Konten file tidak sesuai format PDF.", "Ukuran file terlalu besar: {actual}MB. Maksimal {max}MB.", "PDF ini dilindungi kata sandi dan tidak dapat diproses." |

---

#### FR-CMP-003: Pemilihan Level Kualitas Kompresi

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CMP-003 |
| **Deskripsi**      | Pengguna dapat memilih level kualitas kompresi sebelum memproses file. |
| **Input**          | Parameter `quality` dengan nilai: `screen`, `ebook`, atau `printer`. |
| **Proses**         | 1. Frontend menampilkan 3 opsi kualitas kepada pengguna. 2. Parameter dikirim sebagai query parameter ke endpoint. 3. Server memvalidasi nilai dengan regex `^(screen\|ebook\|printer)$`. 4. Default: `ebook` jika tidak ditentukan. |
| **Output**         | Level kualitas terpilih diteruskan ke Ghostscript engine. |
| **Validasi**       | Nilai harus salah satu dari: `screen` (ukuran kecil, kualitas rendah), `ebook` (seimbang, default), `printer` (kualitas tinggi, ukuran lebih besar). |
| **Error Handling** | HTTP 422 (Validation Error) jika nilai quality tidak sesuai regex. |

---

#### FR-CMP-004: Proses Kompresi via Ghostscript

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CMP-004 |
| **Deskripsi**      | Server memproses kompresi PDF menggunakan Ghostscript engine berdasarkan level kualitas yang dipilih. |
| **Input**          | File PDF yang telah lolos validasi + parameter quality. |
| **Proses**         | 1. File ditulis ke temporary file (`tempfile.mkstemp(suffix=".pdf", prefix="papyr_in_")`). 2. Ghostscript dijalankan dengan preset kualitas yang dipilih via `compress_pdf(input_path, quality)`. 3. Output file dibaca dari path hasil kompresi. 4. Temporary files (input + output) dihapus di blok `finally`. |
| **Output**         | File PDF terkompresi dalam bentuk bytes, siap diupload ke R2. |
| **Validasi**       | Ghostscript harus menghasilkan file output yang valid. |
| **Error Handling** | HTTP 500 dengan pesan "Gagal memproses file. Silakan coba lagi." Structured log event `task_failed` dicatat dengan `error=type(exc).__name__`. |

---

#### FR-CMP-005: Upload Hasil ke R2 dan Generate Signed URL

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CMP-005 |
| **Deskripsi**      | Hasil kompresi diupload ke Cloudflare R2 dan signed URL digenerate untuk download. |
| **Input**          | Compressed PDF bytes, original filename. |
| **Proses**         | 1. Upload file ke R2 via `upload_file()` dengan UUID sebagai key (bukan nama asli). 2. Generate signed URL via `generate_signed_url()` dengan expiry 3600 detik (1 jam). 3. Signed URL dikonfigurasi untuk force download (bukan inline view) dengan `download_filename="compressed_{original_filename}"`. |
| **Output**         | Signed URL yang valid selama 1 jam untuk download file terkompresi. |
| **Validasi**       | URL harus mengandung signature kriptografis dan expiry timestamp. |
| **Error Handling** | Jika upload ke R2 gagal, HTTP 500 dikembalikan. |

---

#### FR-CMP-006: Tampilkan Hasil Kompresi dan Download

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CMP-006 |
| **Deskripsi**      | Sistem menampilkan hasil kompresi (persentase penghematan) dan menyediakan tombol download. |
| **Input**          | Response dari server: `{download_url, original_size, compressed_size, saved_percent}`. |
| **Proses**         | 1. Frontend menerima response JSON. 2. Menampilkan ukuran asli, ukuran terkompresi, dan persentase penghematan. 3. Menampilkan tombol "Unduh PDF" yang mengarah ke signed URL. 4. Menampilkan tombol "Kompres file lain" untuk reset. |
| **Output**         | UI menampilkan hasil kompresi dengan opsi download dan reset. |
| **Validasi**       | `saved_percent` dihitung: `round((1 - compressed_size / original_size) * 100)`. |
| **Error Handling** | Jika download gagal, pengguna dapat mencoba lagi selama signed URL masih valid (1 jam). |

---

### 3.2 Merge PDF (FR-MRG)

**Referensi BRD:** REQ-MRG-001, REQ-MRG-002, REQ-MRG-003, REQ-MRG-004

---

#### FR-MRG-001: Upload Multiple File PDF

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-MRG-001 |
| **Deskripsi**      | Pengguna dapat mengunggah beberapa file PDF untuk digabungkan. |
| **Input**          | Beberapa file PDF (maks 20MB per file) melalui file picker (multiple) atau drag-and-drop. |
| **Proses**         | 1. Pengguna memilih file melalui `<input type="file" accept=".pdf" multiple>` atau drag-and-drop. 2. Setiap file divalidasi secara individual. 3. File yang valid ditambahkan ke daftar dengan ID unik (`file-{counter}-{timestamp}`). 4. UI menampilkan daftar file dengan nama, ukuran, dan nomor urut. |
| **Output**         | Daftar file PDF yang siap digabungkan, ditampilkan dalam list yang dapat di-reorder. |
| **Validasi**       | Per file: MIME type harus `application/pdf` (`file.type !== "application/pdf"`), ukuran <= 20MB (`file.size > limits.maxUploadBytes`), file tidak kosong (`file.size === 0`). |
| **Error Handling** | File yang tidak valid ditolak dengan pesan spesifik: `"{name}" bukan file PDF.`, `"{name}" terlalu besar (maks 20MB).`, `"{name}" kosong.`. File valid tetap ditambahkan meskipun ada file yang ditolak. |

---

#### FR-MRG-002: Drag-and-Drop Reorder

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-MRG-002 |
| **Deskripsi**      | Pengguna dapat mengubah urutan file PDF melalui drag-and-drop sebelum merge. |
| **Input**          | Interaksi drag-and-drop pada daftar file. |
| **Proses**         | 1. Implementasi menggunakan @dnd-kit library (`DndContext`, `SortableContext`, `verticalListSortingStrategy`). 2. `PointerSensor` dengan `activationConstraint: { distance: 5 }` untuk mencegah drag tidak sengaja. 3. `KeyboardSensor` dengan `sortableKeyboardCoordinates` untuk aksesibilitas. 4. Pada `onDragEnd`, posisi file diperbarui menggunakan `arrayMove()`. |
| **Output**         | Urutan file diperbarui sesuai posisi baru. Nomor urut diperbarui secara otomatis. |
| **Validasi**       | Drag hanya aktif jika jarak pointer >= 5px. |
| **Error Handling** | Jika drag dibatalkan (drop di posisi yang sama), tidak ada perubahan. |

---

#### FR-MRG-003: Hapus File dari Daftar

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-MRG-003 |
| **Deskripsi**      | Pengguna dapat menghapus file individual dari daftar sebelum merge. |
| **Input**          | Klik tombol hapus (X) pada item file. |
| **Proses**         | 1. File dihapus dari state array berdasarkan ID unik. 2. Nomor urut file lain diperbarui otomatis. |
| **Output**         | File dihapus dari daftar. Total file dan ukuran diperbarui. |
| **Validasi**       | Tidak ada validasi khusus. |
| **Error Handling** | Tidak ada error yang mungkin terjadi. |

---

#### FR-MRG-004: Proses Merge Client-Side

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-MRG-004 |
| **Deskripsi**      | Sistem menggabungkan semua file PDF menjadi satu dokumen secara client-side menggunakan pdf-lib. |
| **Input**          | Array file PDF (minimal 2 file) dalam urutan yang ditentukan pengguna. |
| **Proses**         | 1. Validasi minimal 2 file (`files.length < 2` maka return). 2. Panggil `mergePDFs(files)` dari `pdfUtils.ts`. 3. Buat `PDFDocument` baru. 4. Untuk setiap file: baca `arrayBuffer`, load dengan `PDFDocument.load(buffer, { ignoreEncryption: true })`, copy semua halaman via `copyPages()`, tambahkan ke dokumen baru. 5. Simpan sebagai `Uint8Array` via `doc.save()`. 6. Proses berjalan sepenuhnya di browser - file tidak dikirim ke server. |
| **Output**         | `Uint8Array` berisi PDF gabungan. |
| **Validasi**       | Minimal 2 file PDF. Setiap file harus dapat dibaca oleh pdf-lib. |
| **Error Handling** | Jika file rusak atau terenkripsi: `Gagal membaca "{name}". File mungkin rusak atau terenkripsi.` Jika error lain: "Gagal menggabungkan PDF. Silakan coba lagi." Analytics event `task_failed` dikirim dengan reason `server_error`. |

---

#### FR-MRG-005: Download Hasil Merge

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-MRG-005 |
| **Deskripsi**      | Pengguna dapat mengunduh file PDF hasil penggabungan. |
| **Input**          | `Uint8Array` hasil merge. |
| **Proses**         | 1. Buat `Blob` dari `Uint8Array` dengan type `application/pdf`. 2. Generate object URL via `URL.createObjectURL()`. 3. Buat elemen `<a>` dengan `download="merged.pdf"`. 4. Trigger click untuk memulai download. 5. Cleanup: hapus elemen dan revoke object URL setelah 100ms. |
| **Output**         | File `merged.pdf` terunduh ke perangkat pengguna. |
| **Validasi**       | Data merge harus tersedia (`mergedData !== null`). |
| **Error Handling** | Tidak ada error handling khusus - browser menangani download. |

---

### 3.3 Split PDF (FR-SPL)

**Referensi BRD:** REQ-SPL-001, REQ-SPL-002, REQ-SPL-003, REQ-SPL-004

---

#### FR-SPL-001: Upload File PDF untuk Split

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SPL-001 |
| **Deskripsi**      | Pengguna dapat mengunggah satu file PDF untuk dipisahkan halamannya. |
| **Input**          | Satu file PDF (maks 20MB) melalui file picker atau drag-and-drop. |
| **Proses**         | 1. Pengguna memilih file melalui `<input type="file" accept=".pdf">` atau drag-and-drop. 2. Validasi client-side: MIME type, ukuran, file tidak kosong. 3. Jika valid, state berubah ke `loading`. 4. Panggil `getPDFPageCount(file)` untuk membaca jumlah halaman. 5. State berubah ke `ready` dengan informasi total halaman. |
| **Output**         | File berhasil dimuat. UI menampilkan nama file, ukuran, jumlah halaman, dan input page range. |
| **Validasi**       | MIME type: `application/pdf`. Ukuran: <= 20MB. File tidak kosong. |
| **Error Handling** | `"{name}" bukan file PDF.`, `"{name}" terlalu besar (maks 20MB).`, `"{name}" kosong.`, "Gagal membaca file PDF." (jika pdf-lib gagal load), "File tidak dapat dibaca. Pastikan PDF tidak terlindungi kata sandi." |

---

#### FR-SPL-002: Input Page Range

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SPL-002 |
| **Deskripsi**      | Pengguna dapat menentukan halaman yang ingin dipisahkan menggunakan format range. |
| **Input**          | String range halaman, contoh: "1-3, 5, 7-10". |
| **Proses**         | 1. Komponen `PageRangeInput` menerima `totalPages` sebagai prop. 2. Pengguna mengetik range dalam format: angka tunggal (e.g., "5"), range (e.g., "1-3"), atau kombinasi dengan koma (e.g., "1-3, 5, 7-10"). 3. Input di-parse menjadi array halaman 1-indexed. 4. Callback `onChange(pages: number[], raw: string)` dipanggil setiap perubahan. |
| **Output**         | Array halaman yang dipilih (1-indexed) dan string raw input. |
| **Validasi**       | Halaman harus dalam range 1 sampai totalPages. Format harus valid (angka, dash, koma). Jika raw tidak kosong tapi pages kosong, dianggap error. |
| **Error Handling** | `rangeError` state diset `true` jika input tidak valid. Tombol split di-disable jika ada error. |

---

#### FR-SPL-003: Proses Split Client-Side

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SPL-003 |
| **Deskripsi**      | Sistem memisahkan halaman PDF yang dipilih menjadi dokumen baru secara client-side. |
| **Input**          | File PDF asli + array halaman yang dipilih (1-indexed). |
| **Proses**         | 1. Panggil `splitPDF(file, selectedPages)` dari `pdfUtils.ts`. 2. Load source PDF dengan `PDFDocument.load(buffer, { ignoreEncryption: true })`. 3. Validasi setiap halaman: `p < 1 \|\| p > totalPages` maka error. 4. Convert ke 0-indexed: `indices = pages.map(p => p - 1)`. 5. Buat dokumen baru, copy halaman terpilih via `copyPages(source, indices)`. 6. Simpan sebagai `Uint8Array`. |
| **Output**         | `Uint8Array` berisi PDF dengan halaman terpilih saja. |
| **Validasi**       | Minimal 1 halaman dipilih. Semua halaman harus dalam range valid. |
| **Error Handling** | `Pilih minimal 1 halaman untuk dipisahkan.`, `Gagal membaca "{name}". File mungkin rusak atau terenkripsi.`, `Halaman {p} melebihi total halaman dokumen ({total}).` |

---

#### FR-SPL-004: Download Hasil Split

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SPL-004 |
| **Deskripsi**      | Pengguna dapat mengunduh file PDF hasil split. |
| **Input**          | `Uint8Array` hasil split + range string. |
| **Proses**         | 1. Generate filename dari range: `split_{range_cleaned}.pdf` (spasi dihapus, koma diganti underscore). 2. Fallback filename: `split_pages.pdf`. 3. Download via `downloadPDF()`. |
| **Output**         | File PDF terunduh dengan nama yang mencerminkan halaman yang dipilih. |
| **Validasi**       | Data split harus tersedia. |
| **Error Handling** | Tidak ada error handling khusus. |

---

### 3.4 Image to PDF (FR-I2P)

**Referensi BRD:** REQ-IMG-001, REQ-IMG-002, REQ-IMG-003, REQ-IMG-004

---

#### FR-I2P-001: Upload Multiple Gambar

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-I2P-001 |
| **Deskripsi**      | Pengguna dapat mengunggah beberapa file gambar (JPG, PNG, WEBP) untuk dikonversi ke PDF. |
| **Input**          | Beberapa file gambar melalui file picker (multiple) atau drag-and-drop. Accept: `image/jpeg,image/png,image/webp`. |
| **Proses**         | 1. Pengguna memilih gambar melalui file picker atau drag-and-drop. 2. Setiap gambar divalidasi (lihat FR-I2P-002). 3. Gambar yang valid ditambahkan ke grid dengan preview thumbnail via `URL.createObjectURL()`. 4. UI menampilkan grid gambar dengan nomor urut, nama file, dan ukuran. |
| **Output**         | Grid gambar yang siap dikonversi, dengan preview thumbnail dan opsi reorder. |
| **Validasi**       | Lihat FR-I2P-002. |
| **Error Handling** | Gambar yang tidak valid ditolak dengan pesan spesifik. Gambar valid tetap ditambahkan. |

---

#### FR-I2P-002: Validasi Gambar Multi-Layer (Client-Side)

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-I2P-002 |
| **Deskripsi**      | Frontend memvalidasi setiap gambar melalui 3 layer validasi: MIME type, ekstensi, dan magic bytes. |
| **Input**          | File gambar yang diunggah pengguna. |
| **Proses**         | Validasi berurutan: 1. **Cek MIME type**: `file.type` harus `image/jpeg`, `image/png`, atau `image/webp`. 2. **Cek ekstensi** (fallback jika MIME tidak cocok): `.jpg`, `.jpeg`, `.png`, `.webp`. 3. **Cek ukuran**: `file.size <= limits.maxUploadBytes` (20MB). 4. **Cek file kosong**: `file.size === 0`. 5. **Cek magic bytes**: Baca 12 byte pertama via `readFileHeader(file, 12)`. JPEG: `FF D8 FF` (3 bytes). PNG: `89 50 4E 47 0D 0A 1A 0A` (8 bytes). WebP: bytes 0-3 = `52 49 46 46` (RIFF) DAN bytes 8-11 = `57 45 42 50` (WEBP). |
| **Output**         | File lolos validasi atau ditolak dengan pesan error. |
| **Validasi**       | Triple validation: MIME type + ekstensi + magic bytes. |
| **Error Handling** | Pesan per jenis error: format tidak didukung, terlalu besar, kosong, bukan gambar valid, tidak bisa dibaca. |

---

#### FR-I2P-003: Drag-and-Drop Reorder Gambar

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-I2P-003 |
| **Deskripsi**      | Pengguna dapat mengubah urutan gambar melalui drag-and-drop sebelum konversi. |
| **Input**          | Interaksi drag-and-drop pada grid gambar. |
| **Proses**         | 1. Implementasi menggunakan @dnd-kit (`DndContext`, `SortableContext`, `rectSortingStrategy`). 2. Grid layout: 2 kolom (mobile) / 3 kolom (desktop). 3. Setiap item menampilkan: thumbnail, nomor urut, nama file, ukuran, tombol hapus, dan drag handle. |
| **Output**         | Urutan gambar diperbarui. Nomor urut diperbarui otomatis. |
| **Validasi**       | Drag handle terpisah dari area klik umum. |
| **Error Handling** | Tidak ada error yang mungkin terjadi. |

---

#### FR-I2P-004: Konversi Client-Side (Total Size < 3MB)

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-I2P-004 |
| **Deskripsi**      | Jika total ukuran semua gambar kurang dari 3MB, konversi dilakukan di browser menggunakan pdf-lib. |
| **Input**          | Array file gambar dengan total size < 3MB (`CLIENT_THRESHOLD_BYTES = 3 * 1024 * 1024`). |
| **Proses**         | 1. Cek `totalSize <= CLIENT_THRESHOLD_BYTES` (3,145,728 bytes). 2. Panggil `imagesToPDF(files)` dari `pdfUtils.ts`. 3. Buat `PDFDocument` baru. 4. Untuk setiap gambar: JPG via `doc.embedJpg(bytes)`, PNG via `doc.embedPng(bytes)`, WebP dikonversi ke PNG via `OffscreenCanvas` lalu `doc.embedPng(pngBytes)`. 5. Buat halaman dengan dimensi sesuai gambar: `doc.addPage([width, height])`. 6. Gambar di-draw: `page.drawImage(image, { x: 0, y: 0, width, height })`. |
| **Output**         | `Uint8Array` berisi PDF dengan setiap gambar sebagai satu halaman. |
| **Validasi**       | Minimal 1 gambar. Total size < 3MB. |
| **Error Handling** | Error jika format tidak didukung atau file rusak. |

---

#### FR-I2P-005: Konversi Server-Side Fallback (Total Size >= 3MB)

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-I2P-005 |
| **Deskripsi**      | Jika total ukuran gambar >= 3MB, konversi dilakukan di server menggunakan PyMuPDF. |
| **Input**          | Array file gambar dikirim sebagai multipart/form-data ke `POST /api/image-to-pdf`. |
| **Proses**         | 1. Frontend mengirim semua file via `FormData` dengan key `files`. 2. Server memvalidasi setiap gambar (FR-I2P-006). 3. PyMuPDF membuat PDF: setiap gambar disimpan ke temp file, dimensi dibaca, halaman dibuat sesuai ukuran gambar, gambar di-insert. 4. PDF disimpan ke temp file, diupload ke R2, signed URL digenerate (expiry 3600s). 5. Temp files dihapus di blok `finally`. |
| **Output**         | Response JSON: `{download_url, image_count, pdf_size}`. |
| **Validasi**       | Lihat FR-I2P-006. |
| **Error Handling** | HTTP 400 untuk validasi error, HTTP 500: "Gagal memproses file. Silakan coba lagi." |

---

#### FR-I2P-006: Validasi Gambar Server-Side

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-I2P-006 |
| **Deskripsi**      | Server memvalidasi setiap file gambar melalui 5 layer validasi. |
| **Input**          | File bytes dari setiap gambar yang diunggah. |
| **Proses**         | 1. **Cek file kosong**: `len(file_bytes) == 0`. 2. **Cek MIME type**: harus `image/jpeg`, `image/png`, atau `image/webp`. 3. **Cek ekstensi**: harus `.jpg`, `.jpeg`, `.png`, atau `.webp`. 4. **Cek magic bytes**: JPEG `FF D8 FF`, PNG `89504E470D0A1A0A`, WebP `RIFF` + `WEBP`. 5. **Cek ukuran**: <= 20MB. |
| **Output**         | File lolos validasi atau HTTP 400. |
| **Validasi**       | 5-layer: kosong + MIME + ekstensi + magic bytes + ukuran. |
| **Error Handling** | HTTP 400 dengan pesan spesifik per layer validasi dalam Bahasa Indonesia. |

---

#### FR-I2P-007: Download Hasil Konversi

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-I2P-007 |
| **Deskripsi**      | Pengguna dapat mengunduh file PDF hasil konversi. |
| **Input**          | `Uint8Array` (client-side) atau signed URL (server-side). |
| **Proses**         | Jika client-side: download via `downloadPDF(resultData, "images.pdf")`. Jika server-side: `window.open(resultUrl, "_blank")` untuk membuka signed URL. |
| **Output**         | File `images.pdf` terunduh ke perangkat pengguna. |
| **Validasi**       | Salah satu dari `resultData` atau `resultUrl` harus tersedia. |
| **Error Handling** | Tidak ada error handling khusus. |

---

### 3.5 PDF to Image (FR-P2I)

**Referensi BRD:** REQ-P2I-001, REQ-P2I-002, REQ-P2I-003, REQ-P2I-004

---

#### FR-P2I-001: Upload File PDF untuk Konversi ke Gambar

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-P2I-001 |
| **Deskripsi**      | Pengguna dapat mengunggah satu file PDF untuk dikonversi menjadi gambar PNG. |
| **Input**          | Satu file PDF (maks 20MB) melalui file picker atau drag-and-drop. |
| **Proses**         | 1. Pengguna memilih file. 2. Validasi client-side: MIME type `application/pdf`, ukuran <= 20MB, file tidak kosong. 3. Panggil `getPDFPageCount(file)` untuk membaca jumlah halaman. 4. State berubah ke `ready` dengan informasi total halaman. |
| **Output**         | File berhasil dimuat. UI menampilkan nama file, ukuran, jumlah halaman, dan input page range. |
| **Validasi**       | MIME type: `application/pdf`. Ukuran: <= 20MB. File tidak kosong. |
| **Error Handling** | Pesan error dalam Bahasa Indonesia sesuai jenis validasi yang gagal. |

---

#### FR-P2I-002: Pemilihan Halaman untuk Konversi

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-P2I-002 |
| **Deskripsi**      | Pengguna dapat memilih halaman spesifik yang ingin dikonversi ke gambar. |
| **Input**          | String range halaman via komponen `PageRangeInput`, contoh: "1-3, 5". |
| **Proses**         | 1. Komponen `PageRangeInput` menerima `totalPages`. 2. Input di-parse menjadi array halaman. 3. Halaman yang dipilih dikirim ke server sebagai parameter `pages` dalam FormData. |
| **Output**         | Array halaman terpilih dan string raw untuk dikirim ke server. |
| **Validasi**       | Halaman harus dalam range 1 sampai totalPages. Minimal 1 halaman dipilih. |
| **Error Handling** | Tombol konversi di-disable jika input tidak valid. |

---

#### FR-P2I-003: Proses Konversi Server-Side via PyMuPDF

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-P2I-003 |
| **Deskripsi**      | Server mengkonversi halaman PDF yang dipilih menjadi gambar PNG menggunakan PyMuPDF dengan resolusi 150 DPI. |
| **Input**          | File PDF + parameter `pages` (string range) via `POST /api/pdf-to-image` (multipart/form-data + form field). |
| **Proses**         | 1. Server memvalidasi PDF (6 layer: kosong, MIME, ekstensi, magic bytes `%PDF-`, ukuran, password). 2. Buka PDF dengan PyMuPDF, dapatkan total halaman. 3. Parse page range via `parse_page_range(pages, total_pages)`. 4. Rasterisasi halaman terpilih via `rasterize_pages(input_path, page_list)` dengan resolusi 150 DPI. 5. Package output via `package_output()`: 1 halaman menjadi file PNG tunggal, >1 halaman menjadi file ZIP. 6. Upload ke R2, generate signed URL (expiry 3600s). 7. Cleanup semua temp files di blok `finally`. |
| **Output**         | Response JSON: `{download_url, file_type: "png" atau "zip", page_count}`. |
| **Validasi**       | PDF harus valid (6 layer). Halaman harus dalam range. PDF tidak boleh 0 halaman. |
| **Error Handling** | HTTP 400: validasi error. HTTP 500: "Gagal memproses file. Silakan coba lagi." Structured log: `task_failed` event. |

---

#### FR-P2I-004: Download Hasil Konversi (PNG atau ZIP)

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-P2I-004 |
| **Deskripsi**      | Pengguna dapat mengunduh hasil konversi sebagai PNG (1 halaman) atau ZIP (multi-halaman). |
| **Input**          | `result.download_url` dan `result.file_type` dari response server. |
| **Proses**         | 1. UI menampilkan tombol download dengan label dinamis: "Unduh Gambar" (PNG) atau "Unduh ZIP" (ZIP). 2. Tombol berupa `<a href={download_url} download>` untuk trigger download langsung. |
| **Output**         | File PNG atau ZIP terunduh ke perangkat pengguna. |
| **Validasi**       | `result` harus tersedia dan `download_url` harus valid. |
| **Error Handling** | Jika signed URL expired (>1 jam), download akan gagal. Pengguna perlu mengulang proses. |

---

### 3.6 Rotate PDF (FR-ROT)

**Referensi BRD:** REQ-ROT-001, REQ-ROT-002, REQ-ROT-003

---

#### FR-ROT-001: Upload File PDF untuk Rotasi

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ROT-001 |
| **Deskripsi**      | Pengguna dapat mengunggah satu file PDF untuk memutar halamannya. |
| **Input**          | Satu file PDF (maks 20MB) melalui file picker atau drag-and-drop. |
| **Proses**         | 1. Pengguna memilih file. 2. Validasi: MIME type `application/pdf`, ukuran <= 20MB, file tidak kosong. 3. Panggil `getPDFPageCount(file)` untuk membaca jumlah halaman. 4. Inisialisasi rotation map: semua halaman diset ke 0 derajat. 5. State berubah ke `ready`. |
| **Output**         | File berhasil dimuat. UI menampilkan grid halaman dengan kontrol rotasi. |
| **Validasi**       | MIME type: `application/pdf`. Ukuran: <= 20MB. File tidak kosong. |
| **Error Handling** | Pesan error spesifik: "File bukan PDF", "Ukuran file melebihi batas 20MB", "File kosong", "Gagal membaca file PDF". Analytics: `task_failed` dengan reason (`invalid_file`, `file_too_large`, `empty_file`, `read_error`). |

---

#### FR-ROT-002: Rotasi Per-Halaman

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ROT-002 |
| **Deskripsi**      | Pengguna dapat memutar halaman individual dengan mengklik pada grid halaman. |
| **Input**          | Klik pada card halaman di grid (3 kolom mobile / 4 kolom desktop). |
| **Proses**         | 1. Setiap klik menambahkan 90 derajat: `(current + 90) % 360`. 2. Grid menampilkan: ikon file yang dirotasi (CSS `transform: rotate({deg}deg)`), nomor halaman, label derajat jika != 0. 3. Halaman yang dirotasi ditandai dengan border dan background accent. |
| **Output**         | Rotation map diperbarui. Visual preview menunjukkan rotasi. |
| **Validasi**       | Derajat dinormalisasi ke 0, 90, 180, atau 270 via `((deg % 360) + 360) % 360`. |
| **Error Handling** | Tidak ada error yang mungkin terjadi. |

---

#### FR-ROT-003: Rotasi Semua Halaman Sekaligus

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ROT-003 |
| **Deskripsi**      | Pengguna dapat memutar semua halaman sekaligus dengan satu klik. |
| **Input**          | Klik tombol "Putar Semua 90", "Putar Semua 180", atau "Putar Semua 270". |
| **Proses**         | Untuk setiap halaman dalam rotation map: `(currentDeg + selectedDeg) % 360`. Semua halaman diperbarui secara bersamaan. |
| **Output**         | Semua halaman dirotasi. Grid diperbarui. |
| **Validasi**       | Derajat harus 90, 180, atau 270. |
| **Error Handling** | Tidak ada error yang mungkin terjadi. |

---

#### FR-ROT-004: Proses Rotasi Client-Side

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ROT-004 |
| **Deskripsi**      | Sistem memutar halaman PDF sesuai rotation map secara client-side menggunakan pdf-lib. |
| **Input**          | File PDF asli + rotation map (`Map<pageNumber, degrees>`). |
| **Proses**         | 1. Filter rotation map: hanya halaman dengan derajat != 0. 2. Panggil `rotatePDF(file, map)` dari `pdfUtils.ts`. 3. Load PDF dengan `PDFDocument.load(buffer, { ignoreEncryption: true })`. 4. Untuk setiap halaman: dapatkan rotasi saat ini via `page.getRotation().angle`, hitung rotasi baru: `normalizeDegree(current + addDegree)`, set via `page.setRotation(degrees(newAngle))`. 5. Simpan sebagai `Uint8Array`. |
| **Output**         | `Uint8Array` berisi PDF dengan halaman yang sudah dirotasi. |
| **Validasi**       | Minimal 1 halaman harus memiliki rotasi != 0. Halaman harus dalam range 1 sampai total halaman. |
| **Error Handling** | "Pilih minimal 1 halaman untuk diputar.", "Gagal membaca file. File mungkin rusak atau terenkripsi.", "Halaman {p} melebihi total halaman dokumen ({total})." |

---

#### FR-ROT-005: Download Hasil Rotasi

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ROT-005 |
| **Deskripsi**      | Pengguna dapat mengunduh file PDF hasil rotasi. |
| **Input**          | `Uint8Array` hasil rotasi + nama file asli. |
| **Proses**         | Download via `downloadPDF(resultData, "rotated_{originalFilename}")`. |
| **Output**         | File PDF terunduh dengan prefix `rotated_`. |
| **Validasi**       | Data rotasi dan file asli harus tersedia. |
| **Error Handling** | Tidak ada error handling khusus. |

---

### 3.7 Landing Page (FR-LND)

**Referensi BRD:** REQ-UX-001, REQ-UX-002, REQ-UX-003, REQ-UX-004, REQ-UX-005

---

#### FR-LND-001: Hero Section

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-LND-001 |
| **Deskripsi**      | Landing page menampilkan hero section dengan tagline dan value proposition dalam Bahasa Indonesia. |
| **Input**          | Tidak ada (static content). |
| **Proses**         | Render hero section dengan tagline, deskripsi fitur utama, dan visual mobile-friendly. |
| **Output**         | Hero section yang informatif dan menarik perhatian pengguna baru. |
| **Validasi**       | Konten harus dalam Bahasa Indonesia. Responsif di semua ukuran layar. |
| **Error Handling** | Tidak ada (static content). |

---

#### FR-LND-002: Tool Grid

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-LND-002 |
| **Deskripsi**      | Landing page menampilkan grid 6 tool yang tersedia dengan ikon dan deskripsi singkat. |
| **Input**          | Tidak ada (static content). |
| **Proses**         | Render grid 6 tool (Compress, Merge, Split, Image-to-PDF, PDF-to-Image, Rotate). Setiap card: ikon, nama tool, deskripsi Bahasa Indonesia. Klik mengarahkan ke halaman tool. |
| **Output**         | Grid tool responsif (1 kolom mobile, 2-3 kolom desktop). |
| **Validasi**       | Semua 6 tool harus ditampilkan. Link harus valid. |
| **Error Handling** | Tidak ada (static content). |

---

#### FR-LND-003: Privacy Notice pada Setiap Tool

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-LND-003 |
| **Deskripsi**      | Setiap halaman tool menampilkan privacy notice tentang model pemrosesan dan kebijakan penghapusan file. |
| **Input**          | Parameter model: "client", "server", atau "hybrid". |
| **Proses**         | Komponen PrivacyNotice menampilkan pesan sesuai model pemrosesan. Client: file tidak dikirim ke server. Server: auto-hapus 1 jam. Hybrid: tergantung ukuran file. |
| **Output**         | Badge/notice yang selalu terlihat di halaman tool. |
| **Validasi**       | Notice harus selalu ditampilkan (always visible). |
| **Error Handling** | Tidak ada (static content). |

---

### 3.8 Navigation (FR-NAV)

**Referensi BRD:** REQ-UX-003

---

#### FR-NAV-001: Navbar Responsif

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-NAV-001 |
| **Deskripsi**      | Aplikasi memiliki navbar sticky yang responsif dengan navigasi ke semua tool. |
| **Input**          | Tidak ada (static component). |
| **Proses**         | Navbar sticky di atas halaman. Desktop: link horizontal ke semua tool. Mobile: hamburger menu yang expand ke menu vertikal. Logo/brand "Papyr" mengarah ke homepage. |
| **Output**         | Navbar yang konsisten di semua halaman dan responsif. |
| **Validasi**       | Harus sticky (tetap terlihat saat scroll). Harus responsif. |
| **Error Handling** | Tidak ada. |

---

#### FR-NAV-002: Footer

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-NAV-002 |
| **Deskripsi**      | Aplikasi memiliki footer dengan link penting dan informasi legal. |
| **Input**          | Tidak ada (static component). |
| **Proses**         | Footer menampilkan: link ke Privacy Policy, link ke FAQ, copyright notice, informasi brand. |
| **Output**         | Footer yang konsisten di semua halaman. |
| **Validasi**       | Harus ada di semua halaman. Link harus valid. |
| **Error Handling** | Tidak ada. |

---

#### FR-NAV-003: Cross-Link Other Tools

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-NAV-003 |
| **Deskripsi**      | Setiap halaman tool menampilkan link ke tool lain untuk meningkatkan discoverability. |
| **Input**          | Parameter currentTool (path tool saat ini, e.g., "/compress"). |
| **Proses**         | Komponen OtherTools menampilkan grid link ke tool lain (exclude tool saat ini). |
| **Output**         | Section "Tool Lainnya" dengan link ke 5 tool lain. |
| **Validasi**       | Tool saat ini tidak boleh muncul di daftar. |
| **Error Handling** | Tidak ada. |

---

### 3.9 Analytics (FR-ANA)

**Referensi BRD:** REQ-ANL-001, REQ-ANL-002, REQ-ANL-003, REQ-ANL-004

---

#### FR-ANA-001: Track Task Started

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ANA-001 |
| **Deskripsi**      | Sistem melacak event saat pengguna memulai operasi PDF. |
| **Input**          | Nama tool (e.g., "compress", "merge", "split", "image-to-pdf", "pdf-to-image", "rotate"). |
| **Proses**         | Panggil ``trackTaskStarted(toolName)`` dari ``analytics.ts`` saat tombol proses diklik. Event dikirim ke Vercel Analytics. |
| **Output**         | Event ``task_started`` tercatat dengan metadata tool name. |
| **Validasi**       | Event harus dikirim sebelum proses dimulai. |
| **Error Handling** | Jika analytics gagal, tidak mempengaruhi operasi utama (fire-and-forget). |

---

#### FR-ANA-002: Track Task Completed

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ANA-002 |
| **Deskripsi**      | Sistem melacak event saat operasi PDF berhasil diselesaikan. |
| **Input**          | Nama tool. |
| **Proses**         | Panggil ``trackTaskCompleted(toolName)`` setelah proses berhasil. |
| **Output**         | Event ``task_completed`` tercatat. |
| **Validasi**       | Hanya dikirim jika proses benar-benar berhasil. |
| **Error Handling** | Fire-and-forget. |

---

#### FR-ANA-003: Track Task Failed

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ANA-003 |
| **Deskripsi**      | Sistem melacak event saat operasi PDF gagal. |
| **Input**          | Nama tool + reason (e.g., "server_error", "invalid_file", "file_too_large"). |
| **Proses**         | Panggil ``trackTaskFailed(toolName, reason)`` saat error terjadi. |
| **Output**         | Event ``task_failed`` tercatat dengan reason. |
| **Validasi**       | Reason harus deskriptif. |
| **Error Handling** | Fire-and-forget. |

---

#### FR-ANA-004: Server-Side Structured Logging

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-ANA-004 |
| **Deskripsi**      | Backend mencatat structured log untuk setiap operasi (berhasil/gagal). |
| **Input**          | Event type, tool name, duration_ms, input_size_bytes, success flag, metadata tambahan. |
| **Proses**         | Panggil ``log_task_event()`` dengan parameter: event ("task_completed"/"task_failed"), tool, duration_ms, input_size_bytes, success, dan metadata spesifik per tool (saved_percent, image_count, page_count, output_type, error). |
| **Output**         | Structured log entry yang dapat di-query. |
| **Validasi**       | Semua field wajib harus terisi. |
| **Error Handling** | Logging tidak boleh mengganggu response ke client. |

---

### 3.10 Cleanup dan Retensi (FR-CLN)

**Referensi BRD:** BR-003, BR-004

---

#### FR-CLN-001: Auto-Delete File 60 Menit (R2 Lifecycle)

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CLN-001 |
| **Deskripsi**      | Cron job berjalan setiap 30 menit untuk menghapus object yang berusia > 60 menit. R2 lifecycle rule dikonfigurasi sebagai safety net dengan minimum 1 hari (minimum yang didukung R2); enforcement 60 menit dijalankan oleh cron. |
| **Input**          | File yang diupload ke Cloudflare R2 bucket. |
| **Proses**         | Cron job menghapus object berusia > 60 menit sebagai mekanisme utama. R2 lifecycle rule diset minimum 1 hari (24 jam) sebagai fallback jika cron terlewat; cron berjalan setiap 30 menit. |
| **Output**         | File terhapus dari R2 setelah cleanup cron; lifecycle 1 hari bertindak sebagai fallback. |
| **Validasi**       | Lifecycle rule harus aktif dan dikonfigurasi dengan benar. |
| **Error Handling** | Jika lifecycle gagal, cron fallback (FR-CLN-002) akan menangani. |

---

#### FR-CLN-002: Cron Cleanup Fallback (30 Menit)

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CLN-002 |
| **Deskripsi**      | Background task menjalankan cleanup setiap 30 menit sebagai safety net untuk file yang terlewat lifecycle 1 hari. |
| **Input**          | Timer interval: ``CLEANUP_INTERVAL_SECONDS`` (1800 detik = 30 menit). |
| **Proses**         | 1. Background async loop berjalan di FastAPI lifespan. 2. Setiap 30 menit, panggil ``cleanup_expired_files()`` di thread pool (``run_in_executor``). 3. Fungsi memeriksa semua file di R2 dan menghapus yang berusia > 60 menit. 4. Task dimulai saat app startup dan dibatalkan saat shutdown. |
| **Output**         | File expired terhapus. Log event ``cleanup_success`` atau ``cleanup_failure``. |
| **Validasi**       | Interval harus 30 menit. Threshold harus 60 menit. |
| **Error Handling** | Error di-log tapi tidak menghentikan loop: ``logger.error("Cleanup loop error: %s", str(e))``. |

---

#### FR-CLN-003: UUID Filename untuk Privasi

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-CLN-003 |
| **Deskripsi**      | Semua file disimpan di R2 dengan UUID sebagai nama file, bukan nama asli. |
| **Input**          | File yang akan diupload ke R2. |
| **Proses**         | Fungsi ``upload_file()`` menggenerate UUID sebagai key untuk R2 object. Nama asli file tidak pernah disimpan di server. |
| **Output**         | File tersimpan dengan key UUID (e.g., ``a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf``). |
| **Validasi**       | Key harus UUID v4 yang valid. |
| **Error Handling** | Tidak ada error khusus. |

---

### 3.11 Security (FR-SEC)

**Referensi BRD:** BR-002, BR-005, BR-006, BR-008, BR-009

---

#### FR-SEC-001: Validasi MIME Type

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SEC-001 |
| **Deskripsi**      | Setiap file yang diunggah divalidasi MIME type-nya sebelum diproses. |
| **Input**          | ``file.content_type`` dari upload request. |
| **Proses**         | Cek apakah content_type ada dalam set yang diizinkan: PDF: ``{"application/pdf"}``. Image: ``{"image/jpeg", "image/png", "image/webp"}``. |
| **Output**         | File diterima atau ditolak. |
| **Validasi**       | MIME type harus exact match. |
| **Error Handling** | HTTP 400 dengan pesan tipe file tidak valid. |

---

#### FR-SEC-002: Validasi Magic Bytes

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SEC-002 |
| **Deskripsi**      | Setiap file divalidasi magic bytes-nya untuk memastikan konten sesuai format yang diklaim. |
| **Input**          | Byte awal file (4-12 bytes pertama). |
| **Proses**         | Validasi signature: PDF: bytes 0-3 = ``%PDF`` (``25 50 44 46``). JPEG: bytes 0-2 = ``FF D8 FF``. PNG: bytes 0-7 = ``89 50 4E 47 0D 0A 1A 0A``. WebP: bytes 0-3 = ``52 49 46 46`` (RIFF) DAN bytes 8-11 = ``57 45 42 50`` (WEBP). |
| **Output**         | File diterima atau ditolak. |
| **Validasi**       | Magic bytes harus cocok dengan format yang diklaim. |
| **Error Handling** | HTTP 400: "bukan file {format} yang valid. Konten file tidak sesuai format." |

---

#### FR-SEC-003: Rate Limiting

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SEC-003 |
| **Deskripsi**      | Sistem membatasi jumlah request per IP address untuk mencegah abuse. |
| **Input**          | IP address dari request (via ``get_remote_address``). |
| **Proses**         | slowapi limiter dikonfigurasi: ``{settings.rate_limit_per_minute}/minute`` (default: 10 req/min/IP). Diterapkan pada semua endpoint pemrosesan (``/api/compress``, ``/api/image-to-pdf``, ``/api/pdf-to-image``). |
| **Output**         | Request diterima atau ditolak dengan HTTP 429. |
| **Validasi**       | Maksimum 10 request per menit per IP. |
| **Error Handling** | HTTP 429 dengan pesan Bahasa Indonesia: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." |

---

#### FR-SEC-004: CORS Strict

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SEC-004 |
| **Deskripsi**      | Backend hanya menerima request dari origin yang terdaftar. |
| **Input**          | Origin header dari request. |
| **Proses**         | CORS middleware dikonfigurasi dengan ``allow_origins=settings.cors_origins``. Hanya method ``GET``, ``POST``, ``OPTIONS`` yang diizinkan. Header yang diizinkan: ``Content-Type``, ``Authorization``. |
| **Output**         | Request dari origin yang tidak terdaftar ditolak oleh browser (preflight gagal). |
| **Validasi**       | Origin harus exact match dengan daftar yang dikonfigurasi. |
| **Error Handling** | Browser secara otomatis memblokir request yang gagal CORS preflight. |

---

#### FR-SEC-005: Signed URL Access Only

| **Atribut**        | **Detail** |
|--------------------|------------|
| **ID**             | FR-SEC-005 |
| **Deskripsi**      | File hasil pemrosesan hanya dapat diakses melalui signed URL dengan expiry time. |
| **Input**          | R2 object key. |
| **Proses**         | ``generate_signed_url(key, expiry_seconds=3600, download_filename)`` menghasilkan URL dengan: signature kriptografis, expiry timestamp (1 jam), Content-Disposition header untuk force download. Tidak ada direct public access ke R2 bucket. |
| **Output**         | Signed URL yang valid selama 1 jam. |
| **Validasi**       | URL harus expire setelah 3600 detik. |
| **Error Handling** | Akses setelah expiry menghasilkan HTTP 403 dari Cloudflare. |

---

## 4. Kebutuhan Non-Fungsional

| **ID**    | **Kategori**    | **Requirement**                                                              | **Target Terukur**          | **Referensi BRD** |
|-----------|-----------------|------------------------------------------------------------------------------|-----------------------------|--------------------|
| NFR-001   | Performance     | Waktu pemrosesan compress PDF (file 5MB)                                     | < 5 detik                  | NFR-001            |
| NFR-002   | Performance     | Client-side operation (merge/split/rotate) untuk file < 10MB                 | < 2 detik                  | NFR-002            |
| NFR-003   | Performance     | Page load time (mobile, 4G connection)                                       | < 3 detik (LCP)            | NFR-003            |
| NFR-004   | Performance     | Time to Interactive (TTI) pada mobile                                        | < 4 detik                  | -                  |
| NFR-005   | Availability    | System uptime (monthly)                                                      | > 99%                      | NFR-004            |
| NFR-006   | Security        | Semua transmisi data terenkripsi                                             | TLS 1.3                    | NFR-005            |
| NFR-007   | Security        | File validation multi-layer                                                  | MIME + ekstensi + magic bytes | NFR-006          |
| NFR-008   | Security        | File auto-delete dari server                                                 | Maksimum 60 menit          | NFR-007            |
| NFR-009   | Security        | Rate limiting per IP                                                         | 10 request/menit/IP        | NFR-008            |
| NFR-010   | Privacy         | Tidak ada logging konten file                                                | Zero content logging        | NFR-009            |
| NFR-011   | Privacy         | Filename anonymization di server                                             | UUID replacement            | NFR-010            |
| NFR-012   | Usability       | Mobile-first responsive design                                               | Semua ukuran layar (320px+) | NFR-011           |
| NFR-013   | Usability       | Bahasa Indonesia sebagai bahasa default                                       | 100% UI dalam Bahasa Indonesia | NFR-012        |
| NFR-014   | Usability       | Error message dalam Bahasa Indonesia yang mudah dipahami                     | Semua error message         | REQ-UX-005         |
| NFR-015   | SEO             | Core Web Vitals score                                                        | Good (semua hijau)          | NFR-013            |
| NFR-016   | SEO             | Sitemap, robots.txt, Open Graph, Twitter Card                                | Tersedia dan valid          | NFR-014            |
| NFR-017   | Scalability     | Concurrent users tanpa degradasi performa                                    | 100 concurrent users        | NFR-015            |
| NFR-018   | Cost            | Biaya infrastruktur bulanan (MVP)                                            | < $5/bulan                  | NFR-016            |
| NFR-019   | Reliability     | Auto-retry pada kegagalan task                                               | 1x retry otomatis           | NFR-017            |
| NFR-020   | Compliance      | Kesadaran UU PDP (UU No. 27/2022)                                            | Privacy Policy tersedia     | NFR-018            |

---

## 5. Kebutuhan Antarmuka

### 5.1 Antarmuka Pengguna (User Interface)

| **ID**    | **Requirement**                                                                                          |
|-----------|----------------------------------------------------------------------------------------------------------|
| UI-001    | Desain mobile-first dengan breakpoint responsif: mobile (<640px), tablet (640-1024px), desktop (>1024px). |
| UI-002    | Font: DM Sans (Google Fonts) untuk konsistensi tipografi.                                                |
| UI-003    | Color scheme: Navy (primary text), Accent blue (interactive elements), Slate (secondary text).            |
| UI-004    | Semua teks UI dalam Bahasa Indonesia.                                                                    |
| UI-005    | Upload area: border dashed, drag-and-drop support, visual feedback saat hover/drag.                      |
| UI-006    | Progress indicator: shimmer animation bar saat pemrosesan.                                               |
| UI-007    | Success state: green checkmark icon, informasi hasil, tombol download prominent.                         |
| UI-008    | Error state: red alert icon, pesan error deskriptif, tombol "Coba Lagi".                                 |
| UI-009    | Animasi: ``animate-fade-up`` untuk transisi state, smooth transitions.                                   |
| UI-010    | Aksesibilitas: ``aria-label`` pada tombol, keyboard navigation support, semantic HTML.                   |

### 5.2 Antarmuka API (API Interface)

| **Endpoint**          | **Method** | **Content-Type**          | **Request**                                    | **Response**                                                    |
|-----------------------|------------|---------------------------|------------------------------------------------|-----------------------------------------------------------------|
| /api/compress         | POST       | multipart/form-data       | file (PDF) + quality (query param)             | ``{download_url, original_size, compressed_size, saved_percent}`` |
| /api/image-to-pdf     | POST       | multipart/form-data       | files (multiple images)                        | ``{download_url, image_count, pdf_size}``                        |
| /api/pdf-to-image     | POST       | multipart/form-data       | file (PDF) + pages (form field)                | ``{download_url, file_type, page_count}``                        |
| /health               | GET        | application/json          | -                                              | ``{status, version, timestamp}``                                 |

**Error Response Format:**

```json
{
  "detail": "Pesan error dalam Bahasa Indonesia"
}
```

**HTTP Status Codes:**

| Code | Penggunaan |
|------|------------|
| 200  | Operasi berhasil |
| 400  | Validasi gagal (file tidak valid, format salah, dll.) |
| 422  | Parameter request tidak valid (FastAPI validation) |
| 429  | Rate limit exceeded |
| 500  | Internal server error |

### 5.3 Antarmuka Hardware

Tidak ada kebutuhan antarmuka hardware khusus. Aplikasi berjalan sepenuhnya di browser (client-side) dan cloud infrastructure (server-side).

### 5.4 Antarmuka Software

| **Komponen**       | **Interface**                                                                    |
|--------------------|----------------------------------------------------------------------------------|
| Frontend - Backend | REST API via HTTPS (JSON response, multipart/form-data request)                  |
| Backend - R2       | S3-compatible API via boto3 (upload, delete, generate presigned URL)              |
| Frontend - Analytics | Vercel Analytics SDK (event tracking, no cookies)                              |
| Backend - Ghostscript | CLI subprocess call dengan parameter kualitas                                 |
| Backend - PyMuPDF  | Python library API (fitz module) untuk PDF rendering dan image conversion        |

---

## 6. Matriks Keterlacakan

### 6.1 Functional Requirements ke BRD Requirements

| **FR ID**    | **BRD REQ**    | **Test Case ID** | **Status** |
|--------------|----------------|------------------|------------|
| FR-CMP-001   | REQ-CMP-001    | TC-CMP-001       | Implemented |
| FR-CMP-002   | REQ-CMP-001    | TC-CMP-002       | Implemented |
| FR-CMP-003   | REQ-CMP-001    | TC-CMP-003       | Implemented |
| FR-CMP-004   | REQ-CMP-001    | TC-CMP-004       | Implemented |
| FR-CMP-005   | REQ-CMP-004    | TC-CMP-005       | Implemented |
| FR-CMP-006   | REQ-CMP-002    | TC-CMP-006       | Implemented |
| FR-MRG-001   | REQ-MRG-001    | TC-MRG-001       | Implemented |
| FR-MRG-002   | REQ-MRG-002    | TC-MRG-002       | Implemented |
| FR-MRG-003   | REQ-MRG-001    | TC-MRG-003       | Implemented |
| FR-MRG-004   | REQ-MRG-003    | TC-MRG-004       | Implemented |
| FR-MRG-005   | REQ-MRG-001    | TC-MRG-005       | Implemented |
| FR-SPL-001   | REQ-SPL-001    | TC-SPL-001       | Implemented |
| FR-SPL-002   | REQ-SPL-001    | TC-SPL-002       | Implemented |
| FR-SPL-003   | REQ-SPL-002    | TC-SPL-003       | Implemented |
| FR-SPL-004   | REQ-SPL-004    | TC-SPL-004       | Implemented |
| FR-I2P-001   | REQ-IMG-001    | TC-I2P-001       | Implemented |
| FR-I2P-002   | REQ-IMG-004    | TC-I2P-002       | Implemented |
| FR-I2P-003   | REQ-IMG-002    | TC-I2P-003       | Implemented |
| FR-I2P-004   | REQ-IMG-003    | TC-I2P-004       | Implemented |
| FR-I2P-005   | REQ-IMG-003    | TC-I2P-005       | Implemented |
| FR-I2P-006   | REQ-IMG-004    | TC-I2P-006       | Implemented |
| FR-I2P-007   | REQ-IMG-001    | TC-I2P-007       | Implemented |
| FR-P2I-001   | REQ-P2I-001    | TC-P2I-001       | Implemented |
| FR-P2I-002   | REQ-P2I-002    | TC-P2I-002       | Implemented |
| FR-P2I-003   | REQ-P2I-004    | TC-P2I-003       | Implemented |
| FR-P2I-004   | REQ-P2I-003    | TC-P2I-004       | Implemented |
| FR-ROT-001   | REQ-ROT-001    | TC-ROT-001       | Implemented |
| FR-ROT-002   | REQ-ROT-002    | TC-ROT-002       | Implemented |
| FR-ROT-003   | REQ-ROT-002    | TC-ROT-003       | Implemented |
| FR-ROT-004   | REQ-ROT-003    | TC-ROT-004       | Implemented |
| FR-ROT-005   | REQ-ROT-001    | TC-ROT-005       | Implemented |
| FR-LND-001   | REQ-UX-001     | TC-LND-001       | Implemented |
| FR-LND-002   | REQ-UX-001     | TC-LND-002       | Implemented |
| FR-LND-003   | REQ-UX-004     | TC-LND-003       | Implemented |
| FR-NAV-001   | REQ-UX-003     | TC-NAV-001       | Implemented |
| FR-NAV-002   | REQ-UX-003     | TC-NAV-002       | Implemented |
| FR-NAV-003   | REQ-UX-001     | TC-NAV-003       | Implemented |
| FR-ANA-001   | REQ-ANL-001    | TC-ANA-001       | Implemented |
| FR-ANA-002   | REQ-ANL-001    | TC-ANA-002       | Implemented |
| FR-ANA-003   | REQ-ANL-001    | TC-ANA-003       | Implemented |
| FR-ANA-004   | REQ-ANL-003    | TC-ANA-004       | Implemented |
| FR-CLN-001   | BR-003         | TC-CLN-001       | Implemented |
| FR-CLN-002   | BR-004         | TC-CLN-002       | Implemented |
| FR-CLN-003   | BR-005         | TC-CLN-003       | Implemented |
| FR-SEC-001   | BR-002         | TC-SEC-001       | Implemented |
| FR-SEC-002   | BR-002         | TC-SEC-002       | Implemented |
| FR-SEC-003   | BR-009         | TC-SEC-003       | Implemented |
| FR-SEC-004   | BR-002         | TC-SEC-004       | Implemented |
| FR-SEC-005   | BR-008         | TC-SEC-005       | Implemented |

### 6.2 Non-Functional Requirements ke BRD

| **NFR ID**   | **BRD NFR**    | **Metode Verifikasi**                          |
|--------------|----------------|------------------------------------------------|
| NFR-001      | NFR-001        | Load testing dengan file 5MB                   |
| NFR-002      | NFR-002        | Browser performance profiling                  |
| NFR-003      | NFR-003        | Lighthouse audit (mobile, 4G throttle)         |
| NFR-005      | NFR-004        | Uptime monitoring (Railway + Vercel)           |
| NFR-006      | NFR-005        | SSL Labs test (Grade A+)                       |
| NFR-007      | NFR-006        | Unit test validasi multi-layer                 |
| NFR-008      | NFR-007        | Integration test: upload + verify deletion     |
| NFR-009      | NFR-008        | Load test: 11+ requests dalam 1 menit         |
| NFR-012      | NFR-011        | Responsive testing (320px - 1920px)            |
| NFR-015      | NFR-013        | PageSpeed Insights score                       |
| NFR-017      | NFR-015        | Concurrent load test (100 users)               |

---

## 7. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Software Requirements Specification ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan kebutuhan fungsional dan non-fungsional untuk Papyr MVP 0.1.

|                   |                              |                  |            |
|:------------------|:-----------------------------|:-----------------|:-----------|
| **Peran**         | **Nama**                     | **Tanda Tangan** | **Tanggal** |
| **Product Owner** | Muhammad Fa'iz Zulfikar      | Approved         | 2026-05-03 |
| **AI Agent**      | OpenCode/Sisyphus            | Approved         | 2026-05-03 |

---

*Dokumen ini dapat berubah. Setiap modifikasi harus ditinjau dan disetujui ulang oleh semua penandatangan. Perubahan didokumentasikan dalam tabel Riwayat Versi.*

---

**Referensi Silang Dokumen:**

- PPR-BRD-001: Business Requirements Document (source of truth untuk business rules)
- PPR-TDD-001: Technical Design Document (detail arsitektur dan implementasi)
- PPR-ADR-001: Architecture Decision Records (keputusan teknis dan rationale)
