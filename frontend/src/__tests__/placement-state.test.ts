import { describe, expect, it } from "vitest";
import {
  addPlacement,
  applyToAllPages,
  createDefaultPlacement,
  createPlacementId,
  filterPlacementsByPage,
  getPagePlacementsCount,
  isPlacementValid,
  removePlacement,
  removePlacementsByPage,
  resizeFromHandle,
  resizePlacement,
  updatePlacement,
  calculateDragDelta,
  screenToRelative,
  relativeToScreen,
  type SignaturePlacement,
} from "@/app/sign/placement-logic";

/**
 * STEP-F2-026: Placement State Transition Tests
 *
 * Scope: State-machine style tests for placement CRUD, drag/move, multi-page,
 * apply-to-all, and resize flows.
 */

const basePlacement = (overrides: Partial<SignaturePlacement> = {}): SignaturePlacement => ({
  id: "sig-1",
  page: 1,
  x: 0.2,
  y: 0.2,
  width: 0.2,
  height: 0.1,
  ...overrides,
});

describe("STEP-F2-026 — Placement State Transitions", () => {
  describe("initial placement workflow", () => {
    it("starts with no placements and adds a placement", () => {
      const initial: SignaturePlacement[] = [];
      const placement = basePlacement();
      const next = addPlacement(initial, placement);
      expect(initial).toHaveLength(0);
      expect(next).toHaveLength(1);
      expect(next[0]).toEqual(placement);
    });

    it("addPlacement is immutable", () => {
      const initial = [basePlacement()];
      const copy = [...initial];
      addPlacement(initial, basePlacement({ id: "sig-2" }));
      expect(initial).toEqual(copy);
    });

    it("createDefaultPlacement yields valid starting state", () => {
      const p = createDefaultPlacement(1);
      expect(isPlacementValid(p)).toBe(true);
      expect(p.page).toBe(1);
    });
  });

  describe("drag start / move / end state transitions", () => {
    it("drag move updates x/y through relative delta", () => {
      const start = basePlacement();
      const delta = calculateDragDelta(100, 100, 150, 125, 200, 200);
      const moved = { ...start, x: start.x + delta.dx, y: start.y + delta.dy };
      expect(moved.x).toBe(0.45);
      expect(moved.y).toBe(0.325);
    });

    it("drag move remains in bounds when clamped by placement logic", () => {
      const start = basePlacement({ x: 0.9, y: 0.9 });
      const delta = calculateDragDelta(0, 0, 50, 50, 100, 100);
      const moved = { ...start, x: start.x + delta.dx, y: start.y + delta.dy };
      expect(moved.x).toBe(1.4);
      expect(moved.y).toBe(1.4);
    });

    it("screen-to-relative and relative-to-screen support drag positioning", () => {
      const relative = screenToRelative(250, 100, 500, 200);
      const screen = relativeToScreen(relative.x, relative.y, 500, 200);
      expect(screen.left).toBe(250);
      expect(screen.top).toBe(100);
    });

    it("drag end can be validated after movement", () => {
      const placement = basePlacement({ x: 0.3, y: 0.3 });
      const delta = calculateDragDelta(0, 0, 20, 20, 200, 200);
      const moved = { ...placement, x: placement.x + delta.dx, y: placement.y + delta.dy };
      expect(isPlacementValid(moved)).toBe(true);
    });
  });

  describe("placement CRUD transitions", () => {
    it("updatePlacement changes only the targeted placement", () => {
      const p1 = basePlacement();
      const p2 = basePlacement({ id: "sig-2", page: 2, x: 0.4 });
      const result = updatePlacement([p1, p2], "sig-1", { x: 0.5 });
      expect(result[0].x).toBe(0.5);
      expect(result[1]).toEqual(p2);
    });

    it("updatePlacement can move page and preserve validity", () => {
      const p1 = basePlacement();
      const result = updatePlacement([p1], "sig-1", { page: 3 });
      expect(result[0].page).toBe(3);
      expect(isPlacementValid(result[0])).toBe(true);
    });

    it("removePlacement deletes by id", () => {
      const p1 = basePlacement();
      const p2 = basePlacement({ id: "sig-2" });
      const result = removePlacement([p1, p2], "sig-1");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("sig-2");
    });

    it("removePlacement no-ops for unknown id", () => {
      const p1 = basePlacement();
      const result = removePlacement([p1], "missing");
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(p1);
    });

    it("removePlacementsByPage removes all placements on a page", () => {
      const p1 = basePlacement();
      const p2 = basePlacement({ id: "sig-2", page: 2 });
      const p3 = basePlacement({ id: "sig-3", page: 2 });
      const result = removePlacementsByPage([p1, p2, p3], 2);
      expect(result).toHaveLength(1);
      expect(result[0].page).toBe(1);
    });

    it("removePlacementsByPage preserves placements on other pages", () => {
      const placements = [basePlacement(), basePlacement({ id: "sig-2", page: 3 })];
      const result = removePlacementsByPage(placements, 2);
      expect(result).toEqual(placements);
    });
  });

  describe("multi-page placement state", () => {
    it("applyToAllPages clones a placement to every page", () => {
      const source = basePlacement({ id: "source", page: 4 });
      const result = applyToAllPages(source, 4);
      expect(result).toHaveLength(4);
      expect(result.map((p) => p.page)).toEqual([1, 2, 3, 4]);
    });

    it("applyToAllPages integrates with count per page", () => {
      const result = applyToAllPages(basePlacement({ id: "source" }), 3);
      expect(getPagePlacementsCount(result, 1)).toBe(1);
      expect(getPagePlacementsCount(result, 2)).toBe(1);
      expect(getPagePlacementsCount(result, 3)).toBe(1);
    });

    it("filterPlacementsByPage returns the exact page slice", () => {
      const placements = [
        basePlacement({ id: "a", page: 1 }),
        basePlacement({ id: "b", page: 2 }),
        basePlacement({ id: "c", page: 2 }),
        basePlacement({ id: "d", page: 4 }),
      ];
      const page2 = filterPlacementsByPage(placements, 2);
      expect(page2.map((p) => p.id)).toEqual(["b", "c"]);
    });

    it("apply-to-all then remove-by-page keeps remaining pages intact", () => {
      const all = applyToAllPages(basePlacement({ id: "sig" }), 5);
      const remaining = removePlacementsByPage(all, 3);
      expect(remaining).toHaveLength(4);
      expect(getPagePlacementsCount(remaining, 3)).toBe(0);
      expect(getPagePlacementsCount(remaining, 4)).toBe(1);
    });
  });

  describe("resize state transitions", () => {
    it("resizePlacement expands size while preserving validity", () => {
      const resized = resizePlacement(basePlacement(), 0.3, 0.15);
      expect(resized.width).toBe(0.3);
      expect(resized.height).toBe(0.15);
      expect(isPlacementValid(resized)).toBe(true);
    });

    it("resizePlacement clamps to page bounds", () => {
      const resized = resizePlacement(basePlacement({ x: 0.9, y: 0.9 }), 0.5, 0.5);
      expect(resized.x + resized.width).toBeLessThanOrEqual(1.0001);
      expect(resized.y + resized.height).toBeLessThanOrEqual(1.0001);
    });

    it("resizePlacement preserves aspect ratio when requested", () => {
      const src = basePlacement({ width: 0.2, height: 0.1 });
      const resized = resizePlacement(src, 0.4, 0.4, true);
      expect(resized.width / resized.height).toBeCloseTo(src.width / src.height, 5);
    });

    it("resizeFromHandle supports southeast resize", () => {
      const resized = resizeFromHandle(basePlacement(), "se", 20, 10, 200, 100);
      expect(resized.width).toBeGreaterThan(basePlacement().width);
      expect(resized.height).toBeGreaterThan(basePlacement().height);
    });

    it("resizeFromHandle supports northwest resize", () => {
      const resized = resizeFromHandle(basePlacement({ x: 0.4, y: 0.4 }), "nw", -20, -10, 200, 100);
      expect(resized.x).toBeLessThanOrEqual(0.4);
      expect(resized.y).toBeLessThanOrEqual(0.4);
    });

    it("resizeFromHandle preserves ratio when requested", () => {
      const src = basePlacement({ width: 0.3, height: 0.15 });
      const resized = resizeFromHandle(src, "e", 40, 0, 200, 100, true);
      expect(resized.width / resized.height).toBeCloseTo(src.width / src.height, 5);
    });
  });

  describe("apply-to-all and CRUD combinations", () => {
    it("can add cloned placements to state", () => {
      const clones = applyToAllPages(basePlacement({ id: "sig" }), 3);
      const state = clones.reduce((acc, p) => addPlacement(acc, p), [] as SignaturePlacement[]);
      expect(state).toHaveLength(3);
    });

    it("can update one page after apply-to-all", () => {
      const clones = applyToAllPages(basePlacement({ id: "sig" }), 3);
      const updated = updatePlacement(clones, "sig-p2", { x: 0.6 });
      expect(updated.find((p) => p.id === "sig-p2")?.x).toBe(0.6);
      expect(updated.find((p) => p.id === "sig-p1")?.x).toBe(0.2);
    });

    it("can remove a single page clone", () => {
      const clones = applyToAllPages(basePlacement({ id: "sig" }), 3);
      const result = removePlacement(clones, "sig-p2");
      expect(result).toHaveLength(2);
      expect(result.some((p) => p.id === "sig-p2")).toBe(false);
    });

    it("can validate state after complex operations", () => {
      const clones = applyToAllPages(basePlacement({ id: "sig" }), 3);
      const moved = updatePlacement(clones, "sig-p1", { x: 0.25, y: 0.25 });
      const resized = resizePlacement(moved[0], 0.22, 0.12);
      expect(isPlacementValid(resized)).toBe(true);
    });
  });

  describe("boundary and regression checks", () => {
    it("keeps page numbers 1-indexed throughout flows", () => {
      const clones = applyToAllPages(basePlacement({ id: "sig" }), 4);
      expect(clones.every((p) => p.page >= 1)).toBe(true);
    });

    it("maintains immutability across transformations", () => {
      const original = basePlacement();
      const updated = updatePlacement([original], "sig-1", { x: 0.4 });
      expect(original.x).toBe(0.2);
      expect(updated[0].x).toBe(0.4);
    });

    it("handles empty arrays in state helpers", () => {
      expect(removePlacement([], "x")).toEqual([]);
      expect(removePlacementsByPage([], 1)).toEqual([]);
      expect(filterPlacementsByPage([], 1)).toEqual([]);
      expect(getPagePlacementsCount([], 1)).toBe(0);
    });

    it("generates placement ids for new placements", () => {
      const id = createPlacementId();
      expect(id).toMatch(/^placement-|^[0-9a-f-]{8,}$/i);
    });
  });
});
