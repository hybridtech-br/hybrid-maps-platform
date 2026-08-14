import { EPSILON, Precision } from '../precision/Precision.js';

export interface Vector2Json {
  readonly x: number;
  readonly y: number;
}

export class Vector2 {
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    this.x = Precision.assertFinite(x, 'Vector2.x');
    this.y = Precision.assertFinite(y, 'Vector2.y');
    Object.freeze(this);
  }

  public add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  public subtract(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  public scale(factor: number): Vector2 {
    Precision.assertFinite(factor, 'Vector2 scale factor');
    return new Vector2(this.x * factor, this.y * factor);
  }

  public dot(other: Vector2): number {
    return Precision.assertFinite(
      this.x * other.x + this.y * other.y,
      'Vector2 dot product',
    );
  }

  public magnitudeSquared(): number {
    return Precision.assertFinite(
      this.x * this.x + this.y * this.y,
      'Vector2 squared magnitude',
    );
  }

  public magnitude(): number {
    return Precision.assertFinite(
      Math.sqrt(this.magnitudeSquared()),
      'Vector2 magnitude',
    );
  }

  public equals(other: Vector2): boolean {
    return Precision.exactEquals(this.x, other.x) && Precision.exactEquals(this.y, other.y);
  }

  public approximatelyEquals(other: Vector2, epsilon = EPSILON): boolean {
    return Precision.equals(this.x, other.x, epsilon) && Precision.equals(this.y, other.y, epsilon);
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public toJSON(): Vector2Json {
    return Object.freeze({ x: this.x, y: this.y });
  }

  public toString(): string {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
