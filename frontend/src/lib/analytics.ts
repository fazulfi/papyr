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
  | "rotate"
  | "protect"
  | "unlock"
  | "watermark"
  | "sign"
  | "pdf-to-word"
  | "pdf-to-excel"
  | "ocr";

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

type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

export function trackTaskStarted(tool: ToolName, props: AnalyticsProps = {}) {
  track("task_started", { tool, device_category: getDeviceCategory(), ...props });
}

export function trackTaskCompleted(tool: ToolName, props: AnalyticsProps = {}) {
  track("task_completed", { tool, device_category: getDeviceCategory(), ...props });
}

export function trackTaskFailed(tool: ToolName, error: string, props: AnalyticsProps = {}) {
  track("task_failed", {
    tool,
    error: error.slice(0, 200),
    device_category: getDeviceCategory(),
    ...props,
  });
}
