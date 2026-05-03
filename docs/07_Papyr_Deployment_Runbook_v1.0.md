**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Deployment Runbook**

Version 1.0

Juni 2026

**CONFIDENTIAL**

mypapyr.com

**Informasi Dokumen**

|                     |                                                      |
|---------------------|------------------------------------------------------|
| **Judul Dokumen**   | Deployment Runbook — Papyr                           |
| **ID Dokumen**      | PPR-DR-001                                           |
| **Versi**           | 1.0                                                  |
| **Status**          | Approved                                             |
| **Tanggal Dibuat**  | Juni 2026                                            |
| **Terakhir Diubah** | Juni 2026                                            |
| **Penulis**         | Muhammad Fa’iz Zulfikar                              |
| **Ditinjau Oleh**   | Product Owner                                        |
| **Disetujui Oleh**  | Product Owner + AI Agent                             |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only          |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                        |
|-----------|-------------|------------------------------|----------------------------------------------------------------------|
| 1.0       | Juni 2026   | Muhammad Fa’iz Zulfikar      | Draft awal — Deployment Runbook lengkap untuk arsitektur Fase 1     |

**Referensi Silang**

| **ID Dokumen** | **Judul**                              | **Relevansi**                          |
|----------------|----------------------------------------|----------------------------------------|
| PPR-BRD-001    | Business Requirements Document — Papyr | Business context & requirements        |
| PPR-TDD-001    | Technical Design Document — Papyr      | Arsitektur teknis & design decisions   |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Arsitektur Deployment](#2-arsitektur-deployment)
3. [Prasyarat Deployment](#3-prasyarat-deployment)
4. [Prosedur Deployment — Frontend](#4-prosedur-deployment--frontend)
5. [Prosedur Deployment — Backend](#5-prosedur-deployment--backend)
6. [Konfigurasi Cloudflare R2](#6-konfigurasi-cloudflare-r2)
7. [Verifikasi Post-Deployment](#7-verifikasi-post-deployment)
8. [Prosedur Rollback](#8-prosedur-rollback)
9. [Monitoring Post-Deployment](#9-monitoring-post-deployment)
10. [Checklist Deployment](#10-checklist-deployment)
11. [Kontak Darurat & Eskalasi](#11-kontak-darurat--eskalasi)
12. [Persetujuan Dokumen](#12-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan

Dokumen ini menyediakan prosedur deployment lengkap, terstruktur, dan dapat diulang (repeatable) untuk seluruh komponen infrastruktur Papyr. Runbook ini menjadi panduan utama bagi tim operasional dalam melakukan deployment, rollback, dan verifikasi sistem produksi.

### 1.2 Ruang Lingkup

Runbook ini mencakup:

- Deployment frontend (Next.js 16) ke Vercel
- Deployment backend (FastAPI / Python 3.11) ke Railway
- Konfigurasi object storage Cloudflare R2
- Verifikasi post-deployment dan smoke testing
- Prosedur rollback untuk setiap komponen
- Monitoring dan eskalasi insiden

### 1.3 Audiens

| **Peran**          | **Penggunaan Dokumen**                                    |
|--------------------|-----------------------------------------------------------|
| Product Owner      | Approval deployment, eskalasi insiden                     |
| AI Agent           | Eksekusi deployment, verifikasi, troubleshooting          |
| DevOps (Future)    | Referensi prosedur operasional                            |

### 1.4 Referensi

| **Dokumen**        | **ID**         | **Keterangan**                                |
|--------------------|----------------|-----------------------------------------------|
| BRD                | PPR-BRD-001    | Business requirements & success metrics       |
| TDD                | PPR-TDD-001    | Technical architecture & design decisions     |
| README.md          | —              | Setup lokal & environment variables           |
| CHANGELOG.md       | —              | Riwayat perubahan per milestone               |

---

## 2. Arsitektur Deployment

### 2.1 Diagram Arsitektur Produksi

```
                    +----------------------------------------------+
                    |              mypapyr.com                      |
                    |           (Hostinger DNS)                     |
                    +---------------------+------------------------+
                                          |
                   +----------------------+----------------------+
                   v                                             v
       +-----------------------+               +-----------------------+
       |   Vercel (Edge CDN)   |               |  Railway (us-west2)   |
       |   Auto-deploy: main   |               |  Auto-deploy: main    |
       +-----------------------+               +-----------------------+
       |   Next.js 16          |  - REST API ->|   FastAPI             |
       |   TypeScript          |               |   Python 3.11         |
       |   Tailwind CSS v4     |               |   PyMuPDF 1.25.5      |
       |   pdf-lib 1.17.1      |               |   Ghostscript 10+     |
       |   React 19.2.4        |               |   boto3 1.38.10       |
       +-----------------------+               +-----------+-----------+
                                                           |
                                                           v
                                               +-----------------------+
                                               |   Cloudflare R2       |
                                               |   Object Storage      |
                                               +-----------------------+
                                               |   Bucket: papyr-files |
                                               |   Lifecycle: 60 min   |
                                               |   Signed URLs         |
                                               |   10 GB/mo free tier  |
                                               +-----------------------+
```

### 2.2 Komponen & Platform

| **Komponen**       | **Platform**     | **URL Produksi**                                    | **Deploy Trigger**          |
|--------------------|------------------|-----------------------------------------------------|-----------------------------|
| Frontend           | Vercel           | https://mypapyr.com                                 | Push ke branch `main`       |
| Backend API        | Railway          | https://papyr-production.up.railway.app             | Push ke branch `main`       |
| Object Storage     | Cloudflare R2    | (Internal — akses via signed URL)                   | Konfigurasi manual          |
| Domain & DNS       | Hostinger        | mypapyr.com                                         | Konfigurasi manual          |
| Analytics          | Vercel Analytics | Dashboard Vercel                                    | Otomatis (SDK terintegrasi) |

### 2.3 Strategi Deployment

| **Aspek**              | **Strategi**                                                      |
|------------------------|-------------------------------------------------------------------|
| Deployment Model       | Continuous Deployment — auto-deploy on push to `main`             |
| Branching Strategy     | `develop` → `main` (merge via PR)                                 |
| Zero-Downtime          | Ya — Vercel immutable deployments, Railway rolling update         |
| Rollback               | Instant — revert ke deployment sebelumnya via dashboard           |
| Environment Isolation  | Production (`main`) terpisah dari development (`develop`)         |

---

## 3. Prasyarat Deployment

### 3.1 Akses & Akun

| **#** | **Prasyarat**                          | **Detail**                                              | **Status** |
|-------|----------------------------------------|---------------------------------------------------------|------------|
| 1     | GitHub Repository Access               | `github.com/fazulfi/papyr` — push access ke `main`      | Required   |
| 2     | Vercel Account                         | Project linked ke repository `papyr/frontend`           | Required   |
| 3     | Railway Account                        | Project linked ke repository `papyr/backend`            | Required   |
| 4     | Cloudflare Account                     | R2 bucket `papyr-files` sudah dikonfigurasi             | Required   |
| 5     | Hostinger Account                      | DNS management untuk domain `mypapyr.com`               | Required   |

### 3.2 Environment Variables — Backend (Railway)

Semua variabel berikut harus dikonfigurasi di Railway project settings. Referensi: `backend/utils/config.py`.

| **Variable** | **Required** | **Default** | **Deskripsi** |
|---|---|---|---|
| `R2_ACCOUNT_ID` | Ya | — | Cloudflare Account ID |
| `R2_ACCESS_KEY_ID` | Ya | — | R2 API Token — Access Key ID |
| `R2_SECRET_ACCESS_KEY` | Ya | — | R2 API Token — Secret Access Key |
| `R2_BUCKET_NAME` | Ya | — | Nama bucket R2 (production: `papyr-files`) |
| `R2_PUBLIC_URL` | Tidak | `""` | Public URL R2 bucket (jika diaktifkan) |
| `CORS_ORIGINS` | Tidak | `https://mypapyr.com,https://frontend-ten-omega-35.vercel.app,http://localhost:3000` | Comma-separated allowed origins |
| `MAX_UPLOAD_SIZE_MB` | Tidak | `20` | Batas upload file dalam MB |
| `FILE_RETENTION_MINUTES` | Tidak | `60` | Durasi retensi file sebelum auto-delete (menit) |
| `RATE_LIMIT_PER_MINUTE` | Tidak | `10` | Rate limit per IP per menit |
| `SUPABASE_URL` | Tidak | `""` | Supabase project URL (standby — Fase 2) |
| `SUPABASE_ANON_KEY` | Tidak | `""` | Supabase anonymous key (standby — Fase 2) |
| `SENTRY_DSN` | Tidak | `""` | Sentry DSN untuk error tracking (opsional) |

### 3.3 Environment Variables — Frontend (Vercel)

| **Variable** | **Required** | **Default** | **Deskripsi** |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Ya | `http://localhost:8000` | URL backend API (production Railway URL) |
| `NEXT_PUBLIC_SITE_URL` | Tidak | — | URL frontend untuk meta tags & OG |
| `NEXT_PUBLIC_SUPABASE_URL` | Tidak | — | Supabase project URL (standby) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tidak | — | Supabase anon key (standby) |

### 3.4 Dependensi Sistem (Backend Docker Image)

| **Dependensi** | **Versi** | **Instalasi di Dockerfile** | **Fungsi** |
|---|---|---|---|
| Python | 3.11 | Base image `python:3.11-slim` | Runtime backend |
| Ghostscript | 10+ | `apt-get install -y ghostscript` | PDF compression engine |
| uvicorn | 0.34.2 | `pip install` via requirements.txt | ASGI server |
| FastAPI | 0.115.12 | `pip install` via requirements.txt | Web framework |
| PyMuPDF | 1.25.5 | `pip install` via requirements.txt | PDF rendering & conversion |
| boto3 | 1.38.10 | `pip install` via requirements.txt | S3-compatible client (R2) |
| Pillow | 11.2.1 | `pip install` via requirements.txt | Image processing |
| slowapi | 0.1.9 | `pip install` via requirements.txt | Rate limiting |
| python-multipart | 0.0.20 | `pip install` via requirements.txt | File upload handling |
| python-dotenv | 1.1.0 | `pip install` via requirements.txt | Environment variable loading |

### 3.5 Dependensi Frontend (Node.js)

| **Dependensi** | **Versi** | **Fungsi** |
|---|---|---|
| Next.js | 16.2.4 | React framework (SSR + Static) |
| React | 19.2.4 | UI library |
| pdf-lib | 1.17.1 | Client-side PDF operations |
| @dnd-kit/core | 6.3.1 | Drag-and-drop functionality |
| @dnd-kit/sortable | 10.0.0 | Sortable list untuk file reorder |
| @vercel/analytics | 2.0.1 | Vercel Analytics SDK |
| @vercel/speed-insights | 2.0.0 | Vercel Speed Insights SDK |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS framework |

---

## 4. Prosedur Deployment — Frontend

### 4.1 Alur Deployment (Auto-Deploy)

```
Developer Push -> GitHub main branch -> Vercel Webhook -> Build & Deploy -> Live
```

### 4.2 Langkah-Langkah Deployment

| **#** | **Langkah** | **Penanggung Jawab** | **Estimasi Waktu** |
|---|---|---|---|
| 1 | Pastikan semua perubahan sudah di-merge ke branch `develop` | Developer | — |
| 2 | Buat Pull Request dari `develop` ke `main` | Developer | 2 menit |
| 3 | Review PR — pastikan tidak ada breaking changes | Product Owner | 5 menit |
| 4 | Merge PR ke `main` | Developer | 1 menit |
| 5 | Vercel otomatis mendeteksi push dan memulai build | Vercel (Otomatis) | — |
| 6 | Tunggu build selesai (monitor di Vercel Dashboard) | Developer | 1-3 menit |
| 7 | Verifikasi deployment berhasil (status: Ready) | Developer | 1 menit |
| 8 | Akses https://mypapyr.com dan lakukan smoke test | Developer | 3 menit |

### 4.3 Prosedur Detail

**Langkah 1-4: Merge ke Main**

```bash
# Pastikan branch develop up-to-date
git checkout develop
git pull origin develop

# Buat PR via GitHub CLI atau GitHub Web
gh pr create --base main --head develop --title "Release: [deskripsi singkat]"

# Setelah review, merge PR
gh pr merge [PR_NUMBER] --merge
```

**Langkah 5-6: Monitor Build di Vercel**

1. Buka https://vercel.com/dashboard
2. Pilih project Papyr frontend
3. Tab "Deployments" — pastikan build terbaru berstatus "Building..."
4. Tunggu hingga status berubah menjadi "Ready" (hijau)

**Langkah 7-8: Verifikasi**

1. Buka https://mypapyr.com
2. Pastikan halaman landing page ter-load dengan benar
3. Cek Console browser — tidak ada error JavaScript
4. Test satu tool (misal: Compress PDF) end-to-end

### 4.4 Environment Variables di Vercel

Konfigurasi melalui: **Vercel Dashboard > Project Settings > Environment Variables**

Nilai production yang harus di-set:

```
NEXT_PUBLIC_API_URL = https://papyr-production.up.railway.app
NEXT_PUBLIC_SITE_URL = https://mypapyr.com
```

> **PENTING:** Setiap perubahan environment variable memerlukan re-deployment agar efektif. Trigger redeploy melalui Vercel Dashboard jika hanya mengubah env vars tanpa code change.

### 4.5 Build Configuration (Vercel)

| **Setting** | **Nilai** |
|---|---|
| Framework Preset | Next.js |
| Root Directory | `frontend` |
| Build Command | `next build` |
| Output Directory | `.next` |
| Install Command | `npm install` |
| Node.js Version | 20.x |

### 4.6 Rollback Frontend

Lihat [Bagian 8.1](#81-rollback-frontend-vercel) untuk prosedur rollback lengkap.

---

## 5. Prosedur Deployment — Backend

### 5.1 Alur Deployment (Auto-Deploy)

```
Developer Push -> GitHub main branch -> Railway Webhook -> Docker Build -> Deploy -> Live
```

### 5.2 Langkah-Langkah Deployment

| **#** | **Langkah** | **Penanggung Jawab** | **Estimasi Waktu** |
|---|---|---|---|
| 1 | Pastikan semua perubahan backend sudah di-merge ke `develop` | Developer | — |
| 2 | Buat Pull Request dari `develop` ke `main` | Developer | 2 menit |
| 3 | Review PR — pastikan Dockerfile dan requirements.txt valid | Product Owner | 5 menit |
| 4 | Merge PR ke `main` | Developer | 1 menit |
| 5 | Railway otomatis mendeteksi push dan memulai Docker build | Railway (Otomatis) | — |
| 6 | Tunggu build selesai (monitor di Railway Dashboard) | Developer | 2-5 menit |
| 7 | Verifikasi deployment berhasil (status: Active) | Developer | 1 menit |
| 8 | Hit health check endpoint untuk konfirmasi | Developer | 1 menit |
| 9 | Lakukan smoke test API endpoints | Developer | 3 menit |

### 5.3 Prosedur Detail

**Langkah 1-4: Merge ke Main**

```bash
# Sama dengan frontend - merge develop ke main via PR
git checkout develop
git pull origin develop
gh pr create --base main --head develop --title "Backend Release: [deskripsi]"
gh pr merge [PR_NUMBER] --merge
```

**Langkah 5-6: Monitor Build di Railway**

1. Buka https://railway.app/dashboard
2. Pilih project Papyr backend
3. Tab "Deployments" — pastikan build terbaru berstatus "Building"
4. Perhatikan log build:
   - Docker multi-stage build (Stage 1: dependencies, Stage 2: runtime)
   - Instalasi Ghostscript via `apt-get`
   - Instalasi Python packages via `pip`
5. Tunggu hingga status berubah menjadi "Active" (hijau)

**Langkah 7-8: Health Check**

```bash
# Hit health check endpoint
curl -s https://papyr-production.up.railway.app/health | python -m json.tool
```

Response yang diharapkan:

```json
{
    "status": "ok",
    "version": "1.1.0",
    "timestamp": "2026-06-01T00:00:00.000000+00:00"
}
```

**Langkah 9: Smoke Test API**

```bash
# Test connectivity endpoint
curl -s https://papyr-production.up.railway.app/connectivity/r2

# Test compress endpoint (dengan file sample)
curl -X POST https://papyr-production.up.railway.app/api/compress \
  -F "file=@sample.pdf" \
  -F "quality=medium"
```

### 5.4 Ghostscript Dependency

Ghostscript adalah dependensi sistem kritikal yang **HARUS** tersedia di Docker image. Tanpa Ghostscript, fitur Compress PDF tidak akan berfungsi.

**Verifikasi di Dockerfile (`backend/Dockerfile`):**

```dockerfile
# Stage 2: Runtime
FROM python:3.11-slim
WORKDIR /app

# Install Ghostscript for server-side PDF compression
RUN apt-get update && \
    apt-get install -y --no-install-recommends ghostscript && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

**Verifikasi setelah deployment:**

```bash
# Test compress endpoint - jika berhasil, Ghostscript terinstall
curl -X POST https://papyr-production.up.railway.app/api/compress \
  -F "file=@test.pdf" \
  -F "quality=medium"
```

Jika response error "Ghostscript not found", periksa Dockerfile dan rebuild.

### 5.5 Environment Variables di Railway

Konfigurasi melalui: **Railway Dashboard > Project > Variables**

Nilai production yang WAJIB di-set:

```
R2_ACCOUNT_ID       = [cloudflare-account-id]
R2_ACCESS_KEY_ID    = [r2-access-key]
R2_SECRET_ACCESS_KEY = [r2-secret-key]
R2_BUCKET_NAME      = papyr-files
CORS_ORIGINS        = https://mypapyr.com,https://frontend-ten-omega-35.vercel.app
```

> **PENTING:** Railway otomatis me-restart service setelah environment variable diubah. Tidak perlu manual redeploy.

### 5.6 Railway Build Configuration

| **Setting** | **Nilai** |
|---|---|
| Builder | Dockerfile |
| Dockerfile Path | `backend/Dockerfile` |
| Watch Paths | `backend/**` |
| Start Command | `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1` |
| Health Check Path | `/health` |
| Port | `8080` (Railway auto-assigns via `$PORT`) |
| Region | us-west2 |

### 5.7 Rollback Backend

Lihat [Bagian 8.2](#82-rollback-backend-railway) untuk prosedur rollback lengkap.

---

## 6. Konfigurasi Cloudflare R2

### 6.1 Informasi Bucket

| **Parameter** | **Nilai** |
|---|---|
| Bucket Name | `papyr-files` |
| Region | Auto (Cloudflare global) |
| Storage Class | Standard |
| Access | Private (signed URLs only) |
| Free Tier | 10 GB storage, 10 juta Class B ops, 1 juta Class A ops |

### 6.2 Setup Bucket Baru

Jika perlu membuat bucket baru (misal: migrasi atau disaster recovery):

| **#** | **Langkah** |
|---|---|
| 1 | Login ke Cloudflare Dashboard > R2 Object Storage |
| 2 | Klik "Create Bucket" |
| 3 | Nama bucket: `papyr-files` |
| 4 | Location hint: Automatic (biarkan Cloudflare memilih) |
| 5 | Default storage class: Standard |
| 6 | Klik "Create Bucket" |
| 7 | Konfigurasi CORS (lihat 6.3) |
| 8 | Konfigurasi Lifecycle Rules (lihat 6.4) |
| 9 | Buat API Token (lihat 6.5) |

### 6.3 Konfigurasi CORS

Navigasi: **R2 Bucket > Settings > CORS Policy**

```json
[
  {
    "AllowedOrigins": [
      "https://mypapyr.com",
      "https://frontend-ten-omega-35.vercel.app",
      "http://localhost:3000"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "Content-Length",
      "Content-Type",
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

> **PENTING:** Pastikan `AllowedOrigins` mencakup semua domain frontend yang valid. Jangan gunakan wildcard `*` di production untuk keamanan.

### 6.4 Lifecycle Rules (Auto-Delete)

Konfigurasi lifecycle rule untuk auto-delete file setelah 60 menit. Ini adalah mekanisme keamanan utama (BR-003, BR-004 di PPR-BRD-001).

**Navigasi:** R2 Bucket > Settings > Object Lifecycle Rules

| **Rule** | **Konfigurasi** |
|---|---|
| Rule Name | `auto-delete-24h` (nama lama: `auto-delete-60min` — R2 minimum 1 hari, enforcement ketat 60 menit oleh cron backend) |
| Scope | Apply to all objects in bucket |
| Action | Delete objects |
| Condition | Days since object creation: 1 (minimum R2 allows) |

> **CATATAN:** R2 lifecycle rules memiliki granularitas minimum 1 hari. Untuk enforcement 60 menit yang ketat, backend menggunakan cron job fallback (`cleanup_expired_files`) yang berjalan setiap 30 menit dan menghapus file yang lebih tua dari `FILE_RETENTION_MINUTES` (default: 60 menit).

**Double Safety Mechanism:**

1. **R2 Lifecycle Rule** — Menghapus semua objek setelah 1 hari (safety net)
2. **Backend Cron Job** — Menghapus file expired setiap 30 menit (enforcement ketat 60 menit)

### 6.5 Access Credentials

Untuk membuat API Token baru:

| **#** | **Langkah** |
|---|---|
| 1 | Cloudflare Dashboard > R2 > Overview > Manage R2 API Tokens |
| 2 | Klik "Create API Token" |
| 3 | Token name: `papyr-backend-production` |
| 4 | Permissions: Object Read & Write |
| 5 | Specify bucket: `papyr-files` |
| 6 | TTL: No expiration (atau sesuai kebijakan rotasi) |
| 7 | Klik "Create API Token" |
| 8 | Catat `Access Key ID` dan `Secret Access Key` (hanya ditampilkan 1x) |
| 9 | Update environment variables di Railway |

> **KEAMANAN:** Secret Access Key hanya ditampilkan sekali saat pembuatan. Simpan di password manager. Jika hilang, buat token baru dan update env vars.

### 6.6 Verifikasi Konektivitas R2

Setelah konfigurasi, verifikasi konektivitas dari backend:

```bash
# Hit connectivity test endpoint
curl -s https://papyr-production.up.railway.app/connectivity/r2
```

Response yang diharapkan:

```json
{
    "status": "connected",
    "bucket": "papyr-files"
}
```

---

## 7. Verifikasi Post-Deployment

### 7.1 Health Check Endpoints

| **#** | **Endpoint** | **Expected Response** | **Aksi Jika Gagal** |
|---|---|---|---|
| 1 | `GET /health` | `{"status": "ok", "version": "1.1.0"}` | Cek Railway logs |
| 2 | `GET /connectivity/r2` | `{"status": "connected"}` | Cek R2 credentials |
| 3 | `GET https://mypapyr.com` | HTTP 200, halaman landing | Cek Vercel deployment status |

### 7.2 Smoke Test — Setiap Tool

Lakukan smoke test untuk memastikan setiap tool berfungsi setelah deployment:

| **#** | **Tool** | **Test Scenario** | **Expected Result** |
|---|---|---|---|
| 1 | Compress PDF | Upload PDF 2MB, pilih quality "medium", klik Compress | File terkompresi berhasil di-download |
| 2 | Merge PDF | Upload 2 file PDF, atur urutan, klik Merge | File merged berhasil di-download |
| 3 | Split PDF | Upload PDF 5 halaman, input range "1-3", klik Split | File split (3 halaman) berhasil di-download |
| 4 | Image to PDF | Upload 2 gambar JPG, klik Convert | File PDF berhasil di-download |
| 5 | PDF to Image | Upload PDF 2 halaman, pilih semua, klik Convert | ZIP berisi 2 PNG berhasil di-download |
| 6 | Rotate PDF | Upload PDF, rotate 90 derajat, klik Apply | File rotated berhasil di-download |

### 7.3 Verifikasi Analytics

| **#** | **Verifikasi** | **Cara Cek** |
|---|---|---|
| 1 | Vercel Analytics menerima event | Vercel Dashboard > Analytics > Real-time |
| 2 | Event `task_started` tercatat saat user mulai operasi | Cek event log di Analytics dashboard |
| 3 | Event `task_completed` tercatat saat operasi berhasil | Cek event log di Analytics dashboard |
| 4 | Speed Insights aktif | Vercel Dashboard > Speed Insights |

### 7.4 Verifikasi Cleanup Cron

| **#** | **Verifikasi** | **Cara Cek** |
|---|---|---|
| 1 | Cleanup cron berjalan (interval 30 menit) | Railway logs: "Cleanup cron started" |
| 2 | File expired terhapus otomatis | Upload file, tunggu 60+ menit, cek R2 |
| 3 | Log cleanup success tercatat | Railway logs: cari "cleanup" entries |

### 7.5 Verifikasi Keamanan

| **#** | **Verifikasi** | **Cara Cek** |
|---|---|---|
| 1 | CORS hanya mengizinkan origin yang terdaftar | Test request dari origin tidak terdaftar |
| 2 | Rate limiting aktif (10 req/min/IP) | Kirim 11 request berturut-turut |
| 3 | File upload validation (MIME + ext + magic bytes) | Upload file non-PDF ke endpoint compress |
| 4 | Signed URL expiry berfungsi | Akses signed URL setelah expired |

---

## 8. Prosedur Rollback

### 8.1 Rollback Frontend (Vercel)

Vercel menyimpan semua deployment sebelumnya sebagai immutable snapshots. Rollback bersifat instant.

**Prosedur:**

| **#** | **Langkah** | **Estimasi Waktu** |
|---|---|---|
| 1 | Buka Vercel Dashboard > Project > Deployments | — |
| 2 | Temukan deployment terakhir yang stabil (status: Ready, sebelum deploy terbaru) | 1 menit |
| 3 | Klik menu "..." pada deployment tersebut | — |
| 4 | Pilih "Promote to Production" | — |
| 5 | Konfirmasi promote | — |
| 6 | Tunggu propagasi (biasanya < 30 detik) | 30 detik |
| 7 | Verifikasi https://mypapyr.com menampilkan versi sebelumnya | 1 menit |

**Total waktu rollback: < 3 menit**

### 8.2 Rollback Backend (Railway)

Railway menyimpan history deployment. Rollback dilakukan dengan redeploy versi sebelumnya.

**Prosedur:**

| **#** | **Langkah** | **Estimasi Waktu** |
|---|---|---|
| 1 | Buka Railway Dashboard > Project > Deployments | — |
| 2 | Temukan deployment terakhir yang stabil (status: Active, sebelum deploy terbaru) | 1 menit |
| 3 | Klik pada deployment tersebut | — |
| 4 | Klik "Redeploy" atau "Rollback" | — |
| 5 | Tunggu container baru aktif | 2-3 menit |
| 6 | Verifikasi health check: `GET /health` | 1 menit |
| 7 | Lakukan smoke test API | 2 menit |

**Total waktu rollback: < 7 menit**

### 8.3 Rollback via Git (Alternatif)

Jika rollback via dashboard tidak memungkinkan:

```bash
# Revert commit terakhir di main
git checkout main
git pull origin main
git revert HEAD --no-edit
git push origin main

# Auto-deploy akan trigger dengan reverted code
```

### 8.4 Prosedur Darurat (Emergency)

Untuk situasi kritis yang memerlukan tindakan segera:

| **Severity** | **Kondisi** | **Aksi Segera** |
|---|---|---|
| P1 Critical | Seluruh sistem down | Rollback KEDUA komponen (frontend + backend) |
| P1 Critical | Data breach / file tidak terhapus | Disable R2 bucket access, manual delete semua file |
| P2 High | Backend down, frontend OK | Rollback backend saja |
| P2 High | Frontend error, backend OK | Rollback frontend saja |
| P3 Medium | Satu tool tidak berfungsi | Investigasi log, hotfix jika memungkinkan |
| P4 Low | Performance degradation | Monitor, schedule fix di sprint berikutnya |

---

## 9. Monitoring Post-Deployment

### 9.1 Vercel Analytics Dashboard

| **Metrik** | **Lokasi** | **Threshold Alert** |
|---|---|---|
| Page Views | Vercel > Analytics > Overview | Baseline monitoring |
| Unique Visitors | Vercel > Analytics > Overview | Baseline monitoring |
| Top Pages | Vercel > Analytics > Pages | — |
| Web Vitals (LCP, FID, CLS) | Vercel > Speed Insights | LCP > 2.5s = investigasi |
| Custom Events | Vercel > Analytics > Events | task_failed > 5% = alert |

### 9.2 Railway Logs

| **Log Type** | **Lokasi** | **Yang Dicari** |
|---|---|---|
| Application Logs | Railway > Project > Logs | Error, Exception, Traceback |
| Build Logs | Railway > Deployments > Build Log | Build failures |
| Cleanup Cron Logs | Railway > Project > Logs | "Cleanup loop error" |
| Rate Limit Logs | Railway > Project > Logs | 429 responses |

**Contoh log yang perlu diperhatikan:**

```
ERROR - Cleanup loop error: [detail error]
ERROR - R2 upload failed: [detail error]
WARNING - Rate limit exceeded for IP: [ip]
```

### 9.3 Cloudflare R2 Storage Metrics

| **Metrik** | **Lokasi** | **Threshold** |
|---|---|---|
| Total Objects | Cloudflare > R2 > Bucket > Metrics | < 1000 (jika > 1000, cleanup mungkin gagal) |
| Storage Used | Cloudflare > R2 > Bucket > Metrics | < 5 GB (free tier: 10 GB) |
| Class A Operations | Cloudflare > R2 > Overview | < 500K/bulan (free tier: 1M) |
| Class B Operations | Cloudflare > R2 > Overview | < 5M/bulan (free tier: 10M) |

### 9.4 Jadwal Monitoring Rutin

| **Frekuensi** | **Aktivitas** | **Penanggung Jawab** |
|---|---|---|
| Harian | Cek Railway logs untuk error | Developer |
| Harian | Cek R2 object count (pastikan cleanup berjalan) | Developer |
| Mingguan | Review Vercel Analytics — traffic & events | Product Owner |
| Mingguan | Review Speed Insights — Web Vitals | Developer |
| Bulanan | Review biaya infrastruktur (Railway, R2) | Product Owner |
| Bulanan | Audit environment variables & credentials | Developer |

---

## 10. Checklist Deployment

### 10.1 Pre-Deployment Checklist

| **#** | **Item** | **Status** |
|---|---|---|
| 1 | Semua perubahan sudah di-commit dan push ke `develop` | [ ] |
| 2 | Semua test lokal passed (frontend: `npm run build`, backend: manual test) | [ ] |
| 3 | PR dari `develop` ke `main` sudah dibuat | [ ] |
| 4 | PR sudah di-review (code review) | [ ] |
| 5 | Environment variables sudah dikonfigurasi (jika ada perubahan) | [ ] |
| 6 | Tidak ada breaking changes pada API contract | [ ] |
| 7 | Dockerfile valid (jika ada perubahan backend) | [ ] |
| 8 | requirements.txt up-to-date (jika ada dependency baru) | [ ] |
| 9 | package.json up-to-date (jika ada dependency baru) | [ ] |
| 10 | CHANGELOG.md sudah diupdate | [ ] |

### 10.2 Deployment Checklist

| **#** | **Item** | **Status** |
|---|---|---|
| 1 | PR di-merge ke `main` | [ ] |
| 2 | Vercel build berhasil (frontend) | [ ] |
| 3 | Railway build berhasil (backend) | [ ] |
| 4 | Health check `GET /health` mengembalikan `{"status": "ok"}` | [ ] |
| 5 | R2 connectivity check berhasil | [ ] |
| 6 | Frontend accessible di https://mypapyr.com | [ ] |

### 10.3 Post-Deployment Checklist

| **#** | **Item** | **Status** |
|---|---|---|
| 1 | Smoke test: Compress PDF berhasil | [ ] |
| 2 | Smoke test: Merge PDF berhasil | [ ] |
| 3 | Smoke test: Split PDF berhasil | [ ] |
| 4 | Smoke test: Image to PDF berhasil | [ ] |
| 5 | Smoke test: PDF to Image berhasil | [ ] |
| 6 | Smoke test: Rotate PDF berhasil | [ ] |
| 7 | Vercel Analytics menerima event | [ ] |
| 8 | Cleanup cron berjalan (cek Railway logs) | [ ] |
| 9 | CORS berfungsi dengan benar | [ ] |
| 10 | Rate limiting aktif | [ ] |
| 11 | Mobile responsiveness OK | [ ] |
| 12 | SEO meta tags valid (cek via browser dev tools) | [ ] |

---

## 11. Kontak Darurat & Eskalasi

### 11.1 Kontak Tim

| **Peran** | **Nama** | **Kontak** | **Tanggung Jawab** |
|---|---|---|---|
| Product Owner | Muhammad Fa’iz Zulfikar | [email/phone] | Keputusan bisnis, approval deployment |
| AI Agent | OpenCode/Sisyphus | Via development environment | Eksekusi teknis, troubleshooting |

### 11.2 Kontak Platform

| **Platform** | **Support Channel** | **SLA** |
|---|---|---|
| Vercel | https://vercel.com/support | Sesuai plan |
| Railway | https://railway.app/support | Sesuai plan |
| Cloudflare | https://dash.cloudflare.com/support | Sesuai plan |
| Hostinger | https://www.hostinger.co.id/bantuan | 24/7 live chat |
| GitHub | https://support.github.com | Sesuai plan |

### 11.3 Prosedur Eskalasi

| **Level** | **Kondisi** | **Aksi** | **Waktu Respons** |
|---|---|---|---|
| L1 | Tool individual tidak berfungsi | Developer investigasi & hotfix | < 1 jam |
| L2 | Backend atau frontend down | Rollback + investigasi | < 30 menit |
| L3 | Seluruh sistem down | Rollback semua komponen + eskalasi ke platform support | < 15 menit |
| L4 | Data breach / security incident | Disable semua akses + manual cleanup + eskalasi | Segera |

### 11.4 Incident Response Template

Untuk setiap insiden, dokumentasikan:

```
## Incident Report

- **Tanggal/Waktu:** [YYYY-MM-DD HH:MM WIB]
- **Severity:** [P1/P2/P3/P4]
- **Komponen Terdampak:** [Frontend/Backend/R2/DNS]
- **Deskripsi:** [Apa yang terjadi]
- **Root Cause:** [Penyebab utama]
- **Resolution:** [Langkah penyelesaian]
- **Durasi Downtime:** [Berapa lama]
- **Action Items:** [Langkah pencegahan ke depan]
```

---

## 12. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Deployment Runbook ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan prosedur deployment untuk Papyr.

|                   |                              |               |            |
|:------------------|:-----------------------------|:--------------|:-----------|
| **Peran**         | **Nama**                     | **Tanda Tangan** | **Tanggal** |
| **Product Owner** | Muhammad Fa’iz Zulfikar      | Approved      | 2026-06-01 |
| **AI Agent**      | OpenCode/Sisyphus            | Approved      | 2026-06-01 |

Dokumen ini dapat berubah. Setiap modifikasi harus ditinjau dan disetujui ulang oleh semua penandatangan.
