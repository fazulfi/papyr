import os
import sys
import importlib
from pathlib import Path
from typing import AsyncIterator
from unittest.mock import patch

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient


# Set required env vars BEFORE importing app/utils.config
os.environ["R2_ACCOUNT_ID"] = "test-account-id"
os.environ["R2_ACCESS_KEY_ID"] = "test-access-key"
os.environ["R2_SECRET_ACCESS_KEY"] = "test-secret-key"
os.environ["R2_BUCKET_NAME"] = "test-bucket"

# Optional test-focused envs
os.environ["MAX_UPLOAD_SIZE_MB"] = "20"
os.environ["RATE_LIMIT_PER_MINUTE"] = "10000"
os.environ["CORS_ORIGINS"] = "http://testserver"


# Ensure backend package-style imports (routers.*, services.*, utils.*) resolve
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

app = importlib.import_module("main").app


collect_ignore = [
    "test_compress.py",
    "test_edge_cases.py",
    "test_full_flow.py",
    "test_indonesia_files.py",
    "test_pdf_to_image.py",
    "test_autodelete_signed_url.py",
]


@pytest.fixture(autouse=True)
def mock_r2_and_cleanup():
    """Mock external dependencies globally for all tests."""
    with (
        patch("routers.compress.upload_file", return_value={"key": "mock-compress.pdf"}),
        patch(
            "routers.compress.generate_signed_url",
            return_value="https://example.com/mock-compress.pdf",
        ),
        patch("routers.image_to_pdf.upload_file", return_value={"key": "mock-images.pdf"}),
        patch(
            "routers.image_to_pdf.generate_signed_url",
            return_value="https://example.com/mock-images.pdf",
        ),
        patch("routers.pdf_to_image.upload_file", return_value={"key": "mock-pages.zip"}),
        patch(
            "routers.pdf_to_image.generate_signed_url",
            return_value="https://example.com/mock-pages.zip",
        ),
        patch("routers.watermark.upload_file", return_value={"key": "mock-watermarked.pdf"}),
        patch(
            "routers.watermark.generate_signed_url",
            return_value="https://example.com/mock-watermarked.pdf",
        ),
        patch("main.cleanup_expired_files", return_value={"deleted": 0, "failed": 0, "scanned": 0}),
        patch(
            "utils.cleanup.cleanup_expired_files",
            return_value={"deleted": 0, "failed": 0, "scanned": 0},
        ),
    ):
        yield


@pytest_asyncio.fixture
async def test_client() -> AsyncIterator[AsyncClient]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
