"""
Shared async task service for M16 (PDF-to-Word) and M17 (OCR).

Provides in-memory task lifecycle management with background
execution, timeout, and TTL cleanup.

Refs: PAPYR-131, PAPYR-142
"""

from __future__ import annotations

import asyncio
import inspect
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict, dataclass, field
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any, Callable, Optional


class TaskStatus(Enum):
    """Task lifecycle states."""

    QUEUED = "queued"
    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"


@dataclass
class TaskInfo:
    """Internal representation of an async task."""

    task_id: str
    status: TaskStatus
    created_at: datetime
    started_at: datetime | None = None
    completed_at: datetime | None = None
    progress: int = 0
    result: Any = None
    error: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


# In-memory storage
_tasks: dict[str, TaskInfo] = {}
_TTL_HOURS = 2


def create_task(
    *,
    metadata: dict[str, Any] | None = None,
) -> TaskInfo:
    """Create a new task and store it in memory."""
    task_id = uuid.uuid4().hex
    now = datetime.now(timezone.utc)
    task = TaskInfo(
        task_id=task_id,
        status=TaskStatus.QUEUED,
        created_at=now,
        metadata=metadata or {},
    )
    _tasks[task_id] = task
    return task


def get_task(task_id: str) -> TaskInfo | None:
    """Look up a task by ID. Returns None if not found."""
    return _tasks.get(task_id)


def update_task_status(
    task_id: str,
    *,
    status: TaskStatus | None = None,
    progress: int | None = None,
    result: Any = None,
    error: str | None = None,
    completed_at: datetime | None = None,
) -> TaskInfo | None:
    """Update fields on an existing task. Returns the task or None."""
    task = _tasks.get(task_id)
    if task is None:
        return None

    if status is not None:
        task.status = status
    if progress is not None:
        task.progress = progress
    if result is not None:
        task.result = result
    if error is not None:
        task.error = error
    if completed_at is not None:
        task.completed_at = completed_at

    return task


def task_to_response(task: TaskInfo) -> dict:
    """Convert a TaskInfo to the JSON-serialisable API response dict."""
    return {
        "task_id": task.task_id,
        "status": task.status.value,
        "created_at": task.created_at.isoformat(),
        "started_at": task.started_at.isoformat() if task.started_at else None,
        "completed_at": task.completed_at.isoformat() if task.completed_at else None,
        "progress": task.progress,
        "result": task.result,
        "error": task.error,
        "metadata": task.metadata,
    }


async def run_task_in_background(
    coro_func: Callable,
    *,
    task_id: str,
    timeout: int = 120,
    **coro_kwargs: Any,
) -> None:
    """
    Execute a coroutine in the background with a timeout.

    The task's status is updated to PROCESSING at the start and
    to DONE or FAILED when the coroutine completes or errors out.

    Parameters
    ----------
    coro_func:
        An async callable (e.g. ``async def convert(...)``).
    task_id:
        The task ID whose row in ``_tasks`` will be updated.
    timeout:
        Maximum seconds the coroutine may run; a ``TimeoutError``
        sets the task status to FAILED.
    **coro_kwargs:
        Keyword arguments forwarded to ``coro_func``.
    """
    task = _tasks.get(task_id)
    if task is None:
        return

    now = datetime.now(timezone.utc)
    _update_helper(task_id, started_at=now, status=TaskStatus.PROCESSING)

    loop = asyncio.get_running_loop()

    try:
        call_kwargs = dict(coro_kwargs)
        signature = inspect.signature(coro_func)
        accepts_task_id = "task_id" in signature.parameters or any(
            parameter.kind is inspect.Parameter.VAR_KEYWORD
            for parameter in signature.parameters.values()
        )
        if accepts_task_id and "task_id" not in call_kwargs:
            call_kwargs["task_id"] = task_id

        result = await asyncio.wait_for(
            coro_func(**call_kwargs),
            timeout=timeout,
        )
        completed_at = datetime.now(timezone.utc)
        _update_helper(
            task_id,
            status=TaskStatus.DONE,
            result=result,
            completed_at=completed_at,
        )
    except asyncio.TimeoutError:
        completed_at = datetime.now(timezone.utc)
        _update_helper(
            task_id,
            status=TaskStatus.FAILED,
            error=f"Task timed out after {timeout}s",
            completed_at=completed_at,
        )
    except Exception as exc:
        completed_at = datetime.now(timezone.utc)
        _update_helper(
            task_id,
            status=TaskStatus.FAILED,
            error=str(exc),
            completed_at=completed_at,
        )


def _update_helper(task_id: str, **kwargs: Any) -> None:
    """Internal helper to avoid repeated lookups."""
    task = _tasks.get(task_id)
    if task is not None:
        for key, value in kwargs.items():
            setattr(task, key, value)


def cleanup_expired_tasks(ttl_hours: int = _TTL_HOURS) -> int:
    """
    Remove tasks older than ``ttl_hours`` from ``_tasks``.

    Returns the number of tasks removed.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(hours=ttl_hours)
    expired_ids = [
        tid for tid, t in _tasks.items() if t.created_at < cutoff
    ]
    for tid in expired_ids:
        del _tasks[tid]
    return len(expired_ids)
