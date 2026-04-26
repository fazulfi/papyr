"""
Cloudflare R2 storage helpers for Papyr.

Provides upload, signed URL generation, and deletion for temporary PDF files.
Uses boto3 S3-compatible API with Cloudflare R2 endpoint.
"""

import uuid
import logging
from datetime import datetime, timezone

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from utils.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Derived constants from centralized settings
# ---------------------------------------------------------------------------
R2_ENDPOINT = f"https://{settings.r2_account_id}.r2.cloudflarestorage.com"
SIGNED_URL_EXPIRY_SECONDS = settings.file_retention_minutes * 60


def _get_client():
    """Create a boto3 S3 client configured for Cloudflare R2."""
    return boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=settings.r2_access_key_id,
        aws_secret_access_key=settings.r2_secret_access_key,
        config=Config(
            signature_version="s3v4",
            retries={"max_attempts": 2, "mode": "standard"},
        ),
        region_name="auto",
    )


def upload_file(
    file_bytes: bytes,
    original_filename: str,
    content_type: str = "application/pdf",
) -> dict:
    """
    Upload a file to R2 with a UUID-based key.

    Args:
        file_bytes: Raw file content.
        original_filename: Original name (used for extension only).
        content_type: MIME type of the file.

    Returns:
        dict with keys: "key", "bucket", "size_bytes", "uploaded_at"

    Raises:
        RuntimeError: If R2 credentials are missing.
        ClientError: If the upload fails.
    """
    client = _get_client()

    # Extract extension from original filename
    ext = ""
    if "." in original_filename:
        ext = "." + original_filename.rsplit(".", 1)[-1].lower()

    # UUID key — no user-identifiable info, no content logging
    object_key = f"{uuid.uuid4().hex}{ext}"

    try:
        client.put_object(
            Bucket=settings.r2_bucket_name,
            Key=object_key,
            Body=file_bytes,
            ContentType=content_type,
        )
    except ClientError as e:
        logger.error("R2 upload failed for key=%s: %s", object_key, e)
        raise

    logger.info(
        "R2 upload OK: key=%s size=%d content_type=%s",
        object_key,
        len(file_bytes),
        content_type,
    )

    return {
        "key": object_key,
        "bucket": settings.r2_bucket_name,
        "size_bytes": len(file_bytes),
        "uploaded_at": datetime.now(timezone.utc).isoformat(),
    }


def generate_signed_url(object_key: str, expiry_seconds: int | None = None) -> str:
    """
    Generate a pre-signed GET URL for downloading a file from R2.

    Args:
        object_key: The R2 object key.
        expiry_seconds: URL validity in seconds. Defaults to SIGNED_URL_EXPIRY_SECONDS.

    Returns:
        Pre-signed URL string.
    """
    client = _get_client()

    if expiry_seconds is None:
        expiry_seconds = SIGNED_URL_EXPIRY_SECONDS

    try:
        url = client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.r2_bucket_name, "Key": object_key},
            ExpiresIn=expiry_seconds,
        )
    except ClientError as e:
        logger.error("R2 signed URL failed for key=%s: %s", object_key, e)
        raise

    return url


def delete_file(object_key: str) -> bool:
    """
    Delete a file from R2.

    Args:
        object_key: The R2 object key to delete.

    Returns:
        True if deletion succeeded (or object didn't exist).
    """
    client = _get_client()

    try:
        client.delete_object(Bucket=settings.r2_bucket_name, Key=object_key)
    except ClientError as e:
        logger.error("R2 delete failed for key=%s: %s", object_key, e)
        return False

    logger.info("R2 delete OK: key=%s", object_key)
    return True
