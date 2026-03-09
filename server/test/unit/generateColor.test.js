import { describe, it, expect } from "vitest";
import generateDistinctHexColor from "../../utils/generateColor.js";

describe("generateDistinctHexColor", () => {
    it("should return a valid 7-character hex color string", () => {
        const color = generateDistinctHexColor();
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("should generate multiple distinct colors", () => {
        const colors = new Set();
        for (let i = 0; i < 20; i++) {
            colors.add(generateDistinctHexColor());
        }
        expect(colors.size).toBeGreaterThan(5);
    });

    it("should return string type", () => {
        expect(typeof generateDistinctHexColor()).toBe("string");
    });

    it("should start with #", () => {
        const color = generateDistinctHexColor();
        expect(color.startsWith("#")).toBe(true);
    });
});
