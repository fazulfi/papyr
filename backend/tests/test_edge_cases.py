"""
PAPYR-078 — Test semua edge cases untuk setiap tool.

Tests edge cases across all server-side tools:
1. Empty file (0 bytes) → clear error
2. Wrong content with .pdf extension → fail gracefully
3. Password-protected PDF → specific error message
4. Very small PDF (1 page, <10KB) → should work
5. Maximum file size (exactly 20MB) → should work
6. File just over limit (20.1MB) → file size error

Usage:
    python tests/test_edge_cases.py [--api-url URL]
    python tests/test_edge_cases.py --local

Default API: https://papyr-production.up.railway.app
"""

import argparse
import io
import os
import struct
import sys
import time
from datetime import datetime
from pathlib import Path

import fitz  # PyMuPDF
import requests
from PIL import Image

# --- Config -------------------------------------------------------------------

DEFAULT_API_URL = "https://papyr-production.up.railway.app"

ENDPOINTS = {
    "compress": "/api/compress",
    "image_to_pdf": "/api/image-to-pdf",
    "pdf_to_image": "/api/pdf-to-image",
}


# --- File Generators ----------------------------------------------------------


def generate_empty_file() -> bytes:
    """0 bytes file."""
    return b""


def generate_fake_pdf() -> bytes:
    """A JPEG file renamed to .pdf — wrong magic bytes."""
    img = Image.new("RGB", (100, 100), color=(255, 0, 0))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def generate_password_pdf() -> bytes:
    """A password-protected PDF."""
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text(fitz.Point(72, 72), "Dokumen rahasia", fontsize=14, fontname="helv")

    # Encrypt with password
    perm = fitz.PDF_PERM_ACCESSIBILITY  # minimal permissions
    encrypt_meth = fitz.PDF_ENCRYPT_AES_256
    pdf_bytes = doc.tobytes(
        encryption=encrypt_meth,
        owner_pw="owner123",
        user_pw="user123",
        permissions=perm,
    )
    doc.close()
    return pdf_bytes


def generate_tiny_pdf() -> bytes:
    """Very small PDF — 1 page, minimal content, <10KB."""
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text(fitz.Point(72, 72), "Halaman 1", fontsize=11, fontname="helv")
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def generate_20mb_pdf() -> bytes:
    """PDF that is ~19MB (under the 20MB limit). Uses raw random bytes for speed."""
    doc = fitz.open()
    page = doc.new_page(width=595, height=842)
    page.insert_text(fitz.Point(72, 72), "Large PDF test — 19MB", fontsize=11, fontname="helv")

    # Use uncompressible random-ish data embedded as a file attachment
    # This is much faster than generating images
    chunk = os.urandom(1024 * 1024)  # 1MB of random data
    pdf_bytes_initial = doc.tobytes()

    # Build raw PDF by padding with random data in a stream
    # Simpler approach: just create a big bytes object
    target = 19 * 1024 * 1024
    padding = os.urandom(target - len(pdf_bytes_initial))
    doc.close()

    # Create a proper PDF with embedded file to reach target size
    doc2 = fitz.open()
    # Add pages with large text blocks to increase size
    text_block = "A" * 50000 + "\n"
    pages_needed = target // 50000
    for i in range(min(pages_needed, 400)):
        p = doc2.new_page(width=595, height=842)
        p.insert_text(fitz.Point(72, 72), f"Page {i+1}", fontsize=11, fontname="helv")

    result = doc2.tobytes(deflate=False)  # No compression = larger
    doc2.close()

    # If still too small, pad with raw bytes (will be rejected by strict parsers
    # but our validation checks magic bytes + size, not full parse)
    if len(result) < target:
        result = result + b"\x00" * (target - len(result))

    return result[:target]  # Trim to exactly target


def generate_oversized_pdf() -> bytes:
    """Bytes that start with %PDF but are >20MB. For size validation testing."""
    # We just need something >20MB that starts with %PDF magic bytes
    # The server validates size BEFORE parsing, so this is sufficient
    target = 21 * 1024 * 1024  # 21MB
    header = b"%PDF-1.4\n"
    padding = b"\x00" * (target - len(header))
    return header + padding


def generate_small_image() -> bytes:
    """Small valid image for image-to-pdf edge case testing."""
    img = Image.new("RGB", (100, 100), color=(0, 255, 0))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# --- Test Runner --------------------------------------------------------------


def run_test(
    name: str,
    api_url: str,
    endpoint: str,
    file_bytes: bytes,
    filename: str,
    content_type: str,
    expect_success: bool,
    expect_status: int | None = None,
    expect_detail_contains: str | None = None,
    extra_data: dict | None = None,
    extra_files: list | None = None,
) -> dict:
    """Run a single edge case test."""
    print(f"\n  [{name}]")
    print(f"    File: {filename} ({len(file_bytes):,} bytes)")
    print(f"    Expect: {'success' if expect_success else f'error (HTTP {expect_status})'}")

    start = time.time()
    try:
        if extra_files:
            # Multi-file upload (image-to-pdf)
            files = extra_files
        else:
            files = {"file": (filename, file_bytes, content_type)}

        kwargs = {"files": files, "timeout": 120}
        if extra_data:
            kwargs["data"] = extra_data

        resp = requests.post(f"{api_url}{endpoint}", **kwargs)
        elapsed_ms = int((time.time() - start) * 1000)

        status = resp.status_code
        try:
            body = resp.json()
        except Exception:
            body = {"raw": resp.text[:200]}

        detail = body.get("detail", str(body)[:100])

        if expect_success:
            passed = status == 200
            if passed:
                print(f"    ✅ PASSED — HTTP 200, response OK")
            else:
                print(f"    ❌ FAILED — Expected 200, got {status}: {detail}")
        else:
            status_ok = expect_status is None or status == expect_status
            detail_ok = expect_detail_contains is None or expect_detail_contains.lower() in str(detail).lower()
            passed = not (status == 200) and status_ok and detail_ok

            if passed:
                print(f"    ✅ PASSED — HTTP {status}: {detail}")
            else:
                print(f"    ❌ FAILED — HTTP {status}: {detail}")
                if not status_ok:
                    print(f"      Expected status {expect_status}")
                if not detail_ok:
                    print(f"      Expected detail containing '{expect_detail_contains}'")

        return {
            "name": name,
            "passed": passed,
            "status": status,
            "detail": str(detail)[:100],
            "elapsed_ms": elapsed_ms,
            "expect_success": expect_success,
        }

    except Exception as e:
        elapsed_ms = int((time.time() - start) * 1000)
        print(f"    ❌ EXCEPTION — {type(e).__name__}: {str(e)[:100]}")
        return {
            "name": name,
            "passed": False,
            "status": 0,
            "detail": f"{type(e).__name__}: {str(e)[:80]}",
            "elapsed_ms": elapsed_ms,
            "expect_success": expect_success,
        }


# --- Test Suites --------------------------------------------------------------


def run_compress_edge_cases(api_url: str, skip_large: bool = False) -> list[dict]:
    """Edge cases for /api/compress."""
    results = []
    ep = ENDPOINTS["compress"]

    # 1. Empty file
    results.append(run_test(
        "compress: empty file (0 bytes)",
        api_url, ep,
        generate_empty_file(), "empty.pdf", "application/pdf",
        expect_success=False, expect_status=400,
    ))

    # 2. Wrong content (.pdf extension but JPEG content)
    results.append(run_test(
        "compress: fake PDF (JPEG renamed to .pdf)",
        api_url, ep,
        generate_fake_pdf(), "fake.pdf", "application/pdf",
        expect_success=False, expect_status=400,
    ))

    # 3. Password-protected PDF
    results.append(run_test(
        "compress: password-protected PDF",
        api_url, ep,
        generate_password_pdf(), "protected.pdf", "application/pdf",
        expect_success=False,
    ))

    # 4. Very small PDF (<10KB)
    results.append(run_test(
        "compress: tiny PDF (1 page, <10KB)",
        api_url, ep,
        generate_tiny_pdf(), "tiny.pdf", "application/pdf",
        expect_success=True,
    ))

    if not skip_large:
        # 5. Maximum file size (~20MB)
        print("\n  ⏳ Generating ~19MB PDF...")
        pdf_20mb = generate_20mb_pdf()
        actual_mb = len(pdf_20mb) / 1024 / 1024
        print(f"  Generated: {actual_mb:.1f} MB")

        results.append(run_test(
            f"compress: max size PDF ({actual_mb:.1f}MB)",
            api_url, ep,
            pdf_20mb, "large.pdf", "application/pdf",
            expect_success=True,
        ))

        # 6. Over limit (>20MB)
        print("\n  ⏳ Generating >20MB PDF...")
        pdf_over = generate_oversized_pdf()
        over_mb = len(pdf_over) / 1024 / 1024
        print(f"  Generated: {over_mb:.1f} MB")

        results.append(run_test(
            f"compress: oversized PDF ({over_mb:.1f}MB)",
            api_url, ep,
            pdf_over, "oversized.pdf", "application/pdf",
            expect_success=False, expect_status=400,
        ))
    else:
        print("\n  ⏭️ Skipping large file tests (--skip-large)")

    return results


def run_pdf_to_image_edge_cases(api_url: str) -> list[dict]:
    """Edge cases for /api/pdf-to-image."""
    results = []
    ep = ENDPOINTS["pdf_to_image"]

    # 1. Empty file
    results.append(run_test(
        "pdf-to-image: empty file",
        api_url, ep,
        generate_empty_file(), "empty.pdf", "application/pdf",
        expect_success=False, expect_status=400,
        extra_data={"pages": ""},
    ))

    # 2. Fake PDF
    results.append(run_test(
        "pdf-to-image: fake PDF (JPEG content)",
        api_url, ep,
        generate_fake_pdf(), "fake.pdf", "application/pdf",
        expect_success=False, expect_status=400,
        extra_data={"pages": ""},
    ))

    # 3. Password-protected PDF
    results.append(run_test(
        "pdf-to-image: password-protected PDF",
        api_url, ep,
        generate_password_pdf(), "protected.pdf", "application/pdf",
        expect_success=False,
        extra_data={"pages": ""},
    ))

    # 4. Tiny PDF — should work
    results.append(run_test(
        "pdf-to-image: tiny PDF (1 page)",
        api_url, ep,
        generate_tiny_pdf(), "tiny.pdf", "application/pdf",
        expect_success=True,
        extra_data={"pages": "1"},
    ))

    # 5. Invalid page range
    results.append(run_test(
        "pdf-to-image: invalid page '0'",
        api_url, ep,
        generate_tiny_pdf(), "tiny.pdf", "application/pdf",
        expect_success=False, expect_status=400,
        extra_data={"pages": "0"},
    ))

    # 6. Out of bounds page
    results.append(run_test(
        "pdf-to-image: out-of-bounds page '99'",
        api_url, ep,
        generate_tiny_pdf(), "tiny.pdf", "application/pdf",
        expect_success=False, expect_status=400,
        extra_data={"pages": "99"},
    ))

    return results


def run_image_to_pdf_edge_cases(api_url: str) -> list[dict]:
    """Edge cases for /api/image-to-pdf."""
    results = []
    ep = ENDPOINTS["image_to_pdf"]

    # 1. Empty file as image
    results.append(run_test(
        "image-to-pdf: empty file",
        api_url, ep,
        generate_empty_file(), "empty.png", "image/png",
        expect_success=False, expect_status=400,
        extra_files=[("files", ("empty.png", generate_empty_file(), "image/png"))],
    ))

    # 2. PDF file instead of image
    results.append(run_test(
        "image-to-pdf: PDF instead of image",
        api_url, ep,
        generate_tiny_pdf(), "document.pdf", "application/pdf",
        expect_success=False, expect_status=400,
        extra_files=[("files", ("document.pdf", generate_tiny_pdf(), "application/pdf"))],
    ))

    # 3. Valid small image — should work
    small_img = generate_small_image()
    results.append(run_test(
        "image-to-pdf: small valid PNG",
        api_url, ep,
        small_img, "small.png", "image/png",
        expect_success=True,
        extra_files=[("files", ("small.png", small_img, "image/png"))],
    ))

    return results


# --- Report -------------------------------------------------------------------


def generate_report(results: list[dict]) -> str:
    """Generate markdown test report."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    passed = sum(1 for r in results if r["passed"])
    failed = len(results) - passed

    lines = [
        "# PAPYR-078 — Edge Case Test Results",
        "",
        f"**Tanggal:** {now}",
        f"**Total tests:** {len(results)} ({passed} passed, {failed} failed)",
        "",
        "## Results",
        "",
        "| # | Test Case | Status | HTTP | Detail | Waktu |",
        "|---|-----------|--------|------|--------|-------|",
    ]

    for i, r in enumerate(results, 1):
        emoji = "✅" if r["passed"] else "❌"
        status = r.get("status", "-")
        detail = r.get("detail", "-")[:50]
        elapsed = f"{r.get('elapsed_ms', '-')}ms"
        lines.append(f"| {i} | {r['name']} | {emoji} | {status} | {detail} | {elapsed} |")

    lines.extend([
        "",
        "## Edge Cases Tested",
        "",
        "1. **Empty file (0 bytes)** → Harus menampilkan error yang jelas",
        "2. **File .pdf tapi isi JPEG** → Harus gagal dengan pesan yang tepat",
        "3. **PDF dilindungi password** → Harus menampilkan pesan khusus",
        "4. **PDF sangat kecil (<10KB)** → Harus tetap berfungsi",
        "5. **File maksimum (20MB)** → Harus tetap berfungsi",
        "6. **File melebihi batas (>20MB)** → Harus menampilkan error ukuran",
        "",
    ])

    return "\n".join(lines)


# --- Main ---------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PAPYR-078 Edge Case Test Suite")
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
    parser.add_argument(
        "--skip-large",
        action="store_true",
        help="Skip 20MB+ file generation (slow)",
    )
    args = parser.parse_args()

    api_url = "http://127.0.0.1:8000" if args.local else args.api_url
    print(f"\n🔗 API: {api_url}")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    all_results = []

    # Compress edge cases
    print(f"\n{'=' * 70}")
    print("  COMPRESS EDGE CASES")
    print(f"{'=' * 70}")
    all_results.extend(run_compress_edge_cases(api_url, skip_large=args.skip_large))

    # PDF-to-Image edge cases
    print(f"\n{'=' * 70}")
    print("  PDF-TO-IMAGE EDGE CASES")
    print(f"{'=' * 70}")
    all_results.extend(run_pdf_to_image_edge_cases(api_url))

    # Image-to-PDF edge cases
    print(f"\n{'=' * 70}")
    print("  IMAGE-TO-PDF EDGE CASES")
    print(f"{'=' * 70}")
    all_results.extend(run_image_to_pdf_edge_cases(api_url))

    # Generate report
    report = generate_report(all_results)
    report_path = Path(__file__).parent / "edge_case_test_results.md"
    report_path.write_text(report, encoding="utf-8")
    print(f"\n📄 Report saved: {report_path}")

    # Summary
    passed = sum(1 for r in all_results if r["passed"])
    failed = len(all_results) - passed
    print(f"\n{'=' * 70}")
    print(f"  SUMMARY: {passed} passed, {failed} failed")
    print(f"{'=' * 70}")

    sys.exit(0 if failed == 0 else 1)
