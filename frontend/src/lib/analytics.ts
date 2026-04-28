import { track } from "@vercel/analytics";

/* ── Event Names ── */

export type AnalyticsEvent = "task_started" | "task_completed" | "task_failed";

export type ToolName =
  | "compress"
  | "merge"
  | "split"
  | "image-to-pdf"
  | "pdf-to-image";

/* ── Track Helpers ── */

export function trackTaskStarted(tool: ToolName) {
  track("task_started", { tool });
}

export function trackTaskCompleted(tool: ToolName) {
  track("task_completed", { tool });
}

export function trackTaskFailed(tool: ToolName, error: string) {
  track("task_failed", { tool, error: error.slice(0, 200) });
}
