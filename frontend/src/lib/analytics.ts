import { track } from "@vercel/analytics";

/* ── Event Names ── */

export type AnalyticsEvent =
  | "task_started"
  | "task_completed"
  | "task_failed";

export type ToolName =
  | "compress"
  | "merge"
  | "split"
  | "image-to-pdf"
  | "pdf-to-image"
  | "rotate";

export type DeviceCategory = "mobile" | "tablet" | "desktop";

/* ── Device Detection ── */

function getDeviceCategory(): DeviceCategory {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/* ── Track Helpers ── */

export function trackTaskStarted(tool: ToolName) {
  track("task_started", { tool, device_category: getDeviceCategory() });
}

export function trackTaskCompleted(tool: ToolName) {
  track("task_completed", { tool, device_category: getDeviceCategory() });
}

export function trackTaskFailed(tool: ToolName, error: string) {
  track("task_failed", {
    tool,
    error: error.slice(0, 200),
    device_category: getDeviceCategory(),
  });
}
