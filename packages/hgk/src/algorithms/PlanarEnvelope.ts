import { Envelope2 } from '../geometry/Envelope2.js';
import { GeometryCollection2, type Geometry2 } from '../geometry/GeometryCollection2.js';
import { LinearRing2 } from '../geometry/LinearRing2.js';
import { LineString2 } from '../geometry/LineString2.js';
import { MultiLineString2 } from '../geometry/MultiLineString2.js';
import { MultiPoint2 } from '../geometry/MultiPoint2.js';
import { MultiPolygon2 } from '../geometry/MultiPolygon2.js';
import { Point2 } from '../geometry/Point2.js';
import { Polygon2 } from '../geometry/Polygon2.js';
import { Segment2 } from '../geometry/Segment2.js';

function collectPoints(geometry: Geometry2, points: Point2[]): void {
  if (geometry instanceof Point2) {
    points.push(geometry);
    return;
  }
  if (geometry instanceof Segment2) {
    points.push(geometry.start, geometry.end);
    return;
  }
  if (geometry instanceof LineString2 || geometry instanceof LinearRing2) {
    points.push(...geometry.points);
    return;
  }
  if (geometry instanceof Polygon2) {
    for (const ring of geometry.rings) points.push(...ring.points);
    return;
  }
  if (geometry instanceof MultiPoint2) {
    points.push(...geometry.points);
    return;
  }
  if (geometry instanceof MultiLineString2) {
    for (const line of geometry.lines) points.push(...line.points);
    return;
  }
  if (geometry instanceof MultiPolygon2) {
    for (const polygon of geometry.polygons) {
      for (const ring of polygon.rings) points.push(...ring.points);
    }
    return;
  }
  if (geometry instanceof GeometryCollection2) {
    for (const child of geometry.geometries) collectPoints(child, points);
  }
}

export function planarBoundingEnvelope2(geometry: Geometry2): Envelope2 | undefined {
  const points: Point2[] = [];
  collectPoints(geometry, points);
  if (points.length === 0) return undefined;

  let minX = points[0].x;
  let minY = points[0].y;
  let maxX = points[0].x;
  let maxY = points[0].y;

  for (const point of points.slice(1)) {
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  }

  return new Envelope2(minX, minY, maxX, maxY);
}
