import type { Coordinate } from '../geometry/Coordinate.js';

export const EARTH_MEAN_RADIUS_METERS = 6_371_008.8;

export interface DistanceOptions {
  readonly radius?: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function distanceMeters(
  start: Coordinate,
  end: Coordinate,
  options: DistanceOptions = {},
): number {
  const radius = options.radius ?? EARTH_MEAN_RADIUS_METERS;
  const startLatitude = toRadians(start.latitude);
  const endLatitude = toRadians(end.latitude);
  const latitudeDelta = endLatitude - startLatitude;
  const longitudeDelta = toRadians(end.longitude - start.longitude);

  const sinLatitude = Math.sin(latitudeDelta / 2);
  const sinLongitude = Math.sin(longitudeDelta / 2);

  const haversine =
    sinLatitude * sinLatitude +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      sinLongitude *
      sinLongitude;

  const normalizedHaversine = Math.min(1, Math.max(0, haversine));
  const centralAngle =
    2 *
    Math.atan2(
      Math.sqrt(normalizedHaversine),
      Math.sqrt(1 - normalizedHaversine),
    );

  return radius * centralAngle;
}
