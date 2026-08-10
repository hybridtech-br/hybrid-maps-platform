import { describe, expect, it } from "vitest";

import { containsCoordinate, createBoundingBox } from "../geometry/BoundingBox.js";
import { createCoordinate } from "../geometry/Coordinate.js";

describe("Spatial BoundingBox characterization", () => {
  it("creates and freezes bounds without validating ordering or ranges", () => {
    const bounds = createBoundingBox(10, 20, -10, -20);
    expect(bounds).toEqual({ minLongitude: 10, minLatitude: 20, maxLongitude: -10, maxLatitude: -20 });
    expect(Object.isFrozen(bounds)).toBe(true);
  });

  it("contains coordinates inclusively when min/max values are ordered", () => {
    const bounds = createBoundingBox(-10, -5, 10, 5);
    expect(containsCoordinate(bounds, createCoordinate(-10, -5))).toBe(true);
    expect(containsCoordinate(bounds, createCoordinate(10, 5))).toBe(true);
    expect(containsCoordinate(bounds, createCoordinate(0, 0))).toBe(true);
    expect(containsCoordinate(bounds, createCoordinate(11, 0))).toBe(false);
  });
});
