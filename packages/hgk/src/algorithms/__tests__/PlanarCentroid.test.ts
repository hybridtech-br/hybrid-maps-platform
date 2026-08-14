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
import { planarCentroid2 } from '../PlanarCentroid.js';

function square(minX: number, minY: number, maxX: number, maxY: number): LinearRing2 {
  const a = new Point2(minX, minY);
  return new LinearRing2([
    a,
    new Point2(maxX, minY),
    new Point2(maxX, maxY),
    new Point2(minX, maxY),
    a,
  ]);
}

describe('planar centroid', () => {
  it('returns Point2 itself and segment midpoint', () => {
    const point = new Point2(3, 4);
    expect(planarCentroid2(point)).toBe(point);
    expect(planarCentroid2(new Segment2(new Point2(0, 0), new Point2(10, 4)))).toEqual({ x: 5, y: 2 });
  });

  it('uses segment-length weighting for line strings', () => {
    const line = new LineString2([
      new Point2(0, 0),
      new Point2(10, 0),
      new Point2(10, 2),
    ]);
    const centroid = planarCentroid2(line)!;
    expect(centroid.x).toBeCloseTo(35 / 6, 12);
    expect(centroid.y).toBeCloseTo(1 / 6, 12);
  });

  it('falls back deterministically for zero-length lines', () => {
    const line = new LineString2([new Point2(2, 3), new Point2(2, 3)]);
    expect(planarCentroid2(line)).toEqual({ x: 2, y: 3 });
  });

  it('computes ring and polygon centroid', () => {
    expect(planarCentroid2(square(0, 0, 4, 4))).toEqual({ x: 2, y: 2 });
    expect(planarCentroid2(new Polygon2([
      square(0, 0, 10, 10),
      square(4, 4, 6, 6),
    ]))).toEqual({ x: 5, y: 5 });
  });

  it('averages multipoints', () => {
    expect(planarCentroid2(new MultiPoint2([
      new Point2(0, 0),
      new Point2(2, 4),
      new Point2(4, 2),
    ]))).toEqual({ x: 2, y: 2 });
  });

  it('weights multiline centroids by line length', () => {
    const centroid = planarCentroid2(new MultiLineString2([
      new LineString2([new Point2(0, 0), new Point2(10, 0)]),
      new LineString2([new Point2(0, 0), new Point2(0, 2)]),
    ]))!;
    expect(centroid.x).toBeCloseTo(25 / 6, 12);
    expect(centroid.y).toBeCloseTo(1 / 6, 12);
  });

  it('weights multipolygon centroids by area', () => {
    const centroid = planarCentroid2(new MultiPolygon2([
      new Polygon2([square(0, 0, 1, 1)]),
      new Polygon2([square(2, 2, 3, 3)]),
    ]));
    expect(centroid).toEqual({ x: 1.5, y: 1.5 });
  });

  it('uses equal child-centroid weighting for geometry collections', () => {
    const centroid = planarCentroid2(new GeometryCollection2([
      new Point2(0, 0),
      new Point2(10, 4),
    ]));
    expect(centroid).toEqual({ x: 5, y: 2 });
  });

  it('returns undefined for geometries with no points', () => {
    expect(planarCentroid2(new GeometryCollection2([]))).toBeUndefined();
    expect(planarCentroid2(new MultiPoint2([]))).toBeUndefined();
  });
});
