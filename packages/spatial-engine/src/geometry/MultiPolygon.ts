import type { Coordinate } from './Coordinate.js';
import type { BoundingBox } from './BoundingBox.js';
import { createBoundingBox } from './BoundingBox.js';

export interface MultiPolygon {
  readonly type: 'MultiPolygon';
  readonly coordinates: readonly (readonly (readonly Coordinate[])[])[];
}

export function createMultiPolygon(
  coordinates: readonly (readonly (readonly Coordinate[])[])[],
): MultiPolygon {
  if (coordinates.length === 0) {
    throw new Error('MultiPolygon requires at least one polygon.');
  }

  for (const polygon of coordinates) {
    if (polygon.length === 0) {
      throw new Error('Each polygon requires at least one ring.');
    }
  }

  return Object.freeze({
    type: 'MultiPolygon',
    coordinates: Object.freeze(
      coordinates.map((polygon) =>
        Object.freeze(
          polygon.map((ring) => Object.freeze([...ring])),
        ),
      ),
    ),
  });
}

export function multiPolygonBoundingBox(
  multiPolygon: MultiPolygon,
): BoundingBox {
  let minLongitude = Infinity;
  let minLatitude = Infinity;
  let maxLongitude = -Infinity;
  let maxLatitude = -Infinity;

  for (const polygon of multiPolygon.coordinates) {
    for (const ring of polygon) {
      for (const coordinate of ring) {
        minLongitude = Math.min(minLongitude, coordinate.longitude);
        minLatitude = Math.min(minLatitude, coordinate.latitude);
        maxLongitude = Math.max(maxLongitude, coordinate.longitude);
        maxLatitude = Math.max(maxLatitude, coordinate.latitude);
      }
    }
  }

  return createBoundingBox(
    minLongitude,
    minLatitude,
    maxLongitude,
    maxLatitude,
  );
}
