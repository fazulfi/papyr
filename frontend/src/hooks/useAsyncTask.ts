import { useCallback, useEffect, useRef, useState } from 'react';

/* ── Types ── */

export interface UseAsyncTaskOptions {
  pollingIntervalMs?: number; // default 3000
  timeoutMs?: number; // default 180000 (3 min)
}

export interface AsyncTaskState {
  taskId: string | null;
  status: 'idle' | 'submitting' | 'queued' | 'processing' | 'done' | 'failed' | 'timeout';
  progress: number | null;
  result: Record<string, unknown> | null;
  error: string | null;
}

interface StatusResponse {
  task_id: string;
  status: 'queued' | 'processing' | 'done' | 'failed';
  progress?: number;
  result?: Record<string, unknown>;
  error?: string;
}

/* ── Hook ── */

export function useAsyncTask(
  submitUrl: string,
  options: UseAsyncTaskOptions & { statusBaseUrl?: string } = {},
) {
  const { pollingIntervalMs = 3000, timeoutMs = 180000, statusBaseUrl } = options;
  const normalizedStatusBaseUrl = (statusBaseUrl || submitUrl.replace(/\/[^/]+$/, '')).replace(
    /\/$/,
    '',
  );

  const [state, setState] = useState<AsyncTaskState>({
    taskId: null,
    status: 'idle',
    progress: null,
    result: null,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(
    async (taskId: string) => {
      if (!startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      if (elapsed >= timeoutMs) {
        clearPolling();
        setState((prev) => ({
          ...prev,
          status: 'timeout',
          error: 'Konversi timeout setelah 3 menit. Coba lagi dengan file lebih kecil.',
        }));
        return;
      }

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const response = await fetch(`${normalizedStatusBaseUrl}/status/${taskId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }

        const data: StatusResponse = await response.json();

        if (data.status === 'done') {
          clearPolling();
          setState((prev) => ({
            ...prev,
            status: 'done',
            progress: 100,
            result: data.result || null,
          }));
        } else if (data.status === 'failed') {
          clearPolling();
          setState((prev) => ({
            ...prev,
            status: 'failed',
            error: data.error || 'Konversi gagal.',
          }));
        } else {
          setState((prev) => ({
            ...prev,
            status: data.status,
            progress: data.progress ?? prev.progress,
          }));
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        clearPolling();
        setState((prev) => ({
          ...prev,
          status: 'failed',
          error: 'Gagal memeriksa status konversi.',
        }));
      }
    },
    [normalizedStatusBaseUrl, timeoutMs, clearPolling],
  );

  const submit = useCallback(
    async (formData: FormData) => {
      clearPolling();
      setState({
        taskId: null,
        status: 'submitting',
        progress: null,
        result: null,
        error: null,
      });

      try {
        const response = await fetch(submitUrl, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          const detail = body?.detail || `Server error (${response.status})`;
          throw new Error(detail);
        }

        const data = await response.json();
        const taskId = data.task_id;

        if (!taskId) {
          throw new Error('Server tidak mengembalikan task_id.');
        }

        setState({
          taskId,
          status: data.status || 'queued',
          progress: 0,
          result: null,
          error: null,
        });

        startTimeRef.current = Date.now();

        intervalRef.current = setInterval(() => {
          pollStatus(taskId);
        }, pollingIntervalMs);

        pollStatus(taskId);
      } catch (err) {
        setState({
          taskId: null,
          status: 'failed',
          progress: null,
          result: null,
          error: err instanceof Error ? err.message : 'Gagal mengirim file.',
        });
      }
    },
    [submitUrl, pollingIntervalMs, pollStatus, clearPolling],
  );

  const reset = useCallback(() => {
    clearPolling();
    startTimeRef.current = null;
    setState({
      taskId: null,
      status: 'idle',
      progress: null,
      result: null,
      error: null,
    });
  }, [clearPolling]);

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, [clearPolling]);

  return { state, submit, reset };
}
