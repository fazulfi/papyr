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
});
