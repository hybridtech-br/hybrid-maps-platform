import { EPSILON } from '../precision/Precision.js';
import { LineString2, type LineString2Json } from './LineString2.js';

export interface MultiLineString2Json {
  readonly type: 'MultiLineString2';
  readonly lines: readonly LineString2Json[];
}

export class MultiLineString2 {
  public readonly type = 'MultiLineString2' as const;
  public readonly lines: readonly LineString2[];

  public constructor(lines: readonly LineString2[]) {
    this.lines = Object.freeze([...lines]);
    Object.freeze(this);
  }

  public isEmpty(): boolean {
    return this.lines.length === 0;
  }

  public equals(other: MultiLineString2): boolean {
    return this.lines.length === other.lines.length
      && this.lines.every((line, index) => line.equals(other.lines[index]));
  }

  public approximatelyEquals(other: MultiLineString2, epsilon = EPSILON): boolean {
    return this.lines.length === other.lines.length
      && this.lines.every((line, index) => line.approximatelyEquals(other.lines[index], epsilon));
  }

  public toJSON(): MultiLineString2Json {
    return Object.freeze({
      type: this.type,
      lines: Object.freeze(this.lines.map((line) => line.toJSON())),
    });
  }
}
