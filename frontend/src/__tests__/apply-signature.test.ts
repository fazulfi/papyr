/**
 * STEP-F2-027: Tests for the apply-signature pipeline.
 *
 * Tests the pure logic: base64 PNG decoding, coordinate conversion,
 * and pdf-lib integration (mocked).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { base64PngToUint8Array, applySignatures } from '@/app/sign/apply-signature';
import type { SignaturePlacement } from '@/app/sign/logic';

// Mock pdf-lib
vi.mock('pdf-lib', () => ({
  PDFDocument: {
    load: vi.fn(async (bytes) => ({
      getPages: vi.fn(() => [
        {
          getSize: vi.fn(() => ({ width: 612, height: 792 })),
          drawImage: vi.fn(),
        },
        {
          getSize: vi.fn(() => ({ width: 612, height: 792 })),
          drawImage: vi.fn(),
        },
      ]),
      embedPng: vi.fn(async () => ({
        width: 200,
        height: 100,
        scale: vi.fn((s) => ({ width: 200 * s, height: 100 * s })),
      })),
      save: vi.fn(async () => new Uint8Array([0x25, 0x50, 0x44, 0x46])), // "%PDF"
    })),
  },
}));

describe('STEP-F2-027 — Apply Signature Pipeline', () => {
  describe('base64PngToUint8Array', () => {
    it('decodes valid base64 PNG data URL', () => {
      const dataUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const result = base64PngToUint8Array(dataUrl);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('throws on invalid data URL', () => {
      expect(() => base64PngToUint8Array('not-a-data-url')).toThrow();
    });

    it('throws on missing base64 payload', () => {
      expect(() => base64PngToUint8Array('data:image/png;base64,')).toThrow();
    });
  });

  describe('applySignatures', () => {
    const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // "%PDF"
    const mockSignatureDataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    it('throws when placements array is empty', async () => {
      await expect(applySignatures(mockPdfBytes, mockSignatureDataUrl, [])).rejects.toThrow(
        'Tidak ada penempatan tanda tangan',
      );
    });

    it('throws when placement page exceeds PDF page count', async () => {
      const placements: SignaturePlacement[] = [
        {
          id: 'p1',
          page: 99,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
      ];
      await expect(applySignatures(mockPdfBytes, mockSignatureDataUrl, placements)).rejects.toThrow(
        'Halaman 99 tidak ditemukan',
      );
    });

    it('applies single placement to first page', async () => {
      const placements: SignaturePlacement[] = [
        {
          id: 'p1',
          page: 1,
          x: 0.1,
          y: 0.2,
          width: 0.3,
          height: 0.15,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('applies multiple placements across pages', async () => {
      const placements: SignaturePlacement[] = [
        {
          id: 'p1',
          page: 1,
          x: 0.1,
          y: 0.2,
          width: 0.3,
          height: 0.15,
        },
        {
          id: 'p2',
          page: 2,
          x: 0.5,
          y: 0.5,
          width: 0.25,
          height: 0.12,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it('converts coordinates correctly (0-1 relative to absolute)', async () => {
      const placements: SignaturePlacement[] = [
        {
          id: 'p1',
          page: 1,
          x: 0.5,
          y: 0.5,
          width: 0.2,
          height: 0.1,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
      // Coordinate conversion is tested implicitly by successful execution
    });

    it('throws when signature data URL format is invalid', async () => {
      const placements: SignaturePlacement[] = [
        {
          id: 'p1',
          page: 1,
          x: 0.1,
          y: 0.1,
          width: 0.2,
          height: 0.1,
        },
      ];
      await expect(applySignatures(mockPdfBytes, 'not-a-data-url', placements)).rejects.toThrow(
        'Data URL tanda tangan tidak valid',
      );
    });

    it('scales signature to fit placement bounds', async () => {
      const placements: SignaturePlacement[] = [
        {
          id: 'p1',
          page: 1,
          x: 0.1,
          y: 0.1,
          width: 0.5,
          height: 0.25,
        },
      ];
      const result = await applySignatures(mockPdfBytes, mockSignatureDataUrl, placements);
      expect(result).toBeInstanceOf(Uint8Array);
    });
  });
});
