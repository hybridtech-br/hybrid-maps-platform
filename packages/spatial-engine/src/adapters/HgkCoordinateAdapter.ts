import { Envelope2, Point2 } from '@hybrid/hgk';

import { GeographicBounds } from '../bounds/GeographicBounds.js';
import { GeographicCoordinate } from '../coordinates/GeographicCoordinate.js';

export function geographicCoordinateToHgkPoint2(
  coordinate: GeographicCoordinate,
): Point2 {
  if (coordinate.altitude !== undefined) {
    throw new RangeError(
      'Cannot adapt an altitude-bearing GeographicCoordinate to HGK Point2 without data loss.',
    );
  }
  return new Point2(coordinate.longitude, coordinate.latitude);
}

export function hgkPoint2ToGeographicCoordinate(point: Point2): GeographicCoordinate {
  return new GeographicCoordinate(point.x, point.y);
}

export function geographicBoundsToHgkEnvelope2(bounds: GeographicBounds): Envelope2 {
  return new Envelope2(bounds.west, bounds.south, bounds.east, bounds.north);
}

export function hgkEnvelope2ToGeographicBounds(envelope: Envelope2): GeographicBounds {
  return new GeographicBounds(envelope.minX, envelope.minY, envelope.maxX, envelope.maxY);
}
