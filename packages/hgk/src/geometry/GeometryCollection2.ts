import { EPSILON } from '../precision/Precision.js';
import { LineString2, type LineString2Json } from './LineString2.js';
import { MultiLineString2, type MultiLineString2Json } from './MultiLineString2.js';
import { MultiPoint2, type MultiPoint2Json } from './MultiPoint2.js';
import { MultiPolygon2, type MultiPolygon2Json } from './MultiPolygon2.js';
import { Point2, type Point2Json } from './Point2.js';
import { Polygon2, type Polygon2Json } from './Polygon2.js';

export type Geometry2 =
  | Point2
  | LineString2
  | Polygon2
  | MultiPoint2
  | MultiLineString2
  | MultiPolygon2
  | GeometryCollection2;

export type Geometry2Json =
  | Point2Json
  | LineString2Json
  | Polygon2Json
  | MultiPoint2Json
  | MultiLineString2Json
  | MultiPolygon2Json
  | GeometryCollection2Json;

export interface GeometryCollection2Json {
  readonly type: 'GeometryCollection2';
  readonly geometries: readonly Geometry2Json[];
}

function geometryEquals(a: Geometry2, b: Geometry2): boolean {
  if (a instanceof Point2 && b instanceof Point2) return a.equals(b);
  if (a instanceof LineString2 && b instanceof LineString2) return a.equals(b);
  if (a instanceof Polygon2 && b instanceof Polygon2) return a.equals(b);
  if (a instanceof MultiPoint2 && b instanceof MultiPoint2) return a.equals(b);
  if (a instanceof MultiLineString2 && b instanceof MultiLineString2) return a.equals(b);
  if (a instanceof MultiPolygon2 && b instanceof MultiPolygon2) return a.equals(b);
  if (a instanceof GeometryCollection2 && b instanceof GeometryCollection2) return a.equals(b);
  return false;
}

function geometryApproximatelyEquals(a: Geometry2, b: Geometry2, epsilon: number): boolean {
  if (a instanceof Point2 && b instanceof Point2) return a.approximatelyEquals(b, epsilon);
  if (a instanceof LineString2 && b instanceof LineString2) return a.approximatelyEquals(b, epsilon);
  if (a instanceof Polygon2 && b instanceof Polygon2) return a.approximatelyEquals(b, epsilon);
  if (a instanceof MultiPoint2 && b instanceof MultiPoint2) return a.approximatelyEquals(b, epsilon);
  if (a instanceof MultiLineString2 && b instanceof MultiLineString2) return a.approximatelyEquals(b, epsilon);
  if (a instanceof MultiPolygon2 && b instanceof MultiPolygon2) return a.approximatelyEquals(b, epsilon);
  if (a instanceof GeometryCollection2 && b instanceof GeometryCollection2) {
    return a.approximatelyEquals(b, epsilon);
  }
  return false;
}

export class GeometryCollection2 {
  public readonly type = 'GeometryCollection2' as const;
  public readonly geometries: readonly Geometry2[];

  public constructor(geometries: readonly Geometry2[]) {
    this.geometries = Object.freeze([...geometries]);
    Object.freeze(this);
  }

  public isEmpty(): boolean {
    return this.geometries.length === 0;
  }

  public equals(other: GeometryCollection2): boolean {
    return this.geometries.length === other.geometries.length
      && this.geometries.every((geometry, index) => geometryEquals(geometry, other.geometries[index]));
  }

  public approximatelyEquals(other: GeometryCollection2, epsilon = EPSILON): boolean {
    return this.geometries.length === other.geometries.length
      && this.geometries.every((geometry, index) =>
        geometryApproximatelyEquals(geometry, other.geometries[index], epsilon));
  }

  public toJSON(): GeometryCollection2Json {
    return Object.freeze({
      type: this.type,
      geometries: Object.freeze(this.geometries.map((geometry) => geometry.toJSON())),
    });
  }
}
