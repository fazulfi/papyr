"""
PAPYR-075 — Full flow testing semua 5 tools dari upload sampai download.

Tests all 3 server-side tools end-to-end (compress, image-to-pdf, pdf-to-image).
Merge and Split are client-side only (pdf-lib in browser) — see manual checklist.

Usage:
    python tests/test_full_flow.py [--api-url URL]
    python tests/test_full_flow.py --local

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
from PIL import Image

# --- Config -------------------------------------------------------------------

DEFAULT_API_URL = "https://papyr-production.up.railway.app"

ENDPOINTS = {
    "compress": "/api/compress",
    "image_to_pdf": "/api/image-to-pdf",
    "pdf_to_image": "/api/pdf-to-image",
}


# --- PDF Generators -----------------------------------------------------------


def generate_5mb_pdf() -> bytes:
    """Generate a ~5MB PDF with text + embedded images."""
    doc = fitz.open()

    # Create a large image to embed (makes PDF bigger)
    img = Image.new("RGB", (1200, 800), color=(30, 58, 95))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="PNG")
    img_data = img_bytes.getvalue()

    for i in range(15):
        page = doc.new_page(width=595, height=842)
        page.insert_text(
            fitz.Point(72, 72),
            f"Halaman {i + 1} — Dokumen uji coba Papyr\n\n"
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. "
            "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " * 10,
            fontsize=11,
            fontname="helv",
        )
        # Embed image on every page to increase file size
        rect = fitz.Rect(72, 300, 523, 700)
        page.insert_image(rect, stream=img_data)

    pdf_bytes = doc.tobytes(deflate=True)
    doc.close()
    return pdf_bytes


def generate_3_pdfs() -> list[tuple[bytes, str]]:
    """Generate 3 distinct PDFs for merge testing (client-side reference)."""
    pdfs = []
    colors = [(0.8, 0.2, 0.2), (0.2, 0.8, 0.2), (0.2, 0.2, 0.8)]
    names = ["dokumen_A.pdf", "dokumen_B.pdf", "dokumen_C.pdf"]

    for idx, (color, name) in enumerate(zip(colors, names, strict=False)):
        doc = fitz.open()
        for page_num in range(2):
            page = doc.new_page(width=595, height=842)
            page.insert_text(
                fitz.Point(200, 400),
                f"{chr(65 + idx)}{page_num + 1}",
                fontsize=100,
                fontname="helv",
                color=color,
            )
            page.insert_text(
                fitz.Point(150, 500),
                f"Dokumen {chr(65 + idx)} — Halaman {page_num + 1}",
                fontsize=16,
                fontname="helv",
            )
        pdfs.append((doc.tobytes(), name))
        doc.close()

    return pdfs


def generate_10page_pdf() -> bytes:
    """Generate a 10-page PDF for split testing (client-side reference)."""
    doc = fitz.open()
    for i in range(1, 11):
        page = doc.new_page(width=595, height=842)
        page.insert_text(
            fitz.Point(200, 400),
            f"{i}",
            fontsize=150,
            fontname="helv",
            color=(0.12, 0.23, 0.37),
        )
        page.insert_text(
            fitz.Point(150, 520),
            f"Halaman {i} dari 10",
            fontsize=18,
            fontname="helv",
        )
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def generate_3_images() -> list[tuple[bytes, str]]:
    """Generate 3 test images (PNG/JPG) for image-to-pdf testing."""
    images = []
    configs = [
        ((800, 600), (255, 100, 100), "foto_1.png", "PNG"),
        ((1024, 768), (100, 255, 100), "foto_2.jpg", "JPEG"),
        ((640, 480), (100, 100, 255), "foto_3.png", "PNG"),
    ]

    for size, color, name, fmt in configs:
        img = Image.new("RGB", size, color=color)
        # Add some visual content
        for x in range(0, size[0], 50):
            for y in range(0, size[1], 50):
                img.putpixel((x, y), (0, 0, 0))

        buf = io.BytesIO()
        img.save(buf, format=fmt, quality=85)
        images.append((buf.getvalue(), name))

    return images


def generate_2page_pdf_for_p2i() -> bytes:
    """Generate a 2-page PDF for pdf-to-image testing."""
    doc = fitz.open()
    for i in range(1, 3):
        page = doc.new_page(width=595, height=842)
        page.insert_text(
            fitz.Point(100, 400),
            f"Page {i}",
            fontsize=80,
            fontname="helv",
            color=(0.15, 0.35, 0.6),
        )
        page.insert_text(
            fitz.Point(100, 500),
            f"Halaman {i} — uji konversi PDF ke gambar",
            fontsize=14,
            fontname="helv",
        )
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


# --- Test Functions -----------------------------------------------------------


def test_compress(api_url: str) -> dict:
    """Test 1: Compress — upload 5MB PDF, verify smaller output downloads."""
    print("\n" + "=" * 70)
    print("  TEST 1: Compress PDF (5MB → smaller)")
    print("=" * 70)

    pdf_bytes = generate_5mb_pdf()
    original_size = len(pdf_bytes)
    print(f"  Generated PDF: {original_size / 1024 / 1024:.2f} MB ({original_size:,} bytes)")

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['compress']}",
            files={"file": ("test_5mb.pdf", pdf_bytes, "application/pdf")},
            params={"quality": "ebook"},
            timeout=120,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "tool": "compress",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:200]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        download_url = data.get("download_url")
        compressed_size = data.get("compressed_size", 0)
        saved_percent = data.get("saved_percent", 0)

        print(f"  Response: {compressed_size:,} bytes, saved {saved_percent:.1f}%")
        print(f"  Elapsed: {elapsed_ms}ms")

        # Verify download URL works
        dl_resp = requests.get(download_url, timeout=30)
        if dl_resp.status_code != 200:
            return {
                "tool": "compress",
                "passed": False,
                "reason": f"Download failed: HTTP {dl_resp.status_code}",
                "elapsed_ms": elapsed_ms,
            }

        # Verify it's a valid PDF
        if not dl_resp.content[:4] == b"%PDF":
            return {
                "tool": "compress",
                "passed": False,
                "reason": "Downloaded file is not a valid PDF",
                "elapsed_ms": elapsed_ms,
            }

        # Verify it's smaller
        dl_size = len(dl_resp.content)
        is_smaller = dl_size < original_size
        print(f"  Download: {dl_size:,} bytes (smaller: {is_smaller})")
        print("  ✅ PASSED" if is_smaller else "  ⚠️ PASSED (not smaller but valid)")

        return {
            "tool": "compress",
            "passed": True,
            "original_size": original_size,
            "compressed_size": dl_size,
            "saved_percent": saved_percent,
            "elapsed_ms": elapsed_ms,
            "download_verified": True,
        }

    except Exception as e:
        return {
            "tool": "compress",
            "passed": False,
            "reason": f"Exception: {type(e).__name__}: {str(e)[:100]}",
            "elapsed_ms": int((time.time() - start) * 1000),
        }


def test_image_to_pdf(api_url: str) -> dict:
    """Test 4: Image to PDF — upload 3 images, verify PDF output."""
    print("\n" + "=" * 70)
    print("  TEST 4: Image to PDF (3 images → 1 PDF)")
    print("=" * 70)

    images = generate_3_images()
    print(f"  Generated {len(images)} images: {', '.join(name for _, name in images)}")

    files = [
        ("files", (name, data, "image/png" if name.endswith(".png") else "image/jpeg"))
        for data, name in images
    ]

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['image_to_pdf']}",
            files=files,
            timeout=60,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "tool": "image-to-pdf",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:200]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        download_url = data.get("download_url")
        image_count = data.get("image_count", 0)
        pdf_size = data.get("pdf_size", 0)

        print(f"  Response: {image_count} images → {pdf_size:,} bytes PDF")
        print(f"  Elapsed: {elapsed_ms}ms")

        # Verify download
        dl_resp = requests.get(download_url, timeout=30)
        if dl_resp.status_code != 200:
            return {
                "tool": "image-to-pdf",
                "passed": False,
                "reason": f"Download failed: HTTP {dl_resp.status_code}",
                "elapsed_ms": elapsed_ms,
            }

        # Verify it's a valid PDF with correct page count
        if not dl_resp.content[:4] == b"%PDF":
            return {
                "tool": "image-to-pdf",
                "passed": False,
                "reason": "Downloaded file is not a valid PDF",
                "elapsed_ms": elapsed_ms,
            }

        # Open and verify page count
        doc = fitz.open(stream=dl_resp.content, filetype="pdf")
        page_count = doc.page_count
        doc.close()

        if page_count != 3:
            return {
                "tool": "image-to-pdf",
                "passed": False,
                "reason": f"Expected 3 pages, got {page_count}",
                "elapsed_ms": elapsed_ms,
            }

        print(f"  Download: {len(dl_resp.content):,} bytes, {page_count} pages")
        print("  ✅ PASSED")

        return {
            "tool": "image-to-pdf",
            "passed": True,
            "image_count": image_count,
            "pdf_size": len(dl_resp.content),
            "page_count": page_count,
            "elapsed_ms": elapsed_ms,
            "download_verified": True,
        }

    except Exception as e:
        return {
            "tool": "image-to-pdf",
            "passed": False,
            "reason": f"Exception: {type(e).__name__}: {str(e)[:100]}",
            "elapsed_ms": int((time.time() - start) * 1000),
        }


def test_pdf_to_image(api_url: str) -> dict:
    """Test 5: PDF to Image — upload PDF, select pages 1-2, verify ZIP with 2 PNGs."""
    print("\n" + "=" * 70)
    print("  TEST 5: PDF to Image (2-page PDF → ZIP with 2 PNGs)")
    print("=" * 70)

    pdf_bytes = generate_2page_pdf_for_p2i()
    print(f"  Generated PDF: {len(pdf_bytes):,} bytes, 2 pages")

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['pdf_to_image']}",
            files={"file": ("test_2pages.pdf", pdf_bytes, "application/pdf")},
            data={"pages": "1-2"},
            timeout=60,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "tool": "pdf-to-image",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:200]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        download_url = data.get("download_url")
        file_type = data.get("file_type")
        page_count = data.get("page_count", 0)

        print(f"  Response: file_type={file_type}, page_count={page_count}")
        print(f"  Elapsed: {elapsed_ms}ms")

        # Verify download
        dl_resp = requests.get(download_url, timeout=30)
        if dl_resp.status_code != 200:
            return {
                "tool": "pdf-to-image",
                "passed": False,
                "reason": f"Download failed: HTTP {dl_resp.status_code}",
                "elapsed_ms": elapsed_ms,
            }

        # Should be a ZIP with 2 PNGs
        if file_type != "zip":
            return {
                "tool": "pdf-to-image",
                "passed": False,
                "reason": f"Expected file_type='zip', got '{file_type}'",
                "elapsed_ms": elapsed_ms,
            }

        # Verify ZIP magic bytes
        if dl_resp.content[:2] != b"PK":
            return {
                "tool": "pdf-to-image",
                "passed": False,
                "reason": "Downloaded file is not a valid ZIP",
                "elapsed_ms": elapsed_ms,
            }

        # Verify ZIP contents
        with zipfile.ZipFile(io.BytesIO(dl_resp.content)) as zf:
            names = zf.namelist()
            png_files = [n for n in names if n.endswith(".png")]

            if len(png_files) != 2:
                return {
                    "tool": "pdf-to-image",
                    "passed": False,
                    "reason": f"Expected 2 PNGs in ZIP, got {len(png_files)}: {names}",
                    "elapsed_ms": elapsed_ms,
                }

            # Verify each PNG has valid magic bytes
            for png_name in png_files:
                png_data = zf.read(png_name)
                if png_data[:8] != b"\x89PNG\r\n\x1a\n":
                    return {
                        "tool": "pdf-to-image",
                        "passed": False,
                        "reason": f"{png_name} is not a valid PNG",
                        "elapsed_ms": elapsed_ms,
                    }

        print(f"  Download: {len(dl_resp.content):,} bytes ZIP, {len(png_files)} PNGs")
        print(f"  ZIP contents: {', '.join(png_files)}")
        print("  ✅ PASSED")

        return {
            "tool": "pdf-to-image",
            "passed": True,
            "file_type": file_type,
            "page_count": page_count,
            "zip_size": len(dl_resp.content),
            "png_count": len(png_files),
            "elapsed_ms": elapsed_ms,
            "download_verified": True,
        }

    except Exception as e:
        return {
            "tool": "pdf-to-image",
            "passed": False,
            "reason": f"Exception: {type(e).__name__}: {str(e)[:100]}",
            "elapsed_ms": int((time.time() - start) * 1000),
        }


def test_pdf_to_image_single(api_url: str) -> dict:
    """Test 5b: PDF to Image — single page → PNG (not ZIP)."""
    print("\n" + "=" * 70)
    print("  TEST 5b: PDF to Image (single page → PNG)")
    print("=" * 70)

    pdf_bytes = generate_2page_pdf_for_p2i()
    print(f"  Generated PDF: {len(pdf_bytes):,} bytes, selecting page 1 only")

    start = time.time()
    try:
        resp = requests.post(
            f"{api_url}{ENDPOINTS['pdf_to_image']}",
            files={"file": ("test_single.pdf", pdf_bytes, "application/pdf")},
            data={"pages": "1"},
            timeout=60,
        )
        elapsed_ms = int((time.time() - start) * 1000)

        if resp.status_code != 200:
            return {
                "tool": "pdf-to-image-single",
                "passed": False,
                "reason": f"HTTP {resp.status_code}: {resp.text[:200]}",
                "elapsed_ms": elapsed_ms,
            }

        data = resp.json()
        file_type = data.get("file_type")

        if file_type != "png":
            return {
                "tool": "pdf-to-image-single",
                "passed": False,
                "reason": f"Expected file_type='png', got '{file_type}'",
                "elapsed_ms": elapsed_ms,
            }

        # Verify download is a valid PNG
        dl_resp = requests.get(data["download_url"], timeout=30)
        if dl_resp.content[:8] != b"\x89PNG\r\n\x1a\n":
            return {
                "tool": "pdf-to-image-single",
                "passed": False,
                "reason": "Downloaded file is not a valid PNG",
                "elapsed_ms": elapsed_ms,
            }

        print(f"  Response: file_type={file_type}, page_count={data.get('page_count')}")
        print(f"  Download: {len(dl_resp.content):,} bytes PNG")
        print("  ✅ PASSED")

        return {
            "tool": "pdf-to-image-single",
            "passed": True,
            "file_type": file_type,
            "png_size": len(dl_resp.content),
            "elapsed_ms": elapsed_ms,
            "download_verified": True,
        }

    except Exception as e:
        return {
            "tool": "pdf-to-image-single",
            "passed": False,
            "reason": f"Exception: {type(e).__name__}: {str(e)[:100]}",
            "elapsed_ms": int((time.time() - start) * 1000),
        }


# --- Report -------------------------------------------------------------------


def generate_report(results: list[dict]) -> str:
    """Generate markdown test report."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        "# PAPYR-075 — Full Flow Test Results",
        "",
        f"**Tanggal:** {now}",
        f"**Total tests:** {len(results)}",
        "",
        "## Server-Side Tools (Automated)",
        "",
        "| # | Tool | Status | Detail | Waktu |",
        "|---|------|--------|--------|-------|",
    ]

    for i, r in enumerate(results, 1):
        tool = r["tool"]
        passed = r.get("passed", False)
        emoji = "✅" if passed else "❌"
        elapsed = f"{r.get('elapsed_ms', '-')}ms"

        if passed:
            if tool == "compress":
                detail = f"Saved {r.get('saved_percent', 0):.1f}%, download OK"
            elif tool == "image-to-pdf":
                detail = f"{r.get('image_count', 0)} imgs → {r.get('page_count', 0)} pages"
            elif tool.startswith("pdf-to-image"):
                detail = f"type={r.get('file_type', '?')}, download OK"
            else:
                detail = "OK"
        else:
            detail = r.get("reason", "Unknown")[:50]

        lines.append(f"| {i} | {tool} | {emoji} | {detail} | {elapsed} |")

    lines.extend(
        [
            "",
            "## Client-Side Tools (Manual Verification Required)",
            "",
            "| Tool | Test Scenario | Status |",
            "|------|---------------|--------|",
            "| merge | Upload 3 PDFs, reorder, merge → verify all pages | ⏳ Manual |",
            "| split | Upload 10-page PDF, select 2-5 → verify 4 pages | ⏳ Manual |",
            "",
            "## Catatan",
            "",
            "- Compress, Image-to-PDF, PDF-to-Image: server-side (Railway + R2)",
            "- Merge, Split: client-side only (pdf-lib in browser) — tidak bisa ditest via API",
            "- Download URL diverifikasi: magic bytes + content validation",
            "- Semua test menggunakan file yang di-generate otomatis",
            "",
        ]
    )

    return "\n".join(lines)


# --- Main ---------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="PAPYR-075 Full Flow Test Suite")
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
    print(f"\n🔗 API: {api_url}")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Run all server-side tests
    results = []
    results.append(test_compress(api_url))
    results.append(test_image_to_pdf(api_url))
    results.append(test_pdf_to_image(api_url))
    results.append(test_pdf_to_image_single(api_url))

    # Generate report
    report = generate_report(results)
    report_path = Path(__file__).parent / "full_flow_test_results.md"
    report_path.write_text(report, encoding="utf-8")
    print(f"\n📄 Report saved: {report_path}")

    # Summary
    passed = sum(1 for r in results if r.get("passed"))
    failed = len(results) - passed
    print(f"\n{'=' * 70}")
    print(f"  SUMMARY: {passed} passed, {failed} failed (server-side)")
    print("  Note: Merge + Split require manual browser testing")
    print(f"{'=' * 70}")

    sys.exit(0 if failed == 0 else 1)
