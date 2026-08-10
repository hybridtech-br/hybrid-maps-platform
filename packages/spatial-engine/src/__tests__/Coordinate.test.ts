import { describe, expect, it } from "vitest";

import { createCoordinate, equalsCoordinate } from "../geometry/Coordinate.js";

describe("Spatial Coordinate characterization", () => {
  it("creates and freezes coordinates without range validation", () => {
    const coordinate = createCoordinate(500, -200, Number.POSITIVE_INFINITY);
    expect(coordinate).toEqual({ longitude: 500, latitude: -200, altitude: Number.POSITIVE_INFINITY });
    expect(Object.isFrozen(coordinate)).toBe(true);
  });

  it("preserves undefined altitude as an enumerable property", () => {
    expect(createCoordinate(1, 2)).toEqual({ longitude: 1, latitude: 2, altitude: undefined });
  });

  it("uses exact equality across longitude latitude and altitude", () => {
    expect(equalsCoordinate(createCoordinate(1, 2, 3), createCoordinate(1, 2, 3))).toBe(true);
    expect(equalsCoordinate(createCoordinate(1, 2), createCoordinate(1, 2, 0))).toBe(false);
    expect(equalsCoordinate(createCoordinate(1, 2), createCoordinate(1 + Number.EPSILON, 2))).toBe(false);
  });
});
