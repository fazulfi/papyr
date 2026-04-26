# 📋 Changelog

Semua perubahan penting pada proyek Papyr didokumentasikan di sini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).
Proyek ini menggunakan [Semantic Versioning](https://semver.org/lang/id/).

---

## [Unreleased]

### 🔜 Akan Datang

- **M02: Compress PDF** — Ghostscript compression pipeline, upload UI, download flow (PAPYR-011 — PAPYR-021)

---

## [0.1.0-alpha.1] — 2026-04-27

### 🏗️ M01 — Project Setup

> Fondasi lengkap: repository, frontend, backend, storage, hosting, domain, dan konfigurasi.
> **11 tasks** · **PAPYR-001 — PAPYR-010B** · **~14 jam**

#### ✅ Ditambahkan

**Repository & Konfigurasi**
- `PAPYR-001` — Inisialisasi GitHub repo [`fazulfi/papyr`](https://github.com/fazulfi/papyr) dengan Gitflow (`main` + `develop`) — [`1d39097`](https://github.com/fazulfi/papyr/commit/1d39097)
- `PAPYR-001` — README.md, .gitignore (Node.js + Python), .env.example
- `PAPYR-006` — Centralized typed config — [`frontend/src/lib/config.ts`](frontend/src/lib/config.ts) + [`backend/utils/config.py`](backend/utils/config.py) — [`bc8ef2b`](https://github.com/fazulfi/papyr/commit/bc8ef2b)
- `PAPYR-006` — Validasi env vars on startup dengan error message Bahasa Indonesia

**Frontend**
- `PAPYR-002` — Next.js 16.2.4 + TypeScript + Tailwind CSS v4 + DM Sans font — [`6078098`](https://github.com/fazulfi/papyr/commit/6078098)
- `PAPYR-002` — Design tokens: navy `#1E3A5F`, accent `#2563EB`, bg `#F9FAFB`
- `PAPYR-002` — Landing page placeholder dengan pill badges (Gratis · Cepat · Privasi Terjaga)
- `PAPYR-008` — Deploy ke **Vercel** dengan GitHub auto-deploy — [`bd685aa`](https://github.com/fazulfi/papyr/commit/bd685aa)

**Backend**
- `PAPYR-003` — FastAPI backend + health check `GET /health` — [`879485e`](https://github.com/fazulfi/papyr/commit/879485e)
- `PAPYR-003` — Struktur folder: `routers/` · `services/` · `utils/`
- `PAPYR-007` — CORS tightening — hanya `GET/POST/OPTIONS`, header `Content-Type/Authorization` — [`3db5150`](https://github.com/fazulfi/papyr/commit/3db5150)
- `PAPYR-009` — Deploy ke **Railway** dengan Dockerfile (Python 3.11-slim, 1 worker) — [`bb085f4`](https://github.com/fazulfi/papyr/commit/bb085f4)
- `PAPYR-010` — Connectivity test endpoint `GET /test/connectivity` (backend → R2 pipeline) — [`9d3d5ec`](https://github.com/fazulfi/papyr/commit/9d3d5ec)

**Storage & Services**
- `PAPYR-004` — Cloudflare R2 helpers: `upload_file()`, `generate_signed_url()`, `delete_file()` — [`6655ce3`](https://github.com/fazulfi/papyr/commit/6655ce3)
- `PAPYR-004` — R2 bucket `papyr-files` dengan lifecycle auto-delete 1 hari
- `PAPYR-005` — Supabase project (standby, belum aktif di MVP 0.1) — [`9e1b0c1`](https://github.com/fazulfi/papyr/commit/9e1b0c1)
- `PAPYR-010B` — Hostinger MCP integration untuk domain management `mypapyr.com` — [`41c1120`](https://github.com/fazulfi/papyr/commit/41c1120)

#### 🏛️ Infrastruktur

| Service | Platform | URL | Biaya |
|---------|----------|-----|-------|
| Frontend | Vercel (Free) | [`frontend-ten-omega-35.vercel.app`](https://frontend-ten-omega-35.vercel.app) | $0 |
| Backend | Railway (Trial) | [`papyr-production.up.railway.app`](https://papyr-production.up.railway.app) | $5 credit / 30 hari |
| Storage | Cloudflare R2 | Bucket: `papyr-files` | Free (10GB/mo) |
| Database | Supabase | Singapore region | Free (standby) |
| Domain | Hostinger | [`mypapyr.com`](https://mypapyr.com) | Expires 2027-04-26 |
| Analytics | Plausible | — | Belum aktif |

#### ⚠️ Deviasi dari Rencana Awal

| Rencana | Realita | Alasan |
|---------|---------|--------|
| Backend di Render (Free) | Railway ($5 trial) | Kartu pembayaran ditolak di Render, Fly.io, dan Koyeb |
| Region Asia (Singapore) | `us-west2` (Oregon) | Railway free tier hanya tersedia di US |
| R2 auto-delete 1 jam | Lifecycle min 1 hari | R2 minimum lifecycle 1 hari; cleanup 1 jam via cron (PAPYR-068) |
| Next.js 14 + Tailwind v3 | Next.js 16.2.4 + Tailwind v4 | Versi terbaru saat init, backward-compatible |
| — | R2 token di-rotate | Token pertama terekspos di screenshot |

---

[Unreleased]: https://github.com/fazulfi/papyr/compare/v0.1.0-alpha.1...HEAD
[0.1.0-alpha.1]: https://github.com/fazulfi/papyr/releases/tag/v0.1.0-alpha.1
