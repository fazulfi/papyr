"""
Cloudflare R2 storage helpers for Papyr.

Provides upload, signed URL generation, and deletion for temporary PDF files.
Uses boto3 S3-compatible API with Cloudflare R2 endpoint.
"""

import os
import uuid
import logging
from datetime import datetime, timezone

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration — all from environment variables, never hardcoded
# ---------------------------------------------------------------------------
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID", "")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID", "")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY", "")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "papyr-files")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL", "")

R2_ENDPOINT = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

# Signed URL expiry — matches FILE_RETENTION_MINUTES (default 60 min)
SIGNED_URL_EXPIRY_SECONDS = int(os.getenv("FILE_RETENTION_MINUTES", "60")) * 60


def _get_client():
    """Create a boto3 S3 client configured for Cloudflare R2."""
    if not R2_ACCOUNT_ID or not R2_ACCESS_KEY_ID or not R2_SECRET_ACCESS_KEY:
        raise RuntimeError(
            "R2 credentials not configured. "
            "Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in .env"
        )

    return boto3.client(
        "s3",
        endpoint_url=R2_ENDPOINT,
        aws_access_key_id=R2_ACCESS_KEY_ID,
        aws_secret_access_key=R2_SECRET_ACCESS_KEY,
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
            Bucket=R2_BUCKET_NAME,
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
        "bucket": R2_BUCKET_NAME,
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
            Params={"Bucket": R2_BUCKET_NAME, "Key": object_key},
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
        client.delete_object(Bucket=R2_BUCKET_NAME, Key=object_key)
    except ClientError as e:
        logger.error("R2 delete failed for key=%s: %s", object_key, e)
        return False

    logger.info("R2 delete OK: key=%s", object_key)
    return True
