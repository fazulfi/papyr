"""
PAPYR-020 — Automated compress test script.

Generates various test PDFs and sends them to the production compress API.
Documents results in a markdown table.

Usage:
    python tests/test_compress.py [--api-url URL]

Default API: https://papyr-production.up.railway.app
"""

import argparse
import io
import json
import os
import struct
import sys
import time
from pathlib import Path

import fitz  # PyMuPDF
import requests

# ─── Config ──────────────────────────────────────────────────────────────────

DEFAULT_API_URL = "https://papyr-production.up.railway.app"
COMPRESS_ENDPOINT = "/api/compress"
QUALITIES = ["screen", "ebook", "printer"]

# ─── PDF Generators ──────────────────────────────────────────────────────────


def generate_text_pdf(size_target_kb: int = 300) -> tuple[bytes, str]:
    """Generate a text-only PDF (~size_target_kb KB)."""
    doc = fitz.open()
    text_block = (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. "
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum. "
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.\n\n"
    )

    # Add pages until we reach target size
    pages_needed = max(1, size_target_kb // 3)  # ~3KB per page of text
    for i in range(pages_needed):
        page = doc.new_page(width=595, height=842)  # A4
        text = f"Halaman {i + 1}\n\n" + text_block * 8
        page.insert_text((72, 72), text, fontsize=11, fontname="helv")

    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), f"text-only-{pages_needed}pages"


def generate_image_pdf(size_target_kb: int = 3000) -> tuple[bytes, str]:
    """Generate an image-heavy PDF (~size_target_kb KB) with colored rectangles."""
    doc = fitz.open()

    # Each page gets a large image to inflate size
    pages_needed = max(1, size_target_kb // 500)  # ~500KB per image page
    for i in range(pages_needed):
        page = doc.new_page(width=595, height=842)

        # Create a colorful pixmap (simulates image content)
        pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 800, 600), 0)
        # Fill with a color pattern (no alpha → 3 values)
        r = (i * 37) % 256
        g = (i * 73 + 100) % 256
        b = (i * 113 + 50) % 256
        pix.set_rect(pix.irect, (r, g, b))

        # Insert as image
        page.insert_image(fitz.Rect(50, 50, 545, 450), pixmap=pix)
        page.insert_text((72, 500), f"Halaman gambar {i + 1}", fontsize=14, fontname="helv")

    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), f"image-heavy-{pages_needed}pages"


def generate_mixed_pdf(size_target_kb: int = 2000) -> tuple[bytes, str]:
    """Generate a mixed text+image PDF."""
    doc = fitz.open()

    pages_needed = max(2, size_target_kb // 400)
    text_block = (
        "Dokumen ini berisi campuran teks dan gambar untuk menguji kompresi PDF. "
        "Papyr menggunakan Ghostscript untuk mengompres file PDF dengan berbagai preset kualitas. "
        "Preset 'screen' menghasilkan file terkecil, 'ebook' seimbang, dan 'printer' kualitas tertinggi.\n\n"
    )

    for i in range(pages_needed):
        page = doc.new_page(width=595, height=842)

        # Text section
        page.insert_text((72, 72), f"Bab {i + 1}: Pengujian Kompresi\n\n", fontsize=16, fontname="helv")
        page.insert_text((72, 110), text_block * 3, fontsize=10, fontname="helv")

        # Image section (smaller than image-heavy)
        if i % 2 == 0:
            pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 400, 300), 0)
            r = (i * 50 + 30) % 256
            g = (i * 80 + 60) % 256
            b = (i * 110 + 90) % 256
            pix.set_rect(pix.irect, (r, g, b))
            page.insert_image(fitz.Rect(100, 400, 500, 700), pixmap=pix)

    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), f"mixed-{pages_needed}pages"


def generate_large_pdf(size_target_kb: int = 16000) -> tuple[bytes, str]:
    """Generate a large image-heavy PDF (~16MB). Uses JPEG-like noise for realistic size."""
    doc = fitz.open()

    # Start with fewer pages, check size, add more if needed
    page_count = 0
    while True:
        page = doc.new_page(width=595, height=842)
        page_count += 1

        # Create pixmap with random-ish noise (compresses less than solid color)
        pix = fitz.Pixmap(fitz.csRGB, fitz.IRect(0, 0, 1600, 1200), 0)
        # Use varied colors per row-block to create realistic image data
        block_h = 20
        for y in range(0, 1200, block_h):
            r = (page_count * 37 + y * 3) % 256
            g = (page_count * 73 + y * 7 + 50) % 256
            b = (page_count * 113 + y * 11 + 100) % 256
            rect = fitz.IRect(0, y, 1600, min(y + block_h, 1200))
            pix.set_rect(rect, (r, g, b))

        page.insert_image(fitz.Rect(20, 20, 575, 820), pixmap=pix)

        # Check current size
        buf = io.BytesIO()
        doc.save(buf)
        current_size = buf.tell()

        if current_size >= size_target_kb * 1024 or page_count >= 30:
            doc.close()
            return buf.getvalue(), f"large-{page_count}pages"


def generate_already_compressed_pdf() -> tuple[bytes, str]:
    """Generate a minimal, already-optimized PDF."""
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((72, 72), "Dokumen ini sudah optimal.", fontsize=12, fontname="helv")

    buf = io.BytesIO()
    doc.save(buf, deflate=True, garbage=4)  # Maximum compression
    doc.close()
    return buf.getvalue(), "already-compressed"


def generate_password_pdf() -> tuple[bytes, str]:
    """Generate a password-protected PDF."""
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text((72, 72), "Dokumen ini dilindungi password.", fontsize=12, fontname="helv")

    buf = io.BytesIO()
    doc.save(
        buf,
        encryption=fitz.PDF_ENCRYPT_AES_256,
        owner_pw="owner123",
        user_pw="user123",
        permissions=fitz.PDF_PERM_PRINT,
    )
    doc.close()
    return buf.getvalue(), "password-protected"


def generate_empty_pdf() -> tuple[bytes, str]:
    """Generate a valid but empty (no content) PDF."""
    doc = fitz.open()
    doc.new_page(width=595, height=842)  # blank page
    buf = io.BytesIO()
    doc.save(buf)
    doc.close()
    return buf.getvalue(), "empty-page"


# ─── API Client ──────────────────────────────────────────────────────────────


def compress_file(
    api_url: str, pdf_bytes: bytes, filename: str, quality: str = "ebook"
) -> dict:
    """Send PDF to compress API and return result."""
    url = f"{api_url}{COMPRESS_ENDPOINT}?quality={quality}"

    start = time.time()
    try:
        resp = requests.post(
            url,
            files={"file": (f"{filename}.pdf", pdf_bytes, "application/pdf")},
            timeout=60,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code == 200:
            data = resp.json()
            return {
                "status": "OK",
                "status_code": 200,
                "original_size": data["original_size"],
                "compressed_size": data["compressed_size"],
                "saved_percent": data["saved_percent"],
                "download_url": data["download_url"],
                "elapsed_ms": elapsed_ms,
            }
        else:
            detail = ""
            try:
                detail = resp.json().get("detail", resp.text[:200])
            except Exception:
                detail = resp.text[:200]
            return {
                "status": "ERROR",
                "status_code": resp.status_code,
                "detail": detail,
                "elapsed_ms": elapsed_ms,
            }
    except requests.exceptions.Timeout:
        return {"status": "TIMEOUT", "status_code": 0, "detail": "Request timeout (60s)"}
    except requests.exceptions.ConnectionError as e:
        return {"status": "CONN_ERROR", "status_code": 0, "detail": str(e)[:200]}


# ─── Formatting ──────────────────────────────────────────────────────────────


def fmt_size(size_bytes: int) -> str:
    """Format bytes to human-readable."""
    if size_bytes >= 1024 * 1024:
        return f"{size_bytes / (1024 * 1024):.1f} MB"
    elif size_bytes >= 1024:
        return f"{size_bytes / 1024:.1f} KB"
    return f"{size_bytes} B"


# ─── Test Runner ─────────────────────────────────────────────────────────────


def run_tests(api_url: str) -> list[dict]:
    """Run all test cases and return results."""
    print(f"\n{'='*70}")
    print(f"  PAPYR-020 — Compress Test Suite")
    print(f"  API: {api_url}")
    print(f"{'='*70}\n")

    test_cases = [
        ("1. Small text PDF (<500KB)", generate_text_pdf, {"size_target_kb": 300}),
        ("2. Medium mixed PDF (2-5MB)", generate_mixed_pdf, {"size_target_kb": 2500}),
        ("3. Large image PDF (15-18MB)", generate_large_pdf, {"size_target_kb": 16000}),
        ("4. Already compressed PDF", generate_already_compressed_pdf, {}),
        ("5. Password-protected PDF", generate_password_pdf, {}),
        ("6. Empty page PDF", generate_empty_pdf, {}),
    ]

    results = []

    for test_name, generator, kwargs in test_cases:
        print(f"▶ {test_name}")

        # Generate PDF
        pdf_bytes, label = generator(**kwargs)
        input_size = len(pdf_bytes)
        print(f"  Generated: {label} ({fmt_size(input_size)})")

        # Test with ebook quality (default)
        result = compress_file(api_url, pdf_bytes, label, quality="ebook")
        result["test_name"] = test_name
        result["label"] = label
        result["input_size"] = input_size

        if result["status"] == "OK":
            saved = result["saved_percent"]
            direction = "↓" if saved > 0 else "↑" if saved < 0 else "="
            print(
                f"  ✅ {fmt_size(result['original_size'])} → {fmt_size(result['compressed_size'])} "
                f"({direction} {abs(saved)}%) [{result['elapsed_ms']}ms]"
            )
        else:
            print(f"  {'⚠️' if result['status_code'] == 400 else '❌'} {result['status']}: {result.get('detail', 'N/A')}")

        results.append(result)
        print()

        # Rate limit safety — wait between requests
        time.sleep(2)

    return results


def run_quality_comparison(api_url: str) -> list[dict]:
    """Compare screen/ebook/printer presets on the same file."""
    print(f"\n{'='*70}")
    print(f"  Quality Preset Comparison")
    print(f"{'='*70}\n")

    pdf_bytes, label = generate_mixed_pdf(size_target_kb=2500)
    input_size = len(pdf_bytes)
    print(f"Test file: {label} ({fmt_size(input_size)})\n")

    results = []
    for quality in QUALITIES:
        result = compress_file(api_url, pdf_bytes, f"{label}-{quality}", quality=quality)
        result["quality"] = quality
        result["input_size"] = input_size

        if result["status"] == "OK":
            print(
                f"  {quality:8s}: {fmt_size(result['original_size'])} → {fmt_size(result['compressed_size'])} "
                f"(hemat {result['saved_percent']}%) [{result['elapsed_ms']}ms]"
            )
        else:
            print(f"  {quality:8s}: ❌ {result.get('detail', 'Error')}")

        results.append(result)
        time.sleep(2)

    return results


def generate_report(test_results: list[dict], quality_results: list[dict]) -> str:
    """Generate markdown report."""
    lines = [
        "# PAPYR-020 — Hasil Test Kompresi PDF",
        "",
        f"**Tanggal:** {time.strftime('%Y-%m-%d %H:%M WIB')}",
        f"**API:** Production (Railway)",
        "",
        "## Test Cases",
        "",
        "| # | Test Case | Input | Output | Hemat | Status | Waktu |",
        "|---|-----------|-------|--------|-------|--------|-------|",
    ]

    for r in test_results:
        if r["status"] == "OK":
            saved = r["saved_percent"]
            direction = "↓" if saved > 0 else "↑" if saved < 0 else "="
            lines.append(
                f"| | {r['test_name']} | {fmt_size(r['input_size'])} | "
                f"{fmt_size(r['compressed_size'])} | {direction} {abs(saved)}% | ✅ OK | {r['elapsed_ms']}ms |"
            )
        else:
            status_emoji = "⚠️" if r.get("status_code") == 400 else "❌"
            detail = r.get("detail", "N/A")
            if len(str(detail)) > 50:
                detail = str(detail)[:50] + "..."
            lines.append(
                f"| | {r['test_name']} | {fmt_size(r['input_size'])} | "
                f"— | — | {status_emoji} {r['status']} | — |"
            )

    lines.extend([
        "",
        "## Perbandingan Preset Kualitas",
        "",
        "| Preset | Input | Output | Hemat | Waktu |",
        "|--------|-------|--------|-------|-------|",
    ])

    for r in quality_results:
        if r["status"] == "OK":
            lines.append(
                f"| {r['quality']} | {fmt_size(r['input_size'])} | "
                f"{fmt_size(r['compressed_size'])} | {r['saved_percent']}% | {r['elapsed_ms']}ms |"
            )
        else:
            lines.append(f"| {r['quality']} | {fmt_size(r['input_size'])} | — | — | ❌ |")

    lines.extend([
        "",
        "## Catatan",
        "",
        "- File PDF yang sudah optimal mungkin bertambah besar setelah kompresi (Ghostscript overhead)",
        "- Password-protected PDF seharusnya mengembalikan error 400",
        "- File sangat kecil (<1KB) bisa bertambah besar karena overhead metadata Ghostscript",
        "- Waktu termasuk network latency (client → Railway → R2 → response)",
        "",
    ])

    return "\n".join(lines)


# ─── Main ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PAPYR-020 Compress Test Suite")
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
    test_results = run_tests(api_url)
    quality_results = run_quality_comparison(api_url)

    # Generate report
    report = generate_report(test_results, quality_results)

    # Save report
    report_path = Path(__file__).parent / "compress_test_results.md"
    report_path.write_text(report, encoding="utf-8")
    print(f"\n📄 Report saved: {report_path}")

    # Print summary
    ok_count = sum(1 for r in test_results if r["status"] == "OK")
    error_count = sum(1 for r in test_results if r["status"] != "OK")
    print(f"\n{'='*70}")
    print(f"  Summary: {ok_count} passed, {error_count} expected errors/edge cases")
    print(f"{'='*70}")
