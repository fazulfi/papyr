**Papyr**

*Tool PDF gratis, cepat, dan aman untuk Indonesia.*

**Analytics Event Taxonomy**

Version 1.0

Mei 2026

**CONFIDENTIAL**

mypapyr.com

---

**Informasi Dokumen**

|                     |                                              |
|---------------------|----------------------------------------------|
| **Judul Dokumen**   | Analytics Event Taxonomy — Papyr             |
| **ID Dokumen**      | PPR-AET-001                                  |
| **Versi**           | 1.0                                          |
| **Status**          | Approved                                     |
| **Tanggal Dibuat**  | Mei 2026                                     |
| **Terakhir Diubah** | Mei 2026                                     |
| **Penulis**         | Muhammad Fa'iz Zulfikar                      |
| **Ditinjau Oleh**   | Product Owner                                |
| **Disetujui Oleh**  | Product Owner                                |
| **Kerahasiaan**     | Confidential — Internal & Investor Use Only  |

**Riwayat Versi**

| **Versi** | **Tanggal** | **Penulis**                  | **Deskripsi**                                                                      |
|-----------|-------------|------------------------------|------------------------------------------------------------------------------------|
| 1.0       | Mei 2026    | Muhammad Fa'iz Zulfikar      | Draft awal — Taxonomy lengkap untuk event analytics Fase 1 + proposed future events |

---

## Daftar Isi

1. [Overview](#1-overview)
2. [Platform Analytics](#2-platform-analytics)
3. [Konvensi Penamaan Event](#3-konvensi-penamaan-event)
4. [Kategori Event](#4-kategori-event)
5. [Katalog Event — Task Lifecycle (Frontend)](#5-katalog-event--task-lifecycle-frontend)
6. [Katalog Event — Backend Operations](#6-katalog-event--backend-operations)
7. [Katalog Event — File Operations (Planned)](#7-katalog-event--file-operations-planned)
8. [Katalog Event — Navigation & Engagement (Planned)](#8-katalog-event--navigation--engagement-planned)
9. [Katalog Event — Error & Recovery (Planned)](#9-katalog-event--error--recovery-planned)
10. [Katalog Event — Monetization (Planned)](#10-katalog-event--monetization-planned)
11. [Katalog Event — User Preferences (Planned)](#11-katalog-event--user-preferences-planned)
12. [Katalog Event — Performance & Infrastructure (Planned)](#12-katalog-event--performance--infrastructure-planned)
13. [Diagram Alur Data](#13-diagram-alur-data)
14. [Pertimbangan Privasi](#14-pertimbangan-privasi)
15. [Roadmap Implementasi](#15-roadmap-implementasi)
16. [Persetujuan Dokumen](#16-persetujuan-dokumen)

---

## 1. Overview

### 1.1 Tujuan Dokumen

Dokumen ini mendefinisikan taxonomy lengkap untuk seluruh analytics event yang digunakan dan direncanakan dalam ekosistem Papyr. Taxonomy ini berfungsi sebagai:

- **Single source of truth** untuk semua event yang di-track di frontend dan backend.
- **Panduan implementasi** bagi developer saat menambahkan event baru.
- **Referensi analisis** bagi Product Owner untuk memahami data yang tersedia.
- **Dokumentasi kepatuhan** untuk memastikan tidak ada data sensitif yang di-track.

### 1.2 Cakupan

Dokumen ini mencakup:

- **Event yang sudah diimplementasikan** (Fase 1) — task lifecycle events di frontend via Vercel Analytics dan structured log events di backend.
- **Event yang direncanakan** (Fase 2+) — file operations, navigation, engagement, monetization, dan performance events.

### 1.3 Prinsip Analytics Papyr

| **#** | **Prinsip**                        | **Deskripsi**                                                                                     |
|-------|------------------------------------|---------------------------------------------------------------------------------------------------|
| 1     | Privacy-First                      | Tidak pernah melacak data pribadi, konten file, atau nama file asli pengguna.                     |
| 2     | No Cookies                         | Menggunakan Vercel Analytics yang privacy-friendly tanpa cookies.                                 |
| 3     | Actionable Data Only               | Hanya melacak event yang menghasilkan insight untuk perbaikan produk.                             |
| 4     | Minimal Footprint                  | Tidak menambah beban performa — analytics harus ringan dan non-blocking.                          |
| 5     | Structured & Consistent            | Semua event mengikuti konvensi penamaan dan struktur properti yang konsisten.                     |
| 6     | Compliance-Ready                   | Siap untuk kepatuhan UU PDP (UU No. 27/2022) dan GDPR awareness.                                |
---

## 2. Platform Analytics

### 2.1 Stack Analytics Saat Ini

| **Layer**   | **Platform**              | **Tujuan**                                                    | **Status**    |
|-------------|---------------------------|---------------------------------------------------------------|---------------|
| Frontend    | Vercel Analytics          | Custom event tracking (task lifecycle), page views, Web Vitals | Implemented   |
| Frontend    | Vercel Speed Insights     | Core Web Vitals monitoring (LCP, FID, CLS)                    | Implemented   |
| Backend     | Structured JSON Logs      | Task events, cleanup events, error tracking                   | Implemented   |
| Backend     | Railway Dashboard         | Container metrics, uptime, resource usage                     | Implemented   |
| Monitoring  | UptimeRobot / BetterStack | Endpoint uptime monitoring (/health)                          | Implemented   |

### 2.2 Stack Analytics Masa Depan (Planned)

| **Layer**   | **Platform**              | **Tujuan**                                                    | **Status**    |
|-------------|---------------------------|---------------------------------------------------------------|---------------|
| Frontend    | Plausible Analytics       | Privacy-friendly web analytics (alternatif/pelengkap Vercel) — Superseded oleh ADR-008, digantikan Vercel Analytics | Planned (superseded) |
| Backend     | Sentry                    | Error tracking & performance monitoring                       | Planned       |
| Data        | Supabase (PostgreSQL)     | Event storage untuk analisis historis                          | Planned       |
| Dashboard   | Metabase / Grafana        | Visualisasi metrik bisnis                                     | Planned       |

### 2.3 Konfigurasi Vercel Analytics

```typescript
// frontend/src/lib/analytics.ts
import { track } from "@vercel/analytics";

// Event dikirim via track() function
// Privacy: no cookies, no PII, GDPR-compliant by default
// Retention: 30 hari di Vercel dashboard
// Limit: 10 custom events per page view (Vercel Free Tier)
```

### 2.4 Konfigurasi Backend Logging

```python
# backend/utils/logging_config.py
# Format: JSON structured logs ke stdout
# Platform: Railway mengumpulkan stdout sebagai log entries
# Retention: 7 hari di Railway dashboard (Free/Starter plan)
# Privacy: TIDAK BOLEH log file names, file contents, user IPs
```

---

## 3. Konvensi Penamaan Event

### 3.1 Format Nama Event

```
{object}_{action}
```

**Aturan:**

| **Aturan**                | **Contoh Benar**          | **Contoh Salah**          |
|---------------------------|---------------------------|---------------------------|
| Gunakan snake_case        | `task_started`            | `taskStarted`, `TaskStarted` |
| Object di depan           | `file_uploaded`           | `uploaded_file`           |
| Action dalam past tense   | `task_completed`          | `task_complete`           |
| Maksimal 3 kata           | `pro_upgrade_clicked`     | `user_clicked_pro_upgrade_button` |
| Bahasa Inggris            | `task_failed`             | `task_gagal`              |
| Lowercase semua           | `download_started`        | `Download_Started`        |

### 3.2 Format Properti Event

```
{category}_{descriptor}
```

**Aturan:**

| **Aturan**                | **Contoh Benar**          | **Contoh Salah**          |
|---------------------------|---------------------------|---------------------------|
| Gunakan snake_case        | `device_category`         | `deviceCategory`          |
| Deskriptif dan singkat    | `file_size_bytes`         | `size`                    |
| Tipe data konsisten       | `duration_ms: 1234`       | `duration: "1.2s"`        |
| Enum dalam lowercase      | `tool: "compress"`        | `tool: "Compress PDF"`    |
| Boolean tanpa prefix      | `success: true`           | `is_success: true`        |

### 3.3 Nilai Enum Standar

**Tool Names:**

| **Enum Value**    | **Deskripsi**                |
|-------------------|------------------------------|
| `compress`        | Compress PDF                 |
| `merge`           | Merge PDF                    |
| `split`           | Split PDF                    |
| `rotate`          | Rotate PDF                   |
| `image-to-pdf`    | Image to PDF                 |
| `pdf-to-image`    | PDF to Image                 |
| `protect`         | Protect PDF (Planned)        |
| `unlock`          | Unlock PDF (Planned)         |
| `watermark`       | Watermark PDF (Planned)      |
| `sign`            | Sign PDF (Planned)           |
| `pdf-to-word`     | PDF to Word (Planned)        |
| `ocr`             | OCR (Planned)                |

**Device Categories:**

| **Enum Value**    | **Kriteria**                 |
|-------------------|------------------------------|
| `mobile`          | viewport width < 768px       |
| `tablet`          | viewport width 768-1023px    |
| `desktop`         | viewport width >= 1024px     |

**Size Buckets:**

| **Enum Value**    | **Kriteria**                 |
|-------------------|------------------------------|
| `small`           | < 1 MB                       |
| `medium`          | 1 MB - 10 MB                |
| `large`           | > 10 MB                      |

**Processing Types:**

| **Enum Value**    | **Deskripsi**                |
|-------------------|------------------------------|
| `client`          | Diproses di browser          |
| `server`          | Diproses di backend          |
| `hybrid`          | Client dengan server fallback|

---

## 4. Kategori Event

| **Kategori**                  | **Prefix**      | **Deskripsi**                                                    | **Layer**       | **Status**    |
|-------------------------------|-----------------|------------------------------------------------------------------|-----------------|---------------|
| Task Lifecycle                | `task_`         | Siklus hidup operasi PDF (mulai, selesai, gagal)                 | Frontend        | Implemented   |
| Backend Operations            | `cleanup_`      | Operasi maintenance server (cleanup, health check)               | Backend         | Implemented   |
| File Operations               | `file_`, `download_` | Upload, download, dan manipulasi file                       | Frontend + Backend | Planned    |
| Navigation & Engagement       | `page_`, `tool_`| Navigasi halaman dan interaksi pengguna                          | Frontend        | Planned       |
| Error & Recovery              | `error_`, `retry_` | Error yang ditampilkan dan mekanisme recovery                | Frontend        | Planned       |
| Monetization                  | `pro_`          | Interaksi dengan fitur premium dan upgrade flow                  | Frontend        | Planned       |
| User Preferences              | `preference_`   | Pengaturan dan preferensi pengguna                               | Frontend        | Planned       |
| Performance & Infrastructure  | `perf_`         | Metrik performa dan kesehatan infrastruktur                      | Backend         | Planned       |

---

## 5. Katalog Event — Task Lifecycle (Frontend)

**Status: IMPLEMENTED**

Kategori ini mencakup seluruh siklus hidup operasi PDF yang dilakukan pengguna. Diimplementasikan di `frontend/src/lib/analytics.ts` menggunakan Vercel Analytics `track()` function.

### 5.1 task_started

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `task_started`                                                                                |
| **Kategori**        | Task Lifecycle                                                                                |
| **Deskripsi**       | Dipicu saat pengguna memulai operasi PDF (klik tombol proses/compress/merge/dll).             |
| **Trigger**         | Pengguna mengklik tombol aksi utama pada halaman tool setelah file di-upload.                 |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Frontend (Vercel Analytics)                                                                   |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**        |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------|
| `tool`              | string (enum)   | Ya        | Nama tool yang digunakan                   | `"compress"`      |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat pengguna                | `"mobile"`        |

**Implementasi:**

```typescript
export function trackTaskStarted(tool: ToolName) {
  track("task_started", { tool, device_category: getDeviceCategory() });
}
```

---

### 5.2 task_completed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `task_completed`                                                                              |
| **Kategori**        | Task Lifecycle                                                                                |
| **Deskripsi**       | Dipicu saat operasi PDF berhasil diselesaikan dan file hasil siap di-download.                |
| **Trigger**         | Proses selesai tanpa error — file hasil tersedia (client-side) atau signed URL siap (server). |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Frontend (Vercel Analytics)                                                                   |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**        |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------|
| `tool`              | string (enum)   | Ya        | Nama tool yang digunakan                   | `"merge"`         |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat pengguna                | `"desktop"`       |

**Implementasi:**

```typescript
export function trackTaskCompleted(tool: ToolName) {
  track("task_completed", { tool, device_category: getDeviceCategory() });
}
```

---

### 5.3 task_failed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `task_failed`                                                                                 |
| **Kategori**        | Task Lifecycle                                                                                |
| **Deskripsi**       | Dipicu saat operasi PDF gagal setelah semua retry habis.                                      |
| **Trigger**         | Error terjadi dan auto-retry (1x) juga gagal, atau error non-retryable.                      |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Frontend (Vercel Analytics)                                                                   |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                    |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------|
| `tool`              | string (enum)   | Ya        | Nama tool yang digunakan                   | `"compress"`                  |
| `error`             | string          | Ya        | Pesan error (dipotong maks 200 karakter)   | `"File terlalu besar"`        |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat pengguna                | `"mobile"`                    |

**Implementasi:**

```typescript
export function trackTaskFailed(tool: ToolName, error: string) {
  track("task_failed", {
    tool,
    error: error.slice(0, 200),
    device_category: getDeviceCategory(),
  });
}
```
---

## 6. Katalog Event — Backend Operations

**Status: IMPLEMENTED**

Kategori ini mencakup event operasional backend yang dicatat sebagai structured JSON logs. Diimplementasikan di `backend/utils/cleanup.py` dan `backend/utils/logging_config.py`.

### 6.1 cleanup_started

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `cleanup_started`                                                                             |
| **Kategori**        | Backend Operations                                                                            |
| **Deskripsi**       | Dipicu saat cron job cleanup mulai berjalan untuk menghapus file expired di R2.               |
| **Trigger**         | Setiap 30 menit via asyncio background task.                                                  |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Backend (Structured Logs / Railway)                                                           |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"cleanup_started"`                 |
| `timestamp`         | string (ISO)    | Ya        | Waktu event dalam UTC                      | `"2026-05-03T10:30:00+00:00"`      |

**Contoh Log Output:**

```json
{
  "timestamp": "2026-05-03T10:30:00+00:00",
  "level": "INFO",
  "logger": "utils.cleanup",
  "message": "cleanup_started",
  "event": "cleanup_started"
}
```

---

### 6.2 cleanup_success

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `cleanup_success`                                                                             |
| **Kategori**        | Backend Operations                                                                            |
| **Deskripsi**       | Dipicu saat cleanup berhasil menghapus semua file expired tanpa kegagalan.                    |
| **Trigger**         | Semua objek expired berhasil dihapus dari R2 (failed == 0).                                   |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Backend (Structured Logs / Railway)                                                           |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"cleanup_success"`                 |
| `scanned`           | integer         | Ya        | Jumlah objek expired yang ditemukan        | `12`                                |
| `deleted`           | integer         | Ya        | Jumlah objek yang berhasil dihapus         | `12`                                |
| `duration_ms`       | integer         | Ya        | Durasi proses cleanup dalam milidetik      | `3456`                              |
| `timestamp`         | string (ISO)    | Ya        | Waktu event dalam UTC                      | `"2026-05-03T11:00:03+00:00"`      |

**Contoh Log Output:**

```json
{
  "timestamp": "2026-05-03T11:00:03+00:00",
  "level": "INFO",
  "logger": "utils.cleanup",
  "message": "cleanup_success",
  "event": "cleanup_success",
  "scanned": 12,
  "deleted": 12,
  "duration_ms": 3456
}
```

---

### 6.3 cleanup_failure

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `cleanup_failure`                                                                             |
| **Kategori**        | Backend Operations                                                                            |
| **Deskripsi**       | Dipicu saat cleanup selesai tetapi ada satu atau lebih file yang gagal dihapus.               |
| **Trigger**         | Satu atau lebih delete_object gagal (failed > 0).                                             |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Backend (Structured Logs / Railway)                                                           |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"cleanup_failure"`                 |
| `scanned`           | integer         | Ya        | Jumlah objek expired yang ditemukan        | `15`                                |
| `deleted`           | integer         | Ya        | Jumlah objek yang berhasil dihapus         | `13`                                |
| `failed`            | integer         | Ya        | Jumlah objek yang gagal dihapus            | `2`                                 |
| `duration_ms`       | integer         | Ya        | Durasi proses cleanup dalam milidetik      | `5678`                              |
| `timestamp`         | string (ISO)    | Ya        | Waktu event dalam UTC                      | `"2026-05-03T11:00:05+00:00"`      |

**Contoh Log Output:**

```json
{
  "timestamp": "2026-05-03T11:00:05+00:00",
  "level": "WARNING",
  "logger": "utils.cleanup",
  "message": "cleanup_failure",
  "event": "cleanup_failure",
  "scanned": 15,
  "deleted": 13,
  "failed": 2,
  "duration_ms": 5678
}
```

---

### 6.4 cleanup_list_error

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `cleanup_list_error`                                                                          |
| **Kategori**        | Backend Operations                                                                            |
| **Deskripsi**       | Dipicu saat R2 list_objects_v2 gagal (tidak bisa mendapatkan daftar objek).                   |
| **Trigger**         | ClientError dari boto3 saat memanggil list_objects_v2.                                        |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Backend (Structured Logs / Railway)                                                           |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"cleanup_list_error"`              |
| `error`             | string          | Ya        | Pesan error dari R2/boto3                  | `"AccessDenied: ..."`              |

---

### 6.5 cleanup_failed_item

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `cleanup_failed_item`                                                                         |
| **Kategori**        | Backend Operations                                                                            |
| **Deskripsi**       | Dipicu untuk setiap objek individual yang gagal dihapus selama cleanup.                       |
| **Trigger**         | ClientError dari boto3 saat memanggil delete_object untuk objek spesifik.                    |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Backend (Structured Logs / Railway)                                                           |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"cleanup_failed_item"`             |
| `object_key`        | string (UUID)   | Ya        | UUID key objek yang gagal dihapus          | `"a1b2c3d4-..."`                   |
| `error`             | string          | Ya        | Pesan error dari R2/boto3                  | `"InternalError: ..."`             |

---

### 6.6 task_completed (Backend)

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `task_completed` (backend)                                                                    |
| **Kategori**        | Backend Operations                                                                            |
| **Deskripsi**       | Dipicu saat operasi PDF di server berhasil diselesaikan.                                      |
| **Trigger**         | Endpoint API menyelesaikan pemrosesan file tanpa error.                                       |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Backend (Structured Logs via `log_task_event()`)                                              |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"task_completed"`                  |
| `tool`              | string (enum)   | Ya        | Nama tool yang digunakan                   | `"compress"`                        |
| `duration_ms`       | integer         | Ya        | Durasi pemrosesan dalam milidetik          | `2345`                              |
| `input_size_bucket` | string (enum)   | Ya        | Kategori ukuran file input                 | `"medium"`                          |
| `success`           | boolean         | Ya        | Apakah operasi berhasil                    | `true`                              |

**Implementasi:**

```python
log_task_event(
    logger,
    event="task_completed",
    tool="compress",
    duration_ms=2345,
    input_size_bytes=5_000_000,
    success=True,
)
```

---

### 6.7 task_failed (Backend)

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `task_failed` (backend)                                                                       |
| **Kategori**        | Backend Operations                                                                            |
| **Deskripsi**       | Dipicu saat operasi PDF di server gagal.                                                      |
| **Trigger**         | Exception terjadi selama pemrosesan file di endpoint API.                                     |
| **Status**          | Implemented                                                                                   |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Backend (Structured Logs via `log_task_event()`)                                              |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"task_failed"`                     |
| `tool`              | string (enum)   | Ya        | Nama tool yang digunakan                   | `"pdf-to-image"`                    |
| `duration_ms`       | integer         | Ya        | Durasi sebelum gagal dalam milidetik       | `1500`                              |
| `input_size_bucket` | string (enum)   | Ya        | Kategori ukuran file input                 | `"large"`                           |
| `success`           | boolean         | Ya        | Selalu `false` untuk event ini             | `false`                             |
| `error`             | string          | Ya        | Pesan error (tanpa data sensitif)          | `"Ghostscript process timeout"`     |
---

## 7. Katalog Event — File Operations (Planned)

**Status: PLANNED — Target Fase 2**

Kategori ini mencakup event terkait upload dan download file yang memberikan insight tentang perilaku pengguna dan performa transfer file.

### 7.1 file_upload_started

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `file_upload_started`                                                                         |
| **Kategori**        | File Operations                                                                               |
| **Deskripsi**       | Dipicu saat pengguna memilih file dan proses upload ke server dimulai.                        |
| **Trigger**         | File dipilih via file picker atau drag-and-drop, dan upload request dimulai.                  |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang sedang digunakan                 | `"compress"`                        |
| `file_size_bytes`   | integer         | Ya        | Ukuran file dalam bytes                    | `5242880`                           |
| `file_type`         | string          | Ya        | MIME type file                             | `"application/pdf"`                 |
| `file_count`        | integer         | Ya        | Jumlah file yang di-upload                 | `1`                                 |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |
| `upload_method`     | string (enum)   | Ya        | Metode upload (picker/drag-drop)           | `"picker"`                          |

---

### 7.2 file_upload_completed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `file_upload_completed`                                                                       |
| **Kategori**        | File Operations                                                                               |
| **Deskripsi**       | Dipicu saat file berhasil di-upload ke server dan siap diproses.                              |
| **Trigger**         | Server merespons 200 OK setelah menerima file.                                                |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang sedang digunakan                 | `"compress"`                        |
| `file_size_bytes`   | integer         | Ya        | Ukuran file dalam bytes                    | `5242880`                           |
| `file_type`         | string          | Ya        | MIME type file                             | `"application/pdf"`                 |
| `duration_ms`       | integer         | Ya        | Durasi upload dalam milidetik              | `3200`                              |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

---

### 7.3 file_upload_failed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `file_upload_failed`                                                                          |
| **Kategori**        | File Operations                                                                               |
| **Deskripsi**       | Dipicu saat upload file gagal (network error, timeout, validasi gagal, dll).                  |
| **Trigger**         | Upload request gagal atau server menolak file (413, 415, 422, 429, 5xx).                     |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang sedang digunakan                 | `"compress"`                        |
| `file_size_bytes`   | integer         | Ya        | Ukuran file dalam bytes                    | `25000000`                          |
| `file_type`         | string          | Ya        | MIME type file                             | `"application/pdf"`                 |
| `error_type`        | string (enum)   | Ya        | Kategori error                             | `"file_too_large"`                  |
| `http_status`       | integer         | Tidak     | HTTP status code jika ada                  | `413`                               |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

**Enum `error_type`:**

| **Value**               | **Deskripsi**                                    |
|-------------------------|--------------------------------------------------|
| `file_too_large`        | File melebihi batas 20MB                         |
| `invalid_file_type`     | MIME type tidak didukung                          |
| `network_error`         | Koneksi terputus selama upload                   |
| `timeout`               | Upload timeout (> 60 detik)                      |
| `rate_limited`          | Rate limit tercapai (429)                        |
| `server_error`          | Server error (5xx)                               |
| `validation_failed`     | Validasi magic bytes gagal                       |

---

### 7.4 download_started

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `download_started`                                                                            |
| **Kategori**        | File Operations                                                                               |
| **Deskripsi**       | Dipicu saat pengguna mengklik tombol download untuk mengunduh file hasil.                     |
| **Trigger**         | Klik tombol "Download" atau "Unduh" pada halaman hasil.                                       |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang menghasilkan file                | `"compress"`                        |
| `file_size_bytes`   | integer         | Tidak     | Ukuran file hasil (jika diketahui)         | `2621440`                           |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"desktop"`                         |
| `source`            | string (enum)   | Ya        | Sumber file (client/signed_url)            | `"signed_url"`                      |

---

### 7.5 download_completed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `download_completed`                                                                          |
| **Kategori**        | File Operations                                                                               |
| **Deskripsi**       | Dipicu saat download file berhasil diselesaikan oleh browser.                                 |
| **Trigger**         | Blob berhasil di-save atau signed URL berhasil di-download.                                   |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang menghasilkan file                | `"pdf-to-image"`                    |
| `file_size_bytes`   | integer         | Tidak     | Ukuran file yang di-download               | `1048576`                           |
| `duration_ms`       | integer         | Tidak     | Durasi download dalam milidetik            | `1500`                              |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

---

### 7.6 file_validation_rejected

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `file_validation_rejected`                                                                    |
| **Kategori**        | File Operations                                                                               |
| **Deskripsi**       | Dipicu saat file ditolak oleh validasi multi-layer (MIME, extension, magic bytes).            |
| **Trigger**         | Validasi server menolak file yang di-upload pengguna.                                         |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Backend                                                                                       |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"file_validation_rejected"`        |
| `tool`              | string (enum)   | Ya        | Tool yang digunakan                        | `"compress"`                        |
| `rejection_reason`  | string (enum)   | Ya        | Alasan penolakan                           | `"invalid_magic_bytes"`             |
| `claimed_mime`      | string          | Ya        | MIME type yang diklaim file                 | `"application/pdf"`                 |
| `file_size_bytes`   | integer         | Ya        | Ukuran file                                | `5000000`                           |
---

## 8. Katalog Event — Navigation & Engagement (Planned)

**Status: PLANNED — Target Fase 2**

Kategori ini memberikan insight tentang bagaimana pengguna menavigasi dan berinteraksi dengan Papyr.

### 8.1 tool_page_viewed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `tool_page_viewed`                                                                            |
| **Kategori**        | Navigation & Engagement                                                                       |
| **Deskripsi**       | Dipicu saat pengguna membuka halaman tool tertentu.                                           |
| **Trigger**         | Halaman tool selesai dimuat (page load complete).                                              |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang halaman-nya dibuka               | `"compress"`                        |
| `referrer_source`   | string (enum)   | Tidak     | Sumber navigasi                            | `"homepage_grid"`                   |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

**Enum `referrer_source`:**

| **Value**               | **Deskripsi**                                    |
|-------------------------|--------------------------------------------------|
| `homepage_grid`         | Klik dari grid tool di homepage                  |
| `navbar`                | Klik dari navigation bar                         |
| `other_tools`           | Klik dari section "Tool Lainnya"                 |
| `direct`                | Akses langsung via URL                           |
| `search_engine`         | Dari hasil pencarian (organic)                   |
| `external`              | Dari link eksternal                              |

---

### 8.2 homepage_viewed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `homepage_viewed`                                                                             |
| **Kategori**        | Navigation & Engagement                                                                       |
| **Deskripsi**       | Dipicu saat pengguna membuka homepage Papyr.                                                  |
| **Trigger**         | Homepage selesai dimuat.                                                                       |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |
| `is_returning`      | boolean         | Tidak     | Apakah pengguna pernah berkunjung sebelumnya| `true`                             |
| `utm_source`        | string          | Tidak     | UTM source parameter (jika ada)            | `"twitter"`                         |

---

### 8.3 tool_grid_clicked

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `tool_grid_clicked`                                                                           |
| **Kategori**        | Navigation & Engagement                                                                       |
| **Deskripsi**       | Dipicu saat pengguna mengklik salah satu tool card di homepage grid.                          |
| **Trigger**         | Klik pada tool card di homepage.                                                               |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang diklik                           | `"merge"`                           |
| `position`          | integer         | Ya        | Posisi card dalam grid (1-indexed)         | `2`                                 |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"desktop"`                         |

---

### 8.4 faq_expanded

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `faq_expanded`                                                                                |
| **Kategori**        | Navigation & Engagement                                                                       |
| **Deskripsi**       | Dipicu saat pengguna membuka/expand item FAQ.                                                 |
| **Trigger**         | Klik pada accordion FAQ item.                                                                  |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P4 — Low                                                                                      |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `question_id`       | string          | Ya        | ID unik pertanyaan FAQ                     | `"faq_file_safety"`                 |
| `page`              | string          | Ya        | Halaman tempat FAQ berada                  | `"compress"`                        |

---

### 8.5 share_result_clicked

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `share_result_clicked`                                                                        |
| **Kategori**        | Navigation & Engagement                                                                       |
| **Deskripsi**       | Dipicu saat pengguna mengklik tombol share untuk membagikan hasil atau link tool.             |
| **Trigger**         | Klik tombol share (jika fitur sharing diimplementasikan).                                     |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P4 — Low                                                                                      |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang hasilnya di-share                | `"compress"`                        |
| `share_method`      | string (enum)   | Ya        | Metode sharing                             | `"whatsapp"`                        |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

**Enum `share_method`:**

| **Value**       | **Deskripsi**                    |
|-----------------|----------------------------------|
| `whatsapp`      | Share via WhatsApp               |
| `telegram`      | Share via Telegram               |
| `copy_link`     | Copy link ke clipboard           |
| `native_share`  | Web Share API (mobile)           |
| `twitter`       | Share via Twitter/X              |

---

### 8.6 feedback_submitted

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `feedback_submitted`                                                                          |
| **Kategori**        | Navigation & Engagement                                                                       |
| **Deskripsi**       | Dipicu saat pengguna mengirimkan feedback (rating, komentar, atau saran).                    |
| **Trigger**         | Submit form feedback atau klik rating bintang.                                                 |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Tidak     | Tool yang sedang digunakan (jika ada)      | `"compress"`                        |
| `rating`            | integer         | Tidak     | Rating 1-5 (jika menggunakan bintang)      | `4`                                 |
| `feedback_type`     | string (enum)   | Ya        | Tipe feedback                              | `"rating"`                          |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

**Enum `feedback_type`:**

| **Value**       | **Deskripsi**                    |
|-----------------|----------------------------------|
| `rating`        | Rating bintang saja              |
| `comment`       | Komentar teks                    |
| `bug_report`    | Laporan bug                      |
| `feature_request` | Permintaan fitur baru          |

---

### 8.7 cta_clicked

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `cta_clicked`                                                                                 |
| **Kategori**        | Navigation & Engagement                                                                       |
| **Deskripsi**       | Dipicu saat pengguna mengklik Call-to-Action button di berbagai lokasi.                       |
| **Trigger**         | Klik pada CTA button (hero, banner, footer, dll).                                             |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `cta_id`            | string          | Ya        | ID unik CTA                               | `"hero_compress_btn"`               |
| `cta_location`      | string          | Ya        | Lokasi CTA di halaman                      | `"hero_section"`                    |
| `destination`       | string          | Ya        | URL tujuan CTA                             | `"/compress"`                       |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |
---

## 9. Katalog Event — Error & Recovery (Planned)

**Status: PLANNED — Target Fase 2**

Kategori ini melacak error yang dialami pengguna dan mekanisme recovery yang digunakan.

### 9.1 error_displayed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `error_displayed`                                                                             |
| **Kategori**        | Error & Recovery                                                                              |
| **Deskripsi**       | Dipicu saat pesan error ditampilkan kepada pengguna di UI.                                    |
| **Trigger**         | Komponen error toast/alert muncul di layar pengguna.                                          |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `error_type`        | string (enum)   | Ya        | Kategori error                             | `"upload_failed"`                   |
| `error_message`     | string          | Ya        | Pesan error (dipotong 200 char)            | `"File terlalu besar (maks 20MB)"` |
| `tool`              | string (enum)   | Tidak     | Tool yang sedang digunakan                 | `"compress"`                        |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |
| `is_recoverable`    | boolean         | Ya        | Apakah error bisa di-recover               | `true`                              |

**Enum `error_type`:**

| **Value**               | **Deskripsi**                                    |
|-------------------------|--------------------------------------------------|
| `upload_failed`         | Upload gagal                                     |
| `processing_failed`     | Pemrosesan gagal                                 |
| `download_failed`       | Download gagal                                   |
| `network_error`         | Koneksi terputus                                 |
| `rate_limited`          | Rate limit tercapai                              |
| `file_invalid`          | File tidak valid                                 |
| `file_too_large`        | File melebihi batas ukuran                       |
| `file_corrupted`        | File rusak/corrupt                               |
| `file_protected`        | File terproteksi password                        |
| `server_unavailable`    | Server tidak tersedia                            |
| `timeout`               | Request timeout                                  |
| `unknown`               | Error tidak diketahui                            |

---

### 9.2 retry_triggered

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `retry_triggered`                                                                             |
| **Kategori**        | Error & Recovery                                                                              |
| **Deskripsi**       | Dipicu saat mekanisme auto-retry diaktifkan setelah kegagalan pertama.                       |
| **Trigger**         | Task gagal dan sistem otomatis mencoba ulang (1x retry per BRD).                              |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang sedang di-retry                  | `"compress"`                        |
| `retry_count`       | integer         | Ya        | Nomor percobaan retry (selalu 1 di MVP)    | `1`                                 |
| `original_error`    | string          | Ya        | Error yang memicu retry                    | `"Network timeout"`                 |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

---

### 9.3 retry_succeeded

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `retry_succeeded`                                                                             |
| **Kategori**        | Error & Recovery                                                                              |
| **Deskripsi**       | Dipicu saat retry berhasil menyelesaikan task yang sebelumnya gagal.                          |
| **Trigger**         | Task berhasil setelah retry otomatis.                                                          |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang berhasil di-retry                | `"compress"`                        |
| `retry_count`       | integer         | Ya        | Nomor percobaan yang berhasil              | `1`                                 |
| `total_duration_ms` | integer         | Ya        | Total durasi termasuk retry                | `8500`                              |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

---

### 9.4 retry_exhausted

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `retry_exhausted`                                                                             |
| **Kategori**        | Error & Recovery                                                                              |
| **Deskripsi**       | Dipicu saat semua retry gagal dan error final ditampilkan ke pengguna.                        |
| **Trigger**         | Retry terakhir gagal — pengguna melihat pesan error final.                                    |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang gagal setelah semua retry        | `"pdf-to-image"`                    |
| `total_retries`     | integer         | Ya        | Total percobaan retry yang dilakukan       | `1`                                 |
| `final_error`       | string          | Ya        | Error terakhir sebelum menyerah            | `"Server unavailable"`              |
| `total_duration_ms` | integer         | Ya        | Total durasi dari awal hingga menyerah     | `12000`                             |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

---

### 9.5 rate_limit_hit

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `rate_limit_hit`                                                                              |
| **Kategori**        | Error & Recovery                                                                              |
| **Deskripsi**       | Dipicu saat pengguna mencapai rate limit (10 req/min/IP).                                    |
| **Trigger**         | Server merespons 429 Too Many Requests.                                                       |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Backend                                                                                       |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"rate_limit_hit"`                  |
| `tool`              | string (enum)   | Tidak     | Tool yang diminta                          | `"compress"`                        |
| `requests_count`    | integer         | Ya        | Jumlah request dalam window                | `11`                                |
| `window_seconds`    | integer         | Ya        | Durasi window rate limit                   | `60`                                |
---

## 10. Katalog Event — Monetization (Planned)

**Status: PLANNED — Target Fase 3**

Kategori ini melacak interaksi pengguna dengan fitur monetisasi dan upgrade flow.

### 10.1 pro_upgrade_viewed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `pro_upgrade_viewed`                                                                          |
| **Kategori**        | Monetization                                                                                  |
| **Deskripsi**       | Dipicu saat pengguna melihat halaman/modal upgrade ke Pro.                                    |
| **Trigger**         | Halaman pricing atau modal upgrade ditampilkan.                                                |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `trigger_source`    | string (enum)   | Ya        | Apa yang memicu tampilan upgrade           | `"feature_gate"`                    |
| `tool`              | string (enum)   | Tidak     | Tool yang sedang digunakan (jika ada)      | `"ocr"`                             |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

**Enum `trigger_source`:**

| **Value**           | **Deskripsi**                                    |
|---------------------|--------------------------------------------------|
| `feature_gate`      | Fitur Pro yang di-gate (OCR, batch, dll)         |
| `navbar_cta`        | CTA di navigation bar                            |
| `pricing_page`      | Navigasi langsung ke halaman pricing             |
| `limit_reached`     | Batas penggunaan harian tercapai                 |
| `banner`            | Banner promosi di halaman tool                   |

---

### 10.2 pro_upgrade_clicked

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `pro_upgrade_clicked`                                                                         |
| **Kategori**        | Monetization                                                                                  |
| **Deskripsi**       | Dipicu saat pengguna mengklik tombol upgrade/subscribe ke Pro.                                |
| **Trigger**         | Klik tombol "Upgrade ke Pro" atau "Berlangganan".                                             |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `plan_type`         | string (enum)   | Ya        | Tipe plan yang dipilih                     | `"monthly"`                         |
| `plan_price`        | integer         | Ya        | Harga plan dalam Rupiah                    | `19900`                             |
| `trigger_source`    | string (enum)   | Ya        | Sumber yang memicu klik                    | `"pricing_page"`                    |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"desktop"`                         |

**Enum `plan_type`:**

| **Value**       | **Deskripsi**                    | **Harga**       |
|-----------------|----------------------------------|-----------------|
| `monthly`       | Langganan bulanan                | Rp 19.900       |
| `yearly`        | Langganan tahunan                | Rp 149.000      |

---

### 10.3 pro_upgrade_completed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `pro_upgrade_completed`                                                                       |
| **Kategori**        | Monetization                                                                                  |
| **Deskripsi**       | Dipicu saat pembayaran berhasil dan akun Pro aktif.                                           |
| **Trigger**         | Callback sukses dari payment gateway (Midtrans/Xendit).                                       |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Backend + Frontend                                                                            |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `plan_type`         | string (enum)   | Ya        | Tipe plan yang dibeli                      | `"monthly"`                         |
| `plan_price`        | integer         | Ya        | Harga yang dibayar (Rupiah)                | `19900`                             |
| `payment_method`    | string (enum)   | Ya        | Metode pembayaran                          | `"gopay"`                           |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

**Enum `payment_method`:**

| **Value**       | **Deskripsi**                    |
|-----------------|----------------------------------|
| `gopay`         | GoPay e-wallet                   |
| `ovo`           | OVO e-wallet                     |
| `dana`          | DANA e-wallet                    |
| `bank_transfer` | Transfer bank (VA)               |
| `credit_card`   | Kartu kredit/debit               |
| `qris`          | QRIS (QR code)                   |

---

### 10.4 pro_upgrade_failed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `pro_upgrade_failed`                                                                          |
| **Kategori**        | Monetization                                                                                  |
| **Deskripsi**       | Dipicu saat pembayaran gagal atau dibatalkan pengguna.                                        |
| **Trigger**         | Callback gagal dari payment gateway atau pengguna menutup payment modal.                      |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `plan_type`         | string (enum)   | Ya        | Tipe plan yang gagal dibeli                | `"monthly"`                         |
| `failure_reason`    | string (enum)   | Ya        | Alasan kegagalan                           | `"user_cancelled"`                  |
| `payment_method`    | string (enum)   | Tidak     | Metode pembayaran (jika sudah dipilih)     | `"gopay"`                           |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

**Enum `failure_reason`:**

| **Value**               | **Deskripsi**                                    |
|-------------------------|--------------------------------------------------|
| `user_cancelled`        | Pengguna membatalkan pembayaran                  |
| `insufficient_funds`    | Saldo tidak cukup                                |
| `payment_expired`       | Waktu pembayaran habis                           |
| `payment_declined`      | Pembayaran ditolak                               |
| `gateway_error`         | Error dari payment gateway                       |

---

### 10.5 batch_processing_started

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `batch_processing_started`                                                                    |
| **Kategori**        | Monetization                                                                                  |
| **Deskripsi**       | Dipicu saat pengguna Pro memulai batch processing (multiple files sekaligus).                 |
| **Trigger**         | Pengguna Pro mengklik "Proses Semua" untuk batch operation.                                   |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang digunakan untuk batch            | `"compress"`                        |
| `file_count`        | integer         | Ya        | Jumlah file dalam batch                    | `5`                                 |
| `total_size_bytes`  | integer         | Ya        | Total ukuran semua file                    | `25000000`                          |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"desktop"`                         |

---

### 10.6 batch_processing_completed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `batch_processing_completed`                                                                  |
| **Kategori**        | Monetization                                                                                  |
| **Deskripsi**       | Dipicu saat batch processing selesai (semua file berhasil diproses).                          |
| **Trigger**         | Semua file dalam batch selesai diproses.                                                       |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang digunakan                        | `"compress"`                        |
| `file_count`        | integer         | Ya        | Jumlah file yang diproses                  | `5`                                 |
| `success_count`     | integer         | Ya        | Jumlah file yang berhasil                  | `5`                                 |
| `failed_count`      | integer         | Ya        | Jumlah file yang gagal                     | `0`                                 |
| `total_duration_ms` | integer         | Ya        | Total durasi batch processing              | `15000`                             |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"desktop"`                         |

---

## 11. Katalog Event — User Preferences (Planned)

**Status: PLANNED — Target Fase 2**

Kategori ini melacak preferensi dan pengaturan yang dipilih pengguna.

### 11.1 language_selected

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `language_selected`                                                                           |
| **Kategori**        | User Preferences                                                                              |
| **Deskripsi**       | Dipicu saat pengguna mengubah bahasa antarmuka.                                               |
| **Trigger**         | Klik language switcher dan memilih bahasa baru.                                                |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `language_from`     | string          | Ya        | Bahasa sebelumnya                          | `"id"`                              |
| `language_to`       | string          | Ya        | Bahasa yang dipilih                        | `"en"`                              |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

---

### 11.2 compression_level_selected

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `compression_level_selected`                                                                  |
| **Kategori**        | User Preferences                                                                              |
| **Deskripsi**       | Dipicu saat pengguna memilih level kompresi pada tool Compress PDF.                           |
| **Trigger**         | Klik/pilih level kompresi (low, medium, high).                                                 |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `level`             | string (enum)   | Ya        | Level kompresi yang dipilih                | `"medium"`                          |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

---

### 11.3 theme_changed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `theme_changed`                                                                               |
| **Kategori**        | User Preferences                                                                              |
| **Deskripsi**       | Dipicu saat pengguna mengubah tema (light/dark) jika fitur ini ditambahkan.                   |
| **Trigger**         | Toggle theme switcher.                                                                         |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P4 — Low                                                                                      |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `theme_from`        | string (enum)   | Ya        | Tema sebelumnya                            | `"light"`                           |
| `theme_to`          | string (enum)   | Ya        | Tema yang dipilih                          | `"dark"`                            |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"desktop"`                         |

---

### 11.4 page_range_entered

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `page_range_entered`                                                                          |
| **Kategori**        | User Preferences                                                                              |
| **Deskripsi**       | Dipicu saat pengguna memasukkan page range pada tool Split PDF.                               |
| **Trigger**         | Pengguna selesai mengetik page range dan memulai proses.                                      |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P4 — Low                                                                                      |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `total_pages`       | integer         | Ya        | Total halaman PDF                          | `20`                                |
| `selected_pages`    | integer         | Ya        | Jumlah halaman yang dipilih                | `5`                                 |
| `range_pattern`     | string (enum)   | Ya        | Pola range yang digunakan                  | `"custom_range"`                    |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"desktop"`                         |

**Enum `range_pattern`:**

| **Value**           | **Deskripsi**                                    |
|---------------------|--------------------------------------------------|
| `single_page`       | Satu halaman saja (e.g., "3")                    |
| `continuous_range`  | Range berurutan (e.g., "1-5")                    |
| `custom_range`      | Range campuran (e.g., "1-3, 5, 7-10")           |
| `all_pages`         | Semua halaman                                    |

---

## 12. Katalog Event — Performance & Infrastructure (Planned)

**Status: PLANNED — Target Fase 2**

Kategori ini melacak metrik performa dan kesehatan infrastruktur untuk monitoring proaktif.

### 12.1 perf_api_latency

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `perf_api_latency`                                                                            |
| **Kategori**        | Performance & Infrastructure                                                                  |
| **Deskripsi**       | Dicatat untuk setiap request API yang melebihi threshold latency.                             |
| **Trigger**         | Response time > 3000ms (P95 target).                                                           |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Backend                                                                                       |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"perf_api_latency"`                |
| `endpoint`          | string          | Ya        | API endpoint yang lambat                   | `"/api/compress"`                   |
| `method`            | string          | Ya        | HTTP method                                | `"POST"`                            |
| `duration_ms`       | integer         | Ya        | Durasi response dalam milidetik            | `4500`                              |
| `input_size_bucket` | string (enum)   | Ya        | Kategori ukuran input                      | `"large"`                           |

---

### 12.2 perf_r2_operation

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `perf_r2_operation`                                                                           |
| **Kategori**        | Performance & Infrastructure                                                                  |
| **Deskripsi**       | Dicatat untuk operasi R2 yang melebihi threshold durasi.                                      |
| **Trigger**         | Operasi R2 (upload/download/delete) > 2000ms.                                                  |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Backend                                                                                       |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"perf_r2_operation"`               |
| `operation`         | string (enum)   | Ya        | Tipe operasi R2                            | `"put_object"`                      |
| `duration_ms`       | integer         | Ya        | Durasi operasi dalam milidetik             | `3200`                              |
| `object_size_bytes` | integer         | Tidak     | Ukuran objek (jika relevan)                | `10000000`                          |

---

### 12.3 perf_client_processing

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `perf_client_processing`                                                                      |
| **Kategori**        | Performance & Infrastructure                                                                  |
| **Deskripsi**       | Dicatat saat client-side processing melebihi threshold (> 5 detik).                           |
| **Trigger**         | Operasi pdf-lib di browser memakan waktu > 5000ms.                                             |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P3 — Medium                                                                                   |
| **Layer**           | Frontend                                                                                      |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `tool`              | string (enum)   | Ya        | Tool yang lambat                           | `"merge"`                           |
| `duration_ms`       | integer         | Ya        | Durasi processing dalam milidetik          | `7500`                              |
| `file_count`        | integer         | Tidak     | Jumlah file (untuk merge)                  | `15`                                |
| `total_pages`       | integer         | Tidak     | Total halaman yang diproses                | `200`                               |
| `device_category`   | string (enum)   | Ya        | Kategori perangkat                         | `"mobile"`                          |

---

### 12.4 health_check_failed

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `health_check_failed`                                                                         |
| **Kategori**        | Performance & Infrastructure                                                                  |
| **Deskripsi**       | Dicatat saat health check endpoint mendeteksi masalah.                                        |
| **Trigger**         | /health endpoint mengembalikan status unhealthy.                                               |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P1 — Critical                                                                                 |
| **Layer**           | Backend                                                                                       |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"health_check_failed"`             |
| `component`         | string          | Ya        | Komponen yang bermasalah                   | `"r2_connectivity"`                 |
| `error`             | string          | Ya        | Detail error                               | `"R2 connection timeout"`           |
| `timestamp`         | string (ISO)    | Ya        | Waktu kejadian                             | `"2026-05-03T10:30:00+00:00"`      |

---

### 12.5 storage_usage_alert

| **Atribut**         | **Detail**                                                                                     |
|---------------------|-----------------------------------------------------------------------------------------------|
| **Nama Event**      | `storage_usage_alert`                                                                         |
| **Kategori**        | Performance & Infrastructure                                                                  |
| **Deskripsi**       | Dicatat saat penggunaan storage R2 mendekati batas free tier.                                 |
| **Trigger**         | Storage usage > 80% dari free tier limit (8GB dari 10GB).                                      |
| **Status**          | Planned                                                                                       |
| **Prioritas**       | P2 — High                                                                                     |
| **Layer**           | Backend                                                                                       |

**Properti:**

| **Key**             | **Tipe**        | **Wajib** | **Deskripsi**                              | **Contoh**                         |
|---------------------|-----------------|-----------|--------------------------------------------|-------------------------------------|
| `event`             | string          | Ya        | Nama event                                 | `"storage_usage_alert"`             |
| `current_usage_gb`  | float           | Ya        | Penggunaan storage saat ini (GB)           | `8.5`                               |
| `limit_gb`          | float           | Ya        | Batas free tier (GB)                       | `10.0`                              |
| `usage_percentage`  | float           | Ya        | Persentase penggunaan                      | `85.0`                              |

---

## 13. Diagram Alur Data

### 13.1 Frontend Event Flow

```
+-------------------------------------------------------------------------+
|                         BROWSER (Client)                                |
+-------------------------------------------------------------------------+
|                                                                         |
|  +----------------+    +--------------------+    +-----------------------+
|  | User Action    |--->| analytics.ts       |--->| Vercel Analytics SDK  |
|  | (klik, upload  |    | trackTaskStarted   |    | track() function      |
|  |  proses, dll)  |    | trackTaskCompleted |    |                       |
|  +----------------+    | trackTaskFailed    |    +----------+------------+
|                        +--------------------+               |            |
|                                                             |            |
+-------------------------------------------------------------+------------+
                                                              |
                                                              v
                                                 +------------------------+
                                                 |  Vercel Analytics      |
                                                 |  Dashboard             |
                                                 +------------------------+
                                                 |  - Custom Events       |
                                                 |  - Page Views          |
                                                 |  - Web Vitals          |
                                                 |  - Retention: 30 hari  |
                                                 |  - No cookies/PII      |
                                                 +------------------------+
```

### 13.2 Backend Event Flow

```
+-------------------------------------------------------------------------+
|                         BACKEND (FastAPI)                                |
+-------------------------------------------------------------------------+
|                                                                         |
|  +----------------+    +--------------------+    +-----------------------+
|  | API Request    |--->| logging_config.py  |--->| JSONFormatter         |
|  | atau           |    | log_task_event()   |    | (stdout JSON)         |
|  | Cron Job       |    |                    |    |                       |
|  +----------------+    +--------------------+    +----------+------------+
|                                                             |            |
|  +----------------+    +--------------------+               |            |
|  | cleanup.py     |--->| cleanup_success    |---------------+            |
|  | (30 min cron)  |    | cleanup_failure    |                            |
|  +----------------+    +--------------------+                            |
|                                                                         |
+-------------------------------------------------------------+----------+
                                                              |
                                                              v
                                                 +------------------------+
                                                 |  Railway Dashboard     |
                                                 |  Log Viewer            |
                                                 +------------------------+
                                                 |  - Structured JSON     |
                                                 |  - Searchable          |
                                                 |  - Retention: 7 hari   |
                                                 |  - Container metrics   |
                                                 +------------------------+
```

### 13.3 Monitoring Flow

```
+-----------------------+         +-----------------------+
|  UptimeRobot /        |-------->|  /health endpoint     |
|  BetterStack          |  HTTP   |  (Railway)            |
|  (setiap 5 menit)     |<--------|                       |
+-----------+-----------+  200/5xx+-----------------------+
            |
            v
+-----------------------+
|  Alert Notification   |
|  (Email / Telegram)   |
|  jika downtime > 5min |
+-----------------------+
```

### 13.4 Future Data Pipeline (Planned)

```
+---------------+    +---------------+    +---------------+    +---------------+
|  Frontend     |    |  Backend      |    |  Supabase     |    |  Dashboard    |
|  Events       |--->|  API          |--->|  PostgreSQL   |--->|  Metabase /   |
|  (Vercel)     |    |  (collect)    |    |  (store)      |    |  Grafana      |
+---------------+    +---------------+    +---------------+    +---------------+
                                                 |
                                                 v
                                         +---------------+
                                         |  Analytics    |
                                         |  Queries      |
                                         |  & Reports    |
                                         +---------------+
```

---

## 14. Pertimbangan Privasi

### 14.1 Data yang TIDAK BOLEH Di-Track

| **#** | **Kategori Data**              | **Contoh**                                    | **Alasan**                                |
|-------|--------------------------------|-----------------------------------------------|-------------------------------------------|
| 1     | Nama file asli                 | `"Kontrak_PT_ABC.pdf"`                        | Mengandung informasi bisnis sensitif      |
| 2     | Konten file                    | Teks, gambar dalam PDF                        | Data pribadi pengguna                     |
| 3     | IP address pengguna            | `"103.28.xxx.xxx"`                            | PII — identifiable information            |
| 4     | User agent lengkap             | `"Mozilla/5.0 (Linux; Android..."`            | Fingerprinting risk                       |
| 5     | Lokasi geografis presisi       | Koordinat GPS                                 | PII — lokasi sensitif                     |
| 6     | Cookie / session identifier    | `"sess_abc123"`                               | Tracking cross-session                    |
| 7     | Email / nomor telepon          | `"user@email.com"`                            | PII — kontak pribadi                      |
| 8     | Metadata file sensitif         | Author, creation date, comments               | Bisa mengidentifikasi pengguna            |

### 14.2 Data yang BOLEH Di-Track

| **#** | **Kategori Data**              | **Contoh**                                    | **Justifikasi**                           |
|-------|--------------------------------|-----------------------------------------------|-------------------------------------------|
| 1     | Nama tool                      | `"compress"`, `"merge"`                       | Untuk memahami tool popularity            |
| 2     | Device category                | `"mobile"`, `"desktop"`                       | Untuk optimasi UX per device              |
| 3     | File size (bucket)             | `"small"`, `"medium"`, `"large"`              | Untuk capacity planning                   |
| 4     | MIME type                      | `"application/pdf"`                           | Untuk validasi dan debugging              |
| 5     | Duration (ms)                  | `2345`                                        | Untuk monitoring performa                 |
| 6     | Success/failure status         | `true`, `false`                               | Untuk reliability tracking                |
| 7     | Error message (generic)        | `"File too large"`                            | Untuk debugging (tanpa data sensitif)     |
| 8     | Timestamp                      | `"2026-05-03T10:30:00Z"`                      | Untuk analisis temporal                   |

### 14.3 Kepatuhan Regulasi

| **Regulasi**          | **Status**      | **Tindakan**                                                              |
|-----------------------|-----------------|---------------------------------------------------------------------------|
| UU PDP (UU 27/2022)  | Compliant       | Tidak mengumpulkan data pribadi. Privacy Policy tersedia di website.       |
| GDPR                  | Aware           | Vercel Analytics GDPR-compliant. Tidak ada cookies. Tidak ada PII.        |
| CCPA                  | Aware           | Tidak mengumpulkan data yang termasuk dalam definisi CCPA.                |

### 14.4 Data Retention Policy

| **Platform**          | **Retention**   | **Catatan**                                                               |
|-----------------------|-----------------|---------------------------------------------------------------------------|
| Vercel Analytics      | 30 hari         | Otomatis dihapus setelah 30 hari. Tidak bisa diperpanjang di Free Tier.   |
| Railway Logs          | 7 hari          | Otomatis dihapus. Tidak ada export otomatis.                              |
| Cloudflare R2 Files   | 60 menit        | Auto-delete via lifecycle rule + cron fallback.                            |
| Supabase (Future)     | Configurable    | Akan diatur sesuai kebutuhan analisis (target: 90 hari).                  |

---

## 15. Roadmap Implementasi

### 15.1 Fase 1 — Fase 1 (SELESAI)

| **Event**                 | **Layer**   | **Status**      | **Tanggal**   |
|---------------------------|-------------|-----------------|---------------|
| `task_started`            | Frontend    | Implemented     | April 2026    |
| `task_completed`          | Frontend    | Implemented     | April 2026    |
| `task_failed`             | Frontend    | Implemented     | April 2026    |
| `cleanup_started`         | Backend     | Implemented     | April 2026    |
| `cleanup_success`         | Backend     | Implemented     | April 2026    |
| `cleanup_failure`         | Backend     | Implemented     | April 2026    |
| `cleanup_list_error`      | Backend     | Implemented     | April 2026    |
| `cleanup_failed_item`     | Backend     | Implemented     | April 2026    |
| `task_completed` (backend)| Backend     | Implemented     | April 2026    |
| `task_failed` (backend)   | Backend     | Implemented     | April 2026    |

### 15.2 Fase 5 — Fase 2 (Target: Q3 2026)

| **Event**                     | **Layer**   | **Prioritas** | **Effort**    |
|-------------------------------|-------------|---------------|---------------|
| `file_upload_started`         | Frontend    | P2            | Low           |
| `file_upload_completed`       | Frontend    | P2            | Low           |
| `file_upload_failed`          | Frontend    | P2            | Low           |
| `download_started`            | Frontend    | P2            | Low           |
| `download_completed`          | Frontend    | P3            | Low           |
| `file_validation_rejected`    | Backend     | P2            | Low           |
| `tool_page_viewed`            | Frontend    | P2            | Low           |
| `error_displayed`             | Frontend    | P2            | Medium        |
| `retry_triggered`             | Frontend    | P2            | Medium        |
| `retry_succeeded`             | Frontend    | P2            | Medium        |
| `retry_exhausted`             | Frontend    | P2            | Medium        |
| `rate_limit_hit`              | Backend     | P2            | Low           |
| `language_selected`           | Frontend    | P3            | Low           |
| `compression_level_selected`  | Frontend    | P3            | Low           |
| `perf_api_latency`            | Backend     | P2            | Medium        |
| `perf_client_processing`      | Frontend    | P3            | Medium        |
| `health_check_failed`         | Backend     | P1            | Low           |

### 15.3 Fase 6 — Fase 3 (Target: Q4 2026)

| **Event**                     | **Layer**   | **Prioritas** | **Effort**    |
|-------------------------------|-------------|---------------|---------------|
| `pro_upgrade_viewed`          | Frontend    | P2            | Medium        |
| `pro_upgrade_clicked`         | Frontend    | P1            | Medium        |
| `pro_upgrade_completed`       | Backend+FE  | P1            | High          |
| `pro_upgrade_failed`          | Frontend    | P1            | Medium        |
| `batch_processing_started`    | Frontend    | P3            | Medium        |
| `batch_processing_completed`  | Frontend    | P3            | Medium        |
| `homepage_viewed`             | Frontend    | P3            | Low           |
| `tool_grid_clicked`           | Frontend    | P3            | Low           |
| `faq_expanded`                | Frontend    | P4            | Low           |
| `share_result_clicked`        | Frontend    | P4            | Medium        |
| `feedback_submitted`          | Frontend    | P3            | Medium        |
| `cta_clicked`                 | Frontend    | P3            | Low           |
| `theme_changed`               | Frontend    | P4            | Low           |
| `page_range_entered`          | Frontend    | P4            | Low           |
| `perf_r2_operation`           | Backend     | P3            | Medium        |
| `storage_usage_alert`         | Backend     | P2            | Medium        |

### 15.4 Ringkasan Statistik

| **Metrik**                        | **Jumlah**  |
|-----------------------------------|-------------|
| Total event yang didefinisikan    | 43          |
| Event sudah diimplementasikan     | 10          |
| Event planned (Fase 5)            | 17          |
| Event planned (Fase 6)            | 16          |
| Kategori event                    | 8           |
| Platform analytics aktif          | 4           |

---

## 16. Persetujuan Dokumen

Dengan menandatangani di bawah ini, approver mengkonfirmasi bahwa mereka telah meninjau Analytics Event Taxonomy ini dan menyetujui bahwa dokumen ini secara akurat merepresentasikan strategi analytics untuk Papyr.

| **Peran**         | **Nama**                     | **Tanda Tangan** | **Tanggal** |
|:------------------|:-----------------------------|:-----------------|:------------|
| **Product Owner** | Muhammad Fa'iz Zulfikar      | Approved         | 2026-05-03  |
| **AI Agent**      | OpenCode/Sisyphus            | Approved         | 2026-05-03  |

---

*Dokumen ini dapat berubah. Setiap modifikasi harus ditinjau dan disetujui ulang oleh semua penandatangan.*

*Hak cipta © 2026 Muhammad Fa'iz Zulfikar. All rights reserved.*
