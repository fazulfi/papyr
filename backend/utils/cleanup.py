"""
Cleanup cron job untuk menghapus file expired di R2.

Berjalan setiap 30 menit via asyncio background task.
Menghapus semua objek yang lebih tua dari FILE_RETENTION_MINUTES.
TIDAK BOLEH log: file names asli, file contents, user info.
"""

import logging
import time
from datetime import UTC, datetime, timedelta

from botocore.exceptions import ClientError

from utils.config import settings
from utils.r2 import _get_client

logger = logging.getLogger(__name__)

# Interval cleanup dalam detik (30 menit)
CLEANUP_INTERVAL_SECONDS = 30 * 60


def list_expired_objects() -> list[dict]:
    """
    List semua objek di R2 bucket yang sudah expired (lebih tua dari retention).

    Returns:
        List of dicts dengan 'Key' dan 'LastModified' untuk objek expired.
    """
    client = _get_client()
    expired: list[dict] = []
    cutoff = datetime.now(UTC) - timedelta(minutes=settings.file_retention_minutes)

    continuation_token = None
    while True:
        kwargs: dict = {"Bucket": settings.r2_bucket_name, "MaxKeys": 1000}
        if continuation_token:
            kwargs["ContinuationToken"] = continuation_token

        try:
            response = client.list_objects_v2(**kwargs)
        except ClientError as e:
            logger.error(
                "R2 list_objects_v2 failed: %s",
                str(e),
                extra={"event_data": {"event": "cleanup_list_error", "error": str(e)}},
            )
            break

        contents = response.get("Contents", [])
        for obj in contents:
            last_modified = obj["LastModified"]
            # Pastikan timezone-aware
            if last_modified.tzinfo is None:
                last_modified = last_modified.replace(tzinfo=UTC)
            if last_modified < cutoff:
                expired.append({"Key": obj["Key"], "LastModified": last_modified})

        # Pagination
        if response.get("IsTruncated"):
            continuation_token = response.get("NextContinuationToken")
        else:
            break

    return expired


def cleanup_expired_files() -> dict:
    """
    Hapus semua file expired dari R2 bucket.

    Returns:
        dict: {"deleted": int, "failed": int, "scanned": int, "duration_ms": int}
    """
    start_time = time.time()

    # Log cleanup started
    logger.info(
        "cleanup_started",
        extra={
            "event_data": {
                "event": "cleanup_started",
                "timestamp": datetime.now(UTC).isoformat(),
            }
        },
    )

    # List expired objects
    expired_objects = list_expired_objects()
    total_scanned = len(expired_objects)

    deleted = 0
    failed = 0
    client = _get_client()

    for obj in expired_objects:
        object_key = obj["Key"]
        try:
            client.delete_object(Bucket=settings.r2_bucket_name, Key=object_key)
            deleted += 1
        except ClientError as e:
            failed += 1
            # Log failed item — hanya UUID key, BUKAN nama file asli
            logger.warning(
                "cleanup_failed_item",
                extra={
                    "event_data": {
                        "event": "cleanup_failed_item",
                        "object_key": object_key,
                        "error": str(e),
                    }
                },
            )

    duration_ms = int((time.time() - start_time) * 1000)

    # Log cleanup_success or cleanup_failure per PRD analytics spec
    if failed == 0:
        logger.info(
            "cleanup_success",
            extra={
                "event_data": {
                    "event": "cleanup_success",
                    "scanned": total_scanned,
                    "deleted": deleted,
                    "duration_ms": duration_ms,
                    "timestamp": datetime.now(UTC).isoformat(),
                }
            },
        )
    else:
        logger.warning(
            "cleanup_failure",
            extra={
                "event_data": {
                    "event": "cleanup_failure",
                    "scanned": total_scanned,
                    "deleted": deleted,
                    "failed": failed,
                    "duration_ms": duration_ms,
                    "timestamp": datetime.now(UTC).isoformat(),
                }
            },
        )

    return {
        "scanned": total_scanned,
        "deleted": deleted,
        "failed": failed,
        "duration_ms": duration_ms,
    }
