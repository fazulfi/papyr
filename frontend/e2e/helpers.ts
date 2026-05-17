import * as path from "path";
import { Page, expect } from "@playwright/test";

export const FIXTURES_DIR = path.join(__dirname, "fixtures");
export const SAMPLE_PDF = path.join(FIXTURES_DIR, "sample.pdf");
export const SINGLE_PAGE_PDF = path.join(FIXTURES_DIR, "single-page.pdf");

export async function uploadPDF(page: Page, filePath: string): Promise<void> {
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filePath);
}

export async function waitForProcessing(page: Page, timeout = 30_000): Promise<void> {
  await expect(
    page.locator('[data-testid="download-button"], a[download], button:has-text("Download")'),
  ).toBeVisible({ timeout });
}

export async function verifyToolPageLoads(page: Page, toolPath: string): Promise<void> {
  await page.goto(toolPath);
  await expect(page).toHaveURL(toolPath);
  await expect(page.locator("h1, h2").first()).toBeVisible();
  await expect(
    page.locator('[data-testid="upload-zone"], [class*="upload"], input[type="file"]'),
  ).toBeVisible();
}
