import { test, expect } from "@playwright/test";
import { SAMPLE_PDF, SINGLE_PAGE_PDF, uploadPDF } from "./helpers";

/**
 * E2E coverage for client-side PDF tools (Merge, Split, Rotate, Sign).
 * All four pages process PDFs entirely in the browser via pdf-lib + the
 * shared `downloadPDF()` helper, which fires a programmatic <a> click.
 * Tests therefore intercept downloads with `page.waitForEvent("download")`.
 *
 * Selectors are the real Indonesian copy taken from the page sources at
 * `frontend/src/app/{merge,split,rotate,sign}/page.tsx`. There are no
 * data-testid attributes on these pages.
 */

test.describe("Merge PDF (Client-side)", () => {
  test("merges multiple PDFs into a single downloadable file", async ({ page }) => {
    await page.goto("/merge");
    await expect(page.getByRole("heading", { name: "Gabungkan PDF" })).toBeVisible();

    await page
      .locator('input[type="file"][multiple]')
      .setInputFiles([SAMPLE_PDF, SINGLE_PAGE_PDF]);

    await expect(page.getByText(/2 file dipilih/)).toBeVisible({ timeout: 10_000 });

    const mergeButton = page.getByRole("button", { name: "Gabungkan PDF" });
    await expect(mergeButton).toBeEnabled();

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      mergeButton.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

    await expect(page.getByText("PDF berhasil digabungkan!")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: "Unduh PDF Gabungan" })).toBeVisible();
  });

  test("disables merge button until at least two PDFs are selected", async ({ page }) => {
    await page.goto("/merge");

    const mergeButton = page.getByRole("button", { name: "Gabungkan PDF" });
    await expect(mergeButton).toBeDisabled();
    await expect(page.getByText("Upload minimal 2 file PDF untuk menggabungkan.")).toBeVisible();

    await page.locator('input[type="file"][multiple]').setInputFiles([SINGLE_PAGE_PDF]);
    await expect(page.getByText(/1 file dipilih/)).toBeVisible({ timeout: 10_000 });
    await expect(mergeButton).toBeDisabled();
  });
});

test.describe("Split PDF (Client-side)", () => {
  test("splits a multi-page PDF using a custom page range", async ({ page }) => {
    await page.goto("/split");
    await expect(page.getByRole("heading", { name: "Pisahkan PDF" })).toBeVisible();

    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.getByText(/3 halaman/)).toBeVisible({ timeout: 15_000 });

    const rangeInput = page.locator("#page-range");
    await rangeInput.fill("1-2");
    await expect(page.getByText(/Halaman yang dipilih:.*\(2 halaman\)/)).toBeVisible();

    const splitButton = page.getByRole("button", { name: "Pisahkan PDF" });
    await expect(splitButton).toBeEnabled();

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      splitButton.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

    await expect(page.getByText("PDF berhasil dipisahkan!")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole("button", { name: "Unduh PDF" })).toBeVisible();
  });

  test("rejects a page range outside the document length", async ({ page }) => {
    await page.goto("/split");
    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.getByText(/3 halaman/)).toBeVisible({ timeout: 15_000 });

    const rangeInput = page.locator("#page-range");
    await rangeInput.fill("99-100");

    await expect(page.getByText(/melebihi total halaman dokumen/)).toBeVisible({ timeout: 5_000 });

    const splitButton = page.getByRole("button", { name: "Pisahkan PDF" });
    await expect(splitButton).toBeDisabled();
  });
});

test.describe("Rotate PDF (Client-side)", () => {
  test("rotates all pages 90 degrees and downloads the result", async ({ page }) => {
    await page.goto("/rotate");
    await expect(page.getByRole("heading", { name: "Putar PDF" })).toBeVisible();

    await uploadPDF(page, SAMPLE_PDF);
    await expect(page.getByText(/3 halaman/)).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "Putar Semua 90°" }).click();

    const applyButton = page.getByRole("button", { name: /Putar \d+ halaman/ });
    await expect(applyButton).toBeVisible();
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    await expect(page.getByText("PDF berhasil diputar!")).toBeVisible({ timeout: 30_000 });

    const downloadButton = page.getByRole("button", { name: "Unduh PDF" });
    await expect(downloadButton).toBeVisible();
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      downloadButton.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });

  test("handles a single-page PDF rotation end to end", async ({ page }) => {
    await page.goto("/rotate");
    await uploadPDF(page, SINGLE_PAGE_PDF);
    await expect(page.getByText(/1 halaman/)).toBeVisible({ timeout: 15_000 });

    await page.getByRole("button", { name: "Putar Semua 180°" }).click();

    const applyButton = page.getByRole("button", { name: /Putar \d+ halaman/ });
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    await expect(page.getByText("PDF berhasil diputar!")).toBeVisible({ timeout: 30_000 });

    const downloadButton = page.getByRole("button", { name: "Unduh PDF" });
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      downloadButton.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  });
});

test.describe("Sign PDF (Client-side)", () => {
  test("draws a signature, places it on a page, and downloads the signed PDF", async ({ page }) => {
    await page.goto("/sign");
    await expect(page.getByRole("heading", { name: "Tanda Tangani PDF" })).toBeVisible();

    await page.locator('input[type="file"][accept="application/pdf"]').setInputFiles(SINGLE_PAGE_PDF);

    await expect(page.getByRole("button", { name: "Draw" })).toBeVisible({ timeout: 10_000 });

    const drawCanvas = page.locator('canvas[aria-label="Area menggambar tanda tangan"]');
    await expect(drawCanvas).toBeVisible();

    const drawBox = await drawCanvas.boundingBox();
    expect(drawBox).not.toBeNull();
    if (drawBox) {
      await page.mouse.move(drawBox.x + 30, drawBox.y + 40);
      await page.mouse.down();
      await page.mouse.move(drawBox.x + 110, drawBox.y + 70, { steps: 5 });
      await page.mouse.move(drawBox.x + 180, drawBox.y + 50, { steps: 5 });
      await page.mouse.up();
    }

    const useSignatureButton = page.getByRole("button", { name: "Gunakan Tanda Tangan" });
    await expect(useSignatureButton).toBeEnabled();
    await useSignatureButton.click();

    const continueButton = page.getByRole("button", { name: "Lanjut Tempatkan Signature" });
    await expect(continueButton).toBeEnabled({ timeout: 10_000 });
    await continueButton.click();

    const placementSurface = page.locator("canvas").first();
    await expect(placementSurface).toBeVisible({ timeout: 15_000 });

    const placementBox = await placementSurface.boundingBox();
    expect(placementBox).not.toBeNull();
    if (placementBox) {
      await page.mouse.click(
        placementBox.x + placementBox.width / 2,
        placementBox.y + placementBox.height / 2,
      );
    }

    const signButton = page.getByRole("button", { name: "Tanda Tangani PDF" });
    await expect(signButton).toBeEnabled({ timeout: 15_000 });

    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 30_000 }),
      signButton.click(),
    ]);
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);

    await expect(page.getByText(/PDF Ditandatangani/)).toBeVisible({ timeout: 30_000 });
  });

  test("does not allow signing when no placements have been added", async ({ page }) => {
    await page.goto("/sign");
    await page.locator('input[type="file"][accept="application/pdf"]').setInputFiles(SINGLE_PAGE_PDF);

    const continueButton = page.getByRole("button", { name: "Lanjut Tempatkan Signature" });
    await expect(continueButton).toBeVisible({ timeout: 10_000 });
    await expect(continueButton).toBeDisabled();
  });
});
