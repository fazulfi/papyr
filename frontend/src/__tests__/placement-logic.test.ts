import { describe, expect, it } from 'vitest';
import {
  clamp,
  clampToBounds,
  normalizePlacement,
  isPlacementValid,
  calculateAspectRatio,
  applyToAllPages,
  filterPlacementsByPage,
  getPagePlacementsCount,
  screenToRelative,
  relativeToScreen,
  calculateDragDelta,
  createPlacementId,
  createDefaultPlacement,
  MIN_PLACEMENT_SIZE,
  MAX_PLACEMENT_SIZE,
  DEFAULT_PLACEMENT_WIDTH,
  DEFAULT_PLACEMENT_HEIGHT,
  type SignaturePlacement,
} from '@/app/sign/placement-logic';

/**
 * STEP-F2-026: Placement Logic Unit Tests
 *
 * Scope: Pure function tests for drag-and-drop placement logic.
 * - Coordinate transformations (screen ↔ relative)
 * - Bounds checking and clamping
 * - Multi-page placement operations
 * - Validation and normalization
 * - Aspect ratio preservation
 * - Drag delta calculations
 *
 * Target: >90% coverage on placement-logic.ts
 */

/* ── Fixtures ── */

const validPlacement = (): SignaturePlacement => ({
  id: 'sig-1',
  page: 1,
  x: 0.1,
  y: 0.2,
  width: 0.3,
  height: 0.15,
});

const placementOnPage2 = (): SignaturePlacement => ({
  id: 'sig-2',
  page: 2,
  x: 0.5,
  y: 0.5,
  width: 0.2,
  height: 0.1,
});

const placementOnPage3 = (): SignaturePlacement => ({
  id: 'sig-3',
  page: 3,
  x: 0.3,
  y: 0.4,
  width: 0.25,
  height: 0.12,
});

/* ── clamp ── */

describe('STEP-F2-026 — Placement Logic', () => {
  describe('clamp', () => {
    it('returns min when value is below min', () => {
      expect(clamp(-5, 0, 1)).toBe(0);
      expect(clamp(-0.5, 0, 1)).toBe(0);
    });

    it('returns max when value is above max', () => {
      expect(clamp(1.5, 0, 1)).toBe(1);
      expect(clamp(2, 0, 1)).toBe(1);
    });

    it('returns value when within range', () => {
      expect(clamp(0.5, 0, 1)).toBe(0.5);
      expect(clamp(0, 0, 1)).toBe(0);
      expect(clamp(1, 0, 1)).toBe(1);
    });

    it('handles NaN by returning min', () => {
      expect(clamp(NaN, 0, 1)).toBe(0);
    });

    it('handles Infinity', () => {
      expect(clamp(Infinity, 0, 1)).toBe(1);
      expect(clamp(-Infinity, 0, 1)).toBe(0);
    });

    it('works with negative ranges', () => {
      expect(clamp(-5, -10, -1)).toBe(-5);
      expect(clamp(-15, -10, -1)).toBe(-10);
      expect(clamp(0, -10, -1)).toBe(-1);
    });
  });

  /* ── clampToBounds ── */

  describe('clampToBounds', () => {
    it('clamps x to [0, 1-width]', () => {
      const result = clampToBounds(-0.1, 0.5, 0.3, 0.1);
      expect(result.x).toBe(0);
      expect(result.x + result.width).toBeLessThanOrEqual(1);
    });

    it('clamps y to [0, 1-height]', () => {
      const result = clampToBounds(0.5, -0.1, 0.3, 0.1);
      expect(result.y).toBe(0);
      expect(result.y + result.height).toBeLessThanOrEqual(1);
    });

    it('clamps width to [MIN, MAX]', () => {
      const result = clampToBounds(0.5, 0.5, 0.01, 0.1);
      expect(result.width).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
    });

    it('clamps height to [MIN, MAX]', () => {
      const result = clampToBounds(0.5, 0.5, 0.3, 0.01);
      expect(result.height).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
    });

    it('prevents overflow: x + width <= 1', () => {
      const result = clampToBounds(0.8, 0.5, 0.5, 0.1);
      expect(result.x + result.width).toBeLessThanOrEqual(1.0001);
    });

    it('prevents overflow: y + height <= 1', () => {
      const result = clampToBounds(0.5, 0.8, 0.3, 0.5);
      expect(result.y + result.height).toBeLessThanOrEqual(1.0001);
    });

    it('handles all-zero input', () => {
      const result = clampToBounds(0, 0, 0, 0);
      expect(result.width).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
      expect(result.height).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
    });

    it('handles all-negative input', () => {
      const result = clampToBounds(-1, -1, -0.5, -0.5);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.width).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
      expect(result.height).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
    });

    it('handles all-large input', () => {
      const result = clampToBounds(2, 2, 2, 2);
      expect(result.x).toBeLessThanOrEqual(1);
      expect(result.y).toBeLessThanOrEqual(1);
      expect(result.width).toBeLessThanOrEqual(MAX_PLACEMENT_SIZE);
      expect(result.height).toBeLessThanOrEqual(MAX_PLACEMENT_SIZE);
    });
  });

  /* ── normalizePlacement ── */

  describe('normalizePlacement', () => {
    it('normalizes valid placement unchanged', () => {
      const p = validPlacement();
      const result = normalizePlacement(p);
      expect(result.id).toBe(p.id);
      expect(result.page).toBe(p.page);
    });

    it('clamps out-of-bounds coordinates', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: -0.5,
        y: 1.5,
        width: 0.3,
        height: 0.1,
      };
      const result = normalizePlacement(p);
      expect(result.x).toBeGreaterThanOrEqual(0);
      expect(result.y).toBeLessThanOrEqual(1);
    });

    it('rounds page to nearest integer', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 2.7,
        x: 0.1,
        y: 0.1,
        width: 0.2,
        height: 0.1,
      };
      const result = normalizePlacement(p);
      expect(result.page).toBe(3);
    });

    it('ensures page >= 1', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 0,
        x: 0.1,
        y: 0.1,
        width: 0.2,
        height: 0.1,
      };
      const result = normalizePlacement(p);
      expect(result.page).toBeGreaterThanOrEqual(1);
    });

    it('preserves id', () => {
      const p = validPlacement();
      const result = normalizePlacement(p);
      expect(result.id).toBe(p.id);
    });
  });

  /* ── isPlacementValid ── */

  describe('isPlacementValid', () => {
    it('accepts valid placement', () => {
      expect(isPlacementValid(validPlacement())).toBe(true);
    });

    it('rejects placement with missing id', () => {
      const p: SignaturePlacement = {
        id: '',
        page: 1,
        x: 0.1,
        y: 0.1,
        width: 0.2,
        height: 0.1,
      };
      expect(isPlacementValid(p)).toBe(false);
    });

    it('rejects placement with page < 1', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 0,
        x: 0.1,
        y: 0.1,
        width: 0.2,
        height: 0.1,
      };
      expect(isPlacementValid(p)).toBe(false);
    });

    it('rejects placement with non-finite page', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: NaN,
        x: 0.1,
        y: 0.1,
        width: 0.2,
        height: 0.1,
      };
      expect(isPlacementValid(p)).toBe(false);
    });

    it('rejects placement with non-finite x', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: NaN,
        y: 0.1,
        width: 0.2,
        height: 0.1,
      };
      expect(isPlacementValid(p)).toBe(false);
    });

    it('rejects placement with width < MIN', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: 0.1,
        y: 0.1,
        width: 0.01,
        height: 0.1,
      };
      expect(isPlacementValid(p)).toBe(false);
    });

    it('rejects placement with width > MAX', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: 0.1,
        y: 0.1,
        width: 1.0,
        height: 0.1,
      };
      expect(isPlacementValid(p)).toBe(false);
    });

    it('rejects placement with x + width > 1', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: 0.8,
        y: 0.1,
        width: 0.3,
        height: 0.1,
      };
      expect(isPlacementValid(p)).toBe(false);
    });

    it('rejects placement with y + height > 1', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: 0.1,
        y: 0.8,
        width: 0.2,
        height: 0.3,
      };
      expect(isPlacementValid(p)).toBe(false);
    });

    it('accepts placement at boundary (x + width = 1)', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: 0.7,
        y: 0.1,
        width: 0.3,
        height: 0.1,
      };
      expect(isPlacementValid(p)).toBe(true);
    });

    it('accepts placement at boundary (y + height = 1)', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: 0.1,
        y: 0.7,
        width: 0.2,
        height: 0.3,
      };
      expect(isPlacementValid(p)).toBe(true);
    });
  });

  /* ── calculateAspectRatio ── */

  describe('calculateAspectRatio', () => {
    it('calculates height for square image', () => {
      const height = calculateAspectRatio(0.2, 100, 100);
      expect(height).toBe(0.2);
    });

    it('calculates height for wide image', () => {
      const height = calculateAspectRatio(0.2, 200, 100);
      expect(height).toBe(0.1);
    });

    it('calculates height for tall image', () => {
      const height = calculateAspectRatio(0.2, 100, 200);
      expect(height).toBe(0.4);
    });

    it('clamps result to MIN_PLACEMENT_SIZE', () => {
      const height = calculateAspectRatio(0.01, 1000, 1);
      expect(height).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
    });

    it('clamps result to MAX_PLACEMENT_SIZE', () => {
      const height = calculateAspectRatio(0.95, 1, 1000);
      expect(height).toBeLessThanOrEqual(MAX_PLACEMENT_SIZE);
    });

    it('returns default height for invalid image dimensions', () => {
      expect(calculateAspectRatio(0.2, 0, 100)).toBe(DEFAULT_PLACEMENT_HEIGHT);
      expect(calculateAspectRatio(0.2, 100, 0)).toBe(DEFAULT_PLACEMENT_HEIGHT);
      expect(calculateAspectRatio(0.2, -100, 100)).toBe(DEFAULT_PLACEMENT_HEIGHT);
      expect(calculateAspectRatio(0.2, NaN, 100)).toBe(DEFAULT_PLACEMENT_HEIGHT);
    });
  });

  /* ── applyToAllPages ── */

  describe('applyToAllPages', () => {
    it('creates one placement per page', () => {
      const p = validPlacement();
      const result = applyToAllPages(p, 5);
      expect(result).toHaveLength(5);
    });

    it('assigns correct page numbers (1-indexed)', () => {
      const p = validPlacement();
      const result = applyToAllPages(p, 3);
      expect(result[0].page).toBe(1);
      expect(result[1].page).toBe(2);
      expect(result[2].page).toBe(3);
    });

    it('generates unique IDs per page', () => {
      const p = validPlacement();
      const result = applyToAllPages(p, 3);
      const ids = result.map((r) => r.id);
      expect(new Set(ids).size).toBe(3);
    });

    it('preserves coordinates across all pages', () => {
      const p = validPlacement();
      const result = applyToAllPages(p, 3);
      for (const placement of result) {
        expect(placement.x).toBe(p.x);
        expect(placement.y).toBe(p.y);
        expect(placement.width).toBe(p.width);
        expect(placement.height).toBe(p.height);
      }
    });

    it('returns empty array for totalPages < 1', () => {
      const p = validPlacement();
      expect(applyToAllPages(p, 0)).toHaveLength(0);
      expect(applyToAllPages(p, -5)).toHaveLength(0);
    });

    it('returns empty array for non-finite totalPages', () => {
      const p = validPlacement();
      expect(applyToAllPages(p, NaN)).toHaveLength(0);
      expect(applyToAllPages(p, Infinity)).toHaveLength(0);
    });

    it('handles single page', () => {
      const p = validPlacement();
      const result = applyToAllPages(p, 1);
      expect(result).toHaveLength(1);
      expect(result[0].page).toBe(1);
    });

    it('normalizes each generated placement', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: 1,
        x: -0.5,
        y: 1.5,
        width: 0.3,
        height: 0.1,
      };
      const result = applyToAllPages(p, 2);
      for (const placement of result) {
        expect(isPlacementValid(placement)).toBe(true);
      }
    });
  });

  /* ── filterPlacementsByPage ── */

  describe('filterPlacementsByPage', () => {
    it('returns only placements on specified page', () => {
      const placements = [validPlacement(), placementOnPage2(), placementOnPage3()];
      const result = filterPlacementsByPage(placements, 2);
      expect(result).toHaveLength(1);
      expect(result[0].page).toBe(2);
    });

    it('returns empty array when no placements on page', () => {
      const placements = [validPlacement(), placementOnPage2()];
      const result = filterPlacementsByPage(placements, 5);
      expect(result).toHaveLength(0);
    });

    it('returns all placements when all on same page', () => {
      const p1 = validPlacement();
      const p2: SignaturePlacement = { ...p1, id: 'sig-2', x: 0.5 };
      const placements = [p1, p2];
      const result = filterPlacementsByPage(placements, 1);
      expect(result).toHaveLength(2);
    });

    it('handles empty input array', () => {
      const result = filterPlacementsByPage([], 1);
      expect(result).toHaveLength(0);
    });
  });

  /* ── getPagePlacementsCount ── */

  describe('getPagePlacementsCount', () => {
    it('counts placements on a page', () => {
      const placements = [validPlacement(), placementOnPage2(), placementOnPage3()];
      expect(getPagePlacementsCount(placements, 1)).toBe(1);
      expect(getPagePlacementsCount(placements, 2)).toBe(1);
      expect(getPagePlacementsCount(placements, 3)).toBe(1);
    });

    it('returns 0 for page with no placements', () => {
      const placements = [validPlacement(), placementOnPage2()];
      expect(getPagePlacementsCount(placements, 5)).toBe(0);
    });

    it('counts multiple placements on same page', () => {
      const p1 = validPlacement();
      const p2: SignaturePlacement = { ...p1, id: 'sig-2', x: 0.5 };
      const p3: SignaturePlacement = { ...p1, id: 'sig-3', x: 0.7 };
      const placements = [p1, p2, p3];
      expect(getPagePlacementsCount(placements, 1)).toBe(3);
    });
  });

  /* ── screenToRelative ── */

  describe('screenToRelative', () => {
    it('converts screen coordinates to relative [0,1]', () => {
      const result = screenToRelative(100, 50, 200, 100);
      expect(result.x).toBe(0.5);
      expect(result.y).toBe(0.5);
    });

    it('clamps to [0, 1]', () => {
      const result = screenToRelative(300, 150, 200, 100);
      expect(result.x).toBe(1);
      expect(result.y).toBe(1);
    });

    it('handles zero coordinates', () => {
      const result = screenToRelative(0, 0, 200, 100);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it('handles negative coordinates', () => {
      const result = screenToRelative(-50, -25, 200, 100);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it('returns 0,0 for invalid container dimensions', () => {
      const result = screenToRelative(100, 50, 0, 100);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });

    it('returns 0,0 for negative container dimensions', () => {
      const result = screenToRelative(100, 50, -200, 100);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
    });
  });

  /* ── relativeToScreen ── */

  describe('relativeToScreen', () => {
    it('converts relative coordinates to screen pixels', () => {
      const result = relativeToScreen(0.5, 0.5, 200, 100);
      expect(result.left).toBe(100);
      expect(result.top).toBe(50);
    });

    it('handles zero relative coordinates', () => {
      const result = relativeToScreen(0, 0, 200, 100);
      expect(result.left).toBe(0);
      expect(result.top).toBe(0);
    });

    it('handles max relative coordinates', () => {
      const result = relativeToScreen(1, 1, 200, 100);
      expect(result.left).toBe(200);
      expect(result.top).toBe(100);
    });

    it('handles fractional relative coordinates', () => {
      const result = relativeToScreen(0.25, 0.75, 400, 200);
      expect(result.left).toBe(100);
      expect(result.top).toBe(150);
    });

    it('handles zero container dimensions', () => {
      const result = relativeToScreen(0.5, 0.5, 0, 0);
      expect(result.left).toBe(0);
      expect(result.top).toBe(0);
    });
  });

  /* ── calculateDragDelta ── */

  describe('calculateDragDelta', () => {
    it('calculates delta between two positions', () => {
      const result = calculateDragDelta(100, 50, 150, 75, 200, 100);
      expect(result.dx).toBe(0.25);
      expect(result.dy).toBe(0.25);
    });

    it('handles negative delta', () => {
      const result = calculateDragDelta(150, 75, 100, 50, 200, 100);
      expect(result.dx).toBe(-0.25);
      expect(result.dy).toBe(-0.25);
    });

    it('handles zero delta', () => {
      const result = calculateDragDelta(100, 50, 100, 50, 200, 100);
      expect(result.dx).toBe(0);
      expect(result.dy).toBe(0);
    });

    it('returns 0,0 for invalid container dimensions', () => {
      const result = calculateDragDelta(100, 50, 150, 75, 0, 100);
      expect(result.dx).toBe(0);
      expect(result.dy).toBe(0);
    });

    it('handles large drag distances', () => {
      const result = calculateDragDelta(0, 0, 200, 100, 200, 100);
      expect(result.dx).toBe(1);
      expect(result.dy).toBe(1);
    });
  });

  /* ── createPlacementId ── */

  describe('createPlacementId', () => {
    it('generates a non-empty string', () => {
      const id = createPlacementId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('generates unique IDs', () => {
      const id1 = createPlacementId();
      const id2 = createPlacementId();
      expect(id1).not.toBe(id2);
    });

    it('generates multiple unique IDs', () => {
      const ids = Array.from({ length: 10 }, () => createPlacementId());
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });
  });

  /* ── createDefaultPlacement ── */

  describe('createDefaultPlacement', () => {
    it('creates placement on specified page', () => {
      const p = createDefaultPlacement(3);
      expect(p.page).toBe(3);
    });

    it('uses default width and height', () => {
      const p = createDefaultPlacement(1);
      expect(p.width).toBe(DEFAULT_PLACEMENT_WIDTH);
      expect(p.height).toBe(DEFAULT_PLACEMENT_HEIGHT);
    });

    it('centers placement on page', () => {
      const p = createDefaultPlacement(1);
      const centerX = p.x + p.width / 2;
      const centerY = p.y + p.height / 2;
      expect(centerX).toBeCloseTo(0.5, 1);
      expect(centerY).toBeCloseTo(0.7, 1);
    });

    it('generates valid placement', () => {
      const p = createDefaultPlacement(1);
      expect(isPlacementValid(p)).toBe(true);
    });

    it('respects custom width and height', () => {
      const p = createDefaultPlacement(1, 0.4, 0.2);
      expect(p.width).toBe(0.4);
      expect(p.height).toBe(0.2);
    });

    it('clamps custom dimensions to valid range', () => {
      const p = createDefaultPlacement(1, 0.01, 0.01);
      expect(p.width).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
      expect(p.height).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
    });

    it('generates unique IDs', () => {
      const p1 = createDefaultPlacement(1);
      const p2 = createDefaultPlacement(1);
      expect(p1.id).not.toBe(p2.id);
    });

    it('stays within bounds even with large dimensions', () => {
      const p = createDefaultPlacement(1, 0.95, 0.95);
      expect(p.x + p.width).toBeLessThanOrEqual(1.0001);
      expect(p.y + p.height).toBeLessThanOrEqual(1.0001);
    });
  });

  /* ── Constants ── */

  describe('constants', () => {
    it('MIN_PLACEMENT_SIZE is positive and less than MAX', () => {
      expect(MIN_PLACEMENT_SIZE).toBeGreaterThan(0);
      expect(MIN_PLACEMENT_SIZE).toBeLessThan(MAX_PLACEMENT_SIZE);
    });

    it('MAX_PLACEMENT_SIZE is less than or equal to 1', () => {
      expect(MAX_PLACEMENT_SIZE).toBeLessThanOrEqual(1);
    });

    it('DEFAULT_PLACEMENT_WIDTH is within valid range', () => {
      expect(DEFAULT_PLACEMENT_WIDTH).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
      expect(DEFAULT_PLACEMENT_WIDTH).toBeLessThanOrEqual(MAX_PLACEMENT_SIZE);
    });

    it('DEFAULT_PLACEMENT_HEIGHT is within valid range', () => {
      expect(DEFAULT_PLACEMENT_HEIGHT).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
      expect(DEFAULT_PLACEMENT_HEIGHT).toBeLessThanOrEqual(MAX_PLACEMENT_SIZE);
    });
  });

  /* ── Integration: Round-trip Transformations ── */

  describe('coordinate transformation round-trips', () => {
    it('screen → relative → screen preserves coordinates', () => {
      const screenX = 150;
      const screenY = 75;
      const containerWidth = 300;
      const containerHeight = 150;

      const relative = screenToRelative(screenX, screenY, containerWidth, containerHeight);
      const backToScreen = relativeToScreen(
        relative.x,
        relative.y,
        containerWidth,
        containerHeight,
      );

      expect(backToScreen.left).toBeCloseTo(screenX, 5);
      expect(backToScreen.top).toBeCloseTo(screenY, 5);
    });

    it('drag delta calculation is consistent', () => {
      const delta1 = calculateDragDelta(0, 0, 100, 50, 200, 100);
      const delta2 = calculateDragDelta(100, 50, 200, 100, 200, 100);
      expect(delta1.dx).toBeCloseTo(delta2.dx, 5);
      expect(delta1.dy).toBeCloseTo(delta2.dy, 5);
    });
  });

  /* ── Edge Cases ── */

  describe('edge cases and boundary conditions', () => {
    it('handles very small container dimensions', () => {
      const result = screenToRelative(1, 1, 1, 1);
      expect(result.x).toBe(1);
      expect(result.y).toBe(1);
    });

    it('handles very large coordinate values', () => {
      const result = screenToRelative(1000000, 1000000, 200, 100);
      expect(result.x).toBe(1);
      expect(result.y).toBe(1);
    });

    it('normalizePlacement handles all-NaN input', () => {
      const p: SignaturePlacement = {
        id: 'test',
        page: NaN,
        x: NaN,
        y: NaN,
        width: NaN,
        height: NaN,
      };
      const result = normalizePlacement(p);
      expect(result.page).toBeGreaterThanOrEqual(1);
      expect(result.width).toBeGreaterThanOrEqual(MIN_PLACEMENT_SIZE);
    });

    it('applyToAllPages with large page count', () => {
      const p = validPlacement();
      const result = applyToAllPages(p, 1000);
      expect(result).toHaveLength(1000);
      expect(result[999].page).toBe(1000);
    });
  });
});
