import { describe, it, expect } from "vitest";
import { limits } from "../config";

describe("config limits", () => {
  it("maxUploadBytes is 20MB", () => {
    expect(limits.maxUploadBytes).toBe(20 * 1024 * 1024);
  });

  it("maxUploadMB is 20", () => {
    expect(limits.maxUploadMB).toBe(20);
  });

  it("fileRetentionMinutes is 60", () => {
    expect(limits.fileRetentionMinutes).toBe(60);
  });

  it("allowedPdfMimeTypes contains application/pdf", () => {
    expect(limits.allowedPdfMimeTypes).toContain("application/pdf");
  });

  it("allowedImageMimeTypes contains jpeg, png, webp", () => {
    expect(limits.allowedImageMimeTypes).toContain("image/jpeg");
    expect(limits.allowedImageMimeTypes).toContain("image/png");
    expect(limits.allowedImageMimeTypes).toContain("image/webp");
  });
});
