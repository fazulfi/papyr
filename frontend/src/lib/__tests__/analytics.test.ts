import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @vercel/analytics before importing
vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}));

import { track } from "@vercel/analytics";
import { trackTaskStarted, trackTaskCompleted, trackTaskFailed } from "../analytics";

describe("analytics", () => {
  beforeEach(() => {
    vi.mocked(track).mockClear();
  });

  it("trackTaskStarted calls track with correct params including device_category", () => {
    trackTaskStarted("compress");
    expect(track).toHaveBeenCalledWith("task_started", {
      tool: "compress",
      device_category: "desktop",
    });
  });

  it("trackTaskCompleted calls track with correct params including device_category", () => {
    trackTaskCompleted("merge");
    expect(track).toHaveBeenCalledWith("task_completed", {
      tool: "merge",
      device_category: "desktop",
    });
  });

  it("trackTaskFailed calls track with tool, truncated error, and device_category", () => {
    const longError = "x".repeat(300);
    trackTaskFailed("split", longError);
    expect(track).toHaveBeenCalledWith("task_failed", {
      tool: "split",
      error: "x".repeat(200),
      device_category: "desktop",
    });
  });

  it("accepts additional analytics props for watermark flows", () => {
    trackTaskStarted("watermark", { watermark_type: "image" });
    expect(track).toHaveBeenLastCalledWith("task_started", {
      tool: "watermark",
      device_category: "desktop",
      watermark_type: "image",
    });

    trackTaskCompleted("watermark", { watermark_type: "image", pages_count: 3 });
    expect(track).toHaveBeenLastCalledWith("task_completed", {
      tool: "watermark",
      device_category: "desktop",
      watermark_type: "image",
      pages_count: 3,
    });

    trackTaskFailed("watermark", "timeout", {
      watermark_type: "image",
      error_type: "timeout",
    });
    expect(track).toHaveBeenLastCalledWith("task_failed", {
      tool: "watermark",
      error: "timeout",
      device_category: "desktop",
      watermark_type: "image",
      error_type: "timeout",
    });
  });
});
