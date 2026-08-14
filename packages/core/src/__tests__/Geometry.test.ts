import { describe, expect, it } from "vitest";

import { Coordinate, type Geometry } from "../index.js";

describe("Geometry contract characterization", () => {
  it("supports Point with a Coordinate object", () => {
    const coordinate = new Coordinate(-43.1729, -22.9068);
    const geometry: Geometry = { type: "Point", coordinates: coordinate };
    expect(geometry.type).toBe("Point");
    expect(geometry.coordinates).toBe(coordinate);
  });

  it("supports LineString with a readonly coordinate array shape", () => {
    const coordinates = [new Coordinate(0, 0), new Coordinate(1, 1)] as const;
    const geometry: Geometry = { type: "LineString", coordinates };
    expect(geometry.type).toBe("LineString");
    expect(geometry.coordinates).toBe(coordinates);
    expect(geometry.coordinates).toHaveLength(2);
  });

  it("supports Polygon with nested coordinate-ring arrays", () => {
    const ring = [
      new Coordinate(0, 0),
      new Coordinate(1, 0),
      new Coordinate(1, 1),
      new Coordinate(0, 0),
    ] as const;
    const geometry: Geometry = { type: "Polygon", coordinates: [ring] };
    expect(geometry.type).toBe("Polygon");
    expect(geometry.coordinates).toHaveLength(1);
    expect(geometry.coordinates[0]).toBe(ring);
  });

  it("documents that geometry objects themselves are not frozen by Maps Core", () => {
    const geometry: Geometry = { type: "Point", coordinates: new Coordinate(0, 0) };
    expect(Object.isFrozen(geometry)).toBe(false);
  });

  it("documents that empty LineString and Polygon structures are type-valid at runtime", () => {
    const emptyLine: Geometry = { type: "LineString", coordinates: [] };
    const emptyPolygon: Geometry = { type: "Polygon", coordinates: [] };
    expect(emptyLine.coordinates).toEqual([]);
    expect(emptyPolygon.coordinates).toEqual([]);
  });
});
