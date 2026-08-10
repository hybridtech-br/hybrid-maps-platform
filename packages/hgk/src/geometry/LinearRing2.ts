import { EPSILON } from '../precision/Precision.js';
import { Point2, type Point2Json } from './Point2.js';

export interface LinearRing2Json {
  readonly type: 'LinearRing2';
  readonly points: readonly Point2Json[];
}

export class LinearRing2 {
  public readonly type = 'LinearRing2' as const;
  public readonly points: readonly Point2[];

  public constructor(points: readonly Point2[]) {
    this.points = Object.freeze([...points]);
    Object.freeze(this);
  }

  public isEmpty(): boolean {
    return this.points.length === 0;
  }

  public isClosed(): boolean {
    return this.points.length > 0 && this.points[0].equals(this.points[this.points.length - 1]);
  }

  public equals(other: LinearRing2): boolean {
    return this.points.length === other.points.length
      && this.points.every((point, index) => point.equals(other.points[index]));
  }

  public approximatelyEquals(other: LinearRing2, epsilon = EPSILON): boolean {
    return this.points.length === other.points.length
      && this.points.every((point, index) => point.approximatelyEquals(other.points[index], epsilon));
  }

  public reversed(): LinearRing2 {
    return new LinearRing2([...this.points].reverse());
  }

  public toJSON(): LinearRing2Json {
    return Object.freeze({
      type: this.type,
      points: Object.freeze(this.points.map((point) => point.toJSON())),
    });
  }
}
