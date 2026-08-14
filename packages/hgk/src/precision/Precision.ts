export const EPSILON = 1e-9;

function validateEpsilon(epsilon: number): void {
  if (!Number.isFinite(epsilon) || epsilon < 0) {
    throw new RangeError('Epsilon must be a non-negative finite number.');
  }
}

export class Precision {
  private constructor() {}

  public static isFinite(value: number): boolean {
    return Number.isFinite(value);
  }

  public static assertFinite(value: number, name = 'Value'): number {
    if (!Number.isFinite(value)) {
      throw new RangeError(`${name} must be finite.`);
    }
    return value;
  }

  public static exactEquals(a: number, b: number): boolean {
    return Number.isFinite(a) && Number.isFinite(b) && a === b;
  }

  public static equals(a: number, b: number, epsilon = EPSILON): boolean {
    validateEpsilon(epsilon);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
    return Math.abs(a - b) <= epsilon;
  }
}
