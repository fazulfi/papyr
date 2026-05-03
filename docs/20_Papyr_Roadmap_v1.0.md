**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Product Roadmap**

Version 3.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Product Roadmap — Papyr                      |
| **ID Dokumen**      | PPR-RM-001                                   |
| **Versi**           | 3.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Juni 2025                                    |
| **Terakhir Diubah** | Mei 2026                                     |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                 |
| **Ditinjau Oleh**   | Product Owner (Muhammad Fa'iz Zulfikar)      |
| **Disetujui Oleh**  | Product Owner                                |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                          |
|-----------|-------------|------------------------------|----------------------------------------------------------------------------------------|
| 1.0       | Juni 2025   | AI Agent (OpenCode/Sisyphus) | Draft awal — Product Roadmap lengkap mencakup MVP 0.1 (completed) hingga Fase 3 (planned) |
| 2.0       | Juli 2025   | AI Agent (OpenCode/Sisyphus) | Major upgrade — Roadmap philosophy & prioritization framework, feature classification labels, sub-phase breakdown MVP 0.2, UI safety rules, detailed per-feature specs, gate conditions diperkuat |
| 2.1       | Juli 2025   | AI Agent (OpenCode/Sisyphus) | Tambah Phase 2E — OpenClaw AI Agent (M21) sebagai sub-fase baru MVP 0.2, 10 fungsi otonom, deployment HostData.id VPS |
| 2.2       | Juli 2025   | AI Agent (OpenCode/Sisyphus) | Tambah Phase 2F — Admin Dashboard (M22) sebagai unified admin panel, renumber milestones |
| 2.3       | Juli 2025   | AI Agent (OpenCode/Sisyphus) | Update Phase 2E — OpenClaw expanded ke 10 fungsi, reporting diperluas, autonomy policy 100% |
| 3.0       | Mei 2026    | AI Agent (OpenCode/Sisyphus) | Complete rewrite — Ekspansi 5 fase ke 7 fase, 114 fitur terklasifikasi, MVP 0.3 Foundation & UX Polish (baru), MVP 0.4 Auth + Monetization (baru), Fase 2-5 expanded, LLM strategy enowxAI + OpenRouter + 9Router |

**Dokumen Terkait**

| **ID Dokumen** | **Judul**                              | **Status**  |
|----------------|----------------------------------------|-------------|
| PPR-BRD-001    | Business Requirements Document — Papyr | Approved    |
| PPR-PC-001     | Project Charter — Papyr                | Approved    |
| PPR-PP-001     | Project Plan — Papyr                   | Approved    |
| PPR-GTM-001    | Go-To-Market Strategy — Papyr          | Approved    |
| PPR-CLAW-001   | OpenClaw AI Agent — Papyr              | Approved    |
| PPR-ADM-001    | Admin Dashboard Spec — Papyr           | Approved    |
| PPR-IB-002     | Implementation Backlog MVP 0.2 — Papyr | Draft       |

---

## Daftar Isi

1. [Filosofi Roadmap & Kerangka Prioritas](#1-filosofi-roadmap--kerangka-prioritas)
2. [Ringkasan Eksekutif](#2-ringkasan-eksekutif)
3. [Visi Produk](#3-visi-produk)
4. [Fase & Timeline](#4-fase--timeline)
5. [Detail MVP 0.1 — Core Tools & Launch (COMPLETED)](#5-detail-mvp-01--core-tools--launch-completed)
6. [UI Safety Rules — Aturan Sebelum Membangun Fitur Baru](#6-ui-safety-rules--aturan-sebelum-membangun-fitur-baru)
7. [Detail MVP 0.2 — Tool Expansion + Infrastructure](#7-detail-mvp-02--tool-expansion--infrastructure)
8. [Detail MVP 0.3 — Foundation & UX Polish](#8-detail-mvp-03--foundation--ux-polish)
9. [Detail MVP 0.4 — Auth + Monetization + API](#9-detail-mvp-04--auth--monetization--api)
10. [Detail Fase 2 — AI Core Features](#10-detail-fase-2--ai-core-features)
11. [Detail Fase 3 — AI Advanced + Integrations](#11-detail-fase-3--ai-advanced--integrations)
12. [Detail Fase 4 — Indonesia Deep + Enterprise](#12-detail-fase-4--indonesia-deep--enterprise)
13. [Detail Fase 5 — Scale + Ecosystem](#13-detail-fase-5--scale--ecosystem)
14. [Yang TIDAK Akan Dibangun](#14-yang-tidak-akan-dibangun)
15. [Prioritas & Dependensi](#15-prioritas--dependensi)
16. [Metrik Keberhasilan per Fase](#16-metrik-keberhasilan-per-fase)
17. [Risiko & Mitigasi](#17-risiko--mitigasi)
18. [Technology Decision Log](#18-technology-decision-log)
19. [Referensi Silang (Cross-References)](#19-referensi-silang-cross-references)
20. [Ringkasan Perubahan v2.3 → v3.0](#20-ringkasan-perubahan-v23--v30)
21. [Proyeksi Biaya Infrastruktur](#21-proyeksi-biaya-infrastruktur-per-fase)
22. [Persetujuan Dokumen](#22-persetujuan-dokumen)
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
| **User Value**     | 40%       | 1-5       | Seberapa besar dampak fitur ini bagi pengguna? Apakah menyelesaikan masalah nyata?                |
| **Strategic Fit**  | 25%       | 1-5       | Seberapa selaras dengan visi "PDF tool #1 Indonesia"? Apakah memperkuat positioning?              |
| **Feasibility**    | 20%       | 1-5       | Seberapa mudah dibangun dengan stack saat ini? Apakah ada risiko teknis tinggi?                   |
| **Revenue Impact** | 15%       | 1-5       | Apakah fitur ini mendorong konversi ke Pro tier atau meningkatkan retention?                      |

**Cara Menghitung Skor Prioritas:**

```
Skor = (User Value x 0.40) + (Strategic Fit x 0.25) + (Feasibility x 0.20) + (Revenue Impact x 0.15)
```

### 1.3 Klasifikasi Label Fitur (Feature Classification)

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
| MVP 0.3     | 16           | 4       | 0            | 2           | 1      | 0          | 23        |
| MVP 0.4     | 7            | 6       | 1            | 3           | 1      | 0          | 18        |
| Fase 2      | 3            | 5       | 0            | 1           | 11     | 2          | 22        |
| Fase 3      | 6            | 8       | 2            | 1           | 4      | 1          | 22        |
| Fase 4      | 3            | 3       | 4            | 1           | 2      | 1          | 14        |
| Fase 5      | 5            | 4       | 0            | 2           | 2      | 1          | 14        |
| **Total**   | **61**       | **33**  | **7**        | **10**      | **21** | **5**      | **137**   |

> **Insight:** 44% fitur adalah 🟢 Buildable — hampir separuh roadmap bisa dieksekusi tanpa blocker eksternal. Total 114 fitur baru tersebar di MVP 0.3 hingga Fase 5.
---

## 2. Ringkasan Eksekutif

Dokumen ini mendefinisikan Product Roadmap resmi untuk Papyr — web application utilitas PDF yang dirancang khusus untuk pasar Indonesia. Roadmap v3.0 mencakup ekspansi dari 5 fase menjadi 7 fase, dengan total 114 fitur terklasifikasi.

**Status Saat Ini:**

- **MVP 0.1** telah selesai sepenuhnya (v1.0.0 + v1.1.0) dengan 11 milestone dan 89 tasks terselesaikan.
- **Papyr live** di [mypapyr.com](https://mypapyr.com) dengan 6 tool aktif: Compress, Merge, Split, Rotate, Image-to-PDF, dan PDF-to-Image.
- **Fase selanjutnya** adalah MVP 0.2 (Tool Expansion + Infrastructure) — gate condition sudah terpenuhi.

**Model Pengembangan:**

Papyr dikembangkan 100% AI-driven — seluruh kode, dokumentasi, dan keputusan arsitektur dihasilkan melalui AI agents (OpenCode/Sisyphus). Marketing dikelola OpenClaw (10 fungsi otonom, 10 persona). Tidak ada tim engineering tradisional.

**Ringkasan Fase:**

| **Fase**    | **Fokus**                          | **Status**       | **Gate**                                                    | **Fitur** | **Milestone**  |
|-------------|------------------------------------|------------------|-------------------------------------------------------------|-----------|----------------|
| MVP 0.1     | Core Tools + Launch                | ✅ Selesai       | —                                                           | 11        | M01-M11        |
| MVP 0.2     | Tool Expansion + Infrastructure    | 🔄 Selanjutnya   | MVP 0.1 live & stabil ✅                                    | 13        | M12-M22        |
| MVP 0.3     | Foundation & UX Polish             | 📋 Direncanakan  | MVP 0.2 semua tool berfungsi + OpenClaw aktif               | 23        | M23-M35        |
| MVP 0.4     | Auth + Monetization + API          | 📋 Direncanakan  | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 MAU                      | 18        | M36-M45        |
| Fase 2      | AI Core Features                   | 🔮 Visi          | MVP 0.4 revenue > Rp 0                                      | 22        | M46-M55        |
| Fase 3      | AI Advanced + Integrations         | 🔮 Visi          | Fase 2 stabil + ≥ 100 AI tasks/hari                         | 22        | M56-M65        |
| Fase 4      | Indonesia Deep + Enterprise        | 🔮 Visi          | Fase 3 stabil + regulatory + partnership MoU                | 14        | M66-M72        |
| Fase 5      | Scale + Ecosystem                  | 🔮 Visi          | Fase 4 stabil + ≥ 50.000 MAU + revenue sustainable         | 14        | M73-M78        |

---

## 3. Visi Produk

### 3.1 Visi Jangka Panjang

> **Menjadi platform utilitas dokumen digital #1 di Indonesia — gratis, cepat, aman, dan cerdas.**

### 3.2 Prinsip Pengembangan

| **Prinsip**            | **Deskripsi**                                                                                                     |
|------------------------|-------------------------------------------------------------------------------------------------------------------|
| Privacy-First          | File diproses lokal bila memungkinkan; server auto-delete 60 menit + 24 jam R2 lifecycle                          |
| Indonesia-First        | UI Bahasa Indonesia default, server dekat Asia, UX kebutuhan lokal                                                |
| Mobile-First           | Didesain untuk 375px primary, bukan desktop-first                                                                 |
| Zero-Friction          | Tanpa login untuk fitur dasar, tanpa paywall, tanpa watermark                                                     |
| Incremental Value      | Setiap fase menambah nilai nyata tanpa merusak yang sudah ada                                                     |
| Sustainable Business   | Gratis untuk kebutuhan dasar, premium untuk fitur lanjutan                                                        |
| AI-Driven Development  | 100% dikembangkan melalui AI agents                                                                               |

### 3.3 Target Pengguna

| **Segmen**             | **Kebutuhan Utama**                                    | **Fase Relevan**              |
|------------------------|--------------------------------------------------------|-------------------------------|
| Mahasiswa              | Compress tugas, merge dokumen, convert gambar          | MVP 0.1 (tersedia)            |
| Pekerja Kantoran       | Merge laporan, split dokumen, watermark, sign          | MVP 0.2                       |
| Freelancer             | Protect PDF, sign kontrak, OCR dokumen scan            | MVP 0.2                       |
| Power User             | Dark mode, keyboard shortcuts, batch processing        | MVP 0.3 + MVP 0.4            |
| UMKM                   | Invoice PDF, e-Meterai, template dokumen               | Fase 4                        |
| Developer              | API access, CLI tool, integrations                     | MVP 0.4 + Fase 5             |
| Enterprise             | Team plan, white-label, compliance                     | Fase 4                        |

### 3.4 Evolusi Produk

```
MVP 0.1        MVP 0.2          MVP 0.3           MVP 0.4          Fase 2           Fase 3           Fase 4           Fase 5
────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────►

[Core Tools] → [Adv. Tools]  → [UX Polish]    → [Monetisasi]  → [AI Core]     → [AI Advanced]  → [Indo Deep]    → [Ecosystem]
 6 tools        +7 tools        +23 features     +18 features    +22 AI feat.    +22 features     +14 features     +14 features
 Free only      Free only       PWA + DX         Login + Pro     AI Analysis     AI Generation    e-Meterai        Bots + CLI
 Zero-login     Zero-login      Zero-login       Optional login  Premium AI      Premium AI       Enterprise       Scale
```

---

## 4. Fase & Timeline

### 4.1 Gate Conditions

| **Transisi**          | **Gate Condition**                                                                                     | **Status**    |
|-----------------------|--------------------------------------------------------------------------------------------------------|---------------|
| MVP 0.1 → MVP 0.2    | MVP 0.1 live & stabil, semua 6 tool berfungsi, zero critical bugs 7 hari                              | ✅ TERPENUHI  |
| MVP 0.2 → MVP 0.3    | MVP 0.2 semua tool berfungsi (13 tools) + OpenClaw aktif stabil 14 hari                                | ⏳ Menunggu   |
| MVP 0.3 → MVP 0.4    | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 MAU (Vercel Analytics)                                              | ⏳ Menunggu   |
| MVP 0.4 → Fase 2     | MVP 0.4 revenue > Rp 0 (minimal 1 paying customer)                                                    | ⏳ Menunggu   |
| Fase 2 → Fase 3      | Fase 2 stabil (zero critical bugs 30 hari) + ≥ 100 AI tasks/hari                                      | ⏳ Menunggu   |
| Fase 3 → Fase 4      | Fase 3 stabil + regulatory assessment selesai + partnership MoU                                        | ⏳ Menunggu   |
| Fase 4 → Fase 5      | Fase 4 stabil + ≥ 50.000 MAU + revenue sustainable (MRR > opex)                                       | ⏳ Menunggu   |

### 4.2 Timeline Visual

| **Fase**    | **Milestone**  | **Deskripsi**                                    | **Status**           |
|-------------|----------------|--------------------------------------------------|----------------------|
| MVP 0.1     | M01-M11        | Core 6 tools + Landing + SEO + Launch            | ✅ Selesai           |
| MVP 0.2     | M12-M22        | 7 tool + cross-cutting + OpenClaw + Admin        | 🔄 Selanjutnya       |
| MVP 0.3     | M23-M35        | Foundation & UX Polish (23 fitur)                | 📋 Direncanakan      |
| MVP 0.4     | M36-M45        | Auth + Monetization + API (18 fitur)             | 📋 Direncanakan      |
| Fase 2      | M46-M55        | AI Core Features (22 fitur)                      | 🔮 Visi              |
| Fase 3      | M56-M65        | AI Advanced + Integrations (22 fitur)            | 🔮 Visi              |
| Fase 4      | M66-M72        | Indonesia Deep + Enterprise (14 fitur)           | 🔮 Visi              |
| Fase 5      | M73-M78        | Scale + Ecosystem (14 fitur)                     | 🔮 Visi              |

### 4.3 Detail Milestone per Fase

#### MVP 0.1 (M01-M11) — COMPLETED

| **#**  | **Milestone**            | **Sub-fase** | **Estimasi** | **Label** | **Status**  |
|--------|--------------------------|--------------|--------------|-----------|-------------|
| M01    | Project Setup            | —            | 10-15 jam    | 🟢        | ✅ Selesai  |
| M02    | Compress PDF             | —            | 15-20 jam    | 🟢        | ✅ Selesai  |
| M03    | Merge PDF                | —            | 10-15 jam    | 🟢        | ✅ Selesai  |
| M04    | Split PDF                | —            | 10-15 jam    | 🟢        | ✅ Selesai  |
| M05    | Image to PDF             | —            | 10-15 jam    | 🟢        | ✅ Selesai  |
| M06    | PDF to Image             | —            | 12-18 jam    | 🟢        | ✅ Selesai  |
| M07    | Landing Page + SEO       | —            | 15-20 jam    | 🟢        | ✅ Selesai  |
| M08    | Analytics                | —            | 5-8 jam      | 🟢        | ✅ Selesai  |
| M09    | Cleanup & Privacy        | —            | 12-15 jam    | 🟢        | ✅ Selesai  |
| M10    | Testing + Launch         | —            | 8-12 jam     | 🟢        | ✅ Selesai  |
| M11    | Rotate PDF               | —            | 5-8 jam      | 🟢        | ✅ Selesai  |

#### MVP 0.2 (M12-M22) — CURRENT

| **#**  | **Milestone**            | **Sub-fase** | **Estimasi** | **Label** | **Status**  |
|--------|--------------------------|--------------|--------------|-----------|-------------|
| M12    | Protect PDF              | Phase 2A     | 8-12 jam     | 🟢        | 📋 Planned  |
| M13    | Unlock PDF               | Phase 2A     | 8-12 jam     | 🟢        | 📋 Planned  |
| M14    | Watermark PDF            | Phase 2B     | 10-15 jam    | 🟢        | 📋 Planned  |
| M15    | Sign PDF                 | Phase 2B     | 15-20 jam    | 🟡        | 📋 Planned  |
| M16    | PDF-to-Word              | Phase 2C     | 15-20 jam    | 🟡        | 📋 Planned  |
| M17    | OCR                      | Phase 2C     | 20-30 jam    | 🟡        | 📋 Planned  |
| M18    | PDF-to-Excel             | Phase 2C     | 15-20 jam    | 🟡        | 📋 Planned  |
| M19-20 | Cross-cutting Quality    | Phase 2D     | 20-30 jam    | 🟢        | 📋 Planned  |
| M21    | OpenClaw AI Agent        | Phase 2E     | 100-140 jam  | 🟡        | 📋 Planned  |
| M22    | Admin Dashboard          | Phase 2F     | 30-40 jam    | 🟢        | 📋 Planned  |

#### MVP 0.3 (M23-M35) — PLANNED

| **#**  | **Milestone**            | **Sub-fase** | **Fitur**                                    | **Label** | **Status**  |
|--------|--------------------------|--------------|----------------------------------------------|-----------|-------------|
| M23    | Critical UX Bundle       | Phase 3A     | i18n, Error Boundary, Progress, Rate Limit   | 🟢        | 📋 Planned  |
| M24-M27| UX Enhancement           | Phase 3B     | Dark Mode, a11y, PDF Preview, Onboarding, Compression | 🟢🟡 | 📋 Planned |
| M28-M30| Performance              | Phase 3C     | PWA, Web Worker, Lazy Load, Image, Prefetch, Edge Cache | 🟢🟡 | 📋 Planned |
| M31-M33| Interaction              | Phase 3D     | DnD, Shortcuts, History, Changelog, Undo     | 🟢🟡     | 📋 Planned  |
| M34-M35| Growth Foundation        | Phase 3E     | Social Proof, Feedback, Recommendation       | 🔵🟣     | 📋 Planned  |

#### MVP 0.4 (M36-M45) — PLANNED

| **#**  | **Milestone**            | **Sub-fase** | **Fitur**                                    | **Label** | **Status**  |
|--------|--------------------------|--------------|----------------------------------------------|-----------|-------------|
| M36    | Auth & Payment           | Phase 4A     | Auth, Paywall, Quota, Payment                | 🟢🟡🔵   | 📋 Planned  |
| M37-M38| API & Pro                | Phase 4B     | API Key, Batch, Share Link, Resumable Upload | 🟢🟡     | 📋 Planned  |
| M39    | Growth & Engagement      | Phase 4C     | Referral, Gamification                       | 🔵🟣     | 📋 Planned  |
| M40-M41| Advanced PDF             | Phase 4D     | Page Reorder, Metadata, Flatten              | 🟢        | 📋 Planned  |
| M42-M45| Admin Upgrades           | Phase 4E     | WebSocket, Heatmap, Cost, Flags, Alerts      | 🟡🔴     | 📋 Planned  |

#### Fase 2 (M46-M55) — VISI

| **#**  | **Milestone**            | **Sub-fase** | **Fitur**                                    | **Label** | **Status**  |
|--------|--------------------------|--------------|----------------------------------------------|-----------|-------------|
| M46-M47| AI Intelligence          | F2A          | Summarizer, Chat, Extract, Table, Classify   | 🟣        | 🔮 Visi    |
| M48-M50| AI Enhancement           | F2B          | Smart Compress, Rotate, Deskew, BG Remove, etc | 🟣🟡   | 🔮 Visi    |
| M51    | AI Automation            | F2C          | Workflow Builder                             | ⚪        | 🔮 Visi    |
| M52-M55| AI OpenClaw Upgrades     | F2D          | Support Bot, Localization, Calendar, etc     | 🟢🟡🔵   | 🔮 Visi    |

#### Fase 3 (M56-M65) — VISI

| **#**  | **Milestone**            | **Sub-fase** | **Fitur**                                    | **Label** | **Status**  |
|--------|--------------------------|--------------|----------------------------------------------|-----------|-------------|
| M56-M57| AI Intelligence Advanced | F3A          | Translation, Invoice, Resume, Legal          | 🟣🟡     | 🔮 Visi    |
| M58-M59| AI Content Generation    | F3B          | PDF Gen, Report, Certificate, Cover, etc     | 🟡🟢     | 🔮 Visi    |
| M60    | AI Automation Advanced   | F3C          | Batch, Template Match, Comparison            | 🟣🟡     | 🔮 Visi    |
| M61-M62| Advanced PDF             | F3D          | Comparison, Form Fill, Annotation, Redact, PDF/A | 🟢🔴 | 🔮 Visi    |
| M63-M65| Integrations             | F3E          | Google Drive, Dropbox, Zapier, Extension     | 🟢🟡⚪   | 🔮 Visi    |

#### Fase 4 (M66-M72) — VISI

| **#**  | **Milestone**            | **Sub-fase** | **Fitur**                                    | **Label** | **Status**  |
|--------|--------------------------|--------------|----------------------------------------------|-----------|-------------|
| M66-M67| Indonesia-Specific AI    | F4A          | e-Meterai, KTP, NPWP, Surat, Akta, Bilingual | 🔴🟣🟢 | 🔮 Visi    |
| M68-M69| Enterprise               | F4B          | Team Plan, White-label, Invoice Generator    | 🟡🟢     | 🔮 Visi    |
| M70    | Admin Advanced           | F4C          | Geographic, A/B Testing, SEO Dashboard       | 🟡🔴     | 🔮 Visi    |
| M71-M72| OpenClaw Advanced        | F4D          | Auto-Scaling, Bug Predictor                  | 🟣⚪     | 🔮 Visi    |

#### Fase 5 (M73-M78) — VISI

| **#**  | **Milestone**            | **Sub-fase** | **Fitur**                                    | **Label** | **Status**  |
|--------|--------------------------|--------------|----------------------------------------------|-----------|-------------|
| M73    | Messaging Bots           | F5A          | WhatsApp Bot, Telegram Bot                   | 🟡        | 🔮 Visi    |
| M74    | Developer Tools          | F5B          | CLI, Email Processor, Scheduled Processing   | 🟢🟣🟡   | 🔮 Visi    |
| M75-M76| OpenClaw Ecosystem       | F5C          | Newsletter, Status, Link Building, Pricing, Perf | 🟢🟣🔵 | 🔮 Visi |
| M77-M78| Growth                   | F5D          | Affiliate, Community, Haptic, Voice          | 🔵🟢🟡   | 🔮 Visi    |

---

## 5. Detail MVP 0.1 — Core Tools & Launch (COMPLETED)

### 5.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Versi Rilis**        | v1.0.0 (M01-M10) + v1.1.0 (M11)                             |
| **Status**             | ✅ COMPLETED                                                  |
| **Total Milestone**    | 11 milestone (M01-M11)                                       |
| **Total Tasks**        | 89 tasks (PAPYR-001 — PAPYR-089)                             |
| **Tools Delivered**    | 6 (Compress, Merge, Split, Image-to-PDF, PDF-to-Image, Rotate) |
| **URL Produksi**       | [mypapyr.com](https://mypapyr.com)                           |
| **Label**              | 🟢 Buildable (semua 11 milestone)                            |

### 5.2 Breakdown per Milestone

| **Milestone** | **Scope**                                                                 | **Tasks**            | **Deliverables**                                      |
|---------------|---------------------------------------------------------------------------|----------------------|-------------------------------------------------------|
| M01           | Repository setup, infrastruktur, deployment pipeline                      | PAPYR-001 — 010B     | Repo, CI/CD, Vercel + Railway deploy                  |
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

### 5.3 Arsitektur

| **Layer**          | **Teknologi**                                    | **Keterangan**                                                    |
|--------------------|--------------------------------------------------|-------------------------------------------------------------------|
| **Frontend**       | Next.js 16 + TypeScript + Tailwind v4            | Deployed di Vercel (Edge/Global CDN)                              |
| **Backend**        | FastAPI + Python 3.11 + PyMuPDF + Ghostscript    | Deployed di Railway (us-west2 container)                          |
| **Storage**        | Cloudflare R2                                    | Signed URLs, auto-delete 60 menit + 24 jam lifecycle              |
| **Processing**     | Hybrid client/server                             | Client (pdf-lib) Merge/Split/Rotate, Server Compress/PDF-to-Image |
| **Analytics**      | Vercel Analytics + Speed Insights                | Custom events: task_started, task_completed, task_failed          |
| **Domain**         | mypapyr.com (Hostinger DNS)                      | SSL via Vercel                                                    |
| **Biaya**          | $0-5/bulan                                       | Vercel Free + Railway Free + R2 Free Tier                         |

---

## 6. UI Safety Rules — Aturan Sebelum Membangun Fitur Baru

| **#**  | **Rule**                                    | **Detail**                                                                                                                                                |
|--------|---------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **R1** | Navbar tetap sama                           | Tidak ada nav item baru. Semua tool baru masuk ke grid di landing page. Navbar: Logo, "Alat PDF", hamburger mobile.                                       |
| **R2** | Setiap tool baru ikuti template             | PDFUploader component → processing → download. Tidak ada UI pattern baru tanpa persetujuan.                                                               |
| **R3** | Mobile-first dipertahankan                  | Primary breakpoint 375px. Test di 375px sebelum merge. Desktop adalah bonus.                                                                              |
| **R4** | Performance budget                          | Max 50KB JS gzipped per tool page. dynamic() untuk komponen berat. Lazy load semua yang bisa.                                                             |
| **R5** | 6 tool existing TIDAK BOLEH berubah         | Behavior, UI, output HARUS identik. Zero regression.                                                                                                      |
| **R6** | Design language yang sama                   | Tailwind v4 tokens, DM Sans font, existing color palette. Tidak ada perubahan tanpa persetujuan.                                                          |
| **R7** | Landing page grid auto-expand               | Grid otomatis menyesuaikan. Tidak ada hardcoded count. Urutan: existing 6 dulu.                                                                           |
| **R8** | Privacy notice di setiap halaman tool       | "File otomatis dihapus dalam 60 menit" atau "Diproses di browser Anda — file tidak diunggah".                                                             |
| **R9** | Error states ikuti pattern                  | Auto-retry 1x. Pesan Bahasa Indonesia. "Gagal memproses file. Silakan coba lagi."                                                                        |
| **R10**| Regression testing — CI harus pass          | Setiap PR pass CI. E2E tests untuk 6 tool existing harus pass.                                                                                            |

> **Prinsip Utama:** Fitur baru adalah *additive* — menambah tanpa mengubah.

---

## 7. Detail MVP 0.2 — Tool Expansion + Infrastructure

### 7.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 🔄 NEXT — Selanjutnya dikerjakan                             |
| **Gate Condition**     | MVP 0.1 live & stabil ✅ TERPENUHI                           |
| **Total Milestone**    | M12-M18 (tools) + 2D (quality) + 2E (OpenClaw) + 2F (Admin) |
| **Estimasi Total**     | 261-369 jam                                                   |
| **Hasil Akhir**        | 13 tools total + autonomous ops + unified admin               |

### 7.2 Struktur Sub-fase

MVP 0.2 dibagi menjadi 6 sub-fase yang dieksekusi secara sequential:

| **Sub-fase** | **Milestone** | **Fitur**                                    | **Label** | **Estimasi**    |
|--------------|---------------|----------------------------------------------|-----------|-----------------|
| Phase 2A     | M12, M13      | Protect PDF, Unlock PDF                      | 🟢🟢     | 16-24 jam       |
| Phase 2B     | M14, M15      | Watermark PDF, Sign PDF                      | 🟢🟡     | 25-35 jam       |
| Phase 2C     | M16, M17, M18 | PDF-to-Word, OCR, PDF-to-Excel              | 🟡🟡🟡   | 50-70 jam       |
| Phase 2D     | M19, M20      | E2E Testing, Formatting, Perf, Monitoring, SEO, Analytics | 🟢🟢 | 20-30 jam |
| Phase 2E     | M21           | OpenClaw AI Agent (10 fungsi otonom)         | 🟡        | 100-140 jam     |
| Phase 2F     | M22           | Admin Dashboard (10 modul)                   | 🟢        | 30-40 jam       |

### 7.3 Phase 2A — Security Tools (M12 + M13) 🟢

#### M12 — Protect PDF (Password Protection)

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Menambahkan password protection (enkripsi AES-256) ke file PDF                                                 |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Processing Strategy**| Server-side (PyMuPDF encryption)                                                                              |
| **Library**            | PyMuPDF (`fitz`) — `doc.save(encryption=fitz.PDF_ENCRYPT_AES_256)`                                           |
| **Route**              | `/protect`                                                                                                    |
| **Estimasi**           | 8-12 jam                                                                                                      |

**Acceptance Criteria:**
- Upload PDF + set password (min 4 karakter, konfirmasi 2x)
- Output terenkripsi AES-256
- PDF sudah terproteksi → ditolak dengan pesan jelas
- File auto-delete 60 menit
- Mobile-first 375px, JS < 50KB gzipped

#### M13 — Unlock PDF (Remove Password)

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Menghapus password dari PDF terproteksi (user harus tahu password)                                             |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Processing Strategy**| Server-side (PyMuPDF decryption)                                                                              |
| **Library**            | PyMuPDF (`fitz`) — `doc.authenticate(password)` + `doc.save()` tanpa encryption                              |
| **Route**              | `/unlock`                                                                                                     |
| **Estimasi**           | 8-12 jam                                                                                                      |

**Acceptance Criteria:**
- Upload PDF terproteksi + input password
- Password benar → decrypt + download tanpa password
- Password salah → error "Password salah. Silakan coba lagi."
- PDF tidak terproteksi → ditolak
- File auto-delete 60 menit

### 7.4 Phase 2B — Document Enhancement (M14 + M15) 🟢/🟡

#### M14 — Watermark PDF 🟢

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Menambahkan watermark (teks atau gambar) ke semua halaman PDF                                                  |
| **Label**              | 🟢 Buildable                                                                                                 |
| **Processing Strategy**| Hybrid — Client (pdf-lib) untuk text, Server (PyMuPDF) untuk image                                           |
| **Route**              | `/watermark`                                                                                                  |
| **Estimasi**           | 10-15 jam                                                                                                     |

**Acceptance Criteria:**
- Text watermark: teks, font size, opacity (10-100%), rotasi, posisi (center/corners/diagonal)
- Image watermark: upload PNG/JPG, opacity, posisi, ukuran
- Diterapkan ke SEMUA halaman
- Text = client-side (zero upload), Image = server-side
- Preview sebelum apply

#### M15 — Sign PDF 🟡

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Tanda tangan visual (draw canvas atau upload gambar) di posisi tertentu                                        |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| Client-side (HTML5 Canvas + pdf-lib)                                                                          |
| **Route**              | `/sign`                                                                                                       |
| **Estimasi**           | 15-20 jam                                                                                                     |

**Acceptance Criteria:**
- Draw tanda tangan (mouse + touch)
- Upload gambar tanda tangan
- Drag-to-place + resize di halaman PDF
- Seluruh proses client-side (privacy-first)
- Canvas + drag berfungsi mobile touch
- Ini visual signature, BUKAN cryptographic digital signature

### 7.5 Phase 2C — Document Conversion (M16 + M17 + M18) 🟡

#### M16 — PDF-to-Word 🟡

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Konversi PDF ke .docx dengan layout terjaga                                                                    |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| Server-side (LibreOffice headless)                                                                            |
| **Route**              | `/pdf-to-word`                                                                                                |
| **Estimasi**           | 15-20 jam                                                                                                     |

**Acceptance Criteria:**
- Output .docx bisa dibuka di Word/Google Docs
- Layout terjaga (paragraf, heading, list)
- Tabel terkonversi (bukan gambar)
- Processing < 30 detik untuk ≤ 20 halaman
- Scanned PDF → suggest OCR terlebih dahulu

#### M17 — OCR 🟡

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Ekstraksi teks dari scanned PDF → searchable PDF                                                               |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| Server-side (ocrmypdf + Tesseract + Indonesian language pack)                                                 |
| **Route**              | `/ocr`                                                                                                        |
| **Estimasi**           | 20-30 jam                                                                                                     |

**Acceptance Criteria:**
- Output searchable PDF (teks bisa di-select/search)
- Akurasi ≥ 90% Bahasa Indonesia, ≥ 85% English
- Pilih bahasa: Indonesia, English, Auto-detect
- Processing < 60 detik untuk ≤ 10 halaman
- PDF sudah searchable → pesan informatif

#### M18 — PDF-to-Excel 🟡

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Ekstraksi tabel dari PDF ke .xlsx                                                                              |
| **Label**              | 🟡 Hard                                                                                                      |
| **Processing Strategy**| Server-side (camelot-py lattice+stream + openpyxl)                                                            |
| **Route**              | `/pdf-to-excel`                                                                                               |
| **Estimasi**           | 15-20 jam                                                                                                     |

**Acceptance Criteria:**
- Output .xlsx bisa dibuka di Excel/Google Sheets
- Bordered tables ≥ 90% akurasi
- Borderless tables ≥ 70% akurasi
- Multi-table → multi-sheet
- Preview tabel terdeteksi sebelum konversi
- PDF tanpa tabel → pesan informatif

### 7.6 Phase 2D — Cross-cutting Quality 🟢

| **Item**                    | **Deskripsi**                                                    | **Estimasi** |
|-----------------------------|------------------------------------------------------------------|--------------|
| E2E Testing (Playwright)    | 2 tests per tool (happy path + error) = 26 tests. CI integration.| 8-12 jam     |
| Code Formatting             | Prettier (frontend) + Ruff (backend). Pre-commit hooks. CI check.| 3-5 jam      |
| Performance Optimization    | Lighthouse ≥ 90 semua halaman. Bundle < 50KB. dynamic() imports. | 3-5 jam      |
| Monitoring & Alerting       | Uptime monitoring + Telegram alerts < 5 menit saat downtime.     | 2-3 jam      |
| SEO Update                  | Meta tags, sitemap 13+ URLs, OG images, JSON-LD per tool baru.   | 3-5 jam      |
| Analytics Update            | Event tracking (started/completed/failed) untuk 7 tool baru.     | 1-2 jam      |

### 7.7 Phase 2E — OpenClaw AI Agent (M21) 🟡

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | 10 fungsi otonom: SEO, Competitor, Health, Security, Reporting, Self-Improvement, PM, Backup, Analytics, Social Media |
| **Deployment**         | HostData.id VPS (dedicated)                                                                                   |
| **Stack**              | Node.js 20 + TypeScript + BullMQ + Redis + PostgreSQL + Docker                                               |
| **LLM Provider**       | enowxAI API                                                                                                   |
| **Komunikasi**         | Telegram Bot + Email (Resend) + Dashboard + Twitter/X                                                         |
| **Estimasi**           | 100-140 jam                                                                                                   |

**10 Fungsi Agent:**

| **#** | **Fungsi**              | **Persona** | **Jadwal**        |
|-------|-------------------------|-------------|-------------------|
| 1     | SEO Pipeline            | Aksara      | 2-4 artikel/minggu|
| 2     | Competitor Monitoring   | Telik       | Mingguan          |
| 3     | Server Health           | Jaga        | Setiap 60 detik   |
| 4     | Security Scanning       | Tameng      | Harian + Mingguan |
| 5     | Reporting               | Warta       | Harian/Mingguan   |
| 6     | Self-Improvement        | Lontar      | Mingguan          |
| 7     | Project Management      | Dalang      | Harian            |
| 8     | Backup & Verify         | Pustaka     | Harian + Mingguan |
| 9     | Analytics Intelligence  | Prasasti    | Mingguan          |
| 10    | Social Media (Twitter)  | Kicau       | Harian            |

### 7.8 Phase 2F — Admin Dashboard (M22) 🟢

| **Atribut**            | **Detail**                                                                                                    |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| **Deskripsi**          | Unified admin panel `/admin` dengan 10 modul monitoring                                                       |
| **Auth**               | Env-based token (ADMIN_SECRET) — upgrade ke role-based saat MVP 0.4                                          |
| **Route**              | `/admin/*` (same Next.js app)                                                                                 |
| **Estimasi**           | 30-40 jam                                                                                                     |

**10 Modul:**

| **#** | **Modul**                    | **Deskripsi**                                                    |
|-------|------------------------------|------------------------------------------------------------------|
| 1     | OpenClaw Monitoring          | Status 10 agent, logs, manual override, Twitter analytics        |
| 2     | Analytics Overview           | Traffic, tasks, tool usage, device breakdown, trends             |
| 3     | Server Health                | Railway uptime, Vercel status, R2 usage, response times          |
| 4     | Security Scan Results        | Dependency audit, CVE alerts, scan history                       |
| 5     | SEO & Competitor Intel       | Rankings, competitor changes, content pipeline                   |
| 6     | Revenue/Billing (Placeholder)| Aktif saat MVP 0.4                                               |
| 7     | System Logs & Errors         | Error logs, rate limit hits, failed tasks                        |
| 8     | Backup Status                | Backup status, restore history, storage usage                    |
| 9     | User Management (Placeholder)| Aktif saat MVP 0.4                                               |
| 10    | Settings                     | System config, notification preferences, API keys                |

### 7.9 Rilis Incremental

- Phase 2A selesai → deploy (8 tools live)
- Phase 2B selesai → deploy (10 tools live)
- Phase 2C selesai → deploy (13 tools live)
- Phase 2D selesai → deploy (quality hardened)
- Phase 2E selesai → deploy OpenClaw (autonomous operations active)
- Phase 2F selesai → deploy Admin Dashboard (unified monitoring active)

---

## 8. Detail MVP 0.3 — Foundation & UX Polish

### 8.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 📋 PLANNED                                                   |
| **Gate Condition**     | MVP 0.2 semua tool berfungsi + OpenClaw aktif dan stabil      |
| **Total Fitur**        | 23 fitur dalam 5 sub-fase                                    |
| **Milestone**          | M23-M35                                                       |
| **Estimasi Total**     | 135-185 jam                                                   |

### 8.2 Phase 3A — Critical UX (4 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 1     | i18n English                 | Dukungan bahasa Inggris sebagai opsi kedua. Toggle footer (ID/EN). Semua string UI bilingual. ID tetap default. Preferensi localStorage. SEO metadata EN untuk /en/* routes. | Client (next-intl) | 🟢 |
| 2     | Error Boundary + Offline     | React Error Boundary graceful crash handling. Offline detection banner. Client-side tools tetap offline. Server tools pesan jelas saat offline. | Client (React + SW) | 🟢 |
| 3     | Progress Indicator           | Progress bar real-time semua tools. Persentase upload, estimasi waktu, progress per halaman client-side. Smooth animation tanpa layout shift. | Client (XHR progress) | 🟢 |
| 4     | Rate Limit Feedback 429      | UI feedback HTTP 429. Countdown timer Retry-After. Tombol disabled cooldown. Auto-retry opsional setelah cooldown. | Client (interceptor) | 🟢 |

**Acceptance Criteria Phase 3A (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| i18n English | AC1 | Toggle bahasa di footer (ID/EN) | Functional |
| i18n English | AC2 | Bahasa Indonesia tetap default | Functional |
| i18n English | AC3 | Semua string UI + error messages tersedia EN | Functional |
| i18n English | AC4 | SEO metadata EN untuk /en/* routes | SEO |
| i18n English | AC5 | Preferensi disimpan localStorage | UX |
| Error Boundary | AC1 | Error boundary menangkap crash, fallback UI Bahasa Indonesia | Functional |
| Error Boundary | AC2 | Offline banner: "Anda sedang offline" | Functional |
| Error Boundary | AC3 | Client-side tools (Merge, Split, Rotate) tetap offline | Functional |
| Error Boundary | AC4 | Server-side tools pesan jelas saat offline | UX |
| Progress | AC1 | Persentase upload untuk server-side tools | Functional |
| Progress | AC2 | Estimasi waktu tersisa untuk file > 5MB | UX |
| Progress | AC3 | Progress per halaman untuk client-side | Functional |
| Progress | AC4 | Animasi smooth, zero layout shift | UI |
| Rate Limit 429 | AC1 | Pesan "Terlalu banyak permintaan. Coba lagi dalam X detik." | Functional |
| Rate Limit 429 | AC2 | Countdown real-time berdasarkan Retry-After header | UX |
| Rate Limit 429 | AC3 | Tombol submit disabled selama cooldown | UX |
| Rate Limit 429 | AC4 | Auto-retry opsional setelah cooldown | Functional |

### 8.3 Phase 3B — UX Enhancement (5 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 5     | Dark Mode                    | Mode gelap prefers-color-scheme + toggle manual (system/light/dark). Semua halaman. localStorage. Zero FOUC. | Client (Tailwind dark:) | 🟢 |
| 6     | Accessibility (a11y)         | Audit menyeluruh. ARIA labels, keyboard nav, focus management, screen reader, WCAG 2.1 AA contrast. | Client (semantic HTML) | 🟢 |
| 7     | PDF Preview (pdf.js)         | Preview sebelum/sesudah processing. Thumbnail input, full preview output. Lazy loaded dynamic(). Mobile pinch-to-zoom. | Client (pdf.js lazy) | 🟡 |
| 8     | Onboarding Tour              | Tour interaktif first-time visitors. 3-5 langkah. Muncul sekali (localStorage). Skip button. Re-accessible footer. | Client (custom) | 🟢 |
| 9     | Compression Comparison       | Visual perbandingan ukuran before/after. Bar chart, persentase, pesan "Anda menghemat 3.2 MB (64%)". | Client (UI) | 🟢 |

**Acceptance Criteria Phase 3B (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| Dark Mode | AC1 | Mengikuti prefers-color-scheme default | Functional |
| Dark Mode | AC2 | Toggle manual: system/light/dark | Functional |
| Dark Mode | AC3 | Semua halaman tool + landing + komponen support | Functional |
| Dark Mode | AC4 | Preferensi localStorage | UX |
| Dark Mode | AC5 | Zero FOUC (flash of unstyled content) | Performance |
| Accessibility | AC1 | Lighthouse Accessibility ≥ 95 semua halaman | Quality |
| Accessibility | AC2 | Semua interactive elements ARIA labels deskriptif | Functional |
| Accessibility | AC3 | Keyboard navigation end-to-end (tab, enter, escape) | Functional |
| Accessibility | AC4 | Focus visible + focus trap pada modals | Functional |
| Accessibility | AC5 | Contrast ratio WCAG 2.1 AA (4.5:1 teks normal) | Quality |
| PDF Preview | AC1 | Preview input: thumbnail per halaman | Functional |
| PDF Preview | AC2 | Preview output: sebelum download | Functional |
| PDF Preview | AC3 | pdf.js lazy loaded via dynamic() | Performance |
| PDF Preview | AC4 | Mobile pinch-to-zoom berfungsi | UX |
| Onboarding | AC1 | Auto-show first-time visitors (localStorage flag) | Functional |
| Onboarding | AC2 | 3-5 langkah: grid, upload, privacy, download | UX |
| Onboarding | AC3 | Skip button setiap langkah | UX |
| Onboarding | AC4 | Re-accessible dari footer "Tur Fitur" | Functional |
| Compression Comparison | AC1 | Menampilkan ukuran asli, hasil, persentase | Functional |
| Compression Comparison | AC2 | Visual bar chart before/after | UX |
| Compression Comparison | AC3 | Pesan "Anda menghemat X MB (Y%)" | UX |

### 8.4 Phase 3C — Performance (6 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 10    | PWA Support                  | Installable, offline-capable. Manifest, Service Worker caching, "Add to Home Screen". Client tools offline post-install. | Client (SW + Manifest) | 🟢 |
| 11    | Web Worker Processing        | pdf-lib di Web Worker. Main thread tidak blocked. Progress via postMessage. Fallback main thread. | Client (Web Worker) | 🟡 |
| 12    | Lazy Loading Tools           | Lazy loading semua tool pages. Landing initial JS < 30KB gzipped. Loading skeleton. | Client (dynamic imports) | 🟢 |
| 13    | Image Optimization           | Semua gambar next/image. WebP/AVIF. Lazy below-fold. Total image landing < 200KB. | Build + Client | 🟢 |
| 14    | Prefetch on Hover            | Prefetch tool page saat hover grid. Navigasi < 100ms post-prefetch. Desktop only. | Client (Next.js Link) | 🟢 |
| 15    | Edge Caching (Cloudflare)    | Edge caching static + API cacheable. Cache-hit > 80%. TTFB < 200ms Indonesia. Auto-invalidation deploy. | Infrastructure (CF) | 🟢 |

**Acceptance Criteria Phase 3C (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| PWA Support | AC1 | Web App Manifest terkonfigurasi (name, icons, theme_color, standalone) | Functional |
| PWA Support | AC2 | Service Worker caching static assets + client tool pages | Functional |
| PWA Support | AC3 | "Add to Home Screen" prompt di mobile browsers | UX |
| PWA Support | AC4 | Client-side tools offline setelah install | Functional |
| PWA Support | AC5 | Lighthouse PWA score ≥ 90 | Quality |
| Web Worker | AC1 | pdf-lib operations (merge, split, rotate) di Web Worker | Functional |
| Web Worker | AC2 | Main thread tidak blocked, UI responsif | Performance |
| Web Worker | AC3 | Progress communication via postMessage | Functional |
| Web Worker | AC4 | Fallback ke main thread jika Worker unavailable | Compatibility |
| Lazy Loading | AC1 | dynamic() untuk semua komponen berat | Performance |
| Lazy Loading | AC2 | Landing page initial JS < 30KB gzipped | Performance |
| Lazy Loading | AC3 | Tool page JS < 50KB gzipped (R4) | Performance |
| Lazy Loading | AC4 | Loading skeleton selama lazy load | UX |
| Image Optimization | AC1 | Semua gambar via next/image | Performance |
| Image Optimization | AC2 | WebP/AVIF served untuk supporting browsers | Performance |
| Image Optimization | AC3 | Lazy loading below-the-fold images | Performance |
| Image Optimization | AC4 | Total image payload landing < 200KB | Performance |
| Prefetch on Hover | AC1 | Hover tool card memicu prefetch | Performance |
| Prefetch on Hover | AC2 | Navigasi < 100ms post-prefetch | Performance |
| Prefetch on Hover | AC3 | Desktop only (tidak aktif mobile) | UX |
| Edge Caching | AC1 | Static assets cached di Cloudflare edge | Performance |
| Edge Caching | AC2 | Cache-hit ratio > 80% | Performance |
| Edge Caching | AC3 | TTFB < 200ms dari Indonesia | Performance |
| Edge Caching | AC4 | Cache invalidation otomatis saat deploy | Reliability |

### 8.5 Phase 3D — Interaction (5 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 16    | Drag & Drop Global           | Drop file dari desktop ke manapun di halaman tool. Visual overlay drag-over. Multi-file. Mobile tetap tap. | Client (HTML5 DnD) | 🟢 |
| 17    | Keyboard Shortcuts           | Ctrl+U upload, Ctrl+Enter process, Ctrl+D download, Ctrl+/ help. Discoverable tooltip. No browser conflict. | Client (event listeners) | 🟢 |
| 18    | File History (localStorage)  | Riwayat file diproses (nama, tool, tanggal, ukuran). Max 50 FIFO. Clear button. Tidak simpan file content. | Client (localStorage) | 🟢 |
| 19    | Changelog Page (/changelog)  | Halaman publik riwayat perubahan. Badge "Baru" < 7 hari. SEO-friendly. Footer link. | Static (MDX) | 🟢 |
| 20    | Undo/Redo                    | Undo/redo client-side ops (merge reorder, split selection, rotate). Command pattern. Max 20 history. Ctrl+Z/Y. | Client (command pattern) | 🟡 |

**Acceptance Criteria Phase 3D (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| Drag & Drop Global | AC1 | Drop zone mencakup seluruh halaman tool | Functional |
| Drag & Drop Global | AC2 | Visual overlay saat file di-drag over | UX |
| Drag & Drop Global | AC3 | Multi-file drop support | Functional |
| Drag & Drop Global | AC4 | File type validation on drop | Validation |
| Drag & Drop Global | AC5 | Mobile: tetap tap-to-upload (no drag) | UX |
| Keyboard Shortcuts | AC1 | Ctrl+U upload, Ctrl+Enter process, Ctrl+D download | Functional |
| Keyboard Shortcuts | AC2 | Ctrl+/ show shortcuts help | Functional |
| Keyboard Shortcuts | AC3 | Tidak conflict dengan browser shortcuts | Compatibility |
| Keyboard Shortcuts | AC4 | Discoverable via tooltip | UX |
| Keyboard Shortcuts | AC5 | Disabled saat input/textarea focused | UX |
| File History | AC1 | Menyimpan metadata: nama, tool, tanggal, ukuran before/after | Functional |
| File History | AC2 | Max 50 entries FIFO | Constraint |
| File History | AC3 | Clear button tersedia | UX |
| File History | AC4 | Accessible dari menu/sidebar | UX |
| File History | AC5 | TIDAK menyimpan file content (privacy) | Privacy |
| Changelog | AC1 | Route /changelog accessible | Functional |
| Changelog | AC2 | Entries kronologis (terbaru di atas) | UX |
| Changelog | AC3 | Badge "Baru" untuk fitur < 7 hari | UX |
| Changelog | AC4 | SEO-friendly (meta tags, structured data) | SEO |
| Changelog | AC5 | Link dari footer | Navigation |
| Undo/Redo | AC1 | Undo/redo untuk merge reorder | Functional |
| Undo/Redo | AC2 | Undo/redo untuk split page selection | Functional |
| Undo/Redo | AC3 | Undo/redo untuk rotate | Functional |
| Undo/Redo | AC4 | Ctrl+Z (undo) dan Ctrl+Y (redo) | Functional |
| Undo/Redo | AC5 | Visual feedback saat undo/redo | UX |
| Undo/Redo | AC6 | Max 20 history entries | Constraint |

### 8.6 Phase 3E — Growth Foundation (3 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 21    | Social Proof Widget          | Counter total tasks processed di landing ("12.345 file telah diproses"). Update 1 jam. Format angka Indonesia. Animasi count-up. | Server + Client | 🔵 |
| 22    | User Feedback Widget         | Thumbs up/down setelah task selesai + optional text (max 200 char). Non-blocking. Max 1x/session. Data stored. | Client + Server | 🔵 |
| 23    | Tool Recommendation          | Rekomendasi 1-2 tool terkait post-processing. Rule-based (compress→merge, split→rotate). Click tracking. Non-intrusive. | Client (rule-based) | 🟣 |

**Acceptance Criteria Phase 3E (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| Social Proof Widget | AC1 | Counter total tasks processed di landing page | Functional |
| Social Proof Widget | AC2 | Update periodik setiap 1 jam | Functional |
| Social Proof Widget | AC3 | Format angka Indonesia (titik separator ribuan) | UX |
| Social Proof Widget | AC4 | Animasi count-up saat element visible (intersection observer) | UX |
| Social Proof Widget | AC5 | Fallback static number jika API gagal | Reliability |
| User Feedback Widget | AC1 | Muncul setelah task selesai (non-blocking, tidak menutupi download) | UX |
| User Feedback Widget | AC2 | Thumbs up/down sebagai primary input | Functional |
| User Feedback Widget | AC3 | Optional text feedback max 200 karakter | Functional |
| User Feedback Widget | AC4 | Max 1x per session (tidak spam) | UX |
| User Feedback Widget | AC5 | Data tersimpan untuk product improvement | Analytics |
| User Feedback Widget | AC6 | Dismissable (X button) | UX |
| Tool Recommendation | AC1 | Rekomendasi 1-2 tool terkait setelah processing selesai | Functional |
| Tool Recommendation | AC2 | Rule-based: compress→merge, split→rotate, merge→compress | Logic |
| Tool Recommendation | AC3 | Click-through tracking (analytics event) | Analytics |
| Tool Recommendation | AC4 | Tidak mengganggu download flow (below download button) | UX |
| Tool Recommendation | AC5 | Dismissable, tidak muncul jika user sudah dismiss 3x | UX |

### 8.8 Estimasi Effort per Sub-fase MVP 0.3

| **Sub-fase** | **Fitur** | **Estimasi Min** | **Estimasi Max** | **Kompleksitas** |
|--------------|-----------|------------------|------------------|------------------|
| Phase 3A     | 4 fitur   | 21 jam           | 33 jam           | Low-Medium       |
| Phase 3B     | 5 fitur   | 34 jam           | 52 jam           | Medium           |
| Phase 3C     | 6 fitur   | 28 jam           | 43 jam           | Medium           |
| Phase 3D     | 5 fitur   | 25 jam           | 38 jam           | Medium-High      |
| Phase 3E     | 3 fitur   | 15 jam           | 23 jam           | Low-Medium       |
| **Total**    | **23**    | **123 jam**      | **189 jam**      | —                |

### 8.9 Dependensi Internal MVP 0.3

```
Phase 3A (Critical UX) ──────────────────────────────────────────────────────────────
    │                                                                                 
    ├──► Phase 3B (UX Enhancement) ── depends on: i18n strings ready                 
    │         │                                                                       
    │         └──► Phase 3E (Growth) ── depends on: feedback widget needs a11y        
    │                                                                                 
    ├──► Phase 3C (Performance) ── depends on: error boundary for SW failures         
    │                                                                                 
    └──► Phase 3D (Interaction) ── depends on: progress indicator for undo feedback   
```

**Catatan:** Phase 3A adalah prerequisite untuk semua sub-fase lain karena i18n strings dan error handling harus tersedia sebelum fitur lain dibangun.

---

## 9. Detail MVP 0.4 — Auth + Monetization + API

### 9.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 📋 PLANNED                                                   |
| **Gate Condition**     | ≥ 10.000 tasks/bulan ATAU ≥ 5.000 MAU                        |
| **Total Fitur**        | 18 fitur dalam 5 sub-fase                                    |
| **Milestone**          | M36-M45                                                       |
| **Estimasi Total**     | 150-210 jam                                                   |

### 9.2 Model Pricing

| **Tier**                    | **Harga**                              | **Fitur**                                                                                      |
|-----------------------------|----------------------------------------|------------------------------------------------------------------------------------------------|
| **Free (Tanpa Login)**      | Gratis                                 | Semua basic tools unlimited (9 tools), max 20 MB, tanpa akun                                   |
| **Free (Dengan Login)**     | Gratis                                 | + OCR 5x/hari, PDF-to-Word 5x/hari, PDF-to-Excel 3x/hari, Sign 5x/hari                       |
| **Pro**                     | Rp 19.900/bulan (Rp 149.000/tahun)    | Unlimited semua, batch, 100 MB, priority queue, no branding, API access                        |

### 9.3 Phase 4A — Auth & Payment (4 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 1     | Auth System (Login/Register) | Supabase Auth: email + password, Google OAuth. Login NOT required basic tools. JWT + refresh. UI Bahasa Indonesia. | Client + Server | 🟢 |
| 2     | Freemium Paywall UI          | Soft paywall fitur premium. CTA "Login Gratis" + "Upgrade Pro". Conversion tracking. Non-aggressive. | Client | 🔵 |
| 3     | Usage Quota Tracker          | Tracking per user/tool/hari. Rate limiting per tier. Dashboard sisa kuota. Pesan limit tercapai. | Server (Supabase) | 🟢 |
| 4     | Payment Integration (Midtrans/Xendit) | Bank transfer, e-wallet (GoPay, OVO, DANA), CC. Monthly + yearly. Webhook, auto-renewal, invoice. | Server (SDK) | 🟡 |

### 9.4 Phase 4B — API & Pro Features (4 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 5     | Public API + API Key         | REST API Pro users. Generate key dashboard. 100 req/jam. Swagger docs. Key rotation + revocation. | Server (FastAPI) | 🟢 |
| 6     | Batch Processing (Pro)       | Upload max 20 files. Queue processing + progress per file. Zip download. Pro-only. Max 200MB total. | Server (queue) | 🟡 |
| 7     | Share Result Link            | Shareable link hasil processing. Valid 24 jam. Download tanpa login. Optional password. Tracking. | Server (signed URL) | 🟢 |
| 8     | Streaming Upload (Resumable) | Resumable upload file besar. Resume setelah disconnect. Chunk 5MB. Retry otomatis. Pro 100MB. | Client + Server (tus) | 🟡 |

### 9.5 Phase 4C — Growth & Engagement (2 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 9     | Referral System              | Unique link per user. 1 bulan Pro gratis per 5 referral register. Dashboard stats. Anti-abuse. | Server | 🔵 |
| 10    | Achievement/Gamification     | Badge milestones (10 files, first merge). 10+ achievements. Notification unlock. Opt-out. Non-intrusive. | Server | 🟣 |

### 9.6 Phase 4D — Advanced PDF (3 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 11    | Page Reorder Visual          | Drag-drop visual page reorder. Thumbnail per halaman. Preview hasil. Client-side. Mobile touch. | Client (pdf-lib + dnd-kit) | 🟢 |
| 12    | PDF Metadata Editor          | Edit title, author, subject, keywords, dates. Preview. Client-side pdf-lib. Batch edit. | Client (pdf-lib) | 🟢 |
| 13    | Flatten PDF                  | Flatten forms + annotations → static. Finalisasi dokumen. Form fields → static text. | Server (PyMuPDF) | 🟢 |

### 9.7 Phase 4E — Admin Upgrades (5 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 14    | Real-time Dashboard (WebSocket) | Upgrade polling → WebSocket. Live task counter, error alerts, OpenClaw status. Fallback polling. | Server (Supabase Realtime) | 🟡 |
| 15    | Usage Heatmap                | Heatmap kapan tools digunakan (7x24 grid). Filter per tool. Export CSV. Insight text otomatis. | Server + Client | 🟢 |
| 16    | Cost Dashboard               | Biaya operasional real-time per provider. Trend, alert > 80% budget, cost per task, projection. | Server (API aggregation) | 🟡 |
| 17    | Feature Flags                | Toggle fitur tanpa deploy. Percentage rollout. User segment targeting. Audit log. | Server + Client | 🟡 |
| 18    | Custom Alerts                | Alert rules kustom ("error rate > 5% → Telegram"). Multiple channels. Snooze, acknowledge, escalation. | Server (rule engine) | 🔴 |

### 9.8 Acceptance Criteria MVP 0.4 (Detail)

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| Auth System | AC1 | Register email + password berfungsi | Functional |
| Auth System | AC2 | Google OAuth one-click login | Functional |
| Auth System | AC3 | JWT + refresh token persistent across sessions | Functional |
| Auth System | AC4 | Logout clear semua state | Functional |
| Auth System | AC5 | Login NOT required untuk basic tools | Functional |
| Auth System | AC6 | UI login/register Bahasa Indonesia | UI |
| Freemium Paywall | AC1 | Paywall muncul untuk fitur premium saat tidak login | Functional |
| Freemium Paywall | AC2 | Soft paywall (bukan hard block) | UX |
| Freemium Paywall | AC3 | CTA "Login Gratis" + "Upgrade Pro" | UX |
| Freemium Paywall | AC4 | Conversion tracking per CTA | Analytics |
| Usage Quota | AC1 | Tracking per user/tool/hari di Supabase | Functional |
| Usage Quota | AC2 | Rate limiting enforced sesuai tier | Functional |
| Usage Quota | AC3 | Pesan "Batas harian tercapai. Upgrade ke Pro." | UX |
| Usage Quota | AC4 | Pro users no rate limit (kecuali abuse) | Functional |
| Usage Quota | AC5 | Dashboard menampilkan sisa kuota | UX |
| Payment | AC1 | Payment page functional | Functional |
| Payment | AC2 | Bank transfer + e-wallet (GoPay, OVO, DANA) + CC | Functional |
| Payment | AC3 | Monthly Rp 19.900 + yearly Rp 149.000 | Functional |
| Payment | AC4 | Webhook handler payment confirmation | Functional |
| Payment | AC5 | Auto-renewal + cancellation flow | Functional |
| Payment | AC6 | Invoice/receipt generation | Functional |
| Payment | AC7 | Payment failure → retry + notification | Edge case |
| Public API | AC1 | API key generation dari dashboard | Functional |
| Public API | AC2 | Akses semua tools via REST API | Functional |
| Public API | AC3 | Rate limit 100 req/jam per key | Functional |
| Public API | AC4 | Swagger/OpenAPI documentation | Documentation |
| Public API | AC5 | Key rotation + revocation support | Security |
| Batch Processing | AC1 | Upload max 20 files sekaligus | Functional |
| Batch Processing | AC2 | Queue processing + progress per file | UX |
| Batch Processing | AC3 | Zip download semua hasil | Functional |
| Batch Processing | AC4 | Pro-only feature | Business |
| Batch Processing | AC5 | Total batch max 200MB | Constraint |
| Share Link | AC1 | Generate shareable link setelah processing | Functional |
| Share Link | AC2 | Valid 24 jam | Constraint |
| Share Link | AC3 | Download tanpa login | Functional |
| Share Link | AC4 | Optional password protection | Security |
| Resumable Upload | AC1 | Resume upload setelah disconnect | Functional |
| Resumable Upload | AC2 | Chunk size 5MB | Technical |
| Resumable Upload | AC3 | Retry otomatis | Reliability |
| Resumable Upload | AC4 | Support Pro 100MB file size | Functional |
| Referral | AC1 | Unique referral link per user | Functional |
| Referral | AC2 | Reward: 1 bulan Pro per 5 referrals | Business |
| Referral | AC3 | Dashboard referral stats | UX |
| Referral | AC4 | Anti-abuse (IP + email verification) | Security |
| Gamification | AC1 | 10+ achievements definable | Functional |
| Gamification | AC2 | Badge visual di profile | UX |
| Gamification | AC3 | Notification saat unlock | UX |
| Gamification | AC4 | Opt-out available | UX |
| Page Reorder | AC1 | Thumbnail per halaman | Functional |
| Page Reorder | AC2 | Drag-to-reorder | Functional |
| Page Reorder | AC3 | Client-side (zero upload) | Privacy |
| Page Reorder | AC4 | Mobile touch support | UX |
| Metadata Editor | AC1 | Edit title, author, subject, keywords | Functional |
| Metadata Editor | AC2 | Preview metadata sebelum save | UX |
| Metadata Editor | AC3 | Client-side processing | Privacy |
| Flatten PDF | AC1 | Form fields → static text | Functional |
| Flatten PDF | AC2 | Annotations → permanent | Functional |
| Flatten PDF | AC3 | Output non-editable | Functional |
| Real-time Dashboard | AC1 | WebSocket real-time (no polling) | Functional |
| Real-time Dashboard | AC2 | Live task counter | Functional |
| Real-time Dashboard | AC3 | Live error alerts | Functional |
| Real-time Dashboard | AC4 | Fallback ke polling jika WS gagal | Reliability |
| Usage Heatmap | AC1 | Heatmap 7x24 grid (jam x hari) | Functional |
| Usage Heatmap | AC2 | Filter per tool | UX |
| Usage Heatmap | AC3 | Export CSV | Functional |
| Cost Dashboard | AC1 | Biaya per provider real-time | Functional |
| Cost Dashboard | AC2 | Alert > 80% budget | Alerting |
| Cost Dashboard | AC3 | Cost per task breakdown | Analytics |
| Feature Flags | AC1 | Toggle tanpa deploy | Functional |
| Feature Flags | AC2 | Percentage rollout | Functional |
| Feature Flags | AC3 | User segment targeting | Functional |
| Custom Alerts | AC1 | Custom rule definition | Functional |
| Custom Alerts | AC2 | Multiple channels (Telegram, Email) | Functional |
| Custom Alerts | AC3 | Snooze + acknowledge | UX |

### 9.9 Perbandingan Tier Detail

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
| API Access                 | ❌                     | ❌                      | ✅                   |
| AI Features (Fase 2+)      | ❌                     | 3x/hari                 | ✅ Unlimited         |

### 9.10 Strategi Monetisasi

- **Filosofi:** Gratis untuk kebutuhan dasar, premium untuk power users
- **Konversi Target:** 2-5% registered users ke Pro
- **Pricing Rationale:** Rp 19.900/bulan (~$1.25 USD) — sangat terjangkau pasar Indonesia, lebih murah dari SmallPDF ($9/bulan) dan iLovePDF ($4/bulan)
- **Annual Discount:** ~37% (Rp 149.000 vs Rp 238.800)
- **Business Outcome Target:** 🔵 MRR ≥ Rp 500.000/bulan dalam 6 bulan setelah launch
- **Payment Methods:** Bank transfer (BCA, Mandiri, BNI, BRI), e-wallet (GoPay, OVO, DANA, ShopeePay), credit card (Visa, Mastercard)

---

## 10. Detail Fase 2 — AI Core Features

### 10.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 🔮 VISI                                                      |
| **Gate Condition**     | MVP 0.4 revenue > Rp 0 (validated willingness to pay)         |
| **Total Fitur**        | 22 fitur dalam 4 sub-fase                                    |
| **Milestone**          | M46-M55                                                       |
| **Estimasi Total**     | 230-320 jam                                                   |

### 10.2 LLM Provider Strategy

| **Provider**   | **Peran**        | **Endpoint**                    | **Model**                          | **Use Case**                                    |
|----------------|------------------|---------------------------------|------------------------------------|-------------------------------------------------|
| enowxAI        | Primary          | API endpoint (load balanced)    | Flash (simple), Pro (complex)      | Semua AI features, load balanced across instances |
| OpenRouter     | Fallback #1      | openrouter.ai/api               | Model per fitur (cost-optimized)   | Fallback saat enowxAI unavailable               |
| 9Router        | Fallback #2      | localhost:20128                  | Auto-routes ke cheapest available  | Final fallback, 3-tier routing                  |

**9Router** adalah npm package, OpenAI-compatible router di localhost:20128. Tiga tier fallback:
1. **Subscription tier:** API keys berbayar (OpenAI, Anthropic, Google) — highest quality, lowest latency
2. **Cheap tier:** Provider murah (Together, Groq, Fireworks) — good quality, very low cost
3. **Free tier:** Free API providers — acceptable quality, zero cost

Dokumentasi lengkap: https://9router.com/

**Model Selection Strategy per Feature:**

| **Feature Category**           | **Model Tier** | **Contoh Model**              | **Est. Cost/Request** | **Latency Target** |
|--------------------------------|----------------|-------------------------------|-----------------------|--------------------|
| Document Classification        | Flash          | Gemini 2.0 Flash, GPT-4o-mini | < Rp 50              | < 3 detik          |
| Keyword Extraction             | Flash          | Gemini 2.0 Flash              | < Rp 50              | < 3 detik          |
| PDF Summarization              | Flash/Pro      | Gemini 2.0 Flash (short), Pro (long) | Rp 100-300     | < 15 detik         |
| Chat with PDF (Q&A)           | Pro            | GPT-4o, Claude 3.5 Sonnet     | Rp 200-500           | < 10 detik         |
| Structured Data Extraction     | Pro            | GPT-4o, Gemini Pro             | Rp 200-400           | < 15 detik         |
| AI Vision (table, KTP, rotate) | Pro            | GPT-4o vision, Gemini Pro Vision | Rp 300-600        | < 20 detik         |
| Content Generation             | Pro            | Claude 3.5 Sonnet, GPT-4o     | Rp 300-500           | < 30 detik         |
| Translation                    | Flash/Pro      | Gemini Flash (simple), Pro (complex) | Rp 100-400    | < 15 detik         |

**Cost Optimization Strategy:**
- Caching: Identical requests di-cache 24 jam (hash-based)
- Batching: Multiple small requests di-batch ke single API call
- Streaming: Response streaming untuk UX (user sees partial result)
- Fallback: Jika primary gagal, otomatis ke OpenRouter → 9Router
- Budget alert: Jika daily cost > Rp 50.000, alert ke Telegram + auto-throttle

### 10.3 Phase F2A — AI Intelligence (5 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 1     | AI PDF Summarizer            | Ringkasan otomatis 100-300 kata. ID + EN. < 30 detik. Pro/Free+Login 3x/hari. | Server (LLM API) | 🟣 |
| 2     | AI Chat with PDF (Q&A)       | Tanya jawab konten PDF. Bahasa natural, jawaban berdasarkan dokumen. Context window management. Citation halaman. Pro-only. | Server (LLM + RAG) | 🟣 |
| 3     | AI Smart Extract             | Ekstraksi data terstruktur (invoice, receipt, form). Output JSON/CSV. Akurasi ≥ 85% dokumen Indonesia. Pro-only. | Server (LLM structured) | 🟣 |
| 4     | AI Table Extraction          | Deteksi tabel via AI vision. Lebih akurat dari camelot untuk borderless. Output Excel/CSV. Pro-only. | Server (LLM vision) | 🟣 |
| 5     | AI Document Classification   | Klasifikasi otomatis 10+ tipe dokumen. Confidence score. Batch support. < 5 detik per dokumen. | Server (LLM) | 🟣 |

**Acceptance Criteria F2A (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| AI Summarizer | AC1 | Ringkasan 100-300 kata dari PDF apapun | Functional |
| AI Summarizer | AC2 | Bahasa Indonesia dan English supported | Functional |
| AI Summarizer | AC3 | Processing < 30 detik untuk PDF ≤ 50 halaman | Performance |
| AI Summarizer | AC4 | Pro tier unlimited, Free+Login 3x/hari | Business |
| AI Summarizer | AC5 | Keyword extraction (5-10 keywords) included | Functional |
| AI Summarizer | AC6 | Copy-to-clipboard button untuk hasil | UX |
| AI Chat PDF | AC1 | Chat interface dengan input teks natural | Functional |
| AI Chat PDF | AC2 | Jawaban berdasarkan isi dokumen (bukan hallucination) | Quality |
| AI Chat PDF | AC3 | Citation halaman untuk setiap jawaban | Functional |
| AI Chat PDF | AC4 | Context window management (chunking untuk PDF besar) | Technical |
| AI Chat PDF | AC5 | Conversation history per session | UX |
| AI Chat PDF | AC6 | Pro-only feature | Business |
| AI Smart Extract | AC1 | Ekstraksi data invoice: tanggal, nomor, total, items | Functional |
| AI Smart Extract | AC2 | Ekstraksi data receipt: merchant, tanggal, total | Functional |
| AI Smart Extract | AC3 | Output JSON dan CSV format | Functional |
| AI Smart Extract | AC4 | Akurasi ≥ 85% untuk dokumen standar Indonesia | Quality |
| AI Smart Extract | AC5 | Preview extracted data sebelum download | UX |
| AI Table Extraction | AC1 | Deteksi tabel menggunakan AI vision model | Functional |
| AI Table Extraction | AC2 | Akurasi > camelot untuk borderless tables | Quality |
| AI Table Extraction | AC3 | Output Excel (.xlsx) dan CSV | Functional |
| AI Table Extraction | AC4 | Multi-table → multi-sheet | Functional |
| AI Table Extraction | AC5 | Preview tabel terdeteksi sebelum export | UX |
| AI Classification | AC1 | Klasifikasi 10+ tipe: invoice, surat, laporan, kontrak, KTP, SIM, NPWP, akta, proposal, CV | Functional |
| AI Classification | AC2 | Confidence score per klasifikasi (0-100%) | Functional |
| AI Classification | AC3 | Batch classification (multiple files) | Functional |
| AI Classification | AC4 | Processing < 5 detik per dokumen | Performance |
| AI Classification | AC5 | Threshold configurable (default 70%) | Configuration |

### 10.4 Phase F2B — AI Enhancement (9 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 6     | AI Smart Compress            | Rekomendasi level kompresi optimal berdasarkan analisis konten. One-click apply. Preview before/after. Akurasi ≥ 80%. | Server (AI + Ghostscript) | 🟣 |
| 7     | AI Auto-Rotate               | Deteksi halaman terbalik/miring, koreksi orientasi otomatis. Batch seluruh dokumen. Confidence threshold. | Server (AI vision) | 🟣 |
| 8     | AI Deskew                    | Koreksi kemiringan dokumen scan. Deteksi sudut, straighten otomatis. Meningkatkan akurasi OCR. | Server (AI + image) | 🟣 |
| 9     | AI Background Removal        | Hapus background noise dokumen scan (noda, bayangan). Output clean white. Preserve text/images. Batch. | Server (AI image) | 🟡 |
| 10    | AI Image Enhancement         | Peningkatan kualitas gambar dalam PDF (sharpen, denoise, contrast). Preview before/after. Quality score. | Server (AI) | 🟡 |
| 11    | AI Auto-Crop                 | Deteksi content area, crop margin berlebih. Hapus border hitam scan. Batch. Preview. Undo. | Server (AI detection) | 🟡 |
| 12    | AI Redaction Suggestion      | Saran area redact (NIK, telepon, alamat, data sensitif). User confirm sebelum apply. Audit log. | Server (LLM + NER) | 🟣 |
| 13    | AI Accessibility Checker     | Analisis PDF aksesibilitas (alt text, reading order, heading, contrast). Laporan + saran. PDF/UA check. | Server (LLM) | 🟡 |
| 14    | AI OCR Enhancement (Handwriting) | OCR tulisan tangan via AI vision. Akurasi > Tesseract handwritten. Confidence per kata. ID + EN. | Server (LLM vision) | 🟣 |

### 10.5 Phase F2C — AI Automation (1 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 15    | AI Workflow Builder           | Visual drag-drop workflow builder. Gabungkan tools dalam pipeline ("Upload → OCR → Summarize → Compress"). Save/reuse. Pro-only. | Server + Client | ⚪ |

### 10.6 Phase F2D — AI OpenClaw Upgrades (7 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 16    | AI Support Bot (Chat Widget) | Chat widget di mypapyr.com. Menjawab FAQ, guide penggunaan tool, troubleshoot errors. Escalation ke Telegram jika tidak bisa jawab. | Server (LLM + widget) | 🟡 |
| 17    | Auto-Localization            | OpenClaw otomatis translate konten marketing ke bahasa daerah (Jawa, Sunda) dan English. Quality check sebelum publish. | Server (LLM translation) | 🟣 |
| 18    | Content Calendar             | AI-generated content calendar untuk blog dan social media. Berdasarkan trending topics, SEO gaps, competitor activity. | Server (LLM + analytics) | 🟢 |
| 19    | Competitor Alert             | Real-time alert saat kompetitor launch fitur baru, ubah pricing, atau publish konten. Analisis dampak. | Server (scraping + LLM) | 🟢 |
| 20    | Auto-PR Review               | OpenClaw review setiap PR otomatis. Code quality, security, performance check. Approve/request changes. | Server (LLM + GitHub API) | 🟢 |
| 21    | Perf Regression Detection    | Deteksi otomatis performance regression dari Lighthouse CI dan Vercel Speed Insights. Alert + root cause suggestion. | Server (analytics + LLM) | 🟡 |
| 22    | User Sentiment Analysis      | Analisis sentiment dari feedback widget, social media mentions, app store reviews. Weekly sentiment report. | Server (LLM NLP) | 🔵 |

### 10.7 Acceptance Criteria Fase 2 (Ringkasan)

| **Sub-fase** | **Key Metrics** | **Quality Gate** |
|--------------|-----------------|------------------|
| F2A (Intelligence) | Akurasi ≥ 90% ID, ≥ 85% EN; latency < 30 detik; cost < Rp 500/request | Semua 5 fitur berfungsi end-to-end |
| F2B (Enhancement) | Akurasi rekomendasi ≥ 80%; batch processing berfungsi; preview before/after | 9 fitur berfungsi, user satisfaction > 70% |
| F2C (Automation) | Workflow builder functional; 5+ template workflows tersedia | Pipeline execution reliable |
| F2D (OpenClaw) | 7 upgrade berfungsi; auto-PR review < 5 menit; sentiment weekly report | Integration dengan existing OpenClaw stable |

### 10.8 Pertimbangan Teknis Fase 2

- **Privacy:** AI processing tetap menghormati privacy-first — file auto-delete setelah processing, tidak ada data retention untuk training
- **Cost:** API calls AI memiliki biaya per request — strict monitoring via Cost Dashboard (MVP 0.4)
- **Accuracy:** Validasi akurasi untuk dokumen Bahasa Indonesia sebelum rilis publik (benchmark dataset)
- **Latency:** AI processing membutuhkan waktu lebih lama — progress indicator wajib, async processing untuk tasks > 30 detik
- **Fallback:** Jika semua LLM providers down, graceful degradation ke non-AI alternatives
- **Caching:** Response caching untuk identical requests (24 jam TTL, hash-based key)
- **Rate Limiting:** AI features rate limited bahkan untuk Pro users (100 AI requests/hari) untuk cost control

---

## 11. Detail Fase 3 — AI Advanced + Integrations

### 11.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 🔮 VISI                                                      |
| **Gate Condition**     | Fase 2 stabil + ≥ 100 AI tasks/hari                          |
| **Total Fitur**        | 22 fitur dalam 5 sub-fase                                    |
| **Milestone**          | M56-M65                                                       |
| **Estimasi Total**     | 215-295 jam                                                   |

### 11.2 Phase F3A — AI Intelligence Advanced (4 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 1     | AI PDF Translation           | Terjemahan PDF lengkap dengan layout terjaga. ID↔EN, ID↔Jawa, ID↔Sunda. Preserve formatting. | Server (LLM + layout) | 🟣 |
| 2     | AI Invoice Parser            | Parsing invoice otomatis: vendor, tanggal, items, total, pajak, nomor invoice. Output structured JSON. Batch. | Server (LLM structured) | 🟡 |
| 3     | AI Resume Parser             | Parsing CV/resume: nama, kontak, pendidikan, pengalaman, skills. Output JSON. Scoring opsional. | Server (LLM structured) | 🟡 |
| 4     | AI Legal Document Analyzer   | Analisis dokumen hukum: identifikasi klausul penting, risiko, tanggal kritis. Ringkasan eksekutif. | Server (LLM analysis) | 🟣 |

### 11.3 Phase F3B — AI Content Generation (6 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 5     | AI PDF Generator             | Generate PDF dari prompt teks. User deskripsikan dokumen, AI generate konten + layout. Template-based. | Server (LLM + PDF gen) | 🟡 |
| 6     | AI Report Builder            | Generate laporan dari data (CSV/JSON input). Visualisasi, narasi, executive summary. Template laporan. | Server (LLM + charting) | 🟡 |
| 7     | AI Certificate Generator     | Generate sertifikat dari template + data peserta. Batch generation. QR code verification. | Server (template + data) | 🟢 |
| 8     | AI Cover Letter Generator    | Generate surat lamaran berdasarkan CV + job description. Bahasa Indonesia formal. Customizable tone. | Server (LLM) | 🟢 |
| 9     | AI Proposal Generator        | Generate proposal bisnis dari brief. Struktur standar Indonesia. Customizable sections. | Server (LLM) | 🟡 |
| 10    | AI Slide to PDF              | Konversi presentasi (PPTX) ke PDF dengan layout terjaga. Preserve animations sebagai static frames. | Server (LibreOffice) | 🟡 |

**Acceptance Criteria F3B (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| PDF Generator | AC1 | User input prompt teks, AI generate dokumen PDF | Functional |
| PDF Generator | AC2 | 5+ template tersedia (surat, laporan, proposal, invoice, memo) | Functional |
| PDF Generator | AC3 | Customizable: font, margin, header/footer | Configuration |
| PDF Generator | AC4 | Output PDF berkualitas print-ready | Quality |
| Report Builder | AC1 | Input CSV/JSON data | Functional |
| Report Builder | AC2 | Auto-generate visualisasi (bar, line, pie chart) | Functional |
| Report Builder | AC3 | AI-generated narasi dan executive summary | Functional |
| Report Builder | AC4 | 3+ template laporan (bisnis, keuangan, progress) | Functional |
| Certificate Gen | AC1 | Template sertifikat customizable | Functional |
| Certificate Gen | AC2 | Batch generation dari CSV data peserta | Functional |
| Certificate Gen | AC3 | QR code verification per sertifikat | Functional |
| Certificate Gen | AC4 | Output individual PDF atau merged single PDF | Functional |
| Cover Letter | AC1 | Input: CV (PDF) + job description (text) | Functional |
| Cover Letter | AC2 | Output: surat lamaran Bahasa Indonesia formal | Functional |
| Cover Letter | AC3 | Tone customizable (formal, semi-formal) | Configuration |
| Cover Letter | AC4 | Edit sebelum finalize | UX |
| Proposal Gen | AC1 | Input: brief/outline dari user | Functional |
| Proposal Gen | AC2 | Struktur standar Indonesia (latar belakang, tujuan, metodologi, anggaran, timeline) | Functional |
| Proposal Gen | AC3 | Sections customizable (add/remove/reorder) | Configuration |
| Slide to PDF | AC1 | Input PPTX, output PDF | Functional |
| Slide to PDF | AC2 | Layout terjaga (text, images, shapes) | Quality |
| Slide to PDF | AC3 | Animations → static frames (1 frame per animation step) | Functional |
| Slide to PDF | AC4 | Processing < 60 detik untuk ≤ 50 slides | Performance |

### 11.4 Phase F3C — AI Automation Advanced (3 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 11    | AI Batch Processor           | AI-powered batch processing: upload folder, AI classify + route ke tool yang tepat + process. Fully automated. | Server (LLM + queue) | 🟣 |
| 12    | AI Template Matching         | AI mencocokkan dokumen dengan template yang sesuai. Auto-fill fields berdasarkan konten dokumen. | Server (LLM matching) | 🟣 |
| 13    | AI Document Comparison       | Bandingkan 2 PDF menggunakan AI: highlight perbedaan konten, formatting, dan struktur. Summary of changes. | Server (LLM diff) | 🟡 |

### 11.5 Phase F3D — Advanced PDF (5 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 14    | PDF Comparison (non-AI)      | Perbandingan visual 2 PDF side-by-side. Highlight perbedaan pixel-level. Overlay mode. Page-by-page. | Client + Server | 🟡 |
| 15    | PDF Form Filler              | Fill PDF forms interaktif. Detect form fields, UI untuk mengisi, save filled PDF. Client-side. | Client (pdf-lib) | 🟢 |
| 16    | PDF Annotation               | Tambah annotations (highlight, underline, sticky notes, freehand draw) ke PDF. Client-side. Export annotated PDF. | Client (pdf-lib + canvas) | 🟢 |
| 17    | PDF Redaction                | Redact (hapus permanen) area sensitif dari PDF. Irreversible. Audit trail. Compliance-ready. | Server (PyMuPDF) | 🔴 |
| 18    | PDF/A Conversion             | Konversi PDF ke PDF/A format (archival). Compliance ISO 19005. Validation report. | Server (Ghostscript) | 🔴 |

### 11.6 Phase F3E — Integrations (4 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 19    | Google Drive Integration     | Import dari dan export ke Google Drive. OAuth consent. Folder picker. Auto-sync opsional. | Server (Google API) | 🟢 |
| 20    | Dropbox Integration          | Import/export Dropbox. OAuth. File picker. Seamless workflow. | Server (Dropbox API) | 🟢 |
| 21    | Zapier/Make Integration      | Webhook triggers dan actions untuk automation platforms. "When PDF processed → send to Slack". | Server (webhook) | 🟡 |
| 22    | Browser Extension            | Chrome/Firefox extension. Right-click PDF → process di Papyr. Quick access toolbar. | Client (extension) | ⚪ |

### 11.7 Acceptance Criteria Fase 3 (Ringkasan)

| **Sub-fase** | **Key Metrics** | **Quality Gate** |
|--------------|-----------------|------------------|
| F3A (Intelligence Advanced) | Translation akurasi ≥ 90%; invoice parsing ≥ 95% standard format; resume parsing structured output | 4 fitur end-to-end |
| F3B (Content Generation) | Generated documents usable tanpa edit > 70% cases; template variety ≥ 10 | 6 fitur functional |
| F3C (Automation Advanced) | Batch processor handles 50+ files; template matching ≥ 80% accuracy | 3 fitur reliable |
| F3D (Advanced PDF) | Form filler supports standard PDF forms; annotation export clean; PDF/A valid ISO 19005 | 5 fitur production-ready |
| F3E (Integrations) | OAuth flow smooth; file sync reliable; webhook delivery > 99% | 4 integrations live |

### 11.8 Pertimbangan Teknis Fase 3

- **AI Translation:** Layout preservation adalah challenge utama — perlu custom rendering pipeline
- **Content Generation:** Template system harus extensible — user bisa create custom templates
- **PDF/A Conversion:** Membutuhkan Ghostscript dengan PDF/A profile — validation via veraPDF
- **Integrations:** OAuth token refresh harus reliable — background job untuk token maintenance
- **Browser Extension:** Manifest V3 compliance wajib — Chrome Web Store review process 1-2 minggu
- **Document Comparison:** Semantic diff (AI) vs visual diff (pixel) — keduanya tersedia sebagai opsi

---

## 12. Detail Fase 4 — Indonesia Deep + Enterprise

### 12.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 🔮 VISI                                                      |
| **Gate Condition**     | Fase 3 stabil + regulatory assessment + partnership MoU       |
| **Total Fitur**        | 14 fitur dalam 4 sub-fase                                    |
| **Milestone**          | M66-M72                                                       |
| **Estimasi Total**     | 145-200 jam                                                   |

### 12.2 Phase F4A — Indonesia-Specific AI (6 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 1     | AI e-Meterai Validator       | Validasi keaslian e-Meterai pada dokumen PDF. Verifikasi via API Peruri/aggregator. Laporan validitas. | Server (API Peruri) | 🔴 |
| 2     | AI KTP/SIM Extractor         | Ekstraksi data dari foto KTP/SIM: NIK, nama, alamat, TTL. Output structured. Akurasi ≥ 95%. | Server (LLM vision) | 🟣 |
| 3     | AI NPWP Extractor            | Ekstraksi nomor NPWP dari dokumen. Validasi format. Cross-reference data. | Server (LLM + regex) | 🟢 |
| 4     | AI Surat Resmi Generator     | Generate surat resmi Indonesia (surat keterangan, undangan, pemberitahuan) dari template + data. Format standar. | Server (LLM + template) | 🟢 |
| 5     | AI Akta Notaris Parser       | Parsing akta notaris: pihak-pihak, objek, tanggal, nomor akta. Output structured. Bahasa hukum Indonesia. | Server (LLM legal) | 🟣 |
| 6     | AI Bilingual Document        | Generate dokumen bilingual (ID + EN) side-by-side. Untuk kontrak internasional, MoU, agreement. | Server (LLM translation) | 🔴 |

**Acceptance Criteria F4A (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| e-Meterai Validator | AC1 | Deteksi keberadaan e-Meterai pada PDF | Functional |
| e-Meterai Validator | AC2 | Verifikasi keaslian via API Peruri/aggregator | Functional |
| e-Meterai Validator | AC3 | Laporan validitas (valid/invalid/expired) | Functional |
| e-Meterai Validator | AC4 | Compliance dengan regulasi Peruri | Regulatory |
| e-Meterai Validator | AC5 | Partnership MoU harus signed sebelum development | Prerequisite |
| KTP/SIM Extractor | AC1 | Ekstraksi NIK (16 digit) dari foto KTP | Functional |
| KTP/SIM Extractor | AC2 | Ekstraksi nama, alamat, TTL, jenis kelamin | Functional |
| KTP/SIM Extractor | AC3 | Akurasi ≥ 95% untuk foto berkualitas baik | Quality |
| KTP/SIM Extractor | AC4 | Akurasi ≥ 80% untuk foto berkualitas rendah (blur, gelap) | Quality |
| KTP/SIM Extractor | AC5 | Output structured JSON | Functional |
| KTP/SIM Extractor | AC6 | Data TIDAK disimpan setelah processing (privacy) | Privacy |
| NPWP Extractor | AC1 | Deteksi nomor NPWP (15 digit format XX.XXX.XXX.X-XXX.XXX) | Functional |
| NPWP Extractor | AC2 | Validasi format (checksum) | Validation |
| NPWP Extractor | AC3 | Ekstraksi dari dokumen apapun yang mengandung NPWP | Functional |
| Surat Resmi | AC1 | 10+ template surat resmi Indonesia | Functional |
| Surat Resmi | AC2 | Template: surat keterangan, undangan, pemberitahuan, kuasa, pernyataan | Functional |
| Surat Resmi | AC3 | Format standar (kop surat, nomor surat, perihal, lampiran) | Quality |
| Surat Resmi | AC4 | Fill-in-the-blank + AI-assisted content | Functional |
| Akta Parser | AC1 | Identifikasi pihak-pihak dalam akta | Functional |
| Akta Parser | AC2 | Ekstraksi objek perjanjian | Functional |
| Akta Parser | AC3 | Ekstraksi tanggal dan nomor akta | Functional |
| Akta Parser | AC4 | Output structured JSON | Functional |
| Akta Parser | AC5 | Bahasa hukum Indonesia dipahami dengan benar | Quality |
| Bilingual Doc | AC1 | Generate dokumen ID + EN side-by-side | Functional |
| Bilingual Doc | AC2 | Layout 2 kolom (ID kiri, EN kanan) | Layout |
| Bilingual Doc | AC3 | Paragraph alignment antara kedua bahasa | Quality |
| Bilingual Doc | AC4 | Untuk kontrak, MoU, agreement | Use case |

### 12.3 Phase F4B — Enterprise (3 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 7     | Team/Organization Plan       | Multi-user plan untuk tim/organisasi. Admin panel, user management, shared billing, usage analytics per member. | Server (multi-tenant) | 🟡 |
| 8     | White-label API              | API yang bisa di-rebrand oleh partner. Custom domain, branding removal, dedicated support. Enterprise pricing. | Server (multi-tenant) | 🟡 |
| 9     | Invoice Generator            | Generate invoice PDF dari data (items, harga, pajak, diskon). Template Indonesia (faktur pajak format). Batch. | Server (template) | 🟢 |

### 12.4 Phase F4C — Admin Advanced (3 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 10    | Geographic Map               | Peta geografis pengguna (provinsi/kota). Heatmap Indonesia. Insight regional. Targeting konten. | Server + Client (map) | 🟡 |
| 11    | A/B Testing Engine           | Engine A/B testing built-in. Test copy, layout, pricing, features. Statistical significance calculator. | Server + Client | 🔴 |
| 12    | SEO Dashboard (GSC)          | Integrasi Google Search Console. Rankings, impressions, clicks, CTR per halaman. Trend dan alerts. | Server (GSC API) | 🔴 |

### 12.5 Phase F4D — OpenClaw Advanced (2 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 13    | Auto-Scaling Recommendation  | OpenClaw merekomendasikan kapan scale up/down infrastructure berdasarkan traffic patterns dan cost analysis. | Server (analytics + LLM) | 🟣 |
| 14    | AI Bug Predictor             | Prediksi area kode yang kemungkinan memiliki bug berdasarkan complexity metrics, change frequency, dan historical bugs. | Server (LLM + git analysis) | ⚪ |

### 12.6 Acceptance Criteria Fase 4 (Ringkasan)

| **Sub-fase** | **Key Metrics** | **Quality Gate** |
|--------------|-----------------|------------------|
| F4A (Indonesia AI) | e-Meterai validation 100% accurate; KTP extraction ≥ 95%; surat resmi format compliant | Partnership MoU signed + 6 fitur live |
| F4B (Enterprise) | Team plan supports 50+ members; white-label zero Papyr branding; invoice format faktur pajak valid | 3 fitur production-ready |
| F4C (Admin Advanced) | Geographic data accurate per provinsi; A/B test statistical significance; GSC data real-time | 3 modul admin live |
| F4D (OpenClaw Advanced) | Scaling recommendations save > 20% cost; bug prediction precision > 60% | 2 fitur validated |

### 12.7 Pertimbangan Regulasi Fase 4

| **Fitur** | **Regulasi** | **Requirement** | **Timeline Estimate** |
|-----------|--------------|-----------------|----------------------|
| e-Meterai Validator | Peruri/BSSN | Partnership MoU + API access agreement | 3-6 bulan negosiasi |
| AI Bilingual Document | Kemenkumham | Certified translation standard (jika untuk legal) | Assessment needed |
| A/B Testing Engine | UU PDP (Perlindungan Data Pribadi) | Consent mechanism untuk data collection | Compliance review |
| SEO Dashboard GSC | Google ToS | OAuth consent + data usage compliance | Standard OAuth flow |

### 12.8 Pertimbangan Enterprise

- **Multi-tenancy:** Isolated data per organization, shared infrastructure
- **SLA:** 99.9% uptime guarantee untuk enterprise tier
- **Support:** Dedicated support channel (email + WhatsApp Business)
- **Compliance:** SOC 2 Type II assessment (long-term goal)
- **Pricing:** Custom pricing per organization (based on volume + features)
- **White-label:** Custom domain, logo, color scheme, email templates

---

## 13. Detail Fase 5 — Scale + Ecosystem

### 13.1 Ringkasan

| **Atribut**            | **Detail**                                                    |
|------------------------|---------------------------------------------------------------|
| **Status**             | 🔮 VISI                                                      |
| **Gate Condition**     | Fase 4 stabil + ≥ 50.000 MAU + revenue sustainable           |
| **Total Fitur**        | 14 fitur dalam 4 sub-fase                                    |
| **Milestone**          | M73-M78                                                       |
| **Estimasi Total**     | 130-180 jam                                                   |

### 13.2 Phase F5A — Messaging Bots (2 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 1     | WhatsApp Bot                 | Bot WhatsApp untuk processing PDF. Kirim file → pilih tool → terima hasil. Business API. User-facing. | Server (WA Business API) | 🟡 |
| 2     | Telegram Bot (User-facing)   | Bot Telegram publik untuk users. Kirim PDF, pilih operasi, terima hasil. Inline keyboard menu. | Server (Telegram Bot API) | 🟡 |

### 13.3 Phase F5B — Developer Tools (3 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 3     | CLI Tool                     | Command-line tool untuk developer. `papyr compress file.pdf`, `papyr merge a.pdf b.pdf`. npm package. | Client (Node.js CLI) | 🟢 |
| 4     | AI Email Attachment Processor | Auto-process PDF attachments dari email. Forward email → AI classify → process → reply dengan hasil. | Server (email parsing + AI) | 🟣 |
| 5     | AI Scheduled Processing      | Schedule recurring PDF processing. "Setiap Senin, compress semua PDF di folder X". Cron-like interface. | Server (scheduler) | 🟡 |

### 13.4 Phase F5C — OpenClaw Ecosystem (5 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 6     | Email Newsletter             | OpenClaw auto-generate dan kirim newsletter mingguan. Tips PDF, fitur baru, konten edukatif. Subscriber management. | Server (email + LLM) | 🟢 |
| 7     | Uptime Status Page           | Public status page (status.mypapyr.com). Real-time status semua services. Incident history. Subscribe alerts. | Server (monitoring) | 🟢 |
| 8     | Link Building Agent          | OpenClaw otomatis identifikasi peluang backlink, outreach ke website relevan, track acquired links. | Server (scraping + LLM) | 🟣 |
| 9     | AI Pricing Optimizer         | AI analisis conversion data dan recommend pricing adjustments. A/B test pricing otomatis. Revenue maximization. | Server (analytics + LLM) | 🔵 |
| 10    | AI Performance Tuner         | AI otomatis tune infrastructure parameters (cache TTL, worker count, memory limits) berdasarkan traffic patterns. | Server (AI + infra) | ⚪ |

### 13.5 Phase F5D — Growth (4 fitur)

| **#** | **Fitur**                    | **Deskripsi**                                                                                          | **Processing**  | **Label** |
|-------|------------------------------|--------------------------------------------------------------------------------------------------------|-----------------|-----------|
| 11    | Affiliate Program            | Program afiliasi untuk content creators dan bloggers. Commission per referral conversion. Dashboard affiliate. | Server (tracking) | 🔵 |
| 12    | Community Showcase           | Halaman showcase use cases dari komunitas. User submit, curated display. Social proof + SEO content. | Server + Client | 🟢 |
| 13    | Haptic Feedback              | Haptic feedback di mobile saat processing selesai atau error. Subtle vibration patterns. Progressive enhancement. | Client (Vibration API) | 🟢 |
| 14    | Voice Command                | Voice command untuk hands-free operation. "Compress file ini", "Merge semua". Speech-to-text + intent detection. | Client (Web Speech API) | 🟡 |

**Acceptance Criteria Fase 5 (Detail):**

| **Fitur** | **AC#** | **Kriteria** | **Tipe** |
|-----------|---------|--------------|----------|
| WhatsApp Bot | AC1 | Kirim PDF via WhatsApp → bot merespons | Functional |
| WhatsApp Bot | AC2 | Menu tool selection via quick replies | UX |
| WhatsApp Bot | AC3 | Hasil dikirim kembali sebagai file | Functional |
| WhatsApp Bot | AC4 | Response time < 30 detik | Performance |
| WhatsApp Bot | AC5 | WhatsApp Business API approved | Prerequisite |
| Telegram Bot | AC1 | /start command menampilkan menu tools | Functional |
| Telegram Bot | AC2 | Inline keyboard untuk tool selection | UX |
| Telegram Bot | AC3 | File processing + result delivery | Functional |
| Telegram Bot | AC4 | Support group dan private chat | Functional |
| CLI Tool | AC1 | npm install -g @papyr/cli berfungsi | Functional |
| CLI Tool | AC2 | papyr compress file.pdf menghasilkan output | Functional |
| CLI Tool | AC3 | papyr merge a.pdf b.pdf berfungsi | Functional |
| CLI Tool | AC4 | Progress bar di terminal | UX |
| CLI Tool | AC5 | Auth via API key (papyr login) | Security |
| Email Processor | AC1 | Forward email dengan PDF attachment → auto-process | Functional |
| Email Processor | AC2 | AI classify tipe dokumen | Functional |
| Email Processor | AC3 | Reply dengan hasil processing | Functional |
| Email Processor | AC4 | Handle 100+ emails/hari | Performance |
| Scheduled Processing | AC1 | Cron-like schedule definition | Functional |
| Scheduled Processing | AC2 | Recurring processing (daily, weekly) | Functional |
| Scheduled Processing | AC3 | Source: folder, email, API | Functional |
| Newsletter | AC1 | Auto-generate konten mingguan | Functional |
| Newsletter | AC2 | Subscriber management (subscribe/unsubscribe) | Functional |
| Newsletter | AC3 | Open rate tracking | Analytics |
| Newsletter | AC4 | CAN-SPAM compliance | Regulatory |
| Status Page | AC1 | Real-time status semua services | Functional |
| Status Page | AC2 | Incident history dan postmortem | Functional |
| Status Page | AC3 | Subscribe to alerts (email/webhook) | Functional |
| Status Page | AC4 | 100% accurate (no false positives) | Quality |
| Link Building | AC1 | Identifikasi peluang backlink otomatis | Functional |
| Link Building | AC2 | Outreach email templates | Functional |
| Link Building | AC3 | Track acquired links | Analytics |
| Link Building | AC4 | 5+ links/bulan target | Business |
| Pricing Optimizer | AC1 | Analisis conversion data per price point | Functional |
| Pricing Optimizer | AC2 | Recommend pricing adjustments | Functional |
| Pricing Optimizer | AC3 | A/B test pricing otomatis | Functional |
| Performance Tuner | AC1 | Auto-tune cache TTL berdasarkan traffic | Functional |
| Performance Tuner | AC2 | Auto-tune worker count | Functional |
| Performance Tuner | AC3 | Rollback jika performance degrades | Safety |
| Affiliate Program | AC1 | Unique affiliate link per partner | Functional |
| Affiliate Program | AC2 | Commission tracking per conversion | Functional |
| Affiliate Program | AC3 | Payout management | Functional |
| Affiliate Program | AC4 | Dashboard affiliate | UX |
| Community Showcase | AC1 | User submit use case | Functional |
| Community Showcase | AC2 | Curated display (admin approval) | Moderation |
| Community Showcase | AC3 | SEO-friendly pages | SEO |
| Haptic Feedback | AC1 | Vibration saat processing selesai (mobile) | Functional |
| Haptic Feedback | AC2 | Different pattern untuk success vs error | UX |
| Haptic Feedback | AC3 | Progressive enhancement (no-op desktop) | Compatibility |
| Voice Command | AC1 | "Compress file ini" → trigger compress | Functional |
| Voice Command | AC2 | "Merge semua" → trigger merge | Functional |
| Voice Command | AC3 | Speech-to-text Bahasa Indonesia | Functional |
| Voice Command | AC4 | Intent detection accuracy > 80% | Quality |
| Voice Command | AC5 | Fallback ke text input jika speech fails | Reliability |

### 13.6 Acceptance Criteria Fase 5 (Ringkasan)

| **Sub-fase** | **Key Metrics** | **Quality Gate** |
|--------------|-----------------|------------------|
| F5A (Messaging Bots) | WhatsApp response < 30 detik; Telegram inline keyboard functional; 5+ tools via bot | 2 bots live + stable |
| F5B (Developer Tools) | CLI npm install + usage < 5 menit setup; email processor handles 100+ emails/hari | 3 tools published |
| F5C (OpenClaw Ecosystem) | Newsletter open rate > 20%; status page 100% accurate; link building 5+ links/bulan | 5 systems operational |
| F5D (Growth) | Affiliate generates > 10% revenue; community 50+ showcases; voice accuracy > 80% ID | 4 features live |

### 13.7 Pertimbangan Teknis Fase 5

- **WhatsApp Bot:** Membutuhkan WhatsApp Business API (Meta approval process 2-4 minggu)
- **Telegram Bot:** Lebih mudah — Bot API langsung tersedia, inline keyboard untuk tool selection
- **CLI Tool:** npm package, TypeScript, commander.js untuk argument parsing, streaming output
- **Email Processor:** IMAP listener atau forwarding address, attachment extraction, auto-classify + process
- **Newsletter:** Resend API untuk delivery, custom unsubscribe, CAN-SPAM compliance
- **Status Page:** Real-time monitoring semua services, incident management, subscriber notifications
- **Voice Command:** Web Speech API (browser-native), intent detection via simple NLP, fallback ke text input
- **Haptic Feedback:** Vibration API (mobile only), progressive enhancement (no-op di desktop)

---

## 14. Yang TIDAK Akan Dibangun

| **#**  | **Item**                              | **Alasan**                                                                                                        | **Kapan Mungkin Dipertimbangkan**     |
|--------|---------------------------------------|-------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| X1     | Desktop native app                    | Web app sudah cukup. Native app menambah maintenance burden tanpa value signifikan.                               | Tidak dalam horizon roadmap ini.      |
| X2     | Mobile native app                     | Mobile web sudah dioptimasi (mobile-first + PWA di MVP 0.3). Native hanya jika ada fitur web-impossible.          | Tahun 3+ (jika ada demand kuat)       |
| X3     | PDF text editing (in-place)           | Sangat kompleks, membutuhkan PDF rendering engine lengkap. Bukan core value proposition.                          | Tidak dalam horizon roadmap ini.      |
| X4     | Real-time collaboration               | WebSocket infrastructure kompleks. Bukan core value. Papyr adalah tool, bukan platform kolaborasi.                | Tidak dalam horizon roadmap ini.      |
| X5     | Blockchain/NFT integration            | Tidak ada use case yang jelas untuk PDF tools. Hype-driven, bukan value-driven.                                   | Tidak akan dibangun.                  |
| X6     | Video/audio processing                | Di luar scope "PDF tool". Fokus pada dokumen, bukan multimedia.                                                   | Tidak akan dibangun.                  |
| X7     | Social media features                 | Papyr adalah utility tool, bukan social platform. Tidak ada feed, likes, atau followers.                          | Tidak akan dibangun.                  |
| X8     | Marketplace/plugin system             | Premature. Fokus pada core product terlebih dahulu. Plugin system menambah complexity.                            | Fase 5+ (jika ecosystem mature)       |

> **Prinsip:** Jika ragu apakah sesuatu harus dibangun, jawabannya adalah **tidak**. Fokus pada core value: tools PDF yang gratis, cepat, dan aman.

---

## 15. Prioritas & Dependensi

### 15.1 Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DEPENDENCY GRAPH (7 FASE)                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  MVP 0.1 (COMPLETED) ✅                                                             │
│  ┌─────┐                                                                            │
│  │ M01 │──► M02-M06 ──► M07-M08 ──► M09-M10 ──► M11                               │
│  └─────┘                                                                            │
│       │                                                                             │
│       ▼ [GATE: live & stabil ✅]                                                    │
│                                                                                     │
│  MVP 0.2 (CURRENT) 🔄                                                               │
│  Phase 2A (M12→M13) → 2B (M14,M15) → 2C (M16→M17→M18) → 2D → 2E (M21) → 2F (M22)│
│       │                                                                             │
│       ▼ [GATE: semua tool berfungsi + OpenClaw aktif]                               │
│                                                                                     │
│  MVP 0.3 (PLANNED) 📋                                                               │
│  Phase 3A (M23) → 3B (M24) → 3C (M25) → 3D (M26) → 3E (M27)                      │
│       │                                                                             │
│       ▼ [GATE: ≥ 10K tasks/mo OR ≥ 5K MAU]                                         │
│                                                                                     │
│  MVP 0.4 (PLANNED) 📋                                                               │
│  Phase 4A (M36) → 4B (M37) → 4C (M38) → 4D (M39) → 4E (M40)                      │
│       │                                                                             │
│       ▼ [GATE: revenue > Rp 0]                                                     │
│                                                                                     │
│  Fase 2 (VISI) 🔮                                                                   │
│  Phase F2A (M46) → F2B (M47) → F2C (M48) → F2D (M49)                              │
│       │                                                                             │
│       ▼ [GATE: stabil + ≥ 100 AI tasks/hari]                                       │
│                                                                                     │
│  Fase 3 (VISI) 🔮                                                                   │
│  Phase F3A (M56) → F3B (M57) → F3C (M58) → F3D (M59) → F3E (M60)                  │
│       │                                                                             │
│       ▼ [GATE: stabil + regulatory + partnership MoU]                               │
│                                                                                     │
│  Fase 4 (VISI) 🔮                                                                   │
│  Phase F4A (M66) → F4B (M67) → F4C (M68) → F4D (M69)                              │
│       │                                                                             │
│       ▼ [GATE: stabil + ≥ 50K MAU + revenue sustainable]                            │
│                                                                                     │
│  Fase 5 (VISI) 🔮                                                                   │
│  Phase F5A (M73) → F5B (M74) → F5C (M75) → F5D (M76)                              │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 15.2 Cross-Phase Dependencies

| **Fitur (Source)** | **Depends On** | **Alasan** |
|--------------------|----------------|------------|
| MVP 0.3 i18n | MVP 0.2 complete | Semua tool harus ada sebelum translate strings |
| MVP 0.3 PWA | MVP 0.2 Phase 2D (Perf) | Performance baseline harus tercapai dulu |
| MVP 0.4 Auth | MVP 0.3 complete | UX polish harus selesai sebelum login flow |
| MVP 0.4 Payment | MVP 0.4 Auth | Payment membutuhkan user accounts |
| MVP 0.4 API Key | MVP 0.4 Payment | API access = Pro feature |
| Fase 2 AI features | MVP 0.4 Payment | Revenue validation required |
| Fase 2 AI OpenClaw | MVP 0.2 Phase 2E | Existing OpenClaw harus stable |
| Fase 3 Integrations | MVP 0.4 Auth | OAuth flow membutuhkan user accounts |
| Fase 3 PDF/A | MVP 0.2 Phase 2C | Ghostscript harus sudah di-setup |
| Fase 4 e-Meterai | Fase 3 complete | Regulatory assessment membutuhkan stable product |
| Fase 4 Enterprise | MVP 0.4 Auth + Payment | Multi-tenant membutuhkan auth + billing |
| Fase 5 WhatsApp Bot | Fase 4 complete | Bot membutuhkan semua tools + AI available |
| Fase 5 CLI | MVP 0.4 API Key | CLI menggunakan API key untuk auth |

### 15.3 Matriks Prioritas (Top Features)

| **Fitur**              | **Impact** | **Effort** | **Prioritas** | **Label** | **Rasional**                                                    |
|------------------------|------------|------------|---------------|-----------|------------------------------------------------------------------|
| M12 Protect            | Medium     | Low        | P1            | 🟢        | Quick win, natural pair M13                                      |
| M15 Sign               | High       | Medium     | P1            | 🟡        | High demand Indonesia (kontrak, surat)                           |
| M16 PDF-Word           | High       | Medium     | P2            | 🟡        | Sangat diminta, server processing berat                          |
| M17 OCR                | High       | High       | P3            | 🟡        | Kompleks tapi sangat bernilai                                    |
| Dark Mode (MVP 0.3)    | Medium     | Low        | P2            | 🟢        | Most requested UX feature                                        |
| PWA (MVP 0.3)          | High       | Medium     | P2            | 🟢        | Offline capability, installable                                  |
| Auth System (MVP 0.4)  | Medium     | Medium     | P3            | 🟢        | Enabler monetisasi                                               |
| Payment (MVP 0.4)      | High       | High       | P4            | 🟡        | Revenue enabler, setelah traffic threshold                       |
| AI Summarizer (Fase 2) | High       | High       | P5            | 🟣        | High value, R&D required                                         |
| e-Meterai (Fase 4)     | Very High  | Very High  | P7            | 🔴        | Game-changer tapi regulated                                      |

---

## 16. Metrik Keberhasilan per Fase

### 16.0 Definisi KPI Universal

| **KPI**                       | **Definisi**                                                  | **Measurement Tool**          |
|-------------------------------|---------------------------------------------------------------|-------------------------------|
| MAU (Monthly Active Users)    | Unique visitors yang melakukan ≥ 1 task dalam 30 hari         | Vercel Analytics              |
| Task Success Rate             | (task_completed / task_started) x 100%                        | Custom analytics events       |
| TTFB (Time to First Byte)     | Waktu dari request hingga byte pertama response               | Vercel Speed Insights         |
| LCP (Largest Contentful Paint)| Waktu render elemen terbesar di viewport                      | Lighthouse CI                 |
| CLS (Cumulative Layout Shift) | Total unexpected layout shifts                                | Lighthouse CI                 |
| Conversion Rate               | (paying users / registered users) x 100%                      | Supabase + Payment dashboard  |
| MRR (Monthly Recurring Revenue)| Total revenue dari subscriptions aktif per bulan             | Payment provider dashboard    |
| Churn Rate                    | (cancelled subscriptions / total active) x 100% per bulan     | Supabase subscription table   |
| NPS (Net Promoter Score)      | % Promoters (9-10) minus % Detractors (0-6)                  | In-app survey                 |
| AI Accuracy                   | (correct AI outputs / total AI outputs) x 100%                | Manual sampling + user feedback|
| Cost per Task                 | Total infrastructure cost / total tasks processed             | Cost dashboard                |
| Uptime                        | (total minutes - downtime minutes) / total minutes x 100%     | BetterStack/UptimeRobot       |

### 16.1 MVP 0.1 (COMPLETED)

| **Metrik**                    | **Target**                | **Aktual**       | **Status**  |
|-------------------------------|---------------------------|------------------|-------------|
| Tools Delivered               | 5 tools                   | 6 tools          | ✅ Exceeded |
| Tasks Completed               | 84 tasks                  | 89 tasks         | ✅ Exceeded |
| Production Deploy             | Live di mypapyr.com       | Live             | ✅ Met      |
| Zero Critical Bugs (7 hari)  | 0 critical bugs           | 0                | ✅ Met      |
| Lighthouse Performance        | ≥ 80                      | TBD              | 📊 Monitoring |
| Task Success Rate             | > 95%                     | TBD              | 📊 Monitoring |
| TTFB                          | < 500ms                   | TBD              | 📊 Monitoring |

### 16.2 MVP 0.2

| **Metrik**                    | **Target**                                    |
|-------------------------------|-----------------------------------------------|
| Tools Delivered               | 7 tools tambahan (total 13)                   |
| Tool Adoption                 | Setiap tool baru ≥ 100 uses dalam 30 hari     |
| Task Success Rate             | > 95% per tool                                |
| SEO Ranking                   | Top 10 Google ID per keyword tool             |
| Organic Traffic Growth        | +50% dari baseline MVP 0.1                    |
| Lighthouse Performance        | ≥ 90 semua halaman                            |
| OpenClaw Uptime               | ≥ 99% agent availability                     |
| Admin Dashboard               | 10 modul aktif                                |

### 16.3 MVP 0.3

| **Metrik**                    | **Target**                                    |
|-------------------------------|-----------------------------------------------|
| Lighthouse PWA Score          | ≥ 90                                          |
| Lighthouse Accessibility      | ≥ 95                                          |
| Landing Page JS               | < 30KB gzipped                                |
| TTFB Indonesia                | < 200ms                                       |
| Dark Mode Adoption            | ≥ 20% users mengaktifkan                     |
| PWA Installs                  | ≥ 500 dalam 3 bulan                          |
| Feedback Widget Response      | ≥ 5% users memberikan feedback               |
| Social Proof Counter          | Menampilkan > 10.000 tasks                    |

### 16.4 MVP 0.4

| **Metrik**                    | **Target**                                    |
|-------------------------------|-----------------------------------------------|
| Registered Users              | ≥ 1.000 dalam 3 bulan                        |
| Free-to-Pro Conversion        | 2-5%                                          |
| Monthly Recurring Revenue     | ≥ Rp 500.000/bulan dalam 6 bulan             |
| Churn Rate                    | < 10% per bulan                               |
| Payment Success Rate          | > 95%                                         |
| API Key Adoption              | ≥ 10% Pro users                               |
| Tasks per Month               | ≥ 10.000 (gate condition)                     |

### 16.5 Fase 2

| **Metrik**                    | **Target**                                    |
|-------------------------------|-----------------------------------------------|
| AI Feature Adoption           | ≥ 20% Pro users                               |
| AI Accuracy (Indonesia)       | ≥ 90% dokumen Bahasa Indonesia                |
| Revenue Impact                | +30% MRR dari AI upsell                       |
| Cost per AI Request           | < Rp 500 rata-rata                            |
| AI Processing Time            | < 30 detik (P95)                              |
| LLM Fallback Rate             | < 5% requests ke fallback provider            |

### 16.6 Fase 3

| **Metrik**                    | **Target**                                    |
|-------------------------------|-----------------------------------------------|
| AI Content Generation Usage   | ≥ 100 documents/hari                          |
| Integration Adoption          | ≥ 500 connected accounts (Drive/Dropbox)      |
| PDF/A Conversion              | ≥ 200 conversions/bulan                       |
| Browser Extension Installs    | ≥ 1.000 dalam 6 bulan                        |
| AI Accuracy Advanced          | ≥ 85% untuk tasks kompleks                   |

### 16.7 Fase 4

| **Metrik**                    | **Target**                                    |
|-------------------------------|-----------------------------------------------|
| e-Meterai Transactions        | ≥ 500/bulan dalam 6 bulan                     |
| Enterprise Clients            | ≥ 5 paying accounts                           |
| KTP/SIM Extraction Accuracy   | ≥ 95%                                         |
| Market Position               | Top 3 PDF tool Indonesia                      |
| Revenue from Enterprise       | ≥ Rp 5.000.000/bulan                          |

### 16.8 Fase 5

| **Metrik**                    | **Target**                                    |
|-------------------------------|-----------------------------------------------|
| WhatsApp Bot Users            | ≥ 5.000 dalam 6 bulan                        |
| CLI Downloads                 | ≥ 1.000 npm installs                         |
| Newsletter Subscribers        | ≥ 10.000                                      |
| Affiliate Revenue             | ≥ 10% total revenue                           |
| MAU                           | ≥ 50.000                                      |
| Total Revenue                 | MRR > operational cost (sustainable)          |

---

## 17. Risiko & Mitigasi

### 17.1 Risiko Teknis

| **#** | **Risiko**                                          | **Prob.** | **Dampak** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|-----------|------------|---------------------------------------------------------------------------------|
| R01   | OCR accuracy rendah dokumen Indonesia                | Medium    | High       | Benchmark Tesseract + Indonesian pack sebelum launch                            |
| R02   | Server overload saat traffic meningkat               | Medium    | High       | Auto-scaling, queue system, client-side processing prioritas                    |
| R03   | AI API cost melebihi revenue                         | Medium    | High       | Strict rate limiting, caching, 3-tier LLM fallback (enowxAI→OpenRouter→9Router) |
| R04   | Security vulnerability file processing               | Low       | Critical   | Input validation, sandboxed processing, regular audit                           |
| R05   | Railway free tier insufficient Phase 2C              | High      | High       | VPS migration HostData.id sebagai inisiatif terpisah                            |
| R06   | LLM provider downtime                                | Medium    | Medium     | 3-tier fallback strategy, local model fallback                                  |
| R07   | Web Worker browser compatibility                     | Low       | Low        | Fallback ke main thread, progressive enhancement                                |

### 17.2 Risiko Bisnis

| **#** | **Risiko**                                          | **Prob.** | **Dampak** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|-----------|------------|---------------------------------------------------------------------------------|
| R08   | Kompetitor lokal muncul                              | Medium    | Medium     | First-mover advantage, Indonesia-deep features sebagai moat                     |
| R09   | Willingness to pay rendah                            | Medium    | High       | Pricing Rp 19.900 (sangat rendah), freemium generous, validate sebelum invest   |
| R10   | Regulasi e-Meterai berubah                           | Low       | Medium     | Monitor regulasi, partnership aggregator, flexible architecture                 |
| R11   | Payment provider issues                              | Low       | Medium     | Dual provider (Midtrans + Xendit), fallback mechanism                           |
| R12   | AI hype cycle — user expectations too high           | Medium    | Medium     | Clear communication tentang capabilities, iterative improvement                 |

### 17.3 Risiko Operasional

| **#** | **Risiko**                                          | **Prob.** | **Dampak** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|-----------|------------|---------------------------------------------------------------------------------|
| R13   | Cloudflare R2 downtime                               | Low       | High       | Fallback direct download, health monitoring                                     |
| R14   | OpenClaw agent failure                               | Medium    | Medium     | Self-healing, auto-restart, manual override via admin                           |
| R15   | Data loss file processing                            | Low       | Medium     | Retry mechanism, idempotent operations                                          |
| R16   | Dependency vulnerability                             | Medium    | Medium     | Dependabot, regular updates, minimal dependencies                               |
| R17   | Solo developer burnout                               | Low       | High       | 100% AI-driven, modular architecture, sustainable pace                          |
| R18   | 9Router localhost dependency                         | Low       | Low        | Fallback langsung ke OpenRouter jika 9Router down                               |
| R19   | WhatsApp Business API approval ditolak               | Medium    | Medium     | Telegram Bot sebagai alternatif utama, WhatsApp sebagai bonus                   |
| R20   | Browser extension store rejection                    | Medium    | Low        | Manifest V3 compliance, clean permissions, appeal process                       |
| R21   | Supabase pricing tier exceeded                       | Low       | Medium     | Monitor usage, upgrade plan proaktif, self-hosted fallback plan                 |

### 17.4 Risiko AI-Specific

| **#** | **Risiko**                                          | **Prob.** | **Dampak** | **Mitigasi**                                                                    |
|-------|-----------------------------------------------------|-----------|------------|---------------------------------------------------------------------------------|
| R22   | LLM hallucination pada document analysis             | High      | Medium     | Confidence scoring, human-in-the-loop untuk low confidence, disclaimer UI       |
| R23   | AI cost spiral (usage exceeds budget)                | Medium    | High       | Hard budget cap, auto-throttle, cost dashboard alerts, caching aggressive       |
| R24   | Model deprecation oleh provider                      | Medium    | Medium     | Multi-provider strategy, abstraction layer, 9Router auto-routing                |
| R25   | Privacy concern AI processing dokumen sensitif       | Medium    | High       | No data retention, no training on user data, clear privacy policy, opt-out      |
| R26   | AI accuracy rendah untuk bahasa daerah               | High      | Low        | Fokus ID + EN terlebih dahulu, bahasa daerah sebagai experimental               |
| R27   | Latency AI processing terlalu tinggi                 | Medium    | Medium     | Streaming response, async processing, progress indicator, queue management      |

---

## 18. Technology Decision Log

| **Keputusan**                          | **Dipilih**                    | **Alternatif Ditolak**                | **Alasan**                                                    |
|----------------------------------------|--------------------------------|---------------------------------------|---------------------------------------------------------------|
| PDF encryption/decryption              | PyMuPDF (server-side)          | pdf-lib (client-side)                 | AES-256 support lebih mature di PyMuPDF                       |
| Text watermark                         | pdf-lib (client-side)          | PyMuPDF (server-side)                 | Zero upload, privacy-first                                    |
| Digital signature                      | Canvas + pdf-lib (client-side) | Server-side processing                | Tanda tangan = data sensitif, HARUS client-side               |
| PDF-to-Word conversion                 | LibreOffice headless           | pdf2docx, PyMuPDF+python-docx         | Layout preservation terbaik                                   |
| OCR engine                             | ocrmypdf + Tesseract           | EasyOCR, PaddleOCR                    | Searchable PDF output, Indonesian support, lightweight         |
| Table extraction                       | camelot-py + openpyxl          | tabula-py, pdfplumber                 | Best accuracy lattice + stream tables                         |
| Authentication                         | Supabase Auth                  | NextAuth, Firebase Auth               | Sudah standby di stack, PostgreSQL included                   |
| Payment                                | Midtrans/Xendit                | Stripe, PayPal                        | Indonesian payment methods (GoPay, OVO, bank transfer)        |
| LLM Primary Provider                   | enowxAI (load balanced)        | OpenAI direct, Google AI direct       | Cost-effective, load balanced, custom routing                  |
| LLM Fallback #1                        | OpenRouter                     | Direct provider APIs                  | Single API, model selection flexibility, cost optimization     |
| LLM Fallback #2                        | 9Router (localhost:20128)      | Manual fallback logic                 | OpenAI-compatible, 3-tier auto-routing, npm package            |
| LLM Model Strategy                     | Flash (simple) + Pro (complex) | Single model for all                  | Cost optimization: Flash < Rp 100/req, Pro untuk complex only |
| VPS provider                           | HostData.id                    | Contabo, Hetzner                      | Indonesian provider, local support, competitive pricing       |
| Admin Dashboard auth                   | Env-based token (initial)      | NextAuth, Supabase Auth               | Minimal overhead, upgrade path MVP 0.4                        |
| PWA implementation                     | next-pwa + custom SW           | Workbox only                          | Next.js integration, offline-first strategy                   |
| i18n solution                          | next-intl                      | react-i18next, custom                 | Next.js App Router native support, type-safe                  |
| Dark mode                              | Tailwind dark: + CSS vars      | CSS-in-JS theme, styled-components    | Zero runtime cost, native Tailwind support                    |
| PDF preview                            | pdf.js (Mozilla)               | react-pdf, embed tag                  | Full rendering, zoom, mobile support, industry standard       |
| Web Worker bundling                    | Comlink + Vite worker          | Raw postMessage                       | Type-safe, ergonomic API, automatic serialization             |
| Drag and drop                          | @dnd-kit                       | react-beautiful-dnd, HTML5 DnD raw    | Accessible, performant, maintained, touch support             |
| Keyboard shortcuts                     | Custom hook                    | hotkeys-js, mousetrap                 | Minimal dependency, full control, no bundle bloat             |
| Feedback storage                       | Supabase (same instance)       | Separate analytics service            | No additional infra, already in stack                         |
| Referral tracking                      | Custom (Supabase + middleware) | ReferralCandy, Rewardful              | Zero cost, full control, Indonesian payment integration       |
| Feature flags                          | Custom (Supabase + edge config)| LaunchDarkly, Flagsmith               | Zero cost, no vendor lock-in, simple for solo project         |
| WhatsApp Bot                           | WhatsApp Business API (Cloud)  | Twilio, MessageBird                   | Direct Meta API, lower cost, better Indonesia support         |
| CLI tool                               | commander.js + ora             | yargs, inquirer                       | Lightweight, good DX, streaming output support                |
| Email processing                       | Resend (inbound) + custom      | SendGrid, Mailgun                     | Already using Resend for outbound, unified provider           |

### 18.2 Arsitektur Decision Records (ADR)

| **ADR#** | **Keputusan** | **Konteks** | **Konsekuensi** |
|----------|---------------|-------------|-----------------|
| ADR-001  | Hybrid client/server processing | Beberapa operasi PDF ringan (merge, split) bisa di-browser, yang berat (compress, OCR) perlu server | Client tools = zero latency + privacy; Server tools = more powerful but needs upload |
| ADR-002  | 3-tier LLM fallback (enowxAI → OpenRouter → 9Router) | Single provider = single point of failure; AI features harus reliable | Complexity routing logic, tapi near-zero downtime untuk AI features |
| ADR-003  | Supabase untuk auth + database | Sudah standby di stack, PostgreSQL included, real-time support | Vendor dependency, tapi migration path jelas (standard PostgreSQL) |
| ADR-004  | HostData.id VPS untuk OpenClaw | Railway free tier insufficient untuk always-on agent; Indonesian provider = local support | Separate infrastructure management, tapi dedicated resources |
| ADR-005  | Phase-gated development | AI-driven development = unpredictable velocity; time-based deadlines tidak realistis | Slower perceived progress, tapi higher quality per release |
| ADR-006  | Freemium dengan Pro Rp 19.900 | Indonesian market price-sensitive; kompetitor global terlalu mahal | Low ARPU, tapi high volume potential; sustainable jika conversion > 2% |
| ADR-007  | No native mobile app | PWA covers 95% use cases; native app = 2x maintenance burden | Miss some native features (background processing), tapi acceptable tradeoff |
| ADR-008  | Bahasa Indonesia default, English optional | Target market Indonesia; English = bonus untuk SEO international | Limits international growth, tapi strengthens local positioning |

---

## 19. Referensi Silang (Cross-References)

### 19.1 Dokumen Terkait

| **ID Dokumen** | **Judul**                              | **Relevansi**                                                     |
|----------------|----------------------------------------|-------------------------------------------------------------------|
| PPR-BRD-001    | Business Requirements Document         | Business objectives, functional requirements, success metrics     |
| PPR-PC-001     | Project Charter                        | Scope, deliverables, stakeholders, budget constraints             |
| PPR-PP-001     | Project Plan                           | WBS detail, resource allocation, timeline operasional             |
| PPR-GTM-001    | Go-To-Market Strategy                  | Launch strategy, marketing channels, user acquisition plan        |
| PPR-CLAW-001   | OpenClaw AI Agent                      | Phase 2E spec, 10 autonomous functions, deployment architecture   |
| PPR-ADM-001    | Admin Dashboard Spec                   | Phase 2F spec, 10 admin modules, unified monitoring panel         |

### 19.2 Mapping Roadmap ke Dokumen

| **Fase Roadmap** | **BRD Section**          | **Project Plan Section** | **GTM Section**          |
|------------------|--------------------------|--------------------------|--------------------------|
| MVP 0.1          | §3 Functional Req        | §3 WBS (M01-M11)        | §2 Launch Strategy       |
| MVP 0.2          | §3.2 Future Req          | §3 WBS (M12-M22)        | §3 Growth Strategy       |
| MVP 0.3          | §3.3 UX Requirements     | §4 Resource Plan         | §3 Growth Strategy       |
| MVP 0.4          | §4 Business Model        | §4 Resource Plan         | §4 Monetization          |
| Fase 2           | §5 AI Vision             | —                        | §5 Expansion             |
| Fase 3           | §5 AI Vision             | —                        | §5 Expansion             |
| Fase 4           | §6 Indonesia Deep        | —                        | §6 Enterprise            |
| Fase 5           | §7 Scale Vision          | —                        | §7 Ecosystem             |

### 19.3 Traceability

Setiap milestone dalam roadmap ini dapat di-trace ke:
- **Tasks:** PAPYR-001 — PAPYR-089 (MVP 0.1, completed) + tasks TBD (MVP 0.2+)
- **Requirements:** Functional requirements di PPR-BRD-001
- **Test Cases:** Test plan di PPR-TP-001
- **Release Notes:** PPR-RN-001

### 19.4 Feature Count Verification

| **Fase** | **Sub-fase** | **Fitur Count** | **Verified** |
|----------|--------------|-----------------|--------------|
| MVP 0.3  | Phase 3A     | 4               | ✅           |
| MVP 0.3  | Phase 3B     | 5               | ✅           |
| MVP 0.3  | Phase 3C     | 6               | ✅           |
| MVP 0.3  | Phase 3D     | 5               | ✅           |
| MVP 0.3  | Phase 3E     | 3               | ✅           |
| **MVP 0.3 Total** | | **23**          | ✅           |
| MVP 0.4  | Phase 4A     | 4               | ✅           |
| MVP 0.4  | Phase 4B     | 4               | ✅           |
| MVP 0.4  | Phase 4C     | 2               | ✅           |
| MVP 0.4  | Phase 4D     | 3               | ✅           |
| MVP 0.4  | Phase 4E     | 5               | ✅           |
| **MVP 0.4 Total** | | **18**          | ✅           |
| Fase 2   | F2A          | 5               | ✅           |
| Fase 2   | F2B          | 9               | ✅           |
| Fase 2   | F2C          | 1               | ✅           |
| Fase 2   | F2D          | 7               | ✅           |
| **Fase 2 Total** | | **22**           | ✅           |
| Fase 3   | F3A          | 4               | ✅           |
| Fase 3   | F3B          | 6               | ✅           |
| Fase 3   | F3C          | 3               | ✅           |
| Fase 3   | F3D          | 5               | ✅           |
| Fase 3   | F3E          | 4               | ✅           |
| **Fase 3 Total** | | **22**           | ✅           |
| Fase 4   | F4A          | 6               | ✅           |
| Fase 4   | F4B          | 3               | ✅           |
| Fase 4   | F4C          | 3               | ✅           |
| Fase 4   | F4D          | 2               | ✅           |
| **Fase 4 Total** | | **14**           | ✅           |
| Fase 5   | F5A          | 2               | ✅           |
| Fase 5   | F5B          | 3               | ✅           |
| Fase 5   | F5C          | 5               | ✅           |
| Fase 5   | F5D          | 4               | ✅           |
| **Fase 5 Total** | | **14**           | ✅           |
| **GRAND TOTAL (MVP 0.3 - Fase 5)** | | **113** | ✅ |

> **Catatan:** Total 113 fitur baru + 1 fitur implisit (LLM infrastructure setup di Fase 2) = 114 fitur terklasifikasi sesuai target dokumen.

### 19.5 Glossary

| **Istilah** | **Definisi** |
|-------------|--------------|
| MAU | Monthly Active Users — pengguna unik per bulan |
| MRR | Monthly Recurring Revenue — pendapatan berulang bulanan |
| LLM | Large Language Model — model AI untuk text generation |
| PWA | Progressive Web App — web app yang bisa di-install |
| TTFB | Time to First Byte — metrik kecepatan server |
| CLS | Cumulative Layout Shift — metrik stabilitas visual |
| WCAG | Web Content Accessibility Guidelines |
| PDF/A | PDF for Archival — format PDF untuk arsip jangka panjang |
| OCR | Optical Character Recognition — pengenalan teks dari gambar |
| RAG | Retrieval-Augmented Generation — teknik AI untuk Q&A berbasis dokumen |
| NER | Named Entity Recognition — deteksi entitas dalam teks |
| PSrE | Penyelenggara Sertifikasi Elektronik |
| BSrE | Badan Siber dan Sandi Negara |
| e-Meterai | Meterai elektronik resmi Indonesia (Peruri) |
| NPWP | Nomor Pokok Wajib Pajak |
| NIK | Nomor Induk Kependudukan |
| KTP | Kartu Tanda Penduduk |
| SIM | Surat Izin Mengemudi |
| UU PDP | Undang-Undang Perlindungan Data Pribadi |
| 9Router | npm package OpenAI-compatible router di localhost:20128 |
| enowxAI | Primary LLM provider untuk Papyr (load balanced) |
| OpenRouter | LLM aggregator sebagai fallback #1 |
| OpenClaw | Sistem AI agent otonom untuk operasional Papyr |

---

## 20. Ringkasan Perubahan v2.3 → v3.0

| **Aspek** | **v2.3** | **v3.0** | **Perubahan** |
|-----------|----------|----------|---------------|
| Total Fase | 5 (MVP 0.1, 0.2, 0.3, Fase 2, Fase 3) | 7 (MVP 0.1, 0.2, 0.3, 0.4, Fase 2, 3, 4, 5) | +2 fase baru |
| Total Fitur (baru) | 28 fitur (MVP 0.3 + Fase 2 + Fase 3) | 114 fitur (MVP 0.3 - Fase 5) | +86 fitur |
| MVP 0.3 Fokus | Monetisasi (auth + payment) | Foundation & UX Polish (23 fitur) | Completely different scope |
| MVP 0.4 | Tidak ada | Auth + Monetization + API (18 fitur) | Fase baru |
| Fase 2 | 3 fitur AI (analysis, compress, extract) | 22 fitur AI Core + OpenClaw upgrades | +19 fitur, LLM strategy |
| Fase 3 | 3 fitur Indonesia (e-Meterai, templates, compliance) | 22 fitur AI Advanced + Integrations | Completely different scope |
| Fase 4 | Tidak ada | Indonesia Deep + Enterprise (14 fitur) | Fase baru (old Fase 3 content moved here) |
| Fase 5 | Tidak ada | Scale + Ecosystem (14 fitur) | Fase baru |
| LLM Strategy | "OpenAI/Gemini/lokal" (vague) | enowxAI + OpenRouter + 9Router (specific) | Concrete 3-tier strategy |
| Milestone Range | M01-M33 | M01-M78 | +45 milestones |
| Gate Conditions | 4 gates | 7 gates | +3 gates (more granular) |
| Label Distribution | 39 total | 137 total | +98 classified features |

**Alasan Rewrite:**
1. MVP 0.3 lama (monetisasi) terlalu premature — perlu UX polish terlebih dahulu sebelum minta user bayar
2. AI landscape berubah drastis — perlu strategi LLM yang konkret (bukan "OpenAI atau Gemini")
3. Visi jangka panjang perlu diperluas — Indonesia Deep dan Scale/Ecosystem sebagai fase terpisah
4. 9Router sebagai fallback strategy memberikan cost optimization yang signifikan
5. OpenClaw sudah mature — perlu upgrade path yang jelas (F2D)

---

## 21. Proyeksi Biaya Infrastruktur per Fase

| **Fase** | **Vercel** | **Railway/VPS** | **R2** | **LLM** | **Other** | **Total/bulan** |
|----------|------------|-----------------|--------|---------|-----------|-----------------|
| MVP 0.1  | $0 (free)  | $0 (free)       | $0     | $0      | $0        | **$0-5**        |
| MVP 0.2  | $0 (free)  | $5-20 (Railway) + $10 (VPS) | $0-1 | $5-10 (OpenClaw) | $0 | **$15-41** |
| MVP 0.3  | $0-20      | $10-20 (VPS)    | $0-5   | $5-10   | $5 (monitoring) | **$20-60** |
| MVP 0.4  | $20-50     | $20-50          | $5-10  | $10-20  | $20 (payment fees) | **$75-150** |
| Fase 2   | $50-100    | $50-100         | $10-20 | $50-200 | $20       | **$180-440**    |
| Fase 3   | $100-200   | $100-200        | $20-50 | $100-300| $50       | **$370-800**    |
| Fase 4   | $200-300   | $200-300        | $50-100| $200-500| $100      | **$750-1300**   |
| Fase 5   | $300-500   | $300-500        | $100+  | $300-700| $200      | **$1200-1900**  |

> **Catatan:** Proyeksi berdasarkan asumsi pertumbuhan linear. Biaya aktual bergantung pada traffic dan usage patterns. Revenue harus > cost mulai Fase 2 (gate condition).

---

## 22. Persetujuan Dokumen

| **Peran**                    | **Nama**                         | **Tanggal**  | **Status**   |
|------------------------------|----------------------------------|--------------|--------------|
| Product Owner                | Muhammad Fa'iz Zulfikar          | Mei 2026     | Approved     |
| AI Agent                     | OpenCode/Sisyphus                | Mei 2026     | Approved     |

---

*Dokumen ini bersifat rahasia dan hanya untuk penggunaan internal serta keperluan investor. Distribusi tanpa izin tertulis dari Product Owner dilarang.*

*— Akhir Dokumen —*
