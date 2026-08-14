import { describe, expect, it } from 'vitest';

import { GeographicCoordinate } from '../../coordinates/GeographicCoordinate.js';
import { GeographicBounds } from '../GeographicBounds.js';

describe('GeographicBounds', () => {
  it('creates immutable validated bounds', () => {
    const bounds = new GeographicBounds(-44, -24, -42, -22);
    expect(bounds).toEqual({ west: -44, south: -24, east: -42, north: -22 });
    expect(Object.isFrozen(bounds)).toBe(true);
  });

  it('rejects invalid geographic coordinates', () => {
    expect(() => new GeographicBounds(-181, 0, 0, 1)).toThrow(RangeError);
    expect(() => new GeographicBounds(0, -91, 1, 0)).toThrow(RangeError);
  });

  it('rejects antimeridian-crossing representation in the simple bounds type', () => {
    expect(() => new GeographicBounds(170, -10, -170, 10)).toThrowError(
      new RangeError(
        'GeographicBounds does not represent antimeridian-crossing bounds; west must not exceed east.',
      ),
    );
  });

  it('rejects south greater than north', () => {
    expect(() => new GeographicBounds(0, 10, 1, -10)).toThrow(RangeError);
  });

  it('includes boundary coordinates', () => {
    const bounds = new GeographicBounds(-10, -5, 10, 5);
    expect(bounds.contains(new GeographicCoordinate(-10, -5))).toBe(true);
    expect(bounds.contains(new GeographicCoordinate(10, 5))).toBe(true);
    expect(bounds.contains(new GeographicCoordinate(11, 0))).toBe(false);
  });

  it('treats touching bounds as intersecting', () => {
    const a = new GeographicBounds(0, 0, 10, 10);
    const b = new GeographicBounds(10, 2, 20, 8);
    const c = new GeographicBounds(11, 0, 20, 10);
    expect(a.intersects(b)).toBe(true);
    expect(a.intersects(c)).toBe(false);
  });

  it('computes a geographic center', () => {
    expect(new GeographicBounds(-20, -10, 10, 20).center()).toEqual({
      longitude: -5,
      latitude: 5,
      altitude: undefined,
    });
  });

  it('supports exact equality and immutable JSON', () => {
    const bounds = new GeographicBounds(1, 2, 3, 4);
    expect(bounds.equals(new GeographicBounds(1, 2, 3, 4))).toBe(true);
    expect(bounds.equals(new GeographicBounds(1, 2, 4, 4))).toBe(false);
    expect(bounds.toJSON()).toEqual({ west: 1, south: 2, east: 3, north: 4 });
    expect(Object.isFrozen(bounds.toJSON())).toBe(true);
  });
});
