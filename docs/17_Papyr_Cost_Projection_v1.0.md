# Papyr — Cost Projection & Break-Even Analysis

| Field | Value |
|-------|-------|
| **ID Dokumen** | PPR-CP-001 |
| **Versi** | 1.0 |
| **Status** | Approved |
| **Terakhir Diubah** | 2026-05-03 |
| **Penulis** | Muhammad Fa'iz Zulfikar |
| **Kerahasiaan** | Confidential — Internal and Investor Use Only |
| **Dokumen Terkait** | PPR-BRD-001 (Doc 01) |

---

## Riwayat Versi

| Versi | Tanggal | Penulis | Deskripsi |
|-------|---------|---------|-----------|
| 1.0 | 2026-05-03 | Muhammad Fa'iz Zulfikar | Rilis awal — proyeksi biaya lengkap, skenario scaling, dan analisis break-even untuk Papyr MVP |

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Asumsi & Metodologi](#2-asumsi--metodologi)
3. [Rincian Biaya Saat Ini (MVP)](#3-rincian-biaya-saat-ini-mvp)
4. [Skenario Biaya](#4-skenario-biaya)
5. [Proyeksi Pendapatan](#5-proyeksi-pendapatan)
6. [Analisis Break-Even](#6-analisis-break-even)
7. [Proyeksi 12 Bulan](#7-proyeksi-12-bulan)
8. [Strategi Scaling](#8-strategi-scaling)
9. [Optimasi Biaya](#9-optimasi-biaya)
10. [Risiko Finansial](#10-risiko-finansial)
11. [Persetujuan Dokumen](#11-persetujuan-dokumen)

---

## 1. Executive Summary

### 1.1 Ringkasan Finansial Utama

Papyr adalah web application utilitas PDF yang sangat efisien secara modal. Dengan arsitektur hybrid (client-side processing untuk operasi ringan, server-side untuk operasi berat), Papyr beroperasi pada biaya infrastruktur yang sangat rendah — hanya **~$6/bulan (~Rp 96.000/bulan)** pada fase MVP saat ini.

| Metrik | Nilai |
|--------|-------|
| **Total Biaya Bulanan (MVP)** | ~$6/bulan (~Rp 96.000/bulan) |
| **Total Biaya Tahunan (MVP)** | ~$72/tahun (~Rp 1.152.000/tahun) |
| **Break-Even (Skenario Base)** | ~7 subscriber Pro |
| **Break-Even (Skenario Optimis)** | ~25 subscriber Pro |
| **Gross Margin (pada skala)** | 85-95% |
| **Biaya per Task (MVP)** | ~Rp 0,10/task (mendekati nol) |

### 1.2 Efisiensi Modal

```
Biaya Bulanan (MVP):         ~Rp 96.000
Biaya Bulanan Maksimum:      Rp 200.000 (budget ceiling)
Utilisasi Budget:            48%
Buffer Tersisa:              ~Rp 104.000/bulan (52%)
```

### 1.3 Insight Utama

Struktur biaya Papyr sangat unik dibandingkan SaaS pada umumnya:

- **Tidak ada biaya variabel per-user** — Papyr tidak menggunakan AI, database per-user, atau email transaksional. Biaya hampir seluruhnya fixed.
- **Client-side processing menghilangkan beban server** — Merge, Split, dan Rotate diproses 100% di browser pengguna. Zero server cost untuk operasi ini.
- **Tidak ada persistent storage per-user** — File dihapus otomatis dalam 60 menit. Tidak ada akumulasi data.
- **Scaling cost sangat rendah** — Migrasi ke VPS self-hosted ($5-15/bulan) dapat menangani 10x traffic tanpa kenaikan biaya signifikan.
- **Produk dapat bertahan tanpa batas** pada pendanaan founder tanpa tekanan revenue.

### 1.4 Komposisi Biaya (Fase MVP)

```
Vercel (Frontend):         $0/bulan       (0% — Free Tier)
Railway (Backend):         $5/bulan       (83.3%)
Cloudflare R2 (Storage):   $0/bulan       (0% — Free Tier)
Vercel Analytics:          $0/bulan       (0% — Free Tier)
Domain (mypapyr.com):      ~$1/bulan      (16.7% — amortisasi $10-12/tahun)
──────────────────────────────────────────────────────────
TOTAL:                     ~$6/bulan      (~Rp 96.000/bulan)
```

### 1.5 Outlook Finansial 12 Bulan (Skenario Base)

```
Total Biaya 12 Bulan:          Rp 1.472.000 (~$92,00)
Proyeksi Revenue 12 Bulan:     Rp 4.281.930 (~$267,62) — jika monetisasi dimulai Bulan 7
Net Profit 12 Bulan:           +Rp 2.809.930 (~$175,62)
Break-Even Kumulatif:          ~Bulan 8-9
```

---

## 2. Asumsi & Metodologi

### 2.1 Kurs Referensi

Semua kalkulasi menggunakan kurs tetap:

```
1 USD = Rp 16.000
```

Kurs ini digunakan untuk konsistensi. Kurs aktual dapat bervariasi +/-5%.

### 2.2 Asumsi Pertumbuhan Traffic

| Skenario | Tasks/Hari | Unique Visitors/Hari | Monthly Tasks | Keterangan |
|----------|-----------|---------------------|---------------|------------|
| Current (MVP) | 0-50 | 0-30 | 0-1.500 | Soft launch, organic only |
| Growth | 50-500 | 30-300 | 1.500-15.000 | SEO traction, word-of-mouth |
| Scale | 500-5.000 | 300-3.000 | 15.000-150.000 | Established organic traffic |
| Dominance | 5.000+ | 3.000+ | 150.000+ | Market leader di Indonesia |

### 2.3 Asumsi Perilaku Pengguna

| Metrik | Asumsi | Sumber |
|--------|--------|--------|
| Tasks per visitor per session | 1,5 | Estimasi berdasarkan use case (compress + merge) |
| Rata-rata ukuran file | 3 MB | Sesuai use case mahasiswa dan pekerja kantoran |
| Rasio client-side vs server-side | 60:40 | 3 dari 6 tool diproses di client (merge, split, rotate) |
| Repeat usage rate (30 hari) | 25-40% | Target BRD |
| Mobile vs Desktop | 70:30 | Sesuai demografi Indonesia |
| Peak hours | 19:00-23:00 WIB | Mahasiswa mengerjakan tugas malam hari |

### 2.4 Asumsi Pricing (Roadmap — Fase 3+)

| Plan | Harga | Billing | Efektif Bulanan |
|------|-------|---------|-----------------|
| Free (Tanpa Login) | Rp 0 | — | Rp 0 |
| Free (Dengan Login) | Rp 0 | — | Rp 0 |
| Pro Monthly | Rp 19.900/bulan | Bulanan | Rp 19.900 |
| Pro Annual | Rp 149.000/tahun | Tahunan | Rp 12.417 |

### 2.5 Metodologi Kalkulasi

1. **Biaya tetap** dihitung bulanan, biaya tahunan diamortisasi (dibagi 12)
2. **Biaya variabel** dihitung berdasarkan volume traffic/tasks, bukan per-user
3. **Tidak ada biaya AI** — Papyr tidak menggunakan model AI apapun
4. **Tidak ada biaya email** — Papyr tidak mengirim email transaksional (zero-login model)
5. **Tidak ada biaya database** — Papyr tidak menyimpan data pengguna secara persisten
6. **Storage bersifat transient** — File dihapus dalam 60 menit, tidak ada akumulasi

### 2.6 Definisi Milestone

| Milestone | Tasks/Hari | Signifikansi | Timeline Estimasi |
|-----------|-----------|--------------|-------------------|
| M0 | 0 | Pre-launch | Bulan -2 s/d 0 |
| M1 | 10-50 | Soft launch, validasi | Bulan 1-3 |
| M2 | 50-200 | SEO mulai traction | Bulan 3-6 |
| M3 | 200-1.000 | Growth phase, pertimbangkan monetisasi | Bulan 6-9 |
| M4 | 1.000-5.000 | Scale phase, migrasi VPS | Bulan 9-12 |
| M5 | 5.000+ | Market leader, Pro tier aktif | Bulan 12+ |

### 2.7 Asumsi Pajak & Regulasi

| Item | Tarif | Catatan |
|------|-------|---------|
| PPN (VAT) | 11% | Berlaku untuk domain renewal dan layanan digital |
| PPh UMKM | 0,5% dari omzet | Tarif UMKM untuk omzet < Rp 4,8M/tahun |
| Payment gateway fee | ~2-3% per transaksi | Midtrans/Xendit (QRIS, e-wallet, VA, CC) |

---

## 3. Rincian Biaya Saat Ini (MVP)

### 3.1 Vercel — Frontend Hosting

#### 3.1.1 Spesifikasi Free Tier

| Resource | Limit Free Tier | Penggunaan Papyr (MVP) | Headroom |
|----------|----------------|------------------------|----------|
| Bandwidth | 100 GB/bulan | ~5 GB/bulan | 95 GB (95%) |
| Serverless Function Execution | 100 jam/bulan | ~2 jam/bulan | 98 jam (98%) |
| Builds | 6.000 menit/bulan | ~300 menit/bulan | 5.700 menit (95%) |
| Deployments | Unlimited | ~30/bulan | Unlimited |
| Edge Network | Global CDN | Aktif | — |
| SSL/TLS | Included | Aktif | — |
| Analytics | Included (basic) | Aktif | — |

**Biaya: Rp 0/bulan**

#### 3.1.2 Kapan Perlu Upgrade

| Trigger | Estimasi Traffic | Biaya Pro Plan |
|---------|-----------------|----------------|
| Bandwidth > 100 GB/bulan | ~30.000 visitors/bulan | $20/bulan (Rp 320.000) |
| Serverless > 100 jam/bulan | ~50.000 tasks/bulan | $20/bulan (Rp 320.000) |
| Butuh team features | N/A | $20/bulan (Rp 320.000) |

**Estimasi:** Free tier cukup hingga ~30.000 monthly visitors (~10.000 tasks/hari). Pada volume ini, lebih efisien migrasi ke VPS self-hosted daripada upgrade ke Vercel Pro.

### 3.2 Railway — Backend Hosting

#### 3.2.1 Spesifikasi Plan

| Resource | Hobby Plan ($5/bulan) | Penggunaan Papyr (MVP) | Headroom |
|----------|----------------------|------------------------|----------|
| RAM | 8 GB shared | ~512 MB (FastAPI + Ghostscript) | ~7,5 GB |
| vCPU | 8 vCPU shared | ~0,5 vCPU avg | ~7,5 vCPU |
| Disk | 10 GB ephemeral | ~2 GB (app + dependencies) | ~8 GB |
| Bandwidth | 100 GB egress/bulan | ~3 GB/bulan | ~97 GB |
| Execution | $5 credit included | ~$2-3 usage/bulan | ~$2-3 buffer |

**Biaya: $5/bulan (Rp 80.000/bulan)**

#### 3.2.2 Resource Allocation

```
FastAPI process:             ~256 MB RAM
Ghostscript (per task):      ~128 MB RAM (transient, per-request)
PyMuPDF (per task):          ~64 MB RAM (transient, per-request)
Python runtime:              ~64 MB RAM
OS overhead:                 ~128 MB RAM
─────────────────────────────────────────
Total steady-state:          ~512 MB RAM
Peak (concurrent tasks):     ~768 MB RAM
```

#### 3.2.3 Kapan Perlu Upgrade/Migrasi

| Trigger | Estimasi Volume | Aksi |
|---------|----------------|------|
| $5 credit habis sebelum akhir bulan | ~500 tasks/hari (server-side) | Monitor usage |
| Response time > 5 detik (P95) | ~1.000 concurrent tasks | Migrasi ke VPS |
| RAM > 4 GB sustained | ~2.000 tasks/hari (server-side) | Migrasi ke VPS |

### 3.3 Cloudflare R2 — Object Storage

#### 3.3.1 Spesifikasi Free Tier

| Resource | Limit Free Tier | Penggunaan Papyr (MVP) | Headroom |
|----------|----------------|------------------------|----------|
| Storage | 10 GB | ~0,5 GB (transient, auto-delete 60 min) | 9,5 GB (95%) |
| Class A Operations (write) | 1.000.000/bulan | ~3.000/bulan | 997.000 (99,7%) |
| Class B Operations (read) | 10.000.000/bulan | ~6.000/bulan | 9.994.000 (99,9%) |
| Egress | Free (always) | ~2 GB/bulan | Unlimited |

**Biaya: Rp 0/bulan**

#### 3.3.2 Mengapa Storage Tetap Rendah

```
Rata-rata file di R2:        3 MB
Rata-rata retention:         30 menit (user download) — max 60 menit
Tasks per hari (MVP):        ~50
Concurrent files di R2:      ~50 tasks x 3 MB = 150 MB (peak)

Storage TIDAK akumulatif karena auto-delete.
Bahkan pada 10.000 tasks/hari:
  10.000 x 3 MB = 30 GB peak (masih dalam free tier jika spread across 24 jam)
  Realitas: ~2.000 concurrent files x 3 MB = 6 GB peak
```

#### 3.3.3 Kapan Perlu Bayar

| Trigger | Estimasi Volume | Biaya Tambahan |
|---------|----------------|----------------|
| Storage > 10 GB concurrent | ~3.000+ concurrent tasks | $0,015/GB/bulan |
| Write ops > 1M/bulan | ~33.000 tasks/hari | $4,50/juta operasi |
| Read ops > 10M/bulan | ~330.000 tasks/hari | $0,36/juta operasi |

**Estimasi:** Free tier cukup hingga ~10.000 tasks/hari. Biaya R2 tetap sangat rendah bahkan pada volume tinggi karena sifat transient storage.

### 3.4 Vercel Analytics

| Fitur | Status | Biaya |
|-------|--------|-------|
| Web Analytics (pageviews, visitors) | Aktif | Rp 0 |
| Custom Events (task_started, task_completed, task_failed) | Aktif | Rp 0 |
| Speed Insights | Aktif | Rp 0 |
| Device & Browser breakdown | Aktif | Rp 0 |

**Biaya: Rp 0/bulan** (included dalam Vercel Free Tier)

### 3.5 Domain (mypapyr.com)

#### 3.5.1 Jadwal Biaya Domain

| Tahun | Biaya Tahunan | Amortisasi Bulanan | Catatan |
|-------|---------------|-------------------|---------|
| Tahun 1 | ~$10-12 (~Rp 160.000-192.000) | ~Rp 14.667/bulan | Harga tahun pertama |
| Tahun 2+ | ~$12-15 (~Rp 192.000-240.000) | ~Rp 18.000/bulan | Harga renewal standar |

**Biaya (amortisasi): ~$1/bulan (~Rp 16.000/bulan)**

### 3.6 Layanan Gratis Lainnya

| Layanan | Fungsi | Biaya |
|---------|--------|-------|
| Cloudflare DNS | DNS management untuk mypapyr.com | Rp 0 |
| Let's Encrypt / Vercel SSL | Sertifikat HTTPS | Rp 0 |
| GitHub (private repo) | Version control, CI/CD | Rp 0 |
| Hostinger DNS | DNS management | Rp 0 |

### 3.7 Ringkasan Total Biaya MVP

| Komponen | Biaya/Bulan (USD) | Biaya/Bulan (Rp) | % dari Total |
|----------|-------------------|-------------------|--------------|
| Vercel (Frontend) | $0 | Rp 0 | 0% |
| Railway (Backend) | $5 | Rp 80.000 | 83,3% |
| Cloudflare R2 (Storage) | $0 | Rp 0 | 0% |
| Vercel Analytics | $0 | Rp 0 | 0% |
| Domain (amortisasi) | ~$1 | ~Rp 16.000 | 16,7% |
| **TOTAL** | **~$6** | **~Rp 96.000** | **100%** |

```
Biaya Tahunan Total (MVP): ~$72 (~Rp 1.152.000)
Biaya per Task (pada 1.000 tasks/bulan): ~Rp 96/task
Biaya per Task (pada 10.000 tasks/bulan): ~Rp 9,6/task
Biaya per Task (pada 100.000 tasks/bulan): ~Rp 0,96/task
```

---

## 4. Skenario Biaya

### 4.1 Skenario 1: Current — MVP (0-1.000 tasks/hari)

**Profil:** Soft launch, organic traffic awal, validasi product-market fit.

| Komponen | Biaya/Bulan | Catatan |
|----------|-------------|---------|
| Vercel | $0 | Free Tier — bandwidth < 10 GB |
| Railway | $5 | Hobby Plan — usage < $3 |
| Cloudflare R2 | $0 | Free Tier — storage < 1 GB concurrent |
| Vercel Analytics | $0 | Free Tier |
| Domain | ~$1 | Amortisasi tahunan |
| **TOTAL** | **~$6/bulan** | **~Rp 96.000/bulan** |

**Kapasitas:**
```
Server-side tasks:     ~400/hari (compress, image-to-pdf, pdf-to-image)
Client-side tasks:     Unlimited (merge, split, rotate — zero server cost)
Bandwidth:             ~100 GB/bulan (Vercel) + ~100 GB/bulan (Railway)
Storage concurrent:    < 1 GB di R2
```

### 4.2 Skenario 2: Growth (1.000-10.000 tasks/hari)

**Profil:** SEO mulai menghasilkan traffic organik signifikan. Keyword "compress PDF", "gabung PDF" ranking di halaman 1 Google Indonesia.

| Komponen | Biaya/Bulan | Catatan |
|----------|-------------|---------|
| Vercel | $0 | Free Tier masih cukup (bandwidth ~50 GB) |
| Railway | $5-10 | Usage mendekati/melebihi $5 credit |
| Cloudflare R2 | $0-2 | Mendekati batas free tier pada write ops |
| Vercel Analytics | $0 | Free Tier |
| Domain | ~$1 | Amortisasi tahunan |
| **TOTAL** | **~$7-14/bulan** | **~Rp 112.000-224.000/bulan** |

**Kapasitas & Bottleneck:**
```
Server-side tasks:     ~4.000/hari
Client-side tasks:     Unlimited
Bandwidth:             ~50-80 GB/bulan (Vercel), ~50 GB/bulan (Railway)
Storage concurrent:    ~3-5 GB di R2
Bottleneck utama:      Railway $5 credit mungkin tidak cukup
```

**Aksi yang Diperlukan:**
- Monitor Railway usage dashboard
- Siapkan migrasi ke VPS jika Railway cost > $10/bulan
- Pertimbangkan mulai monetisasi (Pro tier)

### 4.3 Skenario 3: Scale (10.000-100.000 tasks/hari) — Migrasi VPS

**Profil:** Traffic tinggi, Papyr menjadi salah satu PDF tool utama di Indonesia. Migrasi dari managed services ke VPS self-hosted untuk efisiensi biaya.

#### 4.3.1 VPS Provider — HostData.id (Primary Choice)

**Provider utama:** [HostData.id](https://hostdata.id) — VPS provider Indonesia dengan data center lokal.

| Provider | Plan | RAM | vCPU | SSD | Bandwidth | Harga/Bulan |
|----------|------|-----|------|-----|-----------|-------------|
| **HostData.id (Rekomendasi)** | VPS SSD | 8 GB | 4 | 100 GB NVMe | Unlimited | ~Rp 100.000-150.000 |
| HostData.id | VPS SSD | 16 GB | 8 | 200 GB NVMe | Unlimited | ~Rp 200.000-300.000 |

**Alasan memilih HostData.id:**
- Data center Indonesia — latensi rendah untuk pengguna lokal
- Harga kompetitif dalam Rupiah — tidak terpengaruh fluktuasi kurs
- Support lokal dalam Bahasa Indonesia
- Sesuai dengan positioning Papyr sebagai "tool Indonesia untuk Indonesia"

#### 4.3.2 Arsitektur VPS (Rekomendasi)

**Single VPS — All-in-One (10K-50K tasks/hari):**

| Komponen | Spesifikasi | Catatan |
|----------|-------------|---------|
| VPS | HostData.id VPS SSD (8 GB, 4 vCPU) | ~Rp 100.000-150.000/bulan |
| Frontend | Next.js (Docker container) | ~1 GB RAM |
| Backend | FastAPI (Docker container) | ~1 GB RAM |
| Reverse Proxy | Nginx/Caddy | ~128 MB RAM |
| Ghostscript | System library | Shared dengan backend |
| OS + Buffer | Ubuntu 22.04 | ~2 GB RAM |
| **Total RAM Used** | **~4 GB** | **Buffer: 4 GB** |

**Biaya Skenario Scale:**

| Komponen | Biaya/Bulan | Catatan |
|----------|-------------|---------|
| VPS (HostData.id) | Rp 100.000-150.000 | Single VPS all-in-one |
| Cloudflare R2 | $0-5 | Mungkin melewati free tier |
| Cloudflare (CDN/DNS) | $0 | Free Tier |
| Domain | ~$1 | Amortisasi tahunan |
| SSL (Let's Encrypt) | $0 | Free |
| **TOTAL** | **~$8-20/bulan** | **~Rp 128.000-320.000/bulan** |

#### 4.3.3 Perbandingan Biaya: Managed vs Self-Hosted

| Volume | Managed (Vercel + Railway) | Self-Hosted (VPS) | Penghematan |
|--------|---------------------------|-------------------|-------------|
| 1.000 tasks/hari | ~$6/bulan | ~$8/bulan | -$2 (managed lebih murah) |
| 5.000 tasks/hari | ~$12/bulan | ~$8/bulan | +$4 (33% hemat) |
| 10.000 tasks/hari | ~$25/bulan | ~$8/bulan | +$17 (68% hemat) |
| 50.000 tasks/hari | ~$60+/bulan | ~$14/bulan | +$46 (77% hemat) |
| 100.000 tasks/hari | ~$150+/bulan | ~$14-28/bulan | +$122 (81% hemat) |

**Titik migrasi optimal:** ~5.000 tasks/hari — saat self-hosted mulai lebih murah.

### 4.4 Ringkasan Semua Skenario

| Skenario | Tasks/Hari | Biaya/Bulan (USD) | Biaya/Bulan (Rp) | Biaya/Task |
|----------|-----------|-------------------|-------------------|------------|
| **Current (MVP)** | 0-1.000 | ~$6 | ~Rp 96.000 | Rp 3,2-96 |
| **Growth** | 1.000-10.000 | ~$7-14 | ~Rp 112.000-224.000 | Rp 0,7-7,5 |
| **Scale (VPS)** | 10.000-100.000 | ~$8-20 | ~Rp 128.000-320.000 | Rp 0,1-1,1 |
| **Dominance (VPS)** | 100.000+ | ~$14-28 | ~Rp 224.000-448.000 | < Rp 0,15 |

**Insight kunci:** Biaya per task menurun drastis seiring volume meningkat. Pada skala 100.000 tasks/hari, biaya per task mendekati Rp 0,1 — hampir gratis.

---

## 5. Proyeksi Pendapatan

### 5.1 Model Revenue

Papyr menggunakan model **freemium** dengan monetisasi melalui tier Pro:

```
Free Tier (Tanpa Login):
  - Semua tool dasar unlimited
  - Max file 20 MB
  - Didukung iklan (opsional, masa depan)

Free Tier (Dengan Login):
  - Semua tool dasar + OCR 5x/hari, PDF-to-Word 5x/hari
  - Sign PDF 5x/hari

Pro Tier:
  - Rp 19.900/bulan ATAU Rp 149.000/tahun
  - Semua tool unlimited
  - Batch processing
  - Max file 100 MB
  - Priority processing
  - No branding
  - API access
```

### 5.2 Payment Gateway

| Metode Pembayaran | Fee | Contoh (Rp 19.900) | Net Revenue |
|-------------------|-----|---------------------|-------------|
| QRIS | 0,7% | Rp 139 | Rp 19.761 |
| E-wallet (GoPay, OVO, DANA) | 2% | Rp 398 | Rp 19.502 |
| Virtual Account (VA) | Rp 4.000 flat | Rp 4.000 | Rp 15.900 |
| Kartu Kredit | 2,9% + Rp 2.000 | Rp 2.577 | Rp 17.323 |

**Blended fee (estimasi distribusi pembayaran Indonesia):**

```
Distribusi metode pembayaran:
  QRIS:       40%
  E-wallet:   30%
  VA:         20%
  CC:         10%

Blended fee per transaksi Rp 19.900:
  QRIS:     0,40 x Rp 139   = Rp 56
  E-wallet: 0,30 x Rp 398   = Rp 119
  VA:       0,20 x Rp 4.000 = Rp 800
  CC:       0,10 x Rp 2.577 = Rp 258
  ─────────────────────────────────────
  Blended fee:                 Rp 1.233
  Blended fee %:               6,2%

Net revenue per subscriber bulanan:
  Rp 19.900 - Rp 1.233 = Rp 18.667

Net revenue per subscriber tahunan (per bulan):
  (Rp 149.000 - Rp 9.238) / 12 = Rp 11.647
```

### 5.3 Blended Net ARPU

```
Asumsi distribusi (base): 60% bulanan, 40% tahunan

Blended Net ARPU = (0,60 x Rp 18.667) + (0,40 x Rp 11.647)
                 = Rp 11.200 + Rp 4.659
                 = Rp 15.859/paying user/bulan
```

### 5.4 Proyeksi Revenue per Skenario

**Asumsi:** Monetisasi dimulai saat monthly active tasks > 10.000 (sekitar Bulan 7 pada skenario base).

#### Skenario Pesimis (1% konversi, 500 MAU)

| Bulan | MAU | Paying Users | MRR | Kumulatif Revenue |
|-------|-----|--------------|-----|-------------------|
| M7 | 500 | 5 | Rp 79.295 | Rp 79.295 |
| M8 | 600 | 6 | Rp 95.154 | Rp 174.449 |
| M9 | 700 | 7 | Rp 111.013 | Rp 285.462 |
| M10 | 800 | 8 | Rp 126.872 | Rp 412.334 |
| M11 | 900 | 9 | Rp 142.731 | Rp 555.065 |
| M12 | 1.000 | 10 | Rp 158.590 | Rp 713.655 |

#### Skenario Base (3% konversi, 2.000 MAU)

| Bulan | MAU | Paying Users | MRR | Kumulatif Revenue |
|-------|-----|--------------|-----|-------------------|
| M7 | 1.000 | 30 | Rp 475.770 | Rp 475.770 |
| M8 | 1.200 | 36 | Rp 570.924 | Rp 1.046.694 |
| M9 | 1.400 | 42 | Rp 666.078 | Rp 1.712.772 |
| M10 | 1.600 | 48 | Rp 761.232 | Rp 2.474.004 |
| M11 | 1.800 | 54 | Rp 856.386 | Rp 3.330.390 |
| M12 | 2.000 | 60 | Rp 951.540 | Rp 4.282.080 |

#### Skenario Optimis (5% konversi, 5.000 MAU)

| Bulan | MAU | Paying Users | MRR | Kumulatif Revenue |
|-------|-----|--------------|-----|-------------------|
| M7 | 2.000 | 100 | Rp 1.585.900 | Rp 1.585.900 |
| M8 | 2.500 | 125 | Rp 1.982.375 | Rp 3.568.275 |
| M9 | 3.000 | 150 | Rp 2.378.850 | Rp 5.947.125 |
| M10 | 3.500 | 175 | Rp 2.775.325 | Rp 8.722.450 |
| M11 | 4.000 | 200 | Rp 3.171.800 | Rp 11.894.250 |
| M12 | 5.000 | 250 | Rp 3.964.750 | Rp 15.859.000 |

### 5.5 Ringkasan Revenue 12 Bulan

| Metrik | Pesimis | Base | Optimis |
|--------|---------|------|---------|
| MAU (Bulan 12) | 1.000 | 2.000 | 5.000 |
| Paying Users (Bulan 12) | 10 | 60 | 250 |
| MRR (Bulan 12) | Rp 158.590 | Rp 951.540 | Rp 3.964.750 |
| Revenue Kumulatif (12 bulan) | Rp 713.655 | Rp 4.282.080 | Rp 15.859.000 |
| ARR (Bulan 12) | Rp 1.903.080 | Rp 11.418.480 | Rp 47.577.000 |

---

## 6. Analisis Break-Even

### 6.1 Definisi Break-Even

- **Monthly break-even:** Bulan di mana Revenue Bulanan >= Biaya Bulanan
- **Cumulative break-even:** Bulan di mana Revenue Kumulatif >= Biaya Kumulatif

### 6.2 Break-Even per Skenario

| Skenario | Biaya Bulanan | Paying Users Dibutuhkan | MAU Dibutuhkan | Konversi Minimum |
|----------|---------------|------------------------|----------------|------------------|
| Current (MVP, $6/bulan) | Rp 96.000 | 7 | 233 (3%) | 1,2% (pada 500 MAU) |
| Growth ($10/bulan) | Rp 160.000 | 11 | 367 (3%) | 2,0% (pada 500 MAU) |
| Scale VPS ($14/bulan) | Rp 224.000 | 15 | 500 (3%) | 1,5% (pada 1.000 MAU) |

**Formula:** `Paying Users Dibutuhkan = Biaya Bulanan / Net ARPU (Rp 15.859)`

### 6.3 Verifikasi Break-Even (Skenario Base)

**Bulan 7 (bulan pertama revenue):**
```
Revenue Bulanan (M7):    Rp 475.770 (30 paying users)
Biaya Bulanan (M7):      Rp 128.000 (~$8, growth phase)
Surplus:                 +Rp 347.770 (POSITIF — monthly break-even tercapai)
```

**Kumulatif break-even:**
```
Biaya kumulatif M1-M7:   7 x Rp 96.000 = Rp 672.000 (pre-revenue)
                          + Rp 128.000 (M7 cost) = Rp 800.000
Revenue kumulatif M7:     Rp 475.770
Defisit:                  -Rp 324.230

Biaya kumulatif M1-M8:    Rp 800.000 + Rp 128.000 = Rp 928.000
Revenue kumulatif M8:      Rp 1.046.694
Surplus:                   +Rp 118.694 (POSITIF)
```

**Kumulatif break-even tercapai antara Bulan 7 dan Bulan 8.**

### 6.4 Minimum Viable Paying Users

| Fase | Biaya Bulanan | Paying Users Dibutuhkan | Sebagai % dari MAU |
|------|---------------|------------------------|---------------------|
| MVP ($6/bulan) | Rp 96.000 | 7 | 1,4% (pada 500 MAU) |
| Growth ($10/bulan) | Rp 160.000 | 11 | 1,1% (pada 1.000 MAU) |
| Scale VPS ($14/bulan) | Rp 224.000 | 15 | 0,6% (pada 2.500 MAU) |
| Scale VPS ($20/bulan) | Rp 320.000 | 21 | 0,4% (pada 5.000 MAU) |

**Insight kunci:** Papyr hanya membutuhkan **0,4-1,4% konversi** untuk break even pada skala apapun. Ini jauh di bawah rata-rata industri freemium (2-5%).

### 6.5 Analisis Sensitivitas — Conversion Rate

**Pada 2.000 MAU, biaya $10/bulan (Rp 160.000):**

| Konversi | Paying Users | MRR | Biaya Bulanan | Profit/Loss |
|----------|-------------|-----|---------------|-------------|
| 0,5% | 10 | Rp 158.590 | Rp 160.000 | -Rp 1.410 |
| 1% | 20 | Rp 317.180 | Rp 160.000 | +Rp 157.180 |
| 2% | 40 | Rp 634.360 | Rp 160.000 | +Rp 474.360 |
| 3% | 60 | Rp 951.540 | Rp 160.000 | +Rp 791.540 |
| 5% | 100 | Rp 1.585.900 | Rp 160.000 | +Rp 1.425.900 |

**Break-even conversion pada 2.000 MAU: 0,5%** — hampir pasti tercapai.

### 6.6 Payback Period

```
Total investasi pre-revenue (M1-M6):  6 x Rp 96.000 = Rp 576.000
Rata-rata surplus bulanan (M7-M12):   ~Rp 700.000
Bulan untuk payback:                  Rp 576.000 / Rp 700.000 = 0,8 bulan
Full payback tercapai:                ~Bulan 8
```

---

## 7. Proyeksi 12 Bulan

### 7.1 Proyeksi Biaya 12 Bulan (Skenario Base)

| Bulan | Tasks/Hari | Infra | Vercel | Railway | R2 | Domain | Total Biaya | Kumulatif Biaya |
|-------|-----------|-------|--------|---------|-----|--------|-------------|-----------------|
| M1 | 10-30 | Managed | $0 | $5 | $0 | $1 | $6 (Rp 96.000) | Rp 96.000 |
| M2 | 30-50 | Managed | $0 | $5 | $0 | $1 | $6 (Rp 96.000) | Rp 192.000 |
| M3 | 50-100 | Managed | $0 | $5 | $0 | $1 | $6 (Rp 96.000) | Rp 288.000 |
| M4 | 100-200 | Managed | $0 | $5 | $0 | $1 | $6 (Rp 96.000) | Rp 384.000 |
| M5 | 200-500 | Managed | $0 | $5 | $0 | $1 | $6 (Rp 96.000) | Rp 480.000 |
| M6 | 500-1.000 | Managed | $0 | $5 | $0 | $1 | $7 (Rp 112.000) | Rp 592.000 |
| M7 | 1.000-2.000 | Managed | $0 | $7 | $0 | $1 | $8 (Rp 128.000) | Rp 720.000 |
| M8 | 2.000-3.000 | Managed | $0 | $8 | $0 | $1 | $9 (Rp 144.000) | Rp 864.000 |
| M9 | 3.000-5.000 | Migrasi VPS | $0 | $0 | $1 | $1 | $9 (Rp 144.000) | Rp 1.008.000 |
| M10 | 5.000-7.000 | VPS | $0 | $0 | $1 | $1 | $9 (Rp 144.000) | Rp 1.152.000 |
| M11 | 7.000-8.000 | VPS | $0 | $0 | $2 | $1 | $10 (Rp 160.000) | Rp 1.312.000 |
| M12 | 8.000-10.000 | VPS | $0 | $0 | $2 | $1 | $10 (Rp 160.000) | Rp 1.472.000 |

**Catatan M9:** Migrasi dari Railway ($8/bulan) ke VPS self-hosted HostData.id (~Rp 100.000-150.000/bulan). Vercel frontend tetap di free tier.

### 7.2 Proyeksi Revenue 12 Bulan (Skenario Base, 3% Konversi)

| Bulan | MAU | Paying Users | MRR (Rp) | Biaya (Rp) | Profit/Loss (Rp) | Kumulatif P/L |
|-------|-----|-------------|----------|------------|-------------------|---------------|
| M1 | 50 | 0 | 0 | 96.000 | -96.000 | -96.000 |
| M2 | 100 | 0 | 0 | 96.000 | -96.000 | -192.000 |
| M3 | 200 | 0 | 0 | 96.000 | -96.000 | -288.000 |
| M4 | 400 | 0 | 0 | 96.000 | -96.000 | -384.000 |
| M5 | 600 | 0 | 0 | 96.000 | -96.000 | -480.000 |
| M6 | 800 | 0 | 0 | 112.000 | -112.000 | -592.000 |
| M7 | 1.000 | 30 | 475.770 | 128.000 | +347.770 | -244.230 |
| M8 | 1.200 | 36 | 570.924 | 144.000 | +426.924 | +182.694 |
| M9 | 1.400 | 42 | 666.078 | 144.000 | +522.078 | +704.772 |
| M10 | 1.600 | 48 | 761.232 | 144.000 | +617.232 | +1.322.004 |
| M11 | 1.800 | 54 | 856.386 | 160.000 | +696.386 | +2.018.390 |
| M12 | 2.000 | 60 | 951.540 | 160.000 | +791.540 | +2.809.930 |

### 7.3 Ringkasan 12 Bulan

```
Total Revenue (12 bulan):      Rp 4.281.930
Total Biaya (12 bulan):        Rp 1.472.000
Net Profit (12 bulan):         +Rp 2.809.930 ($175,62)
Monthly Break-Even:            Bulan 7 (MRR > biaya bulanan)
Cumulative Break-Even:         Bulan 8 (kumulatif revenue > kumulatif biaya)
MRR di Bulan 12:               Rp 951.540 ($59,47)
ARR di Bulan 12:               Rp 11.418.480 ($713,66)
```

### 7.4 Transisi Biaya Penting

| Bulan | Event | Dampak Biaya |
|-------|-------|-------------|
| M6 | Railway usage meningkat | +$1/bulan |
| M7 | Monetisasi dimulai (Pro tier) | Revenue mulai masuk |
| M9 | Migrasi ke VPS self-hosted | Railway $8 -> VPS $7 (hemat $1) |
| M11 | R2 mendekati batas free tier | +$1-2/bulan |

---

## 8. Strategi Scaling

### 8.1 Fase Scaling

```
Fase 1 — Managed Services (Bulan 1-8)
├── Vercel Free Tier (frontend)
├── Railway Hobby Plan (backend)
├── Cloudflare R2 Free Tier (storage)
└── Total: ~$6-9/bulan

Fase 5 — Hybrid (Bulan 9-12)
├── Vercel Free Tier (frontend — tetap)
├── VPS Self-Hosted (backend — migrasi dari Railway)
├── Cloudflare R2 (storage — mungkin mulai bayar)
└── Total: ~$9-12/bulan

Fase 6 — Full Self-Hosted (Bulan 12+)
├── VPS #1: Frontend + Backend (all-in-one)
├── Cloudflare CDN (free tier, caching static assets)
├── Cloudflare R2 (storage)
└── Total: ~$10-20/bulan

Fase 7 — Multi-Node (jika traffic > 100K tasks/hari)
├── VPS #1: Frontend (Next.js SSR)
├── VPS #2: Backend (FastAPI + Ghostscript)
├── Cloudflare CDN + R2
├── Load Balancer (Cloudflare free)
└── Total: ~$20-40/bulan
```

### 8.2 Keputusan Migrasi VPS

| Trigger | Threshold | Aksi | Timeline Estimasi |
|---------|-----------|------|-------------------|
| Railway cost > $8/bulan | ~3.000 server tasks/hari | Mulai siapkan VPS | Bulan 7-8 |
| Railway cost > $10/bulan | ~5.000 server tasks/hari | Eksekusi migrasi | Bulan 8-9 |
| Vercel bandwidth > 80 GB | ~25.000 visitors/bulan | Evaluasi: tetap atau migrasi frontend | Bulan 10-12 |
| Single VPS CPU > 80% | ~50.000 tasks/hari | Tambah VPS kedua | Bulan 15+ |

### 8.3 Strategi Client-Side First

Keunggulan arsitektur Papyr adalah **client-side processing** yang menghilangkan beban server:

```
Tool yang 100% client-side (ZERO server cost):
├── Merge PDF (pdf-lib)
├── Split PDF (pdf-lib)
└── Rotate PDF (pdf-lib)

Tool yang membutuhkan server:
├── Compress PDF (Ghostscript) — SELALU server
├── PDF to Image (PyMuPDF) — SELALU server
└── Image to PDF — Hybrid (< 3MB client, >= 3MB server)

Implikasi biaya:
  Jika 60% tasks adalah client-side → 60% tasks = $0 server cost
  Hanya 40% tasks membebani server
  Pada 10.000 tasks/hari → hanya ~4.000 tasks/hari di server
```

### 8.4 Cloudflare sebagai Force Multiplier

```
Cloudflare Free Tier (sudah aktif):
├── CDN: Cache static assets (JS, CSS, images) → reduce Vercel bandwidth
├── DDoS Protection: Layer 3/4 → protect backend
├── SSL/TLS: Free certificate → no cost
├── DNS: Fast resolution → better UX
└── Bot Protection: Basic → reduce abuse

Cloudflare sebagai scaling tool:
├── Page Rules: Cache HTML pages → reduce server load
├── Cache Everything: Static tool pages → near-zero origin requests
├── Workers (jika perlu): Edge computing → $0 untuk 100K req/hari
└── R2: Already used → no egress fees ever
```

### 8.5 Kapan Perlu Investasi Tambahan

| Trigger | Investasi | Biaya | Kapan |
|---------|-----------|-------|-------|
| Traffic > 50K tasks/hari | VPS upgrade (16 GB) | +$7/bulan | Bulan 15+ |
| Butuh monitoring | Uptime Kuma (self-hosted) | $0 | Bulan 6 |
| Butuh CI/CD | GitHub Actions (free tier) | $0 | Bulan 1 |
| Butuh error tracking | Sentry (free tier, 5K events) | $0 | Bulan 3 |
| Pro tier payment | Midtrans/Xendit integration | $0 (no monthly fee) | Bulan 7 |

---

## 9. Optimasi Biaya

### 9.1 Optimasi Segera (Bulan 1-3)

| Aksi | Penghematan | Effort | Prioritas |
|------|-------------|--------|-----------|
| Maksimalkan client-side processing | 60% server cost avoided | Sudah implementasi | **Selesai** |
| Cloudflare CDN caching untuk static assets | 30-50% bandwidth Vercel | Rendah | **Tinggi** |
| Compress response (gzip/brotli) | 20-30% bandwidth | Rendah | Tinggi |
| Lazy loading images dan components | 10-15% bandwidth | Rendah | Medium |
| Auto-delete R2 files tepat waktu | Minimize storage usage | Sudah implementasi | **Selesai** |

### 9.2 Optimasi Jangka Menengah (Bulan 4-9)

| Aksi | Penghematan | Effort | Prioritas |
|------|-------------|--------|-----------|
| Siapkan Docker image untuk migrasi VPS | Memungkinkan migrasi cepat | Medium | Tinggi |
| Implement queue system untuk server tasks | Prevent overload, better resource usage | Medium | Tinggi |
| Optimize Ghostscript parameters | 10-20% faster processing, less CPU | Rendah | Medium |
| Implement result caching (same file = same result) | 5-10% fewer server tasks | Medium | Rendah |

### 9.3 Optimasi Jangka Panjang (Bulan 9+)

| Aksi | Penghematan | Effort | Prioritas |
|------|-------------|--------|-----------|
| Migrasi ke VPS self-hosted | $3-5/bulan vs Railway | Medium | Tinggi |
| WebAssembly untuk Ghostscript (client-side compress) | Eliminasi server cost untuk compress | Tinggi | Medium |
| Edge caching dengan Cloudflare Workers | Reduce origin requests 50%+ | Medium | Rendah |
| Multi-region VPS (jika ekspansi SEA) | Better latency, higher cost | Tinggi | Rendah |

### 9.4 Di Mana Investasi

| Investasi | Kapan | Expected ROI | Alasan |
|-----------|-------|-------------|--------|
| SEO content (blog, landing pages) | Bulan 1+ | Organic traffic (CAC = Rp 0) | Satu-satunya akuisisi yang viable |
| Tool expansion (Protect, Unlock, Watermark) | Bulan 3-6 | Lebih banyak keyword, lebih banyak traffic | Setiap tool = keyword baru |
| Pro tier development | Bulan 5-7 | Revenue enabler | Diperlukan untuk monetisasi |
| VPS migration preparation | Bulan 6-8 | Cost reduction 30-50% | Persiapan scaling |

### 9.5 Kapan Perlu Hire

| Trigger | Role | Estimasi Biaya | Kapan (Base) |
|---------|------|---------------|-------------|
| Tasks > 50K/hari DAN bug reports > 10/minggu | Part-time developer | Rp 5.000.000/bulan | Bulan 18+ |
| MRR > Rp 5.000.000 | Content writer (SEO) | Rp 3.000.000/bulan | Bulan 15+ |
| MAU > 50.000 | Customer support (part-time) | Rp 2.000.000/bulan | Bulan 24+ |

**Rekomendasi:** Tunda semua hiring. AI agent workflow cukup untuk operasi hingga 50K tasks/hari.

---

## 10. Risiko Finansial

### 10.1 Railway Menaikkan Harga atau Menghapus Hobby Plan

**Probabilitas:** Medium
**Dampak:** Biaya backend naik dari $5 ke $20+/bulan
**Mitigasi:** Arsitektur Docker-ready, siap migrasi ke VPS dalam 4-8 jam
**Severity: RENDAH** — Fully mitigated dengan VPS backup plan

### 10.2 Vercel Mengubah Free Tier Limits

**Probabilitas:** Rendah
**Dampak:** Perlu bayar $20/bulan untuk frontend hosting
**Mitigasi:** Next.js dapat di-deploy ke VPS apapun (Docker). Migrasi 2-4 jam.
**Severity: RENDAH** — Fully mitigated

### 10.3 Traffic Melonjak 10x Lebih Cepat dari Perkiraan

**Probabilitas:** Rendah
**Dampak:** Railway cost melonjak, perlu migrasi VPS lebih awal
**Revenue pada skenario ini:** Jauh melebihi biaya (positive risk)
**Mitigasi:** Percepat migrasi VPS, client-side processing menahan beban
**Severity: RENDAH (positif)** — Masalah yang bagus untuk dimiliki

### 10.4 Konversi Pro Tier Sangat Rendah (< 0,5%)

**Probabilitas:** Medium
**Dampak:** Revenue tidak cukup untuk cover biaya pada skala besar
**Mitigasi:**
- Biaya Papyr sangat rendah ($6-20/bulan) — bahkan 0,5% konversi sudah cukup
- Alternatif revenue: iklan (Google AdSense), sponsorship, affiliate
- Reduce free tier features untuk mendorong upgrade
**Severity: RENDAH** — Biaya terlalu rendah untuk menjadi masalah

### 10.5 Kompetitor Global Menambah Bahasa Indonesia

**Probabilitas:** Medium
**Dampak:** Mengurangi differentiator bahasa
**Mitigasi:** Fokus pada speed (server dekat Indonesia), privacy (client-side), dan zero-paywall sebagai differentiator utama — bukan hanya bahasa
**Severity: MEDIUM**

### 10.6 Abuse/DDoS Attack

**Probabilitas:** Medium
**Dampak:** Railway cost melonjak karena excessive usage
**Mitigasi:** Rate limiting (10 req/min/IP), Cloudflare DDoS protection, file size limit (20 MB)
**Severity: RENDAH** — Mitigasi sudah implementasi

### 10.7 Matriks Risiko

| Risiko | Probabilitas | Dampak | Severity | Mitigasi? |
|--------|-------------|--------|----------|-----------|
| Railway harga naik | Medium | Medium | RENDAH | Ya (VPS ready) |
| Vercel free tier berubah | Rendah | Medium | RENDAH | Ya (Docker ready) |
| Traffic 10x spike | Rendah | Positif | RENDAH | Ya (client-side + VPS) |
| Konversi < 0,5% | Medium | Rendah | RENDAH | Ya (biaya sangat rendah) |
| Kompetitor + Bahasa ID | Medium | Medium | MEDIUM | Partial (multi-differentiator) |
| DDoS/Abuse | Medium | Medium | RENDAH | Ya (rate limit + Cloudflare) |
| Kurs USD melemah | Rendah | Rendah | RENDAH | Ya (biaya dalam USD kecil) |

---

## 11. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Cost Projection & Break-Even Analysis ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan proyeksi biaya dan analisis finansial untuk Papyr.

| Peran | Nama | Tanda Tangan | Tanggal |
|:------|:-----|:-------------|:--------|
| **Product Owner** | Muhammad Fa'iz Zulfikar | Approved | 2026-05-03 |
| **AI Agent** | OpenCode/Sisyphus | Approved | 2026-05-03 |

**Catatan:** Dalam model solo-founder + AI agent saat ini, semua peran teknis dijalankan oleh Founder dengan bantuan AI Agent. Dokumen ini telah ditinjau untuk akurasi finansial dan disetujui untuk implementasi.

---

## Lampiran A: Glosarium

| Istilah | Definisi |
|---------|----------|
| MAU | Monthly Active Users — pengguna unik yang mengakses Papyr minimal 1x per bulan |
| MRR | Monthly Recurring Revenue — pendapatan berulang bulanan dari subscription |
| ARR | Annual Recurring Revenue — MRR x 12 |
| ARPU | Average Revenue Per User — MRR / jumlah paying users |
| Net ARPU | ARPU setelah dikurangi payment gateway fees |
| Break-Even | Titik di mana revenue = biaya (tidak untung, tidak rugi) |
| Tasks | Operasi PDF yang berhasil diselesaikan (compress, merge, split, dll.) |
| Client-Side | Pemrosesan yang dilakukan di browser pengguna (zero server cost) |
| Server-Side | Pemrosesan yang dilakukan di server (membutuhkan compute resources) |
| Transient Storage | Penyimpanan sementara yang otomatis dihapus (tidak akumulatif) |
| VPS | Virtual Private Server — server virtual yang disewa |
| PPN | Pajak Pertambahan Nilai — 11% |
| PPh | Pajak Penghasilan |
| UMKM | Usaha Mikro Kecil Menengah |

---

## Lampiran B: Sumber Data

| Data Point | Sumber | Terakhir Diverifikasi |
|-----------|--------|----------------------|
| Vercel Free Tier limits | vercel.com/pricing | Mei 2026 |
| Railway Hobby Plan pricing | railway.app/pricing | Mei 2026 |
| Cloudflare R2 Free Tier limits | cloudflare.com/r2 | Mei 2026 |
| Domain pricing (.com) | Invoice registrar | Mei 2026 |
| HostData.id VPS pricing | hostdata.id | Mei 2026 |
| Midtrans fee structure | midtrans.com | Mei 2026 |
| Xendit fee structure | xendit.co | Mei 2026 |
| Kompetitor pricing | ilovepdf.com, smallpdf.com | Mei 2026 |

---

## Lampiran C: Formula Proyeksi

### Formula Biaya

```
Total_Biaya_Bulanan = Fixed_Costs + Variable_Costs
Fixed_Costs = Hosting + Domain_Amortized
Variable_Costs = R2_Storage_Overage + Railway_Usage_Overage (jika ada)

Biaya_Per_Task = Total_Biaya_Bulanan / Total_Tasks_Bulanan
```

### Formula Revenue

```
MRR = Paying_Users x Blended_Net_ARPU
Paying_Users = MAU x Conversion_Rate
Blended_Net_ARPU = (Monthly% x Net_Monthly_Price) + (Annual% x Net_Annual_Price / 12)
```

### Formula Break-Even

```
Break_Even_Users = Total_Biaya_Bulanan / Net_ARPU
Break_Even_MAU = Break_Even_Users / Conversion_Rate
Break_Even_Conversion = (Total_Biaya_Bulanan / Net_ARPU) / MAU
```

### Formula Payback Period

```
Payback_Months = Kumulatif_Pre_Revenue_Cost / Rata_Rata_Monthly_Surplus
```

---

## Lampiran D: Template Tracking Biaya Bulanan

| Bulan | Tasks/Hari | Vercel | Railway | R2 | Domain | Total Biaya | MRR | P/L | Kumulatif |
|-------|-----------|--------|---------|-----|--------|-------------|-----|-----|-----------|
| M1 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M2 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M3 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M4 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M5 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M6 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M7 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M8 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M9 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M10 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M11 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |
| M12 | ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ | Rp ___ |

---

*End of Document*

*PPR-CP-001 v1.0 — Papyr Cost Projection & Break-Even Analysis*
*Classification: Confidential — Internal and Investor Use Only*
*Generated: 2026-05-03*
*Total Sections: 11 + 4 Lampiran*
