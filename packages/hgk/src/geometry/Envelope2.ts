import { EPSILON, Precision } from '../precision/Precision.js';
import { Point2 } from './Point2.js';

export interface Envelope2Json {
  readonly minX: number;
  readonly minY: number;
  readonly maxX: number;
  readonly maxY: number;
}

export class Envelope2 {
  public readonly minX: number;
  public readonly minY: number;
  public readonly maxX: number;
  public readonly maxY: number;

  public constructor(minX: number, minY: number, maxX: number, maxY: number) {
    this.minX = Precision.assertFinite(minX, 'Envelope2.minX');
    this.minY = Precision.assertFinite(minY, 'Envelope2.minY');
    this.maxX = Precision.assertFinite(maxX, 'Envelope2.maxX');
    this.maxY = Precision.assertFinite(maxY, 'Envelope2.maxY');

    if (this.minX > this.maxX || this.minY > this.maxY) {
      throw new RangeError('Envelope2 minimum values must not exceed maximum values.');
    }

    Object.freeze(this);
  }

  public contains(point: Point2): boolean {
    return point.x >= this.minX && point.x <= this.maxX
      && point.y >= this.minY && point.y <= this.maxY;
  }

  public intersects(other: Envelope2): boolean {
    return !(other.minX > this.maxX
      || other.maxX < this.minX
      || other.minY > this.maxY
      || other.maxY < this.minY);
  }

  public union(other: Envelope2): Envelope2 {
    return new Envelope2(
      Math.min(this.minX, other.minX),
      Math.min(this.minY, other.minY),
      Math.max(this.maxX, other.maxX),
      Math.max(this.maxY, other.maxY),
    );
  }

  public center(): Point2 {
    return new Point2(
      this.minX / 2 + this.maxX / 2,
      this.minY / 2 + this.maxY / 2,
    );
  }

  public width(): number {
    return Precision.assertFinite(this.maxX - this.minX, 'Envelope2 width');
  }

  public height(): number {
    return Precision.assertFinite(this.maxY - this.minY, 'Envelope2 height');
  }

  public equals(other: Envelope2): boolean {
    return Precision.exactEquals(this.minX, other.minX)
      && Precision.exactEquals(this.minY, other.minY)
      && Precision.exactEquals(this.maxX, other.maxX)
      && Precision.exactEquals(this.maxY, other.maxY);
  }

  public approximatelyEquals(other: Envelope2, epsilon = EPSILON): boolean {
    return Precision.equals(this.minX, other.minX, epsilon)
      && Precision.equals(this.minY, other.minY, epsilon)
      && Precision.equals(this.maxX, other.maxX, epsilon)
      && Precision.equals(this.maxY, other.maxY, epsilon);
  }

  public toJSON(): Envelope2Json {
    return Object.freeze({
      minX: this.minX,
      minY: this.minY,
      maxX: this.maxX,
      maxY: this.maxY,
    });
  }

  public toString(): string {
    return `Envelope2(${this.minX}, ${this.minY}, ${this.maxX}, ${this.maxY})`;
  }
}
