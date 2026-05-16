# STEP-F2-031 Setup Evidence

Date: 2026-05-16
Step: STEP-F2-031 — Backend — Create async task service (shared M16/M17)
Status: Completed (shared async task service and polling endpoint implemented, tested, and pushed)

## Scope Verified
- Shared async task service implemented in `backend/services/async_task.py`
- Task lifecycle states added: queued, processing, done, failed
- In-memory task storage implemented with 2-hour TTL cleanup
- Background execution implemented with timeout handling
- Polling endpoint added at `GET /api/status/{task_id}`
- Router registered in `backend/main.py`
- Focused backend tests added for service and endpoint behavior

## Files Changed
- `backend/services/async_task.py`
- `backend/routers/status.py`
- `backend/main.py`
- `backend/tests/test_async_task.py`
- `stepprompts/progress.md`
- `docs/fase-2/STEP-F2-031-setup-evidence.md`

## Validation Evidence

### 1) Service and endpoint test suite
**Command:**
```powershell
cd backend
python -m pytest tests/test_async_task.py -v --tb=short
```

**Result:**
- 24 tests passed
- 0 failed
- Covered:
  - `create_task()`
  - `get_task()`
  - `update_task_status()`
  - `task_to_response()`
  - `run_task_in_background()` success path
  - `run_task_in_background()` timeout path
  - `run_task_in_background()` exception path
  - `cleanup_expired_tasks()`
  - `GET /api/status/{task_id}` 200 response
  - `GET /api/status/{task_id}` 404 response

### 2) Scoped coverage for touched backend modules
**Command:**
```powershell
cd backend
python -m pytest tests/test_async_task.py --cov=services.async_task --cov=routers.status --cov-report=term-missing --tb=short
```

**Coverage output:**
```text
Name                     Stmts   Miss  Cover   Missing
------------------------------------------------------
routers\status.py            9      0   100%
services\async_task.py      79      1    99%   142
------------------------------------------------------
TOTAL                       88      1    99%
```

**Result:** ✅ Coverage requirement exceeded (>90%).

### 3) Diagnostics / type-check evidence
**Tool:** `lsp_diagnostics`

**Files checked:**
- `backend/services/async_task.py`
- `backend/routers/status.py`
- `backend/tests/test_async_task.py`

**Result:**
- No blocking diagnostics preventing runtime correctness
- Non-blocking basedpyright warnings remain about import style and explicit `Any` usage in backend Python files; runtime tests passed and endpoint behavior is correct

### 4) API route verification
**Observed route contract:**
- `GET /api/status/{task_id}` returns task JSON when task exists
- Unknown task returns:
```json
{"detail": "Task not found"}
```
with HTTP 404

## Docs Update Evidence
- `stepprompts/progress.md` updated:
  - `Last Updated`: `2026-05-16`
  - `Current Step`: `STEP-F2-032`
  - `Overall Progress`: `31 / 97 (32%)`
  - Fase 2C summary: `2 / 11 (18%)`
  - `STEP-F2-031` marked `✅ 2026-05-16`

## Notes
- This service is intentionally in-memory only, per STEP-F2-031 scope.
- It is shared groundwork for both M16 PDF-to-Word and M17 OCR.
- TTL cleanup removes tasks older than 2 hours.
- Timeout handling is configurable through `run_task_in_background(timeout=...)`.

## Git / Push / Deploy Evidence
### 1) Commits
Pending — fill after commits are created.

### 2) Push
Pending — fill after push completes.

### 3) Deploy
Pending — fill after push triggers Railway/Vercel workflow.

## Next Steps
- Proceed to `STEP-F2-032`
- Related backlog refs: `PAPYR-131`, `PAPYR-142`