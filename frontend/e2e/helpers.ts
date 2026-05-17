import * as path from 'path';
import { Page, expect } from '@playwright/test';

export const FIXTURES_DIR = path.join(__dirname, 'fixtures');
export const SAMPLE_PDF = path.join(FIXTURES_DIR, 'sample.pdf');
export const SINGLE_PAGE_PDF = path.join(FIXTURES_DIR, 'single-page.pdf');

export async function uploadPDF(page: Page, filePath: string): Promise<void> {
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(filePath);
}

/**
 * Wait for any client-side conversion tool's download CTA to appear.
 * The pages do not expose data-testid attributes; their stable identifier
 * is the visible Indonesian copy on the action button.
 */
export async function waitForDownloadButton(page: Page, timeout = 30_000): Promise<void> {
  await expect(
    page.getByRole('button', {
      name: /Unduh PDF Gabungan|Unduh PDF|Download Ulang|Download/i,
    }),
  ).toBeVisible({ timeout });
}

/**
 * Verify a tool page loads, has a heading, and exposes at least one file input.
 */
export async function verifyToolPageLoads(page: Page, toolPath: string): Promise<void> {
  await page.goto(toolPath);
  await expect(page).toHaveURL(toolPath);
  await expect(page.locator('h1, h2').first()).toBeVisible();
  await expect(page.locator('input[type="file"]').first()).toBeAttached();
}
