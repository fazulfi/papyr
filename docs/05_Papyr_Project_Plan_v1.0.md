**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Project Plan**

Version 1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Project Plan — Papyr                         |
| **ID Dokumen**      | PPR-PP-001                                   |
| **Versi**           | 1.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Mei 2026                                     |
| **Terakhir Diubah** | Mei 2026                                     |
| **Penulis**         | Muhammad Fa’iz Zulfikar                      |
| **Ditinjau Oleh**   | Product Owner, AI Agent                      |
| **Disetujui Oleh**  | Product Owner, AI Agent                      |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                      |
|-----------|-------------|------------------------------|--------------------|
| 1.0       | Mei 2026    | Muhammad Fa’iz Zulfikar      | Draft awal — Project Plan lengkap mencakup MVP 0.1 (completed) + MVP 0.2 (planned) |

**Dokumen Terkait**

| **ID Dokumen** | **Judul**                              | **Status**  |
|----------------|----------------------------------------|-------------|
| PPR-BRD-001    | Business Requirements Document — Papyr | Approved    |
| PPR-PC-001     | Project Charter — Papyr                | Approved    |
| PPR-SRS-001    | Software Requirements Specification    | Approved    |
| PPR-TAD-001    | Technical Architecture Document        | Approved    |

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Project Plan ini mendefinisikan pendekatan pengembangan, struktur milestone, work breakdown structure (WBS), alokasi sumber daya, timeline, dan mekanisme pengendalian proyek untuk Papyr — web application utilitas PDF yang dirancang khusus untuk pasar Indonesia.

Dokumen ini berfungsi sebagai panduan operasional utama yang menghubungkan visi bisnis (PPR-BRD-001) dan otorisasi proyek (PPR-PC-001) dengan eksekusi teknis sehari-hari.

### 1.2 Ruang Lingkup

Project Plan ini mencakup:

- **MVP 0.1 (M01–M10):** 84 tasks — COMPLETED (April 2026)

- **M11 Rotate PDF:** 5 tasks — COMPLETED (Mei 2026)

- **MVP 0.2 (M12–M18):** Tool Expansion — PLANNED (timeline fleksibel)

- **MVP 0.3:** Monetisasi — FUTURE (setelah gate condition terpenuhi)

### 1.3 Referensi

| **Referensi**                                    | **Relevansi**                                          |
|--------------------------------------------------|--------------------------------------------------------|
| PPR-BRD-001 — Business Requirements Document     | Business objectives, functional requirements, risiko   |
| PPR-PC-001 — Project Charter                     | Scope, deliverables, stakeholders, budget              |
| Papyr_Implementation_Backlog_MVP_0.1.md          | Detail 84 tasks dengan estimasi jam                    |
| Papyr_Roadmap.md                                 | Fase pengembangan dan gate conditions                  |
| CHANGELOG.md                                     | Riwayat aktual penyelesaian per milestone              |

---

## 2. Metodologi Pengembangan

### 2.1 Model Pengembangan: 100% AI-Driven

Papyr dikembangkan dengan model **100% AI-driven development** — sebuah pendekatan di mana AI Agent bertindak sebagai primary executor yang menjalankan seluruh siklus pengembangan, sementara Product Owner memberikan instruksi strategis dan final approval.

```

+-------------------------------------------------------------------+

|                    MODEL PENGEMBANGAN PAPYR                         |

+-------------------------------------------------------------------+

|                                                                    |
|   Product Owner (Fa’iz)          AI Agent (OpenCode/Sisyphus)      |
|   +---------------------+       +---------------------------+     |
|   | - Visi produk        |       | - 100% coding             |     |
|   | - Requirements       | --->  | - 100% testing            |     |
|   | - Instruksi          |       | - 100% documentation      |     |
|   | - Review & approval  | <---  | - 100% code review        |     |
|   | - Keputusan strategis|       | - 100% debugging          |     |
|   +---------------------+       | - 100% deployment assist  |     |
|                                  +---------------------------+     |
|                                                                    |
|   OpenClaw AI Agent                                                |
|   +---------------------------------------------+                  |
|   | - Autonomous marketing & social media         |                  |
|   | - Content generation & distribusi             |                  |
|   +---------------------------------------------+                  |
|                                                                    |

+-------------------------------------------------------------------+

```

### 2.2 Peran dan Tanggung Jawab

| **Peran**                        | **Nama/Identitas**         | **Tanggung Jawab**                                                              |
|----------------------------------|----------------------------|---------------------------------------------------------------------------------|
| Product Owner / Project Sponsor  | Muhammad Fa’iz Zulfikar    | Visi produk, requirements, instruksi, review, approval, keputusan strategis     |
| AI Agent (Development Executor)  | OpenCode (Sisyphus)        | Coding, testing, documentation, code review, debugging, deployment assistance   |
| AI Agent (Marketing Executor)    | OpenClaw                   | Social media management, content generation, distribusi konten                  |

### 2.3 Prinsip Pengembangan

1. **Milestone-Based Delivery** — Progres diukur berdasarkan penyelesaian milestone, bukan sprint berbasis waktu.

2. **Quality Over Timeline** — Tidak ada hard deadline. Setiap milestone diselesaikan ketika memenuhi kriteria kualitas.

3. **Continuous Delivery** — Setiap milestone yang selesai langsung di-deploy ke production.

4. **Single Source of Truth** — GitHub repository sebagai satu-satunya sumber kebenaran untuk kode, dokumentasi, dan tracking.

5. **Documentation-First** — Setiap fitur didokumentasikan sebelum dianggap selesai (CHANGELOG, README, docs/).

### 2.4 Siklus Pengembangan Per Milestone

```

+----------+    +----------+    +----------+    +----------+    +----------+

| Instruksi|--->| Eksekusi |--->| Testing  |--->|  Review  |--->|  Deploy  |
| (PO)     |    | (AI)     |    | (AI)     |    | (PO)     |    | (AI)     |

+----------+    +----------+    +----------+    +----------+    +----------+

                                                      |

                                                      v

                                               +----------+

                                               |CHANGELOG |
                                               |  Update  |

                                               +----------+

```

1. **Instruksi** — Product Owner memberikan requirements dan acceptance criteria.

2. **Eksekusi** — AI Agent mengimplementasikan coding, testing, dan documentation.

3. **Testing** — AI Agent menjalankan full flow testing, edge cases, dan build verification.

4. **Review** — Product Owner meninjau hasil dan memberikan approval atau feedback.

5. **Deploy** — AI Agent melakukan deployment ke production dan update CHANGELOG.

---

## 3. Struktur Milestone

### 3.1 Ringkasan Seluruh Milestone

| **Kode** | **Milestone** | **Tasks** | **Estimasi** | **Fase** | **Status** |
|----------|---|---|---|---|---|
| M01 | Project Setup | 10 | 14 jam | MVP 0.1 | Completed |
| M02 | Compress PDF | 11 | 27 jam | MVP 0.1 | Completed |
| M03 | Merge PDF | 7 | 15 jam | MVP 0.1 | Completed |
| M04 | Split PDF | 7 | 15 jam | MVP 0.1 | Completed |
| M05 | Image to PDF | 7 | 18 jam | MVP 0.1 | Completed |
| M06 | PDF to Image | 8 | 19 jam | MVP 0.1 | Completed |
| M07 | Landing Page + SEO | 10 | 25 jam | MVP 0.1 | Completed |
| M08 | Analytics | 7 | 10 jam | MVP 0.1 | Completed |
| M09 | Cleanup & Privacy | 7 | 11 jam | MVP 0.1 | Completed |
| M10 | Final Testing + Launch | 10 | 22 jam | MVP 0.1 | Completed |
| M11 | Rotate PDF | 5 | ~8 jam | MVP 0.2 | Completed |
| M12 | Protect PDF | ~7 | ~15 jam | MVP 0.2 | Planned |
| M13 | Unlock PDF | ~7 | ~12 jam | MVP 0.2 | Planned |
| M14 | Watermark PDF | ~7 | ~18 jam | MVP 0.2 | Planned |
| M15 | Sign PDF | ~8 | ~20 jam | MVP 0.2 | Planned |
| M16 | PDF to Word | ~7 | ~18 jam | MVP 0.2 | Planned |
| M17 | OCR | ~8 | ~22 jam | MVP 0.2 | Planned |
| M18 | Integration + Polish | ~5 | ~15 jam | MVP 0.2 | Planned |

**Ringkasan Per Fase:**

| **Fase** | **Milestones** | **Total Tasks** | **Total Estimasi** | **Status** |
|---|---|---|---|---|
| MVP 0.1 | M01–M10 | 84 tasks | ~176 jam | Completed |
| M11 (Rotate) | M11 | 5 tasks | ~8 jam | Completed |
| MVP 0.2 | M12–M18 | ~49 tasks | ~120 jam | Planned |
| **TOTAL** | **18** | **~138 tasks** | **~304 jam** | |

### 3.2 MVP 0.1 — Core Utility (COMPLETED)

**Periode Aktual:** April 2026 (Minggu 1–12)

**Task Range:** PAPYR-001 sampai PAPYR-084

**Versi Rilis:** v1.0.0

MVP 0.1 mencakup fondasi lengkap platform Papyr dengan 6 tool PDF aktif (Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image) beserta infrastruktur pendukung (landing page, SEO, analytics, privacy, security).

Seluruh 84 tasks telah diselesaikan dan di-deploy ke production di mypapyr.com.

### 3.3 M11 — Rotate PDF (COMPLETED)

**Periode Aktual:** Mei 2026

**Task Range:** PAPYR-085 sampai PAPYR-089

**Versi Rilis:** v1.1.0

Tool ke-6 yang menambahkan kemampuan rotasi halaman PDF secara client-side menggunakan pdf-lib. Mendukung rotasi per halaman dan global (semua halaman sekaligus).

### 3.4 MVP 0.2 — Tool Expansion (PLANNED)

**Periode Target:** Fleksibel (Mei–Agustus 2026, tanpa hard deadline)

**Task Range:** PAPYR-090+ (akan didefinisikan per milestone)

**Estimasi Total:** ~49 tasks, ~120 jam

MVP 0.2 berfokus pada ekspansi tool untuk memperluas coverage SEO dan meningkatkan value proposition. Timeline bersifat fleksibel — selesai berdasarkan kualitas, bukan tekanan waktu.

| **Milestone** | **Tool** | **Processing** | **Estimasi Tasks** | **Estimasi Jam** |
|---|---|---|---|---|
| M12 | Protect PDF | Server (PyMuPDF) | ~7 | ~15 |
| M13 | Unlock PDF | Server (PyMuPDF) | ~7 | ~12 |
| M14 | Watermark PDF | Client (pdf-lib) | ~7 | ~18 |
| M15 | Sign PDF | Client (canvas + pdf-lib) | ~8 | ~20 |
| M16 | PDF to Word | Server (LibreOffice) | ~7 | ~18 |
| M17 | OCR | Server (ocrmypdf + Tesseract) | ~8 | ~22 |
| M18 | Integration + Polish | Cross-cutting | ~5 | ~15 |

---

## 4. Work Breakdown Structure (WBS)

### 4.1 MVP 0.1 — Completed Tasks (PAPYR-001 to PAPYR-084)

#### M01: Project Setup (10 tasks, 14 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-001 | M01 | Buat GitHub repo + setup branch strategy | P1 | Completed | — |
| PAPYR-002 | M01 | Init Next.js project dengan TypeScript | P1 | Completed | PAPYR-001 |
| PAPYR-003 | M01 | Init FastAPI project structure | P1 | Completed | PAPYR-001 |
| PAPYR-004 | M01 | Setup Cloudflare R2 bucket | P1 | Completed | — |
| PAPYR-005 | M01 | Setup Supabase project (standby) | P2 | Completed | — |
| PAPYR-006 | M01 | Setup environment variables | P1 | Completed | PAPYR-002, 003 |
| PAPYR-007 | M01 | Setup CORS di FastAPI | P1 | Completed | PAPYR-003 |
| PAPYR-008 | M01 | Deploy Next.js ke Vercel | P1 | Completed | PAPYR-002 |
| PAPYR-009 | M01 | Deploy FastAPI ke Railway | P1 | Completed | PAPYR-003 |
| PAPYR-010 | M01 | Verify end-to-end connectivity | P1 | Completed | PAPYR-008, 009 |

#### M02: Compress PDF (11 tasks, 27 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-011 | M02 | Install PyMuPDF + Ghostscript di Railway | P1 | Completed | PAPYR-009 |
| PAPYR-012 | M02 | Buat endpoint POST /api/compress | P1 | Completed | PAPYR-011 |
| PAPYR-013 | M02 | Implementasi Ghostscript compression logic | P1 | Completed | PAPYR-012 |
| PAPYR-014 | M02 | Upload hasil compress ke R2 + signed URL | P1 | Completed | PAPYR-004, 013 |
| PAPYR-015 | M02 | Rate limiting compress endpoint | P1 | Completed | PAPYR-012 |
| PAPYR-016 | M02 | Buat halaman /compress | P1 | Completed | PAPYR-002 |
| PAPYR-017 | M02 | Upload component dengan progress indicator | P1 | Completed | PAPYR-016 |
| PAPYR-018 | M02 | Tampilkan before/after size + persentase | P1 | Completed | PAPYR-017 |
| PAPYR-019 | M02 | Error state + auto-retry 1x | P2 | Completed | PAPYR-017 |
| PAPYR-020 | M02 | Test compress dengan berbagai PDF | P1 | Completed | PAPYR-013 |
| PAPYR-021 | M02 | Benchmark kualitas vs iLovePDF | P2 | Completed | PAPYR-020 |

#### M03: Merge PDF (7 tasks, 15 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-022 | M03 | Install dan setup pdf-lib di Next.js | P1 | Completed | PAPYR-002 |
| PAPYR-023 | M03 | Buat halaman /merge | P1 | Completed | PAPYR-022 |
| PAPYR-024 | M03 | Multi-file upload + preview nama file | P1 | Completed | PAPYR-023 |
| PAPYR-025 | M03 | Drag-to-reorder file list | P1 | Completed | PAPYR-024 |
| PAPYR-026 | M03 | Merge logic client-side dengan pdf-lib | P1 | Completed | PAPYR-022 |
| PAPYR-027 | M03 | Download hasil merge langsung dari browser | P1 | Completed | PAPYR-026 |
| PAPYR-028 | M03 | Test merge berbagai kombinasi PDF | P1 | Completed | PAPYR-026 |

#### M04: Split PDF (7 tasks, 15 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-029 | M04 | Buat halaman /split | P1 | Completed | PAPYR-022 |
| PAPYR-030 | M04 | Tampilkan info PDF setelah upload | P1 | Completed | PAPYR-029 |
| PAPYR-031 | M04 | Page range selector UI | P1 | Completed | PAPYR-029 |
| PAPYR-032 | M04 | Validasi page range input | P1 | Completed | PAPYR-031 |
| PAPYR-033 | M04 | Split logic client-side dengan pdf-lib | P1 | Completed | PAPYR-022 |
| PAPYR-034 | M04 | Download hasil split | P1 | Completed | PAPYR-033 |
| PAPYR-035 | M04 | Test split dengan PDF berbagai ukuran | P1 | Completed | PAPYR-033 |

#### M05: Image to PDF (7 tasks, 18 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-036 | M05 | Buat halaman /image-to-pdf | P1 | Completed | PAPYR-002 |
| PAPYR-037 | M05 | Multi-image upload dengan preview thumbnail | P1 | Completed | PAPYR-036 |
| PAPYR-038 | M05 | Drag-to-reorder gambar | P1 | Completed | PAPYR-037 |
| PAPYR-039 | M05 | Konversi client-side dengan pdf-lib + Canvas | P1 | Completed | PAPYR-022 |
| PAPYR-040 | M05 | Fallback endpoint POST /api/image-to-pdf | P1 | Completed | PAPYR-011 |
| PAPYR-041 | M05 | Download hasil PDF | P1 | Completed | PAPYR-039 |
| PAPYR-042 | M05 | Test dengan JPG dan PNG berbagai ukuran | P1 | Completed | PAPYR-039, 040 |

#### M06: PDF to Image (8 tasks, 19 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-043 | M06 | Buat endpoint POST /api/pdf-to-image | P1 | Completed | PAPYR-011 |
| PAPYR-044 | M06 | Rasterisasi halaman dengan PyMuPDF | P1 | Completed | PAPYR-043 |
| PAPYR-045 | M06 | ZIP output untuk multiple halaman | P1 | Completed | PAPYR-044 |
| PAPYR-046 | M06 | Upload hasil ke R2 + signed URL | P1 | Completed | PAPYR-004, 044 |
| PAPYR-047 | M06 | Buat halaman /pdf-to-image | P1 | Completed | PAPYR-002 |
| PAPYR-048 | M06 | Page selector UI | P1 | Completed | PAPYR-047 |
| PAPYR-049 | M06 | Download single image atau ZIP | P1 | Completed | PAPYR-045 |
| PAPYR-050 | M06 | Test dengan PDF berbagai tipe | P1 | Completed | PAPYR-044 |

#### M07: Landing Page + SEO (10 tasks, 25 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-051 | M07 | Buat landing page utama | P1 | Completed | PAPYR-002 |
| PAPYR-052 | M07 | Buat tool pages SEO-ready | P1 | Completed | PAPYR-051 |
| PAPYR-053 | M07 | Komponen navigasi + footer | P1 | Completed | PAPYR-051 |
| PAPYR-054 | M07 | Language switcher placeholder | P2 | Completed | PAPYR-053 |
| PAPYR-055 | M07 | Tulis copy landing page Bahasa Indonesia | P1 | Completed | PAPYR-051 |
| PAPYR-056 | M07 | Tulis copy tiap tool page | P1 | Completed | PAPYR-052 |
| PAPYR-057 | M07 | Setup meta title + description semua halaman | P1 | Completed | PAPYR-052 |
| PAPYR-058 | M07 | Buat dan submit sitemap.xml | P1 | Completed | PAPYR-052 |
| PAPYR-059 | M07 | Setup robots.txt | P1 | Completed | — |
| PAPYR-060 | M07 | Daftarkan ke Google Search Console | P1 | Completed | PAPYR-058 |

#### M08: Analytics (7 tasks, 10 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-061 | M08 | Setup Vercel Analytics | P1 | Completed | PAPYR-008 |
| PAPYR-062 | M08 | Pasang analytics script di Next.js | P1 | Completed | PAPYR-061 |
| PAPYR-063 | M08 | Custom event: task_started | P1 | Completed | PAPYR-062 |
| PAPYR-064 | M08 | Custom event: task_completed | P1 | Completed | PAPYR-062 |
| PAPYR-065 | M08 | Custom event: task_failed | P1 | Completed | PAPYR-062 |
| PAPYR-066 | M08 | Log event di backend (tool_used, duration_ms) | P1 | Completed | PAPYR-009 |
| PAPYR-067 | M08 | Verify semua events muncul di dashboard | P1 | Completed | PAPYR-063, 064 |

#### M09: Cleanup & Privacy (7 tasks, 11 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-068 | M09 | Verify R2 lifecycle rules aktif | P1 | Completed | PAPYR-004 |
| PAPYR-069 | M09 | Implementasi cleanup cron job | P1 | Completed | PAPYR-009 |
| PAPYR-070 | M09 | Log hasil cleanup (success/failure) | P1 | Completed | PAPYR-069 |
| PAPYR-071 | M09 | Tampilkan privacy notice di setiap tool | P1 | Completed | PAPYR-052 |
| PAPYR-072 | M09 | Tulis halaman Privacy Policy sederhana | P1 | Completed | — |
| PAPYR-073 | M09 | Test auto-delete setelah 1 jam | P1 | Completed | PAPYR-069 |
| PAPYR-074 | M09 | Verify signed URL expire dengan benar | P1 | Completed | PAPYR-014 |

#### M10: Final Testing + Launch Prep (10 tasks, 22 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-075 | M10 | Full flow testing semua fitur | P1 | Completed | M01–M09 |
| PAPYR-076 | M10 | Mobile browser testing | P1 | Completed | PAPYR-075 |
| PAPYR-077 | M10 | Test dengan sample file PDF Indonesia | P1 | Completed | PAPYR-075 |
| PAPYR-078 | M10 | Test edge cases semua tool | P1 | Completed | PAPYR-075 |
| PAPYR-079 | M10 | Setup basic monitoring di Railway | P1 | Completed | PAPYR-009 |
| PAPYR-080 | M10 | Final deploy check semua environment | P1 | Completed | PAPYR-075 |
| PAPYR-081 | M10 | Tulis halaman FAQ | P1 | Completed | — |
| PAPYR-082 | M10 | Setup Open Graph + Twitter Card meta | P1 | Completed | PAPYR-057 |
| PAPYR-083 | M10 | Setup custom domain mypapyr.com di Vercel | P1 | Completed | PAPYR-008 |
| PAPYR-084 | M10 | Soft launch announcement draft | P2 | Completed | PAPYR-080 |

### 4.2 M11 — Rotate PDF (PAPYR-085 to PAPYR-089)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-085 | M11 | rotatePDF() + rotatePDFAllPages() di pdfUtils.ts | P1 | Completed | PAPYR-022 |
| PAPYR-086 | M11 | Halaman /rotate — state machine, page grid | P1 | Completed | PAPYR-085 |
| PAPYR-087 | M11 | Download hasil rotate + analytics tracking | P1 | Completed | PAPYR-086 |
| PAPYR-088 | M11 | SEO metadata, sitemap, navbar, landing update | P1 | Completed | PAPYR-086 |
| PAPYR-089 | M11 | Build verification — all routes pass, LSP clean | P1 | Completed | PAPYR-088 |

### 4.3 MVP 0.2 — Planned Tasks (M12–M18)

#### M12: Protect PDF (~7 tasks, ~15 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-090 | M12 | Buat endpoint POST /api/protect | P1 | Planned | PAPYR-011 |
| PAPYR-091 | M12 | Implementasi password protection (PyMuPDF) | P1 | Planned | PAPYR-090 |
| PAPYR-092 | M12 | Upload hasil ke R2 + signed URL | P1 | Planned | PAPYR-091 |
| PAPYR-093 | M12 | Buat halaman /protect | P1 | Planned | PAPYR-002 |
| PAPYR-094 | M12 | Password input UI + strength indicator | P1 | Planned | PAPYR-093 |
| PAPYR-095 | M12 | SEO metadata + sitemap + landing update | P1 | Planned | PAPYR-093 |
| PAPYR-096 | M12 | Test protect dengan berbagai PDF | P1 | Planned | PAPYR-091 |

#### M13: Unlock PDF (~7 tasks, ~12 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-097 | M13 | Buat endpoint POST /api/unlock | P1 | Planned | PAPYR-011 |
| PAPYR-098 | M13 | Implementasi password removal (PyMuPDF) | P1 | Planned | PAPYR-097 |
| PAPYR-099 | M13 | Upload hasil ke R2 + signed URL | P1 | Planned | PAPYR-098 |
| PAPYR-100 | M13 | Buat halaman /unlock | P1 | Planned | PAPYR-002 |
| PAPYR-101 | M13 | Password input UI + error handling | P1 | Planned | PAPYR-100 |
| PAPYR-102 | M13 | SEO metadata + sitemap + landing update | P1 | Planned | PAPYR-100 |
| PAPYR-103 | M13 | Test unlock dengan berbagai PDF terproteksi | P1 | Planned | PAPYR-098 |

#### M14: Watermark PDF (~7 tasks, ~18 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-104 | M14 | Watermark logic client-side (pdf-lib) | P2 | Planned | PAPYR-022 |
| PAPYR-105 | M14 | Buat halaman /watermark | P2 | Planned | PAPYR-002 |
| PAPYR-106 | M14 | Text watermark UI (font, size, opacity, position) | P2 | Planned | PAPYR-105 |
| PAPYR-107 | M14 | Image watermark upload + positioning | P2 | Planned | PAPYR-105 |
| PAPYR-108 | M14 | Preview watermark sebelum apply | P2 | Planned | PAPYR-106 |
| PAPYR-109 | M14 | SEO metadata + sitemap + landing update | P2 | Planned | PAPYR-105 |
| PAPYR-110 | M14 | Test watermark text dan image | P2 | Planned | PAPYR-104 |

#### M15: Sign PDF (~8 tasks, ~20 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-111 | M15 | Canvas signature pad component | P2 | Planned | PAPYR-002 |
| PAPYR-112 | M15 | Upload signature image option | P2 | Planned | PAPYR-111 |
| PAPYR-113 | M15 | Buat halaman /sign | P2 | Planned | PAPYR-111 |
| PAPYR-114 | M15 | Signature placement UI (drag on page) | P2 | Planned | PAPYR-113 |
| PAPYR-115 | M15 | Embed signature ke PDF (pdf-lib) | P2 | Planned | PAPYR-022, 114 |
| PAPYR-116 | M15 | Download hasil signed PDF | P2 | Planned | PAPYR-115 |
| PAPYR-117 | M15 | SEO metadata + sitemap + landing update | P2 | Planned | PAPYR-113 |
| PAPYR-118 | M15 | Test sign dengan berbagai PDF | P2 | Planned | PAPYR-115 |

#### M16: PDF to Word (~7 tasks, ~18 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-119 | M16 | Install LibreOffice di container | P2 | Planned | PAPYR-009 |
| PAPYR-120 | M16 | Buat endpoint POST /api/pdf-to-word | P2 | Planned | PAPYR-119 |
| PAPYR-121 | M16 | Implementasi konversi PDF ke DOCX | P2 | Planned | PAPYR-120 |
| PAPYR-122 | M16 | Upload hasil ke R2 + signed URL | P2 | Planned | PAPYR-121 |
| PAPYR-123 | M16 | Buat halaman /pdf-to-word | P2 | Planned | PAPYR-002 |
| PAPYR-124 | M16 | SEO metadata + sitemap + landing update | P2 | Planned | PAPYR-123 |
| PAPYR-125 | M16 | Test konversi dengan berbagai PDF | P2 | Planned | PAPYR-121 |

#### M17: OCR (~8 tasks, ~22 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-126 | M17 | Install ocrmypdf + Tesseract di container | P2 | Planned | PAPYR-009 |
| PAPYR-127 | M17 | Download language data (ind + eng) | P2 | Planned | PAPYR-126 |
| PAPYR-128 | M17 | Buat endpoint POST /api/ocr | P2 | Planned | PAPYR-127 |
| PAPYR-129 | M17 | Implementasi OCR pipeline | P2 | Planned | PAPYR-128 |
| PAPYR-130 | M17 | Buat halaman /ocr | P2 | Planned | PAPYR-002 |
| PAPYR-131 | M17 | Output text display + copy to clipboard | P2 | Planned | PAPYR-130 |
| PAPYR-132 | M17 | SEO metadata + sitemap + landing update | P2 | Planned | PAPYR-130 |
| PAPYR-133 | M17 | Test OCR Bahasa Indonesia + English | P2 | Planned | PAPYR-129 |

#### M18: Integration + Polish (~5 tasks, ~15 jam)

| **Task ID** | **Milestone** | **Task Name** | **Priority** | **Status** | **Dependencies** |
|---|---|---|---|---|---|
| PAPYR-134 | M18 | Update landing page grid (12 tools) | P1 | Planned | M12–M17 |
| PAPYR-135 | M18 | Update OtherTools component (semua tool) | P1 | Planned | M12–M17 |
| PAPYR-136 | M18 | Performance audit + optimization | P1 | Planned | M12–M17 |
| PAPYR-137 | M18 | Full regression testing semua 12 tools | P1 | Planned | PAPYR-136 |
| PAPYR-138 | M18 | CHANGELOG + documentation update | P1 | Planned | PAPYR-137 |

---

## 5. Timeline & Gantt

### 5.1 Timeline Overview

| **Fase** | **Periode** | **Durasi** | **Status** |
|---|---|---|---|
| Inisiasi & Setup | April 2026 | 1 minggu | Completed |
| MVP 0.1 Dev | April 2026 | ~2 minggu | Completed |
| Soft Launch | April 2026 | Ongoing | Active |
| M11 Rotate PDF | Mei 2026 | ~2 hari | Completed |
| MVP 0.2 Dev | Mei–Agustus 2026 | Fleksibel | Planned |
| SEO Growth | Q3–Q4 2026 | Ongoing | Planned |
| Monetisasi (Pro) | Q4 2026+ | 4–6 minggu | Planned |

### 5.2 Gantt Chart (ASCII)

```

2026        Apr                 Mei              Jun              Jul              Agu

            |----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|----|

            W1   W2   W3   W4   W1   W2   W3   W4   W1   W2   W3   W4   W1   W2   W3   W4

```

MVP 0.1     [====================] COMPLETED

 M01        [===]

 M02        [========]

 M03             [====]

 M04             [====]

 M05                  [====]

 M06                  [====]

 M07                       [====]

 M08                       [==]

 M09                            [==]

 M10                            [====]

M11 Rotate                       [==] COMPLETED

MVP 0.2                               [- - - - - - - - - - - - - - - - - - - -] FLEKSIBEL

 M12                                  [- - - -]

 M13                                       [- - - -]

 M14                                            [- - - - -]

 M15                                                 [- - - - -]

 M16                                                      [- - - - -]

 M17                                                           [- - - - - -]

 M18                                                                [- - - -]

LEGENDA:

[====]  = Completed (actual)

[- - -] = Planned (fleksibel, tanpa hard deadline)

### 5.3 Catatan Timeline

- **MVP 0.1** diselesaikan dalam ~2 minggu development aktual (April 2026), lebih cepat dari estimasi 12 minggu karena intensitas development yang tinggi dengan AI agent.

- **MVP 0.2** tidak memiliki hard deadline. Setiap milestone diselesaikan berdasarkan kualitas dan ketersediaan waktu Product Owner.

- **MVP 0.3 (Monetisasi)** hanya dimulai setelah gate condition terpenuhi: 100+ MAU dan 20+ returning users.

- Pace development dibatasi 5–10 jam/minggu untuk sustainability jangka panjang.

---

## 6. Alokasi Sumber Daya

### 6.1 Tim Proyek

| **Peran** | **Nama** | **Alokasi** | **Tanggung Jawab** |
|---|---|---|---|
| Product Owner / Project Sponsor | Muhammad Fa’iz Zulfikar | 5–10 jam/minggu | Visi, requirements, review, approval, keputusan strategis |
| AI Agent (Development) | OpenCode (Sisyphus) | On-demand | 100% coding, testing, documentation, code review, debugging |
| AI Agent (Marketing) | OpenClaw | On-demand | Social media, content generation, distribusi |

### 6.2 Infrastruktur

| **Service** | **Tier** | **Biaya/Bulan** | **Keterangan** |
|---|---|---|---|
| Vercel | Free Tier | $0 | Frontend hosting, edge CDN, analytics |
| Railway | Starter | ~$5 | Backend hosting (FastAPI), auto-scaling |
| Cloudflare R2 | Free Tier | $0 | Object storage (10GB, 10M reads/bulan) |
| Domain (mypapyr.com) | Annual | ~$1/bulan | Domain registration via Hostinger |
| **TOTAL** | | **$0–5/bulan** | **Self-funded, bootstrap model** |

### 6.3 Anggaran Pengembangan

| **Resource** | **Tipe** | **Biaya** | **Keterangan** |
|---|---|---|---|
| Product Owner | Sweat equity | $0 | Waktu sebagai investasi |
| AI Agent (OpenCode) | Tool subscription | Included | Development executor |
| Design Tools | Free tier | $0 | Figma free, open-source icons |
| **TOTAL** | | **$0** | **Zero cash burn untuk development** |

### 6.4 Proyeksi Biaya Scaling

| **Traffic Level** | **Estimasi Biaya/Bulan** | **Trigger** |
|---|---|---|
| < 1.000 tasks/hari | $0–5 | Current state (MVP) |
| 1.000–5.000 tasks/hari | $5–20 | Railway scaling + R2 egress |
| 5.000–20.000 tasks/hari | $20–50 | Perlu upgrade Railway plan |
| > 20.000 tasks/hari | $50–100 | Evaluasi migrasi ke VPS dedicated |

---

## 7. Manajemen Risiko

Bagian ini mereferensikan Risk Assessment dari PPR-BRD-001 Section 13 dan PPR-PC-001 Section 8, dengan penambahan mitigasi spesifik dari perspektif project plan.

### 7.1 Risk Register

| **Risk ID** | **Risiko** | **Probabilitas** | **Dampak** | **Mitigasi** |
|---|---|---|---|---|
| RSK-001 | Kompetitor global menambah Bahasa Indonesia | Medium | Medium | Fokus pada speed + privacy sebagai differentiator, bukan hanya bahasa |
| RSK-002 | Biaya infrastruktur melonjak tak terduga | Low | High | Arsitektur client-side first, monitor cost per task, budget alert $10 |
| RSK-003 | Abuse/misuse platform (upload ilegal) | Medium | Medium | Rate limiting 10 req/min/IP, file size limit 20MB, no persistent storage |
| RSK-004 | SEO competition dari incumbent | High | Medium | Long-tail keyword strategy, konten lokal, technical SEO excellence |
| RSK-005 | Tech debt dari AI-driven development | Medium | Medium | Automated testing, clean architecture, documentation, code review |
| RSK-006 | Railway/Vercel pricing change | Low | High | Arsitektur portable (Docker), siap migrasi ke VPS jika diperlukan |
| RSK-007 | Data breach / privacy incident | Low | Critical | No persistent storage, auto-delete 60min, no content logging |
| RSK-008 | Founder burnout (solo operation) | Medium | High | Sustainable pace (5–10 jam/minggu), AI agent leverage, milestone-based |
| RSK-009 | Kegagalan validasi product-market fit | Medium | High | Soft launch early, iterate based on data, pivot jika diperlukan |

### 7.2 Risk Matrix

|  | **Low Impact** | **Medium Impact** | **High Impact** | **Critical Impact** |
|---|---|---|---|---|
| **High Prob.** | | RSK-004 | | |
| **Medium Prob.** | | RSK-001, RSK-003, RSK-005 | RSK-008, RSK-009 | |
| **Low Prob.** | | | RSK-002, RSK-006 | RSK-007 |

### 7.3 Contingency Plans

| **Skenario** | **Trigger** | **Rencana Kontingensi** |
|---|---|---|
| Biaya Railway > $20/bulan | Traffic spike sustained | Migrasi ke VPS (HostData.id) dengan Docker |
| Vercel menghapus free tier | Policy change announcement | Migrasi ke Cloudflare Pages atau self-host |
| Kompetitor launch tool PDF lokal | Competitor product launch | Akselerasi fitur differentiator (OCR lokal, e-Meterai) |
| Data breach attempt | Security alert / anomaly | Immediate incident response, audit, public disclosure |

---

## 8. Kriteria Keberhasilan per Milestone

### 8.1 Kriteria Umum (Berlaku untuk Semua Milestone)

Setiap milestone dianggap selesai jika memenuhi SEMUA kriteria berikut:

1. **Fungsional** — Semua task dalam milestone berstatus Completed.

2. **Build Pass** — `npm run build` berhasil tanpa error.

3. **LSP Clean** — Tidak ada error dari language server (TypeScript/Python).

4. **Testing** — Full flow testing passed (upload → process → download).

5. **Mobile** — Berfungsi di Chrome Android dan Safari iOS.

6. **Deploy** — Berhasil di-deploy ke production (Vercel + Railway).

7. **Documentation** — CHANGELOG.md diperbarui dengan detail milestone.

### 8.2 Kriteria Spesifik per Fase

| **Fase** | **Kriteria Tambahan** |
|---|---|
| MVP 0.1 (M01–M10) | 6 tool berfungsi penuh, landing page live, SEO infrastructure aktif, analytics tracking, privacy compliance |
| M11 (Rotate) | Tool rotate berfungsi client-side, terintegrasi dengan navbar/landing/sitemap |
| MVP 0.2 (M12–M18) | 12 tool berfungsi penuh, semua tool terintegrasi di landing page, regression test passed |
| MVP 0.3 (Monetisasi) | Payment gateway aktif, user auth berfungsi, Pro tier accessible |

### 8.3 Metrik Keberhasilan Produk (Ref: PPR-BRD-001)

| **Metrik** | **Target (Bulan 3)** | **Target (Bulan 12)** |
|---|---|---|
| Tasks Processed | 5.000 | 100.000 |
| SEO Organic Traffic | 2.000/bulan | 30.000/bulan |
| Repeat Usage Rate | 25% | 40% |
| Performance (P95 Response) | < 3 detik | < 2 detik |
| Task Success Rate | > 95% | > 99% |
| Mobile Completion Rate | > 80% | > 90% |
| Avg Infrastructure Cost | < $5/bulan | < $20/bulan |

---

## 9. Komunikasi & Pelaporan

### 9.1 Single Source of Truth

GitHub repository (azulfi/papyr) berfungsi sebagai single source of truth untuk seluruh aspek proyek:

| **Aspek** | **Lokasi** | **Format** |
|---|---|---|
| Source code | frontend/, backend/ | TypeScript, Python |
| Version tracking | CHANGELOG.md | Keep a Changelog format |
| Enterprise docs | docs/ | Markdown (BRD, Charter, Project Plan) |
| Blueprint & design | blueprint/ | Markdown (Backlog, Roadmap) |
| Task tracking | GitHub Issues + Milestones | Issue per task |
| Change history | Git commits | Conventional commits |

### 9.2 Mekanisme Pelaporan

| **Tipe Laporan** | **Frekuensi** | **Format** | **Audience** |
|---|---|---|---|
| CHANGELOG update | Per milestone selesai | Markdown di repo | Internal + Public |
| README update | Per milestone selesai | Markdown di repo | Internal + Public |
| Docs update | Per major version | Markdown di docs/ | Internal + Investor |
| Git commits | Per feature/fix | Commit message | Internal |

### 9.3 Alur Komunikasi

```

Product Owner                    AI Agent (OpenCode)

     |                                  |
     |--- Instruksi (chat) ------------>|
     |                                  |--- Eksekusi (code)

     |                                  |--- Testing

     |                                  |--- Documentation

     |<-- Hasil + CHANGELOG update -----|
     |                                  |
     |--- Review & Approval ----------->|
     |                                  |--- Deploy to production

     |<-- Konfirmasi deploy ------------|
     |                                  |

```

### 9.4 Eskalasi

| **Kondisi** | **Eskalasi** |
|---|---|
| Bug critical di production | Immediate fix oleh AI Agent, deploy hotfix |
| Biaya infrastruktur > budget | Product Owner evaluasi, keputusan migrasi |
| Security incident | Immediate response, audit, disclosure jika perlu |
| Milestone blocked > 1 minggu | Product Owner re-evaluate scope/approach |

---

## 10. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Project Plan ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan pendekatan pengembangan, timeline, alokasi sumber daya, dan mekanisme pengendalian untuk proyek Papyr.

| **Peran** | **Nama** | **Tanda Tangan** | **Tanggal** |
|:---|:---|:---|:---|
| **Product Owner** | Muhammad Fa’iz Zulfikar | Approved | 2026-05-03 |
| **AI Agent (Executor)** | OpenCode (Sisyphus) | Approved | 2026-05-03 |

---

**Catatan:**

Dokumen ini merupakan living document yang dapat diperbarui seiring perkembangan proyek. Setiap modifikasi material harus ditinjau dan disetujui ulang oleh semua penandatangan. Perubahan minor (typo, formatting) tidak memerlukan re-approval.

**Dokumen Terkait:**

| **ID Dokumen** | **Judul** | **Status** |
|---|---|---|
| PPR-BRD-001 | Business Requirements Document — Papyr | Approved |
| PPR-PC-001 | Project Charter — Papyr | Approved |
| PPR-PP-001 | Project Plan — Papyr (dokumen ini) | Approved |
| PPR-SRS-001 | Software Requirements Specification | Approved |
| PPR-TAD-001 | Technical Architecture Document | Approved |

---

*Confidential — Internal & Investor Use Only*

*Copyright 2026 Muhammad Fa’iz Zulfikar. All rights reserved.*

