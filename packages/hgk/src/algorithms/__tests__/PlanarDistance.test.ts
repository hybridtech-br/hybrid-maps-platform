import { describe, expect, it } from 'vitest';

import { Point2 } from '../../geometry/Point2.js';
import { planarDistance2, planarDistanceSquared2 } from '../PlanarDistance.js';

describe('planar distance', () => {
  it('computes Euclidean distance and squared distance', () => {
    const a = new Point2(0, 0);
    const b = new Point2(3, 4);
    expect(planarDistanceSquared2(a, b)).toBe(25);
    expect(planarDistance2(a, b)).toBe(5);
  });

  it('is symmetric and zero for identical points', () => {
    const a = new Point2(-2, 7);
    const b = new Point2(4, -1);
    expect(planarDistance2(a, b)).toBe(planarDistance2(b, a));
    expect(planarDistance2(a, a)).toBe(0);
  });

  it('fails explicitly when coordinate deltas overflow', () => {
    const a = new Point2(-Number.MAX_VALUE, 0);
    const b = new Point2(Number.MAX_VALUE, 0);
    expect(() => planarDistance2(a, b)).toThrow(RangeError);
    expect(() => planarDistanceSquared2(a, b)).toThrow(RangeError);
  });

  it('fails explicitly when squared distance overflows', () => {
    const a = new Point2(0, 0);
    const b = new Point2(Number.MAX_VALUE / 2, 0);
    expect(Number.isFinite(planarDistance2(a, b))).toBe(true);
    expect(() => planarDistanceSquared2(a, b)).toThrow(RangeError);
  });
});
