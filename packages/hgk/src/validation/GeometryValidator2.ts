import { GeometryCollection2, type Geometry2 } from '../geometry/GeometryCollection2.js';
import { LinearRing2 } from '../geometry/LinearRing2.js';
import { LineString2 } from '../geometry/LineString2.js';
import { MultiLineString2 } from '../geometry/MultiLineString2.js';
import { MultiPoint2 } from '../geometry/MultiPoint2.js';
import { MultiPolygon2 } from '../geometry/MultiPolygon2.js';
import { Point2 } from '../geometry/Point2.js';
import { Polygon2 } from '../geometry/Polygon2.js';
import { Segment2 } from '../geometry/Segment2.js';

export type GeometryValidationCode2 =
  | 'NON_FINITE_COORDINATE'
  | 'INSUFFICIENT_COORDINATES'
  | 'EMPTY_GEOMETRY'
  | 'RING_NOT_CLOSED'
  | 'CONSECUTIVE_DUPLICATE_POINTS';

export interface GeometryValidationIssue2 {
  readonly code: GeometryValidationCode2;
  readonly path: string;
  readonly message: string;
}

export interface GeometryValidationResult2 {
  readonly valid: boolean;
  readonly issues: readonly GeometryValidationIssue2[];
}

function pushIssue(
  issues: GeometryValidationIssue2[],
  code: GeometryValidationCode2,
  path: string,
  message: string,
): void {
  issues.push(Object.freeze({ code, path, message }));
}

function validatePoint(point: Point2, path: string, issues: GeometryValidationIssue2[]): void {
  if (!Number.isFinite(point.x)) {
    pushIssue(issues, 'NON_FINITE_COORDINATE', `${path}.x`, 'Point x coordinate must be finite.');
  }
  if (!Number.isFinite(point.y)) {
    pushIssue(issues, 'NON_FINITE_COORDINATE', `${path}.y`, 'Point y coordinate must be finite.');
  }
}

function validatePointSequence(
  points: readonly Point2[],
  path: string,
  minimumLength: number,
  issues: GeometryValidationIssue2[],
): void {
  if (points.length < minimumLength) {
    pushIssue(
      issues,
      'INSUFFICIENT_COORDINATES',
      path,
      `Expected at least ${minimumLength} points.`,
    );
  }

  points.forEach((point, index) => {
    validatePoint(point, `${path}[${index}]`, issues);
    if (index > 0 && point.equals(points[index - 1])) {
      pushIssue(
        issues,
        'CONSECUTIVE_DUPLICATE_POINTS',
        `${path}[${index}]`,
        'Consecutive points must not be identical.',
      );
    }
  });
}

function validateRing(ring: LinearRing2, path: string, issues: GeometryValidationIssue2[]): void {
  validatePointSequence(ring.points, `${path}.points`, 4, issues);
  if (ring.points.length > 0 && !ring.isClosed()) {
    pushIssue(issues, 'RING_NOT_CLOSED', path, 'Linear ring must start and end at the same point.');
  }
}

function validatePolygon(polygon: Polygon2, path: string, issues: GeometryValidationIssue2[]): void {
  if (polygon.rings.length === 0) {
    pushIssue(issues, 'EMPTY_GEOMETRY', `${path}.rings`, 'Polygon requires at least one ring.');
  }
  polygon.rings.forEach((ring, index) => validateRing(ring, `${path}.rings[${index}]`, issues));
}

function validateGeometryInto(
  geometry: Geometry2,
  path: string,
  issues: GeometryValidationIssue2[],
): void {
  if (geometry instanceof Point2) {
    validatePoint(geometry, path, issues);
    return;
  }

  if (geometry instanceof Segment2) {
    validatePoint(geometry.start, `${path}.start`, issues);
    validatePoint(geometry.end, `${path}.end`, issues);
    return;
  }

  if (geometry instanceof LineString2) {
    validatePointSequence(geometry.points, `${path}.points`, 2, issues);
    return;
  }

  if (geometry instanceof LinearRing2) {
    validateRing(geometry, path, issues);
    return;
  }

  if (geometry instanceof Polygon2) {
    validatePolygon(geometry, path, issues);
    return;
  }

  if (geometry instanceof MultiPoint2) {
    if (geometry.points.length === 0) {
      pushIssue(issues, 'EMPTY_GEOMETRY', `${path}.points`, 'MultiPoint2 requires at least one point.');
    }
    geometry.points.forEach((point, index) => validatePoint(point, `${path}.points[${index}]`, issues));
    return;
  }

  if (geometry instanceof MultiLineString2) {
    if (geometry.lines.length === 0) {
      pushIssue(issues, 'EMPTY_GEOMETRY', `${path}.lines`, 'MultiLineString2 requires at least one line.');
    }
    geometry.lines.forEach((line, index) =>
      validatePointSequence(line.points, `${path}.lines[${index}].points`, 2, issues));
    return;
  }

  if (geometry instanceof MultiPolygon2) {
    if (geometry.polygons.length === 0) {
      pushIssue(issues, 'EMPTY_GEOMETRY', `${path}.polygons`, 'MultiPolygon2 requires at least one polygon.');
    }
    geometry.polygons.forEach((polygon, index) =>
      validatePolygon(polygon, `${path}.polygons[${index}]`, issues));
    return;
  }

  if (geometry instanceof GeometryCollection2) {
    if (geometry.geometries.length === 0) {
      pushIssue(
        issues,
        'EMPTY_GEOMETRY',
        `${path}.geometries`,
        'GeometryCollection2 requires at least one geometry.',
      );
    }
    geometry.geometries.forEach((child, index) =>
      validateGeometryInto(child, `${path}.geometries[${index}]`, issues));
  }
}

export function validateGeometry2(geometry: Geometry2): GeometryValidationResult2 {
  const issues: GeometryValidationIssue2[] = [];
  validateGeometryInto(geometry, 'geometry', issues);
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}
