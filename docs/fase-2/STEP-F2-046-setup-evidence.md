# STEP-F2-046 Setup Evidence

Date: 2026-05-17
Step: STEP-F2-046 — Setup Ruff untuk backend
Phase: Fase 2D — Quality (M19)
Status: Completed

## Scope Verified

- Install Ruff (`ruff==0.7.4`) as backend dev dependency.
- Add `backend/ruff.toml` with the agreed config: target Python 3.11, line-length 100, lint rules E/F/I/W/UP/B, isort first-party packages, double-quote format style.
- Run `ruff format` across `backend/` to normalize style.
- Run `ruff check --fix` (safe + unsafe) to apply mechanical lint fixes.
- Manually fix remaining 27 `B904` violations across routers/services/utils with `raise ... from exc` or `raise ... from None` as appropriate.
- Restore one explicit `import fitz  # noqa: F401` in `backend/routers/pdf_to_excel.py` because tests rely on patching `routers.pdf_to_excel.fitz.open`.
- Verify `ruff check .` and `ruff format --check .` both pass.
- Verify pytest still passes 208/208 (matches pre-change baseline).

Out of scope:
- Frontend formatting (covered by STEP-F2-045 with Prettier).
- Pre-existing pyright/basedpyright warnings unrelated to Ruff (left untouched per scope discipline).

## Files Changed

| File | Action |
|------|--------|
| `backend/requirements-dev.txt` | Modified (added `ruff==0.7.4`) |
| `backend/ruff.toml` | Created (target py311, line-length 100, rules E/F/I/W/UP/B, ignore E501/B008, isort first-party, double quotes) |
| `backend/**/*.py` (51 files) | Reformatted by Ruff and lint-fixed (mostly mechanical: import order, quote style, unused vars, deprecated `datetime.timezone.utc` → `datetime.UTC`, `from err` / `from None` on raises inside `except`) |
| `backend/routers/pdf_to_excel.py` | Restored `import fitz  # noqa: F401` so tests can patch `routers.pdf_to_excel.fitz.open` |
| `stepprompts/progress.md` | Modified (STEP-F2-046 → ✅ 2026-05-17, current step → STEP-F2-047, counters updated) |
| `docs/fase-2/STEP-F2-046-setup-evidence.md` | Created (this file) |

## Validation Evidence

### Ruff Config Highlights

```toml
target-version = "py311"
line-length = 100

[lint]
select = ["E", "F", "I", "W", "UP", "B"]
ignore = ["E501", "B008"]

[lint.isort]
known-first-party = ["routers", "services", "utils"]

[format]
quote-style = "double"
indent-style = "space"
```

- `E501` ignored because formatter handles wrapping; lint should not duplicate the concern.
- `B008` ignored because FastAPI's dependency-injection pattern (`= Depends(...)`, `= File(...)`) intentionally puts callables in default arguments.

### Lint + Format Final State

- `python -m ruff format .` (post-cleanup): `51 files already formatted` ✅
- `python -m ruff format --check .`: `51 files already formatted` ✅
- `python -m ruff check .`: `All checks passed!` ✅

### Lint Issue Remediation Summary

Initial scan reported 191 lint errors. Resolution:

| Stage | Errors | Method |
|-------|--------|--------|
| Initial scan | 191 | — |
| `ruff check --fix` (safe) | 139 fixed → 51 remaining | Auto-fix (import order, deprecated datetime alias, quote style, etc.) |
| `ruff check --fix --unsafe-fixes` | 24 more fixed → 27 remaining | Removed unused vars/loop-control assignments |
| Manual `from err` / `from None` | All 27 fixed → 0 remaining | Mechanical edits across 12 files |

Manual `B904` remediation map (chosen variant explained):

- `from exc`: when `except ... as exc:` was already in scope → preserves cause chain in logs/traceback.
- `from None`: when bare `except Exception:` / `except ValueError:` / `except FileNotFoundError:` / `except subprocess.TimeoutExpired:` → originals carried no useful cause for client-facing translated errors, so suppressing the chain is the correct intent.

Files touched manually for B904:
- `routers/compress.py`, `routers/image_to_pdf.py`, `routers/ocr.py`, `routers/pdf_to_excel.py`, `routers/pdf_to_image.py`, `routers/pdf_to_word.py`, `routers/protect.py`, `routers/unlock.py`
- `services/compress_service.py`, `services/encryption.py`, `services/pdf_to_image_service.py`
- `utils/pdf_validator.py`

### Pytest Regression

- Baseline before any Ruff change: `208 passed, 1239 warnings in 6.99s`.
- After Ruff format + auto-fix + manual B904 fixes (initial run): `5 failed, 203 passed` — caused by `--fix` removing the unused `import fitz` from `routers/pdf_to_excel.py`. Tests use `patch("routers.pdf_to_excel.fitz.open", ...)` and rely on the module-level attribute.
- Remediation: restored `import fitz  # noqa: F401  # PyMuPDF — exposed for tests to patch routers.pdf_to_excel.fitz.open`.
- Final pytest result: `208 passed, 1239 warnings in 5.73s` ✅ (identical to baseline).

## Definition of Done Mapping

| DoD Item | Status |
|----------|--------|
| Ruff installed + configured | ✅ `requirements-dev.txt` + `ruff.toml` |
| `ruff check .` passes (zero errors) | ✅ "All checks passed!" |
| `ruff format --check .` passes | ✅ "51 files already formatted" |
| Seluruh backend terformat | ✅ 51 Python files normalized |

## Docs Update Evidence

- `stepprompts/progress.md`:
  - `Current Step` → `STEP-F2-047`.
  - `Overall Progress` → `44 / 97 (45%)`.
  - Phase Summary 2D → `4 / 14 (29%)`.
  - TOTAL → `41 / 97 (42%)`.
  - `STEP-F2-046` → `✅ 2026-05-17`.

## Git / Push / Deploy Evidence

### 1) Completion Commits

> Filled after commit. Plan: 4 logical groups
> - chore: install Ruff + add ruff.toml.
> - style: mass `ruff format` reformat (whitespace/quotes/imports).
> - refactor: lint cleanups (B904 with explicit `from`, F841 unused vars, B007 loop vars, UP017 datetime alias).
> - chore: restore `import fitz` test-patch surface in pdf_to_excel.py.
> - docs: progress + this evidence doc.

### 2) Push

> Filled after push.

### 3) Deploy

- Pure tooling + safe lint cleanup. Production runtime semantics are preserved (verified via 208/208 pytest).
- `from exc` / `from None` on already-translated `HTTPException` / `RuntimeError` raises does not change client-visible error response (the translated message is preserved); only Python's traceback chain hint is normalized.
- Vercel/Railway redeploys are functionally a no-op.

## Notes

- The `import fitz` in `pdf_to_excel.py` is intentionally kept with `# noqa: F401`. The runtime code does not need it, but the existing test suite patches `routers.pdf_to_excel.fitz.open` as a module attribute. Removing the import would silently break those tests' setup, so the explicit `noqa` documents that the import is preserved as a test contract surface, not dead code.
- Tooling baseline pyright/basedpyright warnings inside `backend/` are pre-existing and unrelated to Ruff. They are not addressed in this step.
- Backend tests still emit DeprecationWarnings around `asyncio.get_event_loop_policy`, `botocore.auth.utcnow`, etc. — these warnings are pre-existing and outside Ruff's scope; they do not influence pass/fail.
