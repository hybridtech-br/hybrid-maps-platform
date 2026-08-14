import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { Point2 } from '../Point2.js';
import { Segment2 } from '../Segment2.js';

describe('Segment2', () => {
  it('creates an immutable segment', () => {
    const segment = new Segment2(new Point2(0, 0), new Point2(2, 3));
    expect(segment.type).toBe('Segment2');
    expect(segment.start).toEqual({ x: 0, y: 0 });
    expect(segment.end).toEqual({ x: 2, y: 3 });
    expect(Object.isFrozen(segment)).toBe(true);
  });

  it('supports degenerate segments explicitly', () => {
    const point = new Point2(1, 1);
    const segment = new Segment2(point, point);
    expect(segment.isDegenerate()).toBe(true);
  });

  it('detects non-degenerate segments', () => {
    const segment = new Segment2(new Point2(0, 0), new Point2(0, 1));
    expect(segment.isDegenerate()).toBe(false);
  });

  it('supports exact and approximate equality', () => {
    const segment = new Segment2(new Point2(0, 0), new Point2(1, 1));
    expect(segment.equals(new Segment2(new Point2(0, 0), new Point2(1, 1)))).toBe(true);
    expect(segment.equals(new Segment2(new Point2(0, 0), new Point2(1 + EPSILON / 2, 1)))).toBe(false);
    expect(segment.approximatelyEquals(
      new Segment2(new Point2(0, 0), new Point2(1 + EPSILON / 2, 1)),
    )).toBe(true);
  });

  it('reverses without mutating the original segment', () => {
    const start = new Point2(0, 0);
    const end = new Point2(3, 4);
    const segment = new Segment2(start, end);
    const reversed = segment.reversed();
    expect(reversed.start).toBe(end);
    expect(reversed.end).toBe(start);
    expect(segment.start).toBe(start);
    expect(segment.end).toBe(end);
  });

  it('produces immutable JSON output', () => {
    const json = new Segment2(new Point2(1, 2), new Point2(3, 4)).toJSON();
    expect(json).toEqual({
      type: 'Segment2',
      start: { x: 1, y: 2 },
      end: { x: 3, y: 4 },
    });
    expect(Object.isFrozen(json)).toBe(true);
  });
});
