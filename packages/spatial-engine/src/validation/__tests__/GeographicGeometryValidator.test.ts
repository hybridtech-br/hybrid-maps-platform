import { describe, expect, it } from 'vitest';

import { createPoint } from '../../geometry/Point.js';
import { validateGeographicGeometry } from '../GeographicGeometryValidator.js';

describe('GeographicGeometryValidator', () => {
  it('accepts valid Rio de Janeiro coordinates', () => {
    expect(validateGeographicGeometry(createPoint(-43.1729, -22.9068))).toEqual([]);
  });

  it('reports longitude outside the geographic range', () => {
    expect(validateGeographicGeometry(createPoint(181, 0))).toEqual([
      { code: 'LONGITUDE_OUT_OF_RANGE', path: 'coordinates[0].longitude' },
    ]);
  });

  it('reports latitude outside the geographic range', () => {
    expect(validateGeographicGeometry(createPoint(0, 91))).toEqual([
      { code: 'LATITUDE_OUT_OF_RANGE', path: 'coordinates[0].latitude' },
    ]);
  });
});
