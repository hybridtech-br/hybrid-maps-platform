import { describe, expect, it } from "vitest";

import { createCoordinate } from "../geometry/Coordinate.js";
import { EARTH_MEAN_RADIUS_METERS, distanceMeters } from "../measurement/Distance.js";

describe("Distance characterization", () => {
  it("exposes the current mean Earth radius", () => {
    expect(EARTH_MEAN_RADIUS_METERS).toBe(6_371_008.8);
  });

  it("returns zero for equal coordinates", () => {
    const point = createCoordinate(10, -20);
    expect(distanceMeters(point, point)).toBe(0);
  });

  it("uses Haversine semantics with custom radius", () => {
    const start = createCoordinate(0, 0);
    const end = createCoordinate(1, 0);
    expect(distanceMeters(start, end, { radius: 1 })).toBeCloseTo(Math.PI / 180, 12);
  });

  it("handles antimeridian-adjacent coordinates as the short spherical path", () => {
    const start = createCoordinate(179, 0);
    const end = createCoordinate(-179, 0);
    expect(distanceMeters(start, end, { radius: 1 })).toBeCloseTo((2 * Math.PI) / 180, 12);
  });
});
