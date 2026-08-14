import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { Envelope2 } from '../Envelope2.js';
import { Point2 } from '../Point2.js';

describe('Envelope2', () => {
  it('creates immutable ordered envelopes', () => {
    const envelope = new Envelope2(-2, -1, 4, 5);
    expect(envelope).toEqual({ minX: -2, minY: -1, maxX: 4, maxY: 5 });
    expect(Object.isFrozen(envelope)).toBe(true);
  });

  it('rejects non-finite or reversed bounds', () => {
    expect(() => new Envelope2(Number.NaN, 0, 1, 1)).toThrow(RangeError);
    expect(() => new Envelope2(2, 0, 1, 1)).toThrow(RangeError);
    expect(() => new Envelope2(0, 2, 1, 1)).toThrow(RangeError);
  });

  it('includes boundary points explicitly', () => {
    const envelope = new Envelope2(0, 0, 10, 10);
    expect(envelope.contains(new Point2(0, 0))).toBe(true);
    expect(envelope.contains(new Point2(10, 10))).toBe(true);
    expect(envelope.contains(new Point2(5, 5))).toBe(true);
    expect(envelope.contains(new Point2(10 + EPSILON, 5))).toBe(false);
  });

  it('treats touching envelopes as intersecting', () => {
    const left = new Envelope2(0, 0, 5, 5);
    const right = new Envelope2(5, 2, 10, 4);
    const separate = new Envelope2(6, 0, 10, 5);
    expect(left.intersects(right)).toBe(true);
    expect(left.intersects(separate)).toBe(false);
  });

  it('unions envelopes without mutating inputs', () => {
    const a = new Envelope2(0, 0, 2, 2);
    const b = new Envelope2(-1, 1, 4, 3);
    const union = a.union(b);
    expect(union).toEqual({ minX: -1, minY: 0, maxX: 4, maxY: 3 });
    expect(union).not.toBe(a);
    expect(union).not.toBe(b);
  });

  it('computes center, width and height', () => {
    const envelope = new Envelope2(-2, 2, 6, 8);
    expect(envelope.center()).toEqual({ x: 2, y: 5 });
    expect(envelope.width()).toBe(8);
    expect(envelope.height()).toBe(6);
  });

  it('supports degenerate point and line envelopes', () => {
    const pointEnvelope = new Envelope2(3, 4, 3, 4);
    expect(pointEnvelope.width()).toBe(0);
    expect(pointEnvelope.height()).toBe(0);
    expect(pointEnvelope.contains(new Point2(3, 4))).toBe(true);

    const lineEnvelope = new Envelope2(2, 1, 2, 9);
    expect(lineEnvelope.width()).toBe(0);
    expect(lineEnvelope.height()).toBe(8);
    expect(lineEnvelope.contains(new Point2(2, 5))).toBe(true);
  });

  it('supports exact and approximate equality', () => {
    const envelope = new Envelope2(0, 0, 1, 1);
    expect(envelope.equals(new Envelope2(0, 0, 1, 1))).toBe(true);
    expect(envelope.equals(new Envelope2(0, 0, 1 + EPSILON / 2, 1))).toBe(false);
    expect(envelope.approximatelyEquals(new Envelope2(0, 0, 1 + EPSILON / 2, 1))).toBe(true);
  });

  it('computes a finite center for very large same-sign bounds', () => {
    const max = Number.MAX_VALUE;
    const envelope = new Envelope2(max / 2, max / 2, max, max);
    expect(Number.isFinite(envelope.center().x)).toBe(true);
    expect(Number.isFinite(envelope.center().y)).toBe(true);
  });

  it('fails explicitly when derived dimensions overflow', () => {
    const envelope = new Envelope2(-Number.MAX_VALUE, 0, Number.MAX_VALUE, 1);
    expect(() => envelope.width()).toThrow(RangeError);
  });

  it('produces immutable JSON output', () => {
    const json = new Envelope2(1, 2, 3, 4).toJSON();
    expect(json).toEqual({ minX: 1, minY: 2, maxX: 3, maxY: 4 });
    expect(Object.isFrozen(json)).toBe(true);
  });
});
