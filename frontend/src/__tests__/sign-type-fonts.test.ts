import { describe, expect, it } from "vitest";
import {
  DEFAULT_SIGNATURE_FONT,
  SIGNATURE_FONTS,
  getGoogleFontsLink,
} from "@/app/sign/logic";

describe("STEP-F2-024 — Type mode font contract (node-safe)", () => {
  it("uses exactly the 4 required Google Fonts", () => {
    expect(SIGNATURE_FONTS).toHaveLength(4);

    const labels = SIGNATURE_FONTS.map((font) => font.label);
    expect(labels).toEqual([
      "Dancing Script",
      "Caveat",
      "Satisfy",
      "Pacifico",
    ]);
  });

  it("defaults to Dancing Script as first selectable font", () => {
    expect(DEFAULT_SIGNATURE_FONT).toBe(SIGNATURE_FONTS[0]);
    expect(DEFAULT_SIGNATURE_FONT.label).toBe("Dancing Script");
    expect(DEFAULT_SIGNATURE_FONT.googleFontName).toBe("Dancing+Script");
  });

  it("builds google fonts link containing all required families", () => {
    const url = getGoogleFontsLink();

    expect(url.startsWith("https://fonts.googleapis.com/css2?family=")).toBe(true);
    expect(url).toContain("Dancing+Script");
    expect(url).toContain("Caveat");
    expect(url).toContain("Satisfy");
    expect(url).toContain("Pacifico");
    expect(url.endsWith("&display=swap")).toBe(true);
  });
});
