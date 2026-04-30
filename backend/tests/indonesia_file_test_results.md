# PAPYR-077 — Indonesian File Test Results

**Tanggal:** 2026-04-30 13:25
**Total tests:** 5 (5 passed, 0 failed)

## Results

| # | Scenario | Status | Detail | Waktu |
|---|----------|--------|--------|-------|
| 1 | compress: scan KTP | ✅ | OK | 3032ms |
| 2 | compress: laporan kantor | ✅ | OK | 1590ms |
| 3 | pdf-to-image: tugas kuliah | ✅ | OK | 2891ms |
| 4 | image-to-pdf: foto HP | ✅ | OK | 2229ms |
| 5 | pdf-to-image: invoice | ✅ | OK | 1532ms |

## Test Scenarios

1. **Scan KTP/ijazah** → Compress → verify masih terbaca
2. **Laporan kantor** (5 hal) → Compress → verify halaman utuh
3. **Tugas kuliah** (8 hal) → PDF to Image (hal 3-5) → verify 3 PNG
4. **Foto dokumen HP** (3 JPG) → Image to PDF → verify 3 halaman
5. **Invoice** (1 hal) → PDF to Image → verify PNG bersih

## Catatan

- Merge dan Split adalah client-side (pdf-lib) — tidak bisa ditest via API
- File test di-generate oleh generate_indonesia_test_files.py
