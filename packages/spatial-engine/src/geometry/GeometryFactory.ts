import type { Coordinate } from './Coordinate.js';
import { createCoordinate } from './Coordinate.js';
import type { Point } from './Point.js';
import { createPoint } from './Point.js';
import type { LineString } from './LineString.js';
import { createLineString } from './LineString.js';
import type { Polygon } from './Polygon.js';
import { createPolygon } from './Polygon.js';
import type { MultiPoint } from './MultiPoint.js';
import { createMultiPoint } from './MultiPoint.js';
import type { MultiLineString } from './MultiLineString.js';
import { createMultiLineString } from './MultiLineString.js';
import type { MultiPolygon } from './MultiPolygon.js';
import { createMultiPolygon } from './MultiPolygon.js';
import type {
  Geometry,
  GeometryCollection,
} from './GeometryCollection.js';
import { createGeometryCollection } from './GeometryCollection.js';

export type { Geometry } from './GeometryCollection.js';

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

  multiPoint(coordinates: readonly Coordinate[]): MultiPoint {
    return createMultiPoint(coordinates);
  },

  multiLineString(
    coordinates: readonly (readonly Coordinate[])[],
  ): MultiLineString {
    return createMultiLineString(coordinates);
  },

  multiPolygon(
    coordinates: readonly (readonly (readonly Coordinate[])[])[],
  ): MultiPolygon {
    return createMultiPolygon(coordinates);
  },

  geometryCollection(
    geometries: readonly Geometry[],
  ): GeometryCollection {
    return createGeometryCollection(geometries);
  },
});
