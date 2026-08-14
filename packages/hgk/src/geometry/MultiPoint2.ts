import { EPSILON } from '../precision/Precision.js';
import { Point2, type Point2Json } from './Point2.js';

export interface MultiPoint2Json {
  readonly type: 'MultiPoint2';
  readonly points: readonly Point2Json[];
}

export class MultiPoint2 {
  public readonly type = 'MultiPoint2' as const;
  public readonly points: readonly Point2[];

  public constructor(points: readonly Point2[]) {
    this.points = Object.freeze([...points]);
    Object.freeze(this);
  }

  public isEmpty(): boolean {
    return this.points.length === 0;
  }

  public equals(other: MultiPoint2): boolean {
    return this.points.length === other.points.length
      && this.points.every((point, index) => point.equals(other.points[index]));
  }

  public approximatelyEquals(other: MultiPoint2, epsilon = EPSILON): boolean {
    return this.points.length === other.points.length
      && this.points.every((point, index) => point.approximatelyEquals(other.points[index], epsilon));
  }

  public toJSON(): MultiPoint2Json {
    return Object.freeze({
      type: this.type,
      points: Object.freeze(this.points.map((point) => point.toJSON())),
    });
  }
}
