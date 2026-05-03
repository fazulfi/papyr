# **Papyr**

## Implementation Backlog — MVP 0.2

### Alat PDF Gratis, Cepat, dan Privasi-First untuk Indonesia

**mypapyr.com**

---

## Informasi Dokumen

| Field | Detail |
|-------|--------|
| **Kode Dokumen** | PPR-IB-002 |
| **Versi** | 1.0 |
| **Status** | Draft |
| **Tanggal** | Mei 2026 |
| **Penulis** | Muhammad Fa'iz Zulfikar |
| **Reviewer** | — |
| **Scope** | MVP 0.2 (M12–M22) |
| **Total Tasks** | 135 tasks (PAPYR-090 — PAPYR-224) |
| **Estimasi Total** | ~318 jam |
| **Model Pengembangan** | 100% AI-driven |

---

## Riwayat Versi

| Versi | Tanggal | Perubahan | Penulis |
|-------|---------|-----------|---------|
| 1.0 | Mei 2026 | Initial draft — backlog lengkap M12–M20 | Muhammad Fa'iz Zulfikar |
| 1.1 | Mei 2026 | Tambah M21 OpenClaw AI Agent (25 tasks, PAPYR-179—203), update total ke 114 tasks ~263 jam | AI Agent (OpenCode/Sisyphus) |
| 1.2 | Mei 2026 | Tambah M22 Admin Dashboard (Fase 2F), 15 tasks (PAPYR-204—218), update total ke 129 tasks ~298 jam | AI Agent (OpenCode/Sisyphus) |
| 1.3 | Mei 2026 | Tambah tasks Social Media/Twitter (PAPYR-219—224) ke M21, expand reporting tasks, update total ke 135 tasks ~318 jam | AI Agent (OpenCode/Sisyphus) |

---

## Dokumen Terkait

| Kode | Dokumen | Keterangan |
|------|---------|------------|
| PPR-IB-001 | Papyr Implementation Backlog MVP 0.1 | Backlog M01–M11 (89 tasks, selesai) |
| PPR-BRD-001 | Papyr BRD v1.0 | Business Requirements Document |
| PPR-SRS-001 | Papyr SRS v1.0 | Software Requirements Specification |
| PPR-TDD-001 | Papyr TDD v1.0 | Technical Design Document |
| PPR-RM-001 | Papyr Roadmap v1.0 | Product Roadmap |
| PPR-API-001 | Papyr API Spec v1.0 | API Specification |
| PPR-TP-001 | Papyr Test Plan v1.0 | Test Plan & Strategy |
| PPR-CLAW-001 | Papyr OpenClaw v1.0 | OpenClaw AI Agent Full Specification |

---

## Konteks MVP 0.2

### Status Saat Ini (Post-MVP 0.1)

| Aspek | Detail |
|-------|--------|
| **Versi** | v1.1.0 |
| **Tools live** | 6 (Compress, Merge, Split, Rotate, Image-to-PDF, PDF-to-Image) |
| **Tasks selesai** | 89 (PAPYR-001 — PAPYR-089) |
| **Stack** | Next.js 16 (Vercel) + FastAPI (Railway) + Cloudflare R2 |
| **Tests** | 23 vitest (frontend) + 34 pytest (backend) |
| **CI/CD** | GitHub Actions (lint + test + build) |
| **Upload limit** | 20 MB per file |
| **Retention** | 60 menit auto-delete |
| **Rate limit** | 10 req/menit per IP |
| **Analytics** | Vercel Analytics (task_started/completed/failed + device_category) |
| **Domain** | mypapyr.com (Hostinger DNS → Vercel) |

### Target MVP 0.2

- **7 tools baru:** Protect PDF, Unlock PDF, Watermark PDF, Sign PDF, PDF-to-Word, OCR, PDF-to-Excel
- **E2E testing:** Playwright untuk semua 13 tools
- **Performance & monitoring:** Lighthouse optimization, uptime monitoring, SEO update
- **Admin Dashboard:** Unified admin panel (/admin) untuk monitoring semua operasional
- **Total tools setelah MVP 0.2:** 13 tools
- **Target release:** v2.0.0

### Processing Strategy MVP 0.2

| Tool Baru | Processing | Library | Alasan |
|-----------|-----------|---------|--------|
| Protect PDF | Server | PyMuPDF (fitz) | Encryption membutuhkan native library |
| Unlock PDF | Server | PyMuPDF (fitz) | Decryption membutuhkan native library |
| Watermark (text) | Client | pdf-lib | Ringan, zero upload, privacy |
| Watermark (image) | Server | PyMuPDF | Image overlay butuh rendering engine |
| Sign PDF | Client | Canvas + pdf-lib | Privacy-first, zero upload |
| PDF-to-Word | Server | LibreOffice headless | Heavy conversion, butuh full office suite |
| OCR | Server | ocrmypdf + Tesseract | ML-based text recognition |
| PDF-to-Excel | Server | camelot + openpyxl | Table detection butuh CV library |
| Admin Dashboard | Client (SSR) | Next.js App Router | Bagian dari frontend app, SSR untuk data fetching |

---

## Ringkasan Milestone

| Kode | Milestone | Fase | Periode | Tasks | Estimasi |
|------|-----------|------|---------|-------|----------|
| M12 | **Protect PDF (Password Protect)** | 2A — Security | Minggu 1–2 | 9 | 16 jam |
| M13 | **Unlock PDF (Remove Password)** | 2A — Security | Minggu 2–3 | 8 | 14 jam |
| M14 | **Watermark PDF** | 2B — Enhancement | Minggu 3–5 | 10 | 20 jam |
| M15 | **Sign PDF (Digital Signature)** | 2B — Enhancement | Minggu 5–7 | 11 | 24 jam |
| M16 | **PDF-to-Word** | 2C — Conversion | Minggu 7–9 | 10 | 22 jam |
| M17 | **OCR (Optical Character Recognition)** | 2C — Conversion | Minggu 9–11 | 11 | 26 jam |
| M18 | **PDF-to-Excel** | 2C — Conversion | Minggu 11–13 | 10 | 21 jam |
| M19 | **E2E Testing + Code Quality** | 2D — Quality | Minggu 13–14 | 10 | 12 jam |
| M20 | **Performance, Monitoring & SEO** | 2D — Quality | Minggu 14–15 | 10 | 8 jam |
| M21 | **OpenClaw AI Agent** | 2E — OpenClaw | Minggu 16–25 | 31 | 120 jam |
| M22 | **Admin Dashboard** | 2F — Dashboard | Minggu 25–28 | 15 | 35 jam |
| **TOTAL** | **11 Milestones** | **6 Fase** | **Minggu 1–28** | **135 tasks** | **~318 jam** |

> ~318 jam total ÷ 10 jam/minggu = sekitar 31–32 minggu. Realistis untuk 100% AI-driven development.

---

## GitHub Labels yang Disarankan

### Labels Baru untuk MVP 0.2

| Label | Warna | Kegunaan |
|-------|-------|----------|
| `milestone:M12` | #E5E7EB | Protect PDF |
| `milestone:M13` | #E5E7EB | Unlock PDF |
| `milestone:M14` | #E5E7EB | Watermark PDF |
| `milestone:M15` | #E5E7EB | Sign PDF |
| `milestone:M16` | #E5E7EB | PDF-to-Word |
| `milestone:M17` | #E5E7EB | OCR |
| `milestone:M18` | #E5E7EB | PDF-to-Excel |
| `milestone:M19` | #E5E7EB | E2E Testing + Code Quality |
| `milestone:M20` | #E5E7EB | Performance, Monitoring & SEO |
| `milestone:M21` | #E5E7EB | OpenClaw AI Agent |
| `milestone:M22` | #E5E7EB | Admin Dashboard |
| `phase:2A` | #DC2626 | Security Tools |
| `phase:2B` | #7C3AED | Document Enhancement |
| `phase:2C` | #0891B2 | Document Conversion |
| `phase:2D` | #059669 | Cross-cutting Quality |
| `phase:2E` | #6366F1 | OpenClaw AI Agent |
| `phase:2F` | #EC4899 | Admin Dashboard |
| `priority:high` | #DC2626 | Blocking atau critical path |
| `priority:medium` | #F59E0B | Penting tapi tidak blocking |
| `priority:low` | #6B7280 | Nice-to-have, bisa ditunda |
| `agent:kicau` | #1DA1F2 | Social Media agent tasks |

### Labels Existing (dari MVP 0.1)

| Label | Warna | Kegunaan |
|-------|-------|----------|
| `layer:infra` | #7C3AED | Setup environment, cloud services, konfigurasi |
| `layer:frontend` | #16A34A | UI components, halaman, client-side logic |
| `layer:backend` | #1D4ED8 | API endpoints, server-side processing |
| `layer:testing` | #A16207 | Unit test, integration test, E2E test |
| `layer:deploy` | #BE123C | Deployment, CI/CD, monitoring |
| `layer:seo-content` | #B45309 | Copy, meta tags, sitemap, SEO |

---

## Detail Backlog Per Milestone

---

### M12: Protect PDF (Password Protect) — 9 tasks | 16 jam | Minggu 1–2

**Deskripsi:** Fitur enkripsi PDF dengan password menggunakan PyMuPDF server-side. User upload PDF, masukkan password, download PDF terproteksi.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-090 | **Backend** | **Buat endpoint POST /api/protect** | Terima file PDF + password (form-data). Validasi: MIME type application/pdf, ekstensi .pdf, magic bytes %PDF, ukuran maks 20MB, password minimal 4 karakter. Return 400 dengan pesan spesifik jika gagal validasi. | **3h** |
| PAPYR-091 | **Backend** | **Implementasi enkripsi PDF dengan PyMuPDF** | Gunakan `fitz.open()` lalu `doc.save(encryption=fitz.PDF_ENCRYPT_AES_256, owner_pw=password, user_pw=password)`. Set permission flags: deny print, deny copy (configurable). Handle edge case: PDF sudah terenkripsi (return 409). | **3h** |
| PAPYR-092 | **Backend** | **Upload hasil protect ke R2 + signed URL** | Simpan output ke R2 dengan UUID filename prefix `protected_`. Return signed URL expire 60 menit. Reuse existing R2 utility dari compress service. | **1h** |
| PAPYR-093 | **Backend** | **Unit test endpoint protect** | Pytest: test happy path (PDF + valid password), test invalid MIME, test file terlalu besar, test password terlalu pendek (<4 char), test PDF sudah encrypted. Minimal 6 test cases. | **2h** |
| PAPYR-094 | **Frontend** | **Buat halaman /protect dengan UI lengkap** | Layout: upload zone (reuse PDFUploader), input password + confirm password, quality selector (AES-128/AES-256), tombol "Proteksi PDF", area hasil download. Mobile-first responsive. Tambahkan privacy notice. | **3h** |
| PAPYR-095 | **Frontend** | **Password input component dengan validasi** | Component: 2 input fields (password + konfirmasi), show/hide toggle, validasi real-time (min 4 char, match confirmation), strength indicator (weak/medium/strong). Disable tombol proses jika tidak valid. | **2h** |
| PAPYR-096 | **Frontend** | **Integrasi API + state management protect** | Connect ke POST /api/protect. Handle states: idle → uploading → processing → done → error. Progress indicator saat upload. Auto-retry 1x jika network error. Track analytics event: task_started, task_completed, task_failed dengan tool_name="protect". | **2h** |
| PAPYR-097 | **SEO/Content** | **Meta tags + sitemap entry untuk /protect** | Title: "Proteksi PDF dengan Password - Papyr", description unik Bahasa Indonesia. Tambahkan URL /protect ke sitemap.ts. Buat layout.tsx dengan metadata. OG image placeholder. | **1h** |
| PAPYR-098 | **Testing** | **Manual testing protect end-to-end** | Test: upload PDF biasa → protect → download → buka dengan Adobe/browser (harus minta password). Test PDF scan, PDF dengan gambar, PDF besar (15MB). Verify file tidak bisa dibuka tanpa password. | **1h** |

**Acceptance Criteria M12:**
- [ ] User bisa upload PDF dan set password (min 4 karakter)
- [ ] Output PDF terenkripsi AES-256, tidak bisa dibuka tanpa password
- [ ] PDF yang sudah terenkripsi ditolak dengan pesan jelas
- [ ] Signed URL expire dalam 60 menit
- [ ] Analytics event ter-track (started/completed/failed)
- [ ] Halaman /protect ter-index di sitemap
- [ ] 6+ unit tests passing

**API Contract M12:**
```
POST /api/protect
Content-Type: multipart/form-data

Request:
  - file: PDF file (max 20MB)
  - password: string (min 4 chars)
  - encryption: "aes128" | "aes256" (default: "aes256")

Response 200:
  {
    "success": true,
    "download_url": "https://r2.../protected_uuid.pdf",
    "expires_at": "2026-05-01T12:00:00Z",
    "original_size": 1048576,
    "output_size": 1052672
  }

Response 400: { "error": "Password minimal 4 karakter" }
Response 409: { "error": "PDF sudah terenkripsi" }
Response 413: { "error": "File terlalu besar (maks 20MB)" }
Response 429: { "error": "Rate limit exceeded" }
```

---

### M13: Unlock PDF (Remove Password) — 8 tasks | 14 jam | Minggu 2–3

**Deskripsi:** Fitur dekripsi PDF — user upload PDF terenkripsi, masukkan password yang benar, download PDF tanpa proteksi.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-099 | **Backend** | **Buat endpoint POST /api/unlock** | Terima file PDF + password (form-data). Validasi: MIME/ext/magic/size sama seperti protect. Validasi tambahan: PDF HARUS terenkripsi (cek `doc.is_encrypted`), jika tidak encrypted return 400 "PDF ini tidak terproteksi". | **2h** |
| PAPYR-100 | **Backend** | **Implementasi dekripsi PDF dengan PyMuPDF** | Gunakan `fitz.open(file, password=password)`. Jika password salah, PyMuPDF raise exception → return 401 "Password salah". Jika berhasil, save tanpa encryption: `doc.save(output, encryption=0)`. | **2h** |
| PAPYR-101 | **Backend** | **Upload hasil unlock ke R2 + signed URL** | Simpan output ke R2 dengan UUID filename prefix `unlocked_`. Return signed URL expire 60 menit. Reuse R2 utility. | **1h** |
| PAPYR-102 | **Backend** | **Refactor shared encryption utils** | Extract shared logic antara protect dan unlock ke `services/encryption.py`: validasi PDF, check encrypted status, common error handling. DRY principle. | **2h** |
| PAPYR-103 | **Backend** | **Unit test endpoint unlock** | Pytest: test happy path (encrypted PDF + correct password), test wrong password (401), test non-encrypted PDF (400), test invalid file, test corrupted PDF. Minimal 6 test cases. | **2h** |
| PAPYR-104 | **Frontend** | **Buat halaman /unlock dengan UI lengkap** | Layout: upload zone, single password input (dengan show/hide toggle), tombol "Hapus Password", area hasil download. Tampilkan status "PDF terenkripsi terdeteksi" setelah upload. Mobile-first. Privacy notice. | **3h** |
| PAPYR-105 | **Frontend** | **Integrasi API + state management unlock** | Connect ke POST /api/unlock. Handle states + error khusus: "Password salah" (401), "PDF tidak terproteksi" (400). Track analytics events. Auto-retry 1x untuk network error (bukan auth error). | **1h** |
| PAPYR-106 | **SEO/Content** | **Meta tags + sitemap entry untuk /unlock** | Title: "Hapus Password PDF - Papyr", description Bahasa Indonesia. Tambahkan /unlock ke sitemap.ts. Layout.tsx metadata. OG image placeholder. | **1h** |

**Acceptance Criteria M13:**
- [ ] User bisa upload encrypted PDF + password → download PDF tanpa proteksi
- [ ] Password salah menghasilkan error 401 yang jelas
- [ ] PDF non-encrypted ditolak dengan pesan informatif
- [ ] Shared encryption logic di-refactor (DRY dengan M12)
- [ ] Analytics event ter-track
- [ ] 6+ unit tests passing
- [ ] Halaman /unlock ter-index di sitemap

**API Contract M13:**
```
POST /api/unlock
Content-Type: multipart/form-data

Request:
  - file: PDF file (max 20MB, must be encrypted)
  - password: string

Response 200:
  {
    "success": true,
    "download_url": "https://r2.../unlocked_uuid.pdf",
    "expires_at": "2026-05-01T12:00:00Z",
    "original_size": 1052672,
    "output_size": 1048576
  }

Response 400: { "error": "PDF ini tidak terproteksi" }
Response 401: { "error": "Password salah" }
Response 413: { "error": "File terlalu besar (maks 20MB)" }
```

**Shared Module: `services/encryption.py`**
```python
# Shared antara protect dan unlock
class EncryptionService:
    def validate_pdf(file) -> ValidationResult
    def is_encrypted(doc) -> bool
    def encrypt_pdf(doc, password, method) -> bytes
    def decrypt_pdf(doc, password) -> bytes
```

---

### M14: Watermark PDF — 10 tasks | 20 jam | Minggu 3–5

**Deskripsi:** Fitur tambah watermark ke PDF. Text watermark diproses client-side (pdf-lib), image watermark diproses server-side (PyMuPDF). Preview sebelum apply.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-107 | **Frontend** | **Buat halaman /watermark dengan UI lengkap** | Layout: upload zone, tab selector (Text/Image watermark), konfigurasi panel, preview area, tombol "Terapkan Watermark". Responsive mobile-first. | **3h** |
| PAPYR-108 | **Frontend** | **Watermark config panel — text mode** | Input fields: teks watermark, font size (12-72pt slider), opacity (10-100% slider), rotation (-45° to 45° slider), warna (color picker, default #CCCCCC), posisi (center/diagonal/corner grid selector). Real-time preview update. | **3h** |
| PAPYR-109 | **Frontend** | **Watermark config panel — image mode** | Upload gambar watermark (PNG/JPG, maks 2MB), opacity slider, posisi (9-grid selector: top-left, top-center, ..., bottom-right), scale slider (10-100%). Preview thumbnail gambar yang diupload. | **2h** |
| PAPYR-110 | **Frontend** | **Preview watermark pada halaman pertama PDF** | Render halaman pertama PDF ke canvas (pdf-lib + canvas API). Overlay watermark config di atas preview. Update real-time saat user ubah setting. Ini preview saja, bukan processing final. | **3h** |
| PAPYR-111 | **Frontend** | **Text watermark processing client-side (pdf-lib)** | Gunakan pdf-lib: iterate semua halaman, `page.drawText()` dengan opacity, rotation, dan posisi sesuai config. Font: Helvetica (built-in pdf-lib). Output: download langsung dari browser. | **3h** |
| PAPYR-112 | **Backend** | **Buat endpoint POST /api/watermark untuk image watermark** | Terima: PDF file + watermark image + config JSON (opacity, position, scale). Validasi kedua file. Gunakan PyMuPDF: `page.insert_image()` pada setiap halaman dengan rect dan overlay=True. Upload ke R2, return signed URL. | **3h** |
| PAPYR-113 | **Backend** | **Unit test endpoint watermark** | Pytest: test image watermark happy path, test invalid PDF, test invalid image format, test config validation (opacity out of range, dll). Minimal 5 test cases. | **2h** |
| PAPYR-114 | **Frontend** | **Integrasi API untuk image watermark + fallback** | Jika mode image: upload ke /api/watermark. Handle upload progress untuk 2 files (PDF + image). State management: idle → uploading → processing → done. Track analytics events. | **1h** |
| PAPYR-115 | **SEO/Content** | **Meta tags + sitemap entry untuk /watermark** | Title: "Tambah Watermark PDF - Papyr", description Bahasa Indonesia. Sitemap entry. Layout.tsx metadata. OG image placeholder. | **1h** |
| PAPYR-116 | **Testing** | **Manual testing watermark end-to-end** | Test text watermark: berbagai font size, opacity, rotation. Test image watermark: PNG transparent, JPG. Verify watermark muncul di semua halaman. Test PDF landscape dan portrait. | **1h** |

**Acceptance Criteria M14:**
- [ ] Text watermark diproses 100% client-side (zero upload)
- [ ] Image watermark diproses server-side via /api/watermark
- [ ] Preview real-time sebelum apply (halaman pertama)
- [ ] Watermark muncul di SEMUA halaman PDF
- [ ] Config lengkap: opacity, rotation, posisi, ukuran, warna
- [ ] Analytics event ter-track
- [ ] 5+ unit tests passing
- [ ] Halaman /watermark ter-index di sitemap

**API Contract M14 (Image Watermark Only):**
```
POST /api/watermark
Content-Type: multipart/form-data

Request:
  - file: PDF file (max 20MB)
  - watermark_image: PNG/JPG file (max 2MB)
  - config: JSON string {
      "opacity": 0.3,        // 0.1 - 1.0
      "position": "center",  // center|top-left|top-right|bottom-left|bottom-right|...
      "scale": 0.5           // 0.1 - 1.0 (relative to page size)
    }

Response 200:
  {
    "success": true,
    "download_url": "https://r2.../watermarked_uuid.pdf",
    "expires_at": "2026-05-01T12:00:00Z",
    "pages_processed": 12
  }
```

**Client-Side Text Watermark Config Interface:**
```typescript
interface WatermarkConfig {
  text: string;           // max 50 chars
  fontSize: number;       // 12-72
  opacity: number;        // 0.1-1.0
  rotation: number;       // -45 to 45 degrees
  color: string;          // hex color e.g. "#CCCCCC"
  position: "center" | "diagonal" | "top" | "bottom";
}
```

---

### M15: Sign PDF (Digital Signature) — 11 tasks | 24 jam | Minggu 5–7

**Deskripsi:** Fitur tanda tangan digital — user gambar tanda tangan di canvas atau upload gambar signature, lalu drag-and-place pada halaman PDF. 100% client-side.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-117 | **Frontend** | **Buat halaman /sign dengan layout utama** | Layout: upload zone, signature creation area, PDF viewer area dengan page navigation, tombol "Tanda Tangani PDF". Two-step flow: (1) buat signature, (2) tempatkan di PDF. | **2h** |
| PAPYR-118 | **Frontend** | **Signature pad component (draw mode)** | Canvas-based drawing pad menggunakan HTML5 Canvas API. Fitur: draw dengan mouse/touch, clear button, undo last stroke, line width selector (thin/medium/thick), warna (hitam/biru). Export ke PNG transparent. Responsive touch support untuk mobile. | **4h** |
| PAPYR-119 | **Frontend** | **Signature upload mode (image)** | Upload gambar tanda tangan (PNG/JPG, maks 1MB). Auto-crop whitespace. Preview thumbnail. Option: remove background (convert white to transparent menggunakan canvas pixel manipulation). | **2h** |
| PAPYR-120 | **Frontend** | **PDF page viewer dengan navigasi** | Render PDF pages menggunakan pdf-lib + canvas. Page navigation: prev/next buttons, page number indicator (e.g., "Halaman 3 dari 12"). Zoom controls (fit-width default). Render satu halaman pada satu waktu untuk performa. | **3h** |
| PAPYR-121 | **Frontend** | **Drag-and-drop signature placement** | Signature image bisa di-drag ke posisi manapun di halaman PDF. Resize handles (corner drag to resize). Position indicator (x, y coordinates). Signature stays within page bounds. Touch support untuk mobile drag. | **4h** |
| PAPYR-122 | **Frontend** | **Multi-page signature support** | User bisa navigate ke halaman lain dan place signature tambahan. List of placed signatures dengan delete option per signature. "Terapkan ke semua halaman" checkbox option. | **2h** |
| PAPYR-123 | **Frontend** | **Apply signature ke PDF (pdf-lib)** | Gunakan pdf-lib: convert signature PNG ke embedded image, `page.drawImage()` pada koordinat yang dipilih user (convert canvas coords ke PDF coords). Handle multiple signatures di multiple pages. Output: download langsung. | **3h** |
| PAPYR-124 | **Frontend** | **Signature type text mode** | Alternatif: user ketik nama, pilih font style (3-4 pilihan script/handwriting-like fonts dari Google Fonts). Render text ke canvas, export sebagai signature image. | **2h** |
| PAPYR-125 | **Frontend** | **Integrasi state management + analytics** | Global state: current signature, placed signatures array [{page, x, y, width, height}], current page. Track analytics: task_started (saat upload PDF), task_completed (saat download). Semua client-side, tidak ada API call. | **1h** |
| PAPYR-126 | **SEO/Content** | **Meta tags + sitemap entry untuk /sign** | Title: "Tanda Tangani PDF Online - Papyr", description Bahasa Indonesia. Sitemap entry. Layout.tsx metadata. OG image placeholder. | **1h** |
| PAPYR-127 | **Testing** | **Manual testing sign end-to-end** | Test draw signature + place + download. Test upload signature image. Test multi-page placement. Test pada mobile (touch draw + touch drag). Verify signature muncul di output PDF. | **1h** |

**Acceptance Criteria M15:**
- [ ] 100% client-side processing (zero upload ke server)
- [ ] 3 mode signature: draw, upload image, type text
- [ ] Drag-and-drop placement dengan resize
- [ ] Multi-page support (signature di halaman berbeda)
- [ ] Touch support untuk mobile (draw + drag)
- [ ] Output PDF dengan signature embedded (bukan overlay)
- [ ] Analytics event ter-track
- [ ] Halaman /sign ter-index di sitemap

**State Management Interface M15:**
```typescript
interface SignatureState {
  mode: "draw" | "upload" | "type";
  signatureImage: string | null;  // base64 PNG
  placements: SignaturePlacement[];
  currentPage: number;
  totalPages: number;
  pdfFile: File | null;
}

interface SignaturePlacement {
  id: string;
  page: number;       // 1-indexed
  x: number;          // 0-1 relative to page width
  y: number;          // 0-1 relative to page height
  width: number;      // 0-1 relative to page width
  height: number;     // 0-1 relative to page height
}
```

**Font Options untuk Type Mode:**
| Font | Style | Sumber |
|------|-------|--------|
| Dancing Script | Cursive handwriting | Google Fonts |
| Caveat | Casual handwriting | Google Fonts |
| Satisfy | Elegant script | Google Fonts |
| Pacifico | Bold script | Google Fonts |

---

### M16: PDF-to-Word — 10 tasks | 22 jam | Minggu 7–9

**Deskripsi:** Konversi PDF ke DOCX menggunakan LibreOffice headless di server. Heavy processing — perlu queue system untuk file besar.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-128 | **Infra** | **Install LibreOffice headless di Docker/Railway** | Update Dockerfile: `apt-get install libreoffice-writer libreoffice-common`. Verify instalasi dengan `libreoffice --headless --version`. Estimasi tambahan image size ~200MB. Test conversion sederhana di container. | **3h** |
| PAPYR-129 | **Backend** | **Buat endpoint POST /api/pdf-to-word** | Terima file PDF. Validasi: MIME/ext/magic/size (maks 20MB). Tambahan validasi: jumlah halaman maks 100 (untuk mencegah timeout). Return 413 jika terlalu besar/panjang. | **2h** |
| PAPYR-130 | **Backend** | **Implementasi konversi PDF→DOCX dengan LibreOffice** | Gunakan subprocess: `libreoffice --headless --convert-to docx --outdir /tmp/output input.pdf`. Handle timeout (maks 120 detik per file). Parse output filename. Error handling jika conversion gagal. | **3h** |
| PAPYR-131 | **Backend** | **Async processing dengan background task** | Gunakan FastAPI BackgroundTasks atau asyncio untuk processing. Endpoint return 202 Accepted + task_id. Polling endpoint GET /api/status/{task_id} untuk cek progress. Status: queued → processing → done → failed. | **3h** |
| PAPYR-132 | **Backend** | **Upload hasil DOCX ke R2 + signed URL** | Simpan output DOCX ke R2 dengan prefix `converted_`. Return signed URL expire 60 menit. Cleanup temp files setelah upload. | **1h** |
| PAPYR-133 | **Backend** | **Unit test endpoint pdf-to-word** | Pytest: test happy path (simple PDF → DOCX), test file terlalu besar, test PDF dengan banyak halaman (>100), test timeout handling, test invalid file. Minimal 5 test cases. Mock LibreOffice untuk CI. | **2h** |
| PAPYR-134 | **Frontend** | **Buat halaman /pdf-to-word dengan UI lengkap** | Layout: upload zone, progress indicator (upload → converting → done), estimated time display, download area. Tampilkan warning: "Konversi file besar mungkin memakan waktu 1-2 menit". Mobile-first. | **3h** |
| PAPYR-135 | **Frontend** | **Polling mechanism untuk async processing** | Poll GET /api/status/{task_id} setiap 3 detik. Update UI: progress bar atau spinner dengan status text. Timeout client-side: 3 menit maks, tampilkan error jika timeout. Handle: task done → show download button. | **2h** |
| PAPYR-136 | **Frontend** | **Integrasi analytics + error handling** | Track events: task_started, task_completed (dengan duration_ms), task_failed (dengan error_type). Handle edge cases: user close tab saat processing (file tetap tersedia via URL selama 60 menit). | **1h** |
| PAPYR-137 | **SEO/Content** | **Meta tags + sitemap entry untuk /pdf-to-word** | Title: "Konversi PDF ke Word (DOCX) - Papyr", description Bahasa Indonesia. Sitemap entry. Layout.tsx metadata. OG image placeholder. | **1h** |

**Acceptance Criteria M16:**
- [ ] PDF berhasil dikonversi ke DOCX yang bisa dibuka di MS Word/Google Docs
- [ ] Async processing: user tidak perlu menunggu di halaman (polling)
- [ ] Timeout handling: maks 120 detik per file, pesan jelas jika timeout
- [ ] Limit: maks 20MB, maks 100 halaman
- [ ] LibreOffice headless terinstall dan berjalan di Railway container
- [ ] Analytics event ter-track
- [ ] 5+ unit tests passing
- [ ] Halaman /pdf-to-word ter-index di sitemap

**API Contract M16:**
```
POST /api/pdf-to-word
Content-Type: multipart/form-data

Request:
  - file: PDF file (max 20MB, max 100 pages)

Response 202 (Accepted):
  {
    "task_id": "uuid-task-id",
    "status": "queued",
    "estimated_seconds": 30
  }

GET /api/status/{task_id}

Response 200 (Processing):
  {
    "task_id": "uuid-task-id",
    "status": "processing",  // queued | processing | done | failed
    "progress": 0.5,
    "started_at": "2026-05-01T12:00:00Z"
  }

Response 200 (Done):
  {
    "task_id": "uuid-task-id",
    "status": "done",
    "download_url": "https://r2.../converted_uuid.docx",
    "expires_at": "2026-05-01T13:00:00Z",
    "duration_ms": 15000
  }

Response 200 (Failed):
  {
    "task_id": "uuid-task-id",
    "status": "failed",
    "error": "Conversion timeout (>120s)"
  }
```

**Dockerfile Addition M16:**
```dockerfile
# LibreOffice headless untuk PDF-to-Word conversion
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice-writer \
    libreoffice-common \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
```

---

### M17: OCR (Optical Character Recognition) — 11 tasks | 26 jam | Minggu 9–11

**Deskripsi:** Tambah text layer ke scanned PDF menggunakan ocrmypdf + Tesseract. Support bahasa Indonesia dan English. Output: searchable PDF.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-138 | **Infra** | **Install Tesseract + ocrmypdf di Docker** | Update Dockerfile: `apt-get install tesseract-ocr tesseract-ocr-ind tesseract-ocr-eng`. Install ocrmypdf via pip. Verify: `tesseract --list-langs` harus include `ind` dan `eng`. Test OCR sederhana di container. | **3h** |
| PAPYR-139 | **Infra** | **Optimasi Docker image size** | LibreOffice + Tesseract = image besar. Multi-stage build: separate build stage dan runtime stage. Target: runtime image < 1.5GB. Evaluate apakah perlu split ke 2 services terpisah. | **2h** |
| PAPYR-140 | **Backend** | **Buat endpoint POST /api/ocr** | Terima file PDF + language parameter (ind/eng/ind+eng). Validasi: MIME/ext/magic/size maks 20MB. Validasi tambahan: maks 50 halaman (OCR sangat lambat). Return 400 jika bukan scanned PDF (optional heuristic: cek apakah sudah ada text layer). | **2h** |
| PAPYR-141 | **Backend** | **Implementasi OCR dengan ocrmypdf** | Gunakan ocrmypdf Python API: `ocrmypdf.ocr(input, output, language=lang, deskew=True, optimize=1)`. Options: deskew (straighten pages), optimize (reduce output size), skip_text (skip pages yang sudah ada text). Handle timeout 180 detik. | **3h** |
| PAPYR-142 | **Backend** | **Async processing untuk OCR (reuse M16 pattern)** | Reuse async task pattern dari M16: POST return 202 + task_id, GET /api/status/{task_id} untuk polling. OCR lebih lambat dari PDF-to-Word, timeout 180 detik. | **2h** |
| PAPYR-143 | **Backend** | **Upload hasil OCR ke R2 + signed URL** | Simpan searchable PDF ke R2 dengan prefix `ocr_`. Return signed URL expire 60 menit. Include metadata: jumlah halaman processed, language used. | **1h** |
| PAPYR-144 | **Backend** | **Unit test endpoint OCR** | Pytest: test happy path (scanned PDF → searchable PDF), test language selection, test file terlalu besar, test non-PDF file, test already-searchable PDF (skip). Minimal 5 test cases. Gunakan small test PDF fixture. | **2h** |
| PAPYR-145 | **Frontend** | **Buat halaman /ocr dengan UI lengkap** | Layout: upload zone, language selector dropdown (Indonesia/English/Keduanya), info box "OCR mengubah PDF scan menjadi PDF yang bisa dicari teksnya", progress indicator, download area. Warning: "Proses OCR memakan waktu 1-3 menit". | **3h** |
| PAPYR-146 | **Frontend** | **Polling + progress UI untuk OCR** | Reuse polling mechanism dari M16. Tambahan: estimated time based on page count (tampilkan "Estimasi: ~2 menit untuk 10 halaman"). Progress states: uploading → queued → processing → done/failed. | **2h** |
| PAPYR-147 | **Frontend** | **Integrasi analytics + error handling OCR** | Track events dengan props: tool_name="ocr", language, page_count, duration_ms. Handle specific errors: timeout (suggest smaller file), language not available, corrupted PDF. | **1h** |
| PAPYR-148 | **SEO/Content** | **Meta tags + sitemap entry untuk /ocr** | Title: "OCR PDF — Ubah Scan Jadi Teks - Papyr", description Bahasa Indonesia fokus use case: scan dokumen, foto dokumen. Sitemap entry. Layout.tsx metadata. | **1h** |

**Acceptance Criteria M17:**
- [ ] Scanned PDF berhasil dikonversi ke searchable PDF (text bisa di-select/search)
- [ ] Support bahasa Indonesia (ind) dan English (eng)
- [ ] Async processing dengan polling (timeout 180 detik)
- [ ] Limit: maks 20MB, maks 50 halaman
- [ ] Tesseract + ocrmypdf terinstall dengan language packs
- [ ] Docker image size teroptimasi (multi-stage build)
- [ ] Analytics event ter-track
- [ ] 5+ unit tests passing
- [ ] Halaman /ocr ter-index di sitemap

**API Contract M17:**
```
POST /api/ocr
Content-Type: multipart/form-data

Request:
  - file: PDF file (max 20MB, max 50 pages)
  - language: "ind" | "eng" | "ind+eng" (default: "ind+eng")

Response 202 (Accepted):
  {
    "task_id": "uuid-task-id",
    "status": "queued",
    "estimated_seconds": 60,
    "page_count": 10
  }

Response 200 (Done - via GET /api/status/{task_id}):
  {
    "task_id": "uuid-task-id",
    "status": "done",
    "download_url": "https://r2.../ocr_uuid.pdf",
    "expires_at": "2026-05-01T13:00:00Z",
    "duration_ms": 45000,
    "pages_processed": 10,
    "language_used": "ind+eng"
  }
```

**Dockerfile Addition M17:**
```dockerfile
# Tesseract OCR dengan language packs Indonesia + English
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-ind \
    tesseract-ocr-eng \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ocrmypdf via pip (sudah di requirements.txt)
# pip install ocrmypdf
```

---

### M18: PDF-to-Excel — 10 tasks | 21 jam | Minggu 11–13

**Deskripsi:** Ekstrak tabel dari PDF ke format XLSX menggunakan camelot/tabula-py + openpyxl. Preview tabel yang terdeteksi sebelum download.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-149 | **Infra** | **Install camelot-py + dependencies di Docker** | Install: `camelot-py[cv]`, `opencv-python-headless`, `ghostscript` (sudah ada), `openpyxl`. Camelot butuh Ghostscript untuk PDF parsing. Verify: `import camelot` berhasil di container. Alternatif fallback: tabula-py jika camelot gagal. | **2h** |
| PAPYR-150 | **Backend** | **Buat endpoint POST /api/pdf-to-excel** | Terima file PDF + options (page range, flavor: lattice/stream). Validasi: MIME/ext/magic/size maks 20MB. Maks 30 halaman. Return 400 jika tidak ada tabel terdeteksi. | **2h** |
| PAPYR-151 | **Backend** | **Implementasi table detection dengan camelot** | Gunakan `camelot.read_pdf(file, pages=range, flavor='lattice')`. Fallback ke `flavor='stream'` jika lattice tidak detect tabel. Return metadata: jumlah tabel, dimensi tiap tabel (rows x cols), accuracy score. | **3h** |
| PAPYR-152 | **Backend** | **Konversi tabel ke XLSX dengan openpyxl** | Iterate detected tables, tulis ke Excel workbook. Setiap tabel jadi sheet terpisah (Sheet1_Table1, Sheet1_Table2, dst). Format: auto-width columns, header row bold. Simpan ke temp file. | **3h** |
| PAPYR-153 | **Backend** | **Endpoint preview: GET /api/pdf-to-excel/preview** | Endpoint terpisah: upload PDF, return JSON preview tabel yang terdeteksi (first 5 rows per table). User bisa review sebelum full conversion. Include: table count, dimensions, sample data. | **2h** |
| PAPYR-154 | **Backend** | **Upload hasil XLSX ke R2 + signed URL** | Simpan output XLSX ke R2 dengan prefix `table_`. Return signed URL expire 60 menit. Cleanup temp files. | **1h** |
| PAPYR-155 | **Backend** | **Unit test endpoint pdf-to-excel** | Pytest: test PDF dengan tabel jelas (lattice), test PDF tanpa tabel (return 400), test stream flavor, test page range, test file invalid. Minimal 5 test cases. Gunakan test PDF fixture dengan tabel sederhana. | **2h** |
| PAPYR-156 | **Frontend** | **Buat halaman /pdf-to-excel dengan UI lengkap** | Layout: upload zone, preview area (tabel HTML), page range input (optional), tombol "Konversi ke Excel", download area. Info: "Papyr mendeteksi tabel di PDF Anda dan mengekstraknya ke Excel". | **3h** |
| PAPYR-157 | **Frontend** | **Preview tabel + integrasi API** | Setelah upload: call preview endpoint, tampilkan tabel terdeteksi dalam format HTML table (first 5 rows). User confirm → call full conversion endpoint. Handle: no tables found (tampilkan pesan + suggest OCR dulu jika scanned). Track analytics. | **2h** |
| PAPYR-158 | **SEO/Content** | **Meta tags + sitemap entry untuk /pdf-to-excel** | Title: "Konversi PDF ke Excel (XLSX) - Papyr", description Bahasa Indonesia fokus use case: laporan keuangan, invoice, data tabel. Sitemap entry. Layout.tsx metadata. | **1h** |

**Acceptance Criteria M18:**
- [ ] Tabel di PDF berhasil diekstrak ke XLSX yang bisa dibuka di Excel/Google Sheets
- [ ] Preview tabel sebelum conversion (user bisa review)
- [ ] Support 2 detection mode: lattice (tabel bergaris) dan stream (tabel tanpa garis)
- [ ] Multiple tabel → multiple sheets dalam 1 XLSX
- [ ] Handle "no tables found" dengan pesan informatif
- [ ] Limit: maks 20MB, maks 30 halaman
- [ ] Analytics event ter-track
- [ ] 5+ unit tests passing
- [ ] Halaman /pdf-to-excel ter-index di sitemap

**API Contract M18:**
```
POST /api/pdf-to-excel/preview
Content-Type: multipart/form-data

Request:
  - file: PDF file (max 20MB)
  - pages: string (e.g., "1-5" or "all", default: "all", max 30)
  - flavor: "lattice" | "stream" (default: "lattice")

Response 200:
  {
    "tables_found": 3,
    "tables": [
      {
        "page": 1,
        "rows": 25,
        "cols": 5,
        "accuracy": 0.92,
        "preview": [["Header1", "Header2", ...], ["row1col1", ...], ...]  // first 5 rows
      }
    ]
  }

Response 400: { "error": "Tidak ada tabel terdeteksi di PDF ini" }

POST /api/pdf-to-excel
Content-Type: multipart/form-data

Request:
  - file: PDF file (max 20MB)
  - pages: string
  - flavor: "lattice" | "stream"

Response 200:
  {
    "success": true,
    "download_url": "https://r2.../table_uuid.xlsx",
    "expires_at": "2026-05-01T13:00:00Z",
    "tables_extracted": 3,
    "sheets_created": 3
  }
```

---

### M19: E2E Testing + Code Quality — 10 tasks | 12 jam | Minggu 13–14

**Deskripsi:** Setup Playwright untuk E2E testing semua 13 tools. Setup code formatting (Prettier + Ruff). Update CI/CD pipeline.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-159 | **Testing** | **Setup Playwright di frontend project** | `npm init playwright@latest`. Config: chromium + firefox browsers, base URL localhost:3000, screenshot on failure, video on retry. Folder structure: `e2e/` di root frontend. Setup `playwright.config.ts`. | **1h** |
| PAPYR-160 | **Testing** | **E2E tests untuk client-side tools (4 tools)** | Buat E2E test untuk: Merge, Split, Rotate, Sign. Setiap test: navigate → upload test PDF → configure → process → verify download. Gunakan test PDF fixtures di `e2e/fixtures/`. Minimal 1 happy path + 1 error case per tool. | **2h** |
| PAPYR-161 | **Testing** | **E2E tests untuk server-side tools (7 tools)** | Buat E2E test untuk: Compress, Protect, Unlock, Watermark (image), PDF-to-Image, PDF-to-Word, OCR. Setiap test: navigate → upload → wait for processing → verify download link appears. Mock backend jika terlalu lambat untuk CI. | **3h** |
| PAPYR-162 | **Testing** | **E2E tests untuk PDF-to-Excel dan Image-to-PDF** | Test PDF-to-Excel: upload PDF dengan tabel → preview muncul → convert → download. Test Image-to-PDF: upload multiple images → reorder → convert → download. | **1h** |
| PAPYR-163 | **Testing** | **E2E test landing page + navigation** | Test: landing page loads, semua 13 tool cards visible, click tool card → navigate ke tool page, navbar links work, footer links work, mobile hamburger menu. | **1h** |
| PAPYR-164 | **Infra** | **Setup Prettier untuk frontend** | Install prettier + eslint-config-prettier. Config `.prettierrc`: semi, singleQuote, tabWidth 2, trailingComma all. Add script: `npm run format` dan `npm run format:check`. Format seluruh codebase. | **1h** |
| PAPYR-165 | **Infra** | **Setup Ruff untuk backend** | Install ruff. Config `ruff.toml`: line-length 100, select rules (E, F, I, W), target Python 3.11. Add script di Makefile/pyproject.toml: `ruff check .` dan `ruff format .`. Format seluruh codebase backend. | **1h** |
| PAPYR-166 | **Deploy** | **Update CI/CD: tambah E2E test job** | Update GitHub Actions workflow: tambah job `e2e` yang run setelah `build` pass. Install Playwright browsers di CI. Run E2E tests against built app (next start). Upload test artifacts (screenshots/videos) on failure. | **2h** |
| PAPYR-167 | **Deploy** | **Update CI/CD: tambah lint/format check** | Update workflow: tambah step `prettier --check .` di frontend job, `ruff check .` di backend job. Fail CI jika format tidak sesuai. Ini enforce code quality di setiap PR. | **1h** |
| PAPYR-168 | **Testing** | **Verify semua tests pass di CI** | Run full CI pipeline: lint → unit tests → build → E2E. Fix flaky tests jika ada. Verify: semua 23 vitest + 34 pytest + new E2E tests pass. Document test coverage summary. | **1h** |

**Acceptance Criteria M19:**
- [ ] Playwright tersetup dengan config untuk chromium + firefox
- [ ] E2E tests cover semua 13 tools (minimal happy path)
- [ ] Prettier tersetup dan seluruh frontend code terformat
- [ ] Ruff tersetup dan seluruh backend code terformat
- [ ] CI/CD pipeline include: lint check + unit tests + build + E2E tests
- [ ] Semua tests pass di CI (zero failures)
- [ ] Screenshot/video artifacts tersimpan saat test gagal

**Test Coverage Target M19:**

| Kategori | Tools | Test Cases | Estimasi |
|----------|-------|-----------|----------|
| Client-side | Merge, Split, Rotate, Sign | 8 tests (2 per tool) | Happy path + error |
| Server-side (sync) | Compress, Protect, Unlock, Watermark, PDF-to-Image | 10 tests (2 per tool) | Happy path + error |
| Server-side (async) | PDF-to-Word, OCR | 4 tests (2 per tool) | Happy path + timeout |
| Hybrid | Image-to-PDF, PDF-to-Excel | 4 tests (2 per tool) | Happy path + edge case |
| Navigation | Landing, Navbar, Footer | 3 tests | Links + responsive |
| **Total** | **13 tools + nav** | **~29 E2E tests** | |

**CI/CD Pipeline Updated:**
```yaml
# .github/workflows/ci.yml (simplified)
jobs:
  frontend-lint:
    - prettier --check .
    - eslint .
  
  frontend-test:
    - vitest run (23+ unit tests)
  
  frontend-build:
    - next build
  
  backend-lint:
    - ruff check .
    - ruff format --check .
  
  backend-test:
    - pytest (34+ unit tests)
  
  e2e:  # NEW
    needs: [frontend-build, backend-test]
    - npx playwright install
    - npx playwright test (29+ E2E tests)
    - Upload artifacts on failure
```

---

### M20: Performance, Monitoring & SEO — 10 tasks | 8 jam | Minggu 14–15

**Deskripsi:** Optimasi performa (Lighthouse), setup monitoring (uptime + alerts), update SEO untuk 13 tools.

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-169 | **Frontend** | **Lighthouse audit + bundle analysis** | Run Lighthouse CI pada semua tool pages. Target: Performance >90, Accessibility >95, SEO >95. Jalankan `next build --analyze` untuk identifikasi bundle besar. Dokumentasikan findings. | **1h** |
| PAPYR-170 | **Frontend** | **Performance optimization berdasarkan audit** | Implementasi: lazy load tool pages (dynamic import), optimize images (next/image), preload critical fonts, reduce unused JS. Target: LCP < 2.5s, FID < 100ms, CLS < 0.1 pada mobile 4G. | **2h** |
| PAPYR-171 | **Infra** | **Setup uptime monitoring (BetterStack)** | Daftar BetterStack (free tier). Monitor: frontend (mypapyr.com), backend health (/health), R2 connectivity. Check interval: 3 menit. Alert channel: Telegram bot. | **1h** |
| PAPYR-172 | **Infra** | **Setup Telegram alert bot** | Buat Telegram bot via BotFather. Integrate dengan BetterStack webhook. Alert triggers: downtime > 3 menit, response time > 5 detik, SSL expiry < 14 hari. Test alert delivery. | **1h** |
| PAPYR-173 | **SEO/Content** | **Update landing page grid untuk 13 tools** | Update landing page: grid layout menampilkan semua 13 tools (6 existing + 7 baru). Setiap card: icon, nama tool, deskripsi 1 baris, link ke tool page. Responsive: 3 kolom desktop, 2 tablet, 1 mobile. | **1h** |
| PAPYR-174 | **SEO/Content** | **Update sitemap untuk 13 tools** | Verify sitemap.ts include semua 13 tool URLs + landing page + privacy + FAQ. Total: minimal 16 URLs. Set priority: homepage 1.0, tools 0.8, info pages 0.5. Resubmit ke Google Search Console. | **0.5h** |
| PAPYR-175 | **SEO/Content** | **Generate OG images untuk 7 tools baru** | Buat OG image (1200x630) untuk setiap tool baru: protect, unlock, watermark, sign, pdf-to-word, ocr, pdf-to-excel. Consistent branding: Papyr logo + tool name + tagline. Simpan di public/og/. | **1h** |
| PAPYR-176 | **Frontend** | **Update analytics event taxonomy** | Verify semua 13 tools track events: task_started, task_completed, task_failed. Tambahkan props: tool_name, file_size_mb, processing_time_ms, device_category. Update analytics.ts helper. | **0.5h** |
| PAPYR-177 | **Frontend** | **Update Navbar + Footer untuk 13 tools** | Update Navbar dropdown/menu: tampilkan semua 13 tools grouped by category (Security, Enhancement, Conversion, Basic). Update Footer tool links. Mobile hamburger menu update. | **1h** |
| PAPYR-178 | **Deploy** | **Final deploy + smoke test MVP 0.2** | Deploy semua changes ke production (Vercel + Railway). Smoke test: setiap tool accessible, health check OK, monitoring active, sitemap valid. Tag release v2.0.0. Update README roadmap. | **1h** |

**Acceptance Criteria M20:**
- [ ] Lighthouse score: Performance >90, Accessibility >95, SEO >95
- [ ] Bundle size optimized (lazy loading, code splitting)
- [ ] Uptime monitoring aktif (BetterStack) dengan Telegram alerts
- [ ] Landing page menampilkan grid 13 tools
- [ ] Sitemap include semua 13 tool URLs
- [ ] OG images tersedia untuk semua 7 tools baru
- [ ] Analytics events ter-track untuk semua 13 tools
- [ ] Navbar/Footer updated untuk 13 tools
- [ ] Production deploy sukses, smoke test pass

**Monitoring Setup Detail:**

| Monitor | URL | Interval | Alert |
|---------|-----|----------|-------|
| Frontend | https://mypapyr.com | 3 min | Telegram |
| Backend Health | https://papyr-production.up.railway.app/health | 3 min | Telegram |
| SSL Certificate | mypapyr.com | Daily | Telegram (14 days before expiry) |

**Sitemap URLs (16 total):**
```
https://mypapyr.com/                    (priority: 1.0)
https://mypapyr.com/compress            (priority: 0.8)
https://mypapyr.com/merge               (priority: 0.8)
https://mypapyr.com/split               (priority: 0.8)
https://mypapyr.com/rotate              (priority: 0.8)
https://mypapyr.com/image-to-pdf        (priority: 0.8)
https://mypapyr.com/pdf-to-image        (priority: 0.8)
https://mypapyr.com/protect             (priority: 0.8)  ← NEW
https://mypapyr.com/unlock              (priority: 0.8)  ← NEW
https://mypapyr.com/watermark           (priority: 0.8)  ← NEW
https://mypapyr.com/sign                (priority: 0.8)  ← NEW
https://mypapyr.com/pdf-to-word         (priority: 0.8)  ← NEW
https://mypapyr.com/ocr                 (priority: 0.8)  ← NEW
https://mypapyr.com/pdf-to-excel        (priority: 0.8)  ← NEW
https://mypapyr.com/privacy             (priority: 0.5)
https://mypapyr.com/faq                 (priority: 0.5)
```

**Navbar Tool Categories:**
```
Alat Dasar:     Compress | Merge | Split | Rotate
Keamanan:       Protect | Unlock
Enhancement:    Watermark | Sign
Konversi:       Image-to-PDF | PDF-to-Image | PDF-to-Word | OCR | PDF-to-Excel
```

---

### Milestone 21 — OpenClaw AI Agent (Fase 2E)

**Fase:** 2E — OpenClaw
**Estimasi:** ~100 jam
**Dependensi:** Fase 2D complete (product stable)
**Deployment:** HostData.id VPS (dedicated)
**Dokumen Lengkap:** PPR-CLAW-001 (30_Papyr_OpenClaw_v1.0.md)

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-179 | Infra | Setup VPS & Docker | Provisioning HostData.id VPS, install Docker, Docker Compose, setup networking | 4 |
| PAPYR-180 | Infra | Setup PostgreSQL + Redis | Docker containers untuk PostgreSQL 16 + Redis 7, schema `openclaw`, initial migration | 4 |
| PAPYR-181 | Backend | Core Framework | Project scaffold: TypeScript, BullMQ event bus, LLM client (enowxAI), persona manager, decision engine | 8 |
| PAPYR-182 | Backend | SOUL.md + HEARTBEAT.md | Implementasi SOUL.md parser, HEARTBEAT.md scheduler, persona switching, cron job registration | 6 |
| PAPYR-183 | Backend | Agent: SEO Pipeline (Aksara) | Keyword research, 4-gate content pipeline, blog publisher, performance tracker | 10 |
| PAPYR-184 | Backend | Agent: Competitor Monitoring (Telik) | Playwright scraper untuk 5 competitors, change detection, weekly report | 8 |
| PAPYR-185 | Backend | Agent: Server Health (Jaga) | Railway/Vercel/R2 monitoring, health checks 60s, auto-remediation, alerting | 8 |
| PAPYR-186 | Backend | Agent: Security Scanning (Tameng) | npm/pip audit, CVE scanner, secret detection, OWASP check, GitHub issue creation | 8 |
| PAPYR-187 | Backend | Agent: Reporting (Warta) | Daily/weekly/monthly report generation, Telegram + Email distribution, R2 archival | 6 |
| PAPYR-188 | Backend | Agent: Self-Improvement (Lontar) | Evaluate→Analyze→Hypothesize→Commit→Modify→Monitor→Decide cycle, rollback safety | 8 |
| PAPYR-189 | Backend | Agent: Project Management (Dalang) | Feedback processing, GitHub issue creation (Octokit), sprint planning, tech debt scan | 6 |
| PAPYR-190 | Backend | Agent: Backup & Verify (Pustaka) | R2 backup, git bundle, env backup (encrypted), weekly verification, DR testing | 6 |
| PAPYR-191 | Backend | Agent: Analytics Intelligence (Prasasti) | Vercel Analytics API, anomaly detection (z-score), tool usage analysis, insights report | 8 |
| PAPYR-192 | Backend | Telegram Bot | grammy bot setup, command handlers, report/alert/approval formats, interactive buttons | 6 |
| PAPYR-193 | Frontend | Dashboard /admin/openclaw | Next.js admin page, agent status, reports viewer, logs, manual override controls, auth | 8 |
| PAPYR-194 | Backend | CLI Interface | commander.js CLI, agent management commands, report generation, config commands | 3 |
| PAPYR-195 | Backend | Error Handling & Resilience | Retry with backoff, circuit breaker, dead letter queue, graceful degradation, alert escalation | 4 |
| PAPYR-196 | Backend | Email Integration (Resend) | Email report templates (HTML), distribution engine, weekly/monthly email reports | 3 |
| PAPYR-197 | Infra | CI/CD Pipeline | GitHub Actions: test → build → deploy to VPS, Docker image registry, rolling updates | 4 |
| PAPYR-198 | Backend | Database Schema & Migrations | 17 tables DDL, Drizzle ORM schema, migration scripts, seed data | 4 |
| PAPYR-199 | Test | Unit Tests | Vitest unit tests untuk semua 9 agents + core framework, mock strategies | 6 |
| PAPYR-200 | Test | Integration Tests | testcontainers (PostgreSQL + Redis), full agent cycle tests, BullMQ queue tests | 6 |
| PAPYR-201 | Test | E2E Tests | Full system test: agent scheduling → execution → reporting → Telegram delivery | 4 |
| PAPYR-202 | Docs | Documentation Update | Update README, deployment runbook, monitoring playbook, internal ops manual untuk OpenClaw | 3 |
| PAPYR-203 | Infra | Production Deployment & Verification | Final deploy, health check verification, first daily report, monitoring confirmation | 4 |
| PAPYR-219 | Backend | Agent: Social Media (Kicau) | Playwright browser automation untuk Twitter/X — posting, thread, reply, engagement, anti-detection | 10 |
| PAPYR-220 | Backend | Twitter Account Setup | Buat akun Twitter baru via Playwright, setup bio/avatar/header, initial follows | 3 |
| PAPYR-221 | Backend | Content Generation Engine | LLM-powered tweet/thread/meme generator, content calendar integration, scheduling | 4 |
| PAPYR-222 | Backend | Reporting: Quarterly & Yearly | Tambah quarterly report (akhir Q) dan yearly report (Januari), PDF generation, email attachment | 4 |
| PAPYR-223 | Backend | Reporting Schedule Update | Migrate reporting ke end-of-period schedule (daily 22:00, weekly Jumat, monthly akhir bulan) | 2 |
| PAPYR-224 | Backend | Incident Auto-Fix Engine | Auto-remediation untuk P0/P1 incidents (restart, redeploy, clear cache) tanpa approval, lapor setelahnya | 4 |

**Total: 31 tasks, ~120 jam**

**Acceptance Criteria M21:**
- [ ] 9 fungsi agent berjalan sesuai jadwal HEARTBEAT.md
- [ ] Telegram Bot aktif dan responsif terhadap commands
- [ ] Dashboard /admin/openclaw menampilkan status real-time
- [ ] Daily report terkirim via Telegram setiap malam (22:00 WIB)
- [ ] Health monitoring mendeteksi downtime dalam < 2 menit
- [ ] Security scan berjalan harian tanpa false positive berlebihan
- [ ] SEO Pipeline menghasilkan minimal 2 artikel/minggu
- [ ] Backup berjalan harian dengan weekly verification pass
- [ ] Total biaya OpenClaw < Rp 150.000/bulan
- [ ] Unit test coverage ≥ 80% untuk core framework
- [ ] CI/CD pipeline green dan auto-deploy berfungsi
- [ ] Twitter/X account aktif dengan minimal 3 posts/minggu
- [ ] Quarterly report terkirim via Telegram + Email (PDF) setiap akhir quarter
- [ ] Yearly report terkirim setiap Januari
- [ ] Incident auto-fix berjalan untuk P0/P1 tanpa approval
- [ ] Daily report schedule updated ke 22:00 WIB (end-of-day)

---

### M22: Admin Dashboard (Fase 2F — Dashboard) — 15 tasks | 35 jam | Minggu 25–28

**Deskripsi:** Unified admin panel di `/admin` route dalam existing Next.js app. Mencakup semua operational monitoring termasuk OpenClaw. 10 modul: OpenClaw Monitoring, Analytics Overview, Server Health, Security Scan, SEO & Competitor Intel, Revenue/Billing (placeholder), System Logs, Backup Status, User Management (placeholder), Settings.

**Ringkasan:**

| Field | Detail |
|-------|--------|
| Milestone | M22 |
| Nama | Admin Dashboard |
| Fase | 2F — Dashboard |
| Estimasi | 35 jam |
| Tasks | 15 tasks |
| Dependensi | M21 (OpenClaw API ready) |
| Label | 🟢 Buildable |

| ID | Layer | Task | Deskripsi | Jam |
|----|-------|------|-----------|-----|
| PAPYR-204 | **Frontend** | **Setup admin route structure + auth middleware** | Buat route group `/admin/*` dengan layout. Middleware auth: cek ADMIN_SECRET env var via cookie/header. Protected routes return 401 jika unauthorized. Setup env variable ADMIN_SECRET. | **3h** |
| PAPYR-205 | **Frontend** | **Create admin layout (sidebar + header)** | Sidebar navigation dengan 10 modul links, header dengan user info, responsive design. Match existing Papyr style: DM Sans font, Tailwind, same color palette. Collapsible sidebar di mobile. | **3h** |
| PAPYR-206 | **Frontend** | **Build OpenClaw Monitoring page** | Agent status cards untuk 9 agents (Aksara, Telik, Jaga, Tameng, Warta, Lontar, Dalang, Pustaka, Prasasti). Tampilkan: last run time, success/fail counts, manual trigger buttons, log viewer per agent. Real-time polling. | **4h** |
| PAPYR-207 | **Frontend** | **Build Analytics Overview page** | Tasks processed chart (daily/weekly/monthly toggle), tool usage breakdown bar chart, device category pie chart, traffic trends line chart. Data dari Vercel Analytics API. | **3h** |
| PAPYR-208 | **Frontend** | **Build Server Health page** | Railway container status, Vercel deployment status, R2 storage usage (bar), response time graphs (line chart), uptime percentage badges. Auto-refresh setiap 60 detik. | **3h** |
| PAPYR-209 | **Frontend** | **Build Security Scan page** | Latest scan results summary, CVE alerts list dengan severity badges (critical/high/medium/low), dependency audit history table, severity breakdown donut chart. Data dari OpenClaw Tameng agent. | **2h** |
| PAPYR-210 | **Frontend** | **Build SEO & Competitor page** | Keyword rankings table (position, change, URL), competitor comparison cards, content pipeline status dari Aksara agent, recent articles list. Data dari OpenClaw Aksara + Telik agents. | **2h** |
| PAPYR-211 | **Frontend** | **Build System Logs page** | Error log viewer dengan filters (severity, tool, date range), rate limit hits counter, failed tasks table, cleanup stats. Pagination, search, export CSV. | **3h** |
| PAPYR-212 | **Frontend** | **Build Backup Status page** | Backup history table (date, size, status), last successful backup highlight, restore test results, storage usage breakdown (R2, git bundle, env). Data dari OpenClaw Pustaka agent. | **2h** |
| PAPYR-213 | **Frontend** | **Build Revenue/Billing placeholder page** | Placeholder UI dengan "Coming in MVP 0.3" banner. Mock revenue chart, subscriber count placeholder, payment history skeleton. Clearly indicate placeholder status. | **1h** |
| PAPYR-214 | **Frontend** | **Build User Management placeholder page** | Placeholder UI dengan "Coming in MVP 0.3" banner. Mock user table, role badges, invite button (disabled). Clearly indicate placeholder status. | **1h** |
| PAPYR-215 | **Frontend** | **Build Settings page** | System config display (read-only), notification preferences (Telegram/Email toggles), ADMIN_SECRET rotation form, API endpoint config display, environment info. | **2h** |
| PAPYR-216 | **Backend** | **Create admin API routes** | Buat `/api/admin/*` endpoints: openclaw/status, openclaw/logs, openclaw/trigger, analytics/overview, health, security/scans, logs, backups. Auth middleware (ADMIN_SECRET check). Error handling + rate limiting. | **3h** |
| PAPYR-217 | **Frontend** | **Admin SEO exclusion** | Tambahkan `/admin` ke sitemap exclusion, robots.txt disallow `/admin`, add noindex meta tag di admin layout. Pastikan admin pages tidak ter-index search engine. | **1h** |
| PAPYR-218 | **Testing** | **Unit tests admin auth + API routes** | Vitest/Pytest: test auth middleware (valid token, invalid token, missing token), test API routes return correct data shape, test 401 rejection. Minimal 8 test cases. | **2h** |

**Acceptance Criteria M22:**
- [ ] Admin dashboard accessible di `/admin` dengan ADMIN_SECRET auth
- [ ] Semua 10 modul render correctly di desktop dan mobile
- [ ] OpenClaw agent status updates via polling (interval 30 detik)
- [ ] Analytics charts menampilkan real data dari Vercel Analytics API
- [ ] Server health menampilkan live status Railway/Vercel/R2
- [ ] Placeholder pages clearly indicate "Coming in MVP 0.3"
- [ ] `/admin` excluded dari sitemap dan robots.txt
- [ ] Auth middleware reject unauthorized access dengan 401
- [ ] UI match existing Papyr design (DM Sans, Tailwind, same color palette)
- [ ] Semua admin API routes punya proper error handling

**API Contract M22:**
```
GET /api/admin/openclaw/status     → { agents: [{name, status, lastRun, successCount, failCount}], lastHeartbeat: ... }
GET /api/admin/openclaw/logs       → { logs: [{agentId, timestamp, level, message}], pagination: {page, total} }
POST /api/admin/openclaw/trigger   → { agentId, result: "triggered" | "already_running" | "error" }
GET /api/admin/analytics/overview  → { tasksToday: number, tasksWeek: number, toolBreakdown: {...}, deviceBreakdown: {...} }
GET /api/admin/health              → { railway: {status, uptime, memory}, vercel: {status, lastDeploy}, r2: {status, usageBytes} }
GET /api/admin/security/scans      → { scans: [{date, findings, severity}], alerts: [{cve, package, severity}] }
GET /api/admin/logs                → { errors: [{timestamp, message, tool, severity}], rateLimits: [{ip, count, window}] }
GET /api/admin/backups             → { backups: [{date, type, size, status}], lastRestore: {date, result} }

Headers (semua endpoint):
  Authorization: Bearer <ADMIN_SECRET>

Response 401: { "error": "Unauthorized" }
Response 500: { "error": "Internal server error", "detail": "..." }
```

---

## Dependency Graph

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                    MVP 0.2 DEPENDENCY GRAPH                  │
                    └─────────────────────────────────────────────────────────────┘

    Fase 2A                Fase 2B                Fase 2C                Fase 2D
    Security                Enhancement             Conversion              Quality
    ────────                ───────────             ──────────              ───────

    ┌───────┐               ┌───────────┐           ┌───────────┐
    │  M12  │               │    M14    │           │    M16    │
    │Protect│               │ Watermark │           │PDF-to-Word│
    │  PDF  │               │    PDF    │           │(LibreOffice)
    └───┬───┘               └───────────┘           └─────┬─────┘
        │                                                 │
        │ shared logic      ┌───────────┐                 │ shared Docker
        │                   │    M15    │                 │ + async pattern
        ▼                   │  Sign PDF │                 ▼
    ┌───────┐               │(client)   │           ┌───────────┐
    │  M13  │               └───────────┘           │    M17    │
    │Unlock │                                       │    OCR    │
    │  PDF  │                                       │(Tesseract)│
    └───────┘                                       └─────┬─────┘
                                                          │
                                                          │ depends on
                                                          │ OCR for scanned
                                                          ▼
                                                    ┌───────────┐
                                                    │    M18    │
                                                    │PDF-to-Excel
                                                    │ (camelot) │
                                                    └───────────┘


    ════════════════════════════════════════════════════════════════════════
    Setelah M12–M18 selesai (semua tools):
    ════════════════════════════════════════════════════════════════════════

                            ┌───────────┐
                            │    M19    │◄──── depends on ALL tools (M12-M18)
                            │E2E Testing│      being complete for full coverage
                            │+ Code Qual│
                            └─────┬─────┘
                                  │
                                  │ CI/CD must pass
                                  ▼
                            ┌───────────┐
                            │    M20    │◄──── depends on M19 (tests pass)
                            │Performance│      + all tools live
                            │Monitor+SEO│
                            └───────────┘

    ════════════════════════════════════════════════════════════════════════
    Setelah M20 selesai (product stable):
    ════════════════════════════════════════════════════════════════════════

                            ┌───────────┐
                            │    M21    │◄──── depends on M20 (product stable)
                            │ OpenClaw  │      AI agent system
                            │ AI Agent  │
                            └─────┬─────┘
                                  │
                                  │ API ready
                                  ▼
                            ┌───────────┐
                            │    M22    │◄──── depends on M21 (OpenClaw API)
                            │  Admin    │      dashboard consumes agent data
                            │ Dashboard │
                            └───────────┘

    ════════════════════════════════════════════════════════════════════════
    LEGEND:
    ──────
    ─────►  Hard dependency (must complete before starting)
    ······  Soft dependency (shared logic, can parallel with care)
    ════════════════════════════════════════════════════════════════════════
```

### Dependency Detail

| Milestone | Depends On | Alasan |
|-----------|-----------|--------|
| M12 | — | Standalone, bisa mulai langsung |
| M13 | M12 | Shared encryption logic, reuse validation |
| M14 | — | Standalone (client-side + independent endpoint) |
| M15 | — | 100% client-side, tidak ada dependency |
| M16 | — | Independent, tapi perlu Docker update |
| M17 | M16 | Shared Docker image (LibreOffice + Tesseract), reuse async pattern |
| M18 | M17 | OCR needed untuk scanned table PDFs, shared PDF parsing |
| M19 | M12–M18 | E2E tests butuh semua tools selesai |
| M20 | M19 | Performance/SEO update setelah semua tools + tests ready |
| M21 | M20 | OpenClaw butuh product stable sebelum AI agent monitoring |
| M21 (PAPYR-219) | PAPYR-181 (Core Framework) | Kicau agent depends on Core Framework + Playwright (sudah ada di Docker dari Telik agent) |
| M22 | M21 | Admin Dashboard konsumsi data dari OpenClaw API |

---

## Urutan Pengerjaan (Rekomendasi)

### Sprint 1 (Minggu 1–3): Fase 2A — Security Tools

```
M12 (Protect PDF) → M13 (Unlock PDF)
```

**Rationale:** M12 dan M13 saling terkait (shared encryption logic). Mulai dari sini karena:
- Complexity rendah-sedang (familiar pattern: upload → process → download)
- Reuse pattern yang sudah ada dari Compress (server-side processing + R2)
- M13 reuse logic dari M12, jadi sangat efisien dikerjakan berurutan
- Quick wins untuk momentum awal MVP 0.2

### Sprint 2 (Minggu 3–7): Fase 2B — Document Enhancement

```
M14 (Watermark) ──parallel──► M15 (Sign PDF)
```

**Rationale:** M14 dan M15 bisa dikerjakan paralel (tidak ada dependency). Tapi jika solo dev, kerjakan M14 dulu karena:
- M14 hybrid (client + server) — good transition dari Fase 2A
- M15 100% client-side — fresh challenge, lebih complex (canvas + drag-drop)
- M15 paling complex di MVP 0.2 (24 jam), butuh fokus penuh

### Sprint 3 (Minggu 7–13): Fase 2C — Document Conversion

```
M16 (PDF-to-Word) → M17 (OCR) → M18 (PDF-to-Excel)
```

**Rationale:** Sequential karena hard dependencies:
- M16 setup LibreOffice + async pattern yang di-reuse M17
- M17 setup Tesseract + OCR yang dibutuhkan M18 (scanned tables)
- M18 paling akhir karena depends on both M16 dan M17
- Phase ini paling heavy (69 jam total) — butuh fokus dan patience

### Sprint 4 (Minggu 13–15): Fase 2D — Cross-cutting Quality

```
M19 (E2E + Code Quality) → M20 (Performance + Monitoring + SEO)
```

**Rationale:** Quality phase harus terakhir:
- M19 butuh semua 13 tools selesai untuk full E2E coverage
- M20 butuh M19 pass (CI/CD green) sebelum final deploy
- SEO update di M20 butuh semua tool pages exist
- M20 = final polish sebelum "MVP 0.2 Complete" tag

### Timeline Visual

```
Minggu:  1    2    3    4    5    6    7    8    9   10   11   12   13   14   15
         ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
M12:     ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
M13:     ░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
M14:     ░░░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
M15:     ░░░░░░░░░░░░░░░░░░░░████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
M16:     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████░░░░░░░░░░░░░░░░░░░░
M17:     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████████░░░░░░░░
M18:     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████
M19:     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████
M20:     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██

Phase:   ├── 2A ──┤├──── 2B ────────┤├──────── 2C ────────────────┤├── 2D ──┤
```

### Checkpoint & Review Points

| Checkpoint | Minggu | Deliverable | Review Criteria |
|-----------|--------|-------------|-----------------|
| CP1 | 3 | Fase 2A selesai | 2 tools live, 12+ tests pass |
| CP2 | 7 | Fase 2B selesai | 4 tools live, preview features work |
| CP3 | 9 | M16 selesai | LibreOffice working, async pattern proven |
| CP4 | 13 | Fase 2C selesai | 7 tools live, Docker optimized |
| CP5 | 15 | MVP 0.2 complete | All 13 tools, E2E pass, monitoring active |

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Docker image terlalu besar (LibreOffice + Tesseract) | High | High | Multi-stage build, evaluate split services |
| LibreOffice conversion quality rendah | Medium | Medium | Benchmark vs online tools, fallback ke pdf2docx library |
| OCR lambat untuk file besar | Medium | High | Limit 50 halaman, async processing, timeout 180s |
| Railway memory limit exceeded | High | Medium | Monitor memory usage, upgrade plan jika perlu |
| Camelot table detection inaccurate | Medium | Medium | Dual flavor (lattice + stream), user preview before convert |
| Playwright E2E flaky di CI | Low | High | Retry mechanism, screenshot artifacts, stable selectors |
| Canvas signature tidak smooth di mobile | Medium | Medium | Touch event optimization, test di real devices |

---

## Estimasi Resource

### Waktu

| Fase | Jam | Minggu (@10 jam/minggu) |
|------|-----|------------------------|
| Fase 2A (Security) | 30 jam | 3 minggu |
| Fase 2B (Enhancement) | 44 jam | 4.5 minggu |
| Fase 2C (Conversion) | 69 jam | 7 minggu |
| Fase 2D (Quality) | 20 jam | 2 minggu |
| **Total** | **163 jam** | **~16 minggu** |

### Infrastruktur Tambahan

| Service | Biaya | Keterangan |
|---------|-------|------------|
| Railway (upgraded) | ~$5-10/bulan | Larger container untuk LibreOffice + Tesseract |
| BetterStack | Free tier | Uptime monitoring (3 monitors) |
| Telegram Bot | Gratis | Alert notifications |
| Google Fonts | Gratis | Signature fonts untuk Sign PDF |

### Docker Image Size Projection

| Component | Size |
|-----------|------|
| Base Python 3.11 slim | ~150 MB |
| PyMuPDF + Ghostscript (existing) | ~100 MB |
| LibreOffice headless (M16) | ~200 MB |
| Tesseract + language packs (M17) | ~80 MB |
| Camelot + OpenCV (M18) | ~50 MB |
| Python dependencies | ~100 MB |
| **Total estimated** | **~680 MB** |

---

## Task Distribution Summary

### Per Layer

| Layer | Tasks | Jam | Persentase |
|-------|-------|-----|-----------|
| Backend | 30 | 62 jam | 38% |
| Frontend | 30 | 60 jam | 37% |
| Infra | 10 | 16 jam | 10% |
| Testing | 10 | 13 jam | 8% |
| SEO/Content | 7 | 7.5 jam | 5% |
| Deploy | 4 | 5 jam | 3% |
| **Total** | **89** | **163 jam** | **100%** |

### Per Fase

| Fase | Milestones | Tasks | Jam | Fokus Utama |
|------|-----------|-------|-----|-------------|
| 2A — Security | M12, M13 | 17 | 30 jam | Backend (PyMuPDF encryption) |
| 2B — Enhancement | M14, M15 | 21 | 44 jam | Frontend (canvas, drag-drop, pdf-lib) |
| 2C — Conversion | M16, M17, M18 | 31 | 69 jam | Infra + Backend (Docker, LibreOffice, Tesseract) |
| 2D — Quality | M19, M20 | 20 | 20 jam | Testing + Deploy (Playwright, CI/CD) |

### New Backend Endpoints Summary

| Endpoint | Method | Milestone | Processing | Async |
|----------|--------|-----------|-----------|-------|
| `/api/protect` | POST | M12 | PyMuPDF encrypt | No |
| `/api/unlock` | POST | M13 | PyMuPDF decrypt | No |
| `/api/watermark` | POST | M14 | PyMuPDF image overlay | No |
| `/api/pdf-to-word` | POST | M16 | LibreOffice headless | Yes |
| `/api/ocr` | POST | M17 | ocrmypdf + Tesseract | Yes |
| `/api/pdf-to-excel` | POST | M18 | camelot + openpyxl | No |
| `/api/pdf-to-excel/preview` | POST | M18 | camelot (preview only) | No |
| `/api/status/{task_id}` | GET | M16 | Status polling | — |

### New Frontend Pages Summary

| Route | Milestone | Processing | Key Components |
|-------|-----------|-----------|----------------|
| `/protect` | M12 | Server | PDFUploader, PasswordInput, DownloadArea |
| `/unlock` | M13 | Server | PDFUploader, PasswordInput, DownloadArea |
| `/watermark` | M14 | Client + Server | PDFUploader, WatermarkConfig, Preview, DownloadArea |
| `/sign` | M15 | Client | PDFUploader, SignaturePad, PDFViewer, DragPlacement |
| `/pdf-to-word` | M16 | Server (async) | PDFUploader, PollingProgress, DownloadArea |
| `/ocr` | M17 | Server (async) | PDFUploader, LanguageSelector, PollingProgress |
| `/pdf-to-excel` | M18 | Server | PDFUploader, TablePreview, DownloadArea |

---

## Cara Import ke GitHub Issues

### Opsi A: GitHub CLI (Rekomendasi)

Install GitHub CLI (`gh`), lalu buat script loop:

```bash
# Contoh untuk M12
gh issue create --title "PAPYR-090: Buat endpoint POST /api/protect" \
  --label "layer:backend,milestone:M12,phase:2A,priority:high" \
  --body "Estimasi: 3 jam. Terima file PDF + password (form-data). Validasi: MIME type, ekstensi, magic bytes, ukuran maks 20MB, password min 4 char."

gh issue create --title "PAPYR-091: Implementasi enkripsi PDF dengan PyMuPDF" \
  --label "layer:backend,milestone:M12,phase:2A,priority:high" \
  --body "Estimasi: 3 jam. Gunakan fitz.open() + doc.save(encryption=AES_256). Handle PDF sudah terenkripsi."
```

### Opsi B: Bulk Import Script

Minta AI generate full script dari backlog ini — semua 89 issues sekaligus dengan labels dan body yang benar.

### Opsi C: GitHub Projects Board

Buat Project board dengan columns: Backlog → In Progress → Review → Done. Import issues ke board, group by milestone.

---

## Catatan Penutup

### Definition of Done — MVP 0.2

MVP 0.2 dianggap **SELESAI** ketika:

1. ✅ Semua 13 tools berfungsi di production (mypapyr.com)
2. ✅ E2E tests pass untuk semua tools di CI
3. ✅ Lighthouse score >90 (Performance) di semua tool pages
4. ✅ Uptime monitoring aktif dengan Telegram alerts
5. ✅ Sitemap + OG images untuk semua 13 tools
6. ✅ Analytics tracking aktif untuk semua tools
7. ✅ Code terformat (Prettier + Ruff) dan enforced di CI
8. ✅ Release tagged v2.0.0
9. ✅ README dan CHANGELOG updated
10. ✅ Admin dashboard aktif di /admin dengan semua 10 modul

### Prinsip Pengembangan

- **AI-driven:** Semua code ditulis dengan bantuan AI (Claude/GPT)
- **Privacy-first:** Tidak ada file yang disimpan lebih dari 60 menit
- **Mobile-first:** Semua UI didesain untuk mobile terlebih dahulu
- **Progressive enhancement:** Client-side first, server fallback jika perlu
- **Test-driven:** Setiap fitur baru harus punya unit test + E2E test

---

## Reusable Components & Patterns

### Komponen yang Bisa Di-reuse dari MVP 0.1

| Komponen | Lokasi | Dipakai di M... |
|----------|--------|-----------------|
| `PDFUploader` | `components/PDFUploader.tsx` | M12, M13, M14, M15, M16, M17, M18 |
| `PageRangeInput` | `components/PageRangeInput.tsx` | M18 |
| `OtherTools` | `components/OtherTools.tsx` | Semua tool pages |
| `analytics.ts` | `lib/analytics.ts` | Semua milestones |
| `config.ts` | `lib/config.ts` | Semua milestones |
| `r2.py` | `utils/r2.py` | M12, M13, M14, M16, M17, M18 |
| Rate limiter | `main.py` middleware | Semua backend endpoints |

### Pattern Baru yang Diperkenalkan di MVP 0.2

| Pattern | Milestone | Reused di |
|---------|-----------|-----------|
| Password input + validation | M12 | M13 |
| Shared service module (DRY) | M13 | — |
| Real-time preview (canvas) | M14 | M15 |
| Canvas drawing (signature pad) | M15 | — |
| Drag-and-drop placement | M15 | — |
| Async task + polling | M16 | M17 |
| Table preview before convert | M18 | — |
| E2E test pattern (Playwright) | M19 | — |
| Admin layout + sidebar | M22 | — |
| Agent status cards | M22 | — |
| Chart components (analytics) | M22 | — |
| Log viewer with filters | M22 | — |

### Shared Utilities yang Perlu Dibuat

```
backend/
├── services/
│   ├── encryption.py      ← NEW (M12/M13 shared)
│   ├── async_task.py      ← NEW (M16/M17 shared: task queue + status)
│   └── ...
├── utils/
│   ├── pdf_validator.py   ← NEW (shared validation: MIME/ext/magic/size/pages)
│   └── ...

frontend/
├── src/
│   ├── app/
│   │   └── admin/
│   │       ├── layout.tsx           ← NEW (M22: admin layout + sidebar + auth)
│   │       ├── page.tsx             ← NEW (M22: dashboard overview)
│   │       ├── openclaw/page.tsx    ← NEW (M22: OpenClaw monitoring)
│   │       ├── analytics/page.tsx   ← NEW (M22: analytics overview)
│   │       ├── health/page.tsx      ← NEW (M22: server health)
│   │       ├── security/page.tsx    ← NEW (M22: security scans)
│   │       ├── seo/page.tsx         ← NEW (M22: SEO & competitor)
│   │       ├── logs/page.tsx        ← NEW (M22: system logs)
│   │       ├── backups/page.tsx     ← NEW (M22: backup status)
│   │       ├── revenue/page.tsx     ← NEW (M22: placeholder)
│   │       ├── users/page.tsx       ← NEW (M22: placeholder)
│   │       └── settings/page.tsx    ← NEW (M22: settings)
│   ├── components/
│   │   ├── PasswordInput.tsx      ← NEW (M12/M13 shared)
│   │   ├── PollingProgress.tsx    ← NEW (M16/M17 shared)
│   │   ├── WatermarkConfig.tsx    ← NEW (M14)
│   │   ├── SignaturePad.tsx       ← NEW (M15)
│   │   ├── PDFPageViewer.tsx      ← NEW (M15)
│   │   ├── DragPlacement.tsx      ← NEW (M15)
│   │   └── TablePreview.tsx       ← NEW (M18)
│   ├── components/admin/
│   │   ├── AdminSidebar.tsx       ← NEW (M22)
│   │   ├── AgentStatusCard.tsx    ← NEW (M22)
│   │   ├── AnalyticsChart.tsx     ← NEW (M22)
│   │   └── LogViewer.tsx          ← NEW (M22)
│   └── hooks/
│       ├── useAsyncTask.ts        ← NEW (M16/M17 shared polling hook)
│       └── useSignature.ts        ← NEW (M15 state management)
```

---

## Glossary

| Term | Definisi |
|------|---------|
| **AES-256** | Advanced Encryption Standard 256-bit, standar enkripsi PDF terkuat |
| **ocrmypdf** | Python library yang wrap Tesseract untuk OCR pada PDF |
| **Tesseract** | Open-source OCR engine dari Google |
| **camelot** | Python library untuk ekstraksi tabel dari PDF |
| **LibreOffice headless** | LibreOffice tanpa GUI, dijalankan via command line untuk konversi dokumen |
| **Lattice** | Mode deteksi tabel camelot untuk tabel dengan garis border |
| **Stream** | Mode deteksi tabel camelot untuk tabel tanpa garis border |
| **Signed URL** | URL dengan token yang expire, digunakan untuk akses file di R2 |
| **Async task** | Processing yang berjalan di background, user poll status via API |
| **pdf-lib** | JavaScript library untuk manipulasi PDF di browser |
| **Playwright** | Framework E2E testing dari Microsoft untuk browser automation |
| **Ruff** | Python linter dan formatter yang sangat cepat (Rust-based) |
| **BetterStack** | Platform monitoring dan alerting (formerly Better Uptime) |

---

## Appendix A: Task ID Quick Reference

| Range | Milestone | Fase |
|-------|-----------|------|
| PAPYR-090 — PAPYR-098 | M12: Protect PDF | 2A |
| PAPYR-099 — PAPYR-106 | M13: Unlock PDF | 2A |
| PAPYR-107 — PAPYR-116 | M14: Watermark PDF | 2B |
| PAPYR-117 — PAPYR-127 | M15: Sign PDF | 2B |
| PAPYR-128 — PAPYR-137 | M16: PDF-to-Word | 2C |
| PAPYR-138 — PAPYR-148 | M17: OCR | 2C |
| PAPYR-149 — PAPYR-158 | M18: PDF-to-Excel | 2C |
| PAPYR-159 — PAPYR-168 | M19: E2E + Code Quality | 2D |
| PAPYR-169 — PAPYR-178 | M20: Performance + SEO | 2D |
| PAPYR-179 — PAPYR-224 | M21: OpenClaw AI Agent | 2E |
| PAPYR-204 — PAPYR-218 | M22: Admin Dashboard | 2F |

---

## Appendix B: SEO Meta Tags untuk 7 Tools Baru

| Tool | Title | Description (Bahasa Indonesia) |
|------|-------|-------------------------------|
| Protect | Proteksi PDF dengan Password - Papyr | Lindungi file PDF Anda dengan password AES-256. Gratis, cepat, tanpa login. File dihapus otomatis dalam 60 menit. |
| Unlock | Hapus Password PDF - Papyr | Buka kunci PDF yang terproteksi password. Masukkan password, download PDF tanpa proteksi. Gratis dan privasi terjaga. |
| Watermark | Tambah Watermark PDF - Papyr | Tambahkan watermark teks atau gambar ke semua halaman PDF. Preview sebelum apply. Gratis, tanpa login. |
| Sign | Tanda Tangani PDF Online - Papyr | Tanda tangani PDF langsung dari browser. Gambar, upload, atau ketik tanda tangan. 100% privasi — file tidak diupload. |
| PDF-to-Word | Konversi PDF ke Word (DOCX) - Papyr | Ubah file PDF menjadi dokumen Word yang bisa diedit. Gratis, cepat, tanpa login. Privasi terjaga. |
| OCR | OCR PDF — Ubah Scan Jadi Teks - Papyr | Ubah PDF scan menjadi PDF yang bisa dicari teksnya. Support Bahasa Indonesia dan English. Gratis. |
| PDF-to-Excel | Konversi PDF ke Excel (XLSX) - Papyr | Ekstrak tabel dari PDF ke spreadsheet Excel. Preview tabel sebelum konversi. Gratis, tanpa login. |

---

## Appendix C: Analytics Event Taxonomy (7 Tools Baru)

| Tool | Event | Props |
|------|-------|-------|
| protect | task_started | tool_name, file_size_mb |
| protect | task_completed | tool_name, file_size_mb, encryption_type, duration_ms |
| protect | task_failed | tool_name, error_type |
| unlock | task_started | tool_name, file_size_mb |
| unlock | task_completed | tool_name, file_size_mb, duration_ms |
| unlock | task_failed | tool_name, error_type (wrong_password / not_encrypted / other) |
| watermark | task_started | tool_name, watermark_type (text/image), file_size_mb |
| watermark | task_completed | tool_name, watermark_type, pages_count, duration_ms |
| watermark | task_failed | tool_name, error_type |
| sign | task_started | tool_name, signature_mode (draw/upload/type) |
| sign | task_completed | tool_name, signature_mode, pages_signed, duration_ms |
| sign | task_failed | tool_name, error_type |
| pdf-to-word | task_started | tool_name, file_size_mb, page_count |
| pdf-to-word | task_completed | tool_name, file_size_mb, page_count, duration_ms |
| pdf-to-word | task_failed | tool_name, error_type (timeout / conversion_error / other) |
| ocr | task_started | tool_name, file_size_mb, page_count, language |
| ocr | task_completed | tool_name, file_size_mb, page_count, language, duration_ms |
| ocr | task_failed | tool_name, error_type, language |
| pdf-to-excel | task_started | tool_name, file_size_mb, page_count |
| pdf-to-excel | task_completed | tool_name, tables_found, sheets_created, duration_ms |
| pdf-to-excel | task_failed | tool_name, error_type (no_tables / extraction_error / other) |

---

> **Next step:** Mulai dari PAPYR-090 (M12: Protect PDF). Setelah M21 selesai, lanjut ke M22 (Admin Dashboard, PAPYR-204). Bawa dokumen ini ke sesi coding sebagai referensi. Target: 1–2 tasks per sesi coding.

---

*Dokumen ini adalah living document dan akan di-update seiring progress pengerjaan MVP 0.2.*

*Hak cipta © 2026 Muhammad Fa'iz Zulfikar. All rights reserved.*
