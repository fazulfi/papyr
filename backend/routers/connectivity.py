"""
Router untuk verifikasi koneksi end-to-end: Backend → R2.

Endpoint ini hanya untuk testing saat development/staging.
Akan dihapus atau di-disable sebelum production launch.
"""

import logging
import time

from fastapi import APIRouter

from utils.r2 import delete_file, generate_signed_url, upload_file

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/test", tags=["connectivity"])

DUMMY_CONTENT = b"%PDF-1.4 connectivity-test-dummy"


@router.get("/connectivity")
async def connectivity_test():
    """
    Verifikasi pipeline Backend → R2:
    1. Upload dummy file ke R2
    2. Generate signed URL
    3. Delete dummy file
    4. Return hasil setiap langkah
    """
    results: dict = {
        "backend": "ok",
        "r2_upload": None,
        "r2_signed_url": None,
        "r2_delete": None,
    }

    object_key = None
    start = time.monotonic()

    # Step 1: Upload dummy file ke R2
    try:
        upload_result = upload_file(
            file_bytes=DUMMY_CONTENT,
            original_filename="connectivity-test.pdf",
            content_type="application/pdf",
        )
        object_key = upload_result["key"]
        results["r2_upload"] = {
            "status": "ok",
            "key": object_key,
            "size_bytes": upload_result["size_bytes"],
        }
    except Exception as e:
        logger.error("Connectivity test — R2 upload gagal: %s", e)
        results["r2_upload"] = {"status": "error", "detail": str(e)}
        results["elapsed_ms"] = round((time.monotonic() - start) * 1000)
        return results

    # Step 2: Generate signed URL
    try:
        signed_url = generate_signed_url(object_key, expiry_seconds=300)
        results["r2_signed_url"] = {
            "status": "ok",
            "url": signed_url,
        }
    except Exception as e:
        logger.error("Connectivity test — signed URL gagal: %s", e)
        results["r2_signed_url"] = {"status": "error", "detail": str(e)}

    # Step 3: Cleanup — delete dummy file
    try:
        deleted = delete_file(object_key)
        results["r2_delete"] = {
            "status": "ok" if deleted else "error",
        }
    except Exception as e:
        logger.error("Connectivity test — R2 delete gagal: %s", e)
        results["r2_delete"] = {"status": "error", "detail": str(e)}

    results["elapsed_ms"] = round((time.monotonic() - start) * 1000)
    return results
