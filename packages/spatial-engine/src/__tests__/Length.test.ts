import { describe, expect, it } from "vitest";

import { createCoordinate } from "../geometry/Coordinate.js";
import { createLineString } from "../geometry/LineString.js";
import { createMultiLineString } from "../geometry/MultiLineString.js";
import { lineStringLength, multiLineStringLength } from "../measurement/Length.js";

describe("Length characterization", () => {
  it("sums Haversine segment lengths", () => {
    const line = createLineString([
      createCoordinate(0, 0),
      createCoordinate(1, 0),
      createCoordinate(2, 0),
    ]);
    expect(lineStringLength(line, { radius: 1 })).toBeCloseTo((2 * Math.PI) / 180, 12);
  });

  it("aggregates all lines in a MultiLineString", () => {
    const multi = createMultiLineString([
      [createCoordinate(0, 0), createCoordinate(1, 0)],
      [createCoordinate(0, 0), createCoordinate(0, 1)],
    ]);
    expect(multiLineStringLength(multi, { radius: 1 })).toBeCloseTo((2 * Math.PI) / 180, 12);
  });

  it("counts repeated adjacent coordinates as zero-length segments", () => {
    const repeated = createCoordinate(0, 0);
    const line = createLineString([repeated, repeated]);
    expect(lineStringLength(line, { radius: 1 })).toBe(0);
  });
});
