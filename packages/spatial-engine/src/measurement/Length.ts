import type { LineString } from '../geometry/LineString.js';
import type { MultiLineString } from '../geometry/MultiLineString.js';
import type { DistanceOptions } from './Distance.js';
import { haversineDistance } from './Distance.js';

function coordinateSequenceLength(
  coordinates: LineString['coordinates'],
  options: DistanceOptions = {},
): number {
  let total = 0;

  for (let index = 1; index < coordinates.length; index += 1) {
    const previous = coordinates[index - 1];
    const current = coordinates[index];

    total += haversineDistance(
      previous.longitude,
      previous.latitude,
      current.longitude,
      current.latitude,
      options,
    );
  }

  return total;
}

export function lineStringLength(
  lineString: LineString,
  options: DistanceOptions = {},
): number {
  return coordinateSequenceLength(lineString.coordinates, options);
}

export function multiLineStringLength(
  multiLineString: MultiLineString,
  options: DistanceOptions = {},
): number {
  return multiLineString.coordinates.reduce(
    (total, coordinates) =>
      total + coordinateSequenceLength(coordinates, options),
    0,
  );
}
