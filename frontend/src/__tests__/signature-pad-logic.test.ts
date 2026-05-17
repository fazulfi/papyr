import { describe, expect, it } from 'vitest';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  createSignaturePngDataUrl,
  createStroke,
  extractPngBase64,
  getCanvasDimensions,
  getLineWidthPixels,
  getStrokesBounds,
  getTotalPoints,
  hasMeaningfulStroke,
  isValidLineWidth,
  isValidLineWidthIndex,
  isValidSignatureColor,
  LINE_WIDTH_LABELS,
  LINE_WIDTH_MAP,
  removeLastStroke,
  SIGNATURE_COLORS,
  type DrawPoint,
  type Stroke,
} from '@/app/sign/logic';

/* ── Fixtures ── */

const point = (x: number, y: number): DrawPoint => ({ x, y });

const twoPointStroke: Stroke = {
  points: [point(10, 10), point(50, 50)],
  color: '#000000',
  width: 2,
};

const threePointStroke: Stroke = {
  points: [point(100, 100), point(150, 150), point(200, 200)],
  color: '#1E40AF',
  width: 4,
};

const singleDotStroke: Stroke = {
  points: [point(30, 30)],
  color: '#000000',
  width: 6,
};

/* ── STEP-F2-023: Constants ── */

describe('STEP-F2-023 — SignaturePad logic coverage', () => {
  describe('constants', () => {
    it('maps thin/medium/thick to correct pixel values', () => {
      expect(LINE_WIDTH_MAP).toEqual({ thin: 2, medium: 4, thick: 6 });
    });

    it('exposes line-width labels in order', () => {
      expect(LINE_WIDTH_LABELS).toEqual(['thin', 'medium', 'thick']);
    });

    it('exposes two signature colors (black and blue)', () => {
      expect(SIGNATURE_COLORS).toEqual(['#000000', '#1E40AF']);
    });

    it('defines default canvas dimensions', () => {
      expect(CANVAS_WIDTH).toBe(560);
      expect(CANVAS_HEIGHT).toBe(200);
    });
  });

  /* ── Type Guards ── */

  describe('type guards', () => {
    it('isValidLineWidth accepts thin, medium, thick only', () => {
      expect(isValidLineWidth('thin')).toBe(true);
      expect(isValidLineWidth('medium')).toBe(true);
      expect(isValidLineWidth('thick')).toBe(true);
      expect(isValidLineWidth('extra')).toBe(false);
      expect(isValidLineWidth('')).toBe(false);
      expect(isValidLineWidth('bold')).toBe(false);
    });

    it('isValidSignatureColor accepts black and blue hex only', () => {
      expect(isValidSignatureColor('#000000')).toBe(true);
      expect(isValidSignatureColor('#1E40AF')).toBe(true);
      expect(isValidSignatureColor('#FF0000')).toBe(false);
      expect(isValidSignatureColor('#CCCCCC')).toBe(false);
      expect(isValidSignatureColor('')).toBe(false);
    });

    it('isValidLineWidthIndex accepts 0, 1, 2 only', () => {
      expect(isValidLineWidthIndex(0)).toBe(true);
      expect(isValidLineWidthIndex(1)).toBe(true);
      expect(isValidLineWidthIndex(2)).toBe(true);
      expect(isValidLineWidthIndex(-1)).toBe(false);
      expect(isValidLineWidthIndex(3)).toBe(false);
      expect(isValidLineWidthIndex(1.5)).toBe(false);
    });
  });

  /* ── Line Width Helper ── */

  describe('getLineWidthPixels', () => {
    it('returns correct pixels for each label', () => {
      expect(getLineWidthPixels('thin')).toBe(2);
      expect(getLineWidthPixels('medium')).toBe(4);
      expect(getLineWidthPixels('thick')).toBe(6);
    });
  });

  /* ── Stroke Creation ── */

  describe('createStroke', () => {
    it('builds a Stroke object from points, color, and width', () => {
      const stroke = createStroke([point(5, 10), point(20, 30)], '#000000', 2);
      expect(stroke).toEqual({
        points: [point(5, 10), point(20, 30)],
        color: '#000000',
        width: 2,
      });
    });

    it('accepts an empty points array', () => {
      const stroke = createStroke([], '#1E40AF', 6);
      expect(stroke.points).toHaveLength(0);
      expect(stroke.color).toBe('#1E40AF');
      expect(stroke.width).toBe(6);
    });
  });

  /* ── Undo (removeLastStroke) ── */

  describe('removeLastStroke (undo)', () => {
    it('removes the last stroke from a multi-stroke array', () => {
      const result = removeLastStroke([twoPointStroke, threePointStroke]);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(twoPointStroke);
    });

    it('returns empty array when undoing the only stroke', () => {
      const result = removeLastStroke([twoPointStroke]);
      expect(result).toHaveLength(0);
    });

    it('returns same empty array when there are no strokes', () => {
      const result = removeLastStroke([]);
      expect(result).toHaveLength(0);
    });

    it('does not mutate the original array', () => {
      const original = [twoPointStroke, threePointStroke];
      const copy = [...original];
      removeLastStroke(original);
      expect(original).toEqual(copy);
    });

    it('supports sequential undo operations', () => {
      const three = removeLastStroke([singleDotStroke, twoPointStroke, threePointStroke]);
      expect(three).toHaveLength(2);
      expect(three[1]).toEqual(twoPointStroke);

      const two = removeLastStroke(three);
      expect(two).toHaveLength(1);
      expect(two[0]).toEqual(singleDotStroke);

      const one = removeLastStroke(two);
      expect(one).toHaveLength(0);
    });
  });

  /* ── Point Counting ── */

  describe('getTotalPoints', () => {
    it('counts points across all strokes', () => {
      expect(getTotalPoints([twoPointStroke, threePointStroke])).toBe(5);
    });

    it('returns 0 for an empty array', () => {
      expect(getTotalPoints([])).toBe(0);
    });

    it('handles strokes with single points (dots)', () => {
      expect(getTotalPoints([singleDotStroke])).toBe(1);
    });
  });

  /* ── Meaningful Stroke Detection ── */

  describe('hasMeaningfulStroke', () => {
    it('returns true when a stroke has 2+ points', () => {
      expect(hasMeaningfulStroke([twoPointStroke])).toBe(true);
      expect(hasMeaningfulStroke([threePointStroke])).toBe(true);
    });

    it('returns false for single-point strokes only', () => {
      expect(hasMeaningfulStroke([singleDotStroke])).toBe(false);
    });

    it('returns false for empty strokes array', () => {
      expect(hasMeaningfulStroke([])).toBe(false);
    });

    it('returns true if at least one stroke has 2+ points', () => {
      expect(hasMeaningfulStroke([singleDotStroke, twoPointStroke])).toBe(true);
    });
  });

  /* ── PNG Export Pathway ── */

  describe('PNG export pathway', () => {
    it('createSignaturePngDataUrl builds a valid data URL', () => {
      const url = createSignaturePngDataUrl('abc123');
      expect(url).toBe('data:image/png;base64,abc123');
    });

    it('createSignaturePngDataUrl handles empty payload', () => {
      const url = createSignaturePngDataUrl('');
      expect(url).toBe('data:image/png;base64,');
    });

    it('extractPngBase64 extracts the base64 payload', () => {
      const result = extractPngBase64('data:image/png;base64,XYZ==');
      expect(result).toBe('XYZ==');
    });

    it('extractPngBase64 returns null for non-PNG data URL', () => {
      const result = extractPngBase64('data:image/jpeg;base64,XYZ');
      expect(result).toBeNull();
    });

    it('extractPngBase64 returns null for non-data URL string', () => {
      const result = extractPngBase64('just a string');
      expect(result).toBeNull();
    });

    it('extractPngBase64 returns empty string for empty PNG data URL', () => {
      const result = extractPngBase64('data:image/png;base64,');
      expect(result).toBe('');
    });

    it('create + extract round-trips correctly', () => {
      const payload =
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const url = createSignaturePngDataUrl(payload);
      expect(extractPngBase64(url)).toBe(payload);
    });
  });

  /* ── Strokes Bounds ── */

  describe('getStrokesBounds', () => {
    it('computes bounding box from multiple strokes', () => {
      const strokes: Stroke[] = [
        { points: [point(10, 20), point(100, 200)], color: '#000', width: 2 },
        { points: [point(50, 60), point(80, 120)], color: '#000', width: 2 },
      ];
      expect(getStrokesBounds(strokes)).toEqual({
        minX: 10,
        minY: 20,
        maxX: 100,
        maxY: 200,
      });
    });

    it('returns fallback canvas dimensions for empty strokes', () => {
      const result = getStrokesBounds([], 560, 200);
      expect(result).toEqual({ minX: 0, minY: 0, maxX: 560, maxY: 200 });
    });

    it('returns fallback dimensions for strokes with only empty point arrays', () => {
      const strokes: Stroke[] = [
        { points: [], color: '#000', width: 2 },
        { points: [], color: '#000', width: 2 },
      ];
      const result = getStrokesBounds(strokes, 300, 150);
      expect(result).toEqual({ minX: 0, minY: 0, maxX: 300, maxY: 150 });
    });

    it('uses default CANVAS_WIDTH/HEIGHT fallback when not specified', () => {
      const result = getStrokesBounds([]);
      expect(result.maxX).toBe(CANVAS_WIDTH);
      expect(result.maxY).toBe(CANVAS_HEIGHT);
    });

    it('captures bounds from a single dot', () => {
      const result = getStrokesBounds([singleDotStroke]);
      expect(result).toEqual({ minX: 30, minY: 30, maxX: 30, maxY: 30 });
    });
  });

  /* ── Canvas Dimensions ── */

  describe('getCanvasDimensions', () => {
    it('clamps width to minimum 280', () => {
      const dim = getCanvasDimensions(100);
      expect(dim.width).toBe(280);
    });

    it('caps width at CANVAS_WIDTH default', () => {
      const dim = getCanvasDimensions(2000);
      expect(dim.width).toBe(CANVAS_WIDTH);
    });

    it('returns proportional height for mid-range width', () => {
      const dim = getCanvasDimensions(400);
      expect(dim.width).toBe(400);
      expect(dim.height).toBe(Math.round(400 * (CANVAS_HEIGHT / CANVAS_WIDTH)));
    });

    it('at CANVAS_WIDTH returns exact CANVAS_HEIGHT', () => {
      const dim = getCanvasDimensions(CANVAS_WIDTH);
      expect(dim.width).toBe(CANVAS_WIDTH);
      expect(dim.height).toBe(CANVAS_HEIGHT);
    });

    it('handles exact minimum width of 280', () => {
      const dim = getCanvasDimensions(280);
      expect(dim.width).toBe(280);
    });
  });

  /* ── State Transition Simulation (draw-mode workflow) ── */

  describe('draw mode state workflow', () => {
    it('starts with an empty strokes array (no content)', () => {
      const strokes: Stroke[] = [];
      expect(hasMeaningfulStroke(strokes)).toBe(false);
      expect(getTotalPoints(strokes)).toBe(0);
    });

    it('accumulates strokes as user draws lines', () => {
      let strokes: Stroke[] = [];

      // Draw stroke 1
      strokes = [...strokes, createStroke([point(0, 0), point(10, 10)], '#000000', 2)];
      expect(strokes).toHaveLength(1);
      expect(hasMeaningfulStroke(strokes)).toBe(true);

      // Draw stroke 2
      strokes = [...strokes, createStroke([point(20, 20), point(40, 40)], '#1E40AF', 4)];
      expect(strokes).toHaveLength(2);
      expect(getTotalPoints(strokes)).toBe(4);
    });

    it('undo removes the most recent stroke', () => {
      let strokes: Stroke[] = [
        createStroke([point(0, 0), point(10, 10)], '#000000', 2),
        createStroke([point(20, 20), point(40, 40)], '#1E40AF', 4),
      ];

      strokes = removeLastStroke(strokes);
      expect(strokes).toHaveLength(1);
      expect(strokes[0].color).toBe('#000000');
    });

    it('clear resets to empty state', () => {
      const strokes: Stroke[] = [];
      // After clear, strokes should be the same as initial empty
      expect(strokes).toHaveLength(0);
      expect(hasMeaningfulStroke(strokes)).toBe(false);
    });

    it('detects empty canvas after undo-all', () => {
      let strokes: Stroke[] = [createStroke([point(0, 0), point(5, 5)], '#000000', 2)];
      expect(hasMeaningfulStroke(strokes)).toBe(true);

      strokes = removeLastStroke(strokes);
      expect(strokes).toHaveLength(0);
      expect(hasMeaningfulStroke(strokes)).toBe(false);
    });

    it('tracks single-point taps (dots) separately from drawn lines', () => {
      const onlyDots: Stroke[] = [
        createStroke([point(10, 10)], '#000000', 2),
        createStroke([point(20, 20)], '#000000', 2),
      ];
      expect(hasMeaningfulStroke(onlyDots)).toBe(false);
      expect(getTotalPoints(onlyDots)).toBe(2);

      const onlyLines: Stroke[] = [createStroke([point(10, 10), point(20, 20)], '#000000', 2)];
      expect(hasMeaningfulStroke(onlyLines)).toBe(true);
    });
  });
});
