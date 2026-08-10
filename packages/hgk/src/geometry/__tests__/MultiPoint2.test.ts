import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { MultiPoint2 } from '../MultiPoint2.js';
import { Point2 } from '../Point2.js';

describe('MultiPoint2', () => {
  it('copies and freezes point collections', () => {
    const points = [new Point2(0, 0), new Point2(1, 1)];
    const multi = new MultiPoint2(points);
    points.push(new Point2(2, 2));

    expect(multi.points).toHaveLength(2);
    expect(Object.isFrozen(multi.points)).toBe(true);
    expect(Object.isFrozen(multi)).toBe(true);
  });

  it('allows empty collections for later structural validation', () => {
    expect(new MultiPoint2([]).isEmpty()).toBe(true);
  });

  it('supports exact and approximate equality', () => {
    const multi = new MultiPoint2([new Point2(0, 0), new Point2(1, 1)]);
    const nearby = new MultiPoint2([new Point2(0, 0), new Point2(1 + EPSILON / 2, 1)]);
    expect(multi.equals(nearby)).toBe(false);
    expect(multi.approximatelyEquals(nearby)).toBe(true);
  });

  it('produces immutable JSON output', () => {
    const json = new MultiPoint2([new Point2(1, 2)]).toJSON();
    expect(json).toEqual({ type: 'MultiPoint2', points: [{ x: 1, y: 2 }] });
    expect(Object.isFrozen(json)).toBe(true);
    expect(Object.isFrozen(json.points)).toBe(true);
  });
});
