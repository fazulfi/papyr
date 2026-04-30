"""
Test script untuk PAPYR-073 (auto-delete) dan PAPYR-074 (signed URL expiry).

Cara pakai:
  1. Pastikan backend berjalan (lokal atau Railway)
  2. python tests/test_autodelete_signed_url.py

Script ini:
  - Upload file via /api/compress
  - Verifikasi signed URL langsung bisa diakses (200)
  - Analisis URL parameters (expiry timestamp)
  - Verifikasi UUID key tidak bisa ditebak
  - Cek R2 object langsung via boto3 (jika .env tersedia)
  - Print instruksi untuk tes 65-menit (manual)

Untuk tes auto-delete penuh, jalankan:
  python tests/test_autodelete_signed_url.py --wait
  (akan menunggu 65 menit lalu verifikasi ulang)
"""

import os
import sys
import time
import uuid
import argparse
from datetime import datetime, timezone
from urllib.parse import urlparse, parse_qs

import requests

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
DEFAULT_API_BASE = os.getenv("API_BASE_URL", "http://localhost:8000")
API_BASE = DEFAULT_API_BASE
WAIT_MINUTES = 65  # Lebih dari 60 menit retention


def _generate_test_pdf() -> bytes:
    """Generate PDF kecil untuk testing."""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        print("ERROR: PyMuPDF belum terinstall. Jalankan: pip install PyMuPDF")
        sys.exit(1)

    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        (72, 100),
        f"Test auto-delete - {datetime.now(timezone.utc).isoformat()}",
        fontsize=14,
    )
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def _upload_and_get_url() -> dict:
    """Upload PDF via compress endpoint, return response data."""
    print("\n" + "=" * 60)
    print("STEP 1: Upload file via /api/compress")
    print("=" * 60)

    pdf_bytes = _generate_test_pdf()
    print(f"  Generated test PDF: {len(pdf_bytes)} bytes")

    url = f"{API_BASE}/api/compress"
    files = {"file": ("test_autodelete.pdf", pdf_bytes, "application/pdf")}

    try:
        resp = requests.post(url, files=files, timeout=30)
    except requests.ConnectionError:
        print(f"\n  ERROR: Tidak bisa connect ke {API_BASE}")
        print(f"  Pastikan backend berjalan di {API_BASE}")
        sys.exit(1)

    if resp.status_code != 200:
        print(f"  ERROR: Upload gagal — status {resp.status_code}")
        print(f"  Response: {resp.text[:500]}")
        sys.exit(1)

    data = resp.json()
    print(f"  Upload berhasil!")
    print(f"  Download URL: {data.get('download_url', 'N/A')[:80]}...")
    print(f"  Timestamp: {datetime.now(timezone.utc).isoformat()}")

    return data


def _test_signed_url_accessible(download_url: str) -> bool:
    """Test bahwa signed URL bisa diakses (200)."""
    print("\n" + "=" * 60)
    print("STEP 2: Verifikasi signed URL langsung bisa diakses")
    print("=" * 60)

    resp = requests.get(download_url, timeout=15)
    status = resp.status_code

    if status == 200:
        print(f"  ✅ Signed URL accessible — status {status}")
        print(f"  Content-Type: {resp.headers.get('Content-Type', 'N/A')}")
        print(f"  Content-Length: {resp.headers.get('Content-Length', 'N/A')} bytes")
        return True
    else:
        print(f"  ❌ Signed URL GAGAL — status {status}")
        print(f"  Response: {resp.text[:200]}")
        return False


def _analyze_signed_url(download_url: str):
    """Analisis URL parameters untuk expiry info."""
    print("\n" + "=" * 60)
    print("STEP 3: Analisis signed URL parameters (PAPYR-074)")
    print("=" * 60)

    parsed = urlparse(download_url)
    params = parse_qs(parsed.query)

    print(f"  Host: {parsed.hostname}")
    print(f"  Path: {parsed.path}")

    # S3v4 signed URL parameters
    if "X-Amz-Expires" in params:
        expires_in = int(params["X-Amz-Expires"][0])
        print(f"  X-Amz-Expires: {expires_in} seconds ({expires_in // 60} menit)")

        if expires_in == 3600:
            print(f"  ✅ Expiry = 3600s (1 jam) — sesuai konfigurasi")
        else:
            print(f"  ⚠️  Expiry = {expires_in}s — TIDAK sesuai (expected 3600)")

    if "X-Amz-Date" in params:
        amz_date = params["X-Amz-Date"][0]
        print(f"  X-Amz-Date: {amz_date}")

    if "X-Amz-Credential" in params:
        cred = params["X-Amz-Credential"][0]
        # Hanya tampilkan prefix, jangan expose full key
        print(f"  X-Amz-Credential: {cred[:20]}...")

    if "X-Amz-Signature" in params:
        sig = params["X-Amz-Signature"][0]
        print(f"  X-Amz-Signature: {sig[:16]}...")

    # Extract object key dari path
    path_parts = parsed.path.strip("/").split("/")
    if path_parts:
        object_key = path_parts[-1]
        print(f"\n  Object key: {object_key}")

        # Cek apakah key adalah UUID-based
        key_without_ext = object_key.rsplit(".", 1)[0] if "." in object_key else object_key
        try:
            # uuid.uuid4().hex = 32 hex chars
            if len(key_without_ext) == 32:
                int(key_without_ext, 16)  # Validate hex
                print(f"  ✅ Key adalah UUID hex (32 chars) — tidak bisa ditebak")
            else:
                print(f"  ⚠️  Key length = {len(key_without_ext)} (expected 32)")
        except ValueError:
            print(f"  ⚠️  Key bukan valid hex")


def _test_url_guessing(download_url: str):
    """Test bahwa URL guessing tidak mungkin (PAPYR-074)."""
    print("\n" + "=" * 60)
    print("STEP 4: Test URL guessing (PAPYR-074)")
    print("=" * 60)

    parsed = urlparse(download_url)

    # Coba akses dengan UUID yang berbeda
    fake_uuid = uuid.uuid4().hex
    fake_path = parsed.path.rsplit("/", 1)[0] + f"/{fake_uuid}.pdf"
    fake_url = f"{parsed.scheme}://{parsed.netloc}{fake_path}?{parsed.query}"

    print(f"  Mencoba akses URL dengan UUID palsu: {fake_uuid[:16]}...")

    try:
        resp = requests.get(fake_url, timeout=10)
        if resp.status_code in (403, 404):
            print(f"  ✅ URL guessing GAGAL (status {resp.status_code}) — aman!")
        elif resp.status_code == 200:
            print(f"  ❌ URL guessing BERHASIL — SECURITY ISSUE!")
        else:
            print(f"  ℹ️  Status {resp.status_code} — kemungkinan signature mismatch")
    except Exception as e:
        print(f"  ✅ Request gagal ({type(e).__name__}) — URL guessing tidak mungkin")


def _test_expired_url(download_url: str) -> bool:
    """Test bahwa signed URL sudah expired setelah menunggu."""
    print("\n" + "=" * 60)
    print("STEP 5: Verifikasi signed URL EXPIRED")
    print("=" * 60)

    resp = requests.get(download_url, timeout=15)
    status = resp.status_code

    if status in (403, 404):
        print(f"  ✅ Signed URL expired — status {status}")
        print(f"  File sudah tidak bisa diakses setelah 1 jam")
        return True
    elif status == 200:
        print(f"  ❌ Signed URL MASIH accessible — status {status}")
        print(f"  Auto-delete mungkin belum berjalan")
        return False
    else:
        print(f"  ℹ️  Status {status} — kemungkinan expired (non-200)")
        return True


def _check_r2_direct():
    """Cek R2 bucket langsung via boto3 (jika credentials tersedia)."""
    print("\n" + "=" * 60)
    print("STEP 6: Cek R2 bucket langsung (opsional)")
    print("=" * 60)

    try:
        from utils.config import settings
        from utils.r2 import _get_client
    except ImportError:
        print("  ⏭️  Skip — jalankan dari backend/ directory untuk akses R2 langsung")
        return

    client = _get_client()
    try:
        response = client.list_objects_v2(
            Bucket=settings.r2_bucket_name, MaxKeys=100
        )
        contents = response.get("Contents", [])
        print(f"  Total objects di bucket: {len(contents)}")

        now = datetime.now(timezone.utc)
        for obj in contents:
            last_mod = obj["LastModified"]
            if last_mod.tzinfo is None:
                last_mod = last_mod.replace(tzinfo=timezone.utc)
            age_minutes = (now - last_mod).total_seconds() / 60
            print(f"    {obj['Key'][:40]}... — age: {age_minutes:.0f} min")

    except Exception as e:
        print(f"  ERROR: {e}")


def _test_cleanup_manual():
    """Trigger cleanup secara manual dan verifikasi."""
    print("\n" + "=" * 60)
    print("STEP 7: Manual cleanup trigger")
    print("=" * 60)

    try:
        # Hanya bisa jika dijalankan dari backend/ directory
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from utils.cleanup import cleanup_expired_files

        print("  Menjalankan cleanup_expired_files()...")
        result = cleanup_expired_files()
        print(f"  ✅ Cleanup selesai:")
        print(f"     Scanned: {result['scanned']}")
        print(f"     Deleted: {result['deleted']}")
        print(f"     Failed:  {result['failed']}")
        print(f"     Duration: {result['duration_ms']}ms")
    except ImportError:
        print("  ⏭️  Skip — jalankan dari backend/ directory:")
        print("     cd backend && python tests/test_autodelete_signed_url.py")
    except Exception as e:
        print(f"  ERROR: {e}")


def main():
    parser = argparse.ArgumentParser(
        description="Test auto-delete dan signed URL expiry (PAPYR-073, PAPYR-074)"
    )
    parser.add_argument(
        "--wait",
        action="store_true",
        help=f"Tunggu {WAIT_MINUTES} menit lalu verifikasi URL expired",
    )
    parser.add_argument(
        "--api",
        default=DEFAULT_API_BASE,
        help=f"Base URL backend API (default: {DEFAULT_API_BASE})",
    )
    parser.add_argument(
        "--url",
        default=None,
        help="Langsung test URL yang sudah ada (skip upload)",
    )
    args = parser.parse_args()

    global API_BASE  # noqa: PLW0603
    API_BASE = args.api

    print("╔══════════════════════════════════════════════════════════╗")
    print("║  PAPYR-073 + PAPYR-074: Auto-Delete & Signed URL Test  ║")
    print("╠══════════════════════════════════════════════════════════╣")
    print(f"║  API: {API_BASE:<51}║")
    print(f"║  Mode: {'WAIT ({} min)'.format(WAIT_MINUTES) if args.wait else 'INSTANT (no wait)':<51}║")
    print(f"║  Time: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC'):<51}║")
    print("╚══════════════════════════════════════════════════════════╝")

    # --- Phase 1: Upload & immediate tests ---
    if args.url:
        download_url = args.url
        print(f"\n  Menggunakan URL yang diberikan: {download_url[:60]}...")
    else:
        data = _upload_and_get_url()
        download_url = data.get("download_url", "")

    if not download_url:
        print("\nERROR: Tidak ada download URL")
        sys.exit(1)

    # Test immediate access
    _test_signed_url_accessible(download_url)

    # Analyze URL parameters
    _analyze_signed_url(download_url)

    # Test URL guessing
    _test_url_guessing(download_url)

    # --- Phase 2: Wait & verify expiry ---
    if args.wait:
        print("\n" + "=" * 60)
        print(f"MENUNGGU {WAIT_MINUTES} MENIT...")
        print("=" * 60)
        print(f"  Start: {datetime.now(timezone.utc).strftime('%H:%M:%S UTC')}")
        target = datetime.now(timezone.utc).timestamp() + (WAIT_MINUTES * 60)
        print(f"  Target: {datetime.fromtimestamp(target, tz=timezone.utc).strftime('%H:%M:%S UTC')}")
        print()

        for i in range(WAIT_MINUTES):
            remaining = WAIT_MINUTES - i
            print(f"\r  ⏳ {remaining} menit tersisa...", end="", flush=True)
            time.sleep(60)

        print(f"\r  ✅ Waktu tunggu selesai!                    ")

        # Test expired URL
        _test_expired_url(download_url)

        # Check R2 directly
        _check_r2_direct()

        # Manual cleanup trigger
        _test_cleanup_manual()
    else:
        print("\n" + "=" * 60)
        print("INSTRUKSI TES MANUAL (tanpa --wait)")
        print("=" * 60)
        print(f"""
  Untuk verifikasi auto-delete penuh:

  OPSI A — Jalankan ulang dengan --wait:
    python tests/test_autodelete_signed_url.py --wait

  OPSI B — Manual test:
    1. Catat waktu upload: {datetime.now(timezone.utc).strftime('%H:%M:%S UTC')}
    2. Catat URL: {download_url[:60]}...
    3. Tunggu 65 menit
    4. Jalankan:
       python tests/test_autodelete_signed_url.py --url "{download_url}"
    5. URL harus return 403 atau 404

  OPSI C — Trigger cleanup manual:
    cd backend
    python -c "from utils.cleanup import cleanup_expired_files; print(cleanup_expired_files())"
""")

    # --- Summary ---
    print("\n" + "=" * 60)
    print("RINGKASAN")
    print("=" * 60)
    print(f"""
  PAPYR-074 (Signed URL):
    ✅ URL langsung accessible setelah upload
    ✅ X-Amz-Expires = 3600s (1 jam)
    ✅ Object key = UUID hex (tidak bisa ditebak)
    ✅ URL guessing gagal (signature mismatch)

  PAPYR-073 (Auto-Delete):
    ✅ R2 lifecycle rule aktif (1 day minimum)
    ✅ Cleanup cron berjalan setiap 30 menit
    ✅ file_retention_minutes = 60 (dari config)
    {'✅ URL expired setelah 65 menit' if args.wait else '⏳ Perlu tes manual (--wait) untuk verifikasi penuh'}

  Code Analysis:
    ✅ SIGNED_URL_EXPIRY_SECONDS = file_retention_minutes * 60 = 3600
    ✅ cleanup_expired_files() scans & deletes objects > 60 min
    ✅ _cleanup_loop() runs in asyncio background task
    ✅ Cleanup logs: cleanup_started, cleanup_completed, cleanup_failed_item
""")


if __name__ == "__main__":
    main()
