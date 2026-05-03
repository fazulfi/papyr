**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Performance Benchmark**

Version 1.0 | Juni 2025

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Performance Benchmark — Papyr                |
| **ID Dokumen**      | PPR-PB-001                                   |
| **Versi**           | 1.0                                          |
| **Status**          | Draft                                        |
| **Tanggal Dibuat**  | Juni 2025                                    |
| **Terakhir Diubah** | Juni 2025                                    |
| **Penulis**         | AI Agent (OpenCode/Sisyphus)                 |
| **Ditinjau Oleh**   | Product Owner (Muhammad Fa'iz Zulfikar)      |
| **Disetujui Oleh**  | Product Owner                                |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                                          |
|-----------|-------------|------------------------------|--------------------------------------------------------------------------------------------------------|
| 1.0       | Juni 2025   | AI Agent (OpenCode/Sisyphus) | Draft awal — framework benchmark, baseline estimasi, dan target performa untuk Papyr v1.1.0           |

**Dokumen Terkait**

| **ID Dokumen** | **Judul**                                    | **Relevansi**                                              |
|----------------|----------------------------------------------|------------------------------------------------------------|
| PPR-SLA-001    | Service Level Agreement                      | Target SLA yang menjadi acuan benchmark                    |
| PPR-TDD-001    | Technical Design Document                    | Arsitektur sistem, processing strategy, infrastruktur      |
| PPR-CA-001     | Competitive Analysis                         | Perbandingan performa dengan kompetitor                    |
| PPR-DR-001     | Deployment Runbook                           | Konfigurasi infrastruktur dan deployment                   |
| PPR-CP-001     | Cost Projection & Break-Even Analysis        | Kapasitas infrastruktur dan batasan tier gratis            |

---

**Daftar Isi**

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Metodologi Benchmark](#2-metodologi-benchmark)
3. [Metrik Performa](#3-metrik-performa)
4. [Baseline Estimasi](#4-baseline-estimasi)
5. [Target Performa](#5-target-performa)
6. [Perbandingan Kompetitor](#6-perbandingan-kompetitor)
7. [Analisis Bottleneck](#7-analisis-bottleneck)
8. [Rekomendasi Optimasi](#8-rekomendasi-optimasi)
9. [Rencana Benchmark Formal](#9-rencana-benchmark-formal)
10. [Referensi Silang](#10-referensi-silang)
11. [Persetujuan Dokumen](#11-persetujuan-dokumen)

---

## 1. Ringkasan Eksekutif

### 1.1 Latar Belakang

Dokumen ini menetapkan framework Performance Benchmark untuk Papyr (mypapyr.com) — web application utilitas PDF yang dirancang khusus untuk pasar Indonesia. Papyr saat ini beroperasi pada arsitektur hybrid yang menggabungkan pemrosesan client-side (browser) untuk operasi ringan dan server-side (FastAPI pada Railway) untuk operasi berat.

**Penting:** Papyr belum menjalani benchmark formal secara terstruktur. Dokumen ini berfungsi sebagai:

1. **Framework pengukuran** — Mendefinisikan metodologi, tool, dan prosedur untuk melakukan benchmark yang konsisten dan reproducible.
2. **Baseline estimasi** — Menyediakan estimasi performa berdasarkan pengetahuan arsitektur, karakteristik infrastruktur, dan pengalaman operasional.
3. **Target performa** — Menetapkan Service Level Objectives (SLO) yang selaras dengan SLA (PPR-SLA-001).
4. **Roadmap optimasi** — Mengidentifikasi bottleneck dan merekomendasikan langkah-langkah peningkatan performa.

### 1.2 Arsitektur Performa

Papyr mengadopsi strategi pemrosesan dual-layer yang dirancang untuk meminimalkan latensi dan memaksimalkan privasi:

| **Layer**        | **Teknologi**              | **Operasi**                                      | **Karakteristik**                          |
|------------------|----------------------------|--------------------------------------------------|--------------------------------------------|
| Client-side      | pdf-lib (JavaScript)       | Merge, Split, Rotate, Image-to-PDF (< 3MB)      | Zero upload, zero latency jaringan         |
| Server-side      | FastAPI + Ghostscript/PyMuPDF | Compress, PDF-to-Image, Image-to-PDF (> 3MB)  | Memerlukan upload/download, latensi jaringan |

### 1.3 Temuan Utama (Estimasi)

- **Operasi client-side** diestimasi selesai dalam **< 2 detik** untuk file tipikal (< 3MB), memberikan pengalaman instan tanpa latensi jaringan.
- **Operasi server-side** diestimasi memerlukan **3–15 detik** tergantung ukuran file, didominasi oleh waktu transfer jaringan (upload/download) dan overhead Ghostscript.
- **Bottleneck utama** adalah latensi jaringan antara pengguna Indonesia dan Railway US-West2 (~200–300ms RTT) serta cold start container (~2–5 detik setelah idle).
- **Keunggulan kompetitif** terletak pada operasi client-side yang mengeliminasi latensi jaringan sepenuhnya — sesuatu yang tidak dilakukan oleh kompetitor global (iLovePDF, SmallPDF).

---

## 2. Metodologi Benchmark

### 2.1 Prinsip Pengukuran

Benchmark Papyr mengikuti prinsip-prinsip berikut:

| **Prinsip**          | **Deskripsi**                                                                                     |
|----------------------|---------------------------------------------------------------------------------------------------|
| Reproducible         | Setiap pengukuran harus dapat diulang dengan hasil konsisten (± 10% variance)                    |
| Representative       | Skenario pengujian mencerminkan penggunaan nyata oleh pengguna Indonesia                         |
| Isolated             | Pengukuran dilakukan dalam kondisi terkontrol untuk menghindari noise dari faktor eksternal      |
| Comprehensive        | Mencakup seluruh layer: frontend, network, backend, dan client-side processing                   |
| Documented           | Setiap hasil benchmark disertai metadata lengkap (waktu, kondisi, environment)                   |

### 2.2 Tool Benchmark

#### 2.2.1 Frontend Performance

| **Tool**                | **Fungsi**                                          | **Metrik yang Diukur**                    |
|-------------------------|-----------------------------------------------------|-------------------------------------------|
| Google Lighthouse       | Audit performa halaman web                          | LCP, FID/INP, CLS, TTFB, Performance Score |
| WebPageTest             | Pengujian dari lokasi geografis spesifik            | Waterfall, TTFB, Speed Index, filmstrip   |
| Vercel Speed Insights   | Real User Metrics (RUM) dari pengguna aktual        | LCP, FID, CLS, TTFB (field data)         |
| Chrome DevTools         | Profiling runtime dan memory                        | JS heap, paint timing, layout shifts      |

#### 2.2.2 Backend API Performance

| **Tool**                | **Fungsi**                                          | **Metrik yang Diukur**                    |
|-------------------------|-----------------------------------------------------|-------------------------------------------|
| k6 (Grafana)           | Load testing dan stress testing API                 | Response time (p50, p95, p99), throughput, error rate |
| curl + time            | Pengukuran manual endpoint individual               | TTFB, total time, DNS lookup              |
| Railway Metrics        | Monitoring resource usage container                 | CPU, memory, network I/O                  |
| Custom Python script   | Automated benchmark suite                           | End-to-end processing time per operasi    |

#### 2.2.3 Client-side Processing

| **Tool**                | **Fungsi**                                          | **Metrik yang Diukur**                    |
|-------------------------|-----------------------------------------------------|-------------------------------------------|
| Performance API         | Browser native timing                               | `performance.now()` delta per operasi     |
| Chrome DevTools Performance | CPU profiling dan memory snapshot               | Execution time, memory allocation         |
| Custom benchmark script | Automated testing dengan berbagai ukuran file       | Processing time vs file size correlation  |

#### 2.2.4 Network Performance

| **Tool**                | **Fungsi**                                          | **Metrik yang Diukur**                    |
|-------------------------|-----------------------------------------------------|-------------------------------------------|
| WebPageTest (Jakarta)  | Simulasi koneksi dari Indonesia                     | Latency, bandwidth utilization            |
| ping/traceroute        | Network path analysis                               | RTT ke Railway US-West2, hop count        |
| Custom upload script   | Pengukuran transfer time                            | Upload/download speed per file size       |

### 2.3 Lingkungan Pengujian

#### 2.3.1 Profil Perangkat Target

| **Profil**             | **Perangkat**                    | **Koneksi**          | **Representasi**                |
|------------------------|----------------------------------|----------------------|---------------------------------|
| Mobile Indonesia       | Android mid-range (4GB RAM)      | 4G LTE (25 Mbps)    | 70% pengguna target             |
| Mobile Indonesia (low) | Android entry-level (2GB RAM)    | 3G/4G (10 Mbps)     | 15% pengguna target             |
| Desktop Indonesia      | Laptop/PC (8GB RAM)              | WiFi (50 Mbps)      | 15% pengguna target             |

#### 2.3.2 Lokasi Pengujian

| **Lokasi**             | **Tujuan**                                          | **Tool**                                  |
|------------------------|-----------------------------------------------------|-------------------------------------------|
| Jakarta, Indonesia     | Representasi pengguna utama                         | WebPageTest, k6 (cloud runner)            |
| Singapore              | Nearest Vercel Edge node                            | curl, k6                                  |
| US-West (Oregon)       | Co-located dengan Railway                           | curl, k6 (baseline tanpa latensi)         |

### 2.4 Skenario Pengujian

#### 2.4.1 File Sampel Standar

| **ID Sampel** | **Deskripsi**                        | **Ukuran** | **Halaman** | **Karakteristik**                    |
|---------------|--------------------------------------|------------|-------------|--------------------------------------|
| S-001         | Dokumen teks sederhana               | 100 KB     | 5           | Teks only, tanpa gambar              |
| S-002         | Dokumen akademik (skripsi)           | 1 MB       | 30          | Teks + beberapa gambar               |
| S-003         | Presentasi dengan grafik             | 3 MB       | 15          | Banyak gambar dan chart              |
| S-004         | Dokumen scan (KTP/ijazah)            | 5 MB       | 3           | Image-heavy, high DPI                |
| S-005         | Laporan keuangan besar               | 10 MB      | 100         | Tabel kompleks + grafik              |
| S-006         | Batas maksimum upload                | 20 MB      | 50          | Mixed content, stress test           |

#### 2.4.2 Skenario Operasi

| **Skenario**           | **Operasi**        | **Input**                          | **Processing** | **Metrik Utama**                |
|------------------------|--------------------|------------------------------------|----------------|---------------------------------|
| SC-001                 | Compress PDF       | S-002 (1 MB)                       | Server-side    | Total end-to-end time           |
| SC-002                 | Compress PDF       | S-005 (10 MB)                      | Server-side    | Total end-to-end time           |
| SC-003                 | Merge PDF          | 5× S-002 (5 MB total)             | Client-side    | Processing time                 |
| SC-004                 | Split PDF          | S-002 (halaman 1-10)              | Client-side    | Processing time                 |
| SC-005                 | Image-to-PDF       | 3 gambar JPG (500KB each)          | Client-side    | Processing time                 |
| SC-006                 | PDF-to-Image       | S-002 (5 halaman)                  | Server-side    | Total end-to-end time           |
| SC-007                 | Rotate PDF         | S-002 (10 halaman)                 | Client-side    | Processing time                 |
| SC-008                 | Compress PDF       | S-006 (20 MB, batas maks)          | Server-side    | Total end-to-end time           |

---

## 3. Metrik Performa

### 3.1 Frontend Performance (Core Web Vitals)

| **Metrik**                          | **Deskripsi**                                                              | **Target**    | **Pengukuran**                    |
|-------------------------------------|----------------------------------------------------------------------------|---------------|-----------------------------------|
| Largest Contentful Paint (LCP)      | Waktu render elemen konten terbesar yang terlihat                          | < 2.5s        | Lighthouse, Vercel Speed Insights |
| First Input Delay (FID)             | Waktu antara interaksi pertama dan respons browser                         | < 100ms       | Vercel Speed Insights (field)     |
| Interaction to Next Paint (INP)     | Latensi interaksi terburuk sepanjang sesi                                  | < 200ms       | Chrome UX Report                  |
| Cumulative Layout Shift (CLS)       | Total pergeseran layout yang tidak terduga                                 | < 0.1         | Lighthouse, Vercel Speed Insights |
| Time to First Byte (TTFB)           | Waktu dari request hingga byte pertama diterima                            | < 800ms       | WebPageTest, Lighthouse           |
| Total Bundle Size (JS)              | Ukuran total JavaScript yang di-download                                   | < 200 KB (gz) | Webpack Bundle Analyzer           |
| Total Bundle Size (CSS)             | Ukuran total CSS yang di-download                                          | < 50 KB (gz)  | Build output analysis             |
| Performance Score (Lighthouse)      | Skor agregat performa Lighthouse                                           | > 90          | Lighthouse CI                     |

### 3.2 Backend API Performance

| **Endpoint**                        | **Metrik**           | **Target (p50)** | **Target (p95)** | **Target (p99)** |
|-------------------------------------|----------------------|------------------|------------------|------------------|
| `POST /api/compress`                | Response Time        | < 3s             | < 8s             | < 15s            |
| `POST /api/pdf-to-image`            | Response Time        | < 3s             | < 6s             | < 10s            |
| `POST /api/image-to-pdf`            | Response Time        | < 2s             | < 5s             | < 8s             |
| `GET /health`                       | Response Time        | < 100ms          | < 200ms          | < 500ms          |
| `GET /api/download/{id}`            | Response Time        | < 500ms          | < 1s             | < 2s             |
| Semua endpoint                      | Error Rate           | < 1%             | < 2%             | < 5%             |
| Semua endpoint                      | Throughput           | > 10 req/min     | —                | —                |

### 3.3 Client-side Processing Performance

| **Operasi**                         | **Ukuran Input**     | **Target Waktu** | **Metrik Tambahan**               |
|-------------------------------------|----------------------|------------------|-----------------------------------|
| Merge PDF                           | 5 file × 1 MB       | < 2s             | Memory peak < 100 MB              |
| Merge PDF                           | 10 file × 1 MB      | < 4s             | Memory peak < 200 MB              |
| Split PDF                           | 30 halaman → 10     | < 1s             | Memory peak < 50 MB               |
| Split PDF                           | 100 halaman → 20    | < 2s             | Memory peak < 150 MB              |
| Rotate PDF                          | 10 halaman           | < 0.5s           | Memory peak < 30 MB               |
| Rotate PDF                          | 50 halaman           | < 1.5s           | Memory peak < 80 MB               |
| Image-to-PDF                        | 3 gambar × 500 KB   | < 1.5s           | Memory peak < 50 MB               |
| Image-to-PDF                        | 10 gambar × 500 KB  | < 3s             | Memory peak < 100 MB              |

### 3.4 Upload/Download Transfer Performance

| **Ukuran File** | **Upload (4G, 25 Mbps)** | **Upload (WiFi, 50 Mbps)** | **Download (4G)** | **Download (WiFi)** |
|-----------------|--------------------------|----------------------------|-------------------|---------------------|
| 500 KB          | ~0.2s                    | ~0.1s                      | ~0.2s             | ~0.1s               |
| 1 MB            | ~0.4s                    | ~0.2s                      | ~0.3s             | ~0.2s               |
| 3 MB            | ~1.0s                    | ~0.5s                      | ~1.0s             | ~0.5s               |
| 5 MB            | ~1.6s                    | ~0.8s                      | ~1.6s             | ~0.8s               |
| 10 MB           | ~3.2s                    | ~1.6s                      | ~3.2s             | ~1.6s               |
| 20 MB           | ~6.4s                    | ~3.2s                      | ~6.4s             | ~3.2s               |

> **Catatan:** Estimasi berdasarkan throughput teoritis. Faktor overhead TCP, TLS handshake, dan network congestion dapat menambah 20–50% waktu aktual.

---

## 4. Baseline Estimasi

### 4.1 Disclaimer

> **PENTING:** Seluruh angka dalam bagian ini adalah **estimasi** berdasarkan pengetahuan arsitektur, karakteristik infrastruktur yang diketahui, dan benchmark publik dari teknologi yang digunakan. Angka-angka ini **belum divalidasi** melalui pengukuran formal dan akan diperbarui setelah benchmark formal dilaksanakan (lihat Bagian 9).

### 4.2 Estimasi Performa Server-side

#### 4.2.1 Compress PDF (Ghostscript)

| **Ukuran Input** | **Upload**  | **Ghostscript Processing** | **R2 Upload** | **Download** | **Total Estimasi** |
|------------------|-------------|----------------------------|---------------|--------------|---------------------|
| 500 KB           | ~0.3s       | ~1.0–1.5s                  | ~0.2s         | ~0.2s        | **~2–3s**           |
| 1 MB             | ~0.5s       | ~1.5–2.5s                  | ~0.3s         | ~0.3s        | **~3–5s**           |
| 3 MB             | ~1.2s       | ~2.5–4.0s                  | ~0.5s         | ~0.8s        | **~5–7s**           |
| 5 MB             | ~1.8s       | ~3.0–5.0s                  | ~0.8s         | ~1.2s        | **~7–9s**           |
| 10 MB            | ~3.5s       | ~4.0–7.0s                  | ~1.0s         | ~2.5s        | **~8–15s**          |
| 20 MB            | ~7.0s       | ~6.0–10.0s                 | ~1.5s         | ~5.0s        | **~15–25s**         |

**Asumsi breakdown:**
- Upload: Pengguna Indonesia → Railway US-West2 via 4G (25 Mbps effective, +200ms RTT)
- Ghostscript: Subprocess spawn (~200ms) + processing (~1–2s per MB untuk dokumen tipikal)
- R2 Upload: Railway → Cloudflare R2 (co-located, minimal latency)
- Download: R2 signed URL → Pengguna Indonesia (Cloudflare edge, optimized)

#### 4.2.2 PDF-to-Image (PyMuPDF)

| **Halaman** | **Upload**  | **PyMuPDF Rendering** | **R2 Upload (ZIP)** | **Download** | **Total Estimasi** |
|-------------|-------------|------------------------|---------------------|--------------|---------------------|
| 1 halaman   | ~0.5s       | ~0.3–0.5s              | ~0.2s               | ~0.3s        | **~1.5–2s**         |
| 5 halaman   | ~0.5s       | ~1.5–2.5s              | ~0.5s               | ~1.0s        | **~3–5s**           |
| 10 halaman  | ~0.8s       | ~3.0–5.0s              | ~1.0s               | ~2.0s        | **~5–9s**           |
| 20 halaman  | ~1.0s       | ~6.0–10.0s             | ~2.0s               | ~4.0s        | **~10–18s**         |

**Asumsi:** Rendering pada 150 DPI (default), output PNG, ~200–500 KB per halaman.

#### 4.2.3 Image-to-PDF Server Fallback (> 3MB)

| **Input**              | **Upload**  | **PyMuPDF Processing** | **R2 Upload** | **Download** | **Total Estimasi** |
|------------------------|-------------|------------------------|---------------|--------------|---------------------|
| 5 gambar × 1 MB       | ~2.0s       | ~1.0–2.0s              | ~0.5s         | ~1.0s        | **~4–6s**           |
| 10 gambar × 1 MB      | ~4.0s       | ~2.0–3.0s              | ~1.0s         | ~2.0s        | **~7–11s**          |

### 4.3 Estimasi Performa Client-side

| **Operasi**                    | **Input**                    | **Estimasi Waktu** | **Catatan**                                    |
|--------------------------------|------------------------------|---------------------|------------------------------------------------|
| Merge 3 PDF                   | 3 × 500 KB                  | **~0.5–1.0s**      | pdf-lib load + merge + serialize               |
| Merge 5 PDF                   | 5 × 1 MB                    | **~1.0–2.0s**      | Linear scaling dengan jumlah file              |
| Merge 10 PDF                  | 10 × 1 MB                   | **~2.0–4.0s**      | Memory-intensive, mungkin lag di mobile        |
| Split 10-page PDF             | 1 × 1 MB → 10 halaman       | **~0.5–1.0s**      | Page extraction cepat                          |
| Split 50-page PDF             | 1 × 5 MB → range tertentu   | **~1.0–2.0s**      | Tergantung jumlah halaman output               |
| Rotate 10 halaman             | 1 × 1 MB                    | **~0.3–0.5s**      | Operasi paling ringan (metadata only)          |
| Rotate 50 halaman             | 1 × 5 MB                    | **~0.8–1.5s**      | Scaling linear                                 |
| Image-to-PDF (3 gambar)       | 3 × 500 KB JPG              | **~1.0–2.0s**      | Image decode + embed + serialize               |
| Image-to-PDF (10 gambar)      | 10 × 300 KB JPG             | **~2.0–3.0s**      | Memory peak tinggi di mobile                   |

**Faktor yang mempengaruhi performa client-side:**
- Spesifikasi perangkat pengguna (CPU, RAM)
- Jumlah tab browser yang terbuka
- Ukuran dan kompleksitas file PDF (encrypted, banyak layer, font embedded)
- Browser engine (V8/Chrome vs SpiderMonkey/Firefox vs JavaScriptCore/Safari)

### 4.4 Cold Start Impact

| **Kondisi**                    | **Tambahan Waktu**           | **Frekuensi**                                  |
|--------------------------------|------------------------------|------------------------------------------------|
| Railway container warm         | +0ms                         | Saat traffic aktif (< 15 menit idle)           |
| Railway container cold start   | +2,000–5,000ms               | Setelah 15+ menit tanpa request                |
| Ghostscript first invocation   | +200–500ms                   | Pertama kali setelah cold start                |
| R2 connection establishment    | +100–200ms                   | Pertama kali setelah cold start                |

> **Implikasi:** Pengguna pertama setelah periode idle akan mengalami waktu tunggu tambahan 2–5 detik. Ini adalah trade-off dari penggunaan Railway Free/Starter tier.

---

## 5. Target Performa

### 5.1 Service Level Objectives (SLO)

Target performa berikut selaras dengan SLA Papyr (PPR-SLA-001) dan disesuaikan dengan ekspektasi pengguna Indonesia:

#### 5.1.1 Target Waktu Respons API

| **Kategori Operasi**           | **Target (Warm)**  | **Target (Cold Start)** | **Batas Maksimum** | **SLA Reference**  |
|--------------------------------|--------------------|-------------------------|--------------------|--------------------|
| Compress PDF (< 5 MB)         | < 5s               | < 10s                   | 30s                | PPR-SLA-001 §3.2   |
| Compress PDF (5–20 MB)        | < 15s              | < 20s                   | 60s                | PPR-SLA-001 §3.2   |
| PDF-to-Image (< 10 halaman)   | < 5s               | < 10s                   | 30s                | PPR-SLA-001 §3.2   |
| PDF-to-Image (10–50 halaman)  | < 15s              | < 20s                   | 60s                | PPR-SLA-001 §3.2   |
| Image-to-PDF (server fallback)| < 8s               | < 13s                   | 30s                | PPR-SLA-001 §3.2   |
| Health check                   | < 200ms            | < 5s (cold)             | 10s                | PPR-SLA-001 §4     |

#### 5.1.2 Target Frontend Performance

| **Metrik**                     | **Target (Good)**  | **Acceptable**          | **Poor (Perlu Perbaikan)** |
|--------------------------------|--------------------|-------------------------|----------------------------|
| LCP                            | < 2.5s             | 2.5–4.0s                | > 4.0s                     |
| FID / INP                      | < 100ms / < 200ms  | 100–300ms / 200–500ms   | > 300ms / > 500ms          |
| CLS                            | < 0.1              | 0.1–0.25                | > 0.25                     |
| TTFB                           | < 800ms            | 800ms–1.5s              | > 1.5s                     |
| Lighthouse Performance Score   | > 90               | 70–90                   | < 70                       |

#### 5.1.3 Target Client-side Processing

| **Operasi**                    | **Target (Tipikal)** | **Batas Maksimum**      | **Catatan**                |
|--------------------------------|----------------------|-------------------------|----------------------------|
| Merge (< 5 file)              | < 2s                 | 5s                      | File < 5 MB total          |
| Split (< 30 halaman)          | < 1s                 | 3s                      | Output < 10 halaman        |
| Rotate (< 20 halaman)         | < 0.5s               | 2s                      | Operasi paling ringan      |
| Image-to-PDF (< 5 gambar)     | < 2s                 | 5s                      | Total < 3 MB               |

### 5.2 Availability Target

| **Metrik**                     | **Target**           | **Pengukuran**                                 |
|--------------------------------|----------------------|------------------------------------------------|
| Frontend Uptime                | > 99.9%              | Vercel status + synthetic monitoring           |
| Backend API Uptime             | > 99.0%              | Railway metrics + health check monitoring      |
| Successful Processing Rate     | > 95%                | (Completed tasks / Started tasks) × 100        |
| Error Rate (5xx)               | < 2%                 | Railway logs + error tracking                  |

### 5.3 Kapasitas Target

| **Metrik**                     | **Target v1.1.0**   | **Batas Infrastruktur**                        |
|--------------------------------|----------------------|------------------------------------------------|
| Concurrent Users               | 50                   | Railway Starter: ~100 concurrent connections   |
| Tasks per Minute               | 10                   | Rate limit: 10 req/min per IP                  |
| Daily Active Tasks             | 500                  | R2 Free: 10 GB/bulan storage                   |
| Max File Size                  | 20 MB                | Konfigurasi backend `MAX_UPLOAD_SIZE_MB`       |

---

## 6. Perbandingan Kompetitor

### 6.1 Metodologi Perbandingan

Perbandingan berikut didasarkan pada:
- Pengalaman penggunaan langsung dari lokasi Indonesia
- Data publik dari review dan benchmark pihak ketiga
- Analisis arsitektur yang diketahui dari masing-masing kompetitor
- Estimasi berdasarkan lokasi server dan model pemrosesan

> **Disclaimer:** Angka kompetitor adalah estimasi berdasarkan pengalaman pengguna dan bukan hasil benchmark formal yang terkontrol.

### 6.2 Perbandingan Waktu Compress PDF (1 MB, dari Indonesia)

| **Platform**       | **Estimasi Waktu** | **Server Location**     | **RTT dari Indonesia** | **Model Processing**        |
|--------------------|---------------------|-------------------------|------------------------|-----------------------------|
| **Papyr**          | ~3–5s               | US-West2 (Railway)      | ~200–300ms             | Server (Ghostscript)        |
| iLovePDF           | ~3–5s               | Barcelona, Spanyol      | ~300–400ms             | Server                      |
| SmallPDF           | ~4–6s               | Zurich, Swiss           | ~350–450ms             | Server                      |
| Adobe Acrobat      | ~3–5s               | Multi-region (CDN)      | ~150–250ms             | Server (Adobe engine)       |
| PDF24              | ~4–7s               | Berlin, Jerman          | ~300–400ms             | Server                      |

### 6.3 Perbandingan Waktu Merge PDF (5 file × 1 MB, dari Indonesia)

| **Platform**       | **Estimasi Waktu** | **Model Processing**    | **Upload Required**    | **Catatan**                 |
|--------------------|---------------------|-------------------------|------------------------|-----------------------------|
| **Papyr**          | **~1–2s**           | Client-side (pdf-lib)   | Tidak                  | Zero network latency        |
| iLovePDF           | ~5–8s               | Server-side             | Ya (5 MB upload)       | Upload + process + download |
| SmallPDF           | ~6–10s              | Server-side             | Ya (5 MB upload)       | Upload + process + download |
| Adobe Acrobat      | ~4–7s               | Server-side             | Ya (5 MB upload)       | Better CDN, masih upload    |
| PDF24              | ~5–9s               | Server-side             | Ya (5 MB upload)       | Upload + process + download |

### 6.4 Perbandingan Keseluruhan

| **Aspek**                  | **Papyr**              | **iLovePDF**           | **SmallPDF**           | **Adobe**              |
|----------------------------|------------------------|------------------------|------------------------|------------------------|
| Operasi client-side        | Merge, Split, Rotate, I2P | Tidak ada           | Tidak ada              | Tidak ada              |
| Latensi dari Indonesia     | Rendah (Edge + client) | Tinggi (EU server)     | Tinggi (EU server)     | Sedang (multi-CDN)     |
| Cold start                 | Ya (Railway idle)      | Tidak (always-on)      | Tidak (always-on)      | Tidak (always-on)      |
| Batas penggunaan gratis    | Tidak terbatas         | 2–3 operasi/hari       | 2 operasi/hari         | 1 operasi/30 hari      |
| Privasi (zero-upload)      | Ya (4 dari 6 tool)     | Tidak                  | Tidak                  | Tidak                  |
| Waktu total (tipikal)      | 1–5s (client) / 3–15s (server) | 3–10s         | 4–12s                  | 3–8s                   |

### 6.5 Keunggulan Kompetitif Papyr

1. **Client-side processing** — 4 dari 6 tool tidak memerlukan upload sama sekali, mengeliminasi latensi jaringan dan risiko privasi.
2. **Vercel Edge Network** — Frontend di-serve dari edge node terdekat (Singapore/Jakarta), memberikan TTFB < 100ms untuk halaman statis.
3. **Tanpa batas penggunaan** — Tidak ada throttling atau paywall yang memperlambat workflow pengguna.
4. **Cloudflare R2 download** — File hasil diunduh melalui Cloudflare CDN global, bukan langsung dari server origin.

### 6.6 Kelemahan Kompetitif Papyr

1. **Cold start** — Railway container idle setelah 15 menit, menambah 2–5 detik untuk request pertama.
2. **Single server region** — Railway US-West2 memberikan RTT ~200–300ms dari Indonesia (vs multi-region kompetitor enterprise).
3. **Tidak ada queue system** — Operasi berat diproses synchronous, rentan timeout pada file sangat besar.
4. **Resource terbatas** — Railway Starter tier memiliki batasan CPU dan memory yang mempengaruhi throughput.

---

## 7. Analisis Bottleneck

### 7.1 Identifikasi Bottleneck

| **#** | **Bottleneck**                          | **Layer**    | **Impact**                | **Severity** | **Frekuensi**        |
|-------|------------------------------------------|--------------|---------------------------|--------------|----------------------|
| B-01  | Railway US-West2 latency                | Network      | +200–300ms per request    | Medium       | Setiap request       |
| B-02  | Railway cold start                       | Infrastructure | +2–5s setelah idle     | High         | Setelah 15 min idle  |
| B-03  | Ghostscript subprocess spawn             | Backend      | +200–500ms per compress   | Low          | Setiap compress      |
| B-04  | File upload ke Railway (dari Indonesia)  | Network      | +0.4–7s tergantung size   | High         | Setiap server op     |
| B-05  | Browser memory limit (mobile)            | Client       | Crash/lag pada file besar | Medium       | File > 10 MB client  |
| B-06  | R2 signed URL generation                 | Backend      | +50–100ms per download    | Low          | Setiap download      |
| B-07  | PyMuPDF rendering (high DPI)             | Backend      | +1–3s per 10 halaman      | Medium       | PDF-to-Image         |
| B-08  | TLS handshake (first connection)         | Network      | +100–200ms                | Low          | First request only   |

### 7.2 Analisis Detail

#### 7.2.1 B-01: Railway US-West2 Latency

**Deskripsi:** Railway saat ini hanya menyediakan region US-West2 (Oregon) untuk container deployment. Pengguna Indonesia mengalami Round Trip Time (RTT) ~200–300ms untuk setiap HTTP request ke backend.

**Impact breakdown:**
- DNS resolution: ~20–50ms (cached setelah pertama)
- TCP handshake: ~200–300ms (1 RTT)
- TLS handshake: ~400–600ms (2 RTT)
- HTTP request/response: ~200–300ms (1 RTT)
- **Total first request:** ~800–1,200ms overhead sebelum processing dimulai

**Mitigasi saat ini:**
- HTTP/2 connection reuse (mengurangi handshake berulang)
- Cloudflare R2 untuk download (edge-cached, bukan dari Railway)

#### 7.2.2 B-02: Railway Cold Start

**Deskripsi:** Container Railway masuk ke sleep mode setelah ~15 menit tanpa traffic (pada Starter tier). Cold start memerlukan boot ulang container, load Python runtime, dan inisialisasi FastAPI.

**Impact breakdown:**
- Container boot: ~1–2s
- Python runtime initialization: ~0.5–1s
- FastAPI startup + dependency load: ~0.5–1s
- Ghostscript availability check: ~0.2–0.5s
- **Total cold start:** ~2–5s tambahan

**Mitigasi saat ini:**
- Health check endpoint untuk keep-alive (belum diimplementasi sebagai cron)
- Pengguna melihat loading state selama cold start

#### 7.2.3 B-04: File Upload dari Indonesia

**Deskripsi:** Upload file dari pengguna Indonesia ke Railway US-West2 dibatasi oleh bandwidth uplink (umumnya lebih rendah dari downlink pada koneksi mobile) dan jarak geografis.

**Impact per ukuran file (4G, 25 Mbps effective):**

| **Ukuran** | **Waktu Upload Teoritis** | **Waktu Upload Aktual (estimasi)** | **Overhead**        |
|------------|---------------------------|------------------------------------|---------------------|
| 1 MB       | 0.32s                     | ~0.5s                              | +56% (TCP, TLS)     |
| 5 MB       | 1.6s                      | ~2.0s                              | +25%                |
| 10 MB      | 3.2s                      | ~4.0s                              | +25%                |
| 20 MB      | 6.4s                      | ~8.0s                              | +25%                |

#### 7.2.4 B-05: Browser Memory Limit (Mobile)

**Deskripsi:** Perangkat mobile Android mid-range (4GB RAM) memiliki batasan memory yang dialokasikan untuk tab browser (~512MB–1GB). Operasi pdf-lib pada file besar dapat menyebabkan Out of Memory atau lag signifikan.

**Threshold estimasi:**
- Aman: File < 5 MB, < 50 halaman
- Risiko lag: File 5–10 MB, 50–100 halaman
- Risiko crash: File > 10 MB, > 100 halaman (pada perangkat low-end)

**Mitigasi saat ini:**
- Batas upload 20 MB (konfigurasi)
- Fallback ke server untuk Image-to-PDF > 3 MB

### 7.3 Waterfall Analysis (Compress PDF 1 MB, dari Jakarta)

```
Timeline (estimasi):
├── [0ms – 50ms]      DNS Resolution (cached)
├── [50ms – 350ms]    TCP + TLS Handshake (Railway US-West2)
├── [350ms – 850ms]   File Upload (1 MB @ 25 Mbps + overhead)
├── [850ms – 1050ms]  Request parsing + validation
├── [1050ms – 1250ms] Ghostscript subprocess spawn
├── [1250ms – 2750ms] Ghostscript compression processing
├── [2750ms – 3050ms] Result upload to R2
├── [3050ms – 3150ms] Signed URL generation
├── [3150ms – 3250ms] Response to client
├── [3250ms – 3550ms] Client initiates download from R2
├── [3550ms – 3850ms] Download compressed file (< 1 MB)
└── [3850ms]          ✓ Complete
        
Total estimasi: ~3.5–4.5s (warm container)
Total estimasi: ~6–9s (cold start)
```

---

## 8. Rekomendasi Optimasi

### 8.1 Prioritas Tinggi (Quick Wins)

| **#** | **Rekomendasi**                          | **Impact**           | **Effort**  | **Bottleneck Addressed** |
|-------|------------------------------------------|----------------------|-------------|--------------------------|
| O-01  | Implementasi keep-alive cron job         | Eliminasi cold start | Rendah      | B-02                     |
| O-02  | Web Workers untuk client-side processing | UI tidak freeze      | Sedang      | B-05                     |
| O-03  | Streaming upload (chunked transfer)      | Progress feedback    | Sedang      | B-04                     |
| O-04  | Preconnect hint ke Railway domain        | -200ms first request | Rendah      | B-01, B-08               |

#### O-01: Keep-alive Cron Job

**Implementasi:**
- Cron job setiap 10 menit yang hit `GET /health` endpoint
- Menggunakan layanan gratis (UptimeRobot, cron-job.org, atau Vercel Cron)
- Menjaga container Railway tetap warm 24/7

**Estimasi impact:** Mengeliminasi 2–5 detik cold start untuk 100% pengguna.

#### O-02: Web Workers untuk Client-side Processing

**Implementasi:**
- Memindahkan operasi pdf-lib ke Web Worker thread
- Main thread tetap responsif (UI tidak freeze)
- Progress reporting via `postMessage`

**Estimasi impact:** INP turun dari ~300ms menjadi < 100ms selama processing.

#### O-03: Streaming Upload

**Implementasi:**
- Menggunakan `fetch` dengan `ReadableStream` body
- Progress bar real-time berdasarkan bytes uploaded
- Retry logic untuk chunk yang gagal

**Estimasi impact:** UX improvement (progress visibility), bukan speed improvement.

#### O-04: Preconnect Hint

**Implementasi:**
```html
<link rel="preconnect" href="https://papyr-production.up.railway.app" />
<link rel="dns-prefetch" href="https://papyr-production.up.railway.app" />
```

**Estimasi impact:** Mengurangi ~200–400ms pada first API request (DNS + TCP + TLS dilakukan lebih awal).

### 8.2 Prioritas Sedang (Medium-term)

| **#** | **Rekomendasi**                          | **Impact**           | **Effort**  | **Bottleneck Addressed** |
|-------|------------------------------------------|----------------------|-------------|--------------------------|
| O-05  | Railway Asia region (saat tersedia)      | -150ms RTT           | Rendah      | B-01                     |
| O-06  | Response streaming (SSE/WebSocket)       | Perceived speed      | Tinggi      | B-04                     |
| O-07  | Image optimization sebelum upload        | Reduce upload size   | Sedang      | B-04                     |
| O-08  | PDF.js untuk preview (lazy load)         | Reduce initial load  | Sedang      | Frontend LCP             |

#### O-05: Railway Asia Region

**Status:** Railway saat ini belum menyediakan region Asia. Ketika tersedia (diperkirakan 2025–2026), migrasi ke region Singapore atau Tokyo akan mengurangi RTT dari ~200–300ms menjadi ~50–100ms.

**Estimasi impact:** Pengurangan 150–200ms per request, total saving ~1–2s per operasi server-side.

#### O-06: Response Streaming

**Implementasi:**
- Server-Sent Events (SSE) untuk progress update selama processing
- Status: "Uploading..." → "Processing..." → "Generating download link..." → "Complete"
- Mengurangi perceived wait time meskipun actual time sama

#### O-07: Client-side Image Optimization

**Implementasi:**
- Resize gambar besar sebelum upload (max 2000px width)
- Compress JPEG quality ke 85% sebelum kirim ke server
- Mengurangi ukuran upload 30–60% untuk Image-to-PDF

### 8.3 Prioritas Rendah (Long-term / Aspirational)

| **#** | **Rekomendasi**                          | **Impact**           | **Effort**  | **Bottleneck Addressed** |
|-------|------------------------------------------|----------------------|-------------|--------------------------|
| O-09  | WebAssembly Ghostscript                  | Eliminasi server roundtrip | Sangat Tinggi | B-01, B-02, B-04    |
| O-10  | Service Worker caching                   | Offline-capable      | Sedang      | Frontend performance     |
| O-11  | Edge Functions untuk processing ringan   | Reduce latency       | Tinggi      | B-01                     |
| O-12  | CDN-level caching untuk file populer     | Reduce R2 reads      | Sedang      | B-06                     |

#### O-09: WebAssembly Ghostscript

**Deskripsi:** Mengkompilasi Ghostscript ke WebAssembly dan menjalankannya di browser pengguna. Ini akan mengeliminasi kebutuhan upload file ke server untuk operasi compress.

**Tantangan:**
- Ghostscript WASM binary size (~10–20 MB) — terlalu besar untuk initial load
- Memory requirement tinggi (~256 MB minimum)
- Belum ada implementasi production-ready yang stabil
- Performa WASM ~2–5× lebih lambat dari native

**Timeline:** Evaluasi ulang ketika Ghostscript WASM matang (estimasi 2026–2027).

### 8.4 Roadmap Implementasi Optimasi

| **Fase** | **Timeline**     | **Optimasi**                    | **Expected Impact**                        |
|----------|------------------|---------------------------------|--------------------------------------------|
| Fase 1   | Juli 2025        | O-01 (keep-alive), O-04 (preconnect) | Eliminasi cold start, -200ms first req |
| Fase 5   | Agustus 2025     | O-02 (Web Workers), O-03 (streaming) | UI responsif, progress visibility      |
| Fase 6   | Q4 2025          | O-05 (Asia region), O-07 (image opt) | -150ms RTT, -30% upload size           |
| Fase 7   | 2026             | O-06 (SSE), O-08 (lazy load)   | Perceived speed improvement                |
| Fase 8   | 2026–2027        | O-09 (WASM), O-10 (SW), O-11 (Edge) | Transformational performance gain      |

---

## 9. Rencana Benchmark Formal

### 9.1 Tujuan

Benchmark formal bertujuan untuk:
1. **Validasi** estimasi baseline yang tercantum dalam dokumen ini
2. **Identifikasi** bottleneck aktual yang mungkin tidak terdeteksi dari analisis arsitektur
3. **Baseline** yang terukur untuk tracking improvement setelah optimasi
4. **Compliance** dengan target SLA (PPR-SLA-001)

### 9.2 Timeline Pelaksanaan

| **Fase**           | **Timeline**     | **Scope**                                          | **Deliverable**                          |
|--------------------|------------------|----------------------------------------------------|------------------------------------------|
| Persiapan          | Juli 2025        | Setup tool, buat test scripts, siapkan file sampel | Benchmark automation suite               |
| Frontend Benchmark | Juli 2025        | Lighthouse CI, WebPageTest dari Jakarta            | Frontend performance report              |
| API Benchmark      | Agustus 2025     | k6 load test, endpoint profiling                   | API performance report                   |
| Client-side Bench  | Agustus 2025     | Custom scripts, berbagai perangkat                 | Client processing report                 |
| E2E Benchmark      | September 2025   | Full user journey dari Jakarta                     | End-to-end performance report            |
| Analisis & Report  | September 2025   | Compile results, update dokumen ini                | PPR-PB-001 v2.0 (validated)              |

### 9.3 Prosedur Benchmark

#### 9.3.1 Frontend Benchmark

```bash
# Lighthouse CI (automated)
lhci autorun --config=lighthouserc.json

# WebPageTest (dari Jakarta)
# URL: webpagetest.org
# Location: Asia > Jakarta, Indonesia
# Connection: 4G (9 Mbps, 170ms RTT)
# Runs: 5 (median)
# Pages: /, /compress, /merge, /split, /rotate, /image-to-pdf, /pdf-to-image
```

#### 9.3.2 API Load Test (k6)

```javascript
// k6 script outline
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 5 },   // Ramp up
    { duration: '3m', target: 10 },  // Sustained load
    { duration: '1m', target: 20 },  // Peak load
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<15000'], // 95% < 15s
    http_req_failed: ['rate<0.05'],     // Error rate < 5%
  },
};

export default function () {
  // Test compress endpoint with 1MB sample
  const file = open('./samples/sample-1mb.pdf', 'b');
  const res = http.post('https://papyr-production.up.railway.app/api/compress', {
    file: http.file(file, 'test.pdf'),
  });
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
```

#### 9.3.3 Client-side Benchmark Script

```javascript
// Browser console benchmark
async function benchmarkMerge(fileCount, fileSizeMB) {
  const files = generateSamplePDFs(fileCount, fileSizeMB);
  
  const start = performance.now();
  const result = await mergePDFs(files);
  const end = performance.now();
  
  console.log(`Merge ${fileCount} × ${fileSizeMB}MB: ${(end - start).toFixed(0)}ms`);
  console.log(`Memory: ${performance.memory?.usedJSHeapSize / 1024 / 1024}MB`);
  
  return { time: end - start, outputSize: result.size };
}

// Run benchmark suite
const results = [];
results.push(await benchmarkMerge(3, 0.5));
results.push(await benchmarkMerge(5, 1));
results.push(await benchmarkMerge(10, 1));
```

### 9.4 Kriteria Keberhasilan

Benchmark formal dianggap berhasil jika:

| **Kriteria**                       | **Threshold**                                      |
|------------------------------------|----------------------------------------------------|
| Semua skenario dijalankan          | 100% skenario SC-001 sampai SC-008 tereksekusi     |
| Variance antar run                 | < 20% (menunjukkan hasil reproducible)             |
| Data dari lokasi Indonesia         | Minimal 1 lokasi (Jakarta) dengan 5+ runs          |
| Coverage perangkat                 | Minimal 1 mobile + 1 desktop                       |
| Dokumentasi lengkap                | Setiap hasil disertai metadata environment          |

### 9.5 Reporting Format

Hasil benchmark formal akan didokumentasikan dalam format:

```markdown
## Hasil Benchmark [Tanggal]

### Environment
- Lokasi: Jakarta, Indonesia
- Koneksi: [4G/WiFi] — [speed test result]
- Perangkat: [model, RAM, OS]
- Browser: [name, version]
- Backend status: [warm/cold]

### Hasil
| Skenario | Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Median | p95 |
|----------|-------|-------|-------|-------|-------|--------|-----|
| SC-001   | ...   | ...   | ...   | ...   | ...   | ...    | ... |

### Temuan
- [Temuan 1]
- [Temuan 2]

### Rekomendasi
- [Rekomendasi berdasarkan hasil aktual]
```

---

## 10. Referensi Silang

### 10.1 Mapping ke Dokumen Terkait

| **Aspek Benchmark**                | **Dokumen Referensi**  | **Bagian Relevan**                              |
|------------------------------------|------------------------|-------------------------------------------------|
| Target waktu respons API           | PPR-SLA-001            | §3 Metrik Tingkat Layanan                       |
| Arsitektur processing strategy     | PPR-TDD-001            | §2 Arsitektur Sistem, §7 Performa & Skalabilitas |
| Non-functional requirements        | PPR-SRS-001            | NFR section (performance, scalability)          |
| Perbandingan kompetitor            | PPR-CA-001             | §3 Profil Kompetitor, §5 Perbandingan          |
| Infrastruktur dan deployment       | PPR-DR-001             | §2 Arsitektur Deployment                        |
| Batasan kapasitas tier gratis      | PPR-CP-001             | §3 Biaya Infrastruktur, §5 Scaling Plan        |
| Keputusan arsitektur               | PPR-ADR-001            | ADR-001 (client vs server), ADR-003 (Railway)  |

### 10.2 NFR Targets (dari PPR-SRS-001)

| **NFR ID** | **Requirement**                                    | **Target**           | **Status Benchmark**  |
|------------|----------------------------------------------------|----------------------|-----------------------|
| NFR-01     | Waktu respons API (compress)                       | < 30s                | Estimasi: 3–15s ✓     |
| NFR-02     | Waktu respons API (operasi ringan)                 | < 500ms              | Estimasi: < 200ms ✓   |
| NFR-03     | Frontend LCP                                       | < 2.5s               | Belum diukur          |
| NFR-04     | Client-side processing (tipikal)                   | < 3s                 | Estimasi: 0.5–2s ✓    |
| NFR-05     | Concurrent users support                           | 50+                  | Belum diuji           |
| NFR-06     | Error rate                                         | < 5%                 | Belum diukur          |
| NFR-07     | Availability                                       | > 99%                | Belum diukur          |

### 10.3 Traceability Matrix

| **Benchmark Metric**               | **SLA Target**         | **Baseline Estimasi**  | **Gap Analysis**                        |
|------------------------------------|------------------------|------------------------|-----------------------------------------|
| Compress 1 MB (warm)              | < 30s                  | ~3–5s                  | Memenuhi target dengan margin besar     |
| Compress 10 MB (warm)             | < 60s                  | ~8–15s                 | Memenuhi target dengan margin besar     |
| Compress 1 MB (cold)              | < 30s                  | ~6–9s                  | Memenuhi target, perlu optimasi UX      |
| Merge 5 PDF (client)             | < 3s                   | ~1–2s                  | Memenuhi target                         |
| Split PDF (client)               | < 3s                   | ~0.5–1s                | Memenuhi target dengan margin besar     |
| PDF-to-Image 5 pages             | < 30s                  | ~3–5s                  | Memenuhi target                         |
| Frontend LCP                      | < 2.5s                 | Belum diukur           | Perlu benchmark formal                  |
| API Error Rate                    | < 5%                   | Belum diukur           | Perlu monitoring aktif                  |

---

## 11. Persetujuan Dokumen

### 11.1 Tanda Tangan Persetujuan

| **Peran**                | **Nama**                       | **Tanggal**  | **Status**   |
|--------------------------|--------------------------------|--------------|--------------|
| Product Owner            | Muhammad Fa'iz Zulfikar        | Juni 2025    | Approved     |
| AI Agent                 | OpenCode/Sisyphus              | Juni 2025    | Approved     |

### 11.2 Catatan Persetujuan

Dokumen ini disetujui sebagai **framework benchmark** dan **baseline estimasi** untuk Papyr v1.1.0. Seluruh angka estimasi dalam dokumen ini akan divalidasi melalui benchmark formal yang dijadwalkan pada Q3 2025 (lihat Bagian 9). Dokumen akan diperbarui ke versi 2.0 setelah hasil benchmark formal tersedia.

**Ketentuan persetujuan:**
- Estimasi baseline bersifat indikatif dan bukan komitmen performa.
- Target performa (Bagian 5) bersifat aspirasional dan akan disesuaikan berdasarkan hasil aktual.
- Rekomendasi optimasi (Bagian 8) akan diprioritaskan berdasarkan hasil benchmark formal.
- Dokumen ini akan ditinjau ulang setiap kali ada perubahan signifikan pada arsitektur atau infrastruktur.

---

*Dokumen ini bersifat rahasia dan hanya untuk penggunaan internal serta keperluan investor. Distribusi tanpa izin tertulis dari Product Owner dilarang.*

**© 2025 Papyr (mypapyr.com). All rights reserved.**
