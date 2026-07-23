import type { Coordinate } from './Coordinate.js';
import { createCoordinate } from './Coordinate.js';
import type { Point } from './Point.js';
import { createPoint } from './Point.js';
import type { LineString } from './LineString.js';
import { createLineString } from './LineString.js';
import type { Polygon } from './Polygon.js';
import { createPolygon } from './Polygon.js';

export type Geometry = Point | LineString | Polygon;

export const GeometryFactory = Object.freeze({
  coordinate(
    longitude: number,
    latitude: number,
    altitude?: number,
  ): Coordinate {
    return createCoordinate(longitude, latitude, altitude);
  },

  point(coordinate: Coordinate): Point {
    return createPoint(coordinate);
  },

  lineString(coordinates: readonly Coordinate[]): LineString {
    return createLineString(coordinates);
  },

  polygon(rings: readonly (readonly Coordinate[])[]): Polygon {
    return createPolygon(rings);
  },
});
