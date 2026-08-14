import { describe, expect, it } from 'vitest';

import { Vector2 } from '../../algebra/Vector2.js';
import { EPSILON } from '../../precision/Precision.js';
import { Point2 } from '../Point2.js';

describe('Point2', () => {
  it('creates immutable finite coordinates', () => {
    const point = new Point2(10, -5);
    expect(point.x).toBe(10);
    expect(point.y).toBe(-5);
    expect(Object.isFrozen(point)).toBe(true);
  });

  it('rejects non-finite coordinates', () => {
    expect(() => new Point2(Number.NaN, 0)).toThrow(RangeError);
    expect(() => new Point2(0, Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it('converts to and from Vector2 without sharing mutable state', () => {
    const vector = new Vector2(3, 4);
    const point = Point2.fromVector(vector);
    expect(point).toEqual({ x: 3, y: 4 });
    expect(point.toVector()).toEqual({ x: 3, y: 4 });
    expect(point.toVector()).not.toBe(vector);
  });

  it('translates by a vector and creates a vector to another point', () => {
    const origin = new Point2(1, 2);
    const destination = origin.translate(new Vector2(3, -1));
    expect(destination).toEqual({ x: 4, y: 1 });
    expect(origin.vectorTo(destination)).toEqual({ x: 3, y: -1 });
  });

  it('supports exact and approximate equality', () => {
    const point = new Point2(1, 2);
    expect(point.equals(new Point2(1, 2))).toBe(true);
    expect(point.equals(new Point2(1 + EPSILON / 2, 2))).toBe(false);
    expect(point.approximatelyEquals(new Point2(1 + EPSILON / 2, 2))).toBe(true);
    expect(point.approximatelyEquals(new Point2(1 + EPSILON * 2, 2))).toBe(false);
  });

  it('preserves signed zero as geometrically equal', () => {
    expect(new Point2(-0, 0).equals(new Point2(0, -0))).toBe(true);
  });

  it('produces immutable JSON output', () => {
    const json = new Point2(7, 8).toJSON();
    expect(json).toEqual({ x: 7, y: 8 });
    expect(Object.isFrozen(json)).toBe(true);
  });
});
