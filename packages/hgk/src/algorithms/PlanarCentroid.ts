import { GeometryCollection2, type Geometry2 } from '../geometry/GeometryCollection2.js';
import { LinearRing2 } from '../geometry/LinearRing2.js';
import { LineString2 } from '../geometry/LineString2.js';
import { MultiLineString2 } from '../geometry/MultiLineString2.js';
import { MultiPoint2 } from '../geometry/MultiPoint2.js';
import { MultiPolygon2 } from '../geometry/MultiPolygon2.js';
import { Point2 } from '../geometry/Point2.js';
import { Polygon2 } from '../geometry/Polygon2.js';
import { Segment2 } from '../geometry/Segment2.js';
import { Precision } from '../precision/Precision.js';
import { planarLinearRingArea2, planarPolygonArea2 } from './PlanarArea.js';
import { planarDistance2 } from './PlanarDistance.js';

function averagePoints(points: readonly Point2[]): Point2 | undefined {
  if (points.length === 0) return undefined;
  let x = 0;
  let y = 0;
  for (const point of points) {
    x += point.x;
    y += point.y;
    Precision.assertFinite(x, 'Planar centroid x accumulation');
    Precision.assertFinite(y, 'Planar centroid y accumulation');
  }
  return new Point2(x / points.length, y / points.length);
}

function ringPointsWithoutDuplicateClosure(ring: LinearRing2): readonly Point2[] {
  if (ring.points.length > 1 && ring.points[0].equals(ring.points[ring.points.length - 1])) {
    return ring.points.slice(0, -1);
  }
  return ring.points;
}

function lineCentroid(line: LineString2): { point: Point2; weight: number } | undefined {
  if (line.points.length === 0) return undefined;
  if (line.points.length === 1) return { point: line.points[0], weight: 0 };

  let weightedX = 0;
  let weightedY = 0;
  let weight = 0;

  for (let index = 1; index < line.points.length; index += 1) {
    const start = line.points[index - 1];
    const end = line.points[index];
    const segmentLength = planarDistance2(start, end);
    if (segmentLength === 0) continue;
    const midpointX = start.x / 2 + end.x / 2;
    const midpointY = start.y / 2 + end.y / 2;
    weightedX += midpointX * segmentLength;
    weightedY += midpointY * segmentLength;
    weight += segmentLength;
    Precision.assertFinite(weightedX, 'Planar line centroid x accumulation');
    Precision.assertFinite(weightedY, 'Planar line centroid y accumulation');
    Precision.assertFinite(weight, 'Planar line centroid weight');
  }

  if (weight === 0) {
    const fallback = averagePoints(line.points);
    return fallback ? { point: fallback, weight: 0 } : undefined;
  }

  return { point: new Point2(weightedX / weight, weightedY / weight), weight };
}

function ringCentroid(ring: LinearRing2): Point2 | undefined {
  const points = ringPointsWithoutDuplicateClosure(ring);
  if (points.length === 0) return undefined;
  if (points.length < 3) return averagePoints(points);

  let crossSum = 0;
  let xSum = 0;
  let ySum = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    const cross = current.x * next.y - next.x * current.y;
    Precision.assertFinite(cross, 'Planar ring centroid cross product');
    crossSum += cross;
    xSum += (current.x + next.x) * cross;
    ySum += (current.y + next.y) * cross;
    Precision.assertFinite(crossSum, 'Planar ring centroid cross accumulation');
    Precision.assertFinite(xSum, 'Planar ring centroid x accumulation');
    Precision.assertFinite(ySum, 'Planar ring centroid y accumulation');
  }

  if (crossSum === 0) return averagePoints(points);
  return new Point2(xSum / (3 * crossSum), ySum / (3 * crossSum));
}

function polygonCentroid(polygon: Polygon2): { point: Point2; weight: number } | undefined {
  if (polygon.rings.length === 0) return undefined;

  const outerCentroid = ringCentroid(polygon.rings[0]);
  if (!outerCentroid) return undefined;
  const outerArea = planarLinearRingArea2(polygon.rings[0]);

  let weightedX = outerCentroid.x * outerArea;
  let weightedY = outerCentroid.y * outerArea;
  let weight = outerArea;

  for (const hole of polygon.rings.slice(1)) {
    const centroid = ringCentroid(hole);
    const area = planarLinearRingArea2(hole);
    if (!centroid || area === 0) continue;
    weightedX -= centroid.x * area;
    weightedY -= centroid.y * area;
    weight -= area;
    Precision.assertFinite(weightedX, 'Planar polygon centroid x accumulation');
    Precision.assertFinite(weightedY, 'Planar polygon centroid y accumulation');
    Precision.assertFinite(weight, 'Planar polygon centroid weight');
  }

  if (weight <= 0) {
    return averagePoints(polygon.rings.flatMap((ring) => ringPointsWithoutDuplicateClosure(ring)))
      ? {
          point: averagePoints(polygon.rings.flatMap((ring) => ringPointsWithoutDuplicateClosure(ring)))!,
          weight: 0,
        }
      : undefined;
  }

  return { point: new Point2(weightedX / weight, weightedY / weight), weight };
}

export function planarCentroid2(geometry: Geometry2): Point2 | undefined {
  if (geometry instanceof Point2) return geometry;

  if (geometry instanceof Segment2) {
    return new Point2(
      geometry.start.x / 2 + geometry.end.x / 2,
      geometry.start.y / 2 + geometry.end.y / 2,
    );
  }

  if (geometry instanceof LineString2) return lineCentroid(geometry)?.point;
  if (geometry instanceof LinearRing2) return ringCentroid(geometry);
  if (geometry instanceof Polygon2) return polygonCentroid(geometry)?.point;
  if (geometry instanceof MultiPoint2) return averagePoints(geometry.points);

  if (geometry instanceof MultiLineString2) {
    const values = geometry.lines.map(lineCentroid).filter((value): value is NonNullable<typeof value> => Boolean(value));
    if (values.length === 0) return undefined;
    const positiveWeight = values.reduce((total, value) => total + value.weight, 0);
    if (positiveWeight === 0) return averagePoints(geometry.lines.flatMap((line) => line.points));
    return new Point2(
      values.reduce((total, value) => total + value.point.x * value.weight, 0) / positiveWeight,
      values.reduce((total, value) => total + value.point.y * value.weight, 0) / positiveWeight,
    );
  }

  if (geometry instanceof MultiPolygon2) {
    const values = geometry.polygons
      .map(polygonCentroid)
      .filter((value): value is NonNullable<typeof value> => Boolean(value));
    if (values.length === 0) return undefined;
    const totalArea = geometry.polygons.reduce((total, polygon) => total + planarPolygonArea2(polygon), 0);
    if (totalArea === 0) {
      return averagePoints(
        geometry.polygons.flatMap((polygon) =>
          polygon.rings.flatMap((ring) => ringPointsWithoutDuplicateClosure(ring))),
      );
    }
    return new Point2(
      values.reduce((total, value) => total + value.point.x * value.weight, 0) / totalArea,
      values.reduce((total, value) => total + value.point.y * value.weight, 0) / totalArea,
    );
  }

  if (geometry instanceof GeometryCollection2) {
    const centroids = geometry.geometries
      .map((child) => planarCentroid2(child))
      .filter((point): point is Point2 => point !== undefined);
    return averagePoints(centroids);
  }

  return undefined;
}
