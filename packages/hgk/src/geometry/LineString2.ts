import { EPSILON } from '../precision/Precision.js';
import { Point2, type Point2Json } from './Point2.js';

export interface LineString2Json {
  readonly type: 'LineString2';
  readonly points: readonly Point2Json[];
}

export class LineString2 {
  public readonly type = 'LineString2' as const;
  public readonly points: readonly Point2[];

  public constructor(points: readonly Point2[]) {
    this.points = Object.freeze([...points]);
    Object.freeze(this);
  }

  public isEmpty(): boolean {
    return this.points.length === 0;
  }

  public segmentCount(): number {
    return Math.max(0, this.points.length - 1);
  }

  public equals(other: LineString2): boolean {
    return this.points.length === other.points.length
      && this.points.every((point, index) => point.equals(other.points[index]));
  }

  public approximatelyEquals(other: LineString2, epsilon = EPSILON): boolean {
    return this.points.length === other.points.length
      && this.points.every((point, index) => point.approximatelyEquals(other.points[index], epsilon));
  }

  public reversed(): LineString2 {
    return new LineString2([...this.points].reverse());
  }

  public toJSON(): LineString2Json {
    return Object.freeze({
      type: this.type,
      points: Object.freeze(this.points.map((point) => point.toJSON())),
    });
  }
}
