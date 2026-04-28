<div align="center">
  <h1>📄 Papyr</h1>
  <p><strong>Alat PDF gratis, cepat, dan privasi-first untuk Indonesia.</strong></p>
  <p>Compress · Merge · Split · Image to PDF · PDF to Image — langsung dari browser, tanpa login.</p>

  <br />

  <a href="https://mypapyr.com"><strong>🌐 Buka Papyr →</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-fitur">Fitur</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-arsitektur">Arsitektur</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-setup-lokal">Setup</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="CHANGELOG.md">Changelog</a>

  <br />
  <br />

  <a href="https://papyr-production.up.railway.app/health">
    <img src="https://img.shields.io/badge/API-online-success?style=flat-square" alt="API Status" />
  </a>
  <a href="https://github.com/fazulfi/papyr/commits/develop">
    <img src="https://img.shields.io/github/last-commit/fazulfi/papyr?style=flat-square&color=blue" alt="Last Commit" />
  </a>
  <a href="https://github.com/fazulfi/papyr/commits/develop">
    <img src="https://img.shields.io/github/commit-activity/w/fazulfi/papyr?style=flat-square&color=blue" alt="Commit Activity" />
  </a>
  <a href="https://github.com/fazulfi/papyr">
    <img src="https://img.shields.io/badge/license-proprietary-1E3A5F?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/fazulfi/papyr">
    <img src="https://img.shields.io/badge/version-0.5.0--alpha.1-blue?style=flat-square" alt="Version" />
  </a>
</div>

<br />

> **Status: MVP 0.7 — Dalam Pengembangan Aktif**
>
> Milestone 1–7 selesai (Setup · Compress · Merge · Split · Image to PDF · PDF to Image · Landing Page + SEO). Lanjut ke Milestone 8 (Analytics).

---

## Daftar Isi

- [Fitur](#-fitur)
- [Arsitektur](#-arsitektur)
- [Tech Stack](#-tech-stack)
- [Deployed URLs](#-deployed-urls)
- [Roadmap](#-roadmap)
- [Setup Lokal](#-setup-lokal)
- [Struktur Proyek](#-struktur-proyek)
- [Kontribusi & Lisensi](#-lisensi)

---

## ✨ Fitur

| | Fitur | Keterangan | Processing |
|---|---|---|---|
| 🗜️ | **Compress PDF** | Perkecil ukuran file hingga 80% tanpa kehilangan kualitas baca | Server (Ghostscript) |
| 📎 | **Merge PDF** | Gabungkan beberapa PDF jadi satu dokumen dengan drag-reorder | Client (pdf-lib) |
| ✂️ | **Split PDF** | Pisahkan halaman tertentu dari PDF dengan page range selector | Client (pdf-lib) |
| 🖼️ | **Image to PDF** | Konversi JPG/PNG ke PDF — multi-image, drag-reorder, auto-fallback | Client + Server |
| 📸 | **PDF to Image** | Ekspor halaman PDF ke gambar PNG berkualitas tinggi | Server (PyMuPDF) |

### Kenapa Papyr?

| | |
|---|---|
| 🇮🇩 **Indonesia-first** | UI Bahasa Indonesia, server dekat Asia, UX disesuaikan kebutuhan lokal |
| 🔒 **Privasi terjaga** | File otomatis dihapus (max 24 jam), tanpa login, tanpa tracking invasif |
| 📱 **Mobile-first** | Didesain untuk layar HP, bukan desktop-first yang dipaksakan responsive |
| ⚡ **Cepat** | Operasi ringan diproses di browser (zero upload), berat di server — tanpa antrian |
| 🆓 **Gratis** | Semua fitur gratis tanpa batas, tanpa watermark, tanpa upsell |

---

## 🏗 Arsitektur

```
                         ┌──────────────────────────────────────────┐
                         │              mypapyr.com                 │
                         │           (Hostinger DNS)                │
                         └──────────────┬───────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
        ┌───────────────────┐                   ┌───────────────────┐
        │   Vercel (Edge)   │                   │ Railway (us-west2)│
        │   Global CDN      │                   │   Container       │
        ├───────────────────┤                   ├───────────────────┤
        │   Next.js 16      │   ── REST API ──▶ │   FastAPI         │
        │   TypeScript      │                   │   Python 3.11     │
        │   Tailwind v4     │                   │   PyMuPDF         │
        │   pdf-lib          │                   │   Ghostscript     │
        └───────────────────┘                   └────────┬──────────┘
                                                         │
                                                         ▼
                                                ┌───────────────────┐
                                                │  Cloudflare R2    │
                                                │  Object Storage   │
                                                ├───────────────────┤
                                                │  Signed URLs      │
                                                │  Auto-delete 24h  │
                                                │  10 GB/mo free    │
                                                └───────────────────┘
```

### Processing Strategy

| Operasi | < 5 MB | ≥ 5 MB |
|---------|--------|--------|
| **Compress** | Server (Ghostscript) | Server (Ghostscript) |
| **Merge** | Client (pdf-lib) | Client (pdf-lib) |
| **Split** | Client (pdf-lib) | Client (pdf-lib) |
| **Image to PDF** | Client (pdf-lib) | Server (PyMuPDF) |
| **PDF to Image** | Server (PyMuPDF) | Server (PyMuPDF) |

> File kecil diproses langsung di browser — **zero upload, zero latency, zero privacy risk.**

---

## 🛠 Tech Stack

<p>
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare R2" />
</p>

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Frontend** | Next.js 16, TypeScript, Tailwind v4 | SSR + static, DM Sans font, design tokens |
| **Client PDF** | pdf-lib, @dnd-kit | Merge, split, image-to-PDF di browser |
| **Backend API** | FastAPI (Python 3.11) | Compress, image-to-PDF fallback, PDF-to-image |
| **Server PDF** | PyMuPDF, Ghostscript | Rendering & compression berkualitas tinggi |
| **Storage** | Cloudflare R2 | Object storage, auto-delete 24h, signed URLs |
| **Hosting** | Vercel + Railway | Frontend edge-global, backend containerized |
| **Domain** | Hostinger | mypapyr.com, DNS management via API |
| **Analytics** | Plausible | Privacy-friendly, no cookies (standby) |
| **Database** | Supabase | Standby — aktif di MVP 0.2 |

---

## 🌐 Deployed URLs

| Service | URL | Platform |
|---------|-----|----------|
| 🖥️ Frontend | [frontend-ten-omega-35.vercel.app](https://frontend-ten-omega-35.vercel.app) | Vercel |
| ⚙️ Backend API | [papyr-production.up.railway.app](https://papyr-production.up.railway.app) | Railway |
| 💓 Health Check | [/health](https://papyr-production.up.railway.app/health) | Railway |
| 🌍 Domain | [mypapyr.com](https://mypapyr.com) | Hostinger |

---

## 📊 Roadmap

| # | Milestone | Scope | Tasks | Status |
|---|-----------|-------|-------|--------|
| M01 | Project Setup | Repo, infra, deploy, config | PAPYR-001 — 010B | ✅ Selesai |
| M02 | Compress PDF | Ghostscript pipeline, UI upload/download | PAPYR-011 — 021 | ✅ Selesai |
| M03 | Merge PDF | Client-side pdf-lib, drag-reorder | PAPYR-022 — 028 | ✅ Selesai |
| M04 | Split PDF | Page picker, client-side extraction | PAPYR-029 — 035 | ✅ Selesai |
| M05 | Image to PDF | Multi-image upload, ordering, fallback | PAPYR-036 — 042 | ✅ Selesai |
| M06 | PDF to Image | Page selection, PyMuPDF rendering | PAPYR-043 — 050 | ✅ Selesai |
| M07 | Landing Page + SEO | Hero, tool pages, navbar, footer | PAPYR-051 — 054 | ✅ Selesai |
| M08 | Analytics | Plausible integration, event tracking | — | ⏳ |
| M09 | Cleanup & Privacy | Cron auto-delete, security hardening | — | ⏳ |
| M10 | Testing + Launch | E2E tests, soft launch, monitoring | — | ⏳ |

> 📅 Target: 8–12 minggu @ 5–10 jam/minggu · Lihat [CHANGELOG.md](CHANGELOG.md) untuk detail per milestone.

---

## 🚀 Setup Lokal

### Prerequisites

| Tool | Versi | Keterangan |
|------|-------|------------|
| Node.js | 20+ | Frontend runtime |
| Python | 3.11+ | Backend runtime |
| Ghostscript | 10+ | PDF compression engine |
| Git | — | Version control |

### 1. Clone

```bash
git clone https://github.com/fazulfi/papyr.git
cd papyr
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local    # Edit sesuai kebutuhan
npm install
npm run dev                    # → http://localhost:3000
```

### 3. Backend

```bash
cd backend
cp .env.example .env           # Isi R2 credentials
python -m venv venv
venv\Scripts\activate           # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload       # → http://localhost:8000
```

<details>
<summary><strong>📋 Environment Variables</strong></summary>

<br />

**Frontend** (`.env.local`)

| Variable | Required | Default | Keterangan |
|----------|----------|---------|------------|
| `NEXT_PUBLIC_API_URL` | ✅ | `http://localhost:8000` | URL backend API |
| `NEXT_PUBLIC_SITE_URL` | | | URL frontend (untuk meta tags) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | | | Domain untuk Plausible analytics |
| `NEXT_PUBLIC_SUPABASE_URL` | | | Supabase project URL (standby) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | | | Supabase anon key (standby) |

**Backend** (`.env`)

| Variable | Required | Default | Keterangan |
|----------|----------|---------|------------|
| `R2_ACCOUNT_ID` | ✅ | | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | ✅ | | R2 API access key |
| `R2_SECRET_ACCESS_KEY` | ✅ | | R2 API secret key |
| `R2_BUCKET_NAME` | ✅ | `papyr-files` | R2 bucket name |
| `R2_PUBLIC_URL` | | | R2 public URL (optional) |
| `CORS_ORIGINS` | | | Comma-separated allowed origins |
| `MAX_UPLOAD_SIZE_MB` | | `20` | Upload limit dalam MB |
| `FILE_RETENTION_MINUTES` | | `60` | Auto-delete timer dalam menit |
| `RATE_LIMIT_PER_MINUTE` | | `10` | Rate limit per IP |
| `SUPABASE_URL` | | | Backend Supabase URL (standby) |
| `SUPABASE_ANON_KEY` | | | Backend Supabase key (standby) |
| `SENTRY_DSN` | | | Error tracking (optional) |
| `HOSTINGER_API_TOKEN` | | | Hostinger API untuk DNS management |

Lihat [`.env.example`](.env.example) untuk template lengkap.

</details>

---

## 📁 Struktur Proyek

```
papyr/
├── frontend/                  # Next.js 16 app (Vercel)
│   └── src/
│       ├── app/               # Pages & routes
│       │   ├── compress/      # /compress — PDF compression
│       │   ├── merge/         # /merge — PDF merge
│       │   ├── split/         # /split — PDF split
│       │   ├── image-to-pdf/  # /image-to-pdf — Image conversion
│       │   └── pdf-to-image/  # /pdf-to-image — PDF to image
│       ├── components/        # Reusable UI components
│       │   ├── Navbar.tsx     # Sticky nav, mobile hamburger
│       │   ├── Footer.tsx     # Footer + language switcher
│       │   ├── OtherTools.tsx # Cross-link to other tools
│       │   ├── PDFUploader.tsx
│       │   ├── PageRangeInput.tsx
│       │   └── ...
│       └── lib/               # Config, utilities, helpers
│           ├── config.ts      # Typed env config + limits
│           └── pdfUtils.ts    # pdf-lib operations
├── backend/                   # FastAPI server (Railway)
│   ├── routers/               # API route handlers
│   │   ├── connectivity.py    # Health & connectivity tests
│   │   └── pdf_to_image.py   # PDF to image conversion
│   ├── services/              # Business logic
│   │   ├── compress.py        # Ghostscript compression
│   │   ├── image_to_pdf.py    # PyMuPDF image conversion
│   │   └── pdf_to_image_service.py  # PDF rasterization
│   ├── utils/
│   │   ├── config.py          # Validated env config (singleton)
│   │   └── r2.py              # Cloudflare R2 helpers
│   ├── Dockerfile             # Production container
│   ├── requirements.txt
│   └── main.py                # FastAPI entrypoint
├── blueprint/                 # Design docs & prototypes (gitignored)
├── tests/                     # Test scripts & generators
├── .env.example               # Environment variable template
├── CHANGELOG.md               # Riwayat perubahan per milestone
└── README.md
```

---

## 👤 Author

**Muhammad Fa'iz Zulfikar** — Solo developer building Papyr as a cashflow business.

- 🌐 [mypapyr.com](https://mypapyr.com)
- 🐙 [github.com/fazulfi](https://github.com/fazulfi)

---

## 📄 Lisensi

Hak cipta © 2026 Muhammad Fa'iz Zulfikar. All rights reserved.

Kode sumber ini bersifat proprietary dan tidak boleh digunakan, disalin, atau didistribusikan tanpa izin tertulis dari pemilik.
