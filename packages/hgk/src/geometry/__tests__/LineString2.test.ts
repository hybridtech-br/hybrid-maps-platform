import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { LineString2 } from '../LineString2.js';
import { Point2 } from '../Point2.js';

describe('LineString2', () => {
  it('copies and freezes the input sequence', () => {
    const points = [new Point2(0, 0), new Point2(1, 1)];
    const line = new LineString2(points);
    points.push(new Point2(2, 2));

    expect(line.points).toHaveLength(2);
    expect(Object.isFrozen(line.points)).toBe(true);
    expect(Object.isFrozen(line)).toBe(true);
  });

  it('allows empty and underspecified sequences for later structural validation', () => {
    expect(new LineString2([]).isEmpty()).toBe(true);
    expect(new LineString2([new Point2(1, 1)]).segmentCount()).toBe(0);
  });

  it('reports segment count structurally', () => {
    expect(new LineString2([
      new Point2(0, 0),
      new Point2(1, 0),
      new Point2(2, 0),
    ]).segmentCount()).toBe(2);
  });

  it('supports exact and approximate equality', () => {
    const line = new LineString2([new Point2(0, 0), new Point2(1, 1)]);
    expect(line.equals(new LineString2([new Point2(0, 0), new Point2(1, 1)]))).toBe(true);
    expect(line.equals(new LineString2([new Point2(0, 0), new Point2(1 + EPSILON / 2, 1)]))).toBe(false);
    expect(line.approximatelyEquals(
      new LineString2([new Point2(0, 0), new Point2(1 + EPSILON / 2, 1)]),
    )).toBe(true);
  });

  it('reverses without mutating the original sequence', () => {
    const a = new Point2(0, 0);
    const b = new Point2(1, 1);
    const c = new Point2(2, 2);
    const line = new LineString2([a, b, c]);
    const reversed = line.reversed();

    expect(reversed.points).toEqual([c, b, a]);
    expect(line.points).toEqual([a, b, c]);
  });

  it('produces immutable JSON output', () => {
    const json = new LineString2([new Point2(1, 2), new Point2(3, 4)]).toJSON();
    expect(json).toEqual({
      type: 'LineString2',
      points: [{ x: 1, y: 2 }, { x: 3, y: 4 }],
    });
    expect(Object.isFrozen(json)).toBe(true);
    expect(Object.isFrozen(json.points)).toBe(true);
  });
});
