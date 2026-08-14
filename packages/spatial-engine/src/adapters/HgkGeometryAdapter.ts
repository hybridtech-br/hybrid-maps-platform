import { LineString2, LinearRing2, Point2, Polygon2 } from '@hybrid/hgk';

import type { Coordinate } from '../geometry/Coordinate.js';
import type { LineString } from '../geometry/LineString.js';
import type { Point } from '../geometry/Point.js';
import type { Polygon } from '../geometry/Polygon.js';

function assertNoAltitude(coordinate: Coordinate): void {
  if (coordinate.altitude !== undefined) {
    throw new RangeError('Cannot adapt altitude-bearing geographic geometry to 2D HGK without data loss.');
  }
}

function coordinateToPoint2(coordinate: Coordinate): Point2 {
  assertNoAltitude(coordinate);
  return new Point2(coordinate.longitude, coordinate.latitude);
}

export function geographicPointToHgkPoint2(point: Point): Point2 {
  return coordinateToPoint2(point.coordinate);
}

export function geographicLineStringToHgkLineString2(lineString: LineString): LineString2 {
  return new LineString2(lineString.coordinates.map(coordinateToPoint2));
}

export function geographicPolygonToHgkPolygon2(polygon: Polygon): Polygon2 {
  if (polygon.rings.length === 0) throw new Error('Polygon requires at least one ring.');
  return new Polygon2(
    polygon.rings.map((ring) => new LinearRing2(ring.map(coordinateToPoint2))),
  );
}
