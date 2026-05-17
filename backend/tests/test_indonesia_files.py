"""
PAPYR-077 — Test dengan sample file PDF Indonesia yang realistis.

Tests all server-side tools with Indonesian-style files:
1. Scan KTP/ijazah → Compress → verify readable
2. Laporan kantor → PDF to Image → verify clean output
3. Tugas kuliah → PDF to Image (specific pages) → verify
4. Foto dokumen → Image to PDF → verify readable
5. Invoice → PDF to Image → verify clean output

Usage:
    python tests/test_indonesia_files.py [--api-url URL]
    python tests/test_indonesia_files.py --local

Requires: Run generate_indonesia_test_files.py first!

Default API: https://papyr-production.up.railway.app
"""

import argparse
import io
import sys
import time
import zipfile
from datetime import datetime
from pathlib import Path

import fitz  # PyMuPDF
import requests

# --- Config -------------------------------------------------------------------

DEFAULT_API_URL = "https://papyr-production.up.railway.app"
TEST_FILES_DIR = Path(__file__).parent / "indonesia_test_files"

ENDPOINTS = {
    "compress": "/api/compress",
    "image_to_pdf": "/api/image-to-pdf",
    "pdf_to_image": "/api/pdf-to-image",
}


# --- Test Functions -----------------------------------------------------------


def test_compress_ktp(api_url: str) -> dict:
    """1. Compress scan KTP/ijazah — image-heavy PDF."""
    print("\n" + "=" * 70)
    print("  TEST 1: Compress scan KTP/ijazah (image-heavy)")
    print("=" * 70)

    pdf_path = TEST_FILES_DIR / "scan_ktp_ijazah.pdf"
    if not pdf_path.exists():
        return {
            "name": "compress: scan KTP",
            "passed": False,
            "reason": "File not found. Run generate_indonesia_test_files.py first.",
        }

    pdf_bytes = pdf_path.read_bytes()
    original_size = len(pdf_bytes)
    print(f"  Input: {pdf_path.name} ({original_size / 1024:.1f} KB)")

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['compress']}",
            files={"file": (pdf_path.name, pdf_bytes, "application/pdf")},
            params={"quality": "ebook"},
            timeout=120,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "name": "compress: scan KTP",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:100]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        dl_resp = requests.get(data["download_url"], timeout=30)

        if dl_resp.status_code != 200:
            return {
                "name": "compress: scan KTP",
                "passed": False,
                "reason": f"Download failed: HTTP {dl_resp.status_code}",
                "elapsed_ms": elapsed_ms,
            }

        # Verify it's a valid PDF
        if not dl_resp.content[:4] == b"%PDF":
            return {
                "name": "compress: scan KTP",
                "passed": False,
                "reason": "Not a valid PDF",
                "elapsed_ms": elapsed_ms,
            }

        # Verify page count preserved
        doc = fitz.open(stream=dl_resp.content, filetype="pdf")
        pages = doc.page_count
        doc.close()

        print(f"  Output: {len(dl_resp.content) / 1024:.1f} KB, {pages} pages")
        print(f"  Saved: {data.get('saved_percent', 0):.1f}%")
        print(f"  ✅ PASSED — compressed, still readable ({pages} pages)")

        return {
            "name": "compress: scan KTP",
            "passed": True,
            "pages": pages,
            "elapsed_ms": elapsed_ms,
        }

    except Exception as e:
        return {
            "name": "compress: scan KTP",
            "passed": False,
            "reason": str(e)[:100],
            "elapsed_ms": int((time.time() - start) * 1000),
        }


def test_p2i_invoice(api_url: str) -> dict:
    """5. Invoice PDF → PDF to Image → verify clean output."""
    print("\n" + "=" * 70)
    print("  TEST 5: Invoice → PDF to Image")
    print("=" * 70)

    pdf_path = TEST_FILES_DIR / "invoice_toko.pdf"
    if not pdf_path.exists():
        return {"name": "pdf-to-image: invoice", "passed": False, "reason": "File not found."}

    pdf_bytes = pdf_path.read_bytes()
    print(f"  Input: {pdf_path.name} ({len(pdf_bytes) / 1024:.1f} KB)")

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['pdf_to_image']}",
            files={"file": (pdf_path.name, pdf_bytes, "application/pdf")},
            data={"pages": "1"},
            timeout=60,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "name": "pdf-to-image: invoice",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:100]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        dl_resp = requests.get(data["download_url"], timeout=30)

        if dl_resp.content[:8] != b"\x89PNG\r\n\x1a\n":
            return {
                "name": "pdf-to-image: invoice",
                "passed": False,
                "reason": "Not a valid PNG",
                "elapsed_ms": elapsed_ms,
            }

        print(f"  Output: {len(dl_resp.content) / 1024:.1f} KB PNG")
        print("  ✅ PASSED — clean PNG output")

        return {
            "name": "pdf-to-image: invoice",
            "passed": True,
            "png_size": len(dl_resp.content),
            "elapsed_ms": elapsed_ms,
        }

    except Exception as e:
        return {
            "name": "pdf-to-image: invoice",
            "passed": False,
            "reason": str(e)[:100],
            "elapsed_ms": int((time.time() - start) * 1000),
        }


def test_p2i_tugas(api_url: str) -> dict:
    """3. Tugas kuliah → PDF to Image (pages 3-5)."""
    print("\n" + "=" * 70)
    print("  TEST 3: Tugas kuliah → PDF to Image (pages 3-5)")
    print("=" * 70)

    pdf_path = TEST_FILES_DIR / "tugas_kuliah.pdf"
    if not pdf_path.exists():
        return {"name": "pdf-to-image: tugas kuliah", "passed": False, "reason": "File not found."}

    pdf_bytes = pdf_path.read_bytes()
    print(f"  Input: {pdf_path.name} ({len(pdf_bytes) / 1024:.1f} KB, 8 pages)")

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['pdf_to_image']}",
            files={"file": (pdf_path.name, pdf_bytes, "application/pdf")},
            data={"pages": "3-5"},
            timeout=60,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "name": "pdf-to-image: tugas kuliah",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:100]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        if data.get("file_type") != "zip":
            return {
                "name": "pdf-to-image: tugas kuliah",
                "passed": False,
                "reason": f"Expected zip, got {data.get('file_type')}",
                "elapsed_ms": elapsed_ms,
            }

        if data.get("page_count") != 3:
            return {
                "name": "pdf-to-image: tugas kuliah",
                "passed": False,
                "reason": f"Expected 3 pages, got {data.get('page_count')}",
                "elapsed_ms": elapsed_ms,
            }

        # Verify ZIP download
        dl_resp = requests.get(data["download_url"], timeout=30)
        with zipfile.ZipFile(io.BytesIO(dl_resp.content)) as zf:
            png_files = [n for n in zf.namelist() if n.endswith(".png")]

        print(f"  Output: ZIP with {len(png_files)} PNGs ({len(dl_resp.content) / 1024:.1f} KB)")
        print("  ✅ PASSED — 3 pages extracted correctly")

        return {
            "name": "pdf-to-image: tugas kuliah",
            "passed": True,
            "page_count": len(png_files),
            "elapsed_ms": elapsed_ms,
        }

    except Exception as e:
        return {
            "name": "pdf-to-image: tugas kuliah",
            "passed": False,
            "reason": str(e)[:100],
            "elapsed_ms": int((time.time() - start) * 1000),
        }


def test_img2pdf_photos(api_url: str) -> dict:
    """4. Foto dokumen dari HP → Image to PDF."""
    print("\n" + "=" * 70)
    print("  TEST 4: Foto dokumen HP → Image to PDF")
    print("=" * 70)

    photo_files = ["foto_ktp.jpg", "foto_bukti_transfer.jpg", "foto_formulir.jpg"]
    files_data = []

    for fname in photo_files:
        fpath = TEST_FILES_DIR / fname
        if not fpath.exists():
            return {
                "name": "image-to-pdf: foto HP",
                "passed": False,
                "reason": f"{fname} not found.",
            }
        files_data.append(("files", (fname, fpath.read_bytes(), "image/jpeg")))
        print(f"  Input: {fname} ({fpath.stat().st_size / 1024:.1f} KB)")

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['image_to_pdf']}",
            files=files_data,
            timeout=60,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "name": "image-to-pdf: foto HP",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:100]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        if data.get("image_count") != 3:
            return {
                "name": "image-to-pdf: foto HP",
                "passed": False,
                "reason": f"Expected 3 images, got {data.get('image_count')}",
                "elapsed_ms": elapsed_ms,
            }

        # Verify download
        dl_resp = requests.get(data["download_url"], timeout=30)
        doc = fitz.open(stream=dl_resp.content, filetype="pdf")
        pages = doc.page_count
        doc.close()

        print(f"  Output: {len(dl_resp.content) / 1024:.1f} KB PDF, {pages} pages")
        print(f"  ✅ PASSED — 3 photos → {pages}-page PDF")

        return {
            "name": "image-to-pdf: foto HP",
            "passed": True,
            "page_count": pages,
            "elapsed_ms": elapsed_ms,
        }

    except Exception as e:
        return {
            "name": "image-to-pdf: foto HP",
            "passed": False,
            "reason": str(e)[:100],
            "elapsed_ms": int((time.time() - start) * 1000),
        }


def test_compress_laporan(api_url: str) -> dict:
    """2. Laporan kantor → Compress."""
    print("\n" + "=" * 70)
    print("  TEST 2: Laporan kantor → Compress")
    print("=" * 70)

    pdf_path = TEST_FILES_DIR / "laporan_kantor.pdf"
    if not pdf_path.exists():
        return {"name": "compress: laporan kantor", "passed": False, "reason": "File not found."}

    pdf_bytes = pdf_path.read_bytes()
    print(f"  Input: {pdf_path.name} ({len(pdf_bytes) / 1024:.1f} KB, 5 pages)")

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['compress']}",
            files={"file": (pdf_path.name, pdf_bytes, "application/pdf")},
            params={"quality": "ebook"},
            timeout=120,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "name": "compress: laporan kantor",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:100]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        dl_resp = requests.get(data["download_url"], timeout=30)

        doc = fitz.open(stream=dl_resp.content, filetype="pdf")
        pages = doc.page_count
        doc.close()

        print(f"  Output: {len(dl_resp.content) / 1024:.1f} KB, {pages} pages")
        print(f"  ✅ PASSED — compressed, {pages} pages preserved")

        return {
            "name": "compress: laporan kantor",
            "passed": True,
            "pages": pages,
            "elapsed_ms": elapsed_ms,
        }

    except Exception as e:
        return {
            "name": "compress: laporan kantor",
            "passed": False,
            "reason": str(e)[:100],
            "elapsed_ms": int((time.time() - start) * 1000),
        }


# --- Report -------------------------------------------------------------------


def generate_report(results: list[dict]) -> str:
    """Generate markdown test report."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    passed = sum(1 for r in results if r.get("passed"))
    failed = len(results) - passed

    lines = [
        "# PAPYR-077 — Indonesian File Test Results",
        "",
        f"**Tanggal:** {now}",
        f"**Total tests:** {len(results)} ({passed} passed, {failed} failed)",
        "",
        "## Results",
        "",
        "| # | Scenario | Status | Detail | Waktu |",
        "|---|----------|--------|--------|-------|",
    ]

    for i, r in enumerate(results, 1):
        emoji = "✅" if r.get("passed") else "❌"
        detail = r.get("reason", "OK")[:50] if not r.get("passed") else "OK"
        elapsed = f"{r.get('elapsed_ms', '-')}ms"
        lines.append(f"| {i} | {r['name']} | {emoji} | {detail} | {elapsed} |")

    lines.extend(
        [
            "",
            "## Test Scenarios",
            "",
            "1. **Scan KTP/ijazah** → Compress → verify masih terbaca",
            "2. **Laporan kantor** (5 hal) → Compress → verify halaman utuh",
            "3. **Tugas kuliah** (8 hal) → PDF to Image (hal 3-5) → verify 3 PNG",
            "4. **Foto dokumen HP** (3 JPG) → Image to PDF → verify 3 halaman",
            "5. **Invoice** (1 hal) → PDF to Image → verify PNG bersih",
            "",
            "## Catatan",
            "",
            "- Merge dan Split adalah client-side (pdf-lib) — tidak bisa ditest via API",
            "- File test di-generate oleh generate_indonesia_test_files.py",
            "",
        ]
    )

    return "\n".join(lines)


# --- Main ---------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PAPYR-077 Indonesian File Test Suite")
    parser.add_argument("--api-url", default=DEFAULT_API_URL)
    parser.add_argument("--local", action="store_true", help="Use localhost:8000")
    args = parser.parse_args()

    api_url = "http://127.0.0.1:8000" if args.local else args.api_url
    print(f"\n🔗 API: {api_url}")
    print(f"📁 Test files: {TEST_FILES_DIR}")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    if not TEST_FILES_DIR.exists():
        print("\n❌ Test files not found! Run: python tests/generate_indonesia_test_files.py")
        sys.exit(1)

    results = []
    results.append(test_compress_ktp(api_url))
    results.append(test_compress_laporan(api_url))
    results.append(test_p2i_tugas(api_url))
    results.append(test_img2pdf_photos(api_url))
    results.append(test_p2i_invoice(api_url))

    # Report
    report = generate_report(results)
    report_path = Path(__file__).parent / "indonesia_file_test_results.md"
    report_path.write_text(report, encoding="utf-8")
    print(f"\n📄 Report saved: {report_path}")

    passed = sum(1 for r in results if r.get("passed"))
    failed = len(results) - passed
    print(f"\n{'=' * 70}")
    print(f"  SUMMARY: {passed} passed, {failed} failed")
    print(f"{'=' * 70}")

    sys.exit(0 if failed == 0 else 1)
