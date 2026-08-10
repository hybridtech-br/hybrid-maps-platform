import { describe, expect, it } from 'vitest';

import { GeometryCollection2 } from '../../geometry/GeometryCollection2.js';
import { LinearRing2 } from '../../geometry/LinearRing2.js';
import { LineString2 } from '../../geometry/LineString2.js';
import { MultiLineString2 } from '../../geometry/MultiLineString2.js';
import { MultiPoint2 } from '../../geometry/MultiPoint2.js';
import { MultiPolygon2 } from '../../geometry/MultiPolygon2.js';
import { Point2 } from '../../geometry/Point2.js';
import { Polygon2 } from '../../geometry/Polygon2.js';
import { Segment2 } from '../../geometry/Segment2.js';
import { validateGeometry2 } from '../GeometryValidator2.js';

function closedSquare(): LinearRing2 {
  const a = new Point2(0, 0);
  return new LinearRing2([
    a,
    new Point2(1, 0),
    new Point2(1, 1),
    new Point2(0, 1),
    a,
  ]);
}

describe('validateGeometry2', () => {
  it('accepts valid primitive and aggregate geometries', () => {
    const polygon = new Polygon2([closedSquare()]);
    const geometries = [
      new Point2(1, 2),
      new Segment2(new Point2(0, 0), new Point2(0, 0)),
      new LineString2([new Point2(0, 0), new Point2(1, 1)]),
      closedSquare(),
      polygon,
      new MultiPoint2([new Point2(1, 1)]),
      new MultiLineString2([new LineString2([new Point2(0, 0), new Point2(1, 0)])]),
      new MultiPolygon2([polygon]),
      new GeometryCollection2([new GeometryCollection2([new Point2(2, 3)])]),
    ];

    for (const geometry of geometries) {
      expect(validateGeometry2(geometry)).toEqual({ valid: true, issues: [] });
    }
  });

  it('reports insufficient line coordinates', () => {
    const result = validateGeometry2(new LineString2([new Point2(0, 0)]));
    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(expect.objectContaining({
      code: 'INSUFFICIENT_COORDINATES',
      path: 'geometry.points',
    }));
  });

  it('reports ring minimum length and closure independently', () => {
    const result = validateGeometry2(new LinearRing2([
      new Point2(0, 0),
      new Point2(1, 0),
      new Point2(1, 1),
    ]));
    expect(result.issues.map((issue) => issue.code)).toContain('INSUFFICIENT_COORDINATES');
    expect(result.issues.map((issue) => issue.code)).toContain('RING_NOT_CLOSED');
  });

  it('reports consecutive duplicate points', () => {
    const duplicate = new Point2(1, 1);
    const result = validateGeometry2(new LineString2([
      new Point2(0, 0),
      duplicate,
      duplicate,
    ]));
    expect(result.issues).toContainEqual(expect.objectContaining({
      code: 'CONSECUTIVE_DUPLICATE_POINTS',
      path: 'geometry.points[2]',
    }));
  });

  it('treats required ring closure as valid rather than a duplicate', () => {
    const result = validateGeometry2(closedSquare());
    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it.each([
    new Polygon2([]),
    new MultiPoint2([]),
    new MultiLineString2([]),
    new MultiPolygon2([]),
    new GeometryCollection2([]),
  ])('reports empty geometry policy for %s', (geometry) => {
    const result = validateGeometry2(geometry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue) => issue.code === 'EMPTY_GEOMETRY')).toBe(true);
  });

  it('validates nested geometry collections recursively with stable paths', () => {
    const nested = new GeometryCollection2([
      new GeometryCollection2([
        new LineString2([new Point2(0, 0)]),
      ]),
    ]);
    const result = validateGeometry2(nested);
    expect(result.issues).toContainEqual(expect.objectContaining({
      code: 'INSUFFICIENT_COORDINATES',
      path: 'geometry.geometries[0].geometries[0].points',
    }));
  });

  it('defensively reports forged non-finite Point2 instances', () => {
    const forged = Object.assign(Object.create(Point2.prototype), {
      x: Number.NaN,
      y: Number.POSITIVE_INFINITY,
    }) as Point2;
    const result = validateGeometry2(forged);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual([
      'NON_FINITE_COORDINATE',
      'NON_FINITE_COORDINATE',
    ]);
  });

  it('returns frozen result and issue collections', () => {
    const result = validateGeometry2(new LineString2([]));
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.issues)).toBe(true);
    expect(Object.isFrozen(result.issues[0])).toBe(true);
  });
});
