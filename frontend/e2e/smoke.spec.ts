import { test, expect } from '@playwright/test';

const TOOL_PATHS = [
  '/compress',
  '/merge',
  '/split',
  '/rotate',
  '/image-to-pdf',
  '/pdf-to-image',
  '/protect',
  '/unlock',
  '/watermark',
  '/sign',
  '/pdf-to-word',
  '/ocr',
  '/pdf-to-excel',
];

test.describe('Smoke Test', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Papyr/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('all 13 tool pages are accessible', async ({ page }) => {
    for (const toolPath of TOOL_PATHS) {
      const response = await page.goto(toolPath);
      expect(response?.status()).toBe(200);
    }
  });
});
