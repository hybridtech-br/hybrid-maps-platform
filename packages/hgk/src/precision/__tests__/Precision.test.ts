import { describe, expect, it } from 'vitest';

import { EPSILON, Precision } from '../Precision.js';

describe('Precision', () => {
  it('exposes the official epsilon', () => {
    expect(EPSILON).toBe(1e-9);
  });

  it.each([0, -0, 1, -1, Number.MIN_VALUE, Number.MAX_VALUE, Number.MAX_SAFE_INTEGER])(
    'recognizes finite value %s',
    (value) => {
      expect(Precision.isFinite(value)).toBe(true);
      expect(Precision.assertFinite(value)).toBe(value);
    },
  );

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects non-finite value %s',
    (value) => {
      expect(Precision.isFinite(value)).toBe(false);
      expect(() => Precision.assertFinite(value, 'Coordinate')).toThrowError(
        new RangeError('Coordinate must be finite.'),
      );
    },
  );

  it('treats signed zero as exactly equal', () => {
    expect(Precision.exactEquals(0, -0)).toBe(true);
  });

  it('requires finite values for exact equality', () => {
    expect(Precision.exactEquals(1, 1)).toBe(true);
    expect(Precision.exactEquals(1, 1 + Number.EPSILON)).toBe(false);
    expect(Precision.exactEquals(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(false);
    expect(Precision.exactEquals(Number.NaN, Number.NaN)).toBe(false);
  });

  it('uses inclusive epsilon comparison', () => {
    expect(Precision.equals(0, EPSILON)).toBe(true);
    expect(Precision.equals(0, EPSILON / 2)).toBe(true);
    expect(Precision.equals(0, EPSILON * 2)).toBe(false);
  });

  it('supports explicit zero tolerance', () => {
    expect(Precision.equals(1, 1, 0)).toBe(true);
    expect(Precision.equals(1, 1 + Number.EPSILON, 0)).toBe(false);
  });

  it('returns false for non-finite operands in approximate comparison', () => {
    expect(Precision.equals(Number.NaN, 1)).toBe(false);
    expect(Precision.equals(1, Number.POSITIVE_INFINITY)).toBe(false);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'rejects invalid epsilon %s',
    (epsilon) => {
      expect(() => Precision.equals(1, 1, epsilon)).toThrowError(
        new RangeError('Epsilon must be a non-negative finite number.'),
      );
    },
  );
});
