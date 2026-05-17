"""
Status endpoint — polling route for async tasks.

GET /api/status/{task_id}
Returns 200 with the task dict, or 404 if the task_id is unknown.

Refs: PAPYR-131, PAPYR-142
"""

from fastapi import APIRouter, HTTPException

from services.async_task import get_task, task_to_response

router = APIRouter(prefix="/api", tags=["status"])


@router.get("/status/{task_id}")
async def get_task_status(task_id: str) -> dict:
    """
    Retrieve the current status of an async task.

    - **task_id**: the hex UUID returned by the task-creation endpoint.
    - Returns 404 with ``{"detail": "Task not found"}`` when the ID
      does not exist or has already been garbage-collected.
    """
    task = get_task(task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_to_response(task)
