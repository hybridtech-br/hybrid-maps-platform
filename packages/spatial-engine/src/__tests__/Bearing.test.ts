import { describe, expect, it } from "vitest";

import { createCoordinate } from "../geometry/Coordinate.js";
import { finalBearing, initialBearing } from "../measurement/Bearing.js";

describe("Bearing characterization", () => {
  const origin = createCoordinate(0, 0);

  it.each([
    [createCoordinate(0, 1), 0],
    [createCoordinate(1, 0), 90],
    [createCoordinate(0, -1), 180],
    [createCoordinate(-1, 0), 270],
  ])("returns normalized cardinal initial bearing", (destination, expected) => {
    expect(initialBearing(origin, destination)).toBeCloseTo(expected, 10);
  });

  it("returns zero for coincident coordinates", () => {
    expect(initialBearing(origin, origin)).toBe(0);
    expect(finalBearing(origin, origin)).toBe(180);
  });

  it("normalizes final bearing to [0, 360)", () => {
    const bearing = finalBearing(createCoordinate(-43, -23), createCoordinate(151, -33));
    expect(bearing).toBeGreaterThanOrEqual(0);
    expect(bearing).toBeLessThan(360);
  });
});
