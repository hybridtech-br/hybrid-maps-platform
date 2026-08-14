import { Vector2 } from '../algebra/Vector2.js';
import { EPSILON, Precision } from '../precision/Precision.js';

export interface Point2Json {
  readonly x: number;
  readonly y: number;
}

export class Point2 {
  public readonly x: number;
  public readonly y: number;

  public constructor(x: number, y: number) {
    this.x = Precision.assertFinite(x, 'Point2.x');
    this.y = Precision.assertFinite(y, 'Point2.y');
    Object.freeze(this);
  }

  public static fromVector(vector: Vector2): Point2 {
    return new Point2(vector.x, vector.y);
  }

  public toVector(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public translate(offset: Vector2): Point2 {
    return new Point2(this.x + offset.x, this.y + offset.y);
  }

  public vectorTo(other: Point2): Vector2 {
    return new Vector2(other.x - this.x, other.y - this.y);
  }

  public equals(other: Point2): boolean {
    return Precision.exactEquals(this.x, other.x) && Precision.exactEquals(this.y, other.y);
  }

  public approximatelyEquals(other: Point2, epsilon = EPSILON): boolean {
    return Precision.equals(this.x, other.x, epsilon) && Precision.equals(this.y, other.y, epsilon);
  }

  public toJSON(): Point2Json {
    return Object.freeze({ x: this.x, y: this.y });
  }

  public toString(): string {
    return `Point2(${this.x}, ${this.y})`;
  }
}
