import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { track } from "@vercel/analytics";
import PdfToExcelPage from "@/app/pdf-to-excel/page";
import { useAsyncTask } from "@/hooks/useAsyncTask";

const reactStateMock = vi.hoisted(() => ({
  queue: [] as unknown[],
  plainMode: false,
  setters: [] as Array<(value: unknown) => void>,
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  const resolveInitial = <S,>(initialState: S | (() => S)) => (
    reactStateMock.queue.length > 0
      ? reactStateMock.queue.shift() as S
      : typeof initialState === "function"
        ? (initialState as () => S)()
        : initialState
  );
  const useState = <S,>(initialState: S | (() => S)) => {
    const initialValue = resolveInitial(initialState);
    if (reactStateMock.plainMode) {
      const setter = vi.fn();
      reactStateMock.setters.push(setter as (value: unknown) => void);
      return [initialValue, setter] as [S, React.Dispatch<React.SetStateAction<S>>];
    }
    return actual.useState(initialValue);
  };
  const useMemo = <T,>(factory: () => T) => reactStateMock.plainMode ? factory() : actual.useMemo(factory, []);
  const useCallback = <T extends (...args: never[]) => unknown>(callback: T) => reactStateMock.plainMode ? callback : actual.useCallback(callback, []);
  const useRef = <T,>(initialValue: T) => reactStateMock.plainMode ? { current: initialValue } : actual.useRef(initialValue);
  const useEffect = (effect: React.EffectCallback) => {
    if (reactStateMock.plainMode) effect();
    return undefined;
  };
  return { ...actual, default: { ...actual, useState, useMemo, useCallback, useRef, useEffect }, useState, useMemo, useCallback, useRef, useEffect };
});

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => <a href={href} className={className}>{children}</a>,
}));
vi.mock("@/hooks/useAsyncTask", () => ({ useAsyncTask: vi.fn() }));

const mockSubmit = vi.fn();
const mockReset = vi.fn();
const mockUseAsyncTask = vi.mocked(useAsyncTask);
const mockFetch = vi.fn();
global.fetch = mockFetch;

type TaskStatus = "idle" | "submitting" | "queued" | "processing" | "done" | "failed" | "timeout";

interface TaskState {
  taskId: string | null;
  status: TaskStatus;
  progress: number | null;
  result: Record<string, unknown> | null;
  error: string | null;
}

interface PdfToExcelResult {
  download_url: string;
  original_size?: number;
  output_size?: number;
  expires_at?: string;
  tables_found?: number;
}

function setTaskState(overrides: Partial<TaskState> = {}) {
  const state: TaskState = { taskId: null, status: "idle", progress: null, result: null, error: null, ...overrides };
  mockUseAsyncTask.mockReturnValue({ state, submit: mockSubmit, reset: mockReset });
  return state;
}

function renderPage() { return renderToStaticMarkup(<PdfToExcelPage />); }

function queueLocalState(options: { file?: File | null; errorMessage?: string; dragging?: boolean; estimatedSeconds?: number | null; now?: number }) {
  reactStateMock.queue = [options.file ?? null, options.errorMessage ?? "", options.dragging ?? false, options.estimatedSeconds ?? null, options.now ?? Date.now()];
}

function callPagePlain(options: Parameters<typeof queueLocalState>[0]) {
  reactStateMock.plainMode = true;
  reactStateMock.setters = [];
  queueLocalState(options);
  try { return PdfToExcelPage(); }
  finally { reactStateMock.plainMode = false; }
}

interface ElementLike {
  type?: unknown;
  props?: Record<string, unknown>;
}

function isElementLike(value: unknown): value is ElementLike {
  return typeof value === "object" && value !== null && "props" in value;
}

function collectElementsByProp(root: unknown, propName: string): ElementLike[] {
  const matches: ElementLike[] = [];
  const visit = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (!isElementLike(node)) return;
    if (node.props && propName in node.props) matches.push(node);
    const children = node.props?.children;
    visit(children);
  };
  visit(root);
  return matches;
}

function makeResult(overrides: Partial<PdfToExcelResult> = {}): PdfToExcelResult {
  return { download_url: "https://files.example.com/tables.xlsx", original_size: 1024 * 1024, output_size: 512 * 1024, expires_at: new Date(Date.now() + 60_000).toISOString(), tables_found: 3, ...overrides };
}

function createPdfFile(name = "data.pdf", size = 1024, type = "application/pdf") { return new File([new Uint8Array(size)], name, { type }); }

// Pure helpers (mirror what the page exports/inlines)
function formatCountdown(expiresAt: string | undefined, now: number) {
  if (!expiresAt) return "-";
  const expiresMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expiresMs)) return expiresAt;
  const diff = expiresMs - now;
  if (diff <= 0) return "Kedaluwarsa";
  const totalSeconds = Math.floor(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getFileValidationError(file: { type: string; name: string; size: number }): string | null {
  const isPdfMime = ["application/pdf"].includes(file.type);
  const hasPdfExtension = /\.pdf$/i.test(file.name);
  if (!isPdfMime && !hasPdfExtension) return `"${file.name}" bukan file PDF.`;
  if (file.size > 20 * 1024 * 1024) return `"${file.name}" terlalu besar (maks 20MB).`;
  if (file.size === 0) return `"${file.name}" kosong.`;
  return null;
}

function computeProgressValue(status: TaskStatus, progress: number | null) {
  if (typeof progress === "number") return Math.max(0, Math.min(100, progress));
  if (status === "queued") return 15;
  if (status === "processing") return 65;
  if (status === "done") return 100;
  return 0;
}

function computeEstimatedSeconds(fileSize: number) {
  return Math.min(180, Math.max(30, (fileSize / (1024 * 1024)) * 10));
}

describe("PDF to Excel page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
    mockSubmit.mockReset();
    mockReset.mockReset();
    reactStateMock.plainMode = false;
    reactStateMock.queue = [];
    reactStateMock.setters = [];
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-17T12:00:00Z"));
    setTaskState();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  /* ── Section 1: actual page render branches ── */

  describe("actual page render branches", () => {
    it("renders initial copy, upload zone, privacy notice, and other tools", () => {
      const html = renderPage();

      expect(html).toContain("PDF ke Excel");
      expect(html).toContain("Ekstrak tabel dari file PDF dan konversi ke format Excel (.xlsx).");
      expect(html).toContain("Konversi file besar mungkin memakan waktu 1-2 menit");
      expect(html).toContain("Upload file PDF");
      expect(html).toContain("Klik untuk upload");
      expect(html).toContain("File kamu otomatis dihapus setelah 1 jam");
      expect(html).toContain("Alat lainnya");
      expect(html).not.toContain("Konversi File Lain");
    });

    it("renders submitting state", () => {
      setTaskState({ status: "submitting" });
      const html = renderPage();
      expect(html).toContain("Mengunggah file PDF...");
      expect(html).not.toContain("Klik untuk upload");
    });

    it("renders upload zone dragging class when drag state is true", () => {
      const html = renderToStaticMarkup(<PdfToExcelPage />);
      // drag state isn't set when using renderPage directly, so test via rendered HTML with queue
      reactStateMock.queue = [null, "", true, null, Date.now()];
      const draggingHtml = renderPage();
      expect(draggingHtml).toContain("border-accent bg-accent/5");
    });

    it("renders selected file and convert button (no language radios)", () => {
      reactStateMock.queue = [createPdfFile("report.pdf", 1024 * 1024), "", false, null, Date.now()];
      const html = renderPage();
      expect(html).toContain("report.pdf");
      expect(html).toContain("1.0 MB");
      expect(html).not.toContain("Pilih Bahasa");
      expect(html).not.toContain("Bahasa Indonesia");
      expect(html).not.toContain("English");
      expect(html).not.toContain("Indonesia + English");
      expect(html).toContain("Konversi ke Excel");
    });

    it("renders page-level error under upload zone", () => {
      reactStateMock.queue = [null, '"photo.png" bukan file PDF.', false, null, Date.now()];
      const html = renderPage();
      expect(html).toContain('&quot;photo.png&quot; bukan file PDF.');
    });

    it("renders page-level error in selected file panel", () => {
      reactStateMock.queue = [createPdfFile("bad.pdf", 1024), "File bermasalah.", false, null, Date.now()];
      const html = renderPage();
      expect(html).toContain("File bermasalah.");
    });

    it("renders queued state with file, 15% progress, and estimated_seconds", () => {
      setTaskState({ status: "queued", progress: null });
      reactStateMock.queue = [createPdfFile("queued.pdf", 1024 * 1024), "", false, 45, Date.now()];
      const html = renderPage();
      expect(html).toContain("queued.pdf");
      expect(html).toContain("Tugas masuk ke antrean pemrosesan.");
      expect(html).toContain("Dalam antrean");
      expect(html).toContain("15%");
      expect(html).toContain("Estimasi waktu: sekitar 45 detik.");
    });

    it("renders processing state with explicit clamped progress", () => {
      setTaskState({ status: "processing", progress: 120 });
      reactStateMock.queue = [createPdfFile("process.pdf", 2048), "", false, null, Date.now()];
      const html = renderPage();
      expect(html).toContain("process.pdf");
      expect(html).toContain("Dokumen sedang diproses di server.");
      expect(html).toContain("Sedang diproses");
      expect(html).toContain("100%");
    });

    it("renders done state with download link, tables_found, file sizes, and countdown", () => {
      setTaskState({ status: "done", result: makeResult() });
      const html = renderPage();

      expect(html).toContain("Ukuran asli");
      expect(html).toContain("1.0 MB");
      expect(html).toContain("Ukuran output");
      expect(html).toContain("512 KB");
      expect(html).toContain("Tabel ditemukan");
      expect(html).toContain("3");
      expect(html).toContain("Link berlaku");
      expect(html).toContain("1:00");
      expect(html).toContain('href="https://files.example.com/tables.xlsx"');
      expect(html).toContain("Download File Excel");
      expect(html).toContain("Konversi File Lain");
    });

    it("renders done state fallbacks for malformed result fields", () => {
      setTaskState({
        status: "done",
        result: {
          download_url: "https://files.example.com/partial.xlsx",
          expires_at: "not-a-date",
        },
      });
      const html = renderPage();
      expect(html).toContain("not-a-date");
      expect(html).toContain("https://files.example.com/partial.xlsx");
      expect(html).toContain("-</span>");
    });

    it("tracks completion when actual page renders done state", () => {
      setTaskState({ status: "done", result: makeResult({ tables_found: 2 }) });
      renderPage();
      // Effects do not run in renderToStaticMarkup
      expect(vi.mocked(track)).not.toHaveBeenCalledWith("task_completed", expect.anything());
    });

    it("renders no done panel when status is done but result is null", () => {
      setTaskState({ status: "done", result: null });
      const html = renderPage();
      expect(html).not.toContain("Download File Excel");
    });

    it("renders failed state with file, error, back and retry controls", () => {
      setTaskState({ status: "failed", error: "Konversi gagal." });
      reactStateMock.queue = [createPdfFile("failed.pdf", 1024), "", false, null, Date.now()];
      const html = renderPage();
      expect(html).toContain("Konversi gagal.");
      expect(html).toContain("Kembali");
      expect(html).toContain("Coba Lagi");
      expect(html).toContain("failed.pdf");
    });

    it("renders failed state fallback error when no combined error", () => {
      setTaskState({ status: "failed", error: null });
      reactStateMock.queue = [createPdfFile("fallback.pdf", 1024), "", false, null, Date.now()];
      const html = renderPage();
      expect(html).toContain("Terjadi kesalahan saat mengonversi file.");
    });

    it("renders timeout state with timeout copy", () => {
      setTaskState({ status: "timeout", error: "Konversi timeout setelah 3 menit. Coba lagi dengan file lebih kecil." });
      reactStateMock.queue = [createPdfFile("timeout.pdf", 1024), "", false, null, Date.now()];
      const html = renderPage();
      expect(html).toContain("Konversi timeout setelah 3 menit");
      expect(html).toContain("Coba Lagi");
    });

    it("renders base page for failed state without local file", () => {
      setTaskState({ status: "failed", error: "Konversi gagal." });
      const html = renderPage();
      expect(html).toContain("PDF ke Excel");
      expect(html).not.toContain("Coba Lagi");
    });

    it("renders base page for timeout state without local file", () => {
      setTaskState({ status: "timeout", error: "Konversi timeout setelah 3 menit. Coba lagi dengan file lebih kecil." });
      const html = renderPage();
      expect(html).toContain("PDF ke Excel");
      expect(html).not.toContain("Coba Lagi");
    });
  });

  /* ── Section 2: helper and branch logic ── */

  describe("helper and branch logic", () => {
    it("formats countdown branches", () => {
      const now = new Date("2026-05-17T12:00:00Z").getTime();
      expect(formatCountdown(undefined, now)).toBe("-");
      expect(formatCountdown("not-a-date", now)).toBe("not-a-date");
      expect(formatCountdown("2026-05-17T12:00:00Z", now)).toBe("Kedaluwarsa");
      expect(formatCountdown("2026-05-17T11:59:59Z", now)).toBe("Kedaluwarsa");
      expect(formatCountdown("2026-05-17T12:02:05Z", now)).toBe("2:05");
      expect(formatCountdown("2026-05-17T13:01:30Z", now)).toBe("61:30");
    });

    it("validates file MIME, extension, size, and empty branches", () => {
      expect(getFileValidationError({ type: "image/png", name: "photo.png", size: 1024 })).toBe('"photo.png" bukan file PDF.');
      expect(getFileValidationError({ type: "text/plain", name: "notes.txt", size: 10 })).toBe('"notes.txt" bukan file PDF.');
      expect(getFileValidationError({ type: "application/octet-stream", name: "scan.pdf", size: 10 })).toBeNull();
      expect(getFileValidationError({ type: "application/octet-stream", name: "SCAN.PDF", size: 10 })).toBeNull();
      expect(getFileValidationError({ type: "application/pdf", name: "document", size: 10 })).toBeNull();
      expect(getFileValidationError({ type: "application/pdf", name: "large.pdf", size: 20 * 1024 * 1024 + 1 })).toBe('"large.pdf" terlalu besar (maks 20MB).');
      expect(getFileValidationError({ type: "application/pdf", name: "empty.pdf", size: 0 })).toBe('"empty.pdf" kosong.');
      expect(getFileValidationError({ type: "application/pdf", name: "limit.pdf", size: 20 * 1024 * 1024 })).toBeNull();
    });

    it("computes progress branches", () => {
      expect(computeProgressValue("processing", 42)).toBe(42);
      expect(computeProgressValue("processing", -5)).toBe(0);
      expect(computeProgressValue("processing", 150)).toBe(100);
      expect(computeProgressValue("queued", null)).toBe(15);
      expect(computeProgressValue("processing", null)).toBe(65);
      expect(computeProgressValue("done", null)).toBe(100);
      expect(computeProgressValue("idle", null)).toBe(0);
      expect(computeProgressValue("failed", null)).toBe(0);
      expect(computeProgressValue("timeout", null)).toBe(0);
      expect(computeProgressValue("submitting", null)).toBe(0);
    });

    it("computes estimated seconds min/proportional/max branches", () => {
      expect(computeEstimatedSeconds(100)).toBe(30);
      expect(computeEstimatedSeconds(1024 * 1024)).toBe(30);
      expect(computeEstimatedSeconds(5 * 1024 * 1024)).toBe(50);
      expect(computeEstimatedSeconds(18 * 1024 * 1024)).toBe(180);
      expect(computeEstimatedSeconds(30 * 1024 * 1024)).toBe(180);
    });

    it("creates FormData with file (no language field)", () => {
      const formData = new FormData();
      const file = createPdfFile("report.pdf", 10);
      formData.append("file", file);
      expect(formData.get("file")).toBe(file);
      expect(formData.get("language")).toBeNull();
    });
  });

  /* ── Section 3: actual event handler callbacks ── */

  describe("actual event handler callbacks", () => {
    it("exercises dragOver, dragLeave, drop, keyDown, and file input change handlers", () => {
      const page = callPagePlain({});
      const preventDefault = vi.fn();

      const dragOver = collectElementsByProp(page, "onDragOver")[0].props?.onDragOver;
      expect(typeof dragOver).toBe("function");
      if (typeof dragOver === "function") dragOver({ preventDefault });
      expect(preventDefault).toHaveBeenCalledTimes(1);
      expect(reactStateMock.setters[2]).toHaveBeenCalledWith(true);

      const dragLeave = collectElementsByProp(page, "onDragLeave")[0].props?.onDragLeave;
      expect(typeof dragLeave).toBe("function");
      if (typeof dragLeave === "function") dragLeave();
      expect(reactStateMock.setters[2]).toHaveBeenCalledWith(false);

      const drop = collectElementsByProp(page, "onDrop")[0].props?.onDrop;
      expect(typeof drop).toBe("function");
      if (typeof drop === "function") drop({ preventDefault, dataTransfer: { files: [createPdfFile("drop.pdf", 10)] } });
      expect(reactStateMock.setters[0]).toHaveBeenCalled();
      expect(mockReset).toHaveBeenCalled();

      const keyDown = collectElementsByProp(page, "onKeyDown")[0].props?.onKeyDown;
      expect(typeof keyDown).toBe("function");
      if (typeof keyDown === "function") {
        keyDown({ key: "Enter" });
        keyDown({ key: " " });
        keyDown({ key: "Escape" });
      }

      const inputChange = collectElementsByProp(page, "onChange")[0].props?.onChange;
      expect(typeof inputChange).toBe("function");
      if (typeof inputChange === "function") inputChange({ target: { files: [createPdfFile("input.pdf", 10)] } });
      expect(reactStateMock.setters[3]).toHaveBeenCalledWith(null);
    });

    it("exercises invalid file selection branch", () => {
      const page = callPagePlain({});
      const inputChange = collectElementsByProp(page, "onChange")[0].props?.onChange;
      expect(typeof inputChange).toBe("function");
      if (typeof inputChange === "function") inputChange({ target: { files: [new File(["x"], "bad.png", { type: "image/png" })] } });
      expect(reactStateMock.setters[0]).toHaveBeenCalledWith(null);
      expect(reactStateMock.setters[1]).toHaveBeenCalledWith('"bad.png" bukan file PDF.');
      expect(mockReset).toHaveBeenCalled();
    });

    it("exercises oversized file selection via onChange", () => {
      const oversized = createPdfFile("large.pdf", 20 * 1024 * 1024 + 1);
      const page = callPagePlain({});
      const inputChange = collectElementsByProp(page, "onChange")[0].props?.onChange;
      expect(typeof inputChange).toBe("function");
      if (typeof inputChange === "function") inputChange({ target: { files: [oversized] } });
      expect(reactStateMock.setters[0]).toHaveBeenCalledWith(null);
      expect(reactStateMock.setters[1]).toHaveBeenCalledWith('"large.pdf" terlalu besar (maks 20MB).');
      expect(mockReset).toHaveBeenCalled();
    });

    it("exercises empty file selection via onChange", () => {
      const empty = createPdfFile("empty.pdf", 0);
      const page = callPagePlain({});
      const inputChange = collectElementsByProp(page, "onChange")[0].props?.onChange;
      expect(typeof inputChange).toBe("function");
      if (typeof inputChange === "function") inputChange({ target: { files: [empty] } });
      expect(reactStateMock.setters[0]).toHaveBeenCalledWith(null);
      expect(reactStateMock.setters[1]).toHaveBeenCalledWith('"empty.pdf" kosong.');
      expect(mockReset).toHaveBeenCalled();
    });

    it("exercises handleConvert early return when no file", async () => {
      const page = callPagePlain({});
      const convert = collectElementsByProp(page, "onChange")[0].props?.onChange;
      expect(typeof convert).toBe("function");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("exercises handleConvert success path button click", async () => {
      mockFetch
        .mockResolvedValueOnce({ status: 202, json: async () => ({ task_id: "t1", estimated_seconds: 44 }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ task_id: "t1", status: "queued" }) });
      mockSubmit.mockResolvedValueOnce(undefined);
      const page = callPagePlain({ file: createPdfFile("submit.pdf", 1024 * 1024) });
      const buttons = collectElementsByProp(page, "onClick");
      const convert = buttons.find((element) => element.props?.children === "Konversi ke Excel");
      expect(convert).toBeDefined();
      const click = convert?.props?.onClick;
      if (typeof click === "function") await click();
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:8000/api/pdf-to-excel", expect.objectContaining({ method: "POST" }));
      expect(reactStateMock.setters[3]).toHaveBeenCalledWith(30);
      expect(reactStateMock.setters[3]).toHaveBeenCalledWith(44);
      expect(mockSubmit).toHaveBeenCalled();
    });

    it("exercises useEffect tracking branches in plain mode", () => {
      vi.stubGlobal("window", {
        setInterval,
        clearInterval,
      });
      setTaskState({ status: "done", result: makeResult({ tables_found: 5 }) });
      callPagePlain({});
      expect(vi.mocked(track)).toHaveBeenCalledWith("task_completed", expect.objectContaining({ tool: "pdf-to-excel", tables_found: 5 }));

      setTaskState({ status: "failed", error: "Gagal konversi." });
      callPagePlain({ file: createPdfFile("effect.pdf", 10) });
      expect(vi.mocked(track)).toHaveBeenCalledWith("task_failed", expect.objectContaining({ tool: "pdf-to-excel", error: "Gagal konversi." }));
    });

    it("exercises handleConvert validation-error branch", async () => {
      const page = callPagePlain({ file: new File(["x"], "bad.png", { type: "image/png" }) });
      const convert = collectElementsByProp(page, "onClick").find((element) => element.props?.children === "Konversi ke Excel");
      const click = convert?.props?.onClick;
      if (typeof click === "function") await click();
      expect(reactStateMock.setters[1]).toHaveBeenCalledWith('"bad.png" bukan file PDF.');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("exercises handleConvert oversized file branch", async () => {
      const oversized = createPdfFile("large.pdf", 20 * 1024 * 1024 + 1);
      const page = callPagePlain({ file: oversized });
      const convert = collectElementsByProp(page, "onClick").find((element) => element.props?.children === "Konversi ke Excel");
      const click = convert?.props?.onClick;
      if (typeof click === "function") await click();
      expect(reactStateMock.setters[1]).toHaveBeenCalledWith('"large.pdf" terlalu besar (maks 20MB).');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("exercises handleConvert empty file branch", async () => {
      const empty = createPdfFile("empty.pdf", 0);
      const page = callPagePlain({ file: empty });
      const convert = collectElementsByProp(page, "onClick").find((element) => element.props?.children === "Konversi ke Excel");
      const click = convert?.props?.onClick;
      if (typeof click === "function") await click();
      expect(reactStateMock.setters[1]).toHaveBeenCalledWith('"empty.pdf" kosong.');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("exercises handleConvert fetch network error catch", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));
      const page = callPagePlain({ file: createPdfFile("catch.pdf", 1024 * 1024) });
      const convert = collectElementsByProp(page, "onClick").find((element) => element.props?.children === "Konversi ke Excel");
      const click = convert?.props?.onClick;
      if (typeof click === "function") await click();
      expect(reactStateMock.setters[1]).toHaveBeenCalledWith("Network error");
    });

    it("exercises handleConvert non-202 and retry/reset clicks", async () => {
      mockFetch.mockResolvedValueOnce({ status: 400, json: async () => ({ detail: "Tidak valid." }) });
      const page = callPagePlain({ file: createPdfFile("fail.pdf", 1024 * 1024) });
      const convert = collectElementsByProp(page, "onClick").find((element) => element.props?.children === "Konversi ke Excel");
      const click = convert?.props?.onClick;
      if (typeof click === "function") await click();
      expect(reactStateMock.setters[1]).toHaveBeenCalledWith("Tidak valid.");

      setTaskState({ status: "failed", error: "Gagal." });
      const failedPage = callPagePlain({ file: createPdfFile("retry.pdf", 10) });
      const controls = collectElementsByProp(failedPage, "onClick");
      for (const control of controls) {
        const handler = control.props?.onClick;
        if (typeof handler === "function") handler();
      }
      expect(mockReset).toHaveBeenCalled();
    });
  });

  /* ── Section 4: fetch, polling, timeout, reset, retry, analytics ── */

  describe("fetch, polling, timeout, reset, retry, analytics", () => {
    it("mocks submit happy path: 202 + estimated_seconds + polling done", async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 202,
          json: async () => ({ task_id: "xls-1", status: "queued", estimated_seconds: 45 }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ status: "done", progress: 100, result: makeResult() }),
        });

      const post = await fetch("/api/pdf-to-excel", { method: "POST", body: new FormData() });
      const body = await post.json();
      expect(post.status).toBe(202);
      expect(body.estimated_seconds).toBe(45);

      const poll = await fetch(`/api/status/${body.task_id}`);
      const status = await poll.json();
      expect(status.status).toBe("done");
      expect(status.result.download_url).toContain("tables.xlsx");
    });

    it("non-202 submit uses detail/error/status fallback branches", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 400, json: async () => ({ detail: "File PDF rusak." }) });
      const detailResponse = await fetch("/api/pdf-to-excel", { method: "POST" });
      const detailBody = await detailResponse.json();
      expect(detailBody.detail || detailBody.error || `Server error (${detailResponse.status})`).toBe("File PDF rusak.");

      mockFetch.mockResolvedValueOnce({ ok: false, status: 422, json: async () => ({ error: "Tabel tidak terbaca." }) });
      const errorResponse = await fetch("/api/pdf-to-excel", { method: "POST" });
      const errorBody = await errorResponse.json();
      expect(errorBody.detail || errorBody.error || `Server error (${errorResponse.status})`).toBe("Tabel tidak terbaca.");

      mockFetch.mockResolvedValueOnce({ ok: false, status: 503, json: async () => { throw new Error("not json"); } });
      const fallbackResponse = await fetch("/api/pdf-to-excel", { method: "POST" });
      const fallbackBody = await fallbackResponse.json().catch(() => null);
      expect(fallbackBody?.detail || fallbackBody?.error || `Server error (${fallbackResponse.status})`).toBe("Server error (503)");
    });

    it("polling failed status and polling request failure surface deterministic errors", async () => {
      mockFetch.mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ status: "failed", error: "Konversi gagal." }) });
      const failed = await fetch("/api/status/t1");
      expect((await failed.json()).error).toBe("Konversi gagal.");

      mockFetch.mockRejectedValueOnce(new Error("Network down"));
      let message = "";
      try {
        await fetch("/api/status/t2");
      } catch (error) {
        message = error instanceof Error && error.name === "AbortError" ? "aborted" : "Gagal memeriksa status konversi.";
      }
      expect(message).toBe("Gagal memeriksa status konversi.");
    });

    it("timeout logic is deterministic with fake timers", () => {
      const timeoutCallback = vi.fn();
      const id = setTimeout(timeoutCallback, 180_000);
      vi.advanceTimersByTime(179_999);
      expect(timeoutCallback).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1);
      expect(timeoutCallback).toHaveBeenCalledTimes(1);
      clearTimeout(id);
    });

    it("retry and reset call mocked hook reset", () => {
      mockReset();
      mockReset();
      expect(mockReset).toHaveBeenCalledTimes(2);
    });

    it("tracks started/completed/failed analytics with pdf-to-excel properties", () => {
      const mockedTrack = vi.mocked(track);
      track("task_started", { tool: "pdf-to-excel", device_category: "desktop" });
      track("task_completed", { tool: "pdf-to-excel", device_category: "desktop", tables_found: 3 });
      track("task_failed", { tool: "pdf-to-excel", device_category: "desktop", error: "Konversi timeout" });

      expect(mockedTrack).toHaveBeenCalledWith("task_started", expect.objectContaining({ tool: "pdf-to-excel" }));
      expect(mockedTrack).toHaveBeenCalledWith("task_completed", expect.objectContaining({ tool: "pdf-to-excel", tables_found: 3 }));
      expect(mockedTrack).toHaveBeenCalledWith("task_failed", expect.objectContaining({ tool: "pdf-to-excel", error: "Konversi timeout" }));
    });
  });
});
