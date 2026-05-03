**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Project Charter**

Version 1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Project Charter — Papyr                      |
| **ID Dokumen**      | PPR-PC-001                                   |
| **Versi**           | 1.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Mei 2026                                     |
| **Terakhir Diubah** | Mei 2026                                     |
| **Penulis**         | Muhammad Fa'iz Zulfikar                      |
| **Ditinjau Oleh**   | Product Owner, AI Agent                      |
| **Disetujui Oleh**  | Product Owner, AI Agent                      |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                              |
|-----------|-------------|------------------------------|----------------------------------------------------------------------------|
| 1.0       | Mei 2026    | Muhammad Fa'iz Zulfikar      | Draft awal — Project Charter lengkap untuk Papyr MVP 0.1 dan roadmap awal  |

---

## 1. Project Overview

### 1.1 Ringkasan Proyek

Papyr adalah proyek pengembangan web application utilitas PDF yang dirancang khusus untuk pasar Indonesia. Proyek ini bertujuan membangun platform online yang memungkinkan pengguna Indonesia melakukan operasi PDF umum — compress, merge, split, rotate, convert — secara gratis, cepat, dan aman, tanpa perlu login atau mengunduh software apapun.

Proyek ini diinisiasi sebagai respons terhadap gap yang signifikan di pasar: tidak adanya tool PDF yang dioptimalkan secara spesifik untuk pengguna Indonesia (bahasa lokal, server dekat, tanpa paywall agresif). Papyr mengisi gap ini dengan pendekatan privacy-first, mobile-first, dan zero-login.

### 1.2 Informasi Produk

| **Atribut**          | **Detail**                                                    |
|----------------------|---------------------------------------------------------------|
| **Nama Produk**      | Papyr                                                         |
| **Tagline**          | Tool PDF gratis, cepat, dan aman untuk Indonesia              |
| **Domain**           | mypapyr.com (LIVE)                                            |
| **Versi Saat Ini**   | v1.1.0 (MVP 0.1 — 6 tool aktif)                              |
| **Tipe Produk**      | Web Application (SaaS — Freemium)                             |
| **Kategori**         | Productivity / Utility / Document Management                  |
| **Target Pasar**     | Indonesia (primer), Southeast Asia (ekspansi masa depan)      |

### 1.3 Business Case

Mayoritas pengguna internet Indonesia (270M+ populasi, 77% penetrasi internet) yang membutuhkan operasi PDF sederhana bergantung pada tool global yang memiliki masalah fundamental: server jauh (latensi tinggi), paywall agresif (2-3 operasi gratis/hari), bahasa asing, dan kekhawatiran privasi. Tidak ada tool PDF lokal yang dominan di pasar Indonesia.

Papyr hadir untuk mengisi gap ini dengan value proposition yang jelas:
- **Server dekat Indonesia** — latensi rendah, upload/download cepat bahkan di koneksi 4G.
- **Gratis tanpa paywall** — unlimited usage tanpa batas harian.
- **Bahasa Indonesia default** — antarmuka yang mudah dipahami semua segmen pengguna.
- **Privacy-first** — client-side processing, auto-delete file dalam 60 menit, zero content logging.

---

## 2. Project Objectives

### 2.1 Tujuan Strategis

| **#** | **Tujuan**                                                                                          | **Indikator Keberhasilan**                          |
|-------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| O-1   | Membangun platform utilitas PDF gratis dan privacy-first yang dioptimalkan untuk pengguna Indonesia  | Platform live dan dapat diakses publik              |
| O-2   | Membuktikan product-market fit melalui organic traffic dan repeat usage                             | Repeat usage rate > 25% dalam 3 bulan              |
| O-3   | Membangun brand awareness sebagai "PDF tool-nya Indonesia"                                          | Top 10 Google ID untuk keyword "compress PDF"       |
| O-4   | Memvalidasi model bisnis freemium + subscription murah untuk pasar Indonesia                        | Conversion rate > 2% saat Pro tier diluncurkan      |
| O-5   | Membangun fondasi teknis yang scalable untuk tool expansion dan premium tier                        | Arsitektur modular, < 1 hari untuk tambah tool baru |

### 2.2 Metrik Keberhasilan (KPI)

| **Metrik**                    | **Definisi**                                          | **Target (Bulan 3)** | **Target (Bulan 12)** |
|-------------------------------|-------------------------------------------------------|----------------------|-----------------------|
| Tasks Processed               | Total operasi PDF yang berhasil diselesaikan          | 5.000                | 100.000               |
| SEO Organic Traffic           | Kunjungan bulanan dari mesin pencari                  | 2.000                | 30.000                |
| Repeat Usage Rate             | Pengguna yang kembali dalam 30 hari                   | 25%                  | 40%                   |
| Performance (P95 Response)    | Waktu respons server percentile 95                    | < 3 detik            | < 2 detik             |
| Task Success Rate             | Persentase task yang berhasil tanpa error             | > 95%                | > 99%                 |
| Mobile Completion Rate        | Task yang selesai dari perangkat mobile               | > 80%                | > 90%                 |
| Avg Infrastructure Cost       | Biaya infrastruktur rata-rata per bulan               | < $5                 | < $20                 |

### 2.3 SMART Goals

1. **Specific:** Meluncurkan 6 tool PDF (Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image) yang berfungsi penuh di mypapyr.com.
2. **Measurable:** Mencapai 5.000 tasks processed dalam 3 bulan pertama setelah soft launch.
3. **Achievable:** Dikembangkan oleh solo founder + AI agent dengan budget $0-5/bulan menggunakan free/low-cost infrastructure.
4. **Relevant:** Menjawab kebutuhan nyata pengguna Indonesia akan tool PDF yang cepat, gratis, dan berbahasa Indonesia.
5. **Time-bound:** MVP 0.1 selesai dalam 2 minggu development, soft launch April 2026.

---

## 3. Project Scope

### 3.1 In Scope — MVP 0.1 (Delivered)

| **Modul**          | **Fitur**                                                                          | **Processing** |
|--------------------|------------------------------------------------------------------------------------|----------------|
| Compress PDF       | Kompres file PDF dengan 3 level kualitas (low, medium, high). Ghostscript engine.  | Server         |
| Merge PDF          | Gabungkan 2+ file PDF menjadi satu. Drag-and-drop reorder.                        | Client         |
| Split PDF          | Pisahkan halaman PDF berdasarkan range (e.g., 1-3, 5, 7-10).                      | Client         |
| Image to PDF       | Konversi gambar (JPG, PNG, WEBP) menjadi PDF. Multi-image support.                 | Hybrid         |
| PDF to Image       | Konversi halaman PDF menjadi gambar PNG. ZIP untuk multi-page.                     | Server         |
| Rotate PDF         | Putar halaman PDF (90, 180, 270 derajat). Per-halaman atau semua.                  | Client         |
| Landing Page       | Homepage dengan grid 6 tool, tagline, privacy messaging, mobile-responsive.        | —              |
| SEO Infrastructure | Sitemap.xml, robots.txt, Open Graph, Twitter Card, meta tags Bahasa Indonesia.     | —              |
| Privacy & Cleanup  | Auto-delete file dari R2 dalam 60 menit. Cron fallback. UUID filename.             | Server         |
| Security           | MIME + extension + magic bytes validation, rate limit, CORS, signed URLs.           | Server         |
| Analytics          | Event tracking: task_started, task_completed, task_failed. Vercel Analytics.       | Client         |

### 3.2 In Scope — MVP 0.2 (Roadmap Berikutnya)

| **Modul**          | **Fitur**                                              |
|--------------------|--------------------------------------------------------|
| Protect PDF        | Tambahkan password ke PDF                              |
| Unlock PDF         | Hapus password dari PDF (jika user tahu password)      |
| Watermark PDF      | Tambahkan watermark teks/gambar ke PDF                 |
| Sign PDF           | Tanda tangan digital sederhana (draw/upload)           |
| PDF to Word        | Konversi PDF ke DOCX                                   |
| OCR                | Extract teks dari PDF/gambar (Bahasa Indonesia + EN)   |
| Multi-language     | Dukungan English sebagai bahasa kedua                  |

### 3.3 Out of Scope

- Login / registrasi pengguna (hingga MVP 0.3)
- Dashboard pengguna
- Payment / subscription (hingga MVP 0.3)
- AI-powered features (Fase 2)
- e-Meterai integration (Fase 3)
- Native mobile application (iOS/Android)
- Offline mode
- PDF editing (text/image manipulation)
- Batch processing (hingga Pro tier)
- API access untuk developer (hingga Pro tier)

---

## 4. Deliverables

### 4.1 Deliverables Teknis

| **#** | **Deliverable**                          | **Deskripsi**                                                                 | **Status**    |
|-------|------------------------------------------|-------------------------------------------------------------------------------|---------------|
| D-01  | Frontend Application                     | Next.js 16 app dengan 6 tool pages, landing page, SEO, analytics             | Delivered     |
| D-02  | Backend API                              | FastAPI Python server dengan endpoints compress, image-to-pdf, pdf-to-image   | Delivered     |
| D-03  | Cloud Infrastructure                     | Vercel (frontend) + Railway (backend) + Cloudflare R2 (storage)               | Delivered     |
| D-04  | Domain & DNS                             | mypapyr.com configured dengan Hostinger DNS                                   | Delivered     |
| D-05  | Privacy & Security System                | Auto-delete, signed URLs, rate limiting, file validation multi-layer          | Delivered     |
| D-06  | Analytics System                         | Vercel Analytics dengan custom event tracking                                 | Delivered     |
| D-07  | SEO Infrastructure                       | Sitemap, robots.txt, Open Graph, structured data, meta tags                   | Delivered     |

### 4.2 Deliverables Dokumentasi

| **#** | **Deliverable**                          | **Deskripsi**                                                                 | **Status**    |
|-------|------------------------------------------|-------------------------------------------------------------------------------|---------------|
| D-08  | Business Requirements Document (BRD)     | PPR-BRD-001 — Dokumen kebutuhan bisnis lengkap                                | Delivered     |
| D-09  | Project Charter                          | PPR-PC-001 — Dokumen ini                                                      | Delivered     |
| D-10  | README & Changelog                       | Dokumentasi teknis proyek dan riwayat perubahan                               | Delivered     |
| D-11  | Privacy Policy & FAQ                     | Halaman kebijakan privasi dan FAQ untuk pengguna                              | Delivered     |

### 4.3 Deliverables Bisnis (Roadmap)

| **#** | **Deliverable**                          | **Deskripsi**                                                                 | **Status**    |
|-------|------------------------------------------|-------------------------------------------------------------------------------|---------------|
| D-12  | Pro Tier Subscription                    | Rp 19.900/bulan — unlimited, batch, 100MB, priority, API                      | Planned       |
| D-13  | Payment Integration                      | Midtrans/Xendit — e-wallet, bank transfer, kartu kredit                       | Planned       |
| D-14  | User Authentication                      | Login/registrasi untuk fitur premium dan usage tracking                       | Planned       |

---

## 5. Timeline & Milestones

### 5.1 Timeline Overview

| **Fase**           | **Periode**          | **Durasi**    | **Status**    |
|--------------------|----------------------|---------------|---------------|
| Inisiasi & Setup   | April 2026           | 1 minggu      | Completed     |
| MVP 0.1 Dev        | April 2026           | ~2 minggu     | Completed     |
| Soft Launch        | April 2026           | Ongoing       | Active        |
| MVP 0.2 Dev        | Fleksibel            | No deadline   | Planned       |
| SEO Growth         | Q3-Q4 2026           | Ongoing       | Planned       |
| Monetisasi (Pro)   | Q4 2026              | 4-6 minggu    | Planned       |

### 5.2 Milestone Detail

| **#** | **Milestone**                    | **Scope**                                                          | **Status**    |
|-------|----------------------------------|--------------------------------------------------------------------|---------------|
| M01   | Project Setup                    | Repo, infra, deploy, config                                        | Completed     |
| M02   | Compress PDF                     | Ghostscript pipeline, UI upload/download                           | Completed     |
| M03   | Merge PDF                        | Client-side pdf-lib, drag-reorder                                  | Completed     |
| M04   | Split PDF                        | Page picker, client-side extraction                                | Completed     |
| M05   | Image to PDF                     | Multi-image upload, ordering, fallback                             | Completed     |
| M06   | PDF to Image                     | Page selection, PyMuPDF rendering                                  | Completed     |
| M07   | Landing Page + SEO               | Hero, navbar, footer, copy, meta, sitemap                          | Completed     |
| M08   | Analytics                        | Vercel Analytics, custom events                                    | Completed     |
| M09   | Cleanup & Privacy                | R2 lifecycle, cron auto-delete, privacy page, signed URL           | Completed     |
| M10   | Testing + Launch                 | Full flow tests, edge cases, FAQ, OG image, deploy                 | Completed     |
| M11   | Rotate PDF                       | Client-side page rotation, per-page + global                       | Completed     |
| M12   | Protect PDF                      | Password protection untuk PDF                                      | In Progress   |
| M13   | Unlock PDF                       | Password removal dari PDF                                          | Planned       |
| M14   | Watermark PDF                    | Watermark teks/gambar                                              | Planned       |
| M15   | Sign PDF                         | Digital signature sederhana                                        | Planned       |
| M16   | PDF to Word                      | Konversi PDF ke DOCX                                               | Planned       |
| M17   | OCR                              | Text extraction (ID + EN)                                          | Planned       |
| M18   | Pro Tier & Payment               | Subscription, payment gateway, user auth                           | Planned       |

### 5.3 Effort Allocation

- **Development model:** 100% AI-driven — AI agent (OpenCode/Sisyphus) mengeksekusi seluruh coding, testing, dan documentation. Founder memberikan instruksi dan approval.
- **Sprint cycle:** Continuous delivery, milestone-based tracking
- **MVP 0.2 timeline:** Fleksibel, tanpa hard deadline. Selesai berdasarkan kualitas, bukan waktu.

---

## 6. Budget & Resources

### 6.1 Anggaran Infrastruktur (Bulanan)

| **Service**          | **Tier**              | **Biaya/Bulan**  | **Keterangan**                                    |
|----------------------|-----------------------|------------------|---------------------------------------------------|
| Vercel               | Free Tier             | $0               | Frontend hosting, edge CDN, analytics             |
| Railway              | Starter               | ~$5              | Backend hosting (FastAPI), auto-scaling           |
| Cloudflare R2        | Free Tier             | $0               | Object storage (10GB, 10M reads/bulan)            |
| Domain (mypapyr.com) | Annual                | ~$1/bulan        | Domain registration via Hostinger                 |
| **TOTAL**            |                       | **$0-5/bulan**   | **Self-funded, bootstrap model**                  |

### 6.2 Anggaran Pengembangan

| **Resource**         | **Tipe**              | **Biaya**        | **Keterangan**                                    |
|----------------------|-----------------------|------------------|---------------------------------------------------|
| Founder (Developer)  | Sweat equity          | $0               | Solo founder — waktu sebagai investasi            |
| AI Agent (OpenCode)  | Tool subscription     | Included         | Development executor — coding, testing, docs      |
| Design Tools         | Free tier             | $0               | Figma free, open-source icons                     |
| **TOTAL**            |                       | **$0**           | **Zero cash burn untuk development**              |

### 6.3 Proyeksi Biaya Scaling

| **Traffic Level**        | **Estimasi Biaya/Bulan** | **Trigger**                              |
|--------------------------|--------------------------|------------------------------------------|
| < 1.000 tasks/hari       | $0-5                     | Current state (MVP)                      |
| 1.000-5.000 tasks/hari   | $5-20                    | Railway scaling + R2 egress              |
| 5.000-20.000 tasks/hari  | $20-50                   | Perlu upgrade Railway plan               |
| > 20.000 tasks/hari      | $50-100                  | Evaluasi migrasi ke VPS dedicated        |

### 6.4 Model Pendapatan (Roadmap)

| **Tier**       | **Harga**                        | **Fitur**                                                          |
|----------------|----------------------------------|--------------------------------------------------------------------|
| Free (No Login)| Gratis                           | Semua tool dasar, unlimited, max 20MB/file                         |
| Free (Login)   | Gratis                           | + OCR 5x/hari, PDF-to-Word 5x/hari, Sign PDF 5x/hari             |
| Pro            | Rp 19.900/bulan atau Rp 149.000/tahun | Semua tool unlimited, batch, 100MB, priority, no branding, API |

---

## 7. Stakeholders

### 7.1 Project Team

| **Peran**              | **Nama**                     | **Tanggung Jawab**                                                           | **Komitmen**  |
|------------------------|------------------------------|------------------------------------------------------------------------------|---------------|
| Founder / Product Owner / Project Sponsor | Muhammad Fa'iz Zulfikar | Visi produk, requirements, arsitektur, deployment, keputusan bisnis, final approval | 5-10 jam/minggu |
| AI Agent (Development Executor) | OpenCode (Sisyphus) | Eksekusi coding, testing, documentation, code review, debugging, deployment assistance | On-demand |

### 7.2 Stakeholder Eksternal

| **Stakeholder**        | **Peran**                    | **Kepentingan**                                                  | **Tingkat**   |
|------------------------|------------------------------|------------------------------------------------------------------|---------------|
| End Users              | Pengguna publik              | Menggunakan tool PDF; sumber feedback dan validasi PMF            | Tinggi        |
| Investor/Partner       | Potential stakeholder        | Evaluasi bisnis untuk potensi investasi/kerjasama                | Medium        |
| Platform Providers     | Vercel, Railway, Cloudflare  | Menyediakan infrastruktur; pricing changes berdampak pada proyek | Rendah        |

### 7.3 Model Operasional

Papyr beroperasi dengan model **100% AI-driven development**:

- **Founder (Muhammad Fa'iz Zulfikar)** bertanggung jawab atas visi produk, keputusan strategis, instruksi, dan final approval.
- **AI Agent (OpenCode/Sisyphus)** bertindak sebagai primary executor yang menjalankan 100% coding, testing, documentation, dan code review berdasarkan instruksi founder.
- **OpenClaw AI Agent** bertanggung jawab atas autonomous marketing — social media management, content generation, dan distribusi.
- Model ini memungkinkan velocity tinggi dengan zero cash burn untuk development dan marketing operations.

---

## 8. Risk Assessment

### 8.1 Risk Register

| **Risk ID** | **Risiko**                              | **Probabilitas** | **Dampak** | **Skor** | **Mitigasi**                                                                    |
|-------------|------------------------------------------|------------------|------------|----------|---------------------------------------------------------------------------------|
| RSK-001     | Kompetitor global menambah Bahasa Indonesia | Medium         | Medium     | Medium   | Fokus pada speed + privacy sebagai differentiator, bukan hanya bahasa           |
| RSK-002     | Biaya infrastruktur melonjak tak terduga | Low              | High       | Medium   | Arsitektur client-side first, monitor cost per task, set budget alert $10       |
| RSK-003     | Abuse/misuse platform (upload ilegal)    | Medium           | Medium     | Medium   | Rate limiting 10 req/min/IP, file size limit 20MB, no persistent storage        |
| RSK-004     | SEO competition dari incumbent (iLovePDF, SmallPDF) | High   | Medium     | High     | Long-tail keyword strategy, konten lokal, technical SEO excellence              |
| RSK-005     | Tech debt dari solo development          | Medium           | Medium     | Medium   | Automated testing, clean architecture, documentation, AI-assisted code review   |
| RSK-006     | Railway/Vercel pricing change            | Low              | High       | Medium   | Arsitektur portable (Docker), siap migrasi ke VPS jika diperlukan              |
| RSK-007     | Data breach / privacy incident           | Low              | Critical   | High     | No persistent storage, auto-delete 60min, no content logging, security-first    |
| RSK-008     | Founder burnout (solo operation)         | Medium           | High       | High     | Sustainable pace (5-10 jam/minggu), AI agent leverage, milestone-based progress |
| RSK-009     | Kegagalan validasi product-market fit    | Medium           | High       | High     | Soft launch early, iterate based on data, pivot jika diperlukan                |

### 8.2 Risk Matrix

|                    | **Low Impact**  | **Medium Impact** | **High Impact** | **Critical Impact** |
|--------------------|-----------------|-------------------|-----------------|---------------------|
| **High Prob.**     |                 | RSK-004           |                 |                     |
| **Medium Prob.**   |                 | RSK-001, RSK-003, RSK-005 | RSK-008, RSK-009 |              |
| **Low Prob.**      |                 |                   | RSK-002, RSK-006 | RSK-007            |

### 8.3 Contingency Plans

| **Skenario**                              | **Trigger**                          | **Rencana Kontingensi**                                          |
|-------------------------------------------|--------------------------------------|------------------------------------------------------------------|
| Biaya Railway > $20/bulan                 | Traffic spike sustained              | Migrasi ke VPS (HostData.id) dengan Docker                       |
| Vercel menghapus free tier                | Policy change announcement           | Migrasi ke Cloudflare Pages atau self-host                       |
| Kompetitor launch tool PDF lokal          | Competitor product launch            | Akselerasi fitur differentiator (OCR lokal, e-Meterai)           |
| Data breach attempt                       | Security alert / anomaly detected    | Immediate incident response, audit, public disclosure jika perlu |

---

## 9. Assumptions & Constraints

### 9.1 Asumsi

| **#** | **Asumsi**                                                                                              |
|-------|----------------------------------------------------------------------------------------------------------|
| A-1   | Pengguna Indonesia memiliki koneksi internet stabil (minimal 3G/4G) untuk mengakses aplikasi.            |
| A-2   | Mayoritas akses dari mobile browser (Chrome pada Android) dan desktop browser (Chrome/Edge).             |
| A-3   | Mayoritas file PDF yang diproses berukuran < 10MB (sesuai use case mahasiswa dan pekerja kantoran).      |
| A-4   | Vercel Free Tier dan Railway $5/bulan cukup untuk traffic awal (< 1.000 tasks/hari).                    |
| A-5   | Cloudflare R2 Free Tier (10GB storage, 10 juta read/bulan) cukup untuk volume MVP.                      |
| A-6   | Pengguna Indonesia lebih memilih tool gratis tanpa login dibanding tool berbayar dengan fitur lengkap.   |
| A-7   | Client-side processing (pdf-lib) cukup reliable di browser modern (Chrome 90+, Safari 15+, Firefox 90+).|
| A-8   | Model solo-founder + AI agent cukup untuk deliver MVP dan iterasi awal.                                  |
| A-9   | SEO organic traffic akan menjadi primary acquisition channel tanpa paid marketing.                       |

### 9.2 Constraints

| **#** | **Constraint**                                                                                           |
|-------|----------------------------------------------------------------------------------------------------------|
| C-1   | Budget infrastruktur sangat terbatas: $0-5/bulan (self-funded, no external investment).                   |
| C-2   | Solo developer + AI agent — kapasitas development terbatas, prioritas kualitas over kuantitas.            |
| C-3   | MVP 0.1 hanya mendukung Bahasa Indonesia — English ditambahkan di MVP 0.2.                               |
| C-4   | Tidak ada login/registrasi di MVP 0.1 — semua akses anonim.                                              |
| C-5   | Maksimum upload 20MB per file — limitasi dari infrastruktur free/low-cost.                               |
| C-6   | Tidak ada batch processing di MVP — satu file per operasi (kecuali merge dan image-to-pdf).              |
| C-7   | Tidak ada offline mode — koneksi internet diperlukan untuk semua operasi.                                |
| C-8   | Tidak ada customer support formal — hanya FAQ page dan privacy policy.                                   |
| C-9   | Development pace dibatasi 5-10 jam/minggu untuk sustainability.                                          |

### 9.3 Dependencies

| **Dependency**         | **Tipe**          | **Risiko Jika Gagal**                                    |
|------------------------|-------------------|----------------------------------------------------------|
| Vercel                 | Platform          | Frontend tidak bisa diakses — mitigasi: Cloudflare Pages |
| Railway                | Platform          | Backend down — mitigasi: Docker portable ke VPS          |
| Cloudflare R2          | Object Storage    | File tidak bisa disimpan — mitigasi: AWS S3 fallback     |
| Ghostscript            | System Library    | Compress tidak berfungsi — mitigasi: alternatif engine   |
| PyMuPDF (fitz)         | Python Library    | PDF-to-Image gagal — mitigasi: pdf2image + poppler       |
| pdf-lib                | JS Library        | Client-side ops gagal — mitigasi: server fallback        |
| Domain (mypapyr.com)   | External Service  | Akses via domain gagal — mitigasi: direct Vercel URL     |

---

## 10. Technical Architecture Summary

### 10.1 Technology Stack

| **Layer**        | **Teknologi**                    | **Justifikasi**                                          |
|------------------|----------------------------------|----------------------------------------------------------|
| Frontend         | Next.js 16, TypeScript, Tailwind v4 | SSR + static, SEO-friendly, modern DX                 |
| Client PDF       | pdf-lib, @dnd-kit               | Zero-upload processing untuk privasi dan kecepatan       |
| Backend API      | FastAPI (Python 3.11)           | High-performance async, excellent PDF library ecosystem  |
| Server PDF       | PyMuPDF, Ghostscript            | Industry-standard PDF rendering dan compression          |
| Storage          | Cloudflare R2                   | S3-compatible, generous free tier, auto-delete support   |
| Hosting          | Vercel + Railway                | Edge-global frontend, containerized backend              |
| Analytics        | Vercel Analytics                | Privacy-friendly, no cookies, built-in performance       |
| Domain           | Hostinger                       | mypapyr.com, affordable DNS management                   |

### 10.2 Architecture Principles

1. **Client-Side First** — Operasi yang bisa dilakukan di browser HARUS diproses di client (zero upload, zero latency, zero privacy risk).
2. **Privacy by Design** — No persistent storage, auto-delete 60 menit, UUID filenames, zero content logging.
3. **Mobile-First** — Desain dimulai dari layar mobile, bukan desktop yang dipaksakan responsive.
4. **Cost-Optimized** — Setiap keputusan arsitektur mempertimbangkan biaya operasional.
5. **Modular & Extensible** — Setiap tool adalah modul independen, mudah ditambah tanpa mengubah yang lain.

### 10.3 Security Measures

| **Measure**                  | **Implementasi**                                              |
|------------------------------|---------------------------------------------------------------|
| File Validation              | Triple-layer: MIME type + extension + magic bytes             |
| Rate Limiting                | 10 requests/menit/IP via slowapi                              |
| CORS                         | Strict origin whitelist (mypapyr.com only)                    |
| File Access                  | Signed URLs dengan expiry time                                |
| Data Retention               | Auto-delete 60 menit + cron fallback 30 menit                |
| Filename Anonymization       | UUID replacement — nama asli tidak pernah disimpan            |
| Content Logging              | Zero — hanya metadata operasional yang dicatat                |
| Transport Security           | TLS 1.3 untuk semua transmisi data                           |

---

## 11. Go-to-Market Strategy

### 11.1 Strategi Akuisisi Pengguna

| **Fase**   | **Strategi**                                                                          | **Timeline**     |
|------------|----------------------------------------------------------------------------------------|------------------|
| Fase 1     | **Soft Launch** — Distribusi ke circle personal, komunitas mahasiswa, forum Indonesia  | April-Mei 2026   |
| Fase 2     | **SEO Growth** — Organic acquisition via konten SEO berbahasa Indonesia                | Q3-Q4 2026       |
| Fase 3     | **Monetisasi** — Introduksi tier Pro setelah 10.000+ monthly active tasks             | Q4 2026+         |

### 11.2 Target Keywords (SEO)

- "compress PDF" / "kompres PDF online"
- "gabung PDF" / "merge PDF online"
- "convert gambar ke PDF"
- "split PDF online gratis"
- "rotate PDF online"
- "PDF to image converter"

### 11.3 Competitive Positioning

Papyr memposisikan diri sebagai **"PDF tool-nya Indonesia"** dengan differentiator:
- Satu-satunya tool PDF dengan UI Bahasa Indonesia default
- Server terdekat untuk pengguna Indonesia (Vercel Edge + Railway)
- Gratis tanpa paywall — unlimited usage
- Privacy-first dengan client-side processing

---

## 12. Success Criteria & Exit Criteria

### 12.1 Kriteria Sukses Proyek

| **Kriteria**                                                    | **Threshold**                    |
|-----------------------------------------------------------------|----------------------------------|
| Platform live dan accessible 24/7                               | Uptime > 99%                     |
| Semua 6 tool MVP berfungsi tanpa critical bugs                  | Task success rate > 95%          |
| Organic traffic growing month-over-month                        | MoM growth > 20%                 |
| Biaya infrastruktur terkontrol                                  | < $5/bulan untuk MVP             |
| Positive user feedback (qualitative)                            | No major UX complaints           |
| Repeat usage menunjukkan product-market fit                     | Repeat rate > 25%                |

### 12.2 Exit Criteria (Pivot/Stop)

| **Kondisi**                                                     | **Keputusan**                    |
|-----------------------------------------------------------------|----------------------------------|
| Setelah 6 bulan, organic traffic < 500/bulan                    | Evaluasi pivot atau stop         |
| Biaya infrastruktur > $50/bulan tanpa revenue                   | Evaluasi cost optimization       |
| Kompetitor lokal dominan dengan funding besar                   | Evaluasi niche pivot             |
| Founder tidak dapat mempertahankan development pace             | Evaluasi partnership/hiring      |

---

## 13. Communication Plan

### 13.1 Internal Communication

| **Channel**          | **Tujuan**                                    | **Frekuensi**        |
|----------------------|-----------------------------------------------|----------------------|
| GitHub Issues        | Task tracking dan milestone management        | Per task             |
| CHANGELOG.md         | Dokumentasi perubahan per milestone            | Per milestone        |
| Docs folder          | Dokumentasi formal (BRD, Charter, SRS)        | Per major version    |
| Git commits          | Granular change tracking                      | Per feature/fix      |

### 13.2 External Communication

| **Channel**          | **Tujuan**                                    | **Frekuensi**        |
|----------------------|-----------------------------------------------|----------------------|
| mypapyr.com          | Product delivery dan user-facing updates      | Continuous           |
| Social media         | Brand awareness dan community building        | Weekly (planned)     |
| SEO content          | Organic traffic acquisition                   | Bi-weekly (planned)  |

---

## 14. Document Approval

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Project Charter ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan scope, objectives, dan constraints untuk proyek Papyr.

| **Peran**                | **Nama**                     | **Tanda Tangan** | **Tanggal**  |
|:-------------------------|:-----------------------------|:-----------------|:-------------|
| **Product Owner**        | Muhammad Fa'iz Zulfikar      | Approved         | 2026-05-03   |
| **AI Agent (Executor)**  | OpenCode (Sisyphus)          | Approved         | 2026-05-03   |

---

**Catatan:**

Dokumen ini merupakan living document yang dapat diperbarui seiring perkembangan proyek. Setiap modifikasi material harus ditinjau dan disetujui ulang oleh semua penandatangan. Perubahan minor (typo, formatting) tidak memerlukan re-approval.

**Dokumen Terkait:**

| **ID Dokumen** | **Judul**                              | **Status**  |
|----------------|----------------------------------------|-------------|
| PPR-BRD-001    | Business Requirements Document — Papyr | Approved    |
| PPR-PC-001     | Project Charter — Papyr (dokumen ini)  | Approved    |
| PPR-SRS-001    | Software Requirements Specification    | Approved    |
| PPR-TAD-001    | Technical Architecture Document        | Approved    |

---

*Confidential — Internal & Investor Use Only*
*Copyright 2026 Muhammad Fa'iz Zulfikar. All rights reserved.*
