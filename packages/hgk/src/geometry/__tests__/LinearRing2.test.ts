import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { LinearRing2 } from '../LinearRing2.js';
import { Point2 } from '../Point2.js';

describe('LinearRing2', () => {
  it('copies and freezes the input sequence', () => {
    const points = [new Point2(0, 0), new Point2(1, 0), new Point2(0, 0)];
    const ring = new LinearRing2(points);
    points.push(new Point2(2, 2));

    expect(ring.points).toHaveLength(3);
    expect(Object.isFrozen(ring.points)).toBe(true);
    expect(Object.isFrozen(ring)).toBe(true);
  });

  it('allows empty and open rings for later structural validation', () => {
    expect(new LinearRing2([]).isEmpty()).toBe(true);
    expect(new LinearRing2([new Point2(0, 0), new Point2(1, 0)]).isClosed()).toBe(false);
  });

  it('detects exact closure', () => {
    const start = new Point2(0, 0);
    const ring = new LinearRing2([start, new Point2(1, 0), new Point2(1, 1), start]);
    expect(ring.isClosed()).toBe(true);
  });

  it('supports exact and approximate equality', () => {
    const ring = new LinearRing2([new Point2(0, 0), new Point2(1, 0), new Point2(0, 0)]);
    const nearby = new LinearRing2([
      new Point2(0, 0),
      new Point2(1 + EPSILON / 2, 0),
      new Point2(0, 0),
    ]);
    expect(ring.equals(nearby)).toBe(false);
    expect(ring.approximatelyEquals(nearby)).toBe(true);
  });

  it('reverses without mutating the original sequence', () => {
    const a = new Point2(0, 0);
    const b = new Point2(1, 0);
    const c = new Point2(0, 0);
    const ring = new LinearRing2([a, b, c]);
    const reversed = ring.reversed();

    expect(reversed.points).toEqual([c, b, a]);
    expect(ring.points).toEqual([a, b, c]);
  });

  it('produces immutable JSON output', () => {
    const json = new LinearRing2([new Point2(0, 0), new Point2(1, 0), new Point2(0, 0)]).toJSON();
    expect(json.type).toBe('LinearRing2');
    expect(json.points).toHaveLength(3);
    expect(Object.isFrozen(json)).toBe(true);
    expect(Object.isFrozen(json.points)).toBe(true);
  });
});
