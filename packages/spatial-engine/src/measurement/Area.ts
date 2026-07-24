import type { Coordinate } from '../geometry/Coordinate.js';
import type { MultiPolygon } from '../geometry/MultiPolygon.js';
import type { Polygon } from '../geometry/Polygon.js';
import {
  EARTH_MEAN_RADIUS_METERS,
  type DistanceOptions,
} from './Distance.js';

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function normalizeLongitudeDelta(delta: number): number {
  if (delta > Math.PI) return delta - 2 * Math.PI;
  if (delta < -Math.PI) return delta + 2 * Math.PI;
  return delta;
}

function ringArea(
  ring: readonly Coordinate[],
  radius: number,
): number {
  if (ring.length < 3) return 0;

  let sum = 0;

  for (let index = 0; index < ring.length; index += 1) {
    const current = ring[index];
    const next = ring[(index + 1) % ring.length];
    const longitudeDelta = normalizeLongitudeDelta(
      toRadians(next.longitude - current.longitude),
    );

    sum +=
      longitudeDelta *
      (2 +
        Math.sin(toRadians(current.latitude)) +
        Math.sin(toRadians(next.latitude)));
  }

  return Math.abs((sum * radius * radius) / 2);
}

function polygonRingsArea(
  rings: readonly (readonly Coordinate[])[],
  radius: number,
): number {
  if (rings.length === 0) return 0;

  const outerArea = ringArea(rings[0], radius);
  const holesArea = rings
    .slice(1)
    .reduce((total, ring) => total + ringArea(ring, radius), 0);

  return Math.max(0, outerArea - holesArea);
}

export function polygonArea(
  polygon: Polygon,
  options: DistanceOptions = {},
): number {
  return polygonRingsArea(
    polygon.rings,
    options.radius ?? EARTH_MEAN_RADIUS_METERS,
  );
}

export function multiPolygonArea(
  multiPolygon: MultiPolygon,
  options: DistanceOptions = {},
): number {
  const radius = options.radius ?? EARTH_MEAN_RADIUS_METERS;

  return multiPolygon.coordinates.reduce(
    (total, polygon) => total + polygonRingsArea(polygon, radius),
    0,
  );
}
