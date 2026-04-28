# Changelog

Semua perubahan penting pada proyek **Papyr** didokumentasikan di sini.

Format berdasarkan [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/).
Proyek ini menggunakan [Semantic Versioning](https://semver.org/lang/id/).

---

## [Unreleased]

### M06 — PDF to Image

> Konversi halaman PDF ke gambar PNG berkualitas tinggi — page range selector, PyMuPDF rendering, single/ZIP download.
>
> **8 tasks** · PAPYR-043 — PAPYR-050 · ~19 jam

#### Ditambahkan

**Backend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-043 | Endpoint `POST /api/pdf-to-image` dengan validasi PDF (MIME, extension, magic bytes, size) | [`c833088`][c-c833088] |
| PAPYR-044 | Service `rasterize_pages()` — PyMuPDF rendering ke PNG (150 DPI default) | [`b542048`][c-b542048] |
| PAPYR-045 | ZIP packaging untuk multi-page output (`page_N.png` naming) | [`b542048`][c-b542048] |
| PAPYR-046 | R2 upload + signed URL + temp file cleanup dengan try/finally | [`c833088`][c-c833088] |

**Frontend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-047 | Halaman `/pdf-to-image` — upload zone, PDF info, page range input | [`954cba4`][c-954cba4] |
| PAPYR-048 | POST FormData ke backend, processing state dengan shimmer bar | [`954cba4`][c-954cba4] |
| PAPYR-049 | Download single PNG atau ZIP, success state, reset flow | [`954cba4`][c-954cba4] |

**Testing**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-050 | Test PDF to Image — 7 skenario manual + fixture generator | [`e21a9c3`][c-e21a9c3] |

#### Catatan Teknis

- **Processing**: Selalu server-side (PyMuPDF) — rasterisasi PDF membutuhkan rendering engine.
- **Page range**: Reuse `PageRangeInput` component dari split page, backend juga parse format yang sama.
- **Output**: 1 halaman → PNG langsung, 2+ halaman → ZIP berisi `page_1.png`, `page_2.png`, dst.

---

## [0.5.0-alpha.1] — 2026-04-28

### M05 — Image to PDF

> Konversi gambar (JPG/PNG) ke PDF — multi-image upload, drag-to-reorder, client-side + backend fallback.
>
> **7 tasks** · PAPYR-036 — PAPYR-042 · ~12 jam

#### Ditambahkan

**Frontend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-036 | Halaman `/image-to-pdf` dengan multi-image upload | [`9eb310e`][c-9eb310e] |
| PAPYR-037 | Multi-image upload dengan thumbnail preview | [`9eb310e`][c-9eb310e] |
| PAPYR-038 | Drag-to-reorder gambar sebelum konversi (@dnd-kit) | [`9eb310e`][c-9eb310e] |
| PAPYR-039 | Konversi image-to-PDF client-side (pdf-lib) untuk file < 3 MB | [`9eb310e`][c-9eb310e] |
| PAPYR-041 | Download hasil + success state image-to-PDF | [`9eb310e`][c-9eb310e] |

**Backend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-040 | Endpoint `POST /api/image-to-pdf` (PyMuPDF) untuk file besar | [`9eb310e`][c-9eb310e] |

**Testing**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-042 | Test konversi gambar ke PDF — 7 skenario + 3 bonus | [`7bd8d8c`][c-7bd8d8c] |

#### Diperbaiki

| Deskripsi | Commit |
|-----------|--------|
| Magic bytes validation + PyMuPDF error handling untuk image-to-pdf | [`86e9898`][c-86e9898] |
| Strip BOM dari env vars untuk fix Vercel/Turbopack injection | [`a5c7c2b`][c-a5c7c2b] |

#### Catatan Teknis

- **Processing strategy**: Client-side pdf-lib untuk total < 3 MB, backend PyMuPDF fallback untuk file lebih besar.
- **Drag-reorder**: Reuse @dnd-kit dari merge page — komponen `SortableFileList` di-extend untuk image thumbnails.
- **Validasi**: Magic bytes check (JPEG `FF D8 FF`, PNG `89 50 4E 47`) + file extension + MIME type.
- **BOM fix**: Environment variable dari Vercel mengandung BOM character — di-strip saat config load.

---

## [0.4.0-alpha.1] — 2026-04-27

### M04 — Split PDF

> Pisahkan halaman tertentu dari PDF — page range selector, client-side extraction dengan pdf-lib.
>
> **7 tasks** · PAPYR-029 — PAPYR-035 · ~8 jam

#### Ditambahkan

**Frontend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-029 | Halaman `/split` dengan UI page selector | [`b65ccad`][c-b65ccad] |
| PAPYR-030 | Tampilkan info PDF (jumlah halaman + ukuran) | [`b65ccad`][c-b65ccad] |
| PAPYR-031 | Page range selector UI (e.g. `1-3, 5, 7-10`) | [`b65ccad`][c-b65ccad] |
| PAPYR-032 | Validasi page range input | [`b65ccad`][c-b65ccad] |
| PAPYR-033 | Split logic client-side (pdf-lib) | [`b65ccad`][c-b65ccad] |
| PAPYR-034 | Download hasil split + success state | [`b65ccad`][c-b65ccad] |

**Testing**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-035 | Test Split PDF dengan berbagai skenario | [`1468202`][c-1468202] |

---

## [0.3.0-alpha.1] — 2026-04-27

### M03 — Merge PDF

> Gabungkan beberapa PDF jadi satu dokumen — client-side dengan pdf-lib + drag-reorder.
>
> **7 tasks** · PAPYR-022 — PAPYR-028 · ~8 jam

#### Ditambahkan

**Frontend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-022 | Install pdf-lib + create `pdfUtils.ts` | [`d257478`][c-d257478] |
| PAPYR-023 | Halaman `/merge` — layout + multi-file upload | [`d257478`][c-d257478] |
| PAPYR-024 | Multi-file upload dengan preview (nama, ukuran, hapus) | [`d257478`][c-d257478] |
| PAPYR-025 | Drag-to-reorder dengan @dnd-kit | [`d257478`][c-d257478] |
| PAPYR-026 | Merge logic client-side menggunakan pdf-lib | [`d257478`][c-d257478] |
| PAPYR-027 | Browser download PDF gabungan | [`d257478`][c-d257478] |

**Testing**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-028 | Test merge dengan berbagai kombinasi PDF | [`5984338`][c-5984338] |

---

## [0.2.0-alpha.1] — 2026-04-27

### M02 — Compress PDF

> Ghostscript compression pipeline, upload UI dengan progress, download via signed URL.
>
> **11 tasks** · PAPYR-011 — PAPYR-021 · ~14 jam

#### Ditambahkan

**Backend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-011 | Install PyMuPDF, Pillow, Ghostscript untuk server-side PDF processing | [`d3ca000`][c-d3ca000] |
| PAPYR-012 | Endpoint `POST /api/compress` + validasi file (MIME, extension, ukuran) | [`b0e9148`][c-b0e9148] |
| PAPYR-013 | Ghostscript compression logic (3 level: low, medium, high) | [`b0e9148`][c-b0e9148] |
| PAPYR-014 | Upload hasil compress ke R2 + signed URL untuk download | [`b0e9148`][c-b0e9148] |
| PAPYR-015 | Rate limiting 10 req/min/IP | [`b0e9148`][c-b0e9148] |

**Frontend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-016 | Halaman `/compress` dengan layout tool page | [`3d69fda`][c-3d69fda] |
| PAPYR-017 | Upload component dengan progress bar dan semua state | [`3d69fda`][c-3d69fda] |
| PAPYR-018 | Hasil compress dengan ukuran sebelum/sesudah + persentase | [`3d69fda`][c-3d69fda] |
| PAPYR-019 | Auto-retry 1x dan error handling | [`3d69fda`][c-3d69fda] |

**Testing**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-020 | Test Compress dengan berbagai PDF | [`0a5303f`][c-0a5303f] |
| PAPYR-021 | Benchmark Papyr vs iLovePDF | [`0a5303f`][c-0a5303f] |

#### Diperbaiki

| Deskripsi | Commit |
|-----------|--------|
| Hapus `/health/gs` test endpoint setelah verifikasi | [`7e38667`][c-7e38667] |

---

## [0.1.0-alpha.1] — 2026-04-27

### M01 — Project Setup

> Fondasi lengkap: repository, frontend, backend, storage, hosting, domain, dan konfigurasi.
>
> **11 tasks** · PAPYR-001 — PAPYR-010B · ~14 jam

#### Ditambahkan

**Repository & Konfigurasi**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-001 | Inisialisasi GitHub repo dengan Gitflow (`main` + `develop`) | [`1d39097`][c-1d39097] |
| PAPYR-006 | Centralized typed config — `config.ts` + `config.py` | [`bc8ef2b`][c-bc8ef2b] |

**Frontend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-002 | Next.js 16 + TypeScript + Tailwind CSS v4 + DM Sans font | [`6078098`][c-6078098] |
| PAPYR-008 | Deploy ke Vercel dengan GitHub auto-deploy | [`bd685aa`][c-bd685aa] |

**Backend**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-003 | FastAPI backend + health check `GET /health` | [`879485e`][c-879485e] |
| PAPYR-007 | CORS tightening — `GET/POST/OPTIONS`, header whitelist | [`3db5150`][c-3db5150] |
| PAPYR-009 | Deploy ke Railway dengan Dockerfile (Python 3.11-slim) | [`bb085f4`][c-bb085f4] |
| PAPYR-010 | Connectivity test endpoint `GET /test/connectivity` | [`9d3d5ec`][c-9d3d5ec] |

**Storage & Services**

| Task | Deskripsi | Commit |
|------|-----------|--------|
| PAPYR-004 | Cloudflare R2 helpers: upload, signed URL, delete | [`6655ce3`][c-6655ce3] |
| PAPYR-005 | Supabase project (standby) | [`9e1b0c1`][c-9e1b0c1] |
| PAPYR-010B | Hostinger MCP integration untuk domain `mypapyr.com` | [`41c1120`][c-41c1120] |

#### Infrastruktur

| Service | Platform | URL | Biaya |
|---------|----------|-----|-------|
| Frontend | Vercel (Free) | [frontend-ten-omega-35.vercel.app](https://frontend-ten-omega-35.vercel.app) | $0 |
| Backend | Railway (Trial) | [papyr-production.up.railway.app](https://papyr-production.up.railway.app) | $5 credit / 30 hari |
| Storage | Cloudflare R2 | Bucket: `papyr-files` | Free (10 GB/mo) |
| Database | Supabase | Singapore region | Free (standby) |
| Domain | Hostinger | [mypapyr.com](https://mypapyr.com) | Expires 2027-04-26 |
| Analytics | Plausible | — | Belum aktif |

#### Deviasi dari Rencana Awal

| Rencana | Realita | Alasan |
|---------|---------|--------|
| Backend di Render (Free) | Railway ($5 trial) | Kartu pembayaran ditolak di Render, Fly.io, dan Koyeb |
| Region Asia (Singapore) | `us-west2` (Oregon) | Railway free tier hanya tersedia di US |
| R2 auto-delete 1 jam | Lifecycle min 1 hari | R2 minimum lifecycle 1 hari; cleanup 1 jam via cron (M09) |
| Next.js 14 + Tailwind v3 | Next.js 16 + Tailwind v4 | Versi terbaru saat init, backward-compatible |

---

<!-- Commit reference links -->
[c-b542048]: https://github.com/fazulfi/papyr/commit/b542048
[c-c833088]: https://github.com/fazulfi/papyr/commit/c833088
[c-954cba4]: https://github.com/fazulfi/papyr/commit/954cba4
[c-e21a9c3]: https://github.com/fazulfi/papyr/commit/e21a9c3
[c-2c74c51]: https://github.com/fazulfi/papyr/commit/2c74c51
[c-9eb310e]: https://github.com/fazulfi/papyr/commit/9eb310e
[c-7bd8d8c]: https://github.com/fazulfi/papyr/commit/7bd8d8c
[c-86e9898]: https://github.com/fazulfi/papyr/commit/86e9898
[c-a5c7c2b]: https://github.com/fazulfi/papyr/commit/a5c7c2b
[c-b65ccad]: https://github.com/fazulfi/papyr/commit/b65ccad
[c-1468202]: https://github.com/fazulfi/papyr/commit/1468202
[c-d257478]: https://github.com/fazulfi/papyr/commit/d257478
[c-5984338]: https://github.com/fazulfi/papyr/commit/5984338
[c-d3ca000]: https://github.com/fazulfi/papyr/commit/d3ca000
[c-b0e9148]: https://github.com/fazulfi/papyr/commit/b0e9148
[c-3d69fda]: https://github.com/fazulfi/papyr/commit/3d69fda
[c-0a5303f]: https://github.com/fazulfi/papyr/commit/0a5303f
[c-7e38667]: https://github.com/fazulfi/papyr/commit/7e38667
[c-1d39097]: https://github.com/fazulfi/papyr/commit/1d39097
[c-bc8ef2b]: https://github.com/fazulfi/papyr/commit/bc8ef2b
[c-6078098]: https://github.com/fazulfi/papyr/commit/6078098
[c-bd685aa]: https://github.com/fazulfi/papyr/commit/bd685aa
[c-879485e]: https://github.com/fazulfi/papyr/commit/879485e
[c-3db5150]: https://github.com/fazulfi/papyr/commit/3db5150
[c-bb085f4]: https://github.com/fazulfi/papyr/commit/bb085f4
[c-9d3d5ec]: https://github.com/fazulfi/papyr/commit/9d3d5ec
[c-6655ce3]: https://github.com/fazulfi/papyr/commit/6655ce3
[c-9e1b0c1]: https://github.com/fazulfi/papyr/commit/9e1b0c1
[c-41c1120]: https://github.com/fazulfi/papyr/commit/41c1120

<!-- Version comparison links -->
[Unreleased]: https://github.com/fazulfi/papyr/compare/v0.5.0-alpha.1...HEAD
[0.5.0-alpha.1]: https://github.com/fazulfi/papyr/compare/v0.4.0-alpha.1...v0.5.0-alpha.1
[0.4.0-alpha.1]: https://github.com/fazulfi/papyr/compare/v0.3.0-alpha.1...v0.4.0-alpha.1
[0.3.0-alpha.1]: https://github.com/fazulfi/papyr/compare/v0.2.0-alpha.1...v0.3.0-alpha.1
[0.2.0-alpha.1]: https://github.com/fazulfi/papyr/compare/v0.1.0-alpha.1...v0.2.0-alpha.1
[0.1.0-alpha.1]: https://github.com/fazulfi/papyr/releases/tag/v0.1.0-alpha.1
