/**
 * STEP-F2-026: Pure functions for signature placement on PDF pages.
 *
 * All coordinates use a 0-1 relative coordinate system anchored to page width
 * and height. The component layer converts between relative coordinates and
 * pixel coordinates using the rendered viewer size.
 *
 * Re-exports the canonical SignaturePlacement interface from logic.ts
 * to keep the placement contract centralised.
 */

import type { SignaturePlacement } from './logic';

export type { SignaturePlacement } from './logic';

/* ── Constants ── */

/** Minimum width/height for a placement in relative units. */
export const MIN_PLACEMENT_SIZE = 0.05;

/** Maximum width/height for a placement in relative units. */
export const MAX_PLACEMENT_SIZE = 0.95;

/** Default placement size when first dropping a signature on a page. */
export const DEFAULT_PLACEMENT_WIDTH = 0.25;
export const DEFAULT_PLACEMENT_HEIGHT = 0.1;

/* ── Pure Helpers ── */

/**
 * Clamp a numeric value within [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Clamp an x/y/width/height placement so it stays inside [0, 1] on both axes.
 * Position is the top-left corner of the placement; width and height stay
 * positive and the placement never overflows the page.
 */
export function clampToBounds(
  x: number,
  y: number,
  width: number,
  height: number,
): { x: number; y: number; width: number; height: number } {
  const safeWidth = clamp(width, MIN_PLACEMENT_SIZE, MAX_PLACEMENT_SIZE);
  const safeHeight = clamp(height, MIN_PLACEMENT_SIZE, MAX_PLACEMENT_SIZE);
  const safeX = clamp(x, 0, Math.max(0, 1 - safeWidth));
  const safeY = clamp(y, 0, Math.max(0, 1 - safeHeight));
  return { x: safeX, y: safeY, width: safeWidth, height: safeHeight };
}

/**
 * Normalize a placement so all values are clamped within bounds and the
 * page index is at least 1.
 */
export function normalizePlacement(placement: SignaturePlacement): SignaturePlacement {
  const bounded = clampToBounds(placement.x, placement.y, placement.width, placement.height);
  const safePage = Number.isFinite(placement.page) ? Math.max(1, Math.round(placement.page)) : 1;
  return {
    ...placement,
    page: safePage,
    ...bounded,
  };
}

/**
 * Returns true when a placement is well-formed and within page bounds.
 */
export function isPlacementValid(placement: SignaturePlacement): boolean {
  if (!placement.id) return false;
  if (!Number.isFinite(placement.page) || placement.page < 1) return false;
  const allFinite = [placement.x, placement.y, placement.width, placement.height].every((n) =>
    Number.isFinite(n),
  );
  if (!allFinite) return false;
  if (placement.width < MIN_PLACEMENT_SIZE || placement.width > MAX_PLACEMENT_SIZE) return false;
  if (placement.height < MIN_PLACEMENT_SIZE || placement.height > MAX_PLACEMENT_SIZE) return false;
  if (placement.x < 0 || placement.x + placement.width > 1.0001) return false;
  if (placement.y < 0 || placement.y + placement.height > 1.0001) return false;
  return true;
}

/**
 * Calculate a height that preserves an aspect ratio, given a target width.
 * Returns a value in relative units (0-1). When dimensions are missing,
 * falls back to a sensible default.
 */
export function calculateAspectRatio(
  width: number,
  imageWidthPx: number,
  imageHeightPx: number,
): number {
  if (
    !Number.isFinite(imageWidthPx) ||
    !Number.isFinite(imageHeightPx) ||
    imageWidthPx <= 0 ||
    imageHeightPx <= 0
  ) {
    return DEFAULT_PLACEMENT_HEIGHT;
  }
  const ratio = imageHeightPx / imageWidthPx;
  return clamp(width * ratio, MIN_PLACEMENT_SIZE, MAX_PLACEMENT_SIZE);
}

/**
 * Take a single placement and return one placement per page (1..totalPages),
 * keeping coordinates and dimensions identical. Each generated placement
 * gets a unique id derived from the source id and page number.
 */
export function applyToAllPages(
  source: SignaturePlacement,
  totalPages: number,
): SignaturePlacement[] {
  if (!Number.isFinite(totalPages) || totalPages < 1) return [];
  const result: SignaturePlacement[] = [];
  for (let page = 1; page <= totalPages; page += 1) {
    result.push(
      normalizePlacement({
        ...source,
        id: `${source.id}-p${page}`,
        page,
      }),
    );
  }
  return result;
}

/**
 * Return only the placements that belong to a given page.
 */
export function filterPlacementsByPage(
  placements: SignaturePlacement[],
  page: number,
): SignaturePlacement[] {
  return placements.filter((p) => p.page === page);
}

/**
 * Return the count of placements on a given page.
 */
export function getPagePlacementsCount(placements: SignaturePlacement[], page: number): number {
  return filterPlacementsByPage(placements, page).length;
}

/**
 * Convert raw screen coordinates (relative to the page container) to
 * 0-1 relative coordinates.
 */
export function screenToRelative(
  screenX: number,
  screenY: number,
  containerWidth: number,
  containerHeight: number,
): { x: number; y: number } {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: clamp(screenX / containerWidth, 0, 1),
    y: clamp(screenY / containerHeight, 0, 1),
  };
}

/**
 * Convert 0-1 relative coordinates back to screen pixels.
 */
export function relativeToScreen(
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number,
): { left: number; top: number } {
  return {
    left: x * containerWidth,
    top: y * containerHeight,
  };
}

/**
 * Compute the delta (in relative units) between a previous and a current
 * pointer position, given the container size.
 */
export function calculateDragDelta(
  prevScreenX: number,
  prevScreenY: number,
  currentScreenX: number,
  currentScreenY: number,
  containerWidth: number,
  containerHeight: number,
): { dx: number; dy: number } {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { dx: 0, dy: 0 };
  }
  return {
    dx: (currentScreenX - prevScreenX) / containerWidth,
    dy: (currentScreenY - prevScreenY) / containerHeight,
  };
}

/**
 * Add a placement to an array (immutable).
 */
export function addPlacement(
  placements: SignaturePlacement[],
  placement: SignaturePlacement,
): SignaturePlacement[] {
  return [...placements, normalizePlacement(placement)];
}

/**
 * Remove a placement by id (immutable).
 */
export function removePlacement(
  placements: SignaturePlacement[],
  id: string,
): SignaturePlacement[] {
  return placements.filter((p) => p.id !== id);
}

/**
 * Remove all placements on a given page (immutable).
 */
export function removePlacementsByPage(
  placements: SignaturePlacement[],
  page: number,
): SignaturePlacement[] {
  return placements.filter((p) => p.page !== page);
}

/**
 * Update a placement by id with partial fields (immutable).
 */
export function updatePlacement(
  placements: SignaturePlacement[],
  id: string,
  patch: Partial<Omit<SignaturePlacement, 'id'>>,
): SignaturePlacement[] {
  return placements.map((p) => (p.id === id ? normalizePlacement({ ...p, ...patch }) : p));
}

/**
 * Resize a placement to a new width/height, clamped to bounds.
 */
export function resizePlacement(
  placement: SignaturePlacement,
  newWidth: number,
  newHeight: number,
  preserveRatio: boolean = false,
): SignaturePlacement {
  let width = newWidth;
  let height = newHeight;

  if (preserveRatio && placement.height > 0) {
    const ratio = placement.width / placement.height;
    if (ratio > 0 && Number.isFinite(ratio)) {
      // Use width as the primary axis for deterministic resize behavior.
      height = newWidth / ratio;
    }
  }

  return normalizePlacement({ ...placement, width, height });
}

/**
 * Resize from a named corner handle. Each handle adjusts position and size
 * so the opposite corner stays fixed.
 *
 * handle: "nw" | "ne" | "sw" | "se"
 * dx/dy: delta in relative units (positive = right/down)
 */
export function resizeFromHandle(
  placement: SignaturePlacement,
  handle: 'nw' | 'ne' | 'sw' | 'se',
  dx: number,
  dy: number,
): SignaturePlacement {
  let { x, y, width, height } = placement;
  switch (handle) {
    case 'se':
      width += dx;
      height += dy;
      break;
    case 'sw':
      x += dx;
      width -= dx;
      height += dy;
      break;
    case 'ne':
      y += dy;
      width += dx;
      height -= dy;
      break;
    case 'nw':
      x += dx;
      y += dy;
      width -= dx;
      height -= dy;
      break;
  }
  return normalizePlacement({ ...placement, x, y, width, height });
}

/**
 * Generate a placement id. Uses crypto.randomUUID when available,
 * falls back to a timestamp+random combo otherwise.
 */
export function createPlacementId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `placement-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Build a default placement centered on a page. Used when the user clicks
 * the page area without dragging from the toolbar.
 */
export function createDefaultPlacement(
  page: number,
  width: number = DEFAULT_PLACEMENT_WIDTH,
  height: number = DEFAULT_PLACEMENT_HEIGHT,
): SignaturePlacement {
  const safeWidth = clamp(width, MIN_PLACEMENT_SIZE, MAX_PLACEMENT_SIZE);
  const safeHeight = clamp(height, MIN_PLACEMENT_SIZE, MAX_PLACEMENT_SIZE);
  return normalizePlacement({
    id: createPlacementId(),
    page,
    x: clamp(0.5 - safeWidth / 2, 0, 1 - safeWidth),
    y: clamp(0.7 - safeHeight / 2, 0, 1 - safeHeight),
    width: safeWidth,
    height: safeHeight,
  });
}
