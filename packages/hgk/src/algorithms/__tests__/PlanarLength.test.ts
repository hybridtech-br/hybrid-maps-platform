import { describe, expect, it } from 'vitest';

import { LineString2 } from '../../geometry/LineString2.js';
import { MultiLineString2 } from '../../geometry/MultiLineString2.js';
import { Point2 } from '../../geometry/Point2.js';
import { Segment2 } from '../../geometry/Segment2.js';
import {
  planarLineStringLength2,
  planarMultiLineStringLength2,
  planarSegmentLength2,
} from '../PlanarLength.js';

describe('planar length', () => {
  it('computes segment length', () => {
    expect(planarSegmentLength2(
      new Segment2(new Point2(0, 0), new Point2(3, 4)),
    )).toBe(5);
  });

  it('computes line-string length from Euclidean segments', () => {
    const line = new LineString2([
      new Point2(0, 0),
      new Point2(3, 4),
      new Point2(6, 8),
    ]);
    expect(planarLineStringLength2(line)).toBe(10);
  });

  it('returns zero for empty and single-point lines', () => {
    expect(planarLineStringLength2(new LineString2([]))).toBe(0);
    expect(planarLineStringLength2(new LineString2([new Point2(1, 1)]))).toBe(0);
  });

  it('sums multiline lengths', () => {
    const multi = new MultiLineString2([
      new LineString2([new Point2(0, 0), new Point2(3, 4)]),
      new LineString2([new Point2(0, 0), new Point2(0, 2)]),
    ]);
    expect(planarMultiLineStringLength2(multi)).toBe(7);
  });

  it('fails explicitly when accumulated length overflows', () => {
    const half = Number.MAX_VALUE / 2;
    const multi = new MultiLineString2([
      new LineString2([new Point2(0, 0), new Point2(half, 0)]),
      new LineString2([new Point2(0, 0), new Point2(half, 0)]),
      new LineString2([new Point2(0, 0), new Point2(half, 0)]),
    ]);
    expect(() => planarMultiLineStringLength2(multi)).toThrow(RangeError);
  });
});
