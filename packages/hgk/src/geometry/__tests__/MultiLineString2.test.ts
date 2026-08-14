import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { LineString2 } from '../LineString2.js';
import { MultiLineString2 } from '../MultiLineString2.js';
import { Point2 } from '../Point2.js';

describe('MultiLineString2', () => {
  it('copies and freezes line collections', () => {
    const lines = [new LineString2([new Point2(0, 0), new Point2(1, 1)])];
    const multi = new MultiLineString2(lines);
    lines.push(new LineString2([]));

    expect(multi.lines).toHaveLength(1);
    expect(Object.isFrozen(multi.lines)).toBe(true);
    expect(Object.isFrozen(multi)).toBe(true);
  });

  it('allows empty collections for later structural validation', () => {
    expect(new MultiLineString2([]).isEmpty()).toBe(true);
  });

  it('supports exact and approximate equality', () => {
    const multi = new MultiLineString2([
      new LineString2([new Point2(0, 0), new Point2(1, 1)]),
    ]);
    const nearby = new MultiLineString2([
      new LineString2([new Point2(0, 0), new Point2(1 + EPSILON / 2, 1)]),
    ]);
    expect(multi.equals(nearby)).toBe(false);
    expect(multi.approximatelyEquals(nearby)).toBe(true);
  });

  it('produces immutable JSON output', () => {
    const json = new MultiLineString2([
      new LineString2([new Point2(1, 2), new Point2(3, 4)]),
    ]).toJSON();
    expect(json.type).toBe('MultiLineString2');
    expect(json.lines).toHaveLength(1);
    expect(Object.isFrozen(json)).toBe(true);
    expect(Object.isFrozen(json.lines)).toBe(true);
  });
});
