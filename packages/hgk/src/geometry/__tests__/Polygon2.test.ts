import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { LinearRing2 } from '../LinearRing2.js';
import { Point2 } from '../Point2.js';
import { Polygon2 } from '../Polygon2.js';

function square(min: number, max: number): LinearRing2 {
  const a = new Point2(min, min);
  const b = new Point2(max, min);
  const c = new Point2(max, max);
  const d = new Point2(min, max);
  return new LinearRing2([a, b, c, d, a]);
}

describe('Polygon2', () => {
  it('copies and freezes ring collections', () => {
    const rings = [square(0, 10)];
    const polygon = new Polygon2(rings);
    rings.push(square(2, 3));

    expect(polygon.rings).toHaveLength(1);
    expect(Object.isFrozen(polygon.rings)).toBe(true);
    expect(Object.isFrozen(polygon)).toBe(true);
  });

  it('allows an empty polygon for later structural validation', () => {
    const polygon = new Polygon2([]);
    expect(polygon.isEmpty()).toBe(true);
    expect(polygon.outerRing()).toBeUndefined();
    expect(polygon.holes()).toEqual([]);
  });

  it('exposes outer ring and immutable holes separately', () => {
    const outer = square(0, 10);
    const hole = square(2, 4);
    const polygon = new Polygon2([outer, hole]);

    expect(polygon.outerRing()).toBe(outer);
    expect(polygon.holes()).toEqual([hole]);
    expect(Object.isFrozen(polygon.holes())).toBe(true);
  });

  it('supports exact and approximate equality', () => {
    const polygon = new Polygon2([square(0, 1)]);
    const a = new Point2(0, 0);
    const nearby = new LinearRing2([
      a,
      new Point2(1 + EPSILON / 2, 0),
      new Point2(1, 1),
      new Point2(0, 1),
      a,
    ]);

    expect(polygon.equals(new Polygon2([square(0, 1)]))).toBe(true);
    expect(polygon.equals(new Polygon2([nearby]))).toBe(false);
    expect(polygon.approximatelyEquals(new Polygon2([nearby]))).toBe(true);
  });

  it('produces immutable JSON output', () => {
    const json = new Polygon2([square(0, 1)]).toJSON();
    expect(json.type).toBe('Polygon2');
    expect(json.rings).toHaveLength(1);
    expect(Object.isFrozen(json)).toBe(true);
    expect(Object.isFrozen(json.rings)).toBe(true);
  });
});
