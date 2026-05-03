# Papyr

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

# Manual Operasi Internal (Internal Operations Manual)

Version 1.0 | Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

| Field | Value |
|---|---|
| **Judul Dokumen** | Manual Operasi Internal — Papyr |
| **ID Dokumen** | PPR-OM-001 |
| **Versi** | 1.0 |
| **Status** | Draft |
| **Tanggal Dibuat** | Juni 2025 |
| **Terakhir Diubah** | Juni 2025 |
| **Penulis** | AI Agent (OpenCode/Sisyphus) |
| **Ditinjau Oleh** | Product Owner (Muhammad Fa'iz Zulfikar) |
| **Disetujui Oleh** | Product Owner |
| **Kerahasiaan** | Confidential — Internal & Investor Use Only |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi |
|---|---|---|---|
| 1.0 | Juni 2025 | AI Agent (OpenCode/Sisyphus) | Draft awal — Manual Operasi Internal lengkap untuk model operasi AI-driven Papyr |

---

## Referensi Silang

| ID Dokumen | Judul | Relevansi |
|---|---|---|
| PPR-DR-001 | Deployment Runbook — Papyr | Prosedur deployment detail, rollback, dan verifikasi post-deployment |
| PPR-IR-001 | Incident Response Plan — Papyr | Prosedur respons insiden, eskalasi, dan pemulihan layanan |
| PPR-SP-001 | Kebijakan Keamanan — Papyr | Standar keamanan, kontrol akses, dan kebijakan privasi data |
| PPR-MP-001 | Maintenance Plan — Papyr | Jadwal pemeliharaan, strategi update, dan lifecycle management |
| PPR-CP-001 | Cost Projection — Papyr | Proyeksi biaya infrastruktur dan analisis break-even |
| PPR-TDD-001 | Technical Design Document — Papyr | Arsitektur teknis dan keputusan desain sistem |

---

## Daftar Isi

1. [Ringkasan Operasional](#1-ringkasan-operasional)
2. [Model Operasi](#2-model-operasi)
3. [Tugas Harian](#3-tugas-harian)
4. [Tugas Mingguan](#4-tugas-mingguan)
5. [Tugas Bulanan](#5-tugas-bulanan)
6. [Prosedur Deployment](#6-prosedur-deployment)
7. [Manajemen Konfigurasi](#7-manajemen-konfigurasi)
8. [Manajemen Storage](#8-manajemen-storage)
9. [Manajemen Dependensi](#9-manajemen-dependensi)
10. [Prosedur Backup & Recovery](#10-prosedur-backup--recovery)
11. [Monitoring & Alerting](#11-monitoring--alerting)
12. [Prosedur Keamanan Rutin](#12-prosedur-keamanan-rutin)
13. [Eskalasi & Komunikasi](#13-eskalasi--komunikasi)
14. [Persetujuan Dokumen](#14-persetujuan-dokumen)

---

## 1. Ringkasan Operasional

### 1.1 Tujuan Dokumen

Dokumen ini mendefinisikan seluruh prosedur operasional internal untuk menjaga ketersediaan, keamanan, dan performa layanan Papyr (mypapyr.com). Manual ini menjadi panduan utama bagi AI Agent (OpenClaw) dan Product Owner dalam menjalankan operasi harian, mingguan, dan bulanan secara konsisten dan terukur.

### 1.2 Ruang Lingkup

Manual ini mencakup seluruh aspek operasional produksi Papyr:

| Aspek | Cakupan |
|---|---|
| **Monitoring** | Health check, log review, metrik performa, analytics |
| **Deployment** | CI/CD pipeline, prosedur deploy, rollback |
| **Konfigurasi** | Environment variables, secrets, domain management |
| **Storage** | Cloudflare R2 lifecycle, cleanup, kapasitas |
| **Dependensi** | npm packages, pip packages, strategi update |
| **Keamanan** | Audit rutin, vulnerability scanning, compliance |
| **Backup** | Strategi backup kode, konfigurasi, dan data |
| **Eskalasi** | Jalur komunikasi, severity levels, response time |

### 1.3 Audiens

| Audiens | Peran dalam Operasi |
|---|---|
| **AI Agent (OpenClaw)** | Pelaksana utama seluruh tugas operasional harian, mingguan, dan bulanan |
| **Product Owner (Muhammad Fa'iz Zulfikar)** | Pengambil keputusan strategis, approver perubahan kritis, eskalasi akhir |
| **Investor/Partner** | Evaluasi kematangan operasional dan governance produk |

### 1.4 Ringkasan Infrastruktur

| Komponen | Platform | Tier | Biaya |
|---|---|---|---|
| **Frontend** | Vercel (Next.js 16, TypeScript, Tailwind v4) | Free | $0/bulan |
| **Backend** | Railway (FastAPI, Python 3.11, Ghostscript, PyMuPDF) | Starter | ~$5/bulan |
| **Storage** | Cloudflare R2 (Object Storage) | Free (10 GB/bulan) | $0/bulan |
| **Domain** | mypapyr.com (Hostinger) | — | ~$1/bulan (amortisasi tahunan) |
| **Repository** | GitHub (fazulfi/papyr) | Free | $0/bulan |
| **Analytics** | Vercel Analytics + Speed Insights | Free tier | $0/bulan |
| **Total** | — | — | **~$0-6/bulan** |

### 1.5 Prinsip Operasional

| # | Prinsip | Deskripsi |
|---|---|---|
| 1 | **AI-First Operations** | Seluruh tugas operasional rutin dijalankan oleh OpenClaw secara otonom |
| 2 | **Human Oversight** | Product Owner mereview, menyetujui, dan mengeskalasi keputusan kritis |
| 3 | **Zero Manual Server Management** | Seluruh infrastruktur berjalan di PaaS — tidak ada server yang dikelola manual |
| 4 | **Privacy by Default** | File pengguna otomatis dihapus (maks 60 menit), tanpa login, tanpa tracking invasif |
| 5 | **Cost Discipline** | Operasi dijaga pada biaya minimal (~$0-5/bulan, excl domain) tanpa mengorbankan ketersediaan |
| 6 | **Automation Over Documentation** | Proses yang bisa diotomasi harus diotomasi, bukan hanya didokumentasikan |

---

## 2. Model Operasi

### 2.1 Gambaran Umum Model AI-Driven

Papyr mengadopsi model operasi **AI-driven with human oversight** — sebuah pendekatan di mana 100% pengembangan dan operasi rutin dijalankan oleh AI Agent (OpenClaw), sementara Product Owner bertindak sebagai pengambil keputusan strategis dan approver akhir.

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODEL OPERASI PAPYR                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌───────────────┐         ┌───────────────────────┐          │
│   │   OpenClaw     │────────▶│   Tugas Operasional   │          │
│   │   (AI Agent)   │         │   Harian/Mingguan/    │          │
│   │                │         │   Bulanan             │          │
│   └───────┬───────┘         └───────────┬───────────┘          │
│           │                             │                       │
│           │  Eskalasi &                 │  Laporan &            │
│           │  Persetujuan                │  Rekomendasi          │
│           ▼                             ▼                       │
│   ┌───────────────────────────────────────────────┐            │
│   │          Product Owner                         │            │
│   │   (Muhammad Fa'iz Zulfikar)                    │            │
│   │                                                │            │
│   │   • Review & approve perubahan kritis          │            │
│   │   • Keputusan strategis & roadmap              │            │
│   │   • Eskalasi akhir untuk insiden               │            │
│   └────────────────────────────────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Pembagian Tanggung Jawab

| Aktivitas | OpenClaw (AI Agent) | Product Owner |
|---|---|---|
| Monitoring harian (logs, health, metrics) | ✅ Pelaksana | 📋 Review laporan |
| Deployment ke production | ✅ Pelaksana (git push) | ✅ Approver (merge to main) |
| Dependency updates (minor/patch) | ✅ Pelaksana | 📋 Review PR |
| Dependency updates (major) | ✅ Proposer | ✅ Approver |
| Security vulnerability fix | ✅ Pelaksana | ✅ Approver |
| Incident response (P2-P3) | ✅ Pelaksana otonom | 📋 Notifikasi |
| Incident response (P1-P2) | ✅ Pelaksana awal | ✅ Eskalasi & keputusan |
| Cost review & optimization | ✅ Analisis & rekomendasi | ✅ Keputusan |
| Roadmap & feature planning | ✅ Implementasi | ✅ Keputusan strategis |
| Konfigurasi secrets/env vars | ✅ Proposer | ✅ Approver & executor |
| Backup & recovery | ✅ Pelaksana | 📋 Verifikasi |

### 2.3 Siklus Operasional

| Frekuensi | Aktivitas Utama | Pelaksana | Output |
|---|---|---|---|
| **Harian** | Health check, log review, storage metrics, analytics | OpenClaw | Checklist status ✅/❌ |
| **Mingguan** | Dependency review, performance check, analytics summary | OpenClaw | Laporan mingguan |
| **Bulanan** | Cost review, security audit, roadmap progress | OpenClaw + Product Owner | Laporan bulanan + keputusan |
| **Per Deployment** | Build, deploy, verify, rollback (jika perlu) | OpenClaw | Deployment report |
| **Ad-hoc** | Incident response, hotfix, emergency patch | OpenClaw + Product Owner | Incident report |

---

## 3. Tugas Harian

### 3.1 Checklist Harian OpenClaw

Tugas harian dijalankan oleh OpenClaw setiap hari kerja. Setiap item harus diverifikasi dan dicatat statusnya.

#### 3.1.1 Health Check Infrastruktur

| # | Item Pemeriksaan | Metode | Kriteria Sukses | Prioritas |
|---|---|---|---|---|
| D-01 | Backend health endpoint | `GET https://papyr-production.up.railway.app/health` | Response `200 OK` dalam < 2 detik | 🔴 Kritis |
| D-02 | Frontend accessibility | `GET https://mypapyr.com` | Response `200 OK`, halaman ter-render | 🔴 Kritis |
| D-03 | API connectivity test | `GET https://papyr-production.up.railway.app/connectivity` | Semua service connected | 🔴 Kritis |
| D-04 | SSL/TLS certificate validity | Periksa expiry date mypapyr.com | Sisa > 14 hari | 🟡 Tinggi |

#### 3.1.2 Log Review

| # | Item Pemeriksaan | Sumber | Yang Dicari | Prioritas |
|---|---|---|---|---|
| D-05 | Railway backend logs | Railway Dashboard → Logs | Error 5xx, crash, OOM, timeout | 🔴 Kritis |
| D-06 | Vercel deployment logs | Vercel Dashboard → Deployments | Build failure, runtime error | 🟡 Tinggi |
| D-07 | R2 storage access logs | Cloudflare Dashboard → R2 | Access denied, quota warning | 🟡 Tinggi |
| D-08 | Rate limiting events | Railway logs (filter: `rate_limit`) | Spike abnormal, potential abuse | 🟢 Normal |

#### 3.1.3 Metrik & Analytics

| # | Item Pemeriksaan | Sumber | Yang Dicari | Prioritas |
|---|---|---|---|---|
| D-09 | Vercel Analytics dashboard | Vercel Dashboard → Analytics | Traffic anomaly, error rate spike | 🟡 Tinggi |
| D-10 | Speed Insights | Vercel Dashboard → Speed Insights | Core Web Vitals degradation | 🟢 Normal |
| D-11 | R2 storage usage | Cloudflare Dashboard → R2 → Metrics | Penggunaan mendekati 10 GB limit | 🟡 Tinggi |
| D-12 | Railway resource usage | Railway Dashboard → Metrics | CPU/Memory mendekati limit | 🟡 Tinggi |

### 3.2 Template Laporan Harian

```
## Laporan Operasional Harian — Papyr
Tanggal: [YYYY-MM-DD]
Pelaksana: OpenClaw (AI Agent)

### Status Infrastruktur
| Komponen       | Status | Catatan |
|----------------|--------|---------|
| Backend API    | ✅/❌  |         |
| Frontend       | ✅/❌  |         |
| R2 Storage     | ✅/❌  |         |
| SSL/TLS        | ✅/❌  |         |

### Log Review
- Railway: [Bersih / Ada issue — detail]
- Vercel: [Bersih / Ada issue — detail]
- R2: [Bersih / Ada issue — detail]

### Metrik
- Traffic: [normal / anomaly]
- Error rate: [< 1% / elevated — detail]
- R2 usage: [X GB / 10 GB]
- Railway CPU/Mem: [normal / elevated]

### Tindakan Diperlukan
- [ ] [Deskripsi tindakan jika ada]

### Eskalasi
- [Tidak ada / Ya — detail ke Product Owner]
```

### 3.3 Kriteria Eskalasi Harian

| Kondisi | Tindakan |
|---|---|
| Backend health check gagal > 5 menit | Eskalasi ke Product Owner segera |
| Frontend tidak accessible > 5 menit | Eskalasi ke Product Owner segera |
| Error rate > 5% dalam 1 jam | Investigasi + eskalasi jika tidak terselesaikan dalam 30 menit |
| R2 storage > 8 GB (80% kapasitas) | Notifikasi Product Owner, jalankan cleanup manual |
| Railway CPU/Memory > 80% sustained | Notifikasi Product Owner, evaluasi scaling |

---

## 4. Tugas Mingguan

### 4.1 Checklist Mingguan OpenClaw

Tugas mingguan dijalankan setiap hari Senin (atau hari kerja pertama dalam minggu). Hasil dilaporkan kepada Product Owner.

#### 4.1.1 Review Dependensi

| # | Item Pemeriksaan | Metode | Kriteria | Prioritas |
|---|---|---|---|---|
| W-01 | npm outdated check (frontend) | `npm outdated` di direktori `frontend/` | Identifikasi patch/minor updates | 🟡 Tinggi |
| W-02 | pip outdated check (backend) | `pip list --outdated` di direktori `backend/` | Identifikasi patch/minor updates | 🟡 Tinggi |
| W-03 | npm audit (frontend) | `npm audit` di direktori `frontend/` | Zero high/critical vulnerabilities | 🔴 Kritis |
| W-04 | pip audit (backend) | `pip-audit` atau `safety check` | Zero high/critical vulnerabilities | 🔴 Kritis |
| W-05 | GitHub Dependabot alerts | GitHub → Security → Dependabot | Review & resolve semua alerts | 🔴 Kritis |

#### 4.1.2 Performance Check

| # | Item Pemeriksaan | Metode | Target | Prioritas |
|---|---|---|---|---|
| W-06 | Core Web Vitals (LCP) | Vercel Speed Insights / PageSpeed Insights | < 2.5 detik | 🟡 Tinggi |
| W-07 | Core Web Vitals (FID/INP) | Vercel Speed Insights / PageSpeed Insights | < 200 ms | 🟡 Tinggi |
| W-08 | Core Web Vitals (CLS) | Vercel Speed Insights / PageSpeed Insights | < 0.1 | 🟡 Tinggi |
| W-09 | Backend API response time | Railway Metrics / manual test | P95 < 5 detik (compress), P95 < 2 detik (lainnya) | 🟡 Tinggi |
| W-10 | Lighthouse score (mobile) | Chrome DevTools → Lighthouse | Performance > 80, Accessibility > 90 | 🟢 Normal |

#### 4.1.3 Analytics Summary

| # | Item Pemeriksaan | Sumber | Yang Dilaporkan | Prioritas |
|---|---|---|---|---|
| W-11 | Traffic mingguan | Vercel Analytics | Total visitors, page views, unique visitors | 🟢 Normal |
| W-12 | Tool usage breakdown | Vercel Analytics (custom events) | Jumlah started/completed/failed per tool | 🟡 Tinggi |
| W-13 | Error rate mingguan | Vercel Analytics + Railway logs | Persentase error vs total requests | 🟡 Tinggi |
| W-14 | Top referrers | Vercel Analytics | Sumber traffic utama | 🟢 Normal |
| W-15 | Geographic distribution | Vercel Analytics | Distribusi pengguna per negara/kota | 🟢 Normal |

### 4.2 Template Laporan Mingguan

```
## Laporan Operasional Mingguan — Papyr
Periode: [YYYY-MM-DD] s/d [YYYY-MM-DD]
Pelaksana: OpenClaw (AI Agent)

### Ringkasan Status
| Aspek              | Status | Catatan |
|--------------------|--------|---------|
| Uptime             | XX.X%  |         |
| Error Rate         | X.X%   |         |
| Dependency Health  | ✅/⚠️  |         |
| Performance (CWV)  | ✅/⚠️  |         |

### Dependensi
- Frontend: [X packages outdated, Y vulnerabilities]
- Backend: [X packages outdated, Y vulnerabilities]
- Tindakan: [Update dilakukan / Dijadwalkan / Tidak perlu]

### Performance
| Metrik | Nilai | Target | Status |
|--------|-------|--------|--------|
| LCP    |       | < 2.5s | ✅/❌  |
| INP    |       | < 200ms| ✅/❌  |
| CLS    |       | < 0.1  | ✅/❌  |

### Analytics
- Total visitors: [X]
- Tool usage: Compress [X], Merge [X], Split [X], ...
- Error rate: [X%]
- Top referrer: [X]

### Rekomendasi
1. [Rekomendasi jika ada]

### Eskalasi ke Product Owner
- [Tidak ada / Ya — detail]
```

---

## 5. Tugas Bulanan

### 5.1 Checklist Bulanan

Tugas bulanan dijalankan pada minggu pertama setiap bulan. Memerlukan kolaborasi antara OpenClaw dan Product Owner.

#### 5.1.1 Cost Review

| # | Item Pemeriksaan | Metode | Kriteria | Pelaksana |
|---|---|---|---|---|
| M-01 | Railway billing review | Railway Dashboard → Usage & Billing | Biaya ≤ $5/bulan | OpenClaw |
| M-02 | Vercel usage review | Vercel Dashboard → Usage | Dalam batas free tier | OpenClaw |
| M-03 | Cloudflare R2 usage review | Cloudflare Dashboard → R2 → Usage | Dalam batas free tier (10 GB/bulan) | OpenClaw |
| M-04 | Domain renewal status | Hostinger / Registrar | Sisa > 60 hari sebelum expiry | OpenClaw |
| M-05 | Total cost vs budget | Kalkulasi manual | Total ≤ $0-6/bulan | OpenClaw → Product Owner |

#### 5.1.2 Security Audit

| # | Item Pemeriksaan | Metode | Kriteria | Pelaksana |
|---|---|---|---|---|
| M-06 | Full dependency audit (frontend) | `npm audit --audit-level=moderate` | Zero moderate+ vulnerabilities | OpenClaw |
| M-07 | Full dependency audit (backend) | `pip-audit` + `safety check` | Zero moderate+ vulnerabilities | OpenClaw |
| M-08 | CORS configuration review | Periksa `backend/main.py` CORS settings | Hanya origin yang diizinkan | OpenClaw |
| M-09 | Rate limiting effectiveness | Analisis log rate limit events | Tidak ada bypass terdeteksi | OpenClaw |
| M-10 | R2 signed URL configuration | Periksa expiry time dan access control | Signed URL expiry ≤ 1 jam | OpenClaw |
| M-11 | Environment variables audit | Review semua env vars di Vercel + Railway | Tidak ada secret yang expired/unused | OpenClaw → Product Owner |
| M-12 | GitHub repository security | GitHub → Security → Overview | Zero open security advisories | OpenClaw |

#### 5.1.3 Roadmap Progress

| # | Item Pemeriksaan | Metode | Output | Pelaksana |
|---|---|---|---|---|
| M-13 | Milestone completion status | GitHub Issues/Projects | Persentase completion per milestone | OpenClaw |
| M-14 | Technical debt assessment | Code review + issue tracking | Daftar tech debt prioritized | OpenClaw |
| M-15 | Feature request review | GitHub Issues (label: enhancement) | Prioritized backlog | OpenClaw → Product Owner |
| M-16 | Competitive landscape check | Manual review kompetitor | Perubahan signifikan di pasar | OpenClaw |

### 5.2 Template Laporan Bulanan

```
## Laporan Operasional Bulanan — Papyr
Periode: [Bulan YYYY]
Pelaksana: OpenClaw (AI Agent) + Product Owner

### Ringkasan Eksekutif
[2-3 kalimat ringkasan status operasional bulan ini]

### Biaya Infrastruktur
| Komponen       | Biaya Aktual | Budget | Status |
|----------------|-------------|--------|--------|
| Railway        | $X.XX       | $5.00  | ✅/⚠️  |
| Vercel         | $0.00       | $0.00  | ✅     |
| Cloudflare R2  | $0.00       | $0.00  | ✅     |
| Domain         | $X.XX       | $1.00  | ✅     |
| **Total**      | **$X.XX**   | **$6** | ✅/⚠️  |

### Keamanan
- Vulnerabilities ditemukan: [X]
- Vulnerabilities diperbaiki: [X]
- Audit status: [Passed / Action Required]

### Roadmap
| Milestone | Target | Aktual | Status |
|-----------|--------|--------|--------|
| [MXX]     |        |        | ✅/🔄/❌ |

### Keputusan yang Diperlukan
1. [Keputusan yang perlu diambil Product Owner]

### Rencana Bulan Depan
1. [Prioritas operasional bulan depan]
```

---

## 6. Prosedur Deployment

### 6.1 Arsitektur Deployment

Papyr menggunakan model **PaaS auto-deploy** — tidak ada manajemen server manual. Deployment dipicu oleh git push ke branch `main`.

```
┌──────────────┐     git push      ┌──────────────┐     auto-deploy     ┌──────────────┐
│   develop    │ ──── merge ──────▶ │    main      │ ──────────────────▶ │  Production  │
│   (branch)   │     (PR review)    │   (branch)   │                     │  (Vercel +   │
│              │                    │              │                     │   Railway)   │
└──────────────┘                    └──────────────┘                     └──────────────┘
```

| Komponen | Trigger | Platform | Waktu Deploy |
|---|---|---|---|
| **Frontend** | Push/merge ke `main` (path: `frontend/`) | Vercel | ~60-90 detik |
| **Backend** | Push/merge ke `main` (path: `backend/`) | Railway | ~120-180 detik |

### 6.2 Prosedur Deployment Frontend (Vercel)

#### 6.2.1 Pre-Deployment

| Langkah | Perintah / Aksi | Verifikasi |
|---|---|---|
| 1. Pastikan branch `develop` up-to-date | `git pull origin develop` | Tidak ada conflict |
| 2. Jalankan build lokal | `npm run build` (di `frontend/`) | Build sukses tanpa error |
| 3. Jalankan linter | `npm run lint` (di `frontend/`) | Zero errors |
| 4. Verifikasi environment variables | Periksa `.env.local` vs Vercel env vars | Semua variabel tersedia |
| 5. Buat Pull Request | `develop` → `main` | PR description lengkap |

#### 6.2.2 Deployment

| Langkah | Aksi | Verifikasi |
|---|---|---|
| 1. Review & approve PR | Product Owner approve di GitHub | PR approved |
| 2. Merge PR ke `main` | Squash merge di GitHub | Merge sukses |
| 3. Vercel auto-deploy | Otomatis — monitor di Vercel Dashboard | Build status: ✅ Ready |
| 4. Preview URL check | Buka Vercel preview URL | Halaman ter-render dengan benar |

#### 6.2.3 Post-Deployment Verification

| # | Verifikasi | Metode | Kriteria Sukses |
|---|---|---|---|
| 1 | Homepage accessible | `GET https://mypapyr.com` | Response 200, render OK |
| 2 | Semua tool pages accessible | Buka `/compress`, `/merge`, `/split`, `/image-to-pdf`, `/pdf-to-image`, `/rotate` | Semua halaman render OK |
| 3 | API connectivity | Test compress file kecil | Upload → process → download berhasil |
| 4 | Analytics tracking | Vercel Analytics → Real-time | Events tercatat |
| 5 | Mobile responsiveness | Chrome DevTools → Mobile view | Layout tidak rusak |

### 6.3 Prosedur Deployment Backend (Railway)

#### 6.3.1 Pre-Deployment

| Langkah | Perintah / Aksi | Verifikasi |
|---|---|---|
| 1. Pastikan branch `develop` up-to-date | `git pull origin develop` | Tidak ada conflict |
| 2. Jalankan tests lokal | `pytest` (di `backend/`) | Semua test pass |
| 3. Verifikasi Dockerfile | Review `backend/Dockerfile` | Tidak ada perubahan breaking |
| 4. Verifikasi environment variables | Periksa `.env` vs Railway env vars | Semua variabel tersedia |
| 5. Buat Pull Request | `develop` → `main` | PR description lengkap |

#### 6.3.2 Deployment

| Langkah | Aksi | Verifikasi |
|---|---|---|
| 1. Review & approve PR | Product Owner approve di GitHub | PR approved |
| 2. Merge PR ke `main` | Squash merge di GitHub | Merge sukses |
| 3. Railway auto-deploy | Otomatis — monitor di Railway Dashboard | Deploy status: ✅ Success |
| 4. Container health check | Railway auto health check | Container running |

#### 6.3.3 Post-Deployment Verification

| # | Verifikasi | Metode | Kriteria Sukses |
|---|---|---|---|
| 1 | Health endpoint | `GET /health` | Response 200, `{"status": "healthy"}` |
| 2 | Connectivity test | `GET /connectivity` | Semua service connected |
| 3 | Compress test | Upload PDF kecil ke `/compress` | File terkompresi, download berhasil |
| 4 | PDF to Image test | Upload PDF ke `/pdf-to-image` | Gambar dihasilkan, download berhasil |
| 5 | R2 connectivity | Verifikasi upload/download ke R2 | Signed URL berfungsi |

### 6.4 Prosedur Rollback

#### 6.4.1 Rollback Frontend (Vercel)

| Langkah | Aksi | Catatan |
|---|---|---|
| 1. Identifikasi deployment bermasalah | Vercel Dashboard → Deployments | Catat deployment ID |
| 2. Pilih deployment sebelumnya yang stabil | Vercel Dashboard → Deployments → pilih versi stabil | Verifikasi tanggal dan commit |
| 3. Klik "Promote to Production" | Vercel Dashboard → deployment stabil → ⋯ → Promote | Instant rollback (< 10 detik) |
| 4. Verifikasi rollback | Buka mypapyr.com | Halaman kembali ke versi stabil |
| 5. Investigasi root cause | Review build logs dan kode | Dokumentasikan temuan |

#### 6.4.2 Rollback Backend (Railway)

| Langkah | Aksi | Catatan |
|---|---|---|
| 1. Identifikasi deployment bermasalah | Railway Dashboard → Deployments | Catat deployment ID |
| 2. Rollback via Railway | Railway Dashboard → deployment sebelumnya → Rollback | Railway menyimpan deployment history |
| 3. Verifikasi rollback | `GET /health` | Response 200 |
| 4. Jika Railway rollback tidak tersedia | `git revert <commit>` → push ke `main` | Trigger auto-deploy dengan kode reverted |
| 5. Investigasi root cause | Review logs dan kode | Dokumentasikan temuan |

#### 6.4.3 Kriteria Rollback

Rollback harus dilakukan segera jika salah satu kondisi berikut terjadi:

| Kondisi | Severity | Waktu Respons |
|---|---|---|
| Health endpoint gagal setelah deploy | 🔴 P0 | Rollback dalam < 5 menit |
| Error rate > 10% setelah deploy | 🔴 P0 | Rollback dalam < 10 menit |
| Fitur utama (compress/merge/split) tidak berfungsi | 🔴 P1 | Rollback dalam < 15 menit |
| Performance degradation > 50% | 🟡 P2 | Evaluasi dalam 30 menit, rollback jika tidak membaik |
| UI rendering issue (non-blocking) | 🟢 P3 | Hotfix di develop, deploy ulang |

---

## 7. Manajemen Konfigurasi

### 7.1 Environment Variables

#### 7.1.1 Frontend (Vercel)

| Variable | Lokasi | Sensitivity | Rotasi |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Vercel Dashboard → Environment Variables | 🟢 Public | Tidak perlu rotasi |
| `NEXT_PUBLIC_SITE_URL` | Vercel Dashboard → Environment Variables | 🟢 Public | Tidak perlu rotasi |


#### 7.1.2 Backend (Railway)

| Variable | Lokasi | Sensitivity | Rotasi |
|---|---|---|---|
| `R2_ACCOUNT_ID` | Railway Dashboard → Variables | 🟡 Sensitive | Tahunan |
| `R2_ACCESS_KEY_ID` | Railway Dashboard → Variables | 🔴 Secret | Setiap 90 hari |
| `R2_SECRET_ACCESS_KEY` | Railway Dashboard → Variables | 🔴 Secret | Setiap 90 hari |
| `R2_BUCKET_NAME` | Railway Dashboard → Variables | 🟢 Public | Tidak perlu rotasi |
| `R2_PUBLIC_URL` | Railway Dashboard → Variables | 🟢 Public | Tidak perlu rotasi |
| `CORS_ORIGINS` | Railway Dashboard → Variables | 🟡 Sensitive | Saat domain berubah |
| `MAX_UPLOAD_SIZE_MB` | Railway Dashboard → Variables | 🟢 Public | Saat kebijakan berubah |
| `FILE_RETENTION_MINUTES` | Railway Dashboard → Variables | 🟢 Public | Saat kebijakan berubah |
| `RATE_LIMIT_PER_MINUTE` | Railway Dashboard → Variables | 🟡 Sensitive | Saat kebijakan berubah |

### 7.2 Prosedur Manajemen Secrets

#### 7.2.1 Prinsip Pengelolaan Secret

| # | Prinsip | Deskripsi |
|---|---|---|
| 1 | **Never in code** | Secret tidak boleh ada di source code, commit history, atau file yang di-track git |
| 2 | **Platform-managed** | Semua secret disimpan di platform dashboard (Vercel/Railway), bukan di file lokal |
| 3 | **Least privilege** | Setiap credential hanya memiliki akses minimum yang diperlukan |
| 4 | **Regular rotation** | Secret dengan sensitivity 🔴 dirotasi setiap 90 hari |
| 5 | **Audit trail** | Setiap perubahan secret dicatat di laporan bulanan |

#### 7.2.2 Prosedur Rotasi Secret

| Langkah | Aksi | Pelaksana |
|---|---|---|
| 1. Generate credential baru | Buat API key baru di Cloudflare Dashboard | Product Owner |
| 2. Update di Railway | Railway Dashboard → Variables → update value | Product Owner |
| 3. Verifikasi konektivitas | Test R2 upload/download setelah update | OpenClaw |
| 4. Revoke credential lama | Hapus API key lama di Cloudflare Dashboard | Product Owner |
| 5. Dokumentasi | Catat tanggal rotasi di laporan bulanan | OpenClaw |

### 7.3 Manajemen Domain

| Aspek | Detail |
|---|---|
| **Domain** | mypapyr.com |
| **DNS Provider** | Hostinger |
| **SSL/TLS** | Auto-managed oleh Vercel (Let's Encrypt) |
| **Renewal** | Otomatis — verifikasi bulanan (item M-04) |
| **DNS Records** | A record → Vercel, CNAME → Vercel |

---

## 8. Manajemen Storage

### 8.1 Arsitektur Storage

Papyr menggunakan Cloudflare R2 sebagai satu-satunya object storage untuk file sementara yang diproses di server-side.

| Aspek | Detail |
|---|---|
| **Provider** | Cloudflare R2 |
| **Bucket** | `papyr-files` |
| **Tier** | Free (10 GB storage, 10 juta Class A ops, 1 juta Class B ops per bulan) |
| **Region** | Auto (Cloudflare global network) |
| **Access** | Private bucket, signed URLs untuk download |
| **Retention** | Maksimum 60 menit (default: 60 menit) |

### 8.2 Lifecycle Management

#### 8.2.1 File Lifecycle

```
Upload (API request)
    │
    ▼
┌──────────────────┐
│  R2 Bucket       │
│  papyr-files     │
│                  │
│  file: uuid.pdf  │
│  metadata:       │
│    uploaded_at    │
│    expires_at     │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
 Download   Cleanup Cron
  (signed    (setiap 30 menit)
  URL)      
    │         │
    ▼         ▼
 User gets  File dihapus
 file       dari R2
```

#### 8.2.2 Cleanup Mechanism

| Komponen | Detail |
|---|---|
| **Cleanup cron** | Background task di FastAPI, berjalan setiap 30 menit |
| **Implementasi** | `backend/utils/cleanup.py` → `cleanup_expired_files()` |
| **Trigger** | `backend/main.py` → `_cleanup_loop()` pada startup |
| **Retention** | File dihapus jika `uploaded_at + FILE_RETENTION_MINUTES` telah terlewati |
| **Fallback** | R2 lifecycle rule sebagai safety net (24 jam) |

### 8.3 Monitoring Storage

| Metrik | Threshold | Aksi |
|---|---|---|
| Total storage used | > 5 GB (50%) | 🟢 Monitor — normal |
| Total storage used | > 8 GB (80%) | 🟡 Warning — jalankan cleanup manual, notifikasi Product Owner |
| Total storage used | > 9.5 GB (95%) | 🔴 Kritis — cleanup darurat, evaluasi retention policy |
| Class A operations | > 7 juta (70%) | 🟡 Warning — analisis traffic pattern |
| Class B operations | > 700 ribu (70%) | 🟡 Warning — analisis download pattern |

### 8.4 Prosedur Cleanup Manual

Jika cleanup otomatis tidak memadai atau storage mendekati limit:

| Langkah | Perintah / Aksi | Catatan |
|---|---|---|
| 1. Identifikasi file expired | List objects di R2 bucket, filter by `uploaded_at` | Gunakan Cloudflare Dashboard atau API |
| 2. Jalankan cleanup manual | Trigger `cleanup_expired_files()` via API atau restart backend | Catat jumlah file dihapus |
| 3. Verifikasi storage freed | Periksa R2 metrics setelah cleanup | Storage harus turun |
| 4. Jika masih tinggi | Evaluasi apakah ada file tanpa metadata expiry | Hapus manual jika perlu |
| 5. Dokumentasi | Catat insiden di laporan harian | Evaluasi apakah retention perlu diperketat |

---

## 9. Manajemen Dependensi

### 9.1 Inventaris Dependensi

#### 9.1.1 Frontend (npm)

| Kategori | Package Utama | Fungsi |
|---|---|---|
| **Framework** | `next`, `react`, `react-dom` | Core framework Next.js 16 |
| **Styling** | `tailwindcss` | Utility-first CSS framework v4 |
| **PDF Processing** | `pdf-lib` | Client-side PDF manipulation |
| **UI/UX** | `@dnd-kit/core`, `@dnd-kit/sortable` | Drag-and-drop untuk reorder |
| **Analytics** | `@vercel/analytics`, `@vercel/speed-insights` | Web analytics dan performance |
| **TypeScript** | `typescript`, `@types/*` | Type safety |

#### 9.1.2 Backend (pip)

| Kategori | Package Utama | Fungsi |
|---|---|---|
| **Framework** | `fastapi`, `uvicorn` | ASGI web framework |
| **PDF Processing** | `PyMuPDF` | PDF rendering dan manipulation |
| **Storage** | `boto3` | AWS SDK untuk R2 (S3-compatible) |
| **Validation** | `pydantic` | Data validation dan settings |
| **Security** | `slowapi` | Rate limiting |
| **System** | `ghostscript` (system package) | PDF compression engine |

### 9.2 Strategi Update

| Tipe Update | Frekuensi | Proses | Approver |
|---|---|---|---|
| **Patch** (x.x.X) | Mingguan (otomatis) | OpenClaw update → test → PR | OpenClaw (auto-merge jika test pass) |
| **Minor** (x.X.0) | Mingguan (manual review) | OpenClaw update → test → PR | Product Owner review |
| **Major** (X.0.0) | Bulanan (evaluasi) | OpenClaw analisis breaking changes → proposal → PR | Product Owner approve |
| **Security fix** | Segera (< 24 jam) | OpenClaw patch → test → PR → merge | OpenClaw (kritis) / Product Owner (non-kritis) |

### 9.3 Prosedur Update Dependensi

#### 9.3.1 Frontend (npm)

| Langkah | Perintah | Catatan |
|---|---|---|
| 1. Check outdated | `npm outdated` | Identifikasi packages yang perlu update |
| 2. Check vulnerabilities | `npm audit` | Prioritaskan security fixes |
| 3. Update patch/minor | `npm update` | Otomatis update sesuai semver range |
| 4. Update major (jika perlu) | `npm install <package>@latest` | Satu per satu, test setelah setiap update |
| 5. Build test | `npm run build` | Pastikan build sukses |
| 6. Lint test | `npm run lint` | Pastikan tidak ada error baru |
| 7. Manual smoke test | Buka localhost, test semua tool | Pastikan fungsionalitas utuh |
| 8. Commit & PR | `git commit` → PR ke `develop` | Deskripsi lengkap perubahan |

#### 9.3.2 Backend (pip)

| Langkah | Perintah | Catatan |
|---|---|---|
| 1. Check outdated | `pip list --outdated` | Identifikasi packages yang perlu update |
| 2. Check vulnerabilities | `pip-audit` | Prioritaskan security fixes |
| 3. Update package | `pip install <package>==<version>` | Satu per satu, pin versi eksplisit |
| 4. Update requirements.txt | `pip freeze > requirements.txt` | Pastikan requirements.txt up-to-date |
| 5. Run tests | `pytest` | Pastikan semua test pass |
| 6. Manual smoke test | Test API endpoints lokal | Pastikan fungsionalitas utuh |
| 7. Commit & PR | `git commit` → PR ke `develop` | Deskripsi lengkap perubahan |

### 9.4 Kebijakan Pinning

| Aspek | Kebijakan |
|---|---|
| **Frontend** | Semver range di `package.json` (e.g., `^16.0.0`), exact versions di `package-lock.json` |
| **Backend** | Exact pinning di `requirements.txt` (e.g., `fastapi==0.115.0`) |
| **System packages** | Pinned di `Dockerfile` (e.g., `ghostscript=10.x`) |
| **Lock files** | `package-lock.json` dan `requirements.txt` selalu di-commit |

---

## 10. Prosedur Backup & Recovery

### 10.1 Strategi Backup

Papyr mengadopsi strategi backup yang disesuaikan dengan arsitektur PaaS dan sifat data yang diproses.

| Komponen | Strategi | Frekuensi | Lokasi Backup |
|---|---|---|---|
| **Source code** | Git repository (GitHub) | Setiap commit | GitHub (cloud) + local clone |
| **Konfigurasi (env vars)** | Dokumentasi terenkripsi | Setiap perubahan | Secure notes (offline) |
| **R2 data (file pengguna)** | Tidak di-backup (sementara, maks 60 menit; R2 lifecycle 24 jam sebagai safety net) | — | — |
| **Vercel configuration** | `vercel.json` di repository | Setiap commit | GitHub |
| **Railway configuration** | `railway.json` / `Dockerfile` di repository | Setiap commit | GitHub |
| **Domain DNS records** | Dokumentasi manual | Setiap perubahan | Secure notes (offline) |

### 10.2 Backup Source Code

| Aspek | Detail |
|---|---|
| **Primary** | GitHub repository (fazulfi/papyr) — cloud-hosted, redundant |
| **Secondary** | Local clone di development machine |
| **Branch strategy** | `develop` (active development) + `main` (production) |
| **Protection** | Branch protection rules pada `main` — require PR review |
| **History** | Full git history tersimpan — setiap commit dapat di-restore |

### 10.3 Backup Konfigurasi

| Langkah | Aksi | Frekuensi |
|---|---|---|
| 1. Export Vercel env vars | Screenshot atau copy dari Vercel Dashboard | Setiap perubahan |
| 2. Export Railway env vars | Screenshot atau copy dari Railway Dashboard | Setiap perubahan |
| 3. Simpan secara aman | Simpan di secure notes terenkripsi (offline) | Segera setelah export |
| 4. Verifikasi backup | Pastikan semua variabel tercatat lengkap | Bulanan (item M-11) |

> ⚠️ **PENTING**: Jangan pernah menyimpan backup env vars di repository, cloud storage yang tidak terenkripsi, atau channel komunikasi yang tidak aman.

### 10.4 Prosedur Recovery

#### 10.4.1 Recovery Frontend

| Skenario | Prosedur | Waktu Estimasi |
|---|---|---|
| Vercel project terhapus | Buat project baru → connect GitHub repo → set env vars → deploy | 15-30 menit |
| Build corruption | Rollback ke deployment sebelumnya via Vercel Dashboard | < 5 menit |
| Domain issue | Re-configure DNS di Vercel Dashboard | 5-60 menit (DNS propagation) |

#### 10.4.2 Recovery Backend

| Skenario | Prosedur | Waktu Estimasi |
|---|---|---|
| Railway service terhapus | Buat service baru → connect GitHub repo → set env vars → deploy | 15-30 menit |
| Container crash loop | Review logs → fix issue → redeploy, atau rollback | 10-30 menit |
| R2 bucket issue | Buat bucket baru → update env vars → redeploy | 15-30 menit |

#### 10.4.3 Recovery Penuh (Disaster Recovery)

Untuk prosedur disaster recovery lengkap, rujuk ke **PPR-DR-001 (Deployment Runbook)** yang mencakup:

- Prosedur rebuild seluruh infrastruktur dari nol
- Checklist verifikasi post-recovery
- Kontak darurat dan eskalasi

---

## 11. Monitoring & Alerting

### 11.1 Status Monitoring Saat Ini

| Komponen | Tool | Status | Cakupan |
|---|---|---|---|
| **Frontend performance** | Vercel Analytics + Speed Insights | ✅ Aktif | Traffic, CWV, page views |
| **Backend health** | Railway built-in metrics | ✅ Aktif | CPU, memory, deploy status |
| **Backend logs** | Railway log viewer | ✅ Aktif | Application logs, errors |
| **Storage metrics** | Cloudflare R2 Dashboard | ✅ Aktif | Storage usage, operations |
| **Uptime monitoring** | Manual (daily health check) | ⚠️ Manual | Hanya saat OpenClaw aktif |
| **Error alerting** | Tidak ada | ❌ Belum ada | — |
| **Downtime alerting** | Tidak ada | ❌ Belum ada | — |

### 11.2 Metrik yang Dipantau

| Kategori | Metrik | Sumber | Frekuensi Pemeriksaan |
|---|---|---|---|
| **Availability** | Backend health status | `/health` endpoint | Harian (manual) |
| **Availability** | Frontend accessibility | mypapyr.com | Harian (manual) |
| **Performance** | LCP, INP, CLS | Vercel Speed Insights | Mingguan |
| **Performance** | API response time | Railway metrics | Mingguan |
| **Usage** | Page views, visitors | Vercel Analytics | Mingguan |
| **Usage** | Tool usage (events) | Vercel Analytics (custom events) | Mingguan |
| **Storage** | R2 storage used | Cloudflare Dashboard | Harian |
| **Cost** | Railway billing | Railway Dashboard | Bulanan |
| **Security** | Dependency vulnerabilities | npm audit / pip-audit | Mingguan |

### 11.3 Rekomendasi Peningkatan Monitoring

Berikut rekomendasi untuk meningkatkan monitoring dari status saat ini ke level yang lebih mature:

#### 11.3.1 Prioritas Tinggi (Implementasi Segera)

| # | Rekomendasi | Tool | Biaya | Manfaat |
|---|---|---|---|---|
| R-01 | Uptime monitoring otomatis | UptimeRobot (free tier) atau Better Stack | $0 | Alert otomatis saat downtime, 5-minute interval |
| R-02 | Error tracking | Sentry (free tier, 5K events/bulan) | $0 | Stack trace, error grouping, trend analysis |
| R-03 | Structured logging | Python `structlog` + JSON format | $0 | Searchable logs, better debugging |

#### 11.3.2 Prioritas Sedang (Implementasi Q3-Q4)

| # | Rekomendasi | Tool | Biaya | Manfaat |
|---|---|---|---|---|
| R-04 | Custom dashboard | Grafana Cloud (free tier) | $0 | Unified view semua metrik |
| R-05 | Synthetic monitoring | Checkly (free tier) | $0 | Automated browser tests setiap 30 menit |
| R-06 | Log aggregation | Better Stack Logs (free tier) | $0 | Centralized log search dan alerting |

#### 11.3.3 Prioritas Rendah (Evaluasi Saat Scaling)

| # | Rekomendasi | Tool | Biaya | Manfaat |
|---|---|---|---|---|
| R-07 | APM (Application Performance Monitoring) | Sentry Performance | $0-26/bulan | Distributed tracing, performance profiling |
| R-08 | Real User Monitoring (RUM) | Vercel Analytics Pro | $10/bulan | Detailed user experience data |

### 11.4 Alerting Rules (Target State)

| Alert | Kondisi | Channel | Severity |
|---|---|---|---|
| Backend down | Health check gagal 2x berturut-turut | Email + Push notification | 🔴 P0 |
| Frontend down | HTTP 5xx dari mypapyr.com | Email + Push notification | 🔴 P0 |
| High error rate | Error rate > 5% dalam 30 menit | Email | 🟡 P2 |
| Storage warning | R2 usage > 80% | Email | 🟡 P3 |
| SSL expiring | Certificate expiry < 14 hari | Email | 🟡 P3 |
| Dependency vulnerability | Critical/High CVE terdeteksi | GitHub notification | 🟡 P2 |

---

## 12. Prosedur Keamanan Rutin

### 12.1 Checklist Keamanan Harian

| # | Item | Metode | Pelaksana |
|---|---|---|---|
| S-D01 | Periksa rate limiting logs untuk anomali | Railway logs → filter `rate_limit` | OpenClaw |
| S-D02 | Periksa akses R2 untuk pola mencurigakan | Cloudflare Dashboard → R2 | OpenClaw |
| S-D03 | Verifikasi HTTPS aktif di semua endpoint | Browser check mypapyr.com + API URL | OpenClaw |

### 12.2 Checklist Keamanan Mingguan

| # | Item | Metode | Pelaksana |
|---|---|---|---|
| S-W01 | npm audit (frontend) | `npm audit` | OpenClaw |
| S-W02 | pip audit (backend) | `pip-audit` | OpenClaw |
| S-W03 | Review GitHub Dependabot alerts | GitHub → Security → Dependabot | OpenClaw |
| S-W04 | Verifikasi CORS configuration | Review `backend/main.py` CORS settings | OpenClaw |
| S-W05 | Periksa file upload validation | Review upload size limits dan file type checks | OpenClaw |

### 12.3 Checklist Keamanan Bulanan

| # | Item | Metode | Pelaksana |
|---|---|---|---|
| S-M01 | Full dependency audit (frontend + backend) | `npm audit` + `pip-audit` comprehensive | OpenClaw |
| S-M02 | Review dan rotasi R2 API keys (jika jadwal) | Cloudflare Dashboard → R2 → API Tokens | Product Owner |
| S-M03 | Review environment variables | Audit semua env vars di Vercel + Railway | OpenClaw → Product Owner |
| S-M04 | CORS origin whitelist review | Pastikan hanya domain yang diizinkan | OpenClaw |
| S-M05 | Rate limiting configuration review | Evaluasi efektivitas rate limit saat ini | OpenClaw |
| S-M06 | Signed URL expiry review | Pastikan expiry time sesuai kebijakan | OpenClaw |
| S-M07 | GitHub repository access review | Pastikan hanya authorized users yang memiliki akses | Product Owner |
| S-M08 | Privacy compliance check | Verifikasi file auto-delete berfungsi, privacy page up-to-date | OpenClaw |

### 12.4 Prosedur Respons Vulnerability

| Severity | Waktu Respons | Prosedur |
|---|---|---|
| **Critical** (CVSS ≥ 9.0) | < 4 jam | Patch segera → test → deploy → notifikasi Product Owner |
| **High** (CVSS 7.0-8.9) | < 24 jam | Patch → test → PR → review → deploy |
| **Medium** (CVSS 4.0-6.9) | < 7 hari | Jadwalkan di sprint mingguan → patch → test → deploy |
| **Low** (CVSS < 4.0) | < 30 hari | Jadwalkan di review bulanan → patch saat convenient |

### 12.5 Kontrol Keamanan Aktif

Berikut kontrol keamanan yang saat ini aktif di production:

| Kontrol | Implementasi | Lokasi Kode |
|---|---|---|
| **Input validation (PDF)** | File type check, size limit, magic bytes validation | `backend/routers/compress.py`, `backend/routers/pdf_to_image.py` |
| **Input validation (Image)** | File type check, size limit, dimension validation | `backend/routers/image_to_pdf.py` |
| **CORS** | Whitelist origin, restricted methods | `backend/main.py` |
| **Rate limiting** | Per-IP rate limit (SlowAPI) | `backend/main.py`, per-endpoint |
| **Signed URLs** | Time-limited download URLs untuk R2 | `backend/utils/r2.py` |
| **Auto-delete** | Cron cleanup setiap 30 menit + R2 lifecycle 24 jam | `backend/utils/cleanup.py`, `backend/main.py` |
| **UUID naming** | File disimpan dengan UUID, bukan nama asli | `backend/utils/r2.py` |
| **HTTPS** | Enforced di Vercel (frontend) dan Railway (backend) | Platform-level |
| **No authentication data** | Tidak ada login, tidak ada data pengguna yang disimpan | Arsitektur desain |

> Untuk kebijakan keamanan lengkap, rujuk ke **PPR-SP-001 (Kebijakan Keamanan)**.

---

## 13. Eskalasi & Komunikasi

### 13.1 Tingkat Severity

| Level | Nama | Deskripsi | Contoh |
|---|---|---|---|
| 🔴 **P0** | Kritis | Layanan tidak tersedia sepenuhnya, semua pengguna terdampak | Backend down, frontend 5xx, domain unreachable |
| 🔴 **P1** | Tinggi | Fitur utama tidak berfungsi, sebagian besar pengguna terdampak | Compress gagal, R2 upload error, API timeout |
| 🟡 **P2** | Sedang | Fitur minor terganggu, sebagian kecil pengguna terdampak | Satu tool error, performance degradation, UI glitch |
| 🟢 **P3** | Rendah | Masalah kosmetik atau non-fungsional, tidak berdampak pada pengguna | Typo, styling issue, log warning |

### 13.2 Matriks Eskalasi

| Severity | Responder Pertama | Eskalasi Ke | Waktu Respons | Waktu Resolusi Target |
|---|---|---|---|---|
| 🔴 P0 | OpenClaw (auto-detect atau manual) | Product Owner (segera) | < 30 menit | < 1 jam |
| 🔴 P1 | OpenClaw | Product Owner (jika tidak terselesaikan dalam 30 menit) | < 30 menit | < 4 jam |
| 🟡 P2 | OpenClaw | Product Owner (laporan mingguan) | < 4 jam | < 24 jam |
| 🟢 P3 | OpenClaw | Tidak perlu eskalasi | < 24 jam | < 7 hari |

### 13.3 Jalur Komunikasi

| Channel | Penggunaan | Peserta |
|---|---|---|
| **GitHub Issues** | Bug tracking, feature requests, task management | OpenClaw + Product Owner |
| **GitHub Pull Requests** | Code review, deployment approval | OpenClaw + Product Owner |
| **Direct message** | Eskalasi P1/P2, keputusan urgent | OpenClaw → Product Owner |
| **Laporan harian/mingguan/bulanan** | Status operasional rutin | OpenClaw → Product Owner |

### 13.4 Prosedur Eskalasi

#### 13.4.1 Eskalasi P1 (Kritis)

| Langkah | Aksi | Waktu |
|---|---|---|
| 1. Deteksi | OpenClaw mendeteksi via health check atau monitoring | T+0 |
| 2. Triage awal | Identifikasi komponen terdampak dan scope impact | T+5 menit |
| 3. Notifikasi | Notifikasi Product Owner dengan detail masalah | T+10 menit |
| 4. Mitigasi | Rollback atau workaround untuk restore layanan | T+30 menit |
| 5. Root cause analysis | Investigasi penyebab utama | T+1 jam |
| 6. Permanent fix | Implementasi perbaikan permanen | T+4 jam |
| 7. Post-mortem | Dokumentasi insiden dan lessons learned | T+24 jam |

#### 13.4.2 Eskalasi P2 (Tinggi)

| Langkah | Aksi | Waktu |
|---|---|---|
| 1. Deteksi | OpenClaw mendeteksi via monitoring atau user report | T+0 |
| 2. Investigasi | Analisis log dan metrik untuk identifikasi masalah | T+15 menit |
| 3. Perbaikan | Implementasi fix atau workaround | T+30 menit |
| 4. Eskalasi (jika perlu) | Notifikasi Product Owner jika tidak terselesaikan | T+30 menit |
| 5. Verifikasi | Pastikan fix berhasil dan tidak ada side effect | T+1 jam |
| 6. Dokumentasi | Catat di laporan harian | T+4 jam |

### 13.5 Template Laporan Insiden

```
## Laporan Insiden — Papyr
ID Insiden: [INC-YYYY-MM-DD-NNN]
Severity: [P0/P1/P2/P3]
Status: [Open / Investigating / Mitigated / Resolved / Closed]

### Timeline
| Waktu | Event |
|-------|-------|
| [HH:MM] | Insiden terdeteksi |
| [HH:MM] | Triage dimulai |
| [HH:MM] | Mitigasi diterapkan |
| [HH:MM] | Root cause teridentifikasi |
| [HH:MM] | Fix deployed |
| [HH:MM] | Insiden ditutup |

### Dampak
- Pengguna terdampak: [estimasi]
- Durasi downtime: [X menit/jam]
- Fitur terdampak: [list fitur]

### Root Cause
[Deskripsi penyebab utama]

### Resolusi
[Deskripsi tindakan perbaikan]

### Lessons Learned
1. [Apa yang bisa diperbaiki]

### Tindakan Pencegahan
1. [Langkah untuk mencegah kejadian serupa]
```

> Untuk prosedur incident response lengkap, rujuk ke **PPR-IR-001 (Incident Response Plan)**.

---

## 14. Persetujuan Dokumen

### Tanda Tangan Persetujuan

| Peran | Nama | Status | Tanggal |
|---|---|---|---|
| **Product Owner** | Muhammad Fa'iz Zulfikar | ✅ Approved | Juni 2025 |
| **AI Agent** | OpenClaw (OpenCode/Sisyphus) | ✅ Approved | Juni 2025 |

### Ketentuan Persetujuan

Dengan persetujuan ini, kedua pihak menyatakan bahwa:

1. Seluruh prosedur operasional dalam dokumen ini telah ditinjau dan disetujui untuk implementasi.
2. OpenClaw (AI Agent) bertanggung jawab untuk menjalankan seluruh tugas operasional rutin sesuai checklist yang didefinisikan.
3. Product Owner bertanggung jawab untuk mereview laporan, menyetujui perubahan kritis, dan mengambil keputusan eskalasi.
4. Dokumen ini akan ditinjau ulang setiap kuartal atau saat ada perubahan signifikan pada infrastruktur atau proses operasional.
5. Versi terbaru dokumen ini selalu tersedia di repository GitHub (`docs/22_Papyr_Internal_Ops_Manual_v1.0.md`).

---

## Lampiran A — Daftar Kontak Operasional

| Peran | Nama | Channel |
|---|---|---|
| Product Owner | Muhammad Fa'iz Zulfikar | GitHub (@fazulfi) |
| AI Agent | OpenClaw (OpenCode/Sisyphus) | Autonomous — dalam repository |

---

## Lampiran B — Referensi Dokumen Terkait

| ID | Dokumen | Bagian Relevan |
|---|---|---|
| PPR-DR-001 | Deployment Runbook | Prosedur deployment detail, rollback, verifikasi post-deployment |
| PPR-IR-001 | Incident Response Plan | Prosedur respons insiden, eskalasi, pemulihan layanan |
| PPR-SP-001 | Kebijakan Keamanan | Standar keamanan, kontrol akses, kebijakan privasi data |
| PPR-MP-001 | Maintenance Plan | Jadwal pemeliharaan, strategi update, lifecycle management |
| PPR-CP-001 | Cost Projection | Proyeksi biaya infrastruktur, analisis break-even |
| PPR-TDD-001 | Technical Design Document | Arsitektur teknis, keputusan desain sistem |
| PPR-BRD-001 | Business Requirements Document | Konteks bisnis, requirements fungsional dan non-fungsional |

---

## Lampiran C — Glossary

| Istilah | Definisi |
|---|---|
| **OpenClaw** | AI Agent otonom yang menjalankan seluruh pengembangan dan operasi Papyr |
| **PaaS** | Platform as a Service — model hosting di mana provider mengelola infrastruktur server |
| **R2** | Cloudflare R2 — object storage S3-compatible dengan free egress |
| **Signed URL** | URL sementara dengan token autentikasi untuk akses file di R2 |
| **CWV** | Core Web Vitals — metrik performa web dari Google (LCP, INP, CLS) |
| **CVSS** | Common Vulnerability Scoring System — standar penilaian severity kerentanan |
| **Semver** | Semantic Versioning — format versi MAJOR.MINOR.PATCH |
| **CI/CD** | Continuous Integration / Continuous Deployment — otomasi build dan deploy |
| **OOM** | Out of Memory — kondisi di mana aplikasi kehabisan memori |

---

*Akhir Dokumen.*
