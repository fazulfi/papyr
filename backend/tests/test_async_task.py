"""
Tests for STEP-F2-031: async task service and status endpoint.

Covers:
- Task lifecycle: create, get, update, serialization
- Background execution with success and timeout paths
- TTL cleanup of expired tasks
- GET /api/status/{task_id} — 200 and 404 cases
"""

import asyncio
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch

import pytest

from services.async_task import (
    TaskInfo,
    TaskStatus,
    _tasks,
    cleanup_expired_tasks,
    create_task,
    get_task,
    run_task_in_background,
    task_to_response,
    update_task_status,
)


# ---------------------------------------------------------------------------
# Task lifecycle — synchronous helpers
# ---------------------------------------------------------------------------

class TestCreateTask:
    def test_create_task_returns_task_info(self):
        task = create_task()
        assert isinstance(task, TaskInfo)
        assert task.task_id is not None
        assert task.status == TaskStatus.QUEUED
        assert task.created_at is not None
        assert task.started_at is None
        assert task.completed_at is None
        assert task.progress == 0
        assert task.result is None
        assert task.error is None

    def test_create_task_stores_in_memory(self):
        task = create_task()
        assert task.task_id in _tasks
        assert _tasks[task.task_id] is task

    def test_create_task_with_metadata(self):
        task = create_task(metadata={"source": "pdf-to-word"})
        assert task.metadata == {"source": "pdf-to-word"}


class TestGetTask:
    def test_get_existing_task(self):
        task = create_task()
        fetched = get_task(task.task_id)
        assert fetched is task

    def test_get_nonexistent_task_returns_none(self):
        assert get_task("nonexistent") is None


class TestUpdateTaskStatus:
    def test_update_status(self):
        task = create_task()
        updated = update_task_status(task.task_id, status=TaskStatus.PROCESSING)
        assert updated is task
        assert task.status == TaskStatus.PROCESSING

    def test_update_progress(self):
        task = create_task()
        update_task_status(task.task_id, progress=50)
        assert task.progress == 50

    def test_update_result(self):
        task = create_task()
        update_task_status(task.task_id, result={"download_url": "https://x"})
        assert task.result == {"download_url": "https://x"}

    def test_update_error(self):
        task = create_task()
        update_task_status(task.task_id, error="something failed")
        assert task.error == "something failed"

    def test_update_completed_at(self):
        task = create_task()
        now = datetime.now(timezone.utc)
        update_task_status(task.task_id, completed_at=now)
        assert task.completed_at == now

    def test_update_multiple_fields_at_once(self):
        task = create_task()
        now = datetime.now(timezone.utc)
        update_task_status(
            task.task_id,
            status=TaskStatus.DONE,
            progress=100,
            result="ok",
            completed_at=now,
        )
        assert task.status == TaskStatus.DONE
        assert task.progress == 100
        assert task.result == "ok"
        assert task.completed_at == now

    def test_update_nonexistent_task_returns_none(self):
        result = update_task_status("nonexistent", status=TaskStatus.DONE)
        assert result is None


class TestTaskToResponse:
    def test_response_serialization(self):
        task = create_task(metadata={"key": "val"})
        resp = task_to_response(task)
        assert resp["task_id"] == task.task_id
        assert resp["status"] == "queued"
        assert resp["created_at"] == task.created_at.isoformat()
        assert resp["started_at"] is None
        assert resp["completed_at"] is None
        assert resp["progress"] == 0
        assert resp["result"] is None
        assert resp["error"] is None
        assert resp["metadata"] == {"key": "val"}

    def test_response_with_all_fields(self):
        task = create_task()
        started = datetime.now(timezone.utc)
        completed = started + timedelta(seconds=5)
        task.started_at = started
        task.completed_at = completed
        task.status = TaskStatus.DONE
        task.progress = 100
        task.result = {"url": "https://r2.example.com/file.docx"}

        resp = task_to_response(task)
        assert resp["started_at"] == started.isoformat()
        assert resp["completed_at"] == completed.isoformat()
        assert resp["status"] == "done"
        assert resp["progress"] == 100
        assert resp["result"] == {"url": "https://r2.example.com/file.docx"}


# ---------------------------------------------------------------------------
# Background execution
# ---------------------------------------------------------------------------

class TestRunTaskInBackground:
    @pytest.mark.asyncio
    async def test_successful_execution(self):
        async def dummy_coro(value="ok"):
            return {"output": value}

        task = create_task()
        await run_task_in_background(dummy_coro, task_id=task.task_id, timeout=30, value="hello")

        assert task.status == TaskStatus.DONE
        assert task.result == {"output": "hello"}
        assert task.started_at is not None
        assert task.completed_at is not None

    @pytest.mark.asyncio
    async def test_forwards_task_id_to_coroutine_when_supported(self):
        async def dummy_coro(task_id: str):
            return {"task_id": task_id}

        task = create_task()
        await run_task_in_background(dummy_coro, task_id=task.task_id, timeout=30)

        assert task.status == TaskStatus.DONE
        assert task.result == {"task_id": task.task_id}

    @pytest.mark.asyncio
    async def test_timeout_sets_failed(self):
        async def slow_coro():
            await asyncio.sleep(10)
            return "never"

        task = create_task()
        await run_task_in_background(slow_coro, task_id=task.task_id, timeout=1)

        assert task.status == TaskStatus.FAILED
        assert "timed out" in task.error

    @pytest.mark.asyncio
    async def test_exception_sets_failed(self):
        async def failing_coro():
            raise ValueError("bad input")

        task = create_task()
        await run_task_in_background(failing_coro, task_id=task.task_id, timeout=30)

        assert task.status == TaskStatus.FAILED
        assert "bad input" in task.error

    @pytest.mark.asyncio
    async def test_timeout_is_configurable(self):
        """A short timeout (0.1s) should fire before a 1s sleep."""
        async def slow():
            await asyncio.sleep(1)
            return "done"

        task = create_task()
        await run_task_in_background(slow, task_id=task.task_id, timeout=0.1)

        assert task.status == TaskStatus.FAILED


# ---------------------------------------------------------------------------
# TTL cleanup
# ---------------------------------------------------------------------------

class TestCleanupExpiredTasks:
    def test_removes_old_tasks(self):
        old_task = create_task(metadata={"role": "old"})
        # Set created_at to 3 hours ago (past 2-hour TTL)
        old_task.created_at = datetime.now(timezone.utc) - timedelta(hours=3)

        fresh_task = create_task(metadata={"role": "fresh"})

        removed = cleanup_expired_tasks(ttl_hours=2)
        assert removed == 1
        assert old_task.task_id not in _tasks
        assert fresh_task.task_id in _tasks

    def test_removes_multiple_expired(self):
        for _ in range(3):
            t = create_task()
            t.created_at = datetime.now(timezone.utc) - timedelta(hours=5)

        fresh = create_task()

        removed = cleanup_expired_tasks(ttl_hours=2)
        assert removed == 3
        assert fresh.task_id in _tasks

    def test_no_tasks_to_remove(self):
        create_task()
        removed = cleanup_expired_tasks(ttl_hours=2)
        assert removed == 0


# ---------------------------------------------------------------------------
# HTTP endpoint via FastAPI test client
# ---------------------------------------------------------------------------

class TestStatusEndpoint:
    @pytest.mark.asyncio
    async def test_valid_task_returns_200(self, test_client):
        from services.async_task import _tasks  # noqa: E402

        task = create_task()
        response = await test_client.get(f"/api/status/{task.task_id}")

        assert response.status_code == 200
        body = response.json()
        assert body["task_id"] == task.task_id
        assert body["status"] == "queued"

    @pytest.mark.asyncio
    async def test_nonexistent_task_returns_404(self, test_client):
        response = await test_client.get("/api/status/thisdoesnotexist")
        assert response.status_code == 404
        body = response.json()
        assert body["detail"] == "Task not found"

    @pytest.mark.asyncio
    async def test_completed_task_serialization(self, test_client):
        task = create_task()
        task.status = TaskStatus.DONE
        task.progress = 100
        task.result = {"download_url": "https://cdn.example.com/file.docx"}
        task.completed_at = datetime.now(timezone.utc)
        task.started_at = datetime.now(timezone.utc) - timedelta(seconds=3)

        response = await test_client.get(f"/api/status/{task.task_id}")
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "done"
        assert body["progress"] == 100
        assert body["result"]["download_url"] == "https://cdn.example.com/file.docx"


# ---------------------------------------------------------------------------
# Isolation — clear _tasks between test classes that touch global state
# ---------------------------------------------------------------------------

@pytest.fixture(autouse=True)
def _clear_tasks():
    """Ensure _tasks dict is clean before each test."""
    _tasks.clear()
    yield
