import type { Coordinate } from './Coordinate.js';
import { createCoordinate, equalsCoordinate } from './Coordinate.js';
import type { BoundingBox } from './BoundingBox.js';
import { createBoundingBox } from './BoundingBox.js';

export interface Point {
  readonly type: 'Point';
  readonly coordinate: Coordinate;
}

export function createPoint(
  longitude: number,
  latitude: number,
  altitude?: number,
): Point {
  return Object.freeze({
    type: 'Point' as const,
    coordinate: createCoordinate(longitude, latitude, altitude),
  });
}

export function equalsPoint(a: Point, b: Point): boolean {
  return equalsCoordinate(a.coordinate, b.coordinate);
}

export function pointBoundingBox(point: Point): BoundingBox {
  const { longitude, latitude } = point.coordinate;
  return createBoundingBox(longitude, latitude, longitude, latitude);
}
