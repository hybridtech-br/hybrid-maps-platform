import { describe, expect, it } from 'vitest';

import { EPSILON } from '../../precision/Precision.js';
import { Vector2 } from '../Vector2.js';

describe('Vector2', () => {
  it('creates immutable finite vectors', () => {
    const vector = new Vector2(1, -2);
    expect(vector).toMatchObject({ x: 1, y: -2 });
    expect(Object.isFrozen(vector)).toBe(true);
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects invalid x component %s',
    (value) => {
      expect(() => new Vector2(value, 0)).toThrowError(new RangeError('Vector2.x must be finite.'));
    },
  );

  it('adds and subtracts without mutating operands', () => {
    const a = new Vector2(1, 2);
    const b = new Vector2(3, 4);
    expect(a.add(b).toJSON()).toEqual({ x: 4, y: 6 });
    expect(b.subtract(a).toJSON()).toEqual({ x: 2, y: 2 });
    expect(a.toJSON()).toEqual({ x: 1, y: 2 });
  });

  it('scales by a finite factor', () => {
    expect(new Vector2(2, -3).scale(0.5).toJSON()).toEqual({ x: 1, y: -1.5 });
    expect(() => new Vector2(1, 1).scale(Number.POSITIVE_INFINITY)).toThrowError(
      new RangeError('Vector2 scale factor must be finite.'),
    );
  });

  it('calculates dot product and magnitudes', () => {
    const vector = new Vector2(3, 4);
    expect(vector.dot(new Vector2(2, -1))).toBe(2);
    expect(vector.magnitudeSquared()).toBe(25);
    expect(vector.magnitude()).toBe(5);
  });

  it('rejects arithmetic overflow through finite result validation', () => {
    const huge = new Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
    expect(() => huge.add(huge)).toThrowError();
    expect(() => huge.dot(huge)).toThrowError(new RangeError('Vector2 dot product must be finite.'));
    expect(() => huge.magnitudeSquared()).toThrowError(
      new RangeError('Vector2 squared magnitude must be finite.'),
    );
  });

  it('supports exact and approximate equality separately', () => {
    const a = new Vector2(1, 2);
    const near = new Vector2(1 + EPSILON / 2, 2 - EPSILON / 2);
    expect(a.equals(near)).toBe(false);
    expect(a.approximatelyEquals(near)).toBe(true);
    expect(a.approximatelyEquals(near, 0)).toBe(false);
  });

  it('clones and serializes as a frozen plain object', () => {
    const vector = new Vector2(-1, 2);
    const clone = vector.clone();
    expect(clone).not.toBe(vector);
    expect(clone.equals(vector)).toBe(true);
    expect(Object.isFrozen(vector.toJSON())).toBe(true);
    expect(vector.toString()).toBe('Vector2(-1, 2)');
  });
});
