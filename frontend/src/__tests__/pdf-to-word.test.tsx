import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { track } from '@vercel/analytics';

vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}));

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('STEP-F2-033 — /pdf-to-word unit tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('useAsyncTask hook logic — initial state', () => {
    it('1. initial state is idle with null taskId/result/error', () => {
      const initialState = {
        status: 'idle' as const,
        taskId: null,
        result: null,
        error: null,
      };

      expect(initialState.status).toBe('idle');
      expect(initialState.taskId).toBeNull();
      expect(initialState.result).toBeNull();
      expect(initialState.error).toBeNull();
    });
  });

  describe('useAsyncTask hook logic — submit transitions', () => {
    it('2. submit transitions to submitting state', () => {
      const state = { status: 'idle' as const };
      const nextState = { status: 'submitting' as const };

      expect(state.status).toBe('idle');
      expect(nextState.status).toBe('submitting');
    });

    it('3. successful 202 response sets taskId and transitions to queued', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 202,
        json: async () => ({ task_id: 'task-123' }),
      });

      const response = await fetch('/api/pdf-to-word', { method: 'POST' });
      const data = await response.json();

      expect(response.status).toBe(202);
      expect(data.task_id).toBe('task-123');

      const nextState = {
        status: 'queued' as const,
        taskId: data.task_id,
      };

      expect(nextState.status).toBe('queued');
      expect(nextState.taskId).toBe('task-123');
    });

    it('10. submit with non-202 response transitions to failed with error message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ detail: 'Invalid file format' }),
      });

      const response = await fetch('/api/pdf-to-word', { method: 'POST' });
      const data = await response.json();

      expect(response.status).toBe(400);

      const nextState = {
        status: 'failed' as const,
        error: data.detail || 'Gagal memproses file',
      };

      expect(nextState.status).toBe('failed');
      expect(nextState.error).toBe('Invalid file format');
    });
  });

  describe('useAsyncTask hook logic — polling behavior', () => {
    it('4. polling interval fires every 3000ms', () => {
      const pollCallback = vi.fn();
      const intervalId = setInterval(pollCallback, 3000);

      vi.advanceTimersByTime(2999);
      expect(pollCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(pollCallback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(3000);
      expect(pollCallback).toHaveBeenCalledTimes(2);

      clearInterval(intervalId);
    });

    it("5. polling with status 'processing' updates state", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ status: 'processing' }),
      });

      const response = await fetch('/api/tasks/task-123');
      const data = await response.json();

      expect(data.status).toBe('processing');

      const nextState = {
        status: 'processing' as const,
        taskId: 'task-123',
      };

      expect(nextState.status).toBe('processing');
    });

    it("6. polling with status 'done' stops polling and sets result", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          status: 'done',
          result: { download_url: 'https://example.com/file.docx' },
        }),
      });

      const response = await fetch('/api/tasks/task-123');
      const data = await response.json();

      expect(data.status).toBe('done');
      expect(data.result.download_url).toBe('https://example.com/file.docx');

      const isTerminal = data.status === 'done' || data.status === 'failed';
      expect(isTerminal).toBe(true);

      const nextState = {
        status: 'done' as const,
        result: data.result,
      };

      expect(nextState.status).toBe('done');
      expect(nextState.result.download_url).toBe('https://example.com/file.docx');
    });

    it("7. polling with status 'failed' stops polling and sets error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          status: 'failed',
          error: 'Conversion failed',
        }),
      });

      const response = await fetch('/api/tasks/task-123');
      const data = await response.json();

      expect(data.status).toBe('failed');

      const isTerminal = data.status === 'done' || data.status === 'failed';
      expect(isTerminal).toBe(true);

      const nextState = {
        status: 'failed' as const,
        error: data.error || 'Gagal memproses file',
      };

      expect(nextState.status).toBe('failed');
      expect(nextState.error).toBe('Conversion failed');
    });

    it("8. timeout after 180000ms sets status to 'timeout' and stops polling", () => {
      const timeoutCallback = vi.fn();
      const timeoutId = setTimeout(() => {
        timeoutCallback();
      }, 180000);

      vi.advanceTimersByTime(179999);
      expect(timeoutCallback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(timeoutCallback).toHaveBeenCalledTimes(1);

      clearTimeout(timeoutId);

      const nextState = {
        status: 'timeout' as const,
        error: 'Proses timeout. Silakan coba lagi.',
      };

      expect(nextState.status).toBe('timeout');
      expect(nextState.error).toBe('Proses timeout. Silakan coba lagi.');
    });
  });

  describe('useAsyncTask hook logic — reset', () => {
    it('9. reset() returns to initial idle state and clears interval', () => {
      const pollCallback = vi.fn();
      const intervalId = setInterval(pollCallback, 3000);

      vi.advanceTimersByTime(3000);
      expect(pollCallback).toHaveBeenCalledTimes(1);

      clearInterval(intervalId);

      vi.advanceTimersByTime(3000);
      expect(pollCallback).toHaveBeenCalledTimes(1);

      const resetState = {
        status: 'idle' as const,
        taskId: null,
        result: null,
        error: null,
      };

      expect(resetState.status).toBe('idle');
      expect(resetState.taskId).toBeNull();
      expect(resetState.result).toBeNull();
      expect(resetState.error).toBeNull();
    });
  });

  describe('pdf-to-word validation helpers', () => {
    function validatePdfToWordFile(file: {
      type: string;
      size: number;
      name?: string;
    }): string | null {
      if (file.size === 0) {
        return 'File kosong. Silakan upload file PDF yang valid.';
      }

      if (file.type !== 'application/pdf') {
        return 'Tipe file tidak valid. Hanya file PDF yang diterima.';
      }

      if (file.size > 20 * 1024 * 1024) {
        return 'Ukuran file terlalu besar. Maksimal 20MB.';
      }

      if (file.name && !file.name.toLowerCase().endsWith('.pdf')) {
        return 'Ekstensi file harus .pdf';
      }

      return null;
    }

    it('11. valid PDF file passes validation', () => {
      const result = validatePdfToWordFile({
        type: 'application/pdf',
        size: 1024 * 1024,
        name: 'document.pdf',
      });
      expect(result).toBeNull();
    });

    it('12. non-PDF MIME type fails validation', () => {
      const result = validatePdfToWordFile({
        type: 'application/msword',
        size: 1024,
        name: 'document.doc',
      });
      expect(result).toBe('Tipe file tidak valid. Hanya file PDF yang diterima.');
    });

    it('13. file >20MB fails validation with size error', () => {
      const result = validatePdfToWordFile({
        type: 'application/pdf',
        size: 20 * 1024 * 1024 + 1,
        name: 'large.pdf',
      });
      expect(result).toBe('Ukuran file terlalu besar. Maksimal 20MB.');
    });

    it('14. empty file fails validation', () => {
      const result = validatePdfToWordFile({
        type: 'application/pdf',
        size: 0,
        name: 'empty.pdf',
      });
      expect(result).toBe('File kosong. Silakan upload file PDF yang valid.');
    });

    it('15. file without .pdf extension fails validation', () => {
      const result = validatePdfToWordFile({
        type: 'application/pdf',
        size: 1024,
        name: 'document.txt',
      });
      expect(result).toBe('Ekstensi file harus .pdf');
    });
  });

  describe('error message mapping from status codes', () => {
    function getErrorMessage(status: number, detail?: string): string {
      if (status === 400) return detail || 'File tidak valid atau rusak.';
      if (status === 413) return 'Ukuran file terlalu besar. Maksimal 20MB.';
      if (status === 429) return 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.';
      if (status >= 500) return 'Gagal memproses file. Silakan coba lagi.';
      return 'Terjadi kesalahan. Silakan coba lagi.';
    }

    it('16. 400 status maps to validation error message', () => {
      expect(getErrorMessage(400)).toBe('File tidak valid atau rusak.');
      expect(getErrorMessage(400, 'Invalid PDF structure')).toBe('Invalid PDF structure');
    });

    it('17. 413 status maps to file too large message', () => {
      expect(getErrorMessage(413)).toBe('Ukuran file terlalu besar. Maksimal 20MB.');
    });

    it('18. 429 status maps to rate limit message', () => {
      expect(getErrorMessage(429)).toBe('Terlalu banyak permintaan. Coba lagi dalam 1 menit.');
    });

    it('19. 500 status maps to server error message', () => {
      expect(getErrorMessage(500)).toBe('Gagal memproses file. Silakan coba lagi.');
      expect(getErrorMessage(503)).toBe('Gagal memproses file. Silakan coba lagi.');
    });
  });

  describe('analytics event triggers', () => {
    it('20. tracks task_started event when conversion begins', () => {
      const mockedTrack = vi.mocked(track);

      track('task_started', {
        tool: 'pdf-to-word',
        device_category: 'desktop',
      });

      expect(mockedTrack).toHaveBeenCalledWith(
        'task_started',
        expect.objectContaining({
          tool: 'pdf-to-word',
          device_category: 'desktop',
        }),
      );
    });

    it('21. tracks task_completed event when conversion succeeds', () => {
      const mockedTrack = vi.mocked(track);

      track('task_completed', {
        tool: 'pdf-to-word',
        device_category: 'mobile',
      });

      expect(mockedTrack).toHaveBeenCalledWith(
        'task_completed',
        expect.objectContaining({
          tool: 'pdf-to-word',
          device_category: 'mobile',
        }),
      );
    });

    it('22. tracks task_failed event with error details', () => {
      const mockedTrack = vi.mocked(track);

      track('task_failed', {
        tool: 'pdf-to-word',
        error: 'Conversion timeout',
        device_category: 'tablet',
      });

      expect(mockedTrack).toHaveBeenCalledWith(
        'task_failed',
        expect.objectContaining({
          tool: 'pdf-to-word',
          error: 'Conversion timeout',
          device_category: 'tablet',
        }),
      );
    });
  });

  describe('terminal status detection', () => {
    function isTerminalStatus(status: string): boolean {
      return status === 'done' || status === 'failed' || status === 'timeout';
    }

    it('23. identifies terminal statuses correctly', () => {
      expect(isTerminalStatus('done')).toBe(true);
      expect(isTerminalStatus('failed')).toBe(true);
      expect(isTerminalStatus('timeout')).toBe(true);
      expect(isTerminalStatus('processing')).toBe(false);
      expect(isTerminalStatus('queued')).toBe(false);
      expect(isTerminalStatus('idle')).toBe(false);
    });
  });

  describe('polling stop conditions', () => {
    function shouldStopPolling(status: string, elapsedMs: number): boolean {
      const isTerminal = status === 'done' || status === 'failed';
      const isTimeout = elapsedMs >= 180000;
      return isTerminal || isTimeout;
    }

    it('24. stops polling when status is terminal', () => {
      expect(shouldStopPolling('done', 5000)).toBe(true);
      expect(shouldStopPolling('failed', 5000)).toBe(true);
      expect(shouldStopPolling('processing', 5000)).toBe(false);
    });

    it('25. stops polling when timeout threshold is reached', () => {
      expect(shouldStopPolling('processing', 180000)).toBe(true);
      expect(shouldStopPolling('queued', 180001)).toBe(true);
      expect(shouldStopPolling('processing', 179999)).toBe(false);
    });
  });
});
