import type { Coordinate } from '../geometry/Coordinate.js';

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function normalizeBearing(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

export function initialBearing(
  origin: Coordinate,
  destination: Coordinate,
): number {
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const longitudeDelta = toRadians(
    destination.longitude - origin.longitude,
  );

  const y = Math.sin(longitudeDelta) * Math.cos(destinationLatitude);
  const x =
    Math.cos(originLatitude) * Math.sin(destinationLatitude) -
    Math.sin(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.cos(longitudeDelta);

  return normalizeBearing(toDegrees(Math.atan2(y, x)));
}

export function finalBearing(
  origin: Coordinate,
  destination: Coordinate,
): number {
  return normalizeBearing(initialBearing(destination, origin) + 180);
}
