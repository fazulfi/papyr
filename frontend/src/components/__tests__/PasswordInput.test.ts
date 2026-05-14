import { describe, it, expect } from "vitest";
import {
  calculatePasswordStrength,
  getPasswordStrengthLevel,
  type PasswordStrengthLevel,
} from "../PasswordInput";

describe("calculatePasswordStrength", () => {
  it("returns 0 for empty string", () => {
    expect(calculatePasswordStrength("")).toBe(0);
  });

  it("returns 1 for length >= 8 only", () => {
    expect(calculatePasswordStrength("abcdefgh")).toBe(1);
  });

  it("returns 2 for length >= 8 + uppercase", () => {
    expect(calculatePasswordStrength("Abcdefgh")).toBe(2);
  });

  it("returns 3 for length >= 8 + uppercase + digit", () => {
    expect(calculatePasswordStrength("Abcdefg1")).toBe(3);
  });

  it("returns 4 for length >= 8 + uppercase + digit + special char", () => {
    expect(calculatePasswordStrength("Abcdefg1!")).toBe(4);
  });

  it("returns 3 for length >= 8 + uppercase + special char (no digit)", () => {
    expect(calculatePasswordStrength("Abcdefgh!")).toBe(3);
  });

  it("returns 2 for length >= 8 + digit only (no uppercase or special)", () => {
    expect(calculatePasswordStrength("abcdefg1")).toBe(2);
  });

  it("returns 2 for length >= 8 + special char only", () => {
    expect(calculatePasswordStrength("abcdefgh!")).toBe(2);
  });

  it("returns 1 for short password with uppercase", () => {
    expect(calculatePasswordStrength("Abc")).toBe(0);
  });

  it("returns 0 for short password with digit", () => {
    expect(calculatePasswordStrength("123")).toBe(0);
  });
});

describe("getPasswordStrengthLevel", () => {
  it("returns 'weak' for score 0", () => {
    expect(getPasswordStrengthLevel(0)).toBe("weak");
  });

  it("returns 'weak' for score 1", () => {
    expect(getPasswordStrengthLevel(1)).toBe("weak");
  });

  it("returns 'medium' for score 2", () => {
    expect(getPasswordStrengthLevel(2)).toBe("medium");
  });

  it("returns 'strong' for score 3", () => {
    expect(getPasswordStrengthLevel(3)).toBe("strong");
  });

  it("returns 'strong' for score 4", () => {
    expect(getPasswordStrengthLevel(4)).toBe("strong");
  });
});
