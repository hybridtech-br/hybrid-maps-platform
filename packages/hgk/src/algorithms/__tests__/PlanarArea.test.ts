import { describe, expect, it } from 'vitest';

import { LinearRing2 } from '../../geometry/LinearRing2.js';
import { MultiPolygon2 } from '../../geometry/MultiPolygon2.js';
import { Point2 } from '../../geometry/Point2.js';
import { Polygon2 } from '../../geometry/Polygon2.js';
import {
  planarLinearRingArea2,
  planarMultiPolygonArea2,
  planarPolygonArea2,
} from '../PlanarArea.js';

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

describe('planar area', () => {
  it('computes unsigned linear-ring area independent of orientation', () => {
    const ring = square(0, 0, 4, 3);
    expect(planarLinearRingArea2(ring)).toBe(12);
    expect(planarLinearRingArea2(ring.reversed())).toBe(12);
  });

  it('subtracts polygon holes', () => {
    const polygon = new Polygon2([
      square(0, 0, 10, 10),
      square(2, 2, 4, 4),
    ]);
    expect(planarPolygonArea2(polygon)).toBe(96);
  });

  it('returns zero for empty and degenerate polygon area', () => {
    expect(planarPolygonArea2(new Polygon2([]))).toBe(0);
    const a = new Point2(0, 0);
    const lineRing = new LinearRing2([a, new Point2(1, 0), new Point2(2, 0), a]);
    expect(planarLinearRingArea2(lineRing)).toBe(0);
  });

  it('sums multi-polygon area', () => {
    const multi = new MultiPolygon2([
      new Polygon2([square(0, 0, 2, 2)]),
      new Polygon2([square(10, 10, 13, 12)]),
    ]);
    expect(planarMultiPolygonArea2(multi)).toBe(10);
  });

  it('never exposes negative public polygon area', () => {
    const polygon = new Polygon2([
      square(0, 0, 1, 1),
      square(0, 0, 2, 2),
    ]);
    expect(planarPolygonArea2(polygon)).toBe(0);
  });

  it('fails explicitly on arithmetic overflow', () => {
    const max = Number.MAX_VALUE;
    const a = new Point2(max, max);
    const ring = new LinearRing2([
      a,
      new Point2(max, max / 2),
      new Point2(max / 2, max / 2),
      a,
    ]);
    expect(() => planarLinearRingArea2(ring)).toThrow(RangeError);
  });
});
