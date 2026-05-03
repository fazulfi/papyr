**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Release Notes**

Version 1.1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                                      |
|---------------------|------------------------------------------------------|
| **Judul Dokumen**   | Release Notes — Papyr                                |
| **ID Dokumen**      | PPR-RN-001                                           |
| **Versi**           | 1.1.0                                                |
| **Status**          | Published                                            |
| **Tanggal Dibuat**  | Mei 2026                                             |
| **Terakhir Diubah** | Mei 2026                                             |
| **Penulis**         | Muhammad Fa'iz Zulfikar                              |
| **Ditinjau Oleh**   | Product Owner                                        |
| **Disetujui Oleh**  | Product Owner                                        |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only          |

**Riwayat Versi Dokumen**

| **Versi** | **Tanggal**  | **Penulis**               | **Deskripsi**                                              |
|-----------|--------------|---------------------------|------------------------------------------------------------|
| 1.0       | 2026-04-30   | Muhammad Fa'iz Zulfikar   | Draft awal — Release Notes v1.0.0 (MVP Soft Launch)        |
| 1.1       | 2026-05-01   | Muhammad Fa'iz Zulfikar   | Update — Tambah Release Notes v1.1.0 (Rotate PDF)          |
| 1.2       | 2026-05-03   | Muhammad Fa'iz Zulfikar   | Update — Tambah Release Notes v1.1.1 (Audit Fixes)         |

**Dokumen Terkait**

| **ID Dokumen** | **Judul**                          | **Relevansi**                          |
|----------------|------------------------------------|----------------------------------------|
| PPR-BRD-001    | Business Requirements Document     | Sumber requirements dan scope produk   |
| PPR-PP-001     | Privacy Policy                     | Kebijakan privasi dan penanganan data  |

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Ringkasan Rilis](#2-ringkasan-rilis)
3. [Rilis v1.0.0 — Fase 1 (Initial Release)](#3-rilis-v100--mvp-01-initial-release)
4. [Rilis v1.1.0 — Tool Expansion (Rotate PDF)](#4-rilis-v110--tool-expansion-rotate-pdf)
5. [Rilis v1.1.1 — Audit Fixes](#5-rilis-v111--audit-fixes)
6. [Rencana Rilis Mendatang](#6-rencana-rilis-mendatang)
7. [Panduan Upgrade](#7-panduan-upgrade)
8. [Kompatibilitas & Dependensi](#8-kompatibilitas--dependensi)
9. [Persetujuan Dokumen](#9-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen ini mencatat seluruh rilis produk Papyr secara kronologis, mencakup fitur baru, perbaikan bug, perubahan teknis, dan known issues untuk setiap versi yang dipublikasikan. Release Notes ini berfungsi sebagai referensi resmi bagi seluruh stakeholder mengenai evolusi produk dari versi awal hingga versi terkini.

### 1.2 Ruang Lingkup

Release Notes ini mencakup:

- **v1.0.0** — Fase 1 Soft Launch (10 milestone, 84 tasks)
- **v1.1.0** — Tool Expansion: Rotate PDF (1 milestone, 5 tasks)
- **v1.1.1** — Audit Fixes (perbaikan pasca-audit)
- Rencana rilis mendatang (roadmap v1.2.0+)

### 1.3 Audiens

| **Audiens**              | **Kebutuhan Informasi**                                          |
|--------------------------|------------------------------------------------------------------|
| Product Owner            | Ringkasan fitur, status delivery, keputusan teknis               |
| Developer / AI Agent     | Detail teknis, breaking changes, dependensi, panduan upgrade     |
| Investor / Partner       | Progress produk, velocity development, roadmap                   |
| QA / Testing             | Known issues, test coverage, bug fixes                           |

---

## 2. Ringkasan Rilis

| **Versi** | **Tanggal Rilis** | **Tipe Rilis**   | **Milestone**       | **Tasks** | **Highlights**                                    |
|-----------|-------------------|------------------|---------------------|-----------|---------------------------------------------------|
| v1.0.0    | 2026-04-30        | Major Release    | M01 — M10           | 84        | MVP Soft Launch — 5 core tools + infrastruktur    |
| v1.1.0    | 2026-05-01        | Feature Release  | M11                 | 5         | Rotate PDF tool — client-side rotation            |
| v1.1.1    | 2026-05-03        | Patch Release    | Post-audit          | —         | WebP support, analytics fix, automated tests      |

**Versi Terkini:** v1.1.1

**Status Produksi:** Live di [mypapyr.com](https://mypapyr.com)

**Total Tasks Delivered:** 89 tasks (PAPYR-001 — PAPYR-089)

---

## 3. Rilis v1.0.0 — Fase 1 (Initial Release)

**Tanggal Rilis:** 2026-04-30

**Tipe:** Major Release (Soft Launch)

**Milestone:** M01 — M10

**Total Tasks:** 84 (PAPYR-001 — PAPYR-084)

**Estimasi Effort:** ~176 jam

### 3.1 Ringkasan

Rilis pertama Papyr sebagai MVP (Minimum Viable Product) yang mencakup 5 tool PDF inti, landing page, infrastruktur SEO, sistem privasi & keamanan, analytics, dan deployment production. Produk live di mypapyr.com dengan arsitektur hybrid (client-side + server-side processing).

### 3.2 Fitur yang Didelivery

#### 3.2.1 Core PDF Tools (5 Tools)

| **Tool**        | **Deskripsi**                                                    | **Processing** | **Milestone** |
|-----------------|------------------------------------------------------------------|----------------|---------------|
| Compress PDF    | Kompres PDF dengan 3 level kualitas (low/medium/high)            | Server         | M02           |
| Merge PDF       | Gabungkan 2+ PDF dengan drag-and-drop reorder                   | Client         | M03           |
| Split PDF       | Pisahkan halaman berdasarkan range (e.g., 1-3, 5, 7-10)         | Client         | M04           |
| Image to PDF    | Konversi JPG/PNG ke PDF, multi-image, drag-reorder               | Hybrid         | M05           |
| PDF to Image    | Konversi halaman PDF ke PNG (150 DPI), ZIP untuk multi-page      | Server         | M06           |

#### 3.2.2 Landing Page & UX

- Homepage dengan tool grid (5 cards), hero section, privacy messaging
- Navbar sticky dengan mobile hamburger menu
- Footer dengan language switcher placeholder
- OtherTools cross-link component di setiap tool page
- Desain mobile-first, responsive di semua ukuran layar
- Seluruh UI dalam Bahasa Indonesia

#### 3.2.3 SEO Infrastructure

- Sitemap.xml otomatis via Next.js `sitemap.ts` (6 URL)
- Robots.txt via Next.js `robots.ts`
- Meta title + description unik per halaman (layout.tsx per tool)
- Open Graph image + Twitter Card (dynamic `ImageResponse` 1200x630)
- FAQ page (8 pertanyaan, accordion UI)

#### 3.2.4 Privacy & Security

- Auto-delete file dari R2 dalam 60 menit (lifecycle rule + cron fallback)
- UUID filename — nama asli file tidak pernah disimpan
- Validasi file multi-layer: MIME type + ekstensi + magic bytes
- Rate limiting 10 request/menit/IP
- CORS strict (hanya domain yang diizinkan)
- Signed URL dengan expiry time untuk akses file
- Zero content logging — hanya metadata operasional
- Privacy Policy page (`/privacy`) dalam Bahasa Indonesia
- PrivacyNotice component (3 varian: server/client/hybrid)

#### 3.2.5 Analytics

- Vercel Analytics + Speed Insights terintegrasi
- Custom events: `task_started`, `task_completed`, `task_failed`
- Analytics wrapper (`analytics.ts`) dengan helper functions
- Error type tracking: `invalid_file`, `rate_limit`, `server_error`

#### 3.2.6 Responsive Design

- Mobile-first approach (Chrome Android sebagai target utama)
- Responsive di desktop, tablet, dan mobile
- Touch-friendly drag-and-drop (via @dnd-kit)

### 3.3 Detail Teknis Per Milestone

#### M01 — Project Setup (PAPYR-001 — PAPYR-010B)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-001    | GitHub repo dengan Gitflow (main + develop)                    |
| PAPYR-002    | Next.js 16 + TypeScript + Tailwind CSS v4 + DM Sans font      |
| PAPYR-003    | FastAPI backend + health check `GET /health`                   |
| PAPYR-004    | Cloudflare R2 helpers: upload, signed URL, delete              |
| PAPYR-005    | Supabase project (standby untuk Fase 2)                       |
| PAPYR-006    | Centralized typed config (`config.ts` + `config.py`)           |
| PAPYR-007    | CORS tightening — GET/POST/OPTIONS, header whitelist           |
| PAPYR-008    | Deploy frontend ke Vercel dengan GitHub auto-deploy            |
| PAPYR-009    | Deploy backend ke Railway dengan Dockerfile (Python 3.11-slim) |
| PAPYR-010    | Connectivity test endpoint `GET /test/connectivity`            |
| PAPYR-010B   | Hostinger MCP integration untuk domain mypapyr.com             |

**Infrastruktur yang di-deploy:**

| Service   | Platform         | URL                                        | Biaya              |
|-----------|------------------|--------------------------------------------|--------------------|
| Frontend  | Vercel (Free)    | frontend-ten-omega-35.vercel.app           | $0                 |
| Backend   | Railway (Trial)  | papyr-production.up.railway.app            | $5 credit/30 hari  |
| Storage   | Cloudflare R2    | Bucket: papyr-files                        | Free (10 GB/mo)    |
| Database  | Supabase         | Singapore region                           | Free (standby)     |
| Domain    | Hostinger        | mypapyr.com                                | Expires 2027-04-26 |

#### M02 — Compress PDF (PAPYR-011 — PAPYR-021)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-011    | Install PyMuPDF + Ghostscript di Railway container             |
| PAPYR-012    | Endpoint `POST /api/compress` + validasi file                  |
| PAPYR-013    | Ghostscript compression logic (3 level: low/medium/high)       |
| PAPYR-014    | Upload hasil ke R2 + signed URL untuk download                 |
| PAPYR-015    | Rate limiting 10 req/min/IP via slowapi                        |
| PAPYR-016    | Halaman `/compress` dengan layout tool page                    |
| PAPYR-017    | Upload component dengan progress bar (5 state)                 |
| PAPYR-018    | Hasil compress: before/after size + persentase                 |
| PAPYR-019    | Auto-retry 1x dan error handling                               |
| PAPYR-020    | Test compress: PDF kecil (500KB), sedang (5MB), besar (18MB)   |
| PAPYR-021    | Benchmark kualitas vs iLovePDF                                 |

#### M03 — Merge PDF (PAPYR-022 — PAPYR-028)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-022    | Install pdf-lib + create `pdfUtils.ts`                         |
| PAPYR-023    | Halaman `/merge` — layout + multi-file upload                  |
| PAPYR-024    | Multi-file upload dengan preview (nama, ukuran, hapus)         |
| PAPYR-025    | Drag-to-reorder dengan @dnd-kit                                |
| PAPYR-026    | Merge logic client-side menggunakan pdf-lib                    |
| PAPYR-027    | Browser download PDF gabungan                                  |
| PAPYR-028    | Test merge: 2 file, 5 file, 10 file, landscape + portrait     |

#### M04 — Split PDF (PAPYR-029 — PAPYR-035)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-029    | Halaman `/split` dengan UI page selector                       |
| PAPYR-030    | Tampilkan info PDF (jumlah halaman + ukuran)                   |
| PAPYR-031    | Page range selector UI (e.g., `1-3, 5, 7-10`)                 |
| PAPYR-032    | Validasi page range input                                      |
| PAPYR-033    | Split logic client-side dengan pdf-lib                         |
| PAPYR-034    | Download hasil split + success state                           |
| PAPYR-035    | Test split: PDF 5/50/200 halaman, edge cases                  |

#### M05 — Image to PDF (PAPYR-036 — PAPYR-042)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-036    | Halaman `/image-to-pdf` dengan multi-image upload              |
| PAPYR-037    | Multi-image upload dengan thumbnail preview                    |
| PAPYR-038    | Drag-to-reorder gambar (@dnd-kit)                              |
| PAPYR-039    | Konversi client-side (pdf-lib) untuk file < 3MB                |
| PAPYR-040    | Fallback endpoint `POST /api/image-to-pdf` (PyMuPDF)           |
| PAPYR-041    | Download hasil PDF                                             |
| PAPYR-042    | Test: JPG/PNG berbagai ukuran, reorder verification            |

#### M06 — PDF to Image (PAPYR-043 — PAPYR-050)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-043    | Endpoint `POST /api/pdf-to-image` + validasi PDF               |
| PAPYR-044    | Service `rasterize_pages()` — PyMuPDF rendering (150 DPI)      |
| PAPYR-045    | ZIP packaging untuk multi-page output                          |
| PAPYR-046    | R2 upload + signed URL + temp file cleanup                     |
| PAPYR-047    | Halaman `/pdf-to-image` — upload zone, PDF info, page range    |
| PAPYR-048    | POST FormData ke backend, processing state                     |
| PAPYR-049    | Download single PNG atau ZIP, success state                    |
| PAPYR-050    | Test: PDF teks, scan, gambar; 1 halaman dan multi-halaman      |

#### M07 — Landing Page + SEO (PAPYR-051 — PAPYR-060)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-051    | Landing page — hero, tools grid, privacy section               |
| PAPYR-052    | OtherTools component — cross-link 4 alat lain                  |
| PAPYR-053    | Navbar (sticky, mobile hamburger) + Footer                     |
| PAPYR-054    | Language switcher placeholder (English: coming soon)            |
| PAPYR-055    | Landing page copy Bahasa Indonesia                             |
| PAPYR-056    | Tool page copy — use cases WhatsApp, email, kantor             |
| PAPYR-057    | Meta title + description semua halaman via layout.tsx           |
| PAPYR-058    | Sitemap.xml via Next.js built-in `sitemap.ts`                  |
| PAPYR-059    | Robots.txt via Next.js built-in `robots.ts`                    |
| PAPYR-060    | Google Search Console (instruksi manual)                        |

#### M08 — Analytics (PAPYR-061 — PAPYR-065)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-061    | Install `@vercel/analytics` + `@vercel/speed-insights`         |
| PAPYR-062    | Enable Analytics + Speed Insights di Vercel dashboard           |
| PAPYR-063    | Custom event `task_started` di semua 5 tool                    |
| PAPYR-064    | Custom event `task_completed` saat hasil siap                  |
| PAPYR-065    | Custom event `task_failed` dengan error type                   |

**Catatan:** Deviasi dari spec — menggunakan Vercel Analytics (gratis, terintegrasi) bukan Plausible ($9/bulan).

#### M09 — Cleanup & Privacy (PAPYR-068 — PAPYR-079)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-068    | R2 lifecycle rule verified active                              |
| PAPYR-069    | Cleanup cron — `cleanup.py` setiap 30 menit                   |
| PAPYR-070    | Structured cleanup logging (started/completed/failed_item)     |
| PAPYR-071    | PrivacyNotice component (3 varian per processing model)        |
| PAPYR-072    | Privacy policy page `/privacy` (Bahasa Indonesia)              |
| PAPYR-073    | Auto-delete verification — upload → cleanup → verify           |
| PAPYR-074    | Signed URL verification — expiry 3600s, 403 on guessing        |
| PAPYR-075    | Full flow API tests — 4/4 passed                               |
| PAPYR-076    | Mobile browser testing — responsive code audit                 |
| PAPYR-077    | Indonesian test files — KTP scan, laporan, tugas kuliah         |
| PAPYR-078    | Edge case tests — 13/13 passed, 2 bugs fixed                  |
| PAPYR-079    | Railway monitoring — `/health` endpoint, cron-job.org ping     |

#### M10 — Final Testing + Soft Launch (PAPYR-080 — PAPYR-084)

| **Task ID**  | **Deliverable**                                                |
|--------------|----------------------------------------------------------------|
| PAPYR-080    | Final deploy check — 11 URL verified, CORS, HTTPS, API tested |
| PAPYR-081    | FAQ page — 8 pertanyaan, accordion UI, linked dari Footer      |
| PAPYR-082    | OG image + Twitter Card — dynamic ImageResponse (1200x630)     |
| PAPYR-083    | Custom domain — mypapyr.com live via A record → Vercel         |
| PAPYR-084    | Launch tweet finalized — pre-launch checklist verified          |

### 3.4 Bug Fixes dalam v1.0.0

| **Bug**                                    | **Resolusi**                                    | **Milestone** |
|--------------------------------------------|-------------------------------------------------|---------------|
| Fake PDF menghasilkan 500 (bukan 400)      | Validasi magic bytes → return 400 Bad Request   | M09           |
| Password-protected PDF menghasilkan 500    | Deteksi encrypted PDF → return 400 dengan pesan | M09           |
| BOM character di env vars (Vercel)         | Strip BOM saat config load                      | M05           |
| Magic bytes validation image-to-pdf        | Tambah validasi JPEG/PNG header                 | M05           |

### 3.5 Known Issues pada Saat Launch

| **ID**   | **Deskripsi**                                                  | **Severity** | **Workaround**                    |
|----------|----------------------------------------------------------------|--------------|-----------------------------------|
| KI-001   | Backend di US-West (bukan Asia) — latensi lebih tinggi         | Low          | Client-side processing prioritas  |
| KI-002   | R2 lifecycle minimum 1 hari (bukan 1 jam)                      | Low          | Cron job cleanup setiap 30 menit  |
| KI-003   | Image-to-PDF belum support WEBP                                | Low          | Gunakan JPG/PNG                   |
| KI-004   | Plausible Analytics tidak aktif (diganti Vercel Analytics)      | Info         | Tidak ada — sudah resolved        |

### 3.6 Deviasi dari Rencana Awal

| **Rencana**                    | **Realita**                    | **Alasan**                                          |
|--------------------------------|--------------------------------|-----------------------------------------------------|
| Backend di Render (Free)       | Railway ($5 trial)             | Kartu pembayaran ditolak di Render, Fly.io, Koyeb   |
| Region Asia (Singapore)        | us-west2 (Oregon)              | Railway free tier hanya tersedia di US               |
| R2 auto-delete 1 jam           | Lifecycle min 1 hari           | R2 minimum lifecycle 1 hari; cron sebagai fallback  |
| Next.js 14 + Tailwind v3       | Next.js 16 + Tailwind v4       | Versi terbaru saat init, backward-compatible        |
| Plausible Analytics            | Vercel Analytics               | Gratis, terintegrasi langsung dengan Vercel         |

---

## 4. Rilis v1.1.0 — Tool Expansion (Rotate PDF)

**Tanggal Rilis:** 2026-05-01

**Tipe:** Feature Release

**Milestone:** M11

**Total Tasks:** 5 (PAPYR-085 — PAPYR-089)

### 4.1 Ringkasan

Penambahan tool keenam: Rotate PDF. Tool ini memungkinkan pengguna memutar halaman PDF (90°, 180°, 270°) secara individual atau semua halaman sekaligus. Seluruh pemrosesan dilakukan di sisi klien (browser) menggunakan pdf-lib — zero server upload.

### 4.2 Fitur yang Didelivery

| **Fitur**                        | **Deskripsi**                                                    |
|----------------------------------|------------------------------------------------------------------|
| Rotate PDF Tool                  | Putar halaman PDF per halaman atau semua sekaligus               |
| Rotasi 90°, 180°, 270°          | Tiga opsi sudut rotasi yang tersedia                             |
| Client-side processing           | 100% diproses di browser via pdf-lib — tanpa upload ke server    |
| All-pages rotation               | Rotasi semua halaman sekaligus dengan satu klik                  |
| Per-page rotation                | Rotasi halaman individual dengan kontrol terpisah                |
| Visual rotation indicator        | CSS transform pada thumbnail placeholder                         |
| Analytics integration            | Event tracking task_started/completed/failed untuk rotate        |

### 4.3 Detail Tasks

| **Task ID**  | **Deliverable**                                                          |
|--------------|--------------------------------------------------------------------------|
| PAPYR-085    | `rotatePDF()` + `rotatePDFAllPages()` di pdfUtils.ts                     |
| PAPYR-086    | Halaman `/rotate` — state machine, page grid, rotation controls          |
| PAPYR-087    | Download hasil rotate, analytics tracking                                |
| PAPYR-088    | Layout SEO metadata, sitemap (7 URL), navbar, landing TOOLS array        |
| PAPYR-089    | Build verification — all routes pass, LSP clean                          |

### 4.4 Detail Teknis

- **Processing:** 100% client-side via pdf-lib `page.setRotation(degrees(...))`
- **Rotation logic:** Additive to existing rotation, normalized via `((deg % 360) + 360) % 360`
- **Page grid:** Visual rotation indicator dengan CSS `transform: rotate(Ndeg)` pada thumbnail
- **Analytics:** `ToolName` union extended dengan `"rotate"`
- **Integration updates:**
  - Navbar: 6 → 7 links
  - OtherTools: 5 → 6 tools
  - Landing TOOLS array: 5 → 6 cards
  - Sitemap: 6 → 7 URLs

### 4.5 Breaking Changes

Tidak ada breaking changes. Rilis ini sepenuhnya backward-compatible.

### 4.6 Bug Fixes

Tidak ada bug fixes dalam rilis ini.

---

## 5. Rilis v1.1.1 — Audit Fixes

**Tanggal Rilis:** 2026-05-03

**Tipe:** Patch Release

**Milestone:** Post-audit improvements

### 5.1 Ringkasan

Rilis patch yang mengatasi temuan dari audit internal pasca-launch. Mencakup penambahan dukungan format WEBP pada Image-to-PDF, perbaikan analytics, pembersihan konfigurasi dead code, dan penambahan automated test suite.

### 5.2 Perubahan yang Didelivery

#### 5.2.1 Fitur Baru

| **Perubahan**                          | **Deskripsi**                                                    |
|----------------------------------------|------------------------------------------------------------------|
| WebP support di Image-to-PDF           | Format WEBP kini didukung (RIFF+WEBP magic bytes validation)     |

#### 5.2.2 Perbaikan Analytics

| **Perubahan**                          | **Deskripsi**                                                    |
|----------------------------------------|------------------------------------------------------------------|
| `device_category` tracking             | Tambah tracking mobile/tablet/desktop pada setiap event          |
| Cleanup events                         | Backend log `cleanup_success` dan `cleanup_failure` sebagai structured event |

#### 5.2.3 Pembersihan Kode

| **Perubahan**                          | **Deskripsi**                                                    |
|----------------------------------------|------------------------------------------------------------------|
| Hapus konfigurasi Plausible            | Remove dead `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` references             |

#### 5.2.4 Automated Tests

| **Test Suite**       | **Jumlah** | **Framework** | **Cakupan**                                    |
|----------------------|------------|---------------|------------------------------------------------|
| Frontend unit tests  | 23         | Vitest        | pdfUtils, analytics, components                |
| Backend unit tests   | 34         | Pytest        | compress, image-to-pdf, pdf-to-image, cleanup  |
| **Total**            | **57**     |               |                                                |

### 5.3 Known Issues Resolved

| **ID**   | **Deskripsi**                          | **Status**  |
|----------|----------------------------------------|-------------|
| KI-003   | Image-to-PDF belum support WEBP        | Resolved    |
| KI-004   | Dead Plausible config                  | Resolved    |

---

## 6. Rencana Rilis Mendatang

### 6.1 Roadmap Rilis

| **Versi** | **Nama Rilis**       | **Milestone** | **Fitur Utama**                              | **Target**     |
|-----------|----------------------|---------------|----------------------------------------------|----------------|
| v1.2.0    | Protect PDF          | M12           | Tambahkan password ke PDF                    | Q2 2026        |
| v1.3.0    | Unlock PDF           | M13           | Hapus password dari PDF (jika user tahu)     | Q2 2026        |
| v1.4.0    | Watermark PDF        | M14           | Tambahkan watermark teks/gambar ke PDF       | Q3 2026        |
| v1.5.0    | Sign PDF             | M15           | Tanda tangan digital sederhana (draw/upload) | Q3 2026        |
| v2.0.0    | PDF to Word          | M16           | Konversi PDF ke DOCX                         | Q3-Q4 2026     |
| v2.1.0    | OCR                  | M17           | Extract teks dari PDF/gambar (ID + EN)       | Q4 2026        |

### 6.2 Detail Rilis Berikutnya

#### v1.2.0 — Protect PDF (M12)

- **Scope:** Tambahkan password protection ke file PDF
- **Processing:** Client-side via pdf-lib (jika memungkinkan) atau server-side
- **Requirements:** REQ dari PPR-BRD-001 Section 4.2
- **Prioritas:** P1

#### v1.3.0 — Unlock PDF (M13)

- **Scope:** Hapus password dari PDF (user harus mengetahui password)
- **Processing:** Server-side (membutuhkan decryption engine)
- **Requirements:** REQ dari PPR-BRD-001 Section 4.2
- **Prioritas:** P1

#### v1.4.0+ — Future Tools

- **Watermark PDF:** Teks atau gambar watermark overlay
- **Sign PDF:** Draw atau upload tanda tangan digital
- **PDF to Word:** Konversi PDF ke format DOCX
- **OCR:** Optical Character Recognition (Bahasa Indonesia + English)
- **Multi-language:** Dukungan English sebagai bahasa kedua

---

## 7. Panduan Upgrade

### 7.1 Upgrade ke v1.0.0 (Fresh Install)

Karena v1.0.0 adalah rilis pertama, tidak ada upgrade path. Deployment dilakukan sebagai fresh install:

```
Frontend: Vercel auto-deploy dari branch main
Backend:  Railway auto-deploy dari Dockerfile
Storage:  Cloudflare R2 bucket "papyr-files" (manual setup)
Domain:   mypapyr.com → A record ke Vercel
```

**Environment Variables Required:**

- Frontend: `NEXT_PUBLIC_API_URL`
- Backend: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`

### 7.2 Upgrade ke v1.1.0

**Tipe:** Non-breaking, zero-downtime

**Langkah:**

1. Merge branch `feature/rotate-pdf` ke `develop` → `main`
2. Vercel auto-deploy frontend (route `/rotate` baru)
3. Tidak ada perubahan backend — tool 100% client-side
4. Tidak ada migrasi database
5. Tidak ada perubahan environment variables

**Verifikasi:**

- [ ] Route `/rotate` accessible (HTTP 200)
- [ ] Sitemap.xml menampilkan 7 URL
- [ ] Navbar menampilkan 7 link (termasuk Rotate)
- [ ] Landing page menampilkan 6 tool cards

### 7.3 Upgrade ke v1.1.1

**Tipe:** Non-breaking, zero-downtime

**Langkah:**

1. Merge patch fixes ke `main`
2. Vercel auto-deploy frontend (WebP support, analytics fix)
3. Railway auto-deploy backend (cleanup event logging)
4. Hapus `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` dari environment variables (opsional, sudah tidak digunakan)

**Verifikasi:**

- [ ] Image-to-PDF menerima file .webp tanpa error
- [ ] Analytics events mencakup `device_category` property
- [ ] Backend logs menampilkan `cleanup_success` events
- [ ] Test suite: `npm run test` (23 pass), `pytest` (34 pass)

---

## 8. Kompatibilitas & Dependensi

### 8.1 Browser Support

| **Browser**          | **Versi Minimum** | **Status**  | **Catatan**                        |
|----------------------|-------------------|-------------|------------------------------------|
| Chrome (Android)     | 90+               | Supported   | Target utama (mobile-first)        |
| Chrome (Desktop)     | 90+               | Supported   | Fully tested                       |
| Safari (iOS)         | 15+               | Supported   | Tested                             |
| Firefox              | 90+               | Supported   | Tested                             |
| Edge                 | 90+               | Supported   | Chromium-based                     |
| Samsung Internet     | 15+               | Supported   | Android default browser            |

### 8.2 Dependensi Frontend

| **Package**              | **Versi**  | **Fungsi**                              |
|--------------------------|------------|-----------------------------------------|
| Next.js                  | 16.x       | React framework (SSR + static)          |
| TypeScript               | 5.x        | Type safety                             |
| Tailwind CSS             | 4.x        | Utility-first CSS                       |
| pdf-lib                  | 1.17.x     | Client-side PDF operations              |
| @dnd-kit/core            | 6.x        | Drag-and-drop functionality             |
| @vercel/analytics        | 1.x        | Web analytics                           |
| @vercel/speed-insights   | 1.x        | Performance monitoring                  |

### 8.3 Dependensi Backend

| **Package**     | **Versi**  | **Fungsi**                              |
|-----------------|------------|-----------------------------------------|
| FastAPI         | 0.110+     | Web framework                           |
| Python          | 3.11       | Runtime                                 |
| PyMuPDF (fitz)  | 1.23+      | PDF rendering & image conversion        |
| Ghostscript     | 10+        | PDF compression engine                  |
| boto3           | 1.34+      | S3-compatible client (Cloudflare R2)    |
| slowapi         | 0.1.9+     | Rate limiting                           |
| uvicorn         | 0.27+      | ASGI server                             |

### 8.4 Infrastruktur

| **Service**      | **Provider**     | **Tier**     | **Biaya**          | **Region**    |
|------------------|------------------|--------------|--------------------|---------------|
| Frontend         | Vercel           | Free         | $0/bulan           | Edge (Global) |
| Backend          | Railway          | Trial/$5     | $5/bulan           | us-west2      |
| Object Storage   | Cloudflare R2    | Free         | $0 (10GB/mo)       | Auto          |
| Database         | Supabase         | Free         | $0 (standby)       | Singapore     |
| Domain           | Hostinger        | —            | Paid (annual)      | —             |
| DNS              | Hostinger        | —            | Included           | —             |

### 8.5 Batasan Sistem

| **Parameter**                | **Nilai**          | **Referensi**     |
|------------------------------|--------------------|-------------------|
| Maksimum upload per file     | 20 MB              | BR-001            |
| Rate limit per IP            | 10 req/menit       | BR-009            |
| File retention (server)      | 60 menit           | BR-003            |
| Signed URL expiry            | 3600 detik (1 jam) | BR-008            |
| Concurrent users (target)    | 100                | NFR-015           |
| Client-side threshold        | < 3 MB (img2pdf)   | REQ-IMG-003       |

---

## 9. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Release Notes ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan seluruh rilis produk Papyr yang telah dipublikasikan.

| **Peran**         | **Nama**                     | **Tanda Tangan**  | **Tanggal**  |
|-------------------|------------------------------|-------------------|---------------|
| **Product Owner** | Muhammad Fa'iz Zulfikar      | Approved          | 2026-05-03   |
| **AI Agent**      | OpenCode / Sisyphus          | Approved          | 2026-05-03   |

---

*Dokumen ini dikelola secara aktif dan diperbarui setiap kali rilis baru dipublikasikan. Setiap modifikasi harus ditinjau dan disetujui ulang oleh semua penandatangan.*

**— Akhir Dokumen —**
