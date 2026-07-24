import type { Point } from './Point.js';
import type { LineString } from './LineString.js';
import type { Polygon } from './Polygon.js';
import type { MultiPoint } from './MultiPoint.js';
import type { MultiLineString } from './MultiLineString.js';
import type { MultiPolygon } from './MultiPolygon.js';

export type Geometry =
  | Point
  | LineString
  | Polygon
  | MultiPoint
  | MultiLineString
  | MultiPolygon;

export interface GeometryCollection {
  readonly type: 'GeometryCollection';
  readonly geometries: readonly Geometry[];
}

export function createGeometryCollection(
  geometries: readonly Geometry[],
): GeometryCollection {
  return Object.freeze({
    type: 'GeometryCollection',
    geometries: Object.freeze([...geometries]),
  });
}
