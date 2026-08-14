import { EPSILON } from '../precision/Precision.js';
import { Polygon2, type Polygon2Json } from './Polygon2.js';

export interface MultiPolygon2Json {
  readonly type: 'MultiPolygon2';
  readonly polygons: readonly Polygon2Json[];
}

export class MultiPolygon2 {
  public readonly type = 'MultiPolygon2' as const;
  public readonly polygons: readonly Polygon2[];

  public constructor(polygons: readonly Polygon2[]) {
    this.polygons = Object.freeze([...polygons]);
    Object.freeze(this);
  }

  public isEmpty(): boolean {
    return this.polygons.length === 0;
  }

  public equals(other: MultiPolygon2): boolean {
    return this.polygons.length === other.polygons.length
      && this.polygons.every((polygon, index) => polygon.equals(other.polygons[index]));
  }

  public approximatelyEquals(other: MultiPolygon2, epsilon = EPSILON): boolean {
    return this.polygons.length === other.polygons.length
      && this.polygons.every((polygon, index) => polygon.approximatelyEquals(other.polygons[index], epsilon));
  }

  public toJSON(): MultiPolygon2Json {
    return Object.freeze({
      type: this.type,
      polygons: Object.freeze(this.polygons.map((polygon) => polygon.toJSON())),
    });
  }
}
