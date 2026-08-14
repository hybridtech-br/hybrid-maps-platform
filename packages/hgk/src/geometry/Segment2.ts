import { EPSILON } from '../precision/Precision.js';
import { Point2, type Point2Json } from './Point2.js';

export interface Segment2Json {
  readonly type: 'Segment2';
  readonly start: Point2Json;
  readonly end: Point2Json;
}

export class Segment2 {
  public readonly type = 'Segment2' as const;
  public readonly start: Point2;
  public readonly end: Point2;

  public constructor(start: Point2, end: Point2) {
    this.start = start;
    this.end = end;
    Object.freeze(this);
  }

  public isDegenerate(): boolean {
    return this.start.equals(this.end);
  }

  public equals(other: Segment2): boolean {
    return this.start.equals(other.start) && this.end.equals(other.end);
  }

  public approximatelyEquals(other: Segment2, epsilon = EPSILON): boolean {
    return this.start.approximatelyEquals(other.start, epsilon)
      && this.end.approximatelyEquals(other.end, epsilon);
  }

  public reversed(): Segment2 {
    return new Segment2(this.end, this.start);
  }

  public toJSON(): Segment2Json {
    return Object.freeze({
      type: this.type,
      start: this.start.toJSON(),
      end: this.end.toJSON(),
    });
  }
}
