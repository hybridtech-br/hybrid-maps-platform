import type { BoundingBox } from './BoundingBox.js';
import { createBoundingBox } from './BoundingBox.js';
import type { Coordinate } from './Coordinate.js';
import { createCoordinate } from './Coordinate.js';

export interface LineString {
  readonly type: 'LineString';
  readonly coordinates: readonly Coordinate[];
}

export function createLineString(
  coordinates: readonly Coordinate[],
): LineString {
  if (coordinates.length < 2) {
    throw new Error('A LineString requires at least two coordinates.');
  }

  const immutableCoordinates = coordinates.map(({ longitude, latitude, altitude }) =>
    createCoordinate(longitude, latitude, altitude),
  );

  return Object.freeze({
    type: 'LineString' as const,
    coordinates: Object.freeze(immutableCoordinates),
  });
}

export function lineStringBoundingBox(lineString: LineString): BoundingBox {
  let minLongitude = Number.POSITIVE_INFINITY;
  let minLatitude = Number.POSITIVE_INFINITY;
  let maxLongitude = Number.NEGATIVE_INFINITY;
  let maxLatitude = Number.NEGATIVE_INFINITY;

  for (const coordinate of lineString.coordinates) {
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
