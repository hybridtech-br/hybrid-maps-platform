import { describe, expect, it } from "vitest";

import { createCoordinate } from "../geometry/Coordinate.js";
import { createGeometryCollection } from "../geometry/GeometryCollection.js";
import { createLineString } from "../geometry/LineString.js";
import { createMultiPoint } from "../geometry/MultiPoint.js";
import { createPoint } from "../geometry/Point.js";
import { createPolygon } from "../geometry/Polygon.js";
import {
  geometryCollectionCentroid,
  lineStringCentroid,
  multiPointCentroid,
  pointCentroid,
  polygonCentroid,
} from "../measurement/Centroid.js";

describe("Centroid characterization", () => {
  it("clones Point coordinates including altitude", () => {
    const centroid = pointCentroid(createPoint(1, 2, 3));
    expect(centroid).toEqual({ longitude: 1, latitude: 2, altitude: 3 });
  });

  it("uses Haversine-weighted segment midpoints for LineString", () => {
    const line = createLineString([
      createCoordinate(0, 0),
      createCoordinate(1, 0),
      createCoordinate(2, 0),
    ]);
    expect(lineStringCentroid(line)).toMatchObject({ longitude: 1, latitude: 0 });
  });

  it("uses planar ring centroid formula for Polygon", () => {
    const polygon = createPolygon([[
      createCoordinate(0, 0),
      createCoordinate(2, 0),
      createCoordinate(2, 2),
      createCoordinate(0, 2),
      createCoordinate(0, 0),
    ]]);
    expect(polygonCentroid(polygon).longitude).toBeCloseTo(1, 12);
    expect(polygonCentroid(polygon).latitude).toBeCloseTo(1, 12);
  });

  it("averages MultiPoint coordinates and only defined altitudes", () => {
    const multi = createMultiPoint([
      createCoordinate(0, 0, 10),
      createCoordinate(2, 2),
      createCoordinate(4, 4, 20),
    ]);
    expect(multiPointCentroid(multi)).toEqual({ longitude: 2, latitude: 2, altitude: 15 });
  });

  it("averages all flattened GeometryCollection coordinates", () => {
    const collection = createGeometryCollection([
      createPoint(0, 0),
      createLineString([createCoordinate(2, 0), createCoordinate(4, 0)]),
    ]);
    expect(geometryCollectionCentroid(collection)).toEqual({ longitude: 2, latitude: 0, altitude: undefined });
  });
});
