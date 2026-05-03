**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Service Level Agreement (SLA)**

Version 1.0 | Mei 2026

**CONFIDENTIAL**

mypapyr.com

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Service Level Agreement (SLA) — Papyr        |
| **ID Dokumen**      | PPR-SLA-001                                  |
| **Versi**           | 1.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Mei 2026                                     |
| **Terakhir Diubah** | Mei 2026                                     |
| **Penulis**         | Muhammad Fa'iz Zulfikar                      |
| **Ditinjau Oleh**   | Product Owner, AI Agent                      |
| **Disetujui Oleh**  | Product Owner, AI Agent                      |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                                  |
|-----------|-------------|------------------------------|------------------------------------------------------------------------------------------------|
| 1.0       | Mei 2026    | Muhammad Fa'iz Zulfikar      | Rilis awal — SLA lengkap mencakup metrik layanan, ketersediaan, dukungan, privasi, dan pemantauan untuk Papyr v1.1 |

**Dokumen Terkait**

| **ID Dokumen** | **Judul**                                    | **Relevansi**                                      |
|----------------|----------------------------------------------|----------------------------------------------------|
| PPR-BRD-001    | Business Requirements Document               | NFR, business rules, batasan infrastruktur         |
| PPR-TDD-001    | Technical Design Document                    | Arsitektur, processing strategy, infrastruktur     |
| PPR-DR-001     | Deployment Runbook                           | Prosedur deployment, rollback, maintenance          |
| PPR-FS-001     | Feasibility Study                            | Kelayakan teknis, operasional, dan risiko          |
| PPR-CP-001     | Cost Projection & Break-Even Analysis        | Biaya infrastruktur, kapasitas, dan scaling plan   |

---

**Daftar Isi**

1. [Pendahuluan](#1-pendahuluan)
2. [Definisi Layanan](#2-definisi-layanan)
3. [Metrik Tingkat Layanan](#3-metrik-tingkat-layanan)
4. [Ketersediaan Layanan](#4-ketersediaan-layanan)
5. [Dukungan & Respons](#5-dukungan--respons)
6. [Pengecualian](#6-pengecualian)
7. [Privasi & Keamanan](#7-privasi--keamanan)
8. [Pemantauan & Pelaporan](#8-pemantauan--pelaporan)
9. [Peninjauan & Pembaruan SLA](#9-peninjauan--pembaruan-sla)
10. [Persetujuan Dokumen](#10-persetujuan-dokumen)

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Service Level Agreement (SLA) ini mendefinisikan komitmen tingkat layanan yang diberikan oleh Papyr (mypapyr.com) kepada seluruh pengguna platform. Dokumen ini menetapkan target performa, ketersediaan, waktu pemrosesan, kebijakan privasi, serta mekanisme dukungan dan pemantauan yang berlaku untuk layanan utilitas PDF Papyr.

SLA ini berfungsi sebagai:

- **Kontrak internal** antara tim pengembang dan pengguna mengenai ekspektasi layanan yang realistis.
- **Acuan operasional** untuk pemantauan, eskalasi, dan perbaikan berkelanjutan.
- **Dokumen transparansi** yang menunjukkan komitmen Papyr terhadap kualitas layanan meskipun beroperasi pada model gratis.
- **Baseline** untuk evaluasi performa layanan secara berkala (triwulanan).

### 1.2 Ruang Lingkup

SLA ini mencakup seluruh layanan yang tersedia di mypapyr.com pada fase v1.1, meliputi:

- 6 tool pemrosesan PDF yang aktif dan dapat diakses publik.
- Infrastruktur frontend (Vercel Free Tier), backend (Railway $5/bulan), dan object storage (Cloudflare R2 Free Tier).
- Mekanisme privasi dan keamanan yang melekat pada arsitektur sistem.
- Pemantauan dan pelaporan melalui Vercel Analytics dan Railway logs.

SLA ini **tidak mencakup**:

- Fitur yang belum dirilis (Protect PDF, Unlock PDF, Watermark, Sign PDF, OCR, PDF-to-Word).
- Tier Pro (belum aktif — direncanakan setelah 10.000+ monthly active tasks).
- Layanan pihak ketiga yang berada di luar kendali Papyr (Vercel, Railway, Cloudflare).
- Integrasi API untuk developer (belum tersedia).

### 1.3 Pihak yang Terlibat

| **Pihak**              | **Peran**                                                                                     |
|------------------------|-----------------------------------------------------------------------------------------------|
| **Penyedia Layanan**   | Papyr (mypapyr.com) — dikelola oleh Muhammad Fa'iz Zulfikar (Founder & Solo Developer)        |
| **Pengguna Layanan**   | Seluruh pengguna publik yang mengakses mypapyr.com tanpa login                                |
| **Mitra Infrastruktur**| Vercel (frontend hosting), Railway (backend hosting), Cloudflare (R2 object storage, CDN)     |
| **AI Agent**           | OpenCode/Sisyphus — development partner untuk eksekusi teknis, testing, dan dokumentasi        |

### 1.4 Masa Berlaku

SLA ini berlaku efektif sejak tanggal persetujuan dan akan ditinjau ulang setiap **3 bulan (triwulanan)** atau ketika terjadi perubahan signifikan pada infrastruktur, fitur, atau model bisnis Papyr.

---

## 2. Definisi Layanan

### 2.1 Deskripsi Umum

Papyr adalah web application utilitas PDF yang dirancang khusus untuk pasar Indonesia. Platform ini memungkinkan pengguna melakukan operasi PDF umum secara gratis, cepat, dan aman — langsung dari browser, tanpa perlu membuat akun, mengunduh software, atau memberikan data pribadi apapun.

**Karakteristik utama layanan:**

- **Berbasis web** — diakses melalui browser modern di perangkat apapun (mobile, tablet, desktop).
- **Tanpa login** — semua tool dapat digunakan secara anonim tanpa registrasi.
- **Gratis tanpa batas kuota harian** — tidak ada paywall atau watermark, namun tetap tunduk pada batas wajar rate limit gratis.
- **Privacy-first** — operasi ringan diproses di browser (zero upload); file yang diunggah ke server dihapus otomatis dalam 60 menit.
- **Bahasa Indonesia** — antarmuka menggunakan Bahasa Indonesia sebagai bahasa default.

### 2.2 Daftar Tool yang Tersedia (v1.1)

| **#** | **Tool**          | **Deskripsi**                                                                    | **Processing**     | **Engine**                |
|-------|-------------------|----------------------------------------------------------------------------------|--------------------|---------------------------|
| 1     | **Compress PDF**  | Kompres ukuran file PDF dengan 3 level kualitas (low, medium, high)              | Server             | Ghostscript               |
| 2     | **Merge PDF**     | Gabungkan 2+ file PDF menjadi satu dokumen dengan drag-and-drop reorder          | Client (browser)   | pdf-lib                   |
| 3     | **Split PDF**     | Pisahkan halaman PDF berdasarkan range (e.g., 1-3, 5, 7-10)                     | Client (browser)   | pdf-lib                   |
| 4     | **Image to PDF**  | Konversi gambar (JPG, PNG, WEBP) menjadi PDF; multi-image support                | Hybrid             | pdf-lib + PyMuPDF         |
| 5     | **PDF to Image**  | Konversi halaman PDF menjadi gambar PNG (150 DPI); ZIP untuk multi-page          | Server             | PyMuPDF                   |
| 6     | **Rotate PDF**    | Putar halaman PDF (90, 180, 270 derajat); per-halaman atau semua sekaligus       | Client (browser)   | pdf-lib                   |

### 2.3 Model Layanan

| **Tier**                  | **Status**       | **Harga**                                  | **Batasan**                                    |
|---------------------------|------------------|--------------------------------------------|------------------------------------------------|
| **Free (Tanpa Login)**    | Aktif (saat ini) | Rp 0                                       | Semua tool unlimited, max 20 MB/file           |
| **Free (Dengan Login)**   | Direncanakan     | Rp 0                                       | + OCR 5x/hari, PDF-to-Word 5x/hari            |
| **Pro**                   | Direncanakan     | Rp 19.900/bulan atau Rp 149.000/tahun      | Unlimited semua tool, batch, 100 MB, API       |

*Catatan: SLA ini berlaku untuk tier Free (Tanpa Login) yang saat ini aktif. Tier Pro akan memiliki SLA terpisah dengan komitmen yang lebih tinggi setelah diluncurkan.*

### 2.4 Arsitektur Pemrosesan

```
Pengguna (Browser)
       |
       +-- Client-Side (pdf-lib) --> Merge, Split, Rotate
       |   [Zero upload, instant, private]
       |
       +-- Hybrid (pdf-lib + PyMuPDF) --> Image to PDF
       |   [< 3 MB di client; >= 3 MB di server]
       |
       +-- Server-Side (FastAPI) --> Compress, PDF to Image
               |
               +-- Ghostscript (compression engine)
               +-- PyMuPDF (rendering engine)
               +-- Cloudflare R2 (temp storage, auto-delete 60 menit)
```

**Implikasi terhadap SLA:**

- **Operasi client-side** (Merge, Split, Rotate) tidak bergantung pada ketersediaan server — selama browser pengguna berfungsi, tool ini tersedia.
- **Operasi server-side** (Compress, PDF to Image) bergantung pada ketersediaan Railway backend dan Cloudflare R2.
- **Operasi hybrid** (Image to PDF) memiliki fallback otomatis — jika server tidak tersedia, file kecil tetap dapat diproses di browser.

---

## 3. Metrik Tingkat Layanan

### 3.1 Ketersediaan (Availability)

| **Metrik**                          | **Target**       | **Pengukuran**                                                    |
|-------------------------------------|------------------|-------------------------------------------------------------------|
| Uptime keseluruhan sistem           | 99,5%            | Persentase waktu layanan dapat diakses dalam periode 1 bulan      |
| Uptime frontend (mypapyr.com)       | 99,9%            | Berdasarkan Vercel SLA (99,99% untuk edge network)                |
| Uptime backend API                  | 99,5%            | Berdasarkan Railway uptime + health check monitoring              |
| Uptime object storage (R2)          | 99,9%            | Berdasarkan Cloudflare R2 SLA (99,9%)                             |

**Catatan:** Target 99,5% uptime keseluruhan memperhitungkan bahwa backend Railway pada Hobby Plan ($5/bulan) tidak memiliki SLA formal. Angka ini merupakan target realistis berdasarkan track record Railway (99,9%+ observed uptime) dengan buffer untuk cold start dan maintenance.

**Kalkulasi downtime yang diizinkan:**

```
99,5% uptime per bulan = maksimum 3 jam 36 menit downtime/bulan
99,5% uptime per tahun = maksimum 43 jam 48 menit downtime/tahun
```

### 3.2 Waktu Respons (Response Time)

| **Metrik**                                  | **Target**       | **Kondisi Pengukuran**                                |
|---------------------------------------------|------------------|-------------------------------------------------------|
| Frontend page load (First Contentful Paint) | < 2 detik        | Koneksi 4G, perangkat mobile mid-range                |
| Frontend page load (Largest Contentful Paint)| < 3 detik       | Koneksi 4G, perangkat mobile mid-range                |
| Backend API response (P50)                  | < 3 detik        | File 5 MB, server dalam kondisi normal                |
| Backend API response (P95)                  | < 5 detik        | File 5 MB, server dalam kondisi normal                |
| Time to Interactive (TTI)                   | < 3 detik        | Koneksi 4G, perangkat mobile mid-range                |

**Referensi:** Target ini selaras dengan NFR-001 s/d NFR-003 dalam PPR-BRD-001 dan Core Web Vitals "Good" threshold.

### 3.3 Waktu Pemrosesan per Tool

| **Tool**          | **Target Waktu**  | **Kondisi**                                                        | **Processing** |
|-------------------|-------------------|--------------------------------------------------------------------|----------------|
| Compress PDF      | < 10 detik        | File PDF 5 MB, kualitas medium, server dalam kondisi normal        | Server         |
| Merge PDF         | < 3 detik         | 5 file PDF @ 2 MB masing-masing, browser modern                   | Client         |
| Split PDF         | < 3 detik         | File PDF 10 MB, split 3 range halaman, browser modern              | Client         |
| Image to PDF      | < 5 detik         | 5 gambar @ 2 MB masing-masing, konversi di client atau server     | Hybrid         |
| PDF to Image      | < 10 detik        | File PDF 5 MB, konversi 5 halaman ke PNG, server normal           | Server         |
| Rotate PDF        | < 3 detik         | File PDF 10 MB, rotasi semua halaman, browser modern               | Client         |

**Catatan penting:**

- Waktu pemrosesan **tidak termasuk** waktu upload dan download file — hanya waktu pemrosesan murni.
- Operasi client-side sangat bergantung pada spesifikasi perangkat pengguna (RAM, CPU, browser version).
- Operasi server-side dapat lebih lambat saat terjadi concurrent load tinggi pada Railway container.
- File yang lebih besar dari 10 MB mungkin memerlukan waktu lebih lama secara proporsional.

### 3.4 Batasan Teknis

| **Parameter**                    | **Nilai**                  | **Keterangan**                                                          |
|----------------------------------|----------------------------|-------------------------------------------------------------------------|
| Ukuran file maksimum (upload)    | 20 MB per file             | File melebihi batas ditolak dengan pesan error Bahasa Indonesia         |
| Format file yang didukung        | PDF, JPG, PNG, WEBP        | Validasi multi-layer: MIME type + ekstensi + magic bytes                |
| Retensi file di server           | Maksimum 60 menit          | Auto-delete melalui R2 lifecycle rule + cron fallback 30 menit         |
| Rate limit                       | 10 request/menit/IP        | Pesan error HTTP 429 dalam Bahasa Indonesia                             |
| Jumlah file per merge            | Maksimum 20 file           | Sesuai REQ-MRG-004 dalam PPR-BRD-001                                   |
| Resolusi PDF to Image            | 150 DPI (PNG)              | Sesuai REQ-P2I-001 dalam PPR-BRD-001                                   |
| Concurrent users (target)        | 100 concurrent             | Sesuai NFR-015 dalam PPR-BRD-001                                       |
| Browser yang didukung            | Chrome 90+, Safari 15+, Firefox 90+ | Covers 95%+ pengguna Indonesia                                |

### 3.5 Metrik Keandalan (Reliability)

| **Metrik**                          | **Target**       | **Keterangan**                                                    |
|-------------------------------------|------------------|-------------------------------------------------------------------|
| Task Success Rate                   | > 95% (Bulan 3)  | Persentase task yang berhasil tanpa error                         |
| Task Success Rate                   | > 99% (Bulan 12) | Target jangka panjang setelah stabilisasi                         |
| Auto-retry pada kegagalan           | 1x otomatis      | Retry otomatis sebelum menampilkan error ke pengguna              |
| File cleanup success rate           | > 99,9%          | Semua file harus terhapus dalam 60 menit (double safety)         |
| Health check response               | < 500 ms         | Endpoint /health pada backend API                                 |

---

## 4. Ketersediaan Layanan

### 4.1 Formula Perhitungan Uptime

```
Uptime (%) = ((Total Menit dalam Periode - Downtime Tidak Terencana) / Total Menit dalam Periode) x 100

Dimana:
- Total Menit dalam Periode = jumlah menit dalam 1 bulan kalender
- Downtime Tidak Terencana = total menit layanan tidak dapat diakses di luar jadwal maintenance
- Maintenance Terencana TIDAK dihitung sebagai downtime
```

**Contoh kalkulasi (bulan 30 hari):**

```
Total menit:                43.200 menit
Target uptime 99,5%:        43.200 x 0,995 = 42.984 menit tersedia
Downtime diizinkan:         43.200 - 42.984 = 216 menit (3 jam 36 menit)
```

### 4.2 Jendela Maintenance Terencana

| **Tipe Maintenance**                | **Jadwal**                                    | **Durasi Estimasi** | **Notifikasi**          |
|-------------------------------------|-----------------------------------------------|---------------------|-------------------------|
| Deployment rutin (auto-deploy)      | Setiap push ke branch main                    | < 30 detik          | Tidak diperlukan        |
| Update dependensi minor             | Bulanan                                       | < 5 menit           | Tidak diperlukan        |
| Update dependensi major / migrasi   | Sesuai kebutuhan                              | 15-60 menit         | 24 jam sebelumnya       |
| Migrasi infrastruktur               | Sesuai kebutuhan (e.g., Railway ke VPS)       | 1-4 jam             | 72 jam sebelumnya       |

**Kebijakan maintenance:**

- Maintenance terencana dijadwalkan di luar jam sibuk pengguna Indonesia (di luar 19:00-23:00 WIB).
- Deployment rutin menggunakan zero-downtime deployment (Vercel rolling deploy, Railway auto-deploy).
- Maintenance yang memerlukan downtime > 5 menit akan diumumkan melalui halaman status atau banner di website.

### 4.3 Penanganan Downtime Tidak Terencana

| **Severity**   | **Definisi**                                                          | **Target Respons**  | **Target Resolusi** |
|----------------|-----------------------------------------------------------------------|---------------------|---------------------|
| **Kritis**     | Seluruh layanan tidak dapat diakses (frontend + backend down)         | < 1 jam             | < 4 jam             |
| **Tinggi**     | Backend API down (tool server-side tidak berfungsi)                   | < 2 jam             | < 8 jam             |
| **Sedang**     | Satu tool spesifik mengalami error                                    | < 4 jam             | < 24 jam            |
| **Rendah**     | Degradasi performa (response time meningkat, bukan outage)            | < 8 jam             | < 48 jam            |

**Catatan:** Target respons dan resolusi di atas merupakan best-effort untuk model solo-founder + AI agent. Papyr saat ini tidak memiliki tim on-call 24/7. Respons bergantung pada ketersediaan founder.

### 4.4 Ketergantungan pada Pihak Ketiga

Ketersediaan Papyr bergantung pada tiga layanan infrastruktur utama:

| **Provider**       | **Layanan**                  | **SLA Provider**  | **Dampak jika Down**                                              |
|--------------------|------------------------------|-------------------|-------------------------------------------------------------------|
| **Vercel**         | Frontend hosting, CDN, SSL   | 99,99%            | Website tidak dapat diakses; semua tool tidak tersedia             |
| **Railway**        | Backend API hosting          | Tidak ada SLA formal (Hobby Plan) | Tool server-side tidak berfungsi (Compress, PDF-to-Image); tool client-side tetap berfungsi |
| **Cloudflare R2**  | Object storage sementara     | 99,9%             | Upload/download file hasil pemrosesan server gagal; tool client-side tetap berfungsi |

**Strategi mitigasi ketergantungan:**

- **Arsitektur hybrid** memastikan 3 dari 6 tool (Merge, Split, Rotate) tetap berfungsi meskipun backend down — karena diproses 100% di browser.
- **Image to PDF** memiliki fallback client-side untuk file < 3 MB.
- **Docker-based backend** memungkinkan migrasi cepat (4-8 jam) ke provider alternatif jika Railway mengalami outage berkepanjangan.
- **Cloudflare R2** memiliki track record ketersediaan sangat tinggi dan tidak memiliki egress fee.

### 4.5 Degradasi Layanan yang Dapat Diterima (Graceful Degradation)

| **Kondisi**                          | **Tool yang Tetap Berfungsi**                | **Tool yang Terdampak**                      |
|--------------------------------------|----------------------------------------------|----------------------------------------------|
| Backend API down                     | Merge, Split, Rotate, Image-to-PDF (< 3 MB) | Compress, PDF-to-Image, Image-to-PDF (>= 3 MB) |
| Cloudflare R2 down                   | Merge, Split, Rotate                         | Compress, PDF-to-Image, Image-to-PDF (server) |
| Vercel down                          | Tidak ada                                    | Semua tool (website tidak dapat diakses)     |
| Railway cold start (delay 5-15 detik)| Merge, Split, Rotate (tanpa delay)           | Compress, PDF-to-Image (delay pada request pertama) |

---

## 5. Dukungan & Respons

### 5.1 Model Dukungan Saat Ini (Fase MVP)

Papyr saat ini beroperasi dalam fase MVP dengan model solo-founder + AI agent. **Tidak ada tim dukungan formal yang tersedia.** Dukungan diberikan secara best-effort melalui channel berikut:

| **Channel**                  | **Tujuan**                                              | **Waktu Respons (Target)** | **Status**       |
|------------------------------|---------------------------------------------------------|----------------------------|------------------|
| GitHub Issues                | Pelaporan bug, permintaan fitur, masalah teknis         | < 72 jam (hari kerja)      | Aktif            |
| Halaman FAQ (mypapyr.com)    | Jawaban untuk pertanyaan umum                           | Self-service               | Aktif            |
| Privacy Policy page          | Informasi penanganan data dan privasi                   | Self-service               | Aktif            |

### 5.2 Pelaporan Bug melalui GitHub Issues

Pengguna dapat melaporkan bug atau masalah teknis melalui repository GitHub Papyr. Laporan bug sebaiknya mencakup:

1. **Deskripsi masalah** — apa yang terjadi vs apa yang diharapkan.
2. **Tool yang digunakan** — Compress, Merge, Split, Image-to-PDF, PDF-to-Image, atau Rotate.
3. **Perangkat dan browser** — e.g., Android 13, Chrome 120.
4. **Ukuran file** — perkiraan ukuran file yang diproses.
5. **Pesan error** — screenshot atau teks error yang muncul (jika ada).
6. **Langkah reproduksi** — langkah-langkah untuk mereproduksi masalah.

### 5.3 Rencana Dukungan Masa Depan (Tier Pro)

| **Channel**                  | **Tier Free**                | **Tier Pro (Direncanakan)**                  |
|------------------------------|------------------------------|----------------------------------------------|
| FAQ & self-service           | Tersedia                     | Tersedia                                     |
| GitHub Issues                | Tersedia (best-effort)       | Tersedia (prioritas)                         |
| Email support                | Tidak tersedia               | Tersedia (target respons < 24 jam hari kerja)|
| Priority bug fix             | Tidak tersedia               | Tersedia                                     |
| Dedicated support            | Tidak tersedia               | Tidak tersedia (dipertimbangkan untuk Enterprise) |

### 5.4 Eskalasi

Mengingat model solo-founder, tidak ada hierarki eskalasi formal. Semua laporan ditangani langsung oleh founder dengan bantuan AI agent. Prioritas penanganan ditentukan berdasarkan:

| **Prioritas** | **Kriteria**                                                          | **Target Penanganan** |
|---------------|-----------------------------------------------------------------------|------------------------|
| P1 — Kritis   | Seluruh layanan down atau data breach                                | Segera (< 4 jam)      |
| P2 — Tinggi   | Satu tool utama tidak berfungsi                                      | < 24 jam               |
| P3 — Sedang   | Bug yang memengaruhi UX tetapi tool masih berfungsi                  | < 72 jam               |
| P4 — Rendah   | Permintaan fitur, perbaikan kosmetik, enhancement                    | Backlog (sesuai roadmap)|

---

## 6. Pengecualian

### 6.1 Kondisi yang Dikecualikan dari SLA

SLA ini **tidak berlaku** dan target tingkat layanan **tidak dihitung** dalam kondisi berikut:

#### 6.1.1 Force Majeure

Kejadian di luar kendali wajar Papyr, termasuk namun tidak terbatas pada:

- Bencana alam (gempa bumi, banjir, tsunami, letusan gunung berapi).
- Pandemi atau keadaan darurat kesehatan publik.
- Perang, terorisme, kerusuhan sipil, atau sanksi pemerintah.
- Gangguan infrastruktur internet global atau regional (kabel bawah laut putus, DNS root server failure).
- Pemadaman listrik massal yang memengaruhi data center provider.
- Perubahan regulasi pemerintah yang memaksa penghentian layanan.

#### 6.1.2 Gangguan Layanan Pihak Ketiga

Downtime atau degradasi performa yang disebabkan oleh provider infrastruktur Papyr:

| **Provider**       | **Contoh Gangguan**                                                    |
|--------------------|------------------------------------------------------------------------|
| **Vercel**         | Outage global Vercel, degradasi edge network, build system failure     |
| **Railway**        | Container restart, platform maintenance, resource throttling           |
| **Cloudflare R2**  | Storage outage, API unavailability, lifecycle rule delay               |
| **Cloudflare CDN** | DNS propagation delay, CDN cache purge failure                         |
| **Hostinger DNS**  | DNS resolution failure, propagation delay                              |

Papyr akan berupaya mengkomunikasikan gangguan pihak ketiga kepada pengguna melalui banner di website atau halaman status, namun resolusi sepenuhnya bergantung pada provider terkait.

#### 6.1.3 Maintenance Terencana

Downtime yang terjadi selama jendela maintenance terencana (sebagaimana didefinisikan di Bagian 4.2) tidak dihitung sebagai pelanggaran SLA, dengan syarat:

- Maintenance telah diumumkan sesuai kebijakan notifikasi.
- Durasi maintenance tidak melebihi estimasi yang diumumkan lebih dari 2x.

#### 6.1.4 Masalah yang Disebabkan oleh Pengguna

SLA tidak berlaku untuk masalah yang disebabkan oleh tindakan atau kondisi pengguna:

| **Kondisi**                                      | **Keterangan**                                                        |
|--------------------------------------------------|-----------------------------------------------------------------------|
| File tidak valid atau rusak (corrupt)             | File PDF yang rusak atau tidak sesuai standar PDF                     |
| File melebihi batas ukuran (> 20 MB)             | Ditolak oleh sistem dengan pesan error yang jelas                     |
| Format file tidak didukung                        | Hanya PDF, JPG, PNG, WEBP yang didukung                              |
| File terproteksi password (untuk Compress)        | Ghostscript tidak dapat memproses file terenkripsi                    |
| Melebihi rate limit (> 10 request/menit)         | Respons HTTP 429 — pengguna harus menunggu sebelum mencoba lagi      |
| Browser tidak didukung (< Chrome 90)             | Operasi client-side mungkin gagal di browser lama                     |
| Koneksi internet pengguna tidak stabil           | Upload/download mungkin gagal atau timeout                            |
| Penggunaan VPN/proxy yang memblokir akses        | Beberapa konfigurasi jaringan mungkin memblokir akses ke API         |
| Penyalahgunaan platform (abuse, DDoS attempt)    | IP yang terdeteksi melakukan abuse dapat diblokir                     |

---

## 7. Privasi & Keamanan

### 7.1 Prinsip Privasi

Papyr dibangun dengan filosofi **privacy-first** yang melekat pada arsitektur sistem, bukan sekadar kebijakan tertulis. Prinsip-prinsip berikut merupakan komitmen teknis yang diimplementasikan dalam kode:

| **Prinsip**                          | **Implementasi**                                                                |
|--------------------------------------|---------------------------------------------------------------------------------|
| **Tidak ada data pengguna yang disimpan** | Tidak ada login, registrasi, cookies, atau profil pengguna                 |
| **File auto-delete dalam 60 menit**  | R2 lifecycle rule + cron fallback setiap 30 menit (double safety)               |
| **Tidak ada logging konten file**    | Konten file tidak pernah di-log; hanya metadata operasional (ukuran, tipe, timestamp) |
| **Anonimisasi nama file**            | Semua file disimpan dengan UUID; nama asli file tidak pernah disimpan di server |
| **Client-side processing priority**  | Merge, Split, Rotate diproses 100% di browser — file tidak pernah meninggalkan perangkat |
| **Signed URL access**                | File hasil pemrosesan hanya dapat diakses melalui signed URL dengan expiry time |
| **Tidak ada direct public access**   | R2 bucket tidak memiliki public access — semua akses melalui signed URL        |

### 7.2 Keamanan Transmisi Data

| **Lapisan**                  | **Mekanisme**                                                                   |
|------------------------------|---------------------------------------------------------------------------------|
| **Enkripsi in-transit**      | TLS 1.3 untuk semua komunikasi (frontend, API, R2)                             |
| **HTTPS enforced**           | Semua HTTP request di-redirect ke HTTPS secara otomatis                         |
| **CORS strict**              | Backend hanya menerima request dari origin yang diizinkan (mypapyr.com)         |
| **SSL/TLS certificate**     | Managed otomatis oleh Vercel (frontend) dan Railway (backend)                   |

### 7.3 Keamanan File

| **Lapisan**                  | **Mekanisme**                                                                   |
|------------------------------|---------------------------------------------------------------------------------|
| **Validasi multi-layer**     | Setiap file divalidasi melalui 3 layer: MIME type, ekstensi file, magic bytes header |
| **Rate limiting**            | Maksimum 10 request/menit/IP menggunakan slowapi                               |
| **Ukuran file dibatasi**     | Maksimum 20 MB per file — file lebih besar ditolak                              |
| **UUID filename**            | Nama file asli diganti UUID — mencegah path traversal dan information leakage   |
| **Auto-delete 60 menit**    | Dua mekanisme: R2 lifecycle rule + cron job fallback setiap 30 menit           |
| **No persistent storage**    | Tidak ada file yang disimpan secara permanen di server manapun                  |

### 7.4 Kepatuhan Regulasi

| **Regulasi**                         | **Status Kepatuhan**                                                            |
|--------------------------------------|---------------------------------------------------------------------------------|
| **UU PDP (UU No. 27/2022)**          | Risiko minimal — tidak ada data personal yang disimpan; Privacy Policy tersedia di mypapyr.com; arsitektur privacy-first memenuhi prinsip minimalisasi data |
| **UU ITE (No. 11/2008 jo. 19/2016)**| Covered oleh Terms of Service dan Privacy Policy                                |
| **PSE KOMINFO**                      | Registrasi diperlukan sebelum monetisasi (action item — lihat PPR-FS-001)       |
| **GDPR (awareness)**                 | Privacy Policy GDPR-aware untuk potensi ekspansi internasional                  |

### 7.5 Komitmen Keamanan

Papyr berkomitmen untuk:

1. **Tidak pernah menjual, membagikan, atau menganalisis konten file pengguna** untuk tujuan apapun.
2. **Tidak pernah menggunakan file pengguna untuk training AI** atau tujuan machine learning.
3. **Menghapus semua file dalam 60 menit** tanpa pengecualian — tidak ada opsi untuk memperpanjang retensi.
4. **Melaporkan insiden keamanan** (jika terjadi) secara transparan melalui halaman status atau pengumuman di website.
5. **Melakukan security review** pada setiap update major yang memengaruhi penanganan file.

---

## 8. Pemantauan & Pelaporan

### 8.1 Infrastruktur Pemantauan

| **Komponen**                 | **Tool Pemantauan**          | **Metrik yang Dipantau**                                          |
|------------------------------|------------------------------|-------------------------------------------------------------------|
| **Frontend (mypapyr.com)**   | Vercel Analytics             | Page views, visitors, device category, Core Web Vitals            |
| **Frontend Performance**     | Vercel Speed Insights        | LCP, FID, CLS, TTFB, FCP per halaman                             |
| **Backend API**              | Railway Logs                 | Request logs, error logs, response time, resource usage           |
| **Backend Health**           | Health check endpoint        | /health — status API, konektivitas R2, Ghostscript availability   |
| **File Cleanup**             | Cron job monitoring          | cleanup_success, cleanup_failure events dalam structured logs     |
| **Custom Events**            | Vercel Analytics Events      | task_started, task_completed, task_failed per tool                |

### 8.2 Event Tracking

Papyr melacak event berikut untuk setiap tool (tanpa melacak konten file):

| **Event**              | **Trigger**                                              | **Data yang Dicatat**                              |
|------------------------|----------------------------------------------------------|----------------------------------------------------|
| `task_started`         | Pengguna memulai operasi PDF                             | Tool name, device category, timestamp              |
| `task_completed`       | Operasi PDF berhasil diselesaikan                        | Tool name, device category, timestamp, duration    |
| `task_failed`          | Operasi PDF gagal                                        | Tool name, device category, timestamp, error type  |
| `cleanup_success`      | File berhasil dihapus dari R2                            | File count, timestamp                              |
| `cleanup_failure`      | Gagal menghapus file dari R2                             | File count, timestamp, error detail                |

### 8.3 Dashboard dan Pelaporan

| **Laporan**                  | **Frekuensi**    | **Isi**                                                           | **Akses**              |
|------------------------------|------------------|-------------------------------------------------------------------|------------------------|
| Traffic & usage overview     | Real-time        | Visitors, page views, device breakdown                            | Vercel Analytics       |
| Performance metrics          | Real-time        | Core Web Vitals, page load times                                  | Vercel Speed Insights  |
| Backend health & logs        | Real-time        | API response times, error rates, resource usage                   | Railway Dashboard      |
| Task success/failure rates   | Harian           | Aggregasi task_completed vs task_failed per tool                  | Vercel Analytics       |
| Cleanup audit                | Harian           | Jumlah file yang berhasil/gagal dihapus                           | Railway Logs           |
| Monthly SLA review           | Bulanan          | Uptime aktual, response time P95, task success rate               | Internal report        |

### 8.4 Alerting (Rencana)

| **Kondisi**                          | **Mekanisme Alert**          | **Status**           |
|--------------------------------------|------------------------------|----------------------|
| Backend health check gagal           | Railway auto-restart         | Aktif (otomatis)     |
| Deployment gagal                     | Vercel/Railway notification  | Aktif (otomatis)     |
| Error rate > 10% dalam 1 jam         | Manual monitoring            | Direncanakan         |
| Uptime < 99% dalam 24 jam           | Uptime Kuma (self-hosted)    | Direncanakan (M6+)  |
| R2 cleanup failure > 5 file          | Log alert                    | Direncanakan         |

### 8.5 Kapasitas Monitoring

Berdasarkan PPR-CP-001, kapasitas infrastruktur saat ini dipantau terhadap threshold berikut:

| **Resource**                 | **Kapasitas Saat Ini**       | **Threshold Alert**          | **Aksi jika Tercapai**       |
|------------------------------|------------------------------|------------------------------|------------------------------|
| Vercel bandwidth             | 100 GB/bulan (free tier)     | 80 GB/bulan (80%)            | Evaluasi: CDN caching atau migrasi |
| Railway $5 credit            | $5/bulan                     | $4 usage (80%)               | Monitor; siapkan migrasi VPS |
| Railway RAM                  | 8 GB shared                  | 4 GB sustained               | Evaluasi: optimize atau migrasi |
| R2 storage concurrent        | 10 GB (free tier)            | 8 GB concurrent (80%)        | Evaluasi: auto-delete timing |
| R2 write operations          | 1.000.000/bulan (free tier)  | 800.000/bulan (80%)          | Monitor; budget untuk overage |

---

## 9. Peninjauan & Pembaruan SLA

### 9.1 Jadwal Peninjauan

| **Tipe Peninjauan**          | **Frekuensi**    | **Penanggung Jawab**         | **Output**                                    |
|------------------------------|------------------|------------------------------|-----------------------------------------------|
| Peninjauan rutin             | Triwulanan (Q)   | Product Owner + AI Agent     | Laporan SLA compliance; rekomendasi perbaikan |
| Peninjauan ad-hoc            | Sesuai kebutuhan | Product Owner                | Revisi SLA jika diperlukan                    |
| Peninjauan major             | Tahunan          | Product Owner + AI Agent     | Revisi komprehensif seluruh metrik dan target |

### 9.2 Trigger Peninjauan Ad-Hoc

Peninjauan SLA di luar jadwal rutin akan dilakukan jika terjadi salah satu kondisi berikut:

| **#** | **Trigger**                                                                    |
|-------|--------------------------------------------------------------------------------|
| 1     | Perubahan signifikan pada infrastruktur (migrasi Railway ke VPS, upgrade Vercel) |
| 2     | Peluncuran tier Pro (memerlukan SLA terpisah dengan komitmen lebih tinggi)     |
| 3     | Penambahan tool baru yang mengubah profil beban server                         |
| 4     | Insiden keamanan atau data breach                                              |
| 5     | Perubahan pricing atau terms dari provider (Vercel, Railway, Cloudflare)       |
| 6     | Traffic meningkat > 10x dari baseline saat SLA terakhir disetujui              |
| 7     | Perubahan regulasi yang memengaruhi operasi (UU PDP enforcement, PSE)          |
| 8     | SLA compliance turun di bawah 95% selama 2 bulan berturut-turut               |

### 9.3 Proses Pembaruan SLA

```
1. IDENTIFIKASI
   +-- Kumpulkan data performa aktual (uptime, response time, task success rate)
   +-- Bandingkan dengan target SLA yang berlaku
   +-- Identifikasi gap dan area perbaikan

2. ANALISIS
   +-- Evaluasi apakah target masih realistis berdasarkan infrastruktur saat ini
   +-- Pertimbangkan perubahan pada fitur, traffic, atau infrastruktur
   +-- Konsultasi dengan data dari PPR-CP-001 (cost projection) untuk feasibility

3. DRAFT REVISI
   +-- Buat draft SLA baru dengan perubahan yang diusulkan
   +-- Dokumentasikan justifikasi untuk setiap perubahan metrik
   +-- Pastikan konsistensi dengan dokumen terkait (BRD, TDD, DR)

4. REVIEW & APPROVAL
   +-- Review oleh Product Owner
   +-- Review oleh AI Agent (konsistensi teknis)
   +-- Approval formal oleh kedua pihak

5. PUBLIKASI
   +-- Update versi dokumen (increment minor untuk perubahan kecil, major untuk revisi besar)
   +-- Update riwayat versi
   +-- Komunikasikan perubahan kepada stakeholder
```

### 9.4 Versioning

| **Tipe Perubahan**                   | **Versi**        | **Contoh**                                    |
|--------------------------------------|------------------|-----------------------------------------------|
| Perbaikan typo, klarifikasi minor    | Patch (1.0.x)    | 1.0.1 — Klarifikasi definisi downtime         |
| Perubahan target metrik, tambah tool | Minor (1.x.0)    | 1.1.0 — Tambah SLA untuk Protect PDF          |
| Revisi komprehensif, perubahan model | Major (x.0.0)    | 2.0.0 — SLA untuk tier Pro + Free             |

---

## 10. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Service Level Agreement ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan komitmen tingkat layanan untuk Papyr Fase 1.

| **Peran**         | **Nama**                     | **Tanda Tangan** | **Tanggal** |
|:------------------|:-----------------------------|:-----------------|:------------|
| **Product Owner** | Muhammad Fa'iz Zulfikar      | Approved         | 2026-05-03  |
| **AI Agent**      | OpenCode/Sisyphus            | Approved         | 2026-05-03  |

**Catatan:** Dalam model solo-founder + AI agent saat ini, semua peran teknis dijalankan oleh Founder dengan bantuan AI Agent. Dokumen ini telah ditinjau untuk akurasi teknis dan kelayakan target berdasarkan infrastruktur aktual (Vercel Free Tier, Railway $5/bulan, Cloudflare R2 Free Tier).

---

## Lampiran A: Glosarium

| **Istilah**              | **Definisi**                                                                                  |
|--------------------------|-----------------------------------------------------------------------------------------------|
| SLA                      | Service Level Agreement — perjanjian tingkat layanan antara penyedia dan pengguna              |
| Uptime                   | Persentase waktu layanan tersedia dan dapat diakses dalam periode tertentu                     |
| Downtime                 | Periode di mana layanan tidak dapat diakses atau tidak berfungsi sebagaimana mestinya          |
| P50 / P95                | Percentile 50 / 95 — nilai di mana 50% / 95% dari semua pengukuran berada di bawahnya        |
| LCP                      | Largest Contentful Paint — metrik Core Web Vitals untuk waktu render elemen terbesar           |
| FCP                      | First Contentful Paint — waktu hingga konten pertama terlihat di layar                        |
| CLS                      | Cumulative Layout Shift — metrik stabilitas visual halaman                                    |
| TTI                      | Time to Interactive — waktu hingga halaman sepenuhnya interaktif                              |
| TTFB                     | Time to First Byte — waktu hingga byte pertama diterima dari server                           |
| Cold Start               | Delay saat container Railway di-start ulang setelah periode idle                              |
| Client-Side Processing   | Pemrosesan yang dilakukan di browser pengguna tanpa mengirim file ke server                   |
| Server-Side Processing   | Pemrosesan yang dilakukan di server backend (Railway)                                         |
| Signed URL               | URL dengan token autentikasi dan waktu kedaluwarsa untuk akses file sementara                 |
| Rate Limiting            | Pembatasan jumlah request per IP per satuan waktu untuk mencegah abuse                        |
| Magic Bytes              | Byte awal file yang mengidentifikasi format file sebenarnya (file signature)                  |
| UUID                     | Universally Unique Identifier — identifier unik yang digunakan sebagai nama file di server    |
| Cron Job                 | Tugas terjadwal yang berjalan secara otomatis pada interval tertentu                          |
| Graceful Degradation     | Kemampuan sistem untuk tetap berfungsi sebagian saat komponen tertentu mengalami kegagalan    |
| UU PDP                   | Undang-Undang Pelindungan Data Pribadi (UU No. 27 Tahun 2022)                                 |
| PSE                      | Penyelenggara Sistem Elektronik — registrasi wajib di KOMINFO untuk platform digital          |

---

## Lampiran B: Ringkasan Target SLA

| **Metrik**                           | **Target**                   | **Referensi Bagian** |
|--------------------------------------|------------------------------|----------------------|
| Uptime keseluruhan                   | 99,5%                        | 3.1                  |
| Frontend page load (FCP)             | < 2 detik                    | 3.2                  |
| Backend API response (P95)           | < 5 detik                    | 3.2                  |
| Compress PDF                         | < 10 detik (5 MB)            | 3.3                  |
| Merge PDF                            | < 3 detik (5 file)           | 3.3                  |
| Split PDF                            | < 3 detik (10 MB)            | 3.3                  |
| Image to PDF                         | < 5 detik (5 gambar)         | 3.3                  |
| PDF to Image                         | < 10 detik (5 halaman)       | 3.3                  |
| Rotate PDF                           | < 3 detik (10 MB)            | 3.3                  |
| Upload limit                         | 20 MB/file                   | 3.4                  |
| File retention                       | Maks 60 menit                | 3.4                  |
| Rate limit                           | 10 req/menit/IP              | 3.4                  |
| Task success rate (Bulan 3)          | > 95%                        | 3.5                  |
| Task success rate (Bulan 12)         | > 99%                        | 3.5                  |
| File cleanup success rate            | > 99,9%                      | 3.5                  |
| Bug report response (GitHub Issues)  | < 72 jam                     | 5.1                  |
| Incident response (Kritis)           | < 4 jam                      | 4.3                  |
| SLA review frequency                 | Triwulanan                   | 9.1                  |

---

*End of Document*

*PPR-SLA-001 v1.0 — Papyr Service Level Agreement*
*Classification: Confidential — Internal and Investor Use Only*
*Generated: 2026-05-03*
*Total Sections: 10 + 2 Lampiran*
