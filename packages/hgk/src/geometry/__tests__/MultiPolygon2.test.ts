import { describe, expect, it } from 'vitest';

import { LinearRing2 } from '../LinearRing2.js';
import { MultiPolygon2 } from '../MultiPolygon2.js';
import { Point2 } from '../Point2.js';
import { Polygon2 } from '../Polygon2.js';

function square(min: number, max: number): Polygon2 {
  const a = new Point2(min, min);
  return new Polygon2([
    new LinearRing2([
      a,
      new Point2(max, min),
      new Point2(max, max),
      new Point2(min, max),
      a,
    ]),
  ]);
}

describe('MultiPolygon2', () => {
  it('copies and freezes polygon collections', () => {
    const polygons = [square(0, 1)];
    const multi = new MultiPolygon2(polygons);
    polygons.push(square(2, 3));

    expect(multi.polygons).toHaveLength(1);
    expect(Object.isFrozen(multi.polygons)).toBe(true);
    expect(Object.isFrozen(multi)).toBe(true);
  });

  it('allows empty collections for later structural validation', () => {
    expect(new MultiPolygon2([]).isEmpty()).toBe(true);
  });

  it('supports exact equality', () => {
    expect(new MultiPolygon2([square(0, 1)]).equals(new MultiPolygon2([square(0, 1)]))).toBe(true);
    expect(new MultiPolygon2([square(0, 1)]).equals(new MultiPolygon2([square(0, 2)]))).toBe(false);
  });

  it('produces immutable JSON output', () => {
    const json = new MultiPolygon2([square(0, 1)]).toJSON();
    expect(json.type).toBe('MultiPolygon2');
    expect(json.polygons).toHaveLength(1);
    expect(Object.isFrozen(json)).toBe(true);
    expect(Object.isFrozen(json.polygons)).toBe(true);
  });
});
