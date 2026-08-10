import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { GeometryCollection2 } from '../GeometryCollection2.js';
import { LineString2 } from '../LineString2.js';
import { MultiPoint2 } from '../MultiPoint2.js';
import { Point2 } from '../Point2.js';

describe('GeometryCollection2', () => {
  it('copies and freezes geometry collections', () => {
    const geometries = [new Point2(0, 0), new LineString2([new Point2(0, 0), new Point2(1, 1)])];
    const collection = new GeometryCollection2(geometries);
    geometries.push(new Point2(2, 2));

    expect(collection.geometries).toHaveLength(2);
    expect(Object.isFrozen(collection.geometries)).toBe(true);
    expect(Object.isFrozen(collection)).toBe(true);
  });

  it('allows empty and nested collections for later structural validation', () => {
    const empty = new GeometryCollection2([]);
    const nested = new GeometryCollection2([empty]);
    expect(empty.isEmpty()).toBe(true);
    expect(nested.geometries).toEqual([empty]);
  });

  it('supports exact equality across geometry kinds', () => {
    const a = new GeometryCollection2([
      new Point2(1, 2),
      new MultiPoint2([new Point2(3, 4)]),
    ]);
    const b = new GeometryCollection2([
      new Point2(1, 2),
      new MultiPoint2([new Point2(3, 4)]),
    ]);
    const different = new GeometryCollection2([
      new Point2(1, 2),
      new LineString2([new Point2(3, 4), new Point2(5, 6)]),
    ]);

    expect(a.equals(b)).toBe(true);
    expect(a.equals(different)).toBe(false);
  });

  it('supports approximate equality recursively', () => {
    const a = new GeometryCollection2([new Point2(1, 2)]);
    const b = new GeometryCollection2([new Point2(1 + EPSILON / 2, 2)]);
    expect(a.equals(b)).toBe(false);
    expect(a.approximatelyEquals(b)).toBe(true);
  });

  it('produces immutable JSON output', () => {
    const json = new GeometryCollection2([
      new Point2(1, 2),
      new MultiPoint2([new Point2(3, 4)]),
    ]).toJSON();
    expect(json.type).toBe('GeometryCollection2');
    expect(json.geometries).toHaveLength(2);
    expect(Object.isFrozen(json)).toBe(true);
    expect(Object.isFrozen(json.geometries)).toBe(true);
  });
});
