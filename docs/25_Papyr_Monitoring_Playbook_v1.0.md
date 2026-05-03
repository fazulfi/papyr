**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Monitoring Playbook**

Version 1.0 | Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

| Field | Value |
|---|---|
| **Judul Dokumen** | Monitoring Playbook — Papyr |
| **ID Dokumen** | PPR-MP-001 |
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
| 1.0 | Juni 2025 | AI Agent (OpenCode/Sisyphus) | Draft awal — Monitoring Playbook lengkap mencakup arsitektur monitoring, metrik kunci, prosedur pengecekan, playbook per alert, dan rekomendasi peningkatan |

---

## Referensi Silang

| ID Dokumen | Judul | Relevansi |
|---|---|---|
| PPR-SLA-001 | Service Level Agreement — Papyr | Target ketersediaan, metrik layanan, waktu respons yang menjadi dasar threshold monitoring |
| PPR-IR-001 | Incident Response Plan — Papyr | Prosedur eskalasi dan penanganan insiden yang dipicu oleh alert monitoring |
| PPR-OM-001 | Manual Operasi Internal — Papyr | Prosedur operasional harian/mingguan yang mencakup aktivitas monitoring rutin |

---

## Daftar Isi

1. [Ringkasan Monitoring](#1-ringkasan-monitoring)
2. [Arsitektur Monitoring](#2-arsitektur-monitoring)
3. [Dashboard & Tools](#3-dashboard--tools)
4. [Metrik Kunci](#4-metrik-kunci)
5. [Prosedur Pengecekan Harian](#5-prosedur-pengecekan-harian)
6. [Prosedur Pengecekan Mingguan](#6-prosedur-pengecekan-mingguan)
7. [Alert & Notifikasi](#7-alert--notifikasi)
8. [Playbook per Alert](#8-playbook-per-alert)
9. [Log Analysis](#9-log-analysis)
10. [Rekomendasi Peningkatan](#10-rekomendasi-peningkatan)
11. [Persetujuan Dokumen](#11-persetujuan-dokumen)

---

## 1. Ringkasan Monitoring

### 1.1 Tujuan Dokumen

Monitoring Playbook ini mendefinisikan strategi, prosedur, dan panduan operasional untuk memantau kesehatan, performa, dan ketersediaan seluruh komponen layanan Papyr (mypapyr.com). Dokumen ini berfungsi sebagai:

- **Panduan pemantauan** yang memastikan setiap komponen infrastruktur dipantau secara konsisten dan terukur.
- **Referensi threshold** yang mendefinisikan batas normal dan abnormal untuk setiap metrik kunci.
- **Playbook respons** yang memberikan langkah-langkah konkret saat alert terpicu atau anomali terdeteksi.
- **Dasar peningkatan** yang mengidentifikasi gap monitoring saat ini dan rekomendasi perbaikan bertahap.

### 1.2 Ruang Lingkup

Dokumen ini mencakup pemantauan seluruh komponen produksi Papyr:

| Komponen | Platform | Cakupan Monitoring |
|---|---|---|
| Frontend (Next.js 16) | Vercel (Free Tier) | Deployment logs, function logs, Web Analytics, Speed Insights |
| Backend API (FastAPI) | Railway (Starter, ~$5/bulan) | Application logs, CPU/memory/network metrics, deployment history |
| Object Storage | Cloudflare R2 (Free Tier) | Storage usage, operations count, bandwidth |
| Domain & DNS | Hostinger | Availability, DNS resolution |

### 1.3 Model Operasi Monitoring

| Aspek | Status Saat Ini |
|---|---|
| **Operator** | Product Owner + AI Agent (OpenCode) |
| **Frekuensi** | Harian (manual) + mingguan (review mendalam) |
| **Alerting otomatis** | Belum ada — bergantung pada pengecekan manual |
| **External monitoring** | Belum ada — hanya platform-native dashboards |
| **Health check endpoint** | Tersedia: `GET /health` di `papyr-production.up.railway.app` |

### 1.4 Prinsip Monitoring Papyr

1. **Zero-cost first** — Maksimalkan fitur monitoring gratis dari setiap platform sebelum menambah tool berbayar.
2. **Structured logging** — Semua log backend dalam format JSON terstruktur untuk kemudahan pencarian dan analisis.
3. **Privacy-preserving** — Tidak ada logging file name, file content, atau user IP address.
4. **Actionable alerts** — Setiap alert harus memiliki playbook respons yang jelas dan terukur.
5. **Progressive enhancement** — Tingkatkan kapabilitas monitoring secara bertahap sesuai pertumbuhan traffic dan revenue.

---

## 2. Arsitektur Monitoring

### 2.1 Diagram Arsitektur Monitoring (Current State)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MONITORING ARCHITECTURE — PAPYR                       │
│                              (Current State)                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           PLATFORM-NATIVE MONITORING                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐    ┌───────────────┐  │
│  │   VERCEL DASHBOARD   │    │  RAILWAY DASHBOARD   │    │  CLOUDFLARE   │  │
│  ├──────────────────────┤    ├──────────────────────┤    │  R2 DASHBOARD │  │
│  │ • Deployment Logs    │    │ • Application Logs   │    ├───────────────┤  │
│  │ • Function Logs      │    │ • CPU Metrics        │    │ • Storage     │  │
│  │ • Web Analytics      │    │ • Memory Metrics     │    │   Used (GB)   │  │
│  │ • Speed Insights     │    │ • Network I/O        │    │ • Operations  │  │
│  │ • Custom Events      │    │ • Deploy History     │    │   Count       │  │
│  │   - task_started     │    │ • Build Logs         │    │ • Class A/B   │  │
│  │   - task_completed   │    │                      │    │   Ops Split   │  │
│  │   - task_failed      │    │                      │    │               │  │
│  │   - device_category  │    │                      │    │               │  │
│  └──────────┬───────────┘    └──────────┬───────────┘    └───────┬───────┘  │
│             │                           │                         │          │
└─────────────┼───────────────────────────┼─────────────────────────┼──────────┘
              │                           │                         │
              ▼                           ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA SOURCES                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐    ┌───────────────┐  │
│  │   FRONTEND           │    │   BACKEND            │    │   STORAGE     │  │
│  │   (Vercel Edge)      │    │   (Railway)          │    │   (R2)        │  │
│  ├──────────────────────┤    ├──────────────────────┤    ├───────────────┤  │
│  │ Next.js 16           │───▶│ FastAPI              │───▶│ papyr-files   │  │
│  │ mypapyr.com          │    │ papyr-production     │    │ bucket        │  │
│  │                      │    │ .up.railway.app      │    │               │  │
│  │ Vercel Analytics SDK │    │                      │    │               │  │
│  │ (track() calls)      │    │ Structured JSON Logs │    │               │  │
│  │                      │    │ (logging_config.py)  │    │               │  │
│  └──────────────────────┘    │                      │    └───────────────┘  │
│                              │ GET /health          │                        │
│                              │ (health check)       │                        │
│                              └──────────────────────┘                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         MANUAL MONITORING PROCESS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Product Owner / AI Agent                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  HARIAN: Cek /health → Railway logs → R2 storage                   │    │
│  │  MINGGUAN: Vercel Analytics → Speed Insights → Cost review          │    │
│  │  BULANAN: Trend analysis → Capacity planning → SLA review           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Alur Data Monitoring

| Sumber | Data yang Dihasilkan | Tujuan | Retensi |
|---|---|---|---|
| Frontend (Vercel) | Page views, CWV, custom events | Vercel Analytics Dashboard | 30 hari (free tier) |
| Backend (Railway) | JSON structured logs, metrics | Railway Log Viewer | 7 hari (free tier) |
| R2 (Cloudflare) | Storage metrics, operation counts | Cloudflare Dashboard | Real-time + 30 hari |
| Health endpoint | Status OK/ERROR, response time | Manual check / future uptime tool | Tidak disimpan |

### 2.3 Gap Analysis — Current vs. Ideal

| Kapabilitas | Status Saat Ini | Status Ideal | Gap |
|---|---|---|---|
| Uptime monitoring | Manual (harian) | Otomatis (setiap 5 menit) | Tidak ada alerting otomatis saat downtime |
| Error alerting | Tidak ada | Real-time notification | Error hanya terdeteksi saat review log manual |
| Performance tracking | Vercel Speed Insights | APM dengan tracing | Tidak ada end-to-end request tracing |
| Log aggregation | Per-platform (terpisah) | Centralized logging | Log tersebar di 3 platform berbeda |
| Incident notification | Tidak ada | Telegram/email alert | Downtime bisa tidak terdeteksi berjam-jam |

---

## 3. Dashboard & Tools

### 3.1 Vercel Dashboard

| Fitur | URL Akses | Data yang Tersedia | Frekuensi Update |
|---|---|---|---|
| **Deployment Logs** | `vercel.com/dashboard` → Project → Deployments | Build output, error, duration | Per deployment |
| **Function Logs** | `vercel.com/dashboard` → Project → Logs | Serverless function execution, errors | Real-time |
| **Web Analytics** | `vercel.com/dashboard` → Project → Analytics | Page views, visitors, top pages, referrers | Real-time |
| **Speed Insights** | `vercel.com/dashboard` → Project → Speed Insights | LCP, INP, CLS, TTFB per route | Aggregated (24h) |

#### 3.1.1 Vercel Analytics — Custom Events yang Dilacak

| Event Name | Trigger | Properties | Kegunaan |
|---|---|---|---|
| `task_started` | User memulai operasi PDF | `tool`, `device_category` | Mengukur engagement per tool |
| `task_completed` | Operasi PDF berhasil | `tool`, `device_category`, `duration_ms` | Mengukur success rate dan performa |
| `task_failed` | Operasi PDF gagal | `tool`, `device_category`, `error_type` | Mengidentifikasi failure patterns |
| `device_category` | Setiap page view | `category` (mobile/desktop/tablet) | Memahami distribusi device |

#### 3.1.2 Cara Mengakses Vercel Analytics

1. Login ke `vercel.com` → pilih project Papyr frontend.
2. Navigasi ke tab **Analytics** untuk traffic data.
3. Navigasi ke tab **Speed Insights** untuk Core Web Vitals.
4. Gunakan filter tanggal untuk membandingkan periode.
5. Klik **Custom Events** untuk melihat task lifecycle events.

### 3.2 Railway Dashboard

| Fitur | URL Akses | Data yang Tersedia | Frekuensi Update |
|---|---|---|---|
| **Application Logs** | `railway.app` → Project → Service → Logs | Structured JSON logs dari FastAPI | Real-time (streaming) |
| **Metrics** | `railway.app` → Project → Service → Metrics | CPU %, Memory MB, Network bytes | Real-time (1-min granularity) |
| **Deployment History** | `railway.app` → Project → Service → Deployments | Deploy status, duration, commit SHA | Per deployment |
| **Usage & Billing** | `railway.app` → Account → Usage | Compute hours, bandwidth, cost | Daily aggregation |

#### 3.2.1 Railway Metrics yang Tersedia

| Metrik | Satuan | Baseline Normal | Perlu Investigasi |
|---|---|---|---|
| CPU Usage | % | < 30% (idle), < 80% (under load) | > 80% sustained > 5 menit |
| Memory Usage | MB | 150–300 MB | > 450 MB (mendekati limit) |
| Network In | bytes/s | Varies per request | Spike abnormal tanpa traffic increase |
| Network Out | bytes/s | Varies per response size | Spike abnormal (possible data exfiltration) |

#### 3.2.2 Cara Mengakses Railway Logs

1. Login ke `railway.app` → pilih project Papyr.
2. Klik service **papyr-production**.
3. Tab **Logs** menampilkan real-time log stream.
4. Gunakan search bar untuk filter berdasarkan keyword (e.g., `"level":"ERROR"`).
5. Klik **Metrics** tab untuk grafik CPU/memory/network.

### 3.3 Cloudflare R2 Dashboard

| Fitur | URL Akses | Data yang Tersedia | Frekuensi Update |
|---|---|---|---|
| **Overview** | `dash.cloudflare.com` → R2 → papyr-files | Total storage, object count | Real-time |
| **Analytics** | `dash.cloudflare.com` → R2 → Analytics | Operations (Class A/B), bandwidth | Hourly aggregation |

#### 3.3.1 R2 Metrics yang Tersedia

| Metrik | Deskripsi | Free Tier Limit | Threshold Alert |
|---|---|---|---|
| Storage Used | Total ukuran semua objek di bucket | 10 GB/bulan | > 7 GB (70% kapasitas) |
| Class A Operations | PUT, POST, LIST (write operations) | 1 juta/bulan | > 700K ops/bulan |
| Class B Operations | GET, HEAD (read operations) | 10 juta/bulan | > 7 juta ops/bulan |
| Egress | Data transfer keluar | 10 GB/bulan (free) | > 7 GB/bulan |

#### 3.3.2 Cara Mengakses R2 Dashboard

1. Login ke `dash.cloudflare.com`.
2. Navigasi ke **R2 Object Storage** di sidebar.
3. Klik bucket **papyr-files** untuk detail storage.
4. Klik **Analytics** untuk melihat operations dan bandwidth.

### 3.4 Vercel Analytics (Detail)

| Aspek | Detail |
|---|---|
| **Tipe** | Real User Monitoring (RUM) — data dari browser pengguna nyata |
| **SDK** | `@vercel/analytics` terintegrasi di Next.js app |
| **Custom Events** | Via `track()` function di `frontend/src/lib/analytics.ts` |
| **Retensi Data** | 30 hari (Hobby/Free plan) |
| **Sampling** | 100% (semua visitors dilacak) |
| **Privacy** | Tidak menggunakan cookies, compliant dengan GDPR |

---

## 4. Metrik Kunci

### 4.1 Ringkasan Target Metrik

| # | Metrik | Target | Sumber Data | Frekuensi Cek |
|---|---|---|---|---|
| M-01 | Uptime | ≥ 99.5% | Health check endpoint | Harian |
| M-02 | API Response Time (Compress) | < 2.000 ms | Railway logs (duration_ms) | Harian |
| M-03 | API Response Time (Lainnya) | < 500 ms | Railway logs (duration_ms) | Harian |
| M-04 | Error Rate | < 1% | Railway logs (task_failed / total) | Harian |
| M-05 | R2 Storage Usage | < 70% free tier (< 7 GB) | Cloudflare R2 Dashboard | Harian |
| M-06 | Cleanup Cron Success Rate | 100% | Railway logs (cleanup events) | Harian |
| M-07 | Rate Limit Hits | < 5% of total requests | Railway logs (429 responses) | Mingguan |

### 4.2 Detail per Metrik

#### M-01: Uptime

| Aspek | Detail |
|---|---|
| **Definisi** | Persentase waktu layanan merespons dengan status 200 pada endpoint `/health` |
| **Target** | ≥ 99.5% (setara maks ~3.6 jam downtime/bulan) |
| **Cara Mengukur** | Manual: `curl https://papyr-production.up.railway.app/health` → respons `{"status": "ok"}` |
| **Threshold Warning** | < 99.5% dalam 7 hari terakhir |
| **Threshold Critical** | Endpoint tidak merespons > 5 menit |
| **Sumber** | Manual check (saat ini) / UptimeRobot (rekomendasi) |
| **Referensi SLA** | PPR-SLA-001 Section 4 — Ketersediaan Layanan |

#### M-02: API Response Time — Compress PDF

| Aspek | Detail |
|---|---|
| **Definisi** | Waktu dari request diterima hingga response dikirim untuk endpoint `/compress` |
| **Target** | < 2.000 ms (P95) untuk file ≤ 20 MB |
| **Cara Mengukur** | Railway logs → filter `"tool":"compress"` → field `duration_ms` |
| **Threshold Warning** | P95 > 2.000 ms |
| **Threshold Critical** | P95 > 5.000 ms atau timeout (30s) |
| **Faktor yang Mempengaruhi** | Ukuran file input, Ghostscript processing, R2 upload time |
| **Baseline** | ~800–1.500 ms untuk file 1–10 MB |

#### M-03: API Response Time — Endpoint Lainnya

| Aspek | Detail |
|---|---|
| **Definisi** | Waktu respons untuk endpoint non-compress: `/image-to-pdf`, `/pdf-to-image`, `/health` |
| **Target** | < 500 ms (P95) |
| **Cara Mengukur** | Railway logs → filter per tool → field `duration_ms` |
| **Threshold Warning** | P95 > 500 ms |
| **Threshold Critical** | P95 > 2.000 ms |
| **Baseline** | `/health`: < 50 ms, `/image-to-pdf`: ~200–400 ms, `/pdf-to-image`: ~300–500 ms |

#### M-04: Error Rate

| Aspek | Detail |
|---|---|
| **Definisi** | Persentase request yang menghasilkan HTTP 5xx atau `"success": false` dalam log |
| **Target** | < 1% dari total request per hari |
| **Cara Mengukur** | Railway logs → hitung `"level":"ERROR"` / total requests |
| **Threshold Warning** | > 1% error rate dalam 1 jam |
| **Threshold Critical** | > 5% error rate dalam 30 menit |
| **Error yang Dihitung** | 500 Internal Server Error, Ghostscript failure, R2 upload failure, timeout |
| **Error yang Dikecualikan** | 400 Bad Request (user error), 413 Payload Too Large, 429 Rate Limited |

#### M-05: R2 Storage Usage

| Aspek | Detail |
|---|---|
| **Definisi** | Total ukuran objek yang tersimpan di bucket `papyr-files` |
| **Target** | < 7 GB (70% dari free tier 10 GB) |
| **Cara Mengukur** | Cloudflare Dashboard → R2 → papyr-files → Storage Used |
| **Threshold Warning** | > 7 GB (70% kapasitas) |
| **Threshold Critical** | > 9 GB (90% kapasitas) |
| **Mitigasi** | Cleanup cron berjalan setiap 30 menit, file dihapus setelah 60 menit |
| **Catatan** | Jika storage tinggi, kemungkinan cleanup cron gagal |

#### M-06: Cleanup Cron Success Rate

| Aspek | Detail |
|---|---|
| **Definisi** | Persentase eksekusi cleanup cron yang berhasil menghapus file expired dari R2 |
| **Target** | 100% success rate |
| **Cara Mengukur** | Railway logs → filter `"cleanup"` atau `"cron"` → cek status |
| **Threshold Warning** | 1 kali gagal dalam 24 jam |
| **Threshold Critical** | 3 kali berturut-turut gagal |
| **Dampak Kegagalan** | Storage R2 membengkak, file pengguna tidak terhapus sesuai kebijakan privasi |
| **Referensi** | PPR-OM-001 Section 8 — Manajemen Storage |

#### M-07: Rate Limit Hits

| Aspek | Detail |
|---|---|
| **Definisi** | Jumlah request yang ditolak karena rate limiting (HTTP 429) |
| **Target** | < 5% dari total request |
| **Cara Mengukur** | Railway logs → filter `429` atau `"rate_limit"` |
| **Threshold Warning** | > 5% rate limit hits dalam 1 jam |
| **Threshold Critical** | > 20% rate limit hits (kemungkinan DDoS atau abuse) |
| **Konfigurasi Saat Ini** | 10 request/menit per IP |
| **Catatan** | Spike rate limit bisa mengindikasikan bot abuse atau konfigurasi terlalu ketat |

---

## 5. Prosedur Pengecekan Harian

### 5.1 Checklist Harian

Pengecekan harian dilakukan oleh AI Agent (OpenCode) atau Product Owner, idealnya pada pagi hari (WIB).

| # | Item Pengecekan | Cara Cek | Expected Result | Waktu |
|---|---|---|---|---|
| D-01 | Health check backend | `curl https://papyr-production.up.railway.app/health` | `{"status": "ok"}` | 1 menit |
| D-02 | Frontend accessible | Buka `https://mypapyr.com` di browser | Halaman landing load sempurna | 1 menit |
| D-03 | Railway logs — error scan | Railway Dashboard → Logs → search `"level":"ERROR"` | 0 error atau error yang sudah diketahui | 3 menit |
| D-04 | Railway metrics — resource usage | Railway Dashboard → Metrics → CPU & Memory | CPU < 80%, Memory < 450 MB | 2 menit |
| D-05 | R2 storage level | Cloudflare Dashboard → R2 → papyr-files | Storage < 7 GB | 1 menit |
| D-06 | Cleanup cron verification | Railway logs → search `"cleanup"` | Minimal 1 successful cleanup dalam 24 jam terakhir | 2 menit |
| D-07 | Vercel deployment status | Vercel Dashboard → Deployments | Latest deployment: Ready (green) | 1 menit |

**Total estimasi waktu: ~12 menit**

### 5.2 Prosedur Detail Pengecekan Harian

#### D-01: Health Check Backend

```bash
# Dari terminal atau browser
curl -s https://papyr-production.up.railway.app/health | python -m json.tool

# Expected response:
{
    "status": "ok"
}

# Jika gagal atau timeout > 5 detik → eskalasi ke Playbook "API Slow Response"
```

#### D-02: Frontend Accessibility

1. Buka `https://mypapyr.com` di browser (incognito mode).
2. Verifikasi halaman landing load dalam < 3 detik.
3. Verifikasi navbar, hero section, dan tool cards tampil dengan benar.
4. Klik salah satu tool (e.g., Compress) → verifikasi halaman tool load.

#### D-03: Railway Error Log Scan

1. Login ke `railway.app` → Project Papyr → Service → Logs.
2. Di search bar, ketik: `"level":"ERROR"`
3. Review error dalam 24 jam terakhir.
4. Klasifikasikan:
   - **Known/expected**: File too large (413), invalid PDF format → abaikan.
   - **Unknown/new**: Stack trace baru, R2 connection error → investigasi.

#### D-04: Railway Resource Metrics

1. Railway Dashboard → Metrics tab.
2. Periksa grafik 24 jam terakhir:
   - **CPU**: Apakah ada sustained spike > 80%?
   - **Memory**: Apakah trending naik (memory leak)?
   - **Network**: Apakah ada anomali traffic?

#### D-05: R2 Storage Level

1. Cloudflare Dashboard → R2 Object Storage → papyr-files.
2. Catat **Current Storage Used**.
3. Bandingkan dengan hari sebelumnya — apakah ada kenaikan abnormal?

#### D-06: Cleanup Cron Verification

1. Railway Logs → search `"cleanup"` atau `"cron"`.
2. Verifikasi ada log entry cleanup sukses dalam 24 jam terakhir.
3. Contoh log sukses:
   ```json
   {"timestamp":"2025-06-15T03:00:01Z","level":"INFO","logger":"cleanup","message":"cleanup completed","files_deleted":12,"duration_ms":450}
   ```

### 5.3 Template Laporan Harian

```
=== PAPYR DAILY MONITORING REPORT ===
Tanggal: [YYYY-MM-DD]
Operator: [AI Agent / Product Owner]

[✓/✗] D-01 Health Check: [OK / FAILED — detail]
[✓/✗] D-02 Frontend: [OK / ISSUE — detail]
[✓/✗] D-03 Error Logs: [0 errors / N errors — detail]
[✓/✗] D-04 Resources: CPU [X%], Memory [X MB]
[✓/✗] D-05 R2 Storage: [X.X GB / 10 GB]
[✓/✗] D-06 Cleanup Cron: [OK / FAILED — detail]
[✓/✗] D-07 Vercel Deploy: [Ready / Error]

Status Keseluruhan: [HEALTHY / WARNING / CRITICAL]
Catatan: [Jika ada anomali atau tindakan yang diperlukan]
```

---

## 6. Prosedur Pengecekan Mingguan

### 6.1 Checklist Mingguan

Pengecekan mingguan dilakukan setiap hari Senin, mencakup analisis trend dan review mendalam.

| # | Item Pengecekan | Cara Cek | Expected Result | Waktu |
|---|---|---|---|---|
| W-01 | Vercel Analytics — traffic trend | Vercel → Analytics → 7-day view | Stable atau growing traffic | 5 menit |
| W-02 | Speed Insights — Core Web Vitals | Vercel → Speed Insights → 7-day | LCP < 2.5s, INP < 200ms, CLS < 0.1 | 5 menit |
| W-03 | Custom events — tool usage | Vercel → Analytics → Custom Events | task_completed > task_failed (ratio > 99:1) | 5 menit |
| W-04 | Railway billing & usage | Railway → Account → Usage | Biaya < $5/bulan (sesuai plan) | 3 menit |
| W-05 | R2 operations trend | Cloudflare → R2 → Analytics → 7-day | Operations dalam batas free tier | 3 menit |
| W-06 | Error pattern analysis | Railway logs → 7-day error review | Tidak ada error pattern baru yang berulang | 10 menit |
| W-07 | Response time trend | Railway logs → duration_ms analysis | Tidak ada degradasi performa vs minggu lalu | 5 menit |
| W-08 | Rate limit analysis | Railway logs → 429 count | Rate limit hits < 5% total requests | 3 menit |
| W-09 | Dependency vulnerability check | `npm audit` + `pip-audit` | 0 critical/high vulnerabilities | 5 menit |

**Total estimasi waktu: ~44 menit**

### 6.2 Prosedur Detail Pengecekan Mingguan

#### W-01: Traffic Trend Analysis

1. Vercel Dashboard → Analytics → set range ke **Last 7 days**.
2. Catat:
   - Total page views minggu ini vs minggu lalu.
   - Top pages (tool mana yang paling banyak digunakan).
   - Traffic sources (direct, organic, referral).
3. Flag jika traffic drop > 30% tanpa alasan yang jelas.

#### W-02: Core Web Vitals Review

1. Vercel Dashboard → Speed Insights → 7-day view.
2. Periksa per route:

| Route | LCP Target | INP Target | CLS Target |
|---|---|---|---|
| `/` (landing) | < 2.5s | < 200ms | < 0.1 |
| `/compress` | < 2.5s | < 200ms | < 0.1 |
| `/merge` | < 2.5s | < 200ms | < 0.1 |
| `/split` | < 2.5s | < 200ms | < 0.1 |
| `/image-to-pdf` | < 2.5s | < 200ms | < 0.1 |
| `/pdf-to-image` | < 2.5s | < 200ms | < 0.1 |
| `/rotate` | < 2.5s | < 200ms | < 0.1 |

3. Jika ada route dengan CWV merah → prioritaskan perbaikan.

#### W-03: Tool Usage & Success Rate

1. Vercel Analytics → Custom Events.
2. Hitung per tool:
   - `task_started` count (engagement).
   - `task_completed` count (success).
   - `task_failed` count (failure).
   - Success rate = `completed / (completed + failed) × 100%`.
3. Target: Success rate > 99% per tool.

#### W-06: Error Pattern Analysis

1. Railway Logs → filter 7 hari terakhir → `"level":"ERROR"`.
2. Kelompokkan error berdasarkan:
   - **Tipe**: Ghostscript error, R2 error, timeout, memory error.
   - **Frekuensi**: Berapa kali muncul dalam seminggu.
   - **Trend**: Meningkat, stabil, atau menurun.
3. Untuk error baru yang berulang > 3 kali → buat item investigasi.

### 6.3 Template Laporan Mingguan

```
=== PAPYR WEEKLY MONITORING REPORT ===
Periode: [YYYY-MM-DD] s/d [YYYY-MM-DD]
Operator: [AI Agent / Product Owner]

--- TRAFFIC ---
Page Views: [X] (vs minggu lalu: [+/-X%])
Unique Visitors: [X]
Top Tool: [compress/merge/split/etc]

--- PERFORMANCE ---
LCP (avg): [X.Xs]
INP (avg): [Xms]
CLS (avg): [X.XX]
API Response Time (P95): [Xms]

--- RELIABILITY ---
Uptime: [XX.X%]
Error Rate: [X.X%]
Task Success Rate: [XX.X%]
Cleanup Cron: [X/X successful]

--- COST ---
Railway Usage: $[X.XX] / $5.00
R2 Storage: [X.X GB] / 10 GB
R2 Operations: [XK] Class A, [XK] Class B

--- ISSUES & ACTIONS ---
1. [Issue description — action taken / planned]
2. [...]

Status Keseluruhan: [HEALTHY / WARNING / CRITICAL]
```

---

## 7. Alert & Notifikasi

### 7.1 Status Saat Ini

| Aspek | Status |
|---|---|
| **Alerting otomatis** | Tidak ada |
| **Notification channel** | Tidak ada |
| **Uptime monitoring** | Manual (daily health check) |
| **Error notification** | Tidak ada — hanya terdeteksi saat review log |
| **Downtime detection** | Tidak ada — bisa tidak terdeteksi berjam-jam |

### 7.2 Rekomendasi: BetterStack (Uptime Monitoring)

| Aspek | Detail |
|---|---|
| **Tool** | BetterStack (betterstack.com) — formerly Better Uptime |
| **Biaya** | Free tier: 5 monitors, 3-minute interval |
| **Monitors yang Direkomendasikan** | |
| Monitor 1 | `https://papyr-production.up.railway.app/health` — Backend health |
| Monitor 2 | `https://mypapyr.com` — Frontend availability |
| **Check interval** | Setiap 3 menit |
| **Alert condition** | 2 consecutive failures = alert |
| **Notification** | Email (free) + Telegram webhook (free) |

#### 7.2.1 Konfigurasi BetterStack yang Direkomendasikan

```
Monitor 1: Backend Health
- URL: https://papyr-production.up.railway.app/health
- Method: GET
- Expected status: 200
- Expected body contains: "ok"
- Check interval: 3 minutes
- Confirmation period: 2 checks (6 minutes)
- Alert: Email + Telegram

Monitor 2: Frontend
- URL: https://mypapyr.com
- Method: GET
- Expected status: 200
- Check interval: 3 minutes
- Confirmation period: 2 checks (6 minutes)
- Alert: Email + Telegram
```

### 7.3 Rekomendasi: Telegram Bot untuk Alert

| Aspek | Detail |
|---|---|
| **Tool** | Telegram Bot API (gratis) |
| **Biaya** | $0 |
| **Setup** | Buat bot via @BotFather → dapatkan token → buat channel/group |
| **Integrasi** | BetterStack webhook → Telegram Bot API |
| **Alert yang Dikirim** | Downtime detected, uptime restored, SSL expiry warning |

#### 7.3.1 Format Alert Telegram yang Direkomendasikan

```
🔴 PAPYR ALERT — DOWNTIME DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: Backend API
URL: papyr-production.up.railway.app/health
Status: DOWN (HTTP timeout)
Since: 2025-06-15 14:30 WIB
Duration: 6 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Action: Check Railway Dashboard → Logs
Playbook: PPR-MP-001 Section 8.2
```

```
🟢 PAPYR RESOLVED — SERVICE RESTORED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: Backend API
Status: UP (HTTP 200)
Downtime Duration: 12 minutes
Resolved: 2025-06-15 14:42 WIB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 7.4 Alert Severity Levels

| Level | Kondisi | Response Time | Notification |
|---|---|---|---|
| **P0 — Critical** | Service down, data loss risk | < 30 menit | Telegram + Email (immediate) |
| **P1 — High** | Degraded performance, high error rate | < 1 jam | Telegram + Email |
| **P2 — Medium** | Warning threshold breached | < 4 jam | Email only |
| **P3 — Low** | Informational, trend anomaly | Next business day | Weekly report |

### 7.5 Alert Routing Matrix

| Alert Type | Severity | Primary Responder | Escalation |
|---|---|---|---|
| Backend down | P0 | AI Agent (auto-check) | Product Owner (jika > 30 menit) |
| Frontend down | P0 | AI Agent (auto-check) | Product Owner (jika > 30 menit) |
| High error rate (> 5%) | P1 | AI Agent (investigate) | Product Owner (jika > 1 jam) |
| API slow (P95 > 5s) | P1 | AI Agent (investigate) | Product Owner (jika > 1 jam) |
| R2 storage > 90% | P1 | AI Agent (cleanup) | Product Owner (jika cleanup gagal) |
| Cleanup cron failure | P2 | AI Agent (retry/fix) | Product Owner (jika 3x gagal) |
| Rate limit spike | P2 | AI Agent (analyze) | Product Owner (jika abuse confirmed) |
| Deployment failure | P2 | AI Agent (investigate) | Product Owner (jika rollback needed) |

---

## 8. Playbook per Alert

### 8.1 Playbook: High Error Rate

**Trigger**: Error rate > 1% dalam 1 jam terakhir (target cleanup cron setiap 30 menit).

| Langkah | Aksi | Detail | Waktu |
|---|---|---|---|
| 1 | **Identifikasi** | Railway Logs → filter `"level":"ERROR"` → identifikasi error terbanyak | 5 menit |
| 2 | **Klasifikasi** | Tentukan tipe error: Ghostscript, R2, memory, timeout, atau application | 2 menit |
| 3 | **Cek resource** | Railway Metrics → apakah CPU/memory saturated? | 2 menit |
| 4 | **Cek R2** | Cloudflare Dashboard → apakah R2 accessible? | 2 menit |
| 5 | **Triage** | Tentukan root cause berdasarkan data di atas | 5 menit |
| 6 | **Mitigasi** | Terapkan fix sesuai root cause (lihat sub-playbook di bawah) | Varies |
| 7 | **Verifikasi** | Monitor error rate 30 menit setelah fix → pastikan turun | 30 menit |
| 8 | **Dokumentasi** | Catat insiden di log operasional | 5 menit |

#### Sub-playbook berdasarkan Root Cause:

| Root Cause | Mitigasi Cepat | Fix Permanen |
|---|---|---|
| Ghostscript crash | Restart service (Railway redeploy) | Investigate file yang menyebabkan crash, tambah error handling |
| R2 connection timeout | Cek Cloudflare status page, retry | Tambah retry logic dengan exponential backoff |
| Memory exhaustion | Restart service | Optimize memory usage, tambah memory limit handling |
| Application bug | Rollback ke deployment sebelumnya | Fix bug, test, deploy ulang |
| Upstream dependency down | Informasikan user via status page | Tambah circuit breaker pattern |

### 8.2 Playbook: API Slow Response

**Trigger**: P95 response time > 2.000 ms (compress) atau > 500 ms (lainnya) selama > 30 menit.

| Langkah | Aksi | Detail | Waktu |
|---|---|---|---|
| 1 | **Konfirmasi** | Test manual: `curl -w "%{time_total}" https://papyr-production.up.railway.app/health` | 1 menit |
| 2 | **Cek metrics** | Railway → Metrics → CPU & Memory → apakah ada resource contention? | 3 menit |
| 3 | **Cek logs** | Railway → Logs → filter `duration_ms` → identifikasi request lambat | 5 menit |
| 4 | **Cek cold start** | Apakah container baru saja restart? (Railway sleep mode) | 2 menit |
| 5 | **Cek R2 latency** | Apakah upload/download ke R2 yang lambat? | 3 menit |
| 6 | **Mitigasi** | Terapkan fix sesuai root cause | Varies |
| 7 | **Verifikasi** | Test ulang response time setelah fix | 5 menit |

#### Penyebab Umum & Solusi:

| Penyebab | Gejala | Solusi |
|---|---|---|
| Railway cold start | Respons pertama lambat (> 5s), selanjutnya normal | Pertimbangkan always-on (biaya tambahan) atau health check ping |
| CPU saturation | CPU > 90%, semua request lambat | Kurangi concurrent processing, atau upgrade plan |
| Large file processing | Hanya file besar yang lambat | Normal behavior — pastikan timeout cukup (30s) |
| R2 latency spike | Upload/download duration tinggi | Cek Cloudflare status, retry mechanism |
| Memory pressure | Memory mendekati limit, GC frequent | Optimize memory usage, restart service |

### 8.3 Playbook: R2 Storage Approaching Limit

**Trigger**: R2 storage > 7 GB (70% dari free tier 10 GB).

| Langkah | Aksi | Detail | Waktu |
|---|---|---|---|
| 1 | **Konfirmasi** | Cloudflare Dashboard → R2 → papyr-files → cek actual storage | 2 menit |
| 2 | **Cek cleanup cron** | Railway Logs → apakah cleanup cron berjalan dan sukses? | 3 menit |
| 3 | **Manual cleanup** | Jika cron gagal, trigger manual cleanup | 5 menit |
| 4 | **Identifikasi file lama** | Cek apakah ada file > 24 jam yang belum terhapus | 5 menit |
| 5 | **Fix cron** | Jika cron bermasalah, investigate dan fix | Varies |
| 6 | **Monitor** | Pantau storage level setelah cleanup — harus turun | 30 menit |

#### Prosedur Manual Cleanup:

```bash
# Trigger cleanup endpoint (jika tersedia) atau:
# 1. Login ke Cloudflare Dashboard
# 2. R2 → papyr-files → Objects
# 3. Sort by date → hapus file yang lebih tua dari 24 jam
# 4. Atau gunakan rclone/wrangler CLI:

# Menggunakan wrangler (Cloudflare CLI):
npx wrangler r2 object list papyr-files --prefix="" | \
  # Filter objects older than 24 hours and delete
```

#### Eskalasi:

| Kondisi | Aksi |
|---|---|
| Storage > 9 GB dan cleanup gagal | Eskalasi ke Product Owner — pertimbangkan upgrade R2 plan |
| Storage terus naik meski cleanup sukses | Investigasi: apakah traffic spike? Apakah file retention terlalu lama? |
| Free tier limit tercapai (10 GB) | Immediate: manual cleanup. Long-term: upgrade plan atau kurangi retention |

### 8.4 Playbook: Cleanup Cron Failure

**Trigger**: Cleanup cron tidak berjalan atau gagal dalam 24 jam terakhir.

| Langkah | Aksi | Detail | Waktu |
|---|---|---|---|
| 1 | **Konfirmasi** | Railway Logs → search `"cleanup"` → cek last successful run | 3 menit |
| 2 | **Identifikasi error** | Cari log entry cleanup dengan `"level":"ERROR"` | 3 menit |
| 3 | **Cek R2 connectivity** | Apakah backend bisa connect ke R2? Cek `/test/connectivity` | 2 menit |
| 4 | **Cek credentials** | Apakah R2 credentials masih valid? (env vars di Railway) | 3 menit |
| 5 | **Manual trigger** | Trigger cleanup secara manual jika memungkinkan | 5 menit |
| 6 | **Fix root cause** | Perbaiki issue yang menyebabkan cron gagal | Varies |
| 7 | **Verifikasi** | Pastikan cleanup berjalan sukses setelah fix | 5 menit |
| 8 | **Cek storage** | Verifikasi R2 storage turun setelah cleanup berhasil | 5 menit |

#### Penyebab Umum:

| Penyebab | Gejala | Solusi |
|---|---|---|
| R2 credentials expired | Error `AccessDenied` atau `InvalidAccessKeyId` | Regenerate R2 API keys, update Railway env vars |
| Network timeout ke R2 | Error `ConnectionTimeout` | Retry, cek Cloudflare status |
| Container restart saat cron | Cron tidak ada di log (missed execution) | Pastikan cron schedule robust terhadap restart |
| Bug di cleanup logic | Error stack trace di log | Fix bug, test, deploy |

### 8.5 Playbook: Deployment Failure

**Trigger**: Deployment ke Vercel atau Railway gagal.

| Langkah | Aksi | Detail | Waktu |
|---|---|---|---|
| 1 | **Identifikasi platform** | Vercel atau Railway? Cek deployment status | 1 menit |
| 2 | **Baca build logs** | Platform Dashboard → Deployment → Build Logs | 5 menit |
| 3 | **Identifikasi error** | Build error, test failure, atau runtime error? | 3 menit |
| 4 | **Fix** | Perbaiki code/config sesuai error | Varies |
| 5 | **Redeploy** | Push fix ke branch → trigger auto-deploy | 5 menit |
| 6 | **Verifikasi** | Pastikan deployment sukses dan service healthy | 5 menit |
| 7 | **Rollback (jika perlu)** | Jika fix tidak segera tersedia, rollback ke versi sebelumnya | 5 menit |

#### Prosedur Rollback:

| Platform | Prosedur Rollback |
|---|---|
| **Vercel** | Dashboard → Deployments → klik deployment sebelumnya → "Promote to Production" |
| **Railway** | Dashboard → Deployments → klik deployment sebelumnya → "Rollback" |

#### Penyebab Umum Deployment Failure:

| Platform | Penyebab | Solusi |
|---|---|---|
| Vercel | TypeScript type error | Fix type error, push ulang |
| Vercel | Build timeout (> 45s) | Optimize build, cek dependencies |
| Vercel | Environment variable missing | Tambah env var di Vercel Dashboard |
| Railway | Dockerfile build error | Fix Dockerfile, cek base image |
| Railway | Dependency install failure | Cek requirements.txt, pin versions |
| Railway | Health check timeout | Pastikan `/health` endpoint respond < 5s saat startup |

### 8.6 Playbook: Rate Limit Spike

**Trigger**: Rate limit hits > 5% dari total request dalam 1 jam.

| Langkah | Aksi | Detail | Waktu |
|---|---|---|---|
| 1 | **Konfirmasi** | Railway Logs → filter `429` → hitung jumlah dalam 1 jam | 3 menit |
| 2 | **Identifikasi source** | Apakah dari 1 IP atau banyak IP? (cek log pattern) | 5 menit |
| 3 | **Klasifikasi** | Legitimate user vs. bot/abuse? | 3 menit |
| 4 | **Tindakan** | Sesuai klasifikasi (lihat tabel di bawah) | Varies |
| 5 | **Monitor** | Pantau rate limit hits setelah tindakan | 30 menit |

#### Tindakan berdasarkan Klasifikasi:

| Klasifikasi | Indikator | Tindakan |
|---|---|---|
| **Legitimate user** | 1-2 IP, pattern normal (upload → process → download) | Pertimbangkan naikkan rate limit untuk use case tersebut |
| **Bot/scraper** | 1 IP, request berulang tanpa file upload | Block IP (jika memungkinkan), atau biarkan rate limit handle |
| **DDoS attempt** | Banyak IP, volume sangat tinggi | Aktifkan Cloudflare protection, pertimbangkan WAF rules |
| **Misconfigured client** | 1 IP, retry loop tanpa backoff | Identifikasi client, perbaiki retry logic |

---

## 9. Log Analysis

### 9.1 Lokasi Log per Komponen

| Komponen | Lokasi | Format | Retensi | Akses |
|---|---|---|---|---|
| Frontend (Vercel) | Vercel Dashboard → Logs | Plain text + JSON | 1 jam (real-time) | Web UI |
| Backend (Railway) | Railway Dashboard → Logs | Structured JSON | 7 hari | Web UI + search |
| R2 Operations | Cloudflare Dashboard → R2 Analytics | Aggregated metrics | 30 hari | Web UI |
| Deployment (Vercel) | Vercel → Deployments → Build Logs | Plain text | Permanent (per deploy) | Web UI |
| Deployment (Railway) | Railway → Deployments → Build Logs | Plain text | Permanent (per deploy) | Web UI |

### 9.2 Format Log Backend (Structured JSON)

Semua log backend menggunakan format JSON terstruktur yang didefinisikan di `backend/utils/logging_config.py`:

```json
{
    "timestamp": "2025-06-15T10:30:45.123456+00:00",
    "level": "INFO",
    "logger": "services.compress",
    "message": "task_completed: compress",
    "event": "task_completed",
    "tool": "compress",
    "duration_ms": 1234,
    "input_size_bucket": "medium",
    "success": true
}
```

#### Field yang Tersedia:

| Field | Tipe | Deskripsi | Selalu Ada |
|---|---|---|---|
| `timestamp` | string (ISO 8601) | Waktu event dalam UTC | Ya |
| `level` | string | INFO, WARNING, ERROR | Ya |
| `logger` | string | Nama module Python | Ya |
| `message` | string | Deskripsi singkat event | Ya |
| `event` | string | Event type (task_started, task_completed, task_failed) | Untuk task events |
| `tool` | string | Tool yang digunakan (compress, image_to_pdf, pdf_to_image) | Untuk task events |
| `duration_ms` | integer | Durasi processing dalam milliseconds | Untuk task events |
| `input_size_bucket` | string | Kategori ukuran: small (< 1MB), medium (1-10MB), large (> 10MB) | Untuk task events |
| `success` | boolean | Apakah operasi berhasil | Untuk task events |
| `error` | string | Pesan error (jika gagal) | Hanya saat error |
| `exception` | string | Stack trace (jika ada exception) | Hanya saat exception |

### 9.3 Cara Mencari Log di Railway

#### 9.3.1 Search Queries yang Berguna

| Tujuan | Search Query | Keterangan |
|---|---|---|
| Semua error | `"level":"ERROR"` | Menampilkan semua log level ERROR |
| Error spesifik tool | `"tool":"compress" "level":"ERROR"` | Error hanya untuk compress |
| Task yang lambat | `"duration_ms"` + manual filter > 2000 | Identifikasi slow requests |
| Cleanup cron | `"cleanup"` | Log dari cleanup process |
| R2 operations | `"r2"` atau `"upload"` atau `"signed_url"` | Log terkait R2 |
| Rate limiting | `429` atau `"rate_limit"` | Request yang di-rate-limit |
| Startup/shutdown | `"startup"` atau `"shutdown"` | Container lifecycle events |

#### 9.3.2 Contoh Analisis Log

**Skenario: Mencari penyebab error rate tinggi**

1. Railway Logs → search `"level":"ERROR"` → set timeframe 1 jam terakhir.
2. Identifikasi error yang paling sering muncul.
3. Untuk setiap error unik, catat:
   - `tool`: Tool mana yang terdampak?
   - `error`: Pesan error apa?
   - `exception`: Stack trace menunjuk ke mana?
4. Korelasikan dengan metrics: apakah CPU/memory spike bersamaan?

**Skenario: Mengukur response time trend**

1. Railway Logs → search `"event":"task_completed"`.
2. Perhatikan field `duration_ms` untuk setiap entry.
3. Kelompokkan per tool:
   - compress: baseline 800–1500 ms
   - image_to_pdf: baseline 200–400 ms
   - pdf_to_image: baseline 300–500 ms
4. Flag jika ada entry dengan `duration_ms` > 2x baseline.

### 9.4 Pola Log yang Perlu Diwaspadai

| Pola | Indikasi | Tindakan |
|---|---|---|
| Banyak `"level":"ERROR"` berturut-turut | Service degradation atau dependency failure | Investigasi segera (Playbook 8.1) |
| `duration_ms` meningkat gradual | Memory leak atau resource exhaustion | Monitor trend, restart jika perlu |
| `"error":"ConnectionTimeout"` ke R2 | R2 atau network issue | Cek Cloudflare status, retry |
| Tidak ada log cleanup dalam 24 jam | Cron tidak berjalan | Investigasi (Playbook 8.4) |
| Banyak `429` dari 1 IP | Possible abuse atau misconfigured client | Analisis (Playbook 8.6) |
| `"exception":"MemoryError"` | Container kehabisan memory | Restart, investigate memory usage |
| `"exception":"OSError"` + Ghostscript | Ghostscript crash pada file tertentu | Identify problematic file pattern, add validation |

### 9.5 Log Retention & Limitasi

| Platform | Retensi | Limitasi | Workaround |
|---|---|---|---|
| Railway (free/starter) | 7 hari | Tidak bisa export, search terbatas | Screenshot/copy log penting, pertimbangkan log drain |
| Vercel (Hobby) | 1 jam (real-time) | Sangat terbatas untuk historical analysis | Gunakan Vercel Analytics untuk data historis |
| Cloudflare R2 | 30 hari (analytics) | Hanya aggregated metrics, bukan per-request | Cukup untuk capacity planning |

---

## 10. Rekomendasi Peningkatan

### 10.1 Prioritas Implementasi

| Prioritas | Rekomendasi | Biaya | Effort | Impact |
|---|---|---|---|---|
| **P1 — Segera** | Uptime monitoring (BetterStack/UptimeRobot) | $0 | 30 menit setup | Deteksi downtime otomatis |
| **P1 — Segera** | Telegram alert bot | $0 | 1 jam setup | Notifikasi real-time |
| **P2 — Bulan Depan** | Error tracking (Sentry free tier) | $0 | 2 jam integrasi | Stack trace, error grouping, trend |
| **P2 — Bulan Depan** | Status page publik (BetterStack/Instatus) | $0 | 1 jam setup | Transparansi ke user |
| **P3 — Quarter Depan** | Log aggregation (BetterStack Logs) | $0–$25/bln | 4 jam setup | Centralized search, longer retention |
| **P3 — Quarter Depan** | APM (Application Performance Monitoring) | $0–$25/bln | 4 jam integrasi | End-to-end tracing, bottleneck detection |
| **P4 — Saat Revenue** | Synthetic monitoring (scheduled tests) | $10–$25/bln | 8 jam setup | Proactive issue detection |
| **P4 — Saat Revenue** | Custom dashboard (Grafana Cloud free) | $0 | 8 jam setup | Unified view semua metrics |

### 10.2 Detail Rekomendasi P1 — Uptime Monitoring

#### Opsi A: BetterStack (Direkomendasikan)

| Aspek | Detail |
|---|---|
| **URL** | betterstack.com |
| **Free Tier** | 5 monitors, 3-minute checks, email alerts |
| **Kelebihan** | UI modern, incident timeline, status page built-in, Telegram integration |
| **Setup** | Sign up → Add monitor → Configure alert → Connect Telegram |
| **Estimasi Setup** | 30 menit |

#### Opsi B: UptimeRobot

| Aspek | Detail |
|---|---|
| **URL** | uptimerobot.com |
| **Free Tier** | 50 monitors, 5-minute checks, email alerts |
| **Kelebihan** | Lebih banyak monitors di free tier, mature platform |
| **Kekurangan** | UI kurang modern, Telegram integration via webhook (manual) |
| **Estimasi Setup** | 30 menit |

### 10.3 Detail Rekomendasi P2 — Error Tracking (Sentry)

| Aspek | Detail |
|---|---|
| **URL** | sentry.io |
| **Free Tier** | 5.000 events/bulan, 1 user, 30-day retention |
| **Integrasi Backend** | `pip install sentry-sdk[fastapi]` → init di `main.py` |
| **Integrasi Frontend** | `npm install @sentry/nextjs` → init di `next.config.js` |
| **Fitur Kunci** | Error grouping, stack trace, breadcrumbs, performance tracing |
| **Estimasi Setup** | 2 jam (backend + frontend) |

#### Konfigurasi Sentry yang Direkomendasikan:

```python
# backend/main.py — tambahkan sebelum app initialization
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),  # Sudah ada di .env.example
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,  # 10% sampling untuk performance
    environment="production",
)
```

### 10.4 Detail Rekomendasi P3 — Log Aggregation

| Aspek | Detail |
|---|---|
| **Tool** | BetterStack Logs (formerly Logtail) |
| **Free Tier** | 1 GB/bulan, 3-day retention |
| **Integrasi** | Railway log drain → BetterStack endpoint |
| **Kelebihan** | Full-text search, structured query, dashboards, alerts on log patterns |
| **Estimasi Setup** | 4 jam |

### 10.5 Detail Rekomendasi P3 — APM

| Aspek | Detail |
|---|---|
| **Tool** | Sentry Performance (included in free tier) |
| **Fitur** | Transaction tracing, span waterfall, slow query detection |
| **Integrasi** | Sudah termasuk jika Sentry SDK diinstall (P2) |
| **Kelebihan** | Tidak perlu tool tambahan, unified error + performance view |
| **Estimasi Setup** | Minimal (sudah termasuk di Sentry setup) |

### 10.6 Roadmap Implementasi Monitoring

```
┌─────────────────────────────────────────────────────────────────┐
│              MONITORING MATURITY ROADMAP — PAPYR                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FASE 1 (Sekarang)          FASE 2 (Bulan Depan)               │
│  ─────────────────          ──────────────────────              │
│  ✅ Platform-native          □ BetterStack uptime               │
│     dashboards               □ Telegram alerts                  │
│  ✅ Structured JSON logs     □ Sentry error tracking            │
│  ✅ Manual daily checks      □ Public status page               │
│  ✅ Health check endpoint                                       │
│                                                                  │
│  FASE 3 (Quarter Depan)     FASE 4 (Saat Revenue)              │
│  ───────────────────────    ──────────────────────              │
│  □ Centralized logging       □ Synthetic monitoring             │
│    (BetterStack Logs)        □ Custom Grafana dashboard         │
│  □ APM / Performance         □ SLO tracking otomatis            │
│    tracing (Sentry)          □ Capacity planning alerts         │
│  □ Log-based alerting        □ Cost anomaly detection           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 10.7 Estimasi Biaya Monitoring (Projected)

| Fase | Tools | Biaya/Bulan | Catatan |
|---|---|---|---|
| Fase 1 (Current) | Platform-native only | $0 | Sudah termasuk di Vercel Free + Railway $5 |
| Fase 2 | + BetterStack + Telegram | $0 | Free tier cukup untuk traffic saat ini |
| Fase 3 | + Sentry + BetterStack Logs | $0 | Free tier cukup hingga ~10K events/bulan |
| Fase 4 | + Grafana Cloud + Synthetic | $0–$25 | Upgrade saat traffic > 50K visits/bulan |

---

## 11. Persetujuan Dokumen

### Tanda Tangan Persetujuan

| Peran | Nama | Status | Tanggal |
|---|---|---|---|
| **Product Owner** | Muhammad Fa'iz Zulfikar | Approved | Juni 2025 |
| **AI Agent** | OpenCode/Sisyphus | Approved | Juni 2025 |

### Ketentuan Persetujuan

Dengan menyetujui dokumen ini, pihak-pihak di atas mengkonfirmasi bahwa:

1. Seluruh prosedur monitoring yang didefinisikan telah direview dan sesuai dengan kebutuhan operasional Papyr.
2. Threshold dan target metrik yang ditetapkan selaras dengan SLA (PPR-SLA-001).
3. Playbook per alert memberikan panduan yang cukup untuk penanganan insiden awal.
4. Rekomendasi peningkatan akan dievaluasi dan diimplementasikan secara bertahap sesuai prioritas.
5. Dokumen ini akan ditinjau ulang setiap quarter atau saat ada perubahan signifikan pada infrastruktur.

---

*Dokumen ini bersifat CONFIDENTIAL dan hanya untuk penggunaan internal tim Papyr serta keperluan investor.*

*Terakhir diperbarui: Juni 2025 | Versi: 1.0*
