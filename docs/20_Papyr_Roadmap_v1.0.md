**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Product Roadmap**

Version 1.0

Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Product Roadmap — Papyr                      |
| **ID Dokumen**      | PPR-RM-001                                   |
| **Versi**           | 1.0                                          |
| **Status**          | Draft                                        |
| **Tanggal Dibuat**  | Juni 2025                                    |
| **Terakhir Diubah** | Juni 2025                                    |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                 |
| **Ditinjau Oleh**   | Product Owner (Muhammad Fa'iz Zulfikar)      |
| **Disetujui Oleh**  | Product Owner                                |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                          |
|-----------|-------------|------------------------------|----------------------------------------------------------------------------------------|
| 1.0       | Juni 2025   | AI Agent (OpenCode/Sisyphus) | Draft awal — Product Roadmap lengkap mencakup MVP 0.1 (completed) hingga Fase 3 (planned) |

**Dokumen Terkait**

| **ID Dokumen** | **Judul**                              | **Status**  |
|----------------|----------------------------------------|-------------|
| PPR-BRD-001    | Business Requirements Document — Papyr | Approved    |
| PPR-PC-001     | Project Charter — Papyr                | Approved    |
| PPR-PP-001     | Project Plan — Papyr                   | Approved    |
| PPR-GTM-001    | Go-To-Market Strategy — Papyr          | Approved    |

---

## 1. Ringkasan Eksekutif

Dokumen ini mendefinisikan Product Roadmap resmi untuk Papyr — web application utilitas PDF yang dirancang khusus untuk pasar Indonesia. Roadmap ini mencakup seluruh fase pengembangan produk dari MVP 0.1 yang telah selesai hingga visi jangka panjang di Fase 3.

**Status Saat Ini:**

- **MVP 0.1** telah selesai sepenuhnya (v1.0.0 + v1.1.0) dengan 11 milestone dan 89 tasks terselesaikan.
- **Papyr live** di [mypapyr.com](https://mypapyr.com) dengan 6 tool aktif: Compress, Merge, Split, Rotate, Image-to-PDF, dan PDF-to-Image.
- **Fase selanjutnya** adalah MVP 0.2 (Tool Expansion) yang bersifat fleksibel tanpa hard deadline.

**Pendekatan Roadmap:**

Roadmap ini menggunakan pendekatan berbasis fase (phase-based) dengan gate conditions antar fase. Setiap fase memiliki kriteria keberhasilan yang harus dipenuhi sebelum melanjutkan ke fase berikutnya. Timeline bersifat fleksibel mengingat Papyr dikembangkan oleh solo developer dengan alokasi waktu 5–10 jam per minggu.

**Ringkasan Fase:**

| **Fase**    | **Fokus**                | **Status**       | **Estimasi**         |
|-------------|--------------------------|------------------|----------------------|
| MVP 0.1     | Core Tools + Launch      | Selesai          | Completed            |
| MVP 0.2     | Tool Expansion           | Selanjutnya      | Fleksibel            |
| MVP 0.3     | Monetisasi               | Direncanakan     | Setelah gate MVP 0.2 |
| Fase 2      | AI Features              | Visi             | Setelah gate MVP 0.3 |
| Fase 3      | Indonesia Deep           | Visi             | Setelah gate Fase 2  |

---

## 2. Visi Produk

### 2.1 Visi Jangka Panjang

> **Menjadi platform utilitas dokumen digital #1 di Indonesia — gratis, cepat, aman, dan cerdas.**

Papyr bertujuan untuk menjadi solusi lengkap bagi seluruh kebutuhan pengelolaan dokumen digital masyarakat Indonesia — mulai dari operasi PDF sederhana hingga fitur AI-powered yang canggih, dengan integrasi mendalam ke ekosistem digital Indonesia (e-Meterai, template pemerintah, compliance lokal).

### 2.2 Prinsip Pengembangan

| **Prinsip**            | **Deskripsi**                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------|
| Privacy-First          | File diproses secara lokal bila memungkinkan; file server dihapus otomatis dalam 24 jam maksimal  |
| Indonesia-First        | UI Bahasa Indonesia default, server dekat Asia, UX disesuaikan kebutuhan lokal                    |
| Mobile-First           | Didesain untuk layar HP terlebih dahulu, bukan desktop-first yang dipaksakan responsive           |
| Zero-Friction          | Tanpa login untuk fitur dasar, tanpa paywall yang membatasi, tanpa watermark                      |
| Incremental Value      | Setiap fase menambah nilai nyata bagi pengguna tanpa merusak pengalaman yang sudah ada            |
| Sustainable Business   | Monetisasi yang adil — gratis untuk kebutuhan dasar, premium untuk fitur lanjutan                 |

### 2.3 Target Pengguna

| **Segmen**             | **Kebutuhan Utama**                                    | **Fase Relevan**       |
|------------------------|--------------------------------------------------------|------------------------|
| Mahasiswa              | Compress tugas, merge dokumen, convert gambar          | MVP 0.1 (tersedia)     |
| Pekerja Kantoran       | Merge laporan, split dokumen, watermark, sign          | MVP 0.2                |
| Freelancer             | Protect PDF, sign kontrak, OCR dokumen scan            | MVP 0.2                |
| UMKM                   | Invoice PDF, e-Meterai, template dokumen               | Fase 3                 |
| Enterprise             | Batch processing, API access, compliance               | MVP 0.3 + Fase 3       |

### 2.4 Evolusi Produk

```
MVP 0.1          MVP 0.2           MVP 0.3          Fase 2          Fase 3
─────────────────────────────────────────────────────────────────────────────►

[Core Tools]  → [Advanced Tools] → [Monetisasi]  → [AI-Powered] → [Indonesia Deep]
 6 tools         +7 tools           Login + Pro      AI Analysis    e-Meterai
 Free only       Free only          Freemium         Smart Tools    Gov Templates
 Zero-login      Zero-login         Optional login   Premium AI     Local Compliance
```

---

## 3. Fase & Timeline

### 3.1 Timeline Visual

| **Fase**    | **Milestone**  | **Deskripsi**                          | **Status**           | **Gate Condition**                                    |
|-------------|----------------|----------------------------------------|----------------------|-------------------------------------------------------|
| MVP 0.1     | M01–M11        | Core 6 tools + Landing + SEO + Launch  | ✅ Selesai           | —                                                     |
| MVP 0.2     | M12–M18        | 7 tool tambahan (advanced)             | 🔄 Selanjutnya       | MVP 0.1 live & stabil                                 |
| MVP 0.3     | M19–M22        | Login, Pro tier, Payment               | 📋 Direncanakan      | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 MAU                |
| Fase 2      | M23–M25        | AI-powered features                    | 🔮 Visi              | MVP 0.3 revenue > Rp 0 (validated willingness to pay) |
| Fase 3      | M26–M28        | Indonesia Deep integration             | 🔮 Visi              | Fase 2 stabil + regulatory readiness                  |

### 3.2 Detail Timeline per Milestone

| **#**  | **Milestone**            | **Fase**  | **Estimasi Effort** | **Dependensi**         | **Status**           |
|--------|--------------------------|-----------|---------------------|------------------------|----------------------|
| M01    | Project Setup            | MVP 0.1   | 10–15 jam           | —                      | ✅ Selesai           |
| M02    | Compress PDF             | MVP 0.1   | 15–20 jam           | M01                    | ✅ Selesai           |
| M03    | Merge PDF                | MVP 0.1   | 10–15 jam           | M01                    | ✅ Selesai           |
| M04    | Split PDF                | MVP 0.1   | 10–15 jam           | M01                    | ✅ Selesai           |
| M05    | Image to PDF             | MVP 0.1   | 10–15 jam           | M01                    | ✅ Selesai           |
| M06    | PDF to Image             | MVP 0.1   | 12–18 jam           | M01                    | ✅ Selesai           |
| M07    | Landing Page + SEO       | MVP 0.1   | 15–20 jam           | M02–M06                | ✅ Selesai           |
| M08    | Analytics                | MVP 0.1   | 5–8 jam             | M07                    | ✅ Selesai           |
| M09    | Cleanup & Privacy        | MVP 0.1   | 12–15 jam           | M02, M06               | ✅ Selesai           |
| M10    | Testing + Launch         | MVP 0.1   | 8–12 jam            | M01–M09                | ✅ Selesai           |
| M11    | Rotate PDF               | MVP 0.1   | 5–8 jam             | M01                    | ✅ Selesai           |
| M12    | Protect PDF              | MVP 0.2   | 8–12 jam            | M01                    | 📋 Planned           |
| M13    | Unlock PDF               | MVP 0.2   | 8–12 jam            | M12                    | 📋 Planned           |
| M14    | Watermark PDF            | MVP 0.2   | 10–15 jam           | M01                    | 📋 Planned           |
| M15    | Sign PDF                 | MVP 0.2   | 15–20 jam           | M01                    | 📋 Planned           |
| M16    | PDF-to-Word              | MVP 0.2   | 15–20 jam           | M01                    | 📋 Planned           |
| M17    | OCR                      | MVP 0.2   | 20–30 jam           | M01                    | 📋 Planned           |
| M18    | PDF-to-Excel             | MVP 0.2   | 15–20 jam           | M16, M17               | 📋 Planned           |

---

## 4. Detail MVP 0.1 — Core Tools & Launch

### 4.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Versi Rilis**        | v1.0.0 (M01–M10) + v1.1.0 (M11)                             |
| **Status**             | COMPLETED                                                     |
| **Total Milestone**    | 11 milestone (M01–M11)                                       |
| **Total Tasks**        | 89 tasks (PAPYR-001 — PAPYR-089)                             |
| **Tools Delivered**    | 6 (Compress, Merge, Split, Image-to-PDF, PDF-to-Image, Rotate) |
| **URL Produksi**       | [mypapyr.com](https://mypapyr.com)                           |

### 4.2 Breakdown per Milestone

| **Milestone** | **Scope**                                                                 | **Tasks**            | **Deliverables**                                      |
|---------------|---------------------------------------------------------------------------|----------------------|-------------------------------------------------------|
| M01           | Repository setup, infrastruktur, deployment pipeline, konfigurasi         | PAPYR-001 — 010B     | Repo, CI/CD, Vercel + Railway deploy                  |
| M02           | Ghostscript compression pipeline, UI upload/download                      | PAPYR-011 — 021      | /compress page, server-side compression               |
| M03           | Client-side PDF merge dengan pdf-lib, drag-reorder                        | PAPYR-022 — 028      | /merge page, multi-file upload, reorder               |
| M04           | Page picker, client-side page extraction                                  | PAPYR-029 — 035      | /split page, page range selector                      |
| M05           | Multi-image upload, ordering, client+server fallback                      | PAPYR-036 — 042      | /image-to-pdf page, auto-fallback logic               |
| M06           | Page selection, PyMuPDF rendering, R2 storage                             | PAPYR-043 — 050      | /pdf-to-image page, PNG export                        |
| M07           | Hero section, navbar, footer, copywriting, meta tags, sitemap             | PAPYR-051 — 060      | Landing page, SEO-optimized pages                     |
| M08           | Vercel Analytics integration, custom event tracking                       | PAPYR-061 — 065      | Analytics dashboard, event taxonomy                   |
| M09           | R2 lifecycle rules, cron auto-delete, privacy page, signed URLs           | PAPYR-068 — 079      | Privacy compliance, auto-cleanup                      |
| M10           | Full flow testing, edge cases, FAQ, OG image, deployment verification     | PAPYR-080 — 084      | Production-ready launch                               |
| M11           | Client-side page rotation (per-page + global)                             | PAPYR-085 — 089      | /rotate page, rotation UI                             |

### 4.3 Arsitektur yang Dibangun

- **Frontend:** Next.js 16 + TypeScript + Tailwind v4 (Vercel)
- **Backend:** FastAPI + Python 3.11 + PyMuPDF + Ghostscript (Railway)
- **Storage:** Cloudflare R2 dengan signed URLs dan auto-delete 60 menit (cron) + 24 jam (R2 lifecycle safety net)
- **Processing:** Hybrid — client-side (pdf-lib) untuk operasi ringan, server-side untuk operasi berat
- **Biaya Operasional:** $0–5/bulan (Vercel Free + Railway Free + R2 Free Tier)

---

## 5. Detail MVP 0.2 — Tool Expansion

### 5.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | NEXT — Selanjutnya dikerjakan                                |
| **Timeline**           | Fleksibel, tanpa hard deadline                               |
| **Total Milestone**    | 7 milestone (M12–M18)                                        |
| **Estimasi Total**     | 91–129 jam                                                   |
| **Pendekatan**         | Sequential per milestone, rilis incremental                  |

### 5.2 M12 — Protect PDF (Password Protect)

| **Atribut**        | **Detail**                                                            |
|--------------------|-----------------------------------------------------------------------|
| **Deskripsi**      | Menambahkan password protection ke file PDF                           |
| **Scope**          | UI input password, enkripsi PDF, download file terproteksi            |
| **Processing**     | Client-side (pdf-lib encryption) atau Server-side (PyMuPDF)           |
| **Dependensi**     | M01 (infrastruktur dasar)                                            |
| **Estimasi**       | 8–12 jam                                                             |
| **Deliverables**   | /protect page, password input UI, encrypted PDF output                |
| **Acceptance**     | User dapat set password, PDF terkunci, bisa dibuka dengan password    |

### 5.3 M13 — Unlock PDF (Remove Password)

| **Atribut**        | **Detail**                                                            |
|--------------------|-----------------------------------------------------------------------|
| **Deskripsi**      | Menghapus password dari PDF yang terproteksi (dengan password valid)   |
| **Scope**          | UI input password existing, dekripsi PDF, download file tanpa password |
| **Processing**     | Server-side (PyMuPDF/pikepdf)                                        |
| **Dependensi**     | M12 (Protect PDF — shared encryption logic)                          |
| **Estimasi**       | 8–12 jam                                                             |
| **Deliverables**   | /unlock page, password verification, decrypted PDF output             |
| **Acceptance**     | User input password benar → PDF unlocked; password salah → error jelas |

### 5.4 M14 — Watermark PDF

| **Atribut**        | **Detail**                                                            |
|--------------------|-----------------------------------------------------------------------|
| **Deskripsi**      | Menambahkan watermark teks atau gambar ke halaman PDF                  |
| **Scope**          | UI konfigurasi watermark (teks/gambar, posisi, opacity, rotasi)       |
| **Processing**     | Client-side (pdf-lib) untuk teks, Server-side untuk gambar kompleks   |
| **Dependensi**     | M01 (infrastruktur dasar)                                            |
| **Estimasi**       | 10–15 jam                                                            |
| **Deliverables**   | /watermark page, watermark configurator, preview, output PDF          |
| **Acceptance**     | Watermark terlihat di semua halaman, posisi & opacity sesuai setting  |

### 5.5 M15 — Sign PDF (Digital Signature)

| **Atribut**        | **Detail**                                                            |
|--------------------|-----------------------------------------------------------------------|
| **Deskripsi**      | Menambahkan tanda tangan digital (draw/upload) ke PDF                 |
| **Scope**          | Canvas signature pad, upload gambar tanda tangan, placement di PDF    |
| **Processing**     | Client-side (pdf-lib + canvas)                                       |
| **Dependensi**     | M01 (infrastruktur dasar)                                            |
| **Estimasi**       | 15–20 jam                                                            |
| **Deliverables**   | /sign page, signature pad, image upload, drag-to-place, signed PDF    |
| **Acceptance**     | Tanda tangan muncul di posisi yang dipilih, kualitas baik di print    |

### 5.6 M16 — PDF-to-Word

| **Atribut**        | **Detail**                                                            |
|--------------------|-----------------------------------------------------------------------|
| **Deskripsi**      | Konversi PDF ke format Microsoft Word (.docx)                         |
| **Scope**          | Upload PDF, ekstraksi konten, generate DOCX, download                 |
| **Processing**     | Server-side (pdf2docx / PyMuPDF + python-docx)                       |
| **Dependensi**     | M01 (infrastruktur dasar)                                            |
| **Estimasi**       | 15–20 jam                                                            |
| **Deliverables**   | /pdf-to-word page, conversion engine, DOCX output                     |
| **Acceptance**     | Layout terjaga, teks dapat diedit di Word, tabel terkonversi          |

### 5.7 M17 — OCR (Optical Character Recognition)

| **Atribut**        | **Detail**                                                            |
|--------------------|-----------------------------------------------------------------------|
| **Deskripsi**      | Ekstraksi teks dari PDF berbasis gambar (scanned documents)           |
| **Scope**          | Upload scanned PDF, OCR processing, output searchable PDF/teks        |
| **Processing**     | Server-side (Tesseract OCR / EasyOCR)                                |
| **Dependensi**     | M01 (infrastruktur dasar)                                            |
| **Estimasi**       | 20–30 jam                                                            |
| **Deliverables**   | /ocr page, OCR engine, searchable PDF output, text extraction         |
| **Acceptance**     | Akurasi ≥ 90% untuk dokumen cetak Bahasa Indonesia, output searchable |

### 5.8 M18 — PDF-to-Excel

| **Atribut**        | **Detail**                                                            |
|--------------------|-----------------------------------------------------------------------|
| **Deskripsi**      | Konversi tabel dalam PDF ke format Microsoft Excel (.xlsx)            |
| **Scope**          | Upload PDF, deteksi tabel, ekstraksi data, generate XLSX              |
| **Processing**     | Server-side (camelot / tabula-py + openpyxl)                         |
| **Dependensi**     | M16 (shared PDF parsing logic), M17 (OCR untuk scanned tables)       |
| **Estimasi**       | 15–20 jam                                                            |
| **Deliverables**   | /pdf-to-excel page, table detection, XLSX output                      |
| **Acceptance**     | Tabel terdeteksi otomatis, data akurat, format kolom terjaga          |

### 5.9 Urutan Pengerjaan yang Direkomendasikan

```
M12 (Protect) → M13 (Unlock) → M14 (Watermark) → M15 (Sign) → M16 (PDF-to-Word) → M17 (OCR) → M18 (PDF-to-Excel)
     │                │                                                    │              │            │
     └── Shared ──────┘                                                    └── Shared ────┴────────────┘
      encryption logic                                                      PDF parsing + extraction
```

**Rasional urutan:**
1. M12 → M13: Shared encryption/decryption logic, natural pair
2. M14, M15: Independent, bisa dikerjakan kapan saja setelah M01
3. M16 → M17 → M18: Progressive complexity, shared PDF content extraction

---

## 6. Detail MVP 0.3 — Monetisasi

### 6.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | PLANNED — Setelah gate condition terpenuhi                   |
| **Gate Condition**     | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 Monthly Active Users       |
| **Fokus**              | Login system, pricing tiers, payment integration              |
| **Payment Provider**   | Midtrans dan/atau Xendit                                     |

### 6.2 Model Pricing

| **Tier**                    | **Harga**                              | **Fitur**                                                                                      |
|-----------------------------|----------------------------------------|------------------------------------------------------------------------------------------------|
| **Free (Tanpa Login)**      | Gratis                                 | Semua basic tools unlimited, max file 20 MB, tanpa perlu akun                                  |
| **Free (Dengan Login)**     | Gratis                                 | + OCR 5x/hari, PDF-to-Word 5x/hari, PDF-to-Excel 3x/hari, Sign 5x/hari                       |
| **Pro**                     | Rp 19.900/bulan (Rp 149.000/tahun)    | Semua fitur unlimited, batch processing, max file 100 MB, priority queue, no branding, API access |

### 6.3 Perbandingan Tier Detail

| **Fitur**                  | **Free (Tanpa Login)** | **Free (Dengan Login)** | **Pro**              |
|----------------------------|------------------------|-------------------------|----------------------|
| Compress PDF               | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| Merge PDF                  | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| Split PDF                  | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| Rotate PDF                 | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| Image to PDF               | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| PDF to Image               | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| Protect PDF                | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| Unlock PDF                 | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| Watermark PDF              | ✅ Unlimited           | ✅ Unlimited            | ✅ Unlimited         |
| Sign PDF                   | ❌                     | 5x/hari                 | ✅ Unlimited         |
| PDF-to-Word                | ❌                     | 5x/hari                 | ✅ Unlimited         |
| OCR                        | ❌                     | 5x/hari                 | ✅ Unlimited         |
| PDF-to-Excel               | ❌                     | 3x/hari                 | ✅ Unlimited         |
| Batch Processing           | ❌                     | ❌                      | ✅                   |
| Max File Size              | 20 MB                  | 20 MB                   | 100 MB               |
| Priority Queue             | ❌                     | ❌                      | ✅                   |
| No Branding                | ❌                     | ❌                      | ✅                   |
| API Access                 | ❌                     | ❌                      | ✅                   |

### 6.4 Komponen Teknis Monetisasi

| **Komponen**           | **Teknologi**                          | **Estimasi Effort**  |
|------------------------|----------------------------------------|----------------------|
| Authentication         | Supabase Auth (email + Google OAuth)   | 15–20 jam            |
| User Dashboard         | Next.js protected routes               | 10–15 jam            |
| Usage Tracking         | Supabase database + rate limiting      | 10–15 jam            |
| Payment Integration    | Midtrans/Xendit SDK                    | 15–20 jam            |
| Subscription Management| Webhook handlers, billing cycle        | 10–15 jam            |
| API Key System         | Token generation, rate limiting        | 8–12 jam             |

### 6.5 Strategi Monetisasi

- **Filosofi:** Gratis untuk kebutuhan dasar, premium untuk power users
- **Konversi Target:** 2–5% dari registered users ke Pro
- **Pricing Rationale:** Rp 19.900/bulan = ~$1.25 USD — sangat terjangkau untuk pasar Indonesia, lebih murah dari kompetitor global (SmallPDF $9/bulan, iLovePDF $4/bulan)
- **Annual Discount:** ~37% diskon untuk komitmen tahunan (Rp 149.000 vs Rp 238.800)

---

## 7. Detail Fase 2 — AI Features

### 7.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | VISI — Perencanaan tingkat tinggi                            |
| **Gate Condition**     | MVP 0.3 menghasilkan revenue > Rp 0 (validated willingness to pay) |
| **Fokus**              | AI-powered document intelligence                              |
| **Teknologi Kandidat** | OpenAI API, Google Gemini, atau model lokal                  |

### 7.2 Fitur yang Direncanakan

| **Fitur**                          | **Deskripsi**                                                                          | **Nilai bagi Pengguna**                              |
|------------------------------------|----------------------------------------------------------------------------------------|------------------------------------------------------|
| AI Document Analysis               | Analisis konten PDF secara otomatis — ringkasan, keyword extraction, klasifikasi       | Memahami dokumen panjang dengan cepat                |
| Smart Compression Recommendations  | AI merekomendasikan level kompresi optimal berdasarkan konten (teks vs gambar vs mixed) | Kompresi lebih efektif tanpa trial-and-error         |
| Content Extraction with AI         | Ekstraksi data terstruktur dari dokumen (invoice, receipt, form) menggunakan AI        | Otomatisasi data entry dari dokumen fisik            |

### 7.3 Pertimbangan Teknis

- **Privacy:** AI processing harus tetap menghormati prinsip privacy-first — opsi client-side AI (WebLLM) untuk dokumen sensitif
- **Cost:** API calls AI memiliki biaya per request — hanya tersedia untuk tier Pro atau dengan kuota terbatas
- **Accuracy:** Perlu validasi akurasi untuk dokumen Bahasa Indonesia sebelum rilis publik
- **Latency:** AI processing membutuhkan waktu lebih lama — perlu UX yang jelas (progress indicator, async processing)

---

## 8. Detail Fase 3 — Indonesia Deep

### 8.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | VISI — Perencanaan tingkat tinggi                            |
| **Gate Condition**     | Fase 2 stabil + regulatory readiness + partnership           |
| **Fokus**              | Integrasi mendalam dengan ekosistem digital Indonesia         |

### 8.2 Fitur yang Direncanakan

| **Fitur**                          | **Deskripsi**                                                                          | **Nilai bagi Pengguna**                              |
|------------------------------------|----------------------------------------------------------------------------------------|------------------------------------------------------|
| e-Meterai Integration              | Integrasi dengan sistem e-Meterai Peruri untuk pembubuhan meterai digital pada PDF     | Legalisasi dokumen digital tanpa ke kantor pos       |
| Government Document Templates      | Template siap pakai untuk dokumen pemerintah (surat keterangan, proposal, laporan)     | Pembuatan dokumen resmi yang cepat dan benar         |
| Local Compliance Features          | Fitur kepatuhan regulasi lokal (format NPWP, NIK validation, tanda tangan elektronik tersertifikasi) | Dokumen yang comply dengan regulasi Indonesia |

### 8.3 Pertimbangan Strategis

- **Partnership:** e-Meterai membutuhkan kerjasama resmi dengan Peruri atau aggregator resmi
- **Regulasi:** Tanda tangan elektronik tersertifikasi membutuhkan sertifikasi dari Kominfo/BSrE
- **Market Timing:** Adopsi e-Meterai di Indonesia masih dalam fase pertumbuhan — timing yang tepat untuk masuk
- **Competitive Moat:** Integrasi Indonesia-specific ini menjadi differentiator kuat terhadap kompetitor global

---

## 9. Prioritas & Dependensi

### 9.1 Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEPENDENCY GRAPH                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MVP 0.1 (COMPLETED)                                                         │
│  ┌─────┐                                                                     │
│  │ M01 │──┬──► M02 ──┐                                                      │
│  │Setup│  ├──► M03   │                                                       │
│  └─────┘  ├──► M04   ├──► M07 ──► M08                                       │
│           ├──► M05   │   (SEO)   (Analytics)                                 │
│           ├──► M06 ──┤                                                       │
│           │          └──► M09 ──► M10 (Launch)                               │
│           └──► M11                                                           │
│                                                                              │
│  MVP 0.2 (NEXT)                                                              │
│  ┌─────┐                                                                     │
│  │ M12 │──► M13                                                              │
│  │Prot.│  (Unlock)                                                           │
│  └─────┘                                                                     │
│  ┌─────┐   ┌─────┐                                                          │
│  │ M14 │   │ M15 │   (Independent)                                           │
│  │W.mrk│   │Sign │                                                           │
│  └─────┘   └─────┘                                                          │
│  ┌─────┐                                                                     │
│  │ M16 │──► M17 ──► M18                                                     │
│  │Word │   (OCR)   (Excel)                                                   │
│  └─────┘                                                                     │
│                                                                              │
│  MVP 0.3 (GATE: traffic/MAU threshold)                                       │
│  ┌─────────────────────────────────────┐                                     │
│  │ Auth → Dashboard → Payment → API    │                                     │
│  └─────────────────────────────────────┘                                     │
│           │                                                                  │
│           ▼                                                                  │
│  Fase 2 (GATE: revenue > 0)                                                 │
│  ┌─────────────────────────────────────┐                                     │
│  │ AI Analysis → Smart Compress → Extract │                                  │
│  └─────────────────────────────────────┘                                     │
│           │                                                                  │
│           ▼                                                                  │
│  Fase 3 (GATE: regulatory + partnership)                                     │
│  ┌─────────────────────────────────────┐                                     │
│  │ e-Meterai → Templates → Compliance  │                                     │
│  └─────────────────────────────────────┘                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Matriks Prioritas

| **Milestone** | **Impact** | **Effort** | **Prioritas** | **Rasional**                                                    |
|---------------|------------|------------|---------------|------------------------------------------------------------------|
| M12 Protect   | Medium     | Low        | P1            | Fitur paling diminta, effort rendah, natural pair dengan M13     |
| M13 Unlock    | Medium     | Low        | P1            | Melengkapi M12, shared logic                                     |
| M14 Watermark | Medium     | Medium     | P2            | Berguna untuk profesional, effort moderat                        |
| M15 Sign      | High       | Medium     | P2            | High demand di Indonesia (kontrak, surat), effort moderat        |
| M16 PDF-Word  | High       | Medium     | P3            | Sangat diminta, tapi butuh server processing yang lebih berat    |
| M17 OCR       | High       | High       | P3            | Kompleks tapi sangat bernilai untuk scanned documents            |
| M18 PDF-Excel | Medium     | Medium     | P4            | Niche use case, bergantung pada M16 dan M17                      |

---

## 10. Metrik Keberhasilan per Fase

### 10.1 MVP 0.1 — Core Tools (COMPLETED)

| **Metrik**                    | **Target**                | **Aktual**       | **Status**  |
|-------------------------------|---------------------------|------------------|-------------|
| Tools Delivered               | 5 tools                   | 6 tools          | ✅ Exceeded |
| Tasks Completed               | 84 tasks                  | 89 tasks         | ✅ Exceeded |
| Production Deploy             | Live di mypapyr.com       | Live             | ✅ Met      |
| Performance (P95)             | < 3 detik                 | TBD              | 📊 Monitoring |
| Task Success Rate             | > 95%                     | TBD              | 📊 Monitoring |

### 10.2 MVP 0.2 — Tool Expansion

| **Metrik**                    | **Target**                                    | **Measurement**                              |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| Tools Delivered               | 7 tools tambahan (total 13)                   | Count of live tools                          |
| Tool Adoption                 | Setiap tool baru ≥ 100 uses dalam 30 hari     | Analytics event tracking                     |
| Task Success Rate             | > 95% per tool                                | Error rate monitoring                        |
| SEO Ranking                   | Top 10 Google ID untuk keyword per tool       | Google Search Console                        |
| Organic Traffic Growth        | +50% dari baseline MVP 0.1                    | Vercel Analytics                             |

### 10.3 MVP 0.3 — Monetisasi

| **Metrik**                    | **Target**                                    | **Measurement**                              |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| Registered Users              | ≥ 1.000 dalam 3 bulan                        | Supabase Auth count                          |
| Free-to-Pro Conversion        | 2–5%                                          | Payment records / registered users           |
| Monthly Recurring Revenue     | ≥ Rp 500.000/bulan dalam 6 bulan             | Payment dashboard                            |
| Churn Rate                    | < 10% per bulan                               | Subscription cancellation tracking           |
| Payment Success Rate          | > 95%                                         | Midtrans/Xendit dashboard                    |

### 10.4 Fase 2 — AI Features

| **Metrik**                    | **Target**                                    | **Measurement**                              |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| AI Feature Adoption           | ≥ 20% Pro users menggunakan AI features       | Feature usage analytics                      |
| AI Accuracy                   | ≥ 90% untuk dokumen Bahasa Indonesia          | Manual sampling + user feedback              |
| Revenue Impact                | +30% MRR dari AI upsell                       | Revenue attribution                          |
| User Satisfaction             | NPS ≥ 40 untuk AI features                    | In-app survey                                |

### 10.5 Fase 3 — Indonesia Deep

| **Metrik**                    | **Target**                                    | **Measurement**                              |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| e-Meterai Transactions        | ≥ 500/bulan dalam 6 bulan                     | Transaction logs                             |
| Template Usage                | ≥ 1.000 downloads/bulan                       | Download tracking                            |
| Enterprise Clients            | ≥ 5 paying enterprise accounts                | CRM                                          |
| Market Position               | Top 3 PDF tool di Indonesia                   | SEO ranking + brand awareness survey         |

---

## 11. Risiko & Mitigasi

### 11.1 Risiko Teknis

| **#** | **Risiko**                                          | **Probabilitas** | **Dampak** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|------------------|------------|---------------------------------------------------------------------------------|
| R01   | OCR accuracy rendah untuk dokumen Indonesia          | Medium           | High       | Evaluasi multiple engines (Tesseract, EasyOCR, PaddleOCR); training data lokal  |
| R02   | Server overload saat traffic meningkat               | Medium           | High       | Auto-scaling Railway, queue system, client-side processing prioritas            |
| R03   | PDF-to-Word conversion quality tidak konsisten       | High             | Medium     | Multiple fallback engines, user expectation management, quality tiers           |
| R04   | AI API cost melebihi revenue                         | Medium           | High       | Strict rate limiting, caching, model optimization, cost monitoring alerts       |
| R05   | Security vulnerability pada file processing          | Low              | Critical   | Input validation, sandboxed processing, regular security audit, file type check |

### 11.2 Risiko Bisnis

| **#** | **Risiko**                                          | **Probabilitas** | **Dampak** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|------------------|------------|---------------------------------------------------------------------------------|
| R06   | Kompetitor lokal muncul dengan fitur serupa          | Medium           | Medium     | First-mover advantage, rapid iteration, Indonesia-deep features sebagai moat    |
| R07   | Willingness to pay rendah di pasar Indonesia         | Medium           | High       | Pricing sangat rendah (Rp 19.900), freemium generous, validate sebelum invest   |
| R08   | Solo developer bottleneck                            | High             | Medium     | Prioritas ketat, AI-assisted development, modular architecture untuk scaling    |
| R09   | Regulasi e-Meterai berubah                           | Low              | Medium     | Monitor regulasi, partnership dengan aggregator resmi, flexible architecture    |
| R10   | Payment provider issues (Midtrans/Xendit)            | Low              | Medium     | Dual provider setup, fallback mechanism, manual invoice option                  |

### 11.3 Risiko Operasional

| **#** | **Risiko**                                          | **Probabilitas** | **Dampak** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|------------------|------------|---------------------------------------------------------------------------------|
| R11   | Cloudflare R2 downtime                               | Low              | High       | Fallback ke direct download, health monitoring, user notification               |
| R12   | Railway container resource limits                    | Medium           | Medium     | Monitoring resource usage, upgrade plan jika perlu, optimize processing         |
| R13   | Domain/DNS issues                                    | Low              | High       | DNS redundancy, monitoring, documented recovery procedure                       |
| R14   | Data loss pada file processing                       | Low              | Medium     | Retry mechanism, user notification, idempotent operations                       |

---

## 12. Referensi Silang (Cross-References)

### 12.1 Dokumen Terkait

| **ID Dokumen** | **Judul**                              | **Relevansi terhadap Roadmap**                                    |
|----------------|----------------------------------------|-------------------------------------------------------------------|
| PPR-BRD-001    | Business Requirements Document         | Business objectives, functional requirements, success metrics     |
| PPR-PC-001     | Project Charter                        | Scope, deliverables, stakeholders, budget constraints             |
| PPR-PP-001     | Project Plan                           | WBS detail, resource allocation, timeline operasional             |
| PPR-GTM-001    | Go-To-Market Strategy                  | Launch strategy, marketing channels, user acquisition plan        |

### 12.2 Mapping Roadmap ke Dokumen

| **Fase Roadmap** | **BRD Section**          | **Project Plan Section** | **GTM Section**          |
|------------------|--------------------------|--------------------------|--------------------------|
| MVP 0.1          | §3 Functional Req        | §3 WBS (M01–M11)        | §2 Launch Strategy       |
| MVP 0.2          | §3.2 Future Req          | §3 WBS (M12–M18)        | §3 Growth Strategy       |
| MVP 0.3          | §4 Business Model        | §4 Resource Plan         | §4 Monetization          |
| Fase 2           | §5 Future Vision         | —                        | §5 Expansion             |
| Fase 3           | §5 Future Vision         | —                        | §5 Expansion             |

### 12.3 Traceability

Setiap milestone dalam roadmap ini dapat di-trace ke:
- **Tasks:** PAPYR-001 — PAPYR-089 (MVP 0.1, completed) + tasks TBD (MVP 0.2+)
- **Requirements:** Functional requirements di PPR-BRD-001
- **Test Cases:** Test plan di PPR-TP-001 (untuk fitur yang sudah dirilis)
- **Release Notes:** PPR-RN-001 (untuk versi yang sudah dirilis)

---

## Persetujuan Dokumen

| **Peran**                    | **Nama**                         | **Tanggal**  | **Status**   |
|------------------------------|----------------------------------|--------------|--------------|
| Product Owner                | Muhammad Fa'iz Zulfikar          | Juni 2025    | Approved     |
| AI Agent                     | OpenCode/Sisyphus                | Juni 2025    | Approved     |

---

*Dokumen ini bersifat rahasia dan hanya untuk penggunaan internal serta keperluan investor. Distribusi tanpa izin tertulis dari Product Owner dilarang.*

*— Akhir Dokumen —*
