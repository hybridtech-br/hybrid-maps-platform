import { Envelope2, Point2 } from '@hybrid/hgk';
import { describe, expect, it } from 'vitest';

import { GeographicBounds } from '../../bounds/GeographicBounds.js';
import { GeographicCoordinate } from '../../coordinates/GeographicCoordinate.js';
import {
  geographicBoundsToHgkEnvelope2,
  geographicCoordinateToHgkPoint2,
  hgkEnvelope2ToGeographicBounds,
  hgkPoint2ToGeographicCoordinate,
} from '../HgkCoordinateAdapter.js';

describe('HGK coordinate adapters', () => {
  it('round-trips a two-dimensional geographic coordinate', () => {
    const coordinate = new GeographicCoordinate(-43.1729, -22.9068);
    const point = geographicCoordinateToHgkPoint2(coordinate);
    expect(point).toEqual({ x: -43.1729, y: -22.9068 });
    expect(hgkPoint2ToGeographicCoordinate(point)).toEqual({
      longitude: -43.1729,
      latitude: -22.9068,
      altitude: undefined,
    });
  });

  it('rejects silent altitude loss when adapting to Point2', () => {
    expect(() => geographicCoordinateToHgkPoint2(
      new GeographicCoordinate(1, 2, 3),
    )).toThrowError(
      new RangeError(
        'Cannot adapt an altitude-bearing GeographicCoordinate to HGK Point2 without data loss.',
      ),
    );
  });

  it('enforces geographic ranges when adapting from raw HGK Point2', () => {
    expect(() => hgkPoint2ToGeographicCoordinate(new Point2(181, 0))).toThrow(RangeError);
    expect(() => hgkPoint2ToGeographicCoordinate(new Point2(0, 91))).toThrow(RangeError);
  });

  it('round-trips simple non-antimeridian geographic bounds', () => {
    const bounds = new GeographicBounds(-44, -24, -42, -22);
    const envelope = geographicBoundsToHgkEnvelope2(bounds);
    expect(envelope).toEqual({ minX: -44, minY: -24, maxX: -42, maxY: -22 });
    expect(hgkEnvelope2ToGeographicBounds(envelope)).toEqual(bounds);
  });

  it('enforces geographic bounds semantics when adapting from HGK', () => {
    expect(() => hgkEnvelope2ToGeographicBounds(new Envelope2(-181, 0, -170, 1))).toThrow(RangeError);
    expect(() => hgkEnvelope2ToGeographicBounds(new Envelope2(0, -91, 1, -80))).toThrow(RangeError);
  });
});
