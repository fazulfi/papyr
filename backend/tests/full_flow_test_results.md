# PAPYR-075 — Full Flow Test Results

**Tanggal:** 2026-04-30 13:10
**Total tests:** 4

## Server-Side Tools (Automated)

| # | Tool | Status | Detail | Waktu |
|---|------|--------|--------|-------|
| 1 | compress | ✅ | Saved -19.0%, download OK | 2778ms |
| 2 | image-to-pdf | ✅ | 3 imgs → 3 pages | 1638ms |
| 3 | pdf-to-image | ✅ | type=zip, download OK | 2583ms |
| 4 | pdf-to-image-single | ✅ | type=png, download OK | 2067ms |

## Client-Side Tools (Manual Verification Required)

| Tool | Test Scenario | Status |
|------|---------------|--------|
| merge | Upload 3 PDFs, reorder, merge → verify all pages | ⏳ Manual |
| split | Upload 10-page PDF, select 2-5 → verify 4 pages | ⏳ Manual |

## Catatan

- Compress, Image-to-PDF, PDF-to-Image: server-side (Railway + R2)
- Merge, Split: client-side only (pdf-lib in browser) — tidak bisa ditest via API
- Download URL diverifikasi: magic bytes + content validation
- Semua test menggunakan file yang di-generate otomatis
