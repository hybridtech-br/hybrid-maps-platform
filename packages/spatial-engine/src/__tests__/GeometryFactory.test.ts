import { describe, expect, it } from "vitest";

import { GeometryFactory } from "../geometry/GeometryFactory.js";
import { createCoordinate } from "../geometry/Coordinate.js";

describe("GeometryFactory characterization", () => {
  it("is frozen", () => {
    expect(Object.isFrozen(GeometryFactory)).toBe(true);
  });

  it("creates coordinates", () => {
    expect(GeometryFactory.coordinate(1, 2, 3)).toEqual({ longitude: 1, latitude: 2, altitude: 3 });
  });

  it("creates Point from Coordinate", () => {
    const coordinate = createCoordinate(-43.1729, -22.9068, 5);
    const point = GeometryFactory.point(coordinate);
    expect(point.type).toBe("Point");
    expect(point.coordinate).toEqual(coordinate);
    expect(point.coordinate).not.toBe(coordinate);
  });

  it("creates line strings, polygons and collections", () => {
    const a = createCoordinate(0, 0);
    const b = createCoordinate(1, 1);
    const line = GeometryFactory.lineString([a, b]);
    const polygon = GeometryFactory.polygon([[a, createCoordinate(1, 0), b, a]]);
    const collection = GeometryFactory.geometryCollection([line, polygon]);

    expect(line.type).toBe("LineString");
    expect(polygon.type).toBe("Polygon");
    expect(collection.geometries).toHaveLength(2);
  });
});
