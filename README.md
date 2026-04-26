<div align="center">
  <h1>📄 Papyr</h1>
  <p><strong>Alat PDF gratis, cepat, dan privasi-first untuk Indonesia.</strong></p>
  <p>Compress, merge, split, dan konversi PDF — langsung dari browser, tanpa login.</p>

  <br />

  <a href="https://mypapyr.com"><strong>Buka Papyr →</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-fitur">Fitur</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-tech-stack">Tech Stack</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="#-setup-lokal">Setup</a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="CHANGELOG.md">Changelog</a>

  <br />
  <br />

  <a href="https://papyr-production.up.railway.app/health">
    <img src="https://img.shields.io/badge/API-online-success?style=flat-square" alt="API Status" />
  </a>
  <a href="https://github.com/fazulfi/papyr">
    <img src="https://img.shields.io/github/last-commit/fazulfi/papyr?style=flat-square&color=blue" alt="Last Commit" />
  </a>
  <a href="https://github.com/fazulfi/papyr/commits/develop">
    <img src="https://img.shields.io/github/commit-activity/w/fazulfi/papyr?style=flat-square&color=blue" alt="Commit Activity" />
  </a>
  <a href="https://github.com/fazulfi/papyr">
    <img src="https://img.shields.io/badge/license-proprietary-1E3A5F?style=flat-square" alt="License" />
  </a>
</div>

<br />

> **🚧 Status: MVP 0.1 — Dalam Pengembangan Aktif**
>
> Milestone 1 (Project Setup) selesai. Sedang mengerjakan Milestone 2 (Compress PDF).

---

## ✨ Fitur

| | Fitur | Keterangan |
|---|---|---|
| 🗜️ | **Compress PDF** | Perkecil ukuran file hingga 80% tanpa kehilangan kualitas baca |
| 📎 | **Merge PDF** | Gabungkan beberapa PDF jadi satu dokumen |
| ✂️ | **Split PDF** | Pisahkan halaman tertentu dari PDF |
| 🖼️ | **Image to PDF** | Konversi JPG/PNG ke PDF dalam hitungan detik |
| 📸 | **PDF to Image** | Ekspor halaman PDF ke gambar berkualitas tinggi |

### Kenapa Papyr?

- **🇮🇩 Indonesia-first** — UI Bahasa Indonesia, server dekat Asia
- **🔒 Privasi terjaga** — File otomatis dihapus, tanpa login, tanpa tracking invasif
- **📱 Mobile-first** — Didesain untuk layar HP, bukan desktop-first yang dipaksakan responsive
- **⚡ Cepat** — Operasi ringan diproses di browser, berat di server — tanpa antrian

---

## 🛠 Tech Stack

<p>
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Cloudflare_R2-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare R2" />
</p>

| Layer | Teknologi | Keterangan |
|-------|-----------|------------|
| **Frontend** | Next.js 16, TypeScript, Tailwind v4 | SSR + static, DM Sans font, design tokens |
| **Client PDF** | pdf-lib | Merge, split, image-to-PDF di browser (< 5MB) |
| **Backend API** | FastAPI (Python) | Compress, PDF-to-image, fallback processing |
| **Server PDF** | PyMuPDF, Ghostscript | Rendering & compression berkualitas tinggi |
| **Storage** | Cloudflare R2 | Object storage, auto-delete, signed URLs |
| **Hosting** | Vercel + Railway | Frontend edge-global, backend containerized |
| **Domain** | Hostinger | mypapyr.com, DNS management via API |
| **Analytics** | Plausible | Privacy-friendly, no cookies |
| **Database** | Supabase | Standby — aktif di MVP 0.2 |

### Arsitektur

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Browser        │     │   FastAPI         │     │  Cloudflare R2  │
│   (Next.js)      │────▶│   (Railway)       │────▶│  (Storage)      │
│                  │     │                   │     │                 │
│  pdf-lib         │     │  PyMuPDF          │     │  Auto-delete    │
│  < 5MB client    │     │  Ghostscript      │     │  Signed URLs    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
       │                         │
       ▼                         ▼
  Vercel (Edge)           Railway (Container)
  Global CDN              us-west2
```

---

## 🌐 Deployed URLs

| Service | URL | Status |
|---------|-----|--------|
| 🖥️ Frontend | [frontend-ten-omega-35.vercel.app](https://frontend-ten-omega-35.vercel.app) | ✅ Live |
| ⚙️ Backend API | [papyr-production.up.railway.app](https://papyr-production.up.railway.app) | ✅ Live |
| 💓 Health Check | [/health](https://papyr-production.up.railway.app/health) | ✅ |
| 🌍 Domain | [mypapyr.com](https://mypapyr.com) | 🔜 Coming soon |

---

## 📊 Roadmap

| # | Milestone | Scope | Status |
|---|-----------|-------|--------|
| M01 | Project Setup | Repo, infra, deploy, config | ✅ Selesai |
| M02 | Compress PDF | Ghostscript pipeline, UI upload/download | 🔨 In Progress |
| M03 | Merge PDF | Client-side pdf-lib, drag-reorder | ⏳ |
| M04 | Split PDF | Page picker, client-side extraction | ⏳ |
| M05 | Image to PDF | Multi-image upload, ordering | ⏳ |
| M06 | PDF to Image | Page selection, PyMuPDF rendering | ⏳ |
| M07 | Landing Page + SEO | Hero, tool pages, meta tags, sitemap | ⏳ |
| M08 | Analytics | Plausible integration, event tracking | ⏳ |
| M09 | Cleanup & Privacy | Cron auto-delete, security hardening | ⏳ |
| M10 | Testing + Launch | E2E tests, soft launch, monitoring | ⏳ |

> 📅 Target: 8-12 minggu @ 5-10 jam/minggu

---

## 🚀 Setup Lokal

### Prerequisites

- **Node.js** 20+ &nbsp; · &nbsp; **Python** 3.11+ &nbsp; · &nbsp; **Git**

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

| Variable | Required | Keterangan |
|----------|----------|------------|
| `NEXT_PUBLIC_API_URL` | ✅ | URL backend (default: `http://localhost:8000`) |
| `NEXT_PUBLIC_SITE_URL` | | URL frontend |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | | Domain untuk Plausible analytics |
| `NEXT_PUBLIC_SUPABASE_URL` | | Supabase project URL (standby) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | | Supabase anon key (standby) |
| `R2_ACCOUNT_ID` | ✅ | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | ✅ | R2 API access key |
| `R2_SECRET_ACCESS_KEY` | ✅ | R2 API secret key |
| `R2_BUCKET_NAME` | ✅ | R2 bucket name (default: `papyr-files`) |
| `R2_PUBLIC_URL` | | R2 public URL (optional) |
| `CORS_ORIGINS` | | Comma-separated allowed origins |
| `MAX_UPLOAD_SIZE_MB` | | Upload limit (default: `20`) |
| `FILE_RETENTION_MINUTES` | | Auto-delete timer (default: `60`) |
| `RATE_LIMIT_PER_MINUTE` | | Rate limit per IP (default: `10`) |
| `SUPABASE_URL` | | Backend Supabase URL (standby) |
| `SUPABASE_ANON_KEY` | | Backend Supabase key (standby) |
| `SENTRY_DSN` | | Error tracking (optional) |
| `HOSTINGER_API_TOKEN` | | Hostinger API untuk DNS management |

Lihat [`.env.example`](.env.example) untuk template lengkap.

</details>

---

## 📁 Struktur Proyek

```
papyr/
├── frontend/                # Next.js 16 app (deployed: Vercel)
│   └── src/
│       ├── app/             # Pages, layouts, routes
│       ├── components/      # Reusable UI components
│       └── lib/             # Config, utilities, helpers
│           └── config.ts    # Typed env config + limits
├── backend/                 # FastAPI server (deployed: Railway)
│   ├── routers/             # API route handlers
│   │   └── connectivity.py  # Health & connectivity tests
│   ├── services/            # Business logic (PDF processing)
│   ├── utils/
│   │   ├── config.py        # Validated env config (singleton)
│   │   └── r2.py            # Cloudflare R2 helpers
│   ├── Dockerfile           # Production container (Python 3.11-slim)
│   ├── .dockerignore
│   ├── requirements.txt
│   └── main.py              # FastAPI entrypoint
├── blueprint/               # Docs & design prototypes (gitignored)
├── .env.example             # Environment variable template
├── CHANGELOG.md             # Riwayat perubahan per milestone
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
