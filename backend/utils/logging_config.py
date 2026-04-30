"""
Konfigurasi structured logging untuk Papyr backend.

JSON formatter agar log terstruktur di Railway dashboard.
TIDAK BOLEH log: file names, file contents, user IPs.
"""

import json
import logging
import sys
from datetime import datetime, timezone


class JSONFormatter(logging.Formatter):
    """Format log records sebagai JSON satu baris."""

    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Tambahkan extra fields jika ada (untuk structured events)
        if hasattr(record, "event_data"):
            log_entry.update(record.event_data)

        # Tambahkan exception info jika ada
        if record.exc_info and record.exc_info[0] is not None:
            log_entry["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_entry, ensure_ascii=False)


def get_size_bucket(size_bytes: int) -> str:
    """Kategorikan ukuran file: small < 1MB, medium 1-10MB, large > 10MB."""
    if size_bytes < 1_048_576:  # 1 MB
        return "small"
    elif size_bytes <= 10_485_760:  # 10 MB
        return "medium"
    else:
        return "large"


def setup_logging() -> None:
    """
    Setup root logger dengan JSON formatter.
    Dipanggil sekali saat aplikasi start di main.py.
    """
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO)

    # Hapus handler default jika ada
    root_logger.handlers.clear()

    # Tambah handler ke stdout dengan JSON format
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    root_logger.addHandler(handler)

    # Kurangi noise dari library pihak ketiga
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("botocore").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)


def log_task_event(
    logger: logging.Logger,
    *,
    event: str,
    tool: str,
    duration_ms: int,
    input_size_bytes: int,
    success: bool,
    error: str | None = None,
    **extra,
) -> None:
    """
    Log structured task event.

    Contoh:
        log_task_event(
            logger,
            event="task_completed",
            tool="compress",
            duration_ms=1234,
            input_size_bytes=5_000_000,
            success=True,
        )
    """
    event_data = {
        "event": event,
        "tool": tool,
        "duration_ms": duration_ms,
        "input_size_bucket": get_size_bucket(input_size_bytes),
        "success": success,
    }

    if error:
        event_data["error"] = error

    if extra:
        event_data.update(extra)

    # Gunakan LogRecord dengan extra data
    record = logger.makeRecord(
        name=logger.name,
        level=logging.INFO if success else logging.ERROR,
        fn="",
        lno=0,
        msg=f"{event}: {tool}",
        args=(),
        exc_info=None,
    )
    record.event_data = event_data  # type: ignore[attr-defined]
    logger.handle(record)
