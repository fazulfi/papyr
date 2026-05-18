**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Incident Response Plan**

Version 1.0 | Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

## Informasi Dokumen

| Field | Value |
|---|---|
| **Judul Dokumen** | Incident Response Plan — Papyr |
| **ID Dokumen** | PPR-IR-001 |
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
| 1.0 | Juni 2025 | AI Agent (OpenCode/Sisyphus) | Rilis awal — Incident Response Plan lengkap mencakup klasifikasi severity, prosedur eskalasi, playbook per skenario, dan rekomendasi peningkatan untuk Papyr |

---

## Dokumen Terkait

| ID Dokumen | Judul | Relevansi |
|---|---|---|
| PPR-SLA-001 | Service Level Agreement | Target ketersediaan, metrik layanan, waktu respons |
| PPR-SP-001 | Kebijakan Keamanan (Security Policy) | Kontrol keamanan, manajemen kerentanan, audit |
| PPR-DR-001 | Deployment Runbook | Prosedur deployment, rollback, health check |
| PPR-MP-001 | Monitoring Plan | Strategi pemantauan, alerting, dashboard |
| PPR-PM-001 | Postmortem Template | Template analisis pasca-insiden |

---

## Daftar Isi

1. [Tujuan & Ruang Lingkup](#1-tujuan--ruang-lingkup)
2. [Definisi Insiden & Klasifikasi Severity](#2-definisi-insiden--klasifikasi-severity)
3. [Tim Respons Insiden](#3-tim-respons-insiden)
4. [Prosedur Deteksi](#4-prosedur-deteksi)
5. [Prosedur Eskalasi](#5-prosedur-eskalasi)
6. [Playbook per Skenario](#6-playbook-per-skenario)
7. [Prosedur Komunikasi](#7-prosedur-komunikasi)
8. [Prosedur Pemulihan](#8-prosedur-pemulihan)
9. [Proses Postmortem](#9-proses-postmortem)
10. [Rekomendasi Peningkatan](#10-rekomendasi-peningkatan)
11. [Referensi Silang](#11-referensi-silang)
12. [Persetujuan Dokumen](#12-persetujuan-dokumen)

---

## 1. Tujuan & Ruang Lingkup

### 1.1 Tujuan Dokumen

Incident Response Plan (IRP) ini mendefinisikan prosedur terstruktur untuk mendeteksi, merespons, menangani, dan memulihkan layanan Papyr (mypapyr.com) dari insiden operasional dan keamanan. Dokumen ini berfungsi sebagai:

- **Panduan operasional** untuk penanganan insiden secara cepat dan terkoordinasi.
- **Standar eskalasi** yang memastikan insiden ditangani oleh pihak yang tepat sesuai tingkat keparahan.
- **Referensi playbook** yang memberikan langkah-langkah konkret untuk setiap skenario insiden yang teridentifikasi.
- **Dasar perbaikan berkelanjutan** melalui proses postmortem yang terstruktur.
- **Dokumentasi kepatuhan** yang menunjukkan kesiapan operasional Papyr kepada stakeholder.

### 1.2 Ruang Lingkup

IRP ini mencakup seluruh komponen infrastruktur produksi Papyr:

| Komponen | Platform | Cakupan Insiden |
|---|---|---|
| Frontend | Vercel (Next.js 16) | Deployment failure, CDN outage, build error |
| Backend API | Railway (FastAPI/Python 3.11) | Container crash, memory exhaustion, API timeout |
| Object Storage | Cloudflare R2 | Upload/download failure, bucket access error |
| Domain & DNS | Hostinger | DNS propagation failure, SSL expiry, domain hijack |
| Processing Engine | Ghostscript, PyMuPDF | Vulnerability exploit, processing hang, OOM |
| Rate Limiting | FastAPI middleware | DDoS, brute force, abuse pattern |

### 1.3 Konteks Operasional

Papyr beroperasi dengan model unik yang perlu dipahami dalam konteks incident response:

| Aspek | Detail |
|---|---|
| **Model Operasi** | 100% AI-driven daily operations (OpenClaw autonomous agent) |
| **Eskalasi Manusia** | Muhammad Fa'iz Zulfikar (Founder) — single point of escalation |
| **Jam Operasi** | 24/7 (layanan), respons manusia: jam kerja WIB (09:00–22:00) |
| **Pengguna** | Publik Indonesia, tanpa akun, tanpa data pribadi tersimpan |
| **Data Sensitivity** | File PDF sementara (auto-delete 60 menit), zero-knowledge |
| **Budget Monitoring** | Minimal — memanfaatkan built-in tools dari platform hosting |

### 1.4 Asumsi & Batasan

- **Tidak ada tim on-call dedicated** — respons bergantung pada AI Agent dan ketersediaan Founder.
- **Tidak ada monitoring eksternal aktif** — deteksi saat ini bergantung pada built-in platform logs.
- **Tidak ada redundansi infrastruktur** — single instance untuk backend (Railway), single bucket (R2).
- **Tidak ada SLA kontraktual dengan pengguna** — layanan gratis tanpa jaminan uptime formal.
- **Recovery Time Objective (RTO)**: 4 jam untuk P0, 24 jam untuk P1.
- **Recovery Point Objective (RPO)**: 0 (tidak ada data persisten pengguna yang perlu di-recover).

---

## 2. Definisi Insiden & Klasifikasi Severity

### 2.1 Definisi Insiden

**Insiden** adalah setiap kejadian yang menyebabkan atau berpotensi menyebabkan:

- Gangguan atau degradasi layanan Papyr yang berdampak pada pengguna.
- Pelanggaran keamanan atau privasi data pengguna.
- Kerusakan reputasi atau kepercayaan terhadap platform.
- Pelanggaran terhadap komitmen yang ditetapkan dalam SLA (PPR-SLA-001).

### 2.2 Klasifikasi Severity

| Severity | Nama | Definisi | Contoh |
|---|---|---|---|
| **P0** | Critical | Seluruh layanan tidak dapat diakses (total outage) atau terjadi pelanggaran keamanan/data | API dan frontend down bersamaan; data breach; file pengguna terekspos publik |
| **P1** | High | Fungsi utama terganggu signifikan, sebagian besar pengguna terdampak | API down (semua server-side tools gagal); R2 tidak dapat diakses; Ghostscript crash berulang |
| **P2** | Medium | Satu fitur/tool terganggu, sebagian kecil pengguna terdampak, workaround tersedia | Satu endpoint timeout intermittent; upload lambat; satu tool error untuk file tertentu |
| **P3** | Low | Gangguan minor, tidak berdampak langsung pada fungsionalitas inti | Typo di UI; analytics tidak merekam; log warning berlebihan; performa sedikit menurun |

### 2.3 Response Time SLA

| Severity | Waktu Deteksi | Waktu Respons Awal | Waktu Resolusi Target | Eskalasi ke Founder |
|---|---|---|---|---|
| **P0** | ≤ 15 menit* | ≤ 30 menit | ≤ 4 jam | Segera (dalam 5 menit) |
| **P1** | ≤ 30 menit* | ≤ 1 jam | ≤ 8 jam | Dalam 15 menit |
| **P2** | ≤ 2 jam | ≤ 4 jam | ≤ 24 jam | Dalam 2 jam (jika tidak terselesaikan) |
| **P3** | ≤ 24 jam | ≤ 48 jam | ≤ 7 hari | Tidak wajib (informasional) |

> *\* Waktu deteksi bergantung pada implementasi monitoring eksternal. Tanpa monitoring aktif, deteksi bergantung pada laporan pengguna atau pengecekan manual oleh AI Agent.*

### 2.4 Matriks Dampak

| Dimensi | P0 | P1 | P2 | P3 |
|---|---|---|---|---|
| **Pengguna Terdampak** | 100% | > 50% | 10–50% | < 10% |
| **Fungsi Terdampak** | Semua tool | Server-side tools | 1 tool/fitur | Non-core feature |
| **Data Risk** | Data terekspos | Potensi eksposur | Tidak ada | Tidak ada |
| **Revenue Impact** | Total loss (jika monetized) | Signifikan | Minor | Negligible |
| **Reputasi** | Berita/viral negatif | Keluhan publik | Keluhan individual | Internal saja |

---

## 3. Tim Respons Insiden

### 3.1 Struktur Tim

| Peran | Personel | Tanggung Jawab | Kontak |
|---|---|---|---|
| **Incident Commander (IC)** | Muhammad Fa'iz Zulfikar (Founder) | Keputusan eskalasi, komunikasi eksternal, persetujuan rollback, koordinasi vendor | Telegram, Email |
| **First Responder** | AI Agent (OpenClaw) | Deteksi awal, triage otomatis, diagnostik, mitigasi awal, dokumentasi insiden | Autonomous (24/7) |
| **Technical Resolver** | AI Agent (OpenCode/Sisyphus) | Implementasi fix, rollback, deployment, verifikasi pemulihan | On-demand via Founder |
| **Communication Lead** | Muhammad Fa'iz Zulfikar | Update status page, notifikasi sosial media, respons pengguna | Manual trigger |

### 3.2 Matriks RACI

| Aktivitas | Founder (IC) | AI Agent (First Responder) | AI Agent (Resolver) |
|---|---|---|---|
| Deteksi & Monitoring | I | **R/A** | — |
| Triage & Klasifikasi | A | **R** | — |
| Eskalasi | **R/A** | R | — |
| Diagnostik Teknis | I | R | **R** |
| Implementasi Fix | A | — | **R** |
| Rollback Decision | **R/A** | C | — |
| Komunikasi Eksternal | **R/A** | — | — |
| Postmortem | A | **R** | C |
| Dokumentasi | I | **R** | R |

> R = Responsible, A = Accountable, C = Consulted, I = Informed

### 3.3 Ketersediaan & Jadwal

| Personel | Ketersediaan | Waktu Respons Tipikal |
|---|---|---|
| AI Agent (OpenClaw) | 24/7 autonomous | < 5 menit (automated check) |
| AI Agent (OpenCode) | On-demand | < 15 menit (setelah di-trigger) |
| Founder (Fa'iz) | 09:00–22:00 WIB (weekday), variable (weekend) | 5–30 menit (saat aktif), 1–8 jam (di luar jam) |

---

## 4. Prosedur Deteksi

### 4.1 Monitoring Aktif Saat Ini

| Sumber | Jenis Data | Akses | Frekuensi Pengecekan |
|---|---|---|---|
| **Vercel Dashboard** | Deployment logs, function invocation logs, error rate | vercel.com/dashboard | Harian (AI Agent) |
| **Vercel Analytics** | Page views, Web Vitals, traffic pattern | vercel.com/analytics | Harian (AI Agent) |
| **Railway Dashboard** *(akan dipensiunkan setelah migrasi VPS)* | Container logs, CPU/memory metrics, deploy history | railway.app/dashboard | Harian (AI Agent) |
| **Railway Metrics** *(akan dipensiunkan setelah migrasi VPS)* | Request count, response time, error rate | railway.app/metrics | Harian (AI Agent) |
| **Cloudflare R2 Dashboard** | Storage usage, request count, bandwidth | dash.cloudflare.com | Mingguan (AI Agent) |
| **GitHub Actions** | CI/CD status, test results | github.com/fazulfi/papyr | Per-commit |
| **Health Endpoint** | `GET /health` — API liveness check | papyr-production.up.railway.app/health *(target: api.mypapyr.com/health)* | Harian (manual/AI) |

### 4.2 Indikator Insiden (Trigger)

| Indikator | Severity Potensial | Sumber Deteksi |
|---|---|---|
| Health endpoint tidak merespons | P0/P1 | Manual check, uptime monitor (planned) |
| Error rate > 10% dalam 5 menit | P1 | Railway logs |
| Response time > 30 detik (p95) | P2 | Railway metrics |
| Memory usage > 90% | P1 | Railway metrics |
| Deployment gagal berturut-turut | P2 | Vercel/Railway deploy logs |
| R2 upload/download error rate > 5% | P1 | Application logs |
| Lonjakan traffic tidak wajar (>10x normal) | P1/P2 | Vercel Analytics, Railway metrics |
| Laporan pengguna via sosial media | P2/P3 | Manual monitoring |
| SSL certificate expiry < 7 hari | P2 | Manual check |
| Ghostscript CVE published | P1/P2 | Dependency monitoring |

### 4.3 Prosedur Pengecekan Rutin (AI Agent)

**Frekuensi: Harian (setiap pagi WIB)**

```
1. Cek health endpoint: GET https://papyr-production.up.railway.app/health
   - Expected: HTTP 200, response < 5s
   - Jika gagal → Eskalasi P1

2. Review Railway logs (24 jam terakhir):
   - Cari pattern: ERROR, CRITICAL, OOM, timeout
   - Cek memory/CPU trend
   - Jika anomali → Triage dan klasifikasi

3. Review Vercel deployment status:
   - Cek deployment terakhir sukses
   - Cek function error rate
   - Jika error rate > 5% → Investigasi

4. Cek R2 storage metrics:
   - Verifikasi auto-delete berjalan (storage tidak terus naik)
   - Cek request error rate
   - Jika anomali → Investigasi

5. Review Vercel Analytics:
   - Traffic pattern normal?
   - Lonjakan 404/500 errors?
   - Jika anomali → Triage

6. Laporan ringkasan ke Founder (jika ada temuan)
```

### 4.4 Rekomendasi Monitoring Tambahan (Belum Diimplementasi)

| Tool | Fungsi | Biaya | Prioritas |
|---|---|---|---|
| **BetterStack (Uptime)** | Uptime monitoring, status page, alerting | Free tier (5 monitors) | **Tinggi** |
| **UptimeRobot** | Alternatif uptime monitoring | Free tier (50 monitors) | **Tinggi** |
| **Telegram Bot Alert** | Notifikasi real-time ke Founder | Gratis | **Tinggi** |
| **Sentry** | Error tracking, performance monitoring | Free tier (5K events/mo) | **Sedang** |
| **Cloudflare Workers** | Custom health check + alerting | Free tier | **Sedang** |

> **Catatan**: Implementasi BetterStack/UptimeRobot + Telegram alert adalah prioritas tertinggi untuk meningkatkan waktu deteksi dari jam menjadi menit.

---

## 5. Prosedur Eskalasi

### 5.1 Alur Eskalasi (Flowchart)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ALUR RESPONS INSIDEN PAPYR                          │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │ DETEKSI  │ ← Monitoring / Laporan Pengguna / Pengecekan Rutin
    └────┬─────┘
         │
         ▼
    ┌──────────┐     ┌─────────────────────────────────────────────┐
    │  TRIAGE  │────▶│ AI Agent menentukan:                        │
    └────┬─────┘     │ • Apakah ini insiden? (vs. false alarm)     │
         │           │ • Severity level (P0/P1/P2/P3)             │
         │           │ • Komponen terdampak                        │
         │           │ • Dampak pengguna                           │
         │           └─────────────────────────────────────────────┘
         │
         ▼
    ┌──────────────┐
    │  KLASIFIKASI │
    └────┬─────────┘
         │
         ├── P0/P1 ──▶ ESKALASI SEGERA ke Founder (Telegram)
         │              │
         │              ▼
         │         ┌─────────────┐
         │         │  RESPONS    │ ← Founder sebagai IC
         │         └──────┬──────┘
         │                │
         ├── P2 ────▶ AI Agent mencoba resolusi mandiri
         │              │
         │              ├── Berhasil → RESOLUSI
         │              │
         │              └── Gagal (>2 jam) → ESKALASI ke Founder
         │
         └── P3 ────▶ AI Agent menangani + dokumentasi
                        │
                        └── Informasi ke Founder (non-urgent)
         │
         ▼
    ┌──────────┐     ┌─────────────────────────────────────────────┐
    │ RESPONS  │────▶│ • Mitigasi dampak (rate limit, maintenance) │
    └────┬─────┘     │ • Diagnostik root cause                     │
         │           │ • Implementasi fix atau rollback             │
         │           │ • Komunikasi ke pengguna (jika P0/P1)       │
         │           └─────────────────────────────────────────────┘
         │
         ▼
    ┌──────────┐     ┌─────────────────────────────────────────────┐
    │ RESOLUSI │────▶│ • Verifikasi layanan pulih                  │
    └────┬─────┘     │ • Health check semua endpoint               │
         │           │ • Monitoring intensif (1–24 jam)             │
         │           │ • Konfirmasi dari Founder                    │
         │           └─────────────────────────────────────────────┘
         │
         ▼
    ┌────────────┐   ┌─────────────────────────────────────────────┐
    │ POSTMORTEM │──▶│ • Timeline insiden                          │
    └────────────┘   │ • Root cause analysis                       │
                     │ • Action items & preventive measures         │
                     │ • Dokumentasi di PPR-PM-001                  │
                     └─────────────────────────────────────────────┘
```

### 5.2 Matriks Eskalasi

| Kondisi | Aksi | Waktu Maksimal |
|---|---|---|
| P0 terdeteksi | Notifikasi Founder via Telegram + mulai mitigasi | 5 menit |
| P1 terdeteksi | Notifikasi Founder via Telegram + mulai diagnostik | 15 menit |
| P2 tidak terselesaikan oleh AI Agent | Eskalasi ke Founder dengan ringkasan diagnostik | 2 jam |
| P3 memerlukan keputusan bisnis | Informasi ke Founder di daily report | 24 jam |
| Insiden berlangsung > 2x target resolusi | Re-evaluasi severity (upgrade jika perlu) | Otomatis |
| Insiden berulang (>3x dalam 7 hari) | Upgrade severity + root cause investigation | Segera |

### 5.3 Template Notifikasi Eskalasi

**Format Telegram ke Founder:**

```
🚨 [SEVERITY] INSIDEN PAPYR

Waktu Deteksi: [YYYY-MM-DD HH:MM WIB]
Komponen: [Frontend/Backend/R2/DNS]
Dampak: [Deskripsi singkat dampak pengguna]
Status: [Investigating/Mitigating/Resolved]

Diagnostik Awal:
- [Temuan 1]
- [Temuan 2]

Aksi yang Sudah Dilakukan:
- [Aksi 1]
- [Aksi 2]

Keputusan Diperlukan:
- [Ya/Tidak] — [Detail jika ya]

Health Check: [URL]
Logs: [Link ke Railway/Vercel dashboard]
```

---

## 6. Playbook per Skenario

### 6.1 API Down (Railway)

| Aspek | Detail |
|---|---|
| **Severity** | P1 (P0 jika frontend juga down) |
| **Indikator** | Health endpoint tidak merespons; Railway container status: crashed/restarting |
| **Dampak** | Compress PDF, PDF to Image, Image to PDF (server fallback) tidak berfungsi |
| **Tool yang Masih Berfungsi** | Merge, Split, Rotate (client-side processing) |

**Langkah Respons:**

```
1. VERIFIKASI
   □ Cek health endpoint: curl https://papyr-production.up.railway.app/health
   □ Cek Railway dashboard → Deployments → Status container
   □ Cek Railway logs → Cari error pattern (OOM, crash loop, dependency error)

2. DIAGNOSTIK
   □ Identifikasi penyebab:
     - OOM (memory > 512MB limit) → Lihat memory graph
     - Crash loop → Cek startup error di logs
     - Deployment gagal → Cek build logs
     - Railway platform issue → Cek status.railway.app

3. MITIGASI
   □ Jika OOM:
     - Restart container via Railway dashboard
     - Jika berulang: scale memory (temporary) atau identifikasi memory leak
   □ Jika crash loop:
     - Rollback ke deployment sebelumnya via Railway dashboard
     - Command: railway rollback (atau via UI: Deployments → Previous → Redeploy)
   □ Jika platform issue:
     - Tidak ada aksi teknis — monitor status.railway.app
     - Komunikasi ke pengguna bahwa sedang ada gangguan

4. VERIFIKASI PEMULIHAN
   □ Health endpoint merespons 200 OK
   □ Test endpoint: POST /api/compress dengan file sample
   □ Cek response time < 5 detik
   □ Monitor 30 menit untuk memastikan stabilitas

5. ESKALASI (jika tidak terselesaikan dalam 1 jam)
   □ Notifikasi Founder via Telegram
   □ Pertimbangkan: maintenance mode di frontend
   □ Pertimbangkan: migrasi darurat ke platform lain (jika Railway extended outage)
```

**Rollback Command:**
```bash
# Via Railway CLI
railway rollback

# Via Railway Dashboard
# Deployments → Pilih deployment sebelumnya → Redeploy
```

---

### 6.2 Frontend Down (Vercel)

| Aspek | Detail |
|---|---|
| **Severity** | P0 (total outage — pengguna tidak bisa mengakses apapun) |
| **Indikator** | mypapyr.com tidak dapat diakses; Vercel deployment error; DNS resolution failure |
| **Dampak** | 100% pengguna terdampak — tidak ada tool yang dapat diakses |

**Langkah Respons:**

```
1. VERIFIKASI
   □ Akses mypapyr.com dari browser/curl
   □ Akses langsung via Vercel URL: frontend-ten-omega-35.vercel.app
   □ Cek Vercel dashboard → Project → Deployments
   □ Cek vercel-status.com untuk platform-wide issues

2. DIAGNOSTIK
   □ Jika custom domain gagal tapi Vercel URL berfungsi:
     → Masalah DNS (lihat Playbook 6.7)
   □ Jika kedua URL gagal:
     → Masalah deployment atau Vercel platform
   □ Cek deployment logs untuk build error
   □ Cek function logs untuk runtime error

3. MITIGASI
   □ Jika deployment error:
     - Rollback via Vercel dashboard: Deployments → Previous → Promote to Production
     - Atau via CLI: vercel rollback
   □ Jika build error (dependency/code issue):
     - Identifikasi commit penyebab
     - Revert commit dan redeploy
   □ Jika Vercel platform issue:
     - Monitor vercel-status.com
     - Tidak ada aksi teknis — tunggu resolusi Vercel
     - Komunikasi ke pengguna via sosial media

4. VERIFIKASI PEMULIHAN
   □ mypapyr.com accessible dan load < 3 detik
   □ Semua halaman tool dapat diakses (/compress, /merge, /split, /rotate, /image-to-pdf, /pdf-to-image)
   □ Client-side tools berfungsi (test merge dengan 2 file)
   □ Server-side tools berfungsi (test compress)
   □ Analytics merekam traffic

5. ESKALASI
   □ P0 → Notifikasi Founder segera
   □ Jika > 30 menit: posting update di sosial media
   □ Jika > 4 jam: evaluasi alternatif hosting sementara
```

---

### 6.3 R2 Storage Failure

| Aspek | Detail |
|---|---|
| **Severity** | P1 |
| **Indikator** | Upload gagal (HTTP 500 dari API); download link expired/error; R2 dashboard menunjukkan error |
| **Dampak** | Compress PDF dan PDF to Image gagal (memerlukan R2 untuk output); Image to PDF server fallback gagal |

**Langkah Respons:**

```
1. VERIFIKASI
   □ Test upload via API: POST /api/compress dengan file kecil
   □ Cek error message di Railway logs (cari: "R2", "S3", "boto3", "upload_file")
   □ Cek Cloudflare dashboard → R2 → papyr-files bucket
   □ Cek Cloudflare status: cloudflarestatus.com

2. DIAGNOSTIK
   □ Jika credential error (403 Forbidden):
     → R2 API key expired atau revoked
   □ Jika timeout:
     → Cloudflare R2 service degradation
   □ Jika bucket not found:
     → Bucket accidentally deleted atau misconfigured
   □ Jika storage limit:
     → Free tier limit reached (10 GB/month)

3. MITIGASI
   □ Jika credential error:
     - Verifikasi R2_ACCESS_KEY_ID dan R2_SECRET_ACCESS_KEY di Railway env vars
     - Generate new API token di Cloudflare dashboard jika expired
     - Update Railway environment variables
     - Redeploy backend
   □ Jika Cloudflare outage:
     - Monitor cloudflarestatus.com
     - Tidak ada aksi teknis — tunggu resolusi Cloudflare
   □ Jika storage limit:
     - Trigger manual cleanup: hapus file > 1 jam
     - Verifikasi cron auto-delete berjalan
     - Jika perlu: upgrade R2 plan (temporary)
   □ Jika bucket deleted:
     - Recreate bucket "papyr-files" di Cloudflare dashboard
     - Verifikasi lifecycle rules
     - Redeploy backend

4. VERIFIKASI PEMULIHAN
   □ Upload test file berhasil
   □ Download via signed URL berhasil
   □ Auto-delete lifecycle berjalan
   □ Semua server-side tools berfungsi end-to-end

5. ESKALASI
   □ Notifikasi Founder dalam 15 menit
   □ Jika credential issue: Founder harus generate new token (akses Cloudflare)
```

---

### 6.4 Rate Limit Abuse / DDoS

| Aspek | Detail |
|---|---|
| **Severity** | P1 (jika menyebabkan service degradation), P2 (jika rate limiter menahan) |
| **Indikator** | Lonjakan request >10x normal; banyak HTTP 429 di logs; response time meningkat drastis; Railway CPU/memory spike |
| **Dampak** | Legitimate users mengalami timeout atau rate limit; potensi cost overrun di Railway |

**Langkah Respons:**

```
1. VERIFIKASI
   □ Cek Railway metrics: request count per menit
   □ Cek Railway logs: frekuensi HTTP 429 responses
   □ Identifikasi pattern: single IP atau distributed?
   □ Cek Vercel Analytics: traffic source anomaly

2. DIAGNOSTIK
   □ Identifikasi sumber:
     - Single IP abuse → Rate limiter seharusnya menahan
     - Distributed (DDoS) → Perlu Cloudflare protection
     - Bot/scraper → Pattern analysis di logs
   □ Cek apakah rate limiter berfungsi:
     - RATE_LIMIT_PER_MINUTE = 10 (default)
     - Apakah ada bypass?

3. MITIGASI
   □ Jika single IP:
     - Verifikasi rate limiter aktif
     - Jika perlu: tambah IP ke blocklist (di Railway env atau code)
     - Temporary: turunkan rate limit (5/menit)
   □ Jika distributed DDoS:
     - Aktifkan Cloudflare "Under Attack" mode (jika domain melalui CF)
     - Jika tidak via CF: tambah Cloudflare sebagai proxy
     - Temporary: enable maintenance mode di frontend
   □ Jika bot/scraper:
     - Tambah User-Agent filtering
     - Implementasi CAPTCHA challenge (future)
     - Block suspicious patterns di middleware

4. MONITORING PASCA-MITIGASI
   □ Monitor request rate kembali normal
   □ Verifikasi legitimate users tidak terdampak
   □ Monitor Railway cost (jangan sampai over-budget)
   □ Pantau 24 jam untuk serangan ulang

5. ESKALASI
   □ P1 (service degraded): Notifikasi Founder dalam 15 menit
   □ Jika DDoS sustained > 1 jam: evaluasi Cloudflare Pro ($20/mo)
   □ Dokumentasi IP/pattern untuk future blocking
```

---

### 6.5 Data Breach / File Leak

| Aspek | Detail |
|---|---|
| **Severity** | P0 (selalu — melibatkan privasi pengguna) |
| **Indikator** | File pengguna dapat diakses tanpa signed URL; R2 bucket public access enabled; laporan pengguna bahwa file mereka terekspos |
| **Dampak** | Pelanggaran privasi pengguna; potensi pelanggaran UU PDP No. 27/2022; kerusakan reputasi fatal |

**Langkah Respons:**

```
1. VERIFIKASI (SEGERA — dalam 5 menit)
   □ Cek R2 bucket access policy: apakah public access enabled?
   □ Test akses file tanpa signed URL
   □ Cek apakah signed URL expiry berfungsi (seharusnya 60 menit)
   □ Review recent code changes yang menyentuh R2 configuration

2. CONTAINMENT (dalam 15 menit)
   □ SEGERA: Disable public access pada R2 bucket
   □ SEGERA: Revoke semua active signed URLs (rotate R2 credentials)
   □ SEGERA: Trigger emergency file cleanup — hapus SEMUA file di bucket
   □ Jika perlu: take down API (maintenance mode) untuk mencegah upload baru

3. INVESTIGASI
   □ Tentukan scope breach:
     - Berapa lama bucket terekspos?
     - Berapa file yang potentially accessed?
     - Apakah ada evidence of actual access? (R2 access logs)
   □ Identifikasi root cause:
     - Misconfiguration (human error)?
     - Code bug (signed URL generation)?
     - Credential compromise?
   □ Dokumentasi timeline lengkap

4. REMEDIASI
   □ Fix root cause (configuration/code)
   □ Generate new R2 API credentials
   □ Update semua environment variables
   □ Redeploy dengan fix
   □ Verifikasi: file TIDAK accessible tanpa valid signed URL
   □ Verifikasi: signed URL expiry berfungsi

5. KOMUNIKASI & KEPATUHAN
   □ Notifikasi Founder SEGERA (dalam 5 menit deteksi)
   □ Jika confirmed breach:
     - Evaluasi kewajiban notifikasi berdasarkan UU PDP No. 27/2022
     - Siapkan public statement (jika diperlukan)
     - Update privacy page di mypapyr.com
   □ Catatan: Karena Papyr zero-knowledge (tidak menyimpan identitas pengguna),
     notifikasi individual TIDAK mungkin dilakukan

6. POSTMORTEM (WAJIB untuk P0)
   □ Full postmortem dalam 48 jam
   □ Preventive measures harus diimplementasi sebelum layanan kembali normal
   □ Review oleh Founder wajib sebelum layanan dibuka kembali
```

> **PENTING**: Untuk insiden data breach, layanan TIDAK boleh dibuka kembali sampai root cause teridentifikasi dan fix terverifikasi.

---

### 6.6 Ghostscript Vulnerability

| Aspek | Detail |
|---|---|
| **Severity** | P1 (P0 jika actively exploited) |
| **Indikator** | CVE published untuk Ghostscript; security advisory dari distro; anomali di processing logs (unexpected commands, file access) |
| **Dampak** | Remote Code Execution (RCE) pada backend container; potensi akses ke R2 credentials; potensi lateral movement |

**Langkah Respons:**

```
1. ASSESSMENT (dalam 1 jam setelah CVE published)
   □ Identifikasi CVE details:
     - Versi Ghostscript yang terdampak
     - Attack vector (file-based? network?)
     - CVSS score
   □ Cek versi Ghostscript di container:
     - Lihat Dockerfile atau: gs --version (di Railway shell)
   □ Tentukan apakah Papyr vulnerable:
     - Apakah versi kita terdampak?
     - Apakah attack vector applicable? (Papyr menerima PDF dari user → YES)

2. MITIGASI SEGERA (jika vulnerable)
   □ OPSI A — Disable Compress PDF:
     - Set maintenance mode pada endpoint /api/compress
     - Update frontend: tampilkan pesan "Sedang dalam pemeliharaan"
     - Tool lain tetap berfungsi (client-side)
   □ OPSI B — Input Sanitization (jika patch belum tersedia):
     - Tambah validasi PDF lebih ketat sebelum processing
     - Limit Ghostscript capabilities (sandbox flags)
     - Reject file dengan suspicious patterns

3. PATCHING
   □ Cek apakah patch tersedia:
     - Update Ghostscript di Dockerfile
     - Rebuild dan redeploy container
   □ Jika patch belum tersedia:
     - Maintain OPSI A (disable endpoint) sampai patch rilis
     - Monitor CVE tracker untuk update
   □ Jika patch tersedia:
     - Update Dockerfile: apt-get install ghostscript=[patched-version]
     - Test locally dengan exploit PoC (jika tersedia)
     - Deploy ke production
     - Verifikasi: gs --version menunjukkan patched version

4. VERIFIKASI
   □ Compress PDF berfungsi normal
   □ Tidak ada anomali di logs
   □ Container resource usage normal
   □ Test dengan berbagai file PDF (termasuk edge cases)

5. PREVENTIVE
   □ Setup automated dependency vulnerability scanning
   □ Subscribe ke Ghostscript security mailing list
   □ Pertimbangkan: container isolation lebih ketat
   □ Pertimbangkan: Ghostscript sandbox mode (--safer flag)
```

---

### 6.7 Domain/DNS Issue

| Aspek | Detail |
|---|---|
| **Severity** | P0 (jika mypapyr.com tidak resolve), P2 (jika hanya propagation delay) |
| **Indikator** | mypapyr.com tidak dapat diakses; DNS lookup gagal; SSL certificate error; tapi Vercel URL langsung berfungsi |
| **Dampak** | Pengguna tidak dapat mengakses layanan via domain utama |

**Langkah Respons:**

```
1. VERIFIKASI
   □ DNS lookup: nslookup mypapyr.com / dig mypapyr.com
   □ Akses via Vercel URL langsung: frontend-ten-omega-35.vercel.app
   □ Cek SSL certificate: openssl s_client -connect mypapyr.com:443
   □ Cek Hostinger DNS management panel
   □ Cek Vercel domain settings

2. DIAGNOSTIK
   □ Jika DNS tidak resolve:
     → Domain expired? Cek Hostinger billing
     → DNS records dihapus? Cek Hostinger DNS panel
     → Nameserver issue? Cek NS records
   □ Jika SSL error:
     → Certificate expired? Vercel auto-renew gagal?
     → Domain verification issue?
   □ Jika intermittent:
     → DNS propagation (TTL issue)
     → Partial nameserver failure

3. MITIGASI
   □ Jika domain expired:
     - SEGERA: Renew domain di Hostinger
     - Propagation: 1–48 jam
     - Sementara: share Vercel URL langsung ke pengguna
   □ Jika DNS records hilang:
     - Recreate DNS records di Hostinger:
       * A record → Vercel IP
       * CNAME www → cname.vercel-dns.com
     - Propagation: 1–24 jam
   □ Jika SSL expired:
     - Trigger re-verification di Vercel dashboard
     - Domains → mypapyr.com → Refresh
   □ Jika domain hijack (worst case):
     - SEGERA: Kontak Hostinger support
     - Enable domain lock
     - Change Hostinger password + enable 2FA
     - Pertimbangkan: lapor ke ID-CERT

4. KOMUNIKASI SEMENTARA
   □ Share Vercel URL langsung via sosial media
   □ Update bio/link di semua platform dengan URL alternatif
   □ Jika > 24 jam: pertimbangkan domain alternatif sementara

5. VERIFIKASI PEMULIHAN
   □ mypapyr.com resolve ke IP yang benar
   □ HTTPS berfungsi tanpa warning
   □ Semua subdomain/path berfungsi
   □ SSL certificate valid dan auto-renew aktif
```

---

## 7. Prosedur Komunikasi

### 7.1 Prinsip Komunikasi

| Prinsip | Penjelasan |
|---|---|
| **Transparansi** | Informasikan pengguna tentang gangguan yang berdampak signifikan |
| **Kecepatan** | Update pertama dalam 30 menit untuk P0/P1 |
| **Akurasi** | Hanya komunikasikan fakta yang terverifikasi |
| **Empati** | Gunakan bahasa yang sopan dan mengakui ketidaknyamanan pengguna |
| **Proaktif** | Update berkala sampai resolusi, bukan hanya saat awal dan akhir |

### 7.2 Matriks Komunikasi

| Severity | Komunikasi Publik | Channel | Frekuensi Update |
|---|---|---|---|
| **P0** | Wajib | Status page + Twitter/X + Instagram Story | Setiap 30 menit |
| **P1** | Wajib (jika > 1 jam) | Status page + Twitter/X | Setiap 1 jam |
| **P2** | Opsional | Status page (jika ada) | Saat resolved |
| **P3** | Tidak perlu | — | — |

### 7.3 Template Komunikasi Publik

**Saat Insiden Terdeteksi:**

```
🔧 [Papyr] Kami sedang mengalami gangguan pada layanan [nama layanan].

Tim kami sedang menginvestigasi masalah ini. Beberapa tool mungkin tidak berfungsi
sementara waktu.

Tool yang masih berfungsi: [list tool client-side jika applicable]

Kami akan memberikan update berkala. Mohon maaf atas ketidaknyamanannya. 🙏

#Papyr #StatusUpdate
```

**Saat Dalam Proses Perbaikan:**

```
🔄 [Papyr] Update: Kami telah mengidentifikasi penyebab gangguan dan sedang
melakukan perbaikan.

Estimasi waktu pemulihan: [X jam/menit]

Terima kasih atas kesabaran Anda. 🙏

#Papyr #StatusUpdate
```

**Saat Resolved:**

```
✅ [Papyr] Layanan telah kembali normal.

Seluruh tool PDF sudah dapat digunakan kembali. Terima kasih atas kesabaran Anda
selama gangguan berlangsung.

Jika masih mengalami masalah, silakan refresh halaman atau clear cache browser.

#Papyr #StatusUpdate
```

### 7.4 Status Page (Rekomendasi)

| Opsi | Platform | Biaya | Fitur |
|---|---|---|---|
| **BetterStack Status Page** | betterstack.com | Free tier | Auto-update dari monitoring, custom domain |
| **Instatus** | instatus.com | Free tier | Clean UI, incident history |
| **GitHub Pages + Cstate** | github.com | Gratis | Self-hosted, full control |
| **Cachet** | cachethq.io | Gratis (self-host) | Open source, full featured |

> **Rekomendasi**: BetterStack (gabung dengan uptime monitoring) atau Instatus (standalone status page).

---

## 8. Prosedur Pemulihan

### 8.1 Checklist Pemulihan Umum

Setelah insiden di-resolve, lakukan verifikasi menyeluruh sebelum menyatakan layanan kembali normal:

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHECKLIST PEMULIHAN                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  □ 1. HEALTH CHECK                                              │
│     □ GET /health → 200 OK, response < 2s                      │
│     □ Frontend mypapyr.com loads < 3s                           │
│     □ All 6 tool pages accessible                               │
│                                                                 │
│  □ 2. FUNCTIONAL TEST                                           │
│     □ Compress PDF: upload 1MB file → compressed output         │
│     □ Merge PDF: merge 2 files → single output                  │
│     □ Split PDF: split 3-page file → individual pages           │
│     □ Rotate PDF: rotate page → correct orientation             │
│     □ Image to PDF: convert JPG → PDF output                    │
│     □ PDF to Image: convert PDF → PNG output                    │
│                                                                 │
│  □ 3. INFRASTRUCTURE VERIFICATION                               │
│     □ Railway container: running, memory < 70%                  │
│     □ R2 bucket: accessible, upload/download working            │
│     □ Vercel: latest deployment active, no errors               │
│     □ DNS: mypapyr.com resolving correctly                      │
│     □ SSL: certificate valid, no warnings                       │
│                                                                 │
│  □ 4. MONITORING CONFIRMATION                                   │
│     □ Error rate kembali ke baseline (< 1%)                     │
│     □ Response time kembali ke baseline (< 5s p95)              │
│     □ No new error patterns di logs                             │
│     □ Analytics merekam traffic normal                          │
│                                                                 │
│  □ 5. SIGN-OFF                                                  │
│     □ AI Agent: verifikasi teknis complete                      │
│     □ Founder: approval untuk declare resolved                  │
│     □ Komunikasi: update status "Resolved"                      │
│     □ Monitoring intensif: set reminder 24 jam                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 Prosedur Rollback

| Komponen | Metode Rollback | Waktu Estimasi |
|---|---|---|
| **Frontend (Vercel)** | Vercel Dashboard → Deployments → Previous → Promote to Production | 1–3 menit |
| **Backend (Railway)** | Railway Dashboard → Deployments → Previous → Redeploy | 2–5 menit |
| **Environment Variables** | Railway/Vercel Dashboard → Settings → Environment Variables → Revert | 1–2 menit + redeploy |
| **R2 Configuration** | Cloudflare Dashboard → R2 → Bucket Settings | 1–5 menit |
| **DNS Records** | Hostinger DNS Panel → Edit/Restore records | 1–48 jam (propagation) |
| **Code Changes** | `git revert [commit-hash]` → push → auto-deploy | 3–10 menit |

### 8.3 Monitoring Pasca-Pemulihan

| Periode | Frekuensi Monitoring | Fokus |
|---|---|---|
| 0–1 jam | Setiap 10 menit | Error rate, response time, container stability |
| 1–6 jam | Setiap 30 menit | Traffic pattern, resource usage trend |
| 6–24 jam | Setiap 2 jam | Overall health, no regression |
| 24–72 jam | Setiap 6 jam | Long-term stability confirmation |

### 8.4 Kriteria "Resolved"

Insiden dinyatakan **Resolved** ketika SEMUA kondisi berikut terpenuhi:

1. ✅ Semua health check passing
2. ✅ Semua functional test passing
3. ✅ Error rate kembali ke baseline (< 1%)
4. ✅ Response time kembali ke baseline
5. ✅ Tidak ada error baru di logs selama 30 menit
6. ✅ Root cause teridentifikasi (atau workaround stabil diterapkan)
7. ✅ Founder memberikan approval

---

## 9. Proses Postmortem

### 9.1 Kapan Postmortem Diperlukan

| Kondisi | Postmortem Wajib? | Deadline |
|---|---|---|
| Insiden P0 | **Ya — wajib** | 48 jam setelah resolusi |
| Insiden P1 dengan durasi > 1 jam | **Ya — wajib** | 72 jam setelah resolusi |
| Insiden P1 dengan durasi < 1 jam | Disarankan | 1 minggu |
| Insiden P2 berulang (>3x) | **Ya — wajib** | 1 minggu |
| Insiden P2 satu kali | Opsional | 2 minggu |
| Insiden P3 | Tidak wajib | — |

### 9.2 Template Postmortem (PPR-PM-001)

```markdown
# Postmortem: [Judul Insiden]

## Metadata
- Tanggal Insiden: [YYYY-MM-DD]
- Durasi: [X jam Y menit]
- Severity: [P0/P1/P2/P3]
- Incident Commander: [Nama]
- Author Postmortem: [Nama]

## Timeline
| Waktu (WIB) | Event |
|---|---|
| HH:MM | [Insiden terdeteksi] |
| HH:MM | [Triage dimulai] |
| HH:MM | [Eskalasi ke Founder] |
| HH:MM | [Mitigasi diterapkan] |
| HH:MM | [Root cause identified] |
| HH:MM | [Fix deployed] |
| HH:MM | [Verified resolved] |

## Dampak
- Pengguna terdampak: [estimasi]
- Durasi downtime: [X menit/jam]
- Tool terdampak: [list]
- Data impact: [none/description]

## Root Cause
[Penjelasan teknis detail tentang penyebab utama]

## Faktor Kontribusi
- [Faktor 1]
- [Faktor 2]

## Apa yang Berjalan Baik
- [Item 1]
- [Item 2]

## Apa yang Perlu Diperbaiki
- [Item 1]
- [Item 2]

## Action Items
| # | Action | Owner | Deadline | Status |
|---|---|---|---|---|
| 1 | [Aksi preventif] | [Nama] | [Tanggal] | [ ] |
| 2 | [Aksi perbaikan] | [Nama] | [Tanggal] | [ ] |

## Lessons Learned
[Pelajaran utama dari insiden ini]
```

### 9.3 Proses Review Postmortem

```
1. AI Agent menyusun draft postmortem (dalam 24 jam)
2. Founder review dan tambahkan perspektif bisnis (dalam 48 jam)
3. Action items di-assign dan di-track
4. Follow-up review: 1 minggu setelah postmortem (verifikasi action items)
5. Postmortem disimpan di: docs/postmortems/[YYYY-MM-DD]_[judul].md
```

### 9.4 Prinsip Postmortem

| Prinsip | Penjelasan |
|---|---|
| **Blameless** | Fokus pada sistem dan proses, bukan menyalahkan individu |
| **Thorough** | Investigasi sampai root cause, bukan hanya gejala |
| **Actionable** | Setiap temuan harus menghasilkan action item yang konkret |
| **Shared** | Postmortem adalah dokumen pembelajaran, bukan dokumen hukuman |
| **Timely** | Tulis selagi ingatan masih segar — jangan tunda |

---

## 10. Rekomendasi Peningkatan

### 10.1 Prioritas Tinggi (Implementasi Segera)

| # | Rekomendasi | Tool/Platform | Biaya | Dampak |
|---|---|---|---|---|
| 1 | **Uptime Monitoring** | BetterStack atau UptimeRobot | Gratis (free tier) | Deteksi downtime dalam 1–3 menit vs. jam |
| 2 | **Telegram Alert Bot** | Telegram Bot API | Gratis | Notifikasi real-time ke Founder |
| 3 | **Health Check Automation** | Cron job / BetterStack | Gratis | Pengecekan otomatis setiap 1–5 menit |
| 4 | **Status Page** | BetterStack / Instatus | Gratis (free tier) | Transparansi ke pengguna saat gangguan |

### 10.2 Prioritas Sedang (Implementasi 1–3 Bulan)

| # | Rekomendasi | Tool/Platform | Biaya | Dampak |
|---|---|---|---|---|
| 5 | **Error Tracking** | Sentry | Gratis (5K events/mo) | Deteksi error spesifik + stack trace |
| 6 | **Log Aggregation** | BetterStack Logs | Free tier | Centralized log search & alerting |
| 7 | **Dependency Scanning** | GitHub Dependabot | Gratis | Auto-detect vulnerable dependencies |
| 8 | **Synthetic Monitoring** | BetterStack / Checkly | Free tier | End-to-end test otomatis berkala |

### 10.3 Prioritas Rendah (Implementasi 3–6 Bulan)

| # | Rekomendasi | Tool/Platform | Biaya | Dampak |
|---|---|---|---|---|
| 9 | **APM (Application Performance Monitoring)** | Sentry Performance | Free tier | Response time tracking per endpoint |
| 10 | **Incident Management Platform** | BetterStack / PagerDuty | Free–$10/mo | Structured incident workflow |
| 11 | **Automated Runbook Execution** | Custom scripts | Gratis | Auto-remediation untuk insiden umum |
| 12 | **Chaos Engineering (basic)** | Manual testing | Gratis | Proactive resilience testing |

### 10.4 Arsitektur Monitoring Target

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARSITEKTUR MONITORING TARGET                          │
└─────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │   BetterStack │     │    Sentry    │     │   Vercel     │
  │   Uptime      │     │   Errors     │     │   Analytics  │
  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
         │                     │                     │
         ▼                     ▼                     ▼
  ┌─────────────────────────────────────────────────────────┐
  │              ALERTING LAYER                              │
  │                                                         │
  │  Rules:                                                 │
  │  • Uptime < 100% → P1 alert                           │
  │  • Error rate > 10% → P1 alert                        │
  │  • Response time > 30s → P2 alert                     │
  │  • New critical error → P2 alert                      │
  └────────────────────────┬────────────────────────────────┘
                           │
                           ▼
  ┌─────────────────────────────────────────────────────────┐
  │              NOTIFICATION CHANNELS                       │
  │                                                         │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
  │  │ Telegram │  │  Email   │  │  Status  │             │
  │  │   Bot    │  │  Alert   │  │   Page   │             │
  │  └──────────┘  └──────────┘  └──────────┘             │
  │       │              │              │                   │
  │       ▼              ▼              ▼                   │
  │   Founder        Founder        Pengguna               │
  │  (real-time)    (summary)      (publik)                │
  └─────────────────────────────────────────────────────────┘
```

### 10.5 Implementasi Telegram Alert (Quick Win)

**Langkah implementasi (estimasi: 1–2 jam):**

```
1. Buat Telegram Bot via @BotFather
   - /newbot → papyr_alert_bot
   - Simpan token

2. Dapatkan Chat ID Founder
   - Kirim pesan ke bot
   - GET https://api.telegram.org/bot<TOKEN>/getUpdates
   - Catat chat_id

3. Integrasi dengan BetterStack/UptimeRobot
   - Webhook URL: https://api.telegram.org/bot<TOKEN>/sendMessage
   - Atau: gunakan built-in Telegram integration (BetterStack)

4. Test alert
   - Matikan health endpoint sementara
   - Verifikasi notifikasi masuk ke Telegram
   - Restore dan verifikasi "resolved" notification
```

---

## 11. Referensi Silang

### 11.1 Pemetaan Dokumen

| Dokumen | ID | Relevansi dengan IRP |
|---|---|---|
| **Service Level Agreement** | PPR-SLA-001 | Target uptime (99.5%), response time SLA, definisi downtime |
| **Security Policy** | PPR-SP-001 | Kontrol keamanan, vulnerability management, data protection |
| **Deployment Runbook** | PPR-DR-001 | Prosedur rollback, deployment checklist, environment config |
| **Monitoring Plan** | PPR-MP-001 | Dashboard setup, alert rules, metric definitions |
| **Postmortem Template** | PPR-PM-001 | Format standar untuk analisis pasca-insiden |

### 11.2 Pemetaan SLA ↔ Incident Response

| Metrik SLA (PPR-SLA-001) | Threshold | Severity jika Dilanggar |
|---|---|---|
| Uptime ≥ 99.5% | Downtime > 3.6 jam/bulan | P1 (kumulatif) |
| Response time < 5s (p95) | > 30s sustained | P2 |
| Error rate < 1% | > 10% dalam 5 menit | P1 |
| File deletion < 60 menit | File tersedia > 24 jam | P1 (privacy) |
| Health endpoint available | Tidak merespons | P1 |

### 11.3 Pemetaan Security Policy ↔ Incident Response

| Kontrol Keamanan (PPR-SP-001) | Skenario Insiden | Playbook |
|---|---|---|
| Rate limiting (10 req/min/IP) | Rate limit abuse / DDoS | 6.4 |
| R2 signed URLs (60 min expiry) | Data breach / file leak | 6.5 |
| Ghostscript sandboxing | Ghostscript vulnerability | 6.6 |
| HTTPS enforcement | SSL/DNS issue | 6.7 |
| Auto-delete lifecycle | File retention violation | 6.3 / 6.5 |
| Input validation | Malicious file upload | 6.6 |

### 11.4 Pemetaan Deployment Runbook ↔ Incident Response

| Prosedur (PPR-DR-001) | Penggunaan dalam IRP |
|---|---|
| Rollback frontend | Playbook 6.2 — Frontend Down |
| Rollback backend | Playbook 6.1 — API Down |
| Environment variable update | Playbook 6.3 — R2 credential rotation |
| Health check verification | Prosedur Pemulihan (Section 8) |
| DNS configuration | Playbook 6.7 — Domain/DNS Issue |

---

## 12. Persetujuan Dokumen

### 12.1 Tanda Tangan Persetujuan

| Peran | Nama | Status | Tanggal |
|---|---|---|---|
| **Product Owner** | Muhammad Fa'iz Zulfikar | ✅ Approved | Juni 2025 |
| **AI Agent** | OpenCode/Sisyphus | ✅ Approved | Juni 2025 |

### 12.2 Ketentuan Persetujuan

Dengan menyetujui dokumen ini, pihak-pihak di atas menyatakan bahwa:

1. Incident Response Plan ini telah ditinjau secara menyeluruh dan dianggap memadai untuk kebutuhan operasional Papyr saat ini.
2. Prosedur yang ditetapkan akan diikuti dalam penanganan insiden produksi.
3. Dokumen ini akan ditinjau ulang setiap **3 bulan (triwulanan)** atau ketika terjadi:
   - Insiden P0/P1 yang mengungkap gap dalam prosedur.
   - Perubahan signifikan pada infrastruktur atau arsitektur.
   - Penambahan tool monitoring baru.
   - Perubahan model operasi atau tim.

### 12.3 Jadwal Review

| Review Ke- | Target Tanggal | Fokus |
|---|---|---|
| 1 | September 2025 | Evaluasi efektivitas + implementasi monitoring |
| 2 | Desember 2025 | Review pasca-implementasi BetterStack/Telegram |
| 3 | Maret 2026 | Annual review + update berdasarkan insiden aktual |

---

*Dokumen ini bersifat **CONFIDENTIAL** dan hanya untuk penggunaan internal Papyr serta keperluan investor/partner yang telah menandatangani NDA.*

*Terakhir diperbarui: Juni 2025 | Versi: 1.0 | ID: PPR-IR-001*
