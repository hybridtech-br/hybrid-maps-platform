import { describe, expect, it } from "vitest";

import { createCoordinate } from "../geometry/Coordinate.js";
import { createGeometryCollection } from "../geometry/GeometryCollection.js";
import { createLineString } from "../geometry/LineString.js";
import { createPoint } from "../geometry/Point.js";
import { createPolygon } from "../geometry/Polygon.js";
import { validateGeometry, validateGeometryCollection } from "../validation/GeometryValidator.js";

describe("GeometryValidator characterization", () => {
  it("accepts valid Point and LineString geometries", () => {
    expect(validateGeometry(createPoint(1, 2))).toEqual({ valid: true, issues: [] });
    expect(validateGeometry(createLineString([createCoordinate(0, 0), createCoordinate(1, 1)]))).toEqual({
      valid: true,
      issues: [],
    });
  });

  it("reports geographic coordinate range violations with stable codes and paths", () => {
    const result = validateGeometry(createPoint(181, 91, Number.POSITIVE_INFINITY));
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual([
      "INVALID_LONGITUDE",
      "INVALID_LATITUDE",
      "INVALID_ALTITUDE",
    ]);
    expect(result.issues.map((issue) => issue.path)).toEqual([
      "geometry.coordinate.longitude",
      "geometry.coordinate.latitude",
      "geometry.coordinate.altitude",
    ]);
  });

  it("reports open and undersized polygon rings", () => {
    const polygon = createPolygon([[
      createCoordinate(0, 0),
      createCoordinate(1, 0),
      createCoordinate(1, 1),
    ]]);
    const result = validateGeometry(polygon);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain("INSUFFICIENT_COORDINATES");
    expect(result.issues.map((issue) => issue.code)).toContain("RING_NOT_CLOSED");
  });

  it("reports consecutive duplicate coordinates", () => {
    const repeated = createCoordinate(0, 0);
    const line = createLineString([repeated, repeated]);
    const result = validateGeometry(line);
    expect(result.issues.some((issue) => issue.code === "CONSECUTIVE_DUPLICATE_COORDINATES")).toBe(true);
  });

  it("rejects an empty GeometryCollection even though construction allows it", () => {
    const result = validateGeometryCollection(createGeometryCollection([]));
    expect(result).toEqual({
      valid: false,
      issues: [{
        code: "EMPTY_GEOMETRY",
        path: "collection.geometries",
        message: "GeometryCollection requires at least one geometry.",
      }],
    });
  });

  it("freezes validation results and issue arrays", () => {
    const result = validateGeometry(createPoint(0, 0));
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.issues)).toBe(true);
  });
});
