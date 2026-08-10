import { describe, expect, it } from "vitest";

import { BoundingBox, Coordinate, Viewport } from "../index.js";

describe("Viewport characterization", () => {
  it("uses default bearing and pitch and converts tuple center", () => {
    const viewport = new Viewport({ center: [-43.1729, -22.9068], zoom: 12 });
    expect(viewport.center).toBeInstanceOf(Coordinate);
    expect(viewport.center.toArray()).toEqual([-43.1729, -22.9068]);
    expect(viewport.zoom).toBe(12);
    expect(viewport.bearing).toBe(0);
    expect(viewport.pitch).toBe(0);
    expect(viewport.bounds).toBeUndefined();
  });

  it("preserves Coordinate and BoundingBox instances", () => {
    const center = new Coordinate(1, 2);
    const bounds = new BoundingBox(0, 0, 2, 4);
    const viewport = new Viewport({ center, zoom: 1, bounds });
    expect(viewport.center).toBe(center);
    expect(viewport.bounds).toBe(bounds);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -0.000001])(
    "rejects invalid zoom %s",
    (zoom) => {
      expect(() => new Viewport({ center: [0, 0], zoom })).toThrowError(
        new RangeError("Zoom must be a non-negative finite number."),
      );
    },
  );

  it("accepts zero zoom", () => {
    expect(new Viewport({ center: [0, 0], zoom: 0 }).zoom).toBe(0);
  });

  it.each([
    [360, 0],
    [720, 0],
    [-360, 0],
    [-1, 359],
    [361, 1],
    [-721, 359],
  ])("normalizes bearing %s to %s", (input, expected) => {
    expect(new Viewport({ center: [0, 0], zoom: 1, bearing: input }).bearing).toBe(expected);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects non-finite bearing %s",
    (bearing) => {
      expect(() => new Viewport({ center: [0, 0], zoom: 1, bearing })).toThrowError(
        new RangeError("Bearing must be finite."),
      );
    },
  );

  it("accepts pitch boundaries", () => {
    expect(new Viewport({ center: [0, 0], zoom: 1, pitch: 0 }).pitch).toBe(0);
    expect(new Viewport({ center: [0, 0], zoom: 1, pitch: 85 }).pitch).toBe(85);
  });

  it.each([-0.000001, 85.000001, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects invalid pitch %s",
    (pitch) => {
      expect(() => new Viewport({ center: [0, 0], zoom: 1, pitch })).toThrowError(
        new RangeError("Pitch must be between 0 and 85 degrees."),
      );
    },
  );

  it("freezes instances", () => {
    expect(Object.isFrozen(new Viewport({ center: [0, 0], zoom: 1 }))).toBe(true);
  });
});
