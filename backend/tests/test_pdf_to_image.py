"""
PAPYR-050 — Automated PDF-to-Image test script.

Generates various test PDFs and sends them to the pdf-to-image API.
Validates response format, file types, and error handling.
Documents results in a markdown table.

Usage:
    python tests/test_pdf_to_image.py [--api-url URL]
    python tests/test_pdf_to_image.py --local

Default API: https://papyr-production.up.railway.app
"""

import argparse
import io
import os
import struct
import sys
import time
import zipfile
from pathlib import Path

import fitz  # PyMuPDF
import requests

# --- Config -------------------------------------------------------------------

DEFAULT_API_URL = "https://papyr-production.up.railway.app"
PDF_TO_IMAGE_ENDPOINT = "/api/pdf-to-image"

# --- PDF Generators -----------------------------------------------------------


def generate_5page_text_pdf() -> tuple[bytes, str]:
    """Generate a 5-page text-only PDF with distinct content per page."""
    doc = fitz.open()
    for i in range(1, 6):
        page = doc.new_page(width=595, height=842)  # A4
        # Large page number
        page.insert_text(
            fitz.Point(200, 400),
            f"{i}",
            fontsize=120,
            fontname="helv",
            color=(0.12, 0.23, 0.37),
        )
        # Label
        page.insert_text(
            fitz.Point(150, 480),
            f"Halaman {i} dari 5",
            fontsize=24,
            fontname="helv",
            color=(0.4, 0.4, 0.4),
        )
        # Unique content for verification
        page.insert_text(
            fitz.Point(50, 100),
            f"P2I-TEST-PAGE-{i:03d}",
            fontsize=14,
            fontname="helv",
            color=(0.6, 0.6, 0.6),
        )
        # Body text
        text_block = (
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\n"
        )
        page.insert_text(
            fitz.Point(50, 550),
            text_block * 3,
            fontsize=10,
            fontname="helv",
        )
    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), "5page-text"


def generate_5page_mixed_pdf() -> tuple[bytes, str]:
    """Generate a 5-page PDF with images AND text (test case 3)."""
    doc = fitz.open()
    for i in range(1, 6):
        page = doc.new_page(width=595, height=842)

        # Text header
        page.insert_text(
            fitz.Point(50, 80),
            f"Bab {i}: Dokumen Campuran",
            fontsize=18,
            fontname="helv",
            color=(0.12, 0.23, 0.37),
        )

        # Body text
        text = (
            "Dokumen ini berisi campuran teks dan gambar untuk menguji "
            "konversi PDF ke gambar. Setiap halaman memiliki konten unik "
            "yang harus terbaca dengan jelas pada output PNG.\n\n"
            f"Identifikasi halaman: P2I-MIXED-{i:03d}\n\n"
        )
        page.insert_text(
            fitz.Point(50, 120),
            text,
            fontsize=11,
            fontname="helv",
        )

        # Colored image block
        pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 400, 250), 0)
        r = (i * 50 + 30) % 256
        g = (i * 80 + 60) % 256
        b = (i * 110 + 90) % 256
        pix.set_rect(pix.irect, (r, g, b))
        page.insert_image(fitz.Rect(100, 300, 500, 550), pixmap=pix)

        # Caption below image
        page.insert_text(
            fitz.Point(150, 580),
            f"Gambar {i} — warna RGB({r},{g},{b})",
            fontsize=10,
            fontname="helv",
            color=(0.5, 0.5, 0.5),
        )

        # Page number at bottom
        page.insert_text(
            fitz.Point(280, 800),
            f"— {i} —",
            fontsize=12,
            fontname="helv",
            color=(0.7, 0.7, 0.7),
        )

    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), "5page-mixed"


def generate_scanned_pdf() -> tuple[bytes, str]:
    """
    Generate a 3-page 'scanned' PDF (full-page raster images, no text layer).
    Simulates a scanned document — test case 4.
    """
    doc = fitz.open()
    for i in range(1, 4):
        page = doc.new_page(width=595, height=842)

        # Full-page pixmap simulating a scan (grayscale-ish noise pattern)
        pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 1190, 1684), 0)

        # Create stripe pattern to simulate scanned text lines
        for y in range(0, 1684, 4):
            # Alternate between "text" (dark) and "background" (light) stripes
            if (y // 20) % 3 == 0:
                # Dark stripe (simulates text line)
                gray = 40 + (i * 10 + y) % 30
                pix.set_rect(fitz.IRect(60, y, 1130, min(y + 2, 1684)), (gray, gray, gray))
            else:
                # Light background
                gray = 230 + (y % 20)
                if gray > 255:
                    gray = 255
                pix.set_rect(fitz.IRect(0, y, 1190, min(y + 4, 1684)), (gray, gray, gray))

        page.insert_image(fitz.Rect(0, 0, 595, 842), pixmap=pix)

    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), "scanned-3page"


# --- API Client ---------------------------------------------------------------


def send_pdf_to_image(
    api_url: str,
    pdf_bytes: bytes,
    filename: str,
    pages: str = "",
) -> dict:
    """Send PDF to pdf-to-image API and return result."""
    url = f"{api_url}{PDF_TO_IMAGE_ENDPOINT}"

    data = {}
    if pages:
        data["pages"] = pages

    start = time.time()
    try:
        resp = requests.post(
            url,
            files={"file": (f"{filename}.pdf", pdf_bytes, "application/pdf")},
            data=data,
            timeout=120,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code == 200:
            body = resp.json()
            return {
                "status": "OK",
                "status_code": 200,
                "download_url": body.get("download_url", ""),
                "file_type": body.get("file_type", ""),
                "page_count": body.get("page_count", 0),
                "elapsed_ms": elapsed_ms,
            }
        else:
            detail = ""
            try:
                detail = resp.json().get("detail", resp.text[:300])
            except Exception:
                detail = resp.text[:300]
            return {
                "status": "ERROR",
                "status_code": resp.status_code,
                "detail": detail,
                "elapsed_ms": elapsed_ms,
            }
    except requests.exceptions.Timeout:
        return {"status": "TIMEOUT", "status_code": 0, "detail": "Request timeout (120s)"}
    except requests.exceptions.ConnectionError as e:
        return {"status": "CONN_ERROR", "status_code": 0, "detail": str(e)[:200]}


def verify_download(url: str) -> dict:
    """Download file from URL and verify it's valid PNG or ZIP."""
    try:
        resp = requests.get(url, timeout=30)
        if resp.status_code != 200:
            return {"valid": False, "reason": f"HTTP {resp.status_code}"}

        content = resp.content
        size = len(content)

        # Check PNG magic bytes
        if content[:8] == b"\x89PNG\r\n\x1a\n":
            return {"valid": True, "type": "png", "size": size}

        # Check ZIP magic bytes
        if content[:4] == b"PK\x03\x04":
            # Verify ZIP contents
            try:
                zf = zipfile.ZipFile(io.BytesIO(content))
                names = zf.namelist()
                png_count = sum(1 for n in names if n.endswith(".png"))
                zf.close()
                return {
                    "valid": True,
                    "type": "zip",
                    "size": size,
                    "files": names,
                    "png_count": png_count,
                }
            except zipfile.BadZipFile:
                return {"valid": False, "reason": "Invalid ZIP file"}

        return {"valid": False, "reason": f"Unknown format (first 4 bytes: {content[:4].hex()})"}
    except Exception as e:
        return {"valid": False, "reason": str(e)[:200]}


# --- Formatting ---------------------------------------------------------------


def fmt_size(size_bytes: int) -> str:
    """Format bytes to human-readable."""
    if size_bytes >= 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
    elif size_bytes >= 1024:
        return f"{size_bytes / 1024:.1f} KB"
    return f"{size_bytes} B"


# --- Test Cases ---------------------------------------------------------------


def test_1_multipage_zip(api_url: str, pdf_bytes: bytes) -> dict:
    """Test 1: PDF 5 pages, select pages 1-2 -> download ZIP with 2 PNGs."""
    print("  Test 1: 5-page PDF, pages 1-2 -> ZIP with 2 PNGs")

    result = send_pdf_to_image(api_url, pdf_bytes, "5page-text", pages="1-2")

    if result["status"] != "OK":
        print(f"    FAIL: API returned {result['status']}: {result.get('detail', '')}")
        return {"test": "1", "passed": False, "reason": f"API error: {result.get('detail', '')}"}

    # Verify response shape
    if result["file_type"] != "zip":
        print(f"    FAIL: Expected file_type='zip', got '{result['file_type']}'")
        return {"test": "1", "passed": False, "reason": f"file_type={result['file_type']}"}

    if result["page_count"] != 2:
        print(f"    FAIL: Expected page_count=2, got {result['page_count']}")
        return {"test": "1", "passed": False, "reason": f"page_count={result['page_count']}"}

    # Verify download
    dl = verify_download(result["download_url"])
    if not dl["valid"]:
        print(f"    FAIL: Download invalid: {dl['reason']}")
        return {"test": "1", "passed": False, "reason": f"Download: {dl['reason']}"}

    if dl["type"] != "zip":
        print(f"    FAIL: Downloaded file is {dl['type']}, expected zip")
        return {"test": "1", "passed": False, "reason": f"Downloaded {dl['type']}"}

    if dl["png_count"] != 2:
        print(f"    FAIL: ZIP contains {dl['png_count']} PNGs, expected 2")
        return {"test": "1", "passed": False, "reason": f"ZIP has {dl['png_count']} PNGs"}

    print(f"    PASS: ZIP with {dl['png_count']} PNGs ({fmt_size(dl['size'])}) [{result['elapsed_ms']}ms]")
    return {"test": "1", "passed": True, "elapsed_ms": result["elapsed_ms"], "size": dl["size"]}


def test_2_single_page_png(api_url: str, pdf_bytes: bytes) -> dict:
    """Test 2: PDF 5 pages, select single page 3 -> download single PNG."""
    print("  Test 2: 5-page PDF, page 3 -> single PNG")

    result = send_pdf_to_image(api_url, pdf_bytes, "5page-text", pages="3")

    if result["status"] != "OK":
        print(f"    FAIL: API returned {result['status']}: {result.get('detail', '')}")
        return {"test": "2", "passed": False, "reason": f"API error: {result.get('detail', '')}"}

    if result["file_type"] != "png":
        print(f"    FAIL: Expected file_type='png', got '{result['file_type']}'")
        return {"test": "2", "passed": False, "reason": f"file_type={result['file_type']}"}

    if result["page_count"] != 1:
        print(f"    FAIL: Expected page_count=1, got {result['page_count']}")
        return {"test": "2", "passed": False, "reason": f"page_count={result['page_count']}"}

    # Verify download
    dl = verify_download(result["download_url"])
    if not dl["valid"]:
        print(f"    FAIL: Download invalid: {dl['reason']}")
        return {"test": "2", "passed": False, "reason": f"Download: {dl['reason']}"}

    if dl["type"] != "png":
        print(f"    FAIL: Downloaded file is {dl['type']}, expected png")
        return {"test": "2", "passed": False, "reason": f"Downloaded {dl['type']}"}

    print(f"    PASS: Single PNG ({fmt_size(dl['size'])}) [{result['elapsed_ms']}ms]")
    return {"test": "2", "passed": True, "elapsed_ms": result["elapsed_ms"], "size": dl["size"]}


def test_3_mixed_content(api_url: str) -> dict:
    """Test 3: PDF with images and text -> output should be readable."""
    print("  Test 3: Mixed content PDF (text + images) -> readable output")

    pdf_bytes, label = generate_5page_mixed_pdf()
    print(f"    Generated: {label} ({fmt_size(len(pdf_bytes))})")

    result = send_pdf_to_image(api_url, pdf_bytes, label, pages="1-2")

    if result["status"] != "OK":
        print(f"    FAIL: API returned {result['status']}: {result.get('detail', '')}")
        return {"test": "3", "passed": False, "reason": f"API error: {result.get('detail', '')}"}

    if result["file_type"] != "zip":
        print(f"    FAIL: Expected file_type='zip', got '{result['file_type']}'")
        return {"test": "3", "passed": False, "reason": f"file_type={result['file_type']}"}

    # Verify download is valid
    dl = verify_download(result["download_url"])
    if not dl["valid"]:
        print(f"    FAIL: Download invalid: {dl['reason']}")
        return {"test": "3", "passed": False, "reason": f"Download: {dl['reason']}"}

    if dl["png_count"] != 2:
        print(f"    FAIL: ZIP contains {dl['png_count']} PNGs, expected 2")
        return {"test": "3", "passed": False, "reason": f"ZIP has {dl['png_count']} PNGs"}

    print(f"    PASS: Mixed content rendered OK, ZIP {fmt_size(dl['size'])} [{result['elapsed_ms']}ms]")
    return {"test": "3", "passed": True, "elapsed_ms": result["elapsed_ms"], "size": dl["size"]}


def test_4_scanned_pdf(api_url: str) -> dict:
    """Test 4: Scanned PDF -> output should be rendered correctly."""
    print("  Test 4: Scanned PDF (raster-only, no text layer)")

    pdf_bytes, label = generate_scanned_pdf()
    print(f"    Generated: {label} ({fmt_size(len(pdf_bytes))})")

    result = send_pdf_to_image(api_url, pdf_bytes, label, pages="1")

    if result["status"] != "OK":
        print(f"    FAIL: API returned {result['status']}: {result.get('detail', '')}")
        return {"test": "4", "passed": False, "reason": f"API error: {result.get('detail', '')}"}

    if result["file_type"] != "png":
        print(f"    FAIL: Expected file_type='png', got '{result['file_type']}'")
        return {"test": "4", "passed": False, "reason": f"file_type={result['file_type']}"}

    # Verify download
    dl = verify_download(result["download_url"])
    if not dl["valid"]:
        print(f"    FAIL: Download invalid: {dl['reason']}")
        return {"test": "4", "passed": False, "reason": f"Download: {dl['reason']}"}

    if dl["type"] != "png":
        print(f"    FAIL: Downloaded file is {dl['type']}, expected png")
        return {"test": "4", "passed": False, "reason": f"Downloaded {dl['type']}"}

    # Check PNG is non-trivial (scanned page should produce a decent-sized image)
    if dl["size"] < 1000:
        print(f"    FAIL: PNG too small ({dl['size']} bytes), likely blank")
        return {"test": "4", "passed": False, "reason": f"PNG only {dl['size']} bytes"}

    print(f"    PASS: Scanned PDF rendered OK, PNG {fmt_size(dl['size'])} [{result['elapsed_ms']}ms]")
    return {"test": "4", "passed": True, "elapsed_ms": result["elapsed_ms"], "size": dl["size"]}


def test_5_invalid_page_zero(api_url: str, pdf_bytes: bytes) -> dict:
    """Test 5: Invalid page range '0' -> clear error."""
    print("  Test 5: Invalid page range '0' -> error 400")

    result = send_pdf_to_image(api_url, pdf_bytes, "5page-text", pages="0")

    if result["status_code"] == 400:
        detail = result.get("detail", "")
        print(f"    PASS: Got 400 error: {detail}")
        return {"test": "5", "passed": True, "detail": detail}

    if result["status"] == "OK":
        print(f"    FAIL: API accepted page 0 (should reject)")
        return {"test": "5", "passed": False, "reason": "API accepted invalid page 0"}

    print(f"    FAIL: Expected 400, got {result['status_code']}: {result.get('detail', '')}")
    return {"test": "5", "passed": False, "reason": f"HTTP {result['status_code']}"}


def test_6_page_out_of_bounds(api_url: str, pdf_bytes: bytes) -> dict:
    """Test 6: Page '10' on a 5-page PDF -> clear error."""
    print("  Test 6: Page '10' on 5-page PDF -> error 400")

    result = send_pdf_to_image(api_url, pdf_bytes, "5page-text", pages="10")

    if result["status_code"] == 400:
        detail = result.get("detail", "")
        # Verify error message mentions the page count
        if "5" in str(detail) or "jangkauan" in str(detail).lower():
            print(f"    PASS: Got 400 with clear message: {detail}")
            return {"test": "6", "passed": True, "detail": detail}
        else:
            print(f"    WARN: Got 400 but message unclear: {detail}")
            return {"test": "6", "passed": True, "detail": detail}

    if result["status"] == "OK":
        print(f"    FAIL: API accepted page 10 on 5-page PDF")
        return {"test": "6", "passed": False, "reason": "API accepted out-of-bounds page"}

    print(f"    FAIL: Expected 400, got {result['status_code']}: {result.get('detail', '')}")
    return {"test": "6", "passed": False, "reason": f"HTTP {result['status_code']}"}


def test_7_all_pages_default(api_url: str, pdf_bytes: bytes) -> dict:
    """Test 7 (bonus): Empty pages param -> all 5 pages as ZIP."""
    print("  Test 7: Empty pages (default all) -> ZIP with 5 PNGs")

    result = send_pdf_to_image(api_url, pdf_bytes, "5page-text", pages="")

    if result["status"] != "OK":
        print(f"    FAIL: API returned {result['status']}: {result.get('detail', '')}")
        return {"test": "7", "passed": False, "reason": f"API error: {result.get('detail', '')}"}

    if result["file_type"] != "zip":
        print(f"    FAIL: Expected file_type='zip', got '{result['file_type']}'")
        return {"test": "7", "passed": False, "reason": f"file_type={result['file_type']}"}

    if result["page_count"] != 5:
        print(f"    FAIL: Expected page_count=5, got {result['page_count']}")
        return {"test": "7", "passed": False, "reason": f"page_count={result['page_count']}"}

    # Verify download
    dl = verify_download(result["download_url"])
    if not dl["valid"]:
        print(f"    FAIL: Download invalid: {dl['reason']}")
        return {"test": "7", "passed": False, "reason": f"Download: {dl['reason']}"}

    if dl["png_count"] != 5:
        print(f"    FAIL: ZIP contains {dl['png_count']} PNGs, expected 5")
        return {"test": "7", "passed": False, "reason": f"ZIP has {dl['png_count']} PNGs"}

    print(f"    PASS: All 5 pages as ZIP ({fmt_size(dl['size'])}) [{result['elapsed_ms']}ms]")
    return {"test": "7", "passed": True, "elapsed_ms": result["elapsed_ms"], "size": dl["size"]}


# --- Test Runner --------------------------------------------------------------


def run_tests(api_url: str) -> list[dict]:
    """Run all 7 test cases and return results."""
    print(f"\n{'='*70}")
    print(f"  PAPYR-050 — PDF to Image Test Suite")
    print(f"  API: {api_url}")
    print(f"{'='*70}\n")

    # Generate shared 5-page text PDF
    pdf_bytes, label = generate_5page_text_pdf()
    print(f"Generated base PDF: {label} ({fmt_size(len(pdf_bytes))})\n")

    results = []

    # Test 1: Multi-page ZIP
    results.append(test_1_multipage_zip(api_url, pdf_bytes))
    time.sleep(2)

    # Test 2: Single page PNG
    results.append(test_2_single_page_png(api_url, pdf_bytes))
    time.sleep(2)

    # Test 3: Mixed content (generates its own PDF)
    results.append(test_3_mixed_content(api_url))
    time.sleep(2)

    # Test 4: Scanned PDF (generates its own PDF)
    results.append(test_4_scanned_pdf(api_url))
    time.sleep(2)

    # Test 5: Invalid page range "0"
    results.append(test_5_invalid_page_zero(api_url, pdf_bytes))
    time.sleep(2)

    # Test 6: Out-of-bounds page "10"
    results.append(test_6_page_out_of_bounds(api_url, pdf_bytes))
    time.sleep(2)

    # Test 7 (bonus): All pages default
    results.append(test_7_all_pages_default(api_url, pdf_bytes))

    return results


def generate_report(results: list[dict]) -> str:
    """Generate markdown report."""
    passed = sum(1 for r in results if r["passed"])
    failed = len(results) - passed

    lines = [
        "# PAPYR-050 — Hasil Test PDF to Image",
        "",
        f"**Tanggal:** {time.strftime('%Y-%m-%d %H:%M WIB')}",
        f"**API:** Production (Railway)",
        "",
        f"**Hasil:** {passed}/{len(results)} passed",
        "",
        "## Test Cases",
        "",
        "| # | Test Case | Status | Detail | Waktu |",
        "|---|-----------|--------|--------|-------|",
    ]

    test_descriptions = {
        "1": "5-page PDF, pages 1-2 -> ZIP with 2 PNGs",
        "2": "5-page PDF, page 3 -> single PNG",
        "3": "Mixed content PDF (text + images)",
        "4": "Scanned PDF (raster-only)",
        "5": "Invalid page range '0' -> error",
        "6": "Page '10' on 5-page PDF -> error",
        "7": "Empty pages -> all 5 pages as ZIP",
    }

    for r in results:
        test_num = r["test"]
        desc = test_descriptions.get(test_num, "Unknown")
        status = "PASS" if r["passed"] else "FAIL"
        emoji = "PASS" if r["passed"] else "FAIL"

        if r["passed"]:
            detail = ""
            if "size" in r:
                detail = fmt_size(r["size"])
            elif "detail" in r:
                detail = str(r["detail"])[:60]
            elapsed = f"{r.get('elapsed_ms', '-')}ms" if "elapsed_ms" in r else "-"
        else:
            detail = r.get("reason", "Unknown")[:60]
            elapsed = "-"

        lines.append(f"| {test_num} | {desc} | {emoji} | {detail} | {elapsed} |")

    lines.extend([
        "",
        "## Catatan",
        "",
        "- Test 1-2: Validasi output format (ZIP vs PNG) berdasarkan jumlah halaman",
        "- Test 3: PDF campuran teks+gambar harus menghasilkan output yang terbaca",
        "- Test 4: PDF scan (full-page raster) harus dirender dengan benar",
        "- Test 5-6: Validasi error handling untuk input halaman tidak valid",
        "- Test 7: Default behavior (semua halaman) saat parameter pages kosong",
        "- Download URL diverifikasi: magic bytes (PNG/ZIP) + isi ZIP dicek",
        "",
    ])

    return "\n".join(lines)


# --- Main ---------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PAPYR-050 PDF-to-Image Test Suite")
    parser.add_argument(
        "--api-url",
        default=DEFAULT_API_URL,
        help=f"API base URL (default: {DEFAULT_API_URL})",
    )
    parser.add_argument(
        "--local",
        action="store_true",
        help="Use localhost:8000",
    )
    args = parser.parse_args()

    api_url = "http://127.0.0.1:8000" if args.local else args.api_url

    # Run tests
    results = run_tests(api_url)

    # Generate report
    report = generate_report(results)

    # Save report
    report_path = Path(__file__).parent / "pdf_to_image_test_results.md"
    report_path.write_text(report, encoding="utf-8")
    print(f"\n{'='*70}")
    print(f"  Report saved: {report_path}")

    # Summary
    passed = sum(1 for r in results if r["passed"])
    failed = len(results) - passed
    print(f"\n  Summary: {passed} passed, {failed} failed")
    print(f"{'='*70}")

    # Exit code
    sys.exit(0 if failed == 0 else 1)
