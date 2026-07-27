import type { Coordinate } from './Coordinate.js';
import type { BoundingBox } from './BoundingBox.js';
import { createBoundingBox } from './BoundingBox.js';

export interface MultiLineString {
  readonly type: 'MultiLineString';
  readonly coordinates: readonly (readonly Coordinate[])[];
}

export function createMultiLineString(
  coordinates: readonly (readonly Coordinate[])[],
): MultiLineString {
  if (coordinates.length === 0) {
    throw new Error('MultiLineString requires at least one line string.');
  }

  for (const line of coordinates) {
    if (line.length < 2) {
      throw new Error('Each line string requires at least two coordinates.');
    }
  }

  return Object.freeze({
    type: 'MultiLineString',
    coordinates: Object.freeze(
      coordinates.map((line) => Object.freeze([...line])),
    ),
  });
}

export function multiLineStringBoundingBox(
  multiLineString: MultiLineString,
): BoundingBox {
  let minLongitude = Infinity;
  let minLatitude = Infinity;
  let maxLongitude = -Infinity;
  let maxLatitude = -Infinity;

  for (const line of multiLineString.coordinates) {
    for (const coordinate of line) {
      minLongitude = Math.min(minLongitude, coordinate.longitude);
      minLatitude = Math.min(minLatitude, coordinate.latitude);
      maxLongitude = Math.max(maxLongitude, coordinate.longitude);
      maxLatitude = Math.max(maxLatitude, coordinate.latitude);
    }
  }

  return createBoundingBox(
    minLongitude,
    minLatitude,
    maxLongitude,
    maxLatitude,
  );
}
