*Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Product Roadmap**

Version 2.3

Juli 2025

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Product Roadmap — Papyr                      |
| **ID Dokumen**      | PPR-RM-001                                   |
| **Versi**           | 2.3                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Juni 2025                                    |
| **Terakhir Diubah** | Juli 2025                                    |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                 |
| **Ditinjau Oleh**   | Product Owner (Muhammad Fa'iz Zulfikar)      |
| **Disetujui Oleh**  | Product Owner                                |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                          |
|-----------|-------------|------------------------------|----------------------------------------------------------------------------------------|
| 1.0       | Juni 2025   | AI Agent (OpenCode/Sisyphus) | Draft awal — Product Roadmap lengkap mencakup MVP 0.1 (completed) hingga Fase 3 (planned) |
| 2.0       | Juli 2025   | AI Agent (OpenCode/Sisyphus) | Major upgrade — Roadmap philosophy & prioritization framework, feature classification labels, sub-phase breakdown MVP 0.2, UI safety rules, detailed per-feature specs, gate conditions diperkuat, "What Will NOT Be Built" section, cross-cutting quality items, success metrics dengan target spesifik |
| 2.1       | Juli 2025   | AI Agent (OpenCode/Sisyphus) | Tambah Phase 2E — OpenClaw AI Agent (M21) sebagai sub-fase baru MVP 0.2, 10 fungsi otonom, deployment HostData.id VPS |
| 2.2       | Juli 2025   | AI Agent (OpenCode/Sisyphus) | Tambah Phase 2F — Admin Dashboard (M22) sebagai unified admin panel, renumber MVP 0.3/Fase 2/Fase 3 milestones |
| 2.3       | Juli 2025   | AI Agent (OpenCode/Sisyphus) | Update Phase 2E — OpenClaw expanded ke 10 fungsi (tambah Social Media/Twitter), reporting diperluas ke quarterly/yearly, autonomy policy 100% tanpa approval gate, incident response auto-fix |

**Dokumen Terkait**

| **ID Dokumen** | **Judul**                              | **Status**  |
|----------------|----------------------------------------|-------------|
| PPR-BRD-001    | Business Requirements Document — Papyr | Approved    |
| PPR-PC-001     | Project Charter — Papyr                | Approved    |
| PPR-PP-001     | Project Plan — Papyr                   | Approved    |
| PPR-GTM-001    | Go-To-Market Strategy — Papyr          | Approved    |
| PPR-CLAW-001   | OpenClaw AI Agent — Papyr              | Draft       |
| PPR-ADM-001    | Admin Dashboard Spec — Papyr           | Draft       |
| PPR-IB-002     | Implementation Backlog MVP 0.2 — Papyr | Draft       |

---

## Daftar Isi

1. [Filosofi Roadmap & Kerangka Prioritas](#1-filosofi-roadmap--kerangka-prioritas)
2. [Ringkasan Eksekutif](#2-ringkasan-eksekutif)
3. [Visi Produk](#3-visi-produk)
4. [Fase & Timeline](#4-fase--timeline)
5. [Detail MVP 0.1 — Core Tools & Launch (COMPLETED)](#5-detail-mvp-01--core-tools--launch-completed)
6. [UI Safety Rules — Aturan Sebelum Membangun Fitur Baru](#6-ui-safety-rules--aturan-sebelum-membangun-fitur-baru)
7. [Detail MVP 0.2 — Tool Expansion](#7-detail-mvp-02--tool-expansion)
8. [Detail MVP 0.3 — Monetisasi](#8-detail-mvp-03--monetisasi)
9. [Detail Fase 2 — AI Features](#9-detail-fase-2--ai-features)
10. [Detail Fase 3 — Indonesia Deep](#10-detail-fase-3--indonesia-deep)
11. [Yang TIDAK Akan Dibangun](#11-yang-tidak-akan-dibangun)
12. [Prioritas & Dependensi](#12-prioritas--dependensi)
13. [Metrik Keberhasilan per Fase](#13-metrik-keberhasilan-per-fase)
14. [Risiko & Mitigasi](#14-risiko--mitigasi)
15. [Referensi Silang (Cross-References)](#15-referensi-silang-cross-references)
16. [Persetujuan Dokumen](#16-persetujuan-dokumen)

---

## 1. Filosofi Roadmap & Kerangka Prioritas

### 1.1 Filosofi Inti

Roadmap Papyr dibangun di atas satu prinsip fundamental:

> **Hargai fase, bukan tanggal kalender.**

Papyr dikembangkan 100% AI-driven — tanpa tim engineering tradisional, tanpa sprint planning konvensional. Kecepatan pengembangan ditentukan oleh kualitas output AI dan keputusan Product Owner, bukan oleh headcount atau jam kerja.

Implikasi dari filosofi ini:

| **Prinsip**                          | **Penjelasan**                                                                                                    |
|--------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| **Phase-gated, bukan time-boxed**    | Setiap fase memiliki gate condition yang harus dipenuhi. Tidak ada "deadline" artifisial.                         |
| **Ship when ready, not when due**    | Fitur dirilis saat memenuhi acceptance criteria, bukan saat kalender menunjukkan tanggal tertentu.                |
| **Quality over velocity**            | Lebih baik 1 tool yang sempurna daripada 3 tool yang setengah jadi. Setiap tool harus production-ready.          |
| **Incremental value delivery**       | Setiap milestone yang dirilis harus memberikan nilai nyata bagi pengguna. Tidak ada "infrastructure-only" release.|
| **Reversible decisions preferred**   | Pilih arsitektur yang memungkinkan perubahan. Hindari lock-in ke vendor atau teknologi tertentu.                  |
| **Data-informed gates**              | Keputusan untuk melanjutkan ke fase berikutnya berdasarkan data (traffic, MAU, revenue), bukan asumsi.           |

### 1.2 Kerangka Prioritas (Prioritization Framework)

Setiap fitur dalam roadmap ini dievaluasi menggunakan 4 dimensi:

| **Dimensi**        | **Bobot** | **Skala** | **Deskripsi**                                                                                     |
|--------------------|-----------|-----------|---------------------------------------------------------------------------------------------------|
| **User Value**     | 40%       | 1–5       | Seberapa besar dampak fitur ini bagi pengguna? Apakah menyelesaikan masalah nyata?                |
| **Strategic Fit**  | 25%       | 1–5       | Seberapa selaras dengan visi "PDF tool #1 Indonesia"? Apakah memperkuat positioning?              |
| **Feasibility**    | 20%       | 1–5       | Seberapa mudah dibangun dengan stack saat ini? Apakah ada risiko teknis tinggi?                   |
| **Revenue Impact** | 15%       | 1–5       | Apakah fitur ini mendorong konversi ke Pro tier atau meningkatkan retention?                      |

**Cara Menghitung Skor Prioritas:**

```
Skor = (User Value x 0.40) + (Strategic Fit x 0.25) + (Feasibility x 0.20) + (Revenue Impact x 0.15)
```

**Penerapan pada MVP 0.2 Features:**

| **Fitur**      | **User Value** | **Strategic Fit** | **Feasibility** | **Revenue Impact** | **Skor** | **Prioritas** |
|----------------|----------------|--------------------|-----------------|--------------------|----------|---------------|
| M12 Protect    | 4              | 4                  | 5               | 2                  | 3.90     | P1            |
| M13 Unlock     | 4              | 4                  | 5               | 2                  | 3.90     | P1            |
| M15 Sign       | 5              | 5                  | 4               | 3                  | 4.50     | P1            |
| M14 Watermark  | 3              | 4                  | 4               | 3                  | 3.45     | P2            |
| M16 PDF-Word   | 5              | 5                  | 3               | 4                  | 4.45     | P2            |
| M17 OCR        | 5              | 5                  | 2               | 5                  | 4.20     | P3            |
| M18 PDF-Excel  | 3              | 4                  | 2               | 4                  | 3.20     | P4            |

> **Catatan:** Skor prioritas bersifat panduan, bukan absolut. Urutan pengerjaan juga mempertimbangkan dependensi teknis (M12-M13, M16-M17-M18) dan shared logic.

### 1.3 Klasifikasi Label Fitur (Feature Classification)

Setiap fitur dalam roadmap ini diberi label klasifikasi untuk memberikan gambaran cepat tentang sifat dan kompleksitasnya:

| **Label** | **Nama**            | **Arti**                                                                                          |
|-----------|---------------------|---------------------------------------------------------------------------------------------------|
| 🟢        | **Buildable**       | Dapat dibangun sekarang dengan stack saat ini. Pure engineering — tidak ada blocker eksternal.     |
| 🟡        | **Hard**            | Kompleksitas tinggi — membutuhkan riset, arsitektur baru, atau integrasi berat.                   |
| 🔴        | **Regulated**       | Membutuhkan compliance, lisensi, atau persetujuan pihak ketiga sebelum bisa dibangun.             |
| 🔵        | **Business Outcome**| Hasilnya adalah metrik bisnis, bukan fitur teknis. Contoh: "revenue > Rp 0".                     |
| 🟣        | **R&D**             | Membutuhkan eksperimen. Belum ada solusi yang terbukti untuk konteks Papyr.                       |
| ⚪        | **Moonshot**        | Ambisius, high-risk high-reward. Bisa jadi game-changer atau bisa gagal total.                    |

### 1.4 Distribusi Label per Fase

| **Fase**    | 🟢 Buildable | 🟡 Hard | 🔴 Regulated | 🔵 Business | 🟣 R&D | ⚪ Moonshot | **Total** |
|-------------|--------------|---------|--------------|-------------|--------|------------|-----------|
| MVP 0.1     | 11           | 0       | 0            | 0           | 0      | 0          | 11        |
| MVP 0.2     | 10           | 3       | 0            | 0           | 0      | 0          | 13        |
| MVP 0.3     | 4            | 1       | 0            | 2           | 0      | 0          | 7         |
| Fase 2      | 0            | 1       | 0            | 1           | 2      | 0          | 4         |
| Fase 3      | 0            | 0       | 2            | 1           | 0      | 1          | 4         |
| **Total**   | **25**       | **5**   | **2**        | **4**       | **2**  | **1**      | **39**    |

> **Insight:** 64% fitur adalah 🟢 Buildable — artinya mayoritas roadmap ini bisa dieksekusi tanpa blocker eksternal. Risiko terbesar ada di Fase 3 (regulated + moonshot).

---

## 2. Ringkasan Eksekutif

Dokumen ini mendefinisikan Product Roadmap resmi untuk Papyr — web application utilitas PDF yang dirancang khusus untuk pasar Indonesia. Roadmap ini mencakup seluruh fase pengembangan produk dari MVP 0.1 yang telah selesai hingga visi jangka panjang di Fase 3.

**Status Saat Ini:**

- **MVP 0.1** telah selesai sepenuhnya (v1.0.0 + v1.1.0) dengan 11 milestone dan 89 tasks terselesaikan.
- **Papyr live** di [mypapyr.com](https://mypapyr.com) dengan 6 tool aktif: Compress, Merge, Split, Rotate, Image-to-PDF, dan PDF-to-Image.
- **Fase selanjutnya** adalah MVP 0.2 (Tool Expansion) — gate condition sudah terpenuhi (MVP 0.1 live & stabil).

**Model Pengembangan:**

Papyr dikembangkan 100% AI-driven — seluruh kode, dokumentasi, dan keputusan arsitektur dihasilkan melalui AI agents (OpenCode/Sisyphus). Marketing dikelola melalui OpenClaw. Tidak ada tim engineering tradisional.

**Ringkasan Fase:**

| **Fase**    | **Fokus**                | **Status**       | **Gate**                                          | **Label Dominan**  |
|-------------|--------------------------|------------------|---------------------------------------------------|--------------------|
| MVP 0.1     | Core Tools + Launch      | ✅ Selesai       | —                                                 | 🟢 Buildable      |
| MVP 0.2     | Tool Expansion           | 🔄 Selanjutnya   | MVP 0.1 live & stabil ✅                          | 🟢🟡 Build + Hard |
| MVP 0.3     | Monetisasi               | 📋 Direncanakan  | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 MAU            | 🟢🔵 Build + Biz  |
| Fase 2      | AI Features              | 🔮 Visi          | MVP 0.3 revenue > Rp 0                            | 🟣 R&D            |
| Fase 3      | Indonesia Deep           | 🔮 Visi          | Fase 2 stabil + regulatory readiness              | 🔴⚪ Reg + Moon   |

---

## 3. Visi Produk

### 3.1 Visi Jangka Panjang

> **Menjadi platform utilitas dokumen digital #1 di Indonesia — gratis, cepat, aman, dan cerdas.**

Papyr bertujuan untuk menjadi solusi lengkap bagi seluruh kebutuhan pengelolaan dokumen digital masyarakat Indonesia — mulai dari operasi PDF sederhana hingga fitur AI-powered yang canggih, dengan integrasi mendalam ke ekosistem digital Indonesia (e-Meterai, template pemerintah, compliance lokal).

### 3.2 Prinsip Pengembangan

| **Prinsip**            | **Deskripsi**                                                                                                     |
|------------------------|-------------------------------------------------------------------------------------------------------------------|
| Privacy-First          | File diproses secara lokal bila memungkinkan; file server auto-delete 60 menit (cron) + 24 jam (R2 lifecycle safety net) |
| Indonesia-First        | UI Bahasa Indonesia default, server dekat Asia, UX disesuaikan kebutuhan lokal                                    |
| Mobile-First           | Didesain untuk layar HP terlebih dahulu (375px primary), bukan desktop-first yang dipaksakan responsive           |
| Zero-Friction          | Tanpa login untuk fitur dasar, tanpa paywall yang membatasi, tanpa watermark                                      |
| Incremental Value      | Setiap fase menambah nilai nyata bagi pengguna tanpa merusak pengalaman yang sudah ada                            |
| Sustainable Business   | Monetisasi yang adil — gratis untuk kebutuhan dasar, premium untuk fitur lanjutan                                 |
| AI-Driven Development  | 100% dikembangkan melalui AI agents — kecepatan dan kualitas ditentukan oleh tooling, bukan headcount            |

### 3.3 Target Pengguna

| **Segmen**             | **Kebutuhan Utama**                                    | **Fase Relevan**       |
|------------------------|--------------------------------------------------------|------------------------|
| Mahasiswa              | Compress tugas, merge dokumen, convert gambar          | MVP 0.1 (tersedia)     |
| Pekerja Kantoran       | Merge laporan, split dokumen, watermark, sign          | MVP 0.2                |
| Freelancer             | Protect PDF, sign kontrak, OCR dokumen scan            | MVP 0.2                |
| UMKM                   | Invoice PDF, e-Meterai, template dokumen               | Fase 3                 |
| Enterprise             | Batch processing, API access, compliance               | MVP 0.3 + Fase 3       |

### 3.4 Evolusi Produk

```
MVP 0.1          MVP 0.2           MVP 0.3          Fase 2          Fase 3
─────────────────────────────────────────────────────────────────────────────►

[Core Tools]  → [Advanced Tools] → [Monetisasi]  → [AI-Powered] → [Indonesia Deep]
 6 tools         +7 tools           Login + Pro      AI Analysis    e-Meterai
 Free only       Free only          Freemium         Smart Tools    Gov Templates
 Zero-login      Zero-login         Optional login   Premium AI     Local Compliance
 🟢 100%         🟢75% 🟡25%       🟢🔵 mixed      🟣 R&D         🔴⚪ Regulated
```

---

## 4. Fase & Timeline

### 4.1 Gate Conditions (Detail)

Setiap transisi antar fase memiliki gate condition yang spesifik dan terukur:

| **Transisi**          | **Gate Condition**                                                                                     | **Status**    |
|-----------------------|--------------------------------------------------------------------------------------------------------|---------------|
| MVP 0.1 → MVP 0.2    | MVP 0.1 live & stabil di mypapyr.com, semua 6 tool berfungsi, zero critical bugs selama 7 hari        | ✅ TERPENUHI  |
| MVP 0.2 → MVP 0.3    | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 MAU (diukur via Vercel Analytics)                                   | ⏳ Menunggu   |
| MVP 0.3 → Fase 2     | MVP 0.3 revenue > Rp 0 (validated willingness to pay — minimal 1 paying customer)                     | ⏳ Menunggu   |
| Fase 2 → Fase 3      | Fase 2 stabil (zero critical bugs 30 hari) + regulatory readiness assessment selesai + partnership MoU | ⏳ Menunggu   |

### 4.2 Timeline Visual

| **Fase**    | **Milestone**  | **Deskripsi**                          | **Status**           | **Gate Condition**                                    |
|-------------|----------------|----------------------------------------|----------------------|-------------------------------------------------------|
| MVP 0.1     | M01–M11        | Core 6 tools + Landing + SEO + Launch  | ✅ Selesai           | —                                                     |
| MVP 0.2     | M12–M18 + 2D + 2E + 2F | 7 tool tambahan + cross-cutting quality + OpenClaw + Admin | 🔄 Selanjutnya | MVP 0.1 live & stabil ✅                              |
| MVP 0.3     | M23–M27        | Login, Pro tier, Payment, API          | 📋 Direncanakan      | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 MAU                |
| Fase 2      | M28–M30        | AI-powered features                    | 🔮 Visi              | MVP 0.3 revenue > Rp 0 (validated willingness to pay) |
| Fase 3      | M31–M33        | Indonesia Deep integration             | 🔮 Visi              | Fase 2 stabil + regulatory readiness                  |

### 4.3 Detail Timeline per Milestone

| **#**  | **Milestone**            | **Fase**  | **Sub-fase** | **Estimasi Effort** | **Dependensi**         | **Label** | **Status**           |
|--------|--------------------------|-----------|--------------|---------------------|------------------------|-----------|----------------------|
| M01    | Project Setup            | MVP 0.1   | —            | 10–15 jam           | —                      | 🟢        | ✅ Selesai           |
| M02    | Compress PDF             | MVP 0.1   | —            | 15–20 jam           | M01                    | 🟢        | ✅ Selesai           |
| M03    | Merge PDF                | MVP 0.1   | —            | 10–15 jam           | M01                    | 🟢        | ✅ Selesai           |
| M04    | Split PDF                | MVP 0.1   | —            | 10–15 jam           | M01                    | 🟢        | ✅ Selesai           |
| M05    | Image to PDF             | MVP 0.1   | —            | 10–15 jam           | M01                    | 🟢        | ✅ Selesai           |
| M06    | PDF to Image             | MVP 0.1   | —            | 12–18 jam           | M01                    | 🟢        | ✅ Selesai           |
| M07    | Landing Page + SEO       | MVP 0.1   | —            | 15–20 jam           | M02–M06                | 🟢        | ✅ Selesai           |
| M08    | Analytics                | MVP 0.1   | —            | 5–8 jam             | M07                    | 🟢        | ✅ Selesai           |
| M09    | Cleanup & Privacy        | MVP 0.1   | —            | 12–15 jam           | M02, M06               | 🟢        | ✅ Selesai           |
| M10    | Testing + Launch         | MVP 0.1   | —            | 8–12 jam            | M01–M09                | 🟢        | ✅ Selesai           |
| M11    | Rotate PDF               | MVP 0.1   | —            | 5–8 jam             | M01                    | 🟢        | ✅ Selesai           |
| M12    | Protect PDF              | MVP 0.2   | Phase 2A     | 8–12 jam            | M01                    | 🟢        | 📋 Planned           |
| M13    | Unlock PDF               | MVP 0.2   | Phase 2A     | 8–12 jam            | M12                    | 🟢        | 📋 Planned           |
| M14    | Watermark PDF            | MVP 0.2   | Phase 2B     | 10–15 jam           | M01                    | 🟢        | 📋 Planned           |
| M15    | Sign PDF                 | MVP 0.2   | Phase 2B     | 15–20 jam           | M01                    | 🟡        | 📋 Planned           |
| M16    | PDF-to-Word              | MVP 0.2   | Phase 2C     | 15–20 jam           | M01                    | 🟡        | 📋 Planned           |
| M17    | OCR                      | MVP 0.2   | Phase 2C     | 20–30 jam           | M01                    | 🟡        | 📋 Planned           |
| M18    | PDF-to-Excel             | MVP 0.2   | Phase 2C     | 15–20 jam           | M16, M17               | 🟡        | 📋 Planned           |
| —      | Cross-cutting Quality    | MVP 0.2   | Phase 2D     | 20–30 jam           | M12–M18                | 🟢        | 📋 Planned           |
| M21    | OpenClaw AI Agent        | MVP 0.2   | Phase 2E     | 100–140 jam         | Phase 2D               | 🟡        | 📋 Planned           |
| M22    | Admin Dashboard          | MVP 0.2   | Phase 2F     | 30–40 jam           | Phase 2E               | 🟢        | 📋 Planned           |
| M23    | Authentication           | MVP 0.3   | —            | 15–20 jam           | MVP 0.2 complete       | 🟢        | 📋 Planned           |
| M24    | User Dashboard           | MVP 0.3   | —            | 10–15 jam           | M23                    | 🟢        | 📋 Planned           |
| M25    | Usage Tracking           | MVP 0.3   | —            | 10–15 jam           | M23, M24               | 🟢        | 📋 Planned           |
| M26    | Payment Integration      | MVP 0.3   | —            | 15–20 jam           | M23, M24, M25          | 🟡        | 📋 Planned           |
| M27    | API Key System           | MVP 0.3   | —            | 8–12 jam            | M26                    | 🟢        | 📋 Planned           |
| M28    | AI Document Analysis     | Fase 2    | —            | 30–40 jam           | MVP 0.3 complete       | 🟣        | 🔮 Visi              |
| M29    | Smart Compression        | Fase 2    | —            | 20–30 jam           | M28                    | 🟣        | 🔮 Visi              |
| M30    | AI Content Extraction    | Fase 2    | —            | 30–40 jam           | M28                    | 🟡        | 🔮 Visi              |
| M31    | e-Meterai Integration    | Fase 3    | —            | 40–60 jam           | Fase 2 complete        | 🔴        | 🔮 Visi              |
| M32    | Gov Document Templates   | Fase 3    | —            | 20–30 jam           | M31                    | 🔴        | 🔮 Visi              |
| M33    | Local Compliance         | Fase 3    | —            | 30–50 jam           | M31, M32               | ⚪        | 🔮 Visi              |
---

## 5. Detail MVP 0.1 — Core Tools & Launch (COMPLETED)

### 5.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Versi Rilis**        | v1.0.0 (M01–M10) + v1.1.0 (M11)                             |
| **Status**             | ✅ COMPLETED                                                  |
| **Total Milestone**    | 11 milestone (M01–M11)                                       |
| **Total Tasks**        | 89 tasks (PAPYR-001 — PAPYR-089)                             |
| **Tools Delivered**    | 6 (Compress, Merge, Split, Image-to-PDF, PDF-to-Image, Rotate) |
| **URL Produksi**       | [mypapyr.com](https://mypapyr.com)                           |
| **Label**              | 🟢 Buildable (semua 11 milestone)                            |

### 5.2 Breakdown per Milestone

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

### 5.3 Arsitektur yang Dibangun

| **Layer**          | **Teknologi**                                    | **Keterangan**                                                    |
|--------------------|--------------------------------------------------|-------------------------------------------------------------------|
| **Frontend**       | Next.js 16 + TypeScript + Tailwind v4            | Deployed di Vercel (Edge/Global CDN)                              |
| **Backend**        | FastAPI + Python 3.11 + PyMuPDF + Ghostscript    | Deployed di Railway (us-west2 container)                          |
| **Storage**        | Cloudflare R2                                    | Signed URLs, auto-delete 60 menit (cron) + 24 jam (R2 lifecycle safety net) |
| **Processing**     | Hybrid client/server                             | Client (pdf-lib) untuk Merge/Split/Rotate, Server untuk Compress/PDF-to-Image/Image-to-PDF |
| **Analytics**      | Vercel Analytics + Speed Insights                | Custom events: task_started, task_completed, task_failed + device_category |
| **Domain**         | mypapyr.com (Hostinger DNS)                      | SSL via Vercel                                                    |
| **Biaya**          | $0–5/bulan                                       | Vercel Free + Railway Free + R2 Free Tier                         |

### 5.4 Konfigurasi Produksi

| **Parameter**          | **Nilai**                  | **Keterangan**                                    |
|------------------------|----------------------------|---------------------------------------------------|
| Max upload size        | 20 MB                      | Dikonfigurasi di backend config.py                |
| File retention         | 60 menit (cron cleanup)    | + 24 jam R2 lifecycle sebagai safety net           |
| Rate limit             | 10 request/menit per IP    | Dikonfigurasi di FastAPI middleware                |
| Supported formats      | PDF, JPG, PNG              | Input formats untuk semua tools                   |
| Client processing      | pdf-lib                    | Merge, Split, Rotate — zero upload                |
| Server processing      | Ghostscript + PyMuPDF      | Compress, PDF-to-Image, Image-to-PDF              |

---

## 6. UI Safety Rules — Aturan Sebelum Membangun Fitur Baru

Sebelum membangun fitur apapun di MVP 0.2, aturan berikut **WAJIB** dipatuhi untuk memastikan fitur baru tidak merusak pengalaman pengguna yang sudah ada.

| **#**  | **Rule**                                    | **Detail**                                                                                                                                                |
|--------|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **R1** | Navbar tetap sama                           | Tidak ada nav item baru. Semua tool baru masuk ke grid di landing page dan halaman masing-masing. Navbar hanya berisi: Logo, "Alat PDF" (link ke grid), dan hamburger menu di mobile. |
| **R2** | Setiap tool baru ikuti template yang ada    | Setiap halaman tool baru HARUS menggunakan pattern yang sama: PDFUploader component → processing → download. Tidak ada UI pattern baru tanpa persetujuan Product Owner. |
| **R3** | Mobile-first dipertahankan                  | Primary breakpoint tetap 375px. Setiap tool baru HARUS ditest di viewport 375px sebelum merge. Desktop adalah bonus, bukan prioritas.                    |
| **R4** | Performance budget                          | Tidak ada halaman tool baru yang boleh > 50KB JS gzipped. Gunakan `dynamic()` import untuk komponen berat (canvas, signature pad). Lazy load semua yang bisa di-lazy load. |
| **R5** | 6 tool existing TIDAK BOLEH berubah         | Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image — behavior, UI, dan output HARUS identik sebelum dan sesudah penambahan tool baru. Zero regression. |
| **R6** | Design language yang sama                   | Tailwind v4 tokens, DM Sans font, existing color palette (primary blue, neutral grays). Tidak ada warna baru, font baru, atau spacing system baru tanpa persetujuan. |
| **R7** | Landing page grid auto-expand               | Grid tool di landing page harus otomatis menyesuaikan jumlah tool baru. Tidak ada hardcoded grid count. Urutan: existing 6 tools dulu, lalu tool baru sesuai urutan rilis. |
| **R8** | Privacy notice di setiap halaman tool       | Setiap halaman tool (termasuk yang baru) HARUS menampilkan privacy notice: "File Anda otomatis dihapus dalam 60 menit" atau "Diproses di browser Anda — file tidak diunggah". |
| **R9** | Error states ikuti pattern yang ada         | Auto-retry 1x untuk network errors. Pesan error dalam Bahasa Indonesia. Format: "Gagal memproses file. Silakan coba lagi." Tidak ada error dalam bahasa Inggris. |
| **R10**| Regression testing — CI harus pass          | Setiap PR yang menambah tool baru HARUS pass CI checks. Jika ada E2E tests (Phase 2D), semua test untuk 6 tool existing harus pass sebelum merge.        |

> **Prinsip Utama:** Fitur baru adalah *additive* — menambah tanpa mengubah. Jika ragu, jangan ubah yang sudah ada.
---

## 7. Detail MVP 0.2 — Tool Expansion

### 7.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 🔄 NEXT — Selanjutnya dikerjakan                             |
| **Gate Condition**     | MVP 0.1 live & stabil ✅ TERPENUHI                           |
| **Total Milestone**    | 7 tool milestones (M12–M18) + cross-cutting (2D) + OpenClaw (2E) + Admin Dashboard (2F) |
| **Estimasi Total**     | 111–159 jam (tools) + 20–30 jam (cross-cutting) + 100–140 jam (OpenClaw) + 30–40 jam (Admin) = 261–369 jam |
| **Pendekatan**         | Sub-phase sequential, rilis incremental per sub-phase         |
| **Hasil Akhir**        | 13 tools total (6 existing + 7 baru) + autonomous ops + unified admin |

### 7.2 Struktur Sub-fase

MVP 0.2 dibagi menjadi 6 sub-fase yang dieksekusi secara sequential:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MVP 0.2 — SUB-PHASE STRUCTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Phase 2A — Security Tools 🟢                                               │
│  ┌──────────┐    ┌──────────┐                                               │
│  │M12 Protect│──►│M13 Unlock│    Estimasi: 16–24 jam                        │
│  └──────────┘    └──────────┘    Shared: PyMuPDF encryption/decryption      │
│       │                                                                     │
│       ▼                                                                     │
│  Phase 2B — Document Enhancement 🟢/🟡                                      │
│  ┌──────────┐    ┌──────────┐                                               │
│  │M14 W.mark│    │M15 Sign  │    Estimasi: 25–35 jam                        │
│  └──────────┘    └──────────┘    Independent — bisa parallel                │
│       │                                                                     │
│       ▼                                                                     │
│  Phase 2C — Document Conversion 🟡                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                               │
│  │M16 Word  │──►│M17 OCR   │──►│M18 Excel │    Estimasi: 50–70 jam         │
│  └──────────┘    └──────────┘    └──────────┘    Progressive complexity     │
│       │                                                                     │
│       ▼                                                                     │
│  Phase 2D — Cross-cutting Quality 🟢                                        │
│  ┌──────────────────────────────────────────┐                               │
│  │ E2E Testing · Prettier+Ruff · Perf ·     │    Estimasi: 20–30 jam        │
│  │ Monitoring · SEO Update · Analytics      │                               │
│  └──────────────────────────────────────────┘                               │
│       │                                                                     │
│       ▼                                                                     │
│  Phase 2E — OpenClaw AI Agent 🟡                                            │
│  ┌──────────────────────────────────────────┐                               │
│  │ M21: 10 Autonomous Functions             │    Estimasi: 100–140 jam      │
│  │ SEO · Competitor · Health · Security ·   │    Deploy: HostData.id VPS    │
│  │ Reporting · Self-Improve · PM ·          │    Stack: Node.js + BullMQ    │
│  │ Backup · Analytics Intelligence          │    + Redis + PostgreSQL       │
│  └──────────────────────────────────────────┘                               │
│       │                                                                     │
│       ▼                                                                     │
│  Phase 2F — Admin Dashboard 🟢                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ M22: Unified Admin Panel (/admin)                                   │    │
│  │ OpenClaw + Analytics + Health + Security + SEO + Logs + Backup      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Phase 2A — Security Tools 🟢 Buildable

Phase 2A fokus pada fitur keamanan PDF — protect dan unlock. Kedua fitur ini membentuk natural pair dengan shared encryption/decryption logic.

---

#### 7.3.1 M12 — Protect PDF (Password Protection)

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Menambahkan password protection (enkripsi) ke file PDF sehingga hanya bisa dibuka dengan password yang benar   |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Processing Strategy**| **Server-side (PyMuPDF encryption)**                                                                          |
| **Library**            | PyMuPDF (`fitz`) — `doc.save(encryption=fitz.PDF_ENCRYPT_AES_256)`                                           |
| **Alasan Server-side** | PyMuPDF menyediakan AES-256 encryption yang kuat dan reliable. pdf-lib encryption support terbatas dan kurang mature. |

**UI Placement:**

- Route: `/protect`
- Landing page grid: posisi ke-7 (setelah 6 tool existing)
- Icon: 🔒 (lock icon, konsisten dengan konvensi industri)
- Flow: Upload PDF → Input password (2x untuk konfirmasi) → Pilih level proteksi → Proses → Download

**Acceptance Criteria:**

| **#** | **Kriteria**                                                                                          | **Tipe**     |
|-------|-------------------------------------------------------------------------------------------------------|--------------|
| AC1   | User dapat upload PDF dan set password (min 4 karakter)                                               | Functional   |
| AC2   | Password harus diinput 2x (konfirmasi) — mismatch menampilkan error Bahasa Indonesia                 | Functional   |
| AC3   | PDF output terenkripsi AES-256 — tidak bisa dibuka tanpa password                                     | Functional   |
| AC4   | PDF yang sudah terproteksi ditolak dengan pesan jelas: "File ini sudah dilindungi password"           | Edge case    |
| AC5   | File auto-delete 60 menit setelah processing                                                          | Privacy      |
| AC6   | Halaman /protect mengikuti template PDFUploader pattern (R2)                                          | UI Safety    |
| AC7   | Privacy notice ditampilkan: "File diunggah ke server untuk diproses dan otomatis dihapus dalam 60 menit" | UI Safety |
| AC8   | Mobile-first layout berfungsi di 375px viewport (R3)                                                  | UI Safety    |
| AC9   | Page JS gzipped < 50KB (R4)                                                                           | Performance  |

**Dependencies:**

- M01 (infrastruktur dasar — backend API, R2 storage, deployment pipeline)
- PyMuPDF sudah terinstall di backend (digunakan oleh PDF-to-Image)

**Estimasi Effort:** 8–12 jam

**Risiko:** Rendah — PyMuPDF encryption API well-documented dan sudah digunakan di production.

---

#### 7.3.2 M13 — Unlock PDF (Remove Password)

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Menghapus password dari PDF yang terproteksi — user harus mengetahui password yang benar                       |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Processing Strategy**| **Server-side (PyMuPDF decryption)**                                                                          |
| **Library**            | PyMuPDF (`fitz`) — `doc.authenticate(password)` lalu `doc.save()` tanpa encryption                           |
| **Alasan Server-side** | Dekripsi membutuhkan library yang sama dengan enkripsi. Shared logic dengan M12.                              |

**UI Placement:**

- Route: `/unlock`
- Landing page grid: posisi ke-8 (setelah Protect)
- Icon: 🔓 (unlock icon)
- Flow: Upload protected PDF → Input password → Verifikasi → Proses → Download PDF tanpa password

**Acceptance Criteria:**

| **#** | **Kriteria**                                                                                          | **Tipe**     |
|-------|-------------------------------------------------------------------------------------------------------|--------------|
| AC1   | User dapat upload PDF terproteksi dan input password                                                  | Functional   |
| AC2   | Password benar → PDF di-decrypt dan bisa didownload tanpa password                                    | Functional   |
| AC3   | Password salah → error jelas dalam Bahasa Indonesia: "Password salah. Silakan coba lagi."            | Functional   |
| AC4   | PDF yang tidak terproteksi ditolak: "File ini tidak dilindungi password"                              | Edge case    |
| AC5   | Owner password vs user password handled correctly (PyMuPDF handles both)                              | Edge case    |
| AC6   | File auto-delete 60 menit setelah processing                                                          | Privacy      |
| AC7   | Halaman /unlock mengikuti template PDFUploader pattern (R2)                                           | UI Safety    |
| AC8   | Privacy notice ditampilkan (R8)                                                                       | UI Safety    |
| AC9   | Mobile-first layout berfungsi di 375px viewport (R3)                                                  | UI Safety    |

**Dependencies:**

- M12 (Protect PDF — shared encryption/decryption logic, shared API endpoint structure)
- PyMuPDF sudah terinstall di backend

**Estimasi Effort:** 8–12 jam

**Risiko:** Rendah — dekripsi adalah inverse dari enkripsi, shared codebase dengan M12.

---

### 7.4 Phase 2B — Document Enhancement 🟢/🟡

Phase 2B fokus pada fitur enhancement dokumen — watermark dan tanda tangan. Kedua fitur ini independent dan secara teori bisa dikerjakan parallel, tapi direkomendasikan sequential untuk quality control.

---

#### 7.4.1 M14 — Watermark PDF

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Menambahkan watermark (teks atau gambar) ke semua halaman PDF dengan konfigurasi posisi, opacity, dan rotasi   |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Processing Strategy**| **Hybrid** — Client-side (pdf-lib) untuk text watermark, Server-side (PyMuPDF) untuk image watermark          |
| **Library Client**     | pdf-lib — `page.drawText()` dengan opacity dan rotation                                                       |
| **Library Server**     | PyMuPDF — `page.insert_image()` untuk image watermark overlay                                                 |
| **Alasan Hybrid**      | Text watermark ringan dan bisa dilakukan di browser (zero upload). Image watermark membutuhkan rendering yang lebih kompleks. |

**UI Placement:**

- Route: `/watermark`
- Landing page grid: posisi ke-9
- Icon: 💧 (water drop / watermark icon)
- Flow: Upload PDF → Pilih tipe (teks/gambar) → Konfigurasi (posisi, opacity 10-100%, rotasi, ukuran font) → Preview → Proses → Download

**Acceptance Criteria:**

| **#** | **Kriteria**                                                                                          | **Tipe**     |
|-------|-------------------------------------------------------------------------------------------------------|--------------|
| AC1   | User dapat menambahkan text watermark dengan konfigurasi: teks, font size, opacity, rotasi, posisi    | Functional   |
| AC2   | User dapat menambahkan image watermark (upload PNG/JPG) dengan konfigurasi: opacity, posisi, ukuran   | Functional   |
| AC3   | Watermark diterapkan ke SEMUA halaman PDF                                                             | Functional   |
| AC4   | Text watermark diproses client-side (zero upload) — privacy notice: "Diproses di browser Anda"       | Privacy      |
| AC5   | Image watermark diproses server-side — privacy notice: "File diunggah untuk diproses"                | Privacy      |
| AC6   | Preview watermark sebelum apply (minimal 1 halaman preview)                                           | UX           |
| AC7   | Posisi watermark: center, top-left, top-right, bottom-left, bottom-right, diagonal                   | Functional   |
| AC8   | Opacity range: 10% (sangat transparan) hingga 100% (solid)                                           | Functional   |
| AC9   | Halaman /watermark mengikuti template PDFUploader pattern (R2)                                        | UI Safety    |
| AC10  | Mobile-first layout berfungsi di 375px viewport (R3)                                                  | UI Safety    |

**Dependencies:**

- M01 (infrastruktur dasar)
- pdf-lib sudah digunakan di frontend (Merge, Split, Rotate)
- PyMuPDF sudah terinstall di backend

**Estimasi Effort:** 10–15 jam

**Risiko:** Medium — konfigurasi watermark yang fleksibel membutuhkan UI yang cukup kompleks (posisi, opacity, rotasi). Preview real-time bisa menambah kompleksitas.

---

#### 7.4.2 M15 — Sign PDF (Digital Signature)

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Menambahkan tanda tangan visual (draw atau upload gambar) ke posisi tertentu di halaman PDF                    |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| **Client-side (canvas + pdf-lib)**                                                                            |
| **Library**            | HTML5 Canvas API untuk signature pad + pdf-lib `page.drawImage()` untuk embed ke PDF                         |
| **Alasan Client-side** | Tanda tangan adalah data sensitif — HARUS diproses di browser tanpa upload ke server. Privacy-first.          |

**UI Placement:**

- Route: `/sign`
- Landing page grid: posisi ke-10
- Icon: ✍️ (signature / pen icon)
- Flow: Upload PDF → Pilih halaman → Draw signature (canvas) ATAU upload gambar tanda tangan → Drag-to-place di halaman → Resize → Apply → Download

**Acceptance Criteria:**

| **#** | **Kriteria**                                                                                          | **Tipe**     |
|-------|-------------------------------------------------------------------------------------------------------|--------------|
| AC1   | User dapat menggambar tanda tangan menggunakan canvas (mouse + touch support)                         | Functional   |
| AC2   | User dapat upload gambar tanda tangan (PNG/JPG, background transparan preferred)                      | Functional   |
| AC3   | Tanda tangan dapat di-drag ke posisi manapun di halaman PDF                                           | Functional   |
| AC4   | Tanda tangan dapat di-resize (maintain aspect ratio)                                                  | Functional   |
| AC5   | User dapat memilih halaman mana yang akan ditandatangani                                              | Functional   |
| AC6   | Canvas signature pad mendukung: draw, clear, undo                                                     | UX           |
| AC7   | Seluruh proses client-side — privacy notice: "Diproses di browser Anda — file tidak diunggah"        | Privacy      |
| AC8   | Tanda tangan berkualitas baik saat di-print (min 150 DPI equivalent)                                  | Quality      |
| AC9   | Halaman /sign mengikuti template PDFUploader pattern (R2)                                             | UI Safety    |
| AC10  | Canvas dan drag-to-place berfungsi di mobile touch (R3)                                               | UI Safety    |
| AC11  | Canvas component di-lazy load via `dynamic()` — page JS < 50KB gzipped (R4)                          | Performance  |

**Dependencies:**

- M01 (infrastruktur dasar)
- pdf-lib sudah digunakan di frontend

**Estimasi Effort:** 15–20 jam

**Risiko:** Medium-High — Canvas signature pad + drag-to-place + resize di mobile adalah UX challenge yang signifikan. Touch events di berbagai device bisa bermasalah. Perlu dynamic import untuk canvas library agar tidak membengkakkan bundle.

**Catatan Penting:** Ini adalah *visual signature* (gambar tanda tangan di-embed ke PDF), BUKAN *cryptographic digital signature* (PKI-based). Cryptographic signature membutuhkan sertifikat digital dan berada di luar scope MVP 0.2.

---

### 7.5 Phase 2C — Document Conversion 🟡 Hard

Phase 2C adalah sub-fase paling kompleks di MVP 0.2. Ketiga fitur ini membutuhkan server-side processing yang berat dan library tambahan yang belum ada di stack saat ini.

> **⚠️ Catatan Penting tentang VPS:** Phase 2C features (terutama M16 PDF-to-Word dan M17 OCR) membutuhkan resource server yang lebih besar dari Railway free tier. Jika Railway free tier tidak cukup, migrasi ke VPS (HostData.id) akan menjadi inisiatif terpisah. VPS migration adalah OUT OF SCOPE untuk dokumen roadmap ini.

---

#### 7.5.1 M16 — PDF-to-Word

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Konversi file PDF ke format Microsoft Word (.docx) dengan layout dan formatting yang terjaga                   |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| **Server-side (LibreOffice headless)**                                                                        |
| **Library**            | LibreOffice headless mode (`libreoffice --headless --convert-to docx`)                                        |
| **Alasan LibreOffice** | LibreOffice headless memberikan konversi PDF-to-DOCX terbaik dibanding alternatif Python (pdf2docx, PyMuPDF+python-docx). Layout preservation jauh lebih baik. |

**UI Placement:**

- Route: `/pdf-to-word`
- Landing page grid: posisi ke-11
- Icon: 📝 (document / Word icon)
- Flow: Upload PDF → Proses (server) → Progress indicator → Download DOCX

**Acceptance Criteria:**

| **#** | **Kriteria**                                                                                          | **Tipe**     |
|-------|-------------------------------------------------------------------------------------------------------|--------------|
| AC1   | User dapat upload PDF dan mendapatkan file .docx yang bisa dibuka di Microsoft Word / Google Docs     | Functional   |
| AC2   | Layout terjaga — paragraf, heading, list terkonversi dengan benar                                     | Quality      |
| AC3   | Tabel dalam PDF terkonversi menjadi tabel Word (bukan gambar)                                         | Quality      |
| AC4   | Gambar dalam PDF ter-embed di DOCX                                                                    | Quality      |
| AC5   | Font fallback — jika font tidak tersedia, gunakan font default yang mirip                             | Quality      |
| AC6   | Processing time < 30 detik untuk PDF ≤ 20 halaman                                                    | Performance  |
| AC7   | Progress indicator ditampilkan selama processing (bukan blank screen)                                 | UX           |
| AC8   | Error handling: PDF scanned (image-only) → suggest OCR terlebih dahulu                                | Edge case    |
| AC9   | File auto-delete 60 menit setelah processing                                                          | Privacy      |
| AC10  | Halaman /pdf-to-word mengikuti template PDFUploader pattern (R2)                                      | UI Safety    |

**Dependencies:**

- M01 (infrastruktur dasar)
- LibreOffice headless harus diinstall di Docker container backend (Dockerfile update)
- Mungkin membutuhkan VPS jika Railway resource tidak cukup (out of scope — inisiatif terpisah)

**Estimasi Effort:** 15–20 jam

**Risiko:** High — LibreOffice headless membutuhkan ~500MB+ disk space di container. Railway free tier mungkin tidak cukup. Konversi quality bervariasi tergantung kompleksitas PDF.

**Catatan Teknis:**
- LibreOffice headless dipilih karena kualitas konversi terbaik
- BUKAN pdf2docx (kualitas rendah untuk layout kompleks)
- BUKAN PyMuPDF + python-docx (hanya bisa extract text, kehilangan layout)
- Dockerfile perlu update: `apt-get install -y libreoffice-writer`

---

#### 7.5.2 M17 — OCR (Optical Character Recognition)

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Ekstraksi teks dari PDF berbasis gambar (scanned documents) dan menghasilkan searchable PDF                    |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| **Server-side (ocrmypdf + Tesseract)**                                                                        |
| **Library**            | ocrmypdf (wrapper) + Tesseract OCR engine + bahasa Indonesia language pack (`tesseract-ocr-ind`)              |
| **Alasan ocrmypdf**    | ocrmypdf adalah gold standard untuk PDF OCR — menghasilkan searchable PDF langsung, bukan hanya text extraction. Tesseract sebagai engine karena open-source, mature, dan mendukung Bahasa Indonesia. |

**UI Placement:**

- Route: `/ocr`
- Landing page grid: posisi ke-12
- Icon: 🔍 (search / scan icon)
- Flow: Upload scanned PDF → Pilih bahasa (Indonesia/English) → Proses (server) → Progress indicator → Download searchable PDF + optional text extraction

**Acceptance Criteria:**

| **#** | **Kriteria**                                                                                          | **Tipe**     |
|-------|-------------------------------------------------------------------------------------------------------|--------------|
| AC1   | User dapat upload scanned PDF dan mendapatkan searchable PDF (teks bisa di-select dan di-search)      | Functional   |
| AC2   | Akurasi ≥ 90% untuk dokumen cetak Bahasa Indonesia (font standar, kualitas scan baik)                 | Quality      |
| AC3   | Akurasi ≥ 85% untuk dokumen cetak Bahasa Inggris                                                     | Quality      |
| AC4   | User dapat memilih bahasa OCR: Indonesia, English, atau Auto-detect                                   | Functional   |
| AC5   | Optional: text extraction output (copy-paste teks hasil OCR)                                          | Functional   |
| AC6   | Processing time < 60 detik untuk PDF ≤ 10 halaman                                                    | Performance  |
| AC7   | Progress indicator dengan estimasi waktu ditampilkan                                                  | UX           |
| AC8   | PDF yang sudah searchable (bukan scanned) → pesan: "File ini sudah memiliki teks yang bisa dicari"   | Edge case    |
| AC9   | File auto-delete 60 menit setelah processing                                                          | Privacy      |
| AC10  | Halaman /ocr mengikuti template PDFUploader pattern (R2)                                              | UI Safety    |

**Dependencies:**

- M01 (infrastruktur dasar)
- Tesseract OCR + language packs harus diinstall di Docker container
- ocrmypdf Python package
- Mungkin membutuhkan VPS jika Railway resource tidak cukup (out of scope — inisiatif terpisah)

**Estimasi Effort:** 20–30 jam

**Risiko:** High — Tesseract + language packs membutuhkan ~200MB+ disk space. OCR processing CPU-intensive dan bisa timeout di Railway free tier. Akurasi untuk handwritten text sangat rendah (out of scope).

**Catatan Teknis:**
- ocrmypdf + Tesseract dipilih karena menghasilkan searchable PDF langsung
- BUKAN EasyOCR (lebih berat, GPU-preferred, overkill untuk use case ini)
- BUKAN PaddleOCR (kompleks setup, lebih cocok untuk Chinese/Asian text)
- Dockerfile perlu update: `apt-get install -y tesseract-ocr tesseract-ocr-ind tesseract-ocr-eng`
- pip install: `ocrmypdf`

---

#### 7.5.3 M18 — PDF-to-Excel

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Ekstraksi tabel dari PDF dan konversi ke format Microsoft Excel (.xlsx)                                        |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| **Server-side (camelot/tabula-py + openpyxl)**                                                                |
| **Library**            | camelot-py (primary, lattice+stream) atau tabula-py (fallback) untuk table detection + openpyxl untuk XLSX generation |
| **Alasan camelot**     | camelot memberikan table detection terbaik untuk PDF dengan garis tabel (lattice mode) dan tanpa garis (stream mode). openpyxl untuk generate XLSX yang clean. |

**UI Placement:**

- Route: `/pdf-to-excel`
- Landing page grid: posisi ke-13
- Icon: 📊 (chart / Excel icon)
- Flow: Upload PDF → Auto-detect tabel → Preview tabel yang terdeteksi → Pilih tabel → Proses → Download XLSX

**Acceptance Criteria:**

| **#** | **Kriteria**                                                                                          | **Tipe**     |
|-------|-------------------------------------------------------------------------------------------------------|--------------|
| AC1   | User dapat upload PDF dan mendapatkan file .xlsx yang bisa dibuka di Microsoft Excel / Google Sheets   | Functional   |
| AC2   | Tabel dengan garis (bordered) terdeteksi otomatis dengan akurasi ≥ 90%                                | Quality      |
| AC3   | Tabel tanpa garis (borderless) terdeteksi dengan akurasi ≥ 70%                                        | Quality      |
| AC4   | Data dalam sel tabel akurat — angka tetap angka, teks tetap teks                                      | Quality      |
| AC5   | Multi-table PDF → setiap tabel menjadi sheet terpisah di XLSX                                         | Functional   |
| AC6   | Preview tabel yang terdeteksi sebelum konversi (user bisa pilih tabel mana)                           | UX           |
| AC7   | Processing time < 30 detik untuk PDF ≤ 20 halaman                                                    | Performance  |
| AC8   | PDF tanpa tabel → pesan: "Tidak ditemukan tabel dalam file ini"                                      | Edge case    |
| AC9   | Scanned PDF → suggest OCR terlebih dahulu                                                             | Edge case    |
| AC10  | File auto-delete 60 menit setelah processing                                                          | Privacy      |
| AC11  | Halaman /pdf-to-excel mengikuti template PDFUploader pattern (R2)                                     | UI Safety    |

**Dependencies:**

- M01 (infrastruktur dasar)
- M16 (shared PDF parsing knowledge — bukan hard dependency, tapi sequential learning)
- M17 (OCR — untuk scanned table fallback, soft dependency)
- camelot-py atau tabula-py + openpyxl harus diinstall
- camelot membutuhkan ghostscript (sudah ada) dan opencv (perlu install)

**Estimasi Effort:** 15–20 jam

**Risiko:** Medium-High — Table detection accuracy sangat bergantung pada kualitas PDF. Borderless tables adalah challenge utama. camelot membutuhkan opencv yang menambah container size.

**Catatan Teknis:**
- camelot-py (primary) — lattice mode untuk bordered tables, stream mode untuk borderless
- tabula-py (fallback) — jika camelot gagal detect
- openpyxl untuk XLSX generation
- Dockerfile perlu update: `apt-get install -y python3-opencv` + `pip install camelot-py[cv] openpyxl`
---

### 7.6 Phase 2D — Cross-cutting Quality 🟢 Buildable

Phase 2D bukan fitur user-facing, melainkan quality improvements yang memastikan MVP 0.2 production-ready dan maintainable. Dikerjakan SETELAH semua tool milestones (M12–M18) selesai.

---

#### 7.6.1 E2E Testing (Playwright)

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | End-to-end testing untuk semua 13 tools menggunakan Playwright                                                |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Scope**              | Install Playwright, tulis E2E test untuk setiap tool (upload → process → download), CI integration            |
| **Target**             | Minimal 1 happy path test + 1 error case test per tool = 26 tests minimum                                    |
| **Estimasi**           | 8–12 jam                                                                                                     |

**Acceptance Criteria:**
- Playwright terinstall dan terkonfigurasi di project
- Setiap tool memiliki minimal 2 E2E tests (happy path + error case)
- Tests berjalan di CI (GitHub Actions) pada setiap PR
- Test report tersedia dan readable
- Tests berjalan < 5 menit total

---

#### 7.6.2 Code Formatting (Prettier + Ruff)

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Setup code formatting otomatis — Prettier untuk frontend (TypeScript/CSS), Ruff untuk backend (Python)        |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Scope**              | Install & configure Prettier + Ruff, format seluruh codebase, add pre-commit hooks, CI check                 |
| **Estimasi**           | 3–5 jam                                                                                                      |

**Acceptance Criteria:**
- Prettier terkonfigurasi untuk frontend (`.prettierrc`)
- Ruff terkonfigurasi untuk backend (`ruff.toml` atau `pyproject.toml`)
- Seluruh codebase sudah di-format
- Pre-commit hook mencegah unformatted code
- CI check gagal jika ada formatting violation

---

#### 7.6.3 Performance Optimization

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Optimasi performa frontend — Lighthouse score, bundle size, lazy loading                                      |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Scope**              | Lighthouse audit semua halaman, bundle analysis, implement lazy loading untuk komponen berat, image optimization |
| **Target**             | Lighthouse Performance ≥ 90 untuk semua halaman tool                                                         |
| **Estimasi**           | 3–5 jam                                                                                                      |

**Acceptance Criteria:**
- Lighthouse Performance score ≥ 90 untuk semua 13 halaman tool
- Lighthouse Accessibility score ≥ 90
- Bundle size per halaman tool < 50KB JS gzipped
- Semua komponen berat (canvas, signature pad) menggunakan `dynamic()` import
- No layout shift (CLS < 0.1)

---

#### 7.6.4 Monitoring & Alerting

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Setup uptime monitoring dan alerting untuk frontend dan backend                                               |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Scope**              | Setup BetterStack atau UptimeRobot untuk monitoring, Telegram bot untuk alerting                              |
| **Estimasi**           | 2–3 jam                                                                                                      |

**Acceptance Criteria:**
- Uptime monitoring aktif untuk mypapyr.com (frontend)
- Uptime monitoring aktif untuk backend health endpoint
- Alert via Telegram dalam < 5 menit saat downtime
- Monthly uptime report tersedia
- Target uptime: ≥ 99.5%

---

#### 7.6.5 SEO Update

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Update SEO untuk 7 tool baru — meta tags, sitemap, OG images, structured data                                |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Scope**              | layout.tsx metadata untuk setiap tool baru, sitemap.ts update (13 URLs), OG image per tool, JSON-LD          |
| **Estimasi**           | 3–5 jam                                                                                                      |

**Acceptance Criteria:**
- Setiap halaman tool baru memiliki unique title, description, dan keywords dalam Bahasa Indonesia
- sitemap.ts menghasilkan 13+ URLs (6 existing + 7 baru + landing + privacy)
- OG image untuk setiap tool baru (bisa generic template dengan nama tool)
- JSON-LD structured data (WebApplication schema) di landing page
- Google Search Console menunjukkan semua halaman ter-index

---

#### 7.6.6 Analytics Update

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Update analytics taxonomy untuk 7 tool baru — event tracking konsisten                                       |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Scope**              | Tambahkan event tracking (task_started, task_completed, task_failed) untuk setiap tool baru                   |
| **Estimasi**           | 1–2 jam                                                                                                      |

**Acceptance Criteria:**
- Setiap tool baru memiliki event tracking: `task_started`, `task_completed`, `task_failed`
- Event properties konsisten: `tool_name`, `file_size`, `processing_time`, `device_category`
- Analytics dashboard menunjukkan data untuk semua 13 tools
- Taxonomy document di-update

---

### 7.7 Phase 2E — OpenClaw AI Agent 🟡 Experimental

Phase 2E adalah deployment sistem AI agent otonom (OpenClaw) yang mengelola operasional Papyr secara autonomous. Dikerjakan SETELAH Phase 2D selesai dan product sudah stable.

---

#### 7.7.1 Ringkasan OpenClaw

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Milestone**          | M21                                                                                                           |
| **Deskripsi**          | Sistem AI agent otonom dengan 10 fungsi: SEO Pipeline, Competitor Monitoring, Server Health, Security Scanning, Reporting, Self-Improvement, Project Management, Backup & Verify, Analytics Intelligence, Social Media (Twitter/X) |
| **Label**              | 🟡 Experimental                                                                                              |
| **Deployment**         | HostData.id VPS (dedicated) — terpisah dari Railway backend                                                   |
| **Stack**              | Node.js 20 + TypeScript + BullMQ + Redis + PostgreSQL + Docker                                               |
| **LLM Provider**       | enowxAI API                                                                                                   |
| **Komunikasi**         | Telegram Bot (@PapyrOpsBot) + Email (Resend) + Dashboard (/admin/openclaw) + Twitter/X (@PapyrPDF)            |
| **Estimasi**           | 100–140 jam                                                                                                   |
| **Dependensi**         | Phase 2D complete (product stable)                                                                            |
| **Dokumen Lengkap**    | PPR-CLAW-001 (30_Papyr_OpenClaw_v1.0.md)                                                                     |

#### 7.7.2 10 Fungsi Agent

| **#** | **Fungsi**              | **Persona** | **Deskripsi**                                                          | **Jadwal**        |
|-------|-------------------------|-------------|------------------------------------------------------------------------|-------------------|
| 1     | SEO Pipeline            | Aksara ✍️   | Auto-generate blog articles, keyword research, 4-gate content pipeline | 2-4 artikel/minggu|
| 2     | Competitor Monitoring   | Telik 🔍    | Track iLovePDF, SmallPDF, PDF24, Stirling, Adobe — fitur & pricing     | Mingguan          |
| 3     | Server Health           | Jaga 🛡️     | Monitor Railway, Vercel, R2 — auto-remediation                        | Setiap 60 detik   |
| 4     | Security Scanning       | Tameng 🔒   | npm/pip audit, CVE scan, secret detection, OWASP                      | Harian + Mingguan |
| 5     | Reporting               | Warta 📊    | Daily/weekly/monthly reports via Telegram + Email                      | Harian/Mingguan   |
| 6     | Self-Improvement        | Lontar 📜   | Auto-modify SOUL.md/HEARTBEAT.md, A/B test schedules                  | Mingguan          |
| 7     | Project Management      | Dalang 🎭   | GitHub issues, sprint planning, tech debt scan, velocity tracking      | Harian            |
| 8     | Backup & Verify         | Pustaka 📚  | R2 backup, git backup, env backup, weekly verification                 | Harian + Mingguan |
| 9     | Analytics Intelligence  | Prasasti 📈 | Vercel Analytics analysis, anomaly detection, insights                 | Mingguan          |
| 10    | Social Media (Twitter/X) | Kicau 🐦  | Playwright browser automation, auto-post, community engagement, meme   | Harian            |

#### 7.7.3 Acceptance Criteria

- 10 fungsi agent berjalan sesuai jadwal HEARTBEAT.md
- Telegram Bot aktif dan responsif terhadap commands
- Dashboard /admin/openclaw menampilkan status real-time semua agent
- Daily report terkirim via Telegram setiap malam (22:00 WIB)
- Health monitoring mendeteksi downtime dalam < 2 menit
- Security scan berjalan harian tanpa false positive berlebihan
- SEO Pipeline menghasilkan minimal 2 artikel/minggu
- Backup berjalan harian dengan weekly verification pass
- Total biaya OpenClaw < Rp 150.000/bulan (VPS + LLM tokens)
- Quarterly report terkirim via Telegram + Email (PDF) setiap akhir quarter
- Yearly report terkirim via Telegram + Email (PDF) setiap Januari
- Twitter/X account aktif dengan minimal 3 posts/minggu
- Incident auto-fix berjalan untuk P0/P1 tanpa approval
- OpenClaw = operator utama dashboard (bukan sekadar data provider)

---

### 7.8 Phase 2F — Admin Dashboard 🟢 Buildable

Phase 2F adalah unified admin panel yang memberikan visibilitas penuh terhadap seluruh operasional Papyr, termasuk monitoring OpenClaw agents, server health, analytics, dan security. Dikerjakan SETELAH Phase 2E selesai karena dashboard membutuhkan OpenClaw API untuk menampilkan data agent.

---

#### 7.8.1 Ringkasan Admin Dashboard

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Milestone**          | M22                                                                                                           |
| **Deskripsi**          | Unified admin panel di route `/admin` dalam Next.js app yang sama, mencakup 10 modul monitoring               |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Route**              | `/admin/*` (same Next.js frontend app)                                                                        |
| **Stack**              | Next.js (SSR), shared Tailwind/DM Sans components, same design system                                        |
| **Auth**               | Env-based token auth (ADMIN_SECRET env var) — upgrade ke role-based saat MVP 0.3 auth tersedia                |
| **Estimasi**           | 30–40 jam                                                                                                     |
| **Dependensi**         | Phase 2E (OpenClaw) — dashboard membutuhkan OpenClaw API untuk display agent data                             |
| **Dokumen Lengkap**    | PPR-ADM-001 (Admin Dashboard Spec)                                                                            |

#### 7.8.2 10 Modul Admin Dashboard

| **#** | **Modul**                    | **Deskripsi**                                                                          |
|-------|------------------------------|----------------------------------------------------------------------------------------|
| 1     | OpenClaw Monitoring          | Status semua 10 agent, logs, manual override, SOUL.md editor, CLI access, Twitter analytics |
| 2     | Analytics Overview           | Traffic, tasks processed, tool usage, device breakdown, trends                         |
| 3     | Server Health Dashboard      | Railway uptime, Vercel status, R2 storage usage, response times                        |
| 4     | Security Scan Results        | Dependency audit results, CVE alerts, security scan history                            |
| 5     | SEO & Competitor Intel       | SEO rankings, competitor changes, content pipeline status                              |
| 6     | Revenue/Billing (Placeholder)| Revenue, subscribers, payment history (aktif saat MVP 0.3)                             |
| 7     | System Logs & Errors         | Error logs, rate limit hits, failed tasks, cleanup stats                               |
| 8     | Backup Status                | Backup status, restore history, storage usage                                          |
| 9     | User Management (Placeholder)| Aktif saat MVP 0.3 auth tersedia                                                       |
| 10    | Settings                     | System config, notification preferences, API keys                                      |

#### 7.8.3 Detail Teknis

- **Route structure:** `/admin` (overview), `/admin/openclaw`, `/admin/analytics`, `/admin/health`, `/admin/security`, `/admin/seo`, `/admin/billing`, `/admin/logs`, `/admin/backup`, `/admin/users`, `/admin/settings`
- **Auth mechanism:** Simple env-based token — request header `Authorization: Bearer <ADMIN_SECRET>` atau cookie-based session setelah login di `/admin/login`
- **Upgrade path:** Saat MVP 0.3 auth (M23) tersedia, admin dashboard akan menggunakan role-based access control
- **OpenClaw CLI:** Accessible via dashboard — send commands langsung ke OpenClaw agent dari browser
- **Design:** Same Tailwind v4 + DM Sans design system, responsive (desktop-primary untuk admin, tapi tetap usable di mobile)

#### 7.8.4 Acceptance Criteria

| **#** | **Kriteria**                                                                                          | **Tipe**     |
|-------|-------------------------------------------------------------------------------------------------------|--------------|
| AC1   | Admin panel accessible di `/admin` dengan token auth                                                  | Functional   |
| AC2   | 10 modul tersedia dan menampilkan data real-time (atau placeholder untuk modul MVP 0.3)               | Functional   |
| AC3   | OpenClaw agent status visible — running/stopped/error per agent                                       | Functional   |
| AC4   | Server health metrics (uptime, response time, storage) ditampilkan                                    | Functional   |
| AC5   | Security scan results dan CVE alerts visible                                                          | Functional   |
| AC6   | System logs searchable dan filterable                                                                 | Functional   |
| AC7   | Unauthorized access ke `/admin/*` redirect ke login atau return 401                                   | Security     |
| AC8   | ADMIN_SECRET env var required — app tidak crash jika tidak di-set (graceful fallback)                 | Security     |
| AC9   | Dashboard uptime ≥ 99% (self-monitoring)                                                              | Performance  |
| AC10  | Same design system (Tailwind v4, DM Sans) — konsisten dengan frontend utama                          | UI           |

**Dependencies:**

- Phase 2E (OpenClaw deployed dan API tersedia)
- OpenClaw CLI interface (sudah dalam OpenClaw spec)

**Estimasi Effort:** 30–40 jam

**Risiko:** Rendah — pure frontend/SSR work dalam stack yang sudah ada. Tidak ada dependency eksternal baru selain OpenClaw API yang sudah di-spec.

---

### 7.9 Urutan Pengerjaan MVP 0.2

```
Phase 2A                Phase 2B                Phase 2C                    Phase 2D                Phase 2E                Phase 2F
────────────────────    ────────────────────    ────────────────────────    ────────────────────    ────────────────────    ────────────────────
M12 Protect 🟢          M14 Watermark 🟢        M16 PDF-to-Word 🟡          E2E Testing 🟢          M21 OpenClaw 🟡         M22 Admin Panel 🟢
    │                       │                       │                       Prettier+Ruff 🟢        9 AI Functions          10 Modules
    ▼                       │                       ▼                       Performance 🟢          HostData.id VPS         /admin route
M13 Unlock 🟢           M15 Sign 🟡             M17 OCR 🟡                  Monitoring 🟢           Node.js+BullMQ          Unified monitoring
                                                    │                       SEO Update 🟢           +Redis+PostgreSQL       Env-based auth
                                                    ▼                       Analytics 🟢
                                                M18 PDF-to-Excel 🟡

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────►
16-24 jam               25-35 jam               50-70 jam                   20-30 jam               100-140 jam             30-40 jam
```

**Rasional urutan:**
1. **Phase 2A (M12→M13):** Shared encryption/decryption logic, natural pair, effort rendah — quick wins
2. **Phase 2B (M14, M15):** Independent features, moderate effort — momentum builder
3. **Phase 2C (M16→M17→M18):** Progressive complexity, shared PDF content extraction — heaviest phase
4. **Phase 2D:** Quality sweep setelah semua tools selesai — ensures production readiness
5. **Phase 2E (M21):** OpenClaw AI Agent — autonomous operations, deployed setelah product stable
6. **Phase 2F (M22):** Admin Dashboard — unified monitoring, membutuhkan OpenClaw API yang sudah live

**Rilis Incremental:**
- Setelah Phase 2A selesai → deploy (8 tools live)
- Setelah Phase 2B selesai → deploy (10 tools live)
- Setelah Phase 2C selesai → deploy (13 tools live)
- Setelah Phase 2D selesai → deploy (quality hardened)
- Setelah Phase 2E selesai → deploy OpenClaw (autonomous operations active)
- Setelah Phase 2F selesai → deploy Admin Dashboard (unified monitoring active)

---

## 8. Detail MVP 0.3 — Monetisasi

### 8.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 📋 PLANNED — Setelah gate condition terpenuhi                |
| **Gate Condition**     | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 Monthly Active Users       |
| **Fokus**              | Login system, pricing tiers, payment integration              |
| **Payment Provider**   | Midtrans dan/atau Xendit                                     |
| **Label Dominan**      | 🟢 Buildable + 🔵 Business Outcome                          |

### 8.2 Model Pricing

| **Tier**                    | **Harga**                              | **Fitur**                                                                                      |
|-----------------------------|----------------------------------------|------------------------------------------------------------------------------------------------|
| **Free (Tanpa Login)**      | Gratis                                 | Semua basic tools unlimited (9 tools), max file 20 MB, tanpa perlu akun                        |
| **Free (Dengan Login)**     | Gratis                                 | + OCR 5x/hari, PDF-to-Word 5x/hari, PDF-to-Excel 3x/hari, Sign 5x/hari                       |
| **Pro**                     | Rp 19.900/bulan (Rp 149.000/tahun)    | Semua fitur unlimited, batch processing, max file 100 MB, priority queue, no branding, API access |

### 8.3 Perbandingan Tier Detail

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

### 8.4 Komponen Teknis Monetisasi

#### 8.4.1 M23 — Authentication System 🟢

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Deskripsi**          | Sistem login/register — Supabase Auth (email + Google OAuth)  |
| **Label**              | 🟢 Buildable                                                 |
| **Teknologi**          | Supabase Auth (sudah standby di stack)                        |
| **Estimasi**           | 15–20 jam                                                     |

**Acceptance Criteria:**
- User dapat register dengan email + password
- User dapat login dengan Google OAuth (one-click)
- Login state persisted across sessions (JWT + refresh token)
- Logout berfungsi dan clear semua state
- Protected routes untuk dashboard
- Login TIDAK required untuk basic tools (Zero-Friction principle)
- UI login/register dalam Bahasa Indonesia

**Dependencies:** Supabase project (sudah ada, standby)

---

#### 8.4.2 M24 — User Dashboard 🟢

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Deskripsi**          | Dashboard untuk logged-in users — usage stats, subscription   |
| **Label**              | 🟢 Buildable                                                 |
| **Teknologi**          | Next.js protected routes + Supabase database                  |
| **Estimasi**           | 10–15 jam                                                     |

**Acceptance Criteria:**
- Dashboard menampilkan: usage hari ini (per tool), subscription status, account info
- Usage counter real-time (berapa kali OCR/PDF-to-Word/etc digunakan hari ini)
- Subscription status: Free / Pro (active/expired)
- Account settings: change password, delete account
- Mobile-first layout (R3)

**Dependencies:** M23 (Authentication)

---

#### 8.4.3 M25 — Usage Tracking & Rate Limiting 🟢

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Deskripsi**          | Tracking penggunaan per user per tool per hari + rate limiting |
| **Label**              | 🟢 Buildable                                                 |
| **Teknologi**          | Supabase database (usage table) + middleware rate limiting     |
| **Estimasi**           | 10–15 jam                                                     |

**Acceptance Criteria:**
- Usage tracking per user per tool per hari (stored di Supabase)
- Rate limiting enforced: Free+Login users dibatasi sesuai tier
- Limit reached → pesan: "Batas harian tercapai. Upgrade ke Pro untuk unlimited."
- Pro users → no rate limit (kecuali abuse protection)
- Anonymous users → basic tools unlimited, advanced tools blocked

**Dependencies:** M23 (Authentication), M24 (Dashboard)

---

#### 8.4.4 M26 — Payment Integration 🟡

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Deskripsi**          | Integrasi pembayaran untuk Pro tier — Midtrans/Xendit         |
| **Label**              | 🟡 Hard                                                      |
| **Teknologi**          | Midtrans/Xendit SDK + webhook handlers                        |
| **Estimasi**           | 15–20 jam                                                     |

**Acceptance Criteria:**
- User dapat upgrade ke Pro via payment page
- Payment methods: bank transfer, e-wallet (GoPay, OVO, DANA), credit card
- Monthly (Rp 19.900) dan yearly (Rp 149.000) options
- Webhook handler untuk payment confirmation
- Subscription auto-renewal dan cancellation flow
- Invoice/receipt generation
- Payment failure → retry mechanism + user notification

**Dependencies:** M23, M24, M25

---

#### 8.4.5 M27 — API Key System 🟢

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Deskripsi**          | Sistem API key untuk Pro users — akses programmatic           |
| **Label**              | 🟢 Buildable                                                 |
| **Teknologi**          | Token generation + API rate limiting middleware                |
| **Estimasi**           | 8–12 jam                                                     |

**Acceptance Criteria:**
- Pro users dapat generate API key dari dashboard
- API key memberikan akses ke semua tools via REST API
- Rate limiting per API key (100 requests/jam)
- API documentation (Swagger/OpenAPI) tersedia
- Key rotation dan revocation support

**Dependencies:** M26 (Payment — Pro tier must exist)

### 8.5 Strategi Monetisasi

- **Filosofi:** Gratis untuk kebutuhan dasar, premium untuk power users
- **Konversi Target:** 2–5% dari registered users ke Pro
- **Pricing Rationale:** Rp 19.900/bulan = ~$1.25 USD — sangat terjangkau untuk pasar Indonesia, lebih murah dari kompetitor global (SmallPDF $9/bulan, iLovePDF $4/bulan)
- **Annual Discount:** ~37% diskon untuk komitmen tahunan (Rp 149.000 vs Rp 238.800)
- **Business Outcome Target:** 🔵 MRR ≥ Rp 500.000/bulan dalam 6 bulan setelah launch
---

## 9. Detail Fase 2 — AI Features

### 9.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 🔮 VISI — Perencanaan tingkat tinggi                         |
| **Gate Condition**     | MVP 0.3 menghasilkan revenue > Rp 0 (validated willingness to pay) |
| **Fokus**              | AI-powered document intelligence                              |
| **Teknologi Kandidat** | OpenAI API, Google Gemini, atau model lokal                  |
| **Label Dominan**      | 🟣 R&D                                                       |

### 9.2 Fitur yang Direncanakan

---

#### 9.2.1 M28 — AI Document Analysis 🟣

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Analisis konten PDF secara otomatis — ringkasan, keyword extraction, klasifikasi dokumen                       |
| **Label**              | 🟣 R&D                                                                                                       |
| **Processing Strategy**| Server-side (LLM API call)                                                                                    |
| **Teknologi Kandidat** | OpenAI GPT-4o-mini / Google Gemini Flash / model lokal (Ollama)                                              |
| **Estimasi**           | 30–40 jam                                                                                                     |

**Acceptance Criteria:**
- User dapat upload PDF dan mendapatkan ringkasan otomatis (100-300 kata)
- Keyword extraction (5-10 keywords utama)
- Klasifikasi dokumen (invoice, surat, laporan, kontrak, dll.)
- Bahasa Indonesia dan English supported
- Processing time < 30 detik
- Hanya tersedia untuk Pro tier atau dengan kuota terbatas (Free+Login: 3x/hari)

**Dependencies:** MVP 0.3 complete (authentication + payment required)

**Risiko:** 🟣 R&D — Akurasi untuk dokumen Bahasa Indonesia belum tervalidasi. Cost per request perlu di-monitor ketat. Privacy concern untuk dokumen sensitif.

---

#### 9.2.2 M29 — Smart Compression Recommendations 🟣

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | AI merekomendasikan level kompresi optimal berdasarkan analisis konten PDF                                     |
| **Label**              | 🟣 R&D                                                                                                       |
| **Processing Strategy**| Server-side (content analysis + heuristics + optional LLM)                                                    |
| **Estimasi**           | 20–30 jam                                                                                                     |

**Acceptance Criteria:**
- Analisis konten PDF: rasio teks vs gambar vs whitespace
- Rekomendasi level kompresi: "Dokumen ini 80% gambar — kompresi agresif akan mengurangi ukuran 60% dengan sedikit penurunan kualitas"
- Preview before/after (file size estimation)
- One-click apply recommendation
- Akurasi rekomendasi ≥ 80% (user satisfaction)

**Dependencies:** M28 (shared AI infrastructure)

---

#### 9.2.3 M30 — AI Content Extraction 🟡

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Ekstraksi data terstruktur dari dokumen (invoice, receipt, form) menggunakan AI                                |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| Server-side (OCR + LLM structured output)                                                                     |
| **Estimasi**           | 30–40 jam                                                                                                     |

**Acceptance Criteria:**
- Ekstraksi data dari invoice: tanggal, nomor invoice, total, item list
- Ekstraksi data dari receipt: merchant, tanggal, total, items
- Output dalam format JSON atau CSV
- Akurasi ≥ 85% untuk dokumen standar Indonesia
- Hanya tersedia untuk Pro tier

**Dependencies:** M28 (AI infrastructure), M17 (OCR — untuk scanned documents)

### 9.3 Pertimbangan Teknis Fase 2

- **Privacy:** AI processing harus tetap menghormati prinsip privacy-first — opsi client-side AI (WebLLM) untuk dokumen sensitif di masa depan
- **Cost:** API calls AI memiliki biaya per request — hanya tersedia untuk tier Pro atau dengan kuota terbatas
- **Accuracy:** Perlu validasi akurasi untuk dokumen Bahasa Indonesia sebelum rilis publik
- **Latency:** AI processing membutuhkan waktu lebih lama — perlu UX yang jelas (progress indicator, async processing)
- **Model Selection:** Evaluasi cost vs quality: GPT-4o-mini (murah, cukup akurat) vs Gemini Flash (gratis tier tersedia) vs lokal (zero cost, lower quality)

---

## 10. Detail Fase 3 — Indonesia Deep

### 10.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 🔮 VISI — Perencanaan tingkat tinggi                         |
| **Gate Condition**     | Fase 2 stabil + regulatory readiness + partnership            |
| **Fokus**              | Integrasi mendalam dengan ekosistem digital Indonesia         |
| **Label Dominan**      | 🔴 Regulated + ⚪ Moonshot                                   |

### 10.2 Fitur yang Direncanakan

---

#### 10.2.1 M31 — e-Meterai Integration 🔴

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Integrasi dengan sistem e-Meterai Peruri untuk pembubuhan meterai digital pada PDF                             |
| **Label**              | 🔴 Regulated                                                                                                 |
| **Requirement**        | Partnership resmi dengan Peruri atau aggregator resmi (e.g., Privy, VIDA)                                    |
| **Estimasi**           | 40–60 jam                                                                                                     |

**Acceptance Criteria:**
- User dapat membubuhkan e-Meterai Rp 10.000 pada dokumen PDF
- Integrasi dengan API resmi Peruri/aggregator
- Meterai valid dan dapat diverifikasi
- Payment flow untuk pembelian meterai
- Audit trail dan bukti pembubuhan
- Compliance dengan regulasi Peruri

**Dependencies:** Partnership MoU dengan Peruri/aggregator, regulatory approval

**Risiko:** 🔴 Regulated — Membutuhkan partnership resmi. Timeline tidak bisa diprediksi karena bergantung pada pihak ketiga.

---

#### 10.2.2 M32 — Government Document Templates 🔴

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Template siap pakai untuk dokumen pemerintah dan bisnis Indonesia                                              |
| **Label**              | 🔴 Regulated                                                                                                 |
| **Estimasi**           | 20–30 jam                                                                                                     |

**Acceptance Criteria:**
- Template surat keterangan (domisili, usaha, dll.)
- Template proposal bisnis standar Indonesia
- Template laporan keuangan sederhana
- Template kontrak kerja
- Fill-in-the-blank interface
- Export ke PDF dengan formatting yang benar
- Minimal 20 templates tersedia saat launch

**Dependencies:** M31 (e-Meterai — untuk legalisasi template), legal review

---

#### 10.2.3 M33 — Local Compliance Features ⚪

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Fitur kepatuhan regulasi lokal — tanda tangan elektronik tersertifikasi, validasi NPWP/NIK                    |
| **Label**              | ⚪ Moonshot                                                                                                   |
| **Estimasi**           | 30–50 jam                                                                                                     |

**Acceptance Criteria:**
- Tanda tangan elektronik tersertifikasi (PSrE-certified)
- Validasi format NPWP dan NIK
- Integration dengan BSrE (Badan Siber dan Sandi Negara)
- Compliance reporting
- Enterprise-grade security

**Dependencies:** M31, M32, sertifikasi dari Kominfo/BSrE

**Risiko:** ⚪ Moonshot — Sertifikasi PSrE membutuhkan investasi signifikan dan timeline yang panjang. Bisa jadi game-changer untuk enterprise market, tapi juga bisa gagal jika regulasi berubah.

### 10.3 Pertimbangan Strategis Fase 3

- **Partnership:** e-Meterai membutuhkan kerjasama resmi dengan Peruri atau aggregator resmi
- **Regulasi:** Tanda tangan elektronik tersertifikasi membutuhkan sertifikasi dari Kominfo/BSrE
- **Market Timing:** Adopsi e-Meterai di Indonesia masih dalam fase pertumbuhan — timing yang tepat untuk masuk
- **Competitive Moat:** Integrasi Indonesia-specific ini menjadi differentiator kuat terhadap kompetitor global
- **Revenue Model:** e-Meterai bisa menjadi revenue stream signifikan (margin per meterai)

---

## 11. Yang TIDAK Akan Dibangun

Bagian ini secara eksplisit mendefinisikan fitur dan produk yang **TIDAK** akan dibangun dalam horizon roadmap ini. Tujuannya adalah memberikan kejelasan scope dan mencegah scope creep.

| **#**  | **Item**                              | **Alasan Tidak Dibangun**                                                                                     | **Kapan Mungkin Dipertimbangkan**     |
|--------|---------------------------------------|---------------------------------------------------------------------------------------------------------------|---------------------------------------|
| X1     | Desktop native app                    | Web app sudah cukup untuk semua use case. Native app menambah maintenance burden tanpa value tambah signifikan. | Tidak dalam horizon roadmap ini.      |
| X2     | Mobile native app                     | Mobile web sudah dioptimasi (mobile-first). Native app hanya relevan jika ada fitur yang tidak bisa di web.   | Fase 2+ / Tahun 2 (jika ada demand)  |
| X3     | PDF editing (text editing inside PDF) | Sangat kompleks, membutuhkan PDF rendering engine lengkap. Bukan core value proposition Papyr.                | Tidak dalam horizon roadmap ini.      |
| X4     | PDF form filling                      | Niche use case, kompleksitas tinggi, banyak edge cases. Lebih baik fokus ke tools yang lebih universal.       | Tidak dalam horizon roadmap ini.      |
| X5     | PDF comparison/diff                   | Niche use case untuk enterprise. Tidak sesuai dengan target user utama (mahasiswa, pekerja kantoran).         | Fase 2+ (jika enterprise demand)      |
| X6     | Batch processing                      | Membutuhkan queue system dan resource management yang kompleks. Hanya relevan untuk Pro tier.                 | MVP 0.3 (Pro tier feature)            |
| X7     | User accounts                         | Menambah friction untuk basic tools. Zero-login adalah core value proposition.                                 | MVP 0.3 (optional, untuk advanced)    |
| X8     | Payment processing                    | Premature — belum ada validated demand. Hanya dibangun setelah traffic threshold terpenuhi.                   | MVP 0.3 (setelah gate condition)      |
| X9     | AI features                           | Premature — membutuhkan revenue validation terlebih dahulu. Cost per request harus di-cover oleh Pro tier.    | Fase 2 (setelah revenue > Rp 0)      |
| X10    | e-Meterai                             | Membutuhkan partnership resmi dan regulatory approval. Tidak bisa dibangun secara independen.                 | Fase 3 (setelah partnership MoU)      |
| X11    | Multi-language UI                     | Bahasa Indonesia adalah satu-satunya bahasa yang didukung. English UI tidak menambah value untuk target market.| Tidak dalam horizon roadmap ini.      |
| X12    | Collaboration features                | Real-time collaboration membutuhkan WebSocket infrastructure yang kompleks. Bukan core value.                 | Tidak dalam horizon roadmap ini.      |
| X13    | Cloud storage integration             | Google Drive/Dropbox integration menambah kompleksitas tanpa core value. User bisa upload/download manual.    | Fase 2+ (jika ada demand)             |
| X14    | White-label / reseller                | Premature — fokus pada brand building terlebih dahulu.                                                        | Fase 3+ (jika enterprise demand)      |

> **Prinsip:** Jika ragu apakah sesuatu harus dibangun, jawabannya adalah **tidak**. Fokus pada core value proposition: tools PDF yang gratis, cepat, dan aman.
---

## 12. Prioritas & Dependensi

### 12.1 Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEPENDENCY GRAPH                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MVP 0.1 (COMPLETED) ✅                                                     │
│  ┌─────┐                                                                    │
│  │ M01 │──┬──► M02 ──┐                                                     │
│  │Setup│  ├──► M03   │                                                      │
│  └─────┘  ├──► M04   ├──► M07 ──► M08                                      │
│           ├──► M05   │   (SEO)   (Analytics)                                │
│           ├──► M06 ──┤                                                      │
│           │          └──► M09 ──► M10 (Launch)                              │
│           └──► M11                                                          │
│                                                                             │
│  MVP 0.2 — Phase 2A (Security) 🟢                                           │
│  ┌─────┐                                                                    │
│  │ M12 │──► M13                                                             │
│  │Prot.│  (Unlock)                                                          │
│  └─────┘                                                                    │
│                                                                             │
│  MVP 0.2 — Phase 2B (Enhancement) 🟢/🟡                                     │
│  ┌─────┐   ┌─────┐                                                         │
│  │ M14 │   │ M15 │   (Independent)                                          │
│  │W.mrk│   │Sign │                                                          │
│  └─────┘   └─────┘                                                         │
│                                                                             │
│  MVP 0.2 — Phase 2C (Conversion) 🟡                                         │
│  ┌─────┐                                                                    │
│  │ M16 │──► M17 ──► M18                                                    │
│  │Word │   (OCR)   (Excel)                                                  │
│  └─────┘                                                                    │
│                                                                             │
│  MVP 0.2 — Phase 2D (Quality) 🟢                                            │
│  ┌─────────────────────────────────────┐                                    │
│  │ E2E · Format · Perf · Mon · SEO · An│                                    │
│  └─────────────────────────────────────┘                                    │
│           │                                                                 │
│           ▼                                                                 │
│  MVP 0.2 — Phase 2E (OpenClaw) 🟡                                           │
│  ┌─────────────────────────────────────┐                                    │
│  │ M21 OpenClaw (9 AI Functions)       │                                    │
│  └─────────────────────────────────────┘                                    │
│           │                                                                 │
│           ▼                                                                 │
│  MVP 0.2 — Phase 2F (Admin Dashboard) 🟢                                    │
│  ┌─────────────────────────────────────┐                                    │
│  │ M22 Admin Panel (10 Modules)        │                                    │
│  └─────────────────────────────────────┘                                    │
│           │                                                                 │
│           ▼ [GATE: ≥ 10K tasks/mo OR ≥ 5K MAU]                              │
│                                                                             │
│  MVP 0.3 (Monetisasi) 🟢🔵                                                  │
│  ┌─────────────────────────────────────────────────┐                        │
│  │ M23 Auth → M24 Dashboard → M25 Usage → M26 Pay → M27 API │              │
│  └─────────────────────────────────────────────────┘                        │
│           │                                                                 │
│           ▼ [GATE: revenue > Rp 0]                                          │
│                                                                             │
│  Fase 2 (AI Features) 🟣                                                    │
│  ┌─────────────────────────────────────┐                                    │
│  │ M28 AI Analysis → M29 Smart Comp    │                                    │
│  │                 → M30 AI Extract     │                                    │
│  └─────────────────────────────────────┘                                    │
│           │                                                                 │
│           ▼ [GATE: stable + regulatory + partnership]                        │
│                                                                             │
│  Fase 3 (Indonesia Deep) 🔴⚪                                               │
│  ┌─────────────────────────────────────┐                                    │
│  │ M31 e-Meterai → M32 Templates → M33 Compliance │                        │
│  └─────────────────────────────────────┘                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 12.2 Matriks Prioritas

| **Milestone** | **Impact** | **Effort** | **Prioritas** | **Label** | **Rasional**                                                    |
|---------------|------------|------------|---------------|-----------|------------------------------------------------------------------|
| M12 Protect   | Medium     | Low        | P1            | 🟢        | Fitur paling diminta, effort rendah, natural pair dengan M13     |
| M13 Unlock    | Medium     | Low        | P1            | 🟢        | Melengkapi M12, shared logic                                     |
| M14 Watermark | Medium     | Medium     | P2            | 🟢        | Berguna untuk profesional, effort moderat                        |
| M15 Sign      | High       | Medium     | P2            | 🟡        | High demand di Indonesia (kontrak, surat), effort moderat        |
| M16 PDF-Word  | High       | Medium     | P3            | 🟡        | Sangat diminta, tapi butuh server processing yang lebih berat    |
| M17 OCR       | High       | High       | P3            | 🟡        | Kompleks tapi sangat bernilai untuk scanned documents            |
| M18 PDF-Excel | Medium     | Medium     | P4            | 🟡        | Niche use case, bergantung pada M16 dan M17                      |
| M22 Admin     | Medium     | Medium     | P4            | 🟢        | Unified monitoring, depends on OpenClaw, operational visibility  |
| M23 Auth      | Medium     | Medium     | P5            | 🟢        | Enabler untuk monetisasi, bukan user-facing value                |
| M26 Payment   | High       | High       | P5            | 🟡        | Revenue enabler, tapi hanya setelah traffic threshold            |
| M28 AI        | High       | Very High  | P6            | 🟣        | High value tapi high risk — R&D required                         |
| M31 e-Meterai | Very High  | Very High  | P7            | 🔴        | Game-changer tapi regulated — timeline unpredictable             |

---

## 13. Metrik Keberhasilan per Fase

### 13.1 MVP 0.1 — Core Tools (COMPLETED)

| **Metrik**                    | **Target**                | **Aktual**       | **Status**  |
|-------------------------------|---------------------------|------------------|-------------|
| Tools Delivered               | 5 tools                   | 6 tools          | ✅ Exceeded |
| Tasks Completed               | 84 tasks                  | 89 tasks         | ✅ Exceeded |
| Production Deploy             | Live di mypapyr.com       | Live             | ✅ Met      |
| Performance (P95)             | < 3 detik                 | TBD              | 📊 Monitoring |
| Task Success Rate             | > 95%                     | TBD              | 📊 Monitoring |
| Zero Critical Bugs (7 hari)  | 0 critical bugs           | 0                | ✅ Met      |

### 13.2 MVP 0.2 — Tool Expansion

| **Metrik**                    | **Target**                                    | **Measurement**                              |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| Tools Delivered               | 7 tools tambahan (total 13)                   | Count of live tools                          |
| Tool Adoption                 | Setiap tool baru ≥ 100 uses dalam 30 hari     | Vercel Analytics event tracking              |
| Task Success Rate             | > 95% per tool                                | Error rate monitoring (task_failed events)   |
| SEO Ranking                   | Top 10 Google ID untuk keyword per tool       | Google Search Console                        |
| Organic Traffic Growth        | +50% dari baseline MVP 0.1                    | Vercel Analytics                             |
| Lighthouse Performance        | ≥ 90 untuk semua halaman tool                 | Lighthouse CI                                |
| E2E Test Coverage             | 26 tests passing (2 per tool)                 | Playwright CI report                         |
| Uptime                        | ≥ 99.5%                                       | BetterStack/UptimeRobot                      |
| Bundle Size                   | < 50KB JS gzipped per tool page               | Bundle analyzer                              |
| Admin Dashboard Uptime        | ≥ 99%                                         | Self-monitoring                              |

### 13.3 MVP 0.3 — Monetisasi

| **Metrik**                    | **Target**                                    | **Measurement**                              |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| Registered Users              | ≥ 1.000 dalam 3 bulan                        | Supabase Auth count                          |
| Free-to-Pro Conversion        | 2–5%                                          | Payment records / registered users           |
| Monthly Recurring Revenue     | ≥ Rp 500.000/bulan dalam 6 bulan             | Payment dashboard                            |
| Churn Rate                    | < 10% per bulan                               | Subscription cancellation tracking           |
| Payment Success Rate          | > 95%                                         | Midtrans/Xendit dashboard                    |
| API Key Adoption              | ≥ 10% Pro users generate API key              | Dashboard analytics                          |
| Tasks per Month               | ≥ 10.000 (gate condition for this phase)      | Vercel Analytics                             |

### 13.4 Fase 2 — AI Features

| **Metrik**                    | **Target**                                    | **Measurement**                              |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| AI Feature Adoption           | ≥ 20% Pro users menggunakan AI features       | Feature usage analytics                      |
| AI Accuracy (Indonesia)       | ≥ 90% untuk dokumen Bahasa Indonesia          | Manual sampling + user feedback              |
| Revenue Impact                | +30% MRR dari AI upsell                       | Revenue attribution                          |
| User Satisfaction             | NPS ≥ 40 untuk AI features                    | In-app survey                                |
| Cost per AI Request           | < Rp 500 per request (sustainable)            | API cost monitoring                          |
| AI Processing Time            | < 30 detik (P95)                              | Server metrics                               |

### 13.5 Fase 3 — Indonesia Deep

| **Metrik**                    | **Target**                                    | **Measurement**                              |
|-------------------------------|-----------------------------------------------|----------------------------------------------|
| e-Meterai Transactions        | ≥ 500/bulan dalam 6 bulan                     | Transaction logs                             |
| Template Usage                | ≥ 1.000 downloads/bulan                       | Download tracking                            |
| Enterprise Clients            | ≥ 5 paying enterprise accounts                | CRM                                          |
| Market Position               | Top 3 PDF tool di Indonesia                   | SEO ranking + brand awareness survey         |
| Revenue from e-Meterai        | ≥ Rp 2.000.000/bulan                          | Transaction margin tracking                  |
| Compliance Certification      | PSrE certification obtained                   | Regulatory documentation                     |

---

## 14. Risiko & Mitigasi

### 14.1 Risiko Teknis

| **#** | **Risiko**                                          | **Probabilitas** | **Dampak** | **Label** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|------------------|------------|-----------|---------------------------------------------------------------------------------|
| R01   | OCR accuracy rendah untuk dokumen Indonesia          | Medium           | High       | 🟡        | Evaluasi Tesseract dengan Indonesian language pack; benchmark sebelum launch     |
| R02   | Server overload saat traffic meningkat               | Medium           | High       | 🟢        | Auto-scaling Railway, queue system, client-side processing prioritas            |
| R03   | PDF-to-Word conversion quality tidak konsisten       | High             | Medium     | 🟡        | LibreOffice headless (best quality); expectation management di UI               |
| R04   | AI API cost melebihi revenue                         | Medium           | High       | 🟣        | Strict rate limiting, caching, model optimization, cost monitoring alerts       |
| R05   | Security vulnerability pada file processing          | Low              | Critical   | 🟢        | Input validation, sandboxed processing, regular security audit, file type check |
| R06   | Railway free tier insufficient untuk Phase 2C        | High             | High       | 🟡        | VPS migration ke HostData.id sebagai inisiatif terpisah                         |
| R07   | LibreOffice headless container size terlalu besar    | Medium           | Medium     | 🟡        | Multi-stage Docker build, minimal install, atau dedicated conversion service    |

### 14.2 Risiko Bisnis

| **#** | **Risiko**                                          | **Probabilitas** | **Dampak** | **Label** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|------------------|------------|-----------|---------------------------------------------------------------------------------|
| R08   | Kompetitor lokal muncul dengan fitur serupa          | Medium           | Medium     | 🔵        | First-mover advantage, rapid iteration, Indonesia-deep features sebagai moat    |
| R09   | Willingness to pay rendah di pasar Indonesia         | Medium           | High       | 🔵        | Pricing sangat rendah (Rp 19.900), freemium generous, validate sebelum invest   |
| R10   | Solo developer bottleneck                            | Low              | Medium     | 🟢        | 100% AI-driven development, modular architecture untuk scaling                  |
| R11   | Regulasi e-Meterai berubah                           | Low              | Medium     | 🔴        | Monitor regulasi, partnership dengan aggregator resmi, flexible architecture    |
| R12   | Payment provider issues (Midtrans/Xendit)            | Low              | Medium     | 🟡        | Dual provider setup, fallback mechanism, manual invoice option                  |

### 14.3 Risiko Operasional

| **#** | **Risiko**                                          | **Probabilitas** | **Dampak** | **Label** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|------------------|------------|-----------|---------------------------------------------------------------------------------|
| R13   | Cloudflare R2 downtime                               | Low              | High       | 🟢        | Fallback ke direct download, health monitoring, user notification               |
| R14   | Railway container resource limits                    | Medium           | Medium     | 🟡        | Monitoring resource usage, VPS migration plan (HostData.id)                     |
| R15   | Domain/DNS issues                                    | Low              | High       | 🟢        | DNS redundancy, monitoring, documented recovery procedure                       |
| R16   | Data loss pada file processing                       | Low              | Medium     | 🟢        | Retry mechanism, user notification, idempotent operations                       |
| R17   | Dependency vulnerability (supply chain)              | Medium           | Medium     | 🟢        | Dependabot alerts, regular dependency updates, minimal dependencies             |

---

## 15. Referensi Silang (Cross-References)

### 15.1 Dokumen Terkait

| **ID Dokumen** | **Judul**                              | **Relevansi terhadap Roadmap**                                    |
|----------------|----------------------------------------|-------------------------------------------------------------------|
| PPR-BRD-001    | Business Requirements Document         | Business objectives, functional requirements, success metrics     |
| PPR-PC-001     | Project Charter                        | Scope, deliverables, stakeholders, budget constraints             |
| PPR-PP-001     | Project Plan                           | WBS detail, resource allocation, timeline operasional             |
| PPR-GTM-001    | Go-To-Market Strategy                  | Launch strategy, marketing channels, user acquisition plan        |
| PPR-CLAW-001   | OpenClaw AI Agent                      | Phase 2E spec, 9 autonomous functions, deployment architecture    |
| PPR-ADM-001    | Admin Dashboard Spec                   | Phase 2F spec, 10 admin modules, unified monitoring panel         |

### 15.2 Mapping Roadmap ke Dokumen

| **Fase Roadmap** | **BRD Section**          | **Project Plan Section** | **GTM Section**          |
|------------------|--------------------------|--------------------------|--------------------------|
| MVP 0.1          | §3 Functional Req        | §3 WBS (M01–M11)        | §2 Launch Strategy       |
| MVP 0.2          | §3.2 Future Req          | §3 WBS (M12–M22)        | §3 Growth Strategy       |
| MVP 0.3          | §4 Business Model        | §4 Resource Plan         | §4 Monetization          |
| Fase 2           | §5 Future Vision         | —                        | §5 Expansion             |
| Fase 3           | §5 Future Vision         | —                        | §5 Expansion             |

### 15.3 Traceability

Setiap milestone dalam roadmap ini dapat di-trace ke:
- **Tasks:** PAPYR-001 — PAPYR-089 (MVP 0.1, completed) + tasks TBD (MVP 0.2+)
- **Requirements:** Functional requirements di PPR-BRD-001
- **Test Cases:** Test plan di PPR-TP-001 (untuk fitur yang sudah dirilis)
- **Release Notes:** PPR-RN-001 (untuk versi yang sudah dirilis)

### 15.4 Teknologi Decision Log

| **Keputusan**                          | **Dipilih**                    | **Alternatif yang Ditolak**           | **Alasan**                                                    |
|----------------------------------------|--------------------------------|---------------------------------------|---------------------------------------------------------------|
| PDF encryption/decryption              | PyMuPDF (server-side)          | pdf-lib (client-side)                 | AES-256 support lebih mature di PyMuPDF                       |
| Text watermark                         | pdf-lib (client-side)          | PyMuPDF (server-side)                 | Zero upload, privacy-first untuk operasi ringan               |
| Image watermark                        | PyMuPDF (server-side)          | pdf-lib (client-side)                 | Image overlay rendering lebih reliable di server              |
| Digital signature                      | Canvas + pdf-lib (client-side) | Server-side processing                | Tanda tangan = data sensitif, HARUS client-side               |
| PDF-to-Word conversion                 | LibreOffice headless           | pdf2docx, PyMuPDF+python-docx         | Layout preservation terbaik                                   |
| OCR engine                             | ocrmypdf + Tesseract           | EasyOCR, PaddleOCR                    | Searchable PDF output langsung, Indonesian support, lightweight|
| Table extraction                       | camelot-py + openpyxl          | tabula-py only, pdfplumber            | Best accuracy untuk lattice + stream tables                   |
| Authentication                         | Supabase Auth                  | NextAuth, Firebase Auth               | Sudah standby di stack, PostgreSQL included                   |
| Payment                                | Midtrans/Xendit                | Stripe, PayPal                        | Indonesian payment methods (GoPay, OVO, bank transfer)        |
| Admin Dashboard auth                   | Env-based token (initial)      | NextAuth, Supabase Auth               | Minimal overhead, no user system needed yet; upgrade path to role-based in MVP 0.3 |
| VPS provider (future)                  | HostData.id                    | Contabo, Hetzner                      | Indonesian provider, local support, competitive pricing       |

---

## 16. Persetujuan Dokumen

| **Peran**                    | **Nama**                         | **Tanggal**  | **Status**   |
|------------------------------|----------------------------------|--------------|--------------|
| Product Owner                | Muhammad Fa'iz Zulfikar          | Juli 2025    | Approved     |
| AI Agent                     | OpenCode/Sisyphus                | Juli 2025    | Approved     |

---

*Dokumen ini bersifat rahasia dan hanya untuk penggunaan internal serta keperluan investor. Distribusi tanpa izin tertulis dari Product Owner dilarang.*

*— Akhir Dokumen —*