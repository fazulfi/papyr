# PAPYR — ONBOARDING GUIDE FOR AI AGENTS

<div align="center">

# Panduan Onboarding Agen AI

**Papyr Project**

*Tool PDF gratis, cepat, dan aman untuk Indonesia*

Versi 1.0 | Juni 2026

</div>

---

## Informasi Dokumen

| Field | Detail |
|-------|--------|
| **Judul** | Panduan Onboarding Agen AI |
| **ID Dokumen** | PPR-OBG-001 |
| **Versi** | 1.0 |
| **Status** | Approved |
| **Tanggal Dibuat** | 2026-06-03 |
| **Tanggal Diperbarui** | 2026-06-03 |
| **Penulis** | OpenCode AI Agent (Sisyphus) |
| **Reviewer** | Muhammad Fa'iz Zulfikar |
| **Approver** | Muhammad Fa'iz Zulfikar |
| **Kerahasiaan** | Internal |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi Perubahan |
|-------|---------|---------|---------------------|
| 1.0 | 2026-06-03 | OpenCode AI Agent (Sisyphus) | Dokumen awal, mencakup seluruh konteks proyek Papyr untuk onboarding agen AI baru |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Gambaran Proyek](#2-gambaran-proyek)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Struktur Kode](#4-struktur-kode)
5. [Setup Development Environment](#5-setup-development-environment)
6. [Alur Kerja Git](#6-alur-kerja-git)
7. [Konvensi Kode](#7-konvensi-kode)
8. [Tool Processing Boundary](#8-tool-processing-boundary)
9. [Keamanan & Privasi](#9-keamanan--privasi)
10. [Testing](#10-testing)
11. [Deployment](#11-deployment)
12. [Dokumen Referensi](#12-dokumen-referensi)
13. [Checklist Onboarding](#13-checklist-onboarding)

---

## §1 Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini dibuat sebagai panduan komprehensif bagi agen AI (OpenCode/Sisyphus atau agen serupa) yang baru bergabung dalam pengembangan proyek Papyr. Tujuannya adalah memberikan konteks lengkap agar agen dapat langsung produktif tanpa perlu eksplorasi berulang terhadap codebase.

### 1.2 Ruang Lingkup

Panduan ini mencakup:

- Gambaran umum proyek dan domain bisnis
- Arsitektur teknis dan keputusan desain
- Struktur kode dan konvensi
- Alur kerja pengembangan dan deployment
- Batasan keamanan dan privasi
- Referensi ke seluruh dokumentasi enterprise yang tersedia

### 1.3 Target Pembaca

**Agen AI** yang beroperasi sebagai developer pada proyek ini. Bukan manusia. Dokumen ini mengasumsikan pembaca memiliki kemampuan membaca kode, mengeksekusi perintah terminal, dan memahami arsitektur web modern. Tidak ada instruksi terkait HR, akses fisik, atau onboarding manusia.

### 1.4 Model Pengembangan

Proyek Papyr dikembangkan 100% oleh AI agent di bawah supervisi Muhammad Fa'iz Zulfikar sebagai founder dan product owner. Setiap keputusan arsitektur, implementasi fitur, dan penulisan dokumentasi dilakukan oleh agen AI.

---

## §2 Gambaran Proyek

### 2.1 Apa Itu Papyr

Papyr adalah aplikasi web tool PDF gratis yang ditargetkan untuk pengguna Indonesia. Aplikasi ini menyediakan enam tool utama untuk manipulasi file PDF tanpa perlu registrasi atau pembayaran.

### 2.2 Identitas Proyek

| Atribut | Nilai |
|---------|-------|
| Nama | Papyr |
| Domain | mypapyr.com |
| Tagline | "Tool PDF gratis, cepat, dan aman untuk Indonesia" |
| Versi Saat Ini | v1.1.0 (M01-M11 complete) |
| Bahasa UI | Bahasa Indonesia |
| Founder | Muhammad Fa'iz Zulfikar |

### 2.3 Fitur Utama (6 Tools)

1. **Compress PDF** — Mengecilkan ukuran file PDF
2. **Merge PDF** — Menggabungkan beberapa PDF menjadi satu
3. **Split PDF** — Memisahkan PDF menjadi beberapa file
4. **Rotate PDF** — Memutar halaman PDF
5. **Image to PDF** — Mengonversi gambar menjadi PDF
6. **PDF to Image** — Mengonversi halaman PDF menjadi gambar

### 2.4 Proposisi Nilai

- Gratis tanpa batasan (no paywall, no registration)
- Cepat karena processing client-side untuk tool ringan
- Aman karena file dihapus otomatis dalam 60 menit
- Dioptimalkan untuk pengguna Indonesia (bahasa, UX, kecepatan akses)

---

## §3 Arsitektur Sistem

### 3.1 Diagram Tingkat Tinggi

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser/User  │────▶│  Frontend (Vercel)│────▶│ Backend (Railway)│
│                 │◀────│  Next.js 16       │◀────│ FastAPI          │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                           │
                                                           ▼
                                                  ┌─────────────────┐
                                                  │ Cloudflare R2    │
                                                  │ (File Storage)   │
                                                  └─────────────────┘
```

### 3.2 Komponen Utama

| Komponen | Teknologi | Hosting | Biaya |
|----------|-----------|---------|-------|
| Frontend | Next.js 16.2.4 | Vercel | Free tier |
| Backend | FastAPI (Python) | Railway | $5/bulan |
| Storage | Cloudflare R2 | Cloudflare | Free tier |
| Analytics | Vercel Analytics | Vercel | Free tier |
| DNS/CDN | Cloudflare | Cloudflare | Free tier |

### 3.3 Rencana Masa Depan

PostgreSQL pada HostData.id VPS direncanakan untuk proyek OpenClaw (fitur terpisah). Saat ini Papyr tidak memerlukan database relasional karena tidak menyimpan data pengguna.

### 3.4 Tech Stack Detail

**Frontend:**
- Next.js 16.2.4 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- pdf-lib (client-side PDF manipulation)
- Bun sebagai package manager

**Backend:**
- Python 3.11+
- FastAPI
- Ghostscript (PDF compression)
- PyMuPDF/fitz (PDF to image conversion)
- Pillow (image processing)
- boto3 (S3-compatible client untuk R2)

---

## §4 Struktur Kode

### 4.1 Frontend (`frontend/`)

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout (font, metadata, analytics)
│   │   ├── page.tsx            # Homepage
│   │   ├── compress/           # Tool: Compress PDF
│   │   ├── merge/              # Tool: Merge PDF
│   │   ├── split/              # Tool: Split PDF
│   │   ├── rotate/             # Tool: Rotate PDF
│   │   ├── image-to-pdf/       # Tool: Image to PDF
│   │   └── pdf-to-image/       # Tool: PDF to Image
│   ├── components/             # Reusable UI components
│   │   ├── ui/                 # Base UI primitives
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Site footer
│   │   └── FileUpload.tsx      # Drag-and-drop upload component
│   ├── lib/                    # Utility functions
│   │   ├── api.ts              # Backend API client
│   │   └── utils.ts            # Helper functions
│   ├── __tests__/              # Vitest test files (23 tests)
│   └── styles/                 # Global CSS
├── public/                     # Static assets
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind theme configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies dan scripts
└── vitest.config.ts            # Test configuration
```

### 4.2 Backend (`backend/`)

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point, CORS config
│   ├── routers/                # API route handlers
│   │   ├── compress.py         # POST /api/compress
│   │   ├── image_to_pdf.py     # POST /api/image-to-pdf
│   │   └── pdf_to_image.py     # POST /api/pdf-to-image
│   ├── services/               # Business logic
│   │   ├── compress_service.py # Ghostscript integration
│   │   ├── image_service.py    # Image conversion logic
│   │   └── storage_service.py  # R2 upload/download
│   └── utils/                  # Shared utilities
│       ├── validation.py       # File validation (MIME, magic bytes)
│       └── config.py           # Environment configuration
├── tests/                      # pytest test files (34 tests)
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container configuration
└── railway.toml                # Railway deployment config
```

### 4.3 File Kunci dan Fungsinya

| File | Fungsi |
|------|--------|
| `frontend/src/app/layout.tsx` | Root layout, DM Sans font loading, metadata SEO |
| `frontend/src/lib/api.ts` | Abstraksi komunikasi ke backend API |
| `backend/app/main.py` | Entry point FastAPI, middleware CORS, rate limiting |
| `backend/app/services/storage_service.py` | Interaksi dengan Cloudflare R2 via boto3 |
| `.github/workflows/ci.yml` | Pipeline CI/CD GitHub Actions |

---

## §5 Setup Development Environment

### 5.1 Prasyarat

| Tool | Versi Minimum | Kegunaan |
|------|---------------|----------|
| Node.js | 20+ | Runtime JavaScript |
| Bun | 1.0+ | Package manager frontend |
| Python | 3.11+ | Runtime backend |
| Ghostscript | 10.0+ | PDF compression engine |

### 5.2 Setup Frontend

```bash
cd frontend
bun install
bun run dev
```

Frontend akan berjalan di `http://localhost:3000`.

### 5.3 Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau: venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend akan berjalan di `http://localhost:8000`.

### 5.4 Environment Variables

**Frontend** (`.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Backend** (`.env`):

```env
R2_ACCOUNT_ID=<cloudflare_account_id>
R2_ACCESS_KEY_ID=<r2_access_key>
R2_SECRET_ACCESS_KEY=<r2_secret_key>
R2_BUCKET_NAME=papyr-files
ALLOWED_ORIGINS=http://localhost:3000,https://mypapyr.com
```

### 5.5 Catatan untuk Agen AI

Saat bekerja di environment development, pastikan:
- Jalankan `bun install` setelah mengubah `package.json`
- Jalankan `pip install -r requirements.txt` setelah menambah dependency Python
- Periksa bahwa Ghostscript terinstall jika menguji fitur compress

---

## §6 Alur Kerja Git

### 6.1 Strategi Branching

| Branch | Fungsi |
|--------|--------|
| `main` | Branch produksi, auto-deploy ke Vercel |
| `develop` | Branch pengembangan aktif |

### 6.2 Gaya Commit

Gunakan semantic commit messages dalam **Bahasa Inggris**:

```
feat: add PDF rotation tool
fix: resolve file upload timeout on large files
docs: update API documentation
refactor: simplify compression service logic
test: add unit tests for merge functionality
chore: update dependencies
style: fix linting issues
perf: optimize image conversion memory usage
```

Format: `<type>: <description in lowercase English>`

### 6.3 Alur Pull Request

1. Buat branch dari `develop` dengan nama deskriptif
2. Implementasi perubahan dengan commit atomik
3. Pastikan CI pass (lint, test, build)
4. Buat PR ke `develop`
5. Setelah review, merge ke `develop`
6. Periodically merge `develop` ke `main` untuk release

### 6.4 CI/CD Pipeline

File: `.github/workflows/ci.yml`

Pipeline menjalankan:

**Frontend:**
- ESLint (linting)
- Vitest (unit tests)
- `next build` (build verification)

**Backend:**
- pytest (unit + integration tests)

Kedua job harus pass sebelum PR dapat di-merge.

---

## §7 Konvensi Kode

### 7.1 TypeScript

- Mode `strict` aktif di `tsconfig.json`
- Semua variabel dan parameter harus memiliki tipe eksplisit
- Hindari `any`, gunakan `unknown` jika tipe tidak diketahui
- Prefer `interface` untuk object shapes, `type` untuk unions/intersections

### 7.2 Linting

- ESLint 9 dengan flat config (`eslint.config.mjs`)
- Tidak ada warning yang dibiarkan, semua harus resolved
- Prettier tidak digunakan (formatting via ESLint rules)

### 7.3 Styling dan Design System

| Elemen | Nilai |
|--------|-------|
| Font | DM Sans (Google Fonts) |
| Warna Navy | `#1E3A5F` |
| Warna Accent | `#2563EB` |
| Warna Background | `#F9FAFB` |
| UI Style | Vercel-style (clean, minimal, modern) |
| Framework CSS | Tailwind CSS 4 |

### 7.4 Prinsip UI

- Clean dan minimal, terinspirasi dari Vercel/Linear
- Spacing konsisten menggunakan Tailwind spacing scale
- Rounded corners (`rounded-lg` atau `rounded-xl`)
- Shadow halus untuk card elevation
- Transisi smooth pada hover dan state changes
- Mobile-first responsive design

### 7.5 Penamaan

| Konteks | Konvensi | Contoh |
|---------|----------|--------|
| Komponen React | PascalCase | `FileUpload.tsx` |
| Utility functions | camelCase | `formatFileSize()` |
| API routes (backend) | snake_case | `compress_service.py` |
| CSS classes | Tailwind utility | `className="flex items-center"` |
| Environment vars | UPPER_SNAKE_CASE | `R2_BUCKET_NAME` |

---

## §8 Tool Processing Boundary

### 8.1 Prinsip Desain

Papyr menggunakan pendekatan hybrid: tool ringan diproses di browser (client-side) untuk kecepatan dan privasi, sementara tool berat diproses di server.

### 8.2 Matriks Processing

| Tool | Lokasi | Library | Alasan |
|------|--------|---------|--------|
| Merge PDF | Client | pdf-lib | Operasi ringan, tidak perlu server |
| Split PDF | Client | pdf-lib | Operasi ringan, tidak perlu server |
| Rotate PDF | Client | pdf-lib | Operasi ringan, tidak perlu server |
| Compress PDF | Server | Ghostscript | Membutuhkan binary native |
| Image to PDF | Client + Server fallback | pdf-lib + Pillow | Client untuk file < 3MB, server untuk file besar |
| PDF to Image | Server | PyMuPDF (fitz) | Membutuhkan rendering engine native |

### 8.3 Alur Client-Side

```
User upload → Browser memory → pdf-lib processing → Download result
```

Tidak ada data yang dikirim ke server. Semua terjadi di browser pengguna.

### 8.4 Alur Server-Side

```
User upload → Backend API → Validasi → Processing → Upload ke R2 → Signed URL → Download
```

File disimpan sementara di R2 dan dihapus otomatis setelah 60 menit.

### 8.5 Fallback Image-to-PDF

Untuk Image-to-PDF, batas fallback adalah 3MB:
- File < 3MB: diproses client-side dengan pdf-lib
- File >= 3MB: dikirim ke server untuk processing dengan Pillow

---

## §9 Keamanan & Privasi

### 9.1 Validasi File Upload

Setiap file yang diunggah melewati tiga lapisan validasi:

1. **MIME type check** — Memverifikasi Content-Type header
2. **Extension check** — Memastikan ekstensi file sesuai
3. **Magic bytes check** — Membaca header bytes file untuk konfirmasi tipe sebenarnya

### 9.2 Batasan dan Proteksi

| Mekanisme | Nilai |
|-----------|-------|
| Ukuran file maksimum | 20MB |
| Auto-delete file | 60 menit |
| Penamaan file | UUID v4 (tidak ada info pengguna) |
| URL download | Signed URL dengan expiry |
| Rate limiting | 10 request per menit per IP |
| CORS | Strict, hanya origin yang diizinkan |
| Content logging | Tidak ada (zero content logging) |

### 9.3 Prinsip Privasi

- Tidak ada registrasi pengguna
- Tidak ada penyimpanan data personal
- File dihapus otomatis, tidak ada retensi permanen
- UUID filename mencegah enumerasi
- Signed URL mencegah akses tidak sah

### 9.4 Catatan untuk Agen AI

Saat mengembangkan fitur baru yang melibatkan file upload:
- Selalu implementasi ketiga lapisan validasi
- Jangan pernah log konten file atau nama asli file
- Pastikan file memiliki lifecycle rule untuk auto-delete
- Gunakan UUID untuk semua nama file di storage

---

## §10 Testing

### 10.1 Frontend Testing

| Atribut | Detail |
|---------|--------|
| Framework | Vitest |
| Jumlah Test | 23 tests |
| Lokasi | `frontend/src/__tests__/` |
| Perintah | `bun run test` |

Test frontend mencakup:
- Unit test untuk utility functions
- Component rendering tests
- API client behavior tests

### 10.2 Backend Testing

| Atribut | Detail |
|---------|--------|
| Framework | pytest |
| Jumlah Test | 34 tests |
| Lokasi | `backend/tests/` |
| Perintah | `pytest` |

Test backend mencakup:
- Unit test untuk services
- Integration test untuk API endpoints
- Validation logic tests
- File processing tests

### 10.3 Menjalankan Semua Test

```bash
# Frontend
cd frontend
bun run test

# Backend
cd backend
pytest
```

### 10.4 CI Integration

GitHub Actions menjalankan kedua test suite pada setiap push dan PR. Kedua suite harus pass 100% sebelum merge diizinkan.

### 10.5 Panduan untuk Agen AI

Saat menambah fitur baru:
- Tulis test terlebih dahulu atau bersamaan dengan implementasi
- Pastikan coverage tidak menurun
- Jalankan full test suite sebelum commit
- Jika test gagal di CI, perbaiki sebelum melanjutkan

---

## §11 Deployment

### 11.1 Frontend Deployment

| Atribut | Detail |
|---------|--------|
| Platform | Vercel |
| Trigger | Auto-deploy on push to `main` |
| Build Command | `bun run build` |
| Output | Static + SSR |
| Domain | mypapyr.com |

Setiap push ke branch `main` otomatis memicu deployment baru di Vercel. Preview deployments dibuat untuk setiap PR.

### 11.2 Backend Deployment

| Atribut | Detail |
|---------|--------|
| Platform | Railway |
| Trigger | Manual deploy |
| Runtime | Docker container |
| Budget | $5/bulan |
| Health Check | GET /health |

Backend di-deploy secara manual ke Railway. Pastikan Dockerfile dan `railway.toml` sudah benar sebelum deploy.

### 11.3 Storage Lifecycle

Cloudflare R2 dikonfigurasi dengan lifecycle rules:
- File di bucket `papyr-files` dihapus otomatis setelah 60 menit
- Tidak ada versioning (file sekali pakai)
- Signed URL expire sesuai dengan lifecycle rule

### 11.4 Checklist Pre-Deployment

Sebelum deploy ke production:
1. Semua test pass (frontend + backend)
2. Build berhasil tanpa error
3. Environment variables sudah dikonfigurasi
4. Tidak ada secret yang ter-commit
5. CORS origins sudah benar untuk production domain

---

## §12 Dokumen Referensi

Folder `docs/` berisi 30+ dokumen enterprise yang mencakup seluruh aspek proyek. Berikut daftar dan deskripsi singkatnya:

| No | Dokumen | Deskripsi |
|----|---------|-----------|
| 01 | Project Charter | Piagam proyek, visi, misi, dan batasan |
| 02 | Product Requirements Document | Spesifikasi kebutuhan produk lengkap |
| 03 | Technical Architecture Document | Arsitektur teknis detail |
| 04 | API Specification | Spesifikasi endpoint API backend |
| 05 | Frontend Technical Spec | Spesifikasi teknis frontend |
| 06 | Backend Technical Spec | Spesifikasi teknis backend |
| 07 | Security Policy | Kebijakan keamanan dan privasi |
| 08 | Testing Strategy | Strategi dan rencana testing |
| 09 | Deployment Guide | Panduan deployment production |
| 10 | CI/CD Pipeline Doc | Dokumentasi pipeline CI/CD |
| 11 | Infrastructure Doc | Dokumentasi infrastruktur |
| 12 | Cost Analysis | Analisis biaya operasional |
| 13 | Performance Requirements | Persyaratan performa |
| 14 | SEO Strategy | Strategi SEO dan content |
| 15 | Analytics Plan | Rencana analytics dan tracking |
| 16 | Error Handling Guide | Panduan penanganan error |
| 17 | File Processing Spec | Spesifikasi processing file |
| 18 | UI/UX Design System | Design system dan komponen |
| 19 | Accessibility Guide | Panduan aksesibilitas |
| 20 | Monitoring & Alerting | Monitoring dan alerting |
| 21 | Disaster Recovery | Rencana disaster recovery |
| 22 | Compliance Doc | Kepatuhan regulasi |
| 23 | API Rate Limiting | Kebijakan rate limiting |
| 24 | Storage Management | Manajemen storage R2 |
| 25 | Changelog | Catatan perubahan per versi |
| 26 | Risk Register | Daftar risiko proyek |
| 27 | Stakeholder Map | Peta stakeholder |
| 28 | Quality Assurance Plan | Rencana jaminan kualitas |
| 29 | Incident Response | Prosedur respons insiden |
| 30 | Knowledge Base | Basis pengetahuan proyek |
| 31 | Onboarding Guide (ini) | Panduan onboarding agen AI |

### 12.1 Cara Menggunakan Dokumen

Saat memulai task baru, baca dokumen yang relevan terlebih dahulu. Contoh:
- Menambah endpoint baru → baca #04 API Specification dan #06 Backend Technical Spec
- Mengubah UI → baca #18 UI/UX Design System dan #05 Frontend Technical Spec
- Menangani bug keamanan → baca #07 Security Policy dan #29 Incident Response

---

## §13 Checklist Onboarding

Gunakan checklist berikut untuk memverifikasi pemahaman sebelum mulai berkontribusi:

### 13.1 Pemahaman Proyek

- [ ] 1. Memahami bahwa Papyr adalah tool PDF gratis untuk Indonesia di mypapyr.com
- [ ] 2. Mengetahui 6 tool yang tersedia (Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image)
- [ ] 3. Memahami proposisi nilai: gratis, cepat, aman
- [ ] 4. Mengetahui bahwa proyek ini 100% dikembangkan oleh AI agent

### 13.2 Pemahaman Teknis

- [ ] 5. Memahami arsitektur: Next.js (Vercel) + FastAPI (Railway) + R2 (Cloudflare)
- [ ] 6. Mengetahui tool mana yang client-side vs server-side
- [ ] 7. Memahami batas fallback Image-to-PDF di 3MB
- [ ] 8. Mengetahui bahwa Ghostscript digunakan untuk compress dan PyMuPDF untuk PDF-to-Image

### 13.3 Pemahaman Alur Kerja

- [ ] 9. Mengetahui branch strategy: main (production) + develop (development)
- [ ] 10. Memahami format commit: semantic English (`feat:`, `fix:`, dll.)
- [ ] 11. Mengetahui CI pipeline menjalankan lint, test, dan build
- [ ] 12. Memahami bahwa frontend auto-deploy via Vercel, backend manual via Railway

### 13.4 Pemahaman Keamanan

- [ ] 13. Mengetahui tiga lapisan validasi file (MIME, extension, magic bytes)
- [ ] 14. Memahami batas upload 20MB dan auto-delete 60 menit
- [ ] 15. Mengetahui bahwa tidak boleh ada content logging
- [ ] 16. Memahami penggunaan UUID untuk filename dan signed URL untuk akses

### 13.5 Pemahaman Konvensi

- [ ] 17. Mengetahui font DM Sans dan warna utama (navy #1E3A5F, accent #2563EB, bg #F9FAFB)
- [ ] 18. Memahami UI style Vercel-inspired (clean, minimal, modern)
- [ ] 19. Mengetahui TypeScript strict mode dan ESLint 9 flat config
- [ ] 20. Memahami lokasi test: `frontend/src/__tests__/` dan `backend/tests/`

---

## Persetujuan Dokumen

| Peran | Nama | Tanggal | Tanda Tangan |
|-------|------|---------|--------------|
| Penulis | OpenCode AI Agent (Sisyphus) | 2026-06-03 | [Digital] |
| Reviewer | Muhammad Fa'iz Zulfikar | 2026-06-03 | [Digital] |
| Approver | Muhammad Fa'iz Zulfikar | 2026-06-03 | [Digital] |

---

*Dokumen ini bersifat internal dan ditujukan khusus untuk agen AI yang bekerja pada proyek Papyr. Pembaruan dilakukan seiring evolusi proyek.*
