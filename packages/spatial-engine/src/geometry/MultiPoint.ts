import type { Coordinate } from './Coordinate.js';
import type { BoundingBox } from './BoundingBox.js';
import { createBoundingBox } from './BoundingBox.js';

export interface MultiPoint {
  readonly type: 'MultiPoint';
  readonly coordinates: readonly Coordinate[];
}

export function createMultiPoint(
  coordinates: readonly Coordinate[],
): MultiPoint {
  if (coordinates.length === 0) {
    throw new Error('MultiPoint requires at least one coordinate.');
  }

  return Object.freeze({
    type: 'MultiPoint',
    coordinates: Object.freeze([...coordinates]),
  });
}

export function multiPointBoundingBox(multiPoint: MultiPoint): BoundingBox {
  let minLongitude = Infinity;
  let minLatitude = Infinity;
  let maxLongitude = -Infinity;
  let maxLatitude = -Infinity;

  for (const coordinate of multiPoint.coordinates) {
    minLongitude = Math.min(minLongitude, coordinate.longitude);
    minLatitude = Math.min(minLatitude, coordinate.latitude);
    maxLongitude = Math.max(maxLongitude, coordinate.longitude);
    maxLatitude = Math.max(maxLatitude, coordinate.latitude);
  }

  return createBoundingBox(
    minLongitude,
    minLatitude,
    maxLongitude,
    maxLatitude,
  );
}
