# Papyr

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

# Kebijakan Keamanan (Security Policy)

Version 1.0 | Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

| Field | Value |
|---|---|
| **Judul Dokumen** | Kebijakan Keamanan — Papyr |
| **ID Dokumen** | PPR-SP-001 |
| **Versi** | 1.0 |
| **Status** | Approved |
| **Tanggal Dibuat** | Mei 2026 |
| **Terakhir Diubah** | Mei 2026 |
| **Penulis** | Muhammad Fa'iz Zulfikar |
| **Ditinjau Oleh** | Product Owner |
| **Disetujui Oleh** | Product Owner + AI Agent |
| **Kerahasiaan** | Confidential — Internal & Investor Use Only |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi |
|---|---|---|---|
| 1.0 | Mei 2026 | Muhammad Fa'iz Zulfikar | Draft awal — Kebijakan Keamanan lengkap untuk MVP 1.1 |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Prinsip Keamanan](#2-prinsip-keamanan)
3. [Keamanan Input & Validasi](#3-keamanan-input--validasi)
4. [Keamanan Jaringan](#4-keamanan-jaringan)
5. [Keamanan Penyimpanan](#5-keamanan-penyimpanan)
6. [Keamanan Aplikasi](#6-keamanan-aplikasi)
7. [Kepatuhan Regulasi](#7-kepatuhan-regulasi)
8. [Manajemen Kerentanan](#8-manajemen-kerentanan)
9. [Respons Insiden](#9-respons-insiden)
10. [Kebijakan Pengembangan Aman](#10-kebijakan-pengembangan-aman)
11. [Audit & Pemantauan](#11-audit--pemantauan)
12. [Persetujuan Dokumen](#12-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini mendefinisikan kebijakan keamanan komprehensif untuk Papyr — platform utilitas PDF yang melayani pengguna Indonesia melalui mypapyr.com. Kebijakan ini menetapkan standar, prosedur, dan kontrol keamanan yang diterapkan di seluruh stack teknologi Papyr untuk melindungi integritas sistem dan privasi pengguna.

### 1.2 Ruang Lingkup

Kebijakan ini mencakup seluruh komponen infrastruktur Papyr:

| Komponen | Platform | Cakupan |
|---|---|---|
| Frontend | Vercel (Next.js 16) | Validasi client-side, HTTPS, analytics |
| Backend API | Railway (FastAPI/Python 3.11) | Validasi server-side, rate limiting, processing |
| Object Storage | Cloudflare R2 | Penyimpanan sementara, signed URLs, lifecycle |
| Domain & DNS | Hostinger | mypapyr.com, SSL/TLS |

### 1.3 Audiens

| Audiens | Relevansi |
|---|---|
| Product Owner | Keputusan keamanan strategis dan persetujuan kebijakan |
| AI Agent (Development Partner) | Implementasi kontrol keamanan dalam kode |
| Investor/Partner | Evaluasi postur keamanan produk |
| Auditor | Verifikasi kepatuhan dan kontrol |

### 1.4 Referensi

| ID Dokumen | Judul | Relevansi |
|---|---|---|
| PPR-BRD-001 | Business Requirements Document | Business rules keamanan (BR-001 s/d BR-010) |
| PPR-TDD-001 | Technical Design Document | Arsitektur keamanan teknis |
| PPR-ADR-001 | Architecture Decision Records | Keputusan arsitektur keamanan (ADR-004, ADR-014) |
| UU No. 27/2022 | Undang-Undang Pelindungan Data Pribadi | Kepatuhan regulasi Indonesia |
| GDPR | General Data Protection Regulation | Awareness untuk ekspansi internasional |

---

## 2. Prinsip Keamanan

Papyr dibangun di atas empat prinsip keamanan fundamental yang menjadi dasar setiap keputusan teknis dan arsitektur:

### 2.1 Privacy-First — Tidak Ada Data Pengguna yang Disimpan

Papyr tidak memiliki sistem akun, login, atau registrasi. Tidak ada data pribadi (nama, email, alamat) yang dikumpulkan atau disimpan. Setiap interaksi bersifat anonim dan stateless.

**Implementasi:**
- Tidak ada database pengguna
- Tidak ada cookie pelacakan
- Tidak ada session management
- Analytics menggunakan Vercel Analytics yang privacy-friendly (tanpa cookie)

### 2.2 Zero-Knowledge — Tidak Ada Logging Konten

Sistem tidak pernah mencatat, menyimpan, atau menganalisis konten file yang diproses. Papyr beroperasi dengan prinsip zero-knowledge — kami tidak tahu dan tidak ingin tahu apa isi dokumen pengguna.

**Implementasi:**
- Konten file tidak pernah di-log (`backend/utils/cleanup.py` — komentar baris 6: "TIDAK BOLEH log: file names asli, file contents, user info")
- Hanya metadata operasional yang dicatat (ukuran file, tipe, timestamp, durasi)
- Nama file asli tidak disimpan di server — diganti UUID (`backend/utils/r2.py` baris 70: `object_key = f"{uuid.uuid4().hex}{ext}"`)

### 2.3 Minimal Data — Proses dan Hapus

File hanya ada di sistem selama waktu minimum yang diperlukan untuk pemrosesan. Setelah selesai, file dihapus secara otomatis tanpa pengecualian.

**Implementasi:**
- Auto-delete dalam 60 menit via cron job (`backend/utils/cleanup.py`)
- R2 lifecycle rule sebagai safety net (auto-delete 24 jam)
- Temporary files dihapus segera setelah processing (`finally` block di setiap router)
- Signed URL kedaluwarsa dalam 60 menit

### 2.4 Defense in Depth — Lapisan Validasi Berlapis

Keamanan tidak bergantung pada satu mekanisme tunggal. Setiap file melewati multiple layer validasi, dan setiap komponen memiliki kontrol keamanan independen.

**Implementasi:**
- 6 layer validasi input (MIME, ekstensi, magic bytes, ukuran, password detection, empty file)
- Double-safety auto-delete (cron + lifecycle rule)
- CORS strict + rate limiting + HTTPS
- Client-side processing untuk operasi ringan (file tidak pernah meninggalkan device)

---

## 3. Keamanan Input & Validasi

### 3.1 Arsitektur Validasi Multi-Layer

Setiap file yang di-upload ke server Papyr melewati **6 layer validasi** sebelum diproses. Jika salah satu layer gagal, file ditolak dengan HTTP 400 dan pesan error dalam Bahasa Indonesia.

Keputusan arsitektur ini didokumentasikan dalam ADR-014 (PPR-ADR-001).

### 3.2 Layer 1 — Validasi MIME Type

Memeriksa `Content-Type` header dari file yang di-upload.

**Implementasi untuk PDF** (`backend/routers/compress.py` baris 29):
```python
ALLOWED_MIME_TYPES = {"application/pdf"}
```

**Implementasi untuk gambar** (`backend/routers/image_to_pdf.py` baris 29):
```python
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
```

**Logika validasi** (`backend/routers/compress.py` baris 52-56):
```python
if file.content_type not in ALLOWED_MIME_TYPES:
    raise HTTPException(
        status_code=400,
        detail=f"Tipe file tidak valid: {file.content_type}. Hanya file PDF yang diterima.",
    )
```

### 3.3 Layer 2 — Validasi Ekstensi File

Memeriksa ekstensi file untuk memastikan konsistensi dengan MIME type.

**Ekstensi yang diizinkan:**

| Endpoint | Ekstensi |
|---|---|
| `/api/compress` | `.pdf` |
| `/api/pdf-to-image` | `.pdf` |
| `/api/image-to-pdf` | `.jpg`, `.jpeg`, `.png`, `.webp` |

**Implementasi** (`backend/routers/compress.py` baris 59-66):
```python
ext = ""
if "." in filename:
    ext = "." + filename.rsplit(".", 1)[-1].lower()
if ext not in ALLOWED_EXTENSIONS:
    raise HTTPException(
        status_code=400,
        detail=f"Ekstensi file tidak valid: '{ext}'. Hanya file .pdf yang diterima.",
    )
```

### 3.4 Layer 3 — Validasi Magic Bytes

Membaca header bytes file untuk memverifikasi format sebenarnya, mencegah file berbahaya yang di-rename.

**Signature yang divalidasi:**

| Format | Magic Bytes | Hex | Posisi | Implementasi |
|---|---|---|---|---|
| PDF | `%PDF` | `25 50 44 46` | Bytes 0-3 | `compress.py` baris 34: `_PDF_MAGIC = b"%PDF"` |
| JPEG | `FF D8 FF` | `FF D8 FF` | Bytes 0-2 | `image_to_pdf.py` baris 34: `_JPEG_MAGIC = b"\xff\xd8\xff"` |
| PNG | `89 50 4E 47 0D 0A 1A 0A` | `89504E470D0A1A0A` | Bytes 0-7 | `image_to_pdf.py` baris 35: `_PNG_MAGIC = b"\x89PNG\r\n\x1a\n"` |
| WebP | `RIFF` + `WEBP` | `52494646` + `57454250` | Bytes 0-3 + 8-11 | `image_to_pdf.py` baris 36-37: `_WEBP_RIFF = b"RIFF"` / `_WEBP_MAGIC = b"WEBP"` |

**Logika validasi PDF** (`backend/routers/compress.py` baris 69-73):
```python
if file_bytes[:4] != _PDF_MAGIC:
    raise HTTPException(
        status_code=400,
        detail=f'"{filename}" bukan file PDF yang valid. Konten file tidak sesuai format PDF.',
    )
```

**Logika validasi gambar** (`backend/routers/image_to_pdf.py` baris 73-84):
```python
is_jpeg = file_bytes[:3] == _JPEG_MAGIC
is_png = file_bytes[:8] == _PNG_MAGIC
is_webp = (
    len(file_bytes) >= 12
    and file_bytes[:4] == _WEBP_RIFF
    and file_bytes[8:12] == _WEBP_MAGIC
)
if not (is_jpeg or is_png or is_webp):
    raise HTTPException(
        status_code=400,
        detail=f'"{filename}" bukan file gambar yang valid.',
    )
```

### 3.5 Layer 4 — Validasi Ukuran File

Membatasi ukuran file maksimum untuk mencegah abuse dan melindungi resource server.

**Batas:** Maksimum **20MB** per file (dikonfigurasi via `MAX_UPLOAD_SIZE_MB` environment variable).

**Implementasi** (`backend/routers/compress.py` baris 76-82):
```python
if size_bytes > settings.max_upload_size_bytes:
    max_mb = settings.max_upload_size_mb
    actual_mb = round(size_bytes / (1024 * 1024), 1)
    raise HTTPException(
        status_code=400,
        detail=f"Ukuran file terlalu besar: {actual_mb}MB. Maksimal {max_mb}MB.",
    )
```

**Konfigurasi** (`backend/utils/config.py` baris 100):
```python
max_upload_size_mb=_int("MAX_UPLOAD_SIZE_MB", 20),
```

**Property helper** (`backend/utils/config.py` baris 78-80):
```python
@property
def max_upload_size_bytes(self) -> int:
    return self.max_upload_size_mb * 1024 * 1024
```

### 3.6 Layer 5 — Deteksi & Penolakan PDF Terproteksi Password

PDF yang dilindungi password tidak dapat diproses oleh Ghostscript/PyMuPDF dan ditolak secara eksplisit.

**Implementasi** (`backend/routers/compress.py` baris 85-101):
```python
try:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    is_encrypted = doc.is_encrypted
    doc.close()
    if is_encrypted:
        raise HTTPException(
            status_code=400,
            detail="PDF ini dilindungi kata sandi dan tidak dapat diproses.",
        )
except HTTPException:
    raise
except Exception:
    raise HTTPException(
        status_code=400,
        detail=f'"{filename}" bukan file PDF yang valid atau file corrupt.',
    )
```

### 3.7 Layer 6 — Deteksi File Kosong

File dengan ukuran 0 bytes ditolak sebelum processing dimulai.

**Implementasi** (`backend/routers/compress.py` baris 44-49):
```python
size_bytes = len(file_bytes)
if size_bytes == 0:
    raise HTTPException(
        status_code=400,
        detail="File kosong. Silakan upload file PDF yang valid.",
    )
```

### 3.8 Matriks Validasi per Endpoint

| Layer | `/api/compress` | `/api/pdf-to-image` | `/api/image-to-pdf` |
|---|---|---|---|
| MIME type | `application/pdf` | `application/pdf` | `image/jpeg`, `image/png`, `image/webp` |
| Ekstensi | `.pdf` | `.pdf` | `.jpg`, `.jpeg`, `.png`, `.webp` |
| Magic bytes | `%PDF` (4 bytes) | `%PDF` (4 bytes) | FFD8FF / 89504E47 / RIFF+WEBP |
| Ukuran maks | 20MB | 20MB | 20MB |
| Password check | Ya | Ya | N/A |
| Empty check | Ya | Ya | Ya |

---

## 4. Keamanan Jaringan

### 4.1 HTTPS Everywhere

Seluruh komunikasi antara pengguna, frontend, dan backend dienkripsi menggunakan TLS.

| Komponen | Provider TLS | Protokol |
|---|---|---|
| Frontend (mypapyr.com) | Vercel Edge Network | TLS 1.3 |
| Backend API (Railway) | Railway automatic SSL | TLS 1.2+ |
| Object Storage (R2) | Cloudflare | TLS 1.3 |

- Vercel secara otomatis menyediakan sertifikat SSL untuk semua deployment
- Railway menyediakan HTTPS otomatis untuk semua service
- Cloudflare R2 signed URLs selalu menggunakan HTTPS

### 4.2 CORS — Strict Origin Whitelist

Cross-Origin Resource Sharing dikonfigurasi secara ketat untuk hanya mengizinkan origin yang terdaftar.

**Implementasi** (`backend/main.py` baris 81-87):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
```

**Konfigurasi origin** (`backend/utils/config.py` baris 93-98):
```python
cors_origins=[
    origin.strip()
    for origin in _optional(
        "CORS_ORIGINS", "https://mypapyr.com,https://frontend-ten-omega-35.vercel.app,http://localhost:3000"
    ).split(",")
],
```

**Origin yang diizinkan (production):**
- `https://mypapyr.com` — domain utama
- `https://frontend-ten-omega-35.vercel.app` — Vercel deployment URL
- `http://localhost:3000` — development only

**Metode HTTP yang diizinkan:** `GET`, `POST`, `OPTIONS`

**Header yang diizinkan:** `Content-Type`, `Authorization`

### 4.3 Rate Limiting

Rate limiting diterapkan untuk mencegah abuse dan melindungi resource server.

**Konfigurasi:** Maksimum **10 request per menit per IP address**.

**Implementasi** (`backend/main.py` baris 26):
```python
limiter = Limiter(key_func=get_remote_address)
```

**Penerapan per endpoint** (`backend/routers/compress.py` baris 105):
```python
@limiter.limit(f"{settings.rate_limit_per_minute}/minute")
```

**Konfigurasi** (`backend/utils/config.py` baris 102):
```python
rate_limit_per_minute=_int("RATE_LIMIT_PER_MINUTE", 10),
```

### 4.4 Custom 429 Response dalam Bahasa Indonesia

Ketika rate limit terlampaui, pengguna menerima pesan error yang jelas dalam Bahasa Indonesia.

**Implementasi** (`backend/main.py` baris 69-75):
```python
async def _rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Terlalu banyak permintaan. Coba lagi dalam 1 menit.",
        },
    )
```

**Registrasi handler** (`backend/main.py` baris 78):
```python
app.add_exception_handler(RateLimitExceeded, _rate_limit_handler)
```

---

## 5. Keamanan Penyimpanan

### 5.1 Cloudflare R2 — Encrypted at Rest

Semua file yang diproses di server disimpan sementara di Cloudflare R2 yang menyediakan enkripsi at-rest secara default.

**Konfigurasi koneksi** (`backend/utils/r2.py` baris 23-24):
```python
R2_ENDPOINT = f"https://{settings.r2_account_id}.r2.cloudflarestorage.com"
SIGNED_URL_EXPIRY_SECONDS = settings.file_retention_minutes * 60
```

**Client configuration** (`backend/utils/r2.py` baris 28-39):
```python
def _get_client():
    return boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        config=Config(
            signature_version="s3v4",
            retries={"max_attempts": 2, "mode": "standard"},
        ),
        region_name="auto",
    )
```

### 5.2 UUID Filenames — Tidak Ada Data Pengguna di Path

Nama file asli pengguna **tidak pernah** digunakan sebagai object key di R2. Setiap file disimpan dengan UUID acak.

**Implementasi** (`backend/utils/r2.py` baris 70):
```python
object_key = f"{uuid.uuid4().hex}{ext}"
```

**Contoh:** File `laporan_keuangan_2026.pdf` disimpan sebagai `a1b2c3d4e5f6789012345678abcdef01.pdf`

Ini memastikan:
- Tidak ada informasi pengguna yang bisa diidentifikasi dari path storage
- Tidak ada kemungkinan collision nama file
- Tidak ada informasi sensitif yang bocor melalui URL

### 5.3 Signed URLs dengan Expiry 60 Menit

File hasil pemrosesan hanya dapat diakses melalui pre-signed URL yang kedaluwarsa.

**Implementasi** (`backend/utils/r2.py` baris 98-137):
```python
def generate_signed_url(
    object_key: str,
    expiry_seconds: int | None = None,
    download_filename: str | None = None,
) -> str:
    if expiry_seconds is None:
        expiry_seconds = SIGNED_URL_EXPIRY_SECONDS  # 60 menit

    params: dict = {"Bucket": settings.r2_bucket_name, "Key": object_key}

    if download_filename:
        params["ResponseContentDisposition"] = (
            f'attachment; filename="{download_filename}"'
        )

    url = client.generate_presigned_url(
        "get_object",
        Params=params,
        ExpiresIn=expiry_seconds,
    )
```

**Karakteristik signed URL:**
- Kedaluwarsa dalam 60 menit (3600 detik)
- Menggunakan S3v4 signature
- Force download via `Content-Disposition: attachment`
- Tidak ada direct public access ke R2 bucket

### 5.4 Double-Safety Auto-Delete

Penghapusan file dijamin melalui dua mekanisme komplementer sesuai ADR-004:

- **R2 lifecycle rule (safety net utama):** Auto-delete semua objek setelah 24 jam (batas minimum R2).
- **Cron cleanup (enforcement):** Berjalan setiap 30 menit, menghapus file yang lebih tua dari `FILE_RETENTION_MINUTES` (60 menit) untuk memastikan SLA 60 menit terpenuhi.

**Implementasi cron** (`backend/utils/cleanup.py` baris 71-154):
```python
def cleanup_expired_files() -> dict:
    expired_objects = list_expired_objects()
    # ... delete each expired object ...
```

**Loop cron** (`backend/main.py` baris 30-39):
```python
async def _cleanup_loop():
    """Background loop: jalankan cleanup setiap 30 menit."""
    while True:
        await asyncio.sleep(CLEANUP_INTERVAL_SECONDS)  # 1800 detik
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, cleanup_expired_files)
```

**Jaminan penghapusan:**

| Skenario | Mekanisme | Waktu Maks |
|---|---|---|
| Normal operation | Cron job (enforcement) | 60 menit + interval 30 menit (maks ~90 menit) |
| Backend crash/restart | R2 lifecycle rule (safety net utama) | 24 jam |
| Kedua gagal | Redundansi ganda | — |

### 5.5 Tidak Ada Penyimpanan Permanen

Papyr **tidak memiliki penyimpanan permanen** untuk file pengguna:
- Tidak ada database yang menyimpan file
- Tidak ada backup file pengguna
- Tidak ada archive atau cold storage
- Setelah dihapus, file tidak dapat dipulihkan

---

## 6. Keamanan Aplikasi

### 6.1 Tidak Ada Autentikasi — Tidak Ada Kredensial untuk Dilindungi

Papyr MVP 1.1 beroperasi tanpa sistem autentikasi. Ini adalah keputusan desain yang disengaja (PPR-BRD-001, BR-010):

- Tidak ada username/password yang bisa dicuri
- Tidak ada token yang bisa di-hijack
- Tidak ada session yang bisa di-fixate
- Tidak ada OAuth flow yang bisa di-exploit

**Implikasi keamanan:** Attack surface berkurang drastis karena tidak ada credential store.

### 6.2 Tidak Ada Akun Pengguna — Tidak Ada PII

Karena tidak ada sistem akun:
- Tidak ada Personally Identifiable Information (PII) yang disimpan
- Tidak ada risiko data breach yang mengekspos data pengguna
- Tidak ada kewajiban notifikasi breach terkait data pribadi
- Compliance burden minimal

### 6.3 Tidak Ada Cookies, Tidak Ada Sessions

Papyr tidak menggunakan:
- Session cookies
- Authentication cookies
- Tracking cookies
- Local storage untuk data sensitif

**Vercel Analytics** yang digunakan bersifat cookieless — tidak memerlukan cookie banner.

### 6.4 Tidak Ada Content Logging

Konten file yang diproses **tidak pernah** dicatat dalam log sistem.

**Yang di-log (metadata operasional saja):**
- Ukuran file (bytes)
- Tipe file (MIME type)
- Durasi pemrosesan (ms)
- Status operasi (success/failure)
- Error type (bukan error content)
- Timestamp

**Yang TIDAK di-log:**
- Nama file asli pengguna
- Konten/isi file
- IP address pengguna (hanya digunakan untuk rate limiting, tidak di-persist)
- Informasi identitas pengguna

### 6.5 Structured Logging — Metadata Only

Logging menggunakan format terstruktur yang hanya mencatat metadata operasional.

**Contoh log event** (`backend/routers/compress.py` baris 167-175):
```python
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

---

## 7. Kepatuhan Regulasi

### 7.1 UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022)

Papyr menyadari dan menyelaraskan operasinya dengan UU PDP Indonesia:

| Aspek UU PDP | Posisi Papyr | Status |
|---|---|---|
| Pengumpulan data pribadi | Tidak mengumpulkan data pribadi | Compliant by design |
| Persetujuan subjek data | Tidak diperlukan (tidak ada data pribadi) | N/A |
| Hak akses subjek data | Tidak ada data untuk diakses | N/A |
| Hak penghapusan | Auto-delete 60 menit (tanpa perlu request) | Exceeds requirement |
| Transfer data lintas batas | File diproses dan dihapus, tidak ditransfer | Minimal risk |
| Notifikasi breach | Tidak ada data pribadi yang bisa breach | Minimal risk |
| Data Protection Officer | Belum diperlukan (tidak memproses data pribadi skala besar) | Monitoring |

**Catatan:** Meskipun Papyr tidak secara teknis memproses "data pribadi" sebagaimana didefinisikan UU PDP (karena tidak ada identifikasi pengguna), kami tetap menerapkan standar keamanan tinggi sebagai best practice.

### 7.2 GDPR Awareness

Untuk persiapan ekspansi internasional di masa depan:

| Prinsip GDPR | Implementasi Papyr |
|---|---|
| Data minimization | Hanya memproses file yang diperlukan, hapus segera |
| Purpose limitation | File hanya digunakan untuk operasi yang diminta |
| Storage limitation | Auto-delete 60 menit |
| Integrity & confidentiality | HTTPS, encrypted storage, signed URLs |
| Accountability | Dokumentasi kebijakan ini |

### 7.3 Privacy Policy Page

Papyr menyediakan halaman Kebijakan Privasi yang dapat diakses publik di:

**URL:** `https://mypapyr.com/privacy`

**Implementasi:** `frontend/src/app/privacy/page.tsx`

**Konten mencakup:**
- Apa yang dikumpulkan (file sementara, analytics anonim)
- Apa yang TIDAK dikumpulkan (nama, email, isi dokumen)
- Berapa lama file disimpan (maks 1 jam)
- Informasi analytics (Vercel Analytics, tanpa cookie)
- Langkah keamanan (HTTPS, signed URLs, no content logging)
- Kontak privasi (privacy@mypapyr.com)

### 7.4 Terms of Service

Terms of Service tersedia dan mencakup:
- Batasan penggunaan layanan
- Disclaimer tanggung jawab
- Hak kekayaan intelektual
- Pembatasan konten yang dilarang

---

## 8. Manajemen Kerentanan

### 8.1 Pembaruan Dependensi

| Ekosistem | Tool | Frekuensi | Perintah |
|---|---|---|---|
| Python (Backend) | `pip audit` | Mingguan | `pip audit --fix` |
| Node.js (Frontend) | `npm audit` | Mingguan | `npm audit fix` |
| System packages | Docker rebuild | Per deployment | `apt-get update` di Dockerfile |

### 8.2 GitHub Dependabot

Jika diaktifkan, Dependabot akan:
- Memindai dependensi untuk kerentanan yang diketahui
- Membuat pull request otomatis untuk security patches
- Memberikan notifikasi untuk critical vulnerabilities

**Konfigurasi yang direkomendasikan:**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/backend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
```

### 8.3 Proses Review Keamanan

| Tahap | Aktivitas | Penanggung Jawab |
|---|---|---|
| Development | Input validation di setiap endpoint baru | AI Agent |
| Code Review | Verifikasi kontrol keamanan | Product Owner + AI Agent |
| Pre-deployment | `pip audit` + `npm audit` | CI/CD pipeline |
| Post-deployment | Monitoring error rate dan anomali | Product Owner |
| Periodik (bulanan) | Review dependensi dan CVE baru | Product Owner |

---

## 9. Respons Insiden

### 9.1 Klasifikasi Insiden

| Prioritas | Definisi | Contoh | SLA Respons |
|---|---|---|---|
| **P0 — Critical** | Sistem down atau data breach aktif | File pengguna terekspos publik, backend compromised | < 1 jam |
| **P1 — High** | Degradasi signifikan atau kerentanan aktif | Rate limiter bypass, validasi file gagal total | < 4 jam |
| **P2 — Medium** | Masalah keamanan terbatas | Cleanup cron gagal (file tidak terhapus tepat waktu) | < 24 jam |
| **P3 — Low** | Kerentanan potensial, belum dieksploitasi | Dependensi dengan CVE severity low | < 1 minggu |

### 9.2 Prosedur Respons

**P0 — Critical:**
1. **Identifikasi** — Konfirmasi insiden melalui monitoring/alert
2. **Containment** — Matikan service yang terdampak (Railway: scale to 0)
3. **Eradication** — Identifikasi dan perbaiki root cause
4. **Recovery** — Deploy fix, verifikasi, scale up kembali
5. **Communication** — Notifikasi pengguna jika diperlukan (via mypapyr.com)

**P1 — High:**
1. **Identifikasi** — Review logs dan monitoring
2. **Assessment** — Tentukan scope dan dampak
3. **Fix** — Develop dan deploy patch
4. **Verification** — Konfirmasi fix efektif

**P2/P3 — Medium/Low:**
1. **Document** — Catat temuan di issue tracker
2. **Prioritize** — Masukkan ke sprint/backlog
3. **Fix** — Perbaiki sesuai prioritas
4. **Verify** — Test dan deploy

### 9.3 Rencana Komunikasi

| Audiens | Channel | Kapan |
|---|---|---|
| Pengguna | Banner di mypapyr.com | P0 dan P1 yang berdampak pada pengguna |
| Investor/Partner | Email langsung | P0 |
| Internal | GitHub Issues | Semua prioritas |

### 9.4 Post-Incident Review

Setelah setiap insiden P0 atau P1:

1. **Timeline** — Dokumentasikan kronologi lengkap
2. **Root Cause Analysis** — Identifikasi akar masalah
3. **Impact Assessment** — Ukur dampak (jumlah pengguna terdampak, durasi)
4. **Lessons Learned** — Apa yang bisa diperbaiki
5. **Action Items** — Langkah pencegahan untuk masa depan
6. **Policy Update** — Perbarui dokumen ini jika diperlukan

---

## 10. Kebijakan Pengembangan Aman

### 10.1 Input Validation di Setiap Endpoint

**Aturan wajib:** Setiap endpoint yang menerima file upload HARUS mengimplementasikan fungsi validasi lengkap (6 layer) sebelum memproses file.

**Pattern yang digunakan:**
```python
# Setiap router memiliki fungsi _validate_pdf() atau _validate_image()
file_bytes = await file.read()
_validate_pdf(file, file_bytes)  # Raises HTTPException(400) jika gagal
```

**Endpoint yang sudah diimplementasi:**
- `backend/routers/compress.py` → `_validate_pdf()`
- `backend/routers/pdf_to_image.py` → `_validate_pdf()`
- `backend/routers/image_to_pdf.py` → `_validate_image()`

### 10.2 Tidak Ada eval() atau Dynamic Code Execution

**Dilarang keras:**
- `eval()` — tidak pernah digunakan
- `exec()` — tidak pernah digunakan
- `compile()` dengan input pengguna — tidak pernah digunakan
- Dynamic import berdasarkan input pengguna — tidak pernah digunakan
- Template injection — tidak ada template engine yang menerima input pengguna

### 10.3 Keamanan Subprocess — Ghostscript

Ghostscript dipanggil sebagai subprocess untuk kompresi PDF. Keamanan dijamin melalui:

**Kontrol argumen:**
- Hanya preset yang diizinkan: `screen`, `ebook`, `printer`
- Validasi via regex di endpoint: `quality: str = Query("ebook", regex="^(screen|ebook|printer)$")`
- Tidak ada input pengguna yang langsung masuk ke command line
- Path file menggunakan `tempfile.mkstemp()` (sistem yang generate, bukan pengguna)

**Isolasi:**
- Ghostscript berjalan di Docker container dengan permission terbatas
- Tidak ada akses ke filesystem di luar temporary directory
- Tidak ada network access dari subprocess

### 10.4 Temporary File Cleanup

Setiap router mengimplementasikan cleanup di `finally` block untuk memastikan temporary files selalu dihapus, bahkan jika terjadi error.

**Pattern** (`backend/routers/compress.py` baris 210-217):
```python
finally:
    # Cleanup temp files — selalu bersihkan
    for path in (input_path, output_path):
        if path and os.path.exists(path):
            try:
                os.remove(path)
            except OSError:
                logger.warning("Gagal hapus temp file")
```

**Implementasi konsisten di semua router:**
- `compress.py` — cleanup `input_path` dan `output_path`
- `image_to_pdf.py` — cleanup semua `temp_paths` dan `output_path`
- `pdf_to_image.py` — cleanup `input_path`, `output_paths`, dan `package_path`

---

## 11. Audit & Pemantauan

### 11.1 Structured Logging

Semua operasi dicatat menggunakan structured logging dengan format JSON yang konsisten.

**Event yang dicatat:**

| Event | Trigger | Data |
|---|---|---|
| `task_completed` | Operasi berhasil | tool, duration_ms, input_size_bytes, success=True |
| `task_failed` | Operasi gagal | tool, duration_ms, input_size_bytes, success=False, error type |
| `cleanup_started` | Cron cleanup dimulai | timestamp |
| `cleanup_success` | Semua file expired berhasil dihapus | scanned, deleted, duration_ms |
| `cleanup_failure` | Ada file yang gagal dihapus | scanned, deleted, failed, duration_ms |
| `cleanup_failed_item` | Satu file gagal dihapus | object_key (UUID only), error |

### 11.2 Monitoring Cleanup

Cleanup health dipantau melalui structured log events:

**Indikator sehat:**
- `cleanup_success` muncul setiap ~30 menit
- `deleted` count sesuai dengan volume traffic
- `duration_ms` stabil (tidak meningkat drastis)

**Indikator masalah:**
- `cleanup_failure` muncul (ada file yang gagal dihapus)
- Tidak ada `cleanup_started` selama > 1 jam (cron mati)
- `scanned` count terus meningkat (file menumpuk)

### 11.3 Railway Logs Retention

| Aspek | Detail |
|---|---|
| Platform | Railway |
| Retention | Sesuai Railway plan (default: 7 hari) |
| Format | Structured JSON |
| Akses | Railway dashboard + CLI |
| Alerting | Manual monitoring (MVP) |

### 11.4 Metrik yang Dipantau

| Metrik | Sumber | Threshold Alert |
|---|---|---|
| Error rate (5xx) | Railway logs | > 5% dari total requests |
| Cleanup success rate | Structured logs | < 100% (ada failure) |
| Response time P95 | Railway metrics | > 5 detik |
| Rate limit hits (429) | Structured logs | Spike abnormal |
| Storage usage | Cloudflare R2 dashboard | > 5GB (abnormal accumulation) |

---

## 12. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Kebijakan Keamanan ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan postur keamanan dan kontrol yang diterapkan pada Papyr.

| Peran | Nama | Tanda Tangan | Tanggal |
|:---|:---|:---|:---|
| **Product Owner** | Muhammad Fa'iz Zulfikar | Approved | 2026-05-03 |
| **AI Agent** | OpenCode/Sisyphus | Approved | 2026-05-03 |

---

## Lampiran A — Referensi Silang Kode

| Kontrol Keamanan | File | Fungsi/Baris |
|---|---|---|
| Validasi PDF (compress) | `backend/routers/compress.py` | `_validate_pdf()` baris 36-101 |
| Validasi PDF (pdf-to-image) | `backend/routers/pdf_to_image.py` | `_validate_pdf()` baris 41-105 |
| Validasi gambar | `backend/routers/image_to_pdf.py` | `_validate_image()` baris 40-93 |
| CORS configuration | `backend/main.py` | Baris 81-87 |
| Rate limiter setup | `backend/main.py` | Baris 26, 69-78 |
| Rate limit per endpoint | `backend/routers/compress.py` | Baris 105 |
| R2 upload (UUID naming) | `backend/utils/r2.py` | `upload_file()` baris 42-95 |
| Signed URL generation | `backend/utils/r2.py` | `generate_signed_url()` baris 98-137 |
| Cleanup cron loop | `backend/main.py` | `_cleanup_loop()` baris 30-39 |
| Cleanup logic | `backend/utils/cleanup.py` | `cleanup_expired_files()` baris 71-154 |
| Settings validation | `backend/utils/config.py` | `_load_settings()` baris 83-108 |
| Privacy page | `frontend/src/app/privacy/page.tsx` | Seluruh file |

---

## Lampiran B — Referensi Dokumen Terkait

| ID | Dokumen | Bagian Relevan |
|---|---|---|
| PPR-BRD-001 | Business Requirements Document | Bagian 7 (Business Rules), Bagian 9 (NFR-005 s/d NFR-010) |
| PPR-TDD-001 | Technical Design Document | Arsitektur keamanan, deployment security |
| PPR-ADR-001 | Architecture Decision Records | ADR-004 (Double Safety), ADR-014 (Triple Validation) |

---

*Akhir Dokumen.*
