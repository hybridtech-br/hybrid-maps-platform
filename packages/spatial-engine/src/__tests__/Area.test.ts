import { describe, expect, it } from "vitest";

import { createCoordinate } from "../geometry/Coordinate.js";
import { createMultiPolygon } from "../geometry/MultiPolygon.js";
import { createPolygon } from "../geometry/Polygon.js";
import { multiPolygonArea, polygonArea } from "../measurement/Area.js";

describe("Area characterization", () => {
  const square = [
    createCoordinate(0, 0),
    createCoordinate(1, 0),
    createCoordinate(1, 1),
    createCoordinate(0, 1),
    createCoordinate(0, 0),
  ] as const;

  it("returns positive spherical area for a simple polygon", () => {
    expect(polygonArea(createPolygon([square]), { radius: 1 })).toBeGreaterThan(0);
  });

  it("is orientation-insensitive because ring area is absolute", () => {
    const forward = polygonArea(createPolygon([square]), { radius: 1 });
    const reverse = polygonArea(createPolygon([[...square].reverse()]), { radius: 1 });
    expect(reverse).toBeCloseTo(forward, 12);
  });

  it("subtracts hole area but never returns a negative public value", () => {
    const hole = [
      createCoordinate(0.25, 0.25),
      createCoordinate(0.75, 0.25),
      createCoordinate(0.75, 0.75),
      createCoordinate(0.25, 0.75),
      createCoordinate(0.25, 0.25),
    ] as const;
    const withHole = polygonArea(createPolygon([square, hole]), { radius: 1 });
    expect(withHole).toBeGreaterThanOrEqual(0);
    expect(withHole).toBeLessThan(polygonArea(createPolygon([square]), { radius: 1 }));
  });

  it("aggregates polygon areas in MultiPolygon", () => {
    const multi = createMultiPolygon([[square], [square]]);
    expect(multiPolygonArea(multi, { radius: 1 })).toBeCloseTo(
      2 * polygonArea(createPolygon([square]), { radius: 1 }),
      12,
    );
  });
});
