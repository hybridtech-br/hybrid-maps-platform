import { describe, expect, it } from 'vitest';

import { GeographicCoordinate } from '../GeographicCoordinate.js';

describe('GeographicCoordinate', () => {
  it('creates an immutable geographic coordinate', () => {
    const coordinate = new GeographicCoordinate(-43.1729, -22.9068, 12);
    expect(coordinate).toEqual({ longitude: -43.1729, latitude: -22.9068, altitude: 12 });
    expect(Object.isFrozen(coordinate)).toBe(true);
  });

  it.each([-180, 180])('accepts longitude boundary %s', (longitude) => {
    expect(new GeographicCoordinate(longitude, 0).longitude).toBe(longitude);
  });

  it.each([-90, 90])('accepts latitude boundary %s', (latitude) => {
    expect(new GeographicCoordinate(0, latitude).latitude).toBe(latitude);
  });

  it.each([-180.000001, 180.000001, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid longitude %s',
    (longitude) => {
      expect(() => new GeographicCoordinate(longitude, 0)).toThrow(RangeError);
    },
  );

  it.each([-90.000001, 90.000001, Number.NaN, Number.NEGATIVE_INFINITY])(
    'rejects invalid latitude %s',
    (latitude) => {
      expect(() => new GeographicCoordinate(0, latitude)).toThrow(RangeError);
    },
  );

  it('rejects non-finite altitude', () => {
    expect(() => new GeographicCoordinate(0, 0, Number.NaN)).toThrow(RangeError);
  });

  it('preserves exact equality semantics including altitude', () => {
    const a = new GeographicCoordinate(1, 2, 3);
    expect(a.equals(new GeographicCoordinate(1, 2, 3))).toBe(true);
    expect(a.equals(new GeographicCoordinate(1, 2))).toBe(false);
  });

  it('produces immutable JSON with optional altitude', () => {
    const withoutAltitude = new GeographicCoordinate(1, 2).toJSON();
    const withAltitude = new GeographicCoordinate(1, 2, 3).toJSON();
    expect(withoutAltitude).toEqual({ longitude: 1, latitude: 2 });
    expect(withAltitude).toEqual({ longitude: 1, latitude: 2, altitude: 3 });
    expect(Object.isFrozen(withoutAltitude)).toBe(true);
    expect(Object.isFrozen(withAltitude)).toBe(true);
  });
});
