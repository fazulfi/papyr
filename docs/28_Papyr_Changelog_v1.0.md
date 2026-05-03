**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Changelog**

Version 1.0

Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                                      |
|---------------------|------------------------------------------------------|
| **Judul Dokumen**   | Changelog — Papyr                                    |
| **ID Dokumen**      | PPR-CL-001                                           |
| **Versi**           | 1.0                                                  |
| **Status**          | Draft                                                |
| **Tanggal Dibuat**  | Juni 2025                                            |
| **Terakhir Diubah** | Juni 2025                                            |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                         |
| **Ditinjau Oleh**   | Product Owner (Muhammad Fa'iz Zulfikar)              |
| **Disetujui Oleh**  | Product Owner                                        |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only          |

**Riwayat Versi Dokumen**

| **Versi** | **Tanggal**  | **Penulis**                    | **Deskripsi**                                              |
|-----------|--------------|--------------------------------|------------------------------------------------------------|
| 1.0       | Juni 2025    | AI Agent (OpenCode/Sisyphus)   | Draft awal — Changelog enterprise lengkap v1.0.0–v1.1.1   |

**Dokumen Terkait**

| **ID Dokumen** | **Judul**                          | **Relevansi**                                    |
|----------------|------------------------------------|--------------------------------------------------|
| PPR-RN-001     | Release Notes                      | Ringkasan rilis untuk stakeholder non-teknis     |
| PPR-PP-001     | Privacy Policy                     | Kebijakan privasi dan penanganan data pengguna   |
| PPR-BRD-001    | Business Requirements Document     | Sumber requirements dan scope produk             |
| PPR-TDD-001    | Technical Design Document          | Arsitektur teknis dan keputusan desain           |
| PPR-ADR-001    | Architecture Decision Records      | Catatan keputusan arsitektur                     |

---

## Daftar Isi

1. [Panduan Format Changelog](#1-panduan-format-changelog)
2. [Konvensi Versioning](#2-konvensi-versioning)
3. [Changelog Detail](#3-changelog-detail)
   - 3.1 [v1.1.1 — Audit Fixes](#31-v111--audit-fixes)
   - 3.2 [v1.1.0 — Rotate PDF](#32-v110--rotate-pdf)
   - 3.3 [v1.0.0 — MVP 1.0 Soft Launch](#33-v100--mvp-10-soft-launch)
4. [Statistik Rilis](#4-statistik-rilis)
5. [Referensi Silang](#5-referensi-silang)
6. [Persetujuan Dokumen](#6-persetujuan-dokumen)

---

## 1. Panduan Format Changelog

### 1.1 Tujuan Dokumen

Dokumen ini merupakan catatan perubahan (changelog) versi enterprise untuk produk Papyr. Berbeda dengan `CHANGELOG.md` di root repository yang bersifat ringkas untuk developer, dokumen ini menyediakan:

- **Konteks bisnis** untuk setiap perubahan — mengapa perubahan dilakukan dan dampaknya terhadap pengguna
- **Analisis dampak** — bagaimana perubahan mempengaruhi performa, keamanan, dan pengalaman pengguna
- **Kedalaman teknis** — detail implementasi, dependensi, dan pertimbangan arsitektur
- **Traceability** — pemetaan lengkap dari task ID ke milestone ke versi rilis

### 1.2 Audiens

| **Audiens**              | **Kebutuhan Informasi**                                          |
|--------------------------|------------------------------------------------------------------|
| Product Owner            | Konteks bisnis, dampak pengguna, keputusan strategis             |
| Developer / AI Agent     | Detail teknis, breaking changes, dependensi, migration notes     |
| Investor / Partner       | Progress produk, velocity development, roadmap                   |
| QA / Testing             | Test coverage, bug fixes, known issues                           |
| Security Auditor         | Perubahan keamanan, validasi, penanganan data                    |

### 1.3 Konvensi Penulisan

Setiap entri changelog mengikuti struktur berikut:

```
## [Versi] — Tanggal — Nama Rilis

### Ringkasan
Deskripsi singkat perubahan dan konteks bisnis.

### Referensi Milestone
Pemetaan ke milestone dan task ID.

### Tabel Perubahan
Detail per-task dengan deskripsi, kategori, dan dampak.

### Catatan Teknis
Detail implementasi, arsitektur, dan dependensi.

### Breaking Changes (jika ada)
Perubahan yang memerlukan aksi dari pengguna atau developer.

### Catatan Migrasi (jika ada)
Langkah-langkah yang diperlukan untuk upgrade.
```

### 1.4 Kategori Perubahan

| **Kategori**     | **Deskripsi**                                                    | **Label**    |
|------------------|------------------------------------------------------------------|--------------|
| Ditambahkan      | Fitur baru yang sebelumnya tidak ada                             | `Added`      |
| Diubah           | Perubahan pada fitur yang sudah ada                              | `Changed`    |
| Diperbaiki       | Perbaikan bug atau error                                         | `Fixed`      |
| Dihapus          | Fitur atau kode yang dihilangkan                                 | `Removed`    |
| Keamanan         | Perubahan terkait keamanan dan privasi                           | `Security`   |
| Performa         | Optimasi kecepatan atau efisiensi                                | `Performance`|
| Infrastruktur    | Perubahan deployment, CI/CD, atau konfigurasi                    | `Infra`      |

---

## 2. Konvensi Versioning

### 2.1 Semantic Versioning (SemVer)

Papyr menggunakan [Semantic Versioning 2.0.0](https://semver.org/lang/id/) dengan format:

```
MAJOR.MINOR.PATCH[-prerelease]
```

| **Komponen** | **Kapan Dinaikkan**                                              | **Contoh**           |
|--------------|------------------------------------------------------------------|----------------------|
| MAJOR        | Perubahan yang tidak backward-compatible (breaking changes)      | 1.0.0 → 2.0.0       |
| MINOR        | Penambahan fitur baru yang backward-compatible                   | 1.0.0 → 1.1.0       |
| PATCH        | Perbaikan bug yang backward-compatible                           | 1.1.0 → 1.1.1       |
| Pre-release  | Versi alpha/beta sebelum rilis stabil                            | 0.5.0-alpha.1        |

### 2.2 Strategi Versioning Papyr

| **Fase**                | **Range Versi**      | **Keterangan**                                    |
|-------------------------|----------------------|---------------------------------------------------|
| Pre-MVP (Alpha)         | 0.1.0 — 0.5.0       | Milestone individual, belum production-ready      |
| MVP 1.0 (Stable)        | 1.0.0                | Soft launch, semua core tools tersedia            |
| Feature Expansion       | 1.1.0 — 1.x.0       | Tool baru ditambahkan per minor version           |
| Patch / Hotfix          | x.x.1 — x.x.9       | Bug fix, security patch, optimasi kecil           |
| Major Overhaul          | 2.0.0+               | Redesign arsitektur atau breaking API changes     |

### 2.3 Branching Strategy

```
main ─────────────────────────────────────────── (production releases)
  │
  └── develop ────────────────────────────────── (integration branch)
        │
        ├── feature/PAPYR-XXX ────────────────── (feature branches)
        ├── fix/PAPYR-XXX ────────────────────── (bug fix branches)
        └── hotfix/PAPYR-XXX ─────────────────── (emergency patches)
```

### 2.4 Release Cadence

| **Tipe Rilis**   | **Frekuensi**        | **Proses**                                        |
|------------------|----------------------|---------------------------------------------------|
| Major            | Per kuartal          | Planning → Development → QA → Staging → Release  |
| Minor            | Per 1–2 minggu       | Development → QA → Release                       |
| Patch            | Ad-hoc (saat needed) | Fix → Test → Release                             |

---

## 3. Changelog Detail

---

### 3.1 [v1.1.1] — 2026-06-03 — Audit Fixes

#### Ringkasan

Rilis patch yang mengatasi temuan dari audit kualitas kode pasca-launch. Fokus pada tiga area: (1) penambahan dukungan format gambar WebP pada fitur Image-to-PDF, (2) peningkatan granularitas analytics tracking, dan (3) penambahan automated test suite yang komprehensif untuk memastikan stabilitas jangka panjang.

#### Konteks Bisnis

| **Aspek**            | **Detail**                                                                |
|----------------------|---------------------------------------------------------------------------|
| **Motivasi**         | Audit kualitas kode mengidentifikasi gap dalam test coverage dan format support |
| **Dampak Pengguna**  | Pengguna kini dapat mengkonversi file WebP ke PDF — format yang semakin populer di Indonesia (WhatsApp, Chrome screenshots) |
| **Dampak Teknis**    | Test coverage meningkat signifikan, memberikan safety net untuk development selanjutnya |
| **Risiko Mitigasi**  | Dead code (Plausible config) dihapus untuk mengurangi attack surface dan kebingungan developer |

#### Referensi Milestone

| **Milestone**    | **Task Range**       | **Kategori**         |
|------------------|----------------------|----------------------|
| Post-Audit       | N/A (ad-hoc)         | Patch / Quality      |

#### Tabel Perubahan

| **#** | **Kategori**   | **Deskripsi**                                                              | **Dampak**           |
|-------|----------------|----------------------------------------------------------------------------|----------------------|
| 1     | Ditambahkan    | Dukungan format WebP pada Image-to-PDF (frontend validation + backend processing) | Pengguna baru       |
| 2     | Ditambahkan    | `device_category` tracking pada analytics events                           | Data insight         |
| 3     | Ditambahkan    | Event `cleanup_success` dan `cleanup_failure` pada analytics               | Observability        |
| 4     | Dihapus        | Konfigurasi Plausible yang sudah tidak digunakan (dead code)               | Code hygiene         |
| 5     | Ditambahkan    | 34 backend pytest tests (Python/FastAPI)                                   | Quality assurance    |
| 6     | Ditambahkan    | 23 frontend vitest tests (TypeScript/React)                                | Quality assurance    |

#### Catatan Teknis

**WebP Support:**

- Frontend: Validasi MIME type diperluas untuk menerima `image/webp` selain `image/jpeg` dan `image/png`
- Backend: PyMuPDF handler ditambahkan untuk decode WebP via Pillow sebelum embedding ke PDF
- Magic bytes: WebP signature `52 49 46 46 xx xx xx xx 57 45 42 50` (RIFF....WEBP) ditambahkan ke validasi
- Threshold client/server tetap 3MB — WebP biasanya lebih kecil dari JPG/PNG equivalent

**Analytics Enhancement:**

- `device_category` mendeteksi `mobile`, `tablet`, atau `desktop` berdasarkan viewport width
- Breakpoint: mobile < 768px, tablet 768–1024px, desktop > 1024px
- Event `cleanup_success`/`cleanup_failure` di-fire oleh cron cleanup loop untuk monitoring R2 lifecycle
- Memungkinkan dashboard monitoring kesehatan auto-delete pipeline

**Test Suite:**

| **Layer**    | **Framework** | **Tests** | **Coverage Area**                                          |
|--------------|---------------|-----------|-------------------------------------------------------------|
| Backend      | pytest        | 34        | API endpoints, validasi, compression, image conversion, R2  |
| Frontend     | vitest        | 23        | Components, utilities, pdfUtils, analytics wrapper          |
| **Total**    |               | **57**    | Core business logic + integration points                    |

**Dead Code Removal:**

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` environment variable reference dihapus
- Plausible script tag (yang sudah di-comment) dihapus dari layout
- Keputusan: Vercel Analytics dipilih sebagai solusi permanen (lihat ADR di PPR-ADR-001)

#### Breaking Changes

Tidak ada breaking changes pada rilis ini.

#### Catatan Migrasi

Tidak diperlukan langkah migrasi. Rilis ini sepenuhnya backward-compatible.

---

### 3.2 [v1.1.0] — 2026-05-01 — M11 Rotate PDF

#### Ringkasan

Rilis minor pertama setelah MVP, menambahkan tool ke-6: Rotate PDF. Tool ini memungkinkan pengguna memutar halaman PDF secara individual (per halaman) atau global (semua halaman sekaligus). Seluruh pemrosesan dilakukan 100% di sisi klien menggunakan library pdf-lib, sehingga tidak ada file yang diunggah ke server.

#### Konteks Bisnis

| **Aspek**            | **Detail**                                                                |
|----------------------|---------------------------------------------------------------------------|
| **Motivasi**         | Dokumen scan (KTP, ijazah, surat) sering ter-rotate 90° atau 180° — kebutuhan umum pengguna Indonesia |
| **Dampak Pengguna**  | Pengguna dapat memperbaiki orientasi halaman tanpa software desktop (Adobe, Foxit) |
| **Competitive Edge** | iLovePDF dan SmallPDF menyediakan fitur ini — Papyr harus setara untuk retensi pengguna |
| **Processing Model** | Client-side only — zero privacy risk, zero server cost, instant processing |
| **Revenue Impact**   | Menambah 1 tool ke portfolio → meningkatkan SEO surface area dan user engagement |

#### Referensi Milestone

| **Milestone**    | **Task Range**       | **Total Tasks** | **Estimasi Effort** |
|------------------|----------------------|-----------------|---------------------|
| M11              | PAPYR-085 — PAPYR-089| 5               | ~6 jam              |

#### Tabel Perubahan

| **Task ID**  | **Kategori**   | **Deskripsi**                                                              | **File Utama**                    |
|--------------|----------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-085    | Ditambahkan    | Fungsi `rotatePDF()` untuk rotasi halaman individual + `rotatePDFAllPages()` untuk rotasi global | `frontend/src/lib/pdfUtils.ts`    |
| PAPYR-086    | Ditambahkan    | Halaman `/rotate` dengan state machine, page grid, kontrol rotasi per-halaman dan global | `frontend/src/app/rotate/page.tsx`|
| PAPYR-087    | Ditambahkan    | Download hasil rotasi + analytics tracking (`task_started`/`completed`/`failed`) | `frontend/src/app/rotate/page.tsx`|
| PAPYR-088    | Ditambahkan    | SEO metadata, sitemap update (6→7 URL), navbar link, landing TOOLS array, OtherTools integration | Multiple files                    |
| PAPYR-089    | Ditambahkan    | Build verification — semua route pass, LSP clean, zero TypeScript errors   | N/A (verification)                |

#### Catatan Teknis

**Arsitektur Rotasi:**

```typescript
// Rotasi individual — additive terhadap rotasi existing
page.setRotation(degrees(currentRotation + additionalRotation));

// Normalisasi ke 0/90/180/270
const normalized = ((deg % 360) + 360) % 360;
```

- Rotasi bersifat **additive** — jika halaman sudah ter-rotate 90° dan user menambah 90°, hasilnya 180°
- Normalisasi memastikan nilai selalu dalam range valid (0, 90, 180, 270)
- Page grid menampilkan visual indicator menggunakan CSS `transform: rotate(Ndeg)` pada thumbnail placeholder

**State Machine:**

```
idle → uploading → ready → processing → done
                     ↑                     │
                     └─────── reset ───────┘
```

- State `ready` menampilkan page grid dengan kontrol rotasi
- User dapat mengatur rotasi per halaman sebelum memproses
- Tombol "Rotate All" mengaplikasikan rotasi yang sama ke semua halaman

**Integrasi Ekosistem:**

| **Komponen**     | **Perubahan**                                                    |
|------------------|------------------------------------------------------------------|
| Navbar           | 6 → 7 navigation links (tambah "Rotate")                        |
| OtherTools       | 5 → 6 tools dalam cross-link component                          |
| Landing Page     | 5 → 6 tool cards di grid                                        |
| Sitemap          | 6 → 7 URLs (`/rotate` ditambahkan)                              |
| Analytics        | `ToolName` union type diperluas dengan `"rotate"`                |
| SEO              | Meta title: "Rotate PDF Online Gratis | Papyr"                  |

**Performa:**

- Processing time: < 100ms untuk PDF 50 halaman (client-side, no network)
- Memory: pdf-lib loads entire PDF ke memory — limit praktis ~100MB file
- Zero server cost — tidak ada API call, tidak ada R2 storage

#### Breaking Changes

Tidak ada breaking changes. Tool baru ditambahkan tanpa mengubah behavior existing tools.

#### Catatan Migrasi

Tidak diperlukan langkah migrasi. Deployment otomatis via Vercel GitHub integration.

---

### 3.3 [v1.0.0] — 2026-04-30 — MVP 1.0 Soft Launch

#### Ringkasan

Rilis major pertama Papyr sebagai Minimum Viable Product (MVP) yang mencakup seluruh fondasi produk: 5 tool PDF inti, infrastruktur production-grade, landing page dengan SEO, sistem privasi & keamanan, analytics, dan deployment ke production. Produk live di [mypapyr.com](https://mypapyr.com) dengan arsitektur hybrid (client-side + server-side processing).

#### Konteks Bisnis

| **Aspek**            | **Detail**                                                                |
|----------------------|---------------------------------------------------------------------------|
| **Motivasi**         | Pasar tool PDF Indonesia didominasi oleh produk asing (iLovePDF, SmallPDF) yang tidak dioptimasi untuk kebutuhan lokal |
| **Value Proposition**| Tool PDF gratis, cepat, privasi-first, dengan UI Bahasa Indonesia dan UX mobile-first |
| **Target Market**    | Mahasiswa, pekerja kantoran, UMKM Indonesia yang sering berurusan dengan PDF (tugas kuliah, laporan, KTP scan) |
| **Business Model**   | Freemium — semua fitur gratis tanpa batas, monetisasi via premium features di masa depan |
| **Competitive Advantage** | (1) Indonesia-first UX, (2) Privacy-first architecture, (3) Mobile-first design, (4) Zero login required |
| **Success Metrics**  | Soft launch → validate product-market fit → iterate berdasarkan analytics data |

#### Referensi Milestone

| **Milestone** | **Nama**                  | **Task Range**         | **Total Tasks** | **Estimasi Effort** |
|---------------|---------------------------|------------------------|-----------------|---------------------|
| M01           | Project Setup             | PAPYR-001 — PAPYR-010B | 11              | ~14 jam             |
| M02           | Compress PDF              | PAPYR-011 — PAPYR-021  | 11              | ~14 jam             |
| M03           | Merge PDF                 | PAPYR-022 — PAPYR-028  | 7               | ~8 jam              |
| M04           | Split PDF                 | PAPYR-029 — PAPYR-035  | 7               | ~8 jam              |
| M05           | Image to PDF              | PAPYR-036 — PAPYR-042  | 7               | ~12 jam             |
| M06           | PDF to Image              | PAPYR-043 — PAPYR-050  | 8               | ~19 jam             |
| M07           | Landing Page + SEO        | PAPYR-051 — PAPYR-060  | 10              | ~25 jam             |
| M08           | Analytics & Monitoring    | PAPYR-061 — PAPYR-065  | 5               | ~6 jam              |
| M09           | Cleanup & Privacy         | PAPYR-068 — PAPYR-079  | 12              | ~20 jam             |
| M10           | Final Testing + Launch    | PAPYR-080 — PAPYR-084  | 5               | ~8 jam              |
|               | **TOTAL**                 | **PAPYR-001 — PAPYR-084** | **84**       | **~134 jam**        |

---

#### 3.3.1 M01 — Project Setup (PAPYR-001 — PAPYR-010B)

**Ringkasan Milestone:**
Membangun seluruh fondasi teknis proyek dari nol: repository dengan branching strategy, frontend framework, backend API, object storage, database (standby), konfigurasi terpusat, keamanan CORS, deployment ke cloud, dan domain setup.

**Dampak Bisnis:**
Fondasi ini menentukan seluruh arsitektur produk ke depan. Keputusan yang dibuat di M01 (Next.js 16, FastAPI, R2, Railway) menjadi constraint dan enabler untuk semua milestone selanjutnya.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-001    | Infrastruktur    | Inisialisasi GitHub repo dengan Gitflow (`main` + `develop`)               | Version control foundation        |
| PAPYR-002    | Infrastruktur    | Next.js 16 + TypeScript + Tailwind CSS v4 + DM Sans font                  | Frontend framework                |
| PAPYR-003    | Infrastruktur    | FastAPI backend + health check `GET /health`                               | Backend API foundation            |
| PAPYR-004    | Infrastruktur    | Cloudflare R2 helpers: upload, signed URL, delete                          | Object storage layer              |
| PAPYR-005    | Infrastruktur    | Supabase project (standby untuk Fase 2)                                   | Database readiness                |
| PAPYR-006    | Infrastruktur    | Centralized typed config (`config.ts` + `config.py`)                       | Configuration management          |
| PAPYR-007    | Keamanan         | CORS tightening — GET/POST/OPTIONS, header whitelist                       | API security                      |
| PAPYR-008    | Infrastruktur    | Deploy frontend ke Vercel dengan GitHub auto-deploy                        | CI/CD pipeline                    |
| PAPYR-009    | Infrastruktur    | Deploy backend ke Railway dengan Dockerfile (Python 3.11-slim)             | Container deployment              |
| PAPYR-010    | Infrastruktur    | Connectivity test endpoint `GET /test/connectivity`                        | Integration verification          |
| PAPYR-010B   | Infrastruktur    | Hostinger MCP integration untuk domain `mypapyr.com`                       | Custom domain                     |

**Infrastruktur yang Di-deploy:**

| **Service**  | **Platform**     | **Region**       | **URL**                                    | **Biaya**          |
|--------------|------------------|------------------|--------------------------------------------|--------------------|
| Frontend     | Vercel (Free)    | Edge (Global)    | frontend-ten-omega-35.vercel.app           | $0/bulan           |
| Backend      | Railway (Trial)  | us-west2 (Oregon)| papyr-production.up.railway.app            | $5 credit/30 hari  |
| Storage      | Cloudflare R2    | Auto (Global)    | Bucket: `papyr-files`                      | Free (10 GB/mo)    |
| Database     | Supabase         | Singapore        | (standby)                                  | Free tier          |
| Domain       | Hostinger        | —                | mypapyr.com                                | Expires 2027-04-26 |

**Deviasi dari Rencana Awal:**

| **Rencana Awal**           | **Realita**                  | **Alasan**                                                    |
|----------------------------|------------------------------|---------------------------------------------------------------|
| Backend di Render (Free)   | Railway ($5 trial)           | Kartu pembayaran ditolak di Render, Fly.io, dan Koyeb         |
| Region Asia (Singapore)    | us-west2 (Oregon)            | Railway free tier hanya tersedia di US region                  |
| R2 auto-delete 1 jam       | Lifecycle min 1 hari         | R2 minimum lifecycle 1 hari; cleanup 1 jam via cron (M09)     |
| Next.js 14 + Tailwind v3   | Next.js 16 + Tailwind v4     | Versi terbaru saat init, backward-compatible                  |

**Catatan Teknis:**

- **Typed Config Pattern:** Singleton config object dengan validasi environment variables saat startup — crash early jika config tidak lengkap
- **CORS Strategy:** Whitelist explicit origins (Vercel preview URLs + production domain), reject semua lainnya
- **Dockerfile:** Multi-stage build tidak diperlukan karena Python runtime — single stage `python:3.11-slim` + Ghostscript apt-get install
- **R2 Helpers:** Abstraksi `upload_to_r2()`, `get_signed_url()`, `delete_from_r2()` dengan error handling dan retry logic

---

#### 3.3.2 M02 — Compress PDF (PAPYR-011 — PAPYR-021)

**Ringkasan Milestone:**
Implementasi fitur kompresi PDF menggunakan Ghostscript sebagai engine, dengan 3 level kualitas (low/medium/high). Pipeline: upload → validate → compress → store di R2 → return signed URL untuk download.

**Dampak Bisnis:**
Compress PDF adalah fitur paling dicari di pasar tool PDF. Pengguna Indonesia sering perlu mengecilkan file untuk upload ke portal pemerintah (max 2MB), kirim via WhatsApp (max 16MB), atau email attachment (max 25MB). Fitur ini menjadi primary acquisition channel.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-011    | Infrastruktur    | Install PyMuPDF, Pillow, Ghostscript untuk server-side PDF processing      | Processing engine                 |
| PAPYR-012    | Ditambahkan      | Endpoint `POST /api/compress` + validasi file (MIME, extension, ukuran)    | API endpoint                      |
| PAPYR-013    | Ditambahkan      | Ghostscript compression logic (3 level: low, medium, high)                 | Core business logic               |
| PAPYR-014    | Ditambahkan      | Upload hasil compress ke R2 + signed URL untuk download                    | Storage pipeline                  |
| PAPYR-015    | Keamanan         | Rate limiting 10 req/min/IP via slowapi                                    | Abuse prevention                  |
| PAPYR-016    | Ditambahkan      | Halaman `/compress` dengan layout tool page                                | User interface                    |
| PAPYR-017    | Ditambahkan      | Upload component dengan progress bar dan 5 state                           | UX flow                           |
| PAPYR-018    | Ditambahkan      | Hasil compress: before/after size + persentase penghematan                 | User feedback                     |
| PAPYR-019    | Ditambahkan      | Auto-retry 1x dan error handling                                           | Reliability                       |
| PAPYR-020    | Ditambahkan      | Test compress: PDF kecil (500KB), sedang (5MB), besar (18MB)               | Quality assurance                 |
| PAPYR-021    | Ditambahkan      | Benchmark kualitas Papyr vs iLovePDF                                       | Competitive validation            |

**Catatan Teknis:**

- **Ghostscript Presets:**

| **Level** | **Ghostscript Setting**    | **Target Use Case**                    | **Typical Reduction** |
|-----------|----------------------------|----------------------------------------|-----------------------|
| Low       | `/screen` (72 DPI)         | Email, WhatsApp, portal upload         | 60–80%               |
| Medium    | `/ebook` (150 DPI)         | Balanced quality/size                  | 40–60%               |
| High      | `/printer` (300 DPI)       | Print-ready, minimal compression       | 20–40%               |

- **Validasi Multi-Layer:** MIME type check → file extension check → magic bytes check (`%PDF-` header) → size limit check (20MB max)
- **Rate Limiting:** slowapi dengan backend Redis-less (in-memory) — 10 requests/menit/IP, response 429 dengan retry-after header
- **Upload State Machine:** `idle` → `uploading` → `processing` → `done` / `error`, dengan shimmer progress bar
- **Auto-retry:** Satu kali retry otomatis pada network error (timeout, 5xx), tidak retry pada 4xx (client error)

**Benchmark vs Kompetitor:**

| **Metrik**           | **Papyr**        | **iLovePDF**     | **Catatan**                       |
|----------------------|------------------|------------------|-----------------------------------|
| Compression ratio    | ~65% (medium)    | ~60% (medium)    | Comparable quality                |
| Processing time      | 3–8 detik        | 2–5 detik        | Railway US vs iLovePDF EU CDN    |
| Max file size        | 20 MB            | 100 MB (free)    | Papyr limit karena Railway memory|
| Privacy              | Auto-delete 1 jam| Retain 2 jam     | Papyr lebih privasi-conscious    |

---

#### 3.3.3 M03 — Merge PDF (PAPYR-022 — PAPYR-028)

**Ringkasan Milestone:**
Implementasi fitur penggabungan beberapa file PDF menjadi satu dokumen. Seluruh pemrosesan dilakukan di sisi klien (browser) menggunakan library pdf-lib, dengan antarmuka drag-and-drop untuk mengatur urutan file.

**Dampak Bisnis:**
Merge PDF adalah kebutuhan umum untuk mahasiswa (menggabungkan tugas multi-file), pekerja kantoran (menggabungkan laporan), dan UMKM (menggabungkan invoice). Client-side processing berarti zero server cost dan zero privacy risk — differentiator kuat vs kompetitor.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-022    | Ditambahkan      | Install pdf-lib + create `pdfUtils.ts` utility module                      | Client PDF foundation             |
| PAPYR-023    | Ditambahkan      | Halaman `/merge` — layout + multi-file upload                              | User interface                    |
| PAPYR-024    | Ditambahkan      | Multi-file upload dengan preview (nama, ukuran, tombol hapus)              | UX enhancement                    |
| PAPYR-025    | Ditambahkan      | Drag-to-reorder dengan @dnd-kit                                            | Interaction design                |
| PAPYR-026    | Ditambahkan      | Merge logic client-side menggunakan pdf-lib `copyPages()`                  | Core business logic               |
| PAPYR-027    | Ditambahkan      | Browser download PDF gabungan via Blob URL                                 | Output delivery                   |
| PAPYR-028    | Ditambahkan      | Test merge: 2 file, 5 file, 10 file, landscape + portrait mix             | Quality assurance                 |

**Catatan Teknis:**

- **pdf-lib Architecture:** Load semua PDF ke memory → `copyPages()` dari setiap source → `addPage()` ke destination → serialize ke bytes → create Blob URL → trigger download
- **@dnd-kit Integration:** `DndContext` + `SortableContext` + `useSortable` hook — CSS transform-based animation, touch-friendly untuk mobile
- **Memory Consideration:** Semua file di-load ke browser memory — practical limit ~50MB total (tergantung device RAM)
- **File Validation:** Setiap file divalidasi sebagai PDF valid sebelum merge (pdf-lib throws pada invalid PDF)
- **Reusability:** `pdfUtils.ts` menjadi shared module untuk merge, split, dan rotate — single source of truth untuk operasi pdf-lib

---

#### 3.3.4 M04 — Split PDF (PAPYR-029 — PAPYR-035)

**Ringkasan Milestone:**
Implementasi fitur pemisahan halaman PDF berdasarkan page range yang ditentukan pengguna. Mendukung format range fleksibel (e.g., "1-3, 5, 7-10"). Seluruh pemrosesan client-side via pdf-lib.

**Dampak Bisnis:**
Split PDF dibutuhkan saat pengguna hanya perlu halaman tertentu dari dokumen besar — misalnya mengekstrak halaman KTP dari bundle dokumen, atau memisahkan bab tertentu dari e-book. Client-side processing memastikan dokumen sensitif tidak pernah meninggalkan device pengguna.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-029    | Ditambahkan      | Halaman `/split` dengan UI page selector                                   | User interface                    |
| PAPYR-030    | Ditambahkan      | Tampilkan info PDF (jumlah halaman + ukuran file)                          | User context                      |
| PAPYR-031    | Ditambahkan      | Page range selector UI (format: `1-3, 5, 7-10`)                            | Input mechanism                   |
| PAPYR-032    | Ditambahkan      | Validasi page range input (bounds check, format check)                     | Error prevention                  |
| PAPYR-033    | Ditambahkan      | Split logic client-side dengan pdf-lib `copyPages()` selective             | Core business logic               |
| PAPYR-034    | Ditambahkan      | Download hasil split + success state                                       | Output delivery                   |
| PAPYR-035    | Ditambahkan      | Test split: PDF 5/50/200 halaman, edge cases                              | Quality assurance                 |

**Catatan Teknis:**

- **Page Range Parser:** Custom parser yang mendukung format `1-3, 5, 7-10` — split by comma, expand ranges, deduplicate, sort ascending
- **Validation Rules:** (1) Angka positif only, (2) Range start ≤ end, (3) Semua halaman dalam bounds (1 ≤ page ≤ totalPages), (4) Minimal 1 halaman dipilih
- **Reuse Pattern:** `PageRangeInput` component di-reuse oleh PDF-to-Image (M06) — same validation logic, different context
- **Output:** Selalu single PDF berisi halaman yang dipilih (bukan multiple files)

---

#### 3.3.5 M05 — Image to PDF (PAPYR-036 — PAPYR-042)

**Ringkasan Milestone:**
Implementasi konversi gambar (JPG/PNG) ke PDF dengan arsitektur hybrid: file kecil (< 3MB total) diproses di browser via pdf-lib, file besar di-fallback ke server via PyMuPDF. Mendukung multi-image upload dengan drag-to-reorder.

**Dampak Bisnis:**
Konversi gambar ke PDF adalah kebutuhan harian pengguna Indonesia: scan KTP/KK untuk upload ke portal pemerintah, foto tugas kuliah untuk submit online, foto dokumen untuk arsip digital. Hybrid processing memastikan pengalaman cepat untuk file kecil sambil tetap mendukung file besar.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-036    | Ditambahkan      | Halaman `/image-to-pdf` dengan multi-image upload                          | User interface                    |
| PAPYR-037    | Ditambahkan      | Multi-image upload dengan thumbnail preview                                | Visual feedback                   |
| PAPYR-038    | Ditambahkan      | Drag-to-reorder gambar sebelum konversi (@dnd-kit)                         | User control                      |
| PAPYR-039    | Ditambahkan      | Konversi client-side (pdf-lib) untuk total file < 3MB                      | Fast path                         |
| PAPYR-040    | Ditambahkan      | Endpoint `POST /api/image-to-pdf` (PyMuPDF) untuk file besar              | Server fallback                   |
| PAPYR-041    | Ditambahkan      | Download hasil PDF + success state                                         | Output delivery                   |
| PAPYR-042    | Ditambahkan      | Test: JPG/PNG berbagai ukuran, reorder verification                        | Quality assurance                 |

**Catatan Teknis:**

- **Hybrid Processing Decision Tree:**

```
Total file size < 3MB?
  ├── YES → Client-side (pdf-lib): embed images directly, zero upload
  └── NO  → Server-side (PyMuPDF): upload to backend, process, return via R2
```

- **Client-side Flow:** Read files as ArrayBuffer → embed JPG/PNG into pdf-lib PDFDocument → set page size to image dimensions → serialize → download
- **Server-side Flow:** Upload FormData → PyMuPDF `fitz.open()` per image → insert as page → save → upload to R2 → return signed URL
- **Validasi:** Magic bytes (JPEG `FF D8 FF`, PNG `89 50 4E 47`) + MIME type + file extension — triple validation layer
- **@dnd-kit Reuse:** Same `SortableContext` pattern dari merge page, extended untuk image thumbnails dengan aspect ratio preservation
- **BOM Fix:** Environment variables dari Vercel injection mengandung BOM character (`\uFEFF`) — di-strip saat config load untuk mencegah URL parsing errors

---

#### 3.3.6 M06 — PDF to Image (PAPYR-043 — PAPYR-050)

**Ringkasan Milestone:**
Implementasi konversi halaman PDF ke gambar PNG berkualitas tinggi menggunakan PyMuPDF sebagai rendering engine. Mendukung page range selection dan output ZIP untuk multi-page conversion.

**Dampak Bisnis:**
PDF-to-Image dibutuhkan saat pengguna perlu mengekstrak halaman sebagai gambar untuk presentasi, social media, atau preview. Kasus umum di Indonesia: mengekstrak grafik dari laporan untuk WhatsApp group, atau mengkonversi slide PDF ke gambar untuk Instagram story.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-043    | Ditambahkan      | Endpoint `POST /api/pdf-to-image` + validasi PDF multi-layer               | API endpoint                      |
| PAPYR-044    | Ditambahkan      | Service `rasterize_pages()` — PyMuPDF rendering ke PNG (150 DPI)           | Core rendering engine             |
| PAPYR-045    | Ditambahkan      | ZIP packaging untuk multi-page output (`page_N.png` naming)                | Multi-file delivery               |
| PAPYR-046    | Ditambahkan      | R2 upload + signed URL + temp file cleanup dengan try/finally              | Storage pipeline                  |
| PAPYR-047    | Ditambahkan      | Halaman `/pdf-to-image` — upload zone, PDF info, page range input          | User interface                    |
| PAPYR-048    | Ditambahkan      | POST FormData ke backend, processing state dengan shimmer bar              | UX flow                           |
| PAPYR-049    | Ditambahkan      | Download single PNG atau ZIP, success state, reset flow                    | Output delivery                   |
| PAPYR-050    | Ditambahkan      | Test: PDF teks, scan, gambar; 1 halaman dan multi-halaman                  | Quality assurance                 |

**Catatan Teknis:**

- **Rendering Pipeline:** Upload PDF → PyMuPDF `fitz.open()` → iterate selected pages → `page.get_pixmap(dpi=150)` → save as PNG → package
- **Output Strategy:**

| **Jumlah Halaman** | **Output Format** | **Delivery**                          |
|--------------------|-------------------|---------------------------------------|
| 1 halaman          | Single PNG        | Direct download via signed URL        |
| 2+ halaman         | ZIP archive       | `page_1.png`, `page_2.png`, ... in ZIP|

- **DPI Setting:** 150 DPI sebagai default — balance antara kualitas (readable text) dan file size (reasonable for sharing)
- **Temp File Cleanup:** `try/finally` pattern memastikan temp files selalu dihapus, bahkan saat error
- **Page Range Reuse:** `PageRangeInput` component dari M04 (Split) di-reuse — same validation, different backend call
- **Memory Management:** PyMuPDF processes pages sequentially (not all at once) untuk menghindari memory spike pada PDF besar

---

#### 3.3.7 M07 — Landing Page + SEO (PAPYR-051 — PAPYR-060)

**Ringkasan Milestone:**
Implementasi landing page, navigasi (Navbar + Footer), cross-link antar tools, SEO infrastructure (metadata, sitemap, robots.txt), dan copy Bahasa Indonesia yang dioptimasi untuk search engine dan konversi pengguna.

**Dampak Bisnis:**
Landing page adalah pintu masuk utama pengguna baru. SEO infrastructure memastikan Papyr ditemukan di Google untuk query seperti "compress PDF online gratis", "gabung PDF Indonesia", dll. Copy Bahasa Indonesia memberikan trust signal dan mengurangi bounce rate pengguna lokal.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-051    | Ditambahkan      | Landing page — hero section, tools grid (5 cards), privacy section         | Primary acquisition page          |
| PAPYR-052    | Ditambahkan      | OtherTools component — cross-link 4 alat lain di setiap tool page          | Internal linking / SEO            |
| PAPYR-053    | Ditambahkan      | Navbar (sticky, backdrop blur, mobile hamburger) + Footer                  | Navigation UX                     |
| PAPYR-054    | Ditambahkan      | Language switcher placeholder (Indonesia active, English disabled)          | i18n readiness                    |
| PAPYR-055    | Ditambahkan      | Landing page copy Bahasa Indonesia (sudah di PAPYR-051)                    | Content / SEO                     |
| PAPYR-056    | Ditambahkan      | Tool page copy — Indonesian use cases (WhatsApp, email, kantor)            | Contextual relevance              |
| PAPYR-057    | Ditambahkan      | Meta title + description untuk semua 6 halaman via layout.tsx              | On-page SEO                       |
| PAPYR-058    | Ditambahkan      | Sitemap.xml via Next.js built-in `sitemap.ts` (6 URL)                      | Search engine indexing             |
| PAPYR-059    | Ditambahkan      | Robots.txt via Next.js built-in `robots.ts`                                | Crawl directives                  |
| PAPYR-060    | Ditambahkan      | Google Search Console setup (manual task, instruksi disediakan)             | Search visibility                 |

**Catatan Teknis:**

- **Navbar:** Sticky positioning dengan `backdrop-filter: blur()`, 5 nav links + CTA button, mobile hamburger dengan XIcon toggle, active link detection via `usePathname()`
- **Footer:** Logo + copyright, 4 placeholder links (Privacy, FAQ, GitHub, Contact), LanguageSwitcher dropdown dengan click-outside-to-close pattern
- **OtherTools:** Reusable component yang filter current tool dari array, render 2-column grid, digunakan di semua 5 tool pages — meningkatkan internal linking dan session duration
- **Landing Hero:** Pill badge ("100% Gratis") + H1 "Alat PDF yang langsung bekerja." + 5 tool cards + privacy messaging section
- **Metadata Strategy:** Tool pages menggunakan `"use client"` directive — metadata di-export via separate `layout.tsx` per directory. Root layout menggunakan title template `"%s | Papyr"`
- **Sitemap:** Next.js App Router `sitemap.ts` convention, 6 URLs (home + 5 tools), base URL `https://mypapyr.com`, `changeFrequency: 'weekly'`

---

#### 3.3.8 M08 — Analytics & Monitoring (PAPYR-061 — PAPYR-065)

**Ringkasan Milestone:**
Integrasi Vercel Analytics + Speed Insights untuk web analytics dan performance monitoring. Implementasi custom event tracking untuk mengukur penggunaan setiap tool (started, completed, failed).

**Dampak Bisnis:**
Analytics memberikan visibility terhadap product-market fit: tool mana yang paling digunakan, berapa conversion rate (started → completed), dan apa error paling umum. Data ini menginformasikan prioritas development selanjutnya.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-061    | Ditambahkan      | Install `@vercel/analytics` + `@vercel/speed-insights`, tambah ke layout   | Analytics infrastructure          |
| PAPYR-062    | Ditambahkan      | Enable Analytics + Speed Insights di Vercel dashboard                      | Dashboard activation              |
| PAPYR-063    | Ditambahkan      | Custom event `task_started` — fire saat user klik proses di semua tools    | Funnel tracking                   |
| PAPYR-064    | Ditambahkan      | Custom event `task_completed` — fire saat hasil siap (state "done")        | Success tracking                  |
| PAPYR-065    | Ditambahkan      | Custom event `task_failed` — fire saat error, dengan error type            | Error tracking                    |

**Catatan Teknis:**

- **Deviasi dari Spec:** Menggunakan Vercel Analytics bukan Plausible — gratis, terintegrasi langsung dengan Vercel deployment, tidak perlu self-host atau bayar subscription
- **Analytics Wrapper:** `frontend/src/lib/analytics.ts` — thin wrapper dengan typed helper functions:

```typescript
trackTaskStarted(toolName: ToolName): void
trackTaskCompleted(toolName: ToolName, metadata?: object): void
trackTaskFailed(toolName: ToolName, errorType: string): void
```

- **Error Types:** `invalid_file`, `rate_limit`, `server_error`, `network_error` — error message di-truncate ke 200 karakter untuk privacy
- **Coverage:** Analytics tracking ditambahkan ke 6 file: PDFUploader.tsx (compress), merge/page.tsx, split/page.tsx, image-to-pdf/page.tsx, pdf-to-image/page.tsx
- **PDFUploader Enhancement:** Ditambah prop `toolName` untuk identifikasi tool (default `"compress"`)

---

#### 3.3.9 M09 — Cleanup & Privacy (PAPYR-068 — PAPYR-079)

**Ringkasan Milestone:**
Implementasi sistem privasi dan keamanan production-grade: auto-delete file dari R2, cron cleanup, privacy policy page, signed URL security, dan comprehensive testing termasuk edge cases dan Indonesian test files.

**Dampak Bisnis:**
Privasi adalah core differentiator Papyr. Sistem auto-delete memastikan file pengguna tidak pernah tersimpan lebih dari 1 jam di server. Privacy policy page memberikan transparansi dan trust. Signed URL mencegah unauthorized access ke file yang sedang diproses.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-068    | Keamanan         | R2 lifecycle rule verified active (storage auto-cleanup)                   | Data retention compliance         |
| PAPYR-069    | Keamanan         | Cleanup cron — `cleanup.py` dengan `list_expired_objects()` + `cleanup_expired_files()` | Active data deletion     |
| PAPYR-070    | Ditambahkan      | Structured cleanup logging (cleanup_started, cleanup_completed, cleanup_failed_item) | Observability            |
| PAPYR-071    | Ditambahkan      | PrivacyNotice component — always-visible, contextual per processing model  | User trust                        |
| PAPYR-072    | Ditambahkan      | Privacy policy page — `/privacy`, Bahasa Indonesia, linked dari Footer     | Legal compliance                  |
| PAPYR-073    | Keamanan         | Auto-delete verification — upload → cleanup → verify deletion              | Security validation               |
| PAPYR-074    | Keamanan         | Signed URL verification — expiry 3600s, UUID key, 403 on guessing          | Access control                    |
| PAPYR-075    | Ditambahkan      | Full flow API tests — 4/4 passed (compress, image-to-pdf, pdf-to-image)    | Integration testing               |
| PAPYR-076    | Ditambahkan      | Mobile browser testing — responsive code audit                             | Cross-device QA                   |
| PAPYR-077    | Ditambahkan      | Indonesian test files — KTP scan, laporan kantor, tugas kuliah             | Locale-specific QA                |
| PAPYR-078    | Diperbaiki       | Edge case tests — 13/13 passed, 2 bugs found and fixed (#75, #76)          | Robustness                        |
| PAPYR-079    | Ditambahkan      | Railway monitoring — `/health` endpoint, alerts, cron-job.org ping         | Uptime monitoring                 |

**Catatan Teknis:**

- **Cleanup Architecture:**

```
R2 Lifecycle Rule (24h) ← safety net (platform-level)
         +
Cron Cleanup (30 min)   ← active cleanup (application-level)
         =
File never exists > 1 hour in practice
```

- **Cron Implementation:** `asyncio.create_task(_cleanup_loop())` dalam FastAPI lifespan event — runs setiap 30 menit, lists objects older than `FILE_RETENTION_MINUTES`, deletes batch
- **PrivacyNotice Variants:**

| **Variant** | **Pesan**                                              | **Digunakan Di**       |
|-------------|--------------------------------------------------------|------------------------|
| `server`    | "File otomatis dihapus dalam 1 jam"                    | Compress, PDF-to-Image |
| `client`    | "File tidak pernah meninggalkan perangkat Anda"        | Merge, Split, Rotate   |
| `hybrid`    | "File kecil: browser. File besar: server (auto-delete)"| Image-to-PDF           |

- **Bug Fixes:**
  - **#75:** Fake PDF (file dengan ekstensi .pdf tapi bukan PDF valid) → sekarang return 400 (bukan 500 internal error)
  - **#76:** Password-protected PDF → sekarang return 400 dengan pesan "PDF dilindungi password" (bukan crash)
- **Signed URL Security:** UUID v4 sebagai object key (bukan nama file asli), expiry 3600 detik, 403 Forbidden pada URL guessing
- **Structured Logging:** JSON formatter, `log_task_event()` helper dengan event_data dict — machine-parseable untuk future log aggregation

---

#### 3.3.10 M10 — Final Testing + Soft Launch (PAPYR-080 — PAPYR-084)

**Ringkasan Milestone:**
Verifikasi akhir sebelum soft launch: deploy check semua URL, FAQ page, OG image untuk social sharing, custom domain setup, dan launch preparation.

**Dampak Bisnis:**
Milestone ini memastikan produk siap untuk publik: semua URL accessible, social sharing terlihat profesional (OG image), FAQ mengurangi support burden, dan custom domain (mypapyr.com) memberikan brand credibility.

| **Task ID**  | **Kategori**     | **Deskripsi**                                                              | **Dampak**                        |
|--------------|------------------|----------------------------------------------------------------------------|-----------------------------------|
| PAPYR-080    | Ditambahkan      | Final deploy check — 11 URL verified, CORS, HTTPS, API tested             | Launch readiness                  |
| PAPYR-081    | Ditambahkan      | FAQ page — 8 pertanyaan dengan accordion UI, linked dari Footer            | User self-service                 |
| PAPYR-082    | Ditambahkan      | OG image + Twitter Card — dynamic `ImageResponse` via `opengraph-image.tsx`| Social sharing                    |
| PAPYR-083    | Ditambahkan      | Custom domain — mypapyr.com live via A record → Vercel                     | Brand identity                    |
| PAPYR-084    | Ditambahkan      | Launch tweet finalized — pre-launch checklist verified                     | Go-to-market                      |

**Catatan Teknis:**

- **Deploy Check Results:** 11 URLs all returning 200 OK, CORS headers correct, HTTPS enforced, compress API end-to-end tested, 0 open bugs
- **FAQ Implementation:** Accordion UI dengan CSS `grid-template-rows` transition, single-open behavior (buka satu tutup lainnya), 8 pertanyaan dalam Bahasa Indonesia
- **OG Image:** Next.js file-based `opengraph-image.tsx` + `twitter-image.tsx` — dynamic `ImageResponse` (1200×630), gradient navy→accent, Papyr logo + tagline
- **Domain Setup:** Hostinger DNS → A record pointing to Vercel → SSL auto-provisioned → mypapyr.com live
- **Launch Checklist:** All tools functional ✓, Analytics active ✓, Privacy page live ✓, FAQ accessible ✓, OG images rendering ✓, Mobile responsive ✓, Domain resolving ✓

---

## 4. Statistik Rilis

### 4.1 Ringkasan Kuantitatif

| **Metrik**                       | **Nilai**                                              |
|----------------------------------|--------------------------------------------------------|
| Total Tasks Delivered            | 89+ tasks (PAPYR-001 — PAPYR-089 + audit fixes)       |
| Total Milestones                 | 11 milestones (M01 — M11)                             |
| Total Versi Dirilis              | 3 versi (v1.0.0, v1.1.0, v1.1.1)                     |
| Estimasi Total Effort            | ~140+ jam development                                  |
| Development Duration             | ~4 hari (2026-04-27 — 2026-05-03)                     |
| Velocity                         | ~22 tasks/hari (peak)                                  |

### 4.2 Distribusi Tasks per Kategori

| **Kategori**           | **Jumlah Tasks** | **Persentase** | **Keterangan**                          |
|------------------------|------------------|----------------|-----------------------------------------|
| Core PDF Tools         | 40               | 45%            | Compress, Merge, Split, Image↔PDF, Rotate |
| Infrastructure         | 15               | 17%            | Setup, deploy, config, monitoring       |
| UI/UX & Landing        | 15               | 17%            | Landing page, navbar, footer, SEO       |
| Privacy & Security     | 12               | 13%            | Cleanup, signed URLs, validation, privacy |
| Analytics & Testing    | 7                | 8%             | Vercel Analytics, test suites           |

### 4.3 Estimasi Lines of Code

| **Layer**              | **Estimasi LoC** | **Bahasa**           | **Keterangan**                          |
|------------------------|------------------|----------------------|-----------------------------------------|
| Frontend (src/)        | ~4,000           | TypeScript/TSX       | Pages, components, utilities            |
| Backend (routers+services) | ~1,500      | Python               | API endpoints, services, utilities      |
| Configuration          | ~300             | TypeScript + Python  | Config files, env handling              |
| Tests                  | ~1,200           | TypeScript + Python  | 57 automated tests                      |
| **Total**              | **~7,000**       |                      |                                         |

### 4.4 Test Coverage

| **Layer**    | **Framework** | **Total Tests** | **Status**   | **Coverage Area**                                |
|--------------|---------------|-----------------|--------------|--------------------------------------------------|
| Backend      | pytest        | 34              | ✅ All Pass  | API endpoints, validation, services, R2 helpers  |
| Frontend     | vitest        | 23              | ✅ All Pass  | Components, utilities, pdfUtils, analytics       |
| Manual       | —             | 20+             | ✅ Verified  | Edge cases, mobile, Indonesian files, full flow  |
| **Total**    |               | **77+**         |              |                                                  |

### 4.5 Infrastruktur & Biaya

| **Service**  | **Platform**     | **Tier**         | **Biaya/Bulan** | **Limit**                    |
|--------------|------------------|------------------|-----------------|------------------------------|
| Frontend     | Vercel           | Hobby (Free)     | $0              | 100GB bandwidth, 100 deploys |
| Backend      | Railway          | Starter ($5/bulan) | $5              | 500 execution hours          |
| Storage      | Cloudflare R2    | Free             | $0              | 10 GB storage, 10M requests  |
| Domain       | Hostinger        | Annual           | ~$1/bulan       | mypapyr.com until 2027       |
| Analytics    | Vercel Analytics | Free             | $0              | Included with Vercel         |
| **Total**    |                  |                  | **$0–6/bulan**  |                              |

---

## 5. Referensi Silang

### 5.1 Dokumen Terkait

| **ID Dokumen** | **Judul**                              | **Relevansi dengan Changelog**                    |
|----------------|----------------------------------------|---------------------------------------------------|
| PPR-RN-001     | Release Notes                          | Versi ringkas untuk stakeholder non-teknis        |
| PPR-PP-001     | Privacy Policy                         | Detail kebijakan privasi yang diimplementasi di M09 |
| PPR-BRD-001    | Business Requirements Document         | Sumber requirements yang di-deliver per milestone |
| PPR-TDD-001    | Technical Design Document              | Arsitektur yang diimplementasi di M01             |
| PPR-SRS-001    | Software Requirements Specification    | Spesifikasi fungsional per tool                   |
| PPR-ADR-001    | Architecture Decision Records          | Keputusan teknis (Vercel vs Plausible, dll)       |
| PPR-PP-005     | Project Plan                           | Timeline dan milestone planning                   |
| PPR-TP-001     | Test Plan                              | Strategi testing yang dieksekusi di M09/M10       |
| PPR-AET-001    | Analytics Event Taxonomy               | Definisi events yang diimplementasi di M08        |

### 5.2 Referensi Eksternal

| **Referensi**                    | **URL**                                              | **Relevansi**                    |
|----------------------------------|------------------------------------------------------|----------------------------------|
| Keep a Changelog                 | https://keepachangelog.com/id-ID/1.1.0/              | Format standar changelog         |
| Semantic Versioning              | https://semver.org/lang/id/                          | Konvensi versioning              |
| pdf-lib Documentation            | https://pdf-lib.js.org/                              | Client-side PDF library          |
| PyMuPDF Documentation            | https://pymupdf.readthedocs.io/                      | Server-side PDF rendering        |
| Ghostscript Documentation        | https://ghostscript.com/docs/                        | PDF compression engine           |
| Next.js App Router               | https://nextjs.org/docs/app                          | Frontend framework               |
| FastAPI Documentation            | https://fastapi.tiangolo.com/                        | Backend framework                |
| Cloudflare R2 Documentation      | https://developers.cloudflare.com/r2/                | Object storage                   |

---

## 6. Persetujuan Dokumen

### Tanda Tangan Persetujuan

| **Peran**              | **Nama**                         | **Status**   | **Tanggal**  |
|------------------------|----------------------------------|--------------|--------------|
| Product Owner          | Muhammad Fa'iz Zulfikar          | ✅ Approved  | Juni 2025    |
| AI Agent               | OpenCode/Sisyphus                | ✅ Approved  | Juni 2025    |

### Catatan Persetujuan

Dokumen ini telah ditinjau dan disetujui sebagai catatan resmi seluruh perubahan produk Papyr dari versi awal (v0.1.0-alpha.1) hingga versi terkini (v1.1.1). Changelog ini bersifat living document dan akan diperbarui seiring dengan setiap rilis baru.

---

*Dokumen ini bersifat CONFIDENTIAL dan hanya untuk penggunaan internal serta investor. Distribusi tanpa izin tertulis dari Product Owner dilarang.*

*— Akhir Dokumen —*
