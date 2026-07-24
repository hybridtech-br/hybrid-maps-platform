import type { Coordinate } from '../geometry/Coordinate.js';
import type { Geometry, GeometryCollection } from '../geometry/GeometryCollection.js';

export type GeometryValidationCode =
  | 'INVALID_LONGITUDE'
  | 'INVALID_LATITUDE'
  | 'INVALID_ALTITUDE'
  | 'INSUFFICIENT_COORDINATES'
  | 'EMPTY_GEOMETRY'
  | 'RING_NOT_CLOSED'
  | 'CONSECUTIVE_DUPLICATE_COORDINATES';

export interface GeometryValidationIssue {
  readonly code: GeometryValidationCode;
  readonly path: string;
  readonly message: string;
}

export interface GeometryValidationResult {
  readonly valid: boolean;
  readonly issues: readonly GeometryValidationIssue[];
}

function coordinatesEqual(a: Coordinate, b: Coordinate): boolean {
  return (
    a.longitude === b.longitude &&
    a.latitude === b.latitude &&
    a.altitude === b.altitude
  );
}

function validateCoordinate(
  coordinate: Coordinate,
  path: string,
  issues: GeometryValidationIssue[],
): void {
  if (!Number.isFinite(coordinate.longitude) || coordinate.longitude < -180 || coordinate.longitude > 180) {
    issues.push({
      code: 'INVALID_LONGITUDE',
      path: `${path}.longitude`,
      message: 'Longitude must be a finite number between -180 and 180.',
    });
  }

  if (!Number.isFinite(coordinate.latitude) || coordinate.latitude < -90 || coordinate.latitude > 90) {
    issues.push({
      code: 'INVALID_LATITUDE',
      path: `${path}.latitude`,
      message: 'Latitude must be a finite number between -90 and 90.',
    });
  }

  if (coordinate.altitude !== undefined && !Number.isFinite(coordinate.altitude)) {
    issues.push({
      code: 'INVALID_ALTITUDE',
      path: `${path}.altitude`,
      message: 'Altitude must be finite when provided.',
    });
  }
}

function validateCoordinateSequence(
  coordinates: readonly Coordinate[],
  path: string,
  minimumLength: number,
  issues: GeometryValidationIssue[],
): void {
  if (coordinates.length < minimumLength) {
    issues.push({
      code: 'INSUFFICIENT_COORDINATES',
      path,
      message: `Expected at least ${minimumLength} coordinates.`,
    });
  }

  coordinates.forEach((coordinate, index) => {
    validateCoordinate(coordinate, `${path}[${index}]`, issues);

    if (index > 0 && coordinatesEqual(coordinate, coordinates[index - 1])) {
      issues.push({
        code: 'CONSECUTIVE_DUPLICATE_COORDINATES',
        path: `${path}[${index}]`,
        message: 'Consecutive coordinates must not be identical.',
      });
    }
  });
}

function validateRing(
  ring: readonly Coordinate[],
  path: string,
  issues: GeometryValidationIssue[],
): void {
  validateCoordinateSequence(ring, path, 4, issues);

  if (ring.length > 0 && !coordinatesEqual(ring[0], ring[ring.length - 1])) {
    issues.push({
      code: 'RING_NOT_CLOSED',
      path,
      message: 'Polygon rings must start and end at the same coordinate.',
    });
  }
}

function validateGeometryInto(
  geometry: Geometry,
  path: string,
  issues: GeometryValidationIssue[],
): void {
  switch (geometry.type) {
    case 'Point':
      validateCoordinate(geometry.coordinate, `${path}.coordinate`, issues);
      break;
    case 'LineString':
      validateCoordinateSequence(geometry.coordinates, `${path}.coordinates`, 2, issues);
      break;
    case 'Polygon':
      if (geometry.rings.length === 0) {
        issues.push({ code: 'EMPTY_GEOMETRY', path: `${path}.rings`, message: 'Polygon requires at least one ring.' });
      }
      geometry.rings.forEach((ring, index) => validateRing(ring, `${path}.rings[${index}]`, issues));
      break;
    case 'MultiPoint':
      if (geometry.coordinates.length === 0) {
        issues.push({ code: 'EMPTY_GEOMETRY', path: `${path}.coordinates`, message: 'MultiPoint requires at least one coordinate.' });
      }
      geometry.coordinates.forEach((coordinate, index) => validateCoordinate(coordinate, `${path}.coordinates[${index}]`, issues));
      break;
    case 'MultiLineString':
      if (geometry.coordinates.length === 0) {
        issues.push({ code: 'EMPTY_GEOMETRY', path: `${path}.coordinates`, message: 'MultiLineString requires at least one line.' });
      }
      geometry.coordinates.forEach((line, index) => validateCoordinateSequence(line, `${path}.coordinates[${index}]`, 2, issues));
      break;
    case 'MultiPolygon':
      if (geometry.coordinates.length === 0) {
        issues.push({ code: 'EMPTY_GEOMETRY', path: `${path}.coordinates`, message: 'MultiPolygon requires at least one polygon.' });
      }
      geometry.coordinates.forEach((polygon, polygonIndex) => {
        if (polygon.length === 0) {
          issues.push({ code: 'EMPTY_GEOMETRY', path: `${path}.coordinates[${polygonIndex}]`, message: 'Each polygon requires at least one ring.' });
        }
        polygon.forEach((ring, ringIndex) => validateRing(ring, `${path}.coordinates[${polygonIndex}][${ringIndex}]`, issues));
      });
      break;
  }
}

export function validateGeometry(geometry: Geometry): GeometryValidationResult {
  const issues: GeometryValidationIssue[] = [];
  validateGeometryInto(geometry, 'geometry', issues);
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}

export function validateGeometryCollection(
  collection: GeometryCollection,
): GeometryValidationResult {
  const issues: GeometryValidationIssue[] = [];

  if (collection.geometries.length === 0) {
    issues.push({
      code: 'EMPTY_GEOMETRY',
      path: 'collection.geometries',
      message: 'GeometryCollection requires at least one geometry.',
    });
  }

  collection.geometries.forEach((geometry, index) =>
    validateGeometryInto(geometry, `collection.geometries[${index}]`, issues),
  );

  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues) });
}
